// backend/scripts/init-db.js
//
// Initialises the production MySQL database from database/denymstyle.sql.
// Run once on a fresh Railway MySQL service:
//
//   MYSQL_URL=mysql://... node backend/scripts/init-db.js
//
// Safe to re-run: CREATE TABLE uses IF NOT EXISTS and INSERT IGNORE is used
// for seed rows, so duplicate-key errors are suppressed at the SQL level.

const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function initDatabase() {
  const dbUrl = process.env.MYSQL_URL;
  if (!dbUrl) {
    console.error('❌  MYSQL_URL no configurada');
    console.error('    Ejemplo: MYSQL_URL=mysql://user:pass@host:3306/denymstyle');
    process.exit(1);
  }

  // Parse the URL so we can log the target host/database without exposing credentials
  let parsedUrl;
  try {
    parsedUrl = new URL(dbUrl);
  } catch (e) {
    console.error('❌  MYSQL_URL inválida:', e.message);
    process.exit(1);
  }

  const dbName = parsedUrl.pathname.replace(/^\//, '') || 'denymstyle';
  console.log(`🔌  Conectando a ${dbName} @ ${parsedUrl.hostname} …`);

  // multipleStatements is required to execute the full SQL dump in one call.
  // The connection is used only for this script and closed immediately after.
  let connection;
  try {
    connection = await mysql.createConnection(dbUrl + '?multipleStatements=true');
    console.log('✅  Conectado a MySQL');
  } catch (err) {
    console.error('❌  No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  }

  // Resolve path relative to this script: backend/scripts/ → ../../database/
  const sqlPath = path.join(__dirname, '../../database/denymstyle.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error('❌  Archivo SQL no encontrado:', sqlPath);
    await connection.end();
    process.exit(1);
  }

  let sqlScript;
  try {
    sqlScript = fs.readFileSync(sqlPath, 'utf8');
    console.log(`📄  SQL leído: ${sqlPath} (${(sqlScript.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error('❌  Error leyendo el archivo SQL:', err.message);
    await connection.end();
    process.exit(1);
  }

  // Replace plain INSERT INTO with INSERT IGNORE INTO for all seed data rows
  // so the script is idempotent — re-running it won't fail on duplicate keys.
  const idempotentSql = sqlScript.replace(/\bINSERT INTO\b/g, 'INSERT IGNORE INTO');

  try {
    console.log('⚙️   Ejecutando script SQL …');
    await connection.query(idempotentSql);
    console.log('✅  Base de datos inicializada correctamente');
    console.log('    Tablas, vistas, seed data y usuario admin listos.');
  } catch (err) {
    console.error('❌  Error ejecutando el script SQL:', err.message);
    if (err.sql) {
      // Show only the first 200 chars of the failing statement to aid debugging
      console.error('    Statement:', err.sql.substring(0, 200));
    }
    await connection.end();
    process.exit(1);
  }

  await connection.end();
  process.exit(0);
}

initDatabase();
