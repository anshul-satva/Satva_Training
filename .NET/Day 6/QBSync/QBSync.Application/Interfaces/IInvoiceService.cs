using QBSync.Application.DTOs.Invoice;

namespace QBSync.Application.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceResponseDto> CreateInvoiceAsync(string userId, string realmId, CreateInvoiceDto dto);
    Task<InvoiceResponseDto> UpdateInvoiceAsync(string userId, int invoiceId, string realmId, UpdateInvoiceDto dto);
    Task<List<InvoiceResponseDto>> SyncInvoicesByUserAsync(string userId, string realmId);
    Task DeleteInvoiceAsync(string userId, int invoiceId, string realmId);
    Task<List<InvoiceResponseDto>> GetInvoicesByUserAsync(string userId, string realmId, bool sync = true);
    Task<InvoiceResponseDto> GetInvoiceByIdAsync(string userId, int invoiceId, string realmId);
}
