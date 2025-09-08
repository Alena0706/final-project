/**
 * Простая система редактируемых placeholder
 * Работает автоматически для всех инпутов с атрибутом data-editable-placeholder
 */

(function () {
  'use strict';

  // Функция для инициализации одного инпута
  function initEditableInput(input) {
    const placeholder = input.getAttribute('placeholder');
    if (!placeholder) return;

    // Устанавливаем placeholder как значение по умолчанию
    if (!input.value || input.value.trim() === '') {
      input.value = placeholder;
      input.classList.add('editable-placeholder');
    }

    // Обработчик фокуса
    input.addEventListener('focus', function () {
      if (this.value === placeholder) {
        this.select();
      }
      this.classList.remove('editable-placeholder');
    });

    // Обработчик потери фокуса
    input.addEventListener('blur', function () {
      if (!this.value || this.value.trim() === '') {
        this.value = placeholder;
        this.classList.add('editable-placeholder');
      }
    });

    // Обработчик ввода
    input.addEventListener('input', function () {
      if (this.value !== placeholder) {
        this.classList.remove('editable-placeholder');
      }
    });

    // Обработчик клика
    input.addEventListener('click', function () {
      if (this.value === placeholder) {
        this.select();
      }
    });

    // Обработчик keydown - ключевое исправление
    input.addEventListener('keydown', function (e) {
      if (this.value === placeholder && e.key.length === 1) {
        this.value = '';
        this.classList.remove('editable-placeholder');
      }
    });
  }

  // Функция для инициализации всех инпутов
  function initAllEditableInputs() {
    const inputs = document.querySelectorAll('input[data-editable-placeholder]');
    inputs.forEach(initEditableInput);
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllEditableInputs);
  } else {
    initAllEditableInputs();
  }

  // Дополнительная инициализация с задержкой для динамически добавленных элементов
  setTimeout(initAllEditableInputs, 100);
  setTimeout(initAllEditableInputs, 500);

  // Экспорт для ручной инициализации
  window.initEditablePlaceholders = initAllEditableInputs;
})();
