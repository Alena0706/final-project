import React, { useState } from 'react';
import { EditableInput } from './EditableInput';

/**
 * Тестовый компонент для проверки работы EditableInput
 */
export const TestEditableInput: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправка формы:');
    console.log('Имя:', name);
    console.log('Email:', email);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Тест EditableInput</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Имя:</label>
          <EditableInput
            placeholder="Алёна ТимЛид"
            onChange={setName}
            className="w-full rounded-md border px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <p className="text-xs text-gray-500 mt-1">Текущее значение: "{name}"</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
          <EditableInput
            placeholder="alena@example.com"
            onChange={setEmail}
            type="email"
            className="w-full rounded-md border px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <p className="text-xs text-gray-500 mt-1">Текущее значение: "{email}"</p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Отправить
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-medium text-gray-800 mb-2">Инструкции:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Placeholder текст должен отображаться как значение по умолчанию</li>
          <li>• При клике на инпут весь текст должен выделиться</li>
          <li>• Можно редактировать только часть текста</li>
          <li>• При очистке поля placeholder восстанавливается</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEditableInput;
