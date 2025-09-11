import React, { useState, useEffect } from 'react';
import type { FranchiseCreateT } from '@/entities/openFrancise/model/types';
import FileUpload from '@/shared/ui/FileUpload';
import { BaseModal } from '@/shared/ui/BaseModal';

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

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultForm);
      setImage(null);
      setVideo(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="Создать новую франшизу" size="2xl">
      <div className="space-y-6">
        {/* Основная информация в одну строку */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Название *</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              type="text"
              placeholder="Введите название франшизы"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Город</span>
            <input
              name="city"
              value={formData.city ?? ''}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              type="text"
              placeholder="Выберите город"
            />
          </label>
        </div>

        {/* Адрес и телефон */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Адрес *</span>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              type="text"
              placeholder="Введите полный адрес"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Телефон *</span>
            <input
              name="workPhone"
              value={formData.workPhone}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              type="tel"
              placeholder="+7 (xxx) xxx-xx-xx"
              required
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
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            rows={3}
            placeholder="Расскажите о франшизе..."
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

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
        <button
          onClick={onClose}
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
    </BaseModal>
  );
}
