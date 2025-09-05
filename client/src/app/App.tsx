import React, { useEffect } from 'react';

import AppRouter from './router/AppRouter';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { refreshUser } from '@/entities/auth/model/thunks';

function App(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(refreshUser());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
