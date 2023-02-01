import express, { type RequestHandler, type Request, type Response } from 'express'
import { UserTable } from '../../models/users'
import { validateToken } from '../../util/util'
import jwt from 'jsonwebtoken'

const userRoutes = express.Router()

// Gets list of all users
userRoutes.get('/', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  if (validateToken(req, res) === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }

  try {
    const store = new UserTable()
    const result = await store.index()
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

userRoutes.get('/:id', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }

  try {
    const id = Number(req.params.id)
    const store = new UserTable()
    const result = await store.show(id)
    res.json(result)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Create new user -- creates token for jwt authentication
userRoutes.post('/', (async (req: Request, res: Response): Promise<void> => {
  // // Token Validation Required
  // const userID = validateToken(req, res)
  // if (userID === -1) {
  //   res.status(401)
  //   res.send('Access denied, invalid token.')
  //   return
  // }

  try {
    const u = {
      first_name: String(req.query.first_name),
      last_name: String(req.query.last_name),
      password: String(req.query.password)
    }
    const store = new UserTable()
    const newUser = await store.create(u)

    // sign token to create user
    const token = jwt.sign({ user: newUser }, String(process.env.TOKEN_SECRET))

    res.json({
      response: `Created ${JSON.stringify(u)}.`,
      jwt_token: token
    })
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Update user information
userRoutes.put('/:id', (async (req: Request, res: Response): Promise<void> => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }

  try {
    // can only update his own user
    const id = Number(req.params.id)
    const u = {
      first_name: String(req.query.first_name),
      last_name: String(req.query.last_name),
      password: String(req.query.password)
    }
    const store = new UserTable()
    const newUser = await store.update(id, u)

    // sign token to create user
    const token = jwt.sign({ user: newUser }, String(process.env.TOKEN_SECRET))

    res.json({
      response: `Updated ${JSON.stringify(u)}.`,
      jwt_token: token
    })
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// Delete user
userRoutes.delete('/:id', (async (req: Request, res: Response) => {
  // _ Token Validation Required
  const userID = validateToken(req, res)
  if (userID === -1) {
    res.status(401)
    res.send('Access denied, invalid token.')
    return
  }

  try {
    const id = Number(req.params.id)
    const store = new UserTable()
    const u = await store.delete(id)
    res.send(`Deleted user: ${String(u.id)}`)
  } catch (err) {
    res.status(400)
    res.send(String(err))
  }
}) as RequestHandler)

// authenticate a user
userRoutes.get('/:id/authenticate', (async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const password = String(req.query.password)

    const store = new UserTable()
    const authenticatedUser = await store.authenticate(id, password)

    if (authenticatedUser === null) {
      throw new Error('Authentication failed')
    } else {
      const token = jwt.sign({ user: authenticatedUser }, String(process.env.TOKEN_SECRET))

      res.json({
        response: 'Authentication successful',
        jwt_token: token
      })
    }
  } catch (err) {
    res.status(401)
    res.send(String(err))
  }
}) as RequestHandler)

export default userRoutes
