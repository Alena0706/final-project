const sharp = require('sharp');
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
    await Franchise.update(franchise, {
      where: { id: franchise.id },
    });
    const getFranchise = await Franchise.findByPk(franchise.id);
    return getFranchise;
  }

  static async createFranchise(franchise) {
    const createFranchise = await Franchise.create(franchise);
    return createFranchise;
  }

  static async deleteFranchise(franchiseId) {
    await Franchise.destroy({
      where: { id: franchiseId },
    });
  }

  static async uploadImage(image, franchiseId) {
      const uploadDir = path.join(__dirname, '../../public/imageFranchise');
        // Уникальное имя файла
        const fileName = `${Date.now()}.webp`;
        const filePath = path.join(uploadDir, fileName);
        console.log(franchiseId, "ddddd");
        console.log(image)
    
        // Конвертация и сохранение изображения в WebP с помощью Sharp
        await sharp(image.buffer)
          .webp({ quality: 80 }) // Указываем формат WebP и качество 80%
          .resize(256, 256, { fit: 'cover' }) // Указываем размер изображения
          .toFile(filePath);
        const imageFranchisePath = path.join('imageFranchise', fileName);
        console.log(imageFranchisePath);
        if (!imageFranchisePath) {
          throw new Error('Не удалось загрузить изображение');
        }
        await Franchise.update({ image: imageFranchisePath }, { where: { id: franchiseId } });
  }


  
}

module.exports = FranchiseService;
