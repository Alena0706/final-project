const cookieConfig = require('../configs/cookieConfig');
const AuthService = require('../services/auth.service');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AuthController {

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

      const { user } = jwt.verify(oldRefreshToke, process.env.REFRESH_TOKEN_SECRET);

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
