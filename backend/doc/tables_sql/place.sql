BEGIN;

DROP TABLE IF EXISTS place;

CREATE TABLE place (
    id SERIAL PRIMARY KEY,
    placeNumber INT NOT NULL,
    parked_at TIMESTAMP,
    total_occupation TIME(3) NOT NULL DEFAULT '00:00:00',
    vehicule_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

INSERT INTO place(placeNumber) 
VALUES (
    '001'
);

COMMIT;