import React, { useEffect } from 'react';

import AppRouter from './router/AppRouter';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { refreshUser } from '@/entities/auth/model/thunks';
import { fetchWallet } from '@/entities/wallet/model/thunks';

function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);

  useEffect(() => {
    void dispatch(refreshUser());
  }, []);

  // Загружаем кошелек после успешной авторизации
  useEffect(() => {
    if (userStatus === 'logged') {
      void dispatch(fetchWallet());
    }
  }, [userStatus, dispatch]);

  return <AppRouter />;
}

export default App;
