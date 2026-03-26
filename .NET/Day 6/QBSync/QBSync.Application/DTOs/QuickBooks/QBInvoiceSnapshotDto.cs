namespace QBSync.Application.DTOs.QuickBooks;

public class QBInvoiceSnapshotDto
{
    public string QBInvoiceId { get; set; } = string.Empty;
    public string? SyncToken { get; set; }
    public string? DocNumber { get; set; }
    public string? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public decimal? TotalAmount { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = "Draft";
    public List<QBInvoiceLineSnapshotDto> LineItems { get; set; } = new();
}

public class QBInvoiceLineSnapshotDto
{
    public string ItemId { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Amount { get; set; }
}
