# E-commerce Store API

This project is comprised of a mock-up of a e-commerce api. You may login/authenticate yourself to unlock a few different functinalities. If you are not authenticated, you may only use the get methods from products. In order to create, update or delete users, products and order you will have to be authenticated.

## Getting Started

Before anything, install all the necessary packages with `npm install`

Before start up docker you need the `.env` file. As requested it will not be added to github, but for the reviewer this were my env vars:

````
ENV=dev
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=full_stack_dev
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=password123
POSTGRES_TEST_DB=test
BCRYPT_PASSWORD=speak-friend-and-enter
SALT_ROUNDS=10
TOKEN_SECRET=alohomora123!
TEST_TABLE_USER_ID=1
TEST_TABLE_USER_PASSWORD=myscariscool123
TEST_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmaXJzdF9uYW1lIjoiSGFycnkiLCJsYXN0X25hbWUiOiJQb3R0ZXIiLCJwYXNzd29yZCI6IiQyYiQxMCRvbkRBNVhzUmZhTlcwckU3eXZucVpPdHRQMGg0TUZ5RjhlNU9CMFM5WnBQRFNKaTdLYzFnUyJ9LCJpYXQiOjE2NzUxNTc2NzF9.x364Fme3fmWPe03gAdO5SdC7wGknw1zNQ99pZ2FkBUU
````

Start up docker with the .env file. Since it is running locally on your machine. 


Run `docker compose up` to create the postgres database. The server is setup to connect automatically to the postgres database but if you would like to connect by yourself you can go to the docker container that you setup, terminal and run `su postgres` -> `psql -U full_stack_user full_stack_dev` and you should be connected to the database.

Once you do the migrations (`db-migrate up`),  you will have three tables with some information already ready -- Users, orders and products. If you do \dt in docker you should be able to see the tables. Try `SELECT * FROM products;`

*Before building*: You can try running the tests to see if everything is ok. Run `npm run test`. Notice that this will run two separate jasmines. One for the routes and one for the models.

Start up the server by running:

- `npm run build`
- `node build/server.js`  

The server will then start running on `http://localhost:3000`

And in order to do pretty much anything you need to get authenticated. You may start by authenticate yourself as 'Harry Potter'. 

Visit: `GET /users/:id/authenticate?id=1&password=myscariscool123`

Please save the token and add it to your authorization header. From here you can create your own user, add products, create orders and much more. 

Have fun!

## Summary of Routes

### Users
- [Token Required] `GET /users` -> Get the list of all users
- [Token Required] `GET /users/:id` -> Get own user
- [Token Required] `POST /users/?first_name={fn}&last_name={ln}&password={pwd}` -> Create a user
- [Token Required] `PUT /users/:id?first_name={fn}&last_name={ln}&password={pwd}` -> Update own user information
- [Token Required] `DELETE /users/:id?id={id}` -> Delete a user
- `GET /users/:id/authenticate?id={user_id}&password={pwd}` -> Authenticate and get JWT token

### Products
- `GET /products` -> Gets all existing products
- `GET /products/:id?id={id}` -> Get one specific product by id
- [Token Required] `POST /products?name={name}&price={price}&category={category}` -> Creates a product
- [Token Required] `PUT /products/:id?id={id}&name={name}&price={price}&category={category}` -> Updates product information (needs all columns except id)
- [Token Required] `DELETE /products/:id?id={id}` -> Deletes a product from the database

### Orders
- [Token Required] `GET /orders/` -> Gets all orders related to your user (active and complete)
- [Token Required] `GET /orders/currentOrders` -> Gets the current active orders for your user
- [Token Required] `GET /orders/completedOrders` -> Gets the completed orders for your user
- [Token Required] `POST /orders/product/?product_id={id}&quantity={quantity}` -> Creates an order of the `product_id` with the `quantity` (Associated with your user)
- [Token Required] `DELETE /orders/:id?id=1` -> Deletes an order with a specific id (only if your user created that order)

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

- orders
    - **id** -> SERIAL PRIMARY KEY,
    - **product_id** -> INTEGER REFERENCES products(id),
    - **quantity** -> INTEGER,
    - **user_id** -> INTEGER REFERENCES users(id),
    - **status** -> VARCHAR(15)
