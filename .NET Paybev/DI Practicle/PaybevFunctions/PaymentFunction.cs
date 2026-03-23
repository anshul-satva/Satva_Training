using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

public class PaymentFunction
{
    private readonly ILogger<PaymentFunction> _logger;

    public PaymentFunction(ILogger<PaymentFunction> logger)
    {
        _logger = logger;
    }

    [Function("ProcessPayment")]
    public void Run(
         [HttpTrigger(AuthorizationLevel.Anonymous, "post")] string message)
    {
        // This runs automatically when a message arrives in the queue
        _logger.LogInformation("Payment received: " + message);
    }
}