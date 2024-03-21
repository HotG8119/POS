/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'remark', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('Categories', 'rank', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'remark')
    await queryInterface.removeColumn('Categories', 'rank')
  }
}
