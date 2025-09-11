'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Invoice, Wallet }) {
      this.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
      this.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });
    }
  }
  
  Payment.init({
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invoices',
        key: 'id'
      }
    },
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'completed', 'failed']]
      }
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments'
  });
  
  return Payment;
};

