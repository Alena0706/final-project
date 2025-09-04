'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Franchise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Contract }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
      this.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });
    }
  }
  Franchise.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      workPhone: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      contractId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Franchise',
    },
  );
  return Franchise;
};
