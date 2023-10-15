// const bcrypt = require('bcryptjs')
const { Product } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
    const { name, price, description, isAvailable } = req.body
    if (!name || !price) throw new Error('名稱與價錢為必填！')
    const { file } = req

    try {
      const localFile = await imgurFileHandler(file)
      await Product.create({
        name,
        price,
        description,
        image: localFile,
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
      const { name, price, description, isAvailable } = req.body
      if (!name || !price) throw new Error('名稱與價錢為必填！')
      const { file } = req
      const localFile = await imgurFileHandler(file)
      await product.update({
        name,
        price,
        description,
        image: localFile || product.image,
        isAvailable
      })
      req.flash('success_messages', '成功更新商品！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  deleteProduct: async (req, cb) => {
    try {
      const product = await Product.findByPk(req.params.id)
      if (!product) throw new Error('找不到該商品！')
      await product.destroy()
      req.flash('success_messages', '成功刪除商品！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = adminServices
