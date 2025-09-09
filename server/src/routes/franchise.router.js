const FranchiseController = require('../controllers/franchise.controller');
const upload = require('../middlewares/Multer');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const franchiseRouter = require('express').Router();

franchiseRouter.post('/upload', verifyAccessToken, upload.single('image'), FranchiseController.uploadImage);

franchiseRouter.get('/', verifyAccessToken, FranchiseController.getAllFranchises);
franchiseRouter.patch('/', verifyAccessToken, FranchiseController.updateFranchise);
franchiseRouter.post('/', verifyAccessToken, upload.fields([{ name: 'image' }, { name: 'video' }]),  FranchiseController.createFranchise);
franchiseRouter.delete('/:id', verifyAccessToken, FranchiseController.deleteFranchise);

module.exports = franchiseRouter;