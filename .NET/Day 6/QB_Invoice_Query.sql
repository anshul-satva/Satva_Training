CREATE DATABASE QBSyncSQL;
GO

USE QBSyncSQL;
GO

-- drop database QBSyncSQL

CREATE TABLE Invoices (
    Id                    INT IDENTITY(1,1) PRIMARY KEY,
    QuickBooksInvoiceId   NVARCHAR(50)   NOT NULL,
    CompanyId             NVARCHAR(100)  NOT NULL,
    UserId                NVARCHAR(100)  NOT NULL,
    CustomerRef           NVARCHAR(100),
    CustomerName          NVARCHAR(200),
    TotalAmount           DECIMAL(18,2),
    Balance               DECIMAL(18,2),
    DueDate               DATETIME2,
    Status                NVARCHAR(50),
    LineItemsJson         NVARCHAR(MAX),
    CreatedAt             DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt             DATETIME2 DEFAULT GETUTCDATE(),
    IsDeleted             BIT DEFAULT 0
);
GO

-- Check if table exists
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Invoices'

-- Check migration history
SELECT * FROM __EFMigrationsHistory

select * from Invoices