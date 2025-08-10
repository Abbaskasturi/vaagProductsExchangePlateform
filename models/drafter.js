'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Drafter extends Model {
    static associate(models) {
      Drafter.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner'
      });
    }
  }
  Drafter.init({
    // ... all your fields are correct
    name: { type: DataTypes.STRING, allowNull: false },
    rentalCostPerDay: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    collectionPlace: { type: DataTypes.STRING, allowNull: false },
    contactPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    proofRequired: { type: DataTypes.STRING, allowNull: false },
    securityDeposit: { type: DataTypes.FLOAT, allowNull: false },
    model: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Drafter',
    tableName: 'drafters' // <-- THIS LINE WAS MISSING
  });
  return Drafter;
};