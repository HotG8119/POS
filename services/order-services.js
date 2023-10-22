const { Order } = require('../models')

const orderServices = {
  getOrdersPage: async (req, res, cb) => {
    // try {
    // //   const orders = await Order.findAll({
    // //     raw: true,
    // //     nest: true,
    // //     where: { userId: req.user.id }
    // //   })
    // //  return cb(null, orders)
    //   return cb(null, {})
    // } catch (err) {
    //   return cb(err)
    // }
  },
  postOrder: async (req, cb) => {
    try {
      const { table, cartItems, totalAmount, notes } = req.body
      // 將cartItems轉成array 並留下id和quantity

      const cartItemsData = JSON.parse(cartItems).map(item => ({
        id: item.id,
        quantity: item.quantity
      }))

      console.log(cartItemsData)
      const order = await Order.create({
        table,
        cartItems: cartItemsData,
        totalAmount,
        notes
      })
      return cb(null, order)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = orderServices
