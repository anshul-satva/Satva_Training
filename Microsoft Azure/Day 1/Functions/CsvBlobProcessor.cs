using System.Globalization;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using OrderSystem.Models;
using OrderSystem.Services;

namespace OrderSystem.Functions;

public class CsvBlobProcessor
{
    private readonly ILogger<CsvBlobProcessor> _logger;

    public CsvBlobProcessor(ILogger<CsvBlobProcessor> logger)
    {
        _logger = logger;
    }

    [Function("CsvBlobProcessor")]
    public async Task Run(
        [BlobTrigger("orders-upload/{name}", Connection = "AzureWebJobsStorage")] Stream blobStream,
        string name)
    {
        _logger.LogInformation("CSV blob received: {Name}", name);

        var sbConn = Environment.GetEnvironmentVariable("ServiceBusConnection");
        if (string.IsNullOrWhiteSpace(sbConn))
        {
            _logger.LogError("ServiceBusConnection setting is missing");
            return;
        }

        await using var client = new ServiceBusClient(sbConn);
        ServiceBusSender sender = client.CreateSender("orders-queue");

        using var reader = new StreamReader(blobStream);
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => args.Header.Trim(),
            HeaderValidated = null,
            MissingFieldFound = null
        };
        using var csv = new CsvReader(reader, config);

        int sent = 0;
        int failed = 0;

        try
        {
            await foreach (var record in csv.GetRecordsAsync<OrderCsvRecord>())
            {
                var order = new OrderModel
                {
                    OrderId = record.OrderId,
                    CustomerName = record.CustomerName,
                    Product = record.Product,
                    Quantity = record.Quantity,
                    Price = record.Price,
                    Source = "csv",
                    ReceivedAt = DateTime.UtcNow
                };

                var errors = ValidateOrder(order);
                if (errors.Count > 0)
                {
                    failed++;
                    await LogCsvFailureAsync(order, string.Join(", ", errors));
                    continue;
                }

                string msgBody = JsonSerializer.Serialize(order);
                var message = new ServiceBusMessage(msgBody)
                {
                    ContentType = "application/json",
                    Subject = "order"
                };

                await sender.SendMessageAsync(message);
                sent++;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse CSV blob {Name}", name);
            throw;
        }

        _logger.LogInformation("CSV processed. Sent={Sent}, Failed={Failed}", sent, failed);
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

    private async Task LogCsvFailureAsync(OrderModel order, string error)
    {
        if (!TryHasSql(out _))
        {
            _logger.LogWarning("SqlConnectionString missing. Skipping CSV failure DB log.");
            return;
        }

        try
        {
            var db = new DatabaseService();
            var processed = new ProcessedOrder
            {
                OrderId = order.OrderId ?? Guid.NewGuid().ToString("N"),
                CustomerName = order.CustomerName,
                Product = order.Product,
                Quantity = order.Quantity,
                Price = order.Price,
                Source = "csv",
                ReceivedAt = order.ReceivedAt,
                IsValid = false,
                Error = error,
                ProcessedAt = DateTime.UtcNow
            };
            await db.SaveProcessedOrderAsync(processed);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to log CSV failure to database");
        }
    }

    private static bool TryHasSql(out string connString)
    {
        connString = Environment.GetEnvironmentVariable("SqlConnectionString") ?? string.Empty;
        return !string.IsNullOrWhiteSpace(connString) && !connString.Contains("<your-sql-connection-string>", StringComparison.OrdinalIgnoreCase);
    }
}
