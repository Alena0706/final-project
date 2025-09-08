const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');
const upload = require('../middlewares/Multer');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const { requireAdmin } = require('../middlewares/checkRole');

const authRouter = require('express').Router();

authRouter.post('/signup', AuthController.signup);
authRouter.post('/signin', AuthController.signin);
authRouter.get('/refresh', AuthController.refresh);
authRouter.delete('/logout', AuthController.logout);
authRouter.post('/upload', verifyAccessToken, upload.single('avatar'), AuthController.uploadAvatar);
authRouter.patch('/update', verifyAccessToken, AuthController.updateUser);
authRouter.get('/users', verifyAccessToken, requireAdmin, UserController.getAllUsers);

module.exports = authRouter;
