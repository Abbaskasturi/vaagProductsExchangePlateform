'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Camera extends Model {
    static associate(models) {
      Camera.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner'
      });
    }
  }
  Camera.init({
    // ... all your fields are correct
    name: { type: DataTypes.STRING, allowNull: false },
    rentalCostPerDay: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    collectionPlace: { type: DataTypes.STRING, allowNull: false },
    contactPhoneNumber: { type: DataTypes.STRING, allowNull: false },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    proofRequired: { type: DataTypes.STRING, allowNull: false },
    securityDeposit: { type: DataTypes.FLOAT, allowNull: false },
    model: { type: DataTypes.STRING },
    storage: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Camera',
    tableName: 'cameras' // <-- THIS LINE WAS MISSING
  });
  return Camera;
};