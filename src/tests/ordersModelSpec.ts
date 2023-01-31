import { OrderTable } from '../models/orders'

const orderTable = new OrderTable()

describe('Order Model', () => {
  it('Current order of user 1 should return nothing', async () => {
    const current = await orderTable.currentOrder(1)
    expect(current).toEqual([])
  })
  it('Current order of user 2 should return one active order', async () => {
    const current = await orderTable.currentOrder(2)
    expect(current).toEqual([{
      id: 4,
      product_id: 7,
      quantity: 1,
      user_id: 2,
      status: 'active'
    }])
  })
  it('Completed order of user 2 should return 1 complete orders', async () => {
    const completed = await orderTable.completedOrders(2)
    expect(completed.length).toEqual(1)
    expect(completed).toEqual([{
      id: 3,
      product_id: 2,
      quantity: 1,
      user_id: 2,
      status: 'complete'
    }])
  })
  it('buy should remove active orders', async () => {
    const result = await orderTable.makeBuy(2)
    expect(result).toEqual([{
      id: 4,
      product_id: 7,
      quantity: 1,
      user_id: 2,
      status: 'complete'
    }])

    const currentOrder = await orderTable.currentOrder(2)
    expect(currentOrder).toEqual([])

    const completedOrders = await orderTable.completedOrders(2)
    expect(completedOrders.length).toEqual(2)
    expect(completedOrders[0]).toEqual({
      id: 3,
      product_id: 2,
      quantity: 1,
      user_id: 2,
      status: 'complete'
    })
    expect(completedOrders[1]).toEqual({
      id: 4,
      product_id: 7,
      quantity: 1,
      user_id: 2,
      status: 'complete'
    })
  })
  it('Add product to user 1 should add it and make active', async () => {
    const addedProduct = await orderTable.addProductOrder(4, 3, 1)
    expect(addedProduct).toEqual({
      id: 6,
      product_id: 3,
      quantity: 4,
      user_id: 1,
      status: 'active'
    })
    const current = await orderTable.currentOrder(1)
    expect(current.length).toEqual(1)
  })
  it('Add 2 more products to user 1 should make it three current orders', async () => {
    const addedProduct = await orderTable.addProductOrder(1, 4, 1)
    await orderTable.addProductOrder(1, 1, 1)

    expect(addedProduct).toEqual({
      id: 7,
      product_id: 4,
      quantity: 1,
      user_id: 1,
      status: 'active'
    })
    const current = await orderTable.currentOrder(1)
    expect(current.length).toEqual(3)
  })

  it('Remove one product should make current order = 2', async () => {
    const removedProduct = await orderTable.removeProductOrder(1, 7)
    expect(removedProduct).toEqual({
      id: 7,
      product_id: 4,
      quantity: 1,
      user_id: 1,
      status: 'active'
    })
    const current = await orderTable.currentOrder(1)
    expect(current.length).toEqual(2)
  })

  it('Empty active orders should return the two active order for user 1 and delete them', async () => {
    const emptied = await orderTable.emptyActiveOrders(1)
    expect(emptied.length).toEqual(2)

    const completed = await orderTable.completedOrders(1)
    expect(completed.length).toEqual(2)
  })
})
