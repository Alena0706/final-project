const cookieConfig = require('../configs/cookieConfig');
const AuthService = require('../services/auth.service');
const generateTokens = require('../utils/generateTokens');
const validateEmail = require('../utils/validateEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

class AuthController {

  static async updateUser(req, res) {
    const userId = res.locals.user.id; // предположим, auth middleware добавил user в req
    const { name, email, password, phone, city } = req.body;    

    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.hashpass = await await bcrypt.hash(password, 10);
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;

    try {
      const updatedUser = await AuthService.updateUser(userId, updateData);
      console.log(updatedUser);
      const { refreshToken, accessToken } = generateTokens({ user: updatedUser });
    res
      .cookie('refreshToken', refreshToken, cookieConfig.refresh)
      .status(200)
      .json({ user: updatedUser, accessToken });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      await AuthService.uploadAvatar(req.file);
      res.status(200).json({ message: `Изображение успешно сохранено` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async signup(req, res) {
    try {
      const user = await AuthService.signup(req.body);

      const { refreshToken, accessToken } = generateTokens({ user });

      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user, accessToken });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken: oldRefreshToke } = req.cookies;
      console.log(oldRefreshToke);
      const { user } = jwt.verify(oldRefreshToke, process.env.REFRESH_TOKEN_SECRET);
      console.log(user);

      const { refreshToken, accessToken } = generateTokens({ user });

      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user, accessToken });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  }

  static async signin(req, res) {
    try {
      const user = await AuthService.signin(req.body);

      const { refreshToken, accessToken } = generateTokens({ user });

      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user, accessToken });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async logout(req, res) {
    res.clearCookie('refreshToken').sendStatus(204);
  }
}

module.exports = AuthController;
