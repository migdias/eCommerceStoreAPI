import client from '../database'

export interface orderProduct {
  id?: number
  order_id: number
  product_id: number
  quantity: number
}

export interface Order {
  id?: number
  user_id: number
  status: 'active' | 'complete'
}

export interface printOrders {
  order_id: number
  product: string
  price: number
  category: string
  quantity: number
}

export class OrderTable {
  /**
   * Gets all the orders (active and complete) from a user
   * @param userID is the user id
   * @returns all the orders current and past of that user
   */
  async index (): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders'
      const conn = await client.connect()
      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not add the product to the cart. Error: ${String(err)}`)
    }
  }

  async createOrder (userID: number): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES (($1), ($2)) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [userID, 'active'])

      conn.release()

      return result.rows[0]
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
  async addProductOrder (quantity: number, productID: number, orderID: number): Promise<orderProduct> {
    try {
      const sql = 'INSERT INTO order_products (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [productID, quantity, orderID])

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
  async removeProductOrder (orderID: number, productID: number): Promise<orderProduct> {
    try {
      const sql = 'DELETE FROM order_products WHERE order_id=($1) and product_id=($2) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [orderID, productID])
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
   * Buys current active orders (changes status to "complete")
   * @param userID the user id
   * @returns the bought orders
   */
  async makeBuy (orderID: number): Promise<Order[]> {
    try {
      const sql = 'UPDATE orders SET status = ($2) WHERE id=($1) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [orderID, 'complete'])
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
  async currentOrders (userID: number): Promise<printOrders[]> {
    try {
      const conn = await client.connect()
      const sql = `SELECT orders.id as order_id, 
                          products.name as product, products.price as price, products.category as category,
                          order_products.quantity
                  FROM order_products 
                  INNER JOIN orders ON order_products.order_id=orders.id
                  INNER JOIN products ON order_products.product_id=products.id
                  WHERE orders.status=($2) AND orders.user_id=($1)`
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
  async completedOrders (userID: number): Promise<printOrders[]> {
    try {
      const conn = await client.connect()
      const sql = `SELECT orders.id as order_id, products.name as product, products.price as price, products.category as category,
                          order_products.quantity
                  FROM order_products 
                  INNER JOIN orders ON order_products.order_id=orders.id
                  INNER JOIN products ON order_products.product_id=products.id
                  WHERE orders.status=($2) AND orders.user_id=($1)`
      const result = await conn.query(sql, [userID, 'complete'])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get past completed orders. Error: ${String(err)}`)
    }
  }
}
