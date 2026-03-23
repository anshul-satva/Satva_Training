namespace QuickBooksAuth.DTOs;


public class CreateItemDto
{
    public string Name { get; set; } = "";

    public string Type { get; set; } = "Service";

    public decimal UnitPrice { get; set; }

    public QbRef IncomeAccountRef { get; set; } = new();

    public string? Description { get; set; }
}


public class UpdateItemDto
{
    public string SyncToken { get; set; } = "";

    public string Name { get; set; } = "";

    public string Type { get; set; } = "Service";

    public decimal UnitPrice { get; set; }

    public QbRef IncomeAccountRef { get; set; } = new();

    public string? Description { get; set; }
}