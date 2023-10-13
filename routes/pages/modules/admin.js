const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

router.get('/products/create', adminController.getCraeteProductPage)
router.get('/products', adminController.getProducts)
router.post('/products', adminController.createProduct)

router.get('/index', adminController.getIndex)
router.use('/', (req, res) => res.redirect('/admin/index'))

module.exports = router
