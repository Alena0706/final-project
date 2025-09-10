'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
    }
  }
  Document.init(
    {
      contract: DataTypes.STRING, // Путь к файлу договора
      receipt: DataTypes.STRING,  // Путь к файлу платежных документов/чеков
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Document',
    },
  );
  return Document;
};
