-- Active: 1741678178748@@127.0.0.1@5432@employee
CREATE TABLE working_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE designations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    level VARCHAR(50)
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE TYPE gender_enum AS ENUM ('M', 'F');
CREATE TABLE employees (
   emp_code INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 20001 MAXVALUE 29999),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    doj DATE NOT NULL, 
    dob DATE NOT NULL,  
    gender  gender_enum,
    phone VARCHAR(15) UNIQUE NOT NULL,
    working_status_id INTEGER REFERENCES working_status(id) ON DELETE SET NULL,
    designation_id INTEGER REFERENCES designations(id) ON DELETE SET NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL
);

create table salary_components(
    id SERIAL PRIMARY KEY,
    description varchar(200) NOT NULL,
    type SMALLINT Check (type = 1 or type = 2)
);

create table employee_salary_details(
    id SERIAL PRIMARY key,
    emp_code int REFERENCES employees(emp_code),
    salary_components_id int NOT NULL REFERENCES salary_components(id),
    A1mount DECIMAL(10,2) NOT NULL
);

CREATE TABLE salary_transactions (
    id SERIAL PRIMARY KEY,
    emp_code INT NOT NULL REFERENCES employees(emp_code) ON DELETE CASCADE,
    transaction_date DATE DEFAULT CURRENT_DATE,
    salary_month DATE DEFAULT CURRENT_DATE,
    gross_salary DECIMAL(10,2) NOT NULL,
    deduction DECIMAL(10,2) NOT NULL,  
    net_salary DECIMAL(10,2) NOT NULL
);


INSERT INTO working_status (status_name, description) VALUES
('Active', 'Currently working in the company'),
('On Leave', 'Employee is on temporary leave'),
('Resigned', 'Employee has resigned from the company'),
('Terminated', 'Employee contract ended by company');


INSERT INTO designations (title, department, level) VALUES
('Software Engineer', 'IT', 'Mid-Level'),
('Senior Developer', 'IT', 'Senior'),
('HR Manager', 'Human Resources', 'Manager'),
('Data Analyst', 'Analytics', 'Mid-Level');


INSERT INTO locations (city, state, country) VALUES
('New York', 'New York', 'USA'),
('San Francisco', 'California', 'USA'),
('London', 'London', 'UK'),
('Mumbai', 'Maharashtra', 'India');



INSERT INTO employees (first_name, last_name, doj, dob, gender, phone, working_status_id, designation_id, location_id) VALUES
('John', 'Boolean', '2023-01-15', '1998-07-10', 'M', '9876543210', 1, 1, 1),
('Emma', 'Smith', '2021-02-10', '1990-07-12', 'F', '8765432109', 2, 3, 2),
('Amit', 'Sharma', '2020-09-25', '1988-12-05', 'M', '7654321098', 3, 2, 3),
('Priya', 'Kapoor', '2019-11-30', '1992-01-25', 'F', '6543210987', 1, 4, 4);

INSERT INTO salary_components (description, type) VALUES
('Basic Pay', 1), 
('House Rent Allowance', 1),
('Medical Allowance', 1),
('Tax Deduction', 2);


INSERT INTO employee_salary_details (emp_code, salary_components_id, amount) VALUES
(20001, 1, 50000.00),  -- Basic Pay for Nathan
(20001, 2, 12000.00), -- House Rent Allowance for Nathan
(20001, 4, 4000.00),  -- Provident Fund Deduction for Nathan
(20002, 1, 48000.00), -- Emma's Basic Pay
(20002, 4, 4000.00), -- Tax Deduction for Emma
(20003, 1, 55000.00), -- Amit's Basic Pay
(20003, 3, 6000.00), -- Amit's Medical Allowance
(20003, 4, 8000.00), -- Amit's Tax Deduction
(20004, 1, 48000.00), -- Priya's Basic Pay
(20004, 2, 15000.00), -- Priya's HRA
(20004, 4, 5000.00); -- Provident Fund Deduction


INSERT INTO salary_transactions (emp_code, transaction_date, salary_month, gross_salary, deduction, net_salary) VALUES
(20001, '2025-02-28', '2025-02-01', 62000.00, 4000.00, 58000.00),
(20002, '2025-02-28', '2025-02-01', 55000.00, 5000.00, 50000.00),
(20003, '2025-02-28', '2025-02-01', 70000.00, 1000, 69000.00),
(20004, '2024-12-31', '2024-12-01', 80000.00, 7000.00, 73000.00); 



--query 1
SELECT 
    e.emp_code, 
    e.first_name, 
    e.last_name, 
    e.doj, 
    e.dob, 
    e.gender, 
    e.phone, 
    ws.status_name AS working_status, 
    d.title AS designation, 
    d.department, 
    d.level, 
    l.city, l.state, l.country 
FROM employees e
LEFT JOIN working_status ws ON e.working_status_id = ws.id
LEFT JOIN designations d ON e.designation_id = d.id
LEFT JOIN locations l ON e.location_id = l.id
ORDER BY e.emp_code ASC

-- query 2
select 
l.country,
count(e.emp_code) as employee_count_by_location
from employees e
join locations l on e.location_id = l.id
GROUP BY  l.country
ORDER BY employee_count_by_location desc

--query 3
select
d.department,
count(e.emp_code) as employee_count_by_department
from employees e
join designations d on e.designation_id = d.id
GROUP BY d.department
ORDER BY employee_count_by_department desc

--query 4
select
w.status_name,
count(e.emp_code) as employee_count_by_status
from employees e
join working_status w on e.working_status_id = w.id
GROUP BY w.status_name
ORDER BY employee_count_by_status desc


--query 5
select e.emp_code,
e.first_name || ' ' || e.last_name as employee_name,
e.doj as date_of_joining,
e.dob + INTERVAL  '60years' as retirement_date
from employees e
ORDER BY emp_code ASC;

--query 6
select 
esd.emp_code,
e.first_name || ' ' || e.last_name as employee_name,
max(case when description = 'Basic Pay' then amount end)  as Basic_Pay,
max(case when description = 'House Rent Allowance' then amount end)  as House_Rent_Allowance,
max(case when description = 'Medical Allowance' then amount end)  as Medical_Allowance,
max(case when description = 'Tax Deduction' then amount end)  as tax_dedution
FROM  employee_salary_details AS esd
join employees e on e.emp_code = esd.emp_code
join salary_components sc on sc.id = esd.salary_components_id
GROUP BY esd.emp_code, employee_name;

select * from employee_salary_details;
select * from salary_components;

select* from sa
--case 
-- when sc.type = 1 then 'Earnings'
-- else 'Deductions'
-- end as salary_type,

--query 7
SELECT 
    e.first_name || ' ' || e.last_name as employee_name,
    d.title AS designation, 
    MAX(st.net_salary) AS max_salary, 
    MIN(st.net_salary) AS min_salary, 
    ROUND(AVG(st.net_salary), 2) AS avg_salary
FROM salary_transactions st
JOIN employees e ON st.emp_code = e.emp_code
JOIN designations d ON e.designation_id = d.id
GROUP BY employee_name, d.title
ORDER BY avg_salary DESC;

--query 8
SELECT 
    st.emp_code, 
    e.first_name || ' ' || e.last_name AS employee_name, 
    EXTRACT(YEAR FROM st.transaction_date) AS salary_year, 
    EXTRACT(MONTH FROM st.transaction_date) AS salary_month, 
    st.gross_salary, 
    st.deduction, 
    st.net_salary
FROM salary_transactions st
JOIN employees e ON st.emp_code = e.emp_code
where st.salary_month = (date_trunc('month', CURRENT_DATE) - INTERVAL '1 month')
ORDER BY st.net_salary DESC;

-- query 9
SELECT first_name,emp_code FROM employees 
WHERE emp_code NOT IN 
(SELECT emp_code FROM salary_transactions WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 MONTH'));

-- query 10
SELECT e1.emp_code, sum(case when s.type = 1 then amount end ) - sum(case when s.type = 2 then amount end ) as gross, e2.net_salary FROM employee_salary_details e1
JOIN salary_components s on s.id = e1.salary_components_id
JOIN salary_transactions e2 on e1.emp_code = e2.emp_code 
AND EXTRACT(MONTH FROM e2.transactiON_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 MONTH')
AND EXTRACT(YEAR FROM e2.transactiON_date) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 MONTH' )
GROUP BY e1.emp_code,e2.net_salary having sum(case when s.type = 1 then amount end ) - sum(case when s.type = 2 then amount end ) != net_salary;



