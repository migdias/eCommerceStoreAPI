## Summary of Routes

### Users
- [Token Required] `GET /users` -> Get the list of all users
- [Token Required] `GET /users/:id` -> Get own user
- `POST /users/?first_name={fn}&last_name={ln}&password={pwd}` -> Create a user
- [Token Required] `PUT /users/:id?first_name={fn}&last_name={ln}&password={pwd}` -> Update user information
- [Token Required] `DELETE /users/:id` -> Delete a user
- `GET /users/:id/authenticate?password={pwd}` -> Authenticate and get JWT token

### Products
- `GET /products` -> Gets all existing products
- `GET /products/:id` -> Get one specific product by id
- [Token Required] `POST /products?name={name}&price={price}&category={category}` -> Creates a product
- [Token Required] `PUT /products/:id/?name={name}&price={price}&category={category}` -> Updates product information (needs all columns except id)
- [Token Required] `DELETE /products/:id` -> Deletes a product from the database

### Orders
- [Token Required] `GET /orders/` -> Gets all orders (active and complete)
- [Token Required] `GET /orders/currentOrders?user_id={user_id}` -> Gets the current active orders for a specific user
- [Token Required] `GET /orders/completedOrders?user_id={user_id}` -> Gets the completed orders for a specific user
- [Token Required] `POST /orders/:id/product/?product_id={id}&quantity={quantity}` -> Adds a product to an existing order of the `product_id` with the `quantity` 
- [Token Required] `DELETE /orders/:id/product/?product_id={id}` -> Removes a product from an order

## Database and Tables

Database: 
- full_stack_dev

Tables:
- Users
    - **id** -> SERIAL PRIMARY KEY,
    - **first_name** -> VARCHAR(30),
    - **last_name** -> VARCHAR(30),
    - **password** -> VARCHAR(300)

- products
    - **id** -> SERIAL PRIMARY KEY,
    - **name** -> VARCHAR(150),
    - **price** -> FLOAT NOT NULL,
    - **category** -> VARCHAR(50)

- order
    - **id** -> SERIAL PRIMARY KEY,
    - **user_id** -> REFERENCES users(id) ON DELETE CASCADE,
    - **status** -> VARCHAR(15)

- order_products
    - **id** -> SERIAL PRIMARY KEY,
    - **quantity** -> INTEGER,
    - **order_id** -> INTEGER REFERENCES orders(id) ON CASCADE DELETE,
    - **product_id** -> INTEGER REFERENCES products(id) ON CASCADE DELETE,
