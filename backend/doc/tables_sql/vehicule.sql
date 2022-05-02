BEGIN;

DROP TABLE IF EXISTS vehicule;

CREATE TABLE vehicule (
    id SERIAL PRIMARY KEY,
    matricule INT NOT NULL,
    total_occupation INT DEFAULT '0',
    user_id BIGINT UNSIGNED NOT NULL,
    parked_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO vehicule(matricule, user_id, parked_at) 
VALUES (
    '123456', '1', '1234'
);

COMMIT;