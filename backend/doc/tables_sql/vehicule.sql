BEGIN;

DROP TABLE IF EXISTS vehicule;

CREATE TABLE vehicule (
    id SERIAL PRIMARY KEY,
    matricule INT NOT NULL,
    total_occupation TIME(3) NOT NULL DEFAULT '00:00:00',
    user_id BIGINT UNSIGNED NOT NULL,
    parked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO vehicule(matricule, user_id, parked_at) 
VALUES (
    '123456', '1', '1234'
);

COMMIT;