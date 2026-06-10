// middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'denymstyle_secret';

const verifyToken = (req, res, next) => {
  const auth  = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user)                        return res.status(401).json({ message: 'No autenticado' });
  if (!roles.includes(req.user.role))   return res.status(403).json({ message: 'Acceso denegado' });
  next();
};

module.exports = { verifyToken, requireRole };
