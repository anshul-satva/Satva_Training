using AutoMapper;
using QBSync.Application.DTOs.Invoice;
using QBSync.Application.Interfaces;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Entities;

namespace QBSync.Application.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IQuickBooksService _quickBooksService;
    private readonly ICompanyRepository _companyRepository;
    private readonly IMapper _mapper;

    public InvoiceService(
        IInvoiceRepository invoiceRepository,
        IQuickBooksService quickBooksService,
        ICompanyRepository companyRepository,
        IMapper mapper)
    {
        _invoiceRepository = invoiceRepository;
        _quickBooksService = quickBooksService;
        _companyRepository = companyRepository;
        _mapper = mapper;
    }

    public async Task<InvoiceResponseDto> CreateInvoiceAsync(string userId, string realmId, CreateInvoiceDto dto)
    {
        var effectiveRealmId = string.IsNullOrWhiteSpace(realmId) ? dto.RealmId : realmId;
        if (string.IsNullOrWhiteSpace(effectiveRealmId))
            throw new InvalidOperationException("RealmId is required.");

        await EnsureCompanyAccessAsync(userId, effectiveRealmId);

        var lineItems = dto.LineItems.Select((item, index) => new
        {
            LineNum = index + 1,
            Amount = item.Quantity * item.UnitPrice,
            Description = item.Description,
            DetailType = "SalesItemLineDetail",
            SalesItemLineDetail = new
            {
                ItemRef = new { value = item.ItemId, name = item.ItemName },
                Qty = item.Quantity,
                UnitPrice = item.UnitPrice
            }
        }).ToList<object>();

        var qbPayload = new
        {
            CustomerRef = new { value = dto.CustomerId },
            DueDate = dto.DueDate?.ToString("yyyy-MM-dd"),
            Line = lineItems
        };

        var (qbInvoiceId, syncToken, docNumber) = await _quickBooksService
            .CreateInvoiceInQBAsync(userId, effectiveRealmId, qbPayload);

        var total = dto.LineItems.Sum(i => i.Quantity * i.UnitPrice);

        var invoice = new Invoice
        {
            QBInvoiceId = qbInvoiceId,
            SyncToken = syncToken,
            DocNumber = docNumber,
            CustomerId = dto.CustomerId,
            CustomerName = dto.CustomerName,
            RealmId = effectiveRealmId,
            UserId = userId,
            TotalAmount = total,
            Status = "Draft",
            DueDate = dto.DueDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            LineItems = dto.LineItems.Select(i => new InvoiceLineItem
            {
                ItemId = i.ItemId,
                ItemName = i.ItemName,
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Amount = i.Quantity * i.UnitPrice
            }).ToList()
        };

        var created = await _invoiceRepository.CreateAsync(invoice);
        return MapInvoice(created);
    }

    public async Task<InvoiceResponseDto> UpdateInvoiceAsync(string userId, int invoiceId, string realmId, UpdateInvoiceDto dto)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new KeyNotFoundException("Invoice not found.");

        var effectiveRealmId = string.IsNullOrWhiteSpace(realmId) ? invoice.RealmId : realmId;
        if (!string.Equals(invoice.RealmId, effectiveRealmId, StringComparison.OrdinalIgnoreCase))
            throw new KeyNotFoundException("Invoice not found.");

        await EnsureCompanyAccessAsync(userId, effectiveRealmId);

        var lineItems = dto.LineItems.Select((item, index) => new
        {
            LineNum = index + 1,
            Amount = item.Quantity * item.UnitPrice,
            Description = item.Description,
            DetailType = "SalesItemLineDetail",
            SalesItemLineDetail = new
            {
                ItemRef = new { value = item.ItemId, name = item.ItemName },
                Qty = item.Quantity,
                UnitPrice = item.UnitPrice
            }
        }).ToList<object>();

        var qbSnapshot = await _quickBooksService.GetInvoiceSnapshotAsync(
            userId,
            effectiveRealmId,
            invoice.QBInvoiceId,
            invoice.DueDate
        );
        var latestSyncToken = string.IsNullOrWhiteSpace(qbSnapshot.SyncToken)
            ? invoice.SyncToken
            : qbSnapshot.SyncToken;

        var qbPayload = new
        {
            Id = invoice.QBInvoiceId,
            SyncToken = latestSyncToken,
            CustomerRef = new { value = dto.CustomerId },
            DueDate = dto.DueDate?.ToString("yyyy-MM-dd"),
            Line = lineItems
        };

        var newSyncToken = await _quickBooksService
            .UpdateInvoiceInQBAsync(userId, effectiveRealmId, invoice.QBInvoiceId, latestSyncToken, qbPayload);

        invoice.SyncToken = newSyncToken;
        invoice.CustomerId = dto.CustomerId;
        invoice.CustomerName = dto.CustomerName;
        invoice.DueDate = dto.DueDate;
        invoice.TotalAmount = dto.LineItems.Sum(i => i.Quantity * i.UnitPrice);
        invoice.UpdatedAt = DateTime.UtcNow;
        invoice.LineItems = dto.LineItems.Select(i => new InvoiceLineItem
        {
            ItemId = i.ItemId,
            ItemName = i.ItemName,
            Description = i.Description,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            Amount = i.Quantity * i.UnitPrice
        }).ToList();

        await _invoiceRepository.UpdateAsync(invoice, replaceLineItems: true);

        var updatedInvoice = await _invoiceRepository.GetByIdAsync(invoiceId) ?? invoice;
        return MapInvoice(updatedInvoice);
    }

    public async Task<List<InvoiceResponseDto>> SyncInvoicesByUserAsync(string userId, string realmId)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            throw new InvalidOperationException("RealmId is required.");

        await EnsureCompanyAccessAsync(userId, realmId);

        var invoices = await _invoiceRepository.GetByRealmIdAsync(realmId);
        var liveInvoices = new List<Invoice>();

        foreach (var invoice in invoices)
        {
            var stillExists = await TrySyncInvoiceFromQuickBooksAsync(userId, realmId, invoice);
            if (stillExists)
            {
                liveInvoices.Add(invoice);
            }
        }

        return liveInvoices
            .OrderByDescending(i => i.CreatedAt)
            .Select(MapInvoice)
            .ToList();
    }

    public async Task DeleteInvoiceAsync(string userId, int invoiceId, string realmId)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new KeyNotFoundException("Invoice not found.");

        var effectiveRealmId = string.IsNullOrWhiteSpace(realmId) ? invoice.RealmId : realmId;

        if (!string.Equals(invoice.RealmId, effectiveRealmId, StringComparison.OrdinalIgnoreCase))
            throw new UnauthorizedAccessException("Access denied.");

        await EnsureCompanyAccessAsync(userId, effectiveRealmId);

        await _quickBooksService.DeleteInvoiceInQBAsync(
            userId, effectiveRealmId, invoice.QBInvoiceId, invoice.SyncToken);

        await _invoiceRepository.DeleteAsync(invoiceId);
    }

    public async Task<List<InvoiceResponseDto>> GetInvoicesByUserAsync(string userId, string realmId, bool sync = true)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            throw new InvalidOperationException("RealmId is required.");

        if (sync)
        {
            return await SyncInvoicesByUserAsync(userId, realmId);
        }

        await EnsureCompanyAccessAsync(userId, realmId);
        var invoices = await _invoiceRepository.GetByRealmIdAsync(realmId);

        return invoices
            .OrderByDescending(i => i.CreatedAt)
            .Select(MapInvoice)
            .ToList();
    }

    public async Task<InvoiceResponseDto> GetInvoiceByIdAsync(string userId, int invoiceId, string realmId)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new KeyNotFoundException("Invoice not found.");

        if (!string.Equals(invoice.RealmId, realmId, StringComparison.OrdinalIgnoreCase))
            throw new KeyNotFoundException("Invoice not found.");

        await EnsureCompanyAccessAsync(userId, realmId);
        await TrySyncInvoiceFromQuickBooksAsync(userId, realmId, invoice);

        var updatedInvoice = await _invoiceRepository.GetByIdAsync(invoiceId) ?? invoice;
        return MapInvoice(updatedInvoice);
    }

    private async Task EnsureCompanyAccessAsync(string userId, string realmId)
    {
        var company = await _companyRepository.GetByUserAndRealmIdAsync(userId, realmId);
        if (company is null || !company.IsConnected)
            throw new UnauthorizedAccessException("Access denied.");
    }

    private InvoiceResponseDto MapInvoice(Invoice invoice)
    {
        return _mapper.Map<InvoiceResponseDto>(invoice);
    }

    private async Task<bool> TrySyncInvoiceFromQuickBooksAsync(string userId, string realmId, Invoice invoice)
    {
        try
        {
            var snapshot = await _quickBooksService.GetInvoiceSnapshotAsync(
                userId,
                realmId,
                invoice.QBInvoiceId,
                invoice.DueDate
            );

            invoice.SyncToken = string.IsNullOrWhiteSpace(snapshot.SyncToken)
                ? invoice.SyncToken
                : snapshot.SyncToken!;
            invoice.DocNumber = string.IsNullOrWhiteSpace(snapshot.DocNumber)
                ? invoice.DocNumber
                : snapshot.DocNumber;
            invoice.CustomerId = string.IsNullOrWhiteSpace(snapshot.CustomerId)
                ? invoice.CustomerId
                : snapshot.CustomerId!;
            invoice.CustomerName = string.IsNullOrWhiteSpace(snapshot.CustomerName)
                ? invoice.CustomerName
                : snapshot.CustomerName!;
            invoice.TotalAmount = snapshot.TotalAmount ?? invoice.TotalAmount;
            invoice.DueDate = snapshot.DueDate ?? invoice.DueDate;
            invoice.Status = string.IsNullOrWhiteSpace(snapshot.Status) ? invoice.Status : snapshot.Status;
            invoice.UpdatedAt = DateTime.UtcNow;

            if (snapshot.LineItems.Count > 0)
            {
                invoice.LineItems = snapshot.LineItems.Select(line => new InvoiceLineItem
                {
                    ItemId = line.ItemId,
                    ItemName = line.ItemName,
                    Description = line.Description,
                    Quantity = line.Quantity,
                    UnitPrice = line.UnitPrice,
                    Amount = line.Amount
                }).ToList();
            }

            await _invoiceRepository.UpdateAsync(invoice, replaceLineItems: true);
            return true;
        }
        catch (HttpRequestException ex) when (
            ex.Message.Contains("NotFound", StringComparison.OrdinalIgnoreCase) ||
            ex.Message.Contains("404", StringComparison.OrdinalIgnoreCase))
        {
            await _invoiceRepository.DeleteAsync(invoice.Id);
            return false;
        }
        catch
        {
            return true;
        }
    }
}
