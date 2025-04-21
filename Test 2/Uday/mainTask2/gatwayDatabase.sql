-- Active: 1741678172388@@127.0.0.1@5432@gateway

CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    flat_number VARCHAR(10) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    token TEXT
);


CREATE TABLE security (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    token TEXT
)

CREATE TABLE guest_requests (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    veichle_number VARCHAR(20),
    flat_number VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending', 
    security_id INTEGER REFERENCES security(id),
    owner_id INTEGER REFERENCES owners(id)
);


INSERT INTO owners (name, flat_number, phone, email, password, token) VALUES
('Uday Kumar', '101', '9876543210', 'uday@gmail.com', 'Uday123', NULL),
('Rohit Sharma', '105', '9347495712', 'rohit@gmail.com', 'Rohit123', NULL),
('Virat Kohli', '203', '9866945276', 'virat@gmail.com', 'Virat123', NULL),
('Eswar Kalyan', '208', '8876593246', 'kalyan@gmail.com', 'Kalyan123', NULL),
('MS Dhoni', '305', '9976443318', 'Dhoni@gmail.com', 'Dhoni123', NULL);


INSERT INTO security (name, email, password, token) VALUES
('Hardik Pandya', 'hardik@gmail.com', 'Hardik123', NULL),
('Jagan Mohan', 'jagan@gmail.com', 'Jagan123', NULL)


select * from owners;
select * from security;
select * from guest_requests;

