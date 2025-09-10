import React, { useState } from 'react';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { verify2FA } from '@/entities/auth/model/thunks';

interface TwoFactorVerificationProps {
  email: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!token.trim() || token.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await dispatch(verify2FA({ token, email })).unwrap();
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Неверный код. Попробуйте еще раз.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setToken(value);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Двухфакторная аутентификация</h2>

        <p className="text-gray-600 mb-6">
          Введите 6-значный код из приложения Google Authenticator:
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={token}
              onChange={handleTokenChange}
              placeholder="000000"
              maxLength={6}
              autoFocus
              className="w-full text-center text-2xl tracking-widest border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isVerifying || token.length !== 6}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isVerifying ? 'Проверка...' : 'Подтвердить'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          <p className="mb-2">Нет доступа к приложению?</p>
          <div className="space-y-1">
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              Скачать Google Authenticator для Android
            </a>
            <a
              href="https://apps.apple.com/app/google-authenticator/id388497605"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              Скачать Google Authenticator для iOS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

