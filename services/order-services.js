const dayjs = require('dayjs')
const { Op } = require('sequelize')
const { Order, OrderProduct, Product, Category, Table } = require('../models')

const orderServices = {
  getMenuList: async (req, cb) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name', 'price', 'image', 'isAvailable', 'description'],
        include: [{ model: Category, attributes: ['id', 'name'] }],
        order: [['id', 'ASC'], [Category, 'id', 'ASC']]
      })
      const categories = await Category.findAll({ raw: true, attributes: ['id', 'name'] })
      const tables = await Table.findAll({ raw: true, attributes: ['id', 'name'] })
      return cb(null, { products, categories, tables })
    } catch (err) {
      return cb(err)
    }
  },
  getOrder: async (req, cb) => {
    try {
      const orderId = Number(req.params.id)
      const order = await Order.findByPk(orderId,
        {
          raw: true,
          nest: true,
          include: [{ model: Table, attributes: ['name'] }],
          attributes: ['id', 'cartItems', 'notes', 'createdAt', 'completedAt']
        })
      if (!order) throw new Error('此訂單不存在！')
      const products = await Product.findAll({
        raw: true,
        attributes: ['id', 'name']
      })
      // 將order的cartItems用id找到對應的product，並加入name,到cartItems
      // createdAt轉成 HH:mm
      order.cartItems.forEach(item => {
        const itemId = Number(item.id)
        // 用itemId找到對應的product
        const product = products.find(product => product.id === itemId)
        item.name = product.name
      })
      order.createdAt = dayjs(order.createdAt).format('HH:mm')

      return cb(null, order)
    } catch (err) {
      return cb(err)
    }
  },
  getTodayOrdersPage: async (req, cb) => {
    try {
      const startDate = dayjs().startOf('day').toDate()
      const endDate = dayjs().endOf('day').toDate()
      // 找到所有 completed_at != null 的 order 並由新到舊排序
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        where: {
          paid_at: { [Op.not]: null },
          created_at: { [Op.between]: [startDate, endDate] }
        },
        order: [['id', 'ASC']]
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
        order.completedAt = dayjs(order.completedAt).format('HH:mm')
        order.paidAt = dayjs(order.paidAt).format('HH:mm')
        // 將order的tableI換成table的name
        order.tableName = tables.find(table => table.id === order.tableId)?.name || '無'

        return order
      })

      return cb(null, ordersWithProducts)
    } catch (err) {
      return cb(err)
    }
  },
  getTodayOrders: async (req, cb) => {
    try {
      console.log('getTodayOrders')
      const { pageSize, currentPage } = req.body
      const { status } = req.body.form
      const statusKey = getStatusKey(status)
      const today = dayjs().format('YYYY-MM-DD')

      const orders = await Order.findAndCountAll({
        raw: true,
        nest: true,
        include: [{ model: Table, attributes: ['name'] }],
        where: {
          ...statusKey,
          createdAt: {
            [Op.between]: [`${today} 00:00:00`, `${today} 23:59:59`]
          }
        },
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      })
      const orderIds = orders.rows.map(order => order.id)
      const orderProducts = await OrderProduct.findAll({
        raw: true,
        nest: true,
        include: [
          { model: Product, attributes: ['id', 'name', 'price'] }],
        where: { orderId: orderIds }
      })
      orders.rows.forEach(order => {
        order.cartItems = orderProducts.filter(item => item.orderId === order.id)
      })

      return cb(null, orders)
    } catch (err) {
      return cb(err)
    }
  },
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
  postOrderApi: async (req, cb) => {
    const { tableId, cartItems, totalAmount } = req.body
    try {
      const order = await Order.create({
        tableId,
        totalAmount
      })
      const orderProducts = cartItems.map(item => ({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.orderQuantity
      }))
      await OrderProduct.bulkCreate(orderProducts)

      return cb(null, order)
    } catch (err) {
      console.log(err)
      return cb(err)
    }
  },
  deleteOrder: async (req, cb) => {
    try {
      console.log('deleteOrder')
      const { id } = req.params
      const order = await Order.findByPk(id)
      if (!order) throw new Error('此訂單不存在！')
      await OrderProduct.destroy({ where: { orderId: id } })
      await order.destroy()
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  updateOrder: async (req, cb) => {
    try {
      const { id } = req.params
      const { title } = req.body
      const order = await Order.findByPk(id)
      if (!order) throw new Error('此訂單不存在！')
      if (title === '完成') {
        console.log('完成訂單')
        await order.update({ completedAt: new Date() })
        await OrderProduct.update({ status: 'completed', completedAt: new Date() }, { where: { orderId: id } })
      }
      return cb(null)
    } catch (err) {
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
  getPrepareOrders: async (req, cb) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'createdAt'],
        where: { completedAt: null, createdAt: { [Op.gt]: dayjs().startOf('day').toDate() } },
        include: [
          { model: Table, attributes: ['name'] },
          {
            model: OrderProduct,
            attributes: ['id', 'quantity', 'status'],
            include: [{ model: Product, attributes: ['name'] }]
          }]
      })
      // 將數據合併
      const mergedOrders = {}

      orders.forEach(order => {
        const { id, createdAt, Table, OrderProducts } = order

        if (!mergedOrders[id]) {
          mergedOrders[id] = {
            id,
            createdAt: dayjs(createdAt).format('HH:mm'),
            tableName: Table.name,
            OrderProducts: []
          }
        }

        mergedOrders[id].OrderProducts.push({
          id: OrderProducts.id,
          name: OrderProducts.Product.name,
          quantity: OrderProducts.quantity,
          status: OrderProducts.status
        })
      })

      // 轉換物件回陣列
      const finalOrdersArray = Object.values(mergedOrders)

      return cb(null, finalOrdersArray)
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
        item.amount = item.quantity * item.price
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
      // 將所有orders的cartItems用id找到對應的product，並加入name, price, image到cartItems
      order.cartItems.forEach(item => {
        const product = products.find(product => product.id === item.id)
        console.log('product:', product)
        item.name = product.name
        item.price = Number(product.price)
        item.amount = Number(item.price) * Number(item.quantity)
      })
      return cb(null, { order })
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
      const order = await Order.findByPk(orderId)

      await order.update({ paymentMethod: 'LinePay', paidAt: new Date() })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  payOrderByCash: async (req, cb) => {
    try {
      const { id } = req.params
      const order = await Order.findByPk(id)
      if (!order) throw new Error('此訂單不存在！')
      if (!order.completedAt) throw new Error('此訂單尚未完成！')
      if (order.paymentMethod) throw new Error('此訂單已付款！')
      await order.update({ paymentMethod: 'cash', paidAt: new Date() })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  getCloseoutOrders: async (req, cb) => {
    try {
      let { timeValue: [startDate, endDate] } = req.body
      startDate = dayjs(startDate).startOf('day').toDate()
      endDate = dayjs(endDate).endOf('day').toDate()

      const orders = await Order.findAndCountAll({
        raw: true,
        where: {
          paidAt: { [Op.not]: null },
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      })

      const periodOrdersData = {
        totalCount: orders.count,
        totalAmount: orders.rows.reduce((total, order) => total + Number(order.totalAmount), 0)
      }

      function ordersDataToDailyTotals (orders) {
        const summary = {}

        // 整理訂單資料
        orders.rows.forEach(order => {
          const date = dayjs(order.createdAt).format('MM-DD') // 取得日期並格式化為YYYY-MM-DD
          if (!summary[date]) {
            summary[date] = {
              totalAmount: 0,
              orderCount: 0
            }
          }
          summary[date].totalAmount += parseInt(order.totalAmount, 10)
          summary[date].orderCount++ // 計算當日訂單數量
        })

        // 分別提取日期、總金額和訂單數量
        const dateData = Object.keys(summary).sort() // 日期排序
        const amountData = dateData.map(date => summary[date].totalAmount)
        const countData = dateData.map(date => summary[date].orderCount)

        return {
          dateData,
          amountData,
          countData
        }
      }

      const dailyTotals = ordersDataToDailyTotals(orders)

      const orderProducts = await OrderProduct.findAll({
        raw: true,
        nest: true,
        attributes: ['quantity'],
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price']
          },
          {
            model: Order,
            attributes: ['id', 'paidAt'],
            where: {
              paidAt: { [Op.not]: null },
              createdAt: { [Op.between]: [startDate, endDate] }
            }
          }
        ]
      })

      const productCounts = orderProducts.reduce((acc, item) => {
        let { id, name, price } = item.Product
        price = Number(price)
        const { paidAt } = item.Order
        if (acc[id]) {
          acc[id].quantity += item.quantity
        } else {
          acc[id] = { id, name, price, quantity: item.quantity }
        }

        if (!acc[id].paidAt || acc[id].paidAt < paidAt) {
          acc[id].paidAt = paidAt
        }
        return acc
      }, {})

      const productCountsArray = Object.values(productCounts)

      productCountsArray.sort((a, b) => b.quantity - a.quantity || a.id - b.id)
      console.log('productCountsArray:', productCountsArray)
      return cb(null, { periodOrdersData, dailyTotals, productCountsArray })
    } catch (err) {
      return cb(err)
    }
  },
  putOrderProduct: async (req, cb) => {
    try {
      const { orderProductId } = req.params
      const { status } = req.body
      const orderProduct = await OrderProduct.findByPk(orderProductId)
      if (!orderProduct) throw new Error('此訂單不存在！')
      await orderProduct.update({ status })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

function getStatusKey (status) {
  switch (status) {
    case '未完成':
      return { completedAt: null, paidAt: null }
    case '未付款':
      return { completedAt: { [Op.not]: null }, paidAt: null }
    case '已完成':
      return { completedAt: { [Op.not]: null }, paidAt: { [Op.not]: null } }
    default:
      return {}
  }
}

module.exports = orderServices
