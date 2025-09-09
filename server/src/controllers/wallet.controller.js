const { Wallet, Transaction, User } = require('../../db/models');
const { requireAdmin } = require('../middlewares/checkRole');

class WalletController {
  // Получить кошелек пользователя
  static async getWallet(req, res) {
    try {
      const userId = req.user.id;
      
      let wallet = await Wallet.findOne({ 
        where: { userId },
        include: [
          {
            model: Transaction,
            as: 'transactions',
            order: [['createdAt', 'DESC']],
            limit: 10
          }
        ]
      });
      
      // Если кошелька нет, создаем его
      if (!wallet) {
        // Получаем баланс пользователя для синхронизации
        const user = await User.findByPk(userId);
        const userBalance = user ? parseFloat(user.balance) || 0.00 : 0.00;
        
        wallet = await Wallet.create({ 
          userId, 
          balance: userBalance 
        });
      }
      
      res.json({
        success: true,
        data: {
          id: wallet.id,
          balance: parseFloat(wallet.balance),
          transactions: wallet.transactions || []
        }
      });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Пополнить кошелек (только админ)
  static async topUpWallet(req, res) {
    try {
      const { amount, description } = req.body;
      const userId = req.user.id; // Используем ID текущего пользователя
      const adminId = req.user.id;
      
      // Валидация
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid userId or amount'
        });
      }
      
      // Находим или создаем кошелек
      let wallet = await Wallet.findOne({ where: { userId } });
      if (!wallet) {
        wallet = await Wallet.create({ 
          userId, 
          balance: 0.00 
        });
      }
      
      // Обновляем баланс
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      await wallet.update({ balance: newBalance });
      
      // Синхронизируем баланс с пользователем
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ balance: newBalance });
      }
      
      // Создаем транзакцию
      const transaction = await Transaction.create({
        walletId: wallet.id,
        amount: parseFloat(amount),
        type: 'deposit',
        status: 'completed',
        description: description || 'Пополнение кошелька',
        adminId
      });
      
      res.json({
        success: true,
        data: {
          balance: newBalance,
          transaction: {
            id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            createdAt: transaction.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Top up wallet error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Получить все кошельки (только админ)
  static async getAllWallets(req, res) {
    try {
      const wallets = await Wallet.findAll({
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'role']
          }
        ],
        order: [['updatedAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: wallets.map(wallet => ({
          id: wallet.id,
          userId: wallet.userId,
          balance: parseFloat(wallet.balance),
          owner: wallet.owner
        }))
      });
    } catch (error) {
      console.error('Get all wallets error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }

  // Получить историю транзакций
  static async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;
      
      const wallet = await Wallet.findOne({ where: { userId } });
      if (!wallet) {
        return res.json({
          success: true,
          data: {
            transactions: [],
            pagination: {
              page: 1,
              limit: parseInt(limit),
              total: 0,
              pages: 0
            }
          }
        });
      }
      
      const offset = (page - 1) * limit;
      
      const { count, rows: transactions } = await Transaction.findAndCountAll({
        where: { walletId: wallet.id },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset,
        include: [
          {
            model: User,
            as: 'admin',
            attributes: ['id', 'name', 'email']
          }
        ]
      });
      
      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }
}

module.exports = WalletController;
