'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gatebook extends Model {
    static associate(models) {
      Gatebook.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner'
      });
    }
  }
  Gatebook.init({
    name: { type: DataTypes.STRING, allowNull: false },
    rentalCostPerDay: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    collectionPlace: { type: DataTypes.STRING, allowNull: false },
    contactPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    proofRequired: { type: DataTypes.STRING, allowNull: false },
    securityDeposit: { type: DataTypes.FLOAT, allowNull: false },
    edition: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Gatebook',
  });
  return Gatebook;
};