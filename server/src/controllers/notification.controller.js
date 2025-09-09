const { Notification, User } = require('../../db/models');
const emailService = require('../services/email.service');

class NotificationController {
  // Получить уведомления пользователя
  static async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, isRead, type } = req.query;
      
      const whereClause = { userId };
      if (isRead !== undefined) {
        whereClause.isRead = isRead === 'true';
      }
      if (type) {
        whereClause.type = type;
      }
      
      const offset = (page - 1) * limit;
      
      const { count, rows: notifications } = await Notification.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });
      
      res.json({
        success: true,
        data: {
          notifications: notifications.map(notification => ({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            sentAt: notification.sentAt,
            createdAt: notification.createdAt
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get user notifications error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Получить все уведомления (только админ)
  static async getAllNotifications(req, res) {
    try {
      const { page = 1, limit = 20, userId, type, isRead } = req.query;
      
      const whereClause = {};
      if (userId) whereClause.userId = userId;
      if (type) whereClause.type = type;
      if (isRead !== undefined) whereClause.isRead = isRead === 'true';
      
      const offset = (page - 1) * limit;
      
      const { count, rows: notifications } = await Notification.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'role']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });
      
      res.json({
        success: true,
        data: {
          notifications: notifications.map(notification => ({
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            sentAt: notification.sentAt,
            createdAt: notification.createdAt,
            user: notification.user
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all notifications error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Отметить уведомление как прочитанное
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;
      
      const notification = await Notification.findOne({
        where: { 
          id: notificationId,
          userId 
        }
      });
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Уведомление не найдено'
        });
      }
      
      await notification.update({ isRead: true });
      
      res.json({
        success: true,
        data: {
          id: notification.id,
          isRead: true,
          updatedAt: notification.updatedAt
        }
      });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Отметить все уведомления как прочитанные
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      
      await Notification.update(
        { isRead: true },
        { 
          where: { 
            userId,
            isRead: false 
          } 
        }
      );
      
      res.json({
        success: true,
        message: 'Все уведомления отмечены как прочитанные'
      });
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Удалить уведомление
  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;
      
      const notification = await Notification.findOne({
        where: { 
          id: notificationId,
          userId 
        }
      });
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Уведомление не найдено'
        });
      }
      
      await notification.destroy();
      
      res.json({
        success: true,
        message: 'Уведомление удалено'
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Получить количество непрочитанных уведомлений
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      
      const count = await Notification.count({
        where: { 
          userId,
          isRead: false 
        }
      });
      
      res.json({
        success: true,
        data: {
          unreadCount: count
        }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Создать уведомление (внутренний метод)
  static async createNotification(userId, type, title, message, sendEmail = false) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        sentAt: new Date()
      });

      // Отправляем email если требуется
      if (sendEmail) {
        const user = await User.findByPk(userId);
        if (user && user.email) {
          try {
            await emailService.sendNotificationEmail(user.email, user.name, title, message);
          } catch (emailError) {
            console.error('Error sending notification email:', emailError);
            // Не прерываем выполнение, если email не отправился
          }
        }
      }

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Отправить уведомление всем пользователям (только админ)
  static async sendBroadcastNotification(req, res) {
    try {
      const { title, message, userType = 'all' } = req.body;
      
      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: 'title и message обязательны'
        });
      }
      
      let whereClause = {};
      if (userType !== 'all') {
        whereClause.role = userType;
      }
      
      const users = await User.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'email']
      });
      
      const notifications = [];
      
      for (const user of users) {
        try {
          const notification = await Notification.create({
            userId: user.id,
            type: 'manual',
            title,
            message,
            sentAt: new Date()
          });
          
          // Отправляем email
          if (user.email) {
            try {
              await emailService.sendNotificationEmail(user.email, user.name, title, message);
            } catch (emailError) {
              console.error(`Error sending email to ${user.email}:`, emailError);
            }
          }
          
          notifications.push(notification);
        } catch (error) {
          console.error(`Error creating notification for user ${user.id}:`, error);
        }
      }
      
      res.json({
        success: true,
        data: {
          sentCount: notifications.length,
          totalUsers: users.length,
          message: `Уведомление отправлено ${notifications.length} пользователям`
        }
      });
    } catch (error) {
      console.error('Send broadcast notification error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Отправить уведомление конкретному пользователю (только админ)
  static async sendUserNotification(req, res) {
    try {
      const { userId, title, message, sendEmail = false } = req.body;
      
      if (!userId || !title || !message) {
        return res.status(400).json({
          success: false,
          message: 'userId, title и message обязательны'
        });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }
      
      const notification = await Notification.create({
        userId,
        type: 'manual',
        title,
        message,
        sentAt: new Date()
      });
      
      // Отправляем email если требуется
      if (sendEmail && user.email) {
        try {
          await emailService.sendNotificationEmail(user.email, user.name, title, message);
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
        }
      }
      
      res.json({
        success: true,
        data: {
          notification: {
            id: notification.id,
            userId: notification.userId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            sentAt: notification.sentAt
          },
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      console.error('Send user notification error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }
}

module.exports = NotificationController;
