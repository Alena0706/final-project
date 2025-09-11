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
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(franchise);
    setImage(null);
    setVideo(null);
    setIsUploading(false);
  }, [franchise]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Добавляем класс к body для отключения hover эффектов
      document.body.classList.add('modal-open');
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Убираем класс с body
      document.body.classList.remove('modal-open');
      // Ждем завершения анимации перед удалением из DOM
      setTimeout(() => setShouldRender(false), 300);
    }

    // Cleanup функция для удаления класса при размонтировании
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!shouldRender) return null;

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
    setError(null);
    try {
      await onSave(formData, franchise.id, image, video);
      onClose();
    } catch (error) {
      console.error('Error saving franchise:', error);
      setError('Ошибка при сохранении франшизы. Попробуйте еще раз.');
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div
      className={`modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      style={{ 
        willChange: 'opacity',
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div
        className={`modal-content rounded-xl shadow-elegant p-6 w-full max-w-2xl mx-4 text-foreground max-h-[90vh] overflow-y-auto ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          willChange: 'opacity, transform',
          transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center center'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Редактировать франшизу</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg"
            type="button"
            style={{
              transition: 'color 200ms ease, background-color 200ms ease'
            }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Название</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                type="text"
                placeholder="Введите название франшизы"
                style={{
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Адрес</span>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                type="text"
                placeholder="Введите адрес"
                style={{
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Телефон</span>
              <input
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                type="tel"
                placeholder="Введите номер телефона"
                style={{
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Город</span>
              <input
                name="city"
                value={formData.city ?? ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                type="text"
                placeholder="Введите город"
                style={{
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Описание</span>
              <textarea
                name="description"
                value={formData.description ?? ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Введите описание франшизы"
                style={{
                  transition: 'border-color 200ms ease, box-shadow 200ms ease'
                }}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Фото</span>
              <div className="relative">
                <input
                  name="image"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{
                    transition: 'border-color 200ms ease, box-shadow 200ms ease'
                  }}
                />
                {image && (
                  <div className="mt-2 flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <span className="text-sm text-foreground">{image.name}</span>
                    <button
                      onClick={() => cancelFile('image')}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                      type="button"
                      style={{
                        transition: 'color 200ms ease'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                )}
                {franchise.image && !image && (
                  <div className="mt-2 bg-muted/30 rounded-lg p-3">
                    <span className="text-sm text-muted-foreground">
                      Текущее изображение: {franchise.image}
                    </span>
                  </div>
                )}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Видео</span>
              <div className="relative">
                <input
                  name="video"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  type="file"
                  accept="video/mp4,video/x-m4v,video/quicktime,video/ogg,video/mpeg"
                  style={{
                    transition: 'border-color 200ms ease, box-shadow 200ms ease'
                  }}
                />
                {video && (
                  <div className="mt-2 flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <span className="text-sm text-foreground">{video.name}</span>
                    <button
                      onClick={() => cancelFile('video')}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                      type="button"
                      style={{
                        transition: 'color 200ms ease'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                )}
                {franchise.video && !video && (
                  <div className="mt-2 bg-muted/30 rounded-lg p-3">
                    <span className="text-sm text-muted-foreground">
                      Текущее видео: {franchise.video}
                    </span>
                  </div>
                )}
              </div>
            </label>
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
              transition: 'background-color 200ms ease'
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
              transition: 'background-color 200ms ease, opacity 200ms ease'
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
      </div>
    </div>
  );
}
