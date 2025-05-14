const db = require("../db/db");

const createRoleTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`role\` (
        \`roleId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(192) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Role table created...");
      resolve(result);
    });
  });
};

const createRolePermissionsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`rolePermissions\` (
        \`rolePermissionId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`roleId\` INT(11) NOT NULL,
        \`permissionId\` INT(11) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("RolePermissions table created...");
      resolve(result);
    });
  });
};

const createPermissionTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`permission\` (
        \`permissionId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`action\` VARCHAR(192) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Permission table created...");
      resolve(result);
    });
  });
};

const createEmployeeTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`employee\` (
        \`employeeId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`fullName\` VARCHAR(192) NOT NULL,
        \`firstName\` VARCHAR(192) NOT NULL,
        \`lastName\` VARCHAR(192) NOT NULL,
        \`email\` VARCHAR(192) NOT NULL,
        \`password\` VARCHAR(192) NOT NULL,
        \`NIC\` VARCHAR(20) NOT NULL,
        \`Designation\` VARCHAR(192) NOT NULL,
        \`employeeStatus\` VARCHAR(50) NOT NULL,
        \`departmentId\` INT(11) NULL DEFAULT NULL,
        \`roleId\` INT(11) NOT NULL,
        \`isManager\` TINYINT(1) NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Employee table created...");
      resolve(result);
    });
  });
};

const createManagerEmployeesTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`ManagerEmployees\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`managerId\` INT(11) NOT NULL,
        \`employeeId\` INT(11) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("ManagerEmployees table created...");
      resolve(result);
    });
  });
};

const createDepartmentTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`department\` (
        \`departmentId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(192) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Department table created...");
      resolve(result);
    });
  });
};

const createKPITable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`KPI\` (
        \`kpiId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`description\` TEXT NOT NULL,
        \`weitage\` INT(11) NOT NULL,
        \`kraId\` INT(11) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("KPI table created...");
      resolve(result);
    });
  });
};
const createApproveKPITable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`ApproveKPI\` (
        \`approveKpiId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'Pending',
        \`weitage\` INT(11) NOT NULL,
        \`kraId\` INT(11) NOT NULL,
        \`kpi\` TEXT NOT NULL,
        \`departmentId\` INT(11) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("KPI table created...");
      resolve(result);
    });
  });
};

const createKRATable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`KRA\` (
        \`kraId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`description\` TEXT NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("KRA table created...");
      resolve(result);
    });
  });
};

const createCompetencyTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`Competency\` (
        \`competencyId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`description\` TEXT NOT NULL,
        \`isSeniorManager\` TINYINT(1) NOT NULL,
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Competency table created...");
      resolve(result);
    });
  });
};

const createKPIRatingsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`KPIRatings\` (
        \`kpiRatingId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`employeeId\` INT(11) NOT NULL,
        \`kpiId\` INT(11) NOT NULL,
        \`target\` TEXT NOT NULL,
        \`tasks\` TEXT NOT NULL,
        \`month\` VARCHAR(50) NOT NULL,
        \`rating\` INT(11) NOT NULL,
        \`ratedByEmployeeId\` INT(11) NOT NULL,
        \`extraRating\` INT(11) NOT NULL,
  \`feedback\` TEXT NOT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'Pending',
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("KPIRatings table created...");
      resolve(result);
    });
  });
};

const createCompetencyRatingsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`CompetencyRatings\` (
        \`competencyRatingId\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`employeeId\` INT(11) NOT NULL,
        \`competencyId\` INT(11) NOT NULL,
        \`month\` VARCHAR(50) NOT NULL,
        \`rating\` INT(11) NOT NULL,
        \`ratedByEmployeeId\` INT(11) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'Pending',
        \`created_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` TIMESTAMP(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` TIMESTAMP NULL DEFAULT NULL
      );
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("CompetencyRatings table created...");
      resolve(result);
    });
  });
};

module.exports = {
  createRoleTable,
  createRolePermissionsTable,
  createPermissionTable,
  createEmployeeTable,
  createManagerEmployeesTable,
  createDepartmentTable,
  createKPITable,
  createApproveKPITable,
  createKRATable,
  createCompetencyTable,
  createKPIRatingsTable,
  createCompetencyRatingsTable,
};
