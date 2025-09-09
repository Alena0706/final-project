const cookieConfig = require('../configs/cookieConfig');
const AuthService = require('../services/auth.service');
const generateTokens = require('../utils/generateTokens');
const validateEmail = require('../utils/validateEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

class AuthController {
  static async updateUser(req, res) {
    try {
      const userId = res.locals.user.id;
      console.log(req.body);
      console.log(userId);
      const { name, email, password, phone, city, balance, transactions, oldpassword } =
        req.body;

      if (email && !validateEmail(email)) {
        return res.status(400).json({ error: 'Некорректный email' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.hashpass = await bcrypt.hash(password, 10);
      if (phone) updateData.phone = phone;
      if (city) updateData.city = city;
      if (balance) updateData.balance = balance;
      if (transactions) {
        const user = await AuthService.getUser(userId);
        const currentTransactions = user?.transactions || [];
        updateData.transactions = [...currentTransactions, ...transactions];
      }
      if (oldpassword) {
        const user = await AuthService.validatePassword(oldpassword, userId);
        if (user) {
          if (password) updateData.hashpass = await bcrypt.hash(password, 10);
        }
      }

      const updatedUser = await AuthService.updateUser(userId, updateData);
      console.log(updatedUser);
      const { refreshToken, accessToken } = generateTokens({ user: updatedUser });
      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .status(200)
        .json({ user: updatedUser, accessToken });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ message: err.message });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Файл не найден' });
      }

      const updatedUser = await AuthService.uploadAvatar(req.file, res.locals.user.id);

      res.status(200).json({
        message: `Изображение успешно сохранено`,
        user: updatedUser,
      });
    } catch (err) {
      console.error('Upload avatar error:', err);
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
      console.error('Signup error:', err);
      res.status(500).json({ message: err.message });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken: oldRefreshToke } = req.cookies;
      const { user: tokenUser } = jwt.verify(
        oldRefreshToke,
        process.env.REFRESH_TOKEN_SECRET,
      );

      // Загружаем свежие данные пользователя из базы данных
      const freshUser = await AuthService.getUser(tokenUser.id);

      const { refreshToken, accessToken } = generateTokens({ user: freshUser });

      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user: freshUser, accessToken });
    } catch (err) {
      console.error('Refresh token error:', err);
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
      console.error('Signin error:', err);
      res.status(500).json({ message: err.message });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie('refreshToken').sendStatus(204);
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
