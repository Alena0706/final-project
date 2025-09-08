'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Wallet, User }) {
      this.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });
      this.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
    }
  }
  
  Transaction.init({
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['deposit', 'withdrawal', 'payment']]
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'completed', 'failed']]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions'
  });
  
  return Transaction;
};
