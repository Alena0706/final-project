import type { FranchiseT } from '@/entities/openFrancise/model/types';
import { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  franchise: FranchiseT;
  onSave: (updated: FranchiseT, franchiseId: number, image: File | null) => void;
};

export default function EditFranchiseModal({
  isOpen,
  onClose,
  franchise,
  onSave,
}: Props): React.JSX.Element | null {
  const [formData, setFormData] = useState<FranchiseT>(franchise);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    setFormData(franchise);
    setImage(null);
  }, [franchise]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (): void => {
    onSave(formData, franchise.id, image);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 text-gray-700" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Редактировать франшизу</h2>

        <label className="block mb-2">
          Название
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="text"
          />
        </label>

        {/* Повторите для других ваших полей */}

        <label className="block mb-2">
          Фото
          <input
            name="image"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
          />
        </label>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Отмена
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
