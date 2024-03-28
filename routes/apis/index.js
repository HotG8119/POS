const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/apiAuth')
const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')
const routerController = require('../../controllers/apis/router-controller')

// router.use('/admin', authenticated, authenticatedAdmin, adminController.XXXX)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/signup', authenticated, authenticatedAdmin, userController.signUp)
router.get('/users', authenticated, authenticatedAdmin, userController.getUsers)
router.put('/users/role/:id', authenticated, authenticatedAdmin, userController.patchUserRole)
router.put('/users/info/:id', authenticated, authenticatedAdmin, userController.patchUserInfo)
router.put('/users/password/:id', authenticated, authenticatedAdmin, userController.patchUserPassword)
router.delete('/users/:id', authenticated, authenticatedAdmin, userController.deleteUser)

router.get('/menu/products', authenticated, productController.getProducts)
router.post('/menu/products/list', authenticated, productController.getProductList)
router.post('/menu/products/new', authenticated, authenticatedAdmin, productController.addProduct)
router.delete('/menu/products/:id', authenticated, authenticatedAdmin, productController.deleteProduct)
router.put('/menu/products/available/:id', authenticated, productController.switchAvailable)
router.post('/menu/categories/new', authenticated, authenticatedAdmin, productController.postCategory)
router.post('/menu/categories', authenticated, productController.getCategories)
router.delete('/menu/categories/:id', authenticated, authenticatedAdmin, productController.deleteCategory)
router.put('/menu/categories/:id', authenticated, authenticatedAdmin, productController.editCategory)

// router.get('/products', productController.getProducts)

router.get('/getAsyncRoutes', authenticated, routerController.asyncRoutes)

module.exports = router
