import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/shared/hooks/hooks';
import { Building2, Plus, Eye } from 'lucide-react';
import { FranchiseT } from '@/entities/openFrancise/model/types';
import axiosInstance from '@/shared/api/axiosInstance';

interface FranchiseListViewProps {
  onFranchiseSelect: (franchise: FranchiseT) => void;
  onCreateFranchise: () => void;
}

const FranchiseListView: React.FC<FranchiseListViewProps> = ({
  onFranchiseSelect,
  onCreateFranchise,
}) => {
  const user = useAppSelector((store) => store.user.user?.user);
  const [franchises, setFranchises] = useState<FranchiseT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка франшиз пользователя
  useEffect(() => {
    const loadFranchises = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/franchise/my');
        setFranchises(response.data);
      } catch (error) {
        console.error('Ошибка загрузки франшиз:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadFranchises();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка создания */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Мои франшизы</h2>
          <p className="text-muted-foreground">Управляйте своими франшизами и документами</p>
        </div>
        <button
          onClick={onCreateFranchise}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group"
        >
          <Plus className="h-4 w-4" />
          Создать франшизу
        </button>
      </div>

      {/* Список франшиз */}
      {franchises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {franchises.map((franchise) => (
            <div key={franchise.id} className="card group hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Изображение франшизы */}
                <div className="mb-4">
                  {franchise.image ? (
                    <img
                      src={`/api/uploads/${franchise.image}`}
                      alt={franchise.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Информация о франшизе */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{franchise.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{franchise.city}</p>
                  <p className="text-sm text-foreground line-clamp-2">{franchise.description}</p>
                </div>

                {/* Действия */}
                <div className="flex justify-center">
                  <button
                    onClick={() => onFranchiseSelect(franchise)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 text-sm group"
                  >
                    <Eye className="h-4 w-4" />
                    Детали
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">У вас пока нет франшиз</p>
          <button
            onClick={onCreateFranchise}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group"
          >
            <Plus className="h-4 w-4" />
            Создать первую франшизу
          </button>
        </div>
      )}
    </div>
  );
};

export default FranchiseListView;
