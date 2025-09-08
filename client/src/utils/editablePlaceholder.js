/**
 * Утилита для создания редактируемых placeholder в инпутах
 * Позволяет пользователю редактировать placeholder текст как обычное значение
 */

export function makePlaceholderEditable(inputElement) {
  if (!inputElement || inputElement.tagName !== 'INPUT') {
    console.warn('makePlaceholderEditable: элемент должен быть input');
    return;
  }

  const placeholder = inputElement.getAttribute('placeholder');
  if (!placeholder) {
    console.warn('makePlaceholderEditable: у инпута нет placeholder');
    return;
  }

  // Устанавливаем placeholder как значение по умолчанию
  if (!inputElement.value || inputElement.value.trim() === '') {
    inputElement.value = placeholder;
    inputElement.classList.add('placeholder-as-value');
    console.log('Placeholder установлен как значение:', placeholder);
  }

  // Обработчик фокуса
  inputElement.addEventListener('focus', function () {
    if (this.value === placeholder) {
      // Выделяем весь текст для удобного редактирования
      this.select();
    }
  });

  // Обработчик потери фокуса
  inputElement.addEventListener('blur', function () {
    // Если поле пустое, возвращаем placeholder
    if (!this.value || this.value.trim() === '') {
      this.value = placeholder;
      this.classList.add('placeholder-as-value');
    } else {
      this.classList.remove('placeholder-as-value');
    }
  });

  // Обработчик ввода
  inputElement.addEventListener('input', function () {
    if (this.value !== placeholder) {
      this.classList.remove('placeholder-as-value');
    }

    // Если поле стало пустым, восстанавливаем placeholder
    if (this.value === '') {
      this.value = placeholder;
      this.classList.add('placeholder-as-value');
    }
  });

  // Обработчик клика
  inputElement.addEventListener('click', function () {
    if (this.value === placeholder) {
      this.select();
    }
  });
}

/**
 * Инициализация всех инпутов с атрибутом data-editable-placeholder
 */
export function initEditablePlaceholders() {
  const inputs = document.querySelectorAll('input[data-editable-placeholder]');
  console.log('Найдено инпутов с data-editable-placeholder:', inputs.length);
  inputs.forEach((input) => {
    makePlaceholderEditable(input);
  });
}

/**
 * Инициализация инпута с задержкой (для случаев когда элемент еще не готов)
 */
export function initEditablePlaceholderWithDelay(inputElement, delay = 100) {
  setTimeout(() => {
    makePlaceholderEditable(inputElement);
  }, delay);
}

/**
 * Создание инпута с редактируемым placeholder
 */
export function createEditableInput(options = {}) {
  const { placeholder = '', value = '', className = '', type = 'text', ...otherProps } = options;

  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.value = value || placeholder;
  input.className = className;
  input.setAttribute('data-editable-placeholder', 'true');

  // Применяем дополнительные свойства
  Object.keys(otherProps).forEach((key) => {
    input.setAttribute(key, otherProps[key]);
  });

  // Инициализируем редактируемый placeholder
  makePlaceholderEditable(input);

  return input;
}

// Автоматическая инициализация при загрузке DOM
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initEditablePlaceholders);
}
