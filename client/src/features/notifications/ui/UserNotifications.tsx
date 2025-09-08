import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, fetchUnreadCount } from '@/entities/notification/model/thunks';
import type { Notification } from '@/entities/notification/api/notificationService';

const UserNotifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading, error, pagination } = useAppSelector((state) => state.notification);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReadFilter, setIsReadFilter] = useState<string>('');

  useEffect(() => {
    dispatch(fetchUserNotifications({ page: currentPage, isRead: isReadFilter ? isReadFilter === 'true' : undefined }));
    dispatch(fetchUnreadCount());
  }, [dispatch, currentPage, isReadFilter]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
      dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Ошибка отметки всех уведомлений:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      dispatch(fetchUnreadCount());
    } catch (error) {
      console.error('Ошибка удаления уведомления:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice_generated':
        return '📄';
      case 'payment_received':
        return '✅';
      case 'invoice_reminder':
        return '⏰';
      case 'payment_reminder':
        return '💳';
      case 'manual':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice_generated':
        return 'bg-blue-100 text-blue-800';
      case 'payment_received':
        return 'bg-green-100 text-green-800';
      case 'invoice_reminder':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_reminder':
        return 'bg-orange-100 text-orange-800';
      case 'manual':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gradient-primary">Уведомления</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <select
            value={isReadFilter}
            onChange={(e) => setIsReadFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Все уведомления</option>
            <option value="false">Непрочитанные</option>
            <option value="true">Прочитанные</option>
          </select>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Отметить все как прочитанные
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Уведомлений пока нет</h3>
          <p className="text-gray-500">Когда появятся новые уведомления, они будут отображаться здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
                !notification.isRead ? 'border-primary border-l-4' : 'border-border'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-gray-600 mb-3 ${!notification.isRead ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(notification.sentAt || notification.createdAt)}</span>
                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          Отметить как прочитанное
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Назад
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Страница {currentPage} из {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
            disabled={currentPage === pagination.pages}
            className="px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
