'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Администратор',
          email: 'admin@test.com',
          hashpass: '$2b$10$M5bEGOq9CwqcW5Rp4OaIX.FxoOiIQ5LII7yQxu8udnwuPeWvIl7U.', // Password1!
          phone: '79001234567',
          city: 'Москва',
          avatar: null,
          secret: '',
          admin: true,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Тестовый Пользователь',
          email: 'user@test.com',
          hashpass: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          phone: '79031234567',
          city: 'Санкт-Петербург',
          avatar: null,
          secret: '',
          admin: false,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Иван Петров',
          email: 'ivan@example.com',
          hashpass: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          phone: '79045678901',
          city: 'Казань',
          avatar: null,
          secret: '',
          admin: false,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Documents',
      [
        {
          contract: 'documents/1/contract_1.pdf',
          receipt: 'documents/1/receipt_1.pdf',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          contract: 'documents/2/contract_2.pdf',
          receipt: 'documents/2/receipt_2.pdf',
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      'Franchises',
      [
        {
          name: 'Франшиза "Твой взгляд" - Пенза',
          address: 'ул. Московская 37, ТЦ "Высшая лига"',
          workPhone: '+7 (908) 520-98-86',
          userId: 1,
          image: 'imageFranchise/penza.webp',
          video: 'videoFranchise/penza.MP4',
          description: 'Описание франшизы в Пензе',
          city: 'г. Пенза',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Франшиза "Твой взгляд" - Саратов',
          address: '3-я дачная улица 1, ТЦ "Тау Галерея", 3 этаж',
          workPhone: '+7 (908) 520-98-86',
          userId: 2,
          image: 'imageFranchise/Saratov.webp',
          video: 'videoFranchise/saratov.mp4',
          description: '​Фотоателье радужки глаза',
          city: 'г. Саратов',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Франшиза "Твой взгляд" - Казань',
          address: 'Петербургская 9, ТЦ "Республика", 2 этаж',
          workPhone: '+7 (908) 520-98-86',
          userId: 2,
          image: 'imageFranchise/kazan.webp',
          video: 'videoFranchise/kazan.mp4',
          description: '​Фотоателье радужки глаза',
          city: 'г. Казань',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Франшиза "Твой взгляд" - Пермь',
          address: 'ул.Петропавловская улица, 73А, ТЦ "iMALL Эспланада", 3 этаж',
          workPhone: '+7 (908) 520-98-86',
          userId: 2,
          image: 'imageFranchise/perm.webp',
          video: 'videoFranchise/perm.mp4',
          description: '​Фотоателье радужки глаза',
          city: 'г. Пермь',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Франшиза "Твой взгляд" - Волгоград',
          address: 'ул. Землячки, 110Б, ТРЦ "Мармелад", 0 этаж, вход Б',
          workPhone: '+7 (908) 520-98-86',
          userId: 2,
          image: 'imageFranchise/volgograd.webp',
          video: 'videoFranchise/volgograd.mp4',
          description: '​Фотоателье радужки глаза',
          city: 'г. Волгоград',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Создаем кошельки для пользователей
    await queryInterface.bulkInsert(
      'Wallets',
      [
        {
          userId: 1,
          balance: 5000.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          balance: 2500.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          balance: 1000.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Создаем тестовые транзакции
    await queryInterface.bulkInsert(
      'Transactions',
      [
        {
          walletId: 1,
          amount: 5000.0,
          type: 'deposit',
          status: 'completed',
          description: 'Начальный баланс администратора',
          adminId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          walletId: 2,
          amount: 2500.0,
          type: 'deposit',
          status: 'completed',
          description: 'Начальный баланс пользователя',
          adminId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          walletId: 3,
          amount: 1000.0,
          type: 'deposit',
          status: 'completed',
          description: 'Начальный баланс пользователя',
          adminId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Создаем тестовые счета
    await queryInterface.bulkInsert(
      'Invoices',
      [
        {
          userId: 2,
          amount: 1500.0,
          description: 'Ежемесячная плата за франшизу',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // через неделю
          paidAt: null,
          createdBy: 1,
          isAutoGenerated: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          amount: 2000.0,
          description: 'Регистрационный взнос',
          status: 'paid',
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
          paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
          createdBy: 1,
          isAutoGenerated: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          amount: 800.0,
          description: 'Дополнительные услуги',
          status: 'overdue',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
          paidAt: null,
          createdBy: 1,
          isAutoGenerated: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Создаем тестовые платежи
    await queryInterface.bulkInsert(
      'Payments',
      [
        {
          invoiceId: 2,
          walletId: 3,
          amount: 2000.0,
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Создаем тестовые уведомления
    await queryInterface.bulkInsert(
      'Notifications',
      [
        {
          userId: 2,
          type: 'invoice_generated',
          title: 'Новый счет',
          message: `Вам выставлен новый счет на сумму 1500.00 ₽. Срок оплаты: ${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString('ru-RU')}`,
          isRead: false,
          sentAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          type: 'payment_received',
          title: 'Платеж проведен',
          message: 'Счет #2 на сумму 2000.00 ₽ успешно оплачен',
          isRead: true,
          sentAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          type: 'invoice_reminder',
          title: 'Напоминание о счете',
          message:
            'У вас есть просроченный счет #3 на сумму 800.00 ₽. Пожалуйста, оплатите его как можно скорее.',
          isRead: false,
          sentAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          type: 'manual',
          title: 'Добро пожаловать в админку',
          message:
            'Вы успешно вошли в систему как администратор. Теперь вы можете управлять счетами и уведомлениями.',
          isRead: true,
          sentAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('Invoices', null, {});
    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('Wallets', null, {});
    await queryInterface.bulkDelete('Franchises', null, {});
    await queryInterface.bulkDelete('Documents', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
