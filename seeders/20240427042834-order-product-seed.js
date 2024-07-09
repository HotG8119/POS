'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const orders = await queryInterface.sequelize.query('SELECT id,cart_items FROM Orders;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const products = await queryInterface.sequelize.query('SELECT id,price FROM Products;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const orderProducts = []
    for (const order of orders) {
      const cartItems = order.cart_items
      for (const cartItem of cartItems) {
        const product = products.find(product => product.id === cartItem.id)
        orderProducts.push({
          order_id: order.id,
          product_id: product.id,
          quantity: cartItem.quantity,
          created_at: new Date(),
          updated_at: new Date(),
          completed_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('OrderProducts', orderProducts)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderProducts', {})
  }
}
