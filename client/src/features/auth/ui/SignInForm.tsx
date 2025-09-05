import React, { useState } from 'react';
import InputMask from 'react-input-mask';

export default function SignInForm(): React.JSX.Element {
  const [phone, setPhone] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Регистрация</h2>
        <form className="mt-8 space-y-6" noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Электронная почта
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 
                           focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Введите email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 
                           placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                           focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Введите пароль"
              />
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="sr-only">
                Подтверждение пароля
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 
                           focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Подтвердите пароль"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Телефон
              </label>
              <InputMask
                mask="+7-999-999-99-99"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              >
                {/* {(inputProps: any) => (
                  <input
                    {...inputProps}
                    type="tel"
                    id="phone"
                    name="phone"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
                               placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                               focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="+7-___-___-__-__"
                    required
                  />
                )} */}
              </InputMask>
            </div>
            <div>
              <label htmlFor="city" className="sr-only">
                Город
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300
                           placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Город"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium
                         rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-indigo-500"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

