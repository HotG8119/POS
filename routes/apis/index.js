const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
// const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/apis/user-controller')
const productController = require('../../controllers/apis/product-controller')

// router.post('/login', (req, res) => {
//   const { email, password } = req.body
//   console.log('req.body', req.body)
//   res.send('login', email, password)
// })

router.post('/login', passport.authenticate('local', { session: false }), userController.login)

router.get('/products', productController.getProducts)

module.exports = router
