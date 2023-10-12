const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

router.get('/index', adminController.getProducts)
router.use('/', (req, res) => res.redirect('/admin/index'))

module.exports = router
