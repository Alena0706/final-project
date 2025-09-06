const AuthController = require('../controllers/auth.controller');
const upload = require('../middlewares/Multer');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const authRouter = require('express').Router();

authRouter.post('/signup', AuthController.signup);
authRouter.post('/signin', AuthController.signin);
authRouter.get('/refresh', AuthController.refresh);
authRouter.delete('/logout', AuthController.logout);
authRouter.post('/upload', upload.single('avatar'), AuthController.uploadAvatar);
authRouter.patch('/update', verifyAccessToken, AuthController.updateUser);

module.exports = authRouter;
