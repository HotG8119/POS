const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')

const admin = require('./modules/admin')

const userController = require('../../controllers/user-controller')
const productController = require('../../controllers/product-controller')
const orderController = require('../../controllers/order-controller')
const chatController = require('../../controllers/chat-controller')

router.use('/admin', authenticatedAdmin, admin)

// router.get('/signup', userController.signUpPage)
// router.post('/signup', userController.signUp)
router.get('/signup', authenticatedAdmin, userController.signUpPage)
router.post('/signup', authenticatedAdmin, userController.signUp)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
router.get('/logout', authenticated, userController.logout)

router.get('/products', authenticated, productController.getProducts)

router.put('/orders/unfinished/:id', authenticated, orderController.finishOrder)
router.get('/orders/unfinished', authenticated, orderController.getUnfinishedOrdersPage)

router.get('/orders/unpaid', authenticated, orderController.getUnpaidOrdersPage)
router.put('/orders/checkout/cash/:id', authenticated, orderController.checkoutByCash)
router.post('/orders/checkout/linepay/:id', authenticated, orderController.checkoutByLinepay)
router.get('/orders/checkout/:id', authenticated, orderController.getCheckoutPage)

router.get('/orders/today', authenticated, orderController.getTodayOrdersPage)
router.get('/orders/:id', authenticated, orderController.getOrder)
router.post('/orders', authenticated, orderController.postOrder)

router.get('/chatRooms', authenticated, chatController.getChatRoomsPage)

router.get('/linepay/confirm', authenticated, orderController.linepayConfirm)

router.get('/', (req, res) => res.redirect('/products'))
router.use('/', generalErrorHandler)

module.exports = router
