import { Link } from 'react-router';
import heroImage from '@/assets/hero-iris-new.png';
import PartnerFormModal from '@/widgets/modalMain/ui/PartnerFormModal';
import { useState } from 'react';
import { useAppSelector } from '@/shared/hooks/hooks';

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

const HeroSection = (): React.JSX.Element => {
  const user = useAppSelector((store) => store.user.user?.user);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <section className="hero-section">
        {/* Фоновое изображение */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Фотография радужки глаза - уникальные узоры и детали"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        </div>

        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}
          />
        </div>

        {/* Основной контент */}
        <div className="container mx-auto px-4 z-10 text-center relative">
          <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Бейдж */}
            <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-2 mb-8">
              <span className="w-2 h-2 bg-gradient-iris rounded-full animate-pulse-glow"></span>
              <span className="text-foreground font-medium">Уникальная бизнес-возможность</span>
            </div>

            {/* Главный заголовок */}
            <h1 className="heading-1 text-foreground mb-6">
              <span className="text-gradient-primary">Франшиза будущего</span>
              <br />
              <span>в сфере фотографии</span>
            </h1>

            {/* Подзаголовок */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Откройте прибыльный бизнес в уникальной нише профессиональной фотографии радужки
              глаза. Полная поддержка, проверенные технологии, высокая маржинальность.
            </p>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
              <div className="text-center animate-slide-up">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50+</div>
                <div className="text-muted-foreground">Довольных партнеров</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">6</div>
                <div className="text-muted-foreground">Городов присутствия</div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">2023</div>
                <div className="text-muted-foreground">Год основания</div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button onClick={openModal} className="btn-primary text-lg px-8 py-4 group">
                Стать партнером
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="glass-effect px-8 py-4 text-foreground rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Смотреть презентацию
              </button>
            </div>

            {/* Преимущества */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300 animate-slide-up">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-foreground font-semibold mb-2">Быстрый старт</h3>
                <p className="text-muted-foreground text-sm">
                  От подписания договора до открытия 2-4 недели
                </p>
              </div>

              <div
                className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="text-2xl mb-2">💎</div>
                <h3 className="text-foreground font-semibold mb-2">Уникальная ниша</h3>
                <p className="text-muted-foreground text-sm">Минимум конкурентов, высокий спрос</p>
              </div>

              <div
                className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="text-2xl mb-2">📈</div>
                <h3 className="text-foreground font-semibold mb-2">Высокая прибыль</h3>
                <p className="text-muted-foreground text-sm">Окупаемость от 6 месяцев</p>
              </div>
            </div>
          </div>
        </div>

        {/* Стрелка прокрутки */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="glass-effect p-3 rounded-full">
            <svg
              className="h-6 w-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        <PartnerFormModal isOpen={isModalOpen} onClose={closeModal} user={user} />
      </section>
    </>
  );
};

export default HeroSection;
