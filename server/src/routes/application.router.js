const express = require('express');
const ApplicationController = require('../controllers/application.controller');

const router = express.Router();

// Отправка заявки на франшизу
router.post('/submit', ApplicationController.submitApplication);

module.exports = router;
