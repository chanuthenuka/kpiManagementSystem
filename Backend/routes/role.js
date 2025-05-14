const express = require('express');
const router = express.Router();
const db = require('../db/db');
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all roles
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM role WHERE deleted_at IS NULL';
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a role
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        const sql = 'INSERT INTO role (name) VALUES (?)';
        db.query(sql, [name], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database insertion failed' });
            }
            res.json({ id: result.insertId, name });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a role
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const sql = 'UPDATE role SET name = ? WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [name, id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'Role updated successfully' });
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a role
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'UPDATE role SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'Role deleted successfully (soft delete)' });
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
