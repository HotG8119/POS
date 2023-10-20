const { Product, Category } = require('../models')

const productServices = {
  getProducts: async (req, cb) => {
    try {
      const products = await Category.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name'],
        include: [Product]
      })

      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = productServices
