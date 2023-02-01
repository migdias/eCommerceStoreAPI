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
````

Start up docker with the .env file. Since it is running locally on your machine. 


Run `docker compose up` to create the postgres database. The server is setup to connect automatically to the postgres database but if you would like to connect by yourself you can go to the docker container that you setup, terminal and run `su postgres` -> `psql -U full_stack_user full_stack_dev` and you should be connected to the database.

Once you do the migrations (`db-migrate up`),  you will have three tables with some information already ready -- Users, orders and products. If you do \dt in docker you should be able to see the tables. Try `SELECT * FROM products;`

*Before building*: You can try running the tests to see if everything is ok. Run `npm run test`. Notice that this will run two separate jasmines. One for the routes and one for the models.

Start up the server by running:

- `npm run build`
- `node build/server.js`  

The server will then start running on `http://localhost:3000`

ServerPort = `3000`
DatabasePort = `5432`

Visit: `POST https://localhost:3000/users/?first_name={fn}&last_name={ln}&password={pwd}` to create your own user.

Please save the token and add it to your authorization header. From here you can create your own user, add products, create orders and much more. 

Check the REQUIREMENTS.md for info on the routes and table schema.

Have fun!