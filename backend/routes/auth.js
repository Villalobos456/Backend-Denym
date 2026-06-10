// routes/auth.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool    = require('../config/db');
const { logAcceso, getIp } = require('../middleware/logger');
const router  = express.Router();

const JWT_SECRET  = process.env.JWT_SECRET  || 'denymstyle_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const pwdStrength = (pwd) => {
  if (!pwd || pwd.length < 6) return 'debil';
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_]).{8,}$/.test(pwd);
  if (strong) return 'fuerte';
  const medium = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(pwd);
  return medium ? 'intermedio' : 'debil';
};

// POST /api/auth/register
router.post('/register', [
  body('fullname').trim().notEmpty().isLength({ min: 2, max: 120 }).withMessage('Nombre inválido'),
  body('username').trim().notEmpty().isLength({ min: 3, max: 60 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Usuario inválido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullname, username, email, password, telefono, ciudad, departamento } = req.body;
  try {
    const [existing] = await pool.execute(
      'SELECT user_id FROM usuarios WHERE email=? OR username=?', [email, username]
    );
    if (existing.length) return res.status(409).json({ message: 'Email o usuario ya existe' });

    const strength = pwdStrength(password);
    const hash     = await bcrypt.hash(password, 12);

    const [r] = await pool.execute(
      `INSERT INTO usuarios (fullname, username, email, password_hash, pwd_strength, telefono, ciudad, departamento)
       VALUES (?,?,?,?,?,?,?,?)`,
      [fullname, username, email, hash, strength, telefono || null, ciudad || null, departamento || null]
    );

    await logAcceso(r.insertId, username, getIp(req), 'registro', req.headers['user-agent']);
    res.status(201).json({ message: 'Cuenta creada', password_strength: strength });
  } catch (e) {
    res.status(500).json({ message: 'Error interno', detail: e.message });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña requerida'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre AS role_name
       FROM usuarios u JOIN roles r ON u.role_id = r.role_id
       WHERE u.email=? AND u.eliminado=0 AND u.activo=1`, [email]
    );

    if (!rows.length) {
      await logAcceso(null, email, getIp(req), 'intento_fallido', req.headers['user-agent']);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user  = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await logAcceso(user.user_id, user.username, getIp(req), 'intento_fallido', req.headers['user-agent']);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    await pool.execute('UPDATE usuarios SET ultimo_login=NOW() WHERE user_id=?', [user.user_id]);
    await logAcceso(user.user_id, user.username, getIp(req), 'ingreso', req.headers['user-agent']);

    const token = jwt.sign(
      { id: user.user_id, username: user.username, email: user.email, role: user.role_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const { password_hash, ...userData } = user;
    res.json({ token, user: userData });
  } catch (e) {
    res.status(500).json({ message: 'Error interno', detail: e.message });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const { userId, username } = req.body;
    await logAcceso(userId || null, username || null, getIp(req), 'salida', req.headers['user-agent']);
    res.json({ message: 'Sesión cerrada' });
  } catch {
    res.json({ message: 'OK' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth  = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No autenticado' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ user });
  } catch {
    res.status(403).json({ message: 'Token inválido' });
  }
});

module.exports = router;
