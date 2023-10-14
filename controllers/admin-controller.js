const adminServices = require('../services/admin-services')

const adminController = {
  getIndex: (req, res) => {
    res.render('admin/index')
  },
  getProducts: (req, res, next) => {
    adminServices.getProducts(req, (err, data) => {
      if (err) return next(err)
      console.log(data)
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
      console.log(data)
      if (err) return next(err)
      return res.render('admin/product', { product: data })
    })
  },
  putProduct: (req, res, next) => {
    adminServices.putProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect(`/admin/products/${req.params.id}`)
    })
  }
}

module.exports = adminController
