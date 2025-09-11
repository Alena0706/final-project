import React, { useState } from 'react';
import axiosInstance from '@/shared/api/axiosInstance';
import FranchiseListView from './FranchiseListView';
import FranchiseDetailView from './FranchiseDetailView';
import type { FranchiseT } from '@/entities/openFrancise/model/types';

const FranchiseProfile = (): React.JSX.Element => {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseT | null>(null);
  const [showCreateFranchise, setShowCreateFranchise] = useState(false);

  // Состояние для создания франшизы
  const [franchiseForm, setFranchiseForm] = useState({
    name: '',
    address: '',
    workPhone: '',
    city: '',
    description: '',
  });

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
  const handleCreateFranchise = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await axiosInstance.post('/franchise/my', franchiseForm);

      setShowCreateFranchise(false);
      setFranchiseForm({
        name: '',
        address: '',
        workPhone: '',
        city: '',
        description: '',
      });
    } catch (error) {
      console.error('Ошибка создания франшизы:', error);
    }
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
          onCreateFranchise={() => setShowCreateFranchise(true)}
        />
      ) : selectedFranchise ? (
        <FranchiseDetailView
          franchise={selectedFranchise}
          onBack={handleBackToList}
          onFranchiseUpdate={handleFranchiseUpdate}
        />
      ) : null}

      {/* Модальное окно создания франшизы */}
      {showCreateFranchise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Создать франшизу</h3>
                <button
                  onClick={() => setShowCreateFranchise(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFranchise} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Название франшизы
                  </label>
                  <input
                    type="text"
                    value={franchiseForm.name}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Адрес</label>
                  <input
                    type="text"
                    value={franchiseForm.address}
                    onChange={(e) =>
                      setFranchiseForm({ ...franchiseForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={franchiseForm.workPhone}
                    onChange={(e) =>
                      setFranchiseForm({ ...franchiseForm, workPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Город</label>
                  <input
                    type="text"
                    value={franchiseForm.city}
                    onChange={(e) => setFranchiseForm({ ...franchiseForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
                  <textarea
                    value={franchiseForm.description}
                    onChange={(e) =>
                      setFranchiseForm({ ...franchiseForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateFranchise(false)}
                    className="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseProfile;
