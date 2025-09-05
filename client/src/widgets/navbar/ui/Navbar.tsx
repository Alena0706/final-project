import React from 'react';
import { Link } from 'react-router';

export default function Navbar(): React.JSX.Element {
  return (
    <header className="bg-black text-white flex items-center justify-between px-6 h-16">
      <div className="text-lg font-bold">Логотип</div>
      <nav className="flex space-x-8 mx-auto">
        <Link
          to="/"
          className="text-white text-base font-medium hover:text-gray-400 transition-colors duration-300"
        >
          Главная
        </Link>
        <Link
          to="/about"
          className="text-white text-base font-medium hover:text-gray-400 transition-colors duration-300"
        >
          О нас
        </Link>
        <Link
          to="/franchise"
          className="text-white text-base font-medium hover:text-gray-400 transition-colors duration-300"
        >
          Франшиза
        </Link>
        <Link
          to="/contacts"
          className="text-white text-base font-medium hover:text-gray-400 transition-colors duration-300"
        >
          Контакты
        </Link>
      </nav>
      <div className="flex space-x-4">
        <button className="text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors duration-300">
          Вход
        </button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300">
          Регистрация
        </button>
      </div>
    </header>
  );
}
