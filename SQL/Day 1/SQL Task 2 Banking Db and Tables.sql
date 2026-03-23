use master

SELECT name FROM sys.databases;
SELECT name FROM sys.tables;

-- Creating new database
CREATE DATABASE BankingDB;

-- switching to the BankingDB
use BankingDB

-- 1) Branch Table
create table Branches (
    BranchID int primary key identity(1,1),
    BranchName nvarchar(100) not null,
    BranchCode nvarchar(10) not null unique,
    City nvarchar(50) not null,
    State nvarchar(50) not null,
    IFSCCode nvarchar(11) not null unique,
    phone nvarchar(10) not null,
    ManagerName nvarchar(100),
    
     -- Constraints
    CONSTRAINT CHK_Branch_Phone CHECK (LEN(Phone) = 10 AND Phone NOT LIKE '%[^0-9]%')
);

-- 2. Creating Customers table (Simplified)
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),  
    FirstName NVARCHAR(50) NOT NULL,   
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(10) NOT NULL,
    DateOfBirth DATE NOT NULL,
    City NVARCHAR(50) NOT NULL,
    
    -- Constraints
    CONSTRAINT CHK_Customer_Phone CHECK (LEN(Phone) = 10 AND Phone NOT LIKE '%[^0-9]%'),
    CONSTRAINT CHK_Customer_Age CHECK (DATEDIFF(YEAR, DateOfBirth, GETDATE()) >= 18)
);

-- 3. Accounts table (This connects Customer to Branch)
CREATE TABLE Accounts (
    AccountID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,          -- Links to Customers table
    BranchID INT NOT NULL,            -- Links to Branches table
    AccountNumber NVARCHAR(16) NOT NULL UNIQUE,
    AccountType NVARCHAR(20) NOT NULL,
    Balance DECIMAL(15,2) DEFAULT 0.00,
    
    -- Foreign Keys 
    CONSTRAINT FK_Accounts_Customers 
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    
    CONSTRAINT FK_Accounts_Branches 
        FOREIGN KEY (BranchID) REFERENCES Branches(BranchID),
    
    CONSTRAINT CHK_Account_Balance CHECK (Balance >= 0)
);


-- 4. Creating Transactions table
CREATE TABLE Transactions (
    TransactionID INT PRIMARY KEY IDENTITY(1,1),
    AccountID INT NOT NULL,  -- links to Accounts table
    TransactionType NVARCHAR(20) NOT NULL,
    Amount DECIMAL(15,2) NOT NULL,
    TransactionDate DATETIME DEFAULT GETDATE(),
    BalanceAfter DECIMAL(15,2) NOT NULL,
    
    -- Foreign Key
    CONSTRAINT FK_Transactions_Accounts 
        FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
        ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT CHK_Transaction_Type CHECK (TransactionType IN ('Deposit', 'Withdrawal', 'Transfer')),
    CONSTRAINT CHK_Transaction_Amount CHECK (Amount > 0)
);

-- 5. Creating Loans table
CREATE TABLE Loans (
    LoanID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,  -- links to Customers table
    BranchID INT NOT NULL,    -- links to Branches table
    LoanType NVARCHAR(30) NOT NULL,
    LoanAmount DECIMAL(15,2) NOT NULL,
    LoanStartDate DATE DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Active',
    
    CONSTRAINT FK_Loans_Customers 
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
        ON DELETE CASCADE,
    
    CONSTRAINT FK_Loans_Branches 
        FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
        ON DELETE NO ACTION,
    
    CONSTRAINT CHK_Loan_Type CHECK (LoanType IN ('Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan')),
    CONSTRAINT CHK_Loan_Amount CHECK (LoanAmount > 0),
    CONSTRAINT CHK_Loan_Status CHECK (Status IN ('Active', 'Closed'))
);

ALTER TABLE Branches
DROP CONSTRAINT CHK_Branch_Phone;
alter table Branches
drop column phone

alter table Branches
ADD Phone nvarchar(10) not null;
ALTER TABLE Branches
ADD CONSTRAINT CHK_Branch_Phone CHECK (LEN(Phone) = 10 AND Phone NOT LIKE '%[^0-9]%');

SELECT name FROM sys.tables;
select * from Branches
select * from Customers
select * from Accounts
select * from Transactions
select * from Loans

-- INSERT DATA INTO BRANCHES 
INSERT INTO Branches (BranchName, BranchCode, City, State, IFSCCode, ManagerName, Phone)
VALUES 
    ('SBI Mumbai', 'SBIMUM01', 'Mumbai', 'Maharashtra', 'SBIN0001234', 'Rajesh Kumar', '9876543210'),
    ('HDFC Bangalore', 'HDFCBLR01', 'Bangalore', 'Karnataka', 'HDFC0002345', 'Priya Sharma', '9823456789'),
    ('ICICI Delhi', 'ICICDEL01', 'New Delhi', 'Delhi', 'ICIC0003456', 'Amit Verma', '9812345678'),
    ('Axis Pune', 'AXISPUN01', 'Pune', 'Maharashtra', 'UTIB0004567', 'Sneha Desai', '9887654321'),
    ('Kotak Ahmedabad', 'KOTKAHM01', 'Ahmedabad', 'Gujarat', 'KKBK0005678', 'Karan Patel', '9765432109');

-- INSERT DATA INTO CUSTOMERS 
INSERT INTO Customers (FirstName, LastName, Email, Phone, DateOfBirth, City)
VALUES 
    ('Rahul', 'Sharma', 'rahul.sharma@email.com', '9876543210', '1990-05-15', 'Mumbai'),
    ('Priya', 'Singh', 'priya.singh@email.com', '9823456789', '1992-08-22', 'Bangalore'),
    ('Amit', 'Kumar', 'amit.kumar@email.com', '9812345678', '1988-11-30', 'Delhi'),
    ('Sneha', 'Patel', 'sneha.patel@email.com', '9887654321', '1995-03-12', 'Pune'),
    ('Karan', 'Mehta', 'karan.mehta@email.com', '9765432109', '1987-07-18', 'Ahmedabad'),
    ('Anjali', 'Gupta', 'anjali.gupta@email.com', '9898765432', '1993-02-25', 'Mumbai'),
    ('Vikram', 'Nair', 'vikram.nair@email.com', '9923456780', '1991-09-14', 'Bangalore'),
    ('Neha', 'Reddy', 'neha.reddy@email.com', '9856781234', '1994-06-08', 'Delhi');

INSERT INTO Customers 
VALUES 
('Anshul', 'Panchal', 'ansh@gmail.com', '3434343434', '2005-08-25', 'Ahmedabad')

-- INSERT DATA INTO ACCOUNTS 
INSERT INTO Accounts (CustomerID, BranchID, AccountNumber, AccountType, Balance)
VALUES 
    (1, 1, '1234567890123456', 'Savings', 50000.00),
    (2, 2, '2345678901234567', 'Savings', 75000.00),
    (3, 3, '3456789012345678', 'Current', 120000.00),
    (4, 4, '4567890123456789', 'Savings', 35000.00),
    (5, 5, '5678901234567890', 'Current', 95000.00),
    (6, 1, '6789012345678901', 'Savings', 62000.00),
    (7, 2, '7890123456789012', 'Savings', 48000.00),
    (8, 3, '8901234567890123', 'Current', 85000.00);

-- INSERT DATA INTO TRANSACTIONS 
INSERT INTO Transactions (AccountID, TransactionType, Amount, TransactionDate, BalanceAfter)
VALUES 
    (1, 'Deposit', 50000.00, '2024-01-10 10:30:00', 50000.00),
    (1, 'Withdrawal', 5000.00, '2024-01-15 14:20:00', 45000.00),
    (1, 'Deposit', 10000.00, '2024-01-20 11:15:00', 55000.00),
    (2, 'Deposit', 75000.00, '2024-01-12 09:45:00', 75000.00),
    (2, 'Withdrawal', 15000.00, '2024-01-18 16:30:00', 60000.00),
    (3, 'Deposit', 120000.00, '2024-01-08 10:00:00', 120000.00),
    (3, 'Transfer', 25000.00, '2024-01-22 13:45:00', 95000.00),
    (4, 'Deposit', 35000.00, '2024-01-14 11:30:00', 35000.00),
    (5, 'Deposit', 95000.00, '2024-01-16 10:15:00', 95000.00),
    (6, 'Deposit', 62000.00, '2024-01-19 09:20:00', 62000.00);

-- INSERT DATA INTO LOANS 
INSERT INTO Loans (CustomerID, BranchID, LoanType, LoanAmount, LoanStartDate, Status)
VALUES 
    (1, 1, 'Home Loan', 2500000.00, '2024-01-05', 'Active'),
    (2, 1, 'Car Loan', 500000.00, '2024-01-10', 'Active'),
    (3, 2, 'Personal Loan', 200000.00, '2024-01-12', 'Active'),
    (5, 2, 'Education Loan', 800000.00, '2024-01-15', 'Active'),
    (1, 3, 'Home Loan', 3000000.00, '2024-01-08', 'Active');

-- Delete rows with LoanID 6-10(duplicates)
select * from Loans
DELETE FROM Loans
WHERE LoanID > 5;


-- Use Database
USE BankingDB;

-- SELECT
SELECT * FROM Customers;
SELECT FirstName, LastName, Email FROM Customers;
SELECT TOP 5 * FROM Accounts ORDER BY Balance DESC;

-- WHERE
SELECT * FROM Customers WHERE City = 'Mumbai';
SELECT CustomerID FROM Accounts WHERE Balance > 50000;
SELECT * FROM Loans WHERE Status = 'Active';

-- Comparision Operations
SELECT * FROM Accounts WHERE Balance >= 75000;
SELECT * FROM Loans WHERE LoanAmount < 1000000;
SELECT * FROM Customers WHERE City <> 'Mumbai';  -- Not equal

-- AND - Both conditions must be true
SELECT * FROM Accounts WHERE AccountType = 'Savings' AND Balance > 60000;
-- OR - At least one condition must be true
SELECT * FROM Customers WHERE City = 'Mumbai' OR City = 'Delhi';
-- NOT - Negates condition
SELECT * FROM Loans WHERE NOT Status = 'Closed';

-- IN (Multiple Values)
SELECT * FROM Customers WHERE City IN ('Mumbai', 'Delhi', 'Bangalore');
SELECT * FROM Loans WHERE LoanType IN ('Home Loan', 'Car Loan');

-- Between
SELECT * FROM Accounts WHERE Balance BETWEEN 50000 AND 100000;
SELECT * FROM Loans WHERE LoanStartDate BETWEEN '2024-01-01' AND '2024-01-15';

-- LIKE
SELECT * FROM Customers WHERE FirstName LIKE 'A%';  -- Starts with A
SELECT * FROM Customers WHERE Email LIKE '%@gmail.com';  -- Ends with @gmail.com
SELECT * FROM Accounts WHERE AccountType LIKE '%ing%';  -- AccountType contains 'ing'

-- Check if NULL exists
SELECT * FROM Branches WHERE ManagerName IS NULL;
-- Check if NOT NULL
SELECT * FROM Branches WHERE ManagerName IS NOT NULL;

-- Alias
SELECT FirstName AS 'First Name', LastName AS 'Last Name' FROM Customers;
SELECT FirstName + ' ' + LastName AS 'Full Name', City FROM Customers;
SELECT AccountNumber AS 'Account No.', Balance AS 'Current Balance' FROM Accounts;

-- Order By
SELECT * FROM Customers ORDER BY FirstName;  -- Ascending (default)
SELECT * FROM Accounts ORDER BY Balance DESC;  -- Descending
SELECT * FROM Customers ORDER BY City, FirstName;  -- Multiple columns
SELECT * FROM Customers ORDER BY City ASC, FirstName DESC;  -- Multiple order by columns

-- Count
SELECT COUNT(CustomerID) AS 'Total Customers' FROM Accounts;
SELECT COUNT(*) AS 'Customers in Mumbai' FROM Customers WHERE City = 'Mumbai';
SELECT COUNT(DISTINCT City) AS 'Unique Cities' FROM Customers;

-- GROUP BY
-- Count customers per city
SELECT City, COUNT(*) AS 'Customer Count' FROM Customers GROUP BY City;
-- Sum balance by account type
SELECT AccountType, SUM(Balance) AS 'Total Balance' FROM Accounts GROUP BY AccountType;
-- Max Balance per city
SELECT AccountType, MAX(Balance) AS 'MAX Balance' FROM Accounts GROUP BY AccountType;
-- Average loan amount by type
SELECT LoanType, AVG(LoanAmount) AS 'Avg Loan Amount' FROM Loans GROUP BY LoanType;
-- branches count per city
SELECT State, COUNT(*) AS 'Branches per State'
FROM Branches 
GROUP BY State;

-- HAVING
SELECT City, COUNT(*) AS 'Count' FROM Customers 
GROUP BY City 
HAVING COUNT(*) >= 2;
SELECT AccountType, AVG(Balance) AS 'Avg Balance' FROM Accounts 
GROUP BY AccountType 
HAVING AVG(Balance) > 60000;

-- UPDATE
-- Update single column
UPDATE Customers SET City = 'Navi Mumbai' WHERE CustomerID = 1;
-- Update multiple columns
UPDATE Customers SET FirstName = 'Rahul Kumar', Phone = '9876543211' WHERE CustomerID = 1;
-- Update with calculation
UPDATE Accounts SET Balance = Balance + 5000 WHERE AccountID = 1;

-- DELETE
-- Inserting and then deleting
INSERT INTO Customers (FirstName, LastName, Email, Phone, DateOfBirth, City)
VALUES ('Test', 'User', 'test@email.com', '9999999999', '1995-01-01', 'TestCity');
-- Delete the test record
DELETE FROM Customers WHERE Email = 'test@email.com';
-- Insert
INSERT INTO Customers (FirstName, LastName, Email, Phone, DateOfBirth, City)
VALUES ('xyz', 'User', 'xyz@email.com', '9999999999', '1995-01-01', 'Surat');
-- Delete with condition
DELETE FROM Customers WHERE City = 'Surat'

-- Alter
-- Add column
ALTER TABLE Customers ADD MiddleName NVARCHAR(50);
select * from customers
-- Drop column
ALTER TABLE Customers DROP COLUMN MiddleName;

-- Create Index
CREATE INDEX idx_Customer_City ON Customers(City);
CREATE INDEX idx_Account_Balance ON Accounts(Balance);
select * from customers
select * from Accounts

-- Drop index
DROP INDEX idx_Customer_City ON Customers;
DROP INDEX idx_Account_Balance ON Accounts;

-- DROP
-- Create test table
CREATE TABLE bank (ID INT, Name NVARCHAR(50));
select * from bank
-- Drop the table
DROP TABLE bank;

SELECT name FROM sys.databases;
SELECT name FROM sys.tables;