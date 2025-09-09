const WalletController = require('../controllers/wallet.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const { requireAdmin } = require('../middlewares/checkRole');

const walletRouter = require('express').Router();

// Получить кошелек пользователя
walletRouter.get('/', verifyAccessToken, WalletController.getWallet);

// Получить историю транзакций
walletRouter.get('/transactions', verifyAccessToken, WalletController.getTransactionHistory);

// Пополнить кошелек
walletRouter.post('/topup', verifyAccessToken, WalletController.topUpWallet);

// Получить все кошельки (только админ)
walletRouter.get('/all', verifyAccessToken, requireAdmin, WalletController.getAllWallets);

module.exports = walletRouter;
