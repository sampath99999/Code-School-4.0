-- Active: 1741678172388@@127.0.0.1@5432@task2
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE employees (
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

CREATE INDEX idx_department ON employees(department_id);
CREATE INDEX idx_project ON employee_projects(project_id);

-- Seeding Data

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


-- 1. Basic SQL Queries
-- a. Fetch all employees' first names, last names, and their department names.
SELECT e.first_name, e.last_name,d.name department FROM employees e
full join departments d on e.department_id=d.department_id


-- b. Insert a new employee into the employees table with relevant details.
INSERT INTO employees (first_name, last_name, email, salary, department_id) VALUES 
('Uday Kumar', 'Korupolu', 'uday@gmail.com', 50000, 1);


-- c. Update the salary of an employee whose employee_id = 5 by 10%.
UPDATE employees
SET salary = salary+(salary*0.10)
WHERE employee_id = 5;


select * from employees 

-- d. Delete all employees who do not belong to any department.
delete from employees 
where employees.department_id is null;

SELECT * FROM employees;



-- 2. Joins & Relationships
-- a. Retrieve a list of employees along with their department names.
SELECT e.first_name, e.last_name,d.name department FROM employees e
full join departments d on e.department_id=d.department_id



-- b. Show all projects with their respective department names.
SELECT p.project_name,d.name department FROM projects p
full join departments d on p.department_id=d.department_id


-- c. Get a list of employees who are not assigned to any project.
SELECT e.first_name,
 e.last_name from employees e
left join employee_projects ep on e.employee_id=ep.employee_id
where ep.employee_id is null;


-- d. Retrieve all employees working on a project named "AI Development".
SELECT e.first_name, e.last_name,p.project_name from employees e
left join employee_projects ep on e.employee_id=ep.employee_id
left join projects p ON ep.project_id=p.project_id
where p.project_name='AI Development';


-- 3. Indexes
-- a. Explain the purpose of the idx_department and idx_project indexes.
--The purpose of the idx_department and idx_project indexes is to improve query performance by allowing faster data retrieval.

-- b. Run and EXPLAIN ANALYZE on a query fetching all employees from a specific department and check if the index is used.

EXPLAIN ANALYZE
select * from employees
where department_id=3;

-- c. How would you create an index to speed up searches on employees by last_name?
CREATE INDEX idx_last_name ON employees(last_name);


-- 4. Views
-- a. Create a view that shows the employee name, department name, and project name for employees assigned to projects.
create view employees_view as
select e.first_name,e.last_name,d.name,p.project_name from employees e
join employee_projects ep on e.employee_id=ep.employee_id
join projects p on ep.project_id=p.project_id
join departments d on p.department_id=d.department_id

select * from employees_view


-- b. Query the view to find employees working in the "Software" department.
select * from employees_view
where name='Software Development'


-- c. Modify the view to also include the employee's salary.
CREATE OR REPLACE VIEW employees_view as
select e.first_name,e.last_name,d.name,p.project_name,e.salary from employees e
join employee_projects ep on e.employee_id=ep.employee_id
join projects p on ep.project_id=p.project_id
join departments d on p.department_id=d.department_id

select * from employees_view


-- 5. Constraints
-- a. Try inserting an employee with a negative salary. What error do you get?
INSERT INTO employees (first_name, last_name, email, salary, department_id) VALUES 
('Uday Kumar', 'Korupolu', 'uday@gmail.com', -50000, 1);
--error new row for relation "employees" violates check constraint "employees_salary_ckeck"
--when we give negative salary violates an error at "employees_salary_check" because when we creating a table we gave a check constraint with a condition "salary>0"



-- b. Insert a project with a budget of 500. What happens?
INSERT INTO projects (project_name, budget, department_id) VALUES 
('AI Development', 500, 1)
--error new row for relation "projects" violates check constraint "projects_budget_ckeck"
--when we give budget of 500 it violates an error at "projects_budget_ckeck" because when we creating a table we gave a check constraint with a condition "budget>"



-- c. Insert a new employee in a non-existent department. What happens and why?
INSERT INTO employees (first_name, last_name, email, salary, department_id) VALUES 
('Uday Kumar', 'Korupolu', 'uday4@gmail.com', 150000, 6);

--insert or update on table "employees" violates foreign key constraint "employees_department_id_fkey"
--because employees_department_id=6 is not present in department_department_id



-- 6. Transactions
-- a. Start a transaction to increase the salary of all employees by 5% but roll it back.
BEGIN;
UPDATE employees
SET salary = salary+(salary*0.05);

select salary from employees;

ROLLBACK;



-- b. Write a transaction that deducts 10% from all project budgets and commits the change.
begin;
update projects
set budget=budget-(budget*0.10)
commit;

-- c. Explain the importance of transactions in multi-user environments.
--transactions are crucial for maintaining data integrity and consistency by ensuring that multiple users can access and modify data simultaneously without causing conflicts or inconsistencies

SELECT * from employees

