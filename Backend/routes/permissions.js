const express = require('express');
const router = express.Router();
const db = require('../db/db');
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all permissions
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM permission WHERE deleted_at IS NULL';
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get permission by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT * FROM permission WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Permission not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a permission
router.post('/', async (req, res) => {
    const { action } = req.body;
    try {
        const insertSql = `INSERT INTO permission (action) VALUES (?)`;
        db.query(insertSql, [action], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database insertion failed' });
            }
            res.json({ id: result.insertId, action });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a permission
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    try {
        const sql = `UPDATE permission SET action = ? WHERE id = ? AND deleted_at IS NULL`;
        db.query(sql, [action, id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'Permission updated successfully' });
            } else {
                res.status(404).json({ message: 'Permission not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a permission (soft delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'UPDATE permission SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'Permission deleted successfully' });
            } else {
                res.status(404).json({ message: 'Permission not found' });
            }
        });
    } catch (err) {
        
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;