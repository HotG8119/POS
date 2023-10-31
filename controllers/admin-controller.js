const dayjs = require('dayjs')
const adminServices = require('../services/admin-services')

const adminController = {
  getIndex: (req, res) => {
    res.render('admin/index')
  },
  getProducts: (req, res, next) => {
    adminServices.getProducts(req, (err, data) => {
      if (err) return next(err)
      // 將所有的data.description縮短到50字元內的空格 並加上...
      data.forEach(product => {
        product.description = product.description.slice(0, 50).trim() + '...'
      })
      return res.render('admin/products', { products: data })
    })
  },
  getCreateProductPage: (req, res, next) => {
    adminServices.getCreateProductPage(req, (err, data) => {
      if (err) return next(err)
      return res.render('admin/create-product', { categories: data })
    })
  },
  postProduct: (req, res, next) => {
    adminServices.postProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/products')
    })
  },
  getProduct: (req, res, next) => {
    adminServices.getProduct(req, (err, data) => {
      if (err) return next(err)
      return res.render('admin/product', { product: data.product, categories: data.categories })
    })
  },
  putProduct: (req, res, next) => {
    adminServices.putProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect(`/admin/products/${req.params.id}`)
    })
  },
  deleteProduct: (req, res, next) => {
    adminServices.deleteProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/products')
    })
  },
  getCategoriesPage: (req, res, next) => {
    // 這裡的req.params.id是指編輯的那個category的id 傳到adminServices的getCategoriesPage
    adminServices.getCategoriesPage(req, (err, data) => {
      console.log(data)
      if (err) return next(err)
      return res.render('admin/categories', { categories: data.categories, category: data.category })
    })
  },
  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res, next) => {
    adminServices.deleteCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res, next) => {
    adminServices.putCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  },
  getOrders: (req, res, next) => {
    adminServices.getOrders(req, (err, data) => {
      if (err) return next(err)
      const ordersByMonth = groupOrdersByMonth(data)
      console.log(ordersByMonth)

      return res.render('admin/orders', { ordersByMonth })
    })
  }
}

function groupOrdersByMonth (orders) {
  const ordersByMonth = []
  const months = {}

  for (const order of orders) {
    const createdDate = dayjs(order.created_at)
    const monthName = createdDate.format('MMM') // 取得月份的縮寫，例如 'Jan' 表示一月

    if (!months[monthName]) {
      months[monthName] = []
    }

    months[monthName].push(order)
  }

  for (const month in months) {
    const totalAmountMonth = months[month].reduce((total, order) => total + parseFloat(order.total_amount), 0)
    const orderQtyMonth = months[month].length
    // 計算每個月用linepay的總金額及訂單數
    const linepayTotalAmountMonth = months[month].reduce((total, order) => {
      if (order.payment_method === 'linepay') {
        return total + parseFloat(order.total_amount)
      } else {
        return total
      }
    }, 0)
    const linepayOrderQtyMonth = months[month].reduce((total, order) => {
      if (order.payment_method === 'linepay') {
        return total + 1
      } else {
        return total
      }
    }, 0)
    // 計算每個月用cash的總金額及訂單數
    const cashTotalAmountMonth = months[month].reduce((total, order) => {
      if (order.payment_method === 'cash') {
        return total + parseFloat(order.total_amount)
      } else {
        return total
      }
    }, 0)
    const cashOrderQtyMonth = months[month].reduce((total, order) => {
      if (order.payment_method === 'cash') {
        return total + 1
      } else {
        return total
      }
    }, 0)

    ordersByMonth.push({
      month,
      orders: months[month],
      totalAmountMonth,
      orderQtyMonth,
      linepayTotalAmountMonth,
      linepayOrderQtyMonth,
      cashTotalAmountMonth,
      cashOrderQtyMonth
    })
  }

  return ordersByMonth
}

module.exports = adminController
