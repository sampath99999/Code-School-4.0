-- Active: 1741677837220@@127.0.0.1@5432@payment_gateway_system

-- Users Table

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Merchants Table
CREATE TABLE merchants (
    merchant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    business_email VARCHAR(150) UNIQUE NOT NULL,
    business_phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Methods Table
CREATE TABLE payment_methods (
    method_id SERIAL PRIMARY KEY,
    method_name VARCHAR(50) UNIQUE NOT NULL CHECK (
        method_name IN (
            'Credit Card',
            'Debit Card',
            'UPI',
            'Net Banking',
            'Wallet'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (user_id),
    merchant_id INT REFERENCES merchants (merchant_id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    method_id INT REFERENCES payment_methods (method_id),
    status VARCHAR(20) CHECK (
        status IN (
            'Pending',
            'Success',
            'Failed',
            'Refunded'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refunds Table
CREATE TABLE refunds (
    refund_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions (transaction_id) UNIQUE,
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_status VARCHAR(20) CHECK (
        refund_status IN (
            'Initiated',
            'Processed',
            'Failed'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions (transaction_id),
    action VARCHAR(50) NOT NULL CHECK (
        action IN (
            'Payment Initiated',
            'Payment Success',
            'Payment Failed',
            'Refund Initiated',
            'Refund Processed'
        )
    ),
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users
INSERT INTO
    users (name, email, phone)
VALUES (
        'Alice Johnson',
        'alice.johnson@example.com',
        '9876543210'
    ),
    (
        'Bob Smith',
        'bob.smith@example.com',
        '8765432109'
    ),
    (
        'Charlie Brown',
        'charlie.brown@example.com',
        '7654321098'
    ),
    (
        'David White',
        'david.white@example.com',
        '6543210987'
    ),
    (
        'Emma Davis',
        'emma.davis@example.com',
        '5432109876'
    ) (
        'Yash',
        'yash.chary@example.com',
        '8629907882'
    );

-- Insert Merchants
INSERT INTO
    merchants (
        name,
        business_email,
        business_phone
    )
VALUES (
        'Amazon',
        'contact@amazon.com',
        '9998887777'
    ),
    (
        'Flipkart',
        'support@flipkart.com',
        '8887776666'
    ),
    (
        'Myntra',
        'help@myntra.com',
        '7776665555'
    ),
    (
        'Zomato',
        'info@zomato.com',
        '6665554444'
    ),
    (
        'Swiggy',
        'support@swiggy.com',
        '5554443333'
    );

-- Insert Payment Methods
INSERT INTO
    payment_methods (method_name)
VALUES ('Credit Card'),
    ('Debit Card'),
    ('UPI'),
    ('Net Banking'),
    ('Wallet');

-- Insert Transactions
INSERT INTO
    transactions (
        user_id,
        merchant_id,
        amount,
        method_id,
        status,
        created_at
    )
VALUES (
        1,
        1,
        2000.00,
        1,
        'Success',
        '2025-03-10 12:00:00'
    ),
    (
        1,
        1,
        3000.50,
        2,
        'Success',
        '2025-03-10 14:30:00'
    ),
    (
        2,
        2,
        1500.00,
        3,
        'Failed',
        '2025-03-09 16:15:00'
    ),
    (
        2,
        2,
        500.00,
        4,
        'Success',
        '2025-03-10 10:45:00'
    ),
    (
        3,
        3,
        700.00,
        5,
        'Pending',
        '2025-03-08 09:20:00'
    ),
    (
        4,
        4,
        2500.00,
        1,
        'Refunded',
        '2025-03-07 08:10:00'
    ),
    (
        5,
        5,
        1200.00,
        2,
        'Success',
        '2025-03-06 07:05:00'
    ),
    (
        5,
        5,
        5000.00,
        3,
        'Success',
        '2025-03-10 17:30:00'
    ),
    (
        1,
        3,
        1500.00,
        3,
        'Failed',
        '2025-03-19 16:15:00'
    ),
    (
        3,
        2,
        2000.00,
        1,
        'Success',
        '2025-03-20 16:15:00'
    );

-- Insert Refunds
INSERT INTO
    refunds (
        transaction_id,
        refund_amount,
        refund_status,
        created_at
    )
VALUES (
        6,
        2500.00,
        'Processed',
        '2025-03-07 10:00:00'
    );

-- Insert Audit Logs
INSERT INTO
    audit_logs (
        transaction_id,
        action,
        log_time
    )
VALUES (
        1,
        'Payment Success',
        '2025-03-10 12:01:00'
    ),
    (
        2,
        'Payment Success',
        '2025-03-10 14:31:00'
    ),
    (
        3,
        'Payment Failed',
        '2025-03-09 16:16:00'
    ),
    (
        4,
        'Payment Success',
        '2025-03-10 10:46:00'
    ),
    (
        5,
        'Payment Initiated',
        '2025-03-08 09:21:00'
    ),
    (
        6,
        'Refund Processed',
        '2025-03-07 10:01:00'
    ),
    (
        7,
        'Payment Success',
        '2025-03-06 07:06:00'
    ),
    (
        8,
        'Payment Success',
        '2025-03-10 17:31:00'
    ),
    (
        9,
        'Payment Failed',
        '2025-03-19 16:16:00'
    );

INSERT INTO
    audit_logs (
        transaction_id,
        action,
        log_time
    )
VALUES (
        10,
        'Payment Success',
        '2025-03-20 16:17:00'
    );

-- 1. Retrieve all transactions made by a specific user.
select * from transactions where user_id = 1;

-- 2. Find all failed transactions for a specific merchant.
select m.name, t.transaction_id, t.status
from transactions t
    join merchants m on t.merchant_id = m.merchant_id
where
    m.name = 'Flipkart'
    and t.status = 'Failed';

--3. List all available payment methods.
select pm.method_name as available_methods from payment_methods pm;

-- 4. Get the total number of transactions per user.
select t.user_id, u.name, count(t.transaction_id) as trans_count
from transactions t
    left join users u on t.user_id = u.user_id
group by
    t.user_id,
    u.name
ORDER BY user_id ASC;

-- 5. Find the total amount spent by a specific user.
select t.user_id, sum(t.amount)
from transactions t
where
    t.user_id = 1
    and t.status = 'Success'
GROUP BY
    t.user_id;

-- 6. Retrieve transaction details along with user details.
select t.transaction_id, t.merchant_id, t.amount, t.currency, t.method_id, t.status, t.created_at, u.*
from transactions t
    left join users u on u.user_id = t.user_id;

-- 7. List all transactions with merchant names.
select t.transaction_id, t.merchant_id, t.amount, t.currency, t.method_id, t.status, t.created_at, m.name as merchant_name
from transactions t
    join merchants m on t.merchant_id = m.merchant_id

-- 8. Get transactions that have refunds.
select t.*, r.refund_amount, r.refund_status, r.created_at
from transactions t
    inner join refunds r on r.transaction_id = t.transaction_id;

-- 9. List all transactions including those without refunds.
select t.*, r.refund_amount, r.refund_status, r.created_at
from transactions t
    left join refunds r on t.transaction_id = r.transaction_id;

-- 10. Get all merchants including those without transactions.
select m.*, t.transaction_id, t.status
from merchants m
    left join transactions t on t.merchant_id = m.merchant_id;

-- 11. Find total revenue per merchant.
select m.name, COALESCE(
        SUM(
            CASE
                WHEN t.status = 'Success' THEN t.amount
                ELSE 0
            END
        ), 0
    ) AS total_revenue
from merchants m
    left join transactions t on m.merchant_id = t.merchant_id
GROUP BY
    m.name;

--12. Find users who have never made a transaction.
select u.user_id, u.name
from transactions t
    right join users u on t.user_id = u.user_id
where
    t.user_id is NULL

-- 13. Retrieve the top 5 merchants with the highest transaction amounts.
select m.merchant_id, sum(
        case
            when t.status = 'Success' then t.amount
            else 0
        end
    ) as highest_trans
from transactions t
    right join merchants m on m.merchant_id = t.merchant_id
group by
    m.merchant_id
order by highest_trans DESC
limit 5;

-- 14. Find users who have made at least one refund.
select u.name, r.*
from
    users u
    right join transactions t on t.user_id = u.user_id
    right join refunds r on t.transaction_id = r.transaction_id

--15. Get the most frequently used payment method.

select pm.method_name, count(t.method_id)
from
    payment_methods pm
    left join transactions t on pm.method_id = t.method_id
group by
    pm.method_name
ORDER BY count(t.method_id) DESC
limit 1;

--16. Find the transaction with the highest amount.

select t.*
from transactions t
GROUP BY
    t.transaction_id
having
    t.status = 'Success'
order by max(t.amount) desc
limit 1;

--17. Find users who spent more than the average transaction amount.

select t.user_id, coalesce(
        sum(
            case
                when t.status = 'Success' then t.amount
                else 0
            end
        ), 0
    ), AVG(
        CASE
            WHEN t.status = 'Success' THEN t.amount
        END
    )
from transactions t
group by
    t.user_id
having
    coalesce(
        sum(
            case
                when t.status = 'Success' then t.amount
                else 0
            end
        ),
        0
    ) > AVG(
        CASE
            WHEN t.status = 'Success' THEN t.amount
        END
    )

-- 18. Rank users based on total spending.
select
    t.user_id,
    coalesce(
        sum(
            case
                when t.status = 'Success' then t.amount
                else 0
            end
        ),
        0
    ) as total_spendings,
    rank() OVER (
        ORDER BY COALESCE(
                SUM(
                    CASE
                        WHEN t.status = 'Success' THEN t.amount
                        ELSE 0
                    END
                ), 0
            ) DESC
    ) AS spending_rank
from transactions t
group by
    t.user_id;

--19. Get the last 5 transactions for a user.
select t.user_id, t.transaction_id, t.amount, t.status, t.created_at
from transactions t
where
    t.user_id = 1
order by t.created_at DESC
limit 5;

--20. Find transactions higher than the average amount for that merchant.
select t.merchant_id, t.amount, (
        select avg(t2.amount)
        from transactions t2
        where
            t2.merchant_id = t.merchant_id
            and t2.status = 'Success'
    ) as merchant_avg
from transactions t
where
    t.amount > (
        select avg(t2.amount)
        from transactions t2
        where
            t2.merchant_id = t.merchant_id
            and t2.status = 'Success'
    )
    and t.status = 'Success'

--21. Find the percentage of successful transactions per merchant.
SELECT
    m.name as merchant_name,
    round(count(
        case
            WHEN t.status = 'Success' then 1
        END
    ) * 100.0 / COUNT(*),2) AS success_percentage
FROM merchants m
    LEFT JOIN transactions t ON m.merchant_id = t.merchant_id
group BY
    m.name;

-- 22. Get a rolling sum of total transaction amounts per user.

SELECT
    user_id,
    transaction_id,
    amount,
    sum(amount) OVER (
        partition by
            user_id
        order by created_at
    ) as rolling_sum
from transactions
where
    status = 'Success';

-- 23. Find duplicate transactions.
select
    user_id,
    merchant_id,
    amount,
    status,
    method_id,
    COUNT(*) as duplicate_count
from transactions
group by
    user_id,
    merchant_id,
    amount,
    status,
    method_id
having
    COUNT(*) > 1;

-- 24. Find the last transaction for each user.
select t.user_id, max(t.created_at) as last_trans_date
from transactions t
group by
    t.user_id
order by t.user_id;

select DISTINCT on (user_id) user_id, created_at as latest_trans_date from transactions 
order by user_id asc, created_at DESC;


-- 25. Find users with payments but no successful transactions.

-- users who doesn't have a single successful trans.
select distinct
    t.user_id,
    t.transaction_id
from transactions t
where
    t.user_id NOT IN (
        select distinct
            t.user_id
        from transactions t
        where
            t.status = 'Success'
    );

--users who have atleast one failed trans.
select distinct
    t.user_id,
    t.transaction_id
from transactions t
where
    t.status != 'Success';

-- 26. Detect fraudulent transactions occurring within 10 minutes.
with
    txn_with_lag as (
        select
            transaction_id,
            user_id,
            amount,
            merchant_id,
            created_at,
            lag(created_at) over (
                partition by
                    user_id,
                    amount
                order by created_at
            ) as prev_txn_time,
            extract(
                epoch
                from (
                        created_at - lag(created_at) over (
                            partition by
                                user_id, amount
                            order by created_at
                        )
                    )
            ) as time_difference_seconds
        FROM transactions
    )
select *
from txn_with_lag
where
    time_difference_seconds <= 600;

-- 27. Analyze daily revenue trends.

SELECT
    DATE (created_at) AS transaction_date,
    SUM(amount) AS daily_revenue
FROM transactions
WHERE
    status = 'Success'
GROUP BY
    transaction_date
ORDER BY transaction_date;

-- 28. Find transactions refunded within 24 hours.
select
    t.merchant_id,
    t.status,
    t.created_at as transaction_time,
    r.created_at as refund_time
from transactions t
    right join refunds r on r.transaction_id = t.transaction_id
where
    r.created_at - t.created_at <= interval '1 day';

-- 29. Calculate monthly transaction statistics.
select
    extract(
        month
        from t.created_at
    ) as month,
    sum(
        case
            when t.status = 'Success' then t.amount
            else 0
        end
    ),
    count(*) as total_trans,
    count(
        case
            when t.status = 'Success' then 1
        end
    ) as successful_trans,
    count(
        case
            when t.status != 'Success' then 1
        end
    ) as failed_trans
from transactions t
group by
    month
order by month;

-- 30. Find the top 3 merchants for each month.

with
    ranked_table as (
        select
            extract(
                year
                from t.created_at
            ) as year,
            extract(
                month
                from t.created_at
            ) as month,
            t.merchant_id,
            m.name,
            sum(
                case
                    when t.status = 'Success' then t.amount
                    else 0
                end
            ) as total_revenue,
            rank() over (
                PARTITION BY
                    extract(
                        year
                        from t.created_at
                    ),
                    extract(
                        month
                        from t.created_at
                    )
                order by sum(
                        case
                            when t.status = 'Success' then t.amount
                            else 0
                        end
                    ) desc
            ) as rank
        from transactions t
            left join merchants m on m.merchant_id = t.merchant_id
        group by
            extract(
                year
                from t.created_at
            ),
            extract(
                month
                from t.created_at
            ),
            t.merchant_id,
            m.name
    )
select *
from ranked_table
where
    rank <= 3;