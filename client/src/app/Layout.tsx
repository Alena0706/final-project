import SupportChat from '@/widgets/Chat/ui/SupportChat';
import Navigation from '@/widgets/components/ui/Navigation';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { refreshUser } from '@/entities/auth/model/thunks';

import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

export default function Layout(): React.JSX.Element {
  const dispatch = useAppDispatch();

  // Инициализация пользователя при загрузке приложения
  useEffect(() => {
    // Проверяем, есть ли токен в localStorage перед попыткой refresh
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('Token found, attempting refresh...');
      void dispatch(refreshUser()).catch((error) => {
        console.log('Refresh failed, setting status to guest:', error);
        // Если refresh не удался, устанавливаем статус в guest
        // Это произойдет автоматически в slice, но добавим дополнительную проверку
      });
    } else {
      console.log('No token found, skipping refresh');
      // Если нет токена, статус уже должен быть 'guest' из initialState
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <Outlet />
        <SupportChat />
      </main>
    </div>
  );
}
