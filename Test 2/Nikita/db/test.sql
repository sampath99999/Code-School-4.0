-- Active: 1741678145621@@127.0.0.1@5432@test2
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    password VARCHAR(50) NOT NULL,
    token TEXT
);
select* from users;

INSERT INTO users (name, email, phone, role, password) VALUES
('Nikita', 'nikita@gmail.com', '9878675645', 'owner', 'nikki@123'),
('Aniket', 'aniket@gmail.com', '7867564534', 'guard', 'aniket@123');

Insert Into users(name,email,phone,role,password)VALUES('Harshit','hash@67gmail.com','9087765667','guard','harsh@123');

CREATE TYPE status_enum AS ENUM ('approve', 'reject');

CREATE TABLE guard_requests (
    id SERIAL PRIMARY KEY,
    visitor_name VARCHAR(30) NOT NULL,
    flat_number VARCHAR(10) NOT NULL UNIQUE,
    status status_enum DEFAULT 'reject'
);



INSERT INTO guard_requests (visitor_name, flat_number, status)
VALUES 
('Rahul Verma', 'A-101', 'reject'),
('Pooja Singh', 'B-202', 'reject'),
('Amit Joshi', 'C-303', 'reject');

ALTER TABLE guard_requests
ADD COLUMN number VARCHAR(15) UNIQUE,
ADD COLUMN bike_number VARCHAR(15) UNIQUE;

UPDATE guard_requests
SET number = '9876543210', bike_number = 'TS09AB1234'
WHERE id = 2;

UPDATE guard_requests
SET number = '9123456789', bike_number = 'TS10XY5678'
WHERE id = 3;

UPDATE guard_requests
SET number = '9012345678', bike_number = 'TS11LM4321'
WHERE id = 6;

select*from guard_requests;



CREATE TABLE owner_requests (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL,              
    status status_enum DEFAULT 'reject', 
    FOREIGN KEY (request_id) REFERENCES guard_requests(id) ON DELETE CASCADE
);


INSERT INTO owner_requests (request_id)
VALUES 
(1),  
(2),    
(3);   

select*from owner_requests;
 
SELECT 
    owner.id AS owner_request_id,
    gr.id AS guard_request_id,
    gr.visitor_name,
    gr.flat_number,
    owner.status
FROM owner_requests owner
JOIN guard_requests gr ON owner.request_id = gr.id;
