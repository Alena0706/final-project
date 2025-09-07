import { Link } from 'react-router';
import heroImage from '@/assets/hero-iris-new.png';

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const Button = ({
  children,
  size = 'md',
  className = '',
  asChild = false,
  to = '',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asChild?: boolean;
  to?: string;
}) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const sizeClass =
    size === 'lg'
      ? 'px-8 py-4 text-lg'
      : size === 'sm'
      ? 'px-3 py-1 text-sm'
      : 'px-6 py-2 text-base';

  const combinedClass = `${baseClass} ${sizeClass} ${className}`;

  if (asChild && to) {
    return (
      <Link to={to} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return <button className={combinedClass}>{children}</button>;
};

const HeroSection = (): React.JSX.Element => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    {/* Фоновое изображение */}
    <div className="absolute inset-0 z-0">
      <img
        src={heroImage}
        alt="Фотография радужки глаза - уникальные узоры и детали"
        className="w-full h-full object-cover opacity-100"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 opacity-90" /> */}
    </div>
    {/* Декоративные элементы */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />
    </div>
    <div className="container mx-auto px-4 z-10 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Главный заголовок */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
            Магия взгляда
          </span>
          <br />
          <span className="text-white/90">в ваших руках</span>
        </h1>
        {/* Подзаголовок */}
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Франшиза профессиональной фотографии радужки глаза
        </p>
        {/* Кнопка действий */}
        <div className="flex justify-center mb-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-700/50 text-lg px-8 py-6 group"
            asChild
            to="/register"
          >
            <>
              Стать партнером
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          </Button>
        </div>
      </div>
    </div>
    {/* Стрелка прокрутки */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      {/* Можно добавить SVG стрелки вниз или другой декоративный элемент */}
    </div>
  </section>
  
);

export default HeroSection;
