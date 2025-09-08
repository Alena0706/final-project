const { User } = require('../../db/models');

class UserController {
  // Получить всех пользователей (только админ)
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'admin'],
        order: [['name', 'ASC']]
      });
      
      res.json({
        success: true,
        data: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          admin: user.admin
        }))
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  }
}

module.exports = UserController;
