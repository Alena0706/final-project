import React, { useState } from 'react';

export default function SignInForm(): React.JSX.Element {
  const [form, setForm] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign In:', form);
    // логика входа сюда
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <label className="block">
        <span className="text-gray-700">Имя пользователя</span>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Пароль</span>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </label>

      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="remember"
          checked={form.remember}
          onChange={handleChange}
          className="form-checkbox"
        />
        <span className="ml-2 text-gray-700">Запомнить меня</span>
      </label>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        Войти
      </button>
    </form>
  );
}
