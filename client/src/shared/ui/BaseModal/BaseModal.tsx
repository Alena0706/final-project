import React, { useEffect, useState } from 'react';
import { BaseModalProps } from './types';

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
  contentClassName = '',
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Анимация появления/исчезновения
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Добавляем класс к body для отключения hover эффектов
      document.body.classList.add('modal-open');
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Убираем класс с body
      document.body.classList.remove('modal-open');
      // Ждем завершения анимации перед удалением из DOM
      setTimeout(() => setShouldRender(false), 300);
    }

    // Cleanup функция для удаления класса при размонтировании
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Размеры модального окна
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      default:
        return 'max-w-md';
    }
  };

  if (!shouldRender) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-container fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onClick={handleBackdropClick}
      style={{
        willChange: 'opacity',
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className={`dark-glass rounded-xl shadow-elegant p-6 w-full ${getSizeClasses()} mx-4 text-foreground max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        } ${contentClassName}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          willChange: 'opacity, transform',
          transition:
            'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center center',
        }}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg transition-colors"
              type="button"
              style={{
                transition: 'color 200ms ease, background-color 200ms ease',
              }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Содержимое */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
