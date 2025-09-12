const { User } = require('./server/db/models');

async function checkAdmins() {
  try {
    console.log('🔍 Проверяем админов в базе данных...');
    
    const admins = await User.findAll({
      where: { admin: true },
      attributes: ['id', 'name', 'email', 'admin']
    });
    
    console.log(`👥 Найдено ${admins.length} админов:`);
    admins.forEach(admin => {
      console.log(`  - ID: ${admin.id}, Имя: ${admin.name}, Email: ${admin.email}, Admin: ${admin.admin}`);
    });
    
    if (admins.length === 0) {
      console.log('❌ Админов не найдено! Нужно создать админа.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

checkAdmins();
