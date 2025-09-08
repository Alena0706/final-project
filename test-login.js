const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Тестирование входа в систему...\n');

    // Входим как админ
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

    // Сохраняем cookies
    const cookies = loginResponse.headers['set-cookie'];
    console.log('🍪 Cookies:', cookies);

    // Проверяем refresh
    console.log('\n🔄 Проверка refresh...');
    const refreshResponse = await axios.get('http://localhost:3001/api/auth/refresh', {
      withCredentials: true,
      headers: {
        Cookie: cookies?.join('; ')
      }
    });

    console.log('✅ Refresh работает');
    console.log('📊 Данные после refresh:', {
      id: refreshResponse.data.user.id,
      name: refreshResponse.data.user.name,
      email: refreshResponse.data.user.email,
      admin: refreshResponse.data.user.admin,
      role: refreshResponse.data.user.role
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

testLogin();
