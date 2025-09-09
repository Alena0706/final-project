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
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Поля Имя пользователя и Электронная почта обязательны');
      return;
    }

    try {
      if (selectedFile) {
        const avatarData = new FormData();
        avatarData.append('avatar', selectedFile);
        await dispatch(uploadAvatar(avatarData)).unwrap();
        setSelectedFile(null);
        setPreviewUrl(undefined);
      }
      await dispatch(updateUser(formData)).unwrap();
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
              src={avatar ? `http://localhost:5173/${avatar}` : previewUrl || ''}
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
              value={formData[id as keyof typeof formData]}
              onChange={handleInputChange}
              disabled={editField !== id}
              placeholder={(user as any)?.[id] || ''}
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
          className="w-full py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 transition-shadow shadow-lg"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
