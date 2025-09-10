import React, { useEffect } from 'react';

import AppRouter from './router/AppRouter';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { refreshUser } from '@/entities/auth/model/thunks';
import { fetchWallet } from '@/entities/wallet/model/thunks';

function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage перед вызовом refresh
    const token = localStorage.getItem('accessToken');
    if (token) {
      void dispatch(refreshUser());
    }
  }, []);

  // Загружаем кошелек после успешной авторизации
  useEffect(() => {
    if (userStatus === 'logged') {
      void dispatch(fetchWallet());
    }
  }, [userStatus, dispatch]);

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
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.user) {
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
      window.location.href = `/verify-email?status=error&message=${encodeURIComponent(message || 'Неизвестная ошибка')}`;
    } else if (error === 'missing-token') {
      // Перенаправляем на страницу подтверждения с ошибкой отсутствия токена
      window.location.href = '/verify-email?status=error&message=' + encodeURIComponent('Токен подтверждения не найден. Пожалуйста, проверьте ссылку из письма.');
    }
  }, [userStatus, dispatch]);

  return <AppRouter />;
}

export default App;
