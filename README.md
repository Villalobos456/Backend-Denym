# DenymStyle — Documentación Completa v2.0

**Autor:** Marcelo Villalobos  
**Email:** mjkazama01@gmail.com  
**Instagram:** @gsus_villalobos | **TikTok:** @mbappe.png0 | **WhatsApp:** 69800542

---

##  Estructura del Proyecto

```
denymstyle/
├── backend/                   # Node.js + Express API
│   ├── config/db.js           # Conexión MySQL pool
│   ├── middleware/auth.js     # JWT + logger acceso
│   ├── routes/
│   │   ├── auth.js            # Login, registro, logout
│   │   ├── productos.js       # CRUD productos, categorías, órdenes
│   │   └── admin.js           # Stats, PDF, usuarios, logs
│   ├── server.js              # Servidor principal
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                  # React 18
│   └── src/
│       ├── pages/
│       │   ├── Principal.jsx  # Home con hero, catálogo, testimonios
│       │   ├── Login.jsx      # Login + CAPTCHA + dark/light
│       │   ├── Register.jsx   # Registro + fuerza contraseña
│       │   ├── Ventas.jsx     # Tienda con menú categorías
│       │   ├── Colecciones.jsx# Colecciones de temporada
│       │   ├── Carrito.jsx    # Carrito con suma/resta
│       │   ├── Checkout.jsx   # Pago + entrega en 3 pasos
│       │   ├── Admin.jsx      # Panel admin + gráficas + PDF
│       │   ├── ChatBot.jsx    # Demy IA (Anthropic Claude)
│       │   └── Nosotros.jsx   # Marcelo Villalobos + contacto
│       ├── components/Nav.jsx # Navbar responsive + dark/light
│       ├── index.css          # Variables CSS, componentes globales
│       └── App.jsx            # Rutas + guards
│
├── database/
│   └── denymstyle.sql         # BD completa normalizada 3FN
│
└── docker/
    ├── docker-compose.yml     # MySQL + Backend + Frontend
    └── kubernetes.yml         # K8s completo con Ingress
```

---

##  Instalación de la Base de Datos (XAMPP)

1. Abre **phpMyAdmin** en `http://localhost/phpmyadmin`
2. Ve a **Importar** → selecciona `database/denymstyle.sql`
3. Click en **Continuar**

**O por terminal:**
```bash
mysql -u root -p < database/denymstyle.sql
```

**Tablas creadas (13 en total):**
- `roles`, `usuarios`, `log_acceso`
- `categorias`, `colecciones`, `tallas`, `colores`
- `productos`, `inventario`
- `metodos_pago`, `tipos_entrega`
- `ordenes`, `orden_items`
- `carrito`, `carrito_items`
- `cupones`, `newsletter`

---

##  Backend — Instalación

```bash
cd backend
cp .env.example .env
npm install
npm run dev       
npm start         
```

**Variables de entorno (.env):**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=denymstyle
JWT_SECRET=tu_clave_secreta_aqui
ANTHROPIC_API_KEY=sk-ant-tu_clave
FRONTEND_URL=http://localhost:3000
```

---

##  Frontend — Instalación

```bash
cd frontend
npm install
npm start         
npm run build   
```

---

##  Docker

```bash
cd docker
docker-compose up -d          
docker-compose down           
docker-compose logs -f api   
```

---

##  Kubernetes

```bash
kubectl apply -f docker/kubernetes.yml
kubectl get pods -n denymstyle
kubectl get services -n denymstyle
kubectl scale deployment ds-api --replicas=3 -n denymstyle
```

---

##  Funcionalidades Implementadas

###  Requisitos del sistema

| # | Requisito | Implementación |
|---|-----------|----------------|
| 1 | CRUD con eliminación lógica | Productos, categorías, usuarios, órdenes → campo `eliminado=1` |
| 2 | Frontend React | React 18 + React Router v6 |
| 3 | Backend Node.js | Express + MySQL2 + JWT |
| 4 | Validaciones | express-validator en todos los endpoints |
| 5 | Reporte PDF | `/api/admin/pdf/ventas` + `/api/admin/pdf/inventario` |
| 6 | Gráfico estadístico | Recharts: LineChart, BarChart, PieChart en Admin |
| 7 | Autenticación + CAPTCHA | JWT + roles + CAPTCHA SVG con distorsión |
| 8 | Fuerza de contraseña | Débil/Intermedio/Fuerte + bcrypt (salt 12) |
| 9 | Log de acceso | Tabla `log_acceso`: usuario, IP, evento, browser, fecha |
| 10 | Docker | docker-compose.yml con MySQL+API+Web |
| 11 | Kubernetes | kubernetes.yml completo con Ingress + Secrets |
| 12 | Móvil | Diseño 100% responsive, CSS media queries |
| 13 | Agente inteligente | Demy — asistente IA con Claude (Anthropic API) |

###  Páginas

- **Principal** — Hero, ticker, features, catálogo, banner, testimonios, Instagram, newsletter
- **Ventas** — Menú categorías, colecciones pills, búsqueda, filtros, grid de productos
- **Carrito** — Suma/resta cantidad, eliminar, cupones, total en tiempo real
- **Checkout** — 3 pasos: entrega + pago (depósito/tarjeta/QR/efectivo) + confirmación
- **Admin** — Dashboard con gráficas, CRUD productos+categorías, órdenes, usuarios, logs, PDF
- **ChatBot** — Demy IA funcional con Claude + sugerencias rápidas
- **Nosotros** — Marcelo Villalobos, valores, timeline, redes sociales
- **Colecciones** — Grid con filtros por temporada
- **Login** — CAPTCHA SVG con distorsión, dark/light toggle
- **Register** — Two-block layout, barra de fuerza contraseña

---

##  Usuario Admin por defecto

```
Email:    mjkazama01@gmail.com
Password: Admin@2026!
```

>  Genera el hash real con: `node -e "const b=require('bcryptjs'); console.log(b.hashSync('Admin@2026!',12))"`  
> Luego actualiza en la BD: `UPDATE usuarios SET password_hash='...' WHERE username='marcelo_admin';`

---

##  Redes de contacto

| Red | Handle |
|-----|--------|
| Email | mjkazama01@gmail.com |
| Instagram | @gsus_villalobos |
| TikTok | @mbappe.png0 |
| WhatsApp | 69800542 |
