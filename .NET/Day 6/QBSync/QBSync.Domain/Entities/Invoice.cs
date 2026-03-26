namespace QBSync.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }

    public string QBInvoiceId { get; set; } = string.Empty;

    public string SyncToken { get; set; } = "0";

    public string? DocNumber { get; set; }

    public string CustomerId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;

    public string RealmId { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = "Draft";

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<InvoiceLineItem> LineItems { get; set; } = new();
}