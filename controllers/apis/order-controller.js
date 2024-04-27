const orderServices = require('../../services/order-services')

// const axios = require('axios')
// const { HmacSHA256 } = require('crypto-js')
// const Base64 = require('crypto-js/enc-base64')

// const {
//   LINEPAY_VERSION,
//   LINEPAY_SITE,
//   LINEPAY_CHANNEL_ID,
//   LINEPAY_CHANNEL_SECRET,
//   LINEPAY_RETURN_HOST,
//   LINEPAY_RETURN_CONFIRM_URL,
//   LINEPAY_RETURN_CANCEL_URL
// } = process.env

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
  },
  deleteOrder: (req, res, next) => {
    orderServices.deleteOrder(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        message: '成功刪除訂單！'
      })
    })
  },
  updateOrder: (req, res, next) => {
    orderServices.updateOrder(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        message: '成功更新訂單！'
      })
    })
  },
  getTodayOrders: (req, res, next) => {
    const { pageSize, currentPage } = req.body
    orderServices.getTodayOrders(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        data: {
          list: data.rows,
          total: data.count,
          pageSize,
          currentPage

        }

      })
    })
  },
  payOrder: (req, res, next) => {
    const { method } = req.body

    if (method === '現金') {
      orderServices.payOrderByCash(req, (err, data) => {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({
          success: true,
          message: '付款成功！'
        })
      })
    }

    // if (method === 'LinePay') {
    //   orderServices.checkoutByLinepay(req, async (err, data) => {
    //     try {
    //       const { order } = data

    //       const linepayBody = createLinePayBody(order)
    //       const uri = '/payments/request'
    //       const headers = createSignature(uri, linepayBody)
    //       const url = LINEPAY_SITE + LINEPAY_VERSION + uri
    //       // 向 linepay 發送請求
    //       const linepayRes = await axios.post(url, linepayBody, { headers })

    //       if (linepayRes?.data?.returnCode !== '0000') throw new Error('付款失敗！')

    //       if (err) return res.status(200).json({ success: false, message: err.message })
    //       res.status(200).json({ success: true, paymentUrl: linepayRes?.data?.info.paymentUrl.web })
    //     } catch (err) {
    //       return res.status(200).json({ success: false, message: err.message })
    //     }
    //   })
    // }
  },
  getCloseoutOrders: (req, res, next) => {
    console.log('GGGG')
    orderServices.getCloseoutOrders(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        data
      })
    })
  }
}

// function createLinePayBody (order) {
//   const packages = order.cartItems.map(item => ({
//     id: item.id,
//     amount: Number(item.amount),
//     products: [{
//       name: item.name,
//       quantity: Number(item.quantity),
//       price: Number(item.price)
//     }]
//   }))

//   return {
//     amount: Number(order.totalAmount),
//     currency: 'TWD',
//     orderId: order.id.toString(),
//     packages: packages,
//     redirectUrls: {
//       confirmUrl: LINEPAY_RETURN_HOST + LINEPAY_RETURN_CONFIRM_URL,
//       cancelUrl: LINEPAY_RETURN_HOST + LINEPAY_RETURN_CANCEL_URL
//     }
//   }
// }

// function createSignature (uri, linepayBody) {
//   const nonce = parseInt(new Date().getTime() / 1000)
//   const string = LINEPAY_CHANNEL_SECRET + '/' + LINEPAY_VERSION + uri + JSON.stringify(linepayBody) + nonce
//   const signature = Base64.stringify(HmacSHA256(string, LINEPAY_CHANNEL_SECRET))
//   // 製作 linepay 的 headers
//   const headers = {
//     'Content-Type': 'application/json',
//     'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
//     'X-LINE-Authorization-Nonce': nonce,
//     'X-LINE-Authorization': signature
//   }
//   return headers
// }

module.exports = orderController
