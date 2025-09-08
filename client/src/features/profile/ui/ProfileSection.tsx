import { updateUser, uploadAvatar } from '@/entities/auth/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

export default function ProfileSection(): React.JSX.Element {
  const user = useAppSelector((store) => store.user.user?.user);
  const avatar = user?.avatar;
  const dispatch = useAppDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [editField, setEditField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
  });

  // Функция для получения значения поля с placeholder
  const getFieldValue = (fieldId: keyof typeof formData): string => {
    const currentValue = formData[fieldId];
    const userValue = user?.[fieldId as keyof typeof user];

    // Если поле в режиме редактирования и значение пустое, показываем placeholder
    if (editField === fieldId && (!currentValue || currentValue.trim() === '')) {
      return (userValue as string) || '';
    }

    return currentValue;
  };
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Проверяем, есть ли изменения для сохранения
  const hasChanges =
    selectedFile ||
    (formData.name.trim() && formData.name !== (user?.name ?? '')) ||
    (formData.email.trim() && formData.email !== (user?.email ?? '')) ||
    (formData.phone.trim() && formData.phone !== (user?.phone ?? '')) ||
    (formData.city.trim() && formData.city !== (user?.city ?? ''));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fieldName = e.target.name as keyof typeof formData;
    const newValue = e.target.value;
    const userValue = user?.[fieldName as keyof typeof user];

    // Если пользователь начал печатать и значение равно placeholder, очищаем поле
    if (newValue === userValue && editField === fieldName) {
      setFormData((prev) => ({ ...prev, [fieldName]: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: newValue }));
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>): void => {
    const fieldName = e.currentTarget.name as keyof typeof formData;
    const userValue = user?.[fieldName as keyof typeof user];
    const currentValue = getFieldValue(fieldName);

    // Если значение равно placeholder, выделяем весь текст
    if (currentValue === (userValue as string) && editField === fieldName) {
      e.currentTarget.select();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const fieldName = e.currentTarget.name as keyof typeof formData;
    const userValue = user?.[fieldName as keyof typeof user];
    const currentValue = getFieldValue(fieldName);

    // Если пользователь нажал клавишу и значение равно placeholder, очищаем поле
    if (currentValue === (userValue as string) && editField === fieldName && e.key.length === 1) {
      setFormData((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Проверяем, есть ли реальные изменения в данных пользователя
      const hasUserDataChanges =
        (formData.name.trim() && formData.name !== (user?.name ?? '')) ||
        (formData.email.trim() && formData.email !== (user?.email ?? '')) ||
        (formData.phone.trim() && formData.phone !== (user?.phone ?? '')) ||
        (formData.city.trim() && formData.city !== (user?.city ?? ''));

      // Если есть изменения в данных пользователя, проверяем обязательные поля
      if (hasUserDataChanges) {
        // Для изменений проверяем, что обязательные поля заполнены
        const nameToCheck = formData.name.trim() || (user?.name ?? '');
        const emailToCheck = formData.email.trim() || (user?.email ?? '');

        if (!nameToCheck || !emailToCheck) {
          setError('Поля Имя пользователя и Электронная почта обязательны');
          return;
        }

        // Отправляем только измененные данные
        const dataToUpdate = {
          name: formData.name.trim() || (user?.name ?? ''),
          email: formData.email.trim() || (user?.email ?? ''),
          phone: formData.phone.trim() || (user?.phone ?? ''),
          city: formData.city.trim() || (user?.city ?? ''),
        };

        await dispatch(updateUser(dataToUpdate)).unwrap();
      }

      // Если загружаем аватар
      if (selectedFile) {
        const avatarData = new FormData();
        avatarData.append('avatar', selectedFile);
        try {
          await dispatch(uploadAvatar(avatarData)).unwrap();
        } catch (error) {
          setError('Ошибка загрузки аватара');
          return;
        }
        setSelectedFile(null);
        setPreviewUrl(undefined);
      }

      // Если нет изменений ни в данных, ни в аватаре
      if (!hasUserDataChanges && !selectedFile) {
        setError('Нет изменений для сохранения');
        return;
      }

      setSuccess(true);
      setEditField(null);
    } catch (err) {
      setError('Ошибка при обновлении профиля');
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-indigo-700 text-center">
        Профиль пользователя
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center">
          {avatar || previewUrl ? (
            <img
              src={previewUrl ?? `http://localhost:5173/${avatar ?? ''}`}
              alt="Аватар"
              className="w-32 h-32 rounded-full object-cover mb-5 border-4 border-indigo-300 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 mb-5 flex items-center justify-center text-gray-600 text-xl border-4 border-gray-300">
              Нет аватара
            </div>
          )}
          <label
            htmlFor="avatarInput"
            className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-shadow shadow-md"
          >
            Изменить аватар
          </label>

          <input
            id="avatarInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {[
          { id: 'name', label: 'Имя пользователя', required: true },
          { id: 'email', label: 'Электронная почта', required: true },
          { id: 'phone', label: 'Телефон', required: false },
          { id: 'city', label: 'Город', required: false },
        ].map(({ id, label, required }) => (
          <div key={id}>
            <div className="flex justify-between items-center mb-2 text-sm">
              <label htmlFor={id} className="block mb-2 font-semibold text-gray-700">
                {label}
              </label>
              {editField !== id && (
                <button
                  type="button"
                  onClick={() => setEditField(id)}
                  className="mt-1 text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label={`Редактировать ${label.toLowerCase()}`}
                >
                  <FaPencilAlt />
                </button>
              )}
            </div>
            <input
              id={id}
              name={id}
              type={id === 'email' ? 'email' : 'text'}
              value={getFieldValue(id as keyof typeof formData)}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onKeyDown={handleInputKeyDown}
              disabled={editField !== id}
              placeholder={(user?.[id as keyof typeof user] as string) || ''}
              className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                editField === id
                  ? 'border-indigo-500 focus:ring-indigo-500'
                  : 'border-gray-300 focus:ring-indigo-200'
              }`}
              required={required}
            />
          </div>
        ))}

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Профиль успешно обновлен</p>}

        <button
          type="submit"
          disabled={!hasChanges}
          className={`w-full py-3 font-bold rounded-lg transition-shadow shadow-lg ${
            !hasChanges
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-indigo-700 text-white hover:bg-indigo-800'
          }`}
        >
          {hasChanges ? 'Сохранить изменения' : 'Нет изменений'}
        </button>
      </form>
    </div>
  );
}
