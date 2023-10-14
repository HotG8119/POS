const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer')

const adminController = require('../../../controllers/admin-controller')

router.get('/products/create', adminController.getCreateProductPage)
router.get('/products/:id', adminController.getProduct)
router.put('/products/:id', upload.single('image'), adminController.putProduct)
router.delete('/products/:id', adminController.deleteProduct)
router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProduct)

router.get('/index', adminController.getIndex)
router.use('/', (req, res) => res.redirect('/admin/index'))

module.exports = router
