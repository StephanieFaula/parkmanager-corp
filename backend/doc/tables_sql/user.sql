BEGIN;

DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    isAdmin TINYINT(1) NOT NULL DEFAULT(0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

INSERT INTO user(firstname, username, isAdmin) 
VALUES (
    'Océane', 'Faula', '1'
);

COMMIT;