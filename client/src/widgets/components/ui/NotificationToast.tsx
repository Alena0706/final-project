import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { addNotification } from '@/entities/notification/model/thunks';
import { io } from 'socket.io-client';

interface ToastNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

const NotificationToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((store) => store.user.user?.user.id);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [removingToasts, setRemovingToasts] = useState<Set<number>>(new Set());

  // WebSocket подключение для уведомлений в реальном времени
  useEffect(() => {
    if (!userId) return;

    const socket = io('/', { autoConnect: true, transports: ['websocket'] });

    socket.on('connect', () => {
      // Присоединяемся к персональной комнате уведомлений
      socket.emit('joinNotificationRoom', userId);
    });

    socket.on('newNotification', (notification) => {
      // Добавляем уведомление в Redux store
      dispatch(addNotification(notification));
      
      // Добавляем в список toast'ов
      const toastNotification: ToastNotification = {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt
      };
      
      setToasts(prev => [...prev, toastNotification]);
      
      // Автоматически убираем toast через 5 секунд
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== notification.id));
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);

  const removeToast = (id: number) => {
    setRemovingToasts(prev => new Set([...prev, id]));
    
    // Убираем из списка после анимации
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      setRemovingToasts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return '💳';
      case 'invoice':
        return '📄';
      case 'system':
        return '🔔';
      case 'manual':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'border-green-500/30 bg-green-500/10';
      case 'invoice':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'system':
        return 'border-purple-500/30 bg-purple-500/10';
      case 'manual':
        return 'border-orange-500/30 bg-orange-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => {
        const isRemoving = removingToasts.has(toast.id);
        return (
          <div
            key={toast.id}
            className={`
              dark-glass border backdrop-blur-md rounded-xl p-4 shadow-2xl
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-3xl
              ${isRemoving ? 'animate-out slide-out-to-left-2 fade-out-0' : 'animate-in slide-in-from-left-2 fade-in-0 zoom-in-95'}
              ${getTypeColor(toast.type)}
            `}
            style={{
              animation: isRemoving 
                ? 'slideOutLeft 0.3s ease-in' 
                : 'slideInLeft 0.5s ease-out, fadeIn 0.5s ease-out'
            }}
          >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 text-xl">
              {getTypeIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground truncate">
                {toast.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {toast.message}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {new Date(toast.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;
