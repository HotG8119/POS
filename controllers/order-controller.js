// const dayjs = require('dayjs')
const orderService = require('../services/order-services')

const orderController = {
  postOrder: (req, res, next) => {
    const { tableId, cartItems } = req.body
    const cartItemsData = JSON.parse(cartItems)

    if (!cartItemsData.length) {
      req.flash('error_messages', '請新增餐點！')
      return res.redirect('/products')
    }
    // 如果沒有選擇桌號，就會返回頁面
    if (tableId === '請選擇桌號') {
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
  },
  finishOrder: (req, res, next) => {
    orderService.finishOrder(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', `訂單 ${req.params.id} 已完成！`)
      return res.redirect('/orders/unfinished')
    })
  },
  getUnpaidOrdersPage: (req, res, next) => {
    orderService.getUnpaidOrdersPage(req, (err, data) => {
      if (err) return next(err)

      return res.render('unpaid-orders', { unpaidOrders: data })
    })
  },
  getCheckoutPage: (req, res, next) => {
    orderService.getCheckoutPage(req, (err, data) => {
      if (err) return next(err)
      console.log(data)
      // const checkOrder = {
      //   productName: '餐點',
      //   amount: data.totalAmount,
      //   currency: 'TWD',
      //   orderId: data.id,
      //   oneTimeKey: dayjs().valueOf().toString().padEnd(18, '0')
      // }

      return res.render('checkout', { checkoutOrder: data })
    })
  },
  checkoutByCash: (req, res, next) => {
    orderService.checkoutByCash(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', `訂單 ${req.params.id} 已完成付款！`)
      return res.redirect('/orders/unpaid')
    })
  }

}

module.exports = orderController
