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
    void dispatch(updateUser({ oldpassword: currentPassword, password: newPassword }));
    console.log('Изменение пароля');
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-gradient-primary text-center">
        Изменение пароля
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <label htmlFor="currentPassword" className="block mb-2 font-semibold text-foreground">
              Текущий пароль
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 border-border focus:ring-primary/20 bg-input"
              placeholder="Введите текущий пароль"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-2 font-semibold text-foreground">
              Новый пароль
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 border-border focus:ring-primary/20 bg-input"
              placeholder="Введите новый пароль"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-foreground">
              Подтверждение нового пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 border-border focus:ring-primary/20 bg-input"
              placeholder="Подтвердите новый пароль"
              required
            />
          </div>
        </div>

        {error && <p className="text-destructive text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">Пароль успешно изменен</p>}

        <button
          type="submit"
          className="w-full py-3 font-bold rounded-lg transition-all duration-300 shadow-lg bg-gradient-primary text-white hover:shadow-iris hover:transform hover:-translate-y-1"
        >
          Сменить пароль
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
