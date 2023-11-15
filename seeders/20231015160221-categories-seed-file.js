'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
    await queryInterface.bulkInsert('Categories',
      ['生魚片', '壽司', '生魚片蓋飯', '烤物', '湯、麵', 'Pizza', '飲料', '甜點', '其他']
        .map((item, index) => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
