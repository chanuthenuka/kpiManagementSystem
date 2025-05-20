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

// Get competency ratings for a specific employee and year
router.get("/employee/:employeeId/year/:year", async (req, res) => {
  const { employeeId, year } = req.params;

  try {
    const sql = `
      SELECT
        c.description AS Competency,

        cr01.rating AS ratingJan,
        cr02.rating AS ratingFeb,
        cr03.rating AS ratingMar,
        cr04.rating AS ratingApr,
        cr05.rating AS ratingMay,
        cr06.rating AS ratingJun,
        cr07.rating AS ratingJul,
        cr08.rating AS ratingAug,
        cr09.rating AS ratingSep,
        cr10.rating AS ratingOct,
        cr11.rating AS ratingNov,
        cr12.rating AS ratingDec,

        -- Quarterly Averages
        ROUND((COALESCE(cr01.rating, 0) + COALESCE(cr02.rating, 0) + COALESCE(cr03.rating, 0)) / 
            NULLIF((CASE WHEN cr01.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr02.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr03.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q1_Average,

        ROUND((COALESCE(cr04.rating, 0) + COALESCE(cr05.rating, 0) + COALESCE(cr06.rating, 0)) / 
            NULLIF((CASE WHEN cr04.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr05.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr06.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q2_Average,

        ROUND((COALESCE(cr07.rating, 0) + COALESCE(cr08.rating, 0) + COALESCE(cr09.rating, 0)) / 
            NULLIF((CASE WHEN cr07.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr08.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr09.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q3_Average,

        ROUND((COALESCE(cr10.rating, 0) + COALESCE(cr11.rating, 0) + COALESCE(cr12.rating, 0)) / 
            NULLIF((CASE WHEN cr10.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr11.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr12.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q4_Average,

        -- Half-Year Averages
        ROUND((COALESCE(cr01.rating, 0) + COALESCE(cr02.rating, 0) + COALESCE(cr03.rating, 0) + 
               COALESCE(cr04.rating, 0) + COALESCE(cr05.rating, 0) + COALESCE(cr06.rating, 0)) / 
            NULLIF((CASE WHEN cr01.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr02.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr03.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr04.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr05.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr06.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS H1_Average,

        ROUND((COALESCE(cr07.rating, 0) + COALESCE(cr08.rating, 0) + COALESCE(cr09.rating, 0) + 
               COALESCE(cr10.rating, 0) + COALESCE(cr11.rating, 0) + COALESCE(cr12.rating, 0)) / 
            NULLIF((CASE WHEN cr07.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr08.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr09.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr10.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr11.rating IS NOT NULL THEN 1 ELSE 0 END + 
                    CASE WHEN cr12.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS H2_Average,

        -- Yearly Average
        ROUND((COALESCE(cr01.rating, 0) + COALESCE(cr02.rating, 0) + COALESCE(cr03.rating, 0) +
               COALESCE(cr04.rating, 0) + COALESCE(cr05.rating, 0) + COALESCE(cr06.rating, 0) +
               COALESCE(cr07.rating, 0) + COALESCE(cr08.rating, 0) + COALESCE(cr09.rating, 0) +
               COALESCE(cr10.rating, 0) + COALESCE(cr11.rating, 0) + COALESCE(cr12.rating, 0)) /
            NULLIF((CASE WHEN cr01.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr02.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr03.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr04.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr05.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr06.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr07.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr08.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr09.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr10.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr11.rating IS NOT NULL THEN 1 ELSE 0 END +
                    CASE WHEN cr12.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Year_Average

      FROM Competency c
      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-01') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr01 ON cr01.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-02') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr02 ON cr02.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-03') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr03 ON cr03.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-04') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr04 ON cr04.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-05') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr05 ON cr05.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-06') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr06 ON cr06.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-07') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr07 ON cr07.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-08') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr08 ON cr08.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-09') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr09 ON cr09.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-10') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr10 ON cr10.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-11') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr11 ON cr11.competencyId = c.competencyId

      LEFT JOIN (
          SELECT cr.*
          FROM competencyRatings cr
          INNER JOIN (
              SELECT competencyId, employeeId, month, MAX(created_at) AS max_created
              FROM competencyRatings
              WHERE month = CONCAT(?, '-12') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
              GROUP BY competencyId, employeeId, month
          ) latest ON cr.competencyId = latest.competencyId AND cr.employeeId = latest.employeeId AND cr.month = latest.month AND cr.created_at = latest.max_created
      ) cr12 ON cr12.competencyId = c.competencyId

      WHERE c.year = ? AND c.deleted_at IS NULL
      ORDER BY c.competencyId;
    `;

    // Prepare parameters for months: year, employeeId for each month twice (in subquery and join)
    const params = [
        year, employeeId, year, employeeId, year, employeeId,
        year, employeeId, year, employeeId, year, employeeId,
        year, employeeId, year, employeeId, year, employeeId,
        year, employeeId, year, employeeId, year, employeeId,
        year,  // for kra.year = ?
  employeeId // for EXISTS subquery
      ];

      db.query(sql, params, (err, results) => {
        if (err) {
          console.error("Query error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
