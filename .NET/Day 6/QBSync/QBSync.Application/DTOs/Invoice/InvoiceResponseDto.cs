namespace QBSync.Application.DTOs.Invoice;

public class InvoiceResponseDto
{
    public int Id { get; set; }
    public string QBInvoiceId { get; set; } = string.Empty;
    public string? DocNumber { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string RealmId { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<InvoiceLineItemResponseDto> LineItems { get; set; } = new();
}

public class InvoiceLineItemResponseDto
{
    public int Id { get; set; }
    public string ItemId { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Amount { get; set; }
}