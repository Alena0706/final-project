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
    <div className="container mx-auto mt-10 px-4">
      <div className="flex min-h-[500px]">
        {/* Левая колонка - меню */}
        <nav className="w-2/12 border-r border-gray-300 pr-4">
          <ul className="space-y-4">
            {tabs.map(({ id, label }) => {
              // Определяем, является ли этот таб активным
              const isActive = location.pathname.endsWith(id);
              return (
                <li key={id}>
                  <Link
                    to={`/profile/${id}`}
                    className={`block w-full px-3 py-2 rounded-md font-medium transition-colors focus:outline-none ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Правая колонка - контент */}
        <main className="w-10/12 pl-6 bg-white rounded p-6 shadow">
          {/* В этом месте React Router отрендерит компонент текущего дочернего маршрута */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;