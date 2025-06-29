const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all Pending KPI ratings
router.get(
  "/",
  authorizePermissions(["View Ratings", "Get All Kpi Ratings"]),
  async (req, res) => {
    try {
      const sql =
        "SELECT * FROM KPIRatings WHERE deleted_at IS NULL AND status = 'Pending'";
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

//get all Pending KPI ratings with kra
router.get(
  "/employee/ratings",
  authorizePermissions(["Get All Kpi Ratings"]),
  async (req, res) => {
    try {
      const { departmentId } = req.query; // Get departmentId from query parameters

      // Base SQL query
      let sql = `
        SELECT 
          kpr.kpiRatingId, 
          kpr.employeeId, 
          e1.fullName, 
          kpr.kpiId, 
          kpr.target, 
          kpr.tasks, 
          kpr.month, 
          kpr.rating, 
          kpr.ratedByEmployeeId, 
          kpr.extraRating, 
          kpr.feedback, 
          kpi.description AS kpiDescription, 
          kpi.weitage, 
          kpi.kraId, 
          kra.description AS kraDescription, 
          emp.fullname AS ratedByEmployee, 
          emp.departmentId
        FROM KPIRatings kpr
        LEFT JOIN KPI kpi ON kpr.kpiId = kpi.kpiId
        LEFT JOIN KRA kra ON kpi.kraId = kra.kraId
        LEFT JOIN employee emp ON kpr.ratedByEmployeeId = emp.employeeId
        LEFT JOIN employee e1 ON kpr.employeeId = e1.employeeId 
        WHERE kpr.deleted_at IS NULL
          AND kpr.status = 'Pending'
      `;

      // Add departmentId filter if provided
      const queryParams = [];
      if (departmentId) {
        sql += ` AND emp.departmentId = ?`;
        queryParams.push(departmentId);
      }

      // Add pagination
      sql += ` LIMIT 0, 25`;

      // Execute the query
      db.query(sql, queryParams, (err, results) => {
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

// Get a KPI rating by employee ID
router.get(
  "/employee/:id",
  authorizePermissions(["View Ratings", "Get Kpi Rating by Id"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql = `
            SELECT 
    kpr.kpiRatingId, 
    kpr.employeeId, 
    kpr.kpiId, 
    kpr.target, 
    kpr.tasks, 
    kpr.month, 
    kpr.rating, 
    kpr.ratedByEmployeeId,
    kpr.extraRating,
    kpr.feedback,
    kpi.description AS kpiDescription, 
    kpi.weitage, 
    kpi.kraId,
    kra.description AS kraDescription,
    emp.fullname AS ratedByEmployee
FROM KPIRatings kpr
LEFT JOIN KPI kpi ON kpr.kpiId = kpi.kpiId
LEFT JOIN KRA kra ON kpi.kraId = kra.kraId
LEFT JOIN employee emp ON kpr.ratedByEmployeeId = emp.employeeId
WHERE 
    kpr.employeeId = ? 
    AND kpr.deleted_at IS NULL 
    AND kpr.status = 'approve'
        ORDER BY kpi.kraId, kpr.kpiId;

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

// Get yearly KPI rating summary for an employee
router.get("/employee/:employeeId/year/:year", async (req, res) => {
  const { employeeId, year } = req.params;

  try {
    const sql = `
        SELECT 
    kra.description AS KRA,
    kpi.description AS KPI,
    kpi.weitage,

    r01.rating AS ratingJan,
    r02.rating AS ratingFeb,
    r03.rating AS ratingMar,
    r04.rating AS ratingApr,
    r05.rating AS ratingMay,
    r06.rating AS ratingJun,
    r07.rating AS ratingJul,
    r08.rating AS ratingAug,
    r09.rating AS ratingSep,
    r10.rating AS ratingOct,
    r11.rating AS ratingNov,
    r12.rating AS ratingDec,

    -- Quarterly Averages
    ROUND((COALESCE(r01.rating, 0) + COALESCE(r02.rating, 0) + COALESCE(r03.rating, 0)) / 
        NULLIF((CASE WHEN r01.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r02.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r03.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q1_Average,

    ROUND((COALESCE(r04.rating, 0) + COALESCE(r05.rating, 0) + COALESCE(r06.rating, 0)) / 
        NULLIF((CASE WHEN r04.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r05.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r06.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q2_Average,

    ROUND((COALESCE(r07.rating, 0) + COALESCE(r08.rating, 0) + COALESCE(r09.rating, 0)) / 
        NULLIF((CASE WHEN r07.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r08.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r09.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q3_Average,

    ROUND((COALESCE(r10.rating, 0) + COALESCE(r11.rating, 0) + COALESCE(r12.rating, 0)) / 
        NULLIF((CASE WHEN r10.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r11.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r12.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Q4_Average,

    -- Half-Year Averages
    ROUND((COALESCE(r01.rating, 0) + COALESCE(r02.rating, 0) + COALESCE(r03.rating, 0) + 
           COALESCE(r04.rating, 0) + COALESCE(r05.rating, 0) + COALESCE(r06.rating, 0)) / 
        NULLIF((CASE WHEN r01.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r02.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r03.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r04.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r05.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r06.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS H1_Average,

    ROUND((COALESCE(r07.rating, 0) + COALESCE(r08.rating, 0) + COALESCE(r09.rating, 0) + 
           COALESCE(r10.rating, 0) + COALESCE(r11.rating, 0) + COALESCE(r12.rating, 0)) / 
        NULLIF((CASE WHEN r07.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r08.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r09.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r10.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r11.rating IS NOT NULL THEN 1 ELSE 0 END + 
                CASE WHEN r12.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS H2_Average,

    -- Yearly Average
    ROUND((COALESCE(r01.rating, 0) + COALESCE(r02.rating, 0) + COALESCE(r03.rating, 0) +
           COALESCE(r04.rating, 0) + COALESCE(r05.rating, 0) + COALESCE(r06.rating, 0) +
           COALESCE(r07.rating, 0) + COALESCE(r08.rating, 0) + COALESCE(r09.rating, 0) +
           COALESCE(r10.rating, 0) + COALESCE(r11.rating, 0) + COALESCE(r12.rating, 0)) /
        NULLIF((CASE WHEN r01.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r02.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r03.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r04.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r05.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r06.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r07.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r08.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r09.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r10.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r11.rating IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN r12.rating IS NOT NULL THEN 1 ELSE 0 END), 0), 2) AS Year_Average

FROM KRA kra
INNER JOIN KPI kpi ON kra.kraId = kpi.kraId AND kpi.deleted_at IS NULL
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-01') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r01 ON r01.kpiId = kpi.kpiId

LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-02') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r02 ON r02.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-03') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r03 ON r03.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-04') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r04 ON r04.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-05') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r05 ON r05.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-06') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r06 ON r06.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-07') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r07 ON r07.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-08') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r08 ON r08.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-09') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r09 ON r09.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-10') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r10 ON r10.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-11') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r11 ON r11.kpiId = kpi.kpiId
 
LEFT JOIN (
    SELECT kr.*
    FROM kpiRatings kr
    INNER JOIN (
        SELECT kpiId, employeeId, month, MAX(created_at) AS max_created
        FROM kpiRatings
        WHERE month = CONCAT(?, '-12') AND employeeId = ? AND deleted_at IS NULL AND status = 'approve'
        GROUP BY kpiId, employeeId, month
    ) latest ON kr.kpiId = latest.kpiId AND kr.employeeId = latest.employeeId AND kr.month = latest.month AND kr.created_at = latest.max_created
) r12 ON r12.kpiId = kpi.kpiId

WHERE 
    kra.year = ? 
    AND kra.deleted_at IS NULL
    AND EXISTS (
        SELECT 1 
        FROM kpiRatings kr 
        WHERE kr.kpiId = kpi.kpiId 
        AND kr.employeeId = ? 
        AND kr.deleted_at IS NULL 
        AND kr.status = 'approve'
    )

ORDER BY kra.kraId, kpi.kpiId;

      `;

    const params = [
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year,
      employeeId,
      year, // for kra.year = ?
      employeeId, // for EXISTS subquery
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

// Create a KPI rating
router.post(
  "/",
  authorizePermissions(["Rate Employees", "Approve Ratings", "Rate Managers", "Rate Trainees"]),
  async (req, res) => {
    const ratings = req.body; // Assuming the payload is an array of rating objects

    if (!Array.isArray(ratings)) {
      return res.status(400).json({ error: "Ratings must be an array" });
    }
    // Loop through the ratings and filter out invalid ones
    const validRatings = ratings.filter(
      (rating) =>
        rating.target && rating.tasks && rating.rating && rating.feedback
    );

    if (validRatings.length === 0) {
      return res.status(400).json({ error: "No valid ratings provided" });
    }

    try {
      // For each valid rating, execute the database insert
      validRatings.forEach((rating) => {
        const {
          employeeId,
          kpiId,
          target,
          tasks,
          month,
          rating: ratingValue,
          ratedByEmployeeId,
          extraRating,
          feedback,
        } = rating;
        const sql =
          "INSERT INTO KPIRatings (employeeId, kpiId, target, tasks, month, rating, ratedByEmployeeId,extraRating,feedback) VALUES (?, ?, ?, ?, ?, ?,?, ?,?)";
        db.query(
          sql,
          [
            employeeId,
            kpiId,
            target,
            tasks,
            month,
            ratingValue,
            ratedByEmployeeId,
            extraRating,
            feedback,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ error: "Database insertion failed" });
            }
            // Optionally, you can accumulate results here or log for debugging
            console.log("Inserted rating:", result);
          }
        );
      });

      // If successful, respond with a success message
      res.json({ message: "Ratings saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update a KPI rating
router.put(
  "/:id",
  authorizePermissions(["Get All Kpi Ratings"]),
  async (req, res) => {
    const { id } = req.params;
    const { rating, status, feedback } = req.body; // Accept status as well

    try {
      const sql =
        "UPDATE KPIRatings SET rating = ?, status = ?, feedback = ? WHERE kpiRatingId = ? AND deleted_at IS NULL";
      db.query(sql, [rating, status, feedback, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "KPI rating updated successfully" });
        } else {
          res.status(404).json({ message: "KPI rating not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a KPI rating (soft delete)
router.delete(
  "/:id",
  authorizePermissions(["Rate Employees"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql =
        "UPDATE KPIRatings SET deleted_at = NOW() WHERE kpiRatingId = ? AND deleted_at IS NULL";
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({
            message: "KPI rating deleted successfully (soft delete)",
          });
        } else {
          res.status(404).json({ message: "KPI rating not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
