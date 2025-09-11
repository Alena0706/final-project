import React, { useState, memo } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { resendVerificationEmail } from '@/entities/auth/model/thunks';

const EmailVerificationBanner = memo((): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleResendEmail = async (): Promise<void> => {
    if (!user?.user?.email) return;
    
    setIsResending(true);
    setResendMessage(null);
    
    try {
      await dispatch(resendVerificationEmail({ email: user.user.email })).unwrap();
      setResendMessage('Письмо отправлено повторно! Проверьте почту.');
    } catch (error) {
      setResendMessage('Ошибка отправки. Попробуйте позже.');
    } finally {
      setIsResending(false);
    }
  };

  // Для админов почта считается подтвержденной по умолчанию
  const isAdmin = user?.user?.role === 'admin' || user?.user?.admin === true;
  const isEmailVerified = user?.user?.emailVerified || isAdmin;
  
  if (isEmailVerified) {
    return <></>;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6 animate-slide-down">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-amber-800">
            Подтвердите ваш email адрес
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Мы отправили письмо на <strong>{user?.user?.email}</strong>. 
              Пожалуйста, перейдите по ссылке в письме для подтверждения.
            </p>
            <p className="mt-2">
              <strong>Важно:</strong> До подтверждения email кошелек будет недоступен.
            </p>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isResending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправляем...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Отправить повторно
                </>
              )}
            </button>
          </div>
          
          {resendMessage && (
            <div className={`mt-3 text-sm ${resendMessage.includes('Ошибка') ? 'text-red-600' : 'text-green-600'}`}>
              {resendMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default EmailVerificationBanner;
