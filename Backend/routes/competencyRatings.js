const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all competency ratings
router.get("/", authorizePermissions(["View Ratings"]), async (req, res) => {
  try {
    const sql = "SELECT * FROM CompetencyRatings WHERE deleted_at IS NULL";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get competency ratings by employee ID
router.get(
  "/employee/:id",
  authorizePermissions(["View Ratings", "Get Competency rating by id"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql = `
            SELECT 
                cr.competencyRatingId, cr.employeeId, cr.competencyId, cr.month, cr.rating, cr.ratedByEmployeeId, cr.status,cr.feedback,
                c.description AS competencyDescription, c.isSeniorManager,
                emp.fullname AS ratedByEmployee
            FROM CompetencyRatings cr
            LEFT JOIN Competency c ON cr.competencyId = c.competencyId
            LEFT JOIN employee emp ON cr.ratedByEmployeeId = emp.employeeId
            WHERE cr.employeeId = ? AND cr.deleted_at IS NULL
            order by cr.competencyId;
        `;

      db.query(sql, [id], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Create a competency rating
router.post(
  "/",
  authorizePermissions(["Rate Employees", "Rate Managers"]),
  async (req, res) => {
    const {
      employeeId,
      competencyId,
      month,
      rating,
      ratedByEmployeeId,
      feedback,
    } = req.body;

    try {
      const sql =
        "INSERT INTO CompetencyRatings (employeeId, competencyId, month, rating, ratedByEmployeeId,feedback) VALUES (?, ?, ?, ?, ?,?)";
      db.query(
        sql,
        [employeeId, competencyId, month, rating, ratedByEmployeeId, feedback],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database insertion failed" });
          }
          res.json({
            competencyRatingId: result.insertId,
            employeeId,
            competencyId,
            month,
            rating,
            ratedByEmployeeId,
            feedback,
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update a competency rating
router.put(
  "/:id",
  authorizePermissions(["Rate Employees", "Approve Ratings"]),
  async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
      const sql =
        "UPDATE CompetencyRatings SET rating = ? WHERE competencyRatingId = ? AND deleted_at IS NULL";
      db.query(sql, [rating, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Competency rating updated successfully" });
        } else {
          res.status(404).json({ message: "Competency rating not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a competency rating (soft delete)
router.delete(
  "/:id",
  authorizePermissions(["Rate Employees"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql =
        "UPDATE CompetencyRatings SET deleted_at = NOW() WHERE competencyRatingId = ? AND deleted_at IS NULL";
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({
            message: "Competency rating deleted successfully (soft delete)",
          });
        } else {
          res.status(404).json({ message: "Competency rating not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
