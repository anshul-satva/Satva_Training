namespace QBSync.Application.DTOs.Invoice;

public class UpdateInvoiceDto
{
    public string CustomerId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public List<InvoiceLineItemDto> LineItems { get; set; } = new();
}