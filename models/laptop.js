'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Laptop extends Model {
    static associate(models) {
      // This confirms the Laptop "belongs to" a User.
      Laptop.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner'
      });
    }
  }

  Laptop.init({
    name: { type: DataTypes.STRING, allowNull: false },
    rentalCostPerDay: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    collectionPlace: { type: DataTypes.STRING, allowNull: false },
    contactPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    proofRequired: { type: DataTypes.STRING, allowNull: false },
    securityDeposit: { type: DataTypes.FLOAT, allowNull: false },
    model: { type: DataTypes.STRING },
    ram: { type: DataTypes.STRING },
    rom: { type: DataTypes.STRING },
    processor: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Laptop',
    tableName: 'laptops'
  });

  return Laptop;
};