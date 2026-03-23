-- Create database only if it does not already exist
IF DB_ID('SchoolDB2') IS NULL
BEGIN
    CREATE DATABASE SchoolDB2;
END
GO

-- Switch to SchoolDB2 database
USE SchoolDB2;
GO


-- Disable triggers first to avoid issues during re-run
DISABLE TRIGGER ALL ON dbo.Students;
GO


-- Drop triggers if they already exist
DROP TRIGGER IF EXISTS dbo.trg_AfterInsert_Student;
DROP TRIGGER IF EXISTS dbo.trg_AfterUpdate_Student;
DROP TRIGGER IF EXISTS dbo.trg_InsteadOfDelete_Student;


-- Drop functions if they already exist
DROP FUNCTION IF EXISTS dbo.CalculatePercentage;
DROP FUNCTION IF EXISTS dbo.GetStudentsByClass;
DROP FUNCTION IF EXISTS dbo.GetGradeDetails;


-- Drop tables in correct order (child first, then parent)
DROP TABLE IF EXISTS dbo.Attendance;
DROP TABLE IF EXISTS dbo.AuditLog;
DROP TABLE IF EXISTS dbo.Students;
DROP TABLE IF EXISTS dbo.Classes;
GO


-- Table to store class information
CREATE TABLE dbo.Classes (
    ClassID INT PRIMARY KEY,
    ClassName VARCHAR(20),
    TeacherName VARCHAR(50)
);
GO


-- Table to store student details
CREATE TABLE dbo.Students (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(50),
    Age INT,
    ClassID INT,
    Marks INT,
    City VARCHAR(30),
    CONSTRAINT FK_Students_Classes
        FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);
GO


-- Table to store attendance records
CREATE TABLE dbo.Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    StudentID INT,
    AttendanceDate DATE,
    Status VARCHAR(10)
);
GO


ALTER TABLE dbo.Attendance
ADD CONSTRAINT FK_Attendance_Students
FOREIGN KEY (StudentID) REFERENCES dbo.Students(StudentID);


-- Audit table to track actions using triggers
CREATE TABLE dbo.AuditLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    TableName VARCHAR(50),
    Action VARCHAR(50),
    ActionDate DATETIME,
    StudentID INT NULL
);
GO


-- Insert master data for classes
INSERT INTO Classes VALUES
(1, 'Class 10', 'Mr. Sharma'),
(2, 'Class 11', 'Ms. Patel'),
(3, 'Class 12', 'Mr. Kumar');
GO


-- Insert initial student records
INSERT INTO Students (Name, Age, ClassID, Marks, City) VALUES
('Rahul', 16, 1, 85, 'Delhi'),
('Priya', 17, 2, 92, 'Mumbai'),
('Amit', 15, 1, 78, 'Delhi'),
('Sneha', 18, 3, 88, 'Bangalore'),
('Rohan', 17, 2, 95, 'Mumbai'),
('Kavita', 16, 1, 82, 'Delhi');
GO


-- Insert attendance data
INSERT INTO Attendance VALUES
(1, '2025-02-01', 'Present'),
(1, '2025-02-02', 'Absent'),
(2, '2025-02-01', 'Present');
GO


-- Using string system functions
SELECT Name, LEN(Name) AS NameLength FROM Students;
SELECT Name, UPPER(Name) AS UpperName FROM Students;
SELECT Name, LOWER(Name) AS LowerName FROM Students;


-- Using date system functions
SELECT GETDATE() AS CurrentDate;
SELECT DATEADD(DAY, -10, GETDATE()) AS TenDaysBack;
SELECT DATEDIFF(YEAR, '2005-08-25', GETDATE()) AS YearDifference;
GO


-- Math functions usage
SELECT Marks, ROUND(Marks * 1.05, 2) AS BonusMarks FROM Students;
SELECT ABS(-50) AS AbsoluteValue;
GO


-- Scalar function to calculate percentage
CREATE FUNCTION dbo.CalculatePercentage (@Marks INT)
RETURNS DECIMAL(5,2)
AS
BEGIN
    RETURN (@Marks * 100.0) / 100;
END;
GO


-- Inline table-valued function to get students by class
CREATE FUNCTION dbo.GetStudentsByClass (@ClassID INT)
RETURNS TABLE
AS
RETURN (
    SELECT StudentID, Name, Marks
    FROM Students
    WHERE ClassID = @ClassID
);
GO


-- Multi-statement table-valued function to assign grades
CREATE FUNCTION dbo.GetGradeDetails()
RETURNS @GradeTable TABLE (
    Name VARCHAR(50),
    Marks INT,
    Grade VARCHAR(5)
)
AS
BEGIN
    INSERT INTO @GradeTable
    SELECT Name, Marks,
        CASE
            WHEN Marks >= 90 THEN 'A+'
            WHEN Marks >= 80 THEN 'A'
            WHEN Marks >= 70 THEN 'B'
            ELSE 'C'
        END
    FROM Students;

    RETURN;
END;
GO


-- Using CROSS APPLY with inline table-valued function
SELECT C.ClassName, S.Name, S.Marks
FROM Classes C
CROSS APPLY dbo.GetStudentsByClass(C.ClassID) S;
GO


-- Example of WHILE loop with BREAK and CONTINUE
DECLARE @Counter INT = 1;
WHILE @Counter <= 10
BEGIN
    IF @Counter = 3
    BEGIN
        SET @Counter += 1;
        CONTINUE;
    END

    IF @Counter = 6
        BREAK;

    PRINT 'Counter: ' + CAST(@Counter AS VARCHAR);
    SET @Counter += 1;
END
GO


-- CASE expression based on marks and name
SELECT Name, Marks,
    CASE
        WHEN Name LIKE 'K%' THEN 'Excellent'
        WHEN Marks >= 90 THEN 'Excellent'
        WHEN Marks >= 80 THEN 'Good'
        WHEN Marks >= 70 THEN 'Average'
        ELSE 'Needs Improvement'
    END AS Grade
FROM Students;
GO


-- CASE expression based on city
SELECT Name, City,
    CASE City
        WHEN 'Delhi' THEN 'North'
        WHEN 'Mumbai' THEN 'West'
        WHEN 'Bangalore' THEN 'South'
        ELSE 'Other'
    END AS Region
FROM Students;
GO

-- TRIGGERS

-- Trigger to log insert operations
CREATE TRIGGER dbo.trg_AfterInsert_Student
ON dbo.Students
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO AuditLog (TableName, Action, ActionDate, StudentID)
    SELECT 'Students', 'Insert', GETDATE(), StudentID
    FROM inserted;
END;
GO


-- Trigger to log update operations
CREATE TRIGGER dbo.trg_AfterUpdate_Student
ON dbo.Students
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO AuditLog (TableName, Action, ActionDate, StudentID)
    SELECT 'Students', 'Update', GETDATE(), StudentID
    FROM inserted;
END;
GO

Update Students
SET Marks=98 where Name = 'Rahul'
SELECT * FROM Students
SELECT * FROM AuditLog

-- Trigger to prevent delete and log delete attempts
CREATE TRIGGER dbo.trg_InsteadOfDelete_Student
ON dbo.Students
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    PRINT 'Delete operation is not allowed on Students table';
    INSERT INTO AuditLog (TableName, Action, ActionDate, StudentID)
    SELECT 'Students', 'Delete Attempt', GETDATE(), StudentID
    FROM deleted;
END;
GO

DELETE FROM Students WHERE StudentID=7
SELECT * FROM AuditLog;

-- Final verification queries
SELECT * FROM Students;
SELECT * FROM Classes;
SELECT * FROM Attendance;
SELECT * FROM AuditLog;

SELECT * FROM dbo.GetStudentsByClass(1);
SELECT * FROM dbo.GetGradeDetails();
SELECT dbo.CalculatePercentage(85);
GO

INSERT INTO Students (Name, Age, ClassID, Marks, City)
VALUES ('Temp', 16, 1, 90, 'Test');
SELECT * FROM AuditLog;


-- CURSOR (Row-by-row processing
DECLARE @StudentName VARCHAR(50), @StudentMarks INT;
-- Declaration
DECLARE StudentCursor CURSOR FOR 
SELECT Name, Marks FROM Students;
-- Opening
OPEN StudentCursor;
-- Fetch first row
FETCH NEXT FROM StudentCursor INTO @StudentName, @StudentMarks;
-- Loop
WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT @StudentName + ' scored ' + CAST(@StudentMarks AS VARCHAR);
    -- Fetch Next rows
    FETCH NEXT FROM StudentCursor INTO @StudentName, @StudentMarks;
END

-- Close and deallocate
CLOSE StudentCursor;
DEALLOCATE StudentCursor;


-- INDEXING

-- A) Clustered Index (Physical sorting, only 1 per table)
-- Already exists on PRIMARY KEY (StudentID)
-- Check existing index
EXEC sp_helpindex Students;


-- B) Non-Clustered Index (Logical sorting, multiple allowed)
-- Create Non-Clustered Index on Name
CREATE NONCLUSTERED INDEX IX_Student_Name
ON Students(Name)
-- Create Composite Index
CREATE NONCLUSTERED INDEX IX_Student_City_Marks
ON Students(City, Marks)

-- Update statistics
UPDATE STATISTICS Students;

-- Here '*' so it will use clustered index to scan whole table
SELECT * FROM Students WHERE Name = 'Rahul';

-- This WILL use Non-Clustered Index (only selecting indexed column)
SELECT Name FROM Students WHERE Name = 'Rahul';


-- NORMALIZATION
-- 1NF: No repeating groups, atomic values
-- 2NF: 1NF + No partial dependency
-- 3NF: 2NF + No transitive dependency

------------------------------------------------------------------- Bad Design (Unnormalized)
CREATE TABLE BadStudentData (
    StudentID INT,
    Name VARCHAR(50),
    Subjects VARCHAR(100),  -- 'Math, Science, English'
    City VARCHAR(30),
    TeacherName VARCHAR(50)
);

-- Insert data into BadStudentData (Unnormalized)
INSERT INTO BadStudentData VALUES
(1, 'Rahul', 'Math, Science, English', 'Delhi', 'Mr. Sharma'),
(2, 'Priya', 'Math, Hindi', 'Mumbai', 'Ms. Patel'),
(3, 'Amit', 'Science, English, Computer', 'Delhi', 'Mr. Kumar'),
(4, 'Sneha', 'Math, Science', 'Bangalore', 'Mr. Sharma'),
(5, 'Rohan', 'English, Hindi, Math', 'Mumbai', 'Ms. Gupta');
-- View the data
SELECT * FROM BadStudentData;

SELECT Name, Subjects 
FROM BadStudentData 
WHERE Subjects LIKE '%Math%';

SELECT Name, Subjects,
    LEN(Subjects) - LEN(REPLACE(Subjects, ',', '')) + 1 AS SubjectCount
FROM BadStudentData;

SELECT Name, TeacherName 
FROM BadStudentData 
WHERE TeacherName = 'Mr. Sharma';

----------------------------------------------------------------- 1NF
CREATE TABLE StudentSubjects (
    StudentID INT,
    Name VARCHAR(50),
    Subject VARCHAR(30),  -- One subject per row
    City VARCHAR(30),
    TeacherName VARCHAR(50)
);

-- Insert data into StudentSubjects (1NF - Atomic values)
INSERT INTO StudentSubjects VALUES
(1, 'Rahul', 'Math', 'Delhi', 'Mr. Sharma'),
(1, 'Rahul', 'Science', 'Delhi', 'Ms. Patel'),
(1, 'Rahul', 'English', 'Delhi', 'Mr. Kumar'),
(2, 'Priya', 'Math', 'Mumbai', 'Mr. Sharma'),
(2, 'Priya', 'Hindi', 'Mumbai', 'Ms. Gupta'),
(3, 'Amit', 'Science', 'Delhi', 'Ms. Patel'),
(3, 'Amit', 'English', 'Delhi', 'Mr. Kumar'),
(3, 'Amit', 'Computer', 'Delhi', 'Mr. Singh'),
(4, 'Sneha', 'Math', 'Bangalore', 'Mr. Sharma'),
(4, 'Sneha', 'Science', 'Bangalore', 'Ms. Patel'),
(5, 'Rohan', 'English', 'Mumbai', 'Mr. Kumar'),
(5, 'Rohan', 'Hindi', 'Mumbai', 'Ms. Gupta'),
(5, 'Rohan', 'Math', 'Mumbai', 'Mr. Sharma');

-- View data
SELECT DISTINCT Name, Subject 
FROM StudentSubjects 
WHERE Subject = 'Math';

SELECT * FROM StudentSubjects;

----------------------------------------------------------------- 2NF
-- Separate Student and Subject info
CREATE TABLE Students_Normalized (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(50),
    City VARCHAR(30)
);

CREATE TABLE SubjectEnrollment (
    StudentID INT,
    Subject VARCHAR(30),
    TeacherName VARCHAR(50)
);

-- Insert into Students_Normalized (Student info separated)
INSERT INTO Students_Normalized VALUES
(1, 'Rahul', 'Delhi'),
(2, 'Priya', 'Mumbai'),
(3, 'Amit', 'Delhi'),
(4, 'Sneha', 'Bangalore'),
(5, 'Rohan', 'Mumbai');

-- Insert into SubjectEnrollment (Subject info)
INSERT INTO SubjectEnrollment VALUES
(1, 'Math', 'Mr. Sharma'),
(1, 'Science', 'Ms. Patel'),
(1, 'English', 'Mr. Kumar'),
(2, 'Math', 'Mr. Sharma'),
(2, 'Hindi', 'Ms. Gupta'),
(3, 'Science', 'Ms. Patel'),
(3, 'English', 'Mr. Kumar'),
(3, 'Computer', 'Mr. Singh'),
(4, 'Math', 'Mr. Sharma'),
(4, 'Science', 'Ms. Patel'),
(5, 'English', 'Mr. Kumar'),
(5, 'Hindi', 'Ms. Gupta'),
(5, 'Math', 'Mr. Sharma');

-- View data
SELECT * FROM Students_Normalized;
SELECT * FROM SubjectEnrollment;


----------------------------------------------------------- Final Normalized Design
CREATE TABLE Student_3NF (
    StudentID INT PRIMARY KEY,
    NAME VARCHAR(50),
    City VARCHAR(40)
);

CREATE TABLE Subjects(
    SubjectID INT PRIMARY KEY,
    SubjectName VARCHAR(30),
    TeacherID INT
);

CREATE TABLE Teachers(
    TeacherID INT PRIMARY KEY,
    TeacherName VARCHAR(40)
);

CREATE TABLE Enrollments (  
    StudentID INT,
    SubjectID INT,
    FOREIGN KEY (StudentID) REFERENCES Student_3NF(StudentID),
    FOREIGN KEY (SubjectID) REFERENCES Subjects(SubjectID)
);

-- Insert Students (3NF)
INSERT INTO Student_3NF VALUES
(1, 'Rahul', 'Delhi'),
(2, 'Priya', 'Mumbai'),
(3, 'Amit', 'Delhi'),
(4, 'Sneha', 'Bangalore'),
(5, 'Rohan', 'Mumbai');

-- Insert Teachers
INSERT INTO Teachers VALUES
(201, 'Mr. Sharma'),
(202, 'Ms. Patel'),
(203, 'Mr. Kumar'),
(204, 'Ms. Gupta'),
(205, 'Mr. Singh');

-- Insert Subjects (with Teacher reference)
INSERT INTO Subjects VALUES
(101, 'Math', 201),      -- Math taught by Mr. Sharma
(102, 'Science', 202),   -- Science taught by Ms. Patel
(103, 'English', 203),   -- English taught by Mr. Kumar
(104, 'Hindi', 204),     -- Hindi taught by Ms. Gupta
(105, 'Computer', 205);  -- Computer taught by Mr. Singh

-- Insert Enrollments (Student-Subject relationship)
INSERT INTO Enrollments VALUES
(1, 101), (1, 102), (1, 103),  -- Rahul: Math, Science, English
(2, 101), (2, 104),             -- Priya: Math, Hindi
(3, 102), (3, 103), (3, 105),  -- Amit: Science, English, Computer
(4, 101), (4, 102),             -- Sneha: Math, Science
(5, 103), (5, 104), (5, 101);  -- Rohan: English, Hindi, Math

-- View all tables
SELECT * FROM Student_3NF;
SELECT * FROM Teachers;
SELECT * FROM Subjects;
SELECT * FROM Enrollments;

SELECT S.Name, SUB.SubjectName, T.TeacherName
FROM Student_3NF S
INNER JOIN Enrollments E ON S.StudentID = E.StudentID
INNER JOIN Subjects SUB ON E.SubjectID = SUB.SubjectID
INNER JOIN Teachers T ON SUB.TeacherID = T.TeacherID
WHERE SUB.SubjectName = 'Math';

SELECT S.Name, COUNT(E.SubjectID) AS SubjectCount
FROM Student_3NF S
LEFT JOIN Enrollments E ON S.StudentID = E.StudentID
GROUP BY S.Name;