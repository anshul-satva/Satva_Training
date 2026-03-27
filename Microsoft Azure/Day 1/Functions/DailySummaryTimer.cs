using System.Text.Json;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using OrderSystem.Models;
using OrderSystem.Services;

namespace OrderSystem.Functions;

public class DailySummaryTimer
{
    private readonly ILogger<DailySummaryTimer> _logger;

    public DailySummaryTimer(ILogger<DailySummaryTimer> logger)
    {
        _logger = logger;
    }

    [Function("DailySummaryTimer")]
    public async Task Run([TimerTrigger("5 * * * * *")] TimerInfo timer)
    {
        var date = DateTime.UtcNow.Date;
        _logger.LogInformation("Daily summary timer triggered for {Date}", date);

        if (!TryHasSql(out _))
        {
            _logger.LogWarning("SqlConnectionString missing. Skipping daily summary generation.");
            return;
        }

        DailySummary summary;
        try
        {
            var db = new DatabaseService();
            summary = await db.GetDailySummaryAsync(date);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load summary from database");
            return;
        }

        var storage = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
        if (string.IsNullOrWhiteSpace(storage))
        {
            _logger.LogError("AzureWebJobsStorage setting is missing");
            return;
        }

        var container = new BlobContainerClient(storage, "reports");
        await container.CreateIfNotExistsAsync();

        var reportName = $"summary-{date:yyyyMMdd}.json";
        var blob = container.GetBlobClient(reportName);

        var json = JsonSerializer.Serialize(summary, new JsonSerializerOptions { WriteIndented = true });
        await blob.UploadAsync(BinaryData.FromString(json), overwrite: true);

        _logger.LogInformation("Summary report written to reports/{ReportName}", reportName);
    }

    private static bool TryHasSql(out string connString)
    {
        connString = Environment.GetEnvironmentVariable("SqlConnectionString") ?? string.Empty;
        return !string.IsNullOrWhiteSpace(connString) && !connString.Contains("<your-sql-connection-string>", StringComparison.OrdinalIgnoreCase);
    }
}
