const express = require("express");
const router = express.Router();
const db = require("../db/db");

const {
  createRoleTable,
  createPermissionTable,
  createRolePermissionsTable,
  createDepartmentTable,
  createEmployeeTable,
  createManagerEmployeesTable,
  createKRATable,
  createKPITable,
  createApproveKPITable,
  createKPIRatingsTable,
  createCompetencyTable,
  createCompetencyRatingsTable
} = require("../tables/createTables");

const {
  updateRolePermissionsTable,
  updateEmployeeTable,
  updateManagerEmployeesTable,
  updateKPITable,
  updateApproveKPITable,
  updateKPIRatingsTable,
  updateCompetencyRatingsTable
} = require("../tables/updateTables");

router.get("/create", async (req, res) => {
  try {
    await createRoleTable();
    await createPermissionTable();
    await createRolePermissionsTable();
    await createDepartmentTable();
    await createEmployeeTable();
    await createManagerEmployeesTable();
    await createKRATable();
    await createKPITable();
    await createApproveKPITable();
    await createKPIRatingsTable();
    await createCompetencyTable();
    await createCompetencyRatingsTable();

    res.json("All tables created successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/update", async (req, res) => {
  try {
    await updateRolePermissionsTable();
    await updateEmployeeTable();
    await updateManagerEmployeesTable();
    await updateKPITable();
    await updateApproveKPITable();
    await updateKPIRatingsTable();
    await updateCompetencyRatingsTable();

    res.json("All tables updated successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
