import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';
import SignUpPage from '@/pages/SignUp/ui/SignUpPage';

export default function AppRouter(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/signin" element={<div>SignIn</div>} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
    </Routes>
  );
}
