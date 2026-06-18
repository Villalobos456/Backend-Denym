SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "-04:00";
SET FOREIGN_KEY_CHECKS = 0;

USE `railway`;

-- ──────────────────────────────────────────
-- TABLA: roles
-- ──────────────────────────────────────────
CREATE TABLE `roles` (
  `role_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(50)  NOT NULL,
  `descripcion` VARCHAR(200) DEFAULT NULL,
  `activo`      TINYINT(1)   NOT NULL DEFAULT 1,
  `creado_en`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uk_rol_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`nombre`,`descripcion`) VALUES
  ('admin',    'Control total del sistema'),
  ('vendedor', 'Gestión de ventas e inventario'),
  ('cliente',  'Compras y perfil personal');

-- ──────────────────────────────────────────
-- TABLA: usuarios  (eliminación lógica)
-- ──────────────────────────────────────────
CREATE TABLE `usuarios` (
  `user_id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`        INT UNSIGNED NOT NULL DEFAULT 3,
  `fullname`       VARCHAR(120) NOT NULL,
  `username`       VARCHAR(60)  NOT NULL,
  `email`          VARCHAR(120) NOT NULL,
  `password_hash`  VARCHAR(255) NOT NULL,
  `telefono`       VARCHAR(20)  DEFAULT NULL,
  `direccion`      VARCHAR(255) DEFAULT NULL,
  `ciudad`         VARCHAR(80)  DEFAULT NULL,
  `departamento`   VARCHAR(80)  DEFAULT NULL,
  `pais`           VARCHAR(80)  DEFAULT 'Bolivia',
  `avatar_url`     VARCHAR(300) DEFAULT NULL,
  `pwd_strength`   ENUM('debil','intermedio','fuerte') DEFAULT 'debil',
  `activo`         TINYINT(1)   NOT NULL DEFAULT 1,
  `eliminado`      TINYINT(1)   NOT NULL DEFAULT 0,
  `verificado`     TINYINT(1)   NOT NULL DEFAULT 0,
  `ultimo_login`   DATETIME     DEFAULT NULL,
  `creado_en`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email`    (`email`),
  KEY `idx_user_role`      (`role_id`),
  KEY `idx_user_activo`    (`activo`,`eliminado`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: log_acceso
-- ──────────────────────────────────────────
CREATE TABLE `log_acceso` (
  `log_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED DEFAULT NULL,
  `username`   VARCHAR(60)  DEFAULT NULL,
  `ip_address` VARCHAR(45)  NOT NULL,
  `evento`     ENUM('ingreso','salida','intento_fallido','registro') NOT NULL,
  `browser`    VARCHAR(250) DEFAULT NULL,
  `sistema_op` VARCHAR(120) DEFAULT NULL,
  `fecha_hora` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_log_user`  (`user_id`),
  KEY `idx_log_fecha` (`fecha_hora`),
  KEY `idx_log_evento`(`evento`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: categorias  (eliminación lógica)
-- ──────────────────────────────────────────
CREATE TABLE `categorias` (
  `categoria_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`       VARCHAR(100) NOT NULL,
  `descripcion`  VARCHAR(300) DEFAULT NULL,
  `slug`         VARCHAR(120) NOT NULL,
  `imagen_url`   VARCHAR(300) DEFAULT NULL,
  `orden`        INT UNSIGNED DEFAULT 0,
  `activo`       TINYINT(1)   NOT NULL DEFAULT 1,
  `eliminado`    TINYINT(1)   NOT NULL DEFAULT 0,
  `creado_en`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoria_id`),
  UNIQUE KEY `uk_cat_nombre` (`nombre`),
  UNIQUE KEY `uk_cat_slug`   (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categorias` (`nombre`,`descripcion`,`slug`,`orden`) VALUES
  ('Hombre',     'Ropa masculina premium',          'hombre',     1),
  ('Mujer',      'Moda femenina exclusiva',          'mujer',      2),
  ('Unisex',     'Prendas para todos',               'unisex',     3),
  ('Accesorios', 'Complementos y accesorios',        'accesorios', 4),
  ('Colecciones','Ediciones limitadas de temporada', 'colecciones',5);

-- ──────────────────────────────────────────
-- TABLA: colecciones  (eliminación lógica)
-- ──────────────────────────────────────────
CREATE TABLE `colecciones` (
  `coleccion_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`       VARCHAR(120) NOT NULL,
  `temporada`    VARCHAR(20)  NOT NULL,
  `descripcion`  TEXT         DEFAULT NULL,
  `imagen_url`   VARCHAR(300) DEFAULT NULL,
  `activo`       TINYINT(1)   NOT NULL DEFAULT 1,
  `eliminado`    TINYINT(1)   NOT NULL DEFAULT 0,
  `fecha_inicio` DATE         DEFAULT NULL,
  `fecha_fin`    DATE         DEFAULT NULL,
  `creado_en`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`coleccion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `colecciones` (`nombre`,`temporada`,`descripcion`) VALUES
  ('Noir Urbain',       'SS26','La ciudad de noche como lienzo. Negros profundos y cortes precisos.'),
  ('Creme de la Creme', 'SS26','Tonos crema, texturas suaves y siluetas que susurran elegancia.'),
  ('Dorado Salvaje',    'AW25','Piezas que brillan en cada habitacion. Lujo como actitud.'),
  ('Minimalista Feroz', 'AW25','Menos es mas — cada prenda disenada para impactar.'),
  ('Urban Edge',        'SS25','Streetwear de alta costura. La calle como pasarela.'),
  ('Velvet Society',    'SS25','Terciopelos, satines y tejidos nobles de temporada.');

-- ──────────────────────────────────────────
-- TABLA: tallas
-- ──────────────────────────────────────────
CREATE TABLE `tallas` (
  `talla_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`   VARCHAR(10)  NOT NULL,
  `orden`    INT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`talla_id`),
  UNIQUE KEY `uk_talla` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tallas` (`nombre`,`orden`) VALUES
  ('XS',1),('S',2),('M',3),('L',4),('XL',5),('XXL',6),
  ('28',7),('30',8),('32',9),('34',10),('36',11);

-- ──────────────────────────────────────────
-- TABLA: colores
-- ──────────────────────────────────────────
CREATE TABLE `colores` (
  `color_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`   VARCHAR(50)  NOT NULL,
  `hex_code` VARCHAR(7)   DEFAULT NULL,
  PRIMARY KEY (`color_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `colores` (`nombre`,`hex_code`) VALUES
  ('Negro','#0a0a0a'),('Blanco','#ffffff'),('Crema','#f5f0e8'),
  ('Dorado','#c9a84c'),('Gris','#888888'),('Azul marino','#1a2a4a'),
  ('Rojo','#b03030'),('Verde oliva','#5a6a3a');

-- ──────────────────────────────────────────
-- TABLA: productos  (eliminación lógica)
-- ──────────────────────────────────────────
CREATE TABLE `productos` (
  `product_id`       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `categoria_id`     INT UNSIGNED  NOT NULL,
  `coleccion_id`     INT UNSIGNED  DEFAULT NULL,
  `nombre`           VARCHAR(200)  NOT NULL,
  `descripcion`      TEXT          DEFAULT NULL,
  `descripcion_corta` VARCHAR(300) DEFAULT NULL,
  `precio`           DECIMAL(10,2) NOT NULL,
  `precio_oferta`    DECIMAL(10,2) DEFAULT NULL,
  `sku`              VARCHAR(50)   DEFAULT NULL,
  `imagen_url`       VARCHAR(300)  DEFAULT NULL,
  `material`         VARCHAR(200)  DEFAULT NULL,
  `genero`           ENUM('hombre','mujer','unisex') DEFAULT 'unisex',
  `destacado`        TINYINT(1)    NOT NULL DEFAULT 0,
  `nuevo`            TINYINT(1)    NOT NULL DEFAULT 0,
  `activo`           TINYINT(1)    NOT NULL DEFAULT 1,
  `eliminado`        TINYINT(1)    NOT NULL DEFAULT 0,
  `creado_en`        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `uk_sku`        (`sku`),
  KEY `idx_prod_cat`         (`categoria_id`),
  KEY `idx_prod_col`         (`coleccion_id`),
  KEY `idx_prod_activo`      (`activo`,`eliminado`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`categoria_id`),
  CONSTRAINT `fk_prod_col` FOREIGN KEY (`coleccion_id`) REFERENCES `colecciones`(`coleccion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: inventario
-- ──────────────────────────────────────────
CREATE TABLE `inventario` (
  `inv_id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`    INT UNSIGNED NOT NULL,
  `talla_id`      INT UNSIGNED NOT NULL,
  `color_id`      INT UNSIGNED NOT NULL,
  `stock`         INT UNSIGNED NOT NULL DEFAULT 0,
  `stock_minimo`  INT UNSIGNED NOT NULL DEFAULT 5,
  `actualizado_en` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inv_id`),
  UNIQUE KEY `uk_inv`     (`product_id`,`talla_id`,`color_id`),
  KEY `idx_inv_stock`     (`stock`),
  CONSTRAINT `fk_inv_prod`  FOREIGN KEY (`product_id`) REFERENCES `productos`(`product_id`),
  CONSTRAINT `fk_inv_talla` FOREIGN KEY (`talla_id`)   REFERENCES `tallas`(`talla_id`),
  CONSTRAINT `fk_inv_color` FOREIGN KEY (`color_id`)   REFERENCES `colores`(`color_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: metodos_pago
-- ──────────────────────────────────────────
CREATE TABLE `metodos_pago` (
  `metodo_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(80)  NOT NULL,
  `codigo`      VARCHAR(30)  NOT NULL,
  `descripcion` VARCHAR(200) DEFAULT NULL,
  `activo`      TINYINT(1)   NOT NULL DEFAULT 1,
  `cargo_extra` DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (`metodo_id`),
  UNIQUE KEY `uk_metodo_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `metodos_pago` (`nombre`,`codigo`,`descripcion`,`cargo_extra`) VALUES
  ('Deposito bancario',       'deposito', 'Transferencia BCP/Tigo Money',        0.00),
  ('Tarjeta credito/debito',  'tarjeta',  'Pago seguro con Stripe',              0.00),
  ('Codigo QR',               'qr',       'Escanea y paga al instante',          0.00),
  ('Efectivo con adelanto',   'efectivo', '50% adelanto para confirmar pedido',  0.00);

-- ──────────────────────────────────────────
-- TABLA: tipos_entrega
-- ──────────────────────────────────────────
CREATE TABLE `tipos_entrega` (
  `entrega_id`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre`      VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(300) DEFAULT NULL,
  `precio`      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tiempo_est`  VARCHAR(80)  DEFAULT NULL,
  `activo`      TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`entrega_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tipos_entrega` (`nombre`,`descripcion`,`precio`,`tiempo_est`) VALUES
  ('Recojo gratuito',  'Punto: Teleferico morado / El Prado La Paz', 0.00, '2-3 dias'),
  ('Entrega estandar', 'Entrega a domicilio en La Paz',              15.00,'3-5 dias'),
  ('Express PLUS',     'Prioridad maxima — 24h con seguimiento',     35.00,'24 horas');

-- ──────────────────────────────────────────
-- TABLA: ordenes  (eliminación lógica)
-- ──────────────────────────────────────────
CREATE TABLE `ordenes` (
  `order_id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`          INT UNSIGNED  NOT NULL,
  `metodo_pago_id`   INT UNSIGNED  NOT NULL,
  `entrega_id`       INT UNSIGNED  NOT NULL,
  `estado`           ENUM('pendiente','pagado','procesando','enviado','entregado','cancelado','devuelto') NOT NULL DEFAULT 'pendiente',
  `subtotal`         DECIMAL(10,2) NOT NULL,
  `cargo_entrega`    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `descuento`        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total`            DECIMAL(10,2) NOT NULL,
  `moneda`           VARCHAR(5)    NOT NULL DEFAULT 'BOB',
  `nombre_receptor`  VARCHAR(120)  DEFAULT NULL,
  `telefono_entrega` VARCHAR(20)   DEFAULT NULL,
  `direccion_entrega` VARCHAR(255) DEFAULT NULL,
  `ciudad_entrega`   VARCHAR(80)   DEFAULT NULL,
  `punto_recojo`     VARCHAR(200)  DEFAULT NULL,
  `notas`            TEXT          DEFAULT NULL,
  `pago_referencia`  VARCHAR(200)  DEFAULT NULL,
  `pago_estado`      ENUM('pendiente','verificando','aprobado','rechazado') DEFAULT 'pendiente',
  `adelanto_pagado`  DECIMAL(10,2) DEFAULT 0.00,
  `ip_compra`        VARCHAR(45)   DEFAULT NULL,
  `eliminado`        TINYINT(1)    NOT NULL DEFAULT 0,
  `creado_en`        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `idx_ord_user`   (`user_id`),
  KEY `idx_ord_estado` (`estado`),
  KEY `idx_ord_fecha`  (`creado_en`),
  CONSTRAINT `fk_ord_user`   FOREIGN KEY (`user_id`)        REFERENCES `usuarios`(`user_id`),
  CONSTRAINT `fk_ord_pago`   FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago`(`metodo_id`),
  CONSTRAINT `fk_ord_entrega`FOREIGN KEY (`entrega_id`)     REFERENCES `tipos_entrega`(`entrega_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: orden_items
-- ──────────────────────────────────────────
CREATE TABLE `orden_items` (
  `item_id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `order_id`        INT UNSIGNED  NOT NULL,
  `product_id`      INT UNSIGNED  NOT NULL,
  `talla_id`        INT UNSIGNED  DEFAULT NULL,
  `color_id`        INT UNSIGNED  DEFAULT NULL,
  `nombre_snapshot` VARCHAR(200)  NOT NULL,
  `imagen_url`      VARCHAR(300)  DEFAULT NULL,
  `precio_unit`     DECIMAL(10,2) NOT NULL,
  `cantidad`        INT UNSIGNED  NOT NULL DEFAULT 1,
  `subtotal`        DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `idx_item_order`  (`order_id`),
  KEY `idx_item_prod`   (`product_id`),
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`)   REFERENCES `ordenes`(`order_id`),
  CONSTRAINT `fk_item_prod`  FOREIGN KEY (`product_id`) REFERENCES `productos`(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: carrito + carrito_items
-- ──────────────────────────────────────────
CREATE TABLE `carrito` (
  `cart_id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`        INT UNSIGNED NOT NULL,
  `creado_en`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `uk_cart_user` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `carrito_items` (
  `ci_id`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_id`     INT UNSIGNED NOT NULL,
  `product_id`  INT UNSIGNED NOT NULL,
  `talla_id`    INT UNSIGNED DEFAULT NULL,
  `color_id`    INT UNSIGNED DEFAULT NULL,
  `cantidad`    INT UNSIGNED NOT NULL DEFAULT 1,
  `agregado_en` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ci_id`),
  UNIQUE KEY `uk_ci` (`cart_id`,`product_id`,`talla_id`,`color_id`),
  CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`)    REFERENCES `carrito`(`cart_id`),
  CONSTRAINT `fk_ci_prod` FOREIGN KEY (`product_id`) REFERENCES `productos`(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- TABLA: cupones  (eliminación lógica)
-- ──────────────────────────────────────────
CREATE TABLE `cupones` (
  `cupon_id`       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `codigo`         VARCHAR(30)   NOT NULL,
  `tipo`           ENUM('porcentaje','monto_fijo') NOT NULL,
  `valor`          DECIMAL(10,2) NOT NULL,
  `uso_maximo`     INT UNSIGNED  DEFAULT NULL,
  `usos_actuales`  INT UNSIGNED  NOT NULL DEFAULT 0,
  `monto_minimo`   DECIMAL(10,2) DEFAULT 0.00,
  `fecha_fin`      DATE          DEFAULT NULL,
  `activo`         TINYINT(1)    NOT NULL DEFAULT 1,
  `eliminado`      TINYINT(1)    NOT NULL DEFAULT 0,
  `creado_en`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cupon_id`),
  UNIQUE KEY `uk_cupon_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `cupones` (`codigo`,`tipo`,`valor`,`uso_maximo`,`monto_minimo`) VALUES
  ('DENYM10',    'porcentaje', 10.00, 100, 100.00),
  ('BIENVENIDO', 'porcentaje', 15.00,   1,  50.00),
  ('VIP2026',    'monto_fijo', 30.00,  50, 200.00);

-- ──────────────────────────────────────────
-- TABLA: newsletter
-- ──────────────────────────────────────────
CREATE TABLE `newsletter` (
  `nl_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`     VARCHAR(120) NOT NULL,
  `activo`    TINYINT(1)   NOT NULL DEFAULT 1,
  `creado_en` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nl_id`),
  UNIQUE KEY `uk_nl_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────
-- VISTAS
-- ──────────────────────────────────────────
CREATE OR REPLACE VIEW `v_productos` AS
SELECT
  p.product_id, p.nombre, p.descripcion_corta, p.descripcion,
  p.precio, p.precio_oferta, p.imagen_url, p.material,
  p.genero, p.destacado, p.nuevo, p.sku,
  c.nombre   AS categoria, c.slug AS cat_slug, c.categoria_id,
  col.nombre AS coleccion, col.temporada, col.coleccion_id,
  COALESCE(SUM(i.stock), 0) AS stock_total
FROM `productos` p
LEFT JOIN `categorias`  c   ON p.categoria_id = c.categoria_id
LEFT JOIN `colecciones` col ON p.coleccion_id = col.coleccion_id
LEFT JOIN `inventario`  i   ON p.product_id   = i.product_id
WHERE p.eliminado = 0 AND p.activo = 1
GROUP BY p.product_id;

CREATE OR REPLACE VIEW `v_ventas_resumen` AS
SELECT
  DATE(o.creado_en)              AS fecha,
  COUNT(o.order_id)              AS total_ordenes,
  COALESCE(SUM(o.total), 0)     AS ingresos,
  COALESCE(AVG(o.total), 0)     AS ticket_promedio,
  COUNT(DISTINCT o.user_id)     AS clientes_unicos
FROM `ordenes` o
WHERE o.eliminado = 0 AND o.estado != 'cancelado'
GROUP BY DATE(o.creado_en)
ORDER BY fecha DESC;

CREATE OR REPLACE VIEW `v_stock_bajo` AS
SELECT
  p.product_id, p.nombre AS producto, p.sku,
  t.nombre AS talla, c.nombre AS color,
  i.stock, i.stock_minimo,
  (i.stock_minimo - i.stock) AS faltante
FROM `inventario` i
JOIN `productos` p ON i.product_id = p.product_id
JOIN `tallas`    t ON i.talla_id   = t.talla_id
JOIN `colores`   c ON i.color_id   = c.color_id
WHERE i.stock <= i.stock_minimo AND p.eliminado = 0 AND p.activo = 1
ORDER BY faltante DESC;

CREATE OR REPLACE VIEW `v_log_acceso` AS
SELECT
  l.log_id, l.ip_address, l.evento, l.browser,
  l.sistema_op, l.fecha_hora,
  l.username    AS log_username,
  u.fullname, u.email,
  r.nombre      AS rol
FROM `log_acceso` l
LEFT JOIN `usuarios` u ON l.user_id  = u.user_id
LEFT JOIN `roles`    r ON u.role_id  = r.role_id
ORDER BY l.fecha_hora DESC;

-- ──────────────────────────────────────────
-- DATOS SEMILLA — Productos
-- ──────────────────────────────────────────
INSERT INTO `productos`
  (`categoria_id`,`coleccion_id`,`nombre`,`descripcion_corta`,`descripcion`,`precio`,`material`,`genero`,`destacado`,`nuevo`,`sku`,`imagen_url`)
VALUES
(1,1,'Chaqueta Denim Oversize','Corte amplio, lavado profundo. Icono de la temporada.','Una chaqueta denim de corte amplio con detalles de alta costura. Tela 14oz, costuras reforzadas y acabado premium que la convierte en pieza central de cualquier look.',320.00,'Algodon denim 14oz','hombre',1,1,'CDO-001','https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600'),
(2,2,'Vestido Corte Elegante','Silueta fluida, caida perfecta.','Vestido en seda sintetica premium con lineas limpias. El corte se adapta a toda silueta con elegancia natural y fluidez impecable.',280.00,'Seda sintetica premium','mujer',1,1,'VCE-001','https://images.unsplash.com/photo-1495121605193-b116b5b09a6e?w=600'),
(1,1,'Jeans Premium Black','Denim negro selecto, corte slim.','Jeans en denim negro de alta calidad. Corte slim que combina confort y estilo urbano sin sacrificar elegancia. El basico que no es basico.',240.00,'Denim stretch 98% algodon 2% elastano','hombre',0,0,'JPB-001','https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600'),
(2,2,'Top Crop Cream','Crop top en tono crema, tejido suave.','Crop top en jersey modal premium. Tono crema que combina con todo, perfecto para cualquier ocasion. Minimalismo en su estado mas puro.',190.00,'Jersey modal 100%','mujer',0,1,'TCC-001','https://images.unsplash.com/photo-1520974735194-5f33d4f8b4c0?w=600'),
(3,3,'Blazer Estructurado','Blazer unisex de corte italiano.','Blazer de corte italiano con estructura perfecta. Combina elegancia formal con actitud urbana contemporanea. Pieza que define el guardarropa.',420.00,'Lana 70% Poliester 30%','unisex',1,1,'BES-001','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600'),
(2,4,'Falda Midi Satinada','Satin de alto brillo, longitud midi.','Falda midi en saten de alto brillo con movimiento perfecto. Longitud midi que estiliza la figura con elegancia para cada momento especial.',210.00,'Saten de poliester premium','mujer',0,0,'FMS-001','https://images.unsplash.com/photo-1551854304-8b40a4e89dca?w=600'),
(1,5,'Camisa Lino Slim','Lino de primera calidad, corte slim.','Camisa en lino 100% de primera calidad. Frescura natural con estilo refinado para el hombre moderno que no sacrifica el confort.',195.00,'Lino 100%','hombre',0,1,'CLS-001','https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=600'),
(3,6,'Conjunto Loungewear','Dos piezas en tejido premium.','Conjunto de dos piezas en algodon frances premium. Comodidad sin sacrificar el estilo. Perfecto para el dia a dia con actitud.',360.00,'Algodon frances premium','unisex',1,0,'CLW-001','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600');

-- Inventario semilla
INSERT INTO `inventario` (`product_id`,`talla_id`,`color_id`,`stock`,`stock_minimo`) VALUES
(1,2,1,15,3),(1,3,1,20,5),(1,4,1,18,5),(1,5,1,10,3),
(2,2,3,12,3),(2,3,3,18,5),(2,4,3,14,5),
(3,7,1,25,5),(3,8,1,30,5),(3,9,1,20,5),
(4,2,3,22,5),(4,3,3,28,5),(4,4,3,16,3),
(5,2,1,8,2),(5,3,1,12,3),(5,4,1,10,3),
(6,2,4,14,3),(6,3,4,18,5),(6,4,4,12,3),
(7,3,1,20,5),(7,4,1,25,5),(7,5,1,15,3),
(8,2,3,10,2),(8,3,3,15,3),(8,4,3,10,2);

-- ADMIN por defecto — actualizar con hash real antes de producción
-- Email: mjkazama01@gmail.com | password: Admin@2026!
INSERT INTO `usuarios`
  (`role_id`,`fullname`,`username`,`email`,`password_hash`,`pwd_strength`,`activo`,`verificado`)
VALUES
  (1,'Marcelo Villalobos','marcelo_admin','mjkazama01@gmail.com',
   '$2b$12$eK8jWpMzHN2.wQ7Qk3L5PeCMixR4.t5FGJuP1Wn.DqRYBCfzlNjby',
   'fuerte',1,1);

SET FOREIGN_KEY_CHECKS = 1;
SELECT 'DenymStyle BD instalada correctamente' AS resultado,
       NOW() AS fecha_instalacion;

INSERT INTO `usuarios`
  (`role_id`,`fullname`,`username`,`email`,`password_hash`,`telefono`,`direccion`,`ciudad`,`departamento`,`pais`,`pwd_strength`,`activo`,`verificado`,`ultimo_login`) VALUES
  (2,'Daniela Quispe Mamani','daniela_vende','daniela.quispe@denymstyle.com','$2b$12$kT9mWqOxPN3.rS8Rl4M6QfDNjyS5.u6GHKvQ2Xo.ErSZCDgzmOkcz','71234567','Av. Arce 2456','La Paz','La Paz','Bolivia','fuerte',1,1,'2026-06-15 09:20:00'),
  (3,'Carlos Mendoza Flores','carlos_mendoza','carlos.mendoza@gmail.com','$2b$12$lU0nXrPyQO4.tT9Sm5N7RgEOkzT6.v7HILwR3Yp.FsTACEhanPldz','72345678','Calle Murillo 134','La Paz','La Paz','Bolivia','intermedio',1,1,'2026-06-16 18:45:00'),
  (3,'Valeria Soto Choque','valeria_soto','valeria.soto@hotmail.com','$2b$12$mV1oYsQzRP5.uU0Tn6O8ShFPlAU7.w8JIMxS4Zq.GtUBDFibpQmez','73456789','Zona Sopocachi, calle 21','La Paz','La Paz','Bolivia','fuerte',1,1,'2026-06-17 12:10:00'),
  (3,'Jorge Luis Apaza','jorge_apaza','jorge.apaza@outlook.com','$2b$12$nW2pZtRzSQ6.vV1Uo7P9TiGQmBV8.x9KNyT5ar.HuVCEGjcqRnfaA','74567890','Villa Fatima, calle 4','La Paz','La Paz','Bolivia','debil',1,0,NULL),
  (3,'Fernanda Rios Vargas','fernanda_rios','fernanda.rios@gmail.com','$2b$12$oX3qauSaTR7.wW2Vp8Q0UjHRnCW9.y0LOzU6bs.IvWDFHkdrSogbB','75678901','Av. Ballivian 890','La Paz','La Paz','Bolivia','intermedio',1,1,'2026-06-14 21:30:00'),
  (3,'Mauricio Gutierrez','mauricio_g','mauricio.gutierrez@yahoo.com','$2b$12$pY4rbvTbUS8.xX3Wq9R1VkISoDX0.z1MPaV7ct.JwXEGIlespThcC','76789012','El Alto, Ceja zona 16 de Julio','El Alto','La Paz','Bolivia','debil',1,1,'2026-06-10 08:00:00'),
  (3,'Camila Torrez Lima','camila_torrez','camila.torrez@gmail.com','$2b$12$qZ5scwUcVT9.yY4Xr0S2WlJTpEY1.a2NQbW8du.KxYFHJmftUidD','77890123','Calacoto, calle 15','La Paz','La Paz','Bolivia','fuerte',1,1,'2026-06-17 16:00:00'),
  (3,'Ricardo Paz Choque','ricardo_paz','ricardo.paz@gmail.com','$2b$12$rA6tdxVdWU0.zZ5Ys1T3XmKUqFZ2.b3ORcX9ev.LyZGIKnguVjeE','78901234','Achumani, calle 12','La Paz','La Paz','Bolivia','intermedio',1,0,NULL),
  (3,'Andrea Mamani Quispe','andrea_mamani','andrea.mamani@hotmail.com','$2b$12$sB7uezWeXV1.a06Zt2U4YnLVrGA3.c4PSdY0fw.MzAHJLohwWkfF','79012345','San Miguel, calle 8','La Paz','La Paz','Bolivia','fuerte',1,1,'2026-06-16 10:15:00'),
  (3,'Esteban Choque Rojas','esteban_choque','esteban.choque@gmail.com','$2b$12$tC8vfaXfYW2.b17au3V5ZoMWsHB4.d5QTeZ1gx.NaBIKMpixXlgG','70123456','Miraflores, calle 22','La Paz','La Paz','Bolivia','debil',0,1,'2026-05-20 14:00:00'),
  (3,'Lucia Fernandez Apaza','lucia_fernandez','lucia.fernandez@gmail.com','$2b$12$uD9wgbYgZX3.c28bv4W6ApNXtIC5.e6RUfa2hy.ObCJLNqjyYmhH','71112233','Sopocachi, Av. 6 de Agosto','La Paz','La Paz','Bolivia','intermedio',1,1,'2026-06-18 07:40:00');

-- ──────────────────────────────────────────
-- MÁS PRODUCTOS NUEVOS (product_id continúa desde 9)
-- ──────────────────────────────────────────
INSERT INTO `productos`
  (`categoria_id`,`coleccion_id`,`nombre`,`descripcion_corta`,`descripcion`,`precio`,`precio_oferta`,`sku`,`imagen_url`,`material`,`genero`,`destacado`,`nuevo`,`activo`) VALUES
  (1,3,'Abrigo Lana Dorado','Abrigo largo con detalles dorados.','Abrigo de lana premium con botonadura dorada. Silueta recta y caida impecable para el invierno paceño con actitud de lujo.',480.00,420.00,'ALD-001','https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600','Lana 80% Poliester 20%','hombre',1,1,1),
  (2,3,'Vestido Satinado Dorado','Brillo sutil, corte recto.','Vestido en satin con hilos dorados entrelazados. Pieza statement para eventos donde el lujo discreto es protagonista.',390.00,NULL,'VSD-001','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600','Saten con hilo metalico','mujer',1,0,1),
  (4,NULL,'Cinturon Cuero Negro','Cuero genuino, hebilla metalica.','Cinturon en cuero genuino curtido artesanalmente. Hebilla metalica con acabado mate, el accesorio que completa cualquier look.',150.00,NULL,'CCN-001','https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600','Cuero genuino','unisex',0,0,1),
  (4,NULL,'Gorra Bordada Denym','Bordado frontal, ajuste snapback.','Gorra snapback con bordado de la marca en frente. Ajuste regulable y estilo urbano para cualquier outfit casual.',95.00,80.00,'GBD-001','https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600','Algodon twill','unisex',0,1,1),
  (1,5,'Pantalon Cargo Slim','Bolsillos funcionales, corte slim.','Pantalon cargo con corte slim moderno. Multiples bolsillos funcionales sin perder la silueta ajustada y el estilo urbano.',260.00,NULL,'PCS-001','https://images.unsplash.com/photo-1542272604-787c3835535d?w=600','Algodon ripstop','hombre',0,1,1),
  (2,4,'Blusa Seda Manga Larga','Caida fluida, cuello en V.','Blusa en seda sintetica con cuello en V y mangas largas. Elegancia minimalista para la oficina o una salida nocturna.',230.00,NULL,'BSM-001','https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600','Seda sintetica','mujer',0,0,1),
  (3,6,'Sueter Cuello Alto','Punto grueso, cuello alto comodo.','Sueter de punto grueso con cuello alto. Calidez y estilo en una sola pieza versatil para el clima frio de la ciudad.',220.00,190.00,'SCA-001','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600','Lana merino mezcla','unisex',1,0,1),
  (4,NULL,'Lentes de Sol Aviador','Marco metalico, lente polarizado.','Lentes de sol estilo aviador con marco metalico dorado y lente polarizado. Proteccion UV con actitud retro contemporanea.',180.00,NULL,'LSA-001','https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600','Metal y policarbonato','unisex',0,1,1),
  (1,NULL,'Camiseta Basica Premium','Algodon pima, corte regular.','Camiseta basica en algodon pima de la mas alta calidad. El basico esencial que nunca falta en un guardarropa bien curado.',95.00,NULL,'CBP-001','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600','Algodon pima 100%','hombre',0,0,1),
  (2,NULL,'Pantalon Palazzo Crema','Fluido, cintura alta.','Pantalon palazzo de pierna ancha en tono crema. Cintura alta y caida fluida que estiliza la figura con comodidad total.',210.00,NULL,'PPC-001','https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600','Viscosa premium','mujer',0,1,1),
  (3,5,'Chamarra Bomber Urbana','Estilo bomber, puños elasticos.','Chamarra bomber con puños y cuello elasticos. Inspirada en el streetwear de alta costura para un look urbano con actitud.',340.00,295.00,'CBU-001','https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600','Poliester technical','unisex',1,1,1);

-- ──────────────────────────────────────────
-- INVENTARIO para productos nuevos (9 al 19) y refuerzo de los originales
-- ──────────────────────────────────────────
INSERT INTO `inventario` (`product_id`,`talla_id`,`color_id`,`stock`,`stock_minimo`) VALUES
(9,8,1,12,3),(9,9,1,16,3),(9,10,1,9,2),
(10,2,4,10,3),(10,3,4,14,3),(10,4,4,8,2),
(11,1,1,30,8),
(12,1,1,40,10),(12,1,2,18,5),
(13,7,5,20,5),(13,8,5,18,5),(13,9,5,12,3),
(14,2,3,16,3),(14,3,3,20,5),
(15,2,5,14,3),(15,3,5,18,5),(15,4,5,10,3),
(16,1,4,15,3),
(17,2,1,25,5),(17,3,1,30,5),(17,4,1,22,5),
(18,2,3,12,3),(18,3,3,16,3),(18,4,3,10,2),
(19,2,1,8,2),(19,3,1,12,3),(19,4,1,6,2);

-- ──────────────────────────────────────────
-- MÁS ÓRDENES (variedad de estados) — order_id continúa desde 1
-- user_id 2..12 son clientes nuevos (2=vendedor, 3..12=clientes); 1=admin
-- ──────────────────────────────────────────
INSERT INTO `ordenes`
  (`user_id`,`metodo_pago_id`,`entrega_id`,`estado`,`subtotal`,`cargo_entrega`,`descuento`,`total`,`moneda`,`nombre_receptor`,`telefono_entrega`,`direccion_entrega`,`ciudad_entrega`,`pago_estado`,`adelanto_pagado`,`ip_compra`,`creado_en`) VALUES
  (3,2,2,'entregado',560.00,15.00,0.00,575.00,'BOB','Carlos Mendoza Flores','72345678','Calle Murillo 134','La Paz','aprobado',575.00,'190.129.5.21','2026-05-20 10:15:00'),
  (4,1,1,'entregado',280.00,0.00,28.00,252.00,'BOB','Valeria Soto Choque','73456789','Zona Sopocachi, calle 21','La Paz','aprobado',252.00,'190.129.5.45','2026-05-22 14:30:00'),
  (5,3,2,'enviado',420.00,15.00,0.00,435.00,'BOB','Jorge Luis Apaza','74567890','Villa Fatima, calle 4','La Paz','aprobado',435.00,'190.129.6.12','2026-06-01 09:00:00'),
  (6,2,3,'procesando',610.00,35.00,61.00,584.00,'BOB','Fernanda Rios Vargas','75678901','Av. Ballivian 890','La Paz','aprobado',584.00,'190.129.6.88','2026-06-05 16:45:00'),
  (7,4,2,'pendiente',360.00,15.00,0.00,375.00,'BOB','Mauricio Gutierrez','76789012','El Alto, Ceja zona 16 de Julio','El Alto','verificando',187.50,'190.129.7.30','2026-06-10 11:20:00'),
  (8,1,1,'pagado',195.00,0.00,0.00,195.00,'BOB','Camila Torrez Lima','77890123','Calacoto, calle 15','La Paz','aprobado',195.00,'190.129.7.55','2026-06-11 08:10:00'),
  (9,2,2,'enviado',480.00,15.00,72.00,423.00,'BOB','Ricardo Paz Choque','78901234','Achumani, calle 12','La Paz','aprobado',423.00,'190.129.8.02','2026-06-12 13:00:00'),
  (10,3,3,'entregado',390.00,35.00,0.00,425.00,'BOB','Andrea Mamani Quispe','79012345','San Miguel, calle 8','La Paz','aprobado',425.00,'190.129.8.40','2026-06-13 17:30:00'),
  (3,1,2,'cancelado',150.00,15.00,0.00,165.00,'BOB','Carlos Mendoza Flores','72345678','Calle Murillo 134','La Paz','rechazado',0.00,'190.129.5.21','2026-06-14 12:00:00'),
  (4,2,1,'devuelto',95.00,0.00,0.00,95.00,'BOB','Valeria Soto Choque','73456789','Zona Sopocachi, calle 21','La Paz','aprobado',95.00,'190.129.5.45','2026-06-15 10:00:00'),
  (12,4,2,'pendiente',220.00,15.00,0.00,235.00,'BOB','Lucia Fernandez Apaza','71112233','Sopocachi, Av. 6 de Agosto','La Paz','verificando',117.50,'190.129.9.10','2026-06-16 09:30:00'),
  (5,1,3,'pagado',340.00,35.00,34.00,341.00,'BOB','Jorge Luis Apaza','74567890','Villa Fatima, calle 4','La Paz','aprobado',341.00,'190.129.6.12','2026-06-17 15:00:00'),
  (6,3,2,'procesando',180.00,15.00,0.00,195.00,'BOB','Fernanda Rios Vargas','75678901','Av. Ballivian 890','La Paz','aprobado',195.00,'190.129.6.88','2026-06-18 08:45:00');

-- ──────────────────────────────────────────
-- ITEMS de cada orden nueva (order_id 1..13, según el orden de inserción arriba)
-- ──────────────────────────────────────────
INSERT INTO `orden_items` (`order_id`,`product_id`,`talla_id`,`color_id`,`nombre_snapshot`,`imagen_url`,`precio_unit`,`cantidad`,`subtotal`) VALUES
(1,1,3,1,'Chaqueta Denim Oversize','https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600',320.00,1,320.00),
(1,9,9,1,'Abrigo Lana Dorado','https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600',240.00,1,240.00),
(2,2,3,3,'Vestido Corte Elegante','https://images.unsplash.com/photo-1495121605193-b116b5b09a6e?w=600',280.00,1,280.00),
(3,5,8,1,'Blazer Estructurado','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',420.00,1,420.00),
(4,8,3,3,'Conjunto Loungewear','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',360.00,1,360.00),
(4,12,1,1,'Cinturon Cuero Negro','https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600',150.00,1,150.00),
(4,13,1,1,'Gorra Bordada Denym','https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600',100.00,1,100.00),
(5,8,2,3,'Conjunto Loungewear','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',360.00,1,360.00),
(6,7,3,1,'Camisa Lino Slim','https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=600',195.00,1,195.00),
(7,9,8,1,'Abrigo Lana Dorado','https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600',420.00,1,420.00),
(7,16,1,4,'Lentes de Sol Aviador','https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',60.00,1,60.00),
(8,10,3,4,'Vestido Satinado Dorado','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600',390.00,1,390.00),
(9,7,4,1,'Camisa Lino Slim','https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=600',150.00,1,150.00),
(10,17,2,3,'Camiseta Basica Premium','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',95.00,1,95.00),
(11,15,2,5,'Sueter Cuello Alto','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',220.00,1,220.00),
(12,19,3,1,'Chamarra Bomber Urbana','https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',340.00,1,340.00),
(13,11,1,1,'Pantalon Cargo Slim','https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',180.00,1,180.00);

-- ──────────────────────────────────────────
-- CARRITO + CARRITO_ITEMS (sólo clientes con compras pendientes/abandonadas)
-- ──────────────────────────────────────────
INSERT INTO `carrito` (`user_id`) VALUES
  (6),(7),(11),(12);

INSERT INTO `carrito_items` (`cart_id`,`product_id`,`talla_id`,`color_id`,`cantidad`) VALUES
  (1,14,2,3,1),
  (1,16,1,4,2),
  (2,9,9,1,1),
  (3,2,3,3,1),
  (3,18,3,3,2),
  (4,19,3,1,1);

-- ──────────────────────────────────────────
-- ACTUALIZAR usos de cupones (reflejar canjes en órdenes con descuento)
-- ──────────────────────────────────────────
UPDATE `cupones` SET `usos_actuales` = 1 WHERE `codigo` = 'DENYM10';
UPDATE `cupones` SET `usos_actuales` = 1 WHERE `codigo` = 'BIENVENIDO';
UPDATE `cupones` SET `usos_actuales` = 1 WHERE `codigo` = 'VIP2026';

-- ──────────────────────────────────────────
-- LOG DE ACCESO (ingresos, salidas, intentos fallidos, registros)
-- ──────────────────────────────────────────
INSERT INTO `log_acceso` (`user_id`,`username`,`ip_address`,`evento`,`browser`,`sistema_op`,`fecha_hora`) VALUES
  (1,'marcelo_admin','190.129.1.10','ingreso','Chrome 125 / Windows','Windows 11','2026-06-18 07:00:00'),
  (2,'daniela_vende','190.129.2.20','ingreso','Firefox 126 / Android','Android 14','2026-06-15 09:18:00'),
  (3,'carlos_mendoza','190.129.5.21','ingreso','Chrome 124 / Android','Android 13','2026-06-16 18:43:00'),
  (3,'carlos_mendoza','190.129.5.21','salida','Chrome 124 / Android','Android 13','2026-06-16 19:10:00'),
  (4,'valeria_soto','190.129.5.45','registro','Safari 17 / iOS','iOS 17','2026-05-19 20:00:00'),
  (4,'valeria_soto','190.129.5.45','ingreso','Safari 17 / iOS','iOS 17','2026-06-17 12:08:00'),
  (NULL,'jorge_apaza','190.129.6.12','intento_fallido','Chrome 125 / Windows','Windows 10','2026-06-14 22:00:00'),
  (5,'jorge_apaza','190.129.6.12','ingreso','Chrome 125 / Windows','Windows 10','2026-06-14 22:01:30'),
  (6,'fernanda_rios','190.129.6.88','ingreso','Edge 124 / Windows','Windows 11','2026-06-14 21:28:00'),
  (7,'mauricio_g','190.129.7.30','registro','Chrome 123 / Android','Android 12','2026-06-09 18:00:00'),
  (7,'mauricio_g','190.129.7.30','ingreso','Chrome 123 / Android','Android 12','2026-06-10 07:58:00'),
  (NULL,'ricardo_paz','190.129.8.02','intento_fallido','Firefox 125 / Linux','Ubuntu 24.04','2026-06-11 23:50:00'),
  (8,'ricardo_paz','190.129.8.02','ingreso','Firefox 125 / Linux','Ubuntu 24.04','2026-06-11 23:52:00'),
  (9,'andrea_mamani','190.129.8.40','ingreso','Safari 17 / macOS','macOS 14','2026-06-15 23:50:00'),
  (12,'lucia_fernandez','190.129.9.10','registro','Chrome 125 / Windows','Windows 11','2026-06-18 07:38:00'),
  (12,'lucia_fernandez','190.129.9.10','ingreso','Chrome 125 / Windows','Windows 11','2026-06-18 07:39:30');

-- ──────────────────────────────────────────
-- NEWSLETTER
-- ──────────────────────────────────────────
INSERT INTO `newsletter` (`email`,`activo`) VALUES
  ('carlos.mendoza@gmail.com',1),
  ('valeria.soto@hotmail.com',1),
  ('fernanda.rios@gmail.com',1),
  ('camila.torrez@gmail.com',1),
  ('andrea.mamani@hotmail.com',1),
  ('lucia.fernandez@gmail.com',1),
  ('promos.fan88@gmail.com',1),
  ('ya.no.quiero.spam@gmail.com',0),
  ('seguidor.moda@outlook.com',1),
  ('cliente.frecuente@gmail.com',1);

SET FOREIGN_KEY_CHECKS = 1;
SELECT 'Datos adicionales DenymStyle insertados correctamente' AS resultado,
       NOW() AS fecha_insercion;
