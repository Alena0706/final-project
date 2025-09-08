# Руководство по использованию Editable Placeholder

## Проблема и решение

**Проблема**: Placeholder текст не отображается как значение по умолчанию в инпутах.

**Решение**: Создана система, которая позволяет редактировать placeholder текст как обычное
значение.

## Быстрый старт

### 1. HTML + JavaScript (простой способ)

```html
<input
  type="text"
  placeholder="Алёна ТимЛид"
  data-editable-placeholder="true"
  class="w-full rounded-md border px-3 py-2"
/>
```

```javascript
import { initEditablePlaceholders } from './src/utils/simpleEditablePlaceholder.js';

// Инициализация
initEditablePlaceholders();
```

### 2. React компонент

```tsx
import { EditableInput } from './components/EditableInput';

<EditableInput
  placeholder="Алёна ТимЛид"
  onChange={(value) => console.log(value)}
  className="w-full rounded-md border px-3 py-2"
/>;
```

## Тестирование

### 1. HTML тест

Откройте файл `test-editable.html` в браузере для тестирования.

### 2. React тест

Используйте компонент `TestEditableInput` в вашем приложении.

## Отладка

### Проверка инициализации

Откройте консоль браузера и найдите сообщения:

- "Найдено инпутов с data-editable-placeholder: X"
- "Placeholder установлен как значение: [текст]"

### Проверка CSS классов

Убедитесь, что к инпуту применяется класс `placeholder-as-value`:

```javascript
console.log(document.querySelector('input[data-editable-placeholder]').classList);
```

### Проверка значения

```javascript
const input = document.querySelector('input[data-editable-placeholder]');
console.log('Значение:', input.value);
console.log('Placeholder:', input.getAttribute('placeholder'));
```

## Возможные проблемы

### 1. Placeholder не отображается

**Причина**: JavaScript не успел выполниться или элемент не найден.

**Решение**:

- Убедитесь, что скрипт загружается после DOM
- Используйте `setTimeout` для задержки
- Проверьте, что у инпута есть атрибут `data-editable-placeholder`

### 2. Стили не применяются

**Причина**: CSS не загружен или селекторы не работают.

**Решение**:

- Убедитесь, что CSS файл подключен
- Проверьте, что класс `placeholder-as-value` применяется
- Используйте `!important` в CSS

### 3. React компонент не работает

**Причина**: Хук не инициализируется или ref не установлен.

**Решение**:

- Убедитесь, что компонент рендерится
- Проверьте, что ref установлен
- Добавьте console.log для отладки

## Файлы системы

- `src/utils/editablePlaceholder.js` - основная утилита
- `src/utils/simpleEditablePlaceholder.js` - упрощенная версия
- `src/hooks/useEditablePlaceholder.js` - React хук
- `src/components/EditableInput.tsx` - React компонент
- `src/components/TestEditableInput.tsx` - тестовый компонент
- `test-editable.html` - HTML тест

## API

### makePlaceholderEditable(inputElement)

Инициализирует редактируемый placeholder для конкретного инпута.

### initEditablePlaceholders()

Инициализирует все инпуты с атрибутом `data-editable-placeholder`.

### useEditablePlaceholder(placeholder, initialValue, options)

React хук для создания редактируемого placeholder.

### EditableInput

React компонент с редактируемым placeholder.

## Стили

Система использует следующие CSS классы:

- `.placeholder-as-value` - когда отображается placeholder как значение
- `[data-editable-placeholder]` - для инпутов с редактируемым placeholder

## Примеры использования

### Простая форма

```html
<form>
  <input
    type="text"
    placeholder="Введите имя"
    data-editable-placeholder="true"
    class="form-input"
  />
  <input
    type="email"
    placeholder="Введите email"
    data-editable-placeholder="true"
    class="form-input"
  />
</form>
```

### React форма

```tsx
function MyForm() {
  const [name, setName] = useState('');

  return (
    <EditableInput
      placeholder="Алёна ТимЛид"
      onChange={setName}
      className="w-full rounded-md border px-3 py-2"
    />
  );
}
```

## Поддержка

Если что-то не работает:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что все файлы загружены
3. Проверьте, что атрибуты установлены правильно
4. Используйте простую версию `simpleEditablePlaceholder.js`
