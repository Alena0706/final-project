# Простое использование редактируемых placeholder

## ✅ Готово! Система уже подключена к проекту

Скрипт автоматически загружается и работает для всех инпутов с атрибутом
`data-editable-placeholder`.

## Как использовать

### 1. Добавьте атрибут к любому инпуту

```html
<input
  placeholder="Алёна ТимЛид"
  data-editable-placeholder="true"
  class="w-full rounded-md border px-3 py-2"
/>
```

### 2. Всё! Больше ничего не нужно

Система автоматически:

- Показывает placeholder как значение по умолчанию
- При клике выделяет весь текст
- При нажатии клавиши очищает поле для ввода
- При очистке восстанавливает placeholder

## Примеры

### Обычный инпут

```html
<input type="text" placeholder="Введите имя" data-editable-placeholder="true" class="form-input" />
```

### Disabled инпут (как в вашем случае)

```html
<input
  type="text"
  placeholder="Алёна ТимЛид"
  data-editable-placeholder="true"
  disabled
  class="w-full rounded-md border px-3 py-2"
/>
```

### Email инпут

```html
<input
  type="email"
  placeholder="alena@example.com"
  data-editable-placeholder="true"
  class="form-input"
/>
```

## Что происходит автоматически

1. **При загрузке страницы**: placeholder устанавливается как значение
2. **При клике**: весь текст выделяется
3. **При нажатии клавиши**: поле очищается для ввода нового текста
4. **При вводе**: placeholder стили убираются
5. **При очистке**: placeholder восстанавливается

## Стили

Система автоматически применяет класс `.editable-placeholder`:

- Курсивный шрифт
- Серый цвет
- При фокусе становится обычным текстом

## Отладка

Если что-то не работает, откройте консоль браузера и выполните:

```javascript
window.initEditablePlaceholders();
```

## Файлы

- `src/utils/simple-placeholder.js` - основной скрипт (уже подключен)
- `src/index.css` - стили (уже добавлены)
- `index.html` - подключение скрипта (уже добавлено)

## Никаких хуков, никаких сложностей!

Просто добавьте `data-editable-placeholder="true"` к любому инпуту и всё заработает автоматически.
