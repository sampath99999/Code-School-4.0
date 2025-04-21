-- Active: 1741677837220@@127.0.0.1@5432@chat_application
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image_id INT,
    token TEXT,
    token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    message_text TEXT,
    file_id INT REFERENCES file_uploads (id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE file_uploads (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    context VARCHAR(50) DEFAULT 'chat_message' CHECK (
        context IN (
            'profile_image',
            'chat_message'
        )
    ),
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_path VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT fk_profile_image FOREIGN KEY (profile_image_id) REFERENCES file_uploads (id) ON DELETE SET NULL;

INSERT INTO
    users (username, email, password)
VALUES (
        'yash',
        'yash@gmail.com',
        MD5('Abcd@1234')
    );

INSERT INTO
    file_uploads (
        user_id,
        context,
        file_name,
        file_type,
        file_path
    )
VALUES (
        1,
        'profile_image',
        'profile_image_42.jpg',
        'image/jpeg',
        'https://randomuser.me/api/portraits/men/42.jpg'
    );