const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const { generalErrorHandler } = require('../../middleware/error-handler')

const admin = require('./modules/admin')
const orderController = require('../../controllers/order-controller')
const userController = require('../../controllers/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.logIn)
router.get('/logout', userController.logout)

router.get('/', orderController.getProduct)
router.use('/', generalErrorHandler)

module.exports = router
