CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    password VARCHAR(300)
);

INSERT INTO users (first_name, last_name, password)
VALUES
    ('Harry', 'Potter', '$2b$10$onDA5XsRfaNW0rE7yvnqZOttP0h4MFyF8e5OB0S9ZpPDSJi7Kc1gS'), -- myscariscool123
    ('Hermione', 'Granger', '$2b$10$G4pznQnKIBYOTLUMscK0pud/29VNt4YvUdRDVW1wvhqZyndGT4nfu'), -- itslevioSA99
    ('Severus', 'Snape', '$2b$10$yJFWFgFunMTBFeDsEJODFuym/gjv.3oMuXjZbeYU8oAjOLQfsdyjK'); -- IMayVomit13
