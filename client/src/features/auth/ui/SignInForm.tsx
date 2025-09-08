import { userLoginSchema } from '@/entities/auth/model/schemas';
import { loginUser } from '@/entities/auth/model/thunks';
import { useAppDispatch } from '@/shared/hooks/hooks';
import type { FormEventHandler } from 'react';
import React from 'react';

export default function SignInForm(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const dataValidate = userLoginSchema.parse(data);
    void dispatch(loginUser(dataValidate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Логотип */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-iris rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <span className="text-2xl font-bold text-gradient-primary">IrisPhoto</span>
          </div>
        </div>

        {/* Форма */}
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="heading-3 text-foreground mb-2">Добро пожаловать!</h2>
            <p className="text-muted-foreground">Войдите в свой аккаунт партнера</p>
          </div>

          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
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

            <button type="submit" className="btn-primary w-full">
              Войти
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
