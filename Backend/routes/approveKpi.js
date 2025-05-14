const express = require("express");
const router = express.Router();
const db = require("../db/db");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

router.use(passport.authenticate("jwt", { session: false }));

// Get all Approve KPIs (excluding soft-deleted)
router.get("/", authorizePermissions(["Get KPI Changes"]), async (req, res) => {
  try {
    const sql = "SELECT * FROM ApproveKPI WHERE deleted_at IS NULL";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create Approve KPI
router.post(
  "/",
  authorizePermissions(["Request KPI Changes"]),
  async (req, res) => {
    const {
      status = "Pending",
      weightage,
      kraId,
      kpi,
      departmentId,
    } = req.body;
    try {
      const insertSql = `
        INSERT INTO ApproveKPI (status, weightage, kraId,kpi, departmentId)
        VALUES (?, ?, ?, ?,?)
      `;
      db.query(
        insertSql,
        [status, weightage, kraId, kpi, departmentId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database insertion failed" });
          }
          res.json({
            approveKpiId: result.insertId,
            status,
            weightage,
            kraId,
            kpi,
            departmentId,
          });
        }
      );
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update Approve KPI status only
router.put(
  "/:approveKpiId",
  authorizePermissions(["Request KPI Changes", "Get KPI Changes"]),
  async (req, res) => {
    const { approveKpiId } = req.params;
    const { status } = req.body;

    try {
      const sql = `
        UPDATE ApproveKPI 
        SET status = ?
        WHERE approveKpiId = ? AND deleted_at IS NULL
      `;
      db.query(sql, [status, approveKpiId], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Approve KPI status updated successfully" });
        } else {
          res.status(404).json({ message: "Approve KPI not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Soft delete Approve KPI
router.delete(
  "/:approveKpiId",
  authorizePermissions(["Manage KPIs"]),
  async (req, res) => {
    const { approveKpiId } = req.params;
    try {
      const sql = `
        UPDATE ApproveKPI 
        SET deleted_at = NOW()
        WHERE approveKpiId = ? AND deleted_at IS NULL
      `;
      db.query(sql, [approveKpiId], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Approve KPI deleted successfully" });
        } else {
          res.status(404).json({ message: "Approve KPI not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all Approve KPIs for a specific department (excluding soft-deleted)
router.get(
  "/get-by-names",
  authorizePermissions(["Request KPI Changes"]),
  async (req, res) => {
    try {
      const sql = `
      SELECT 
        ak.approveKpiId,
        ak.status,
        ak.weightage,
        ak.kpi,
        ak.kraId,
        kr.description AS kraDescription,
        ak.departmentId,
        d.name AS departmentName
      FROM ApproveKPI ak
      JOIN department d ON ak.departmentId = d.departmentId
      JOIN kra kr ON ak.kraId = kr.kraId
      ORDER BY ak.approveKpiId DESC
    `;

      db.query(sql, (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res
            .status(500)
            .json({ error: "Failed to fetch KPI change requests" });
        }

        res.json(results);
      });
    } catch (err) {
      console.error("Internal error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
