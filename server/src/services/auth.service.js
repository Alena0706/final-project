const { User } = require('../../db/models');
const bcrypt = require('bcrypt');

class AuthService {
  static async signup({ name, email, password }) {
    if (!email || !password) {
      throw new Error('Заполните все поля');
    }

    const hashpass = await bcrypt.hash(password, 10);

    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: { name, hashpass },
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