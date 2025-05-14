const express = require('express');
const router = express.Router();
const db = require('../db/db');
const passport = require("passport");
const authorizePermissions = require("../middlewares/authMiddleware");

// Protect all routes
router.use(passport.authenticate("jwt", { session: false }));

// Get all KRAs
router.get('/',authorizePermissions(["Manage Kra","Get_Kra"]), async (req, res) => {
    try {
        const sql = 'SELECT * FROM KRA WHERE deleted_at IS NULL';
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a KRA
router.post('/',authorizePermissions(["Manage Kra"]), async (req, res) => {
    const { description, year } = req.body;
    try {
        const insertSql = `INSERT INTO KRA (description, year) VALUES (?, ?)`;
        db.query(insertSql, [description, year], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database insertion failed' });
            }
            res.json({ id: result.insertId, description });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a KRA
router.put('/:id',authorizePermissions(["Manage Kra"]), async (req, res) => {
    const { id } = req.params;
    const { description, year } = req.body;
    try {
        const sql = `UPDATE KRA SET description = ?, year= ? WHERE kraId = ? AND deleted_at IS NULL`;
        db.query(sql, [description, year, id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'KRA updated successfully' });
            } else {
                res.status(404).json({ message: 'KRA not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a KRA (soft delete)
router.delete('/:id',authorizePermissions(["Manage Kra"]), async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'UPDATE KRA SET deleted_at = NOW() WHERE kraId = ? AND deleted_at IS NULL';
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ message: 'KRA deleted successfully' });
            } else {
                res.status(404).json({ message: 'KRA not found' });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;