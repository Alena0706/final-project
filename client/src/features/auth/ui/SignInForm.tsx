import { userLoginSchema } from '@/entities/auth/model/schemas';
import { loginUser } from '@/entities/auth/model/thunks';
import { clearError } from '@/entities/auth/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import TwoFactorLogin from '@/features/2fa/ui/TwoFactorLogin';
import Spinner from '@/widgets/components/ui/Spinner';

import type { FormEventHandler } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function SignInForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, status, user } = useAppSelector((state) => state.user);
  const [validationError, setValidationError] = useState<string>('');
  const [show2FA, setShow2FA] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Редирект после успешного входа
  useEffect(() => {
    if (status === 'pending2FA') {
      // Показываем модалку 2FA
      setShow2FA(true);
    } else if (status === 'logged' && user?.user) {
      // Обычный вход без 2FA
      void navigate('/');
    }
  }, [status, user, navigate]);

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

        console.log('Validated data:', dataValidate);

        // Сохраняем email для 2FA
        setUserEmail(dataValidate.email);

        console.log('Dispatching loginUser...');

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

  const handle2FASuccess = (): void => {
    setShow2FA(false);
    // Статус пользователя будет обновлен в auth slice после успешной верификации
    // useEffect автоматически перенаправит на главную страницу
  };

  const handle2FACancel = (): void => {
    setShow2FA(false);
    setUserEmail('');
    // Очищаем состояние пользователя при отмене
    dispatch(clearError());
  };

  // Показываем компонент 2FA если требуется
  if (show2FA) {
    const email = userEmail || user?.user?.email || '';
    return <TwoFactorLogin email={email} onSuccess={handle2FASuccess} onCancel={handle2FACancel} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-muted/50 rounded-lg group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="hidden sm:inline">Вернуться на главную</span>
            <span className="sm:hidden">На главную</span>
          </Link>
        </div>
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
              <label className="flex items-center"></label>
              <a
                href="#"
                className="text-sm text-primary hover:text-accent transition-colors duration-200"
              >
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
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:text-accent transition-colors duration-200"
                >
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
