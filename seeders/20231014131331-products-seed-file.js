'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 30 }).map((d, i) =>
        ({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          image: `https://loremflickr.com/320/240/food/?lock=${Math.random() * 100}`,
          is_available: Math.random() > 0.1,
          created_at: new Date(),
          updated_at: new Date()
        })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', {})
  }
}
