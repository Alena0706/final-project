import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import {
  fetchUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  fetchUnreadCount,
  addNotification,
} from '@/entities/notification/model/thunks';
import { io } from 'socket.io-client';

export default function NotificationBell(): React.JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState<Set<number>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { notifications, unreadCount, loading, error } = useAppSelector(
    (state) => state.notification,
  );
  const userId = useAppSelector((store) => store.user.user?.user.id);


  // WebSocket подключение для уведомлений в реальном времени
  useEffect(() => {
    if (!userId) {
      console.log('❌ userId не найден, пропускаем WebSocket подключение');
      return;
    }

    console.log(`🔌 Подключаемся к WebSocket для пользователя ${userId}`);
    const socket = io('/', { autoConnect: true, transports: ['websocket'] });

    socket.on('connect', () => {
      console.log(`✅ WebSocket подключен для пользователя ${userId}`);
      // Присоединяемся к персональной комнате уведомлений
      socket.emit('joinNotificationRoom', userId);
      console.log(`🏠 Присоединились к комнате уведомлений для пользователя ${userId}`);
    });

    socket.on('newNotification', (notification) => {
      console.log(`🔔 Получено уведомление для пользователя ${userId}:`, notification);
      // Добавляем уведомление в Redux store
      dispatch(addNotification(notification));
      
      // Добавляем в список новых уведомлений для анимации
      setNewNotifications(prev => new Set([...prev, notification.id]));
      
      // Убираем из списка новых через 3 секунды
      setTimeout(() => {
        setNewNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notification.id);
          return newSet;
        });
      }, 3000);
    });

    socket.on('disconnect', () => {
      console.log(`❌ WebSocket отключен для пользователя ${userId}`);
    });

    return () => {
      console.log(`🔌 Отключаем WebSocket для пользователя ${userId}`);
      socket.disconnect();
    };
  }, [userId]); // Убираем dispatch и unreadCount из зависимостей

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Загружаем счетчик непрочитанных при инициализации
  useEffect(() => {
    if (userId) {
      console.log('📊 Загружаем счетчик непрочитанных уведомлений...');
      dispatch(fetchUnreadCount()).catch((error) => {
        // Игнорируем ошибки загрузки количества уведомлений, так как они не критичны
        if (!error?.message?.includes('количества уведомлений')) {
          console.error('Ошибка загрузки уведомлений:', error);
        }
      });
    }
  }, [userId]); // Убираем dispatch из зависимостей

  // Загружаем уведомления при открытии dropdown
  useEffect(() => {
    if (isDropdownOpen) {
      console.log('📋 Загружаем уведомления для dropdown...');
      dispatch(fetchUserNotifications({ page: 1, limit: 10 }));
    }
  }, [isDropdownOpen]); // Убираем dispatch из зависимостей

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

  const handleNotificationClick = (notification: any) => {
    // Закрываем dropdown
    setIsDropdownOpen(false);
    
    // Отмечаем как прочитанное, если не прочитано
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
    
    // Определяем, куда перейти в зависимости от типа уведомления
    if (notification.type.includes('invoice') || notification.type.includes('payment')) {
      // Для счетов и платежей переходим в профиль/счета
      navigate('/profile/invoices');
    } else {
      // Для всех остальных уведомлений (включая заявки) переходим в профиль/уведомления
      navigate('/profile/notifications');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice_reminder':
        return '📄';
      case 'payment_reminder':
        return '💰';
      case 'invoice_generated':
        return '📋';
      case 'payment_received':
        return '✅';
      case 'manual':
        return '📢';
      case 'franchise_application':
        return '📝';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Только что';
    } else if (diffInHours < 24) {
      return `${diffInHours}ч назад`;
    } else if (diffInHours < 48) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка колокольчика */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 text-muted-foreground hover:text-[hsl(200_80%_70%)] transition-all duration-300 rounded-lg hover:bg-[hsl(200_80%_70%)]/5"
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Выпадающее окно уведомлений */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 dark-glass rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Уведомления</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-muted-foreground hover:text-[hsl(200_80%_70%)] transition-colors"
                  >
                    Отметить все как прочитанные
                  </button>
                )}
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Список уведомлений */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Загрузка...
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Нет уведомлений</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const isNew = newNotifications.has(notification.id);
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-[hsl(200_80%_70%)]/20 ${
                          notification.isRead
                            ? 'bg-muted/30 border-white/10'
                            : 'bg-[hsl(200_80%_70%)]/10 border-[hsl(200_80%_70%)]/30'
                        } ${
                          isNew ? 'animate-pulse bg-[hsl(200_80%_70%)]/20 border-[hsl(200_80%_70%)]/50' : ''
                        }`}
                      >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="p-1 text-muted-foreground hover:text-[hsl(200_80%_70%)] transition-colors"
                                  title="Отметить как прочитанное"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                                className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                                title="Удалить"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            {formatDate(notification.sentAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Футер */}
            {notifications.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    // Переход на страницу всех уведомлений
                    window.location.href = '/profile/notifications';
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-center text-sm text-[hsl(200_80%_70%)] hover:text-[hsl(200_80%_60%)] transition-colors"
                >
                  Показать все уведомления
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
