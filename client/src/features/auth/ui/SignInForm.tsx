import { userLoginSchema } from '@/entities/auth/model/schemas';
import { loginUser } from '@/entities/auth/model/thunks';
import { clearError } from '@/entities/auth/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import Spinner from '@/widgets/components/ui/Spinner';
import type { FormEventHandler } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';

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

  // Очищаем ошибки при загрузке компонента
  useEffect(() => {
    setValidationError('');
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setValidationError('');

    void (async () => {
      try {
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Проверяем, что поля заполнены
        if (!data.email || !data.password) {
          setValidationError('Пожалуйста, заполните все поля');
          return;
        }

        const dataValidate = userLoginSchema.parse(data);
        await dispatch(loginUser(dataValidate)).unwrap();
        // Редирект теперь происходит в useEffect
      } catch (loginError: unknown) {
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
      
              </label>
              <a href="#" className="text-sm text-primary hover:text-accent transition-colors duration-200">
                Забыли пароль?
              </a>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <span>Вход...</span>
                </div>
              ) : (
                'Войти'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-accent transition-colors duration-200">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
