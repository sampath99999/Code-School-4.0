-- Active: 1741774921246@@127.0.0.1@5432@payroll

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(10) NOT NULL CHECK (LENGTH(phone) = 10),
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'employee')) NOT NULL,
    token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE earning_deduction_master (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL UNIQUE,
    type SMALLINT NOT NULL CHECK (type IN (0, 1)), -- 0 = earning, 1 = deduction
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_earnings_deductions (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) NOT NULL,
    earning_deduction_id INT REFERENCES earning_deduction_master(id) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_salary (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    net_salary NUMERIC(10, 2) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_month_year UNIQUE (employee_id, month, year)
);

CREATE TABLE employee_salary_earning_deduction (
    id SERIAL PRIMARY KEY,
    salary_id INT REFERENCES employee_salary(id) NOT NULL,
    employee_earning_deduction_id INT REFERENCES employee_earnings_deductions(id) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Insert employees
INSERT INTO employees (name, dob, phone, designation, department)
VALUES
('dhruv', '1985-04-12', '9876543210', 'Software Engineer', 'IT'),
('ram', '1990-08-23', '9123456789', 'HR Manager', 'HR'),
('shaym', '1982-01-15', '9988776655', 'Accountant', 'Finance');

-- Insert users (linking to employees)
INSERT INTO users (employee_id, email, password, role)
VALUES
(1, 'dhruv@gmail.com', 'c040e97e5f7d89f9503a933e9e0321ff', 'employee'),--Dhruv@123
(2, 'ram@gmail.com', 'b04d6c7efa125fc28ece9ebc04967a8c', 'admin'),--Ram@123
(3, 'shaym@gmail.com', 'cd54240e1cf897855e5ed119b766c8e6', 'employee');--Shaym@123

-- Insert earning and deduction master records
INSERT INTO earning_deduction_master (description, type, status)
VALUES
('Basic Salary', 0, TRUE),
('House Rent Allowance', 0, TRUE),
('Bonus', 0, TRUE),
('Professional Tax', 1, TRUE),
('Income Tax', 1, TRUE),
('Provident Fund', 1, TRUE);


CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(100) NOT NULL,
    menu_for VARCHAR(20) CHECK (menu_for IN ('admin', 'employee')) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin menu items
INSERT INTO menu (name, url, menu_for) VALUES
('Dashboard', 'admin.html', 'admin'),
('View Employees', 'employeeList.html', 'admin');

-- Insert employee menu items
-- INSERT INTO menu (name, url, menu_for) VALUES
-- ('Dashboard', 'user.html', 'employee'),
-- ('My Profile', 'profile.html', 'employee'),
-- ('My Payslips', 'payslips.html', 'employee'); 