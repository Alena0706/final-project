import React from 'react';

const EyeIcon = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const AwardIcon = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l5 9-5 9-5-9 5-9z" />
    <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const AboutSection = (): React.JSX.Element => {
  const features = [
    {
      id: 'feature-unique-tech',
      icon: EyeIcon,
      title: 'Уникальная технология',
      description:
        'Профессиональная фотография радужки глаза с использованием специального оборудования и программного обеспечения',
      animationDelay: '0s',
    },
    {
      id: 'feature-personalized',
      icon: TargetIcon,
      title: 'Персонализированный подход',
      description:
        'Каждый снимок - это произведение искусства, созданное индивидуально для клиента',
      animationDelay: '0.1s',
    },
    {
      id: 'feature-wide-audience',
      icon: UsersIcon,
      title: 'Широкая аудитория',
      description: 'От личных портретов до корпоративных подарков - наши услуги востребованы везде',
      animationDelay: '0.2s',
    },
    {
      id: 'feature-high-quality',
      icon: AwardIcon,
      title: 'Высокое качество',
      description:
        'Только проверенные технологии и профессиональное оборудование для идеального результата',
      animationDelay: '0.3s',
    },
  ];

  return (
    <section id="about" className="section section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="sr-only">
            <span className="text-foreground font-medium uppercase tracking-wide text-sm">
              О нас
            </span>
          </div>
          <h2 className="heading-2 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
            Магия взгляда в деталях
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы создаем уникальные художественные портреты радужки глаза, превращая каждый взгляд в
            произведение искусства
          </p>
        </div>
        {/* Наша миссия */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            {/* <h3 className="heading-3 text-foreground mb-8">Наша история и миссия</h3> */}
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {/* <p>
                Основанная в 2023 году, наша франшиза стала пионером в области профессиональной
                фотографии радужки глаза в России. Мы объединили передовые технологии,
                художественное видение и предпринимательский дух.
              </p> */}
              <p>
                Наша миссия - сделать уникальное искусство фотографии радужки доступным в каждом
                городе, предоставляя партнерам все необходимые инструменты для успешного бизнеса.
              </p>
              <p>
                Каждая радужка уникальна, как отпечаток пальца, и мы помогаем людям открыть и
                сохранить эту красоту навсегда.
              </p>
            </div>
          </div>
        </div>

        {/* Почему радужка? */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-[hsl(200_80%_70%)]/10 rounded-3xl blur-3xl opacity-50"></div>
              <div className="card relative">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-2xl mb-6 shadow-iris">
                    <EyeIcon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-6">Почему радужка?</h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Радужка глаза содержит более 250 уникальных характеристик, что делает её в 5 раз
                    более уникальной, чем отпечаток пальца. Это настоящее произведение природного
                    искусства.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Наши особенности */}
        <div className="text-center mb-12">
          <h3 className="heading-3 text-foreground mb-4">Наши особенности</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Что делает нас уникальными в сфере фотографии радужки глаза
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="card group animate-slide-up"
                style={{ animationDelay: feature.animationDelay }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-iris">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(200_80%_70%)] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
