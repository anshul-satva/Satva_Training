
CREATE DATABASE company_management;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- company table
CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- department table
CREATE TABLE department (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    budget NUMERIC(12,2) NOT NULL
);

-- employee table
CREATE TABLE employee (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    department_id UUID REFERENCES department(id) ON DELETE SET NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    salary NUMERIC(10,2),
    joining_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);




DO $$
DECLARE 
    v_satva_company_id UUID;
	v_google_company_id UUID;
	v_apple_company_id UUID;
BEGIN

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date, is_active)
	 VALUES (v_google_company_id, NULL , 'Rahul', 'Patel', 75000.00, '2022-01-15', TRUE);

END $$;

SELECT * FROM employee 
WHERE department_id IS NULL


DO $$
DECLARE 
	v_satva_company_id UUID;
	v_google_company_id UUID;
	v_apple_company_id UUID;
	
	v_satva_engineering_id UUID;
    v_satva_marketing_id UUID;
    v_satva_hr_id UUID;
	
	v_google_engineering_id UUID;
    v_google_marketing_id UUID;
    v_google_sales_id UUID;

	v_apple_engineering_id UUID;
    v_apple_design_id UUID;
    v_apple_operations_id UUID;
BEGIN
	-- inserting companies
	INSERT INTO company (name) VALUES ('Satva Solutions')
	RETURNING id INTO v_satva_company_id;

	INSERT INTO company (name) VALUES('Google')
	RETURNING id INTO v_google_company_id;

	INSERT INTO company (name) VALUES ('Apple')
    RETURNING id INTO v_apple_company_id;
	
	-- inserting departments
	INSERT INTO department (company_id, name, budget)
    VALUES (v_satva_company_id, 'Engineering', 500000.00)
    RETURNING id INTO v_satva_engineering_id;
    
    INSERT INTO department (company_id, name, budget)
    VALUES (v_satva_company_id, 'Marketing', 300000.00)
    RETURNING id INTO v_satva_marketing_id;
    
    INSERT INTO department (company_id, name, budget)
    VALUES (v_satva_company_id, 'Human Resources', 200000.00)
    RETURNING id INTO v_satva_hr_id;

	--
	INSERT INTO department (company_id, name, budget)
    VALUES (v_google_company_id, 'Engineering', 1000000.00)
    RETURNING id INTO v_google_engineering_id;
    
    INSERT INTO department (company_id, name, budget)
    VALUES (v_google_company_id, 'Marketing', 800000.00)
    RETURNING id INTO v_google_marketing_id;
    
    INSERT INTO department (company_id, name, budget)
    VALUES (v_google_company_id, 'Sales', 600000.00)
    RETURNING id INTO v_google_sales_id;
	
	--
	INSERT INTO department (company_id, name, budget)
    VALUES (v_apple_company_id, 'Engineering', 1200000.00)
    RETURNING id INTO v_apple_engineering_id;
    
    INSERT INTO department (company_id, name, budget)
    VALUES (v_apple_company_id, 'Design', 700000.00)
    RETURNING id INTO v_apple_design_id;
    
    INSERT INTO department (company_id, name, budget)
    VALUES (v_apple_company_id, 'Operations', 500000.00)
    RETURNING id INTO v_apple_operations_id;

	-- inserting data
	INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date, is_active)
    VALUES 
        (v_satva_company_id, v_satva_engineering_id, 'Rahul', 'Patel', 75000.00, '2022-01-15', TRUE),
        (v_satva_company_id, v_satva_engineering_id, 'Priya', 'Shah', 85000.00, '2021-06-20', TRUE),
        (v_satva_company_id, v_satva_engineering_id, 'Karan', 'Desai', 65000.00, '2023-03-10', TRUE),
        (v_satva_company_id, v_satva_marketing_id, 'Amit', 'Gandhi', 60000.00, '2022-08-05', TRUE),
        (v_satva_company_id, v_satva_marketing_id, 'Neha', 'Joshi', 55000.00, '2023-01-12', FALSE),
        (v_satva_company_id, v_satva_hr_id, 'Sneha', 'Mehta', 70000.00, '2021-11-30', TRUE);
    
    INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date, is_active)
    VALUES 
        (v_google_company_id, v_google_engineering_id, 'Sundar', 'Kumar', 150000.00, '2019-05-10', TRUE),
        (v_google_company_id, v_google_engineering_id, 'Lakshmi', 'Iyer', 145000.00, '2020-02-14', TRUE),
        (v_google_company_id, v_google_engineering_id, 'Arjun', 'Reddy', 140000.00, '2020-08-22', TRUE),
        (v_google_company_id, v_google_marketing_id, 'Anjali', 'Singh', 95000.00, '2021-03-18', TRUE),
        (v_google_company_id, v_google_sales_id, 'Vikram', 'Malhotra', 110000.00, '2021-07-05', TRUE);
    
    INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date, is_active)
    VALUES 
        (v_apple_company_id, v_apple_engineering_id, 'Rohan', 'Sharma', 160000.00, '2018-09-15', TRUE),
        (v_apple_company_id, v_apple_engineering_id, 'Diya', 'Kapoor', 155000.00, '2019-11-20', TRUE),
        (v_apple_company_id, v_apple_design_id, 'Aditya', 'Nair', 120000.00, '2020-04-10', TRUE),
        (v_apple_company_id, v_apple_design_id, 'Ishita', 'Rao', 115000.00, '2021-01-25', TRUE),
        (v_apple_company_id, v_apple_operations_id, 'Kabir', 'Gupta', 90000.00, '2022-06-12', TRUE);
    
END $$;


/* Task 1: Department Salary Summary Function 
Requirements: 
Create a PostgreSQL function that: 
- Accepts department_id as input parameter. 
- Returns total number of active employees in that department. 
- Returns total salary of active employees. 
- Returns average salary of active employees. 
- If no employees exist, totals should return 0 instead of NULL.*/

CREATE FUNCTION department_summary(
 p_department_id UUID
)
RETURNS TABLE(
	total_employees BIGINT,
	total_salary NUMERIC,
	avg_salary NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN 
	RETURN QUERY
	SELECT 
		COUNT(e.id) AS total_employees,
		SUM(e.salary) AS total_salary,
		ROUND(AVG(e.salary),2) AS avg_salary
	FROM employee e 
	WHERE e.department_id = p_department_id
	AND e.is_active = TRUE;
END $$;

--
SELECT 'Satva Solutions' AS "Company", * 
FROM department_summary (
	(SELECT id FROM department WHERE name = 'Engineering'
	AND company_id = (SELECT id FROM company WHERE
	name = 'Satva Solutions'))
);

SELECT 'Google Engineering' AS "Company",* 
FROM department_summary(
    (SELECT id FROM department WHERE name = 'Engineering' AND company_id = 
	(SELECT id FROM company WHERE name = 'Google'))
);

/* Task 2: Employee Transfer Procedure
Requirements: 
Create a PostgreSQL stored procedure that: 
- Accepts employee_id and new_department_id as input parameters. 
- Validates that both employee and department exist. 
- Ensures the new department belongs to the same company as the employee. 
- Transfers the employee to the new department. 
- Raises an exception if validation fails. 
*/
-- DROP PROCEDURE employee_transfer

CREATE PROCEDURE employee_transfer( 
	p_employee_id UUID,
	p_new_department_id UUID )
LANGUAGE plpgsql
AS $$
DECLARE 
	v_employee_company_id UUID;
	v_department_company_id UUID;
BEGIN
	SELECT company_id
	INTO v_employee_company_id
	FROM employee e
	WHERE id = p_employee_id;

	IF v_employee_company_id IS NULL THEN
	RAISE EXCEPTION 'Employee not found';
	END IF;
	
	SELECT company_id
	INTO v_department_company_id
	FROM department 
	WHERE id = p_new_department_id;

	IF v_department_company_id IS NULL THEN
	RAISE EXCEPTION 'Department not found';
	END IF;

	IF v_employee_company_id != v_department_company_id THEN
	RAISE EXCEPTION 'Departments are not matching';
	END IF;

	UPDATE employee
	SET department_id = p_new_department_id
	WHERE id = p_employee_id;
	
END;
$$;

---------
DO $$
DECLARE 
	v_emp_id UUID;
	v_dept_id UUID;
BEGIN
	SELECT id INTO v_emp_id FROM employee
	WHERE first_name = 'Rahul' AND last_name = 'Patel';
	
	SELECT id INTO v_dept_id FROM department
	WHERE name = 'Human Resources' AND company_id = (SELECT id FROM company WHERE name= 'Satva Solutions');
	
	CALL employee_transfer(v_emp_id, v_dept_id);
END $$;

----------
SELECT * FROM employee
INNER JOIN department ON employee.department_id = department.id

SELECT * FROM department

/*  
Task 3: Increase Salary by Employee Function 
Requirement: 
Create a PostgreSQL function that: 
- Accepts employee_id and percentage as input parameters. 
- Increases the salary of the specified employee by the given percentage. 
- Only allows update if employee is active. 
- Prevents negative  or zero percentage values. 
- Returns the updated salary. 
- Raises an exception if employee does not exist or is inactive.
*/
-- DROP FUNCTION increase_salary

CREATE FUNCTION increase_salary (
	p_employee_id UUID,
	p_percentage NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
	DECLARE 
	updated_salary DECIMAL(10,2);
	v_current_salary NUMERIC;
	v_is_active BOOLEAN;
BEGIN
	
	SELECT salary, is_active 
	INTO v_current_salary, v_is_active
	FROM employee
	WHERE id = p_employee_id;

	IF v_current_salary IS NULL THEN
		RAISE EXCEPTION 'Employee not found';
	END IF;

	IF NOT v_is_active THEN
	RAISE EXCEPTION 'Employee is not Active';
	END IF;

	IF p_percentage <= 0 THEN
	RAISE EXCEPTION 'Percentage should be > 0';
	END IF;
	
	updated_salary := v_current_salary + (v_current_salary * p_percentage) / 100;
    
	UPDATE employee
	SET salary = updated_salary
	WHERE id = p_employee_id;
	
	RETURN updated_salary;
END;
$$;

---------
DO $$
DECLARE 
	v_emp_id UUID;
	v_new_salary NUMERIC;
BEGIN
	SELECT id INTO v_emp_id FROM employee
	WHERE first_name = 'Lakshmi' AND last_name = 'Iyer';

	 v_new_salary := increase_salary(v_emp_id, 20);
END $$;

-------
SELECT salary FROM employee where first_name = 'Lakshmi'	
SELECT * FROM employee




















































/* Task 4: Department Budget Enforcement Function
Requirements:
Create a function that:
- Accepts department_id and percentage.
- Calculates the total salary of active employees in that department.
- Ensures that increasing an employee’s salary does NOT exceed department budget.
- If budget would be exceeded → raise exception.
- If valid → return remaining budget after change. */

CREATE OR REPLACE FUNCTION department_budget (
	p_dep_id UUID,
	p_percentage NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
	DECLARE v_budget NUMERIC;
	DECLARE v_total_salary NUMERIC;
BEGIN
    SELECT budget INTO v_budget 
	FROM department 
	WHERE id = p_dep_id;
	
	UPDATE employee
	SET salary = salary + (salary * p_percentage)/100
	WHERE department_id = p_dep_id
	AND is_active = TRUE;

	SELECT SUM(salary) INTO v_total_salary 
	FROM employee 
	WHERE department_id = p_dep_id;

	IF v_total_salary > v_budget THEN
	RAISE EXCEPTION 'Budject is grater than old';
	END IF;

	RETURN v_budget - v_total_salary ;
END;
$$;

---------------------
DO $$
DECLARE 
    v_dep_id UUID;
	DECLARE total_salary NUMERIC;
BEGIN
    SELECT id INTO v_dep_id
	FROM department
	WHERE name = 'Marketing'
	AND company_id = (SELECT id FROM company WHERE name= 'Satva Solutions');

	total_salary := department_budget(v_dep_id, 20);
	RAISE NOTICE 'budget after increment: %', total_salary;
END;
$$;

-- highest salary emp
CREATE OR REPLACE FUNCTION highest_salary(
	com_name VARCHAR(100)
)
RETURNS table(
	emp_name TEXT,
	hig_salary NUMERIC	
)
LANGUAGE plpgsql
AS $$
	DECLARE cmpny_id UUID;
	DECLARE max_salary NUMERIC;
BEGIN

	SELECT id INTO cmpny_id FROM company WHERE name = com_name;

	IF cmpny_id IS NULL THEN
    RAISE EXCEPTION 'Company not found';
END IF;

	SELECT MAX(salary) INTO max_salary 
	FROM employee 
	WHERE company_id = cmpny_id;
	
	RETURN QUERY
	
	SELECT first_name::TEXT AS emp_name, salary AS hig_salary
	FROM employee 
	WHERE company_id = cmpny_id AND salary = max_salary;

END;
$$;

SELECT * FROM highest_salary('Satva Solutions');




















---------------
SELECT * FROM company;

SELECT 
    c.name AS company,
    d.name AS department,
    d.budget
FROM department d
JOIN company c ON d.company_id = c.id
ORDER BY c.name, d.name;

SELECT 
    c.name AS company,
    d.name AS department,
    e.first_name || ' ' || e.last_name AS employee,
    e.salary,
    CASE WHEN e.is_active THEN 'Active' ELSE 'Inactive' END AS status
FROM employee e
JOIN department d ON e.department_id = d.id
JOIN company c ON e.company_id = c.id
ORDER BY c.name, d.name, e.last_name;

SELECT 
    c.name AS company,
    COUNT(DISTINCT d.id) AS total_departments,
    COUNT(e.id) AS total_employees,
    COUNT(e.id) FILTER (WHERE e.is_active = TRUE) AS active_employees,
    SUM(e.salary) AS total_payroll
FROM company c
LEFT JOIN department d ON c.id = d.company_id
LEFT JOIN employee e ON d.id = e.department_id
GROUP BY c.name
ORDER BY c.name;

-----------
