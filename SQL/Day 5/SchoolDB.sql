-- create db
CREATE DATABASE SchoolDB;
Go

-- USe db
USE SchoolDB;
GO

-- t1: students
CREATE TABLE Students
(
	Student_id INT PRIMARY KEY  IDENTITY(1001,1),
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(100),
	phone VARCHAR(20),
	date_of_birth DATE,
	admission_date DATE,
	grade_level INT,
	gpa DECIMAL(3,2),
	is_active BIT DEFAULT 1
);

-- t-2 teachers
CREATE TABLE Teachers
(
    teacher_id INT PRIMARY KEY IDENTITY(2001,1),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE,
    salary DECIMAL(10,2),
    subject VARCHAR(50),
    is_active BIT DEFAULT 1
);

-- t-3 Courses
CREATE TABLE Courses
(
	course_id INT PRIMARY KEY IDENTITY(3001,1),
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE,
    credits INT,
    teacher_id INT,
    max_students INT,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
);

-- t-4 enrollments
CREATE TABLE Enrollments
(
    enrollment_id INT PRIMARY KEY IDENTITY(4001,1),
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    grade VARCHAR(2),
    attendance_percentage DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Table 5: Exams
CREATE TABLE Exams
(
    exam_id INT PRIMARY KEY IDENTITY(5001,1),
    course_id INT,
    exam_name VARCHAR(100),
    exam_date DATE,
    total_marks INT,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Table 6: Exam_Results
CREATE TABLE Exam_Results
(
    result_id INT PRIMARY KEY IDENTITY(6001,1),
    exam_id INT,
    student_id INT,
    marks_obtained INT,
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

-- t-7 Student_)Audit (For TRIGGERS)
CREATE TABLE Student_Audit
(
    audit_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT,
    action_type VARCHAR(20),
    old_gpa DECIMAL(3,2),
    new_gpa DECIMAL(3,2),
    action_date DATETIME DEFAULT GETDATE(),
    performed_by VARCHAR(100) DEFAULT SYSTEM_USER
);

-- t-8 Salary Changes
CREATE TABLE Salary_Changes 
(
    change_id INT PRIMARY KEY IDENTITY(1,1),
    teacher_id INT,
    old_salary DECIMAL(10,2),
    new_salary DECIMAL (10,2),
    change_date DATETIME DEFAULT GETDATE(),
    chnage_reason VARCHAR(200)
);

CREATE TABLE Deleted_Records
(
    record_id INT PRIMARY KEY IDENTITY(1,1),
    table_name VARCHAR(50),
    record_id_deleted INT

)