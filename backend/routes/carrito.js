// routes/carrito.js
const express = require('express');
const pool    = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const router  = express.Router();

// GET /api/carrito
router.get('/', verifyToken, async (req, res) => {
  try {
    const [cart] = await pool.execute('SELECT * FROM carrito WHERE user_id=?', [req.user.id]);
    if (!cart.length) return res.json({ items: [] });
    const [items] = await pool.execute(
      `SELECT ci.*,p.nombre,p.imagen_url,p.precio,p.sku,
              t.nombre AS talla, c.nombre AS color
       FROM carrito_items ci
       JOIN productos p ON ci.product_id=p.product_id
       LEFT JOIN tallas t ON ci.talla_id=t.talla_id
       LEFT JOIN colores c ON ci.color_id=c.color_id
       WHERE ci.cart_id=?`,
      [cart[0].cart_id]
    );
    res.json({ items, cart_id: cart[0].cart_id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/carrito
router.post('/', verifyToken, async (req, res) => {
  try {
    const { product_id, talla_id, color_id, cantidad = 1 } = req.body;
    let [cart] = await pool.execute('SELECT cart_id FROM carrito WHERE user_id=?', [req.user.id]);
    let cartId;
    if (!cart.length) {
      const [r] = await pool.execute('INSERT INTO carrito (user_id) VALUES (?)', [req.user.id]);
      cartId = r.insertId;
    } else {
      cartId = cart[0].cart_id;
    }
    await pool.execute(
      'INSERT INTO carrito_items (cart_id,product_id,talla_id,color_id,cantidad) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE cantidad=cantidad+?',
      [cartId, product_id, talla_id || null, color_id || null, cantidad, cantidad]
    );
    res.json({ message: 'Agregado al carrito' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/carrito/:product_id
router.put('/:product_id', verifyToken, async (req, res) => {
  try {
    const { cantidad } = req.body;
    const [cart] = await pool.execute('SELECT cart_id FROM carrito WHERE user_id=?', [req.user.id]);
    if (!cart.length) return res.status(404).json({ message: 'Carrito no encontrado' });
    if (cantidad <= 0) {
      await pool.execute('DELETE FROM carrito_items WHERE cart_id=? AND product_id=?', [cart[0].cart_id, req.params.product_id]);
    } else {
      await pool.execute('UPDATE carrito_items SET cantidad=? WHERE cart_id=? AND product_id=?', [cantidad, cart[0].cart_id, req.params.product_id]);
    }
    res.json({ message: 'Carrito actualizado' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/carrito/:product_id
router.delete('/:product_id', verifyToken, async (req, res) => {
  try {
    const [cart] = await pool.execute('SELECT cart_id FROM carrito WHERE user_id=?', [req.user.id]);
    if (!cart.length) return res.status(404).json({ message: 'Carrito no encontrado' });
    await pool.execute('DELETE FROM carrito_items WHERE cart_id=? AND product_id=?', [cart[0].cart_id, req.params.product_id]);
    res.json({ message: 'Item eliminado' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
