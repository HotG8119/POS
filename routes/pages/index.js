const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')

const admin = require('./modules/admin')
const orderController = require('../../controllers/order-controller')
const userController = require('../../controllers/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// router.get('/signup', authenticatedAdmin, userController.signUpPage)
// router.post('/signup', authenticatedAdmin, userController.signUp)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
router.get('/logout', userController.logout)

router.get('/products', authenticated, orderController.getProducts)

router.get('/', (req, res) => res.redirect('/products'))
router.use('/', generalErrorHandler)

module.exports = router
