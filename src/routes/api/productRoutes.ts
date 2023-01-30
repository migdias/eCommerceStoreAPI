import express, { type RequestHandler, type Request, type Response } from 'express'
import { ProductStore } from '../../models/products'
import { validateToken } from '../../util/util'

const productRoutes = express.Router()

// Gets list of all products
productRoutes.get('/', (async (req: Request, res: Response) => {
  try {
    const store = new ProductStore()
    const result = await store.index()
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(err)
  }
}) as RequestHandler)

// Get one single product
productRoutes.get('/:id', (async (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id)
    const store = new ProductStore()
    const result = await store.show(id)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(err)
  }
}) as RequestHandler)

// Create a new product
productRoutes.post('/', (async (req: Request, res: Response): Promise<void> => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const p = {
      name: String(req.query.name),
      price: Number(req.query.price),
      category: String(req.query.category)
    }
    if (typeof req.query.name === 'undefined' || typeof req.query.price === 'undefined') {
      throw new Error('name or price cannot be undefined')
    }
    const store = new ProductStore()
    await store.create(p)
    res.send(`Created ${p.name}.`)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Update a specifics product information
productRoutes.put('/:id', (async (req: Request, res: Response): Promise<void> => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }
  try {
    const id = Number(req.query.id)
    const p = {
      name: String(req.query.name),
      price: Number(req.query.price),
      category: String(req.query.category)
    }
    const store = new ProductStore()
    await store.update(id, p)
    res.send(`Updated ${p.name}.`)
  } catch (err) {
    res.status(400)
    res.send(err)
  }
}) as RequestHandler)

// delete a product
productRoutes.delete('/:id', (async (req: Request, res: Response) => {
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }

  try {
    const id = Number(req.query.id)
    const store = new ProductStore()
    await store.delete(id)
    res.send(`Deleted product with id: ${id}`)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

export default productRoutes
