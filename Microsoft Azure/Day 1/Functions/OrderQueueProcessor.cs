using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using OrderSystem.Models;
using OrderSystem.Services;

namespace OrderSystem.Functions;

public class OrderQueueProcessor
{
    private readonly ILogger<OrderQueueProcessor> _logger;

    public OrderQueueProcessor(ILogger<OrderQueueProcessor> logger)
    {
        _logger = logger;
    }

    [Function("OrderQueueProcessor")]
    public async Task Run(
        [ServiceBusTrigger("orders-queue", Connection = "ServiceBusConnection")] string message)
    {
        _logger.LogInformation("OrderQueueProcessor received message");

        OrderModel? order;
        try
        {
            order = JsonSerializer.Deserialize<OrderModel>(message,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException ex)
        {
            _logger.LogWarning("Invalid JSON in queue message: {Msg}", ex.Message);
            return;
        }

        if (order is null)
        {
            _logger.LogWarning("Queue message payload is empty");
            return;
        }

        var errors = ValidateOrder(order);
        var processed = new ProcessedOrder
        {
            OrderId = order.OrderId ?? Guid.NewGuid().ToString("N"),
            CustomerName = order.CustomerName,
            Product = order.Product,
            Quantity = order.Quantity,
            Price = order.Price,
            Source = order.Source,
            ReceivedAt = order.ReceivedAt,
            IsValid = errors.Count == 0,
            Error = errors.Count == 0 ? null : string.Join(", ", errors),
            ProcessedAt = DateTime.UtcNow
        };

        if (!TryHasSql(out _))
        {
            _logger.LogWarning("SqlConnectionString missing. Skipping database write for OrderId {OrderId}.", processed.OrderId);
            return;
        }

        var db = new DatabaseService();
        await db.SaveProcessedOrderAsync(processed);

        if (processed.IsValid)
            _logger.LogInformation("Order {OrderId} processed", processed.OrderId);
        else
            _logger.LogWarning("Order {OrderId} failed validation: {Error}", processed.OrderId, processed.Error);
    }

    private static List<string> ValidateOrder(OrderModel order)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(order.OrderId)) errors.Add("orderId is required");
        if (string.IsNullOrWhiteSpace(order.CustomerName)) errors.Add("customerName is required");
        if (string.IsNullOrWhiteSpace(order.Product)) errors.Add("product is required");
        if (order.Quantity <= 0) errors.Add("quantity must be greater than 0");
        if (order.Price <= 0) errors.Add("price must be greater than 0");
        return errors;
    }

    private static bool TryHasSql(out string connString)
    {
        connString = Environment.GetEnvironmentVariable("SqlConnectionString") ?? string.Empty;
        return !string.IsNullOrWhiteSpace(connString) && !connString.Contains("<your-sql-connection-string>", StringComparison.OrdinalIgnoreCase);
    }
}
