import type { FranchiseT } from '@/entities/openFrancise/model/types';
import { BaseModal } from '@/shared/ui/BaseModal';
import FileUpload from '@/shared/ui/FileUpload';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(franchise);
    setImage(null);
    setVideo(null);
    setIsUploading(false);
  }, [franchise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    setIsUploading(true);
    setError(null);
    try {
      await onSave(formData, franchise.id, image, video);
      onClose();
    } catch (error: any) {
      console.error('Error saving franchise:', error);

      // Более детальная обработка ошибок
      let errorMessage = 'Ошибка при сохранении франшизы. Попробуйте еще раз.';

      if (error?.response?.status === 403) {
        errorMessage = 'У вас нет прав для редактирования этой франшизы.';
      } else if (error?.response?.status === 400) {
        errorMessage = 'Некорректные данные франшизы.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Ошибка сервера. Попробуйте позже.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Редактировать франшизу" size="2xl">
      <div className="space-y-6">
        {/* Основная информация в одну строку */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Название</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              type="text"
              placeholder="Введите название франшизы"
              style={{
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Город</span>
            <input
              name="city"
              value={formData.city ?? ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              type="text"
              placeholder="Введите город"
              style={{
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
            />
          </label>
        </div>

        {/* Адрес и телефон */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Адрес</span>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              type="text"
              placeholder="Введите адрес"
              style={{
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Телефон</span>
            <input
              name="workPhone"
              value={formData.workPhone}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              type="tel"
              placeholder="Введите номер телефона"
              style={{
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
            />
          </label>
        </div>

        {/* Описание */}
        <label className="block">
          <span className="text-sm font-medium text-foreground mb-1 block">Описание</span>
          <textarea
            name="description"
            value={formData.description ?? ''}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            placeholder="Введите описание франшизы"
            style={{
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
          />
        </label>

        {/* Файлы в одну строку */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-32">
            <FileUpload
              type="image"
              label="Фото"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onFileSelect={(file) => setImage(file)}
              selectedFile={image}
            />
          </div>

          <div className="h-32">
            <FileUpload
              type="video"
              label="Видео"
              accept="video/mp4,video/x-m4v,video/quicktime,video/ogg,video/mpeg"
              onFileSelect={(file) => setVideo(file)}
              selectedFile={video}
            />
          </div>
        </div>
      </div>

      {/* Отображение ошибки */}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 font-medium"
          type="button"
          disabled={isUploading}
          style={{
            transition: 'background-color 200ms ease',
          }}
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          type="button"
          disabled={isUploading}
          style={{
            transition: 'background-color 200ms ease, opacity 200ms ease',
          }}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
              <span>Сохранение...</span>
            </>
          ) : (
            <span>Сохранить</span>
          )}
        </button>
      </div>
    </BaseModal>
  );
}
