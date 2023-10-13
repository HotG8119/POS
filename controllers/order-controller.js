const orderController = {
  getProducts: (req, res) => {
    console.log(res)
    res.render('products')
  }
}

module.exports = orderController
