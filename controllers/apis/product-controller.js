const productServices = require('../../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => {
      if (err) return next(err)
      return res.status(200).json({ products: data.products, tables: data.tables, categories: data.categories, categoryId: data.categoryId })
    })
  }
}

module.exports = productController
