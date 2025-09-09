'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Contract, Franchise, Wallet, Invoice, Notification}) {
      this.hasMany(Contract, {foreignKey: 'userId', as: 'treaty'})
      this.hasMany(Franchise, {foreignKey: 'userId', as: 'franchise'})
      this.hasOne(Wallet, {foreignKey: 'userId', as: 'wallet'})
      this.hasMany(Invoice, {foreignKey: 'userId', as: 'invoices'})
      this.hasMany(Invoice, {foreignKey: 'createdBy', as: 'createdInvoices'})
      this.hasMany(Notification, {foreignKey: 'userId', as: 'notifications'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    hashpass: DataTypes.STRING,
    phone: DataTypes.STRING,
    city: DataTypes.STRING,
    avatar: DataTypes.STRING,
    secret: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    balance: DataTypes.DECIMAL(10,2),
    transactions: DataTypes.JSONB,
    role: DataTypes.STRING,
    registrationDate: DataTypes.DATE,
    monthlyAmount: DataTypes.DECIMAL(10,2),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};