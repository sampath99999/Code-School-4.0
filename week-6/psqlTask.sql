CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, phone) VALUES
('John Doe', 'john.doe@example.com', '1234567890'),
('Jane Smith', 'jane.smith@example.com', '0987654321'),
('Alice Brown', 'alice.brown@example.com', '2223334444'),
('Bob White', 'bob.white@example.com', '5556667777'),
('Charlie Green', 'charlie.green@example.com', '8889990000'),
('David Black', 'david.black@example.com', '1110001111');

CREATE TABLE merchants (
    merchant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    business_email VARCHAR(150) UNIQUE NOT NULL,
    business_phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO merchants (name, business_email, business_phone) VALUES
('Tech Store', 'contact@techstore.com', '1112223333'),
('Fashion Hub', 'support@fashionhub.com', '4445556666'),
('Gadget World', 'info@gadgetworld.com', '7778889999'),
('Food Express', 'support@foodexpress.com', '6667778888');

CREATE TABLE payment_methods (
    method_id SERIAL PRIMARY KEY,
    method_name VARCHAR(50) UNIQUE NOT NULL CHECK (method_name IN ('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payment_methods (method_name) VALUES
('Credit Card'),
('Debit Card'),
('UPI'),
('Net Banking'),
('Wallet');

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    merchant_id INT REFERENCES merchants(merchant_id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    method_id INT REFERENCES payment_methods(method_id),
    status VARCHAR(20) CHECK (status IN ('Pending', 'Success', 'Failed', 'Refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transactions (user_id, merchant_id, amount, currency, method_id, status) VALUES
(1, 1, 1000.00, 'INR', 1, 'Success'),
(2, 2, 500.50, 'INR', 3, 'Pending'),
(3, 3, 1500.75, 'INR', 2, 'Success'),
(4, 4, 200.00, 'INR', 4, 'Failed'),
(5, 1, 300.25, 'INR', 5, 'Refunded'),
(6, 2, 750.00, 'INR', 3, 'Success');

CREATE TABLE refunds (
    refund_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(transaction_id) UNIQUE,
    refund_amount DECIMAL(10,2) NOT NULL,
    refund_status VARCHAR(20) CHECK (refund_status IN ('Initiated', 'Processed', 'Failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO refunds (transaction_id, refund_amount, refund_status) VALUES
(2, 500.50, 'Initiated'),
(5, 300.25, 'Processed');

CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(transaction_id),
    action VARCHAR(50) NOT NULL CHECK (action IN ('Payment Initiated', 'Payment Success', 'Payment Failed', 'Refund Initiated', 'Refund Processed')),
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO audit_logs (transaction_id, action) VALUES
(1, 'Payment Success'),
(2, 'Payment Initiated'),
(3, 'Payment Success'),
(4, 'Payment Failed'),
(5, 'Refund Initiated'),
(6, 'Payment Success');



--1)Retrieve all transactions made by a specific user.
SELECT * FROM transactions WHERE user_id = 1;


--2. Find all failed transactions for a specific merchant.
SELECT * FROM transactions WHERE merchant_id = 2 AND status = 'Failed';

--3)List all available payment methods.
select method_name from payment_methods

--4) Get the total number of transactions per user. 
SELECT user_id, COUNT(*) as total_transactions FROM transactions GROUP BY user_id;


--5)Find the total amount spent by a specific user.
select sum(amount) from transactions 
where user_id = 3

--6)Retrieve transaction details along with user details.
SELECT * from transactions
JOIN users
ON transactions.user_id = users.user_id;

--7)List all transactions with merchant names
SELECT * FROM transactions
JOIN merchants
ON transactions.merchant_id = merchants.merchant_id;


--8)Get transactions that have refunds.
SELECT *
FROM transactions t
JOIN refunds r ON t.transaction_id = r.transaction_id;

--9)List all transactions including those without refunds.
SELECT * FROM transactions
LEFT JOIN refunds
ON transactions.transaction_id = refunds.transaction_id;


--10)
select * from merchants
LEFT JOIN transactions
ON merchants.merchant_id = transactions.merchant_id;

--11) Find total revenue per merchant. 
SELECT merchant_id, SUM(amount) as total_revenue FROM transactions 
GROUP BY merchant_id;


--12) Find users who have never made a transaction
select name from users
LEFT JOIN transactions
ON users.user_id = transactions.user_id
where transactions.user_id is NULL

--13) Retrieve the top 5 merchants with the highest transaction amounts. 
SELECT merchant_id, SUM(amount) as total_amount FROM transactions
GROUP BY merchant_id
ORDER BY total_amount DESC

--14)Find users who have made at least one refund.
SELECT name FROM users
JOIN transactions
ON users.user_id = transactions.user_id
JOIN refunds
ON transactions.transaction_id = refunds.transaction_id;


--15)Get the most frequently used payment method
select payment_methods.method_name, count(*) from transactions
JOIN payment_methods
ON transactions.method_id = payment_methods.method_id
GROUP BY payment_methods.method_name
ORDER BY count(*) DESC
LIMIT 1

--16)16. Find the transaction with the highest amount. 
select max(amount) from transactions

--17) Find users who spent more than the average transaction amount.
SELECT name FROM users
JOIN transactions
ON users.user_id = transactions.user_id
WHERE transactions.amount > (SELECT AVG(amount) FROM transactions);



--18)Rank users based on total spending.

SELECT u.name, SUM(t.amount) AS total_spent,
       RANK() OVER (ORDER BY SUM(t.amount) DESC) AS rank
FROM users u
JOIN transactions t ON u.user_id = t.user_id
GROUP BY u.name;



--19) Get the last 5 transactions for a user
SELECT * FROM transactions
WHERE user_id = 2
LIMIT 5


--20). Find transactions higher than the average amount for that merchant
SELECT * from transactions t1
where t1.amount > (
    select AVG(t2.amount)
    from transactions t2
    where t2.merchant_id = t1.merchant_id
)


--21) Find the percentage of successful transactions per merchant
SELECT m.name,
       COUNT(CASE WHEN t.status = 'Success' THEN 1 END) * 100.0 / COUNT(*) AS success_percentage
FROM merchants m
JOIN transactions t ON m.merchant_id = t.merchant_id
GROUP BY m.name;


--22)Get a rolling sum of total transaction amounts per user.
SELECT user_id, amount,
       SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at) AS rolling_sum
FROM transactions;


--23)Find duplicate transactions.
SELECT user_id, merchant_id, amount, currency, method_id, status, COUNT(*)
FROM transactions
GROUP BY user_id, merchant_id, amount, currency, method_id, status
HAVING COUNT(*) > 1;


--24)
SELECT DISTINCT user_id,created_at
FROM transactions
ORDER BY user_id, created_at DESC;



--25) Find users with payments but no successful transactions.
select distinct t.user_id , t.transaction_id from transactions t
where t.status != 'success'


--26) Detect fraudulent transactions occurring within 10 minutes.



--27) Analyze daily revenue trends.
SELECT EXTRACT(DAY FROM created_at) AS day, SUM(amount) AS revenue FROM transactions
GROUP BY day


--28) Find transactions refunded within 24 hours.
select * from transactions t
JOIN refunds r
on t.transaction_id = r.transaction_id
where r.created_at <= t.created_at + INTERVAL '24 hours'


--29)Calculate monthly transaction statistics. 
SELECT 
    EXTRACT(MONTH FROM created_at) AS month, 
    EXTRACT(YEAR FROM created_at) AS year, 
    SUM(amount) AS total_amount, 
    COUNT(*) AS total_transactions 
FROM transactions
GROUP BY month, year
ORDER BY year, month;



--30) Find the top 3 merchants for each month.
select merchant_id , sum(amount) ,EXTRACT(year from created_at) as year , EXTRACT(month from created_at) as month from transactions
GROUP BY merchant_id , EXTRACT(year from created_at) , EXTRACT(month from created_at)
ORDER BY sum(amount) DESC
LIMIT 3
