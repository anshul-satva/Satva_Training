using System.Net;
using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using OrderSystem.Models;

namespace OrderSystem.Functions;

public class OrderHttpReceiver
{
    private readonly ILogger<OrderHttpReceiver> _logger;

    public OrderHttpReceiver(ILogger<OrderHttpReceiver> logger)
    {
        _logger = logger;
    }

    [Function("OrderHttpReceiver")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "order")] HttpRequestData req)
    {
        _logger.LogInformation("OrderHttpReceiver triggered at {Time}", DateTime.UtcNow);

        string body = await new StreamReader(req.Body).ReadToEndAsync();
        if (string.IsNullOrWhiteSpace(body))
            return await BadRequest(req, "Empty request body");

        OrderModel? order;
        try
        {
            order = JsonSerializer.Deserialize<OrderModel>(body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (JsonException ex)
        {
            _logger.LogWarning("Invalid JSON: {Msg}", ex.Message);
            return await BadRequest(req, "Invalid JSON body");
        }

        if (order is null)
            return await BadRequest(req, "Invalid order payload");

        var errors = ValidateOrder(order);
        if (errors.Count > 0)
            return await BadRequest(req, string.Join(", ", errors));

        var sbConn = Environment.GetEnvironmentVariable("ServiceBusConnection");
        if (string.IsNullOrWhiteSpace(sbConn))
            return await ServerError(req, "ServiceBusConnection setting is missing");

        await using var client = new ServiceBusClient(sbConn);
        ServiceBusSender sender = client.CreateSender("orders-queue");

        order.Source = "http";
        order.ReceivedAt = DateTime.UtcNow;

        string msgBody = JsonSerializer.Serialize(order);
        var message = new ServiceBusMessage(msgBody)
        {
            ContentType = "application/json",
            Subject = "order"
        };

        await sender.SendMessageAsync(message);
        _logger.LogInformation("Order {OrderId} sent to Service Bus", order.OrderId);

        var response = req.CreateResponse(HttpStatusCode.Accepted);
        await response.WriteAsJsonAsync(new ApiResponse
        {
            Message = "Order accepted and queued",
            OrderId = order.OrderId
        });
        return response;
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

    private static async Task<HttpResponseData> BadRequest(HttpRequestData req, string error)
    {
        var response = req.CreateResponse(HttpStatusCode.BadRequest);
        await response.WriteAsJsonAsync(new ApiResponse { Error = error });
        return response;
    }

    private static async Task<HttpResponseData> ServerError(HttpRequestData req, string error)
    {
        var response = req.CreateResponse(HttpStatusCode.InternalServerError);
        await response.WriteAsJsonAsync(new ApiResponse { Error = error });
        return response;
    }
}
