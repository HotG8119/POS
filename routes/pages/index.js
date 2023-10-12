const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const orderController = require('../../controllers/order-controller')

router.use('/admin', admin)
router.get('/', orderController.getProduct)

module.exports = router
