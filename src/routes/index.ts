import express, { type Request, type Response } from 'express'
import { validateToken } from '../util/util'
import orderRoutes from './api/orderRoutes'
import productRoutes from './api/productRoutes'
import userRoutes from './api/userRoutes'

// Starting application
const routes = express.Router()

routes.get('/', (req: Request, res: Response) => {
  try {
    const userID = validateToken(req, res)
    if (userID === -1) {
      res.send('You do not seem to be logged in.\n\n Some functionalities, such as creating/deleting/updating products, users and orders \n\n Visit /users/authenticate?id={id}&password={pwd} to login. Save your token.')
    } else {
      res.send(`You are logged in with user id: ${userID}`)
    }
  } catch (err) {
    res.status(400)
    res.send(err)
  }
})

routes.use('/products', productRoutes)
routes.use('/users', userRoutes)
routes.use('/orders', orderRoutes)

export default routes
