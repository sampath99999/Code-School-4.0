-- Active: 1741678042001@@127.0.0.1@5432@test2
create DATABASE test2;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    access_token VARCHAR(255) NOT NULL
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), 
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT
);
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1
);
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending'
);
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    price DECIMAL(10,2)
);
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    access_token VARCHAR(255),
    email VARCHAR(100) NOT NULL
);
ALTER TABLE users 
ALTER COLUMN access_token DROP NOT NULL;
INSERT INTO users (name, email, password) 
VALUES 
('Shoyeb', 'shoyeb@example.com', 'password123'),
('joe', 'joe@example.com', 'password456');
INSERT INTO admin_users (username, password, access_token)
VALUES 
('admin Shoyeb', 'admin123', NULL),
('admin jack', 'admin456', NULL);
ALTER TABLE admin_users 
ALTER COLUMN email DROP NOT NULL;
UPDATE admin_users
SET email = 'adminshoyeb@example.com'
WHERE username = 'admin Shoyeb';
 SELECT * from admin_users;

 SELECT * FROM users;
 SELECT * from products;
 INSERT INTO products (name, category, description, price, image_url) VALUES
('iPhone 14 Pro', 'mobile', 'Apple iPhone 14 Pro with A16 Bionic chip and 6.1-inch display', 999.00, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-2.jpg'),
('iPhone 13', 'mobile', 'Apple iPhone 13 with A15 Bionic chip and 6.1-inch display', 799.00, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-2.jpg'),
('iPhone SE (2022)', 'mobile', 'Apple iPhone SE (2022) with A15 Bionic chip and 4.7-inch display', 429.00, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-se-2022-2.jpg'),
('iPhone 14', 'mobile', 'Apple iPhone 14 with A15 Bionic chip and 6.1-inch display', 799.00, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-2.jpg'),
('MacBook Air M2', 'laptops', 'Apple MacBook Air with M2 chip and 13.6-inch Liquid Retina display', 1199.00, 'https://www.apple.com/v/macbook-air-13-and-15-inch/b/images/overview/hero_mba_m2__fg46jrr4ayo2_large.jpg'),
('MacBook Pro 14"', 'laptops', 'Apple MacBook Pro 14-inch with M1 Pro chip', 1999.00, 'https://www.apple.com/v/macbook-pro-14-and-16/b/images/overview/hero_mbp_14_16__fd4rsqhm1y2i_large.jpg'),
('MacBook Pro 16"', 'laptops', 'Apple MacBook Pro 16-inch with M1 Max chip', 2499.00, 'https://www.apple.com/v/macbook-pro-14-and-16/b/images/overview/hero_mbp_14_16__fd4rsqhm1y2i_large.jpg'), -- Using the same as 14" as a stable alternative might be harder to find quickly
('MacBook Air M1', 'laptops', 'Apple MacBook Air with M1 chip and 13.3-inch Retina display', 999.00, 'https://www.apple.com/v/macbook-air-m1/j/images/overview/hero_endframe__ebl18fnclyia_large.jpg'),
('AirPods Pro (2nd Gen)', 'accessories', 'Apple AirPods Pro with Active Noise Cancellation', 249.00, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660759813185'),
('Apple Watch Series 8', 'accessories', 'Apple Watch Series 8 with advanced health features', 399.00, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-s8-2.jpg'),
('iPod Touch (7th Gen)', 'accessories', 'Apple iPod Touch 7th Generation, 32GB', 199.00, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipod-touch-7th-gen-2.jpg'),
('MagSafe Charger', 'accessories', 'Apple MagSafe Charger for iPhone and AirPods', 39.00, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXMT2?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1591634737000')
;
SELECT * from cart;

select * from order_items;
SELECT * from users;