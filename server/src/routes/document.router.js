const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/document.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const upload = require('../middlewares/Multer');

// Все маршруты требуют авторизации
router.use(verifyAccessToken);

// Получить все документы пользователя
router.get('/', DocumentController.getUserDocuments);

// Загрузить контракт
router.post('/contract', upload.single('contract'), DocumentController.uploadContract);

// Загрузить платежный документ
router.post('/receipt', upload.single('receipt'), DocumentController.uploadReceipt);

// Обновить документ
router.put('/:id', upload.single('file'), DocumentController.updateDocument);

// Удалить документ
router.delete('/:id', DocumentController.deleteDocument);

// Скачать документ
router.get('/:id/download', DocumentController.downloadDocument);

module.exports = router;
