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
  const { managerId, employeeId } = req.body;

  try {
    const sql = `INSERT INTO managerEmployees (managerId, employeeId) VALUES (?, ?)`;
    db.query(sql, [managerId, employeeId], (err, result) => {
      if (err) {
        console.error("Error inserting:", err);
        return res.status(500).json({ error: "Database insertion failed" });
      }

      res.json({
        message: "Manager-Employee mapping created successfully",
        id: result.insertId,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a manager-employee mapping
router.put("/:id", authorizePermissions(["Manage Users"]), async (req, res) => {
  const { id } = req.params;
  const { managerId, employeeId } = req.body;

  try {
    const sql = `UPDATE managerEmployees SET managerId = ?, employeeId = ? WHERE id = ? AND deleted_at IS NULL`;
    db.query(sql, [managerId, employeeId, id], (err, result) => {
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

// Soft delete a manager-employee mapping
router.delete(
  "/:id",
  authorizePermissions(["Manage Users"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql = `UPDATE managerEmployees SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Mapping deleted successfully (soft delete)" });
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

//get emplyee by managerId
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
          e.fullName AS employeeName,
          e.departmentId   -- added departmentId here
        FROM 
          ManagerEmployees me
        JOIN 
          employee e ON me.employeeId = e.employeeId
        JOIN 
          employee manager ON me.managerId = manager.employeeId
        WHERE 
          me.deleted_at IS NULL
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
module.exports = router;
