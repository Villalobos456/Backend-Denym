// routes/categorias.js
const express = require('express');
const pool    = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router  = express.Router();

// GET /api/categorias
router.get('/', async (req, res) => {
  try {
    const [r] = await pool.execute('SELECT * FROM categorias WHERE eliminado=0 AND activo=1 ORDER BY orden');
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/categorias
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  const { nombre, descripcion, slug, orden } = req.body;
  if (!nombre || !slug) return res.status(400).json({ message: 'Nombre y slug requeridos' });
  try {
    const [r] = await pool.execute(
      'INSERT INTO categorias (nombre,descripcion,slug,orden) VALUES (?,?,?,?)',
      [nombre, descripcion || null, slug, orden || 0]
    );
    res.status(201).json({ categoria_id: r.insertId, message: 'Categoría creada' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/categorias/:id
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { nombre, descripcion, activo, orden } = req.body;
  try {
    await pool.execute(
      'UPDATE categorias SET nombre=?,descripcion=?,activo=?,orden=? WHERE categoria_id=?',
      [nombre, descripcion || null, activo ? 1 : 0, orden || 0, req.params.id]
    );
    res.json({ message: 'Categoría actualizada' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/categorias/:id — ELIMINACIÓN LÓGICA
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.execute('UPDATE categorias SET eliminado=1, activo=0 WHERE categoria_id=?', [req.params.id]);
    res.json({ message: 'Categoría eliminada' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
