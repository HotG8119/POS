const express = require('express')
const router = express.Router()
// const passport = require('../../config/passport')
// const { authenticated } = require('../../middleware/auth')

const productController = require('../../controllers/apis/product-controller')

router.get('/products', productController.getProducts)

module.exports = router
