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
  getCreateProductPage: (req, res) => {
    res.render('admin/create-product')
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
      return res.render('admin/product', { product: data })
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
  }
}

module.exports = adminController
