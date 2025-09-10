import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { generate2FASecret, verify2FAToken, disable2FA } from '@/entities/auth/model/thunks';

export const TwoFactorSetup: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, secret, error } = useAppSelector((state) => state.user);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const has2FA = user?.user?.secret ?? false;

  // Генерация QR кода
  const generateQR = async (url: string): Promise<void> => {
    try {
      const qr = await QRCode.toDataURL(url);
      setQrCodeUrl(qr);
    } catch (qrError) {
      console.error('Ошибка генерации QR кода:', qrError);
    }
  };

  // Обработка генерации секрета
  const handleGenerateSecret = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      await dispatch(generate2FASecret()).unwrap();
    } catch (generateError) {
      console.error('Ошибка генерации секрета:', generateError);
    } finally {
      setIsGenerating(false);
    }
  };

  // Обработка проверки токена
  const handleVerifyToken = async (): Promise<void> => {
    if (!token.trim()) return;

    setIsVerifying(true);
    try {
      await dispatch(verify2FAToken(token)).unwrap();
      setToken('');
      // После успешной проверки обновляем пользователя
      window.location.reload();
    } catch (verifyError) {
      console.error('Ошибка проверки токена:', verifyError);
    } finally {
      setIsVerifying(false);
    }
  };

  // Обработка отключения 2FA
  const handleDisable2FA = async (): Promise<void> => {
    if (!token.trim()) return;

    setIsVerifying(true);
    try {
      await dispatch(disable2FA(token)).unwrap();
      setToken('');
      // После успешного отключения обновляем пользователя
      window.location.reload();
    } catch (disableError) {
      console.error('Ошибка отключения 2FA:', disableError);
    } finally {
      setIsVerifying(false);
    }
  };

  // Генерируем QR код когда получаем секрет
  useEffect(() => {
    if (secret?.qrCodeUrl) {
      void generateQR(secret.qrCodeUrl);
    }
  }, [secret]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Двухфакторная аутентификация</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!has2FA ? (
        <div>
          <p className="mb-4 text-gray-600">
            Двухфакторная аутентификация (2FA) повышает безопасность вашей учетной записи, требуя
            дополнительно ввести код из приложения, такого как Google Authenticator.
          </p>

          {!secret ? (
            <button
              onClick={handleGenerateSecret}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isGenerating ? 'Генерация...' : 'Включить 2FA'}
            </button>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Шаг 1: Сканируйте QR-код</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Откройте приложение Google Authenticator и отсканируйте QR-код:
                </p>
                {qrCodeUrl ? (
                  <div className="flex justify-center mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="border rounded" />
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">Загрузка QR кода...</div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Шаг 2: Введите код подтверждения</h3>
                <p className="text-sm text-gray-600 mb-3">Введите 6-значный код из приложения:</p>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-3"
                />
                <button
                  onClick={handleVerifyToken}
                  disabled={isVerifying || token.length !== 6}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isVerifying ? 'Проверка...' : 'Подтвердить и включить 2FA'}
                </button>
              </div>

              <div className="text-xs text-gray-500">
                <p>Ссылки для скачивания:</p>
                <div className="mt-1 space-y-1">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    Google Authenticator для Android
                  </a>
                  <a
                    href="https://apps.apple.com/app/google-authenticator/id388497605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    Google Authenticator для iOS
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            ✅ Двухфакторная аутентификация включена
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Отключить 2FA</h3>
            <p className="text-sm text-gray-600 mb-3">
              Для отключения 2FA введите код из приложения:
            </p>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
            />
            <button
              onClick={handleDisable2FA}
              disabled={isVerifying || token.length !== 6}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isVerifying ? 'Отключение...' : 'Отключить 2FA'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
