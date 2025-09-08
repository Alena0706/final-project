import React from 'react';
import { useEditablePlaceholder, useEditableValue } from '../hooks/useEditablePlaceholder';

interface EditableInputProps {
  placeholder: string;
  initialValue?: string;
  className?: string;
  type?: string;
  onChange?: (value: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  [key: string]: any; // Для дополнительных props
}

/**
 * Компонент инпута с редактируемым placeholder
 * Placeholder текст можно редактировать как обычное значение
 */
export const EditableInput: React.FC<EditableInputProps> = ({
  placeholder,
  initialValue = '',
  className = '',
  type = 'text',
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const {
    ref,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onInput: handleInput,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    defaultValue,
  } = useEditablePlaceholder(placeholder, initialValue, {
    onFocus,
    onBlur,
    onInput: (e) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
  });

  const { getValue, isEmpty, isPlaceholder } = useEditableValue(ref, placeholder);

  // Устанавливаем значение по умолчанию
  React.useEffect(() => {
    if (ref.current && (!ref.current.value || ref.current.value.trim() === '')) {
      ref.current.value = placeholder;
      ref.current.classList.add('placeholder-as-value');
    }
  }, [placeholder]);

  return (
    <input
      ref={ref}
      type={type}
      className={`${className} ${isPlaceholder() ? 'placeholder-as-value' : ''}`}
      data-editable-placeholder="true"
      defaultValue={defaultValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export default EditableInput;
