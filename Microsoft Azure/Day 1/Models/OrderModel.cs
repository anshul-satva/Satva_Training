namespace OrderSystem.Models;

public class OrderModel
{
    public string? OrderId { get; set; }
    public string? CustomerName { get; set; }
    public string? Product { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }

    public string? Source { get; set; }
    public DateTime? ReceivedAt { get; set; }

    public decimal Total => Quantity * Price;
}
