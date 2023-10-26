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
        where: { completed_at: { [Op.not]: null }, payment_method: null },
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
        // 將所有completed_at轉成HH:mm
        order.completedAt = dayjs(order.completedAt).format('HH:mm')
        // 將所有tableId換成table的name
        order.tableName = tables.find(table => table.id === order.tableId)?.name || '無'
      })
      return cb(null, unpaidOrders)
    } catch (err) {
      return cb(err)
    }
  },
  getCheckoutPage: async (req, cb) => {
    try {
      const id = Number(req.params.id)
      const order = await Order.findByPk(id, { raw: true })
      if (!order) throw new Error('此訂單不存在！')
      if (order.paymentMethod) throw new Error('此訂單已付款！')
      const products = await Product.findAll({
        raw: true,
        attributes: ['id', 'name', 'price']
      })

      order.cartItems.forEach(item => {
        const itemId = Number(item.id)
        const product = products.find(product => product.id === itemId)
        item.name = product.name
        item.price = product.price
      }
      )

      return cb(null, order)
    } catch (err) {
      return cb(err)
    }
  },
  checkoutByCash: async (req, cb) => {
    try {
      const { id } = req.params
      const order = await Order.findByPk(id)
      if (!order) throw new Error('此訂單不存在！')
      if (order.paymentMethod) throw new Error('此訂單已付款！')
      await order.update({ paymentMethod: 'cash', paidAt: new Date() })
      return cb(null, order)
    } catch (err) {
      return cb(err)
    }
  },
  checkoutByLinepay: async (req, cb) => {
    try {
      const { id } = req.params
      const order = await Order.findByPk(id, {
        raw: true,
        attributes: ['id', 'cartItems', 'totalAmount', 'paymentMethod']
      })
      if (!order) throw new Error('此訂單不存在！')
      if (order.paymentMethod) throw new Error('此訂單已付款！')
      const products = await Product.findAll({
        raw: true,
        attributes: ['id', 'name', 'price']
      })
      return cb(null, { order, products })
    } catch (err) {
      return cb(err)
    }
  },
  linepayConfirm: async (req, cb) => {
    try {
      const { orderId } = req.query
      const order = await Order.findByPk(orderId, { raw: true })

      return cb(null, order)
    } catch (err) {
      return cb(err)
    }
  },
  LinepaySuccess: async (orderId, cb) => {
    try {
      console.log(orderId)
      // const { orderId } = req.body
      const order = await Order.findByPk(orderId)

      await order.update({ paymentMethod: 'linepay', paidAt: new Date() })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = orderServices
