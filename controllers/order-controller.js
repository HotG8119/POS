const orderService = require('../services/order-services')

const orderController = {
  postOrder: (req, res, next) => {
    const { table, cartItems } = req.body
    const cartItemsData = JSON.parse(cartItems)

    if (!cartItemsData.length) {
      req.flash('error_messages', '請新增餐點！')
      return res.redirect('/products')
    }
    // 如果沒有選擇桌號，就會返回頁面
    if (table === '請選擇桌號') {
      req.flash('error_messages', '請選擇桌號！')
      return res.redirect('/products')
    }

    orderService.postOrder(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功送出訂單！')
      return res.redirect('/products')
    })
  },
  getUnfinishedOrdersPage: (req, res, next) => {
    orderService.getUnfinishedOrdersPage(req, (err, data) => {
      if (err) return next(err)
      return res.render('unfinished-orders', { unfinishedOrders: data })
    })
  }

}

module.exports = orderController
