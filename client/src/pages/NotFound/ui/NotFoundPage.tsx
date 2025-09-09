import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[hsl(200_80%_70%)]/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-[hsl(200_60%_50%)]/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-[hsl(200_60%_60%)]/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="max-w-md w-full text-center space-y-8 z-10">
        {/* Код ошибки */}
        <div className="text-center mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)]">
            404
          </h1>
        </div>

        {/* Сообщение */}
        <div className="glass-effect rounded-xl p-8 border border-border/30 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Страница не найдена</h2>
          <p className="text-muted-foreground mb-6">
            Возможно, эта страница была перемещена или удалена. 
            Попробуйте вернуться на главную страницу.
          </p>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-[hsl(200_80%_60%)] to-[hsl(210_80%_40%)] text-primary-foreground px-6 py-3 rounded-xl shadow-iris hover:shadow-gold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              На главную
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="glass-effect text-foreground px-6 py-3 rounded-xl border border-border/30 hover:border-[hsl(200_80%_70%)]/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Назад
            </button>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Нужна помощь?{' '}
            <Link to="/contacts" className="text-primary hover:text-accent">
              Свяжитесь с нами
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}