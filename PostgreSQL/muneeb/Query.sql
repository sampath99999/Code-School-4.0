-- Active: 1741678142568@@127.0.0.1@5432@ecommercetask
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    -- password_hash TEXT NOT NULL, -- hashed password
    full_name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table (Temporary storage before checkout)
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Address TABLE
CREATE TABLE address(
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    address_id INT REFERENCES address(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- e.g., 'Pending', 'Shipped', 'Delivered'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table (Tracks what products were bought in each order)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO users (username, email, full_name, phone) VALUES
('alice123', 'alice@example.com', 'Alice Johnson', '9876543210'),
('bob_smith', 'bob@example.com', 'Bob Smith', '9876543211'),
('charlie_b', 'charlie@example.com', 'Charlie Brown', '9876543212'),
('david_lee', 'david@example.com', 'David Lee', '9876543213'),
('emma_watson', 'emma@example.com', 'Emma Watson', '9876543214'),
('frank_miller', 'frank@example.com', 'Frank Miller', '9876543215'),
('grace_hopper', 'grace@example.com', 'Grace Hopper', '9876543216'),
('harry_potter', 'harry@example.com', 'Harry Potter', '9876543217'),
('isabella_ross', 'isabella@example.com', 'Isabella Ross', '9876543218'),
('jack_black', 'jack@example.com', 'Jack Black', '9876543219');

INSERT INTO categories (name) VALUES
('Electronics'),
('Clothing'),
('Books'),
('Groceries'),
('Furniture'),
('Sports & Fitness'),
('Beauty & Personal Care'),
('Toys & Games'),
('Home Appliances'),
('Automobile Accessories');

INSERT INTO products (title, description, price, stock_quantity, category_id) VALUES
('Smartphone', 'Latest 5G smartphone with 128GB storage', 799.99, 10, 1),
('Laptop', 'High-performance laptop with 16GB RAM', 1200.00, 5, 1),
('T-Shirt', 'Cotton round-neck t-shirt', 19.99, 50, 2),
('Jeans', 'Slim fit blue jeans', 39.99, 30, 2),
('Fiction Book', 'Best-selling fiction novel', 14.99, 100, 3),
('Rice Bag', '5kg bag of high-quality rice', 10.99, 200, 4),
('Sofa', 'Luxury 3-seater sofa', 499.99, 3, 5),
('Dining Table', 'Wooden dining table set', 699.99, 2, 5),
('Dumbbells', 'Set of adjustable dumbbells (10kg each)', 59.99, 20, 6),
('Hair Dryer', 'Powerful 2000W hair dryer with ionic technology', 49.99, 15, 7);

INSERT INTO cart (user_id, product_id, quantity) VALUES
(1, 1, 1),
(2, 3, 2),
(3, 5, 3),
(4, 6, 1),
(5, 8, 1),
(6, 2, 1),
(7, 4, 2),
(8, 7, 1),
(9, 9, 2),
(10, 10, 1);

INSERT INTO address (address) VALUES
('123 Main St, New York, NY'),
('456 Elm St, San Francisco, CA'),
('789 Oak St, Los Angeles, CA'),
('321 Pine St, Miami, FL'),
('654 Maple St, Seattle, WA'),
('111 Birch St, Chicago, IL'),
('222 Cedar St, Boston, MA'),
('333 Spruce St, Austin, TX'),
('444 Redwood St, Denver, CO'),
('555 Magnolia St, Dallas, TX');

INSERT INTO orders (user_id, address_id, total_price, status) VALUES
(1, 1, 799.99, 'Pending'),
(2, 2, 79.98, 'Shipped'),
(3, 3, 44.97, 'Delivered'),
(4, 4, 10.99, 'Pending'),
(5, 5, 699.99, 'Shipped'),
(6, 6, 1200.00, 'Delivered'),
(7, 7, 39.99, 'Pending'),
(8, 8, 499.99, 'Shipped'),
(9, 9, 119.98, 'Pending'),
(10, 10, 49.99, 'Delivered');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 799.99),
(2, 3, 2, 19.99),
(3, 5, 3, 14.99),
(4, 6, 1, 10.99),
(5, 8, 1, 699.99),
(6, 2, 1, 1200.00),
(7, 4, 1, 39.99),
(8, 7, 1, 499.99),
(9, 9, 2, 59.99),
(10, 10, 1, 49.99);


SELECT * FROM users;

SELECT * FROM categories;

SELECT * FROM products;

SELECT * FROM cart;

SELECT * FROM address;

SELECT * FROM orders;

SELECT * FROM order_items;

SELECT users.id, users.username,
 SUM(CASE WHEN orders.status = 'Pending' THEN 1 ELSE 0 END) AS pending_orders,
 SUM(CASE WHEN orders.status = 'Shipped' THEN 1 ELSE 0 END) AS shipped_orders,
 COUNT(CASE WHEN orders.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders
FROM users JOIN orders  ON users.id = orders.user_id
GROUP BY users.id, users.username
ORDER BY users.id; 

SELECT users.id, users.username,
 SUM(CASE WHEN orders.status = 'Pending' THEN 1 ELSE 0 END) AS pending_orders,
 SUM(CASE WHEN orders.status = 'Shipped' THEN 1 ELSE 0 END) AS shipped_orders,
 SUM(CASE WHEN orders.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
 SUM(order_items.price * order_items.quantity) AS total,
 address.address
FROM users 
 JOIN orders  ON users.id = orders.user_id
 JOIN address on orders.address_id = address.id
LEFT JOIN order_items ON orders.id = order_items.order_id
GROUP BY users.id, users.username,address.address
ORDER BY users.id;  


 

-- rank of user based on 
select 
    user_Id,
    (select username from users where id=o.user_id )as username,
    count(user_id) as order_count,
    (select count( DISTINCT order_count)
    FROM (select user_id, count(user_id) as order_count from orders GROUP BY user_id) as sub
    where sub.order_count>COUNT(o.user_id))+1 as rank 
 from orders o
 GROUP BY user_id
 ORDER BY order_count DESC;

--4)categories wise products
select c.name,string_agg(p.title , ',' ) as product_category, count(p.id) as total_count
from products p 
join categories c on p.category_id = c.id 
GROUP BY c.name;

--5)user name, user email, product ordered, total price, address
select u.id, u.username, u.email , p.title,o.total_price, a.address
from users u 
join orders o on u.id = o.user_id
join address a on o.address_id = a.id
join order_items oi on o.id = oi.order_id
join products p on oi.product_id = p.id
GROUP BY u.id,p.title,o.total_price,a.address; 

    --6)users who have ordered atleast once in each month
select u.id, u.username 
from users u
join orders o ON u.id = o.user_id
group by u.id, u.username
having COUNT(distinct EXTRACT(MONTH from o.created_at))  = 
(select COUNT(distinct EXTRACT(MONTH from created_at)) from orders);

 --7)products that never being bought product id, product name category name
 select  p.id, p.title
 from orders o 
 join order_items oi on o.id = oi.order_id 
 join products p on oi.product_id = p.id
 WHERE oi.product_id IS NULL;

--8)user wise and address wise data of orders for all status(shipped delivered pending)

SELECT users.id, users.username,
 SUM(CASE WHEN orders.status = 'Pending' THEN 1 ELSE 0 END) AS pending_orders,
 SUM(CASE WHEN orders.status = 'Shipped' THEN 1 ELSE 0 END) AS shipped_orders,
 SUM(CASE WHEN orders.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
 address.address
FROM users 
JOIN orders  ON users.id = orders.user_id
JOIN address on orders.address_id = address.id
GROUP BY users.id, users.username,address.address
ORDER BY users.id;

 

--10)user wise data like rank of users according to money spent by each user
select u.id,u.username,sum(o.total_price) as total_spend,
 RANK() OVER (ORDER BY SUM(o.total_price) DESC) AS spending_rank
from  users u 
join orders o on u.id = o.user_id
group by u.id, username
ORDER BY spending_rank;
r   

--11)month wise users buy products count or their orders data 
select u.username ,
extract(month from o.created_at) as order_month,
count(*) as product_order
from users u
join orders o on u.id = o.user_id
join order_Items oi on o.id = oi.order_id
join products p on p.id = oi.product_id
group by u.username,order_month
ORDER BY u.username, order_month 

--9) how many orders have been placed in the month by each user month wise , number of orders
select 
u.username,
extract(month from o.created_at) as order_month,
count(o.id) as orders
from users u
join orders o on u.id = o.user_id
GROUP BY u.username,order_month 
ORDER BY u.username;


--username how many products ordered how much amount spent and status(shipped delivered pending)like delivered and pending are main
select u.username, o.total_price, o.status,p.title,count(p.id)as products_ordered
from users u 
join orders o on u.id = o.user_id 
join order_items oi on o.id = oi.order_id
join products p on oi.product_id =  p.id
GROUP BY u.username, o.total_price, o.status,p.title
--where name like "_mango%"