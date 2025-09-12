import React from 'react';
import { Navigate } from 'react-router';
import PageLoader from '@/widgets/components/ui/PageLoader';

type Props = {
  children: React.JSX.Element;
  isAuthenticated: boolean;
  redirectTo?: string;
  isLoading?: boolean;
};

export default function AuthRoute({
  children,
  isAuthenticated,
  redirectTo = '/profile',
  isLoading = false,
}: Props): React.JSX.Element {
  // Показываем загрузку если идет проверка авторизации
  if (isLoading) {
    return <PageLoader message="Проверка авторизации..." />;
  }

  // Если авторизован - редирект на профиль
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Если не авторизован - показываем страницы входа/регистрации
  return children;
}

