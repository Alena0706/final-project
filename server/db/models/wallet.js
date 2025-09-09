'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Transaction }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
      this.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });
    }
  }
  
  Wallet.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'Wallets'
  });
  
  return Wallet;
};
