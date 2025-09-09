import FranchiseCard from '@/entities/openFrancise/ui/FranchiseCard';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import EditFranchiseModal from '@/widgets/modalFranchise/ui/EditFranchiseModal';
import React, { useState } from 'react';
import type { FranchiseCreateT, FranchiseT } from '@/entities/openFrancise/model/types';
import {
  createFranchise,
  updateFranchise,
  uploadImage,
} from '@/entities/openFrancise/model/thunks';

import CreateFranchiseModal from '@/widgets/modalFranchise/ui/CreateFranchiseModal';

export default function FranchiseList(): React.JSX.Element {
  const admin = useAppSelector((store) => store.user.user?.user.admin);
  const dispatch = useAppDispatch();
  const franchises = useAppSelector((store) => store.franchise.franchises);
  const franchiseStatus = useAppSelector((store) => store.franchise.status);
  const userId = useAppSelector((store) => store.user.user?.user.id);
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseT | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  console.log(franchises);
  // Открыть создание
  const openCreateModal = (): void => {
    setSelectedFranchise(null);
    setIsCreateMode(true);
  };

  // Открыть редактирование
  const openEditModal = (franchise: FranchiseT): void => {
    setSelectedFranchise(franchise);
    setIsCreateMode(false);
  };

  // Закрыть модалки
  const closeModal = (): void => {
    setSelectedFranchise(null);
    setIsCreateMode(false);
  };

  // Создать франшизу
  const createFranchises = (
    franchise: FranchiseCreateT,
    image: File | null,
    video: File | null,
  ): void => {
    const formData = new FormData();

    // Добавляем поля франшизы по ключам
    Object.entries(franchise).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Добавляем файлы, если они есть
    if (image) {
      formData.append('image', image);
    }
    if (video) {
      formData.append('video', video);
    }
    formData.set('userId', String(userId ?? 0));
    void dispatch(createFranchise(formData));
    closeModal();
  };

  // Обновить франшизу
  const saveFranchise = async (
    updated: FranchiseT,
    franchiseId: number,
    image: File | null,
    video: File | null,
  ): Promise<void> => {
    try {
      // Сначала обновляем основные данные франшизы
      await dispatch(updateFranchise(updated)).unwrap();

      // Затем загружаем изображение, если оно есть (это автоматически обновит состояние)
      if (image) {
        await dispatch(uploadImage({ image, franchiseId })).unwrap();
      }

      // TODO: Add video upload logic if needed
      if (video) {
        console.log('Video upload not yet implemented:', video.name);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving franchise:', error);
      // Не закрываем модалку в случае ошибки
    }
  };

  return (
    <div className="space-y-6">
      {admin && (
        <div className="flex justify-center mb-8">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="mr-2">✨</span>
            Создать новую франшизу
          </button>
        </div>
      )}

      {/* Карточки */}
      {franchiseStatus === 'loading' ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-lg text-gray-600">Загрузка франшиз...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {franchises.map((f) => (
              <FranchiseCard key={f.id} franchise={f} setIsOpen={() => openEditModal(f)} />
            ))}
          </div>

          {franchises.length === 0 && franchiseStatus === 'loaded' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Франшиз пока нет</h3>
              <p className="text-gray-500">
                {admin
                  ? 'Создайте первую франшизу, чтобы начать!'
                  : 'Скоро здесь появятся наши франшизы'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Модалки */}
      <CreateFranchiseModal
        isOpen={isCreateMode}
        onClose={closeModal}
        onCreate={createFranchises}
      />

      {selectedFranchise && (
        <EditFranchiseModal
          isOpen={!isCreateMode}
          onClose={closeModal}
          franchise={selectedFranchise}
          onSave={saveFranchise}
        />
      )}
    </div>
  );
}
