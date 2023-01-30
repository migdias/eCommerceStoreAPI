CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(15)
);

INSERT INTO orders (product_id, quantity, user_id, status)
VALUES
    (5, 1, 1, 'complete'),
    (3, 2, 1, 'complete'),
    (2, 1, 2, 'complete'),
    (7, 1, 2, 'active'),
    (6, 1, 3, 'complete');