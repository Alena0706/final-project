const jwtConfig = require('./jwtConfig');

module.exports = {
  refresh: {
    maxAge: jwtConfig.refresh.expiresIn,
    httpOnly: true,
    secure: false, // Для локальной разработки
    sameSite: 'lax', // Для работы с прокси
  },
};
