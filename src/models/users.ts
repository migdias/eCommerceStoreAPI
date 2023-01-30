import client from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

// gets env vars
dotenv.config()

const saltRounds = process.env.SALT_ROUNDS as string
const pepper = process.env.BCRYPT_PASSWORD as string

export interface User {
  id?: number
  first_name: string
  last_name: string
  password: string
}

export class UserTable {
  /**
   * Gets the full list of users
   * @returns a list of all users
   */
  async index (): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Cannot get users. ${String(err)}`)
    }
  }

  /**
   * Filters the user list for one single user
   * @param id a user id
   * @returns a user object
   */
  async show (id: number): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()

      const user = result.rows[0]

      return user
    } catch (err) {
      throw new Error(`${String(err)}`)
    }
  }

  /**
   * Asserts wether a specific user exists
   * @param id is user id
   * @returns user if exists
   */
  async userExists (id: number): Promise<User> {
    const user = await this.show(id)

    if (typeof user === 'undefined') {
      throw new Error('User does not exist.')
    } else {
      return user
    }
  }

  /**
   * Creates a user. The password provided will be promply hashed
   * @param u a user object
   * @returns the created user object
   */
  async create (u: User): Promise<User> {
    try {
      const sql = 'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *'
      const conn = await client.connect()
      // hash password that comes from user
      const pwdHash = bcrypt.hashSync(u.password + pepper, Number(saltRounds))

      const result = await conn.query(sql, [u.first_name, u.last_name, pwdHash])
      const createdUser = result.rows[0]

      conn.release()

      return createdUser
    } catch (err) {
      const usrExists = await this.show(Number(u.id))
      if (typeof usrExists !== 'undefined') {
        throw new Error('user already exists. Choose another username!')
      } else {
        throw new Error(`Could not add the user ${Number(u.id)}. Error: ${String(err)}`)
      }
    }
  }

  /**
   * Deletes a user from the database
   * @param id is the user id
   * @returns the deleted user object
   */
  async delete (id: number): Promise<User> {
    // Check if user exists
    await this.userExists(id)

    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      const deletedUser = result.rows[0]
      conn.release()

      return deletedUser
    } catch (err) {
      throw new Error(`Could not remove the user id: ${id}. Error: ${String(err)}`)
    }
  }

  /**
   * Updates a specific users information
   * @param id is the user id
   * @param u is a user object
   * @returns the updated user object
   */
  async update (id: number, u: User): Promise<User> {
    try {
      const sql = 'UPDATE users SET (first_name, last_name, password) = ($2, $3, $4) WHERE id=($1) RETURNING *'
      const conn = await client.connect()

      // hash password that comes from user
      const pwdHash = bcrypt.hashSync(u.password + pepper, Number(saltRounds))

      const result = await conn.query(sql, [id, u.first_name, u.last_name, pwdHash])
      const updatedUser = result.rows[0]

      conn.release()

      return updatedUser
    } catch (err) {
      throw new Error(`Could not update the user id: ${id}. Error: ${String(err)}`)
    }
  }

  /**
   * Authenticates a user based on the ID and password
   * @param idPrompt is a user id
   * @param passwordPrompt is a password
   * @returns the user object if the id and password have been sucessfully validated
   */
  async authenticate (idPrompt: number, passwordPrompt: string): Promise<User | null> {
    const user = await this.userExists(idPrompt)
    try {
      if (bcrypt.compareSync(passwordPrompt + pepper, user.password)) {
        return user
      } else {
        return null
      }
    } catch (err) {
      throw new Error(`Authentication Failed. ${String(err)}`)
    }
  }
}
