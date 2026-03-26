using QBSync.Application.DTOs.QuickBooks;
using QBSync.Application.Interfaces;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Constants;
using QBSync.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace QBSync.Application.Services;

public class QuickBooksService : IQuickBooksService
{
    private readonly ITokenRepository _tokenRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUri;
    private readonly bool _isSandbox;
    private readonly string _baseUrl;

    public QuickBooksService(
        ITokenRepository tokenRepository,
        ICompanyRepository companyRepository,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _tokenRepository = tokenRepository;
        _companyRepository = companyRepository;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;

        _clientId = configuration["QuickBooks:ClientId"]!;
        _clientSecret = configuration["QuickBooks:ClientSecret"]!;
        _redirectUri = configuration["QuickBooks:RedirectUri"]!;
        _isSandbox = configuration.GetValue<bool>("QuickBooks:IsSandbox", true);
        _baseUrl = _isSandbox
            ? AppConstants.QBEndpoints.SandboxBaseUrl
            : AppConstants.QBEndpoints.ProductionBaseUrl;
    }


    public string GetAuthorizationUrl(string userId, string state)
    {
        var scope = Uri.EscapeDataString(AppConstants.QBScopes.Accounting);

        var rawState = $"{state}|{userId}";
        var encodedState = Convert.ToBase64String(
                Encoding.UTF8.GetBytes(rawState))
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');

        Console.WriteLine($"[GetAuthorizationUrl] userId={userId}");
        Console.WriteLine($"[GetAuthorizationUrl] rawState={rawState}");
        Console.WriteLine($"[GetAuthorizationUrl] encodedState={encodedState}");

        var url = $"{AppConstants.QBEndpoints.AuthorizeUrl}?client_id={_clientId}" +
                  $"&response_type=code&scope={scope}" +
                  $"&redirect_uri={Uri.EscapeDataString(_redirectUri)}" +
                  $"&state={encodedState}";

        Console.WriteLine($"[GetAuthorizationUrl] url={url}");
        return url;
    }

    public async Task HandleCallbackAsync(string code, string realmId, string userId)
    {
        var tokenData = await ExchangeCodeForTokensAsync(code);

        var accessToken = tokenData.GetProperty("access_token").GetString()!;
        var refreshToken = tokenData.GetProperty("refresh_token").GetString()!;
        var expiresIn = tokenData.GetProperty("expires_in").GetInt32();
        var refreshExpiresIn = tokenData.GetProperty("x_refresh_token_expires_in").GetInt32();

        // Save tokens
        var token = new QBToken
        {
            UserId = userId,
            RealmId = realmId,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn),
            RefreshTokenExpiry = DateTime.UtcNow.AddSeconds(refreshExpiresIn),
            IsActive = true,
            UpdatedAt = DateTime.UtcNow
        };
        await _tokenRepository.UpsertAsync(token);

        // Get and save company info
        var companyName = await GetCompanyNameAsync(userId, realmId);
        var existing = await _companyRepository.GetByUserAndRealmIdAsync(userId, realmId);
        if (existing == null)
        {
            await _companyRepository.CreateAsync(new Company
            {
                RealmId = realmId,
                CompanyName = companyName,
                UserId = userId,
                IsConnected = true,
                ConnectedAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.CompanyName = companyName;
            existing.IsConnected = true;
            existing.DisconnectedAt = null;
            existing.ConnectedAt = DateTime.UtcNow;
            await _companyRepository.UpdateAsync(existing);
        }
    }

    public async Task DisconnectAsync(string userId, string realmId)
    {
        var token = await _tokenRepository.GetActiveTokenAsync(userId, realmId);
        if (token != null)
        {

            try
            {
                var httpClient = CreateAuthenticatedClient();
                var body = new StringContent(
                    JsonSerializer.Serialize(new { token = token.RefreshToken }),
                    Encoding.UTF8, "application/json");
                await httpClient.PostAsync(AppConstants.QBEndpoints.RevokeUrl, body);
            }
            catch {  }

            await _tokenRepository.DeactivateAsync(userId, realmId);
        }
        await _companyRepository.DisconnectAsync(realmId, userId);
    }


    public async Task<List<QBAccountResponseDto>> GetAccountsAsync(string userId, string realmId)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var response = await client.GetAsync($"{_baseUrl}/{realmId}/query?query=select * from Account&minorversion=65");
        var json = await ReadAndValidateResponse(response);

        var accounts = new List<QBAccountResponseDto>();
        if (json.TryGetProperty("QueryResponse", out var qr) && qr.TryGetProperty("Account", out var list))
        {
            foreach (var a in list.EnumerateArray())
            {
                accounts.Add(new QBAccountResponseDto
                {
                    Id = a.GetProperty("Id").GetString()!,
                    Name = a.GetProperty("Name").GetString()!,
                    AccountType = a.GetProperty("AccountType").GetString()!,
                    Active = a.TryGetProperty("Active", out var active) && active.GetBoolean(),
                    CurrentBalance = a.TryGetProperty("CurrentBalance", out var bal) ? (decimal?)bal.GetDecimal() : null
                });
            }
        }
        return accounts;
    }

    public async Task<QBAccountResponseDto> CreateAccountAsync(string userId, string realmId, CreateQBAccountDto dto)
    {
        var payload = new
        {
            Name = dto.Name,
            AccountType = dto.AccountType,
            Description = dto.Description,
            CurrencyRef = new { value = dto.CurrencyRef ?? "USD" }
        };

        var client = await GetQBClientAsync(userId, realmId);
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/account?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);

        var a = json.GetProperty("Account");
        return new QBAccountResponseDto
        {
            Id = a.GetProperty("Id").GetString()!,
            Name = a.GetProperty("Name").GetString()!,
            AccountType = a.GetProperty("AccountType").GetString()!,
            Active = true
        };
    }

    public async Task<QBAccountResponseDto> UpdateAccountAsync(string userId, string realmId, string accountId, CreateQBAccountDto dto)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var readResp = await client.GetAsync($"{_baseUrl}/{realmId}/account/{accountId}?minorversion=65");
        var readJson = await ReadAndValidateResponse(readResp);
        var syncToken = readJson.GetProperty("Account").GetProperty("SyncToken").GetString()!;

        var payload = new
        {
            Id = accountId,
            SyncToken = syncToken,
            Name = dto.Name,
            AccountType = dto.AccountType,
            Description = dto.Description
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/account?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);

        var a = json.GetProperty("Account");
        return new QBAccountResponseDto
        {
            Id = a.GetProperty("Id").GetString()!,
            Name = a.GetProperty("Name").GetString()!,
            AccountType = a.GetProperty("AccountType").GetString()!,
            Active = true
        };
    }

    public async Task DeleteAccountAsync(string userId, string realmId, string accountId)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var readResp = await client.GetAsync($"{_baseUrl}/{realmId}/account/{accountId}?minorversion=65");
        var readJson = await ReadAndValidateResponse(readResp);
        var syncToken = readJson.GetProperty("Account").GetProperty("SyncToken").GetString()!;

        var payload = new { Id = accountId, SyncToken = syncToken, Active = false };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        await client.PostAsync($"{_baseUrl}/{realmId}/account?minorversion=65", content);
    }


    public async Task<List<QBCustomerResponseDto>> GetCustomersAsync(string userId, string realmId)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var response = await client.GetAsync($"{_baseUrl}/{realmId}/query?query=select * from Customer&minorversion=65");
        var json = await ReadAndValidateResponse(response);

        var customers = new List<QBCustomerResponseDto>();
        if (json.TryGetProperty("QueryResponse", out var qr) && qr.TryGetProperty("Customer", out var list))
        {
            foreach (var c in list.EnumerateArray())
            {
                customers.Add(new QBCustomerResponseDto
                {
                    Id = c.GetProperty("Id").GetString()!,
                    DisplayName = c.GetProperty("DisplayName").GetString()!,
                    Email = c.TryGetProperty("PrimaryEmailAddr", out var em)
                        ? em.GetProperty("Address").GetString() : null,
                    Phone = c.TryGetProperty("PrimaryPhone", out var ph)
                        ? ph.GetProperty("FreeFormNumber").GetString() : null,
                    CompanyName = c.TryGetProperty("CompanyName", out var cn) ? cn.GetString() : null,
                    Active = c.TryGetProperty("Active", out var active) && active.GetBoolean(),
                    Balance = c.TryGetProperty("Balance", out var bal) ? (decimal?)bal.GetDecimal() : null
                });
            }
        }
        return customers;
    }

    public async Task<QBCustomerResponseDto> CreateCustomerAsync(string userId, string realmId, CreateQBCustomerDto dto)
    {
        var payload = new
        {
            DisplayName = dto.DisplayName,
            GivenName = dto.FirstName,
            FamilyName = dto.LastName,
            CompanyName = dto.CompanyName,
            PrimaryEmailAddr = dto.Email != null ? new { Address = dto.Email } : null,
            PrimaryPhone = dto.Phone != null ? new { FreeFormNumber = dto.Phone } : null
        };

        var client = await GetQBClientAsync(userId, realmId);
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/customer?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);

        var c = json.GetProperty("Customer");
        return new QBCustomerResponseDto
        {
            Id = c.GetProperty("Id").GetString()!,
            DisplayName = c.GetProperty("DisplayName").GetString()!,
            Active = true
        };
    }

    public async Task<QBCustomerResponseDto> UpdateCustomerAsync(string userId, string realmId, string customerId, CreateQBCustomerDto dto)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var readResp = await client.GetAsync($"{_baseUrl}/{realmId}/customer/{customerId}?minorversion=65");
        var readJson = await ReadAndValidateResponse(readResp);
        var syncToken = readJson.GetProperty("Customer").GetProperty("SyncToken").GetString()!;

        var payload = new
        {
            Id = customerId,
            SyncToken = syncToken,
            DisplayName = dto.DisplayName,
            GivenName = dto.FirstName,
            FamilyName = dto.LastName,
            CompanyName = dto.CompanyName,
            PrimaryEmailAddr = dto.Email != null ? new { Address = dto.Email } : null,
            PrimaryPhone = dto.Phone != null ? new { FreeFormNumber = dto.Phone } : null
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/customer?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);
        var c = json.GetProperty("Customer");

        return new QBCustomerResponseDto
        {
            Id = c.GetProperty("Id").GetString()!,
            DisplayName = c.GetProperty("DisplayName").GetString()!,
            Active = true
        };
    }

    public async Task DeleteCustomerAsync(string userId, string realmId, string customerId)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var readResp = await client.GetAsync($"{_baseUrl}/{realmId}/customer/{customerId}?minorversion=65");
        var readJson = await ReadAndValidateResponse(readResp);
        var syncToken = readJson.GetProperty("Customer").GetProperty("SyncToken").GetString()!;

        var payload = new { Id = customerId, SyncToken = syncToken, Active = false };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        await client.PostAsync($"{_baseUrl}/{realmId}/customer?minorversion=65", content);
    }


    public async Task<List<QBItemResponseDto>> GetItemsAsync(string userId, string realmId)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var response = await client.GetAsync($"{_baseUrl}/{realmId}/query?query=select * from Item&minorversion=65");
        var json = await ReadAndValidateResponse(response);

        var items = new List<QBItemResponseDto>();
        if (json.TryGetProperty("QueryResponse", out var qr) && qr.TryGetProperty("Item", out var list))
        {
            foreach (var item in list.EnumerateArray())
            {
                items.Add(new QBItemResponseDto
                {
                    Id = item.GetProperty("Id").GetString()!,
                    Name = item.GetProperty("Name").GetString()!,
                    Type = item.GetProperty("Type").GetString()!,
                    UnitPrice = item.TryGetProperty("UnitPrice", out var up) ? (decimal?)up.GetDecimal() : null,
                    Description = item.TryGetProperty("Description", out var desc) ? desc.GetString() : null,
                    Active = item.TryGetProperty("Active", out var active) && active.GetBoolean()
                });
            }
        }
        return items;
    }

    public async Task<QBItemResponseDto> CreateItemAsync(string userId, string realmId, CreateQBItemDto dto)
    {
        var payload = new
        {
            Name = dto.Name,
            Type = dto.Type,
            UnitPrice = dto.UnitPrice,
            Description = dto.Description,
            IncomeAccountRef = dto.IncomeAccountId != null ? new { value = dto.IncomeAccountId } : null
        };

        var client = await GetQBClientAsync(userId, realmId);
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/item?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);

        var i = json.GetProperty("Item");
        return new QBItemResponseDto
        {
            Id = i.GetProperty("Id").GetString()!,
            Name = i.GetProperty("Name").GetString()!,
            Type = i.GetProperty("Type").GetString()!,
            UnitPrice = i.TryGetProperty("UnitPrice", out var up) ? (decimal?)up.GetDecimal() : null,
            Active = true
        };
    }

    public async Task<QBItemResponseDto> UpdateItemAsync(string userId, string realmId, string itemId, CreateQBItemDto dto)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var readResp = await client.GetAsync($"{_baseUrl}/{realmId}/item/{itemId}?minorversion=65");
        var readJson = await ReadAndValidateResponse(readResp);
        var syncToken = readJson.GetProperty("Item").GetProperty("SyncToken").GetString()!;

        var payload = new
        {
            Id = itemId,
            SyncToken = syncToken,
            Name = dto.Name,
            Type = dto.Type,
            UnitPrice = dto.UnitPrice,
            Description = dto.Description,
            IncomeAccountRef = dto.IncomeAccountId != null ? new { value = dto.IncomeAccountId } : null
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/item?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);
        var i = json.GetProperty("Item");

        return new QBItemResponseDto
        {
            Id = i.GetProperty("Id").GetString()!,
            Name = i.GetProperty("Name").GetString()!,
            Type = i.GetProperty("Type").GetString()!,
            Active = true
        };
    }

    public async Task DeleteItemAsync(string userId, string realmId, string itemId)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var readResp = await client.GetAsync($"{_baseUrl}/{realmId}/item/{itemId}?minorversion=65");
        var readJson = await ReadAndValidateResponse(readResp);
        var syncToken = readJson.GetProperty("Item").GetProperty("SyncToken").GetString()!;

        var payload = new { Id = itemId, SyncToken = syncToken, Active = false };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        await client.PostAsync($"{_baseUrl}/{realmId}/item?minorversion=65", content);
    }


    public async Task<(string qbInvoiceId, string syncToken, string? docNumber)> CreateInvoiceInQBAsync(
        string userId, string realmId, object invoicePayload)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var content = new StringContent(JsonSerializer.Serialize(invoicePayload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/invoice?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);

        var inv = json.GetProperty("Invoice");
        var qbId = inv.GetProperty("Id").GetString()!;
        var syncToken = inv.GetProperty("SyncToken").GetString()!;
        var docNumber = inv.TryGetProperty("DocNumber", out var dn) ? dn.GetString() : null;

        return (qbId, syncToken, docNumber);
    }

    public async Task<string> UpdateInvoiceInQBAsync(
        string userId, string realmId, string qbInvoiceId, string syncToken, object invoicePayload)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var content = new StringContent(JsonSerializer.Serialize(invoicePayload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{_baseUrl}/{realmId}/invoice?minorversion=65", content);
        var json = await ReadAndValidateResponse(response);
        return json.GetProperty("Invoice").GetProperty("SyncToken").GetString()!;
    }

    public async Task DeleteInvoiceInQBAsync(string userId, string realmId, string qbInvoiceId, string syncToken)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var payload = new { Id = qbInvoiceId, SyncToken = syncToken };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        await client.PostAsync($"{_baseUrl}/{realmId}/invoice?operation=delete&minorversion=65", content);
    }
    
    public async Task<QBInvoiceSnapshotDto> GetInvoiceSnapshotAsync(string userId, string realmId, string qbInvoiceId, DateTime? fallbackDueDate)
    {
        var client = await GetQBClientAsync(userId, realmId);
        var response = await client.GetAsync($"{_baseUrl}/{realmId}/invoice/{qbInvoiceId}?minorversion=65");
        var json = await ReadAndValidateResponse(response);
        var invoice = json.GetProperty("Invoice");

        var customerRef = invoice.TryGetProperty("CustomerRef", out var customerRefProp)
            ? customerRefProp
            : default;
        var customerId = customerRef.ValueKind == JsonValueKind.Object && customerRef.TryGetProperty("value", out var customerIdProp)
            ? customerIdProp.GetString()
            : null;
        var customerName = customerRef.ValueKind == JsonValueKind.Object && customerRef.TryGetProperty("name", out var customerNameProp)
            ? customerNameProp.GetString()
            : null;

        DateTime? dueDate = fallbackDueDate;
        if (invoice.TryGetProperty("DueDate", out var dueDateProp) && dueDateProp.ValueKind == JsonValueKind.String)
        {
            if (DateTime.TryParse(dueDateProp.GetString(), out var parsedDueDate))
            {
                dueDate = parsedDueDate;
            }
        }

        var balance = invoice.TryGetProperty("Balance", out var balanceProp) ? balanceProp.GetDecimal() : 0m;
        var emailStatus = invoice.TryGetProperty("EmailStatus", out var emailStatusProp)
            ? emailStatusProp.GetString()
            : null;
        var lineItems = new List<QBInvoiceLineSnapshotDto>();

        if (invoice.TryGetProperty("Line", out var lineProp) && lineProp.ValueKind == JsonValueKind.Array)
        {
            foreach (var line in lineProp.EnumerateArray())
            {
                if (!line.TryGetProperty("SalesItemLineDetail", out var salesItemDetail) || salesItemDetail.ValueKind != JsonValueKind.Object)
                {
                    continue;
                }

                var itemId = salesItemDetail.TryGetProperty("ItemRef", out var itemRef) && itemRef.TryGetProperty("value", out var itemIdProp)
                    ? itemIdProp.GetString() ?? string.Empty
                    : string.Empty;

                var itemName = salesItemDetail.TryGetProperty("ItemRef", out var itemRefName) && itemRefName.TryGetProperty("name", out var itemNameProp)
                    ? itemNameProp.GetString() ?? string.Empty
                    : string.Empty;

                var quantity = salesItemDetail.TryGetProperty("Qty", out var qtyProp) ? qtyProp.GetDecimal() : 0m;
                var unitPrice = salesItemDetail.TryGetProperty("UnitPrice", out var unitPriceProp) ? unitPriceProp.GetDecimal() : 0m;
                var amount = line.TryGetProperty("Amount", out var amountProp) ? amountProp.GetDecimal() : quantity * unitPrice;
                var description = line.TryGetProperty("Description", out var descriptionProp) ? descriptionProp.GetString() : null;

                lineItems.Add(new QBInvoiceLineSnapshotDto
                {
                    ItemId = itemId,
                    ItemName = itemName,
                    Description = description,
                    Quantity = quantity,
                    UnitPrice = unitPrice,
                    Amount = amount
                });
            }
        }

        var status = "Draft";
        if (balance <= 0)
            status = "Paid";
        else if (dueDate.HasValue && dueDate.Value.Date < DateTime.UtcNow.Date)
            status = "Overdue";
        else if (!string.IsNullOrWhiteSpace(emailStatus) && !string.Equals(emailStatus, "NotSet", StringComparison.OrdinalIgnoreCase))
            status = "Sent";

        return new QBInvoiceSnapshotDto
        {
            QBInvoiceId = invoice.TryGetProperty("Id", out var idProp) ? idProp.GetString() ?? qbInvoiceId : qbInvoiceId,
            SyncToken = invoice.TryGetProperty("SyncToken", out var snapshotSyncTokenProp) ? snapshotSyncTokenProp.GetString() : null,
            DocNumber = invoice.TryGetProperty("DocNumber", out var docNumberProp) ? docNumberProp.GetString() : null,
            CustomerId = customerId,
            CustomerName = customerName,
            TotalAmount = invoice.TryGetProperty("TotalAmt", out var totalAmtProp) ? totalAmtProp.GetDecimal() : null,
            DueDate = dueDate,
            Status = status,
            LineItems = lineItems
        };
    }
    public async Task<string> GetInvoiceStatusAsync(string userId, string realmId, string qbInvoiceId, DateTime? dueDate)
    {
        var snapshot = await GetInvoiceSnapshotAsync(userId, realmId, qbInvoiceId, dueDate);
        return snapshot.Status;
    }

    public async Task RefreshConnectionAsync(string userId, string realmId)
    {
        var token = await _tokenRepository.GetActiveTokenAsync(userId, realmId)
            ?? throw new UnauthorizedAccessException("No active QuickBooks connection found. Please reconnect.");

        await RefreshAccessTokenAsync(token);
    }


    public async Task<string> GetCompanyNameAsync(string userId, string realmId)
    {
        try
        {
            var client = await GetQBClientAsync(userId, realmId);
            var response = await client.GetAsync($"{_baseUrl}/{realmId}/companyinfo/{realmId}?minorversion=65");
            var json = await ReadAndValidateResponse(response);
            return json.GetProperty("CompanyInfo").GetProperty("CompanyName").GetString() ?? "Unknown Company";
        }
        catch { return "Unknown Company"; }
    }

    private async Task<HttpClient> GetQBClientAsync(string userId, string realmId)
    {
        var token = await _tokenRepository.GetActiveTokenAsync(userId, realmId)
            ?? throw new UnauthorizedAccessException("No active QuickBooks connection found. Please reconnect.");

        if (token.AccessTokenExpiry <= DateTime.UtcNow.AddMinutes(5))
        {
            token = await RefreshAccessTokenAsync(token);
        }

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return client;
    }

    private async Task<QBToken> RefreshAccessTokenAsync(QBToken token)
    {
        var httpClient = CreateAuthenticatedClient();

        var request = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "refresh_token"),
            new KeyValuePair<string, string>("refresh_token", token.RefreshToken)
        });

        var response = await httpClient.PostAsync(AppConstants.QBEndpoints.TokenUrl, request);
        var json = await ReadAndValidateResponse(response);

        token.AccessToken = json.GetProperty("access_token").GetString()!;
        token.RefreshToken = json.GetProperty("refresh_token").GetString()!;
        token.AccessTokenExpiry = DateTime.UtcNow.AddSeconds(json.GetProperty("expires_in").GetInt32());
        token.RefreshTokenExpiry = DateTime.UtcNow.AddSeconds(json.GetProperty("x_refresh_token_expires_in").GetInt32());
        token.UpdatedAt = DateTime.UtcNow;

        await _tokenRepository.UpsertAsync(token);
        return token;
    }

    private HttpClient CreateAuthenticatedClient()
    {
        var client = _httpClientFactory.CreateClient();
        var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return client;
    }

    private async Task<JsonElement> ExchangeCodeForTokensAsync(string code)
    {
        var httpClient = CreateAuthenticatedClient();
        var request = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("redirect_uri", _redirectUri)
        });

        var response = await httpClient.PostAsync(AppConstants.QBEndpoints.TokenUrl, request);
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }

    private async Task<JsonElement> ReadAndValidateResponse(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException($"QuickBooks API error {response.StatusCode}: {content}");
        return JsonSerializer.Deserialize<JsonElement>(content);
    }
}










