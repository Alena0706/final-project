import { register2FA } from '@/entities/2fa/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import QRCode from 'qrcode';
import React, { useState } from 'react';

export const TwoFactorAuth: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrImage, setQrImage] = useState<string>('');
  const dispatch = useAppDispatch();
  const dataURL = useAppSelector((store) => store.twoFactor.secret?.otpauth_url);
  const userId = useAppSelector((store) => store.user.user?.user.id);
  const userEmail = useAppSelector((store) => store.user.user?.user.email);

  // Генерация QR кода и установка картинки
  const generateQR = async (url: string): Promise<void> => {
    try {
      const qr = await QRCode.toDataURL(url);
      setQrImage(qr);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
      setQrImage('');
    }
  };

  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Двухфакторная аутентификация</h2>
      <p className="mb-4">
        Двухфакторная аутентификация (2FA) повышает безопасность вашей учетной записи, требуя
        дополнительно ввести код из приложения, такого как Google Authenticator, помимо пароля.
      </p>
      <button
        onClick={async () => {
          setIsModalOpen(true);
          await dispatch(register2FA({ userId, userEmail }));
          if (dataURL) {
            await generateQR(dataURL);
          }
        }}
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-blue-800 transition"
      >
        Включить 2FA
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">Сканируйте QR-код</h3>
            {qrImage ? (
              <img src={qrImage} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
            ) : (
              <p className="mt-4 text-sm">Загрузка QR кода...</p>
            )}
            <p className="mt-4 text-sm">
              Откройте приложение Google Authenticator (или другое совместимое TOTP-приложение) и
              добавьте новую учетную запись, отсканировав этот QR-код.
            </p>
            <p className="mt-2 text-sm">
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Скачать Google Authenticator для Android
              </a>
            </p>
            <p className="mt-1 text-sm">
              <a
                href="https://apps.apple.com/app/google-authenticator/id388497605"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Скачать Google Authenticator для iOS
              </a>
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition w-full"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
