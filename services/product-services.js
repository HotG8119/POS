const { Product, Category, Table } = require('../models')

const productServices = {
  getProducts: async (req, cb) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const categories = await Category.findAll({
        raw: true,
        attributes: ['id', 'name']
      })
      const tables = await Table.findAll({
        raw: true,
        attributes: ['id', 'name']
      })
      const products = await Product.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { CategoryId: categoryId } : {}
        },
        attributes: ['id', 'name', 'price', 'image', 'description', 'isAvailable']
      })
      return cb(null, { products, tables, categories, categoryId })
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = productServices
