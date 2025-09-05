import React, { useState } from 'react';

export default function SignUpForm(): React.JSX.Element {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    city: '',
    avatar: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files) {
      setForm(prev => ({ ...prev, avatar: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', form);
    // сюда добавьте логику отправки формы
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <label className="block">
        <span className="text-gray-700">Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
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

      <label className="block">
        <span className="text-gray-700">Имя</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Город</span>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Телефон</span>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Аватар</span>
        <input
          type="file"
          name="avatar"
          onChange={handleChange}
          accept="image/*"
          className="mt-1 block w-full"
          required
        />
      </label>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        Зарегистрироваться
      </button>
    </form>
  );
}
