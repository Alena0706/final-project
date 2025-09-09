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
      if (!res.locals.user.admin) {
        res.status(403).json({ message: 'Только админ может вносить изменения' });
      }
      const franchise = await FranchiseService.updateFranchise(req.body);
      res.status(200).json(franchise);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createFranchise(req, res) {
    try {
      if (!res.locals.user.admin) {
        return res.status(403).json({ message: 'Только админ может вносить изменения' });
      }
      // Создаём запись франшизы в БД
      await FranchiseService.createFranchise(req.body);
      const franchise = await FranchiseService.getFranchise(req.body.name);
      const {id} = franchise.get();
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
        res.status(403).json({ message: 'Только админ может вносить изменения' });
      }
      console.log(req.params, 'ddd222222dd');
      await FranchiseService.deleteFranchise(+req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async uploadImage(req, res) {
    try {
      if (!res.locals.user.admin) {
        res.status(403).json({ message: 'Только админ может вносить изменения' });
      }
      await FranchiseService.uploadImage(req.file, +req.body.franchiseId);
      res.status(200).json({ message: `Изображение успешно сохранено` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = FranchiseController;
