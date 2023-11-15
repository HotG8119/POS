'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tables', {})
    const tables = []
    // 新增外帶
    tables.push({
      name: '外帶',
      created_at: new Date(),
      updated_at: new Date()
    })
    // 新增 10 個桌子
    for (let i = 1; i <= 10; i++) {
      tables.push({
        name: i,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Tables', tables)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tables', {})
  }
}
