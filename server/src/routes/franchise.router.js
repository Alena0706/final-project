const FranchiseController = require('../controllers/franchise.controller');
const upload = require('../middlewares/Multer');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const franchiseRouter = require('express').Router();

franchiseRouter.post('/upload', verifyAccessToken, upload.single('image'), FranchiseController.uploadImage);

// Админские роуты
franchiseRouter.get('/', verifyAccessToken, FranchiseController.getAllFranchises);
franchiseRouter.patch('/', verifyAccessToken, FranchiseController.updateFranchise);
franchiseRouter.post('/', verifyAccessToken, upload.fields([{ name: 'image' }, { name: 'video' }]),  FranchiseController.createFranchise);
franchiseRouter.delete('/:id', verifyAccessToken, FranchiseController.deleteFranchise);

// Пользовательские роуты
franchiseRouter.get('/my', verifyAccessToken, FranchiseController.getUserFranchises);
franchiseRouter.post('/my', verifyAccessToken, FranchiseController.createUserFranchise);
franchiseRouter.put('/my/:id', verifyAccessToken, FranchiseController.updateUserFranchise);
franchiseRouter.delete('/my/:id', verifyAccessToken, FranchiseController.deleteUserFranchise);
franchiseRouter.post('/my/:id/image', verifyAccessToken, upload.single('image'), FranchiseController.uploadUserFranchiseImage);

module.exports = franchiseRouter;
