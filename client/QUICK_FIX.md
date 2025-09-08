# Быстрое исправление проблемы с placeholder

## Проблема

При нажатии на первую клавишу placeholder текст исчезает и поле становится пустым.

## Решение

### 1. Подключите умную утилиту

Замените импорт в вашем компоненте:

```javascript
// Вместо этого:
import { initEditablePlaceholders } from './src/utils/simpleEditablePlaceholder.js';

// Используйте это:
import { initEditablePlaceholder } from './src/utils/smartEditablePlaceholder.js';
```

### 2. Добавьте атрибут к инпутам

К инпутам, которые должны иметь редактируемый placeholder, добавьте атрибут:

```html
<input
  placeholder="Алёна ТимЛид"
  data-editable-placeholder="true"
  class="w-full rounded-md border px-3 py-2"
/>
```

### 3. Инициализируйте утилиту

В вашем компоненте или в главном файле:

```javascript
import { initEditablePlaceholders } from './src/utils/smartEditablePlaceholder.js';

// Инициализация
initEditablePlaceholders();
```

### 4. Для React компонентов

Используйте готовый компонент:

```tsx
import { EditableInput } from './components/EditableInput';

<EditableInput
  placeholder="Алёна ТимЛид"
  onChange={(value) => console.log(value)}
  className="w-full rounded-md border px-3 py-2"
/>;
```

## Что исправлено

1. **Умная обработка ввода** - placeholder не исчезает при начале печати
2. **Правильное редактирование** - можно изменить только часть текста
3. **Восстановление placeholder** - при очистке поля placeholder восстанавливается
4. **Выделение текста** - при клике весь текст выделяется для удобного редактирования

## Тестирование

Откройте `test-editable.html` в браузере для проверки работы.

## Файлы

- `src/utils/smartEditablePlaceholder.js` - умная утилита
- `src/components/EditableInput.tsx` - React компонент
- `test-editable.html` - HTML тест
