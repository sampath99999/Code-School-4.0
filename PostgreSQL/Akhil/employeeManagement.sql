CREATE TABLE working_status(
    status_id SERIAL PRIMARY KEY, 
    status_name VARCHAR(50) NOT NULL UNIQUE 
);

CREATE TABLE designatiON (
    designatiON_id SERIAL PRIMARY KEY,
    designatiON_name VARCHAR(50) NOT NULL,
    department VARCHAR(50)
);

CREATE TABLE locatiON (
    locatiON_id SERIAL PRIMARY KEY,
    locatiON_name VARCHAR(100) NOT NULL UNIQUE  
);

CREATE TYPE gender AS ENUM ('Male', 'Female');

CREATE TABLE employees (
    empcode INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 20001 MAXVALUE 30000),
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    date_of_JOINing DATE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    phONe VARCHAR(14) UNIQUE NOT NULL,
    working_status_id INT NOT NULL REFERENCES working_status(status_id) ON DELETE CASCADE,
    designatiON_id INT NOT NULL REFERENCES designatiON(designatiON_id) ON DELETE CASCADE,
    locatiON_id INT NOT NULL REFERENCES locatiON(locatiON_id) ON DELETE CASCADE
);

CREATE TABLE salary_compONents(
    id SERIAL PRIMARY KEY,
    descriptiON VARCHAR(100) NOT NULL,
    type SMALLINT NOT NULL CHECK (type IN (1, 2))
);

CREATE TABLE employee_salary(
    id SERIAL PRIMARY KEY,
    empcode INT NOT NULL REFERENCES employees(empcode) ON DELETE CASCADE,
    salary_compONents_id INT NOT NULL REFERENCES salary_compONents(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE transactiON_details (
    id SERIAL PRIMARY KEY,
    empcode INT NOT NULL REFERENCES employees(empcode) ON DELETE CASCADE,
    transactiON_date DATE DEFAULT CURRENT_DATE,
    gross_salary DECIMAL(10,2) NOT NULL,
    deductiON DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL
);

INSERT INTO working_status (status_name) VALUES
('Active'),
('ON Leave'),
('Resigned'),
('Retired');

INSERT INTO designatiON (designatiON_name, department) VALUES
('Software Engineer', 'IT'),
('Senior Software Engineer', 'IT'),
('HR Manager', 'HR'),
('Finance Analyst', 'Finance'),
('Project Manager', 'IT');

INSERT INTO locatiON (locatiON_name) VALUES
('New York'),
('San Francisco'),
('Los Angeles'),
('Chicago'),
('HoustON');

INSERT INTO employees (firstname, lastname, date_of_JOINing, date_of_birth, gender, phONe, working_status_id, designatiON_id, locatiON_id)
VALUES
('John', 'Doe', '2015-06-15', '1985-04-20', 'Male', '1234567890', 1, 1, 1),
('Jane', 'Smith', '2018-08-10', '1990-07-12', 'Female', '2345678901', 1, 2, 2),
('Robert', 'Brown', '2012-02-25', '1982-11-05', 'Male', '3456789012', 1, 3, 3),
('Emily', 'Davis', '2020-01-15', '1995-09-30', 'Female', '4567890123', 2, 4, 4),
('Michael', 'WilsON', '2010-09-20', '1970-06-22', 'Male', '5678901234', 4, 5, 5);

INSERT INTO salary_compONents (descriptiON, type) VALUES
('Basic Pay', 1),
('House Rent Allowance', 1),
('City Compensatory Allowance', 1),
('Dearness Allowance', 1),
('ProfessiONal Tax', 2),
('Income Tax', 2);


INSERT INTO employee_salary (empcode, salary_compONents_id, amount) VALUES
(20001, 1, 50000.00), 
(20001, 2, 10000.00), 
(20001, 3, 5000.00),  
(20001, 4, 7000.00), 
(20001, 5, 2000.00),  
(20001, 6, 5000.00);  


INSERT INTO employee_salary (empcode, salary_compONents_id, amount) VALUES
(20002, 1, 60000.00),
(20002, 2, 12000.00),
(20002, 3, 6000.00),
(20002, 4, 8000.00),
(20002, 5, 2500.00),
(20002, 6, 6000.00);


INSERT INTO employee_salary (empcode, salary_compONents_id, amount) VALUES
(20003, 1, 75000.00),
(20003, 2, 15000.00),
(20003, 3, 7000.00),
(20003, 4, 10000.00),
(20003, 5, 3000.00),
(20003, 6, 8000.00);


INSERT INTO employee_salary (empcode, salary_compONents_id, amount) 
VALUES 
(20004, 1, 55000.00),
(20004, 2, 11000.00),  
(20004, 3, 5500.00),   
(20004, 4, 7500.00), 
(20004, 5, 2200.00),   
(20004, 6, 5500.00);   


INSERT INTO employee_salary (empcode, salary_compONents_id, amount) 
VALUES 
(20005, 1, 60000.00),  
(20005, 2, 12000.00),  
(20005, 3, 6000.00),   
(20005, 4, 8000.00),   
(20005, 5, 2500.00),   
(20005, 6, 6000.00);   



INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20004, '2025-03-31', 79000.00, 7700.00, 71300.00);


INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20005, '2025-03-31', 86000.00, 8500.00, 77500.00);



INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20001, '2025-03-31', 72000.00, 7000.00, 65000.00);

INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20002, '2025-03-31', 86000.00, 8500.00, 77500.00);

INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20003, '2025-03-31', 107000.00, 11000.00, 96000.00);

INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20004, '2025-03-31', 79000.00, 7700.00, 71300.00);

INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20005, '2025-03-31', 86000.00, 8500.00, 77500.00);



INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20002, '2025-02-28', 86000.00, 8600.00, 77400.00);

INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20003, '2025-02-28', 107000.00, 11000.00, 96000.00);


INSERT INTO transactiON_details (empcode, transactiON_date, gross_salary, deductiON, net_salary) 
VALUES 
(20004, '2025-02-28', 79000.00, 7800.00, 71200.00);


-- query 1
SELECT firstname,date_of_joining,date_of_birth,gender,phone,status_name AS status,designation_name,location_name FROM 
employees JOIN working_status ON working_status.status_id = employees.working_status_id
JOIN designation ON designation.designation_id = employees.designation_id
JOIN locatiON ON location.location_id = employees.location_id;

--- query 2
SELECT location_name, count(empcode) AS count_of_employees FROM employees
JOIN locatiON ON locatiON.location_id = employees.location_id
GROUP BY location_name 



--- query 3

SELECT designation_name,count(firstname) AS count_of_employees FROM employees
JOIN designation ON  designation.designation_id = employees.designation_id
GROUP BY designatiON_name;


--- query 4
SELECT status_name AS status,count(firstname) AS count_of_employees FROM employees
JOIN working_status ON working_status.status_id = employees.working_status_id
GROUP BY status;

--- query 5
SELECT empcode AS employee_id,firstname,date_of_birth,(date_of_birth + INTERVAL '60 years')::DATE AS retirement_date
FROM employees;


--- query 6

SELECT firstname,es.empcode,
max(case when description = 'Basic Pay' then amount end ) as Basic_Pay,
max(case when description = 'House Rent Allowance' then amount end ) as House_Rent_Allowance ,
max(case when description = 'City Compensatory Allowance' then amount end ) as City_Compensatory_Allowance ,
max(case when description = 'Dearness Allowance' then amount end ) as Dearness_Allowance,
max(case when description = 'Professional Tax' then amount end ) as Professional_Tax,
max(case when description = 'Income Tax' then amount end ) as Income_Tax FROM employee_salary AS es
JOIN employees ON employees.empcode = es.empcode
JOIN salary_components ON es.salary_components_id = salary_components.id
GROUP BY firstname,es.empcode
ORDER BY es.empcode;




-- query 7

SELECT designation_name,max(net_salary),min(net_salary),round(avg(net_salary),2)
FROM employees 
JOIN designation ON  designation.designation_id = employees.designation_id
JOIN transaction_details ON transaction_details.empcode = employees.empcode
GROUP BY designation_name

-- query 8

SELECT firstname,t.empcode AS emp_id,EXTRACT(YEAR FROM transactiON_date) AS salary_year,EXTRACT(MONTH FROM transactiON_date) AS salary_mONth,gross_salary, deductiON,net_salary FROM 
transactiON_details t
JOIN employees ON t.empcode = employees.empcode
WHERE EXTRACT(MONTH FROM transactiON_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 MONTH')

-- query 9

SELECT firstname,empcode FROM employees 
WHERE empcode NOT IN 
(SELECT empcode FROM transaction_details WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 MONTH'));

-- query 10

SELECT e1.empcode, sum(case when s.type = 1 then amount end ) - sum(case when s.type = 2 then amount end ) as gross, e2.net_salary FROM employee_salary e1
JOIN salary_components s on s.id = e1.salary_components_id
JOIN transaction_details e2 on e1.empcode = e2.empcode 
AND EXTRACT(MONTH FROM e2.transactiON_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 MONTH')
AND EXTRACT(YEAR FROM e2.transactiON_date) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 MONTH' )
GROUP BY e1.empcode,e2.net_salary having sum(case when s.type = 1 then amount end ) - sum(case when s.type = 2 then amount end ) != net_salary;






