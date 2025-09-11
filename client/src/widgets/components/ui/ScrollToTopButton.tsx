import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показываем кнопку после прокрутки на 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[hsl(200_80%_70%)] focus:ring-offset-2 group"
      aria-label="Прокрутить наверх"
    >
      <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
};

export default ScrollToTopButton;
