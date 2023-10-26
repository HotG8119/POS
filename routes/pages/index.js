const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
// const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')

const admin = require('./modules/admin')

const userController = require('../../controllers/user-controller')
const productController = require('../../controllers/product-controller')
const orderController = require('../../controllers/order-controller')

router.use('/admin', authenticatedAdmin, admin)

// router.get('/signup', userController.signUpPage)
// router.post('/signup', userController.signUp)
router.get('/signup', authenticatedAdmin, userController.signUpPage)
router.post('/signup', authenticatedAdmin, userController.signUp)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
router.get('/logout', userController.logout)

router.get('/products', productController.getProducts)

router.put('/orders/unfinished/:id', orderController.finishOrder)
router.get('/orders/unfinished', orderController.getUnfinishedOrdersPage)

router.get('/orders/unpaid', orderController.getUnpaidOrdersPage)
router.put('/orders/checkout/cash/:id', orderController.checkoutByCash)
router.post('/orders/checkout/linepay/:id', orderController.checkoutByLinepay)
router.get('/orders/checkout/:id', orderController.getCheckoutPage)

router.post('/orders', orderController.postOrder)

router.get('/linepay/confirm', orderController.linepayConfirm)

router.get('/', (req, res) => res.redirect('/products'))
router.use('/', generalErrorHandler)

module.exports = router
