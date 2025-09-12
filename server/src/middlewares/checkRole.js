const ROLES = {
  ADMIN: 'admin',
  SUPPORT: 'support',
  FRANCHISE_OWNER: 'franchise_owner'
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      
      if (!userRole) {
        return res.status(401).json({ 
          message: 'User role not found' 
        });
      }
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.' 
        });
      }
      
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ 
        message: 'Internal server error' 
      });
    }
  };
};

// Готовые middleware для разных ролей
const requireAdmin = checkRole([ROLES.ADMIN]);
const requireSupport = checkRole([ROLES.ADMIN, ROLES.SUPPORT]);
const requireFranchiseOwner = checkRole([ROLES.FRANCHISE_OWNER]);
const requireAnyRole = checkRole([ROLES.ADMIN, ROLES.SUPPORT, ROLES.FRANCHISE_OWNER]);

module.exports = {
  checkRole,
  requireAdmin,
  requireSupport,
  requireFranchiseOwner,
  requireAnyRole,
  ROLES
};

