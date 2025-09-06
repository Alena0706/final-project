import { logoutUser } from '@/entities/auth/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React from 'react';
import { Link } from 'react-router';

export default function Navbar(): React.JSX.Element {
  const user = useAppSelector((store) => store.user.user);
  const dispatch = useAppDispatch();
  console.log(user);
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
        {user ? (
          <button className="text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors duration-300">
            <Link to="/profile">Профиль</Link>
          </button>
        ) : (
          <button className="text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors duration-300">
            <Link to="/signin">Вход</Link>
          </button>
        )}
        {!user ? (
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300">
            <Link to="/signup">Регистрация</Link>
          </button>
        ) : (
          <button onClick={()=> void dispatch(logoutUser())} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300">
            Выход
          </button>
        )}
      </div>
    </header>
  );
}
