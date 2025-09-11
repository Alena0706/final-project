const sharp = require('sharp');
const fs = require('fs');
const { Franchise } = require('../../db/models');
const path = require('path');

class FranchiseService {
  static async getAllFranchises() {
    const getAll = await Franchise.findAll();
    return getAll;
  }

  static async getFranchise(name) {
    const getFranchise = await Franchise.findOne({
      where: { name },
    });
    return getFranchise;
  }

  static async updateFranchise(franchise) {
    try {
      console.log('🔍 FranchiseService.updateFranchise - input:', franchise);

      if (!franchise.id) {
        throw new Error('ID франшизы обязателен для обновления');
      }

      // Сначала проверим, существует ли франшиза
      const existingFranchise = await Franchise.findByPk(franchise.id);
      console.log(
        '🔍 FranchiseService.updateFranchise - existing franchise:',
        existingFranchise,
      );

      if (!existingFranchise) {
        throw new Error('Франшиза не найдена');
      }

      const [updatedRowsCount] = await Franchise.update(franchise, {
        where: { id: franchise.id },
      });

      console.log(
        '🔍 FranchiseService.updateFranchise - updated rows:',
        updatedRowsCount,
      );

      if (updatedRowsCount === 0) {
        throw new Error('Франшиза не была обновлена');
      }

      const updatedFranchise = await Franchise.findByPk(franchise.id);
      console.log('🔍 FranchiseService.updateFranchise - result:', updatedFranchise);
      return updatedFranchise;
    } catch (error) {
      console.error('Error updating franchise:', error);
      throw error;
    }
  }

  static async createFranchise(franchise) {
    try {
      // Валидация обязательных полей
      if (!franchise.name || !franchise.address || !franchise.workPhone) {
        throw new Error('Название, адрес и телефон являются обязательными полями');
      }

      const createdFranchise = await Franchise.create(franchise);
      return createdFranchise;
    } catch (error) {
      console.error('Error creating franchise:', error);
      throw error;
    }
  }

  static async deleteFranchise(franchiseId) {
    await Franchise.destroy({
      where: { id: franchiseId },
    });
  }

  static async getUserFranchises(userId) {
    const franchises = await Franchise.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return franchises;
  }

  static async uploadImage(image, franchiseId) {
    try {
      const uploadDir = path.join(__dirname, '../../public/imageFranchise');

      // Создаем директорию если не существует

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Уникальное имя файла
      const fileName = `${Date.now()}-${franchiseId}.webp`;
      const filePath = path.join(uploadDir, fileName);

      // Конвертация и сохранение изображения в WebP с помощью Sharp
      await sharp(image.buffer)
        .webp({ quality: 85 }) // Увеличиваем качество до 85%
        .resize(400, 300, { fit: 'cover' }) // Увеличиваем размер для лучшего качества
        .toFile(filePath);

      const imageFranchisePath = path
        .join('imageFranchise', fileName)
        .replace(/\\/g, '/');

      // Обновляем запись в базе данных
      await Franchise.update(
        { image: imageFranchisePath },
        { where: { id: franchiseId } },
      );

      // Возвращаем обновленную франшизу
      const updatedFranchise = await Franchise.findByPk(franchiseId);
      return updatedFranchise;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Не удалось загрузить изображение: ${error.message}`);
    }
  }
}

module.exports = FranchiseService;
