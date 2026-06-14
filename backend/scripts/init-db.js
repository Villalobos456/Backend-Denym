// backend/scripts/init-db.js
require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

function getDbConfig() {
  if (process.env.MYSQLHOST) {
    return {
      host:               process.env.MYSQLHOST,
      port:               Number(process.env.MYSQLPORT) || 3306,
      user:               process.env.MYSQLUSER,
      password:           process.env.MYSQLPASSWORD,
      database:           process.env.MYSQLDATABASE || 'railway',
      multipleStatements: true,
    };
  }
  console.error('❌  MYSQLHOST no configurada');
  process.exit(1);
}

async function waitForMySQL(config, retries = 20, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mysql.createConnection(config);
      await conn.end();
      console.log(`✅  MySQL listo (intento ${i})`);
      return;
    } catch (err) {
      console.log(`⏳  MySQL no disponible (${i}/${retries}): ${err.message}`);
      if (i === retries) { console.error('❌  MySQL no respondió'); process.exit(1); }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function initDatabase() {
  const config = getDbConfig();
  console.log(`🔌  Conectando a "${config.database}" @ ${config.host}:${config.port} …`);

  await waitForMySQL(config);

  const connection = await mysql.createConnection(config);
  console.log('✅  Conectado a MySQL');

  const [[{ db }]] = await connection.query('SELECT DATABASE() AS db');
  console.log(`📍  Database activa: "${db}"`);

  // Buscar SQL solo dentro de backend/ (donde Docker copia el código)
  const sqlCandidates = [
    path.join(__dirname, '../database/denymstyle.sql'),   // backend/database/
    path.join(process.cwd(), 'database/denymstyle.sql'),  // /app/database/
  ];

  console.log('🔍  Buscando SQL en:');
  sqlCandidates.forEach(p => console.log('   ', p, fs.existsSync(p) ? '✅' : '❌'));

  const sqlPath = sqlCandidates.find(p => fs.existsSync(p));
  if (!sqlPath) {
    console.error('❌  SQL no encontrado.');
    await connection.end();
    process.exit(1);
  }

  console.log(`📄  Leyendo: ${sqlPath}`);
  let sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`    Tamaño: ${(sql.length / 1024).toFixed(1)} KB`);

  // Correcciones para Railway
  sql = sql
    .replace(/CREATE\s+DATABASE\s+[^;]+;/gi, '')
    .replace(/USE\s+`?denymstyle`?\s*;/gi, `USE \`${config.database}\`;`)
    .replace(/\bCREATE TABLE\b/gi, 'CREATE TABLE IF NOT EXISTS')
    .replace(/\bINSERT INTO\b/g, 'INSERT IGNORE INTO')
    .replace(/DEFINER\s*=\s*`[^`]*`@`[^`]*`\s*/gi, '')
    .replace(/CREATE ALGORITHM=\w+\s+SQL SECURITY \w+\s+VIEW/gi, 'CREATE OR REPLACE VIEW');

  sql = `USE \`${config.database}\`;\n` + sql;

  console.log('⚙️   Ejecutando SQL …');
  try {
    await connection.query(sql);
  } catch (err) {
    console.error('❌  Error ejecutando SQL:', err.message);
    if (err.sql) console.error('    Statement:', err.sql.substring(0, 400));
    await connection.end();
    process.exit(1);
  }

  const [tables] = await connection.query('SHOW TABLES');
  console.log(`\n✅  ${tables.length} tablas en "${config.database}":`);
  tables.forEach(t => console.log('   •', Object.values(t)[0]));

  await connection.end();
  console.log('\n🚀  Init-db completado');
  process.exit(0);
}

initDatabase();
