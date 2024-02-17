const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/apiAuth')
const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')

// router.use('/admin', authenticated, authenticatedAdmin, adminController.XXXX)

router.post('/login', passport.authenticate('local', { session: false }), userController.login)

router.get('/products', authenticated, productController.getProducts)

module.exports = router
