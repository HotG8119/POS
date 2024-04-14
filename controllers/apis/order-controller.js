const orderServices = require('../../services/order-services')

const orderController = {
  getMenuList: (req, res, next) => {
    orderServices.getMenuList(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        data: {
          products: data.products,
          tables: data.tables,
          categories: data.categories
        }
      })
    })
  },
  postOrder: (req, res, next) => {
    const { tableId, cartItems } = req.body
    if (!tableId || !cartItems) return res.status(400).json({ success: false, message: '請選擇桌號或餐點！' })

    orderServices.postOrderApi(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        message: '成功送出訂單！',
        data
      })
    })
  }
}

module.exports = orderController
