import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { FranchiseT } from '@/entities/openFrancise/model/types';
import EditFranchiseModal from './EditFranchiseModal';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { deleteFranchise } from '@/entities/openFrancise/model/thunks';
import { formatDate } from '@/shared/lib/dateUtils';
import { BaseModal } from '@/shared/ui/BaseModal';

interface FranchiseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  franchise: FranchiseT | null;
  onEdit?: (franchise: FranchiseT) => void;
}

const FranchiseDetailModal: React.FC<FranchiseDetailModalProps> = ({
  isOpen,
  onClose,
  franchise,
  onEdit,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useAppDispatch();

  if (!franchise) return null;

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту франшизу?')) {
      dispatch(deleteFranchise(franchise.id));
      onClose();
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSave = () => {
    setShowEditModal(false);
    onClose();
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={franchise.name}
        size="2xl"
        contentClassName="p-0"
      >
        {/* Дополнительные кнопки в заголовке */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Редактировать"
          >
            <Edit className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-destructive"
            title="Удалить"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Контент */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Изображение */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Изображение</h3>
              {franchise.image ? (
                <img
                  src={`/api/uploads/${franchise.image}`}
                  alt={franchise.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Изображение не загружено</span>
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Информация</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-foreground">Город:</span>
                    <p className="text-sm text-muted-foreground">{franchise.city || 'Не указан'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Адрес:</span>
                    <p className="text-sm text-muted-foreground">{franchise.address}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Телефон:</span>
                    <p className="text-sm text-muted-foreground">{franchise.workPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Описание:</span>
                    <p className="text-sm text-muted-foreground">
                      {franchise.description || 'Описание не указано'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Дата создания:</span>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(franchise.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Модальное окно редактирования */}
      {showEditModal && (
        <EditFranchiseModal
          isOpen={showEditModal}
          onClose={handleEditClose}
          franchise={franchise}
          onSave={handleEditSave}
        />
      )}
    </>
  );
};

export default FranchiseDetailModal;
