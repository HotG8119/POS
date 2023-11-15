'use strict'

/** @type {import('sequelize-cli').Migration} */

const faker = require('faker')
const dayjs = require('dayjs')

function randomCartItem (products, qtyMax = 1) {
  const qty = Math.floor(Math.random() * qtyMax) + 1
  const cartItems = []
  let totalAmount = 0

  for (let i = 0; i < qty; i++) {
    const randomProductNum = Math.floor(Math.random() * products.length)
    const product = products[randomProductNum]
    const quantity = Math.floor(Math.random() * 3) + 1

    totalAmount += quantity * product.price
    cartItems.push({
      id: product.id,
      quantity
    })
  }

  return {
    cartItems,
    totalAmount
  }
}

function randomPaymentMethod () {
  if (Math.random() > 0.7) {
    return 'cash'
  } else {
    return 'linepay'
  }
}

function randomPastDate () {
  const now = dayjs()
  const randomDays = Math.floor(Math.random() * 30)
  const past = now.subtract(randomDays, 'day')
  const randomTime = faker.date.between(past.subtract(1, 'month').toDate(), past.toDate())
  return randomTime
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query('SELECT id,price FROM Products;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tables = await queryInterface.sequelize.query('SELECT id FROM Tables;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const orders = []

    // 新增200筆歷史訂單
    for (let i = 0; i < 200; i++) {
      const date = randomPastDate()
      const { cartItems, totalAmount } = randomCartItem(products, 3)

      orders.push({
        cart_items: JSON.stringify(cartItems),
        total_amount: totalAmount,
        table_id: tables[Math.floor(Math.random() * tables.length)].id,
        payment_method: randomPaymentMethod(),
        created_at: date,
        completed_at: dayjs(date).add(1, 'hour').toDate(),
        paid_at: dayjs(date).add(2, 'hour').toDate(),
        updated_at: dayjs(date).add(2, 'hour').toDate()
      })
    }

    await queryInterface.bulkInsert('Orders', orders)
    console.log('Orders seed file done!')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', {})
  }
}
