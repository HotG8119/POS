const productServices = require('../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => {
      console.log(data)
      if (err) return next(err)
      return res.render('products', { products: data.products, tables: data.tables })
    })
  }
}

module.exports = productController
