import { OrderTable } from '../models/orders'

const orderTable = new OrderTable()

describe('Order Model', () => {
  it('Current order of user 1 should return nothing', async () => {
    const current = await orderTable.currentOrders(1)
    expect(current).toEqual([{
      order_id: 2,
      product: 'Nimbus 2000',
      price: 999.99,
      category: 'Broom',
      quantity: 1
    }])
  })
  it('Current order of user 2 should return one active order', async () => {
    const current = await orderTable.currentOrders(2)
    expect(current.length).toEqual(2)
    expect(current[0]).toEqual({
      order_id: 5,
      product: 'Magical Beans',
      price: 3.99,
      category: 'Candy',
      quantity: 2
    })
  })
  it('Completed order of user 2 should return 1 complete orders', async () => {
    const completed = await orderTable.completedOrders(2)
    expect(completed.length).toEqual(2)
    expect(completed).toEqual([
      {
        order_id: 3,
        product: 'Felix Felicis',
        price: 4999.99,
        category: 'Potion',
        quantity: 1
      },
      {
        order_id: 4,
        product: 'Magical Creatures',
        price: 29.99,
        category: 'Book',
        quantity: 1
      }
    ])
  })
  it('buy should remove active orders', async () => {
    const result = await orderTable.makeBuy(3)
    expect(result).toEqual([
      {
        id: 3,
        user_id: 2,
        status: 'complete'
      }
    ])
  })
  it('Add product to user 1 should add it', async () => {
    const addedProduct = await orderTable.addProductOrder(1, 1, 1)
    expect(addedProduct).toEqual({
      id: 9,
      order_id: 1,
      product_id: 1,
      quantity: 1
    })
    const current = await orderTable.currentOrders(1)
    expect(current.length).toEqual(1)
  })

  it('Remove one product', async () => {
    const removedProduct = await orderTable.removeProductOrder(5, 2)
    expect(removedProduct).toEqual({
      id: 7,
      order_id: 5,
      product_id: 2,
      quantity: 1
    })
    const current = await orderTable.currentOrders(1)
    expect(current.length).toEqual(1)
  })
})
