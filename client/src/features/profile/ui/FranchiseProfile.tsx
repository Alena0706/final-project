import React, { useState } from 'react';
import { useModal } from '@/entities/modal/model';
import type { FranchiseT } from '@/entities/openFrancise/model/types';
import { BaseModal } from '@/shared/ui/BaseModal';
import FileUpload from '@/shared/ui/FileUpload';
import axiosInstance from '@/shared/api/axiosInstance';
import FranchiseListView from './FranchiseListView';
import FranchiseDetailView from './FranchiseDetailView';

const FranchiseProfile = (): React.JSX.Element => {
  const { open, close, isOpen } = useModal();
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseT | null>(null);

  // Состояние для создания франшизы
  const [franchiseForm, setFranchiseForm] = useState({
    name: '',
    address: '',
    workPhone: '',
    city: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Обработчик выбора франшизы
  const handleFranchiseSelect = (franchise: FranchiseT) => {
    setSelectedFranchise(franchise);
    setCurrentView('detail');
  };

  // Обработчик возврата к списку
  const handleBackToList = (): void => {
    setCurrentView('list');
    setSelectedFranchise(null);
  };

  // Обработчик создания франшизы
  const handleCreateFranchise = async () => {
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append('name', franchiseForm.name);
      formData.append('address', franchiseForm.address);
      formData.append('workPhone', franchiseForm.workPhone);
      formData.append('city', franchiseForm.city);
      formData.append('description', franchiseForm.description);

      if (image) {
        formData.append('image', image);
      }
      if (video) {
        formData.append('video', video);
      }

      await axiosInstance.post('/franchise', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      close();

      setFranchiseForm({
        name: '',
        address: '',
        workPhone: '',
        city: '',
        description: '',
      });
      setImage(null);
      setVideo(null);
      // Обновляем список франшиз (компонент FranchiseListView сам перезагрузит данные)

    } catch (error) {
      console.error('Ошибка создания франшизы:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Обработчик закрытия модального окна
  const handleCloseCreateModal = () => {
    close();
    setFranchiseForm({
      name: '',
      address: '',
      workPhone: '',
      city: '',
      description: '',
    });
    setImage(null);
    setVideo(null);
  };

  // Обработчик открытия модального окна создания
  const handleOpenCreateModal = () => {
    open('createFranchise');
  };

  // Обработчик обновления франшизы

  const handleFranchiseUpdate = (updatedFranchise: FranchiseT): void => {
    setSelectedFranchise(updatedFranchise);
  };

  return (
    <div className="space-y-8">
      {currentView === 'list' ? (
        <FranchiseListView
          onFranchiseSelect={handleFranchiseSelect}
          onCreateFranchise={handleOpenCreateModal}
        />
      ) : selectedFranchise ? (
        <FranchiseDetailView
          franchise={selectedFranchise}
          onBack={handleBackToList}
          onFranchiseUpdate={handleFranchiseUpdate}
        />
      ) : null}

      {/* Модальное окно создания франшизы */}
      <BaseModal
        isOpen={isOpen('createFranchise')}
        onClose={handleCloseCreateModal}
        title="Создать франшизу"
        size="2xl"
      >
        <div className="space-y-6">
          {/* Основная информация в одну строку */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-1 block">Название *</span>
              <input
                type="text"
                value={franchiseForm.name}
                onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Введите название франшизы"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-1 block">Город</span>
              <input
                type="text"
                value={franchiseForm.city}
                onChange={(e) => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Выберите город"
              />
            </label>
          </div>

          {/* Адрес и телефон */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-1 block">Адрес *</span>
              <input
                type="text"
                value={franchiseForm.address}
                onChange={(e) => setFranchiseForm({ ...franchiseForm, address: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Введите полный адрес"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground mb-1 block">Телефон *</span>
              <input
                type="tel"
                value={franchiseForm.workPhone}
                onChange={(e) => setFranchiseForm({ ...franchiseForm, workPhone: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+7 (xxx) xxx-xx-xx"
                required
              />
            </label>
          </div>

          {/* Описание */}
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">Описание</span>
            <textarea
              value={franchiseForm.description}
              onChange={(e) => setFranchiseForm({ ...franchiseForm, description: e.target.value })}
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
            onClick={handleCloseCreateModal}
            className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            type="button"
            disabled={isCreating}
          >
            Отмена
          </button>
          <button
            onClick={handleCreateFranchise}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            type="button"
            disabled={
              isCreating ||
              !franchiseForm.name ||
              !franchiseForm.address ||
              !franchiseForm.workPhone
            }
          >
            {isCreating ? (
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
    </div>
  );
};

export default FranchiseProfile;
