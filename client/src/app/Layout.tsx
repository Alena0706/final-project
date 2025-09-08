import SupportChat from '@/widgets/Chat/ui/SupportChat';
import Navigation from '@/widgets/components/ui/Navigation';

import React from 'react';
import { Outlet } from 'react-router';

export default function Layout(): React.JSX.Element {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Outlet />
        <SupportChat />
      </main>
    </div>
  );
}
