const { Product, Category, Table } = require('../models')

const productServices = {
  getProducts: async (req, cb) => {
    try {
      const products = await Category.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name'],
        include: [Product]
      })
      const tables = await Table.findAll({ raw: true })

      return cb(null, { products, tables })
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = productServices
