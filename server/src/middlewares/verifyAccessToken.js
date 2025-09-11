const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAccessToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔍 verifyAccessToken - authHeader exists:', !!authHeader);
    console.log('🔍 verifyAccessToken - URL:', req.url);
    console.log('🔍 verifyAccessToken - method:', req.method);

    if (!authHeader) {
      console.log('🔍 verifyAccessToken - no auth header');
      return res.status(401).send('Нет заголовка Authorization');
    }

    const accessToken = authHeader.split(' ')[1];
    console.log('🔍 verifyAccessToken - token exists:', !!accessToken);

    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log('🔍 verifyAccessToken - user:', user);

    res.locals.user = user;
    req.user = user; // Добавляем пользователя в req для совместимости с checkRole

    next();
  } catch (err) {
    console.log('🔍 verifyAccessToken - error:', err);
    res.status(403).json({ message: err.message });
  }
}

module.exports = verifyAccessToken;
