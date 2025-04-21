-- Active: 1742040737679@@127.0.0.1@5432@attendance
CREATE DATABASE attendance;

CREATE TABLE menu(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    menu_for VARCHAR(20) NOT NULL CHECK(menu_for in ('hr','employee'))
);

CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(10) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    role  VARCHAR(20) NOT NULL CHECK(role in ('hr','employee')) DEFAULT 'employee',
    password VARCHAR(255) NOT NULL,
    token VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_attendance(
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    date DATE NOT NUll,
    clock_in TIME NOT NULL,
    remarks TEXT,
    latitude VARCHAR(20),
    longitude VARCHAR(20),
    clock_out TIME,
    UNIQUE(employee_id,date)
)

drop table employee_attendance;

INSERT INTO employees (name,email,date_of_birth,phone_number,address,role,password) VALUES('shashi','shashi@gmail.com','2003-07-16','9087654321','hyderabad','hr','5f4dcc3b5aa765d61d8327deb882cf99');