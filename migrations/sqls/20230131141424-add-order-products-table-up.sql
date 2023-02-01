CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER
);

INSERT INTO order_products (quantity, order_id, product_id)
VALUES 
    (2, 1, 2),
    (1, 1, 1),
    (1, 2, 5),
    (1, 3, 4),
    (1, 4, 6),
    (2, 5, 3),
    (1, 5, 2),
    (1, 6, 3);