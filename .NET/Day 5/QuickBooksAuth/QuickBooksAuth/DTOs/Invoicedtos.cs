namespace QuickBooksAuth.DTOs;


public class CreateInvoiceDto
{
    public QbRef CustomerRef { get; set; } = new();

    public List<InvoiceLineDto> Line { get; set; } = new();

    public string? DueDate { get; set; }

    public string? CustomerMemo { get; set; }
}


public class UpdateInvoiceDto
{
    public string SyncToken { get; set; } = "";

    public QbRef CustomerRef { get; set; } = new();

    public List<InvoiceLineDto> Line { get; set; } = new();

    public string? DueDate { get; set; }
}

public class InvoiceLineDto
{
    public decimal Amount { get; set; }

    public string DetailType { get; set; } = "SalesItemLineDetail";

    public InvoiceSalesItemDetailDto SalesItemLineDetail { get; set; } = new();
}
public class InvoiceSalesItemDetailDto
{
    public QbRef ItemRef { get; set; } = new();

    public decimal? Qty { get; set; }

    public decimal? UnitPrice { get; set; }
}