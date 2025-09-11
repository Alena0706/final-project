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
  image: null,
  video: null,
  description: null,
  city: null,
};

export default function CreateFranchiseModal({
  isOpen,
  onClose,
  onCreate,
}: Props): React.JSX.Element | null {
  const [formData, setFormData] = useState<FranchiseCreateT>(defaultForm);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultForm);
      setImage(null);
      setVideo(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Ждем завершения анимации перед удалением из DOM
      setTimeout(() => setShouldRender(false), 300);
    }
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

  // Закрывать модалку нельзя, если фото или видео не загружены
  const handleClose = (): void => {
    onClose();
  };

  const handleSubmit = async (): Promise<void> => {
    setIsUploading(true);
    try {
      await onCreate(formData, image, video);
      onClose();
    } catch (error) {
      console.error('Error creating franchise:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`dark-glass rounded-xl shadow-elegant p-6 w-full max-w-2xl mx-4 text-foreground max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Создать новую франшизу</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg transition-colors"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Название *</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                type="text"
                placeholder="Введите название франшизы"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Адрес *</span>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                type="text"
                placeholder="Введите полный адрес"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Телефон *</span>
              <input
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                type="tel"
                placeholder="+7 (xxx) xxx-xx-xx"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Город</span>
              <input
                name="city"
                value={formData.city ?? ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                type="text"
                placeholder="Выберите город"
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
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Расскажите о франшизе..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Фото</span>
              <div className="relative">
                <input
                  name="image"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                />
                {image && (
                  <div className="mt-2 flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <span className="text-sm text-foreground">{image.name}</span>
                    <button
                      onClick={() => cancelFile('image')}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                      type="button"
                    >
                      Удалить
                    </button>
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
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  type="file"
                  accept="video/mp4,video/x-m4v,video/quicktime,video/ogg,video/mpeg"
                />
                {video && (
                  <div className="mt-2 flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <span className="text-sm text-foreground">{video.name}</span>
                    <button
                      onClick={() => cancelFile('video')}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                      type="button"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            type="button"
            disabled={isUploading}
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            type="button"
            disabled={isUploading || !formData.name || !formData.address || !formData.workPhone}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                <span>Создание...</span>
              </>
            ) : (
              <span>Создать франшизу</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
