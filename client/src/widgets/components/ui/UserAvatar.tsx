import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { logoutUser } from '@/entities/auth/model/thunks';
import NotificationBell from './NotificationBell';

export default function UserAvatar(): React.JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((store) => store.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    void dispatch(logoutUser());
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsDropdownOpen(false);
  };

  // Получаем инициалы пользователя
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const userName = user?.user?.name || 'Пользователь';
  const userAvatar = user?.user?.avatar;
  const isAdmin = user?.user?.admin;

  // Отладочная информация
  console.log('UserAvatar - user data:', { user, userAvatar, userName });

  // Формируем полный URL для аватара
  const getAvatarUrl = (avatar: string | null | undefined) => {
    if (!avatar) return null;
    // Если аватар уже содержит полный URL, возвращаем как есть
    if (avatar.startsWith('http')) return avatar;
    // Используем прокси Vite для загрузки файлов
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? 'http://localhost:5173' : '';
    const fullUrl = `${baseUrl}/api/uploads/${avatar}`;
    console.log('UserAvatar - avatar URL:', { avatar, fullUrl });
    return fullUrl;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Колокольчик уведомлений */}
      <NotificationBell />

      {/* Аватар пользователя */}
      <div className="relative" ref={dropdownRef}>
        {/* Аватарка */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white font-semibold text-sm hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300 shadow-lg hover:shadow-[hsl(200_80%_70%)]/30 focus:outline-none focus:ring-2 focus:ring-[hsl(200_80%_70%)] focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Меню пользователя"
          aria-expanded={isDropdownOpen}
        >
          {userAvatar ? (
            <img
              src={getAvatarUrl(userAvatar) || ''}
              alt={userName}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                // Если изображение не загрузилось, показываем инициалы
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = getInitials(userName);
                }
              }}
            />
          ) : (
            getInitials(userName)
          )}
        </button>

        {/* Выпадающее меню */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-[27px] w-56 dark-glass rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="py-2">
              {/* Информация о пользователе */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{user?.user?.email}</p>
              </div>

              {/* Пункты меню */}
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:text-[hsl(200_80%_70%)] hover:bg-[hsl(200_80%_70%)]/5 transition-all duration-300 rounded-lg mx-1"
                >
                  <User className="w-4 h-4 mr-3" />
                  Профиль
                </button>

                {isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:text-[hsl(200_80%_70%)] hover:bg-[hsl(200_80%_70%)]/5 transition-all duration-300 rounded-lg mx-1"
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Админ панель
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 rounded-lg mx-1"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Выход
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
