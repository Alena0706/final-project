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
    formData.set('userId', userId);
    void dispatch(createFranchise(formData));
    closeModal();
  };

  // Обновить франшизу
  const saveFranchise = (updated: FranchiseT, franchiseId: number, image: File | null): void => {
    if (image) {
      void dispatch(uploadImage({ image, franchiseId }));
    }
    void dispatch(updateFranchise(updated));
    closeModal();
  };

  return (
    <>
      {admin && <button onClick={openCreateModal}>Создать франшизу</button>}

      {/* Карточки */}
      {franchises.map((f) => (
        <FranchiseCard key={f.id} franchise={f} setIsOpen={() => openEditModal(f)} />
      ))}

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
    </>
  );
}
