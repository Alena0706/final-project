import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';

const tabs = [
  { id: 'wallet', label: 'Пополнение кошелька' },
  { id: 'personal', label: 'Персональные данные' },
  { id: 'password', label: 'Изменение пароля' },
];

const ProfilePage = (): React.JSX.Element => {
  const location = useLocation();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок профиля */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-iris rounded-xl flex items-center justify-center shadow-iris">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h1 className="heading-2 text-gradient-primary">Профиль партнера</h1>
          </div>
          <p className="text-muted-foreground">Управляйте своим аккаунтом и настройками</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Левая колонка - меню */}
          <nav className="lg:col-span-1">
            <div className="card animate-slide-up">
              <h2 className="text-lg font-semibold text-foreground mb-4">Навигация</h2>
              <ul className="space-y-2">
                {tabs.map(({ id, label }) => {
                  const isActive = location.pathname.endsWith(id);
                  return (
                    <li key={id}>
                      <Link
                        to={`/profile/${id}`}
                        className={`block w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-primary text-white shadow-iris'
                            : 'text-foreground hover:bg-muted hover:text-primary'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Правая колонка - контент */}
          <main className="lg:col-span-3">
            <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
