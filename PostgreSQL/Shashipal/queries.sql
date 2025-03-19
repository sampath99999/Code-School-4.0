-- Active: 1742040737679@@127.0.0.1@5432@ticketbooking
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK(role in ('user','admin')) NOT NULL
);

CREATE TABLE theaters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(20) CHECK(status in('available','not available')) NOT NULL

);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    runtime TIME NOT NULL CHECK (runtime < '04:00:00'),
    status VARCHAR(20) CHECK(status in('available','not available')) NOT NULL
);


CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE movie_genres (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies (id) ON DELETE CASCADE NOT NULL,
    genre_id INT REFERENCES genres (id) ON DELETE CASCADE NOT NULL ,
   UNIQUE (movie_id, genre_id)
)


CREATE TABLE show_timings (
    id SERIAL PRIMARY KEY,
    start_time TIME UNIQUE NOT NULL,
    end_time TIME UNIQUE NOT NULL,
    CHECK (end_time > start_time)
)

CREATE TABLE seat_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
)

CREATE TABLE theater_seats (
    id SERIAL PRIMARY KEY,
    theater_id INT NOT NULL REFERENCES theaters (id) ON DELETE CASCADE,
    seat_category_id INT NOT NULL REFERENCES seat_categories (id) ON DELETE CASCADE,
    number_of_seats INT NOT NULL,
    UNIQUE (theater_id, seat_category_id)
)



CREATE TABLE theater_shows (
    id SERIAL PRIMARY KEY,
    theater_id INT NOT NULL REFERENCES theaters (id) ON DELETE CASCADE,
    show_timing_id INT NOT NULL REFERENCES show_timings (id) ON DELETE CASCADE,
    UNIQUE (theater_id, show_timing_id)
)

CREATE TABLE movie_shows (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
    theater_id INT NOT NULL REFERENCES theaters (id) ON DELETE CASCADE,
    show_timing_id INT NOT NULL REFERENCES show_timings (id) ON DELETE CASCADE,
    UNIQUE (movie_id, theater_id, show_timing_id)
);



CREATE TABLE bookings(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_show_id INT NOT NULL REFERENCES movie_shows(id) ON DELETE CASCADE,
    seat_category_id INT NOT NULL REFERENCES seat_categories(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL CHECK(booking_date >= CURRENT_DATE),
    no_of_tickets INT NOT NULL
)



-- insert data

INSERT INTO users (username, password, role) VALUES
('user1', 'password1', 'user'),
('admin1', 'password2', 'admin'),
('user2', 'password3', 'user'),
('admin2', 'password4', 'admin');

INSERT INTO theaters (name, description, address, status) VALUES
('PVR Cinemas', 'A popular cinema chain with modern facilities', 'Plot 35, Hyderabad', 'available'),
('Inox Cinemas', 'Known for comfort and premium viewing experience', 'Mall Road, Hyderabad', 'available'),
('Sree Lakshmi Theatre', 'A traditional movie hall with a vintage touch', 'MG Road, Vijayawada', 'not available');

INSERT INTO movies (name, description, runtime, status) VALUES
('RRR', 'A fictional story set in the pre-independence era, about two revolutionaries.', '03:05:00', 'available'),
('Baahubali: The Beginning', 'The story of two brothers and a kingdom torn apart by betrayal.', '02:39:00', 'available'),
('Ala Vaikunthapurramuloo', 'A story of a man who finds his true identity and his relationship with family.', '02:25:00', 'available'),
('Pushpa: The Rise', 'A red sandalwood smuggler’s rise in the criminal world.', '02:59:00', 'available'),
('Kshana Kshanam', 'A gripping thriller involving love, crime, and unexpected turns.', '02:10:00', 'available');

INSERT INTO genres (name) VALUES
('Action'),
('Drama'),
('Thriller'),
('Comedy'),
('Romance'),
('Adventure');

INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1), 
(1, 2), 
(2, 1), 
(2, 2), 
(3, 2), 
(3, 5), 
(4, 1), 
(4, 3), 
(5, 3), 
(5, 4);

INSERT INTO show_timings (start_time, end_time) VALUES
('10:00:00', '13:05:00'),
('13:30:00', '16:39:00'),
('17:00:00', '19:25:00'),
('19:45:00', '22:44:00')



INSERT INTO seat_categories (name) VALUES
('VIP'),
('Regular'),
('Balcony'),
('Economy');

INSERT  INTO theater_seats (theater_id, seat_category_id, number_of_seats) VALUES
(1, 1, 50), 
(1, 2, 200), 
(1, 3, 100), 
(2, 1, 30), 
(2, 2, 150), 
(3, 4, 120); 

INSERT INTO theater_shows (theater_id, show_timing_id) VALUES
(1, 1), 
(1, 2), 
(2, 3), 
(2, 4), 
(3, 2); 

INSERT INTO movie_shows (movie_id, theater_id, show_timing_id) VALUES
(1, 1, 1), 
(2, 1, 2), 
(3, 2, 3), 
(4, 2, 4), 
(5, 3, 2); 

INSERT INTO bookings (user_id, movie_show_id, seat_category_id, booking_date, no_of_tickets) VALUES
(1, 1, 2, '2025-03-20', 2), 
(2, 3, 1, '2025-03-21', 1), 
(3, 5, 4, '2025-03-22', 3), 
(4, 2, 3, '2025-03-23', 4), 
(1, 4, 2, '2025-03-25', 1); 

--PRACTICE QUESTIONS

SELECT * from theaters

select theaters.name,seat_categories.name,theater_seats.number_of_seats from theaters join theater_seats on theaters.id = theater_seats.theater_id join seat_categories on seat_categories.id = theater_seats.seat_category_id

SELECT theaters.name,show_timings.start_time,show_timings.end_time from theaters join theater_shows on theaters.id = theater_shows.theater_id join show_timings on show_timings.id = theater_shows.show_timing_id

SELECT movies.name,theaters.name,show_timings.start_time,show_timings.end_time from theaters join movie_shows on theaters.id = movie_shows.theater_id join movies on movies.id = movie_shows.movie_id join show_timings on show_timings.id = movie_shows.show_timing_id

SELECT * from movies

SELECT * from movie_shows


--MENTOR QUERIES

--1
ALTER TABLE movie_shows ADD COLUMN status VARCHAR(10) CHECK(status in('active','inactive'))

update  movie_shows 
SET status ='active'

--2
select movies.name 
from movies left join movie_shows 
on movies.id = movie_shows.movie_id 
where movie_shows.status ='inactive'  or movie_shows.movie_id ISNULL


--3
INSERT INTO movies (name, description, runtime, status) VALUES
('court', 'A fictional story set in the pre-independence era, about two revolutionaries.', '03:05:00', 'available')


--4
select name 
from theaters 
where id in (select theater_id from movie_shows 
where movie_id !=(SELECT id from movies where name='RRR'))

