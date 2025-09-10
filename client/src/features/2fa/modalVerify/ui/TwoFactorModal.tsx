import { verify2FA } from '@/entities/auth/model/thunks';
import { useAppDispatch } from '@/shared/hooks/hooks';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  email: string | undefined;
};

export default function TwoFactorModal({ open, email }: Props): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  console.log(email);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCode(event.target.value);
  };

  const handleSubmit = async (): Promise<void> => {
    const isValid = await dispatch(verify2FA({ token: code, email }));
    console.log(isValid);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-72 max-w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="2fa-modal-title"
        aria-describedby="2fa-modal-description"
      >
        <h2 id="2fa-modal-title" className="text-lg font-semibold mb-4">
          Введите код двухфакторной аутентификации
        </h2>
        <input
          type="text"
          value={code}
          onChange={handleChange}
          autoFocus
          placeholder="Код 2FA"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Подтвердить
        </button>
      </div>
    </div>
  );
}
