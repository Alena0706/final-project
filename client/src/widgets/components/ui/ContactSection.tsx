import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

// Карточки и заголовки
type CardProps = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode };
const Card = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <div
    className={`glass-effect rounded-xl border border-border/30 hover:border-[hsl(200_80%_70%)]/50 transition-all duration-300 backdrop-blur-md ${className}`}
    {...props}
  >
    {children}
  </div>
);
const CardHeader = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <div className={`p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <h3 className={`text-xl font-semibold text-foreground ${className}`} {...props}>
    {children}
  </h3>
);
const CardContent = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// FAQ данные (один раз, без дублирования)
const faqData = [
  {
    question: 'Какой опыт нужен для работы с франшизой?',
    answer: 'Специальный опыт не требуется. Мы предоставляем полное обучение.',
  },
  {
    question: 'В каких городах можно открыть студию?',
    answer: 'В любом городе с населением от 100 000 человек.',
  },
  {
    question: 'Сколько времени занимает запуск?',
    answer: 'От подписания договора до открытия: 2-4 недели.',
  },
];

// FAQ компонент с аккордеоном
const FAQ = (): React.ReactElement => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqData.map(({ question, answer }, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={`faq-${String(index)}`}
            className="rounded-lg border border-border bg-transparent"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex justify-between items-center px-6 py-4 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-content-${String(index)}`}
              id={`faq-header-${String(index)}`}
            >
              <span>{question}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div
                id={`faq-content-${String(index)}`}
                role="region"
                aria-labelledby={`faq-header-${String(index)}`}
                className="px-6 py-4 border-t border-border text-foreground rounded-b-lg transition-colors"
              >
                {answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Контактная информация
const contactInfo = [
  {
    icon: Phone,
    title: 'Телефон',
    details: ['+7 (908) 520-98-86'],
    subtitle: 'Звонки по России бесплатно',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['@tvooyvzglyad'],
    subtitle: 'Подписываетесь на наш телеграмм',
  },
  {
    icon: MapPin,
    title: 'Офис',
    details: ['г. Пенза, ул. Московская, 37., ТЦ Высшая лига, 4 этаж.'],
    subtitle: 'Приём по предварительной записи',
  },
  {
    icon: Clock,
    title: 'График работы',
    details: ['Пн-Пт: 12:00 - 21:00', 'Сб-Вс: 10:00 - 21:00'],
    subtitle: 'Московское время',
  },
];

// Основной компонент секции контактов
const ContactSection = (): React.ReactElement => (
  <section id="contact" className="section section-alt">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-2 mb-4 ">
          <span className="text-foreground font-medium uppercase tracking-wide text-sm">
            Контакты
          </span>
        </div>
        <h2 className="heading-2 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
          Свяжитесь с нами
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Готовы ответить на все ваши вопросы и помочь начать успешный бизнес
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {/* 1. Как с нами связаться */}
        <Card>
          <CardHeader>
            <CardTitle>Как с нами связаться</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={`contact-${String(index)}`}
                    className="card group animate-slide-up"
                    style={{ animationDelay: `${String(index * 0.1)}s` }}
                  >
                    <CardContent>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-foreground">{info.title}</h4>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p
                              key={`detail-${String(idx)}`}
                              className="text-sm text-muted-foreground"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground/80">{info.subtitle}</p>
                      </div>
                    </CardContent>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        {/* 2. Оставить заявку */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-primary" />
              <span>Оставить заявку</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Имя *</label>
                <input placeholder="Ваше имя" className="form-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Телефон *</label>
                <input placeholder="+7 (___) ___-__-__" className="form-input" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
              <input placeholder="your@email.com" className="form-input" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Город</label>
              <input placeholder="В каком городе планируете открытие?" className="form-input" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Сообщение</label>
              <textarea
                placeholder="Расскажите о ваших планах и вопросах..."
                className="form-input min-h-[100px] resize-vertical"
              />
            </div>
            <button className="btn-primary w-full">
              <Send className="h-4 w-4 mr-2" />
              Отправить заявку
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </CardContent>
        </Card>
        {/* 3. Часто задаваемые вопросы с интерактивным аккордеоном */}
        <Card>
          <CardHeader>
            <CardTitle>Часто задаваемые вопросы</CardTitle>
          </CardHeader>
          <CardContent>
            <FAQ />
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

export default ContactSection;
