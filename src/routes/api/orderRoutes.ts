import express, { type RequestHandler, type Request, type Response } from 'express'
import { OrderTable } from '../../models/orders'
import { validateToken } from '../../util/util'

const orderRoutes = express.Router()

// Gets all orders
orderRoutes.get('/', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const store = new OrderTable()
    const result = await store.index()
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Create order for user
orderRoutes.post('/', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const uID = Number(req.query.user_id)
    const store = new OrderTable()
    const result = await store.createOrder(uID)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Gets current active orders
orderRoutes.get('/currentOrders', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const uID = Number(req.query.user_id)
    const store = new OrderTable()
    const result = await store.currentOrders(uID)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// gets the completed orders
orderRoutes.get('/completedOrders', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const uID = Number(req.query.user_id)
    const store = new OrderTable()
    const result = await store.completedOrders(uID)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Adds a product as an order to its user (based on token)
orderRoutes.post('/:id/product', (async (req: Request, res: Response): Promise<void> => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const o = {
      product_id: Number(req.query.product_id),
      quantity: Number(req.query.quantity),
      order_id: Number(req.params.id)
    }
    const store = new OrderTable()
    const u = await store.addProductOrder(o.quantity, o.product_id, o.order_id)

    res.json(u)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// deletes a specific order from the order table (only if it belongs to the same user)
orderRoutes.delete('/:id/product', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const orderID = Number(req.params.id)
    const productID = Number(req.query.product_id)
    const store = new OrderTable()
    const u = await store.removeProductOrder(orderID, productID)
    res.json(u)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// deletes a specific order from the order table (only if it belongs to the same user)
orderRoutes.post('/:id/makeBuy', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const orderID = Number(req.params.id)
    const store = new OrderTable()
    const u = await store.makeBuy(orderID)
    res.json(u)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

export default orderRoutes
