const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Тестовые данные
let adminToken = '';
let userToken = '';
let userId = '';
let adminId = '';

async function testAPI() {
  console.log('🚀 Начинаем тестирование API...\n');

  try {
    // 1. Регистрация админа
    console.log('1. Регистрация админа...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = adminResponse.data.data.accessToken;
    adminId = adminResponse.data.data.user.id;
    console.log('✅ Админ зарегистрирован:', adminResponse.data.data.user.email);

    // 2. Регистрация обычного пользователя
    console.log('\n2. Регистрация пользователя...');
    const userResponse = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    });
    userToken = userResponse.data.data.accessToken;
    userId = userResponse.data.data.user.id;
    console.log('✅ Пользователь зарегистрирован:', userResponse.data.data.user.email);

    // 3. Тестирование кошелька
    console.log('\n3. Тестирование кошелька...');
    
    // Получить кошелек пользователя
    const walletResponse = await axios.get(`${BASE_URL}/wallet`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Кошелек получен, баланс:', walletResponse.data.data.balance);

    // Пополнить кошелек (админ)
    const topUpResponse = await axios.post(`${BASE_URL}/wallet/topup`, {
      userId: userId,
      amount: 1000,
      description: 'Тестовое пополнение'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Кошелек пополнен, новый баланс:', topUpResponse.data.data.balance);

    // 4. Тестирование счетов
    console.log('\n4. Тестирование счетов...');
    
    // Создать счет (админ)
    const invoiceResponse = await axios.post(`${BASE_URL}/invoices`, {
      userId: userId,
      amount: 500,
      description: 'Тестовый счет',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // через неделю
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const invoiceId = invoiceResponse.data.data.id;
    console.log('✅ Счет создан, ID:', invoiceId);

    // Получить счета пользователя
    const userInvoicesResponse = await axios.get(`${BASE_URL}/invoices/my`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Счета пользователя получены, количество:', userInvoicesResponse.data.data.invoices.length);

    // Оплатить счет
    const payResponse = await axios.post(`${BASE_URL}/invoices/${invoiceId}/pay`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Счет оплачен, новый баланс кошелька:', payResponse.data.data.wallet.balance);

    // 5. Тестирование уведомлений
    console.log('\n5. Тестирование уведомлений...');
    
    // Получить уведомления пользователя
    const notificationsResponse = await axios.get(`${BASE_URL}/notifications/my`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Уведомления получены, количество:', notificationsResponse.data.data.notifications.length);

    // Получить количество непрочитанных
    const unreadResponse = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Непрочитанных уведомлений:', unreadResponse.data.data.unreadCount);

    // Отправить уведомление пользователю (админ)
    const sendNotificationResponse = await axios.post(`${BASE_URL}/notifications/send`, {
      userId: userId,
      title: 'Тестовое уведомление',
      message: 'Это тестовое уведомление от администратора',
      sendEmail: false
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Уведомление отправлено пользователю');

    // 6. Получить все кошельки (админ)
    console.log('\n6. Админские функции...');
    const allWalletsResponse = await axios.get(`${BASE_URL}/wallet/all`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Все кошельки получены, количество:', allWalletsResponse.data.data.length);

    // Получить все счета (админ)
    const allInvoicesResponse = await axios.get(`${BASE_URL}/invoices/all`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Все счета получены, количество:', allInvoicesResponse.data.data.invoices.length);

    // Получить все уведомления (админ)
    const allNotificationsResponse = await axios.get(`${BASE_URL}/notifications/all`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Все уведомления получены, количество:', allNotificationsResponse.data.data.notifications.length);

    console.log('\n🎉 Все тесты прошли успешно!');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.response?.data || error.message);
  }
}

// Запускаем тесты
testAPI();
