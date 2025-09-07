import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'outline' | 'filled';
  children: React.ReactNode;
};

const Badge = ({ children, variant = 'filled', className = '', ...props }: BadgeProps) => {
  const baseStyles =
    'inline-block rounded-full px-4 py-1 font-semibold text-sm uppercase tracking-wide';
  const variantStyles =
    variant === 'outline'
      ? 'border border-current bg-transparent text-current'
      : 'bg-current text-white';

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const Card = ({ children, className = '', ...props }: CardProps) => (
  <div
    className={`group relative overflow-hidden bg-gradient-card border-0 shadow-elegant rounded-xl transition-all duration-500 hover:shadow-iris hover:-translate-y-2 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
  <div className={`p-6 h-full ${className}`} {...props}>
    {children}
  </div>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium shadow-iris text-white bg-gradient-iris hover:shadow-gold hover:scale-105 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = '', ...props }: InputProps) => (
  <input
    className={`w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ className = '', ...props }: TextareaProps) => (
  <textarea
    className={`w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] ${className}`}
    {...props}
  />
);

import { MapPin, Play, Image as ImageIcon } from 'lucide-react';

const GallerySection = () => {
  const galleryItems = [
    {
      id: 1,
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      city: 'Москва',
      location: 'ТЦ Европейский',
      description: 'Премиальная точка в центре Москвы',
    },
    {
      id: 2,
      type: 'video',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      city: 'Санкт-Петербург',
      location: 'Невский проспект',
      description: 'Стильная студия на главной улице города',
    },
    {
      id: 3,
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      city: 'Екатеринбург',
      location: 'ТРЦ Гринвич',
      description: 'Современное оборудование и уютная атмосфера',
    },
    {
      id: 4,
      type: 'video',
      image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=300&fit=crop',
      city: 'Казань',
      location: 'ТЦ Южный',
      description: 'Высокотехнологичная студия',
    },
    {
      id: 5,
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=300&fit=crop',
      city: 'Новосибирск',
      location: 'Красный проспект',
      description: 'Эксклюзивная точка в деловом центре',
    },
    {
      id: 6,
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400&h=300&fit=crop',
      city: 'Краснодар',
      location: 'ТЦ Галерея',
      description: 'Яркий дизайн и профессиональный подход',
    },
  ];

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Галерея и примеры
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Посмотрите, как выглядит наш бизнес в разных городах России
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden bg-gradient-card border-0 shadow-elegant hover:shadow-iris transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={`${item.city} - ${item.location}`}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                      <Play className="h-8 w-8 text-white" fill="currentColor" />
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="filled" className="bg-black/50 text-white border-0">
                    {item.type === 'video' ? (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Видео
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Фото
                      </>
                    )}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">{item.city}</span>
                  </div>
                  <p className="text-sm opacity-90">{item.location}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>
        <div className="text-center mt-16">
          <div className="inline-block p-8 bg-gradient-card rounded-3xl shadow-elegant">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Хотите увидеть больше?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Получите полную презентацию с фото и видео всех наших точек
            </p>
            <Button>Запросить полную галерею</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
