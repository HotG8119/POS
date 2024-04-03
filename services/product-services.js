const dayjs = require('dayjs')
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
  },
  getProductList: async (req, cb) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true,
        include: [{ model: Category, attributes: ['id', 'name'] }],
        attributes: ['id', 'name', 'price', 'image', 'description', 'isAvailable']
      })

      return cb(null, { products })
    } catch (err) {
      return cb(err)
    }
  },

  addProduct: async (req, cb) => {
    try {
      const { name, price, categoryId, isAvailable, description, image } = req.body
      const product = await Product.findOne({ where: { name } })
      if (product) throw new Error('商品已存在！')

      await Product.create({ name, price, categoryId, isAvailable, description, image })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  deleteProduct: async (req, cb) => {
    try {
      const { id } = req.params
      const product = await Product.findByPk(id)
      if (!product) throw new Error('找不到該商品！')
      await product.destroy()
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  editProduct: async (req, cb) => {
    try {
      const { id } = req.params
      const product = await Product.findByPk(id)
      if (!product) throw new Error('找不到該商品！')
      const { name, price, categoryId, isAvailable, description } = req.body
      console.log('req.body:', req.body)
      await product.update({ name, price, categoryId, isAvailable, description })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  switchAvailable: async (req, cb) => {
    try {
      const { id } = req.params
      const product = await Product.findByPk(id)
      if (!product) throw new Error('找不到該商品！')
      await product.update({ isAvailable: !product.isAvailable })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  getCategories: async (req, cb) => {
    try {
      let categories = await Category.findAll({
        raw: true,
        attributes: ['id', 'name', 'createdAt', 'remark']
      })
      categories = categories.map(category => {
        category.createdAt = dayjs(category.createdAt).format('YYYY-MM-DD')
        return category
      })
      return cb(null, { categories })
    } catch (err) {
      return cb(err)
    }
  },
  postCategory: async (req, cb) => {
    try {
      let { name, remark } = req.body
      name = name.trim()
      remark = remark.trim()
      console.log('name:', name, 'remark:', remark)
      if (!name) throw new Error('分類名稱不得為空！')
      const category = await Category.findOne({ where: { name } })
      if (category) throw new Error('分類已存在！')
      await Category.create({ name, remark })
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
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  editCategory: async (req, cb) => {
    try {
      const { id } = req.params
      const category = await Category.findByPk(id)
      if (!category) throw new Error('找不到該分類！')
      let { name, remark } = req.body
      name = name.trim()
      remark = remark.trim()

      await category.update({ name, remark })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = productServices
