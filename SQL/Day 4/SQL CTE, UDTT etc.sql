CREATE DATABASE ECommerceDB;
USE ECommerceDB;

-- Customers Table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    CustomerName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Phone NVARCHAR(20),
    City NVARCHAR(50),
    Country NVARCHAR(50),
    Address NVARCHAR(255),
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Products Table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50),
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Orders Table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2),
    Status NVARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- OrderDetails Table
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Subtotal AS (Quantity * UnitPrice) PERSISTED,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Payment Table
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentMethod NVARCHAR(50),
    PaymentStatus NVARCHAR(50) DEFAULT 'Completed',
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

SELECT name FROM sys.tables;


-- Insert Customers
INSERT INTO Customers (CustomerName, Email, Phone, City, Country, Address) VALUES
('John Smith', 'john.smith@email.com', '1234567890', 'New York', 'USA', '123 Main St'),
('Emma Wilson', 'emma.wilson@email.com', '2345678901', 'Los Angeles', 'USA', '456 Oak Ave'),
('Michael Brown', 'michael.brown@email.com', '3456789012', 'Chicago', 'USA', '789 Pine Rd'),
('Sarah Davis', 'sarah.davis@email.com', '4567890123', 'Houston', 'USA', '321 Elm St'),
('James Johnson', 'james.johnson@email.com', '5678901234', 'Phoenix', 'USA', '654 Maple Dr'),
('Emily Taylor', 'emily.taylor@email.com', '6789012345', 'Philadelphia', 'USA', '987 Cedar Ln'),
('Daniel Martinez', 'daniel.martinez@email.com', '7890123456', 'San Antonio', 'USA', '147 Birch Way'),
('Olivia Anderson', 'olivia.anderson@email.com', '8901234567', 'San Diego', 'USA', '258 Spruce Ct'),
('William Thomas', 'william.thomas@email.com', '9012345678', 'Dallas', 'USA', '369 Willow Pl'),
('Sophia Garcia', 'sophia.garcia@email.com', '0123456789', 'San Jose', 'USA', '741 Ash Blvd'),
('Benjamin Lee', 'benjamin.lee@email.com', '1122334455', 'Austin', 'USA', '852 Palm St'),
('Isabella White', 'isabella.white@email.com', '2233445566', 'Jacksonville', 'USA', '963 Poplar Ave'),
('Lucas Harris', 'lucas.harris@email.com', '3344556677', 'Fort Worth', 'USA', '159 Cherry Rd'),
('Mia Clark', 'mia.clark@email.com', '4455667788', 'Columbus', 'USA', '357 Magnolia Dr'),
('Henry Lewis', 'henry.lewis@email.com', '5566778899', 'Charlotte', 'USA', '486 Hickory Ln'),
('Amelia Robinson', 'amelia.robinson@email.com', '6677889900', 'San Francisco', 'USA', '753 Redwood Way'),
('Alexander Walker', 'alexander.walker@email.com', '7788990011', 'Indianapolis', 'USA', '951 Sequoia Ct'),
('Charlotte Young', 'charlotte.young@email.com', '8899001122', 'Seattle', 'USA', '159 Cypress Pl'),
('Sebastian King', 'sebastian.king@email.com', '9900112233', 'Denver', 'USA', '357 Juniper Blvd'),
('Ava Wright', 'ava.wright@email.com', '0011223344', 'Boston', 'USA', '486 Fir St');

-- Insert Products
INSERT INTO Products (ProductName, Category, Price, StockQuantity) VALUES
('Laptop Dell XPS 15', 'Electronics', 1299.99, 50),
('iPhone 15 Pro', 'Electronics', 999.99, 100),
('Samsung Galaxy S24', 'Electronics', 899.99, 75),
('Sony Headphones WH-1000XM5', 'Electronics', 349.99, 120),
('Apple Watch Series 9', 'Electronics', 399.99, 80),
('iPad Air', 'Electronics', 599.99, 60),
('Nike Air Max Shoes', 'Footwear', 129.99, 200),
('Adidas Running Shorts', 'Apparel', 39.99, 150),
('The North Face Jacket', 'Apparel', 249.99, 90),
('Levi''s Jeans', 'Apparel', 79.99, 180),
('Coffee Maker Keurig', 'Home Appliances', 149.99, 70),
('Dyson Vacuum Cleaner', 'Home Appliances', 499.99, 40),
('KitchenAid Mixer', 'Home Appliances', 379.99, 55),
('Instant Pot Duo', 'Home Appliances', 89.99, 100),
('Fitbit Charge 6', 'Electronics', 159.99, 110),
('Canon EOS R6', 'Electronics', 2499.99, 25),
('Nintendo Switch OLED', 'Electronics', 349.99, 85),
('PlayStation 5', 'Electronics', 499.99, 45),
('Xbox Series X', 'Electronics', 499.99, 50),
('Kindle Paperwhite', 'Electronics', 139.99, 95);

-- Insert Orders
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, Status) VALUES
(1, DATEADD(MONTH, -5, GETDATE()), 1649.98, 'Completed'),
(2, DATEADD(MONTH, -5, GETDATE()), 999.99, 'Completed'),
(3, DATEADD(MONTH, -4, GETDATE()), 1249.98, 'Completed'),
(1, DATEADD(MONTH, -4, GETDATE()), 349.99, 'Completed'),
(4, DATEADD(MONTH, -4, GETDATE()), 599.99, 'Completed'),
(2, DATEADD(MONTH, -3, GETDATE()), 899.99, 'Completed'),
(5, DATEADD(MONTH, -3, GETDATE()), 779.98, 'Completed'),
(1, DATEADD(MONTH, -3, GETDATE()), 499.99, 'Completed'),
(6, DATEADD(MONTH, -2, GETDATE()), 1299.99, 'Completed'),
(2, DATEADD(MONTH, -2, GETDATE()), 399.99, 'Completed'),
(7, DATEADD(MONTH, -2, GETDATE()), 639.98, 'Completed'),
(1, DATEADD(MONTH, -2, GETDATE()), 249.99, 'Completed'),
(3, DATEADD(MONTH, -1, GETDATE()), 1999.98, 'Completed'),
(8, DATEADD(MONTH, -1, GETDATE()), 549.98, 'Completed'),
(2, DATEADD(MONTH, -1, GETDATE()), 899.99, 'Completed'),
(1, DATEADD(MONTH, -1, GETDATE()), 159.99, 'Completed'),
(9, DATEADD(DAY, -20, GETDATE()), 2499.99, 'Completed'),
(10, DATEADD(DAY, -15, GETDATE()), 699.98, 'Completed'),
(2, DATEADD(DAY, -10, GETDATE()), 349.99, 'Completed'),
(1, DATEADD(DAY, -5, GETDATE()), 139.99, 'Completed'),
(11, DATEADD(DAY, -3, GETDATE()), 1549.98, 'Pending'),
(12, DATEADD(DAY, -2, GETDATE()), 449.99, 'Pending'),
(13, DATEADD(DAY, -1, GETDATE()), 799.99, 'Processing'),
(14, GETDATE(), 1099.98, 'Processing'),
(15, GETDATE(), 599.99, 'Pending');

-- Insert OrderDetails
INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 1, 1, 1299.99), (1, 7, 1, 349.99),
(2, 2, 1, 999.99),
(3, 3, 1, 899.99), (3, 8, 1, 349.99),
(4, 4, 1, 349.99),
(5, 6, 1, 599.99),
(6, 3, 1, 899.99),
(7, 7, 2, 129.99), (7, 8, 1, 39.99), (7, 10, 5, 79.99),
(8, 12, 1, 499.99),
(9, 1, 1, 1299.99),
(10, 5, 1, 399.99),
(11, 7, 2, 129.99), (11, 9, 1, 249.99), (11, 10, 1, 79.99),
(12, 9, 1, 249.99),
(13, 16, 1, 2499.99),
(14, 11, 1, 149.99), (14, 13, 1, 379.99),
(15, 3, 1, 899.99),
(16, 15, 1, 159.99),
(17, 16, 1, 2499.99),
(18, 17, 2, 349.99),
(19, 4, 1, 349.99),
(20, 20, 1, 139.99),
(21, 18, 1, 499.99), (21, 19, 1, 499.99), (21, 4, 1, 349.99),
(22, 12, 1, 499.99),
(23, 5, 2, 399.99),
(24, 2, 1, 999.99), (24, 5, 1, 399.99),
(25, 6, 1, 599.99);

-- Insert Payments (including partial payments)
INSERT INTO Payment (OrderID, PaymentDate, AmountPaid, PaymentMethod, PaymentStatus) VALUES
(1, DATEADD(MONTH, -5, GETDATE()), 1649.98, 'Credit Card', 'Completed'),
(2, DATEADD(MONTH, -5, GETDATE()), 999.99, 'PayPal', 'Completed'),
(3, DATEADD(MONTH, -4, GETDATE()), 1249.98, 'Credit Card', 'Completed'),
(4, DATEADD(MONTH, -4, GETDATE()), 349.99, 'Debit Card', 'Completed'),
(5, DATEADD(MONTH, -4, GETDATE()), 599.99, 'Credit Card', 'Completed'),
(6, DATEADD(MONTH, -3, GETDATE()), 899.99, 'PayPal', 'Completed'),
(7, DATEADD(MONTH, -3, GETDATE()), 779.98, 'Credit Card', 'Completed'),
(8, DATEADD(MONTH, -3, GETDATE()), 499.99, 'Debit Card', 'Completed'),
(9, DATEADD(MONTH, -2, GETDATE()), 1299.99, 'Credit Card', 'Completed'),
(10, DATEADD(MONTH, -2, GETDATE()), 399.99, 'PayPal', 'Completed'),
(11, DATEADD(MONTH, -2, GETDATE()), 639.98, 'Credit Card', 'Completed'),
(12, DATEADD(MONTH, -2, GETDATE()), 249.99, 'Cash', 'Completed'),
(13, DATEADD(MONTH, -1, GETDATE()), 1999.98, 'Credit Card', 'Completed'),
(14, DATEADD(MONTH, -1, GETDATE()), 549.98, 'PayPal', 'Completed'),
(15, DATEADD(MONTH, -1, GETDATE()), 899.99, 'Debit Card', 'Completed'),
(16, DATEADD(MONTH, -1, GETDATE()), 159.99, 'Credit Card', 'Completed'),
(17, DATEADD(DAY, -20, GETDATE()), 2499.99, 'Credit Card', 'Completed'),
(18, DATEADD(DAY, -15, GETDATE()), 699.98, 'PayPal', 'Completed'),
(19, DATEADD(DAY, -10, GETDATE()), 349.99, 'Debit Card', 'Completed'),
(20, DATEADD(DAY, -5, GETDATE()), 139.99, 'Credit Card', 'Completed'),
-- Partial payments for Order 21
(21, DATEADD(DAY, -3, GETDATE()), 1000.00, 'Credit Card', 'Partial'),
(21, DATEADD(DAY, -2, GETDATE()), 549.98, 'PayPal', 'Completed');

GO

-- TASK 1: Create User-Defined Types for Bulk Insert

-- User-Defined Table Type for Customers
CREATE TYPE CustomerType AS TABLE (
    CustomerName NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    City NVARCHAR(50),
    Country NVARCHAR(50),
    Address NVARCHAR(255)
);
GO

-- User-Defined Table Type for Products
CREATE TYPE ProductType AS TABLE (
    ProductName NVARCHAR(100),
    Category NVARCHAR(50),
    Price DECIMAL(10,2),
    StockQuantity INT
);
GO

-- Stored Procedure to Bulk Insert Customers using UDT
CREATE PROCEDURE sp_BulkInsertCustomers
    @CustomerData CustomerType READONLY
AS
BEGIN
    INSERT INTO Customers (CustomerName, Email, Phone, City, Country, Address)
    SELECT CustomerName, Email, Phone, City, Country, Address
    FROM @CustomerData;
END;
GO

-- Stored Procedure to Bulk Insert Products using UDT
CREATE PROCEDURE sp_BulkInsertProducts
    @ProductData ProductType READONLY
AS
BEGIN
    INSERT INTO Products (ProductName, Category, Price, StockQuantity)
    SELECT ProductName, Category, Price, StockQuantity
    FROM @ProductData;
END;
GO

-- Example Usage of Bulk Insert:
 DECLARE @Customers CustomerType;
 INSERT INTO @Customers VALUES 
 ('Anshul', 'anshulprt@email.com', '1010101010', 'Ahmedabad', 'INDIA', 'L.D. College of Engineering'),
 ('Divy', 'Divyasrt@email.com', '1045401010', 'Ahmedabad', 'INDIA', 'Navrangpura')
 EXEC sp_BulkInsertCustomers @Customers;

 
-- TASK 2: Top 10 Customers Ordered by City

SELECT TOP 10 
    CustomerID,
    CustomerName,
    Email,
    City,
    Country,
    Address
FROM Customers
ORDER BY City DESC, CustomerName DESC;


-- Task 3: Query using 'LIKE' 

-- Find customers whose name starts with 'J'
SELECT 
    CustomerID,
    CustomerName,
    Email,
    City
FROM Customers
WHERE CustomerName LIKE 'J%';

-- Find products containing 'Phone' in the name
SELECT 
    ProductID,
    ProductName,
    Category,
    Price
FROM Products
WHERE ProductName LIKE '%Phone%';


-- TASK 4: Query Using 'IN' Keyword on City Column

SELECT 
    CustomerID,
    CustomerName,
    Email,
    City,
    Country,
    Address
FROM Customers
WHERE City IN ('New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix');


-- TASK 5: MERGE Statement for Products Table

CREATE PROCEDURE sp_MergeProducts
    @ProductData ProductType READONLY
AS
BEGIN
    MERGE INTO Products AS Target
    USING @ProductData AS Source
    ON Target.ProductName = Source.ProductName
    
    -- Update existing products
    WHEN MATCHED THEN
        UPDATE SET
            Category = Source.Category,
            Price = Source.Price,
            StockQuantity = Target.StockQuantity + Source.StockQuantity
    
    -- Insert new products
    WHEN NOT MATCHED BY TARGET THEN
        INSERT (ProductName, Category, Price, StockQuantity)
        VALUES (Source.ProductName, Source.Category, Source.Price, Source.StockQuantity);
END;
GO
    
-- Example Usage:
DECLARE @NewProducts ProductType;
INSERT INTO @NewProducts VALUES ('New2 Laptop', 'Electronics', 1500, 30);
INSERT INTO @NewProducts VALUES ('Laptop Dell XPS 15', 'Electronics', 75000, 20);
EXEC sp_MergeProducts @NewProducts;
select * from Products


-- TASK 6: MERGE Statement for Customers Table

CREATE PROCEDURE sp_MergeCustomers
    @CustomerData CustomerType READONLY
AS
BEGIN
    MERGE INTO Customers AS Target
    USING @CustomerData AS Source
    ON Target.Email = Source.Email
    
    -- Update existing customers
    WHEN MATCHED THEN
        UPDATE SET
            CustomerName = Source.CustomerName,
            Phone = Source.Phone,
            City = Source.City,
            Country = Source.Country,
            Address = Source.Address
    
    -- Insert new customers
    WHEN NOT MATCHED BY TARGET THEN
        INSERT (CustomerName, Email, Phone, City, Country, Address)
        VALUES (Source.CustomerName, Source.Email, Source.Phone, Source.City, Source.Country, Source.Address);
END;
GO

-- Example Usage:
DECLARE @NewCustomers CustomerType;
INSERT INTO @NewCustomers VALUES ('Updated John 2', 'john.smith@email.com', '9999999999', 'Miami', 'USA', 'New Address');
INSERT INTO @NewCustomers VALUES ('New Customer', 'newcustomer@email.com', '8888888888', 'Denver', 'USA', '789 New St');
EXEC sp_MergeCustomers @NewCustomers;
select * from Customers


-- TASK 7: Procedure to Insert Order and Handle Payment (with Partial Payment Support)
-- Inserts an order, handles partial or full payment, and updates order status accordingly.

--DROP PROCEDURE IF EXISTS sp_InsertOrderWithPayment;
--GO

CREATE PROCEDURE sp_InsertOrUpdateOrderWithPayment
    @OrderID INT = NULL,      
    @CustomerID INT,
    @TotalAmount DECIMAL(10,2),
    @PaymentAmount DECIMAL(10,2),
    @PaymentMethod NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalPaid DECIMAL(10,2);
    DECLARE @Status NVARCHAR(20);

    BEGIN TRANSACTION;

    IF @OrderID IS NULL
    BEGIN
        INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, Status)
        VALUES (@CustomerID, GETDATE(), @TotalAmount, 'Pending');

        SET @OrderID = SCOPE_IDENTITY();
    END
    ELSE
    BEGIN
        UPDATE Orders
        SET TotalAmount = @TotalAmount
        WHERE OrderID = @OrderID;
    END

    INSERT INTO Payment (OrderID, PaymentDate, AmountPaid, PaymentMethod)
    VALUES (@OrderID, GETDATE(), @PaymentAmount, @PaymentMethod);

    SELECT @TotalPaid = ISNULL(SUM(AmountPaid), 0)
    FROM Payment
    WHERE OrderID = @OrderID;

    IF @TotalPaid >= @TotalAmount
        SET @Status = 'Completed';
    ELSE
        SET @Status = 'Partial';

    UPDATE Orders
    SET Status = @Status
    WHERE OrderID = @OrderID;

    COMMIT TRANSACTION;

    SELECT 
        @OrderID AS OrderID,
        @TotalAmount AS TotalAmount,
        @TotalPaid AS TotalPaid,
        @Status AS Status;
END;
GO

EXEC sp_InsertOrUpdateOrderWithPayment
    @OrderID = NULL,
    @CustomerID = 3,
    @TotalAmount = 3000,
    @PaymentAmount = 1500,
    @PaymentMethod = 'Card';

EXEC sp_InsertOrUpdateOrderWithPayment
    @OrderID = 1,
    @CustomerID = 3,
    @TotalAmount = 3000,
    @PaymentAmount = 1500,
    @PaymentMethod = 'UPI';



-- TASK 8: Procedure to Delete Customer with Cascading Deletes
-- Deletes a customer and all dependent records using transactional cascading deletes.

CREATE PROCEDURE sp_DeleteCustomerWithCascade
    @CustomerID INT
AS
BEGIN
    BEGIN TRANSACTION;

    -- Delete Payments
    DELETE FROM Payment
    WHERE OrderID IN (
        SELECT OrderID FROM Orders WHERE CustomerID = @CustomerID
    );

    -- Delete Order Details
    DELETE FROM OrderDetails
    WHERE OrderID IN (
        SELECT OrderID FROM Orders WHERE CustomerID = @CustomerID
    );

    -- Delete Orders
    DELETE FROM Orders WHERE CustomerID = @CustomerID;

    -- Delete Customer
    DELETE FROM Customers WHERE CustomerID = @CustomerID;

    COMMIT TRANSACTION;

    PRINT 'Customer deleted successfully';
END;
GO


-- Delete Customer with Cascade
EXEC sp_DeleteCustomerWithCascade @CustomerID = 19;

SELECT * FROM Customers WHERE CustomerID = 20;
SELECT * FROM Orders WHERE CustomerID = 20;
SELECT * FROM Payment 
WHERE OrderID IN (SELECT OrderID FROM Orders WHERE CustomerID = 20);



---------------------------- Advanced Queries

-- TASK 1: Calculate Total Sales Revenue per Product

SELECT 
    p.ProductID,
    p.ProductName,
    p.Category,
    SUM(od.Subtotal) AS TotalRevenue,
    SUM(od.Quantity) AS TotalQuantitySold
FROM Products p
INNER JOIN OrderDetails od ON p.ProductID = od.ProductID
INNER JOIN Orders o ON od.OrderID = o.OrderID
INNER JOIN Payment pay ON o.OrderID = pay.OrderID
WHERE pay.PaymentStatus IN ('Completed', 'Partial')
GROUP BY p.ProductID, p.ProductName, p.Category
ORDER BY TotalRevenue DESC;


-- TASK 2: Identify Customers with High Order Frequency (>5 orders in last 6 months)

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


-- TASK 3: Calculate Average Order Value per Customer

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

DROP TABLE #CustomerAverages;


-- TASK 4: Find Best-Selling Products (Top 10)

DECLARE @BestSellers TABLE (
    ProductID INT,
    ProductName NVARCHAR(100),
    Category NVARCHAR(50),
    TotalQuantitySold INT,
    TotalRevenue DECIMAL(10,2)
);

INSERT INTO @BestSellers
SELECT 
    p.ProductID,
    p.ProductName,
    p.Category,
    SUM(od.Quantity) AS TotalQuantitySold,
    SUM(od.Subtotal) AS TotalRevenue
FROM Products p
INNER JOIN OrderDetails od ON p.ProductID = od.ProductID
GROUP BY p.ProductID, p.ProductName, p.Category;

SELECT TOP 10 * 
FROM @BestSellers 
ORDER BY TotalQuantitySold DESC;


-- Customer & CustomerProducts Table

-- Create separate tables for the final question scenario
CREATE TABLE Customer_Final (
    CustomerId INT PRIMARY KEY,
    Name NVARCHAR(100),
    Address NVARCHAR(255)
);

CREATE TABLE CustomerProducts_Final (
    ProductId INT PRIMARY KEY,
    ProductName NVARCHAR(100),
    CustomerIDs NVARCHAR(MAX) -- Comma-separated customer IDs
);

-- Insert sample data matching the question
INSERT INTO Customer_Final (CustomerId, Name, Address) VALUES
(1, 'Jeshal', 'Amreli'),
(2, 'Jigna', 'Ahmedabad'),
(3, 'Rajesh', 'Baroda');

INSERT INTO CustomerProducts_Final (ProductId, ProductName, CustomerIDs) VALUES
(1, 'Nokia', '1,2,3'),
(2, 'Iphone', '2,3'),
(3, 'Samsung', '1');

GO
select * from CustomerProducts_Final
select * from Customer_Final

-- Display Customers with Their Products

;WITH CustomerProductMapping AS (
    SELECT
        c.CustomerId,
        c.Name AS CustomerName,
        c.Address,
        cp.ProductName
    FROM Customer_Final c
    CROSS JOIN CustomerProducts_Final cp
    CROSS APPLY STRING_SPLIT(cp.CustomerIDs, ',') s
    WHERE CAST(s.value AS INT) = c.CustomerId
)
SELECT
    CustomerId,
    CustomerName,
    Address,
    STRING_AGG(ProductName, ', ') AS Products
FROM CustomerProductMapping
GROUP BY CustomerId, CustomerName, Address
ORDER BY CustomerId;
GO

-- 
SELECT COUNT(*) AS TotalCustomers FROM Customers;

SELECT COUNT(*) AS TotalProducts FROM Products;

SELECT COUNT(*) AS TotalOrders FROM Orders;

SELECT COUNT(*) AS TotalPayments FROM Payment;