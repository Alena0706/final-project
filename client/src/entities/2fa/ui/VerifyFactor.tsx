import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useState } from 'react';
import { verify2FA, disable2FA } from '../model/thunks';
import { clearError, clearSuccessMessage } from '../model/slice';

interface VerifyFactorProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  mode: 'verify' | 'disable';
}

export default function VerifyFactor({
  onSuccess,
  onCancel,
  mode,
}: VerifyFactorProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState('');
  const { isLoading, error, successMessage } = useAppSelector((state) => state.twoFactor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      return;
    }

    try {
      if (mode === 'verify') {
        await dispatch(verify2FA(token)).unwrap();
      } else {
        await dispatch(disable2FA(token)).unwrap();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('2FA verification error:', error);
    }
  };

  const handleCancel = () => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        {mode === 'verify' ? 'Подтверждение 2FA' : 'Отключение 2FA'}
      </h3>

      <p className="mb-4 text-muted-foreground">
        {mode === 'verify'
          ? 'Введите 6-значный код из приложения аутентификатора для подтверждения настройки 2FA.'
          : 'Введите 6-значный код из приложения аутентификатора для отключения 2FA.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-foreground mb-2">
            Код аутентификации
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || token.length !== 6}
            className="flex-1 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white px-4 py-2 rounded hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Проверка...' : mode === 'verify' ? 'Подтвердить' : 'Отключить'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
