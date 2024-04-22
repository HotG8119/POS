const { HmacSHA256 } = require('crypto-js')
const Base64 = require('crypto-js/enc-base64')
const axios = require('axios')
const dayjs = require('dayjs')

const orderService = require('../services/order-services')
const { Message } = require('../models')
const {
  LINEPAY_VERSION,
  LINEPAY_SITE,
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL
} = process.env

const orderController = {
  getOrder: (req, res, next) => {
    orderService.getOrder(req, (err, data) => {
      if (err) return next(err)

      return res.json(data)
    })
  },
  getTodayOrdersPage: (req, res, next) => {
    orderService.getTodayOrdersPage(req, (err, data) => {
      if (err) return next(err)
      let calculateAmount = 0
      let orderCount = 0

      data.forEach(order => {
        // 計算今日營業額
        calculateAmount += Number(order.totalAmount)
        // 計算今日訂單數
        orderCount += 1
      })
      return res.render('orders', { orders: data, calculateAmount, orderCount })
    })
  },
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

    const io = req.app.io

    io.once('connection', socket => {
      console.log('使用者連接')
      socket.on('error', console.error)

      socket.on('order message', msg => {
        msg.value.time = dayjs().format('MM-DD HH:mm')
        Message.create({
          content: msg.value.value,
          userId: req.user.id,
          message_type: 'order'
        })
        console.log(msg)
        io.emit('order message', msg)
      })

      socket.on('disconnect', () => {
        console.log('使用者離開')
      }
      )
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
      return res.render('checkout', { checkoutOrder: data })
    })
  },
  checkoutByCash: (req, res, next) => {
    orderService.checkoutByCash(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', `訂單 ${req.params.id} 已完成付款！`)
      return res.redirect('/orders/unpaid')
    })
  },
  checkoutByLinepay: (req, res, next) => {
    orderService.checkoutByLinepay(req, async (err, data) => {
      if (err) return next(err)
      try {
        const order = data.order
        console.log('order')
        // 製作 linepay 的 body
        const packages = order.cartItems.map(item => ({
          id: item.id,
          amount: Number(item.amount),
          products: [
            {
              name: item.name,
              quantity: Number(item.quantity),
              price: Number(item.price)
            }
          ]
        }))

        const orderToLinepay = {
          amount: Number(order.totalAmount),
          currency: 'TWD',
          orderId: (order.id).toString(),
          packages: packages
        }

        const linepayBody = {
          ...orderToLinepay,
          redirectUrls: {
            confirmUrl: LINEPAY_RETURN_HOST + LINEPAY_RETURN_CONFIRM_URL,
            cancelUrl: LINEPAY_RETURN_HOST + LINEPAY_RETURN_CANCEL_URL
          }
        }
        // 製作 linepay 的 signature
        const uri = '/payments/request'
        const headers = createSignature(uri, linepayBody)
        const url = LINEPAY_SITE + LINEPAY_VERSION + uri
        // 向 linepay 發送請求
        const linepayRes = await axios.post(url, linepayBody, { headers })

        if (linepayRes?.data?.returnCode === '0000') {
          res.redirect(linepayRes?.data?.info.paymentUrl.web)
        } else {
          req.flash('error_messages', '付款失敗！')
          return res.redirect('/orders/unpaid')
        }
      } catch (err) {
        console.log(err)
      }
    })
  },
  linepayConfirm: (req, res, next) => {
    orderService.linepayConfirm(req, async (err, data) => {
      try {
        if (err) return next(err)
        const { transactionId, orderId } = req.query
        const order = data
        const linpayBody = {
          amount: Number(order.totalAmount),
          currency: 'TWD'
        }
        const uri = `/payments/${transactionId}/confirm`
        const headers = createSignature(uri, linpayBody)
        const url = LINEPAY_SITE + LINEPAY_VERSION + uri
        const linepayRes = await axios.post(url, linpayBody, { headers })
        if (linepayRes?.data?.returnCode === '0000') {
          orderService.LinepaySuccess(orderId, (err, data) => {
            if (err) return next(err)
            req.flash('success_messages', `訂單 ${orderId} 已完成付款！`)
            return res.redirect('/orders/unpaid')
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

}

function createSignature (uri, linepayBody) {
  const nonce = parseInt(new Date().getTime() / 1000)
  const string = LINEPAY_CHANNEL_SECRET + '/' + LINEPAY_VERSION + uri + JSON.stringify(linepayBody) + nonce
  const signature = Base64.stringify(HmacSHA256(string, LINEPAY_CHANNEL_SECRET))
  // 製作 linepay 的 headers
  const headers = {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': signature
  }
  return headers
}

module.exports = orderController
