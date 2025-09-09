import { userLoginSchema } from '@/entities/auth/model/schemas';
import { loginUser } from '@/entities/auth/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import type { FormEventHandler } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function SignInForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, status } = useAppSelector((state) => state.user);
  const [validationError, setValidationError] = useState<string>('');

  // Редирект после успешного входа
  useEffect(() => {
    if (status === 'logged') {
      void navigate('/');
    }
  }, [status, navigate]);

  // Отладочная информация о статусе
  useEffect(() => {
    console.log('SignInForm - status changed to:', status);
  }, [status]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    console.log('Form submit triggered');
    e.preventDefault();
    setValidationError('');

    void (async () => {
      try {
        console.log('Starting login process...');
        const data = Object.fromEntries(new FormData(e.currentTarget));
        console.log('Form data:', data);
        console.log('Form data keys:', Object.keys(data));
        console.log('Form data values:', Object.values(data));

        // Проверяем, что поля заполнены
        if (!data.email || !data.password) {
          console.error('Missing required fields:', { email: data.email, password: data.password });
          setValidationError('Пожалуйста, заполните все поля');
          return;
        }

        const dataValidate = userLoginSchema.parse(data);
        console.log('Validated data:', dataValidate);
        console.log('Dispatching loginUser...');
        await dispatch(loginUser(dataValidate)).unwrap();
        console.log('Login successful!');
        // Редирект теперь происходит в useEffect
      } catch (loginError: unknown) {
        console.error('Login failed:', loginError);

        if (loginError instanceof Error && loginError.name === 'ZodError') {
          setValidationError('Пожалуйста, заполните все поля корректно');
        } else if (loginError && typeof loginError === 'object') {
          // Более детальная обработка ошибок
          if ('message' in loginError) {
            setValidationError(`Ошибка входа: ${String(loginError.message)}`);
          } else if ('error' in loginError) {
            setValidationError(`Ошибка входа: ${String(loginError.error)}`);
          } else {
            setValidationError('Произошла ошибка при входе. Попробуйте еще раз.');
          }
        } else {
          setValidationError('Произошла ошибка при входе. Попробуйте еще раз.');
        }
      }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Форма */}
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="heading-3 text-foreground mb-2">Добро пожаловать!</h2>
            <p className="text-muted-foreground">Войдите в свой аккаунт партнера</p>
          </div>

          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            {/* Отображение ошибок */}
            {(error ?? validationError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error ?? validationError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Электронная почта
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input"
                  placeholder="Введите пароль"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-sm text-muted-foreground">Запомнить меня</span>
              </label>
              <a href="#" className="text-sm text-primary hover:text-accent">
                Забыли пароль?
              </a>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={status === 'loading'}
              onClick={() => {
                console.log('Button clicked, status:', status);
                if (status === 'loading') {
                  console.log('Button is disabled due to loading status');
                }
              }}
            >
              {status === 'loading' ? 'Вход...' : 'Войти'}
            </button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <a href="/signup" className="font-medium text-primary hover:text-accent">
                  Зарегистрироваться
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Дополнительная информация */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Входя в систему, вы соглашаетесь с нашими{' '}
            <a href="#" className="text-primary hover:text-accent">
              Условиями использования
            </a>{' '}
            и{' '}
            <a href="#" className="text-primary hover:text-accent">
              Политикой конфиденциальности
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
