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
      data = {
        list: data.categories,
        total: data.categories.length,
        pageSize: 10,
        currentPage: 1
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
      if (err) return next(err)
      return res.status(200).json({
        success: true,
        message: '新增分類成功',
        data
      })
    }
    )
  }
}

module.exports = productController
