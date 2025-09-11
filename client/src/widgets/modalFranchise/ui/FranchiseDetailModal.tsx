import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import type { FranchiseT } from '@/entities/openFrancise/model/types';
import EditFranchiseModal from './EditFranchiseModal';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { deleteFranchise } from '@/entities/openFrancise/model/thunks';
import { formatDate } from '@/shared/lib/dateUtils';

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
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && franchise) {
      setShouldRender(true);
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Ждем завершения анимации перед удалением из DOM
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen, franchise]);

  if (!shouldRender || !franchise) return null;

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
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className={`dark-glass rounded-xl shadow-elegant max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}>
          {/* Заголовок */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{franchise.name}</h2>
              <p className="text-muted-foreground">Детальная информация о франшизе</p>
            </div>
            <div className="flex items-center gap-2">
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
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Закрыть"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
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
        </div>
      </div>

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
