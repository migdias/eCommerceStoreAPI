import client from '../database'

export interface Product {
  id?: number
  name: string
  price: number
  category: string
}

export class ProductStore {
  /**
   * Provided a full list of the products available
   * @returns the full product list
   */
  async index (): Promise<Product[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      conn.release() // close conn
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get products. Error: ${String(err)}`)
    }
  }

  /**
   * Filter a specific project by its id
   * @param id the id of the product
   * @returns the desired product
   */
  async show (id: number): Promise<Product> {
    try {
      const sql = 'SELECT * from products where id=($1)'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find the product id: ${id}. Error: ${String(err)}`)
    }
  }

  /**
   * Creates a product on the database
   * @param p product object to be created
   * @returns the created product
   */
  async create (p: Product): Promise<Product> {
    try {
      const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [p.name, p.price, p.category])
      const createdProduct = result.rows[0]

      conn.release()

      return createdProduct
    } catch (err) {
      throw new Error(`Could not add the product ${p.name}. Error: ${String(err)}`)
    }
  }

  /**
   * Updated a products information
   * @param id is the id of the product to be updated
   * @param p is the new update for that product
   * @returns the updated product
   */
  async update (id: number, p: Product): Promise<Product> {
    try {
      const sql = 'UPDATE products SET (name, price, category) = ($2, $3, $4) WHERE id=($1) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [id, p.name, p.price, p.category])
      const updatedProduct = result.rows[0]

      conn.release()

      return updatedProduct
    } catch (err) {
      throw new Error(`Could not update the product id: ${id}. Error: ${String(err)}`)
    }
  }

  /**
   * Deletes a specific product from the database
   * @param id is the id of a product
   * @returns the deleted product
   */
  async delete (id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *'
      const conn = await client.connect()
      const result = await conn.query(sql, [id])
      const deletedProduct = result.rows[0]

      conn.release()

      return deletedProduct
    } catch (err) {
      throw new Error(`Could not remove the product id: ${id}. Error: ${String(err)}`)
    }
  }
}
