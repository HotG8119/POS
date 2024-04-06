const productServices = require('../../services/product-services')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
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
  getProductList: (req, res, next) => {
    const { pageSize, currentPage } = req.body
    productServices.getProductList(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        data: {
          list: data.products.rows,
          total: data.products.count,
          pageSize,
          currentPage
        }
      })
    }
    )
  },
  addProduct: (req, res, next) => {
    const { name, price, categoryId } = req.body
    if (!name) return res.status(200).json({ success: false, message: '請填寫完整資訊' })
    if (price < 0) return res.status(200).json({ success: false, message: '價格不得小於零' })
    if (!categoryId) return res.status(200).json({ success: false, message: '請選擇分類' })

    productServices.addProduct(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })

      return res.status(200).json({ success: true, message: '新增商品成功', data })
    })
  },
  uploadImage: async (req, res, next) => {
    try {
      const imgurUrl = await imgurFileHandler(req.file)
      return res.status(200).json({
        success: true,
        message: '上傳圖片成功',
        data: imgurUrl
      })
    } catch (err) {
      return res.status(200).json({ success: false, message: err.message })
    }
  },
  deleteProduct: (req, res, next) => {
    productServices.deleteProduct(req, (err, data) => {
      try {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({
          success: true,
          message: '刪除商品成功',
          data
        })
      } catch (err) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
      }
    }
    )
  },
  editProduct: (req, res, next) => {
    const { name, price, categoryId } = req.body
    if (!name || !categoryId) {
      return res.status(200).json({ success: false, message: '請填寫完整資訊' })
    }
    if (price < 0) {
      return res.status(200).json({ success: false, message: '價格不得小於零' })
    }
    productServices.editProduct(req, (err, data) => {
      try {
        if (err) return res.status(200).json({ success: false, message: err.message })
        return res.status(200).json({
          success: true,
          message: '修改商品成功',
          data
        })
      } catch (err) {
        return res.status(500).json({ success: false, message: '伺服器錯誤' })
      }
    }
    )
  },
  switchAvailable: (req, res, next) => {
    productServices.switchAvailable(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })
      return res.status(200).json({
        success: true,
        message: '商品狀態切換成功'
      })
    }
    )
  },
  getCategories: (req, res, next) => {
    productServices.getCategories(req, (err, data) => {
      if (err) return res.status(200).json({ success: false, message: err.message })

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
