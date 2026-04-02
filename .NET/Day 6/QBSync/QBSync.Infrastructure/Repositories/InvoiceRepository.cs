using Microsoft.EntityFrameworkCore;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Entities;
using QBSync.Infrastructure.Data;

namespace QBSync.Infrastructure.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly SqlDbContext _context;

    public InvoiceRepository(SqlDbContext context) => _context = context;

    public async Task<Invoice?> GetByIdAsync(int id) =>
        await _context.Invoices
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == id);

    public async Task<Invoice?> GetByQBInvoiceIdAsync(string qbInvoiceId) =>
        await _context.Invoices
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.QBInvoiceId == qbInvoiceId);

    public async Task<List<Invoice>> GetByUserIdAsync(string userId) =>
        await _context.Invoices
            .Include(i => i.LineItems)
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

    public async Task<List<Invoice>> GetByRealmIdAsync(string realmId) =>
        await _context.Invoices
            .Include(i => i.LineItems)
            .Where(i => i.RealmId == realmId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

    public async Task<Invoice> CreateAsync(Invoice invoice)
    {
        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();
        return invoice;
    }

    public async Task UpdateAsync(Invoice invoice, IEnumerable<InvoiceLineItem>? newLineItems = null)
    {
        var existingInvoice = await _context.Invoices
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == invoice.Id)
            ?? throw new KeyNotFoundException("Invoice not found.");

        if (!ReferenceEquals(existingInvoice, invoice))
        {
            existingInvoice.QBInvoiceId = invoice.QBInvoiceId;
            existingInvoice.SyncToken = invoice.SyncToken;
            existingInvoice.DocNumber = invoice.DocNumber;
            existingInvoice.CustomerId = invoice.CustomerId;
            existingInvoice.CustomerName = invoice.CustomerName;
            existingInvoice.RealmId = invoice.RealmId;
            existingInvoice.UserId = invoice.UserId;
            existingInvoice.TotalAmount = invoice.TotalAmount;
            existingInvoice.Status = invoice.Status;
            existingInvoice.DueDate = invoice.DueDate;
            existingInvoice.CreatedAt = invoice.CreatedAt;
            existingInvoice.UpdatedAt = invoice.UpdatedAt;
        }

        if (newLineItems != null)
        {
            _context.InvoiceLineItems.RemoveRange(existingInvoice.LineItems);
            existingInvoice.LineItems.Clear();

            foreach (var lineItem in newLineItems)
            {
                existingInvoice.LineItems.Add(lineItem);
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var invoice = await _context.Invoices.FindAsync(id);
        if (invoice != null)
        {
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
        }
    }
}
