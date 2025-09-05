'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'admin',
          email: 'admin@admin.com',
          hashpass: '$2a$10$a.AHZ99cmtM.iP9NzvjpK.jwMqkmg/uHv.vLWSMfRrw3E6jKyLHv2',
          phone: '78901234567',
          city: 'Moscow',
          avatar: null,
          secret: '',
          admin: true,
        },
        {
          name: 'Anna Petrova',
          email: 'anna@example.com',
          hashpass: 'hashedpass456',
          phone: '79031234567',
          city: 'Saint-Petersburg',
          avatar: null,
          secret: 'super-secret',
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Contracts',
      [
        {
          scan: 'scan1.pdf',
          userId: 1,
        },
        {
          scan: 'scan2.pdf',
          userId: 2,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      'Franchises',
      [
        {
          name: 'Franchise One',
          address: 'Red Square, 1',
          workPhone: '88001234567',
          userId: 1,
          contractId: 1,
        },
        {
          name: 'Franchise Two',
          address: 'Nevsky Prospekt, 98',
          workPhone: '88007654321',
          userId: 2,
          contractId: 2,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Contracts', null, {});
    await queryInterface.bulkDelete('Franchises', null, {});
  },
};
