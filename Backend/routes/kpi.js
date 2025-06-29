const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all KPIs
router.get(
  "/",
  authorizePermissions(["Manage KPIs", "View kpi"]),
  async (req, res) => {
    try {
      const sql = "SELECT * FROM KPI WHERE deleted_at IS NULL";
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

// Create a KPI
router.post("/", authorizePermissions(["Manage KPIs"]), async (req, res) => {
  const { description, departmentId, weitage, year, kraId } = req.body;
  try {
    const insertSql = `INSERT INTO KPI (description, departmentId, weitage,year, kraId) VALUES (?, ?, ?,?,?)`;
    db.query(
      insertSql,
      [description, departmentId, weitage, year, kraId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database insertion failed" });
        }
        res.json({
          id: result.insertId,
          description,
          departmentId,
          weitage,
          year,
          kraId,
        });
      }
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a KPI
router.put("/:id", authorizePermissions(["Manage KPIs"]), async (req, res) => {
  const { id } = req.params;
  const { weitage, description, kraId, year } = req.body;
  try {
    const sql = `UPDATE KPI SET  description = ?, weitage = ?, kraId = ?, year = ? WHERE kpiId = ? AND deleted_at IS NULL`;
    db.query(sql, [description, weitage, kraId, year, id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.json({ message: "KPI updated successfully" });
      } else {
        res.status(404).json({ message: "KPI not found" });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a KPI (soft delete)
router.delete(
  "/:id",
  authorizePermissions(["Manage KPIs"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const sql =
        "UPDATE KPI SET deleted_at = NOW() WHERE kpiId = ? AND deleted_at IS NULL";
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "KPI deleted successfully" });
        } else {
          res.status(404).json({ message: "KPI not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//get kra name with join with kra table

router.get("/get-kra", async (req, res) => {
  try {
    const { year, departmentId } = req.query;

    // Validate inputs
    if (year && !/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ error: "Invalid year format. Use YYYY (e.g., 2025)" });
    }
    if (!departmentId) {
      return res.status(400).json({ error: "departmentId is required" });
    }

    // Base query with department filtering
    let selectSql = `
      SELECT 
        kpi.kpiId,
        kpi.description AS kpiDescription,
        kpi.weitage,
        kpi.kraId,
        kpi.year,
        kra.description AS kraName
      FROM kpi
      JOIN kra ON kpi.kraId = kra.kraId
      WHERE kpi.deleted_at IS NULL AND kra.deleted_at IS NULL
    `;

    const queryParams = [];

    if (year) {
      selectSql += ` AND kpi.year = ?`;
      queryParams.push(year);
    }

    if (departmentId) {
      selectSql += ` AND kpi.departmentId = ?`;
      queryParams.push(departmentId);
    }

    db.query(selectSql, queryParams, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: `Database query failed: ${err.message}` });
      }
      if (results.length === 0) {
        return res.status(404).json({
          error: `No KPIs found for year ${
            year || "any"
          } and department ${departmentId}`,
        });
      }
      res.json(results);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get kpi according to year
router.get("/get-kpi-by-year", async (req, res) => {
  try {
    const { year } = req.query;

    // Validate year if provided
    if (year && !/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ error: "Invalid year format. Use YYYY (e.g., 2025)" });
    }

    // Base SQL query
    let selectSql = `
      SELECT 
        kpi.kpiId,
        kpi.description AS kpiDescription,
        kpi.weitage,
        kpi.kraId,
        kpi.year
      FROM kpi
      WHERE kpi.deleted_at IS NULL
    `;

    const queryParams = [];

    // Add year filter if provided
    if (year) {
      selectSql += ` AND kpi.year = ?`;
      queryParams.push(year);
    }

    db.query(selectSql, queryParams, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json(results);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
