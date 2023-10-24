const dayjs = require('dayjs')
const { Order, Product } = require('../models')

const orderServices = {
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
      console.log(err)
      return cb(err)
    }
  },
  getUnfinishedOrdersPage: async (req, cb) => {
    try {
      // 找到所有 completed_at = null 的 order 並由新到舊排序
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        where: { completed_at: null },
        order: [['createdAt', 'DESC']]
      })

      const products = await Product.findAll({
        raw: true,
        attributes: ['id', 'name', 'price']
      })

      const ordersWithProducts = orders.map(order => {
        // 將所有orders的cartItems用id找到對應的product，並加入name, price, image到cartItems
        order.cartItems.forEach(item => {
          const itemId = Number(item.id)
          // 用itemId找到對應的product
          const product = products.find(product => product.id === itemId)
          item.name = product.name
          item.price = product.price
        })
        // 將order的時間用dayjs改成HH:mm
        order.createdAt = dayjs(order.createdAt).format('HH:mm')

        return order
      })

      return cb(null, ordersWithProducts)
    } catch (err) {
      return cb(err)
    }
  },
  finishOrder: async (req, cb) => {
    try {
      const { id } = req.params
      const order = await Order.findByPk(id)

      if (!order) throw new Error('此訂單不存在！')

      await order.update({ completedAt: new Date() })
      return cb(null, order)
    } catch (err) {
      return cb(err)
    }
  }

}

module.exports = orderServices
