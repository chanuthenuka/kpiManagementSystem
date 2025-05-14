const db = require("../db/db");

const updateRolePermissionsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`rolePermissions\`
      ADD FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`roleId\`) ON DELETE CASCADE,
      ADD FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`permissionId\`) ON DELETE CASCADE;
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified rolePermissions table...");
      resolve(result);
    });
  });
};

const updateEmployeeTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`employee\`
      ADD FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`roleId\`) ON DELETE CASCADE,
      ADD FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`departmentId\`) ON DELETE CASCADE;
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified employee table...");
      resolve(result);
    });
  });
};

const updateManagerEmployeesTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`ManagerEmployees\`
      ADD CONSTRAINT \`fk_manager\` FOREIGN KEY (\`managerId\`) REFERENCES \`employee\`(\`employeeId\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`fk_employee\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`employeeId\`) ON DELETE CASCADE,
      ADD UNIQUE KEY \`unique_manager_employee\` (\`managerId\`, \`employeeId\`);
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified ManagerEmployees table...");
      resolve(result);
    });
  });
};



const updateKPITable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`KPI\`
      ADD FOREIGN KEY (\`kraId\`) REFERENCES \`KRA\`(\`kraId\`) ON DELETE CASCADE;
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified KPI table...");
      resolve(result);
    });
  });
};

const updateApproveKPITable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`ApproveKPI\`
      ADD FOREIGN KEY (\`kraId\`) REFERENCES \`KRA\`(\`kraId\`) ON DELETE CASCADE;
      ADD FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`departmentId\`) ON DELETE CASCADE,
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified Approve KPI table...");
      resolve(result);
    });
  });
};

const updateKPIRatingsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`KPIRatings\`
      ADD FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`employeeId\`) ON DELETE CASCADE,
      ADD FOREIGN KEY (\`kpiId\`) REFERENCES \`KPI\`(\`kpiId\`) ON DELETE CASCADE,
      ADD FOREIGN KEY (\`ratedByEmployeeId\`) REFERENCES \`employee\`(\`employeeId\`) ON DELETE CASCADE;
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified KPIRatings table...");
      resolve(result);
    });
  });
};

const updateCompetencyRatingsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      ALTER TABLE \`CompetencyRatings\`
      ADD FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`employeeId\`) ON DELETE CASCADE,
      ADD FOREIGN KEY (\`competencyId\`) REFERENCES \`Competency\`(\`competencyId\`) ON DELETE CASCADE,
      ADD FOREIGN KEY (\`ratedByEmployeeId\`) REFERENCES \`employee\`(\`employeeId\`) ON DELETE CASCADE;
      ADD FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`departmentId\`) ON DELETE CASCADE,
    `;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      console.log("Modified CompetencyRatings table...");
      resolve(result);
    });
  });
};

module.exports = {
  updateRolePermissionsTable,
  updateEmployeeTable,
  updateManagerEmployeesTable,
  updateKPITable,
  updateApproveKPITable,
  updateKPIRatingsTable,
  updateCompetencyRatingsTable,
};
