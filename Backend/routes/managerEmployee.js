const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all manager-employee mappings
router.get("/", authorizePermissions(["Manage Users"]), async (req, res) => {
  try {
    const sql = "SELECT * FROM managerEmployees WHERE deleted_at IS NULL";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a manager-employee mapping
router.post("/", authorizePermissions(["Manage Users"]), async (req, res) => {
  const { managerId, employeeIds } = req.body; // plural

  if (!managerId || !Array.isArray(employeeIds) || employeeIds.length === 0) {
    return res.status(400).json({ error: "Manager ID and employee IDs are required" });
  }

  const results = [];
  for (const employeeId of employeeIds) {
    try {
      const checkSql = `
        SELECT * FROM managerEmployees WHERE managerId = ? AND employeeId = ? LIMIT 1
      `;

      const existing = await new Promise((resolve, reject) => {
        db.query(checkSql, [managerId, employeeId], (err, res) => {
          if (err) reject(err);
          else resolve(res[0]);
        });
      });

      if (existing) {
        if (existing.deleted_at) {
          // undelete
          const undeleteSql = `UPDATE managerEmployees SET deleted_at = NULL WHERE id = ?`;
          await new Promise((resolve, reject) => {
            db.query(undeleteSql, [existing.id], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          results.push({ employeeId, status: "restored" });
        } else {
          results.push({ employeeId, status: "already exists" });
        }
      } else {
        // insert new
        const insertSql = `INSERT INTO managerEmployees (managerId, employeeId) VALUES (?, ?)`;
        await new Promise((resolve, reject) => {
          db.query(insertSql, [managerId, employeeId], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        results.push({ employeeId, status: "created" });
      }
    } catch (err) {
      console.error(`Error processing employeeId ${employeeId}:`, err);
      results.push({ employeeId, status: "error", error: err.message });
    }
  }

  return res.json({ message: "Processed batch assignment", results });
});



// Update a manager-employee mapping
router.put("/:id", authorizePermissions(["Manage Users"]), async (req, res) => {
  const { id } = req.params;
  const { managerId, employeeId } = req.body;

  try {
    const sql = `UPDATE managerEmployees SET managerId = ?, employeeId = ? AND deleted_at IS NULL`;
    db.query(sql, [managerId, employeeId], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.json({ message: "Mapping updated successfully" });
      } else {
        res.status(404).json({ message: "Mapping not found" });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Soft delete a manager-employee mapping based on managerId and employeeId
router.delete(
  "/",
  authorizePermissions(["Manage Users"]),
  async (req, res) => {
    const { managerId, employeeId } = req.body;

    if (!managerId || !employeeId) {
      return res.status(400).json({ message: "managerId and employeeId are required" });
    }

    try {
      const sql = `
        UPDATE managerEmployees 
        SET deleted_at = NOW() 
        WHERE managerId = ? AND employeeId = ? AND deleted_at IS NULL
      `;
      db.query(sql, [managerId, employeeId], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows > 0) {
          res.json({ message: "Mapping soft-deleted successfully" });
        } else {
          res.status(404).json({ message: "Mapping not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


//get employee with the manager
router.get(
  "/getEmployeesByManagerId",
  authorizePermissions([
    "Manage Users",
    "View Employee Ratings",
    "Get_Assigned_emp_by_managerid",
  ]),
  async (req, res) => {
    try {
      const sql = `
        SELECT 
          me.managerId,
          manager.fullName AS managerName,
          e.employeeId,
          e.employeeNumber,
          e.fullName AS employeeName,
          e.departmentId,
          d.name AS departmentName
        FROM ManagerEmployees me 
        JOIN employee e ON me.employeeId = e.employeeId
        JOIN employee manager ON me.managerId = manager.employeeId
        JOIN department d ON e.departmentId = d.departmentId
        WHERE me.deleted_at IS NULL
        AND e.deleted_at IS NULL
        AND manager.deleted_at IS NULL;
      `;

      db.query(sql, (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//get managers, employee with the manager
router.get(
  "/getManagersAndEmployeesByManagerId",
  authorizePermissions([
    "Manage Users",
    "View Employee Ratings",
    "Get_Assigned_emp_by_managerid",
  ]),
  async (req, res) => {
    try {
      const sql = `
        SELECT  
          me.managerId,
          manager.fullName AS managerName,
          e.employeeId,
          e.employeeNumber,
          e.fullName AS employeeName,
          e.departmentId,
          d.name AS departmentName
        FROM employee e 
        LEFT JOIN ManagerEmployees me ON me.employeeId = e.employeeId
        LEFT JOIN employee manager ON me.managerId = manager.employeeId
        LEFT JOIN department d ON e.departmentId = d.departmentId
        WHERE me.deleted_at IS NULL
        AND e.deleted_at IS NULL
        AND manager.deleted_at IS NULL
        AND e.roleId NOT IN (3, 6);
      `;

      db.query(sql, (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "Database query error" });
        }
        res.json(results);
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
