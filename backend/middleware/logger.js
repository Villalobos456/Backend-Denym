// middleware/logger.js
const pool = require('../config/db');

let UAParser;
try { UAParser = require('ua-parser-js'); } catch {}

const logAcceso = async (userId, username, ip, evento, userAgent = '') => {
  try {
    let browser = 'Unknown', os = 'Unknown';
    if (UAParser) {
      const p = new UAParser(userAgent);
      browser = `${p.getBrowser().name || ''} ${p.getBrowser().version || ''}`.trim() || 'Unknown';
      os      = `${p.getOS().name || ''} ${p.getOS().version || ''}`.trim() || 'Unknown';
    }
    await pool.execute(
      'INSERT INTO log_acceso (user_id, username, ip_address, evento, browser, sistema_op) VALUES (?,?,?,?,?,?)',
      [userId || null, username || null, ip, evento, browser, os]
    );
  } catch (e) {
    console.error('[LOG ERROR]', e.message);
  }
};

const getIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  || req.socket?.remoteAddress
  || '0.0.0.0';

module.exports = { logAcceso, getIp };
