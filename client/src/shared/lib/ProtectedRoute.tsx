import React from 'react';
import { Navigate, Outlet } from 'react-router';
import PageLoader from '@/widgets/components/ui/PageLoader';

type Props = {
  children?: React.JSX.Element;
  isAllowed: boolean;
  redirectTo?: string;
  isLoading?: boolean;
};

export default function ProtectedRoute({
  children,
  isAllowed,
  redirectTo = '/',
  isLoading = false,
}: Props): React.JSX.Element {
  // Показываем загрузку если идет проверка авторизации
  if (isLoading) {
    return <PageLoader message="Проверка авторизации..." />;
  }

  // Если не авторизован - редирект
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  // Если авторизован - показываем контент
  return children ?? <Outlet />;
}