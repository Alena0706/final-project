import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';
import SignUpPage from '@/pages/SignUp/ui/SignUpPage';
import SignInPage from '@/pages/SignIn/ui/SignInPage';
import MainPage from '@/pages/main/ui/MainPage';
import ProfilePage from '@/pages/Profile/ui/ProfilePage';

export default function AppRouter(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
    </Routes>
  );
}
