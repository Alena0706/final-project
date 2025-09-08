const NotificationController = require('../controllers/notification.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const { requireAdmin } = require('../middlewares/checkRole');

const notificationRouter = require('express').Router();

// Получить уведомления пользователя
notificationRouter.get('/my', verifyAccessToken, NotificationController.getUserNotifications);

// Получить все уведомления (только админ)
notificationRouter.get('/all', verifyAccessToken, requireAdmin, NotificationController.getAllNotifications);

// Получить количество непрочитанных уведомлений
notificationRouter.get('/unread-count', verifyAccessToken, NotificationController.getUnreadCount);

// Отметить уведомление как прочитанное
notificationRouter.patch('/:notificationId/read', verifyAccessToken, NotificationController.markAsRead);

// Отметить все уведомления как прочитанные
notificationRouter.patch('/mark-all-read', verifyAccessToken, NotificationController.markAllAsRead);

// Удалить уведомление
notificationRouter.delete('/:notificationId', verifyAccessToken, NotificationController.deleteNotification);

// Отправить уведомление всем пользователям (только админ)
notificationRouter.post('/broadcast', verifyAccessToken, requireAdmin, NotificationController.sendBroadcastNotification);

// Отправить уведомление конкретному пользователю (только админ)
notificationRouter.post('/send', verifyAccessToken, requireAdmin, NotificationController.sendUserNotification);

module.exports = notificationRouter;
