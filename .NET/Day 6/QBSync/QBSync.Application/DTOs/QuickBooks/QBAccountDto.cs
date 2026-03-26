namespace QBSync.Application.DTOs.QuickBooks;

public class CreateQBAccountDto
{
    public string Name { get; set; } = string.Empty;
    // AccountType values: Bank, Accounts Receivable, Accounts Payable, Credit Card,
    // Equity, Expense, Income, Other Current Asset, Fixed Asset, etc.
    public string AccountType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CurrencyRef { get; set; } = "USD";
}

public class QBAccountResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty; 
    public string AccountType { get; set; } = string.Empty;
    public bool Active { get; set; }
    public decimal? CurrentBalance { get; set; }
}