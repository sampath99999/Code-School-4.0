-- Active: 1742040737679@@127.0.0.1@5432@new
-- Create schema

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT CHECK (quantity > 0),
    UNIQUE (user_id, product_id)
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',  -- e.g., 'pending', 'shipped', 'delivered'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL
);

ALTER TABLE users
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

ALTER TABLE users
ADD COLUMN token TEXT;


-- Regular user
INSERT INTO users (name, email, password_hash, is_admin)
VALUES ('John Doe', 'john@example.com', 'user123', FALSE);

SELECT * from products;
-- Admin user
INSERT INTO users (name, email, password_hash, is_admin)
VALUES ('Admin User', 'admin@example.com', 'admin123', TRUE);

INSERT INTO products (name, description, price, stock_quantity, image_url)
VALUES 
('Urban Tee', 'Classic cotton T-shirt with a modern fit.', 19.99, 50, 'https://images.pexels.com/photos/32082879/pexels-photo-32082879/free-photo-of-stylish-urban-fashion-with-graphic-tee-and-sneakers.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Denim Jacket', 'Rugged denim jacket for a timeless look.', 49.99, 30, 'https://images.pexels.com/photos/2229712/pexels-photo-2229712.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Sneakers', 'Comfortable everyday sneakers.', 39.99, 100, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Backpack', 'Durable backpack with multiple compartments.', 29.99, 25, 'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Sunglasses', 'Stylish sunglasses with UV protection.', 14.99, 75, 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Hoodie', 'Warm and soft fleece hoodie.', 34.99, 40, 'https://images.pexels.com/photos/2932731/pexels-photo-2932731.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Joggers', 'Slim-fit joggers for casual wear.', 24.99, 60, 'https://images.pexels.com/photos/12645601/pexels-photo-12645601.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Graphic Tee', 'Printed T-shirt with urban art design.', 21.99, 45, 'https://images.pexels.com/photos/32086367/pexels-photo-32086367/free-photo-of-man-wearing-anime-art-t-shirt-on-city-bridge.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Baseball Cap', 'Adjustable cap with embroidered logo.', 12.99, 80, 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=600'),
('Leather Belt', 'Genuine leather belt with metal buckle.', 17.99, 35, 'https://images.pexels.com/photos/89783/belts-belt-buckle-leather-metal-89783.jpeg?auto=compress&cs=tinysrgb&w=600');

select * from cart_items;
