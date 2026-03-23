-- 
CREATE DATABASE SQL_Exam

USE SQL_Exam

--Section 1: Table Creation

-- Table 1: Customers
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Address NVARCHAR(200)
);

-- Table 2: Products
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL
);

-- Table 3: Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Table 4: Cart
CREATE TABLE Cart (
    CartID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    AddedDate DATE NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Table 5: OrderDetails Table 
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Insert Customers
INSERT INTO Customers (CustomerID, Name, Email, Address) VALUES
(1, 'John Doe', 'john@example.com', '123 Elm St'),
(2, 'Jane Smith', 'jane@example.com', '456 Oak St'),
(3, 'Alice Brown', 'alice@example.com', '789 Pine St'),
(4, 'Bob Wilson', 'bob@example.com', '321 Maple Ave'),
(5, 'Carol Davis', 'carol@example.com', '654 Cedar Ln');

-- Insert Products
INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES
(101, 'Laptop', 800.00, 50),
(102, 'Smartphone', 500.00, 30),
(103, 'Headphones', 150.00, 100),
(104, 'Mouse', 25.00, 200),
(105, 'Keyboard', 75.00, 150);

-- Insert Orders
INSERT INTO Orders (OrderID, CustomerID, OrderDate, TotalAmount) VALUES
(201, 1, '2024-08-01', 1200.00),
(202, 2, '2024-08-03', 500.00),
(203, 1, '2024-08-05', 800.00),
(204, 3, '2025-01-15', 1600.00),
(205, 3, '2025-01-20', 300.00),
(206, 4, '2024-12-10', 250.00),
(207, 1, '2025-02-01', 450.00),
(208, 5, '2024-06-15', 100.00)

INSERT INTO Orders (OrderID, CustomerID, OrderDate, TotalAmount) VALUES
(211, 5, '2024-06-15', 500.00)

-- Insert Cart
INSERT INTO Cart (CartID, CustomerID, ProductID, Quantity, AddedDate) VALUES
(301, 1, 101, 2, '2024-07-28'),
(302, 2, 102, 1, '2024-07-29'),
(303, 3, 103, 3, '2024-07-30'),
(304, 4, 104, 5, '2025-02-01');

-- Insert OrderDetails
INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice) VALUES
-- Order 201
(201, 101, 1, 800.00),
(201, 104, 4, 25.00),
(201, 103, 2, 150.00),
-- Order 202
(202, 102, 1, 500.00),
-- Order 203
(203, 101, 1, 800.00),
-- Order 204
(204, 101, 2, 800.00),
-- Order 205
(205, 103, 2, 150.00),
-- Order 206
(206, 105, 1, 75.00),
(206, 104, 7, 25.00),
-- Order 207
(207, 102, 1, 500.00),
(207, 103, 3, 150.00),
-- Order 208
(208, 104, 4, 25.00);

SELECT * FROM Customers
SELECT * FROM Orders
SELECT * FROM Products
SELECT * FROM Cart
SELECT * FROM OrderDetails


-- Section 2: Order Grouping Record and Report 

-- Task 2 Group orders by customer and report total amount spent
SELECT 
    c.CustomerID, 
    c.Name,
    SUM(o.TotalAmount) AS TotalAmountSpent
FROM Customers c 
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.Name
ORDER BY TotalAmountSpent DESC;

-- Task 3: List top 5 products based on highest number of orders
SELECT
    TOP 5
    od.ProductID,
    p.ProductName,
    COUNT(od.Quantity) AS OrderCount
FROM Products p
INNER JOIN OrderDetails od ON p.ProductID = od.ProductID
GROUP BY od.ProductID,p.ProductName

-- Section 3: Stored Procedure for Insert and Update 

-- Task 4: Stored procedure to insert or update product

-- DROP PROCEDURE sp_UpsertProduct
CREATE PROCEDURE sp_UpsertProduct
    @ProductID INT,
    @ProductName VARCHAR(50),
    @Price DECIMAL(10,2),
    @StockQuantity INT
AS
    IF EXISTS(SELECT 1 FROM Products WHERE ProductID = @ProductID)
    BEGIN
        UPDATE Products
        SET 
            ProductName = @ProductName,
            Price = @Price,
            StockQuantity = @StockQuantity
            WHERE ProductID = @ProductID
    END
    ELSE
    BEGIN
        INSERT INTO 
        Products (ProductID, ProductName, Price, StockQuantity)
        VALUES (@ProductID, @ProductName, @Price, @StockQuantity) 
    END

EXEC sp_UpsertProduct 106, 'Monitor', 25000, 75;
EXEC sp_UpsertProduct 101, 'Laptop', 850.00, 48;
EXEC sp_UpsertProduct 107, 'Mouse Pad', 300, 90;
SELECT * FROM Products

-- Task 5: Stored procedure to insert new order and update stock
ALTER PROCEDURE sp_InsertOrder
    @OrderID INT,
    @CustomerID VARCHAR(100),
    @OrderDate DATE,
    @ProductID INT,
    @Quantity INT,
    @UnitPrice DECIMAL(10, 2)
AS
BEGIN 
    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @TotalAmount DECIMAL (10,2);
        DECLARE @CurrentStock INT;

        SET @TotalAmount = @Quantity * @UnitPrice;

        SELECT @CurrentStock = StockQuantity 
        FROM Products
        WHERE ProductID = @ProductID;

        IF @CurrentStock < @Quantity
        BEGIN 
            ROLLBACK TRANSACTION;
            RETURN;
        END

        INSERT INTO Orders (OrderID, CustomerID, OrderDate, TotalAmount)
        VALUES (@OrderID,@CustomerID,@OrderDate, @TotalAmount)

        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
        VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);
        
        UPDATE Products
        SET StockQuantity = @CurrentStock - @Quantity
        WHERE ProductID = @ProductID;

        COMMIT TRANSACTION;

        SELECT OrderID, CustomerID, OrderDate, TotalAmount
        FROM Orders
        WHERE OrderID = @OrderID

        SELECT ProductID, ProductName, StockQuantity
        FROM Products
        WHERE ProductID = @ProductID
END TRY
BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
SELECT * FROM Products
SELECT * FROM OrderDetails
SELECT * FROM Orders


EXEC sp_InsertOrder 209, 1, '2025-02-11', 101, 2, 800.00;
EXEC sp_InsertOrder 210, 3, '2026-02-11', 101, 3, 223;


-- SECTION 4: STORED PROCEDURES WITH FUNCTIONS

-- Task 6: Function to calculate discount

ALTER FUNCTION dbo.fn_CalculateDiscount
    ( @Amount DECIMAL(10,2))
    RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @Discount DECIMAL(10, 2);
    SET @Discount = CASE 
        WHEN @Amount >= 1000 THEN @Amount*0.20
        WHEN @Amount >= 500 THEN @Amount*0.10 
        ELSE @Amount*0.0
    END;

    RETURN @Discount
END;

SELECT dbo.fn_CalculateDiscount(2000) AS DiscountAmount;
SELECT dbo.fn_CalculateDiscount(550) AS DiscountAmount;
SELECT dbo.fn_CalculateDiscount(70) AS DiscountAmount;

-- Task 7: Stored procedure to apply discount
ALTER PROCEDURE  sp_ApplyDiscount
    @OrderID INT
AS
BEGIN
    DECLARE @OriginalAmount DECIMAL(10,2);
    DECLARE @DiscountApplied DECIMAL(10,2);
    DECLARE @FinalAmount DECIMAL(10,2);
    DECLARE @DiscountPercent VARCHAR(10);

    SELECT @OriginalAmount = TotalAmount 
    FROM Orders
    WHERE OrderID = @OrderID;

    SET @DiscountApplied = dbo.fn_CalculateDiscount(@OriginalAmount);
    SET @FinalAmount = @OriginalAmount - @DiscountApplied;

    IF @OriginalAmount >= 1000
        SET @DiscountPercent = '20%';
    ELSE IF @OriginalAmount >= 500
        SET @DiscountPercent = '10%';
    ELSE
        SET @DiscountPercent = '0%';

    SELECT 
        @OrderID AS OrderID,
        @OriginalAmount AS OriginalAmount,
        CAST(@DiscountApplied AS VARCHAR(20)) 
        + ' (' + @DiscountPercent + ')' AS DiscountApplied,
        @FinalAmount AS FinalAmount
    FROM Orders
    WHERE OrderID = @OrderID
END

EXEC sp_ApplyDiscount 201;
EXEC sp_ApplyDiscount 203;
EXEC sp_ApplyDiscount 210;


-- SECTION 5: STORED PROCEDURE WITH STRING SPLITTING & JOINS

-- Task 8: Split comma-separated ProductIDs and display details

CREATE PROCEDURE sp_GetProductDetailsByIDs
    @ProductIDs VARCHAR(MAX)
AS
BEGIN
    CREATE TABLE #TeamProductIDs(
        ProductID INT
    );

    INSERT INTO #TeamProductIDs(ProductID)
    SELECT CAST(value AS INT)
    FROM string_split(@ProductIDs, ',')
    WHERE RTRIM(value) <> '';

    SELECT 
        p.ProductID,
        p.ProductName,
        p.Price,
        p.StockQuantity
    FROM Products p
    INNER JOIN #TeamProductIDs t ON t.ProductID = p.ProductID
    ORDER BY p.ProductID;

    DROP TABLE #TeamProductIDs;
END;

EXEC sp_GetProductDetailsByIDs '101,103,105'


-- SECTION 6: ADVANCED ANALYTICS & BUSINESS LOGIC

-- Task 9: Calculate product statistics
ALTER PROCEDURE sp_ProductStatistics
AS
BEGIN  
    SELECT
        p.ProductID,
        p.ProductName,
        SUM(od.Quantity) AS TotalSold,
        CAST(SUM(od.Quantity * od.UnitPrice) AS DECIMAL(10,2)) 
        AS TotalRevenue, 
        CAST(AVG(od.Quantity) 
        AS DECIMAL(10,2)) AS AvgOrderQty,
        CAST(STDEV(od.Quantity) AS DECIMAL(10,2)) AS StdDevOrderQty
    FROM Products p 
    INNER JOIN OrderDetails od
    ON p.ProductID = od.ProductID  
    GROUP BY  p.ProductID, p.ProductName
    ORDER BY TotalRevenue DESC;
END

EXEC sp_ProductStatistics;

-- Products (ProductID, ProductName, Price, StockQuantity) 
-- OrderDetails (OrderID, ProductID, Quantity, UnitPrice) 

-- Task 10: Find customers with no orders in last 6 months
ALTER PROCEDURE sp_InactiveCustomers
AS
BEGIN
    DECLARE @SixMonthsAgo DATE = DATEADD(MONTH, -6, GETDATE());

    SELECT
        c.CustomerID,
        c.Name AS CustomerName,
        ISNULL(MAX(o.OrderDate), 'No orders') AS LastOrderDate
   FROM Customers c
   LEFT JOIN Orders o
        ON o.CustomerID = c.CustomerID
        GROUP BY c.CustomerID, c.Name
        HAVING MAX(o.OrderDate) < @SixMonthsAgo 
END


-- Task 11: Categorize customers into tiers (Gold/Silver/Bronze)
ALTER PROCEDURE sp_CustomerTierCategorization
AS
BEGIN
    
    SELECT
        c.CustomerID,
        c.Name AS CustomerName,
        CASE 
            WHEN COUNT(o.OrderID) >=3 AND 
                 SUM(o.TotalAmount) >1000
            THEN 'Gold'
            WHEN COUNT(o.OrderID) =2 AND 
                 SUM(o.TotalAmount) >=500
            THEN 'Silver'
            ELSE 'Bronze'
        END AS Category,
        COUNT(o.OrderID)  AS 'Number Of Orders',
        SUM(o.TotalAmount) AS 'Order Amount'

    FROM Customers c
    INNER JOIN Orders o ON o.CustomerID = c.CustomerID
    GROUP BY c.CustomerID, c.Name
    ORDER BY 
        CASE
            WHEN COUNT(o.OrderID) >= 3 AND SUM(o.TotalAmount) > 1000 THEN 1
            WHEN COUNT(o.OrderID) = 2 AND SUM(o.TotalAmount) >= 500 THEN 2
            ELSE 3
        END,
       'Order Amount' DESC;
END;

EXEC sp_CustomerTierCategorization