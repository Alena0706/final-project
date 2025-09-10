'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Добавляем новые значения в существующий enum
    await queryInterface.sequelize.query('ALTER TYPE "enum_Messages_sender" ADD VALUE \'assistant\';');
    await queryInterface.sequelize.query('ALTER TYPE "enum_Messages_sender" ADD VALUE \'system\';');
  },

  async down (queryInterface, Sequelize) {
    // В PostgreSQL нельзя удалить значения из enum, поэтому просто оставляем как есть
    // Если нужно откатить, можно пересоздать enum
  }
};
