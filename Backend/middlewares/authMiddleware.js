const db = require('../db/db');

const authorizePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    const { roleId } = req.user;

    if (!roleId) {
      return res.status(403).json({ message: 'Access denied: Role ID missing' });
    }

    const sql = `
      SELECT p.action as permissionName
      FROM rolePermissions rp
      JOIN Permission p ON rp.permissionId = p.permissionId
      WHERE rp.roleId = ?
    `;

    try {
      db.query(sql, [roleId], (err, results) => {
        if (err) {
          console.error('Database error while fetching permissions:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        const userPermissions = results.map(row => row.permissionName);

        const hasAllPermissions = requiredPermissions.some(p =>
          userPermissions.includes(p)
        );

        if (!hasAllPermissions) {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
      });
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = authorizePermissions;