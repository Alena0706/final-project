import { userRegisterSchema } from '@/entities/auth/model/schemas';
import { registerUser } from '@/entities/auth/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import Spinner from '@/widgets/components/ui/Spinner';
import { ArrowLeft } from 'lucide-react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';

export default function SignUpForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.user);
  const [phone, setPhone] = useState('+7');
  const navigate = useNavigate();

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '');

    let formatted = '+7';
    if (digits.length > 1) {
      formatted += '-';
    }
    if (digits.length >= 2) {
      formatted += digits.substring(1, 4);
    }
    if (digits.length >= 5) {
      formatted += `-${digits.substring(4, 7)}`;
    }
    if (digits.length >= 8) {
      formatted += `-${digits.substring(7, 9)}`;
    }
    if (digits.length >= 10) {
      formatted += `-${digits.substring(9, 11)}`;
    }

    return formatted;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const dataValidate = userRegisterSchema.parse(data);
    try {
      await dispatch(registerUser(dataValidate)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handlePhoneChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const input = e.target.value;
    if (input.length > 16) return;

    const formatted = formatPhone(input);
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Кнопка возврата на главную */}
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
            <h2 className="heading-3 text-foreground mb-2">Станьте партнером</h2>
            <p className="text-muted-foreground">
              Создайте аккаунт и присоединитесь к нашей команде
            </p>
          </div>

          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Полное имя
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="form-input"
                  placeholder="Иван Иванов"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Телефон
                </label>
                <input
                  onChange={handlePhoneChange}
                  value={phone}
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="form-input"
                  placeholder="+7-___-___-__-__"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                  Город
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  className="form-input"
                  placeholder="Москва"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder="Минимум 8 символов"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Подтверждение пароля
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder="Повторите пароль"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5"></div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <span>Регистрация...</span>
                </div>
              ) : (
                'Зарегистрироваться'
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <Link
                  to="/signin"
                  className="font-medium text-primary hover:text-accent transition-colors duration-200"
                >
                  Войти
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
