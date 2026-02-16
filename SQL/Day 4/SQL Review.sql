WITH CustomerOrderFrequency AS (
    SELECT 
        c.CustomerID,
        c.CustomerName,
        c.Email,
        c.City,
        COUNT(o.OrderID) AS OrderCount,
        MIN(o.OrderDate) AS FirstOrderDate,
        MAX(o.OrderDate) AS LastOrderDate
    FROM Customers c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    WHERE o.OrderDate >= DATEADD(MONTH, -6, GETDATE())
    GROUP BY c.CustomerID, c.CustomerName, c.Email, c.City
    HAVING COUNT(o.OrderID) > 5
)
SELECT 
    CustomerID,
    CustomerName,
    Email,
    City,
    OrderCount AS OrderFrequency,
    FirstOrderDate,
    LastOrderDate
FROM CustomerOrderFrequency
ORDER BY OrderCount DESC;






CREATE TABLE #CustomerAverages (
    CustomerID INT,
    CustomerName NVARCHAR(100),
    Email NVARCHAR(100),
    City NVARCHAR(50),
    TotalOrders INT,
    TotalAmountSpent DECIMAL(10,2),
    AverageOrderValue DECIMAL(10,2)
);

INSERT INTO #CustomerAverages
SELECT 
    c.CustomerID,
    c.CustomerName,
    c.Email,
    c.City,
    COUNT(DISTINCT o.OrderID) AS TotalOrders,
    SUM(o.TotalAmount) AS TotalAmountSpent,
    CAST(SUM(o.TotalAmount) / COUNT(DISTINCT o.OrderID) AS DECIMAL(10,2)) AS AverageOrderValue
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName, c.Email, c.City;

SELECT * FROM #CustomerAverages ORDER BY AverageOrderValue DESC;



SELECT * FROM #CustomerAverages ORDER BY AverageOrderValue DESC;

--DROP TABLE #CustomerAverages;