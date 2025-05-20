-- Active: 1741609824793@@127.0.0.1@5432@backendtest

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

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    clock_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clock_out TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK(status IN ('present', 'absent', 'late')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);




INSERT INTO employees (name,email,date_of_birth,phone_number,address,role,password) VALUES('krishna','krishna@gmail.com','2004-02-14','8142450194','hyderabad','hr','5f4dcc3b5aa765d61d8327deb882cf99');

INSERT INTO employees (name,email,date_of_birth,phone_number,address,role,password) VALUES('yash','yash@gmail.com','2004-02-14','989898989','hyderabad','employee','5f4dcc3b5aa765d61d8327deb882cf99');


