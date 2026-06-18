// routes/admin.js
const express     = require('express');
const PDFDocument = require('pdfkit');
const pool        = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const GOLD  = '#c9a84c';
const BLACK = '#0a0a0a';
const CREAM = '#f5f0e8';
const GREY  = '#7a6e60';

// ── GET /api/admin/stats  — Dashboard
router.get('/stats', verifyToken, requireRole('admin','vendedor'), async (req, res) => {
  try {
    // FIX: una sola desestructuración para obtener el array de filas
    const [ventasRows]     = await pool.execute("SELECT COUNT(*) AS total_ord, COALESCE(SUM(total),0) AS ingresos FROM ordenes WHERE eliminado=0 AND estado!='cancelado'");
    const [productosRows]  = await pool.execute('SELECT COUNT(*) AS total FROM productos WHERE eliminado=0 AND activo=1');
    const [clientesRows]   = await pool.execute('SELECT COUNT(*) AS total FROM usuarios WHERE eliminado=0 AND role_id=3');
    const [pendientesRows] = await pool.execute("SELECT COUNT(*) AS total FROM ordenes WHERE estado='pendiente' AND eliminado=0");

    const [ventasDia]  = await pool.execute('SELECT * FROM v_ventas_resumen LIMIT 30');
    const [ventasCat]  = await pool.execute(
      "SELECT c.nombre AS categoria, COUNT(oi.item_id) AS cantidad, SUM(oi.subtotal) AS ingresos FROM orden_items oi JOIN productos p ON oi.product_id=p.product_id JOIN categorias c ON p.categoria_id=c.categoria_id JOIN ordenes o ON oi.order_id=o.order_id WHERE o.eliminado=0 AND o.estado!='cancelado' GROUP BY p.categoria_id"
    );
    const [topProds]   = await pool.execute(
      "SELECT p.nombre, SUM(oi.cantidad) AS vendidos, SUM(oi.subtotal) AS ingresos FROM orden_items oi JOIN productos p ON oi.product_id=p.product_id JOIN ordenes o ON oi.order_id=o.order_id WHERE o.eliminado=0 AND o.estado!='cancelado' GROUP BY oi.product_id ORDER BY vendidos DESC LIMIT 5"
    );
    const [stockBajo]  = await pool.execute('SELECT * FROM v_stock_bajo LIMIT 10');
    const [ventas7]    = await pool.execute(
      "SELECT DATE(creado_en) AS fecha, COUNT(*) AS c FROM ordenes WHERE eliminado=0 AND creado_en>=DATE_SUB(NOW(),INTERVAL 7 DAY) GROUP BY DATE(creado_en)"
    );

    res.json({
      resumen: {
        ventas:     ventasRows[0],
        productos:  productosRows[0],
        clientes:   clientesRows[0],
        pendientes: pendientesRows[0],
      },
      ventasDia, ventasCat, topProds, stockBajo, ventas7
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/admin/logs
router.get('/logs', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { page=1, limit=50, evento } = req.query;
    let sql = 'SELECT * FROM v_log_acceso WHERE 1=1';
    const p = [];
    if (evento) { sql += ' AND evento=?'; p.push(evento); }
    sql += ` LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page)-1)*parseInt(limit)}`;
    const [r] = await pool.execute(sql, p);
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/admin/usuarios
router.get('/usuarios', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const [r] = await pool.execute(
      'SELECT u.user_id,u.fullname,u.username,u.email,u.telefono,u.ciudad,u.activo,u.eliminado,u.creado_en,u.ultimo_login,u.pwd_strength,r.nombre AS rol FROM usuarios u JOIN roles r ON u.role_id=r.role_id WHERE u.eliminado=0 ORDER BY u.creado_en DESC'
    );
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/usuarios/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { activo, role_id } = req.body;
  await pool.execute('UPDATE usuarios SET activo=?,role_id=? WHERE user_id=?', [activo?1:0,role_id,req.params.id]);
  res.json({ message: 'Usuario actualizado' });
});

// ELIMINACIÓN LÓGICA usuarios
router.delete('/usuarios/:id', verifyToken, requireRole('admin'), async (req, res) => {
  await pool.execute('UPDATE usuarios SET eliminado=1,activo=0 WHERE user_id=?', [req.params.id]);
  res.json({ message: 'Usuario eliminado' });
});

// ── PDF VENTAS
router.get('/pdf/ventas', verifyToken, requireRole('admin','vendedor'), async (req, res) => {
  try {
    const [ordenes]   = await pool.execute("SELECT o.*,u.fullname,u.email,mp.nombre AS metodo,te.nombre AS entrega FROM ordenes o JOIN usuarios u ON o.user_id=u.user_id JOIN metodos_pago mp ON o.metodo_pago_id=mp.metodo_id JOIN tipos_entrega te ON o.entrega_id=te.entrega_id WHERE o.eliminado=0 ORDER BY o.creado_en DESC LIMIT 100");
    const [totalesRows] = await pool.execute("SELECT COUNT(*) AS total_ord, COALESCE(SUM(total),0) AS ingresos FROM ordenes WHERE eliminado=0 AND estado!='cancelado'");
    const totales = totalesRows[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ventas_${Date.now()}.pdf"`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    // Header fondo negro
    doc.rect(0, 0, 612, 85).fill(BLACK);
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(24)
       .text('DENYMSTYLE', 50, 22, { align: 'left' });
    doc.fillColor(CREAM).font('Helvetica').fontSize(11)
       .text('Reporte de Ventas', 50, 50);
    doc.fillColor(GOLD).fontSize(8)
       .text(`Generado: ${new Date().toLocaleString('es')}`, 400, 35, { align: 'right', width: 165 });

    // Resumen
    doc.fillColor(CREAM).rect(40, 100, 532, 50).fill('#1a1a1a');
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(10)
       .text(`Total Órdenes: ${totales.total_ord}`, 60, 112);
    doc.fillColor(CREAM).text(`Ingresos Totales: Bs. ${parseFloat(totales.ingresos).toFixed(2)}`, 60, 128);

    // Tabla
    let y = 168;
    doc.rect(40, y, 532, 22).fill('#1a1a1a');
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(8);
    ['#','Cliente','Total (Bs.)','Estado','Método','Fecha'].forEach((h, i) => {
      const xs = [50, 80, 270, 340, 420, 500];
      doc.text(h, xs[i], y + 7);
    });
    y += 22;

    ordenes.forEach((o, idx) => {
      if (y > 760) { doc.addPage(); y = 40; }
      doc.rect(40, y, 532, 18).fill(idx % 2 === 0 ? '#ffffff' : '#f9f7f4');
      doc.fillColor('#222').font('Helvetica').fontSize(7.5);
      const row = [o.order_id, o.fullname?.substring(0,22), parseFloat(o.total).toFixed(2), o.estado, o.metodo?.substring(0,14), new Date(o.creado_en).toLocaleDateString('es')];
      [50,80,270,340,420,500].forEach((x,i) => doc.text(String(row[i]||''), x, y + 5));
      y += 18;
    });

    doc.rect(40, y + 12, 532, 1).fill(GOLD);
    doc.fillColor(GREY).fontSize(8).text('© 2026 DenymStyle — Marcelo Villalobos | mjkazama01@gmail.com', 40, y + 20, { align: 'center', width: 532 });
    doc.end();
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PDF INVENTARIO
router.get('/pdf/inventario', verifyToken, requireRole('admin','vendedor'), async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT p.nombre,p.sku,cat.nombre AS categoria,t.nombre AS talla,c.nombre AS color,i.stock,i.stock_minimo FROM inventario i JOIN productos p ON i.product_id=p.product_id JOIN categorias cat ON p.categoria_id=cat.categoria_id JOIN tallas t ON i.talla_id=t.talla_id JOIN colores c ON i.color_id=c.color_id WHERE p.eliminado=0 ORDER BY p.nombre'
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="inventario_${Date.now()}.pdf"`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    doc.rect(0,0,612,85).fill(BLACK);
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(24).text('DENYMSTYLE', 50, 22);
    doc.fillColor(CREAM).font('Helvetica').fontSize(11).text('Reporte de Inventario', 50, 50);
    doc.fillColor(GOLD).fontSize(8).text(`Generado: ${new Date().toLocaleString('es')}`, 400, 35, { align:'right', width:165 });

    let y = 100;
    doc.rect(40,y,532,22).fill('#1a1a1a');
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(8);
    ['Producto','SKU','Cat.','Talla','Color','Stock','Mín.'].forEach((h,i)=>{
      const xs=[50,200,275,325,375,440,495];
      doc.text(h,xs[i],y+7);
    });
    y+=22;

    items.forEach((it,idx)=>{
      if(y>760){doc.addPage();y=40;}
      const bajo = it.stock<=it.stock_minimo;
      doc.rect(40,y,532,17).fill(bajo?'#fff0f0':(idx%2===0?'#fff':'#f9f7f4'));
      doc.fillColor(bajo?'#c00':'#222').font('Helvetica').fontSize(7.5);
      [it.nombre?.substring(0,24),it.sku||'-',it.categoria?.substring(0,10),it.talla,it.color,it.stock,it.stock_minimo]
        .forEach((v,i)=>{ const xs=[50,200,275,325,375,440,495]; doc.text(String(v||''),xs[i],y+4); });
      y+=17;
    });

    doc.rect(40,y+10,532,1).fill(GOLD);
    doc.fillColor(GREY).fontSize(8).text('© 2026 DenymStyle — Marcelo Villalobos',40,y+18,{align:'center',width:532});
    doc.end();
  } catch(e){ res.status(500).json({message:e.message}); }
});

// ── CRUD Colecciones
router.get('/colecciones',      verifyToken, requireRole('admin','vendedor'), async (req,res)=>{ const [r]=await pool.execute('SELECT * FROM colecciones WHERE eliminado=0 ORDER BY coleccion_id DESC'); res.json(r); });
router.post('/colecciones',     verifyToken, requireRole('admin'), async(req,res)=>{ const {nombre,temporada,descripcion}=req.body; if(!nombre||!temporada) return res.status(400).json({message:'Campos requeridos'}); try{ const [r]=await pool.execute('INSERT INTO colecciones (nombre,temporada,descripcion) VALUES (?,?,?)',[nombre,temporada,descripcion||null]); res.status(201).json({coleccion_id:r.insertId}); }catch(e){res.status(500).json({message:e.message});} });
router.put('/colecciones/:id',  verifyToken, requireRole('admin'), async(req,res)=>{ const {nombre,temporada,descripcion,activo}=req.body; await pool.execute('UPDATE colecciones SET nombre=?,temporada=?,descripcion=?,activo=? WHERE coleccion_id=?',[nombre,temporada,descripcion||null,activo?1:0,req.params.id]); res.json({message:'OK'}); });
router.delete('/colecciones/:id',verifyToken,requireRole('admin'),async(req,res)=>{ await pool.execute('UPDATE colecciones SET eliminado=1 WHERE coleccion_id=?',[req.params.id]); res.json({message:'Eliminada'}); });

// ── Inventario
router.get('/inventario',    verifyToken, requireRole('admin','vendedor'), async(req,res)=>{ const [r]=await pool.execute('SELECT * FROM v_stock_bajo'); res.json(r); });
router.put('/inventario/:id',verifyToken, requireRole('admin','vendedor'), async(req,res)=>{ const {stock}=req.body; await pool.execute('UPDATE inventario SET stock=? WHERE inv_id=?',[stock,req.params.id]); res.json({message:'Stock actualizado'}); });

module.exports = router;
