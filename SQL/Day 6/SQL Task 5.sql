

CREATE DATABASE RetailManagementDB;
GO

USE RetailManagementDB
GO

-- Customer Table
CREATE TABLE Customers (
	Customer_id INT PRIMARY KEY IDENTITY(1,1),
	First_name NVARCHAR(100) NOT NULL,
	Last_name NVARCHAR(100) NOT NULL,
	Email NVARCHAR(30) UNIQUE NOT NULL,
	Phone VARCHAR(20),
	Address NVARCHAR(200),
	City NVARCHAR(40),
	State_province NVARCHAR(50),
	Country VARCHAR(50),
    Postal_code VARCHAR(20),
    Date_of_birth DATE,
    Gender VARCHAR(10)
);

-- Departments table 
CREATE TABLE Departments (
    Department_id INT PRIMARY KEY IDENTITY(1,1),
    Department_name VARCHAR(100) NOT NULL
);

-- Employees table with department reference
CREATE TABLE Employees (
    Employee_id INT PRIMARY KEY IDENTITY(1,1),
    First_name VARCHAR(50) NOT NULL,
    Last_name VARCHAR(50) NOT NULL,
    Department_id INT,
    Salary DECIMAL(10,2),
    FOREIGN KEY (Department_id) REFERENCES Departments(Department_id)
);

-- Salary history to track salary changes
CREATE TABLE Salary_History (
    Sync_History_id INT PRIMARY KEY IDENTITY(1,1),
    Employee_id INT,
    Salary DECIMAL(10,2),
    Effective_date DATE,
    FOREIGN KEY (Employee_id) REFERENCES Employees(Employee_id)
);

-- Products table with category information
CREATE TABLE Products (
    Product_id INT PRIMARY KEY IDENTITY(1,1),
    Product_name VARCHAR(100) NOT NULL,
    Category_name VARCHAR(50),
    Unit_price DECIMAL(10,2) DEFAULT 10,
    Featured BIT DEFAULT 0
);

-- Promotions table for managing product discounts
CREATE TABLE Promotions (
    Promotion_id INT PRIMARY KEY IDENTITY(1,1),
    Product_id INT,
    Promotion_name VARCHAR(100),
    Start_date DATE,
    End_date DATE,
    DiscountAmount DECIMAL(10,2) DEFAULT 2,
    Active BIT DEFAULT 1,
    FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
);

-- Orders table to track customer purchases
CREATE TABLE Orders (
    Order_id INT PRIMARY KEY IDENTITY(1,1),
    Promotion_id INT NULL,
    Product_id INT,
    Quantity INT DEFAULT 2,
    Customer_id INT,
    Order_date DATETIME,
    Price DECIMAL(10,2) DEFAULT 8,
    FOREIGN KEY (Promotion_id) REFERENCES Promotions(Promotion_id),
    FOREIGN KEY (Product_id) REFERENCES Products(Product_id),
    FOREIGN KEY (Customer_id) REFERENCES Customers(Customer_id)
);

-- Summary table for category-wise revenue tracking
CREATE TABLE Category_Summary (
    Category_summary_id INT PRIMARY KEY IDENTITY(1,1),
    Category_name VARCHAR(50),
    Revenue DECIMAL(15,2)
);

SELECT table_name, table_schema, table_type
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';

INSERT INTO Departments (Department_name) VALUES
('Sales'),
('Marketing'),
('IT'),
('Human Resources'),
('Finance'),
('Operations'),
('Customer Service');

INSERT INTO Employees (First_name, Last_name, Department_id, Salary) VALUES
('John', 'Martinez', 1, 45000.00),
('Sarah', 'Anderson', 1, 52000.00),
('Michael', 'Thompson', 2, 48000.00),
('Emily', 'Davis', 2, 55000.00),
('David', 'Wilson', 3, 65000.00),
('Jennifer', 'Brown', 3, 72000.00),
('Robert', 'Taylor', 4, 42000.00),
('Lisa', 'Moore', 5, 58000.00),
('James', 'White', 5, 61000.00),
('Maria', 'Garcia', 6, 47000.00),
('Christopher', 'Rodriguez', 1, 49000.00),
('Amanda', 'Lee', 3, 68000.00),
('Daniel', 'Harris', 7, 38000.00),
('Jessica', 'Clark', 2, 51000.00);

INSERT INTO Salary_History (Employee_id, Salary, Effective_date) VALUES
(1, 42000.00, '2023-01-15'),
(1, 45000.00, '2024-01-15'),
(2, 48000.00, '2023-03-01'),
(2, 52000.00, '2024-03-01'),
(3, 45000.00, '2023-02-10'),
(3, 48000.00, '2024-02-10'),
(5, 60000.00, '2023-06-01'),
(5, 65000.00, '2024-06-01'),
(6, 68000.00, '2023-04-15'),
(6, 72000.00, '2024-04-15'),
(8, 55000.00, '2023-05-20'),
(8, 58000.00, '2024-05-20');

INSERT INTO Customers (First_name, Last_name, Email, Phone, Address, City, State_province, Country, Postal_code, Date_of_birth, Gender) VALUES
('Alex', 'Johnson', 'alex.johnson@email.com', '555-0101', '123 Oak Street', 'Seattle', 'Washington', 'USA', '98101', '1985-03-15', 'Male'),
('Emma', 'Williams', 'emma.williams@email.com', '555-0102', '456 Pine Avenue', 'Portland', 'Oregon', 'USA', '97201', '1990-07-22', 'Female'),
('Oliver', 'Jones', 'oliver.jones@email.com', '555-0103', '789 Maple Drive', 'San Francisco', 'California', 'USA', '94102', '1988-11-30', 'Male'),
('Sophia', 'Brown', 'sophia.brown@email.com', '555-0104', '321 Elm Boulevard', 'Los Angeles', 'California', 'USA', '90001', '1992-05-18', 'Female'),
('William', 'Davis', 'william.davis@email.com', '555-0105', '654 Cedar Lane', 'Denver', 'Colorado', 'USA', '80201', '1987-09-25', 'Male'),
('Ava', 'Miller', 'ava.miller@email.com', '555-0106', '987 Birch Road', 'Austin', 'Texas', 'USA', '73301','1976-09-25', 'Female'),
('Noah', 'Wilson', 'noah.wilson@email.com', '555-0107', '147 Spruce Court', 'Chicago', 'Illinois', 'USA', '60601', '1991-12-08', 'Male'),
('Isabella', 'Moore', 'isabella.moore@email.com', '555-0108', '258 Willow Way', 'Boston', 'Massachusetts', 'USA', '02101', '1989-04-14', 'Female'),
('Lucas', 'Taylor', 'lucas.taylor@email.com', '555-0109', '369 Ash Street', 'Miami', 'Florida', 'USA', '33101', '1993-08-20', 'Male'),
('Mia', 'Anderson', 'mia.anderson@email.com', '555-0110', '741 Poplar Avenue', 'Phoenix', 'Arizona', 'USA', '85001', '1986-02-11', 'Female'),
('Ethan', 'Thomas', 'ethan.thomas@email.com', '555-0111', '852 Hickory Drive', 'Atlanta', 'Georgia', 'USA', '30301', '1994-06-05', 'Male'),
('Charlotte', 'Jackson', 'charlotte.jackson@email.com', '555-0112', '963 Magnolia Lane', 'Dallas', 'Texas', 'USA', '75201', '1990-10-17', 'Female');

-- Adding products across different categories
INSERT INTO Products (Product_name, Category_name, Unit_price, Featured) VALUES
('Wireless Mouse', 'Electronics', 25.99, 0),
('USB Keyboard', 'Electronics', 35.50, 0),
('HD Monitor', 'Electronics', 199.99, 0),
('Office Chair', 'Furniture', 149.99, 0),
('Standing Desk', 'Furniture', 399.99, 0),
('Notebook Pack', 'Stationery', 12.99, 0),
('Pen Set', 'Stationery', 8.99, 0),
('Laptop Bag', 'Accessories', 45.99, 0),
('Phone Stand', 'Accessories', 15.99, 0),
('Webcam HD', 'Electronics', 79.99, 0),
('Desk Lamp', 'Furniture', 34.99, 0),
('Sticky Notes', 'Stationery', 5.99, 0),
('Cable Organizer', 'Accessories', 11.99, 0),
('Portable SSD', 'Electronics', 129.99, 0);

-- Creating promotions for products
INSERT INTO Promotions (Product_id, Promotion_name, Start_date, End_date, DiscountAmount, Active) VALUES
(1, 'Summer Sale', '2025-06-01', '2025-08-31', 5.00, 1),
(3, 'Tech Week Special', '2025-05-15', '2025-05-22', 30.00, 1),
(5, 'Office Essentials', '2025-04-01', '2025-06-30', 50.00, 1),
(10, 'Remote Work Deal', '2025-03-01', '2025-04-30', 15.00, 0),
(14, 'Storage Bonanza', '2024-12-01', '2025-02-28', 20.00, 1);

SELECT * FROM Promotions
SELECT * FROM Orders
INSERT INTO Orders (Promotion_id, Product_id, Quantity, Customer_id, Order_date, Price) 
VALUES
(NULL, 1, 2, 1, '2025-02-02 10:00:00', 51.98)
-- Inserting orders with various dates and quantities
INSERT INTO Orders (Promotion_id, Product_id, Quantity, Customer_id, Order_date, Price) VALUES
-- January orders
(NULL, 1, 1, 1, '2025-01-05 10:30:00', 25.99),
(NULL, 6, 3, 2, '2025-01-08 14:20:00', 38.97),
(NULL, 4, 1, 3, '2025-01-12 09:15:00', 149.99),
(NULL, 10, 2, 4, '2025-01-15 16:45:00', 159.98),
(5, 14, 1, 5, '2025-01-20 11:30:00', 109.99),
-- February orders (current month for the task)
(NULL, 1, 2, 1, '2025-02-02 10:00:00', 51.98),
(NULL, 1, 1, 2, '2025-02-03 13:30:00', 25.99),
(NULL, 1, 3, 3, '2025-02-04 15:20:00', 77.97),
(NULL, 2, 2, 1, '2025-02-05 09:45:00', 71.00),
(NULL, 3, 1, 4, '2025-02-06 14:15:00', 199.99),
(NULL, 7, 5, 2, '2025-02-07 10:30:00', 44.95),
(NULL, 9, 2, 5, '2025-02-08 16:00:00', 31.98),
(NULL, 11, 1, 6, '2025-02-09 11:20:00', 34.99),
(NULL, 1, 1, 7, '2025-02-09 12:45:00', 25.99),
(1, 1, 2, 4, '2025-02-10 08:30:00', 41.98),
(NULL, 6, 4, 3, '2025-02-01 13:00:00', 51.96),
(NULL, 8, 1, 8, '2025-02-02 15:30:00', 45.99),
(NULL, 12, 10, 9, '2025-02-03 10:15:00', 59.90),
(NULL, 13, 3, 10, '2025-02-04 14:45:00', 35.97),
(NULL, 2, 1, 11, '2025-02-05 09:30:00', 35.50),
-- December 2024 orders (for last 3 months view)
(NULL, 3, 1, 6, '2024-12-10 10:00:00', 199.99),
(NULL, 5, 1, 7, '2024-12-15 14:30:00', 399.99),
(4, 10, 1, 8, '2024-12-20 11:45:00', 64.99),
(5, 14, 2, 9, '2024-12-22 16:20:00', 219.98),
-- November 2024 orders
(NULL, 4, 2, 10, '2024-11-05 09:00:00', 299.98),
(NULL, 11, 1, 11, '2024-11-18 13:15:00', 34.99),
(NULL, 2, 1, 12, '2024-11-25 15:40:00', 35.50);


---------------------------------------------------------------------- Task 1: RANK
SELECT
    e.Employee_id,
    e.First_name + ' ' + e.Last_name AS Employee_Name,
    d.Department_name,
    e.Salary,
    RANK() OVER (PARTITION BY e.Department_id
    ORDER BY e.Salary DESC) AS Salary_Rank
FROM Employees e
INNER JOIN Departments d ON e.Department_id = d.Department_id
ORDER BY d.Department_name, Salary_Rank

---------------------------------------------------------------------- Task 2: DENSE RANK
SELECT TOP 3
    c.Customer_id,
    c.First_name + ' ' + c.Last_name AS Customer_Name,
    COUNT(o.Order_id) AS Total_Orders_This_Month,
    DENSE_RANK() OVER (ORDER BY COUNT(o.Order_id) DESC) AS Customer_Dense_Rank
FROM 
    Customers c
INNER JOIN 
    Orders o ON c.Customer_id = o.Customer_id
WHERE 
    MONTH(o.Order_date) = 2 AND YEAR(o.Order_date) = 2025
GROUP BY 
    c.Customer_id, c.First_name, c.Last_name
ORDER BY 
    Customer_Dense_Rank;

---------------------------------------------------------------------- Task 3: ROW NUMBER
SELECT 
    c.Customer_id,
    c.First_name + ' ' + c.Last_name AS Customer_Name,
    o.Order_id,
    o.Order_date,
    o.Product_id,
    o.Quantity,
    ROW_NUMBER() 
    OVER(PARTITION BY c.customer_id ORDER BY o.order_date)
    Order_Row_Number,
    COUNT(o.order_id)
    OVER (PARTITION BY c.Customer_id) AS Total_Orders_For_Customer
FROM Orders o 
INNER JOIN Customers c ON c.Customer_id = o.Customer_id
ORDER BY 
    c.Customer_id, Order_Row_Number;

---------------------------------------------------------------------- Task:4 SUBQUERIES

-- INSERT: Adding new promotions for 5 products
INSERT INTO 
    Promotions 
    (Product_id, Promotion_name, Start_date, End_date, DiscountAmount, Active)
SELECT Product_id, 
       'Spring Clearance - ' + Product_name,
       '2025-03-01',
       '2025-03-31',
       Unit_price * 0.15,
       1
FROM Products
WHERE Product_id IN (2, 4, 6, 8, 12);
SELECT * FROM Promotions

-- Update
CREATE TRIGGER trg_UpdateFeaturedProducts
ON Orders
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CurrentMonth INT = MONTH(GETDATE());
    DECLARE @CurrentYear INT = YEAR(GETDATE());

    UPDATE Products
    SET Featured = 1
    WHERE Product_id IN(
        SELECT Product_id
        FROM Orders
        WHERE MONTH(Order_date) = @CurrentMonth
        AND YEAR(Order_date) = @CurrentYear
        GROUP BY Product_id
        HAVING COUNT(*) >3
    ); 

    -- reset
    UPDATE Products
    SET Featured = 0
    WHERE Product_id NOT IN (
        SELECT Product_id
        FROM Orders
        WHERE MONTH(Order_date) = @CurrentMonth 
        AND YEAR(Order_date) = @CurrentYear
        GROUP BY Product_id
        HAVING COUNT(*) > 3
    )
    AND Featured = 1;
END

SELECT * FROM Products
SELECT * FROM Promotions
SELECT * FROM Orders

DELETE FROM Orders where Order_id>25

INSERT INTO Orders 
(Promotion_id, Product_id, Quantity, Customer_id, Order_date, Price) 
VALUES
(NULL, 10, 2, 8, '2026-02-10 10:00:00', 159.98),
(NULL, 10, 3, 6, '2026-02-10 11:30:00', 159.98),
(NULL, 10, 2, 2, '2026-02-10 14:20:00', 159.98),
(NULL, 10, 1, 4, '2026-02-10 16:00:00', 159.98);

-- DELETE: Removing promotions created before last 6 months
UPDATE Orders
SET Promotion_id = NULL
WHERE Promotion_id IN (
    SELECT Promotion_id
    FROM Promotions
    WHERE Start_date < DATEADD(MONTH, -6, GETDATE())
);
DELETE FROM Promotions
WHERE Start_date < DATEADD(MONTH, -6, GETDATE());

SELECT * FROM Promotions

---------------------------------------------------------------------- Task:5 VIEW

CREATE VIEW customer_order_details
AS
SELECT 
    o.Order_id,
    o.Order_date,
    o.Quantity,
    o.Price,
    c.Customer_id,
    c.First_name,
    c.Last_name,
    c.Email,
    c.Phone,
    c.City,
    c.State_province,
    c.Country
FROM Orders o 
INNER JOIN Customers c
ON o.Customer_id = c.Customer_id

SELECT * FROM customer_order_details

---------------------------------------------------------------------- Task 6: Complex View

-- Complex view with multiple joins for last 3 months
ALTER VIEW vw_DetailedOrderProductInfo AS
SELECT 
    o.Order_id,
    o.Order_date,
    o.Quantity,
    o.Price AS Order_Price,
    p.Product_id,
    p.Product_name,
    p.Category_name,
    p.Unit_price,
    p.Featured,
    c.Customer_id,
    c.First_name + ' ' + c.Last_name AS Customer_Name,
    c.Email,
    c.City,
    (o.Quantity * p.Unit_price) AS Calculated_Total
FROM 
    Orders o
INNER JOIN 
    Products p ON o.Product_id = p.Product_id
INNER JOIN 
    Customers c ON o.Customer_id = c.Customer_id
WHERE 
    o.Order_date >= DATEADD(MONTH, -3, GETDATE());
GO

SELECT * FROM vw_DetailedOrderProductInfo 

SELECT Employee_id, First_name, Last_name, Salary 
FROM Employees
ORDER BY Salary;

---------------------------------------------------------------------- Task:7 View WITH CHECK OPTION
CREATE VIEW vw_EmployeeSalaryUpdate AS
SELECT 
    Employee_id,
    First_name,
    Last_name,
    Salary
FROM 
    Employees
WHERE 
    Salary > 10000
WITH CHECK OPTION;
GO

SELECT * FROM vw_EmployeeSalaryUpdate
ORDER BY Salary DESC;

UPDATE vw_EmployeeSalaryUpdate
    SET Salary = 75000.00
    WHERE Employee_id = 6;

SELECT Employee_id, First_name, Last_name, Salary
FROM vw_EmployeeSalaryUpdate
WHERE Employee_id = 6;

UPDATE vw_EmployeeSalaryUpdate
    SET Salary = 9500.00
    WHERE Employee_id = 5;

---------------------------------------------------------------------- Task:8 User Defined Function

-- Function to calculate total order cost
CREATE FUNCTION dbo.fn_CalculateOrderTotal
(@OrderID INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @TotalCost DECIMAL(10,2);
    
    SELECT @TotalCost = SUM(o.Quantity * p.Unit_price)
    FROM Orders o
    INNER JOIN Products p ON o.Product_id = p.Product_id
    WHERE o.Order_id = @OrderID;
    
    RETURN ISNULL(@TotalCost, 0);
END;
GO
--
SELECT 
    Order_id,
    dbo.fn_CalculateOrderTotal(Order_id) AS Calculated_Order_Total
FROM Orders
WHERE Order_id IN (1, 5, 10);

---------------------------------------------------------------------- Task:9 WHILE Loop
-- WHILE LOOP

-- temp table
CREATE TABLE #Numbers (
    Value INT
);

-- Populate numbers into temp table
DECLARE @Number INT = 1;
WHILE @Number <= 10
BEGIN
INSERT INTO #Numbers
    VALUES (@Number)
    SET @Number = @Number + 1;
END

SELECT * FROM #Numbers


-- Ieterrating in temp table
DECLARE @CurrentValue INT;
DECLARE @Iterator INT = 1;

WHILE @Iterator <= 10
BEGIN
    SELECT @CurrentValue = Value 
    FROM #Numbers 
    WHERE Value = @Iterator;
      -- Skipping even numbers
    IF @CurrentValue % 2 = 0
    BEGIN
        PRINT 'Value ' + CAST(@CurrentValue AS VARCHAR) + ' is even - Skipping';
        SET @Iterator = @Iterator + 1;
        CONTINUE;
    END;

    -- Printing odd numbers
    PRINT 'Processing Value: ' + CAST(@CurrentValue AS VARCHAR);

    IF @CurrentValue = 5
    BREAK;

    SET @Iterator = @Iterator + 1;
END;


---------------------------------------------------------------------- Task: 10 CURSOR

TRUNCATE TABLE Category_Summary;

DECLARE @CategoryName VARCHAR(50);
DECLARE @TotalRevenue DECIMAL(15,2);

DECLARE category_cursor CURSOR FOR
SELECT DISTINCT p.Category_name
FROM Products p
INNER JOIN Orders o ON o.Product_id = p.Product_id

OPEN category_cursor;

FETCH NEXT FROM category_cursor INTO @CategoryName;

WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @TotalRevenue = SUM(o.Quantity * p.Unit_price)
    FROM Orders o
    INNER JOIN Products P ON o.Product_id = p.Product_id
    WHERE p.Category_name = @CategoryName;

    INSERT INTO Category_Summary(Category_name, Revenue)
    VALUES (@CategoryName, @TotalRevenue);

    FETCH NEXT FROM category_cursor INTO @CategoryName;
END;

CLOSE category_cursor;
DEALLOCATE category_cursor;

SELECT * FROM Category_Summary ORDER BY Revenue DESC;

----------------------------------------------------------------------Task 11: Normalization
/*
Normalization: Convert unstructured student–course data into normalized form.
The goal is to remove redundancy, avoid anomalies, and improve data integrity.
*/


-- This table represents raw data as received from a spreadsheet.
-- All student, course, and instructor details are stored together,
-- which leads to redundancy and update issues.
CREATE TABLE Unnormalized_Student_Course_Data (
    Student_ID VARCHAR(10),          -- Identifier for each student
    Name VARCHAR(100),               -- Student full name
    Age INT,                         -- Student age
    Gender VARCHAR(10),              -- Gender of the student
    Address VARCHAR(200),            -- Student address
    Email VARCHAR(100),              -- Student email address
    Phone_Number VARCHAR(20),        -- Student contact number
    Course_ID VARCHAR(10),           -- Course identifier
    Course_Name VARCHAR(100),        -- Name of the course
    Instructor VARCHAR(100),         -- Instructor name (repeated for same course)
    Credit_Hours INT,                -- Number of credit hours
    Grade VARCHAR(5)                 -- Grade obtained by the student
);


-- FIRST NORMAL FORM (1NF)

-- Atomic values are ensured and repeating groups are removed.
-- Each row represents one student enrolled in one course.
CREATE TABLE Student_Course_1NF (
    Student_ID VARCHAR(10) NOT NULL,     -- Student identifier
    Student_Name VARCHAR(100) NOT NULL,  -- Student name
    Age INT,
    Gender VARCHAR(10),
    Address VARCHAR(200),
    Email VARCHAR(100),
    Phone_Number VARCHAR(20),
    Course_ID VARCHAR(10) NOT NULL,      -- Course identifier
    Course_Name VARCHAR(100),
    Instructor VARCHAR(100),
    Credit_Hours INT,
    Grade VARCHAR(5),

    -- Composite key ensures a student can enroll in multiple courses
    CONSTRAINT PK_Student_Course_1NF 
        PRIMARY KEY (Student_ID, Course_ID)
);


-- SECOND NORMAL FORM (2NF)
-- Partial dependency is removed by separating student and course data.

-- Stores only student-related information
CREATE TABLE Students_2NF (
    Student_ID VARCHAR(10) NOT NULL,
    Student_Name VARCHAR(100) NOT NULL,
    Age INT,
    Gender VARCHAR(10),
    Address VARCHAR(200),
    Email VARCHAR(100) UNIQUE,        -- Email is unique for each student
    Phone_Number VARCHAR(20),

    CONSTRAINT PK_Students_2NF 
        PRIMARY KEY (Student_ID)
);


-- Stores only course-related information
CREATE TABLE Courses_2NF (
    Course_ID VARCHAR(10) NOT NULL,
    Course_Name VARCHAR(100) NOT NULL,
    Instructor VARCHAR(100),          -- Still causes transitive dependency
    Credit_Hours INT,

    CONSTRAINT PK_Courses_2NF 
        PRIMARY KEY (Course_ID)
);


-- Junction table to manage many-to-many relationship
-- between students and courses
CREATE TABLE Enrollments_2NF (
    Enrollment_ID INT IDENTITY(1,1) NOT NULL,
    Student_ID VARCHAR(10) NOT NULL,
    Course_ID VARCHAR(10) NOT NULL,
    Grade VARCHAR(5),
    Enrollment_Date DATE DEFAULT GETDATE(),

    CONSTRAINT PK_Enrollments_2NF 
        PRIMARY KEY (Enrollment_ID),

    -- Links enrollment to student
    CONSTRAINT FK_Enrollments_Students_2NF 
        FOREIGN KEY (Student_ID) 
        REFERENCES Students_2NF(Student_ID),

    -- Links enrollment to course
    CONSTRAINT FK_Enrollments_Courses_2NF 
        FOREIGN KEY (Course_ID) 
        REFERENCES Courses_2NF(Course_ID),

    -- Prevents duplicate enrollment of same student in same course
    CONSTRAINT UQ_Student_Course_2NF 
        UNIQUE (Student_ID, Course_ID)
);


-- THIRD NORMAL FORM (3NF)
-- Transitive dependency is removed by separating instructor data.


-- Final student table with no redundancy

CREATE TABLE Students (
    Student_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    Student_Name VARCHAR(100) NOT NULL,
    Age INT,
    Gender VARCHAR(10),
    Address VARCHAR(200),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone_Number VARCHAR(20),
);


-- Stores instructor details separately
CREATE TABLE Instructors (
    Instructor_ID INT IDENTITY(1,1)  PRIMARY KEY NOT NULL,
    Instructor_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone_Number VARCHAR(20),
    Department VARCHAR(50),
);


-- Course table now references instructor using a foreign key
CREATE TABLE Courses (
    Course_ID VARCHAR(10) PRIMARY KEY NOT NULL,
    Course_Name VARCHAR(100) NOT NULL,
    Instructor_ID INT NOT NULL,
    Credit_Hours INT NOT NULL,
    
    FOREIGN KEY (Instructor_ID) REFERENCES Instructors(Instructor_ID)
);


-- Final enrollment table maintaining relationships and integrity
CREATE TABLE Enrollments (
    Enrollment_ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Student_ID VARCHAR(10) NOT NULL,
    Course_ID VARCHAR(10) NOT NULL,
    Grade VARCHAR(5),
    Enrollment_Date DATE DEFAULT GETDATE(),
    Status VARCHAR(20) DEFAULT 'Active',

    FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,

    FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);
