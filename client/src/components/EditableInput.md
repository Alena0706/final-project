# EditableInput - Редактируемый Placeholder

Компонент для создания инпутов, где placeholder текст можно редактировать как обычное значение.

## Особенности

- Placeholder текст отображается как значение по умолчанию
- При клике на инпут весь текст выделяется для удобного редактирования
- Можно изменить только часть текста, не переписывая все
- Автоматическое восстановление placeholder при очистке поля
- Стилизация: placeholder текст отображается курсивом и серым цветом

## Использование

### Базовое использование

```tsx
import { EditableInput } from './components/EditableInput';

function MyComponent() {
  const handleChange = (value: string) => {
    console.log('Новое значение:', value);
  };

  return (
    <EditableInput
      placeholder="Алёна ТимЛид"
      onChange={handleChange}
      className="w-full rounded-md border px-3 py-2"
    />
  );
}
```

### С дополнительными props

```tsx
<EditableInput
  placeholder="Введите ваше имя"
  initialValue=""
  type="text"
  className="form-input"
  onChange={(value) => setValue(value)}
  onFocus={(e) => console.log('Фокус')}
  onBlur={(e) => console.log('Потеря фокуса')}
  disabled={false}
  required
/>
```

### Использование хука напрямую

```tsx
import { useEditablePlaceholder, useEditableValue } from './hooks/useEditablePlaceholder';

function MyComponent() {
  const { ref, onFocus, onBlur, onInput, onClick } = useEditablePlaceholder('Алёна ТимЛид', '', {
    onFocus: (e) => console.log('Фокус'),
    onBlur: (e) => console.log('Потеря фокуса'),
  });

  const { getValue, isEmpty, isPlaceholder } = useEditableValue(ref, 'Алёна ТимЛид');

  return (
    <input
      ref={ref}
      className="w-full rounded-md border px-3 py-2"
      data-editable-placeholder="true"
      onFocus={onFocus}
      onBlur={onBlur}
      onInput={onInput}
      onClick={onClick}
    />
  );
}
```

## API

### EditableInput Props

| Prop           | Тип                       | По умолчанию | Описание                         |
| -------------- | ------------------------- | ------------ | -------------------------------- |
| `placeholder`  | `string`                  | -            | Текст placeholder (обязательный) |
| `initialValue` | `string`                  | `''`         | Начальное значение               |
| `className`    | `string`                  | `''`         | CSS классы                       |
| `type`         | `string`                  | `'text'`     | Тип инпута                       |
| `onChange`     | `(value: string) => void` | -            | Обработчик изменения значения    |
| `onFocus`      | `(e: FocusEvent) => void` | -            | Обработчик фокуса                |
| `onBlur`       | `(e: FocusEvent) => void` | -            | Обработчик потери фокуса         |

### useEditablePlaceholder

```tsx
const {
  ref, // React ref для инпута
  onFocus, // Обработчик фокуса
  onBlur, // Обработчик потери фокуса
  onInput, // Обработчик ввода
  onClick, // Обработчик клика
  placeholder, // Текст placeholder
  defaultValue, // Значение по умолчанию
} = useEditablePlaceholder(placeholder, initialValue, options);
```

### useEditableValue

```tsx
const {
  getValue, // () => string - получить текущее значение
  isEmpty, // () => boolean - пустое ли поле
  isPlaceholder, // () => boolean - отображается ли placeholder
} = useEditableValue(inputRef, placeholder);
```

## Стили

Компонент автоматически применяет следующие CSS классы:

- `.placeholder-as-value` - когда отображается placeholder как значение
- `[data-editable-placeholder]` - для инпутов с редактируемым placeholder

## Примеры использования

### Форма редактирования профиля

```tsx
function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <form>
      <EditableInput
        placeholder="Алёна ТимЛид"
        onChange={setName}
        className="w-full rounded-md border px-3 py-2 mb-4"
      />
      <EditableInput
        placeholder="alena@example.com"
        onChange={setEmail}
        type="email"
        className="w-full rounded-md border px-3 py-2"
      />
    </form>
  );
}
```

### Поиск с подсказкой

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');

  return (
    <EditableInput
      placeholder="Поиск по названию..."
      onChange={setQuery}
      className="w-full rounded-md border px-3 py-2 pl-10"
    />
  );
}
```

## Примечания

- Placeholder текст автоматически восстанавливается при очистке поля
- При клике на инпут с placeholder весь текст выделяется
- Стили placeholder: курсив, серый цвет
- При редактировании текст становится обычным (не курсив, темный цвет)
