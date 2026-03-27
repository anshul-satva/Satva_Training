namespace OrderSystem.Models;

public class DailySummary
{
    public DateTime Date { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int FailedCsvRecords { get; set; }
}
