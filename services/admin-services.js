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
  postProduct: async (req, cb) => {
    const { name, price, description, image, isAvailable } = req.body
    console.log(req.body)
    if (!name || !price) throw new Error('名稱與價錢為必填！')
    try {
      await Product.create({
        name,
        price,
        description,
        image,
        isAvailable
      })
      req.flash('success_messages', '成功新增商品！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  getProduct: async (req, cb) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      if (!product) throw new Error('找不到該商品！')
      return cb(null, product)
    } catch (err) {
      return cb(err)
    }
  },
  putProduct: async (req, cb) => {
    try {
      const product = await Product.findByPk(req.params.id)
      if (!product) throw new Error('找不到該商品！')
      const { name, price, description, image, isAvailable } = req.body
      console.log('id', req.params.id)
      console.log('req.body', req.body)
      if (!name || !price) throw new Error('名稱與價錢為必填！')
      await product.update({
        name,
        price,
        description,
        image,
        isAvailable
      })
      req.flash('success_messages', '成功更新商品！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = adminServices
