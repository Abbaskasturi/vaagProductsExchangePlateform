'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // All your User.hasMany() associations go here
      User.hasMany(models.Laptop, { foreignKey: 'userId' });
      User.hasMany(models.Bike, { foreignKey: 'userId' });
      // etc.
    }
  }
  User.init({
    // This is the corrected part
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isVaagdeviEmail(value) {
          if (!value.endsWith('@vaagdevi.edu.in')) {
            throw new Error('Only @vaagdevi.edu.in emails are allowed!');
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  return User;
};