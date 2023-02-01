CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(15)
);

INSERT INTO orders (user_id, status)
VALUES
    (1, 'complete'),
    (1, 'active'),
    (2, 'complete'),
    (2, 'complete'),
    (2, 'active'),
    (3, 'complete');