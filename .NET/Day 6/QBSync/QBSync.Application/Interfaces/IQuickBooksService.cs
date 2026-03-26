using QBSync.Application.DTOs.QuickBooks;

namespace QBSync.Application.Interfaces;

public interface IQuickBooksService
{
    string GetAuthorizationUrl(string userId, string state);
    Task HandleCallbackAsync(string code, string realmId, string userId);
    Task DisconnectAsync(string userId, string realmId);
    Task<string> GetCompanyNameAsync(string userId, string realmId);
    Task RefreshConnectionAsync(string userId, string realmId);

    Task<List<QBAccountResponseDto>> GetAccountsAsync(string userId, string realmId);
    Task<QBAccountResponseDto> CreateAccountAsync(string userId, string realmId, CreateQBAccountDto dto);
    Task<QBAccountResponseDto> UpdateAccountAsync(string userId, string realmId, string accountId, CreateQBAccountDto dto);
    Task DeleteAccountAsync(string userId, string realmId, string accountId);

    Task<List<QBCustomerResponseDto>> GetCustomersAsync(string userId, string realmId);
    Task<QBCustomerResponseDto> CreateCustomerAsync(string userId, string realmId, CreateQBCustomerDto dto);
    Task<QBCustomerResponseDto> UpdateCustomerAsync(string userId, string realmId, string customerId, CreateQBCustomerDto dto);
    Task DeleteCustomerAsync(string userId, string realmId, string customerId);

    Task<List<QBItemResponseDto>> GetItemsAsync(string userId, string realmId);
    Task<QBItemResponseDto> CreateItemAsync(string userId, string realmId, CreateQBItemDto dto);
    Task<QBItemResponseDto> UpdateItemAsync(string userId, string realmId, string itemId, CreateQBItemDto dto);
    Task DeleteItemAsync(string userId, string realmId, string itemId);

    Task<(string qbInvoiceId, string syncToken, string? docNumber)> CreateInvoiceInQBAsync(string userId, string realmId, object invoicePayload);
    Task<string> UpdateInvoiceInQBAsync(string userId, string realmId, string qbInvoiceId, string syncToken, object invoicePayload);
    Task DeleteInvoiceInQBAsync(string userId, string realmId, string qbInvoiceId, string syncToken);
    Task<QBInvoiceSnapshotDto> GetInvoiceSnapshotAsync(string userId, string realmId, string qbInvoiceId, DateTime? fallbackDueDate);
    Task<string> GetInvoiceStatusAsync(string userId, string realmId, string qbInvoiceId, DateTime? dueDate);
}
