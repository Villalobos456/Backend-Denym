// routes/ordenes.js
const express = require('express');
const pool    = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router  = express.Router();

// GET /api/ordenes/mis-ordenes
router.get('/mis-ordenes', verifyToken, async (req, res) => {
  try {
    const [r] = await pool.execute(
      `SELECT o.*,mp.nombre AS metodo,te.nombre AS entrega,te.precio AS precio_entrega
       FROM ordenes o
       JOIN metodos_pago mp ON o.metodo_pago_id=mp.metodo_id
       JOIN tipos_entrega te ON o.entrega_id=te.entrega_id
       WHERE o.user_id=? AND o.eliminado=0 ORDER BY o.creado_en DESC`,
      [req.user.id]
    );
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/ordenes (admin)
router.get('/', verifyToken, requireRole('admin', 'vendedor'), async (req, res) => {
  try {
    const { estado, page = 1, limit = 20 } = req.query;
    let sql = `SELECT o.*,u.fullname,u.email,mp.nombre AS metodo,te.nombre AS entrega
               FROM ordenes o
               JOIN usuarios u ON o.user_id=u.user_id
               JOIN metodos_pago mp ON o.metodo_pago_id=mp.metodo_id
               JOIN tipos_entrega te ON o.entrega_id=te.entrega_id
               WHERE o.eliminado=0`;
    const p = [];
    if (estado) { sql += ' AND o.estado=?'; p.push(estado); }
    sql += ` ORDER BY o.creado_en DESC LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page) - 1) * parseInt(limit)}`;
    const [r] = await pool.execute(sql, p);
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/ordenes
router.post('/', verifyToken, async (req, res) => {
  try {
    const { metodo_pago_id, entrega_id, nombre_receptor, telefono_entrega,
            direccion_entrega, ciudad_entrega, punto_recojo, notas,
            items, subtotal, cargo_entrega, descuento, total } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Carrito vacío' });

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || '0.0.0.0';

    const [r] = await pool.execute(
      `INSERT INTO ordenes (user_id,metodo_pago_id,entrega_id,subtotal,cargo_entrega,descuento,total,
        nombre_receptor,telefono_entrega,direccion_entrega,ciudad_entrega,punto_recojo,notas,ip_compra)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [req.user.id, metodo_pago_id, entrega_id, subtotal, cargo_entrega || 0, descuento || 0, total,
       nombre_receptor || null, telefono_entrega || null, direccion_entrega || null,
       ciudad_entrega || null, punto_recojo || null, notas || null, ip]
    );
    const orderId = r.insertId;

    for (const item of items) {
      await pool.execute(
        'INSERT INTO orden_items (order_id,product_id,talla_id,color_id,nombre_snapshot,imagen_url,precio_unit,cantidad,subtotal) VALUES (?,?,?,?,?,?,?,?,?)',
        [orderId, item.product_id, item.talla_id || null, item.color_id || null,
         item.name, item.image_url || null, item.price, item.quantity, item.subtotal]
      );
    }
    res.status(201).json({ message: 'Orden creada', order_id: orderId });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/ordenes/:id/estado
router.put('/:id/estado', verifyToken, requireRole('admin', 'vendedor'), async (req, res) => {
  try {
    const { estado, pago_estado } = req.body;
    await pool.execute(
      'UPDATE ordenes SET estado=?,pago_estado=? WHERE order_id=?',
      [estado, pago_estado || 'pendiente', req.params.id]
    );
    res.json({ message: 'Estado actualizado' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/ordenes/:id — ELIMINACIÓN LÓGICA
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await pool.execute('UPDATE ordenes SET eliminado=1 WHERE order_id=?', [req.params.id]);
    res.json({ message: 'Orden eliminada' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
