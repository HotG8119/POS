const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

router.get('/products/create', adminController.getCreateProductPage)
router.get('/products/:id', adminController.getProduct)
router.put('/products/:id', adminController.putProduct)
router.get('/products', adminController.getProducts)
router.post('/products', adminController.postProduct)

router.get('/index', adminController.getIndex)
router.use('/', (req, res) => res.redirect('/admin/index'))

module.exports = router
