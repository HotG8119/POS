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
      const { cartItems, totalAmount, notes } = req.body
      const order = await Order.create({
        cartItems,
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
