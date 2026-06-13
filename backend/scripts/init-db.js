// backend/scripts/init-db.js
//
// Initialises the production MySQL database from database/denymstyle.sql.
// Run once on a fresh Railway MySQL service via Pre-deploy command.
//
// Safe to re-run: uses IF NOT EXISTS and INSERT IGNORE.

const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

async function initDatabase() {
  const dbUrl = process.env.MYSQL_URL;
  if (!dbUrl) {
    console.error('❌  MYSQL_URL no configurada');
    process.exit(1);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(dbUrl);
  } catch (e) {
    console.error('❌  MYSQL_URL inválida:', e.message);
    process.exit(1);
  }

  const dbName = parsedUrl.pathname.replace(/^\//, '') || 'railway';
  console.log(`🔌  Conectando a ${dbName} @ ${parsedUrl.hostname} …`);

  let connection;
  try {
    connection = await mysql.createConnection(dbUrl + '?multipleStatements=true');
    console.log('✅  Conectado a MySQL');
  } catch (err) {
    console.error('❌  No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  }

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

  // Limpiar sintaxis incompatible con MySQL de Railway
  let cleanSql = sqlScript
    // Hacer INSERT idempotente
    .replace(/\bINSERT INTO\b/g, 'INSERT IGNORE INTO')
    // Eliminar DEFINER que Railway no permite
    .replace(/DEFINER=`[^`]*`@`[^`]*`\s*/g, '')
    // Eliminar CREATE TABLE stand-in para vistas
    .replace(/CREATE TABLE `v_[^`]+`[\s\S]*?;/g, '')
    // Reemplazar CREATE ALGORITHM con CREATE OR REPLACE VIEW
    .replace(/CREATE ALGORITHM=\w+\s+SQL SECURITY \w+\s+VIEW/g, 'CREATE OR REPLACE VIEW');

  try {
    console.log('⚙️   Ejecutando script SQL …');
    await connection.query(cleanSql);
    console.log('✅  Base de datos inicializada correctamente');
    console.log('    Tablas, vistas, seed data y usuario admin listos.');
  } catch (err) {
    console.error('❌  Error ejecutando el script SQL:', err.message);
    if (err.sql) {
      console.error('    Statement:', err.sql.substring(0, 300));
    }
    await connection.end();
    process.exit(1);
  }

  await connection.end();
  process.exit(0);
}

initDatabase();
