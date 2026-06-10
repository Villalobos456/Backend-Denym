// src/pages/Ventas.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Search, Filter, ChevronDown, Heart, Star } from 'react-feather';
import toast from 'react-hot-toast';

const API = '/api';

const ventasStyles = `
.vt-root { background: var(--bg); min-height: 100vh; font-family: var(--fb); }
/* Hero compacto */
.vt-hero { padding: 5.5rem 1.5rem 2rem; text-align: center; position: relative; }
.vt-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 600px; height: 250px; background: radial-gradient(ellipse, rgba(201,168,76,.09) 0%, transparent 70%); pointer-events: none; }
.vt-hero-eyebrow { font-size: .58rem; letter-spacing: .38em; text-transform: uppercase; color: var(--gold); margin-bottom: .75rem; display: flex; align-items: center; justify-content: center; gap: 12px; }
.vt-hero-line { width: 36px; height: 1px; background: var(--gold-d); }
.vt-hero-title { font-family: var(--fd); font-size: clamp(2.2rem,5vw,4rem); font-weight: 300; color: var(--cream); letter-spacing: .06em; margin: 0 0 .5rem; }
.vt-hero-title em { color: var(--gold); font-style: italic; }

/* Menu categorías */
.vt-cat-menu { background: var(--bg2); border-top: 1px solid var(--border2); border-bottom: 1px solid var(--border2); padding: 0; position: sticky; top: 64px; z-index: 40; }
.vt-cat-inner { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; overflow-x: auto; gap: 0; }
.vt-cat-btn { font-family: var(--fb); font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; background: none; border: none; color: var(--muted); padding: .95rem 1.25rem; cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap; transition: color .25s, border-color .25s; }
.vt-cat-btn:hover { color: var(--gold); }
.vt-cat-btn.active { color: var(--gold); border-bottom-color: var(--gold); }

/* Colecciones strip */
.vt-col-strip { max-width: 1280px; margin: 1.5rem auto 0; padding: 0 1.5rem; display: flex; gap: .75rem; overflow-x: auto; }
.vt-col-pill { font-family: var(--fb); font-size: .58rem; letter-spacing: .18em; text-transform: uppercase; background: var(--bg2); border: 1px solid var(--border2); color: var(--muted); padding: .4rem .9rem; cursor: pointer; white-space: nowrap; transition: all .25s; }
.vt-col-pill:hover, .vt-col-pill.active { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,.06); }

/* Search + filters */
.vt-toolbar { max-width: 1280px; margin: 1.5rem auto 0; padding: 0 1.5rem; display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
.vt-search-wrap { flex: 1; min-width: 200px; display: flex; border: 1px solid var(--border); background: var(--bg2); }
.vt-search-icon { padding: 0 .75rem; color: var(--muted); display: flex; align-items: center; }
.vt-search-input { flex: 1; background: transparent; border: none; outline: none; color: var(--cream); font-family: var(--fb); font-size: .78rem; padding: .65rem 0; }
.vt-search-input::placeholder { color: var(--dim); }
.vt-filter-btn { font-family: var(--fb); font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; background: var(--bg2); border: 1px solid var(--border); color: var(--muted); padding: .65rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all .25s; }
.vt-filter-btn.active, .vt-filter-btn:hover { border-color: var(--gold); color: var(--gold); }

/* Grid */
.vt-grid-wrap { max-width: 1280px; margin: 2rem auto 4rem; padding: 0 1.5rem; }
.vt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }

/* Product card */
.vt-card { background: var(--bg2); border: 1px solid var(--border2); overflow: hidden; cursor: pointer; position: relative; transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition); animation: fadeUp .55s ease both; }
.vt-card:hover { border-color: rgba(201,168,76,.3); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,.45); }
.vt-card-img-wrap { height: 300px; overflow: hidden; position: relative; }
.vt-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.22,1,.36,1), filter .4s; filter: brightness(.85); }
.vt-card:hover .vt-card-img { transform: scale(1.07); filter: brightness(.95); }
.vt-card-badge { position: absolute; top: 12px; left: 12px; }
.vt-card-actions { position: absolute; inset: 0; background: rgba(10,10,10,.5); display: flex; align-items: center; justify-content: center; gap: .75rem; opacity: 0; transition: opacity .35s; }
.vt-card:hover .vt-card-actions { opacity: 1; }
.vt-card-action-btn { background: var(--bg2); border: 1px solid var(--border); color: var(--cream); padding: .6rem 1.1rem; font-family: var(--fb); font-size: .6rem; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .25s, color .25s; }
.vt-card-action-btn:hover, .vt-card-action-btn.primary { background: var(--gold); color: #0a0a0a; border-color: var(--gold); }
.vt-card-body { padding: 1rem 1rem 1.1rem; border-top: 1px solid var(--border2); display: flex; justify-content: space-between; align-items: flex-end; }
.vt-card-name { font-family: var(--fd); font-size: 1rem; color: var(--cream); letter-spacing: .03em; margin: 0 0 .2rem; line-height: 1.2; }
.vt-card-sub { font-size: .58rem; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); }
.vt-card-price { font-family: var(--fd); font-size: 1.05rem; color: var(--gold); white-space: nowrap; }
.vt-card-price-old { font-size: .65rem; color: var(--dim); text-decoration: line-through; }

/* Empty */
.vt-empty { text-align: center; padding: 4rem; color: var(--muted); }

/* Colecciones showcase */
.vt-collections { max-width: 1280px; margin: 0 auto 3rem; padding: 0 1.5rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1rem; }
.vt-col-card { position: relative; overflow: hidden; height: 220px; cursor: pointer; border: 1px solid var(--border2); }
.vt-col-bg { width: 100%; height: 100%; object-fit: cover; filter: brightness(.4); transition: transform .6s, filter .4s; }
.vt-col-card:hover .vt-col-bg { transform: scale(1.07); filter: brightness(.6); }
.vt-col-info { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.25rem; }
.vt-col-season { font-size: .55rem; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); margin-bottom: .3rem; }
.vt-col-name { font-family: var(--fd); font-size: 1.35rem; font-weight: 300; color: #f5f0e8; letter-spacing: .04em; }
`;

const GENEROS = [
  { key: '',        label: '✦ Todo' },
  { key: 'hombre',  label: '♂ Hombre' },
  { key: 'mujer',   label: '♀ Mujer' },
  { key: 'unisex',  label: '◈ Unisex' },
];

const COL_IMGS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
];

export default function Ventas() {
  const [productos,    setProductos]    = useState([]);
  const [categorias,   setCategorias]   = useState([]);
  const [colecciones,  setColecciones]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [catActive,    setCatActive]    = useState('');
  const [genActive,    setGenActive]    = useState('');
  const [colActive,    setColActive]    = useState('');
  const [search,       setSearch]       = useState('');
  const [destacado,    setDestacado]    = useState(false);
  const [showCol,      setShowCol]      = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (catActive)  params.categoria  = catActive;
      if (genActive)  params.genero     = genActive;
      if (colActive)  params.coleccion  = colActive;
      if (search)     params.search     = search;
      if (destacado)  params.destacado  = 1;

      const [pRes, cRes, colRes] = await Promise.all([
        axios.get(`${API}/productos`, { params }),
        axios.get(`${API}/categorias`),
        axios.get(`${API}/colecciones`),
      ]);
      setProductos(pRes.data.products || []);
      setCategorias(cRes.data || []);
      setColecciones(colRes.data || []);
    } catch {}
    setLoading(false);
  }, [catActive, genActive, colActive, search, destacado]);

  useEffect(() => { load(); }, [load]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('ds_cart') || '[]');
    const idx  = cart.findIndex(i => i.product_id === product.product_id);
    if (idx >= 0) { cart[idx].quantity += 1; cart[idx].subtotal = cart[idx].price * cart[idx].quantity; }
    else cart.push({ product_id: product.product_id, name: product.nombre, price: parseFloat(product.precio), image_url: product.imagen_url, quantity: 1, talla: null, color: null, subtotal: parseFloat(product.precio) });
    localStorage.setItem('ds_cart', JSON.stringify(cart));
    toast.success(`${product.nombre} agregado al carrito`, { className: 'ds-toast' });
    window.dispatchEvent(new Event('cartchange'));
  };

  return (
    <>
      <style>{ventasStyles}</style>
      <div className="vt-root">
        <div className="vt-hero">
          <div className="vt-hero-eyebrow"><span className="vt-hero-line"/>Temporada 2026<span className="vt-hero-line"/></div>
          <h1 className="vt-hero-title">Nuestra <em>Tienda</em></h1>
        </div>
        <nav className="vt-cat-menu">
          <div className="vt-cat-inner">
            {GENEROS.map(g => (
              <button key={g.key} className={`vt-cat-btn ${genActive===g.key?'active':''}`} onClick={()=>setGenActive(g.key)}>{g.label}</button>
            ))}
            <div style={{width:'1px',height:'20px',background:'var(--border2)',margin:'0 .5rem',flexShrink:0}}/>
            {categorias.map(c => (
              <button key={c.categoria_id} className={`vt-cat-btn ${catActive===c.slug?'active':''}`} onClick={()=>setCatActive(catActive===c.slug?'':c.slug)}>
                {c.nombre}
              </button>
            ))}
          </div>
        </nav>
        <div className="vt-col-strip" style={{marginTop:'1rem'}}>
          <button className={`vt-col-pill ${!colActive?'active':''}`} onClick={()=>setColActive('')}>Todas</button>
          {colecciones.map(c=>(
            <button key={c.coleccion_id} className={`vt-col-pill ${colActive==c.coleccion_id?'active':''}`}
              onClick={()=>setColActive(colActive==c.coleccion_id?'':c.coleccion_id)}>
              {c.nombre} <span style={{color:'var(--dim)',fontSize:'.9em'}}>— {c.temporada}</span>
            </button>
          ))}
        </div>
        <div className="vt-toolbar">
          <div className="vt-search-wrap">
            <div className="vt-search-icon"><Search size={15}/></div>
            <input className="vt-search-input" placeholder="Buscar prendas..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <button className={`vt-filter-btn ${destacado?'active':''}`} onClick={()=>setDestacado(d=>!d)}>
            <Star size={13}/> Destacados
          </button>
          <button className="vt-filter-btn" onClick={()=>setShowCol(s=>!s)}>
            <Filter size={13}/> Colecciones <ChevronDown size={11}/>
          </button>
        </div>
        {showCol && (
          <div className="vt-collections" style={{marginTop:'1.5rem'}}>
            {colecciones.slice(0,4).map((c,i)=>(
              <div key={c.coleccion_id} className="vt-col-card" onClick={()=>{setColActive(c.coleccion_id);setShowCol(false);}}>
                <img src={COL_IMGS[i%COL_IMGS.length]} alt={c.nombre} className="vt-col-bg"/>
                <div className="vt-col-info">
                  <span className="vt-col-season">{c.temporada}</span>
                  <p className="vt-col-name">{c.nombre}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="vt-grid-wrap">
          {loading ? (
            <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>
              <div className="ds-spinner"/>
            </div>
          ) : productos.length === 0 ? (
            <div className="vt-empty">
              <p style={{fontFamily:'var(--fd)',fontSize:'1.5rem',marginBottom:'.5rem'}}>Sin resultados</p>
              <p style={{fontSize:'.72rem'}}>Prueba con otros filtros o búsqueda.</p>
            </div>
          ) : (
            <div className="vt-grid">
              {productos.map((p, i) => (
                <div key={p.product_id} className="vt-card" style={{animationDelay:`${i*.06}s`}}>
                  <div className="vt-card-img-wrap">
                    <img src={p.imagen_url} alt={p.nombre} className="vt-card-img" loading="lazy"/>
                    <div className="vt-card-badge">
                      {p.nuevo && <span className="ds-badge ds-badge-gold" style={{display:'block',marginBottom:'4px'}}>Nuevo</span>}
                      {p.destacado && <span className="ds-badge ds-badge-neutral">★ Destacado</span>}
                    </div>
                    <div className="vt-card-actions">
                      <button className="vt-card-action-btn primary" onClick={()=>addToCart(p)}>
                        <ShoppingBag size={13}/> Agregar
                      </button>
                      <Link to={`/producto/${p.product_id}`} className="vt-card-action-btn">
                        Ver
                      </Link>
                    </div>
                  </div>
                  <div className="vt-card-body">
                    <div>
                      <p className="vt-card-name">{p.nombre}</p>
                      <p className="vt-card-sub">{p.genero} · {p.categoria}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      {p.precio_oferta && <p className="vt-card-price-old">Bs. {parseFloat(p.precio).toFixed(2)}</p>}
                      <p className="vt-card-price">Bs. {parseFloat(p.precio_oferta||p.precio).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
