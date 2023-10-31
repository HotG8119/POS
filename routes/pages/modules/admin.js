const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer')

const adminController = require('../../../controllers/admin-controller')
const userController = require('../../../controllers/user-controller')

router.get('/products/create', adminController.getCreateProductPage)
router.get('/products/:id', adminController.getProduct)
router.put('/products/:id', upload.single('image'), adminController.putProduct)
router.delete('/products/:id', adminController.deleteProduct)
router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProduct)

router.get('/categories/:id', adminController.getCategoriesPage)
router.delete('/categories/:id', adminController.deleteCategory)
router.put('/categories/:id', adminController.putCategory)
router.get('/categories', adminController.getCategoriesPage)
router.post('/categories', adminController.postCategory)

router.put('/users/:id', userController.patchUser)
router.get('/users', userController.getUsers)

router.delete('/orders/:id', adminController.deleteOrder)
router.get('/orders', adminController.getOrders)

router.get('/index', adminController.getIndex)
router.use('/', (req, res) => res.redirect('/admin/index'))

module.exports = router
