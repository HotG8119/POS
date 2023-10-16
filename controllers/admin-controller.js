const adminServices = require('../services/admin-services')

const adminController = {
  getIndex: (req, res) => {
    res.render('admin/index')
  },
  getProducts: (req, res, next) => {
    adminServices.getProducts(req, (err, data) => {
      if (err) return next(err)
      // 將所有的data.description縮短到50字元內的空格 並加上...
      data.forEach(product => {
        product.description = product.description.slice(0, 50).trim() + '...'
      })
      return res.render('admin/products', { products: data })
    })
  },
  getCreateProductPage: (req, res, next) => {
    adminServices.getCreateProductPage(req, (err, data) => {
      if (err) return next(err)
      return res.render('admin/create-product', { categories: data })
    })
  },
  postProduct: (req, res, next) => {
    adminServices.postProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/products')
    })
  },
  getProduct: (req, res, next) => {
    adminServices.getProduct(req, (err, data) => {
      if (err) return next(err)
      return res.render('admin/product', { product: data.product, categories: data.categories })
    })
  },
  putProduct: (req, res, next) => {
    adminServices.putProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect(`/admin/products/${req.params.id}`)
    })
  },
  deleteProduct: (req, res, next) => {
    adminServices.deleteProduct(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/products')
    })
  },
  getCategoriesPage: (req, res, next) => {
    // 這裡的req.params.id是指編輯的那個category的id 傳到adminServices的getCategoriesPage
    adminServices.getCategoriesPage(req, (err, data) => {
      console.log(data)
      if (err) return next(err)
      return res.render('admin/categories', { categories: data.categories, category: data.category })
    })
  },
  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res, next) => {
    adminServices.deleteCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res, next) => {
    adminServices.putCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  }

}

module.exports = adminController
