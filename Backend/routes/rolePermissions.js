const express = require('express');
const router = express.Router();
const db = require('../db/db');
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get role permissions
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM rolePermissions WHERE deleted_at IS NULL';
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a role permission
router.post('/', async (req, res) => {
    const { roleId, permissionId } = req.body;
    try {
        const insertSql = `INSERT INTO rolePermissions (roleId, permissionId) VALUES (?, ?)`;
        db.query(insertSql, [roleId, permissionId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database insertion failed' });
            }
            res.json({ id: result.insertId, roleId, permissionId });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a role permission
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { roleId, permissionId } = req.body;
    try {
        const sql = 'UPDATE rolePermissions SET roleId = ?, permissionId = ? WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [roleId, permissionId, id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'Role Permission updated successfully' });
            } else {
                res.status(404).json({ message: 'Role Permission not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a role permission
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'UPDATE rolePermissions SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'Role Permission deleted successfully' });
            } else {
                res.status(404).json({ message: 'Role Permission not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;