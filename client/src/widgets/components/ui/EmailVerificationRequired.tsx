import React from 'react';

export default function EmailVerificationRequired(): React.JSX.Element {
  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Подтвердите email для доступа к кошельку
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Для безопасности вашего аккаунта необходимо подтвердить email адрес 
          перед использованием кошелька. 
          Проверьте почту и перейдите по ссылке в письме.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mt-2">
            Если письмо не пришло, проверьте папку "Спам" или попробуйте зарегистрироваться заново.
          </p>
        </div>
      </div>
    </div>
  );
}
