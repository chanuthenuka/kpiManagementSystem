const db = require('../db/db'); // Adjust path as needed

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


// const jwt = require("jsonwebtoken");

// // Ensure JWT_SECRET environment variable is available
// const secretKey = process.env.JWT_SECRET;
// if (!secretKey) {
//   throw new Error("JWT_SECRET environment variable is not set");
// }

// const authenticateUser = (req, res, next) => {
//   setTimeout(() => {
//     console.log("➡️ Incoming request:", req.method, req.originalUrl);
//     console.log("➡️ Raw headers:", req.headers);
//     console.log("➡️ Cookies at this point:", req.cookies);

//     const { employee_details, jwt_token } = req.cookies;

//     if (!employee_details || !jwt_token) {
//       return res.status(401).json({ message: "Unauthorized: No session found" });
//     }

//     try {
//       if (!jwt_token || jwt_token.split(".").length !== 3) {
//         return res.status(401).json({ message: "Invalid token format" });
//       }

//       const decodedToken = jwt.verify(jwt_token, secretKey);
//       req.user = decodedToken;
//       const user = JSON.parse(decodeURIComponent(employee_details));
//       req.user.details = user;

//       if (decodedToken.id !== user.id) {
//         return res.status(401).json({ message: "Unauthorized: User data mismatch" });
//       }
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Token has expired" });
//       }
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     next();
//   }, 200);  
// };



// const authorizePermissions = (requiredPermissions) => {
//   return (req, res, next) => {
//     const { permissions } = req.user.details; // Access permissions from user details

//     // If no permissions are found, deny access
//     if (!permissions || permissions.length === 0) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden: No permissions available" });
//     }
//     console.log("User Permissions:", permissions); 
//     console.log("Required Permissions:", requiredPermissions); 

//     // Check if the user has the required permissions
//     const hasPermission = requiredPermissions.every((p) =>
//       permissions.includes(p)
//     );

//     if (!hasPermission) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden: Insufficient permissions" });
//     }

//     next();
//   };
// };

// module.exports = {
//   authenticateUser,
//   authorizePermissions,
// };
