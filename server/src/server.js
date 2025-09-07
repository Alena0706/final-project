const app = require('./app');
const { Message } = require('../db/models');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server,  {cors: {
    origin: "http://localhost:5173", // адрес вашего React клиента
    methods: ["GET", "POST"],
    credentials: true, // если используете куки или авторизацию
  }});

io.on('connection', (socket) => {
  console.log('Пользователь подключился', socket.id);

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
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
    // Сохраняем в БД
    const newMessage = await Message.create({
      roomId,
      sender,
      message,
    });

    // Отправляем всем участникам комнаты
    io.to(roomId).emit('chatMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился', socket.id);
  });
});

server.listen(PORT, () => {
  console.log('Server has started on port', PORT);
});
