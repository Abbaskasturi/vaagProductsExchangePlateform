'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Each notification is for one specific user
      Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'recipient' });
    }
  }
  Notification.init({
    message: { type: DataTypes.STRING, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    link: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};