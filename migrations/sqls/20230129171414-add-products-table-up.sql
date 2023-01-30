CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price FLOAT NOT NULL,
    category VARCHAR(50)
);

INSERT INTO products (name, price, category)
VALUES
    ('Elder Wand', 79999.99, 'Wand'),
    ('Polyjuice Potion', 59.99, 'Potion'),
    ('Magical Beans', 3.99, 'Candy'),
    ('Felix Felicis', 4999.99, 'Potion'),
    ('Nimbus 2000', 999.99, 'Broom'),
    ('Magical Creatures', 29.99, 'Book'),
    ('Everyday Spells', 16.99, 'Book');