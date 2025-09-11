const cookieConfig = require('../configs/cookieConfig');
const AuthService = require('../services/auth.service');
const generateTokens = require('../utils/generateTokens');
const validateEmail = require('../utils/validateEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
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

      // Проверяем, включена ли 2FA у пользователя
      if (user.secret) {
        // Если 2FA включен, возвращаем пользователя без токенов
        // Клиент должен будет запросить верификацию 2FA
        return res.json({ user, message: '2FA включена', twoFactorEnabled: true });
      }

      // Если 2FA не включен, возвращаем токены как обычно

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

  // Подтверждение email (POST)
  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // Подтверждение email (GET) - перенаправление на фронтенд
  static async verifyEmailGet(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.redirect(
          `${process.env.CLIENT_URL || 'http://localhost:5173'}/?error=missing-token`,
        );
      }

      const result = await AuthService.verifyEmail(token);

      // Перенаправляем на фронтенд с успешным статусом
      res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:5173'}/?email-verified=success`,
      );
    } catch (error) {
      console.error('Verify email error:', error);
      // Перенаправляем на фронтенд с ошибкой
      res.redirect(
        `${
          process.env.CLIENT_URL || 'http://localhost:5173'
        }/?email-verified=error&message=${encodeURIComponent(error.message)}`,
      );
    }
  }

  // Повторная отправка письма подтверждения
  static async resendVerification(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendVerificationEmail(email);
      res.json(result);
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // 2FA methods
  static async generate2FASecret(req, res) {
    try {
      const userId = res.locals.user.id;
      console.log(userId);
      const user = await AuthService.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Генерируем новый секрет
      const secret = speakeasy.generateSecret({
        name: `FranchiseApp (${user.email})`,
        issuer: 'FranchiseApp',
        length: 32,
      });
      console.log(secret);

      // Сохраняем секрет в базу данных
      await AuthService.updateUser(userId, { secret: secret.base32 });

      res.json({
        secret: secret.base32,
        otpauth_url: secret.otpauth_url,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async verify2FA(req, res) {
    try {
      const userId = res.locals.user.id;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'Токен не предоставлен' });
      }

      const user = await AuthService.getUser(userId);

      if (!user || !user.secret) {
        return res
          .status(400)
          .json({ message: '2FA не настроен для этого пользователя' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (verified) {
        res.json({ verified: true, message: '2FA токен подтвержден' });
      } else {
        res.status(400).json({ verified: false, message: 'Неверный 2FA токен' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async disable2FA(req, res) {
    try {
      const userId = res.locals.user.id;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'Токен не предоставлен' });
      }

      const user = await AuthService.getUser(userId);

      if (!user || !user.secret) {
        return res
          .status(400)
          .json({ message: '2FA не настроен для этого пользователя' });
      }

      // Проверяем токен перед отключением
      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        return res.status(400).json({ message: 'Неверный 2FA токен' });
      }

      // Удаляем секрет из базы данных
      await AuthService.updateUser(userId, { secret: null });
      console.log('удаляем секрет');
      res.json({ message: '2FA успешно отключен' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async verify2FALogin(req, res) {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({ message: 'Email и токен обязательны' });
      }

      const user = await AuthService.getUserByEmail(email);

      if (!user || !user.secret) {
        return res
          .status(400)
          .json({ message: '2FA не настроен для этого пользователя' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (verified) {
        const { refreshToken, accessToken } = generateTokens({ user });
        res
          .cookie('refreshToken', refreshToken, cookieConfig.refresh)
          .json({ user, accessToken });
      } else {
        res.status(400).json({ message: 'Неверный 2FA токен' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
