CREATE DATABASE StudentDB;
GO

USE StudentDB;

CREATE TABLE Students (
    Id        UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    Name      NVARCHAR(100)    NOT NULL,
    Email     NVARCHAR(150)    NOT NULL UNIQUE,
    Age       INT              NOT NULL,
    Course    NVARCHAR(100)    NOT NULL,
    CreatedAt DATETIME         DEFAULT GETDATE()
);

-- Sample data
INSERT INTO Students (Name, Email, Age, Course) VALUES
('Anshul Panchal',   'anshul@gmail.com',  22, 'Computer Science'),
('Divy Vaddoriya',  'divy@gmail.com',  21, 'Information Technology'),
('Dhruv Patel',   'dhruv@gmail.com',   23, 'Electronics');

select * from Students