// backend/scripts/init-db.js
require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

// ── Construir config desde variables individuales (más confiable que MYSQL_URL)
function getDbConfig() {
  // Preferir variables individuales de Railway (MYSQLHOST, etc.)
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
  // Fallback: MYSQL_URL (si Railway la resolvió bien)
  if (process.env.MYSQL_URL) {
    return process.env.MYSQL_URL + '?multipleStatements=true';
  }
  console.error('❌  No hay variables de MySQL configuradas (MYSQLHOST o MYSQL_URL)');
  process.exit(1);
}

// ── Esperar a que MySQL esté listo (máx ~60 seg)
async function waitForMySQL(config, retries = 20, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mysql.createConnection(config);
      await conn.end();
      console.log(`✅  MySQL listo (intento ${i})`);
      return;
    } catch (err) {
      console.log(`⏳  MySQL no disponible (${i}/${retries}): ${err.message}`);
      if (i === retries) {
        console.error('❌  MySQL no respondió después de', retries, 'intentos');
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function initDatabase() {
  const config = getDbConfig();

  // Mostrar a qué host conectamos (sin password)
  if (typeof config === 'object') {
    console.log(`🔌  Conectando a ${config.database} @ ${config.host}:${config.port} …`);
  }

  // Esperar a MySQL con reintentos
  await waitForMySQL(config);

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅  Conectado a MySQL');
  } catch (err) {
    console.error('❌  No se pudo conectar:', err.message);
    process.exit(1);
  }

  // Ruta del SQL — buscar en posibles ubicaciones
  const sqlCandidates = [
    path.join(__dirname, '../../database/denymstyle.sql'),
    path.join(__dirname, '../database/denymstyle.sql'),
    path.join(process.cwd(), 'database/denymstyle.sql'),
  ];
  const sqlPath = sqlCandidates.find(p => fs.existsSync(p));

  if (!sqlPath) {
    console.error('❌  Archivo SQL no encontrado. Rutas buscadas:');
    sqlCandidates.forEach(p => console.error('   ', p));
    await connection.end();
    process.exit(1);
  }

  let sqlScript;
  try {
    sqlScript = fs.readFileSync(sqlPath, 'utf8');
    console.log(`📄  SQL leído: ${sqlPath} (${(sqlScript.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error('❌  Error leyendo SQL:', err.message);
    await connection.end();
    process.exit(1);
  }

  // Limpiar sintaxis incompatible con Railway MySQL
  const cleanSql = sqlScript
    .replace(/\bINSERT INTO\b/g, 'INSERT IGNORE INTO')
    .replace(/DEFINER=`[^`]*`@`[^`]*`\s*/g, '')
    .replace(/CREATE TABLE `v_[^`]+`[\s\S]*?;/g, '')
    .replace(/CREATE ALGORITHM=\w+\s+SQL SECURITY \w+\s+VIEW/g, 'CREATE OR REPLACE VIEW');

  try {
    console.log('⚙️   Ejecutando script SQL …');
    await connection.query(cleanSql);
    console.log('✅  Base de datos inicializada correctamente');
  } catch (err) {
    console.error('❌  Error ejecutando SQL:', err.message);
    if (err.sql) console.error('    Statement:', err.sql.substring(0, 300));
    await connection.end();
    process.exit(1);
  }

  await connection.end();
  console.log('🚀  Init-db completado');
  process.exit(0);
}

initDatabase();
