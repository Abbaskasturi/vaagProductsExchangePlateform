'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Calculator extends Model {
    static associate(models) {
      Calculator.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
    }
  }
  Calculator.init({
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
    modelName: 'Calculator',
    tableName: 'calculators' // <-- THIS LINE WAS MISSING
  });
  return Calculator;
};