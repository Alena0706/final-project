import { updateUser } from '@/entities/auth/model/thunks';
import { useAppDispatch } from '@/shared/hooks/hooks';
import React, { useState } from 'react';

const ChangePassword = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Новый пароль и подтверждение не совпадают');
      setSuccess(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать не менее 6 символов');
      setSuccess(false);
      return;
    }
    setError(null);
    void dispatch(updateUser({oldpassword: currentPassword, password: newPassword }));
    console.log('Изменение пароля');
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
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
          className="w-full border rounded px-3 py-2 mb-3 focus:outline-indigo-500"
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
          className="w-full border rounded px-3 py-2 mb-3 focus:outline-indigo-500"
          required
        />

        <label htmlFor="confirmPassword" className="block mb-2 font-medium">
          Подтверждение нового пароля
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3 focus:outline-indigo-500"
          required
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">Пароль успешно изменен</p>}

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Сменить пароль
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;