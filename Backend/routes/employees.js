const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");
const e = require("express");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM employee WHERE email = ? AND deleted_at IS NULL";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ msg: "Invalid credentials" });

    const user = results[0];
    const departmentId = user.departmentId;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { employeeId: user.employeeId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    const roleId = user.roleId; // Store roleId locally

    const roleQuery =
      "SELECT name FROM role WHERE roleId = ? AND deleted_at IS NULL";
    db.query(roleQuery, [roleId], (err, roleResults) => {
      if (err) {
        console.error("Role fetch error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (roleResults.length === 0) {
        return res.status(400).json({ message: "Role not found" });
      }

      const roleName = roleResults[0].name;

      const permissionQuery = `
        SELECT p.action FROM rolePermissions rp
        JOIN permission p ON rp.permissionId = p.permissionId
        WHERE rp.roleId = ? AND rp.deleted_at IS NULL AND p.deleted_at IS NULL`;

      db.query(permissionQuery, [roleId], (err, permissionResults) => {
        if (err) {
          console.error("Permission fetch error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const permissions = permissionResults.map((perm) => perm.action);

        res.cookie("jwt_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 86400000, // 1 day
        });

        res.json({
          msg: "Login successful",
          data: {
            employeeId: user.employeeId,
            roleId, // Included in the response
            roleName,
            permissions,
            departmentId: user.departmentId,
          },
        });
      });
    });
  });
});

// Get all employees
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizePermissions(["View Users", "View Ratings", "Get_emplyees"]),
  async (req, res) => {
    try {
      const sql = "SELECT * FROM employee WHERE deleted_at IS NULL";
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

//get employee by id
router.get(
  "/:employeeId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { employeeId } = req.params;

    try {
      const sql =
        "SELECT * FROM employee WHERE employeeId = ? AND deleted_at IS NULL";
      db.query(sql, [employeeId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ message: "Employee not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Create an employee
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizePermissions(["Register Users"]),
  async (req, res) => {
    const {
      fullname,
      firstname,
      lastname,
      email,
      password,
      employeeNumber,
      Designation,
      employeeStatus,
      departmentId,
      roleId,
      isManager,
    } = req.body;

    try {
      const checkEmailSql = `SELECT COUNT(*) AS count FROM employee WHERE email = ?`;
      db.query(checkEmailSql, [email], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database query failed" });
        }

        if (results[0].count > 0) {
          return res.status(400).json({ error: "email_already_exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertEmployeeSql = `
                INSERT INTO employee (fullname, firstname, lastname, email, password, employeeNumber, Designation, employeeStatus,departmentId, roleId, isManager)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?)`;

        db.query(
          insertEmployeeSql,
          [
            fullname,
            firstname,
            lastname,
            email,
            hashedPassword,
            employeeNumber,
            Designation,
            employeeStatus,
            departmentId,
            roleId,
            isManager,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ error: "Database insertion failed" });
            }

            res.json({ id: result.insertId, email, fullname, roleId });
          }
        );
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update an employee
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizePermissions(["Register Users"]),
  async (req, res) => {
    const { id } = req.params;
    const {
      fullname,
      firstname,
      lastname,
      email,
      password, // optional
      employeeNumber,
      Designation,
      employeeStatus,
      departmentId,
      roleId,
      isManager,
    } = req.body;

    try {
      let fields = [
        "fullname = ?",
        "firstname = ?",
        "lastname = ?",
        "email = ?",
        "employeeNumber = ?",
        "Designation = ?",
        "employeeStatus = ?",
        "departmentId = ?",
        "roleId = ?",
        "isManager = ?",
      ];
      let values = [
        fullname,
        firstname,
        lastname,
        email,
        employeeNumber,
        Designation,
        employeeStatus,
        departmentId,
        roleId,
        isManager,
      ];

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        fields.push("password = ?");
        values.push(hashedPassword);
      }

      values.push(id);

      const sql = `UPDATE employee SET ${fields.join(
        ", "
      )} WHERE employeeId = ? AND deleted_at IS NULL`;

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows > 0) {
          res.json({ message: "Employee updated successfully" });
        } else {
          res.status(404).json({ message: "Employee not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete an employee (soft delete)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizePermissions(["Register Users"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const sql =
        "UPDATE employee SET deleted_at = NOW() WHERE employeeId = ? AND deleted_at IS NULL";
      db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.json({ message: "Employee deleted successfully (soft delete)" });
        } else {
          res.status(404).json({ message: "Employee not found" });
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
