import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';

export default function AppRouter(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<div>Home</div>} />
      </Route>
    </Routes>
  );
}
