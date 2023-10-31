const dayjs = require('dayjs')
const { Product, Category, Table, Order } = require('../models')
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
      return cb(error)
    }
  },
  getOrders: async (req, cb) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name']
      })

      const orders = await Order.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'cart_items', 'total_amount', 'payment_method', 'paid_at', 'created_at'],
        include: [
          { model: Table, attributes: ['id', 'name'] }
        ],
        order: [['created_at', 'DESC']]
      })

      orders.forEach(order => {
        // 用order.cart_items.id去找對應的product
        order.cart_items = order.cart_items.map(item => {
          item.product = products.find(product => Number(product.id) === Number(item.id))
          return item
        })

        order.payment_method = order.payment_method ? order.payment_method : '尚未付款'
        order.paid_at = order.paid_at ? dayjs(order.paid_at).format('MM-DD HH:mm') : '尚未付款'
        order.created_at = dayjs(order.created_at).format('MM-DD HH:mm')
        return order
      })

      return cb(null, orders)
    } catch (err) {
      return cb(err)
    }
  },
  deleteOrder: async (req, cb) => {
    try {
      const order = await Order.findByPk(req.params.id)
      if (!order) throw new Error('找不到該訂單！')
      await order.destroy()
      req.flash('success_messages', '成功刪除訂單！')
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = adminServices
