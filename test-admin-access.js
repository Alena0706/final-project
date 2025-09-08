const axios = require('axios');

async function testAdminAccess() {
  try {
    console.log('🔍 Тестирование доступа к админке...\n');

    // 1. Входим как админ
    console.log('1. Вход как администратор...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/signin', {
      email: 'admin@test.com',
      password: 'password'
    }, {
      withCredentials: true
    });

    console.log('✅ Успешный вход');
    console.log('📊 Данные пользователя:', {
      id: loginResponse.data.user.id,
      name: loginResponse.data.user.name,
      email: loginResponse.data.user.email,
      admin: loginResponse.data.user.admin,
      role: loginResponse.data.user.role
    });

    // 2. Проверяем refresh токен
    console.log('\n2. Проверка refresh токена...');
    const refreshResponse = await axios.get('http://localhost:3001/api/auth/refresh', {
      withCredentials: true,
      headers: {
        Cookie: loginResponse.headers['set-cookie']?.join('; ')
      }
    });

    console.log('✅ Refresh токен работает');
    console.log('📊 Данные после refresh:', {
      id: refreshResponse.data.user.id,
      name: refreshResponse.data.user.name,
      email: refreshResponse.data.user.email,
      admin: refreshResponse.data.user.admin,
      role: refreshResponse.data.user.role
    });

    // 3. Проверяем доступ к админским эндпоинтам
    console.log('\n3. Проверка доступа к админским эндпоинтам...');
    
    const accessToken = refreshResponse.data.accessToken;
    
    // Проверяем получение всех пользователей
    const usersResponse = await axios.get('http://localhost:3001/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Доступ к списку пользователей разрешен');
    console.log('📊 Количество пользователей:', usersResponse.data.data.length);

    // Проверяем получение всех счетов
    const invoicesResponse = await axios.get('http://localhost:3001/api/invoices/all', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Доступ к списку счетов разрешен');
    console.log('📊 Количество счетов:', invoicesResponse.data.data.invoices.length);

    console.log('\n🎉 Все тесты пройдены успешно! Админка доступна.');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.response?.data || error.message);
  }
}

testAdminAccess();
