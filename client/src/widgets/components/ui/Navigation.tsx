import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';

const Navigation = (): React.JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { href: '#', label: 'Главная', id: 'hero' },
    { href: '/franchise', label: 'Франшиза', id: 'franchise' },
    { href: '#about', label: 'О нас', id: 'about' },
    { href: '#contact', label: 'Контакты', id: 'contact' },
  ];

  // Обработка якорных ссылок при загрузке страницы
  useEffect(() => {
    const { hash, pathname } = location;
    if (hash && pathname === '/') {
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          const navHeight = 80;
          const elementPosition = element.offsetTop - navHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
          setActiveSection(elementId);
        }, 100);
      }
    }
  }, [location]);

  // Отслеживание активной секции при прокрутке
  useEffect(() => {
    const handleScroll = (): void => {
      // Только на главной странице отслеживаем секции
      if (location.pathname !== '/') {
        return;
      }

      const sections = ['about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Отступ для учета высоты навигации

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      // Если мы в верхней части страницы, показываем "Главная" как активную
      if (window.scrollY < 200) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для установки начального состояния

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (href: string): void => {
    if (href === '#') {
      // Если мы не на главной странице, переходим на главную
      if (location.pathname !== '/') {
        void navigate('/');
        return;
      }
      // Прокрутка к началу страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
    } else if (href.startsWith('#')) {
      const elementId = href.substring(1);

      // Если мы не на главной странице, переходим на главную с якорем
      if (location.pathname !== '/') {
        void navigate(`/${href}`);
        return;
      }

      // Если мы на главной странице, ищем элемент
      const element = document.getElementById(elementId);
      if (element) {
        const navHeight = 80; // Примерная высота навигации
        const elementPosition = element.offsetTop - navHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth',
        });
        setActiveSection(elementId);
      }
    } else if (href.startsWith('/')) {
      // Для ссылок на страницы используем React Router
      void navigate(href);
    }
  };

  const isActive = (href: string): boolean => {
    if (href === '#') {
      return location.pathname === '/' && activeSection === 'hero';
    }
    if (href.startsWith('/')) {
      return location.pathname === href;
    }
    // Для якорных ссылок проверяем, что мы на главной странице и секция активна
    return location.pathname === '/' && activeSection === href.substring(1);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Пустое место для логотипа */}
          <div></div>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                  isActive(item.href)
                    ? 'text-[hsl(200_80%_70%)] bg-[hsl(200_80%_70%)]/10'
                    : 'text-muted-foreground hover:text-[hsl(200_80%_70%)] hover:bg-[hsl(200_80%_70%)]/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Кнопки авторизации */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/signin"
              className="px-4 py-2 text-foreground hover:text-[hsl(200_80%_70%)] font-medium transition-colors duration-300"
            >
              Вход
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300 shadow-lg hover:shadow-[hsl(200_80%_70%)]/30 rounded-lg font-medium"
            >
              Регистрация
            </Link>
          </div>

          {/* Мобильное меню кнопка */}
          <button
            className="md:hidden p-2 text-foreground hover:text-[hsl(200_80%_70%)] transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    scrollToSection(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm font-medium transition-all duration-300 text-left px-3 py-2 rounded-lg ${
                    isActive(item.href)
                      ? 'text-[hsl(200_80%_70%)] bg-[hsl(200_80%_70%)]/10'
                      : 'text-muted-foreground hover:text-[hsl(200_80%_70%)] hover:bg-[hsl(200_80%_70%)]/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Link
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-foreground hover:text-[hsl(200_80%_70%)] font-medium transition-colors duration-300 text-left"
                >
                  Вход
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300 rounded-lg font-medium text-center"
                >
                  Регистрация
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
