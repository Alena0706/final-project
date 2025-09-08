import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import Layout from '../Layout';
import SignUpPage from '@/pages/SignUp/ui/SignUpPage';
import SignInPage from '@/pages/SignIn/ui/SignInPage';
import MainPage from '@/pages/main/ui/MainPage';
import ProfilePage from '@/pages/Profile/ui/ProfilePage';
import FranchisePage from '@/pages/franchisePage/ui/FranchisePage';
import WalletTopUp from '@/features/profile/ui/WalletTopUp';
import ProfileSection from '@/features/profile/ui/ProfileSection';
import ChangePassword from '@/features/profile/ui/ChangePassword';
import NotFoundPage from '@/pages/NotFound/ui/NotFoundPage';

export default function AppRouter(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route index element={<Navigate to="wallet" replace />} />
          <Route path="wallet" element={<WalletTopUp />} />
          <Route path="personal" element={<ProfileSection />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
