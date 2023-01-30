# E-commerce Store API

This project is comprised of a mock-up of a e-commerce api. You may login/authenticate yourself to unlock a few different functinalities. If you are not authenticated, you may only use the get methods from products. In order to create, update or delete users, products and order you will have to be authenticated.

## Getting Started

Start up docker with the .env file. Since it is running locally on your machine, I provided the .env file to help setup everything.

Once you do the migrations (`db-migrate up`),  you will have three tables with some information already ready -- Users, orders and products. Start up the server by running:

- `npm run build`
- `node build/server.js`  

And in order to do pretty much anything you need to get authenticated. You may start by authenticate yourself as 'Harry Potter'. 

Visit: `GET /users/:id/authenticate?id=1&password=myscariscool123`

Please save the token and add it to your authorization header. From here you can create your own user, add products, create orders and much more. 

Have fun!

## Summary of Routes

### Users
- `GET /users` -> Get the list of all users
- `GET /users/:id` -> Get own user
- `POST /users/?first_name={fn}&last_name={ln}&password={pwd}` -> Create a user
- `PUT /users/:id` -> Update own user information
- `DELETE /users/:id` -> Delete a user
- `GET /users/:id/authenticate?id={user_id}&password={pwd}` -> Authenticate and get JWT token

### Products
- `GET /products` -> Gets all existing products
- `GET /products/:id?id={id}` -> Get one specific product by id
- `POST /products` -> Creates a product
- `PUT /products/:id?id={id}` -> Updates product information (needs all columns except id)
- `DELETE /products/:id?id={id}` -> Deletes a product from the database

### Orders
- `GET /orders/` -> Gets all orders related to your user (active and complete)
- `GET /orders/currentOrders` -> Gets the current active orders for your user
- `GET /orders/completedOrders` -> Gets the completed orders for your user
- `POST /orders/product/?product_id={id}&quantity={quantity}` -> Creates an order of the `product_id` with the `quantity` (Associated with your user)
- `DELETE /orders/:id?id=1` -> Deletes an order with a specific id (only if your user created that order)