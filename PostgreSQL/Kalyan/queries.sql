-- Active: 1741678168190@@127.0.0.1@5432@employeeprojects

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    salary DECIMAL(10,2) CHECK (salary > 0),
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    budget DECIMAL(12,2) CHECK (budget > 1000),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE
);

CREATE TABLE employee_projects (
    employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (employee_id, project_id)
);

SELECT * from employees;


INSERT INTO departments (name) VALUES 
('Software Development'),
('Marketing'),
('Human Resources'),
('Finance'),
('Operations');

INSERT INTO employees (first_name, last_name, email, salary, department_id) VALUES 
('Alice', 'Johnson', 'alice.johnson@example.com', 75000, 1),
('Bob', 'Smith', 'bob.smith@example.com', 65000, 2),
('Charlie', 'Brown', 'charlie.brown@example.com', 55000, 3),
('David', 'Wilson', 'david.wilson@example.com', 85000, 1),
('Emma', 'Davis', 'emma.davis@example.com', 72000, 4),
('Frank', 'Miller', 'frank.miller@example.com', 69000, 2),
('Grace', 'Taylor', 'grace.taylor@example.com', 62000, 3),
('Hank', 'Moore', 'hank.moore@example.com', 77000, 1),
('Ivy', 'Clark', 'ivy.clark@example.com', 90000, 5),
('Jack', 'White', 'jack.white@example.com', 48000, NULL);

INSERT INTO projects (project_name, budget, department_id) VALUES 
('AI Development', 150000, 1),
('Marketing Campaign', 80000, 2),
('Employee Training', 50000, 3),
('Financial Analysis', 120000, 4),
('Logistics Optimization', 95000, 5);

INSERT INTO employee_projects (employee_id, project_id, assigned_date) VALUES 
(1, 1, '2024-03-01'),
(2, 2, '2024-02-15'),
(3, 3, '2024-01-20'),
(4, 1, '2024-02-10'),
(5, 4, '2024-03-05'),
(6, 2, '2024-01-30'),
(7, 3, '2024-02-25'),
(8, 1, '2024-03-10'),
(9, 5, '2024-02-18');

CREATE INDEX idx_department ON employees(department_id);
CREATE INDEX idx_project ON employee_projects(project_id);

-- 1. Basic SQL Queries
-- a. Fetch all employees' first names, last names, and their department names.
SELECT first_name, last_name, name
from employees
left join departments using(department_id);

-- b. Insert a new employee into the employees table with relevant details.

Insert into employees(first_name, last_name, email, salary, department_id) 
VALUES ('Eswar','Kalyan','kalyan234@gmail.com', 45000, 1);

-- c. Update the salary of an employee whose employee_id = 5 by 10%.
update employees
set salary = salary*1.1 where employee_id = 5;

-- d. Delete all employees who do not belong to any department.
delete from employees where department_id is NULL;

-- 2. Joins & Relationships
-- a. Retrieve a list of employees along with their department names.
SELECT employees.*, name
from employees
left join departments using(department_id)
ORDER BY employee_id; 
-- b. Show all projects with their respective department names.
SELECT projects.*, name 
from projects 
left join departments using(department_id);

-- c. Get a list of employees who are not assigned to any project.
SELECT employees.* 
from employees
left join employee_projects USING(employee_id)
where project_id is null;

-- d. Retrieve all employees working on a project named "AI Development".
SELECT employees.* 
from employees
left join employee_projects USING(employee_id)
left join projects USING(project_id)
where project_name = 'AI Development';

-- 3. Indexes
-- a. Explain the purpose of the idx_department and idx_project indexes.
-- when we're applying indexes on particular columns and those columns data will be extracted and keeping in to
-- the index data structure and this index data structure will be utilized while retrieving the data 
-- it will be used for improve the query performance and fast data retrieval

-- b. Run an EXPLAIN ANALYZE on a query fetching all employees from a specific department and check if the index is used.
--EXPLAIN ANALYZE
SELECT * from employees
where department_id=2;
-- due to small amount of data here indexes are not applied
-- c. How would you create an index to speed up searches on employees by last_name?
CREATE INDEX idx_last_name ON employees(last_name);


-- 4. Views
-- a. Create a view that shows the employee name, department name, and project name for employees assigned to projects.
CREATE VIEW Assigned_project AS
SELECT first_name ||' '|| last_name as full_name, departments.name, projects.project_name
from employees
join employee_projects USING(employee_id)
join projects USING(project_id)
join departments ON projects.department_id = departments.department_id;

SELECT * from assigned_project;

-- b. Query the view to find employees working in the "Software" department.
SELECT * from assigned_project
where name = 'Software Development';
-- c. Modify the view to also include the employee's salary.
CREATE OR REPLACE VIEW Assigned_project AS
SELECT first_name ||' '|| last_name as full_name, departments.name, projects.project_name, salary
from employees
join employee_projects USING(employee_id)
join projects USING(project_id)
join departments ON projects.department_id = departments.department_id;

SELECT * from assigned_project

-- 5. Constraints
-- a. Try inserting an employee with a negative salary. What error do you get?
Insert into employees(first_name, last_name, email, salary, department_id) 
VALUES ('Eswar','Kalyan','kalyan234@gmail.com', -5000, 1);
-- new row for relation "employees" violates check constraint "employees_salary_check"

-- b. Insert a project with a budget of 500. What happens?
INSERT INTO projects (project_name, budget, department_id) VALUES 
('Auto chat', 500, 1);
--new row for relation "projects" violates check constraint "projects_budget_check"

-- c. Insert a new employee in a non-existent department. What happens and why?
Insert into employees(first_name, last_name, email, salary, department_id) 
VALUES ('Uday','Kumar','kumar234@gmail.com', 45000, 6);
-- insert or update on table employees violates foreign key constraint 'employees_department_id_fkey'

-- 6. Transactions
-- a. Start a transaction to increase the salary of all employees by 5% but roll it back.
begin; 
update employees
set salary = salary*1.05 

ROLLBACK;

SELECT * from employees;
-- b. Write a transaction that deducts 10% from all project budgets and commits the change.
begin; 
update employees
set salary = salary*0.9;

COMMIT;


-- c. Explain the importance of transactions in multi-user environments.
-- In muliti-user environments, transactions are crucial for maintaining the data integrity and consistency 
-- by ensuring that multiple users can access and modify data simultaneously without causing conflicts or inconsistencies.