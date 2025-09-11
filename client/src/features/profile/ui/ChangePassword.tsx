import { updateUser } from '@/entities/auth/model/thunks';
import { userUpdateSchema } from '@/entities/auth/model/schemas';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { TwoFactorSetup } from '@/entities/2fa/ui';
import React, { useState } from 'react';

const ChangePassword = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setValidationErrors({});

    // Проверка совпадения паролей
    if (newPassword !== confirmPassword) {
      setError('Новый пароль и подтверждение не совпадают');
      return;
    }

    // Валидация нового пароля с помощью Zod
    const validationResult = userUpdateSchema.shape.password.safeParse(newPassword);
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        errors.password = error.message;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      await dispatch(updateUser({ oldpassword: currentPassword, password: newPassword })).unwrap();
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Ошибка при изменении пароля');
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Изменение пароля */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Изменение пароля</h2>
        <form onSubmit={handleSubmit} className="max-w-sm">
          <label htmlFor="currentPassword" className="block mb-2 font-medium">
            Текущий пароль
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3 focus:outline-[hsl(200_75%_55%)]"
            required
          />

          <label htmlFor="newPassword" className="block mb-2 font-medium">
            Новый пароль
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full border rounded px-3 py-2 mb-3 focus:outline-[hsl(200_75%_55%)] ${
              validationErrors.password ? 'border-red-500' : ''
            }`}
            required
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm mb-2">{validationErrors.password}</p>
          )}

          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
            Подтверждение нового пароля
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3 focus:outline-[hsl(200_75%_55%)]"
            required
          />

          {error && <p className="text-destructive text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">Пароль успешно изменен</p>}

          <button
            type="submit"
            className="bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white px-4 py-2 rounded hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300"
          >
            Сменить пароль
          </button>
        </form>
      </div>

      {/* Двухфакторная аутентификация */}
      <div>
        <TwoFactorSetup />
      </div>
    </div>
  );
};

export default ChangePassword;
