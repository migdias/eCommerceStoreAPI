import { ProductStore } from '../models/products'

const store = new ProductStore()

describe('Product Model', () => {
  describe('Methods exist', () => {
    it('should have an index method', () => {
      expect(store.index).toBeDefined()
    })

    it('should have a show method', () => {
      expect(store.show).toBeDefined()
    })

    it('should have a create method', () => {
      expect(store.create).toBeDefined()
    })

    it('should have a update method', () => {
      expect(store.update).toBeDefined()
    })

    it('should have a delete method', () => {
      expect(store.delete).toBeDefined()
    })
  })
  describe('Create Method', () => {
    it('create method should add a product', async () => {
      const result = await store.create({
        name: 'Chocolate Frogs',
        price: 56.99,
        category: 'Book'
      })
      expect(result).toEqual({
        id: 8,
        name: 'Chocolate Frogs',
        price: 56.99,
        category: 'Book'
      })
    })
  })

  describe('Index and Show Method', () => {
    it('index method should return a list of products', async () => {
      const result = await store.index()
      expect(result.length).toEqual(8)
      expect(result[4]).toEqual({
        id: 5,
        name: 'Nimbus 2000',
        price: 999.99,
        category: 'Broom'
      })
    })
  })
  describe('Update Method', () => {
    it('updates an existing product', async () => {
      const fixProduct = {
        name: 'Chocolate Frogs',
        price: 5.99,
        category: 'Candy'
      }
      const result = await store.update(8, fixProduct)
      expect(result).toEqual(
        {
          id: 8,
          name: 'Chocolate Frogs',
          price: 5.99,
          category: 'Candy'
        }
      )
    })
  })

  describe('Delete product method', () => {
    it('delete method should remove the product', async () => {
      const deletedProduct = await store.delete(8)

      expect(deletedProduct).toEqual({
        id: 8,
        name: 'Chocolate Frogs',
        price: 5.99,
        category: 'Candy'
      })

      expect(await store.show(8)).toBeUndefined()
    })
  })
})
