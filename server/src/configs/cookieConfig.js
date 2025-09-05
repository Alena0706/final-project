const jwtConfig = require('./jwtConfig');

module.exports = {
  refresh: {
    maxAge: jwtConfig.refresh.expiresIn,
    httpOnly: true,
  },
};
