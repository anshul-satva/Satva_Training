-- using old db
USE master;

-- creating new db
CREATE DATABASE CompanyDB;

-- Switch to the database
USE CompanyDB;

-- Creating the Company table
CREATE TABLE Company (
    CompanyID INT PRIMARY KEY IDENTITY(1,1),
    CompanyName NVARCHAR(100) NOT NULL UNIQUE,
    Industry NVARCHAR(50) NOT NULL,
    FoundedYear INT CHECK(FoundedYear >= 1800 AND FoundedYear <= 2026),
    Location NVARCHAR(100) NOT NULL,
    EmployeeCount INT CHECK (EmployeeCount >= 0),
    Revenue DECIMAL(15,2) CHECK (Revenue >= 0),
    IsActive BIT DEFAULT 1
);

-- Check if table exists
SELECT * from Company 

-- creating User table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Department NVARCHAR(50) NOT NULL,
    JobTitle NVARCHAR(100) NOT NULL,
    Salary DECIMAL(10,2) CHECK (Salary >= 0),
    HireDate DATE DEFAULT GETDATE(),
    
    -- Foreign Key to Company
    CONSTRAINT FK_Users_Company 
        FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
        ON DELETE CASCADE
);

-- creating Device table
CREATE TABLE Devices (
    DeviceID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT NOT NULL,
    DeviceName NVARCHAR(100) NOT NULL,
    DeviceType NVARCHAR(50) NOT NULL,
    Brand NVARCHAR(50) NOT NULL,
    PurchaseDate DATE NOT NULL,
    AssignedToUserID INT NULL,
    Status NVARCHAR(20) DEFAULT 'Active',
    
    -- Foreign Keys
    CONSTRAINT FK_Devices_Company 
        FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
        ON DELETE CASCADE,
    
    CONSTRAINT FK_Devices_Users 
        FOREIGN KEY (AssignedToUserID) REFERENCES Users(UserID)
        ON DELETE NO ACTION
);

-- Creating Applications table
CREATE TABLE Applications (
    ApplicationID INT PRIMARY KEY IDENTITY(1,1),
    CompanyID INT NOT NULL,
    AppName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    LicenseCount INT CHECK (LicenseCount > 0),
    CostPerLicense DECIMAL(10,2) CHECK (CostPerLicense >= 0),
    IsActive BIT DEFAULT 1,
    
    -- Foreign Key to Company
    CONSTRAINT FK_Applications_Company 
        FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
        ON DELETE CASCADE
);

-- Creating Marketing table under (Users table)
CREATE TABLE Marketing (
    MarketingID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    CampaignName NVARCHAR(100) NOT NULL,
    CampaignType NVARCHAR(50) NOT NULL,
    Budget DECIMAL(12,2) CHECK (Budget >= 0),
    StartDate DATE NOT NULL,
    EndDate DATE NULL,
    Status NVARCHAR(20) DEFAULT 'Active',
    
    -- Foreign Key to Users
    CONSTRAINT FK_Marketing_Users 
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE,
    
    -- Check: End date after start date
    CONSTRAINT CHK_Marketing_Dates 
        CHECK (EndDate IS NULL OR EndDate >= StartDate)
);

-- Creating Personal table under (Users table)
CREATE TABLE Personal (
    PersonalID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Address NVARCHAR(200),
    BloodGroup NVARCHAR(5),
    DateOfBirth DATE NOT NULL,
    Phone NVARCHAR(10) NOT NULL,
    
    -- Foreign Key to Users
    CONSTRAINT FK_Personal_Users 
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE,
    
    -- Constraint for 10-digit phone number
    CONSTRAINT CHK_Phone_Length 
        CHECK (LEN(Phone) = 10 AND Phone NOT LIKE '%[^0-9]%')
);

-- Check all tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Insert data into Company table
INSERT INTO Company (CompanyName, Industry, FoundedYear, Location, EmployeeCount, Revenue, IsActive)
VALUES 
    ('Tata Consultancy Services', 'IT Services', 1968, 'Mumbai, Maharashtra', 528000, 270000000000.00, 1),
    ('Infosys Limited', 'IT Services', 1981, 'Bangalore, Karnataka', 345000, 180000000000.00, 1),
    ('Reliance Industries', 'Conglomerate', 1966, 'Mumbai, Maharashtra', 195000, 850000000000.00, 1),
    ('Wipro Technologies', 'IT Services', 1945, 'Bangalore, Karnataka', 250000, 120000000000.00, 1),
    ('HDFC Bank', 'Banking', 1994, 'Mumbai, Maharashtra', 120000, 95000000000.00, 1),
    ('Bharti Airtel', 'Telecommunications', 1995, 'New Delhi, Delhi', 28000, 145000000000.00, 1),
    ('Mahindra & Mahindra', 'Automobile', 1945, 'Mumbai, Maharashtra', 260000, 125000000000.00, 1),
    ('HCL Technologies', 'IT Services', 1976, 'Noida, Uttar Pradesh', 219000, 128000000000.00, 1),
    ('Asian Paints', 'Manufacturing', 1942, 'Mumbai, Maharashtra', 7500, 32000000000.00, 1),
    ('Flipkart', 'E-Commerce', 2007, 'Bangalore, Karnataka', 35000, 58000000000.00, 1);
    
-- Insert data into Users table
INSERT INTO Users (CompanyID, FirstName, LastName, Email, Department, JobTitle, Salary, HireDate)
VALUES 
    -- Tata Consultancy Services (CompanyID: 1)
    (1, 'Rajesh', 'Kumar', 'rajesh.kumar@tcs.com', 'Engineering', 'Senior Software Engineer', 1200000.00, '2018-03-15'),
    (1, 'Priya', 'Sharma', 'priya.sharma@tcs.com', 'Marketing', 'Marketing Manager', 1500000.00, '2019-06-20'),
    (1, 'Amit', 'Patel', 'amit.patel@tcs.com', 'Sales', 'Sales Director', 2200000.00, '2017-01-10'),
    (1, 'Sneha', 'Reddy', 'sneha.reddy@tcs.com', 'HR', 'HR Specialist', 950000.00, '2020-09-05'),
    (1, 'Vikram', 'Singh', 'vikram.singh@tcs.com', 'Engineering', 'Tech Lead', 1800000.00, '2016-11-22'),
    
    -- Infosys Limited (CompanyID: 2)
    (2, 'Ananya', 'Iyer', 'ananya.iyer@infosys.com', 'Finance', 'Financial Analyst', 1100000.00, '2019-02-14'),
    (2, 'Arjun', 'Menon', 'arjun.menon@infosys.com', 'Operations', 'Operations Manager', 1650000.00, '2018-11-30'),
    (2, 'Deepika', 'Nair', 'deepika.nair@infosys.com', 'IT', 'IT Manager', 1750000.00, '2017-08-22'),
    (2, 'Rahul', 'Gupta', 'rahul.gupta@infosys.com', 'Compliance', 'Compliance Officer', 1400000.00, '2020-04-18'),
    
    -- Reliance Industries (CompanyID: 3)
    (3, 'Karthik', 'Krishnan', 'karthik.krishnan@reliance.com', 'Business Development', 'Business Head', 3500000.00, '2016-05-12'),
    (3, 'Pooja', 'Desai', 'pooja.desai@reliance.com', 'Research', 'Research Analyst', 1350000.00, '2019-07-25'),
    (3, 'Sanjay', 'Verma', 'sanjay.verma@reliance.com', 'Administration', 'Admin Manager', 1050000.00, '2020-01-08'),
    (3, 'Meera', 'Joshi', 'meera.joshi@reliance.com', 'Legal', 'Legal Advisor', 1900000.00, '2018-03-17'),
    
    -- Wipro Technologies (CompanyID: 4)
    (4, 'Aditya', 'Kapoor', 'aditya.kapoor@wipro.com', 'Engineering', 'DevOps Engineer', 1250000.00, '2019-05-20'),
    (4, 'Kavya', 'Pillai', 'kavya.pillai@wipro.com', 'Quality Assurance', 'QA Lead', 1450000.00, '2018-09-14'),
    (4, 'Rohan', 'Chatterjee', 'rohan.chatterjee@wipro.com', 'Sales', 'Account Manager', 1600000.00, '2017-12-03'),
    (4, 'Divya', 'Rao', 'divya.rao@wipro.com', 'HR', 'HR Manager', 1550000.00, '2019-08-11'),
    
    -- HDFC Bank (CompanyID: 5)
    (5, 'Varun', 'Malhotra', 'varun.malhotra@hdfcbank.com', 'Banking Operations', 'Branch Manager', 1350000.00, '2018-06-15'),
    (5, 'Shreya', 'Agarwal', 'shreya.agarwal@hdfcbank.com', 'Credit', 'Credit Analyst', 1100000.00, '2020-02-10'),
    (5, 'Nikhil', 'Bose', 'nikhil.bose@hdfcbank.com', 'Risk Management', 'Risk Manager', 1850000.00, '2017-04-25'),
    
    -- Bharti Airtel (CompanyID: 6)
    (6, 'Ishaan', 'Khanna', 'ishaan.khanna@airtel.com', 'Network Operations', 'Network Engineer', 1200000.00, '2019-10-08'),
    (6, 'Tanvi', 'Shah', 'tanvi.shah@airtel.com', 'Customer Service', 'Customer Service Head', 1400000.00, '2018-07-19'),
    (6, 'Aarav', 'Mehta', 'aarav.mehta@airtel.com', 'Sales', 'Regional Sales Manager', 1700000.00, '2017-11-05'),
    
    -- Mahindra & Mahindra (CompanyID: 7)
    (7, 'Ritesh', 'Pandey', 'ritesh.pandey@mahindra.com', 'Manufacturing', 'Production Manager', 1550000.00, '2018-01-20'),
    (7, 'Sakshi', 'Kulkarni', 'sakshi.kulkarni@mahindra.com', 'Design', 'Design Engineer', 1300000.00, '2019-04-12'),
    (7, 'Gaurav', 'Tiwari', 'gaurav.tiwari@mahindra.com', 'Supply Chain', 'Supply Chain Manager', 1650000.00, '2017-09-28'),
    
    -- HCL Technologies (CompanyID: 8)
    (8, 'Neha', 'Bhatt', 'neha.bhatt@hcl.com', 'Engineering', 'Software Developer', 1050000.00, '2020-06-01'),
    (8, 'Kunal', 'Saxena', 'kunal.saxena@hcl.com', 'Product Management', 'Product Manager', 1900000.00, '2018-02-14'),
    (8, 'Riya', 'Bansal', 'riya.bansal@hcl.com', 'Marketing', 'Digital Marketing Lead', 1350000.00, '2019-11-23'),
    
    -- Asian Paints (CompanyID: 9)
    (9, 'Akash', 'Mishra', 'akash.mishra@asianpaints.com', 'Sales', 'Territory Sales Manager', 1250000.00, '2019-03-07'),
    (9, 'Simran', 'Kaur', 'simran.kaur@asianpaints.com', 'R&D', 'Research Scientist', 1450000.00, '2018-08-16'),
    (9, 'Manish', 'Jain', 'manish.jain@asianpaints.com', 'Finance', 'Finance Manager', 1600000.00, '2017-05-30'),
    
    -- Flipkart (CompanyID: 10)
    (10, 'Ayush', 'Srivastava', 'ayush.srivastava@flipkart.com', 'Technology', 'Full Stack Developer', 1800000.00, '2020-01-15'),
    (10, 'Tara', 'Chopra', 'tara.chopra@flipkart.com', 'Product', 'Product Owner', 2100000.00, '2019-09-09'),
    (10, 'Yash', 'Arora', 'yash.arora@flipkart.com', 'Operations', 'Logistics Manager', 1550000.00, '2018-12-20'),
    (10, 'Nidhi', 'Bajaj', 'nidhi.bajaj@flipkart.com', 'Analytics', 'Data Analyst', 1350000.00, '2020-07-11');

-- Insert data into Devices table
INSERT INTO Devices (CompanyID, DeviceName, DeviceType, Brand, PurchaseDate, AssignedToUserID, Status)
VALUES 
    (1, 'TCS-LAP-001', 'Laptop', 'Dell', '2022-01-15', 1, 'Active'),
    (1, 'TCS-MOB-001', 'Mobile', 'Samsung', '2023-03-10', 3, 'Active'),
    (2, 'INF-LAP-001', 'Laptop', 'Lenovo', '2022-06-12', 6, 'Active'),
    (3, 'REL-LAP-001', 'Laptop', 'HP', '2022-08-14', 10, 'Active'),
    (4, 'WIP-LAP-001', 'Laptop', 'Asus', '2022-09-22', 14, 'Active'),
    (5, 'HDF-LAP-001', 'Laptop', 'Dell', '2022-05-08', 18, 'Active'),
    (6, 'AIR-MOB-001', 'Mobile', 'iPhone', '2023-07-22', 22, 'Active'),
    (7, 'MAH-DES-001', 'Desktop', 'HP', '2021-09-25', 25, 'Active'),
    (8, 'HCL-LAP-001', 'Laptop', 'Dell', '2023-01-30', 27, 'Active'),
    (10, 'FLP-LAP-001', 'Laptop', 'MacBook Pro', '2023-02-10', 33, 'Active');

-- Insert data into Applications table
INSERT INTO Applications (CompanyID, AppName, Category, LicenseCount, CostPerLicense, IsActive)
VALUES 
    (1, 'Microsoft 365', 'Productivity', 5000, 420.00, 1),
    (1, 'Salesforce CRM', 'Sales', 250, 9000.00, 1),
    (2, 'SAP ERP', 'Enterprise Resource Planning', 1000, 15000.00, 1),
    (3, 'Oracle Database', 'Database', 300, 25000.00, 1),
    (4, 'GitHub Enterprise', 'Development', 600, 1680.00, 1),
    (5, 'Finacle Core Banking', 'Banking Software', 500, 50000.00, 1),
    (6, 'Cisco Webex', 'Communication', 400, 1500.00, 1),
    (7, 'AutoCAD', 'Design', 150, 18000.00, 1),
    (8, 'AWS Services', 'Cloud Computing', 1000, 5000.00, 1),
    (10, 'Google Workspace', 'Productivity', 800, 480.00, 1);

-- Insert data into Marketing table
INSERT INTO Marketing (UserID, CampaignName, CampaignType, Budget, StartDate, EndDate, Status)
VALUES 
    (2, 'Digital India Campaign', 'Digital Marketing', 5000000.00, '2024-01-15', '2024-06-30', 'Completed'),
    (2, 'Social Media Boost', 'Social Media', 2500000.00, '2024-07-01', '2024-12-31', 'Active'),
    (8, 'Brand Awareness Q1', 'Brand Marketing', 6000000.00, '2024-01-01', '2024-03-31', 'Completed'),
    (12, 'Jio Fiber Promotion', 'Promotional', 15000000.00, '2024-02-01', '2024-04-30', 'Completed'),
    (22, 'Airtel 5G Launch', 'Product Launch', 25000000.00, '2024-03-20', '2024-05-20', 'Completed'),
    (28, 'HCL Digital Transformation', 'Content Marketing', 4000000.00, '2024-08-01', NULL, 'Active');

-- Insert data into Personal table
INSERT INTO Personal (UserID, Name, Address, BloodGroup, DateOfBirth, Phone)
VALUES 
    (1, 'Rajesh Kumar', '42, MG Road, Bangalore, Karnataka - 560001', 'O+', '1990-05-15', '9876543210'),
    (2, 'Priya Sharma', '15, Andheri West, Mumbai, Maharashtra - 400058', 'A+', '1992-08-22', '9823456789'),
    (3, 'Amit Patel', '28, Satellite Road, Ahmedabad, Gujarat - 380015', 'B+', '1988-11-30', '9712345678'),
    (4, 'Sneha Reddy', '67, Banjara Hills, Hyderabad, Telangana - 500034', 'AB+', '1995-03-12', '9912345678'),
    (5, 'Vikram Singh', '89, Connaught Place, New Delhi, Delhi - 110001', 'O-', '1987-07-18', '9811234567'),
    (6, 'Ananya Iyer', '34, Koramangala, Bangalore, Karnataka - 560095', 'A-', '1993-02-25', '9845678901'),
    (7, 'Arjun Menon', '56, Indiranagar, Bangalore, Karnataka - 560038', 'B-', '1991-09-14', '9876501234'),
    (8, 'Deepika Nair', '12, Whitefield, Bangalore, Karnataka - 560066', 'AB-', '1994-06-08', '9898765432'),
    (9, 'Rahul Gupta', '78, Powai, Mumbai, Maharashtra - 400076', 'O+', '1989-12-20', '9822334455'),
    (10, 'Karthik Krishnan', '45, Navi Mumbai, Maharashtra - 400706', 'A+', '1986-04-17', '9833445566');


-- Check all tables have data
use CompanyDB
SELECT * FROM Company;
SELECT * FROM Users;
SELECT * FROM Devices;
SELECT * FROM Applications;
SELECT * FROM Marketing;
SELECT * FROM Personal;