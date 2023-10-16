// const bcrypt = require('bcryptjs')
const { Product, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getProducts: async (req, cb) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true,
        include: 'Category',
        order: [['id', 'ASC']]
      })
      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  },
  getCreateProductPage: async (req, cb) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name']
      })
      return cb(null, categories)
    } catch (err) {
      return cb(err)
    }
  },
  postProduct: async (req, cb) => {
    const { name, price, description, category, isAvailable } = req.body
    if (!name || !price) throw new Error('名稱與價錢為必填！')
    const { file } = req

    try {
      const localFile = await imgurFileHandler(file)
      await Product.create({
        name,
        price,
        description,
        CategoryId: category,
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
        nest: true,
        include: [Category]
      })
      const categories = await Category.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name']
      })

      if (!product) throw new Error('找不到該商品！')
      return cb(null, { product, categories })
    } catch (err) {
      return cb(err)
    }
  },
  putProduct: async (req, cb) => {
    try {
      const product = await Product.findByPk(req.params.id)
      if (!product) throw new Error('找不到該商品！')
      const { name, price, description, category, isAvailable } = req.body
      if (!name || !price) throw new Error('名稱與價錢為必填！')
      const { file } = req
      const localFile = await imgurFileHandler(file)
      await product.update({
        name,
        price,
        description,
        CategoryId: category,
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
  },
  getCategoriesPage: async (req, cb) => {
    try {
      const categories = await Category.findAll({ raw: true })
      const category = req.params.is ?? await Category.findByPk(req.params.id, { raw: true })
      return cb(null, { categories, category })
    } catch (err) {
      return cb(err)
    }
  },
  postCategory: async (req, cb) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('請輸入分類名稱！')
      await Category.create({ name })
      req.flash('success_messages', '成功新增分類！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  deleteCategory: async (req, cb) => {
    try {
      const { id } = req.params
      const category = await Category.findByPk(id)
      if (!category) throw new Error('找不到該分類！')
      await category.destroy()
      req.flash('success_messages', '成功刪除分類！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  putCategory: async (req, cb) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const category = await Category.findByPk(id)
      if (!category) throw new Error('找不到該分類！')
      await category.update({ name })
      return cb(null)
    } catch (error) {

    }
  }
}

module.exports = adminServices
