import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import Layout from '../Layout';
import SignUpPage from '@/pages/SignUp/ui/SignUpPage';
import SignInPage from '@/pages/SignIn/ui/SignInPage';
import MainPage from '@/pages/main/ui/MainPage';
import ProfilePage from '@/pages/Profile/ui/ProfilePage';
import ProfileNotFound from '@/pages/Profile/ui/ProfileNotFound';
import FranchisePage from '@/pages/franchisePage/ui/FranchisePage';
import WalletTopUp from '@/features/profile/ui/WalletTopUp';
import ProfileSection from '@/features/profile/ui/ProfileSection';
import ChangePassword from '@/features/profile/ui/ChangePassword';
import UserInvoices from '@/features/invoices/ui/UserInvoices';
import UserNotifications from '@/features/notifications/ui/UserNotifications';
import FranchiseProfile from '@/features/profile/ui/FranchiseProfile';
import AdminDashboard from '@/features/admin/ui/AdminDashboard';
import NotFoundPage from '@/pages/NotFound/ui/NotFoundPage';
import EmailVerificationPage from '@/pages/EmailVerification/ui/EmailVerificationPage';
import ProtectedRoute from '@/shared/lib/ProtectedRoute';
import AuthRoute from '@/shared/lib/AuthRoute';
import AdminRouteGuard from '@/shared/lib/AdminRouteGuard';
import PageLoader from '@/widgets/components/ui/PageLoader';
import PageTransition from '@/widgets/components/ui/PageTransition';
import AuthTransition from '@/widgets/components/ui/AuthTransition';
import { useAppSelector } from '@/shared/hooks/hooks';

export default function AppRouter(): React.JSX.Element {
  const userStatus = useAppSelector((store) => store.user.status);
  const isLoading = userStatus === 'loading';

  return (
    <Suspense fallback={<PageLoader message="Загрузка страницы..." />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          
          {/* Приватные маршруты */}
          <Route 
            element={
              <ProtectedRoute 
                isAllowed={userStatus !== 'guest'} 
                redirectTo="/signin" 
                isLoading={isLoading}
              />
            }
          >
            <Route 
              path="/profile" 
              element={
                <PageTransition>
                  <AdminRouteGuard>
                    <ProfilePage />
                  </AdminRouteGuard>
                </PageTransition>
              }
            >
              <Route index element={<Navigate to="personal" replace />} />
              <Route path="wallet" element={<WalletTopUp />} />
              <Route path="invoices" element={<UserInvoices />} />
              <Route path="notifications" element={<UserNotifications />} />
              <Route path="franchise" element={<FranchiseProfile />} />
              <Route path="personal" element={<ProfileSection />} />
              <Route path="password" element={<ChangePassword />} />
              <Route path="*" element={<ProfileNotFound />} />
            </Route>
            <Route 
              path="/admin" 
              element={
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              } 
            />
          </Route>

          <Route 
            path="/franchise" 
            element={
              <PageTransition>
                <FranchisePage />
              </PageTransition>
            } 
          />
          <Route 
            path="/verify-email" 
            element={
              <PageTransition>
                <EmailVerificationPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/signin" 
            element={
              <AuthRoute 
                isAuthenticated={userStatus === 'logged'} 
                redirectTo="/profile/personal" 
                isLoading={isLoading}
              >
                <AuthTransition>
                  <SignInPage />
                </AuthTransition>
              </AuthRoute>
            } 
          />
          <Route 
            path="/signup"
            element={
              <AuthRoute 
                isAuthenticated={userStatus === 'logged'} 
                redirectTo="/profile/personal" 
                isLoading={isLoading}
              >
                <AuthTransition>
                  <SignUpPage />
                </AuthTransition>
              </AuthRoute>
            } 
          />
          <Route 
            path="*" 
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            } 
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
