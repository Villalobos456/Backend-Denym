// server.js — DenymStyle API v2.0
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const pool      = require('./config/db');

const app = express();

// ── Trust proxy (requerido en Railway/producción)
app.set('trust proxy', 1);

// ── Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// ── Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 25, message: 'Demasiados intentos' }));

// ── Rutas principales
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/productos',  require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/ordenes',    require('./routes/ordenes'));
app.use('/api/carrito',    require('./routes/carrito'));
app.use('/api/admin',      require('./routes/admin'));

// ── Rutas auxiliares simples
app.get('/api/colecciones',   async (_, res) => { try { const [r] = await pool.execute('SELECT * FROM colecciones WHERE eliminado=0 AND activo=1 ORDER BY coleccion_id DESC'); res.json(r); } catch(e){res.status(500).json({message:e.message});} });
app.get('/api/tallas',        async (_, res) => { try { const [r] = await pool.execute('SELECT * FROM tallas ORDER BY orden'); res.json(r); } catch(e){res.status(500).json({message:e.message});} });
app.get('/api/colores',       async (_, res) => { try { const [r] = await pool.execute('SELECT * FROM colores'); res.json(r); } catch(e){res.status(500).json({message:e.message});} });
app.get('/api/metodos-pago',  async (_, res) => { try { const [r] = await pool.execute('SELECT * FROM metodos_pago WHERE activo=1'); res.json(r); } catch(e){res.status(500).json({message:e.message});} });
app.get('/api/tipos-entrega', async (_, res) => { try { const [r] = await pool.execute('SELECT * FROM tipos_entrega WHERE activo=1'); res.json(r); } catch(e){res.status(500).json({message:e.message});} });

// ── Newsletter
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });
  try {
    await pool.execute('INSERT IGNORE INTO newsletter (email) VALUES (?)', [email]);
    res.json({ message: 'Suscrito' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Chat IA (Demy — Anthropic)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: 'Eres Demy, asistente de moda de DenymStyle Bolivia. Fundada por Marcelo Villalobos. Elegante, sofisticada. Responde siempre en español, maximo 120 palabras. Colecciones SS26: Noir Urbain, Creme de la Creme. AW25: Dorado Salvaje, Minimalista Feroz. Precios Bs.190-420. WhatsApp: 69800542.',
        messages
      })
    });
    const data = await response.json();
    res.json({ reply: data.content?.[0]?.text || 'Error de respuesta' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── Health check
app.get('/api/health', (_, res) => res.json({ status: 'OK', ts: new Date(), version: '2.0.0' }));

// ── Error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🚀  DenymStyle API — Puerto ${PORT}\n`));

// ── SETUP TEMPORAL (borrar después)
app.get('/api/run-setup', async (_, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const sql = fs.readFileSync(path.join(__dirname, '../database/denymstyle.sql'), 'utf8');
    let cleanSql = sql
      .replace(/\bINSERT INTO\b/g, 'INSERT IGNORE INTO')
      .replace(/DEFINER=`[^`]*`@`[^`]*`\s*/g, '')
      .replace(/CREATE TABLE `v_[^`]+`[\s\S]*?;/g, '')
      .replace(/CREATE ALGORITHM=\w+\s+SQL SECURITY \w+\s+VIEW/g, 'CREATE OR REPLACE VIEW');
    await pool.query(cleanSql);
    res.json({ status: 'OK', message: 'Base de datos inicializada!' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
