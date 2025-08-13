'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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

    // Method to securely compare passwords during login
    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name field cannot be empty.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: 'Password must be at least 8 characters long.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user', // <-- IMPORTANT: Fixes the 'Users doesn't exist' error
    hooks: {
      // Hook to automatically hash the password before a user is created
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  
  return User;
};