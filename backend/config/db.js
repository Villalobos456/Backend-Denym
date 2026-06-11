// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Parse MYSQL_URL when available (Railway production), otherwise fall back
// to individual env vars (local development).
// Expected format: mysql://user:password@host:port/database
function getDbConfig() {
  const url = process.env.MYSQL_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      return {
        host:     parsed.hostname,
        user:     parsed.username,
        password: parsed.password,
        database: parsed.pathname.replace(/^\//, ''),
        port:     parseInt(parsed.port) || 3306,
      };
    } catch (e) {
      console.error('❌  MYSQL_URL inválida, usando variables individuales:', e.message);
    }
  }
  return {
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'denymstyle',
    port:     parseInt(process.env.DB_PORT) || 3306,
  };
}

const dbConfig = getDbConfig();

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  timezone:           '-04:00'
});

pool.getConnection()
  .then(conn => {
    console.log('✅  MySQL conectado —', dbConfig.database, '@', dbConfig.host);
    conn.release();
  })
  .catch(err => {
    console.error('❌  Error MySQL:', err.message);
  });

module.exports = pool;
