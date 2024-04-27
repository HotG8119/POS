'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      OrderProduct.belongsTo(models.Order, { foreignKey: 'OrderId' })
      OrderProduct.belongsTo(models.Product, { foreignKey: 'ProductId' })
    }
  }
  OrderProduct.init({
    quantity: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    completedAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'preparing',
      validate: {
        isIn: [['preparing', 'completed', 'cancelled']]
      }
    }
  }, {
    sequelize,
    modelName: 'OrderProduct',
    tableName: 'OrderProducts',
    underscored: true,
    timestamps: true
  })
  return OrderProduct
}
