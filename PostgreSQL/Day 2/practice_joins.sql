CREATE TABLE Students2(
	student_id INTEGER PRIMARY KEY,
	student_name VARCHAR(100) NOT NULL,
	marks INTEGER CHECK(marks>=0 AND marks<=100)
	)
	drop table students2
	drop table department
	

	CREATE TABLE department(
	student_id INTEGER,
	department_id VARCHAR(100) PRIMARY KEY,
	department_name VARCHAR(100) NOT NULL,
	FOREIGN KEY (student_id) REFERENCES Students2
	)
INSERT INTO Students(student_id,student_name, marks) VALUES
	(2,'Vinay Shah',35),
	(4,'Saurav Chauhan',29),
	(3,'Ronit Mehta',45)
INSERT INTO department(student_id, department_id,department_name) VALUES
	(1,35,'asdf'),
	(2,34,'Saurav Chauhan'),
	(3,45,'Ronit Mehta')
	SELECT * FROM students2 s INNER JOIN department d
	ON s.student_id = d.student_id