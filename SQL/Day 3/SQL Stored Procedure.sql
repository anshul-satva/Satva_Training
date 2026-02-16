-- New database
CREATE DATABASE StoreDB;
USE StoreDB;

-- procedures
SELECT name, create_date, modify_date
FROM sys.procedures
ORDER BY name;

-- customer table 
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20)
);

-- product table
CREATE TABLE Product (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Description VARCHAR(MAX)
);

-- orders table 
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    Qty INT NOT NULL,
    Rate DECIMAL(10,2) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,
    ProductID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- payment table
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

------------------------------------------------------------------------------------- Task 1: 

-- proc to add new customer
CREATE PROCEDURE sp_InsertCustomer
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Email VARCHAR(100),
    @Phone VARCHAR(20),
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Customer (FirstName, LastName, Email, Phone)
    VALUES (@FirstName, @LastName, @Email, @Phone);
    
    SELECT SCOPE_IDENTITY() AS CustomerID;
END
GO

-- insert customers
EXEC sp_InsertCustomer 'John', 'Smith', 'john.smith@email.com', '555-0101';
EXEC sp_InsertCustomer 'Sarah', 'Johnson', 'sarah.j@email.com', '555-0102';
EXEC sp_InsertCustomer 'Michael', 'Williams', 'michael.w@email.com', '555-0103';
EXEC sp_InsertCustomer 'Emily', 'Brown', 'emily.b@email.com', '555-0104';
EXEC sp_InsertCustomer 'David', 'Jones', 'david.jones@email.com', '555-0105';
EXEC sp_InsertCustomer 'Lisa', 'Garcia', 'lisa.g@email.com', '555-0106';
EXEC sp_InsertCustomer 'James', 'Miller', 'james.m@email.com', '555-0107';
EXEC sp_InsertCustomer 'Maria', 'Davis', 'maria.d@email.com', '555-0108';
EXEC sp_InsertCustomer 'Robert', 'Rodriguez', 'robert.r@email.com', '555-0109';
EXEC sp_InsertCustomer 'Jennifer', 'Martinez', 'jennifer.m@email.com', '555-0110';
EXEC sp_InsertCustomer 'William', 'Hernandez', 'william.h@email.com', '555-0111';
EXEC sp_InsertCustomer 'Linda', 'Lopez', 'linda.l@email.com', '555-0112';
EXEC sp_InsertCustomer 'Richard', 'Gonzalez', 'richard.g@email.com', '555-0113';
EXEC sp_InsertCustomer 'Patricia', 'Wilson', 'patricia.w@email.com', '555-0114';
EXEC sp_InsertCustomer 'Charles', 'Anderson', 'charles.a@email.com', '555-0115';
GO

SELECT CustomerID, FirstName, LastName, Email, Phone FROM Customer

-- proc to add new product
ALTER PROCEDURE sp_InsertProduct
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description VARCHAR(MAX)
AS
BEGIN
    
    INSERT INTO Product (Name, Price, Description)
    VALUES (@Name, @Price, @Description);
    
    SELECT SCOPE_IDENTITY() AS ProductID;
END

-- insert products
EXEC sp_InsertProduct 'Laptop', 899.99, 'High performance laptop';
EXEC sp_InsertProduct 'Mouse', 25.50, 'Wireless optical mouse';
EXEC sp_InsertProduct 'Keyboard', 45.00, 'Mechanical keyboard';
EXEC sp_InsertProduct 'Monitor', 249.99, '24 inch LED monitor';
EXEC sp_InsertProduct 'Headphones', 79.99, 'Noise cancelling headphones';
EXEC sp_InsertProduct 'Webcam', 65.00, 'HD webcam';
EXEC sp_InsertProduct 'USB Cable', 12.99, 'USB Type-C cable';
EXEC sp_InsertProduct 'External HDD', 89.99, '1TB external hard drive';
EXEC sp_InsertProduct 'Printer', 199.99, 'Inkjet printer';
EXEC sp_InsertProduct 'Router', 119.99, 'WiFi router';
EXEC sp_InsertProduct 'Speaker', 149.99, 'Bluetooth speaker';
EXEC sp_InsertProduct 'Tablet', 329.99, '10 inch tablet';
EXEC sp_InsertProduct 'Charger', 29.99, 'Fast charger';
EXEC sp_InsertProduct 'Case', 19.99, 'Laptop case';
EXEC sp_InsertProduct 'Stand', 39.99, 'Laptop stand';
GO

SELECT ProductID, Name, Price, Description FROM Product

-- proc to add new order
CREATE PROCEDURE sp_InsertOrder
    @CustomerID INT,
    @OrderDate DATETIME,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @TotalAmount DECIMAL(10,2),
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Orders (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
    VALUES (@CustomerID, @OrderDate, @Qty, @Rate, @TotalAmount, @ProductID);
    
    SELECT SCOPE_IDENTITY() AS OrderID;
END

-- insert orders
EXEC sp_InsertOrder 1, '2024-01-15 10:30:00', 1, 899.99, 899.99, 1;
EXEC sp_InsertOrder 2, '2024-01-16 14:20:00', 2, 25.50, 51.00, 2;
EXEC sp_InsertOrder 3, '2024-01-17 09:15:00', 1, 45.00, 45.00, 3;
EXEC sp_InsertOrder 1, '2024-01-18 16:45:00', 1, 249.99, 249.99, 4;
EXEC sp_InsertOrder 4, '2024-01-19 11:30:00', 3, 79.99, 239.97, 5;
EXEC sp_InsertOrder 5, '2024-01-20 13:00:00', 1, 65.00, 65.00, 6;
EXEC sp_InsertOrder 2, '2024-01-21 15:30:00', 5, 12.99, 64.95, 7;
EXEC sp_InsertOrder 6, '2024-01-22 10:00:00', 2, 89.99, 179.98, 8;
EXEC sp_InsertOrder 7, '2024-01-23 12:30:00', 1, 199.99, 199.99, 9;
EXEC sp_InsertOrder 3, '2024-01-24 14:00:00', 1, 119.99, 119.99, 10;
EXEC sp_InsertOrder 8, '2024-02-01 09:30:00', 2, 149.99, 299.98, 11;
EXEC sp_InsertOrder 9, '2024-02-02 11:00:00', 1, 329.99, 329.99, 12;
EXEC sp_InsertOrder 4, '2024-02-03 13:30:00', 4, 29.99, 119.96, 13;
EXEC sp_InsertOrder 10, '2024-02-04 15:00:00', 2, 19.99, 39.98, 14;
EXEC sp_InsertOrder 5, '2024-02-05 16:30:00', 1, 39.99, 39.99, 15;
EXEC sp_InsertOrder 11, '2024-02-06 10:15:00', 1, 899.99, 899.99, 1;
EXEC sp_InsertOrder 12, '2024-02-07 12:45:00', 3, 25.50, 76.50, 2;
EXEC sp_InsertOrder 6, '2024-02-08 14:20:00', 1, 249.99, 249.99, 4;
EXEC sp_InsertOrder 13, '2024-02-09 09:00:00', 2, 79.99, 159.98, 5;
EXEC sp_InsertOrder 14, '2024-02-10 11:30:00', 1, 199.99, 199.99, 9;
GO

SELECT OrderID, CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID FROM Orders

-- proc to add payment record
CREATE PROCEDURE sp_InsertPayment
    @OrderID INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATETIME
AS

-- drop database StoreDBX

BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, @PaymentDate);
    
    SELECT SCOPE_IDENTITY() AS PaymentID;
END

-- insert payments
EXEC sp_InsertPayment 1, 899.99, '2024-01-15 11:00:00';
EXEC sp_InsertPayment 2, 51.00, '2024-01-16 15:00:00';
EXEC sp_InsertPayment 3, 45.00, '2024-01-17 10:00:00';
EXEC sp_InsertPayment 4, 249.99, '2024-01-18 17:00:00';
EXEC sp_InsertPayment 5, 239.97, '2024-01-19 12:00:00';
EXEC sp_InsertPayment 6, 65.00, '2024-01-20 14:00:00';
EXEC sp_InsertPayment 7, 64.95, '2024-01-21 16:00:00';
EXEC sp_InsertPayment 8, 179.98, '2024-01-22 11:00:00';
EXEC sp_InsertPayment 11, 299.98, '2024-02-01 10:00:00';
EXEC sp_InsertPayment 12, 329.99, '2024-02-02 12:00:00';
EXEC sp_InsertPayment 13, 119.96, '2024-02-03 14:00:00';
EXEC sp_InsertPayment 14, 39.98, '2024-02-04 16:00:00';
EXEC sp_InsertPayment 16, 899.99, '2024-02-06 11:00:00';
EXEC sp_InsertPayment 18, 249.99, '2024-02-08 15:00:00';
EXEC sp_InsertPayment 20, 199.99, '2024-02-10 12:00:00';
GO

SELECT PaymentID, OrderID, Amount, PaymentDate FROM Payment


------------------------------------------------------------------------------------- Task 2:

-- update customer details
CREATE PROCEDURE sp_UpdateCustomer
    @CustomerID INT,
    @FirstName VARCHAR(50),
    @LastName VARCHAR(50),
    @Email VARCHAR(100),
    @Phone VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Customer
    SET FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        Phone = @Phone
    WHERE CustomerID = @CustomerID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- update customer phone
EXEC sp_UpdateCustomer 1, 'John', 'Smith', 'john.smith@email.com', '666-9999';
SELECT * FROM Customer

-- update product info
CREATE PROCEDURE sp_UpdateProduct
    @ProductID INT,
    @Name VARCHAR(100),
    @Price DECIMAL(10,2),
    @Description VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Product
    SET Name = @Name,
        Price = @Price,
        Description = @Description
    WHERE ProductID = @ProductID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- update product price
EXEC sp_UpdateProduct 1, 'Laptop', 849.99, 'High performance laptop';
SELECT * FROM Product 

-- update order details
CREATE PROCEDURE sp_UpdateOrder
    @OrderID INT,
    @CustomerID INT,
    @OrderDate DATETIME,
    @Qty INT,
    @Rate DECIMAL(10,2),
    @TotalAmount DECIMAL(10,2),
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Orders
    SET CustomerID = @CustomerID,
        OrderDate = @OrderDate,
        Qty = @Qty,
        Rate = @Rate,
        TotalAmount = @TotalAmount,
        ProductID = @ProductID
    WHERE OrderID = @OrderID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- update order quantity
EXEC sp_UpdateOrder 2, 2, '2024-01-16 14:20:00', 3, 25.50, 76.50, 2;
SELECT * FROM Orders 

-- update payment info
CREATE PROCEDURE sp_UpdatePayment
    @PaymentID INT,
    @OrderID INT,
    @Amount DECIMAL(10,2),
    @PaymentDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Payment
    SET OrderID = @OrderID,
        Amount = @Amount,
        PaymentDate = @PaymentDate
    WHERE PaymentID = @PaymentID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- update payment amount
EXEC sp_UpdatePayment 1, 1, 849.99, '2024-01-15 11:00:00';
SELECT * FROM Payment 


------------------------------------------------------------------------------------- Task 3:

-- get customer by id
CREATE PROCEDURE sp_GetCustomer
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT CustomerID, FirstName, LastName, Email, Phone
    FROM Customer
    WHERE CustomerID = @CustomerID;
END
GO
-- get customer details
EXEC sp_GetCustomer 1;

-- get product by id
CREATE PROCEDURE sp_GetProduct
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ProductID, Name, Price, Description
    FROM Product
    WHERE ProductID = @ProductID;
END
GO
-- get product details
EXEC sp_GetProduct 1;

-- get order by id
CREATE PROCEDURE sp_GetOrder
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT OrderID, CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID
    FROM Orders
    WHERE OrderID = @OrderID;
END
GO
-- get order details
EXEC sp_GetOrder 1;

-- get payment by id
CREATE PROCEDURE sp_GetPayment
    @PaymentID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT PaymentID, OrderID, Amount, PaymentDate
    FROM Payment
    WHERE PaymentID = @PaymentID;
END
GO
-- get payment details
EXEC sp_GetPayment 1;


------------------------------------------------------------------------------------- Task 4:


-- delete customer record
CREATE PROCEDURE sp_DeleteCustomer
    @CustomerID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Customer
    WHERE CustomerID = @CustomerID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- delete product record
CREATE PROCEDURE sp_DeleteProduct
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Product
    WHERE ProductID = @ProductID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- delete order record
CREATE PROCEDURE sp_DeleteOrder
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Orders
    WHERE OrderID = @OrderID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- delete payment record
CREATE PROCEDURE sp_DeletePayment
    @PaymentID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Payment
    WHERE PaymentID = @PaymentID;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO


-- EXEC sp_DeletePayment 1;
-- EXEC sp_DeleteOrder 1;
-- EXEC sp_DeleteProduct 1;
-- EXEC sp_DeleteCustomer 1;


------------------------------------------------------------------------------------- Task 5:

-- Update product price by given product id
CREATE PROCEDURE sp_UpdateProductPrice
    @ProductID INT,
    @NewPrice DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Product
    SET Price = @NewPrice
    WHERE ProductID = @ProductID;
    
    BEGIN
        SELECT ProductID, Name, Price, Description
        FROM Product
        WHERE ProductID = @ProductID;
    END
END
GO
-- execute
EXEC sp_UpdateProductPrice 2, 500;

------------------------------------------------------------------------------------- Task 6:

-- Insert order details with calculations

CREATE PROCEDURE sp_InsertOrderWithCalculation
    @CustomerID INT,
    @OrderDate DATETIME,
    @ProductID INT,
    @Qty INT,
    @Rate DECIMAL(10,2)
AS 
BEGIN 
    SET NOCOUNT ON;

    DECLARE @TotalAmount DECIMAL(10,2);
    DECLARE @NewID INT;
    SET @TotalAmount = @Qty * @Rate;
    
    INSERT INTO Orders (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
    VALUES (@CustomerID, @OrderDate, @Qty, @Rate, @TotalAmount, @ProductID);
    
    SET @NewID = SCOPE_IDENTITY();
    
    SELECT OrderID, CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID
    FROM Orders
    WHERE OrderID = @NewID;
END
GO
-- execute
EXEC sp_InsertOrderWithCalculation 1, '2024-02-15 10:00:00', 3, 5, 50.00;
GO


------------------------------------------------------------------------------------- Task 7:

-- Record Payments for order
CREATE PROCEDURE sp_RecordPayment
    @OrderID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @PaymentDate DATETIME;
    DECLARE @NewID INT;
    
    SET @PaymentDate = GETDATE();
    
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, @PaymentDate);
    
    SET @NewID = SCOPE_IDENTITY();
    
    SELECT PaymentID, OrderID, Amount, PaymentDate
    FROM Payment
    WHERE PaymentID = @NewID;
END
GO
-- execute
EXEC sp_RecordPayment 9, 200;
GO


------------------------------------------------------------------------------------- Task 8:

-- Total payments by each customers
CREATE PROCEDURE sp_GetTotalPaymentsByCustomer
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        SUM(p.Amount) AS TotalPayments
    FROM Customer c
    LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
    LEFT JOIN Payment p ON o.OrderID = p.OrderID
    GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
    ORDER BY TotalPayments DESC;
END
GO

-- execute
EXEC sp_GetTotalPaymentsByCustomer;
GO


------------------------------------------------------------------------------------- Task 9:

-- Customrs without payments
CREATE PROCEDURE sp_GetCustomersWithoutPayments
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone
    FROM Customer c
    LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
    LEFT JOIN Payment p ON o.OrderID = p.OrderID
    WHERE p.PaymentID IS NULL;
END
GO

-- execute
EXEC sp_GetCustomersWithoutPayments;
GO

------------------------------------------------------------------------------------- Task 10: 
 

-- TOTAL REVENUE FOR PERIOD
CREATE PROCEDURE sp_GetTotalRevenueByPeriod
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        SUM(TotalAmount) AS TotalRevenue,
        COUNT(*) AS TotalOrders
    FROM Orders
    WHERE OrderDate BETWEEN @StartDate AND @EndDate;
END
GO

-- execute
EXEC sp_GetTotalRevenueByPeriod '2024-01-01', '2024-01-31';
EXEC sp_GetTotalRevenueByPeriod '2024-02-01', '2024-02-28';
GO


------------------------------------------------------------------------------------- Task 11: 

-- ALL ORDERS WITH CUSTOMER AND PRODUCT DETAILS
CREATE PROCEDURE sp_GetOrdersWithDetails
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        o.OrderID,
        o.OrderDate,
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        p.ProductID,
        p.Name AS ProductName,
        o.Qty,
        o.Rate,
        o.TotalAmount
    FROM Orders o
    INNER JOIN Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN Product p ON o.ProductID = p.ProductID
    ORDER BY o.OrderDate DESC;
END
GO

-- execute
EXEC sp_GetOrdersWithDetails;
GO


------------------------------------------------------------------------------------- Task 12:


-- TOP N CUSTOMERS BY TOTAL PAYMENTS
CREATE PROCEDURE sp_GetTopCustomersByPayments
    @TopN INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopN)
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        SUM(p.Amount) AS TotalPayments,
        COUNT(DISTINCT p.PaymentID) AS PaymentCount
    FROM Customer c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    INNER JOIN Payment p ON o.OrderID = p.OrderID
    GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
    ORDER BY TotalPayments DESC;
END
GO

-- execute
EXEC sp_GetTopCustomersByPayments 3;
GO


------------------------------------------------------------------------------------- Task 13: 


-- ORDERS BY CUSTOMERS WITH RECENT PAYMENTS
CREATE PROCEDURE sp_GetOrdersByRecentPayments
    @MonthsBack INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CutoffDate DATETIME;
    SET @CutoffDate = DATEADD(MONTH, -@MonthsBack, GETDATE());
    
    SELECT DISTINCT
        o.OrderID,
        o.OrderDate,
        c.CustomerID,
        c.FirstName,
        c.LastName,
        p.ProductID,
        p.Name AS ProductName,
        o.TotalAmount
    FROM Orders o
    INNER JOIN Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN Product p ON o.ProductID = p.ProductID
    WHERE c.CustomerID IN (
        SELECT DISTINCT o2.CustomerID
        FROM Orders o2
        INNER JOIN Payment py ON o2.OrderID = py.OrderID
        WHERE py.PaymentDate >= @CutoffDate
    )
    ORDER BY o.OrderDate DESC;
END
GO

-- execute
EXEC sp_GetOrdersByRecentPayments 6;
GO


------------------------------------------------------------------------------------- Task 14: 

-- Total Revenue By Products
CREATE PROCEDURE sp_GetRevenueByProduct
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.ProductID,
        p.Name AS ProductName,
        SUM(o.TotalAmount) AS TotalRevenue,
        SUM(o.Qty) AS TotalQuantitySold,
        COUNT(o.OrderID) AS OrderCount
    FROM Product p
    LEFT JOIN Orders o ON p.ProductID = o.ProductID
    GROUP BY p.ProductID, p.Name
    ORDER BY TotalRevenue DESC;
END
GO

-- execute
EXEC sp_GetRevenueByProduct;
GO


------------------------------------------------------------------------------------- Task 15: 


-- Most Profitable Product
CREATE PROCEDURE sp_GetMostProfitableProduct
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1
        p.ProductID,
        p.Name AS ProductName,
        p.Price,
        SUM(o.TotalAmount) AS TotalRevenue,
        SUM(o.Qty) AS TotalQuantitySold
    FROM Product p
    INNER JOIN Orders o ON p.ProductID = o.ProductID
    GROUP BY p.ProductID, p.Name, p.Price
    ORDER BY TotalRevenue DESC;
END
GO

-- execute
EXEC sp_GetMostProfitableProduct;
GO


------------------------------------------------------------------------------------- Task 16: 

-- CUSTOMERS WHO PURCHASED SPECIFIC PRODUCT IN DATE RANGE
CREATE PROCEDURE sp_GetCustomersByProductAndDateRange
    @ProductID INT,
    @StartDate DATETIME,
    @EndDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT c.CustomerID, c.FirstName, c.LastName, c.Email,
           o.OrderDate, o.Qty, o.TotalAmount
    FROM Customer c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    WHERE o.ProductID = @ProductID AND o.OrderDate BETWEEN @StartDate AND @EndDate
    ORDER BY o.OrderDate DESC;
END
GO

EXEC sp_GetCustomersByProductAndDateRange 1, '2024-01-01', '2024-12-31';
GO


------------------------------------------------------------------------------------- Task 17: 

-- AVERAGE ORDER VALUE BY CUSTOMER
ALTER PROCEDURE sp_GetAverageOrderValueByCustomer
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        COUNT(o.OrderID) AS TotalOrders,
        CAST(AVG(o.TotalAmount) AS DECIMAL(10,2)) AS AverageOrderValue,  -- 2 decimals
        SUM(o.TotalAmount) AS TotalSpent
    FROM Customer c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    GROUP BY c.CustomerID, c.FirstName, c.LastName
    ORDER BY AverageOrderValue DESC;
END
GO

-- execute
EXEC sp_GetAverageOrderValueByCustomer;
GO


------------------------------------------------------------------------------------- Task 18:

-- HIGHEST ORDER AMOUNT PER CUSTOMER

CREATE PROCEDURE sp_GetHighestOrderByCustomer
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        o.OrderID,
        o.OrderDate,
        p.Name AS ProductName,
        o.TotalAmount
    FROM Customer c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    INNER JOIN Product p ON o.ProductID = p.ProductID
    WHERE o.TotalAmount = (
        SELECT MAX(o2.TotalAmount)
        FROM Orders o2
        WHERE o2.CustomerID = c.CustomerID
    )
    ORDER BY o.TotalAmount DESC;
END
GO

-- execute
EXEC sp_GetHighestOrderByCustomer;
GO


------------------------------------------------------------------------------------- Task 19:

-- ORDERS AND REVENUE BY CUSTOMER FOR YEAR

CREATE PROCEDURE sp_GetCustomerStatsForYear
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        COUNT(o.OrderID) AS TotalOrders,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM Customer c
    LEFT JOIN Orders o ON c.CustomerID = o.CustomerID 
        AND YEAR(o.OrderDate) = @Year
    GROUP BY c.CustomerID, c.FirstName, c.LastName
    HAVING COUNT(o.OrderID) > 0
    ORDER BY TotalRevenue DESC;
END
GO

-- execute
EXEC sp_GetCustomerStatsForYear 2024;
GO


------------------------------------------------------------------------------------- Task 20:

-- UNPAID ORDERS WITHIN PERIOD

CREATE OR ALTER PROCEDURE sp_GetUnpaidOrders
    @DaysBack INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CutoffDate DATE =
        DATEADD(DAY, -@DaysBack, CAST(GETDATE() AS DATE));

    SELECT 
        o.OrderID,
        o.OrderDate,
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        p.Name AS ProductName,
        o.TotalAmount,
        DATEDIFF(DAY, o.OrderDate, GETDATE()) AS DaysSinceOrder
    FROM Orders o
    JOIN Customer c ON o.CustomerID = c.CustomerID
    JOIN Product p ON o.ProductID = p.ProductID
    WHERE o.OrderDate >= @CutoffDate
      AND NOT EXISTS (
            SELECT 1 
            FROM Payment py 
            WHERE py.OrderID = o.OrderID
      )
    ORDER BY o.OrderDate DESC;
END;
GO


-- execute
EXEC sp_GetUnpaidOrders 90;
GO

SELECT * FROM Payment;

------------------------------------------------------------------------------------- Task 21:

-- CUSTOMERS WITH CONSECUTIVE PURCHASES

CREATE PROCEDURE sp_GetCustomersWithConsecutivePurchases
    @DaysApart INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        COUNT(DISTINCT o.OrderID) AS TotalOrders
    FROM Customer c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    WHERE EXISTS (
        SELECT 1
        FROM Orders o2
        WHERE o2.CustomerID = c.CustomerID
            AND o2.OrderID <> o.OrderID
            AND ABS(DATEDIFF(DAY, o.OrderDate, o2.OrderDate)) <= @DaysApart
    )
    GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
    ORDER BY TotalOrders DESC;
END
GO

-- execute
EXEC sp_GetCustomersWithConsecutivePurchases 30;
GO


------------------------------------------------------------------------------------- Task 22:

-- CUSTOMER REVENUE FOR LAST N MONTHS

CREATE OR ALTER PROCEDURE sp_GetCustomerRevenueLastNMonths
    @MonthsBack INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CutoffDate DATE =
        DATEADD(MONTH, -@MonthsBack, CAST(GETDATE() AS DATE));

    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        COUNT(o.OrderID) AS OrderCount,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalRevenue
    FROM Customer c
    LEFT JOIN Orders o 
        ON c.CustomerID = o.CustomerID
        AND o.OrderDate >= @CutoffDate
    GROUP BY c.CustomerID, c.FirstName, c.LastName
    ORDER BY TotalRevenue DESC;
END;
GO


-- execute
EXEC sp_GetCustomerRevenueLastNMonths 7;
GO


------------------------------------------------------------------------------------- Task 23:

-- ORDERS WITH ABOVE AVERAGE PRODUCT PRICE
CREATE PROCEDURE sp_GetOrdersAboveAveragePrice
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @AvgPrice DECIMAL(10,2);
    SELECT @AvgPrice = AVG(Price) FROM Product;
    
    SELECT 
        o.OrderID,
        o.OrderDate,
        c.FirstName,
        c.LastName,
        p.Name AS ProductName,
        p.Price AS ProductPrice,
        @AvgPrice AS AveragePrice,
        o.TotalAmount
    FROM Orders o
    INNER JOIN Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN Product p ON o.ProductID = p.ProductID
    WHERE p.Price > @AvgPrice
    ORDER BY p.Price DESC;
END
GO

-- execute
EXEC sp_GetOrdersAboveAveragePrice;
GO


------------------------------------------------------------------------------------- Task 24:

-- AVERAGE TIME BETWEEN ORDERS PER CUSTOMER
CREATE PROCEDURE sp_GetAverageTimeBetweenOrders
AS
BEGIN
    SET NOCOUNT ON;
    
    WITH OrderGaps AS (
        SELECT 
            CustomerID,
            OrderDate,
            LEAD(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS NextOrderDate
        FROM Orders
    )
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        COUNT(og.NextOrderDate) AS GapCount,
        AVG(DATEDIFF(DAY, og.OrderDate, og.NextOrderDate)) AS AvgDaysBetweenOrders
    FROM Customer c
    INNER JOIN OrderGaps og ON c.CustomerID = og.CustomerID
    WHERE og.NextOrderDate IS NOT NULL
    GROUP BY c.CustomerID, c.FirstName, c.LastName
    HAVING COUNT(og.NextOrderDate) > 0
    ORDER BY AvgDaysBetweenOrders;
END
GO

-- execute
EXEC sp_GetAverageTimeBetweenOrders;
GO


------------------------------------------------------------------------------------- Task 25:

-- ORDERS WITH PAGINATION, SORTING AND SEARCHING

CREATE PROCEDURE sp_GetOrdersWithPagination
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SortColumn VARCHAR(50) = 'OrderDate',
    @SortDirection VARCHAR(4) = 'DESC',
    @SearchTerm VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    WITH OrderData AS (
        SELECT 
            o.OrderID,
            o.OrderDate,
            c.CustomerID,
            c.FirstName + ' ' + c.LastName AS CustomerName,
            c.Email,
            p.ProductID,
            p.Name AS ProductName,
            o.Qty,
            o.Rate,
            o.TotalAmount,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE WHEN @SortColumn = 'OrderDate' AND @SortDirection = 'ASC' THEN o.OrderDate END ASC,
                    CASE WHEN @SortColumn = 'OrderDate' AND @SortDirection = 'DESC' THEN o.OrderDate END DESC,
                    CASE WHEN @SortColumn = 'TotalAmount' AND @SortDirection = 'ASC' THEN o.TotalAmount END ASC,
                    CASE WHEN @SortColumn = 'TotalAmount' AND @SortDirection = 'DESC' THEN o.TotalAmount END DESC,
                    CASE WHEN @SortColumn = 'CustomerName' AND @SortDirection = 'ASC' THEN c.FirstName + ' ' + c.LastName END ASC,
                    CASE WHEN @SortColumn = 'CustomerName' AND @SortDirection = 'DESC' THEN c.FirstName + ' ' + c.LastName END DESC,
                    CASE WHEN @SortColumn = 'ProductName' AND @SortDirection = 'ASC' THEN p.Name END ASC,
                    CASE WHEN @SortColumn = 'ProductName' AND @SortDirection = 'DESC' THEN p.Name END DESC
            ) AS RowNum
        FROM Orders o
        INNER JOIN Customer c ON o.CustomerID = c.CustomerID
        INNER JOIN Product p ON o.ProductID = p.ProductID
        WHERE @SearchTerm IS NULL 
            OR c.FirstName LIKE '%' + @SearchTerm + '%'
            OR c.LastName LIKE '%' + @SearchTerm + '%'
            OR c.Email LIKE '%' + @SearchTerm + '%'
            OR p.Name LIKE '%' + @SearchTerm + '%'
    )
    SELECT 
        OrderID,
        OrderDate,
        CustomerID,
        CustomerName,
        Email,
        ProductID,
        ProductName,
        Qty,
        Rate,
        TotalAmount,
        (SELECT COUNT(*) FROM OrderData) AS TotalRecords
    FROM OrderData
    WHERE RowNum BETWEEN @Offset + 1 AND @Offset + @PageSize
    ORDER BY RowNum;
END
GO

EXEC sp_GetOrdersWithPagination @PageNumber = 2, @PageSize = 5;
EXEC sp_GetOrdersWithPagination @PageNumber = 1, @PageSize = 10, @SortColumn = 'TotalAmount', @SortDirection = 'DESC';
EXEC sp_GetOrdersWithPagination @PageNumber = 1, @PageSize = 10, @SearchTerm = 'John';
EXEC sp_GetOrdersWithPagination @PageNumber = 2, @PageSize = 5, @SortColumn = 'OrderDate', @SortDirection = 'ASC';
GO

--

SELECT 'Customers' AS TableName, COUNT(*) AS RecordCount FROM Customer
UNION ALL
SELECT 'Products', COUNT(*) FROM Product
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'Payments', COUNT(*) FROM Payment;
GO                            