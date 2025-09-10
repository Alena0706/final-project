import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'outline' | 'filled';
  children: React.ReactNode;
};

const Badge = ({ children, variant = 'filled', className = '', ...props }: BadgeProps): React.JSX.Element => {
  const baseStyle =
    'inline-block rounded-full px-4 py-1 font-semibold text-sm uppercase tracking-wide';
  const variantStyle =
    variant === 'outline'
      ? 'border border-[hsl(200_80%_70%)] bg-transparent text-[hsl(200_80%_70%)]'
      : 'bg-[hsl(200_75%_55%)] text-white';

  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </span>
  );
};

  

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardContent = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }): React.JSX.Element => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

import { MapPin, Calendar, Users, Award } from 'lucide-react';

const BrandSection = (): React.JSX.Element => {
  const milestones = [
    { year: '2023', event: 'Основание компании в Пензе', icon: Calendar },
    {
      year: '2023',
      event: 'Первая профессиональная фотография радужки',
      icon: Award,
    },
    { year: '2023', event: 'Создание отдела ретуши', icon: Users },
    { year: '2024', event: 'Переезд в ТЦ «Высшая Лига»', icon: MapPin },
    { year: '2024', event: 'Открытие в 6 городах', icon: MapPin },
  ];

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        {/* Описание бренда */}
        <div className="mb-20">
          <div className="text-center mb-16 animate-fade-in">
            <div className="sr-only">
              <span className="text-foreground font-medium uppercase tracking-wide text-sm">
                Описание бренда
              </span>
            </div>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Пионеры в области профессиональной фотографии радужки глаза в России
            </p>
          </div>
        </div>
        {/* Наша история */}
        <div className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="heading-3 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              Наша история
            </h3>
          </div>
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="card">
              <CardContent className="p-8 md:p-12 text-muted-foreground space-y-6 text-lg leading-relaxed">
                <p>
                  <span className="font-semibold text-foreground">
                    Наша компания начала свой путь в 2023 году в городе Пенза.
                  </span>{' '}
                  Всё началось с идеи заполнить нишу на рынке услуг по фотографированию радужки
                  глаза — направления, которое было малоизвестным и практически не имело
                  конкурентов.
                </p>
                <p>
                  Основатель, уже имевший{' '}
                  <span className="font-semibold text-accent">
                    12-летний опыт в сфере фотографии
                  </span>
                  , решил создать уникальный продукт и развивать его. Отличительной чертой нашего
                  подхода стало самостоятельное создание всех процессов и подбор техники.
                </p>
                <p>
                  В нашем офисе мы экспериментировали с оборудованием: использовали фотоаппарат,
                  макрообъектив и разного рода освещение. В результате мы создали{' '}
                  <span className="font-semibold text-primary">
                    первую профессиональную фотографию радужки глаза
                  </span>
                  , которая стала отправной точкой для дальнейшего развития.
                </p>
                <p>
                  Для достижения высокого качества мы организовали{' '}
                  <span className="font-semibold text-accent">
                    отдельный отдел по обработке фотографий
                  </span>{' '}
                  и обучили команду топовых ретушеров. Это позволило нам предлагать клиентам
                  исключительно качественный продукт.
                </p>
                <p>
                  Первоначально мы работали в офисе по записям, что помогло нам отточить процессы и
                  понять потребности клиентов. Постепенно поток клиентов увеличивался, и чтобы
                  обеспечить удобство для наших гостей, мы переехали в торговый центр{' '}
                  <span className="font-semibold text-primary">«Высшая Лига» в Пензе</span>.
                </p>
                <p>
                  Осознав потенциал развития, мы{' '}
                  <span className="font-semibold text-accent">
                    за полгода открыли еще пять городов
                  </span>
                  , расширяя свою географию и укрепляя позиции на рынке. Наш прогресс продолжается -
                  мы постоянно растем и совершенствуемся.
                </p>
              </CardContent>
            </div>
          </div>
        </div>
        {/* Временная линия - горизонтальная */}
        <div className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="heading-3 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              Ключевые вехи
            </h3>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {milestones.map((milestone) => {
                const IconComponent = milestone.icon;
                return (
                  <div
                    key={`${milestone.year}-${milestone.event}`}
                    className="flex-shrink-0 flex items-center gap-6 p-6 card group animate-slide-up"
                    style={{ minWidth: '280px' }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl flex items-center justify-center shadow-iris group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {milestone.year}
                        </Badge>
                      </div>
                      <p className="text-foreground font-medium">{milestone.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Призыв к действию */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="card inline-block">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Станьте частью нашей истории
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Присоединяйтесь к растущей сети партнеров и создайте свою историю успеха в уникальной
              нише
            </p>
            <button className="btn-primary">Связаться с нами</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
