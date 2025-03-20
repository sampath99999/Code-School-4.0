-- Active: 1741609824793@@127.0.0.1@5432@joins
CREATE TABLE employees(
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(50),
    department_id INT
);

CREATE TABLE departments(
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(50)   
)

INSERT INTO employees (emp_name, department_id) VALUES
('Alice', 1), ('Bob', 2), ('Charlie', 3), ('David', NULL);

INSERT INTO departments(dept_name) VALUES
('HR'), ('IT'), ('Finance');


select emp_name , departments.dept_name from employees
JOIN departments
on emp_id = departments.dept_id; 

SELECT emp_name 
FROM employees 
LEFT JOIN departments 
ON employees.department_id = departments.dept_id 
WHERE departments.dept_id IS NULL;

select * from departments
right join employees
on departments.dept_id = employees.department_id;



select emp_name , COALESCE(departments.dept_name,'No Departments') as updated from employees
LEFT JOIN departments
ON employees.department_id = departments.dept_id

select emp_name , departments.dept_id from employees
join departments
on employees.department_id = departments.dept_id 


select dept_name , count(emp_name) as total_emp from departments
join employees
ON departments.dept_id = employees.department_id
group by dept_name

select emp_name , departments.dept_name from employees
LEFT JOIN departments
ON employees.department_id = departments.dept_id
where departments.dept_name ilike '%IT%'



select emp_name , departments.dept_name from employees
JOIN departments
ON employees.department_id = departments.dept_id
WHERE departments.dept_name NOT LIKE '%Finance%'


select count(emp_name) as emp_count , departments.dept_name from employees
JOIN departments
ON employees.department_id = departments.dept_id
group by emp_name ,departments.dept_name
having count(emp_name) > 1

SELECT emp_name, departments.dept_name 
FROM employees 
JOIN departments 
ON employees.department_id = departments.dept_id
WHERE emp_name = 'Alice';


select * from employees
FULL OUTER JOIN departments
ON employees.department_id = departments.dept_id

select emp_name , departments.dept_name from employees
LEFT JOIN departments
ON employees.department_id = departments.dept_id
where departments.dept_name LIKE 'F%'

select emp_name , departments.dept_name from employees
JOIN departments
ON employees.department_id = departments.dept_id
ORDER BY departments.dept_name


select emp_name , departments.dept_name from employees
JOIN departments
ON employees.department_id = departments.dept_id
group by departments.dept_name, emp_name
ORDER BY emp_name
LIMIT 1
OFFSET 1

-- different schema
CREATE TABLE customers(
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(50),
    email VARCHAR(100)
)

CREATE TABLE orders(
    order_id SERIAL PRIMARY KEY ,
    customer_id INTEGER REFERENCES customers(customer_id),
    order_date DATE,
    amount DECIMAL(10,2)
)

INSERT INTO customers (customer_name, email) VALUES
('Alice Johnson', 'alice@example.com'),
('Bob Smith', 'bob@example.com'),
('Charlie Davis', 'charlie@example.com'),
('David Miller', 'david@example.com'),
('Emma Wilson', 'emma@example.com');


INSERT INTO orders (customer_id, order_date, amount) VALUES
(1, '2024-03-01', 150.00),  -- Alice placed an order
(1, '2024-03-10', 200.50),  -- Alice placed another order
(2, '2024-04-05', 300.75),  -- Bob placed an order
(3, '2024-05-15', 100.25),  -- Charlie placed an order
(3, '2024-06-20', 50.00),   -- Charlie placed another order
(4, '2024-07-01', 400.00);  -- David placed an order
-- Emma (customer_id = 5) has not placed any orders.

--1)Retrieve all customer names along with their total order amount.
SELECT customer_name, sum(orders.amount) as total_amount from customers
JOIN orders
on customers.customer_id = orders.customer_id
GROUP BY customer_name 

--2)Find customers who haven't placed any orders.
select customer_name , orders.customer_id from customers
LEFT JOIN orders
on customers.customer_id = orders.customer_id
where orders.customer_id is null

select order_id ,orders.customer_id,customers.customer_name from orders
RIGHT JOIN customers
on customers.customer_id = orders.customer_id


select customer_name , min(orders.order_date) as first_order from customers
JOIN orders
on customers.customer_id = orders.customer_id
where EXTRACT(year from order_date) = 2024
GROUP BY customer_name
ORDER BY first_order
limit 1



select customer_name , count(orders.customer_id)
from customers
join orders
on customers.customer_id = orders.customer_id
GROUP BY customer_name , orders.customer_id
HAVING count(orders.customer_id) > 1



--relations

CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL
);


CREATE TABLE cards(
    id SERIAL PRIMARY KEY,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    student_id INTEGER NOT NULL REFERENCES students(id)
);

CREATE TABLE category(
    id SERIAL PRIMARY KEY ,
    name VARCHAR(255) UNIQUE NOT NULL
)

CREATE TABLE books(
    id SERIAL PRIMARY KEY ,
    title VARCHAR(255) NOT NULL,
    available_copies INT CHECK (available_copies >=0),
    category_id INT NOT NULL REFERENCES category(id),
    author_id INT NOT NULL REFERENCES author(id)
)


CREATE TABLE borrowed_books(
    id SERIAL PRIMARY KEY ,
    student_id INTEGER NOT NULL REFERENCES students(id),
    book_id INTEGER NOT NULL REFERENCES books(id),
    borrow_date DATE DEFAULT CURRENT_DATE,
    return_date DATE
)

CREATE TABLE author(
    id SERIAL PRIMARY KEY ,
    name VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(20) NOT NULL
)




-- Insert Data into Students
INSERT INTO students (name, email, phone) VALUES
('Alice Johnson', 'alice@example.com', '9876543210'),
('Bob Smith', 'bob@example.com', '9876543211'),
('Charlie Brown', 'charlie@example.com', '9876543212'),
('David Lee', 'david@example.com', '9876543213'),
('Emma Watson', 'emma@example.com', '9876543214');


-- Insert Data into Library Cards (One-to-One with Students)
INSERT INTO cards (card_number, issue_date, student_id) VALUES
('LC1001', '2025-01-15', 1),
('LC1002', '2025-02-10', 2),
('LC1003', '2025-03-05', 3),
('LC1004', '2025-04-01', 4),
('LC1005', '2025-04-20', 5);

-- Insert Data into Authors
INSERT INTO author (name, country) VALUES
('Frank Herbert', 'USA'),
('George Orwell', 'UK'),
('Yuval Noah Harari', 'Israel'),
('Silvanus P. Thompson', 'UK'),
('William Shakespeare', 'UK'),
('Thomas H. Cormen', 'USA'),
('F. Scott Fitzgerald', 'USA'),
('Stuart Russell', 'USA');

-- Insert Data into Categories
INSERT INTO category(name) VALUES
('Science Fiction'),
('History'),
('Mathematics'),
('Literature'),
('Computer Science');

-- Insert Data into Books (One-to-Many with Authors and Categories)
INSERT INTO books (title, author_id, category_id, available_copies) VALUES
('Dune', 1, 1, 5),
('1984', 2, 1, 4),
('Sapiens', 3, 2, 3),
('Calculus Made Easy', 4, 3, 6),
('Shakespeare’s Sonnets', 5, 4, 2),
('Introduction to Algorithms', 6, 5, 7),
('The Great Gatsby', 7, 4, 3),
('Artificial Intelligence: A Modern Approach', 8, 5, 5);

-- Insert Data into Borrowed Books (Many-to-Many with Students & Books)
INSERT INTO borrowed_books (student_id, book_id, borrow_date, return_date) VALUES
(1, 1, '2025-01-20', '2025-02-05'),
(2, 3, '2025-02-15', '2025-03-01'),
(3, 5, '2025-03-10', NULL),
(4, 6, '2025-04-05', NULL),
(1, 2, '2025-01-25', '2025-02-10'),
(2, 4, '2025-02-20', '2025-03-05'),
(3, 7, '2025-03-15', '2025-03-30'),
(5, 8, '2025-04-25', NULL),
(4, 1, '2025-04-10', NULL),
(1, 3, '2025-01-30','2025-02-15');


--retrieve all books that have been borrowned once
SELECT DISTINCT b.title FROM books b
JOIN borrowed_books bb ON b.id = bb.book_id

--retrieve students who have never borrowned books
SELECT s.id FROM students s
LEFT OUTER JOIN borrowed_books bb
ON s.id = bb.book_id
where bb.book_id is NULL

--retrive most borrowned name
SELECT b.title , count(bb.book_id ) as most_bb FROM books b
LEFT JOIN borrowed_books bb 
ON b.id = bb.book_id
GROUP BY b.title
ORDER BY most_bb DESC
LIMIT 1


--Retrive books which are borrowned in the last three months



select b.id,b.title from books b
LEFT JOIN borrowed_books bb
ON b.id = bb.book_id
where bb.borrow_date BETWEEN CURRENT_DATE - INTERVAL '3 months' and CURRENT_DATE


--find students who have borrowned books from every category
SELECT student.id, book.id, count(books.category_id) FROM borrowed_books 
JOIN books ON borrowed_books.book_id = books.id
JOIN students ON borrowed_books.student_id = students.id
GROUP BY student.id
HAVING count


--find students who have borrowed books from the same author multiple times
SELECT student_id, count(b.author_id) FROM borrowed_books bb
JOIN students s
ON bb.student_id = s.id
JOIN books b
ON bb.book_id = b.id
GROUP BY student_id, book_id , b.author_id
HAVING count(b.author_id) >1;








