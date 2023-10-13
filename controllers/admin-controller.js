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
  getCraeteProductPage: (req, res) => {
    res.render('admin/create-product')
  },
  createProduct: (req, res, next) => {
    adminServices.createProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/products')
    })
  }
}

module.exports = adminController
