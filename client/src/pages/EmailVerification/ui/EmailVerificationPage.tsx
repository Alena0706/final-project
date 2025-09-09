import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { verifyEmail } from '@/entities/auth/model/thunks';
import PageLoader from '@/widgets/components/ui/PageLoader';

export default function EmailVerificationPage(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: userStatus } = useAppSelector((state) => state.user);
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    
    // Если пришли с сервера с готовым статусом
    if (status) {
      if (status === 'success') {
        setStatus('success');
        setMessage('Email успешно подтвержден! Теперь вы можете пользоваться всеми функциями сервиса.');
        
        // Перенаправляем в профиль через 3 секунды
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else if (status === 'error') {
        setStatus('error');
        setMessage(message || 'Ошибка при подтверждении email');
      }
      return;
    }
    
    // Если пришли с токеном (прямая ссылка)
    if (!token) {
      setStatus('error');
      setMessage('Токен подтверждения не найден');
      return;
    }

    const handleVerification = async () => {
      try {
        await dispatch(verifyEmail({ token })).unwrap();
        setStatus('success');
        setMessage('Email успешно подтвержден! Теперь вы можете пользоваться всеми функциями сервиса.');
        
        // Перенаправляем в профиль через 3 секунды
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Ошибка при подтверждении email');
      }
    };

    handleVerification();
  }, [searchParams, dispatch, navigate]);

  if (userStatus === 'loading' || status === 'loading') {
    return <PageLoader message="Подтверждаем email..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Успешно!</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
              >
                Перейти в профиль
              </button>
              
              <p className="text-sm text-gray-500">
                Автоматическое перенаправление через 3 секунды...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                Перейти в профиль
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Попробовать снова
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
