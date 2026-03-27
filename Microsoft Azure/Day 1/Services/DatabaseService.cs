using System.Data;
using Microsoft.Data.SqlClient;
using OrderSystem.Models;

namespace OrderSystem.Services;

public class DatabaseService
{
    private static string GetConnectionString()
    {
        var cs = Environment.GetEnvironmentVariable("SqlConnectionString");
        if (string.IsNullOrWhiteSpace(cs))
            throw new InvalidOperationException("SqlConnectionString setting is missing.");
        return cs;
    }

    private static async Task EnsureTableAsync(SqlConnection conn)
    {
        const string sql = @"
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE name = 'ProcessedOrders' AND type = 'U')
BEGIN
    CREATE TABLE ProcessedOrders (
        OrderId NVARCHAR(64) NOT NULL PRIMARY KEY,
        CustomerName NVARCHAR(200) NULL,
        Product NVARCHAR(200) NULL,
        Quantity INT NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        Source NVARCHAR(32) NULL,
        ReceivedAt DATETIME2 NULL,
        IsValid BIT NOT NULL,
        Error NVARCHAR(4000) NULL,
        ProcessedAt DATETIME2 NOT NULL
    );
END
";
        using var cmd = new SqlCommand(sql, conn);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task SaveProcessedOrderAsync(ProcessedOrder order)
    {
        await using var conn = new SqlConnection(GetConnectionString());
        await conn.OpenAsync();
        await EnsureTableAsync(conn);

        const string sql = @"
MERGE ProcessedOrders AS target
USING (SELECT @OrderId AS OrderId) AS source
ON target.OrderId = source.OrderId
WHEN MATCHED THEN
    UPDATE SET
        CustomerName = @CustomerName,
        Product = @Product,
        Quantity = @Quantity,
        Price = @Price,
        Source = @Source,
        ReceivedAt = @ReceivedAt,
        IsValid = @IsValid,
        Error = @Error,
        ProcessedAt = @ProcessedAt
WHEN NOT MATCHED THEN
    INSERT (OrderId, CustomerName, Product, Quantity, Price, Source, ReceivedAt, IsValid, Error, ProcessedAt)
    VALUES (@OrderId, @CustomerName, @Product, @Quantity, @Price, @Source, @ReceivedAt, @IsValid, @Error, @ProcessedAt);
";

        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.Add(new SqlParameter("@OrderId", SqlDbType.NVarChar, 64) { Value = order.OrderId });
        cmd.Parameters.Add(new SqlParameter("@CustomerName", SqlDbType.NVarChar, 200) { Value = (object?)order.CustomerName ?? DBNull.Value });
        cmd.Parameters.Add(new SqlParameter("@Product", SqlDbType.NVarChar, 200) { Value = (object?)order.Product ?? DBNull.Value });
        cmd.Parameters.Add(new SqlParameter("@Quantity", SqlDbType.Int) { Value = order.Quantity });
        cmd.Parameters.Add(new SqlParameter("@Price", SqlDbType.Decimal) { Value = order.Price });
        cmd.Parameters.Add(new SqlParameter("@Source", SqlDbType.NVarChar, 32) { Value = (object?)order.Source ?? DBNull.Value });
        cmd.Parameters.Add(new SqlParameter("@ReceivedAt", SqlDbType.DateTime2) { Value = (object?)order.ReceivedAt ?? DBNull.Value });
        cmd.Parameters.Add(new SqlParameter("@IsValid", SqlDbType.Bit) { Value = order.IsValid });
        cmd.Parameters.Add(new SqlParameter("@Error", SqlDbType.NVarChar, 4000) { Value = (object?)order.Error ?? DBNull.Value });
        cmd.Parameters.Add(new SqlParameter("@ProcessedAt", SqlDbType.DateTime2) { Value = order.ProcessedAt });
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<DailySummary> GetDailySummaryAsync(DateTime dateUtc)
    {
        var start = dateUtc.Date;
        var end = start.AddDays(1);

        await using var conn = new SqlConnection(GetConnectionString());
        await conn.OpenAsync();
        await EnsureTableAsync(conn);

        const string sql = @"
SELECT
    COUNT(1) AS TotalOrders,
    ISNULL(SUM(CASE WHEN IsValid = 1 THEN Quantity * Price ELSE 0 END), 0) AS TotalRevenue,
    ISNULL(SUM(CASE WHEN IsValid = 0 AND Source = 'csv' THEN 1 ELSE 0 END), 0) AS FailedCsvRecords
FROM ProcessedOrders
WHERE ProcessedAt >= @Start AND ProcessedAt < @End;
";
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.Add(new SqlParameter("@Start", SqlDbType.DateTime2) { Value = start });
        cmd.Parameters.Add(new SqlParameter("@End", SqlDbType.DateTime2) { Value = end });

        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
        {
            return new DailySummary { Date = start };
        }

        return new DailySummary
        {
            Date = start,
            TotalOrders = reader.GetInt32(0),
            TotalRevenue = reader.GetDecimal(1),
            FailedCsvRecords = reader.GetInt32(2)
        };
    }
}
