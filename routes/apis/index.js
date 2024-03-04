const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/apiAuth')
const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')
const routerController = require('../../controllers/apis/router-controller')

// router.use('/admin', authenticated, authenticatedAdmin, adminController.XXXX)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.get('/users', authenticated, authenticatedAdmin, userController.getUsers)
router.post('/signup', authenticated, authenticatedAdmin, userController.signUp)

router.get('/products', authenticated, productController.getProducts)
// router.get('/products', productController.getProducts)

router.get('/getAsyncRoutes', authenticated, routerController.asyncRoutes)

module.exports = router
