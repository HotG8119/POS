const productServices = require('../../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => {
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        data: {
          products: data.products,
          tables: data.tables,
          categories: data.categories,
          categoryId: data.categoryId
        }
      })
    }
    )
  },
  getCategories: (req, res, next) => {
    productServices.getCategories(req, (err, data) => {
      if (err) return next(err)

      const { pageSize, currentPage } = req.body
      data = {
        list: data.categories,
        total: data.categories.length,
        pageSize,
        currentPage
      }

      return res.status(200).json({
        success: true,
        data
      })
    }
    )
  },
  postCategory: (req, res, next) => {
    productServices.postCategory(req, (err, data) => {
      try {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({
          success: true,
          message: '新增分類成功',
          data
        })
      } catch (err) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
      }
    }
    )
  },
  deleteCategory: (req, res, next) => {
    productServices.deleteCategory(req, (err, data) => {
      try {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({
          success: true,
          message: '刪除分類成功',
          data
        })
      } catch (err) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
      }
    }
    )
  },
  editCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) {
      return res.status(200).json({ success: false, message: '分類名稱不得為空' })
    }
    productServices.editCategory(req, (err, data) => {
      try {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({
          success: true,
          message: '修改分類成功',
          data
        })
      } catch (err) {
        return res.status(500).json({ success: false, message: '伺服器錯誤' })
      }
    }
    )
  }
}

module.exports = productController
