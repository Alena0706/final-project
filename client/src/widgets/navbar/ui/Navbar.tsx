import { logoutUser } from '@/entities/auth/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React from 'react';
import { Link } from 'react-router';

export default function Navbar(): React.JSX.Element {
  const user = useAppSelector((store) => store.user.user);
  const dispatch = useAppDispatch();

  return (
    <header className="navbar h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-iris rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="text-xl font-bold text-gradient-primary">IrisPhoto</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-primary font-medium relative group">
            Главная
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-primary font-medium relative group"
          >
            О нас
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/franchise"
            className="text-foreground hover:text-primary font-medium relative group"
          >
            Франшиза
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/contacts"
            className="text-foreground hover:text-primary font-medium relative group"
          >
            Контакты
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Кнопки */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-foreground hover:text-primary px-4 py-2 font-medium"
              >
                Профиль
              </Link>
              <button onClick={() => void dispatch(logoutUser())} className="btn-secondary">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-foreground hover:text-primary px-4 py-2 font-medium"
              >
                Вход
              </Link>
              <Link to="/signup" className="btn-primary">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
