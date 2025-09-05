const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAccessToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send('Нет заголовка Authorization');
    }

    const accessToken = authHeader.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    res.locals.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: err.message });
  }
}

module.exports = verifyAccessToken;