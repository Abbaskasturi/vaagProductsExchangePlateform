'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bike extends Model {
    static associate(models) {
      Bike.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner'
      });
    }
  }
  Bike.init({
    name: { type: DataTypes.STRING, allowNull: false },
    rentalCostPerDay: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    collectionPlace: { type: DataTypes.STRING, allowNull: false },
    contactPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    proofRequired: { type: DataTypes.STRING, allowNull: false },
    securityDeposit: { type: DataTypes.FLOAT, allowNull: false },
    condition: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    onRoadSpeed: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Bike',
  });
  return Bike;
};