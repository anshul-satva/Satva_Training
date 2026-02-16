/*    ==Scripting Parameters==

    Source Server Version : SQL Server 2025 (17.0.1000)
    Source Database Engine Edition : Microsoft SQL Server Express Edition
    Source Database Engine Type : Standalone SQL Server

    Target Server Version : SQL Server 2025
    Target Database Engine Edition : Microsoft SQL Server Express Edition
    Target Database Engine Type : Standalone SQL Server
*/

USE [master]
GO
/****** Object:  Database [SchoolDB2]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SchoolDB2')
BEGIN
CREATE DATABASE [SchoolDB2]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SchoolDB2', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\SchoolDB2.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'SchoolDB2_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\SchoolDB2_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 COLLATE SQL_Latin1_General_CP1_CI_AS
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
END
GO
ALTER DATABASE [SchoolDB2] SET COMPATIBILITY_LEVEL = 170
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SchoolDB2].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [SchoolDB2] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SchoolDB2] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SchoolDB2] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SchoolDB2] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SchoolDB2] SET ARITHABORT OFF 
GO
ALTER DATABASE [SchoolDB2] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [SchoolDB2] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SchoolDB2] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SchoolDB2] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SchoolDB2] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SchoolDB2] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SchoolDB2] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SchoolDB2] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SchoolDB2] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SchoolDB2] SET  ENABLE_BROKER 
GO
ALTER DATABASE [SchoolDB2] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SchoolDB2] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SchoolDB2] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [SchoolDB2] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [SchoolDB2] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SchoolDB2] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SchoolDB2] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [SchoolDB2] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [SchoolDB2] SET  MULTI_USER 
GO
ALTER DATABASE [SchoolDB2] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SchoolDB2] SET DB_CHAINING OFF 
GO
ALTER DATABASE [SchoolDB2] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [SchoolDB2] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [SchoolDB2] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [SchoolDB2] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [SchoolDB2] SET OPTIMIZED_LOCKING = OFF 
GO
ALTER DATABASE [SchoolDB2] SET QUERY_STORE = ON
GO
ALTER DATABASE [SchoolDB2] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/****** Object:  Login [NT SERVICE\Winmgmt]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'NT SERVICE\Winmgmt')
CREATE LOGIN [NT SERVICE\Winmgmt] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/****** Object:  Login [NT SERVICE\SQLWriter]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'NT SERVICE\SQLWriter')
CREATE LOGIN [NT SERVICE\SQLWriter] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/****** Object:  Login [NT SERVICE\SQLTELEMETRY$SQLEXPRESS]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'NT SERVICE\SQLTELEMETRY$SQLEXPRESS')
CREATE LOGIN [NT SERVICE\SQLTELEMETRY$SQLEXPRESS] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/****** Object:  Login [NT Service\MSSQL$SQLEXPRESS]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'NT Service\MSSQL$SQLEXPRESS')
CREATE LOGIN [NT Service\MSSQL$SQLEXPRESS] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/****** Object:  Login [NT AUTHORITY\SYSTEM]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'NT AUTHORITY\SYSTEM')
CREATE LOGIN [NT AUTHORITY\SYSTEM] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/****** Object:  Login [DESKTOP-7FMJ716\Satva User 6]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'DESKTOP-7FMJ716\Satva User 6')
CREATE LOGIN [DESKTOP-7FMJ716\Satva User 6] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/****** Object:  Login [BUILTIN\Users]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'BUILTIN\Users')
CREATE LOGIN [BUILTIN\Users] FROM WINDOWS WITH DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english]
GO
/* For security reasons the login is created disabled and with a random password. */
/****** Object:  Login [##MS_PolicyTsqlExecutionLogin##]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'##MS_PolicyTsqlExecutionLogin##')
CREATE LOGIN [##MS_PolicyTsqlExecutionLogin##] WITH PASSWORD=N'M84iZBDWV+VuL5SzBUgipPvW5VDzoANSd6jW5IGTXpk=', DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=ON
GO
ALTER LOGIN [##MS_PolicyTsqlExecutionLogin##] DISABLE
GO
/* For security reasons the login is created disabled and with a random password. */
/****** Object:  Login [##MS_PolicyEventProcessingLogin##]    Script Date: 09-02-2026 18:06:14 ******/
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'##MS_PolicyEventProcessingLogin##')
CREATE LOGIN [##MS_PolicyEventProcessingLogin##] WITH PASSWORD=N'mVFN1zYS0pWys/G2GSShu4qH3wNnS0j68h/ere24m1I=', DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=ON
GO
ALTER LOGIN [##MS_PolicyEventProcessingLogin##] DISABLE
GO
ALTER AUTHORIZATION ON DATABASE::[SchoolDB2] TO [DESKTOP-7FMJ716\Satva User 6]
GO
ALTER SERVER ROLE [sysadmin] ADD MEMBER [NT SERVICE\Winmgmt]
GO
ALTER SERVER ROLE [sysadmin] ADD MEMBER [NT SERVICE\SQLWriter]
GO
ALTER SERVER ROLE [sysadmin] ADD MEMBER [NT Service\MSSQL$SQLEXPRESS]
GO
ALTER SERVER ROLE [sysadmin] ADD MEMBER [DESKTOP-7FMJ716\Satva User 6]
GO
USE [SchoolDB2]
GO
GRANT VIEW ANY COLUMN ENCRYPTION KEY DEFINITION TO [public] AS [dbo]
GO
GRANT VIEW ANY COLUMN MASTER KEY DEFINITION TO [public] AS [dbo]
GO
/****** Object:  UserDefinedFunction [dbo].[CalculatePercentage]    Script Date: 09-02-2026 18:06:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CalculatePercentage]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'CREATE FUNCTION [dbo].[CalculatePercentage](@Marks [int])
RETURNS [decimal](5, 2) WITH INLINE = ON, EXECUTE AS CALLER
AS 
BEGIN
    RETURN (@Marks * 100.0)/100;
END
' 
END
GO
ALTER AUTHORIZATION ON [dbo].[CalculatePercentage] TO  SCHEMA OWNER 
GO
/****** Object:  UserDefinedFunction [dbo].[GetGradeDetails]    Script Date: 09-02-2026 18:06:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetGradeDetails]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'CREATE FUNCTION [dbo].[GetGradeDetails]()
RETURNS @GradeTable TABLE (
	[Name] [varchar](50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Marks] [int] NULL,
	[Grade] [varchar](5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
) WITH EXECUTE AS CALLER
AS 
BEGIN
    INSERT INTO @GradeTable
    SELECT Name, Marks,
    CASE
        WHEN Marks >=90 THEN ''A+''
        WHEN Marks >=80 THEN ''A''
        WHEN Marks >=70 THEN ''B''
        ELSE ''C''
    END AS Grade
FROM Students;
RETURN;
END;
' 
END
GO
ALTER AUTHORIZATION ON [dbo].[GetGradeDetails] TO  SCHEMA OWNER 
GO
/****** Object:  Table [dbo].[Students]    Script Date: 09-02-2026 18:06:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Students](
	[StudentID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Age] [int] NULL,
	[ClassID] [int] NULL,
	[Marks] [int] NULL,
	[City] [varchar](30) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
 CONSTRAINT [PK__Students__32C52A791835C152] PRIMARY KEY CLUSTERED 
(
	[StudentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
ALTER AUTHORIZATION ON [dbo].[Students] TO  SCHEMA OWNER 
GO
/****** Object:  UserDefinedFunction [dbo].[GetStudentsByClass]    Script Date: 09-02-2026 18:06:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[GetStudentsByClass]') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
execute dbo.sp_executesql @statement = N'CREATE FUNCTION [dbo].[GetStudentsByClass](@ClassID [int])
RETURNS TABLE AS 
RETURN(
    SELECT StudentID, Name, Marks
    From Students
    where ClassID = @ClassID
);' 
END
GO
ALTER AUTHORIZATION ON [dbo].[GetStudentsByClass] TO  SCHEMA OWNER 
GO
/****** Object:  Table [dbo].[Attendance]    Script Date: 09-02-2026 18:06:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Attendance]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Attendance](
	[AttendanceID] [int] IDENTITY(1,1) NOT NULL,
	[StudentID] [int] NULL,
	[AttendanceDate] [date] NULL,
	[Status] [varchar](10) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
 CONSTRAINT [PK__Attendan__8B69263C7F7AF787] PRIMARY KEY CLUSTERED 
(
	[AttendanceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
ALTER AUTHORIZATION ON [dbo].[Attendance] TO  SCHEMA OWNER 
GO
/****** Object:  Table [dbo].[AuditLog]    Script Date: 09-02-2026 18:06:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AuditLog]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AuditLog](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[TableName] [varchar](50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[Action] [varchar](50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[ActionDate] [datetime] NULL,
	[StudentID] [int] NULL,
 CONSTRAINT [PK__AuditLog__5E5499A871489350] PRIMARY KEY CLUSTERED 
(
	[LogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
ALTER AUTHORIZATION ON [dbo].[AuditLog] TO  SCHEMA OWNER 
GO
/****** Object:  Table [dbo].[Classes]    Script Date: 09-02-2026 18:06:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Classes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Classes](
	[ClassID] [int] NOT NULL,
	[ClassName] [varchar](20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[TeacherName] [varchar](50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
 CONSTRAINT [PK__Classes__CB1927A06CA4F7CA] PRIMARY KEY CLUSTERED 
(
	[ClassID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
ALTER AUTHORIZATION ON [dbo].[Classes] TO  SCHEMA OWNER 
GO
/****** Object:  Trigger [dbo].[trg_AfterInsert_Student]    Script Date: 09-02-2026 18:06:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[trg_AfterInsert_Student]'))
EXEC dbo.sp_executesql @statement = N'CREATE TRIGGER [dbo].[trg_AfterInsert_Student]
ON [dbo].[Students]
AFTER INSERT
AS
BEGIN
    INSERT INTO AuditLog(TableName, Action, ActionDate, StudentId
)
    SELECT 
    ''Students'',
    ''Insert'',
    GETDATE(),
    StudentId from inserted
END' 
GO
ALTER TABLE [dbo].[Students] ENABLE TRIGGER [trg_AfterInsert_Student]
GO
/****** Object:  Trigger [dbo].[trg_AfterUpdate]    Script Date: 09-02-2026 18:06:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE object_id = OBJECT_ID(N'[dbo].[trg_AfterUpdate]'))
EXEC dbo.sp_executesql @statement = N'CREATE TRIGGER [dbo].[trg_AfterUpdate]
ON [dbo].[Students]
AFTER Update
AS
BEGIN
    INSERT INTO AuditLog(TableName, Action, ActionDate, StudentID)
    SELECT
        ''Students'',
        ''Update'',
        GETDATE(),
        StudentID from inserted
END' 
GO
ALTER TABLE [dbo].[Students] ENABLE TRIGGER [trg_AfterUpdate]
GO
USE [master]
GO
ALTER DATABASE [SchoolDB2] SET  READ_WRITE 
GO

DISABLE TRIGGER ALL ON dbo.Students;
