import SupportChat from '@/widgets/Chat/ui/SupportChat';
import NavBar from '@/widgets/navbar/ui/Navbar';

import React from 'react';
import { Outlet } from 'react-router';

export default function Layout(): React.JSX.Element {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-16">
        <Outlet />
        <SupportChat />
      </main>
    </div>
  );
}
