import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const Card = ({ children, className = "", ...props }: CardProps) => (
  <div
    className={`group relative overflow-hidden bg-gradient-card border-0 shadow-elegant hover:shadow-iris transition-all duration-500 hover:-translate-y-2 h-full rounded-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
  <div className={`p-6 h-full ${className}`} {...props}>
    {children}
  </div>
);

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

const AdvantagesSection = () => {
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
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-700 bg-opacity-80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            Ваш бизнес — их взгляд
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Преимущества нашего направления, которые помогут вам построить успешный и прибыльный бизнес
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map(({ icon: IconComponent, title, description }, idx) => (
            <Card key={idx} className="group relative overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 border-0 shadow-lg hover:shadow-purple-700 transition-all duration-500 hover:-translate-y-2">
              <CardContent>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gradient-to-r from-indigo-700 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 to-indigo-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>
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

export default AdvantagesSection;
