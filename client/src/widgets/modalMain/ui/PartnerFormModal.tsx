import React, { useState, useEffect } from 'react';

type PartnerFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    phone?: string | null;
    name?: string;
    city?: string | null;
  };
};

const PartnerFormModal: React.FC<PartnerFormModalProps> = ({ isOpen, onClose, user }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Функция форматирования телефона
  const formatPhone = (value: string): string => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, '');

    // Если номер начинается с 8, заменяем на 7
    let formattedNumbers = numbers;
    if (formattedNumbers.startsWith('8')) {
      formattedNumbers = '7' + formattedNumbers.slice(1);
    }

    // Если номер начинается с 7, добавляем +7
    if (formattedNumbers.startsWith('7')) {
      formattedNumbers = '+' + formattedNumbers;
    }

    // Форматируем в стиле +7 (___) ___-__-__
    if (formattedNumbers.length <= 1) return formattedNumbers;
    if (formattedNumbers.length <= 4) return `+7 (${formattedNumbers.slice(2)}`;
    if (formattedNumbers.length <= 7)
      return `+7 (${formattedNumbers.slice(2, 5)}) ${formattedNumbers.slice(5)}`;
    if (formattedNumbers.length <= 9)
      return `+7 (${formattedNumbers.slice(2, 5)}) ${formattedNumbers.slice(
        5,
        8,
      )}-${formattedNumbers.slice(8)}`;
    return `+7 (${formattedNumbers.slice(2, 5)}) ${formattedNumbers.slice(
      5,
      8,
    )}-${formattedNumbers.slice(8, 10)}-${formattedNumbers.slice(10, 12)}`;
  };

  // Функция валидации телефона
  const validatePhone = (phoneValue: string): boolean => {
    const numbers = phoneValue.replace(/\D/g, '');
    return numbers.length === 11 && numbers.startsWith('7');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhone(value);
    setPhone(formatted);

    // Валидация
    if (value.length > 0 && !validatePhone(formatted)) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setName(user.name || '');
      setCity(user.city || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверяем валидность телефона перед отправкой
    if (!validatePhone(phone)) {
      setPhoneError('Введите корректный номер телефона');
      return;
    }

    // логика отправки формы
    console.log('Отправка формы:', { phone, name, city });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-2xl mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Стать партнером</h2>
          <p className="text-gray-600 text-lg">
            Заполните форму и мы свяжемся с вами в ближайшее время
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block mb-3 text-lg font-semibold text-gray-700">
              Телефон *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full border-2 rounded-lg px-4 py-3 text-lg focus:outline-none transition-colors ${
                phoneError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="+7 (___) ___-__-__"
              maxLength={18}
              required
            />
            {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
          </div>
          <div>
            <label htmlFor="nameOrEmail" className="block mb-3 text-lg font-semibold text-gray-700">
              Имя или почта *
            </label>
            <input
              id="nameOrEmail"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Введите ваше имя или email"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block mb-3 text-lg font-semibold text-gray-700">
              Город *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="В каком городе планируете открытие?"
              required
            />
          </div>
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="button"
              className="px-8 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold text-lg transition-colors duration-200"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white font-semibold text-lg hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Отправить заявку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerFormModal;
