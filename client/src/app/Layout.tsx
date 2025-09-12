import SupportChat from '@/widgets/Chat/ui/SupportChat';
import Navigation from '@/widgets/components/ui/Navigation';
import ScrollToTopButton from '@/widgets/components/ui/ScrollToTopButton';
import NotificationToast from '@/widgets/components/ui/NotificationToast';
import { useAppSelector } from '@/shared/hooks/hooks';

import React from 'react';
import { Outlet } from 'react-router';

export default function Layout(): React.JSX.Element {
  const userStatus = useAppSelector((state) => state.user.status);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <Outlet />
        {userStatus === 'logged' && <SupportChat />}
        <ScrollToTopButton />
        {userStatus === 'logged' && <NotificationToast />}
      </main>
    </div>
  );
}
