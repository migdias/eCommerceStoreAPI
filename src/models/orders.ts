import client from '../database'

export interface Order {
  id?: number
  product_id: number
  quantity: number
  user_id: number
  status: 'active' | 'complete'
}

export class OrderTable {
  /**
   * Gets all the orders (active and complete) from a user
   * @param userID is the user id
   * @returns all the orders current and past of that user
   */
  async index (userID: number): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1)'
      const conn = await client.connect()
      const result = await conn.query(sql, [userID])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not add the product to the cart. Error: ${String(err)}`)
    }
  }

  /**
   * Adds a product to a user as an order in the order table
   * @param quantity is how many of that product we want to order
   * @param productID is the product we want to add (from products table)
   * @param userID the userid to associate that order
   * @returns the added product object
   */
  async addProductOrder (quantity: number, productID: number, userID: number): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (product_id, quantity, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [productID, quantity, userID, 'active'])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not add the product to the cart. Error: ${String(err)}`)
    }
  }

  /**
   * Removes an order from the order table
   * @param userID the user id (only the user that added the order can remove it)
   * @param orderID the order id to be removed
   * @returns the removed order object
   */
  async removeProductOrder (userID: number, orderID: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) AND user_id=($2) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [orderID, userID])
      conn.release()

      if (typeof result.rows[0] === 'undefined') {
        throw new Error('That order doesnt exist, or its from another user')
      }

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not remove order from the cart. Error: ${String(err)}`)
    }
  }

  /**
   * Empties out the active orders from a specific user
   * @param userID the user id
   * @returns the orders that have been deleted
   */
  async emptyActiveOrders (userID: number): Promise<Order[]> {
    try {
      const sql = 'DELETE FROM orders WHERE user_id=($1) AND status=($2) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [userID, 'active'])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not empty cart. Error: ${String(err)}`)
    }
  }

  /**
   * Buys current active orders (changes status to "complete")
   * @param userID the user id
   * @returns the bought orders
   */
  async makeBuy (userID: number): Promise<Order[]> {
    try {
      const sql = 'UPDATE orders SET status = ($2) WHERE user_id=($1) AND status=($3) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [userID, 'complete', 'active'])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not make the buy. Error: ${String(err)}`)
    }
  }

  /**
   * Gets the current order of any given user
   * @param userID is the if of the user to which we want to get the orders
   * @returns the current order of that user
   */
  async currentOrder (userID: number): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * from orders WHERE user_id=($1) AND status=($2)'
      const result = await conn.query(sql, [userID, 'active'])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get current order. Error: ${String(err)}`)
    }
  }

  /**
   * Gets the complete orders done by any given user.
   * @param userID is the if of the user to which we want to get the orders
   * @returns the completed orders of that user
   */
  async completedOrders (userID: number): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * from orders WHERE user_id=($1) AND status=($2)'
      const result = await conn.query(sql, [userID, 'complete'])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get past completed orders. Error: ${String(err)}`)
    }
  }
}
