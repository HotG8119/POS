const orderService = require('../services/order-services')

const orderController = {
  getOrdersPage: (req, res, next) => {
    return res.render('orders')
    // orderService.getOrdersPage(req, (err, data) => {
    //   if (err) return next(err)
    //   return res.render('orders', data)
    // })
  },
  postOrder: (req, res, next) => {
    orderService.postOrder(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/orders')
    })
  }
}

module.exports = orderController
