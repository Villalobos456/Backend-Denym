// routes/productos.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool   = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const { categoria, coleccion, genero, search, destacado, nuevo, page = 1, limit = 12 } = req.query;
    let sql = 'SELECT * FROM v_productos WHERE 1=1';
    const p = [];
    if (categoria) { sql += ' AND cat_slug=?';    p.push(categoria); }
    if (coleccion) { sql += ' AND coleccion_id=?'; p.push(coleccion); }
    if (genero)    { sql += ' AND genero=?';       p.push(genero); }
    if (search)    { sql += ' AND nombre LIKE ?';  p.push(`%${search}%`); }
    if (destacado) { sql += ' AND destacado=1'; }
    if (nuevo)     { sql += ' AND nuevo=1'; }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) AS total');
    const [[{ total }]] = await pool.execute(countSql, p);

    const off = (parseInt(page) - 1) * parseInt(limit);
    sql += ` ORDER BY product_id DESC LIMIT ${parseInt(limit)} OFFSET ${off}`;
    const [rows] = await pool.execute(sql, p);
    res.json({ products: rows, total, page: +page, limit: +limit, pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM v_productos WHERE product_id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Producto no encontrado' });
    const [inv] = await pool.execute(
      'SELECT i.*,t.nombre AS talla,c.nombre AS color,c.hex_code FROM inventario i JOIN tallas t ON i.talla_id=t.talla_id JOIN colores c ON i.color_id=c.color_id WHERE i.product_id=?',
      [req.params.id]
    );
    res.json({ ...rows[0], inventario: inv });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/productos (admin)
router.post('/', verifyToken, requireRole('admin', 'vendedor'), [
  body('nombre').trim().notEmpty().isLength({ max: 200 }),
  body('precio').isFloat({ min: 0 }),
  body('categoria_id').isInt({ min: 1 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { nombre, descripcion, descripcion_corta, precio, precio_oferta, categoria_id,
            coleccion_id, sku, imagen_url, material, genero, destacado, nuevo } = req.body;
    const [r] = await pool.execute(
      'INSERT INTO productos (nombre,descripcion,descripcion_corta,precio,precio_oferta,categoria_id,coleccion_id,sku,imagen_url,material,genero,destacado,nuevo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [nombre, descripcion||null, descripcion_corta||null, precio, precio_oferta||null,
       categoria_id, coleccion_id||null, sku||null, imagen_url||null, material||null,
       genero||'unisex', destacado?1:0, nuevo?1:0]
    );
    res.status(201).json({ message: 'Producto creado', product_id: r.insertId });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/productos/:id
router.put('/:id', verifyToken, requireRole('admin', 'vendedor'), async (req, res) => {
  try {
    const { nombre, descripcion, descripcion_corta, precio, precio_oferta, categoria_id,
            coleccion_id, sku, imagen_url, material, genero, destacado, nuevo, activo } = req.body;
    await pool.execute(
      'UPDATE productos SET nombre=?,descripcion=?,descripcion_corta=?,precio=?,precio_oferta=?,categoria_id=?,coleccion_id=?,sku=?,imagen_url=?,material=?,genero=?,destacado=?,nuevo=?,activo=? WHERE product_id=? AND eliminado=0',
      [nombre, descripcion||null, descripcion_corta||null, precio, precio_oferta||null,
       categoria_id, coleccion_id||null, sku||null, imagen_url||null, material||null,
       genero||'unisex', destacado?1:0, nuevo?1:0, activo?1:0, req.params.id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/productos/:id — ELIMINACIÓN LÓGICA
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.execute('UPDATE productos SET eliminado=1, activo=0 WHERE product_id=?', [req.params.id]);
    res.json({ message: 'Producto eliminado' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
