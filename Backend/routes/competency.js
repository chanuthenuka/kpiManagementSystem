const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all competencies
router.get(
  "/",
  authorizePermissions(["Manage Competencies", "Competency_get_post"]),
  async (req, res) => {
    try {
      const sql = "SELECT * FROM Competency WHERE deleted_at IS NULL";
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

// Create a competency
router.post(
  "/",
  authorizePermissions(["Manage Competencies"]),
  async (req, res) => {
    const { description, isSeniorManager, year } = req.body;

    try {
      const sql =
        "INSERT INTO Competency (description, isSeniorManager, year) VALUES (?, ?, ?)";
      db.query(sql, [description, isSeniorManager, year], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database insertion failed" });
        }
        res.json({
          competencyId: result.insertId,
          description,
          isSeniorManager,
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update a competency
router.put(
  "/:id",
  authorizePermissions(["Manage Competencies"]),
  async (req, res) => {
    const { id } = req.params;
    const { description, isSeniorManager, year } = req.body;

    try {
      const sql =
        "UPDATE Competency SET description = ?, isSeniorManager = ?, year= ? WHERE competencyId = ? AND deleted_at IS NULL";
      db.query(sql, [description, isSeniorManager, year, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Competency updated successfully" });
        } else {
          res.status(404).json({ message: "Competency not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a competency (soft delete)
router.delete(
  "/:id",
  authorizePermissions(["Manage Competencies"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql =
        "UPDATE Competency SET deleted_at = NOW() WHERE competencyId = ? AND deleted_at IS NULL";
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({
            message: "Competency deleted successfully (soft delete)",
          });
        } else {
          res.status(404).json({ message: "Competency not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// get according to year and isSeniorManager
router.get("/:year/:isSeniorManager", async (req, res) => {
  const { year, isSeniorManager } = req.params;
  let sql="";

  try {
    if (isSeniorManager == 1) {
      sql =
        "SELECT * FROM Competency WHERE year = ? AND deleted_at IS NULL";
    } else {
      sql =
        "SELECT * FROM Competency WHERE year = ? AND isSeniorManager = ? AND deleted_at IS NULL";
    }
    console.log(sql)
    db.query(sql, [year, isSeniorManager], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
