namespace OrderSystem.Models;

public class OrderCsvRecord
{
    public string? OrderId { get; set; }
    public string? CustomerName { get; set; }
    public string? Product { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
