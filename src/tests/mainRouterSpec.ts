import supertest from 'supertest'
import app from '../server'

let jwtToken: string

const request = supertest(app)

describe('Router Tests', () => {
  it('Check Main Route is working', async () => {
    const response = await request.get('/')
    expect(response.status).toEqual(200)
  })

  describe('Authenticated Requests', () => {
    describe('Users', () => {
      it('check POST /users/?first_name={fn}&last_name={ln}&password={pwd} returns new user ', async () => {
        const response = await request
          .post('/users/?first_name=Miguel&last_name=Dias&password=pass1')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        jwtToken = response.body.jwt_token
      })
      it('check GET /users returns with authentication returns 200 and 3 users', async () => {
        const response = await request.get('/users').set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(4)
      })
      it('check GET /users/:id returns with authentication returns 200 and user id: 1', async () => {
        const response = await request.get('/users/1').set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body.first_name).toEqual('Harry')
      })
      it('check POST /users/?first_name={fn}&last_name={ln}&password={pwd} returns another new user ', async () => {
        const response = await request
          .post('/users/?first_name=Ron&last_name=Wealey&password=blimey1')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
      })
      it('check PUT /users/:id?first_name={fn}&last_name={ln}&password={pwd} returns new updated user', async () => {
        const response = await request
          .put('/users/4/?first_name=Miguel&last_name=PPPP&password=pass1')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
      })
      it('check DELETE /users/:id deletes a user', async () => {
        const response = await request
          .delete('/users/5')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)

        // recreate for next tests
      })
    })
    describe('Products', () => {
      it('check GET /products returns list of products', async () => {
        const response = await request
          .get('/products')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(7)
      })
      it('check GET /products/:id returns product', async () => {
        const response = await request
          .get('/products/2')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body.category).toEqual('Potion')
      })
      it('check POST /products?name={name}&price={price}&category={category} creates new product', async () => {
        const response = await request
          .post('/products?name=test&price=123&category=test')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)

        const response2 = await request
          .get('/products/8')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response2.body.name).toEqual('test')
      })
      it('check PUT /products/:id/?name={name}&price={price}&category={category} updates existing product', async () => {
        const response = await request
          .put('/products/8/?name=newtest&price=123&category=test')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        const response2 = await request
          .get('/products/8')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response2.body.name).toEqual('newtest')
      })
      it('check DELETE /products/:id deletes a product', async () => {
        const response = await request
          .delete('/products/8')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)

        const response2 = await request
          .get('/products')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response2.body.length).toEqual(7)
      })
    })
    describe('Orders', () => {
      it('check GET /orders gets all current orders', async () => {
        const response = await request
          .get('/orders')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(6)
      })
      it('check GET /orders/currentOrders?user_id={user_id} gets active orders', async () => {
        const response = await request
          .get('/orders/currentOrders?user_id=2')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([
          {
            order_id: 5,
            product: 'Magical Beans',
            price: 3.99,
            category: 'Candy',
            quantity: 2
          },
          {
            order_id: 5,
            product: 'Polyjuice Potion',
            price: 59.99,
            category: 'Potion',
            quantity: 1
          }
        ])
      })
      it('check GET /orders/completedOrders?user_id={user_id} gets completed orders', async () => {
        const response = await request
          .get('/orders/completedOrders?user_id=2')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([
          {
            order_id: 3,
            product: 'Felix Felicis',
            price: 4999.99,
            category: 'Potion',
            quantity: 1
          },
          {
            order_id: 4,
            product: 'Magical Creatures',
            price: 29.99,
            category: 'Book',
            quantity: 1
          }
        ])
      })
      it('check POST /orders/:id/product/?product_id={id}&quantity={quantity} adds product to order', async () => {
        const response = await request
          .post('/orders/3/product?product_id=6&quantity=2')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
          id: 9,
          order_id: 3,
          product_id: 6,
          quantity: 2
        })
      })
      it('check /orders/:id/product/?product_id={id} removes product from order', async () => {
        const response = await request
          .delete('/orders/5/product?product_id=2')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
          id: 7,
          order_id: 5,
          product_id: 2,
          quantity: 1
        })
      })
    })
  })

  describe('Non-Authenticated Requests', () => {
    describe('Users', () => {
      it('check GET /users returns Access denied when its not authenticated', async () => {
        const response = await request.get('/users')
        expect(response.status).toEqual(401)
      })
      it('check GET /users/:id returns Access denied when its not authenticated', async () => {
        const response = await request.get('/users/1')
        expect(response.status).toEqual(401)
      })
      it('check POST /users/?first_name={fn}&last_name={ln}&password={pwd} should create a user', async () => {
        const response = await request.post('/users/?first_name=Miguel&last_name=Dias&password=pass1')
        expect(response.status).toEqual(200)
      })
      it('check PUT /users/:id?first_name={fn}&last_name={ln}&password={pwd} returns Access denied when its not authenticated', async () => {
        const response = await request.put('/users/1/?first_name=Miguel&last_name=Dias&password=pass1')
        expect(response.status).toEqual(401)
      })
      it('check DELETE /users/:id returns Access denied when its not authenticated', async () => {
        const response = await request.delete('/users/1')
        expect(response.status).toEqual(401)
      })
      it('check GET /users/:id/authenticate?id={user_id}&password={pwd} returns wrong authentication', async () => {
        const response = await request.get('/users/1/authenticate?id=1&password=wrongpass')
        expect(response.status).toEqual(401)
      })
      it('check GET /users/:id/authenticate?id={user_id}&password={pwd} returns correct authentication', async () => {
        const response = await request.get('/users/1/authenticate?id=1&password=myscariscool123')
        expect(response.status).toEqual(200)
      })
    })
    describe('Products', () => {
      it('check GET /products returns list of products', async () => {
        const response = await request.get('/products')
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(7)
      })
      it('check GET /products/:id returns product', async () => {
        const response = await request.get('/products/2')
        expect(response.status).toEqual(200)
        expect(response.body.category).toEqual('Potion')
      })
      it('check POST /products?name={name}&price={price}&category={category} returns Access denied when its not authenticated', async () => {
        const response = await request.post('/products?name=test&price=123&category=test')
        expect(response.status).toEqual(401)
      })
      it('check PUT /products/:id?id={id}&name={name}&price={price}&category={category} returns Access denied when its not authenticated', async () => {
        const response = await request.put('/products/1/?name=test&price=123&category=test')
        expect(response.status).toEqual(401)
      })
      it('check DELETE /products/:id returns Access denied when its not authenticated', async () => {
        const response = await request.delete('/users/1')
        expect(response.status).toEqual(401)
      })
    })
    describe('Orders', () => {
      it('check GET /orders returns Access denied when its not authenticated', async () => {
        const response = await request.get('/orders')
        expect(response.status).toEqual(401)
      })
      it('check GET /orders/currentOrders?user_id={user_id} returns Access denied when its not authenticated', async () => {
        const response = await request.get('/orders/currentOrders?user_id=1')
        expect(response.status).toEqual(401)
      })
      it('check GET /orders/completedOrders?user_id={user_id} returns Access denied when its not authenticated', async () => {
        const response = await request.get('/orders/completedOrders?user_id=1')
        expect(response.status).toEqual(401)
      })
      it('check POST /orders/:id/product/?product_id={id}&quantity={quantity} returns Access denied when its not authenticated', async () => {
        const response = await request.post('/orders/1/product/?product_id=1&quantity=1')
        expect(response.status).toEqual(401)
      })
      it('check DELETE /orders/:id/product/?product_id={id} returns Access denied when its not authenticated', async () => {
        const response = await request.delete('/orders/1/product/?product_id=1')
        expect(response.status).toEqual(401)
      })
    })
  })
})
