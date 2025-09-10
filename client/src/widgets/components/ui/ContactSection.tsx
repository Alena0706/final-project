import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Send } from 'lucide-react';
import type { JSX } from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode };

const Card = ({ children, className = '', ...props }: CardProps): JSX.Element => (
  <div
    className={`glass-effect rounded-xl border border-border/30 hover:border-[hsl(200_80%_70%)]/50 transition-all duration-300 backdrop-blur-md ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <div className={`p-4 pb-1 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <h3 className={`text-lg font-semibold text-foreground ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }: CardProps): React.ReactElement => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const faqData = [
  {
    id: 'faq-1',
    question: 'Какой опыт нужен для работы с франшизой?',
    answer: 'Специальный опыт не требуется. Мы предоставляем полное обучение.',
  },
  {
    id: 'faq-2',
    question: 'В каких городах можно открыть студию?',
    answer: 'В любом городе с населением от 100 000 человек.',
  },
  {
    id: 'faq-3',
    question: 'Сколько времени занимает запуск?',
    answer: 'От подписания договора до открытия: 2-4 недели.',
  },
];

const FAQ = (): JSX.Element => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {faqData.map(({ id, question, answer }) => {
        const isOpen = openId === id;
        return (
          <div key={id} className="rounded-lg border border-border bg-transparent">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="w-full flex justify-between items-center px-6 py-4 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-content-${id}`}
              id={`faq-header-${id}`}
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
                id={`faq-content-${id}`}
                role="region"
                aria-labelledby={`faq-header-${id}`}
                className="px-6 py-4 border-t border-border bg-white text-black rounded-b-lg transition-colors"
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

const contactInfo = [
  {
    id: 'contact-phone',
    icon: Phone,
    title: 'Телефон',
    details: ['+7 (908) 520-98-86'],
    subtitle: 'Звонки по России бесплатно',
    animationDelay: '0s',
  },
  {
    id: 'contact-telegram',
    icon: MessageCircle,
    title: 'Telegram',
    details: ['@tvooyvzglyad'],
    subtitle: 'Подписываетесь на наш телеграмм',
    animationDelay: '0.1s',
  },
  {
    id: 'contact-office',
    icon: MapPin,
    title: 'Офис',
    details: ['г. Пенза, ул. Московская, 37., ТЦ Высшая лига, 4 этаж.'],
    subtitle: 'Приём по предварительной записи',
    animationDelay: '0.2s',
  },
  {
    id: 'contact-schedule',
    icon: Clock,
    title: 'График работы',
    details: ['Пн-Пт: 12:00 - 21:00', 'Сб-Вс: 10:00 - 21:00'],
    subtitle: 'Московское время',
    animationDelay: '0.3s',
  },
];

const ContactSection = (): JSX.Element => (
  <section id="contact" className="section section-alt">
    <div className="container mx-auto px-4">
      {/* Заголовок */}
      <div className="text-center mb-10">
        <span className="inline-block glass-effect rounded-full px-5 py-1.5 text-xs font-medium uppercase mb-3">
          Контакты
        </span>
        <h2 className="heading-3 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-4">
          Свяжитесь с нами
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Готовы ответить на все ваши вопросы и помочь начать успешный бизнес
        </p>
      </div>

      {/* Две колонки: контакты + форма */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Контакты: четверть grid */}
        <Card>
          <CardHeader>
            <CardTitle>Как с нами связаться</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={info.id}
                    className="flex flex-col items-center text-center bg-[#18171b] rounded-lg p-6 h-full min-h-[160px] shadow-sm"
                  >
                    <div className="p-3 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl mb-3">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-foreground text-base mb-2">{info.title}</h4>
                    {info.details.map((detail) => (
                      <p key={detail} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                    <p className="text-xs text-muted-foreground/80 mt-2">{info.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Форма заявки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-4 w-4 text-primary" />
              <span>Оставить заявку</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Имя *</label>
                <input placeholder="Ваше имя" className="form-input h-10 text-base" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Телефон *</label>
                <input placeholder="+7 (___) ___-__-__" className="form-input h-10 text-base" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
              <input placeholder="your@email.com" className="form-input h-10 text-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Город</label>
              <input
                placeholder="В каком городе планируете открытие?"
                className="form-input h-10 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Сообщение</label>
              <textarea
                placeholder="Расскажите о ваших планах и вопросах..."
                className="form-input min-h-[90px] resize-vertical text-base"
              />
            </div>
            <button className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              Отправить заявку
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Below All */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Часто задаваемые вопросы</CardTitle>
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
