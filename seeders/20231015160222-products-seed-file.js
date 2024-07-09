'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 找出所有的 category
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Products',
      Array.from({ length: 30 }).map((d, i) =>
        ({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          image: `https://loremflickr.com/320/240/food/?lock=${Math.floor(Math.random() * 100)}`,
          is_available: Math.random() > 0.1,
          created_at: new Date(),
          updated_at: new Date(),
          category_id: categories[Math.floor(Math.random() * categories.length)].id // 用隨機的方式取得一個 category id
        })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', {})
  }
}
