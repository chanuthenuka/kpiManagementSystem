const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all departments
router.get(
  "/",
  authorizePermissions(["department", "Get_Department"]),
  async (req, res) => {
    try {
      const sql = "SELECT * FROM department WHERE deleted_at IS NULL";
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Create a department
router.post("/", authorizePermissions(["department"]), async (req, res) => {
  const { name } = req.body;
  try {
    const insertSql = `INSERT INTO department (name) VALUES (?)`;
    db.query(insertSql, [name], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database insertion failed" });
      }
      res.json({ id: result.insertId, name });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a department
router.put("/:id", authorizePermissions(["department"]), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const sql = `UPDATE department SET name = ? WHERE departmentId = ? AND deleted_at IS NULL`;
    db.query(sql, [name, id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.json({ message: "Department updated successfully" });
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a department (soft delete)
router.delete(
  "/:id",
  authorizePermissions(["department"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const sql =
        "UPDATE department SET deleted_at = NOW() WHERE departmentId = ? AND deleted_at IS NULL";
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Department deleted successfully" });
        } else {
          res.status(404).json({ message: "Department not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
