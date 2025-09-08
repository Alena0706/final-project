import React from 'react';

const EyeIcon = ({ className }: { className?: string }) => (
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

const TargetIcon = ({ className }: { className?: string }) => (
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

const UsersIcon = ({ className }: { className?: string }) => (
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

const AwardIcon = ({ className }: { className?: string }) => (
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

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`inline-block rounded-full px-4 py-1 font-semibold text-sm uppercase tracking-wide ${className}`}
  >
    {children}
  </span>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-3xl bg-white bg-opacity-10 shadow-lg ${className}`}>{children}</div>
);

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;

const AboutSection = () => {
  const features = [
    {
      icon: EyeIcon,
      title: 'Уникальная технология',
      description:
        'Профессиональная фотография радужки глаза с использованием специального оборудования и программного обеспечения',
    },
    {
      icon: TargetIcon,
      title: 'Персонализированный подход',
      description:
        'Каждый снимок - это произведение искусства, созданное индивидуально для клиента',
    },
    {
      icon: UsersIcon,
      title: 'Широкая аудитория',
      description: 'От личных портретов до корпоративных подарков - наши услуги востребованы везде',
    },
    {
      icon: AwardIcon,
      title: 'Высокое качество',
      description:
        'Только проверенные технологии и профессиональное оборудование для идеального результата',
    },
  ];

  return (
    <section id="about" className="section section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-2 mb-4">
            <span className="text-foreground font-medium uppercase tracking-wide text-sm">
              О нас
            </span>
          </div>
          <h2 className="heading-2 text-gradient-primary mb-6">Магия взгляда в деталях</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы создаем уникальные художественные портреты радужки глаза, превращая каждый взгляд в
            произведение искусства
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-up">
            <h3 className="heading-3 text-foreground mb-6">Наша история и миссия</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Основанная в 2023 году, наша франшиза стала пионером в области профессиональной
                фотографии радужки глаза в России. Мы объединили передовые технологии,
                художественное видение и предпринимательский дух.
              </p>
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
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl opacity-50"></div>
            <div className="card relative">
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-iris rounded-2xl mb-4 shadow-iris">
                  <EyeIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-4">Почему радужка?</h4>
                <p className="text-muted-foreground">
                  Радужка глаза содержит более 250 уникальных характеристик, что делает её в 5 раз
                  более уникальной, чем отпечаток пальца. Это настоящее произведение природного
                  искусства.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="card group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-gradient-iris rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-iris">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
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
