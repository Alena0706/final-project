'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Franchise }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
      this.hasMany(Franchise, { foreignKey: 'contractId', as: 'franchises' });
    }
  }
  Contract.init(
    {
      scan: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Contract',
    },
  );
  return Contract;
};
