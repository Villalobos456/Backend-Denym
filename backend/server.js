require('dotenv').config();
require('express-async-errors'); // ← maneja errores async sin try/catch manual
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const pool      = require('./config/db');

// Compatibilidad con Node.js < 18 (fetch nativo no disponible)
const fetch = globalThis.fetch ?? require('node-fetch');

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
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { message: 'Demasiados intentos, intenta en 15 minutos' } // ← objeto JSON, no string
}));

// ── Rutas principales
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/productos',  require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/ordenes',    require('./routes/ordenes'));
app.use('/api/carrito',    require('./routes/carrito'));
app.use('/api/admin',      require('./routes/admin'));

// ── Rutas auxiliares simples
app.get('/api/colecciones',   async (_, res) => {
  const [r] = await pool.execute('SELECT * FROM colecciones WHERE eliminado=0 AND activo=1 ORDER BY coleccion_id DESC');
  res.json(r);
});
app.get('/api/tallas',        async (_, res) => {
  const [r] = await pool.execute('SELECT * FROM tallas ORDER BY orden');
  res.json(r);
});
app.get('/api/colores',       async (_, res) => {
  const [r] = await pool.execute('SELECT * FROM colores');
  res.json(r);
});
app.get('/api/metodos-pago',  async (_, res) => {
  const [r] = await pool.execute('SELECT * FROM metodos_pago WHERE activo=1');
  res.json(r);
});
app.get('/api/tipos-entrega', async (_, res) => {
  const [r] = await pool.execute('SELECT * FROM tipos_entrega WHERE activo=1');
  res.json(r);
});

// ── Newsletter
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });
  await pool.execute('INSERT IGNORE INTO newsletter (email) VALUES (?)', [email]);
  res.json({ message: 'Suscrito' });
});

// ── Chat IA (Demy — Anthropic)
const DEMY_SYSTEM_PROMPT = process.env.DEMY_SYSTEM_PROMPT ||
  'Eres Demy, asistente de moda de DenymStyle Bolivia. Fundada por Marcelo Villalobos. Elegante, sofisticada. ' +
  'Responde siempre en español, máximo 120 palabras. ' +
  'Colecciones SS26: Noir Urbain, Creme de la Creme. AW25: Dorado Salvaje, Minimalista Feroz. ' +
  'Precios Bs.190-420. WhatsApp: 69800542.';

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'messages es requerido y debe ser un arreglo' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[CHAT] ANTHROPIC_API_KEY no configurada');
    return res.status(503).json({ message: 'Servicio de chat no disponible' });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: DEMY_SYSTEM_PROMPT,
      messages
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[CHAT] Error Anthropic:', err);
    return res.status(502).json({ message: 'Error al contactar asistente' });
  }

  const data = await response.json();
  const reply = data.content?.find(b => b.type === 'text')?.text || 'Sin respuesta';
  res.json({ reply });
});

// ── Health check
app.get('/api/health', (_, res) => res.json({ status: 'OK', ts: new Date(), version: '2.0.0' }));

// ── Error handler global (captura errores de rutas async gracias a express-async-errors)
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// ── Inicio del servidor con cierre limpio (requerido en Railway)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`\n🚀  DenymStyle API — Puerto ${PORT}\n`));

const shutdown = (signal) => {
  console.log(`\n[${signal}] Cerrando servidor...`);
  server.close(async () => {
    await pool.end().catch(() => {});
    console.log('Servidor cerrado correctamente.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
