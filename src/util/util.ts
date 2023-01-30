import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { type User } from '../models/users'

interface JwtPayload {
  user: User
}

/**
 * Verifies and returns the user making a request
 * @param req express request
 * @param res express response
 * @returns the userid that is making the request. If the verification is unsucessful, returns -1
 */
const validateToken = (req: Request, res: Response): number => {
  try {
    const authorizationHeader = String(req.headers.authorization)
    const token = authorizationHeader?.split(' ')[1]
    const payload = jwt.verify(token, String(process.env.TOKEN_SECRET)) as JwtPayload
    return Number(payload.user.id)
  } catch (err) {
    return -1
  }
}

export {
  validateToken
}
