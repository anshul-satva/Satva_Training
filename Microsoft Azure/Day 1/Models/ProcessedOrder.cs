namespace OrderSystem.Models;

public class ProcessedOrder
{
    public string OrderId { get; set; } = "";
    public string? CustomerName { get; set; }
    public string? Product { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Source { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public bool IsValid { get; set; }
    public string? Error { get; set; }
    public DateTime ProcessedAt { get; set; }
}
