namespace QBSync.Application.DTOs.QuickBooks;

public class CreateQBItemDto
{
    public string Name { get; set; } = string.Empty;
    // Type: Service, Inventory, NonInventory
    public string Type { get; set; } = "Service";
    public decimal? UnitPrice { get; set; }
    public string? Description { get; set; }
    // Income account ref from QuickBooks
    public string? IncomeAccountId { get; set; }
}

public class QBItemResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal? UnitPrice { get; set; }
    public string? Description { get; set; }
    public bool Active { get; set; }
}