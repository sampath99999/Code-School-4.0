-- Active: 1741678168190@@127.0.0.1@5432@playlist

CREATE Table users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password varchar(255) NOT NULL UNIQUE,
    token VARCHAR(30) UNIQUE
)

select * from users;

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL
)

    --created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    playlist_id INT REFERENCES playlists(id),
    file_path VARCHAR(255) NOT NULL,
    title VARCHAR(255)
);
    
    --created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP