CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK(role in ('user','admin')) NOT NULL
);

CREATE TABLE theaters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(3) CHECK(status in('yes','no')) NOT NULL
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    runtime TIME NOT NULL CHECK (runtime < '04:00:00'),
    status VARCHAR(3) CHECK(status in('yes','no')) NOT NULL
);

CREATE TABLE show_timings (
    id SERIAL PRIMARY KEY,
    show_time TIME NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (end_time > start_time)
);

CREATE TABLE seat_categories (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE theater_seats (
    id SERIAL PRIMARY KEY,
    theater_id INT NOT NULL REFERENCES theaters (id) ON DELETE CASCADE,
    seat_category_id INT NOT NULL REFERENCES seat_categories (id) ON DELETE CASCADE,
    number_of_seats INT NOT NULL
);

CREATE TABLE theater_shows (
    id SERIAL PRIMARY KEY,
    theater_id INT NOT NULL REFERENCES theaters (id) ON DELETE CASCADE,
    show_timing_id INT NOT NULL REFERENCES show_timings (id) ON DELETE CASCADE,
    status VARCHAR(3) CHECK(status in('yes','no')) NOT NULL
);

CREATE TABLE movie_shows (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
    theater_id INT NOT NULL REFERENCES theaters (id) ON DELETE CASCADE,
    show_timing_id INT NOT NULL REFERENCES show_timings (id) ON DELETE CASCADE,
    UNIQUE (movie_id, theater_id, show_timing_id),
    status VARCHAR(3) CHECK(status in('yes','no')) NOT NULL
);

CREATE TABLE bookings(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_show_id INT NOT NULL REFERENCES movie_shows(id) ON DELETE CASCADE,
    seat_category_id INT NOT NULL REFERENCES seat_categories(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL CHECK(booking_date >= CURRENT_DATE),
    no_of_tickets INT NOT NULL
);


INSERT INTO users (username, password, role) VALUES
('shashi', 'hashed_password1', 'admin'),
('vikas', 'hashed_password2', 'user'),
('vamshi', 'hashed_password3', 'user');

INSERT INTO theaters (name, address, status) VALUES
('Prasads IMAX', 'Necklace Road, Hyderabad', 'yes'),
('AMB Cinemas', 'Gachibowli, Hyderabad', 'yes'),
('PVR Cinemas', 'Irrum Manzil, Hyderabad', 'yes'),
('Asian Cineplex', 'Kukatpally, Hyderabad', 'yes');

INSERT INTO movies (name, runtime, status) VALUES
('Court', '03:07:00', 'yes'),
('Pushpa 3: The Rise', '02:59:00', 'yes'),
('kalki: The Beginning', '02:39:00', 'no'),
('Devara: The Conclusion', '02:47:00', 'yes'),
('Ala Vaikunthapurramuloo', '02:45:00', 'no');

INSERT INTO show_timings (show_time, start_time, end_time) VALUES
('10:00:00', '10:00:00', '13:00:00'), 
('14:00:00', '14:00:00', '17:00:00'), 
('18:00:00', '18:00:00', '21:00:00'), 
('22:00:00', '22:00:00', '23:59:59'); 

INSERT INTO seat_categories (type) VALUES
('Economy'),
('Premium'),
('VIP');

INSERT INTO theater_seats (theater_id, seat_category_id, number_of_seats) VALUES
(1, 1, 100), 
(1, 2, 50),  
(1, 3, 20),  
(2, 1, 80),  
(2, 2, 40),  
(3, 1, 120), 
(3, 3, 30);  

INSERT INTO theater_shows (theater_id, show_timing_id, status) VALUES
(1, 1, 'yes'),
(1, 2, 'yes'),
(2, 2, 'yes'),
(2, 3, 'no'),
(3, 1, 'yes'),
(3, 3, 'no');


INSERT INTO movie_shows (movie_id, theater_id, show_timing_id, status) VALUES
(1, 1, 1, 'yes'), 
(2, 2, 2, 'yes'), 
(3, 3, 3, 'no'), 
(4, 1, 3, 'yes'), 
(5, 2, 1, 'no');


INSERT INTO bookings (user_id, movie_show_id, seat_category_id, booking_date, no_of_tickets) VALUES
(2, 1, 1, '2025-03-18', 2),
(3, 2, 2, '2025-03-19', 1), 
(2, 3, 3, '2025-03-20', 3), 
(3, 4, 1, '2025-03-21', 2), 
(2, 5, 2, '2025-03-22', 4); 

SELECT * FROM users;

SELECT name, address FROM theaters WHERE status = 'yes';

SELECT name, runtime FROM movies WHERE runtime > '02:30:00';

--Show all bookings with user details
SELECT b.id, u.username, m.name AS movie, b.booking_date, b.no_of_tickets
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN movie_shows ms ON b.movie_show_id = ms.id
JOIN movies m ON ms.movie_id = m.id;


--Count total bookings per user
SELECT u.username, COUNT(b.id) AS total_bookings
FROM bookings b
JOIN users u ON b.user_id = u.id
GROUP BY u.username;


--Find the total number of tickets booked per movie
SELECT u.username, COUNT(b.id) AS total_bookings
FROM bookings b
JOIN users u ON b.user_id = u.id
GROUP BY u.username;

--Get total bookings per theater
SELECT m.name AS movie, SUM(b.no_of_tickets) AS total_tickets
FROM bookings b
JOIN movie_shows ms ON b.movie_show_id = ms.id
JOIN movies m ON ms.movie_id = m.id
GROUP BY m.name;


--Get theaters with more than 1 movie showing
SELECT t.name AS theater, COUNT(ms.id) AS total_shows
FROM movie_shows ms
JOIN theaters t ON ms.theater_id = t.id
GROUP BY t.name
HAVING COUNT(ms.id) > 1;

--Find users who booked more than 3 tickets in total
SELECT u.username, SUM(b.no_of_tickets) AS total_tickets
FROM bookings b
JOIN users u ON b.user_id = u.id
GROUP BY u.username
HAVING SUM(b.no_of_tickets) > 3;

--Get top 3 users who booked the most ticketsSELECT u.username, SUM(b.no_of_tickets) AS total_tickets
SELECT u.username, SUM(b.no_of_tickets) AS total_tickets
FROM bookings b
JOIN users u ON b.user_id = u.id
GROUP BY u.username
ORDER BY total_tickets DESC
LIMIT 3;

--Find movies that are playing in multiple theaters
SELECT m.name AS movie, COUNT(DISTINCT ms.theater_id) AS theater_count
FROM movie_shows ms
JOIN movies m ON ms.movie_id = m.id
GROUP BY m.name
HAVING COUNT(DISTINCT ms.theater_id) > 1;

-- Find which seat category is booked the most
SELECT sc.type AS seat_category, COUNT(b.id) AS total_bookings
FROM bookings b
JOIN seat_categories sc ON b.seat_category_id = sc.id
GROUP BY sc.type
ORDER BY total_bookings DESC
LIMIT 1;

--Find bookings made for a future date
SELECT * FROM bookings 
WHERE booking_date > CURRENT_DATE;

--Find the theater with the highest number of bookings
SELECT t.name AS theater_name, COUNT(b.id) AS total_bookings
FROM bookings b
JOIN movie_shows ms ON b.movie_show_id = ms.id
JOIN theaters t ON ms.theater_id = t.id
GROUP BY t.name
ORDER BY total_bookings DESC
LIMIT 1;

SELECT * from theaters

select theaters.name,seat_categories.type,theater_seats.number_of_seats
from theaters 
join theater_seats
ON theaters.id = theater_seats.theater_id 
join seat_categories 
ON seat_categories.id = theater_seats.seat_category_id

SELECT theaters.name,show_timings.show_time
from theaters 
join theater_shows 
on theaters.id = theater_shows.theater_id 
join show_timings on show_timings.id = theater_shows.show_timing_id

SELECT movies.name,theaters.name,show_timings.start_time,show_timings.end_time 
from theaters 
join movie_shows 
on theaters.id = movie_shows.theater_id 
join movies on movies.id = movie_shows.movie_id 
join show_timings on show_timings.id = movie_shows.show_timing_id

--Queries executed near mentor---
--show movies with no theaters--
SELECT ms.status, m.name
FROM movies m 
LEFT JOIN movie_shows ms 
ON ms.movie_id = m.id
WHERE ms.status is NULL;

--insert ROBO movie 
INSERT INTO movies (name, runtime, status) VALUES
('Robo', '03:00:00', 'yes');

--no.of.tickets booked for court movie
SELECT m.name,sum(b.no_of_tickets) 
FROM bookings b
JOIN movie_shows ms 
ON ms.id = b.movie_show_id
JOIN movies m 
ON m.id = ms.movie_id
WHERE m.name='Court'
GROUP BY m.name
--HAVING m.name = 'Court'


SELECT * 
FROM bookings
WHERE id IN (SELECT id FROM movie_shows WHERE movie_id=(SELECT id FROM movies WHERE name ='Court'))