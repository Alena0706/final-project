import React, { useState, useEffect } from 'react';
import type { FranchiseCreateT } from '@/entities/openFrancise/model/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (franchise: FranchiseCreateT, image: File | null, video: File | null) => void;
};

const defaultForm: FranchiseCreateT = {
  name: '',
  address: '',
  workPhone: '',
  userId: 0,
  contractId: 0,
  image: null,
  video: null,
  description: null,
  city: null,
};

export default function CreateFranchiseModal({ isOpen, onClose, onCreate }: Props): React.JSX.Element | null {
  const [formData, setFormData] = useState<FranchiseCreateT>(defaultForm);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultForm);
      setImage(null);
      setVideo(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'image') {
      setImage(e.target.files?.[0] ?? null);
    } else if (name === 'video') {
      setVideo(e.target.files?.[0] ?? null);
    }
  };

  const cancelFile = (type: 'image' | 'video') => {
    if (type === 'image') setImage(null);
    if (type === 'video') setVideo(null);
  };

  // Закрывать модалку нельзя, если фото или видео не загружены
  const handleClose = (): void => {

    onClose();
  };

  const handleSubmit = (): void => {

    onCreate(formData, image, video);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 text-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Создать франшизу</h2>

        <label className="block mb-2">
          Название
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="text"
          />
        </label>

        <label className="block mb-2">
          Адрес
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="text"
          />
        </label>

        <label className="block mb-2">
          Телефон
          <input
            name="workPhone"
            value={formData.workPhone}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="tel"
          />
        </label>

        <label className="block mb-2">
          Фото
          <input
            name="image"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
          />
          {image && (
            <div className="mt-1 flex items-center justify-between">
              <span>{image.name}</span>
              <button
                onClick={() => cancelFile('image')}
                className="text-red-600 hover:underline"
                type="button"
              >
                Отменить загрузку
              </button>
            </div>
          )}
        </label>

        <label className="block mb-2">
          Видео
          <input
            name="video"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="file"
            accept="video/mp4,video/x-m4v,video/quicktime,video/ogg,video/mpeg"
          />
          {video && (
            <div className="mt-1 flex items-center justify-between">
              <span>{video.name}</span>
              <button
                onClick={() => cancelFile('video')}
                className="text-red-600 hover:underline"
                type="button"
              >
                Отменить загрузку
              </button>
            </div>
          )}
        </label>

        <label className="block mb-2">
          Город
          <input
            name="city"
            value={formData.city ?? ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="text"
          />
        </label>

        <label className="block mb-4">
          Описание
          <textarea
            name="description"
            value={formData.description ?? ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            rows={3}
          />
        </label>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            type="button"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            type="button"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
