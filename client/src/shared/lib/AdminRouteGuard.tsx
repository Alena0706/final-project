import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppSelector } from '@/shared/hooks/hooks';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();
  
  // Определяем, является ли пользователь админом
  const isAdmin = user?.user?.role === 'admin' || user?.user?.admin === true;
  
  // Если пользователь админ, но пытается зайти на недоступную страницу
  if (isAdmin) {
    const adminRestrictedRoutes = ['wallet', 'invoices', 'franchise'];
    const currentPath = location.pathname.split('/').pop();
    
    if (currentPath && adminRestrictedRoutes.includes(currentPath)) {
      return <Navigate to="/profile/personal" replace />;
    }
  }
  
  return <>{children}</>;
};

export default AdminRouteGuard;
