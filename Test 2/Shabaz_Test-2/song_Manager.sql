-- Active: 1745064282933@@127.0.0.1@5432@song_manger
CREATE DATABASE   "status": false,
    "message": "Database Connection ErrorSQLSTATE[08006] [7] connection to server at \"localhost\" (::1), port 5432 failed: FATAL:  database \"connect_timeout=30\" does not exist",
    "data": null;

--create Tables
CREATE Table admin(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email_id VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255)
);

CREATE Table categories(
    id SERIAL PRIMARY KEY,
    description VARCHAR (50) NOT NULL UNIQUE
)

 CREATE Table songs(
    id SERIAL PRIMARY KEY,
    poster TEXT NOT NULL,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    song_title VARCHAR(100) NOT NULL,
    artists VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );


 CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    song_id INT NOT NULL,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (admin_id, song_id) 
);

--insert queries

INSERT INTO categories(description) VALUES
('Bollywood'),
('Tollywood'),
('Hollywood');

INSERT INTO songs(category_id,poster,song_title,artists,file_path) VALUES
(1,'tfghfd','Dance','Arijit','"C:\Users\mi\Desktop\pixlevide\Final_Test\assets\Songs\Bollywood\128-Aaj Ki Raat - Stree 2 128 Kbps.mp3"'),
(1,'tfhukytr','Dont Dance','Yo Yo','dont_dance/song');
INSERT INTO favorites(admin_id,song_id) VALUES
(1,1),
(1,2);

--Select Queries

SELECT * FROM admin;
SELECT * FROM categories;
SELECT * FROM songs;
SELECT * FROM favorites;


SELECT c.description,s.poster,s.song_title,s.artists FROM songs s
JOIN categories c ON s.category_id = c.id
WHERE category_id = 1;

