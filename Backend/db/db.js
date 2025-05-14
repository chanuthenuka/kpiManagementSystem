const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection to the database
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('MySQL Connected as id ' + connection.threadId);
    connection.release();
});

// Handle errors from the pool
db.on('error', (err) => {
    console.error('Database pool error:', err);
});

module.exports = db;