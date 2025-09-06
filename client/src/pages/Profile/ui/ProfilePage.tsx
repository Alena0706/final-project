import { userUpdateSchema } from '@/entities/auth/model/schemas';
import { updateUser, uploadAvatar } from '@/entities/auth/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

export default function ProfilePage(): React.JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [edit, setEdit] = useState<string | null>('avatar');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const user = useAppSelector((store) => store.user.user?.user);
  const userName = useAppSelector((store) => store.user.user?.user.name);
  console.log(user);
  const dispatch = useAppDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const dataValidate = userUpdateSchema.parse(formData);
    console.log(dataValidate);
    void dispatch(updateUser(dataValidate));
    if (selectedFile) {
      data.append('avatar', selectedFile);
    }
    // void dispatch(uploadAvatar(data));
    setEdit(null);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
        Профиль пользователя
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Предпросмотр"
              className="w-32 h-32 rounded-full object-cover mb-5 border-4 border-indigo-300 shadow-md"
            />
          ) : (
            <img
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover mb-5 border-4 border-gray-300"
            />
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
          { id: 'name', label: 'Имя пользователя', type: 'text' },
          { id: 'email', label: 'Электронная почта', type: 'email' },
          { id: 'phone', label: 'Телефон', type: 'tel' },
          { id: 'city', label: 'Город', type: 'text' },
        ].map(({ id, label, type }) => (
          <div key={id}>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor={id} className="text-sm font-semibold text-gray-700">
                {label}
              </label>
              {edit !== id && (
                <button
                  type="button"
                  onClick={() => setEdit(id)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label={`Редактировать ${label.toLowerCase()}`}
                >
                  <FaPencilAlt />
                </button>
              )}
            </div>

            {edit === id ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={userName}
                  defaultValue={user?.[id]}
                  className="flex-grow rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required={id !== 'phone' && id !== 'city'}
                />
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => setEdit(null)}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">{user?.[id]}</p>
            )}
          </div>
        ))}

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
