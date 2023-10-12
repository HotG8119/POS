const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const orderController = require('../../controllers/order-controller')
const userController = require('../../controllers/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/', orderController.getProduct)

module.exports = router
