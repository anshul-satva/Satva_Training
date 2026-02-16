-- Task 1
-- creating student table
CREATE TABLE Students(
	student_id SERIAL PRIMARY KEY,
	student_name VARCHAR(100) NOT NULL,
	marks INTEGER CHECK(marks>=0 AND marks<=100)
	)
	
-- inserting 3 students
INSERT INTO Students(student_name, marks) VALUES
	('Anshul Panchal',99),
	('Divy Vaddoriya',95),
	('Rahul Sharma',70)

-- updating 1 student marks
UPDATE Students
SET marks =85 where student_name='Rahul Sharma'

SELECT * FROM Students

INSERT INTO Students(student_name, marks) VALUES
	('Vinay Shah',35),
	('Saurav Chauhan',29),
	('Ronit Mehta',45)

-- deleting students with marks <40
DELETE FROM Students where marks <=40

SELECT student_name, marks FROM Students 
ORDER BY marks DESC;


-- Task 2 

CREATE TABLE accounts(
account_id SERIAL PRIMARY KEY,
account_holder VARCHAR(100) NOT NULL,
balance DECIMAL(10,2) NOT NULL CHECK(balance>=0),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO accounts(account_holder,balance) VALUES
	('Account A',1000),
	('Account B',2000),
	('Account C',3000)
	
DO $$
BEGIN 	
	IF EXISTS( SELECT 1 FROM accounts WHERE account_holder = 'Account A' AND balance >= 1000 )
	THEN 
		UPDATE accounts 
    	SET balance = balance - 1000 
    	WHERE account_holder = 'Account A' 
    	AND balance >= 1000;

    	UPDATE accounts 
    	SET balance = balance + 1000 
    	WHERE account_holder = 'Account B';
	ELSE 
		RAISE EXCEPTION 'Insufficient balance';
	END IF;
END $$;

SELECT * FROM accounts ORDER BY balance DESC

-- Task 3
-- creating employee table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL
);

INSERT INTO employees (employee_name, department, salary) VALUES
    ('Rajesh Gupta', 'IT', 75000.00),
    ('Sneha Reddy', 'HR', 55000.00),
    ('Vikram Singh', 'IT', 90000.00),
    ('Anita Desai', 'Finance', 65000.00),
    ('Karan Mehta', 'IT', 48000.00),
    ('Pooja Nair', 'HR', 52000.00),
    ('Arjun Verma', 'Finance', 95000.00),
    ('Meera Joshi', 'Marketing', 60000.00);

SELECT 
	employee_id, employee_name, department, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)

-- Using CTE
WITH avg_salary_cte AS (
	SELECT AVG(salary) AS avg_salary
	FROM employees
	 )
SELECT 
	e.employee_id, e.employee_name, e.department, e.salary
FROM employees e, avg_salary_cte a
WHERE e.salary > a.avg_salary;



-- Task 4
-- count employees per department
SELECT department, COUNT(employee_id) AS employee_count
FROM employees
GROUP BY department ORDER BY employee_count DESC  

SELECT * FROM employees

-- Task 5
-- rank employees as per salary 
SELECT employee_name, salary,
RANK() OVER(ORDER BY salary DESC) AS salary_rank
FROM employees


SELECT employee_name, salary,
RANK() OVER(ORDER BY salary DESC) AS salary_rank
FROM employees
ORDER BY salary_rank OFFSET 5
