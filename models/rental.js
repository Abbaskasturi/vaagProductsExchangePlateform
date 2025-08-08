'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    static associate(models) {
      Rental.belongsTo(models.User, { foreignKey: 'renterId', as: 'renter' });
    }
  }
  Rental.init({
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'rejected'),
      defaultValue: 'pending'
    },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    productCategory: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Rental',
  });
  return Rental;
};