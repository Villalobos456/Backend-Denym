// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'denymstyle',
  port:             parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  charset:          'utf8mb4',
  timezone:         '-04:00'
});

pool.getConnection()
  .then(conn => {
    console.log('✅  MySQL conectado —', process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error('❌  Error MySQL:', err.message);
  });

module.exports = pool;
