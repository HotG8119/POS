'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.belongsTo(models.Table, { foreignKey: 'tableId' })
    }
  }
  Order.init({
    cartItems: DataTypes.JSON,
    totalAmount: DataTypes.DECIMAL,
    paymentMethod: DataTypes.STRING,
    notes: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    completedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
