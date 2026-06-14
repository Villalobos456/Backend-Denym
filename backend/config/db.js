// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
  user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'railway',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  timezone:           '-04:00',
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
  .then(conn => {
    console.log(`✅  MySQL conectado — ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌  Error MySQL:', err.message);
    console.error('    Host:', dbConfig.host, '| User:', dbConfig.user, '| DB:', dbConfig.database);
  });

module.exports = pool;
