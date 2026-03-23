namespace QuickBooksAuth.DTOs;

public class CreateBillDto
{
    public QbRef VendorRef { get; set; } = new();

    public List<BillLineDto> Line { get; set; } = new();

    public string? DueDate { get; set; }
}

public class UpdateBillDto
{
    public string SyncToken { get; set; } = "";

    public QbRef VendorRef { get; set; } = new();

    public List<BillLineDto> Line { get; set; } = new();

    public string? DueDate { get; set; }
}

public class BillLineDto
{
    public decimal Amount { get; set; }

    public string DetailType { get; set; } = "AccountBasedExpenseLineDetail";

    public BillAccountDetailDto AccountBasedExpenseLineDetail { get; set; } = new();
}

public class BillAccountDetailDto
{
    public QbRef AccountRef { get; set; } = new();
}