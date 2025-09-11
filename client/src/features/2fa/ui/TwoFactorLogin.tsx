import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useState } from 'react';
import { verify2FALogin } from '@/entities/2fa/model/thunks';
import { clearError, clearSuccessMessage } from '@/entities/2fa/model/slice';

interface TwoFactorLoginProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorLogin({
  email,
  onSuccess,
  onCancel,
}: TwoFactorLoginProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState('');
  const { isLoading, error } = useAppSelector((state) => state.twoFactor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      return;
    }

    try {
      await dispatch(verify2FALogin({ email, token })).unwrap();
      onSuccess();
    } catch (error) {
      console.error('2FA login verification error:', error);
    }
  };

  const handleCancel = () => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    onCancel();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="heading-3 text-foreground mb-2">Двухфакторная аутентификация</h2>
            <p className="text-muted-foreground">
              Введите 6-значный код из приложения аутентификатора для завершения входа
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

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
                className="form-input text-center text-lg tracking-widest"
                maxLength={6}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading || token.length !== 6}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Проверка...' : 'Подтвердить'}
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
      </div>
    </div>
  );
}
