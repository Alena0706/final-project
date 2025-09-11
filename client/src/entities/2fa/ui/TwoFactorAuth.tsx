import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { register2FA } from '../model/thunks';
import { clearError, clearSuccessMessage, reset2FAState } from '../model/slice';
import VerifyFactor from './VerifyFactor';

export default function TwoFactorAuth(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [showQR, setShowQR] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [showDisable, setShowDisable] = useState(false);

  const { secret, url, isEnabled, isVerified, isLoading, error, successMessage } = useAppSelector(
    (state) => state.twoFactor,
  );

  const { user } = useAppSelector((state) => state.user);

  // Проверяем, есть ли у пользователя настроенная 2FA
  const has2FAEnabled = isEnabled || (user?.user?.secret && user.user.secret.length > 0);

  // Генерация QR кода
  const generateQR = async (url: string): Promise<void> => {
    try {
      const qr = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCode(qr);
    } catch (qrError) {
      console.error('Ошибка генерации QR кода:', qrError);
    }
  };

  const handleGenerateQR = async (): Promise<void> => {
    try {
      await dispatch(register2FA()).unwrap();
      setShowQR(true);
    } catch (error) {
      console.error('Ошибка генерации 2FA:', error);
    }
  };

  const handleVerifySuccess = () => {
    setShowVerify(false);
    setShowQR(false);
    setShowDisable(false);
  };

  const handleCancel = () => {
    setShowVerify(false);
    setShowQR(false);
    setShowDisable(false);
    dispatch(reset2FAState());
  };

  const handleDisable2FA = () => {
    setShowDisable(true);
  };

  useEffect(() => {
    if (url) {
      void generateQR(url);
    }
  }, [url]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  if (showVerify) {
    return <VerifyFactor mode="verify" onSuccess={handleVerifySuccess} onCancel={handleCancel} />;
  }

  if (showDisable) {
    return <VerifyFactor mode="disable" onSuccess={handleVerifySuccess} onCancel={handleCancel} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Двухфакторная аутентификация</h2>

      <p className="mb-6 text-muted-foreground">
        Двухфакторная аутентификация (2FA) повышает безопасность вашей учетной записи, требуя
        дополнительно ввести код из приложения, такого как Google Authenticator, помимо пароля.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {has2FAEnabled ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">2FA включена</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Двухфакторная аутентификация успешно настроена и активна.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDisable2FA}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Отключить 2FA
          </button>
        </div>
      ) : showQR && qrCode ? (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">Настройка 2FA</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Отсканируйте QR-код с помощью приложения аутентификатора:
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img src={qrCode} alt="QR Code for 2FA" className="w-64 h-64" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Или введите секретный ключ вручную:
            </p>
            <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">{secret}</div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowVerify(true)}
              className="flex-1 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white px-4 py-2 rounded hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300"
            >
              Подтвердить настройку
            </button>

            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleGenerateQR}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white px-4 py-2 rounded hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Генерация...' : 'Включить 2FA'}
          </button>
        </div>
      )}
    </div>
  );
}
