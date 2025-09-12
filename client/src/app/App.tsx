import React, { useEffect } from 'react';

import AppRouter from './router/AppRouter';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { refreshUser } from '@/entities/auth/model/thunks';
import { fetchWallet } from '@/entities/wallet/model/thunks';
import { initialize2FAStatus } from '@/entities/2fa/model/thunks';
import { clearMessages } from '@/entities/chat/model/slice';
import { fetchUserNotifications, fetchUnreadCount } from '@/entities/notification/model/thunks';

function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage или пользователь в localStorage
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    void dispatch(refreshUser());
  }, [dispatch]);

  // Загружаем кошелек, уведомления и инициализируем 2FA статус после успешной авторизации
  useEffect(() => {
    if (userStatus === 'logged') {
      console.log('🔄 Загружаем данные пользователя...');
      void dispatch(fetchWallet());
      void dispatch(fetchUserNotifications({ page: 1, limit: 20 }));
      void dispatch(fetchUnreadCount());

      // Инициализируем статус 2FA на основе данных пользователя
      const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
      if (userData?.user?.secret) {
        void dispatch(initialize2FAStatus({ secret: userData.user.secret }));
      }
    } else if (userStatus === 'guest') {
      // Очищаем чат при переходе в статус гостя
      dispatch(clearMessages());
    }
  }, [userStatus]); // Убираем dispatch из зависимостей

  // Обработка подтверждения email из URL параметров
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailVerified = urlParams.get('email-verified');
    const error = urlParams.get('error');
    const message = urlParams.get('message');

    if (emailVerified === 'success') {
      // Обновляем состояние пользователя, если он авторизован
      if (userStatus === 'logged') {
        // Обновляем статус emailVerified в localStorage и перезагружаем данные пользователя
        const currentUser = JSON.parse(localStorage.getItem('user') ?? '{}');
        if (currentUser?.user) {
          currentUser.user.emailVerified = true;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        // Перезагружаем данные пользователя
        void dispatch(refreshUser());
      }

      // Перенаправляем на страницу подтверждения с успешным статусом
      window.location.href = '/verify-email?status=success';
    } else if (emailVerified === 'error') {
      // Перенаправляем на страницу подтверждения с ошибкой
      window.location.href = `/verify-email?status=error&message=${encodeURIComponent(
        message ?? 'Неизвестная ошибка',
      )}`;
    } else if (error === 'missing-token') {
      // Перенаправляем на страницу подтверждения с ошибкой отсутствия токена
      window.location.href = `/verify-email?status=error&message=${encodeURIComponent(
        'Токен подтверждения не найден. Пожалуйста, проверьте ссылку из письма.',
      )}`;
    }
  }, [userStatus, dispatch]);

  return <AppRouter />;
}

export default App;
