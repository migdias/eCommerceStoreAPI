import supertest from 'supertest'
import app from '../server'
import dotenv from 'dotenv'

dotenv.config()

let jwtToken: string

jwtToken = String(process.env.TEST_JWT_TOKEN)

const request = supertest(app)

describe('Router Tests', () => {
  it('Check Main Route is working', async () => {
    const response = await request.get('/')
    expect(response.status).toEqual(200)
  })

  describe('Authenticated Requests', () => {
    describe('Users', () => {
      it('check GET /users returns with authentication returns 200 and 3 users', async () => {
        const response = await request.get('/users').set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(3)
      })
      it('check GET /users/:id returns with authentication returns 200 and user id: 1', async () => {
        const response = await request.get('/users').set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body[0].id).toEqual(1)
      })
      it('check POST /users/?first_name={fn}&last_name={ln}&password={pwd} returns new user ', async () => {
        const response = await request
          .post('/users/?first_name=Miguel&last_name=Dias&password=pass1')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        jwtToken = response.body.jwt_token
      })
      it('check POST /users/?first_name={fn}&last_name={ln}&password={pwd} returns another new user ', async () => {
        const response = await request
          .post('/users/?first_name=Ron&last_name=Wealey&password=blimey1')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
      })
      it('check PUT /users/:id?first_name={fn}&last_name={ln}&password={pwd} returns new updated user', async () => {
        const response = await request
          .put('/users/:id?first_name=Miguel&last_name=PPPP&password=pass1')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
      })
      it('check DELETE /users/:id deletes a user', async () => {
        const response = await request
          .delete('/users/:id?id=5')
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
      it('check GET /products/:id?id={id} returns product', async () => {
        const response = await request
          .get('/products/:id?id=2')
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
          .get('/products/:id?id=8')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response2.body.name).toEqual('test')
      })
      it('check PUT /products/:id?id={id}&name={name}&price={price}&category={category} updates existing product', async () => {
        const response = await request
          .put('/products/:id?id=8&name=newtest&price=123&category=test')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        const response2 = await request
          .get('/products/:id?id=8')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response2.body.name).toEqual('newtest')
      })
      it('check DELETE /products/:id deletes a product', async () => {
        const response = await request
          .delete('/products/:id?id=8')
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
        expect(response.body).toEqual([])
      })
      it('check GET /orders/currentOrders gets active orders', async () => {
        const response = await request
          .get('/orders/currentOrders')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([])
      })
      it('check GET /orders/completedOrders gets completed orders', async () => {
        const response = await request
          .get('/orders/completedOrders')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual([])
      })
      it('check POST /orders/product/?product_id={id}&quantity={quantity} creates new order', async () => {
        const response = await request
          .post('/orders/product/?product_id=2&quantity=2')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)

        const allOrders = await request
          .get('/orders')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(allOrders.body.length).toEqual(1)
        expect(allOrders.body[0].product_id).toEqual(2)
        expect(allOrders.body[0].user_id).toEqual(4)

        const activeOrders = await request
          .get('/orders/currentOrders')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(activeOrders.body[0].product_id).toEqual(2)
      })
      it('check DELETE /orders/:id?id=6 deletes an order', async () => {
        const response = await request
          .delete('/orders/:id?id=6')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(response.status).toEqual(200)

        const allOrders = await request
          .get('/orders')
          .set({ Authorization: 'Bearer ' + jwtToken })
        expect(allOrders.body).toEqual([])
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
        const response = await request.get('/users/:id')
        expect(response.status).toEqual(401)
      })
      it('check POST /users/?first_name={fn}&last_name={ln}&password={pwd} returns Access denied when its not authenticated', async () => {
        const response = await request.post('/users/?first_name=Miguel&last_name=Dias&password=pass1')
        expect(response.status).toEqual(401)
      })
      it('check PUT /users/:id?first_name={fn}&last_name={ln}&password={pwd} returns Access denied when its not authenticated', async () => {
        const response = await request.put('/users/:id?first_name=Miguel&last_name=Dias&password=pass1')
        expect(response.status).toEqual(401)
      })
      it('check DELETE /users/:id returns Access denied when its not authenticated', async () => {
        const response = await request.delete('/users/:id')
        expect(response.status).toEqual(401)
      })
      it('check GET /users/:id/authenticate?id={user_id}&password={pwd} returns wrong authentication', async () => {
        const response = await request.get('/users/:id/authenticate?id=1&password=wrongpass')
        expect(response.status).toEqual(401)
      })
      it('check GET /users/:id/authenticate?id={user_id}&password={pwd} returns correct authentication', async () => {
        const response = await request.get('/users/:id/authenticate?id=1&password=myscariscool123')
        expect(response.status).toEqual(200)
      })
    })
    describe('Products', () => {
      it('check GET /products returns list of products', async () => {
        const response = await request.get('/products')
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(7)
      })
      it('check GET /products/:id?id={id} returns product', async () => {
        const response = await request.get('/products/:id?id=2')
        expect(response.status).toEqual(200)
        expect(response.body.category).toEqual('Potion')
      })
      it('check POST /products?name={name}&price={price}&category={category} returns Access denied when its not authenticated', async () => {
        const response = await request.post('/products?name=test&price=123&category=test')
        expect(response.status).toEqual(401)
      })
      it('check PUT /products/:id?id={id}&name={name}&price={price}&category={category} returns Access denied when its not authenticated', async () => {
        const response = await request.put('/products/:id?id=1&name=test&price=123&category=test')
        expect(response.status).toEqual(401)
      })
      it('check DELETE /products/:id returns Access denied when its not authenticated', async () => {
        const response = await request.delete('/users/:id?id=1')
        expect(response.status).toEqual(401)
      })
    })
    describe('Orders', () => {
      it('check GET /orders returns Access denied when its not authenticated', async () => {
        const response = await request.get('/orders')
        expect(response.status).toEqual(401)
      })
      it('check GET /orders/currentOrders returns Access denied when its not authenticated', async () => {
        const response = await request.get('/orders/currentOrders')
        expect(response.status).toEqual(401)
      })
      it('check GET /orders/completedOrders returns Access denied when its not authenticated', async () => {
        const response = await request.get('/orders/completedOrders')
        expect(response.status).toEqual(401)
      })
      it('check POST /orders/product/?product_id={id}&quantity={quantity} returns Access denied when its not authenticated', async () => {
        const response = await request.post('/orders/product/?product_id=2&quantity=2')
        expect(response.status).toEqual(401)
      })
      it('check DELETE /orders/:id?id=1 returns Access denied when its not authenticated', async () => {
        const response = await request.delete('/orders/:id?id=1')
        expect(response.status).toEqual(401)
      })
    })
  })
})
