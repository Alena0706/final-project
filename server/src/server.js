const app = require('./app');
const { Message } = require('../db/models');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const chatAIService = require('./services/chatAI.service');
const websocketService = require('./services/websocket.service');

const rooms = new Set();
const roomStates = new Map(); // Хранит состояние комнат (активен ли AI)

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ['http://localhost:5173', 'http://localhost:3000'], // адреса клиентов
    origin: '/', 
    methods: ['GET', 'POST'],
    credentials: true, // если используете куки или авторизацию
  },
});

// Инициализируем WebSocket сервис
websocketService.initializeWebSocket(io);

io.on('connection', (socket) => {
  console.log('Пользователь подключился', socket.id);

  // Обработчик для присоединения к персональной комнате уведомлений
  socket.on('joinNotificationRoom', (userId) => {
    const notificationRoom = `notifications_${userId}`;
    socket.join(notificationRoom);
    console.log(`🔔 Пользователь ${socket.id} присоединился к комнате уведомлений: ${notificationRoom}`);
    console.log(`🔔 Активные комнаты для сокета ${socket.id}:`, Array.from(socket.rooms));
  });

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    rooms.add(roomId);
    io.emit('roomList', Array.from(rooms)); // уведомить всех клиентов

    // Инициализируем состояние комнаты, если его нет
    if (!roomStates.has(roomId)) {
      roomStates.set(roomId, { aiActive: true, adminCalled: false });
    }

    console.log(`Пользователь ${socket.id} присоединился к комнате ${roomId}`);

    // Загрузка истории сообщений из БД для комнаты
    const messages = await Message.findAll({
      where: { roomId },
      order: [['createdAt', 'ASC']],
      limit: 50,
    });

    socket.emit('chatHistory', messages);
  });

  socket.on('chatMessage', async ({ roomId, sender, message }) => {
    console.log(`📨 Получено сообщение: roomId=${roomId}, sender=${sender}, message="${message}"`);
    
    // Сохраняем сообщение пользователя в БД
    const newMessage = await Message.create({
      roomId,
      sender,
      message,
    });

    console.log(`📤 Отправляем сообщение в комнату ${roomId} всем участникам`);
    // Отправляем сообщение пользователя
    io.to(roomId).emit('chatMessage', newMessage);

    // Получаем состояние комнаты
    const roomState = roomStates.get(roomId) || { aiActive: true, adminCalled: false };

    // Проверяем, зовет ли пользователь админа
    const adminCallKeywords = [
      'админ',
      'администратор',
      'помощь',
      'поддержка',
      'человек',
      'оператор',
    ];
    const isAdminCall = adminCallKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (isAdminCall && sender === 'user') {
      // Пользователь зовет админа - останавливаем AI
      roomState.aiActive = false;
      roomState.adminCalled = true;
      roomStates.set(roomId, roomState);

      // Отправляем уведомление о том, что админ вызван
      const adminCallMessage = await Message.create({
        roomId,
        sender: 'system',
        message: 'Администратор уведомлен. AI-помощник временно отключен.',
      });
      io.to(roomId).emit('chatMessage', adminCallMessage);

      console.log(`Админ вызван в комнате ${roomId}`);
      return;
    }

    // Проверяем, хочет ли админ возобновить AI специальной командой
    if (sender === 'admin' && roomState.adminCalled) {
      const resumeKeywords = [
        'включить ai',
        'включить ai-помощник',
        'возобновить ai',
        'ai включить',
        'ai возобновить',
        'до свидания',
        'до свидания!',
        'до свидания.',
      ];
      const isResumeCommand = resumeKeywords.some((keyword) =>
        message.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (isResumeCommand) {
        roomState.aiActive = true;
        roomState.adminCalled = false;
        roomStates.set(roomId, roomState);

        const resumeMessage = await Message.create({
          roomId,
          sender: 'system',
          message: 'AI-помощник возобновлен по команде администратора.',
        });
        io.to(roomId).emit('chatMessage', resumeMessage);
      }
    }

    // Если AI активен и это сообщение от пользователя (не от админа)
    if (roomState.aiActive && sender === 'user') {
      try {
        const aiResponse = await chatAIService.ask(message);
        const newAIMessage = await Message.create({
          roomId,
          sender: aiResponse.role,
          message: aiResponse.content,
        });

        // Отправляем ответ AI
        io.to(roomId).emit('chatMessage', newAIMessage);
      } catch (error) {
        console.error('Ошибка AI:', error);
        const errorMessage = await Message.create({
          roomId,
          sender: 'system',
          message: 'Извините, произошла ошибка при обработке запроса.',
        });
        io.to(roomId).emit('chatMessage', errorMessage);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился', socket.id);
  });

  socket.on('getRooms', () => {
    socket.emit('roomList', Array.from(rooms));
  });

  // Обработчик для возобновления работы AI
  socket.on('resumeAI', async (roomId) => {
    const roomState = roomStates.get(roomId);
    if (roomState) {
      roomState.aiActive = true;
      roomState.adminCalled = false;
      roomStates.set(roomId, roomState);
      
      // Отправляем системное сообщение о возобновлении AI
      const resumeMessage = await Message.create({
        roomId,
        sender: 'system',
        message: 'AI-помощник возобновлен по команде администратора.',
      });
      io.to(roomId).emit('chatMessage', resumeMessage);
      
      console.log(`AI возобновлен в комнате ${roomId}`);
    }
  });
});

server.listen(PORT, () => {
  console.log('Server has started on port', PORT);
});
