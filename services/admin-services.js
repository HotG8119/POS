// const bcrypt = require('bcryptjs')
const { Product } = require('../models')

const adminServices = {
  getProducts: async (req, cb) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true,
        order: [['id', 'ASC']]
      })
      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  },
  createProduct: async (req, cb) => {
    const { name, price, description, image } = req.body
    console.log(req.body)
    if (!name || !price) throw new Error('名稱與價錢為必填！')
    try {
      await Product.create({
        name,
        price,
        description,
        image
      })
      req.flash('success_messages', '成功新增商品！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = adminServices
