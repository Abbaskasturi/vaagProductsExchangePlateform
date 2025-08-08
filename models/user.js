'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // ⚠️ THIS BLOCK IS THE CRITICAL UPDATE ⚠️
      // It tells Sequelize that one User can have many of each item.
      User.hasMany(models.Laptop, { foreignKey: 'userId', as: 'laptops' });
      User.hasMany(models.Bike, { foreignKey: 'userId', as: 'bikes' });
      User.hasMany(models.Camera, { foreignKey: 'userId', as: 'cameras' });
      User.hasMany(models.Calculator, { foreignKey: 'userId', as: 'calculators' });
      User.hasMany(models.Drafter, { foreignKey: 'userId', as: 'drafters' });
      User.hasMany(models.Gatebook, { foreignKey: 'userId', as: 'gatebooks' });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};