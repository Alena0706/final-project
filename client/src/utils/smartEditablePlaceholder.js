/**
 * Умная утилита для создания редактируемых placeholder
 * Правильно обрабатывает редактирование текста
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
  inputElement.value = placeholder;
  inputElement.classList.add('placeholder-as-value');
  inputElement.setAttribute('data-placeholder-value', 'true');

  console.log('Placeholder установлен как значение:', placeholder);

  // Флаг для отслеживания редактирования
  let isEditing = false;

  // Обработчик фокуса
  inputElement.addEventListener('focus', function () {
    if (this.value === placeholder) {
      // Выделяем весь текст для удобного редактирования
      this.select();
      isEditing = true;
    }
    this.classList.remove('placeholder-as-value');
  });

  // Обработчик потери фокуса
  inputElement.addEventListener('blur', function () {
    isEditing = false;
    // Если поле пустое, возвращаем placeholder
    if (!this.value || this.value.trim() === '') {
      this.value = placeholder;
      this.classList.add('placeholder-as-value');
    }
  });

  // Обработчик ввода - ключевое исправление
  inputElement.addEventListener('input', function (e) {
    const currentValue = this.value;

    // Если пользователь начал печатать и значение равно placeholder
    if (isEditing && currentValue === placeholder) {
      // Не делаем ничего, позволяем пользователю редактировать
      return;
    }

    // Если поле не пустое и не равно placeholder
    if (currentValue && currentValue !== placeholder) {
      this.classList.remove('placeholder-as-value');
      isEditing = true;
    }

    // Если поле стало пустым
    if (currentValue === '') {
      this.value = placeholder;
      this.classList.add('placeholder-as-value');
      isEditing = false;
    }
  });

  // Обработчик клика
  inputElement.addEventListener('click', function () {
    if (this.value === placeholder) {
      this.select();
      isEditing = true;
    }
  });

  // Обработчик keydown для лучшего контроля
  inputElement.addEventListener('keydown', function (e) {
    // Если пользователь нажал клавишу и значение равно placeholder
    if (this.value === placeholder && e.key.length === 1) {
      // Очищаем поле и позволяем вводить новый текст
      this.value = '';
      this.classList.remove('placeholder-as-value');
      isEditing = true;
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
