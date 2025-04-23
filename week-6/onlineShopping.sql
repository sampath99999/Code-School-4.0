CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    address TEXT NOT NULL
);


INSERT INTO customers (name, email, phone, address) VALUES
('Alice Johnson', 'alice@example.com', '9876543210', '123 Main St, NY'),
('Bob Smith', 'bob@example.com', '9876543211', '456 Park Ave, CA'),
('Charlie Brown', 'charlie@example.com', '9876543212', '789 Elm St, TX'),
('David Lee', 'david@example.com', '9876543213', '321 Pine St, FL');



CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE
);


INSERT INTO categories (category_name) VALUES
('Electronics'), ('Clothing'), ('Books'), ('Home & Kitchen');


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    category_id INT NOT NULL REFERENCES categories(id)
);


INSERT INTO products (name, price, stock, category_id) VALUES
('Laptop', 1200.00, 10, 1),
('Smartphone', 800.00, 15, 1),
('Jeans', 40.00, 50, 2),
('T-shirt', 20.00, 100, 2),
('Cookbook', 25.00, 30, 3),
('Fiction Novel', 15.00, 60, 3),
('Blender', 50.00, 20, 4),
('Microwave Oven', 150.00, 10, 4);





CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary > 0)
);


INSERT INTO employees (name, position, salary) VALUES
('Emma Watson', 'Manager', 5000.00),
('Liam Carter', 'Sales Associate', 2500.00),
('Sophia Adams', 'Cashier', 2200.00),
('Noah Thompson', 'Warehouse Staff', 2000.00);




CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id),
    employee_id INT NOT NULL REFERENCES employees(id),
    order_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0)
);


INSERT INTO orders (customer_id, employee_id, order_date, total_amount) VALUES
(1, 1, '2025-03-01', 1220.00),
(2, 2, '2025-03-02', 800.00),
(3, 3, '2025-03-03', 65.00),
(4, 4, '2025-03-04', 200.00);




CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL
);


INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES
(1, 1, 1, 1200.00), 
(1, 5, 1, 20.00),
(2, 2, 1, 800.00),
(3, 6, 2, 30.00),
(3, 4, 1, 20.00),
(4, 7, 2, 100.00),
(4, 8, 1, 100.00);




select name from products
where price > 100;


--Retrieve all orders where the total amount is greater than or equal to 500.

select * from orders 
where total_amount >= 500


--Retrieve all customers living in 'New York'
select * from customers
where address LIKE '%NY%'



select * from products
ORDER BY price DESC
limit 3

select distinct category_id from products

select DISTINCT position from employees


select name from customers
WHERE name  LIKE 'A%'


select * from products
where category_id IN (1,3)


select * from products
where price BETWEEN 50 and 500


select category_id ,count(stock) from products
where stock >50
group by category_id


select category_id, avg(price) from products
group by category_id
having avg(price) > 100;


--count the no of orders placed per month in the last year
SELECT 
    EXTRACT(YEAR FROM order_date) AS order_year, 
    EXTRACT(MONTH FROM order_date) AS order_month,
    COUNT(*) AS orders_placed
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
GROUP BY order_year, order_month
ORDER BY order_year, order_month;



