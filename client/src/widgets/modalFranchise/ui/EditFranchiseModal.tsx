import type { FranchiseT } from '@/entities/openFrancise/model/types';
import { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  franchise: FranchiseT;
  onSave: (
    updated: FranchiseT,
    franchiseId: number,
    image: File | null,
    video: File | null,
  ) => void;
};

export default function EditFranchiseModal({
  isOpen,
  onClose,
  franchise,
  onSave,
}: Props): React.JSX.Element | null {
  const [formData, setFormData] = useState<FranchiseT>(franchise);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData(franchise);
    setImage(null);
    setVideo(null);
    setIsUploading(false);
  }, [franchise]);

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

  const handleSubmit = async (): Promise<void> => {
    setIsUploading(true);
    try {
      await onSave(formData, franchise.id, image, video);
      onClose();
    } catch (error) {
      console.error('Error saving franchise:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 text-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✏️ Редактировать франшизу</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">📝 Название</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Введите название франшизы"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">📍 Адрес</span>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Введите адрес"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">📞 Телефон</span>
              <input
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="tel"
                placeholder="Введите номер телефона"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">🏙️ Город</span>
              <input
                name="city"
                value={formData.city ?? ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Введите город"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">📝 Описание</span>
              <textarea
                name="description"
                value={formData.description ?? ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Введите описание франшизы"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">🖼️ Фото</span>
              <div className="relative">
                <input
                  name="image"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
                {image && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 rounded-lg p-3">
                    <span className="text-sm text-green-700">📁 {image.name}</span>
                    <button
                      onClick={() => cancelFile('image')}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      type="button"
                    >
                      ❌ Удалить
                    </button>
                  </div>
                )}
                {franchise.image && !image && (
                  <div className="mt-2 bg-blue-50 rounded-lg p-3">
                    <span className="text-sm text-blue-700">
                      🖼️ Текущее изображение: {franchise.image}
                    </span>
                  </div>
                )}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">🎥 Видео</span>
              <div className="relative">
                <input
                  name="video"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="file"
                  accept="video/mp4,video/x-m4v,video/quicktime,video/ogg,video/mpeg"
                />
                {video && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 rounded-lg p-3">
                    <span className="text-sm text-green-700">📁 {video.name}</span>
                    <button
                      onClick={() => cancelFile('video')}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      type="button"
                    >
                      ❌ Удалить
                    </button>
                  </div>
                )}
                {franchise.video && !video && (
                  <div className="mt-2 bg-blue-50 rounded-lg p-3">
                    <span className="text-sm text-blue-700">
                      🎥 Текущее видео: {franchise.video}
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            type="button"
            disabled={isUploading}
          >
            ❌ Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            type="button"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Сохранить</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
