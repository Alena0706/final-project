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
    static associate({Contract, Franchise}) {
      this.hasMany(Contract, {foreignKey: 'userId', as: 'treaty'})
      this.hasMany(Franchise, {foreignKey: 'userId', as: 'franchise'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    hashpass: DataTypes.STRING,
    phone: DataTypes.STRING,
    city: DataTypes.STRING,
    avatar: DataTypes.STRING,
    secret: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};