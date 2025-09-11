import React from 'react';
import { Link } from 'react-router';

const ProfileNotFound = (): React.JSX.Element => {
  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Страница не найдена
        </h2>
        <p className="text-muted-foreground mb-6">
          Запрашиваемая страница профиля не существует
        </p>
      </div>
      
      <div className="space-y-4">
        <Link
          to="/profile/wallet"
          className="inline-block px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-iris transition-all duration-300"
        >
          Вернуться к кошельку
        </Link>
        
        <div className="text-sm text-muted-foreground">
          <p>Доступные разделы:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Link to="/profile/wallet" className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80">
              Кошелек
            </Link>
            <Link to="/profile/invoices" className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80">
              Счета
            </Link>
            <Link to="/profile/notifications" className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80">
              Уведомления
            </Link>
            <Link to="/profile/franchise" className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80">
              Франшиза
            </Link>
            <Link to="/profile/personal" className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80">
              Данные
            </Link>
            <Link to="/profile/password" className="px-3 py-1 bg-muted rounded text-xs hover:bg-muted/80">
              Пароль
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;
