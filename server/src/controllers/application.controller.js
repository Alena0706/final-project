const { User, Notification } = require('../../db/models');
const { sendNotificationToAdmins } = require('../services/websocket.service');

class ApplicationController {
  // Отправка заявки
  static async submitApplication(req, res) {
    try {
      const { name, phone, email, city, message } = req.body;

      // Валидация обязательных полей
      if (!name || !phone || !email) {
        return res.status(400).json({
          success: false,
          message: 'Поля имя, телефон и email обязательны для заполнения'
        });
      }

      // Создаем уведомление для админов (без привязки к пользователю)
      const notification = await Notification.create({
        userId: 1, // Временное решение - используем ID 1 (админ)
        title: 'Новая заявка на франшизу',
        message: `Получена новая заявка от ${name} (${email}) из города ${city || 'не указан'}. Телефон: ${phone}. Сообщение: ${message || 'не указано'}`,
        type: 'franchise_application',
        isRead: false,
        sentAt: new Date()
      });

      // Отправляем уведомление всем админам через WebSocket
      await sendNotificationToAdmins(notification);

      console.log('✅ Заявка отправлена:', {
        name,
        email,
        phone,
        city,
        message: message?.substring(0, 50) + '...'
      });

      res.status(200).json({
        success: true,
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        data: {
          notificationId: notification.id
        }
      });

    } catch (error) {
      console.error('❌ Ошибка отправки заявки:', error);
      res.status(500).json({
        success: false,
        message: 'Произошла ошибка при отправке заявки. Попробуйте позже.'
      });
    }
  }
}

module.exports = ApplicationController;
