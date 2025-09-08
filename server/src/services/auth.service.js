const sharp = require('sharp');
const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const path = require('path');

class AuthService {
  static async validatePassword(password, userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }
    const correct = await bcrypt.compare(password, user.hashpass);
    if (!correct) {
      throw new Error('Неверный пароль');
    }

    return true;
  }

  static async getUser(userId) {
    console.log(userId, 'service');
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }
    const plainUser = user.get();
    console.log(plainUser);
    delete plainUser.hashpass;
    return plainUser;
  }

  static async updateUser(userId, updateData) {
    await User.update(updateData, { where: { id: userId } });
    const updatedUser = await User.findByPk(userId);
    const plainUser = updatedUser.get();
    delete plainUser.hashpass;
    return plainUser;
  }

  static async uploadAvatar(avatarFile, userId) {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    // Уникальное имя файла
    const fileName = `${Date.now()}.webp`;
    const filePath = path.join(uploadDir, fileName);

    // Конвертация и сохранение изображения в WebP с помощью Sharp
    await sharp(avatarFile.buffer)
      .webp({ quality: 80 }) // Указываем формат WebP и качество 80%
      .resize(256, 256, { fit: 'cover' }) // Указываем размер изображения
      .toFile(filePath);
    const avatarPath = path.join('uploads', fileName);
    console.log(avatarPath);
    if (!avatarPath) {
      throw new Error('Не удалось загрузить изображение');
    }
    await User.update({ avatar: avatarPath }, { where: { id: userId } });
  }

  static async signup({ name, email, password, city, phone }) {
    if (!email || !password) {
      throw new Error('Заполните все поля');
    }
    console.log(name);
    const hashpass = await bcrypt.hash(password, 10);

    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: { name, hashpass, city, phone },
    });

    if (!isCreated) {
      throw new Error('Пользователь с таким email уже есть');
    }

    const plainUser = user.get();

    delete plainUser.hashpass;

    return plainUser;
  }

  static async signin({ email, password }) {
    if (!email || !password) {
      throw new Error('Заполните все поля');
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Неверные данные');
    }

    const correct = await bcrypt.compare(password, user.hashpass);

    if (!correct) {
      throw new Error('Неверные данные');
    }

    const plainUser = user.get();

    delete plainUser.hashpass;

    return plainUser;
  }
}

module.exports = AuthService;
