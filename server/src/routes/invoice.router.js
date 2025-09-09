const InvoiceController = require('../controllers/invoice.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const { requireAdmin } = require('../middlewares/checkRole');

const invoiceRouter = require('express').Router();

// Создать счет (только админ)
invoiceRouter.post('/', verifyAccessToken, requireAdmin, InvoiceController.createInvoice);

// Получить счета пользователя
invoiceRouter.get('/my', verifyAccessToken, InvoiceController.getUserInvoices);

// Получить все счета (только админ)
invoiceRouter.get('/all', verifyAccessToken, requireAdmin, InvoiceController.getAllInvoices);

// Получить детали счета
invoiceRouter.get('/:invoiceId', verifyAccessToken, InvoiceController.getInvoiceDetails);

// Оплатить счет
invoiceRouter.post('/:invoiceId/pay', verifyAccessToken, InvoiceController.payInvoice);

// Отменить счет (только админ)
invoiceRouter.patch('/:invoiceId/cancel', verifyAccessToken, requireAdmin, InvoiceController.cancelInvoice);

module.exports = invoiceRouter;
