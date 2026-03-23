using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

public class DailyReportFunction
{
    private readonly ILogger<DailyReportFunction> _logger;

    public DailyReportFunction(ILogger<DailyReportFunction> logger)
    {
        _logger = logger;
    }

    [Function("DailyReport")]
    public void Run([TimerTrigger("0 0 22 * * *", RunOnStartup = true)] TimerInfo timer)
    {
        // This runs every day at 10 PM automatically
        _logger.LogInformation("Sending daily report at: " + DateTime.UtcNow);
    }
}