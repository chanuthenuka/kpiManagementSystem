const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all KPI ratings
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

//get all KPI ratings with kra
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
    AND kpr.status = 'approve';

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

// Create a KPI rating
router.post(
  "/",
  authorizePermissions(["Rate Employees", "Approve Ratings", "Rate Managers"]),
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
    const { rating, status } = req.body; // Accept status as well

    try {
      const sql =
        "UPDATE KPIRatings SET rating = ?, status = ? WHERE kpiRatingId = ? AND deleted_at IS NULL";
      db.query(sql, [rating, status, id], (err, result) => {
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
