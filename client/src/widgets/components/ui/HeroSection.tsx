// import { Link } from 'react-router';
import heroImage from '@/assets/глаз.jpg';
import PartnerFormModal from '@/widgets/modalMain/ui/PartnerFormModal';
import { useState } from 'react';
import { useAppSelector } from '@/shared/hooks/hooks';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

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
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Фоновое изображение */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Фотография радужки глаза - уникальные узоры и детали"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 gradient-hero opacity-90" />
        </div>

        {/* Декоративные элементы */}
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

        {/* Основной контент */}
        <div className="container mx-auto px-4 z-10 text-center relative">
          <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Главный заголовок */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)]">
                Магия взгляда в ваших руках
              </span>
            </h1>
            <h3 className="text-xl md:text-2xl text-muted-foreground mb-8">
              Франшиза профессиональной фотографии радужки глаза
            </h3>

            {/* Подзаголовок */}
            <div className="flex justify-center mb-16">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-primary-foreground text-lg px-8 py-4 rounded-xl shadow-iris hover:shadow-gold transition-all duration-300 hover:scale-105 flex items-center group hover:bg-gradient-to-r hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)]"
              >
                Стать партнером
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Преимущества */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-effect rounded-xl p-6 border border-border/30 hover:border-[hsl(200_80%_70%)]/50 transition-all duration-300 animate-slide-up backdrop-blur-md">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-foreground font-semibold mb-2">Быстрый старт</h3>
                <p className="text-muted-foreground text-sm">
                  От подписания договора до открытия 2-4 недели
                </p>
              </div>

              <div
                className="glass-effect rounded-xl p-6 border border-border/30 hover:border-[hsl(200_80%_70%)]/50 transition-all duration-300 animate-slide-up backdrop-blur-md"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="text-2xl mb-2">💎</div>
                <h3 className="text-foreground font-semibold mb-2">Уникальная ниша</h3>
                <p className="text-muted-foreground text-sm">Минимум конкурентов, высокий спрос</p>
              </div>

              <div
                className="glass-effect rounded-xl p-6 border border-border/30 hover:border-[hsl(200_80%_70%)]/50 transition-all duration-300 animate-slide-up backdrop-blur-md"
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
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="gradient-card p-3 rounded-full border border-border">
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
        </div> */}

        <PartnerFormModal isOpen={isModalOpen} onClose={closeModal} user={user} />
      </section>
    </>
  );
};

export default HeroSection;
