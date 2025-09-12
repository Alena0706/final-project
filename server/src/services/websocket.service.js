// WebSocket сервис для отправки уведомлений
const { User } = require('../../db/models');

let io = null;

// Инициализация WebSocket сервера
const initializeWebSocket = (socketIO) => {
  io = socketIO;
};

// Функция для отправки уведомления пользователю через WebSocket
const sendNotificationToUser = (userId, notification) => {
  if (!io) {
    console.log('❌ WebSocket не инициализирован');
    return;
  }

  const notificationRoom = `notifications_${userId}`;
  console.log(`📤 Отправляем уведомление в комнату: ${notificationRoom}`);
  console.log(`📤 Уведомление:`, notification);
  
  try {
    // Проверяем, есть ли кто-то в этой комнате
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(notificationRoom);
    if (room) {
      console.log(`✅ В комнате ${notificationRoom} находится ${room.size} сокетов`);
      io.to(notificationRoom).emit('newNotification', notification);
      console.log(`📡 Уведомление отправлено в комнату ${notificationRoom}`);
    } else {
      console.log(`❌ Комната ${notificationRoom} пуста - пользователь не подключен к WebSocket`);
      console.log(`❌ Доступные комнаты:`, Array.from(rooms.keys()));
    }
  } catch (error) {
    console.error(`❌ Ошибка отправки WebSocket уведомления в комнату ${notificationRoom}:`, error);
  }
};

// Функция для отправки уведомления всем админам
const sendNotificationToAdmins = async (notification) => {
  if (!io) {
    console.log('❌ WebSocket не инициализирован');
    return;
  }

  try {
    // Находим всех админов
    const admins = await User.findAll({
      where: { admin: true },
      attributes: ['id']
    });

    console.log(`📢 Найдено ${admins.length} админов для отправки уведомления:`, admins.map(a => a.id));

    // Проверяем, какие комнаты активны
    const rooms = io.sockets.adapter.rooms;
    console.log('🔍 Активные комнаты уведомлений:', Array.from(rooms.keys()).filter(room => room.startsWith('notifications_')));

    // Отправляем уведомление каждому админу
    admins.forEach(admin => {
      try {
        const notificationRoom = `notifications_${admin.id}`;
        console.log(`📤 Отправляем уведомление в комнату: ${notificationRoom}`);
        
        // Проверяем, есть ли кто-то в этой комнате
        const room = rooms.get(notificationRoom);
        if (room) {
          console.log(`✅ В комнате ${notificationRoom} находится ${room.size} сокетов`);
          io.to(notificationRoom).emit('newNotification', notification);
          console.log(`📡 Уведомление отправлено в комнату ${notificationRoom}`);
        } else {
          console.log(`❌ Комната ${notificationRoom} пуста - админ не подключен к WebSocket`);
        }
      } catch (adminError) {
        console.error(`❌ Ошибка отправки уведомления админу ${admin.id}:`, adminError);
      }
    });
  } catch (error) {
    console.error('Error sending notification to admins:', error);
  }
};

module.exports = {
  initializeWebSocket,
  sendNotificationToUser,
  sendNotificationToAdmins
};
