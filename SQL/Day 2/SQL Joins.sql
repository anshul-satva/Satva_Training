Create Database OrderManagementDB;


USE OrderManagementDB;

-- Creating Department Table
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL,
    Location VARCHAR(100)
);

-- Creating Customers Table
CREATE TABLE Customers (
    CustomerId INT PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    DepartmentId INT,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId)
);

-- Creating Orders table
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    CustomerId INT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10, 2),
    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
);


-- Insert Departments (7 departments)
INSERT INTO Departments (DepartmentId, DepartmentName, Location) VALUES
(1, 'Sales', 'New York'),
(2, 'Marketing', 'Los Angeles'),
(3, 'Finance', 'Chicago'),
(4, 'IT', 'San Francisco'),
(5, 'HR', 'Boston'),
(6, 'Operations', 'Miami'),
(7, 'Customer Service', 'Seattle');

INSERT INTO Departments (DepartmentId, DepartmentName, Location) VALUES
(8, 'Research & Development', 'Austin');


-- Insert Customers
INSERT INTO Customers (CustomerId, CustomerName, Email, Phone, DepartmentId) VALUES
-- Sales Department (4 customers)
(1, 'Robert Martinez', 'robert.martinez@company.com', '5551001001', 1),
(2, 'Emily Johnson', 'emily.johnson@company.com', '5551001002', 1),
(3, 'David Kim', 'david.kim@company.com', '5551001003', 1),
(4, 'Sarah Thompson', 'sarah.thompson@company.com', '5551001004', 1),

-- Marketing Department (3 customers)
(5, 'Jennifer Lee', 'jennifer.lee@company.com', '5551002001', 2),
(6, 'Michael Chen', 'michael.chen@company.com', '5551002002', 2),
(7, 'Amanda Rodriguez', 'amanda.rodriguez@company.com', '5551002003', 2),

-- Finance Department (3 customers)
(8, 'Christopher Davis', 'chris.davis@company.com', '5551003001', 3),
(9, 'Jessica Williams', 'jessica.williams@company.com', '5551003002', 3),
(10, 'Daniel Brown', 'daniel.brown@company.com', '5551003003', 3),

-- IT Department (3 customers)
(11, 'Matthew Wilson', 'matthew.wilson@company.com', '5551004001', 4),
(12, 'Ashley Garcia', 'ashley.garcia@company.com', '5551004002', 4),
(13, 'James Anderson', 'james.anderson@company.com', '5551004003', 4),

-- HR Department (2 customers)
(14, 'Lauren Taylor', 'lauren.taylor@company.com', '5551005001', 5),
(15, 'Ryan Martinez', 'ryan.martinez@company.com', '5551005002', 5),

-- Operations Department (2 customers)
(16, 'Stephanie Clark', 'stephanie.clark@company.com', '5551006001', 6),
(17, 'Kevin Lewis', 'kevin.lewis@company.com', '5551006002', 6),

-- Customer Service Department (2 customers)
(18, 'Michelle Walker', 'michelle.walker@company.com', '5551007001', 7),
(19, 'Brian Hall', 'brian.hall@company.com', '5551007002', 7),

-- R&D Department (1 customer - no orders for Task 7)
(20, 'Nicole Allen', 'nicole.allen@company.com', '5551008001', 8);

select * from Departments
select * from Customers
select * from Orders

-- Insert Orders 
INSERT INTO Orders (OrderId, CustomerId, OrderDate, TotalAmount) VALUES
-- 2024 Orders 
(1001, 1, '2024-01-05', 450.00),
(1002, 2, '2024-01-08', 320.00),
(1003, 5, '2024-01-12', 590.00),
(1004, 8, '2024-01-15', 275.00),
(1005, 11, '2024-01-18', 410.00),
(1006, 1, '2024-01-22', 380.00),
(1007, 3, '2024-01-25', 525.00),
(1008, 6, '2024-01-28', 340.00),
(1009, NULL, '2024-02-01', 299.00),  -- Order without customer
(1010, 9, '2024-02-04', 485.00),
(1011, 2, '2024-02-07', 395.00),
(1012, 14, '2024-02-10', 220.00),
(1013, 5, '2024-02-14', 680.00),
(1014, 12, '2024-02-17', 310.00),
(1015, 16, '2024-02-20', 435.00),
(1016, 18, '2024-02-23', 265.00),
(1017, 1, '2024-02-26', 540.00),
(1018, 7, '2024-03-02', 370.00),
(1019, 10, '2024-03-05', 495.00),
(1020, 3, '2024-03-08', 325.00),
(1021, 13, '2024-03-12', 445.00),
(1022, 15, '2024-03-15', 390.00),
(1023, 4, '2024-03-18', 515.00),
(1024, 6, '2024-03-22', 355.00),
(1025, 8, '2024-03-25', 425.00),
(1026, 17, '2024-03-28', 295.00),
(1027, 19, '2024-04-01', 335.00),
(1028, 2, '2024-04-05', 470.00),
(1029, 11, '2024-04-08', 385.00),
(1030, 5, '2024-04-12', 555.00),
(1031, 9, '2024-04-15', 305.00),
(1032, 12, '2024-04-18', 420.00),
(1033, NULL, '2024-04-22', 350.00),  -- Another order without customer
(1034, 14, '2024-04-25', 280.00),
(1035, 16, '2024-04-28', 460.00),
(1036, 1, '2024-05-02', 395.00),
(1037, 18, '2024-05-05', 315.00),
(1038, 7, '2024-05-08', 485.00),

-- 2023 Orders 
(1039, 1, '2023-10-15', 405.00),
(1040, 2, '2023-10-20', 365.00),
(1041, 5, '2023-11-05', 520.00),
(1042, 8, '2023-11-12', 290.00),
(1043, 11, '2023-11-25', 440.00),
(1044, 3, '2023-12-08', 375.00),
(1045, 6, '2023-12-18', 495.00);

PRINT 'Departments Count:';
SELECT COUNT(*) AS TotalDepartments FROM Departments;
PRINT 'Customers Count:';
SELECT COUNT(*) AS TotalCustomers FROM Customers;
PRINT 'Orders Count:';
SELECT COUNT(*) AS TotalOrders FROM Orders;


-- TASK 1: INNER JOIN
-- Orders with customer names (INNER JOIN)
SELECT 
    o.OrderId AS 'Order ID',
    c.CustomerName AS 'Customer Name',
    o.OrderDate AS 'Order Date'
FROM Orders o
INNER JOIN Customers c ON o.CustomerId = c.CustomerId
ORDER BY o.OrderId;

-- TASK 2: LEFT JOIN
-- Include orders placed by customers not registered
SELECT 
    o.OrderId AS 'Order ID',
    c.CustomerName AS 'Customer Name',
    o.OrderDate AS 'Order Date'
FROM Orders o
LEFT JOIN Customers c ON o.CustomerId = c.CustomerId
ORDER BY o.OrderId;

-- TASK 3: RIGHT JOIN
-- All customers including those without orders
SELECT 
    o.OrderId AS 'Order ID',
    c.CustomerName AS 'Customer Name',
    o.OrderDate AS 'Order Date'
FROM Orders o
RIGHT JOIN Customers c ON o.CustomerId = c.CustomerId
ORDER BY o.OrderId;

-- TASK 4: FULL OUTER JOIN
-- All orders and all customers
SELECT 
    o.OrderId AS 'Order ID',
    c.CustomerName AS 'Customer Name',
    o.OrderDate AS 'Order Date'
FROM Orders o
FULL OUTER JOIN Customers c ON o.CustomerId = c.CustomerId
ORDER BY o.OrderId;

-- TASK 5: CROSS JOIN
-- All possible combinations
SELECT 
    o.OrderId AS 'Order ID',
    c.CustomerName AS 'Customer Name',
    o.OrderDate AS 'Order Date'
FROM Orders o
CROSS JOIN Customers c
ORDER BY o.OrderId, c.CustomerName;

-- TASK 6: Top 3 Customers by Total Amount
SELECT 
    c.CustomerId AS 'Customer ID',
    c.CustomerName AS 'Customer Name',
    COUNT(o.OrderId) AS 'Total Orders',
    SUM(o.TotalAmount) AS 'Total Amount Spent'
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY c.CustomerId, c.CustomerName
ORDER BY SUM(o.TotalAmount) DESC
OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY;

-- TASK 7: Customers Without Orders
SELECT 
    c.CustomerId AS 'Customer ID',
    c.CustomerName AS 'C    ustomer Name',
    c.Email AS 'Email',
    c.Phone AS 'Phone'
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE o.OrderId IS NULL;

-- TASK 8: Customer Orders in 2024
SELECT 
    c.CustomerId AS 'Customer ID',
    c.CustomerName AS 'Customer Name',
    COUNT(o.OrderId) AS 'Total Orders',
    SUM(o.TotalAmount) AS 'Total Amount Spent'
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId 
    AND YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName
ORDER BY c.CustomerId;

-- TASK 9: Top 5 Departments by Average
SELECT 
    d.DepartmentId AS 'Department ID',
    d.DepartmentName AS 'Department Name',
    AVG(o.TotalAmount) AS 'Average Total Amount Spent'
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY AVG(o.TotalAmount) DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;

-- TASK 10: Department with Most Orders
SELECT TOP 1
    d.DepartmentId AS 'Department ID',
    d.DepartmentName AS 'Department Name',
    COUNT(o.OrderId) AS 'Total Orders'
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY COUNT(o.OrderId) DESC;

-- TASK 11: Top 3 Customers in 2024
SELECT 
    c.CustomerId AS 'Customer ID',
    c.CustomerName AS 'Customer Name',
    SUM(o.TotalAmount) AS 'Total Amount Spent'
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2024
GROUP BY c.CustomerId, c.CustomerName
ORDER BY SUM(o.TotalAmount) DESC
OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY;

-- TASK 12: Departments with 2+ Employees
SELECT 
    d.DepartmentId AS 'Department ID',
    d.DepartmentName AS 'Department Name',
    COUNT(DISTINCT o.OrderId) AS 'Total Orders'
FROM Departments d
INNER JOIN Customers c ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o ON c.CustomerId = o.CustomerId
WHERE d.DepartmentId IN (
    SELECT DepartmentId
    FROM Customers
    GROUP BY DepartmentId
    HAVING COUNT(CustomerId) >= 2
)
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY COUNT(DISTINCT o.OrderId) DESC;

-- TASK 13: Customers in Both 2023 and 2024
SELECT 
    c.CustomerId AS 'Customer ID',
    c.CustomerName AS 'Customer Name',
    c.Email AS 'Email',
    c.Phone AS 'Phone'
FROM Customers c
WHERE c.CustomerId IN (
    SELECT CustomerId
    FROM Orders
    WHERE YEAR(OrderDate) = 2023
)
AND c.CustomerId IN (
    SELECT CustomerId
    FROM Ordersx 
);

select * from Departments
select * from Customers
select * from Orders    