const FranchiseService = require('../services/franchise.service');
const { Franchise } = require('../../db/models');
const fs = require('fs');
const path = require('path');

class FranchiseController {
  static async getAllFranchises(req, res) {
    try {
      const franchises = await FranchiseService.getAllFranchises();
      res.status(200).json(franchises);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateFranchise(req, res) {
    try {
      const userId = res.locals.user.id;
      const franchiseId = req.body.id;

      console.log('🔍 Universal updateFranchise - user:', res.locals.user);
      console.log('🔍 Universal updateFranchise - franchiseId:', franchiseId);
      console.log('🔍 Universal updateFranchise - body:', req.body);

      if (!franchiseId) {
        return res.status(400).json({ message: 'ID франшизы обязателен для обновления' });
      }

      // Проверяем права доступа: либо админ, либо владелец франшизы
      const franchise = await Franchise.findByPk(franchiseId);
      if (!franchise) {
        return res.status(404).json({ message: 'Франшиза не найдена' });
      }

      const isAdmin = res.locals.user.admin;
      const isOwner = franchise.userId === userId;

      console.log('🔍 Universal updateFranchise - isAdmin:', isAdmin);
      console.log('🔍 Universal updateFranchise - isOwner:', isOwner);
      console.log('🔍 Universal updateFranchise - franchise.userId:', franchise.userId);
      console.log('🔍 Universal updateFranchise - current userId:', userId);

      if (!isAdmin && !isOwner) {
        return res
          .status(403)
          .json({ message: 'У вас нет прав для редактирования этой франшизы' });
      }

      console.log('🔍 Universal updateFranchise - access granted, proceeding...');
      const updatedFranchise = await FranchiseService.updateFranchise(req.body);
      console.log('🔍 Universal updateFranchise - success:', updatedFranchise);
      res.status(200).json(updatedFranchise);
    } catch (error) {
      console.error('Error updating franchise:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async createFranchise(req, res) {
    try {
      const userId = res.locals.user.id;
      const isAdmin = res.locals.user.admin;

      // Подготавливаем данные франшизы
      const franchiseData = {
        ...req.body,
        userId: isAdmin ? req.body.userId || userId : userId, // Админ может указать userId, пользователь использует свой
      };

      // Создаём запись франшизы в БД
      await FranchiseService.createFranchise(franchiseData);
      const franchise = await FranchiseService.getFranchise(req.body.name);
      const { id } = franchise.get();
      console.log(id, 'franchise');

      const files = req.files || {};
      const imageFile = files.image ? files.image[0] : null;
      const videoFile = files.video ? files.video[0] : null;

      // Обработка и сохранение фото (например, через sharp)
      if (imageFile) {
        await FranchiseService.uploadImage(imageFile, id);
      }

      // Отдельная обработка видео - сохраняем на диск
      if (videoFile) {
        const uploadDir = path.join(__dirname, '../../public/videoFranchise');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileName = `${Date.now()}${path.extname(videoFile.originalname)}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, videoFile.buffer);

        // Можно сохранить путь к видео в базе, например:
        await Franchise.update(
          { video: `videoFranchise/${fileName}` },
          { where: { id } },
        );
      }
      const franch = await FranchiseService.getFranchise(req.body.name);

      return res.status(201).json(franch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteFranchise(req, res) {
    try {
      if (!res.locals.user.admin) {
        return res.status(403).json({ message: 'Только админ может вносить изменения' });
      }
      const franchiseId = parseInt(req.params.id);
      if (isNaN(franchiseId)) {
        return res.status(400).json({ message: 'Некорректный ID франшизы' });
      }
      await FranchiseService.deleteFranchise(franchiseId);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting franchise:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async uploadImage(req, res) {
    try {
      const userId = res.locals.user.id;
      const franchiseId = parseInt(req.body.franchiseId);

      console.log('🔍 Universal uploadImage - user:', res.locals.user);
      console.log('🔍 Universal uploadImage - franchiseId:', franchiseId);

      if (!req.file) {
        return res.status(400).json({ message: 'Файл изображения не найден' });
      }

      if (isNaN(franchiseId)) {
        return res.status(400).json({ message: 'Некорректный ID франшизы' });
      }

      // Проверяем права доступа: либо админ, либо владелец франшизы
      const franchise = await Franchise.findByPk(franchiseId);
      if (!franchise) {
        return res.status(404).json({ message: 'Франшиза не найдена' });
      }

      const isAdmin = res.locals.user.admin;
      const isOwner = franchise.userId === userId;

      console.log('🔍 Universal uploadImage - isAdmin:', isAdmin);
      console.log('🔍 Universal uploadImage - isOwner:', isOwner);
      console.log('🔍 Universal uploadImage - franchise.userId:', franchise.userId);
      console.log('🔍 Universal uploadImage - current userId:', userId);

      if (!isAdmin && !isOwner) {
        return res
          .status(403)
          .json({ message: 'У вас нет прав для загрузки изображения к этой франшизе' });
      }

      console.log('🔍 Universal uploadImage - access granted, proceeding...');
      const updatedFranchise = await FranchiseService.uploadImage(req.file, franchiseId);
      console.log('🔍 Universal uploadImage - success:', updatedFranchise);
      res.status(200).json(updatedFranchise);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Получить франшизы пользователя
  static async getUserFranchises(req, res) {
    try {
      const userId = res.locals.user.id;
      const franchises = await FranchiseService.getUserFranchises(userId);
      res.status(200).json(franchises);
    } catch (error) {
      console.error('Error getting user franchises:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Создать франшизу пользователем
  static async createUserFranchise(req, res) {
    try {
      const userId = res.locals.user.id;
      const franchiseData = {
        ...req.body,
        userId,
      };

      const franchise = await FranchiseService.createFranchise(franchiseData);
      res.status(201).json(franchise);
    } catch (error) {
      console.error('Error creating user franchise:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Удалить франшизу пользователя
  static async deleteUserFranchise(req, res) {
    try {
      const userId = res.locals.user.id;
      const franchiseId = parseInt(req.params.id);

      if (isNaN(franchiseId)) {
        return res.status(400).json({ message: 'Некорректный ID франшизы' });
      }

      // Проверяем, что франшиза принадлежит пользователю
      const franchise = await Franchise.findOne({
        where: { id: franchiseId, userId },
      });

      if (!franchise) {
        return res
          .status(403)
          .json({ message: 'У вас нет прав для удаления этой франшизы' });
      }

      await FranchiseService.deleteFranchise(franchiseId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user franchise:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = FranchiseController;
