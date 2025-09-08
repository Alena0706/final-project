import { useEffect, useRef } from 'react';
import { makePlaceholderEditable } from '../utils/editablePlaceholder';

/**
 * React хук для создания инпута с редактируемым placeholder
 *
 * @param {string} placeholder - Текст placeholder
 * @param {string} initialValue - Начальное значение
 * @param {object} options - Дополнительные опции
 * @returns {object} - Объект с ref и обработчиками
 */
export function useEditablePlaceholder(placeholder, initialValue = '', options = {}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      // Устанавливаем placeholder как значение, если инпут пустой
      if (!inputRef.current.value || inputRef.current.value.trim() === '') {
        inputRef.current.value = placeholder;
        inputRef.current.classList.add('placeholder-as-value');
        console.log('React: Placeholder установлен как значение:', placeholder);
      }

      // Инициализируем редактируемый placeholder
      makePlaceholderEditable(inputRef.current);
    }
  }, [placeholder]);

  // Дополнительный useEffect для случаев когда элемент появляется позже
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        if (!inputRef.current.value || inputRef.current.value.trim() === '') {
          inputRef.current.value = placeholder;
          inputRef.current.classList.add('placeholder-as-value');
        }
        makePlaceholderEditable(inputRef.current);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [placeholder]);

  const handleFocus = (e) => {
    if (e.target.value === placeholder) {
      e.target.select();
    }
    if (options.onFocus) {
      options.onFocus(e);
    }
  };

  const handleBlur = (e) => {
    if (!e.target.value || e.target.value.trim() === '') {
      e.target.value = placeholder;
      e.target.classList.add('placeholder-as-value');
    } else {
      e.target.classList.remove('placeholder-as-value');
    }
    if (options.onBlur) {
      options.onBlur(e);
    }
  };

  const handleInput = (e) => {
    const currentValue = e.target.value;

    // Если поле не пустое и не равно placeholder
    if (currentValue && currentValue !== placeholder) {
      e.target.classList.remove('placeholder-as-value');
    }

    // Если поле стало пустым, восстанавливаем placeholder
    if (currentValue === '') {
      e.target.value = placeholder;
      e.target.classList.add('placeholder-as-value');
    }

    if (options.onInput) {
      options.onInput(e);
    }
  };

  const handleClick = (e) => {
    if (e.target.value === placeholder) {
      e.target.select();
    }
    if (options.onClick) {
      options.onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    // Если пользователь нажал клавишу и значение равно placeholder
    if (e.target.value === placeholder && e.key.length === 1) {
      // Очищаем поле и позволяем вводить новый текст
      e.target.value = '';
      e.target.classList.remove('placeholder-as-value');
    }
    if (options.onKeyDown) {
      options.onKeyDown(e);
    }
  };

  return {
    ref: inputRef,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onInput: handleInput,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    placeholder,
    defaultValue: initialValue || placeholder,
  };
}

/**
 * Хук для получения значения инпута с учетом placeholder
 *
 * @param {React.RefObject} inputRef - Ссылка на инпут
 * @param {string} placeholder - Текст placeholder
 * @returns {string} - Актуальное значение инпута
 */
export function useEditableValue(inputRef, placeholder) {
  const getValue = () => {
    if (!inputRef.current) return '';

    const value = inputRef.current.value;
    // Если значение равно placeholder, считаем поле пустым
    return value === placeholder ? '' : value;
  };

  const isEmpty = () => {
    return getValue() === '';
  };

  const isPlaceholder = () => {
    return inputRef.current?.value === placeholder;
  };

  return {
    getValue,
    isEmpty,
    isPlaceholder,
  };
}
