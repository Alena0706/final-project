import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'outline' | 'filled';
  children: React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Badge = ({ children, variant = 'filled', className = '', ...props }: BadgeProps) => {
  const base = 'inline-block rounded-full px-4 py-1 font-semibold text-sm uppercase tracking-wide';
  const variantClass =
    variant === 'outline'
      ? 'border border-current bg-transparent text-current'
      : 'bg-current text-white';

  return (
    <span className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Card = ({ children, className = '', ...props }: CardProps) => (
  <div className={`bg-gradient-card border-0 shadow-elegant rounded-3xl ${className}`} {...props}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardContent = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardHeader = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
  <div className={`border-b border-border pb-4 mb-6 ${className}`} {...props}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardTitle = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
  <h3 className={`text-lg font-semibold text-foreground ${className}`} {...props}>
    {children}
  </h3>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Input = ({ className = '', ...props }: InputProps) => (
  <input
    className={`w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Textarea = ({ className = '', ...props }: TextareaProps) => (
  <textarea
    className={`w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
);

import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContactSection = () => {
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
      details: [' г. Пенза, ул. Московская, 37., ТЦ Высшая лига, 4 этаж.'],
      subtitle: 'Приём по предварительной записи',
    },
    {
      icon: Clock,
      title: 'График работы',
      details: ['Пн-Пт: 12:00 - 21:00', 'Сб-Вс: 10:00 - 21:00'],
      subtitle: 'Московское время',
    },
  ];
  return (
    <section id="contact" className="section section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-2 mb-4">
            <span className="text-foreground font-medium uppercase tracking-wide text-sm">
              Контакты
            </span>
          </div>
          <h2 className="heading-2 text-gradient-primary mb-6">Свяжитесь с нами</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Готовы ответить на все ваши вопросы и помочь начать успешный бизнес
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Контактная информация */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">Как с нами связаться</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={index}
                    className="card group animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-gradient-iris rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-foreground">{info.title}</h4>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
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
            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardContent>
                <h4 className="font-semibold text-foreground mb-4">Часто задаваемые вопросы</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Q:</strong> Какой опыт нужен для работы с франшизой?
                  </p>
                  <p>
                    <strong>A:</strong> Специальный опыт не требуется. Мы предоставляем полное
                    обучение.
                  </p>
                  <p>
                    <strong>Q:</strong> В каких городах можно открыть студию?
                  </p>
                  <p>
                    <strong>A:</strong> В любом городе с населением от 100 000 человек.
                  </p>
                  <p>
                    <strong>Q:</strong> Сколько времени занимает запуск?
                  </p>
                  <p>
                    <strong>A:</strong> От подписания договора до открытия: 2-4 недели.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Форма обратной связи */}
          <div>
            <Card className="bg-gradient-card border-0 shadow-elegant">
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
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Телефон *
                    </label>
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
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Сообщение
                  </label>
                  <textarea
                    placeholder="Расскажите о ваших планах и вопросах..."
                    className="form-input min-h-[100px] resize-vertical"
                  ></textarea>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
