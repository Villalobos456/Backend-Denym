// src/components/Nav.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Sun, Moon, LogOut, Settings } from 'react-feather';

const navStyles = `
.nav-root{position:fixed;top:0;width:100%;z-index:100;background:rgba(10,10,10,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(201,168,76,.15);font-family:var(--fb);transition:background .3s;}
body.light-mode .nav-root{background:rgba(245,240,232,.94);}
.nav-root::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.7) 30%,rgba(226,194,120,1) 50%,rgba(201,168,76,.7) 70%,transparent);}
.nav-inner{max-width:1280px;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;gap:1rem;}
.nav-logo{font-family:var(--fd,'Cormorant Garamond',serif);font-size:1.5rem;font-weight:300;color:var(--cream,#f5f0e8);letter-spacing:.28em;text-transform:uppercase;text-decoration:none;transition:opacity .25s;}
.nav-logo:hover{opacity:.8;}
.nav-logo em{color:#c9a84c;font-style:italic;}
.nav-links{display:none;align-items:center;gap:2.5rem;list-style:none;margin:0;padding:0;}
@media(min-width:768px){.nav-links{display:flex;}}
.nav-link{font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted,#7a6e60);text-decoration:none;border-bottom:1px solid transparent;padding-bottom:2px;transition:color .25s,border-color .25s;}
.nav-link:hover,.nav-link.active{color:#c9a84c;border-bottom-color:rgba(201,168,76,.5);}
.nav-actions{display:flex;align-items:center;gap:1rem;}
.nav-icon-btn{background:none;border:none;color:var(--muted,#7a6e60);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;transition:color .25s;position:relative;text-decoration:none;}
.nav-icon-btn:hover{color:#c9a84c;}
.nav-cart-badge{position:absolute;top:-6px;right:-6px;background:#c9a84c;color:#0a0a0a;font-size:.58rem;font-weight:700;min-width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:0 3px;}
.nav-avatar{width:32px;height:32px;background:linear-gradient(135deg,#a07830,#c9a84c);display:flex;align-items:center;justify-content:center;color:#0a0a0a;font-size:.72rem;font-weight:700;font-family:var(--fb);border:none;cursor:pointer;}
.nav-dropdown{position:absolute;top:calc(100% + 8px);right:0;width:200px;background:var(--bg2,#111);border:1px solid rgba(201,168,76,.18);box-shadow:0 20px 60px rgba(0,0,0,.5);z-index:200;}
.nav-dropdown-item{display:flex;align-items:center;gap:8px;padding:.7rem 1rem;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#7a6e60);text-decoration:none;background:none;border:none;width:100%;cursor:pointer;transition:color .2s,background .2s;}
.nav-dropdown-item:hover{color:#c9a84c;background:rgba(201,168,76,.05);}
.nav-dropdown-item.danger{color:#c07060;}
.nav-dropdown-item.danger:hover{background:rgba(192,112,96,.06);}
.nav-user-wrap{position:relative;}
.nav-mob-btn{display:flex;background:none;border:none;color:var(--muted,#7a6e60);cursor:pointer;}
@media(min-width:768px){.nav-mob-btn{display:none;}}
.nav-mobile-menu{position:fixed;top:64px;left:0;right:0;background:rgba(10,10,10,.98);border-bottom:1px solid rgba(201,168,76,.15);padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem;backdrop-filter:blur(20px);z-index:99;animation:fadeUp .3s ease;}
body.light-mode .nav-mobile-menu{background:rgba(245,240,232,.98);}
.nav-mobile-link{font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--muted,#7a6e60);text-decoration:none;padding:.5rem 0;border-bottom:1px solid rgba(201,168,76,.08);transition:color .25s;}
.nav-mobile-link:hover{color:#c9a84c;}
`;

export default function Nav() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mob,  setMob]  = useState(false);
  const [drop, setDrop] = useState(false);
  const [cart, setCart] = useState(0);
  const [dark, setDark] = useState(localStorage.getItem('ds_theme') !== 'light');
  const dropRef = useRef();

  const user  = JSON.parse(localStorage.getItem('ds_user') || 'null');
  const token = localStorage.getItem('ds_token');

  // Update cart count on change
  useEffect(() => {
    const update = () => {
      const items = JSON.parse(localStorage.getItem('ds_cart') || '[]');
      setCart(items.reduce((s, i) => s + (i.quantity || 0), 0));
    };
    update();
    window.addEventListener('cartchange', update);
    window.addEventListener('storage', update);
    return () => { window.removeEventListener('cartchange', update); window.removeEventListener('storage', update); };
  }, []);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    setDark(!dark);
    localStorage.setItem('ds_theme', next);
    document.body.classList.toggle('light-mode', next === 'light');
    window.dispatchEvent(new Event('themechange'));
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ userId: user?.user_id, username: user?.username }) }).catch(() => {});
    localStorage.removeItem('ds_user');
    localStorage.removeItem('ds_token');
    setDrop(false);
    navigate('/');
    window.dispatchEvent(new Event('authchange'));
  };

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMob(false); setDrop(false); }, [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const LINKS = [
    { to: '/',            label: 'Inicio' },
    { to: '/ventas',      label: 'Tienda' },
    { to: '/colecciones', label: 'Colecciones' },
    { to: '/nosotros',    label: 'Nosotros' },
    { to: '/chat',        label: 'Asistente' },
  ];

  return (
    <>
      <style>{navStyles}</style>
      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">Denym<em>Style</em></Link>

          <ul className="nav-links">
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={`nav-link ${isActive(l.to)}`}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="nav-icon-btn" onClick={toggleTheme} title={dark ? 'Modo día' : 'Modo noche'}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/carrito" className="nav-icon-btn" style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {cart > 0 && <span className="nav-cart-badge">{cart}</span>}
            </Link>

            {!token ? (
              <>
                <Link to="/login"    style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}>Entrar</Link>
                <Link to="/registro" className="ds-btn" style={{ padding: '.5rem 1rem', fontSize: '.6rem' }}>Registrarse</Link>
              </>
            ) : (
              <div className="nav-user-wrap" ref={dropRef}>
                <button className="nav-avatar" onClick={() => setDrop(d => !d)}>
                  {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                </button>
                {drop && (
                  <div className="nav-dropdown">
                    <div style={{ padding: '.75rem 1rem', borderBottom: '1px solid rgba(201,168,76,.1)' }}>
                      <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', color: 'var(--cream)' }}>{user?.fullname}</p>
                      <p style={{ fontSize: '.6rem', color: '#c9a84c', letterSpacing: '.12em' }}>@{user?.username}</p>
                    </div>
                    <Link to="/carrito" className="nav-dropdown-item"><ShoppingBag size={13} /> Mi carrito</Link>
                    {['admin', 'vendedor'].includes(user?.role_name) && (
                      <Link to="/admin" className="nav-dropdown-item"><Settings size={13} /> Admin</Link>
                    )}
                    <div style={{ borderTop: '1px solid rgba(201,168,76,.1)' }}>
                      <button onClick={logout} className="nav-dropdown-item danger"><LogOut size={13} /> Cerrar sesión</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button className="nav-mob-btn nav-icon-btn" onClick={() => setMob(m => !m)}>
              {mob ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mob && (
        <div className="nav-mobile-menu">
          {LINKS.map(l => <Link key={l.to} to={l.to} className="nav-mobile-link">{l.label}</Link>)}
          {!token ? (
            <>
              <Link to="/login"    className="nav-mobile-link">Iniciar sesión</Link>
              <Link to="/registro" className="nav-mobile-link" style={{ color: '#c9a84c' }}>Crear cuenta</Link>
            </>
          ) : (
            <button onClick={logout} className="nav-mobile-link" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#c07060', fontSize: '.7rem', letterSpacing: '.25em', textTransform: 'uppercase', padding: '.5rem 0' }}>
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </>
  );
}
