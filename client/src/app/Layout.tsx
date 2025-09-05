import NavBar from '@/widgets/navbar/ui/Navbar';

import React from 'react';
import { Outlet } from 'react-router';

export default function Layout(): React.JSX.Element {
  return (
    <>
      <header >
        <NavBar />
      </header>
      <main style={{marginTop: '100px'}}>
        <Outlet />
        {/* <img src='https://static.tildacdn.com/tild3534-6332-4361-b538-623337356131/444.jpg'/> */}
      </main>
   
    </>
  );
}
