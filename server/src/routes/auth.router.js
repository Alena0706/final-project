const AuthController = require('../controllers/auth.controller');
const upload = require('../middlewares/Multer');

const authRouter = require('express').Router();

authRouter.post('/signup', AuthController.signup);
authRouter.post('/signin', AuthController.signin);
authRouter.get('/refresh', AuthController.refresh);
authRouter.delete('/logout', AuthController.logout);
authRouter.post('/api/upload', upload.single('avatar'), AuthController.uploadAvatar);

module.exports = authRouter;
