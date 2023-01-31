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
    const result = await store.index(userID)
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
    const store = new OrderTable()
    const result = await store.currentOrder(userID)
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
    const store = new OrderTable()
    const result = await store.completedOrders(userID)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Adds a product as an order to its user (based on token)
orderRoutes.post('/product', (async (req: Request, res: Response): Promise<void> => {
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
      user_id: userID,
      status: 'Active'
    }
    const store = new OrderTable()
    await store.addProductOrder(o.quantity, o.product_id, o.user_id)

    res.json({ response: `Added product order product_id = ${o.product_id}.` })
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// deletes a specific order from the order table (only if it belongs to the same user)
orderRoutes.delete('/:id', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const orderID = Number(req.query.id)
    const store = new OrderTable()
    const u = await store.removeProductOrder(userID, orderID)
    res.send(`Deleted order. id: ${String(u.id)}`)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

export default orderRoutes
