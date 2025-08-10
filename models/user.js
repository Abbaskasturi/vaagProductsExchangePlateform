'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Defines that a User can have many of each item
      User.hasMany(models.Laptop, { foreignKey: 'userId', as: 'laptops' });
      User.hasMany(models.Bike, { foreignKey: 'userId', as: 'bikes' });
      User.hasMany(models.Camera, { foreignKey: 'userId', as: 'cameras' });
      User.hasMany(models.Calculator, { foreignKey: 'userId', as: 'calculators' });
      User.hasMany(models.Drafter, { foreignKey: 'userId', as: 'drafters' });
      User.hasMany(models.Gatebook, { foreignKey: 'userId', as: 'gatebooks' });
      User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
      User.hasMany(models.Rental, { foreignKey: 'renterId', as: 'rentals' });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
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