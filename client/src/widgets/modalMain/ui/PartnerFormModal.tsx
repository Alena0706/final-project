import React, { useState, useEffect } from 'react';

type PartnerFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    phone?: string | null;
    name?: string;
    city?: string | null;
  };
}

const PartnerFormModal: React.FC<PartnerFormModalProps> = ({ isOpen, onClose, user }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

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
    // логика отправки формы
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Стать партнером</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              Телефон
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="nameOrEmail" className="block mb-1 font-medium">
              Имя или почта
            </label>
            <input
              id="nameOrEmail"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block mb-1 font-medium">
              Город
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300"
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerFormModal;
