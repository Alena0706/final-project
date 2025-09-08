/**
 * Простая утилита для создания редактируемых placeholder
 * Более надежная версия с принудительной установкой значений
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

  // Принудительно устанавливаем placeholder как значение
  inputElement.value = placeholder;
  inputElement.classList.add('placeholder-as-value');
  inputElement.setAttribute('data-placeholder-value', 'true');

  console.log('Placeholder установлен как значение:', placeholder);

  // Обработчик фокуса
  inputElement.addEventListener('focus', function () {
    if (this.value === placeholder) {
      // Выделяем весь текст для удобного редактирования
      this.select();
    }
    this.classList.remove('placeholder-as-value');
  });

  // Обработчик потери фокуса
  inputElement.addEventListener('blur', function () {
    // Если поле пустое, возвращаем placeholder
    if (!this.value || this.value.trim() === '') {
      this.value = placeholder;
      this.classList.add('placeholder-as-value');
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
    // Принудительно устанавливаем placeholder как значение
    const placeholder = input.getAttribute('placeholder');
    if (placeholder) {
      input.value = placeholder;
      input.classList.add('placeholder-as-value');
      input.setAttribute('data-placeholder-value', 'true');
    }

    makePlaceholderEditable(input);
  });
}

/**
 * Инициализация с задержкой
 */
export function initWithDelay(delay = 100) {
  setTimeout(() => {
    initEditablePlaceholders();
  }, delay);
}

// Автоматическая инициализация
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initEditablePlaceholders();
  });

  // Дополнительная инициализация с задержкой
  setTimeout(() => {
    initEditablePlaceholders();
  }, 500);
}
