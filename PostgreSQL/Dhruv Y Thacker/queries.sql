-- Active: 1741774921246@@127.0.0.1@5432@weekly_task_shopping_db

Users Table
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



--1)user wise status of pending shipped and deliverd counts
SELECT u.id, u.username,
SUM(CASE WHEN o.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
SUM(CASE WHEN o.status = 'Shipped' THEN 1  ELSE 0 END) AS shipped_count,
SUM(CASE WHEN o.status = 'Delivered' THEN 1  ELSE 0 END) AS delivered_count
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username
ORDER BY u.id;

--2)user wise with address and final price
SELECT u.id, u.username, a.address,
SUM(CASE WHEN o.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
SUM(CASE WHEN o.status = 'Shipped' THEN 1 ELSE 0 END) AS shipped_count,
SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_count,
SUM(oi.quantity*oi.price) AS final_price
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id
RIGHT JOIN address a ON o.address_id = a.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY u.id, u.username, a.address
ORDER BY u.id;

--3)rank of the perticular user according to the number of orders placed with out rank function
SELECT 
    user_id,
    (SELECT username FROM users WHERE id = o.user_id) AS username,
    COUNT(user_id) AS order_count,
    (SELECT COUNT(DISTINCT order_count) 
     FROM (SELECT user_id, COUNT(user_id) AS order_count FROM orders GROUP BY user_id) AS sub 
     WHERE sub.order_count > COUNT(o.user_id)) + 1 AS rank
FROM orders o
GROUP BY user_id
ORDER BY order_count DESC;

--4)categories wise products
SELECT c.id AS category_id, c.name as category_name, STRING_AGG(p.title, ', ') AS product_names, COUNT(p.id) as total_count
FROM categories c
JOIN products p ON c.id=p.category_id
GROUP BY c.id, c.name
ORDER BY c.id;

--5)user name, user email, product name(seperated) ordred, total price, //uesr order datails
SELECT 
    u.username, 
    u.email, 
    STRING_AGG(p.title, ', ') AS ordered_products, 
    SUM(o.total_price) AS total_price_spent
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
GROUP BY u.username, u.email
ORDER BY total_price_spent DESC;

--6)users who have ordered atleast once in each month 
SELECT o.user_id, u.username
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at BETWEEN '2025-01-17' AND '2025-03-17'
GROUP BY o.user_id, u.username
HAVING COUNT(DISTINCT EXTRACT(MONTH FROM o.created_at)) = 
(
    SELECT COUNT(DISTINCT EXTRACT(MONTH FROM o.created_at))
    FROM orders o
    WHERE o.created_at BETWEEN '2025-01-17' AND '2025-03-17'
);

--7)products that never being bought product id, product name category name
SELECT p.id, p.title, c.name 
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE oi.product_id IS NULL;

--8)user wise and address wise data of orders for all status(shipped deliverd pending)
SELECT u.id, u.username, a.address,
SUM(CASE WHEN o.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
SUM(CASE WHEN o.status = 'Shipped' THEN 1 ELSE 0 END) AS shipped_count,
SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_count
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN address a ON o.address_id = a.id
GROUP BY u.id, u.username, a.address
ORDER BY u.id;

--9)category wise higest sold products according to quantity
SELECT c.id AS category_id, c.name AS category_name, p.id AS product_id, p.title AS product_name, SUM(oi.quantity) AS total_quantity
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.title, c.id, c.name
HAVING SUM(oi.quantity) = (
    SELECT MAX(total_quantity)
    FROM (
        SELECT p.category_id, SUM(oi.quantity) AS total_quantity
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id, p.category_id
    ) AS subquery
    WHERE subquery.category_id = p.category_id
)
ORDER BY c.id; 

--with rank function
WITH RankedProducts AS (
    SELECT 
        c.id AS category_id, 
        c.name AS category_name, 
        p.id AS product_id, 
        p.title AS product_name, 
        SUM(oi.quantity) AS total_quantity,
        RANK() OVER (PARTITION BY c.name ORDER BY SUM(oi.quantity) DESC) AS rnk
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN categories c ON p.category_id = c.id
    GROUP BY c.id, c.name, p.id, p.title
)
SELECT category_id, category_name, product_id, product_name, total_quantity
FROM RankedProducts
WHERE rnk = 1
ORDER BY category_id;

--10)category wise higest unsold(stock_quantity) products according to quantity
SELECT c.id AS category_id, c.name AS category_name, p.id AS product_id, p.title AS product_name, SUM(p.stock_quantity) AS total_quantity
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.title, c.id, c.name
HAVING SUM(p.stock_quantity) = (
    SELECT MAX(total_quantity)
    FROM (
        SELECT p.category_id, SUM(p.stock_quantity) AS total_quantity
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id, p.category_id
    ) AS subquery
    WHERE subquery.category_id = p.category_id
)
ORDER BY c.id;

--with rank function
WITH RankedProducts AS (
    SELECT 
        c.id AS category_id, 
        c.name AS category_name, 
        p.id AS product_id, 
        p.title AS product_name, 
        SUM(p.stock_quantity) AS total_quantity,
        RANK() OVER (PARTITION BY c.id ORDER BY SUM(p.stock_quantity) DESC) AS rnk
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN categories c ON p.category_id = c.id
    GROUP BY c.id, c.name, p.id, p.title
)
SELECT category_id, category_name, product_id, product_name, total_quantity
FROM RankedProducts
WHERE rnk = 1
ORDER BY category_id;

--11)user wise data like rank of users accordind to money spent by each user
SELECT 
    u.id AS user_id, 
    u.username, 
    u.full_name, 
    SUM(o.total_price) AS total_spent, 
    RANK() OVER (ORDER BY SUM(o.total_price) DESC) AS spending_rank
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY u.id, u.username, u.full_name
ORDER BY spending_rank;

--12)month wise users buied products count or theier orders data 
-- ex)
--username how many products ordered how much amount spent and status(shipped deliverd pending)like delivered and pending are main
SELECT 
    u.username,
    EXTRACT(MONTH FROM o.created_at) AS order_month,
    COUNT(oi.id) AS total_products_ordered,
    SUM(o.total_price) AS total_amount_spent,
    o.status
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY u.username, order_month, o.status
ORDER BY u.username, order_month, o.status;




-------another table and another question
--NODE parent_id 
--1-->null(root)
--2-->1(middle)
--3-->1(leaf)
--4-->2(leaf)
--5-->2(leaf)

CREATE Table tree (
    node INT PRIMARY KEY,
    parent_id INT
);

INSERT into tree(node,parent_id) VALUES
(1,NULL),
(2,1),
(3,1),
(4,2),
(5,2);

SELECT * from tree;

--which node what like is the node root, middle or leaf ?
SELECT node,
CASE 
    WHEN parent_id is NULL THEN 'Root node'
    WHEN parent_id is NOT NULL AND 
    node in (SELECT DISTINCT parent_id from tree where parent_id in (select node from tree)) THEN 'Middle node'
    ELSE 'Leaf node'
    END AS "node name"
FROM tree ;


--sub query to get the child node which is used above
SELECT DISTINCT parent_id from tree where parent_id in (select node from tree)