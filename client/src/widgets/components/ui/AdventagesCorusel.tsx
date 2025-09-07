import type { ReactNode, KeyboardEvent } from "react";
import React, { useState, useRef, useEffect, forwardRef } from "react";
import {
  Sparkles,
  Palette,
  GraduationCap,
  TrendingUp,
  Zap,
  Package,
  Coins,
  Lightbulb,
} from "lucide-react";

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`inline-block rounded-full px-4 py-1 font-semibold text-sm uppercase tracking-wide ${className}`}
  >
    {children}
  </span>
);

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-3xl bg-white bg-opacity-10 shadow-lg ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);


// Добавь остальные иконки по примеру выше (GraduationCapIcon, TrendingUpIcon, ZapIcon, PackageIcon, CoinsIcon, LightbulbIcon)

// Комплексный компонент карусели
type CarouselProps = {
  children: ReactNode;
  opts?: {
    align?: "start" | "center";
    loop?: boolean;
  };
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ children, opts = {}, className = "" }) => {
  const { align = "start", loop = false } = opts;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const childrenArray = React.Children.toArray(children);
  const itemsCount = childrenArray.length;

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const childrenElements = Array.from(container.children) as HTMLElement[];
    if (!childrenElements[index]) return;

    const target = childrenElements[index];
    if (align === "start") {
      container.scrollTo({
        left: target.offsetLeft,
        behavior: "smooth",
      });
    } else if (align === "center") {
      const offset =
        target.offsetLeft -
        container.offsetWidth / 2 +
        target.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  const next = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= itemsCount) {
      nextIndex = loop ? 0 : itemsCount - 1;
    }
    setCurrentIndex(nextIndex);
  };

  const prev = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = loop ? itemsCount - 1 : 0;
    }
    setCurrentIndex(prevIndex);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  return (
    <div
      className={`relative ${className}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div
        ref={containerRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {childrenArray}
      </div>
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        type="button"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        type="button"
      >
        ›
      </button>
    </div>
  );
};

const CarouselItem: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`snap-start flex-shrink-0 ${className}`}>{children}</div>
);

const CarouselContent = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(({ children, className = "" }, ref) => (
  <div ref={ref} className={`flex snap-x snap-mandatory overflow-x-auto scroll-smooth ${className}`}>
    {children}
  </div>
));
CarouselContent.displayName = "CarouselContent";


const AdvantagesCarousel = () => {
  const advantages = [
    {
      icon: Sparkles,
      title: "Уникальность",
      description:
        "Фотография радужки глаза - это уникальный сегмент, который выделяется среди стандартных фотосервисов. Это позволяет привлечь клиентов, ищущих необычные и персонализированные услуги.",
    },
    {
      icon: Palette,
      title: "Возможность развития креативных услуг",
      description:
        "Франшиза предоставляет проверенные технологии и идеи для создания художественных и коммерческих продуктов - от портретов до корпоративных подарков.",
    },
    {
      icon: GraduationCap,
      title: "Поддержка и обучение от франчайзера",
      description:
        "Партнеры получают доступ к профессиональному обучению, маркетинговым материалам и технической поддержке, что снижает риски и ускоряет запуск бизнеса.",
    },
    {
      icon: TrendingUp,
      title: "Высокая маржинальность",
      description:
        "Услуги по созданию уникальных изображений могут иметь хорошую прибыльность за счет высокой ценовой политики за эксклюзивные снимки.",
    },
    {
      icon: Zap,
      title: "Развитие новых технологий",
      description:
        "Франшиза включает использование современных технологий (например, специального освещения или программного обеспечения), что повышает качество услуг.",
    },
    {
      icon: Package,
      title: "Возможность расширения ассортимента услуг",
      description:
        "Со временем можно добавлять новые продукты - например, фотосессии с радужкой для корпоративных клиентов или создание персонализированных товаров.",
    },
    {
      icon: Coins,
      title: "Минимальные инвестиции",
      description:
        "Франшиза позволяет начать бизнес с меньшими рисками и затратами, пользуясь проверенной моделью по сравнению с открытием собственного бизнеса.",
    },
    {
      icon: Lightbulb,
      title: "Участие в инновационном тренде",
      description:
        "Фотография радужки глаза - это современное направление, которое привлекает внимание благодаря своей оригинальности и технологичности.",
    },
    // ... остальные пункты
  ];

  return (
    <section id="advantages" className="py-24 bg-gradient-to-b from-gray-900 to-gray-700 bg-opacity-80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-700 text-white border-0">Преимущества</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            Ваш бизнес — их взгляд
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Преимущества нашего направления, которые помогут вам построить успешный и прибыльный бизнес
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="gap-6">
            {advantages.map(({ icon: IconComponent, title, description }, idx) => (
              <CarouselItem key={idx} className="pl-2 md:pl-4 md:basis-1/3">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 border-0 shadow-lg hover:shadow-purple-700 transition-all duration-500 hover:-translate-y-2">
                  <CardContent>
                    <div className="flex flex-col items-center text-center space-y-4 h-full">
                      <div className="p-3 bg-gradient-to-r from-indigo-700 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed flex-1">
                        {description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 to-indigo-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="text-center mt-16">
          <div className="inline-block p-8 bg-gradient-card rounded-3xl shadow-elegant">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Готовы стать частью инновации?
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Присоединяйтесь к нашей семье партнеров и создайте успешный бизнес в уникальной нише
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500 transition-all duration-300 hover:scale-105">
                Узнать условия
              </button>
              <button className="px-6 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Скачать презентацию
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesCarousel;
