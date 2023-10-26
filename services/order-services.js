const dayjs = require('dayjs')
const { Op } = require('sequelize')
const { Order, Product, Table } = require('../models')

const orderServices = {
  postOrder: async (req, cb) => {
    try {
      const { tableId, cartItems, totalAmount, notes } = req.body
      // 將cartItems轉成array 並留下id和quantity
      const cartItemsData = JSON.parse(cartItems).map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
      const order = await Order.create({
        tableId,
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

      const tables = await Table.findAll({ raw: true })

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
        // 將order的tableI換成table的name
        order.tableName = tables.find(table => table.id === order.tableId)?.name || '無'

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
  },
  getUnpaidOrdersPage: async (req, cb) => {
    try {
      // 用tableId找到所有completed_at = !null的order
      const unpaidOrders = await Order.findAll({
        raw: true,
        nest: true,
        where: { completed_at: { [Op.not]: null } },
        order: [['tableId', 'ASC']]
      })

      const products = await Product.findAll({
        raw: true,
        attributes: ['id', 'name', 'price']
      })

      const tables = await Table.findAll({ raw: true })

      unpaidOrders.forEach(order => {
        // 將所有orders的cartItems用id找到對應的product，並加入name, price, image到cartItems
        order.cartItems.forEach(item => {
          const itemId = Number(item.id)
          // 用itemId找到對應的product
          const product = products.find(product => product.id === itemId)
          item.name = product.name
          item.price = product.price
        })
        console.log(products)
        // 將所有completed_at轉成HH:mm
        order.completedAt = dayjs(order.completedAt).format('HH:mm')
        // 將所有tableId換成table的name
        order.tableName = tables.find(table => table.id === order.tableId)?.name || '無'
      })
      console.log(unpaidOrders)
      return cb(null, unpaidOrders)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = orderServices
