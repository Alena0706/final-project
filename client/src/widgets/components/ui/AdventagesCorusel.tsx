import React, { useState } from 'react';
import type { JSX } from 'react';
import {
  Sparkles,
  Palette,
  GraduationCap,
  TrendingUp,
  Zap,
  Package,
  Coins,
  Lightbulb,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import PartnerFormModal from '@/widgets/modalMain/ui/PartnerFormModal';
import { useAppSelector } from '@/shared/hooks/hooks';
import Презентация from '@/assets/Презентация.txt';

const advantages = [
  {
    icon: Sparkles,
    title: 'Уникальность',
    description:
      'Фотография радужки глаза - это уникальный сегмент, который выделяется среди стандартных фотосервисов. Это позволяет привлечь клиентов, ищущих необычные и персонализированные услуги.',
  },
  {
    icon: Palette,
    title: 'Возможность развития креативных услуг',
    description:
      'Франшиза предоставляет проверенные технологии и идеи для создания художественных и коммерческих продуктов - от портретов до корпоративных подарков.',
  },
  {
    icon: GraduationCap,
    title: 'Поддержка и обучение от франчайзера',
    description:
      'Партнеры получают доступ к профессиональному обучению, маркетинговым материалам и технической поддержке, что снижает риски и ускоряет запуск бизнеса.',
  },
  {
    icon: TrendingUp,
    title: 'Высокая маржинальность',
    description:
      'Услуги по созданию уникальных изображений могут иметь хорошую прибыльность за счет высокой ценовой политики за эксклюзивные снимки.',
  },
  {
    icon: Zap,
    title: 'Развитие новых технологий',
    description:
      'Франшиза включает использование современных технологий (например, специального освещения или программного обеспечения), что повышает качество услуг.',
  },
  {
    icon: Package,
    title: 'Возможность расширения ассортимента услуг',
    description:
      'Со временем можно добавлять новые продукты - например, фотосессии с радужкой для корпоративных клиентов или создание персонализированных товаров.',
  },
  {
    icon: Coins,
    title: 'Минимальные инвестиции',
    description:
      'Франшиза позволяет начать бизнес с меньшими рисками и затратами, пользуясь проверенной моделью по сравнению с открытием собственного бизнеса.',
  },
  {
    icon: Lightbulb,
    title: 'Участие в инновационном тренде',
    description:
      'Фотография радужки глаза - это современное направление, которое привлекает внимание благодаря своей оригинальности и технологичности.',
  },
];

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = '' }: CardProps): JSX.Element => (
  <div
    className={`rounded-lg border bg-[#18171b] text-card-foreground shadow-sm p-6 ${className}`}
    style={{
      minHeight: 340,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    {children}
  </div>
);

const AdvantagesCarousel = (): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);
  const user = useAppSelector((store) => store.user.user?.user);

  return (
    <>
      <section id="advantages" className="py-24 bg-[#18171b]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Преимущества нашего направления, которые помогут вам построить успешный и прибыльный
              бизнес
            </p>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
            >
              {advantages.map(({ icon: IconComponent, title, description }) => (
                <SwiperSlide key={title}>
                  <Card className="flex flex-col justify-between h-[370px] w-full">
                    <div className="flex flex-col items-center text-center space-y-4 p-6 h-full flex-1">
                      <div className="p-3 bg-gradient-to-r from-[hsl(200,75%,55%)] to-[hsl(210,70%,40%)] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-iris">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {description}
                      </p>
                    </div>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="text-center mt-16">
            <div className="inline-block p-8 bg-[#18171b] rounded-3xl shadow-elegant">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Готовы стать частью инновации?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Присоединяйтесь к нашей семье партнеров и создайте успешный бизнес в уникальной нише
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[hsl(200,75%,55%)] to-[hsl(210,75%,35%)] text-white rounded-xl font-medium shadow-iris hover:shadow-gold transition-all duration-300"
                >
                  Узнать условия
                </button>
                <a href={Презентация} download>
                  <button className="px-6 py-3 bg-[#18171b] border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors">
                    Скачать презентацию
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PartnerFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} user={user} />
    </>
  );
};

export default AdvantagesCarousel;
