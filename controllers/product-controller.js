const productServices = require('../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => {
      if (err) return next(err)
      console.log(data)
      return res.render('products', { products: data })
    })
  }
}

module.exports = productController
