using QBSync.Domain.Entities;

namespace QBSync.Application.Interfaces.Repositories;

public interface IInvoiceRepository
{
    Task<Invoice?> GetByIdAsync(int id);
    Task<Invoice?> GetByQBInvoiceIdAsync(string qbInvoiceId);
    Task<List<Invoice>> GetByUserIdAsync(string userId);
    Task<List<Invoice>> GetByRealmIdAsync(string realmId);
    Task<Invoice> CreateAsync(Invoice invoice);
    Task UpdateAsync(Invoice invoice, IEnumerable<InvoiceLineItem>? newLineItems = null);
    Task DeleteAsync(int id);
}
