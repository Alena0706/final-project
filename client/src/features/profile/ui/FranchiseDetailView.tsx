import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/hooks';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Calendar,
  Edit,
} from 'lucide-react';
import axiosInstance from '@/shared/api/axiosInstance';
import EditFranchiseModal from '@/widgets/modalFranchise/ui/EditFranchiseModal';
import {
  deleteFranchise,
  updateFranchise,
  uploadImage,
} from '@/entities/openFrancise/model/thunks';
import { formatDate } from '@/shared/lib/dateUtils';
import type { FranchiseT } from '@/entities/openFrancise/model/types';


type Document = {
  id: number;
  contract?: string;
  receipt?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;

};

type FranchiseDetailViewProps = {
  franchise: FranchiseT;
  onBack: () => void;
  onFranchiseUpdate: (updatedFranchise: FranchiseT) => void;
};

const FranchiseDetailView: React.FC<FranchiseDetailViewProps> = ({
  franchise,
  onBack,
  onFranchiseUpdate,
}) => {
  const user = useAppSelector((store) => store.user.user?.user);
  const dispatch = useAppDispatch();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shouldRenderDeleteModal, setShouldRenderDeleteModal] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(0); // Для принудительного ререндера изображения

  // Загрузка документов франшизы
  useEffect(() => {
    const loadDocuments = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Ошибка загрузки документов:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDocuments();
    }
  }, [user?.id]);

  // Обновляем imageKey при изменении изображения франшизы
  useEffect(() => {
    setImageKey((prev) => prev + 1);
  }, [franchise.image]);

  // Анимация появления модального окна удаления
  useEffect(() => {
    if (showDeleteModal) {
      setShouldRenderDeleteModal(true);
      // Добавляем класс к body для отключения hover эффектов
      document.body.classList.add('modal-open');
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsDeleteModalVisible(true), 10);
    } else {
      setIsDeleteModalVisible(false);
      // Убираем класс с body
      document.body.classList.remove('modal-open');
      // Ждем завершения анимации перед удалением из DOM
      setTimeout(() => setShouldRenderDeleteModal(false), 300);
    }

    // Cleanup функция для удаления класса при размонтировании
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showDeleteModal]);

  // Обработчик загрузки контракта
  const handleContractUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingContract(true);
    try {
      const formData = new FormData();
      formData.append('contract', file);

      const response = await axiosInstance.post('/documents/contract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocuments((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Ошибка загрузки контракта:', error);
    } finally {
      setUploadingContract(false);
    }
  }, []);

  // Обработчик загрузки чека
  const handleReceiptUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await axiosInstance.post('/documents/receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocuments((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Ошибка загрузки чека:', error);
    } finally {
      setUploadingReceipt(false);
    }
  }, []);

  // Обработчик удаления документа
  const handleDeleteDocument = useCallback(async (documentId: number) => {
    try {
      await axiosInstance.delete(`/documents/${documentId}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error('Ошибка удаления документа:', error);
    }
  }, []);

  // Обработчик редактирования франшизы
  const handleEditFranchise = useCallback(() => {
    setShowEditModal(true);
  }, []);

  // Обработчик удаления франшизы
  const handleDeleteFranchise = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  // Подтверждение удаления франшизы
  const confirmDeleteFranchise = useCallback(() => {
    dispatch(deleteFranchise(franchise.id));
    onBack();
  }, [dispatch, franchise.id, onBack]);

  // Обработчик сохранения франшизы
  const handleSaveFranchise = useCallback(
    async (
      updated: any,
      franchiseId: number,
      image: File | null,
      video: File | null,
    ): Promise<void> => {
      setError(null);
      try {
        // Сначала обновляем основные данные франшизы
        let updatedFranchise = await dispatch(
          updateFranchise({ ...updated, id: franchiseId }),
        ).unwrap();

        // Затем загружаем изображение, если оно есть
        if (image) {
          updatedFranchise = await dispatch(uploadImage({ image, franchiseId })).unwrap();
          // Принудительно обновляем изображение
          setImageKey((prev) => prev + 1);
        }

        setShowEditModal(false);
        onFranchiseUpdate(updatedFranchise as FranchiseT);
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
        throw error; // Пробрасываем ошибку дальше для обработки в модальном окне
      }
    },
    [dispatch, onFranchiseUpdate],
  );

  // Мемоизируем заголовок и кнопки действий
  const headerSection = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{franchise.name}</h2>
            <p className="text-muted-foreground">Управление франшизой и документами</p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditFranchise}
            className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group"
            title="Редактировать франшизу"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={handleDeleteFranchise}
            className="p-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 hover:border-destructive/40 focus:ring-2 focus:ring-destructive/20 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group"
            title="Удалить франшизу"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    ),
    [franchise.name, onBack, handleEditFranchise, handleDeleteFranchise],
  );

  // Мемоизируем информацию о франшизе
  const franchiseInfo = useMemo(
    () => (
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Информация о франшизе</h3>

          {/* Изображение франшизы */}
          <div className="mb-6">
            {franchise.image ? (
              <img
                key={`${franchise.image}-${imageKey}`} // Принудительное обновление при изменении изображения
                src={`/api/uploads/${franchise.image}?t=${Date.now()}`} // Добавляем timestamp для обхода кеша
                alt={franchise.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-2">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Детали франшизы */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Адрес</p>
                <p className="text-sm text-muted-foreground">{franchise.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Телефон</p>
                <p className="text-sm text-muted-foreground">{franchise.workPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Город</p>
                <p className="text-sm text-muted-foreground">{franchise.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Дата создания</p>
                <p className="text-sm text-muted-foreground">{formatDate(franchise.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [franchise, imageKey],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок с кнопкой назад */}
      {headerSection}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Информация о франшизе */}
        {franchiseInfo}

        {/* Документы */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Документы</h3>

            {/* Загрузка контракта */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-2">Договор</h4>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleContractUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingContract}
                />
                <button
                  type="button"
                  className="w-full py-2 px-3 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  disabled={uploadingContract}
                >
                  {uploadingContract ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Загрузить договор
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Загрузка чека */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-2">Платежные документы</h4>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleReceiptUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingReceipt}
                />
                <button
                  type="button"
                  className="w-full py-2 px-3 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                  disabled={uploadingReceipt}
                >
                  {uploadingReceipt ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Загрузить чек
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Список документов */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Загруженные документы</h4>
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {doc.contract ? 'Договор' : 'Платежный документ'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(doc.contract || doc.receipt) && (
                          <a
                            href={`/api/uploads/${doc.contract || doc.receipt}`}
                            download
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 hover:bg-muted rounded transition-colors text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Документы не загружены
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Отображение ошибки */}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-destructive hover:text-destructive/80 text-sm underline"
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {showEditModal && (
        <EditFranchiseModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          franchise={franchise}
          onSave={handleSaveFranchise}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      {shouldRenderDeleteModal && (
        <div
          className={`modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
            isDeleteModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowDeleteModal(false)}
          style={{
            willChange: 'opacity',
            transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            className={`modal-content rounded-xl shadow-elegant p-6 w-full max-w-md mx-4 text-foreground ${
              isDeleteModalVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              willChange: 'opacity, transform',
              transition:
                'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Удалить франшизу</h3>
                <p className="text-sm text-muted-foreground">Это действие нельзя отменить</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-6">
              Вы уверены, что хотите удалить франшизу <strong>"{franchise.name}"</strong>? Все
              связанные данные будут безвозвратно удалены.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={confirmDeleteFranchise}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseDetailView;
