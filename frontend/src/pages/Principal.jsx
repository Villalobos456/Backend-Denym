import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Instagram, ShoppingBag, Star, ChevronDown } from 'react-feather';
import toast from 'react-hot-toast';
const API = '/api';

const TICKER_ITEMS = ['Colección 2026','Envío Express','Moda Premium','La Paz · Bolivia','Diseño Exclusivo','Nuevas Llegadas','Materiales Premium','✦ DenymStyle'];

const FEATURES = [
  { icon:'✦', title:'Materiales Premium',   desc:'Selección rigurosa de telas y materiales de primera calidad.' },
  { icon:'◈', title:'Diseño Exclusivo',      desc:'Piezas únicas que no encontrarás en ningún otro lugar.' },
  { icon:'◇', title:'Envío Express',         desc:'Entrega en 24-48 horas a toda Bolivia.' },
  { icon:'○', title:'Garantía Total',        desc:'30 días de devolución sin preguntas.' },
];

const TESTIMONIALS = [
  { name:'Valentina R.', city:'La Paz',       text:'La calidad superó todas mis expectativas. Cada prenda es una obra de arte.' },
  { name:'Diego M.',     city:'Santa Cruz',   text:'Estilo único, atención perfecta. No compro ropa en otro lugar.' },
  { name:'Camila S.',    city:'Cochabamba',   text:'Me siento poderosa con cada prenda. DenymStyle entiende a la mujer moderna.' },
];

const INSTA_IMGS = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  'https://th.bing.com/th/id/OIP.Ql6e9X5eheLz6GAA8gpjpQHaFj?w=204&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://th.bing.com/th/id/OIP.t9JckSmSEzrG-VcZZWc6DQHaHa?w=211&h=210&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@200;300;400;500;600&display=swap');
.pr-root{background:var(--bg);color:var(--cream);font-family:var(--fb);overflow-x:hidden;}
/* HERO */
.pr-hero{height:100vh;min-height:600px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden;}
.pr-hero-bg{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80');background-size:cover;background-position:center;animation:prZoom 22s ease-in-out infinite alternate;filter:brightness(.32);}
@keyframes prZoom{from{transform:scale(1);}to{transform:scale(1.1);}}
.pr-hero-ov{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,.2) 0%,rgba(10,10,10,.1) 40%,rgba(10,10,10,.7) 85%,var(--bg) 100%);}
.pr-hero-line{position:absolute;top:0;left:48px;width:1px;height:100%;background:linear-gradient(to bottom,transparent,rgba(201,168,76,.25),transparent);display:none;}
@media(min-width:768px){.pr-hero-line{display:block;}}
.pr-hero-content{position:relative;z-index:2;padding:0 1.5rem;animation:fadeUp .9s .3s cubic-bezier(.22,1,.36,1) both;}
.pr-hero-eyebrow{font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:1.1rem;display:flex;align-items:center;justify-content:center;gap:12px;}
.pr-eyebrow-line{width:38px;height:1px;background:#a07830;}
.pr-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(3.5rem,10vw,7rem);font-weight:200;line-height:.95;letter-spacing:.04em;color:var(--cream);margin:0 0 1.5rem;}
.pr-hero-title em{color:var(--gold);font-style:italic;}
.pr-hero-sub{font-size:clamp(.75rem,1.5vw,.88rem);letter-spacing:.12em;color:rgba(245,240,232,.55);max-width:500px;margin:0 auto 2.5rem;line-height:1.9;}
.pr-cta-wrap{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.pr-scroll-hint{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:2;display:flex;flex-direction:column;align-items:center;gap:5px;color:var(--muted);animation:bounce 2s ease-in-out infinite;}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(8px);}}
.pr-scroll-txt{font-size:.52rem;letter-spacing:.25em;text-transform:uppercase;}
/* TICKER */
.pr-ticker{background:var(--bg2);border-top:1px solid rgba(201,168,76,.12);border-bottom:1px solid rgba(201,168,76,.12);overflow:hidden;padding:.65rem 0;}
.pr-ticker-track{display:flex;gap:3rem;animation:ticker 25s linear infinite;width:max-content;}
@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.pr-ticker-item{font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);white-space:nowrap;display:flex;align-items:center;gap:.75rem;}
.pr-ticker-dot{color:var(--gold);}
/* FEATURES */
.pr-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.08);}
.pr-feature{background:var(--bg2);padding:2rem 1.5rem;transition:background .3s;}
.pr-feature:hover{background:rgba(201,168,76,.04);}
.pr-feature-icon{font-size:1.25rem;color:var(--gold);margin-bottom:.85rem;display:block;}
.pr-feature-title{font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:var(--cream);margin-bottom:.45rem;}
.pr-feature-desc{font-size:.68rem;letter-spacing:.06em;color:var(--muted);line-height:1.75;}
/* SECTION UTILS */
.pr-section{max-width:1280px;margin:0 auto;padding:5.5rem 1.5rem;}
.pr-section-center{text-align:center;}
.pr-section-label{font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.65rem;display:flex;align-items:center;gap:8px;}
.pr-section-label.center{justify-content:center;}
.pr-section-label::after{content:'';flex:1;max-width:50px;height:1px;background:linear-gradient(90deg,#a07830,transparent);}
.pr-section-label.center::after,.pr-section-label.center::before{content:'';flex:1;max-width:50px;height:1px;background:linear-gradient(90deg,#a07830,transparent);}
.pr-section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:300;color:var(--cream);letter-spacing:.05em;margin:0 0 .75rem;line-height:1.1;}
.pr-section-title em{color:var(--gold);font-style:italic;}
.pr-section-sub{font-size:.76rem;letter-spacing:.08em;color:var(--muted);line-height:1.8;max-width:480px;}
/* ABOUT GRID */
.pr-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
@media(max-width:768px){.pr-about-grid{grid-template-columns:1fr;gap:2rem;}}
.pr-about-img-wrap{position:relative;overflow:hidden;}
.pr-about-img-wrap::before{content:'';position:absolute;top:16px;left:16px;right:-16px;bottom:-16px;border:1px solid rgba(201,168,76,.18);z-index:-1;}
.pr-about-img{width:100%;height:460px;object-fit:cover;filter:brightness(.82);transition:transform .8s cubic-bezier(.22,1,.36,1);}
.pr-about-img-wrap:hover .pr-about-img{transform:scale(1.04);}
.pr-about-text p{font-size:.77rem;letter-spacing:.06em;color:var(--muted);line-height:1.9;margin-bottom:.85rem;}
.pr-stats{display:flex;gap:2.5rem;margin-top:2rem;flex-wrap:wrap;}
.pr-stat-n{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;color:var(--gold);display:block;line-height:1;}
.pr-stat-l{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:#3a3530;margin-top:.25rem;display:block;}
/* FILTERS */
.pr-filters{display:flex;gap:.65rem;justify-content:center;flex-wrap:wrap;margin-bottom:2.5rem;}
.pr-filter-btn{font-family:'Montserrat',sans-serif;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);background:transparent;border:1px solid rgba(201,168,76,.14);padding:.48rem 1.1rem;cursor:pointer;transition:all .25s;}
.pr-filter-btn:hover{border-color:var(--gold);color:var(--gold);}
.pr-filter-btn.active{background:var(--gold);color:#0a0a0a;border-color:var(--gold);clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);font-weight:600;}
/* PROD GRID */
.pr-prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.25rem;}
.pr-prod-card{background:var(--bg2);border:1px solid rgba(201,168,76,.07);overflow:hidden;cursor:pointer;position:relative;transition:border-color .4s,transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s;animation:fadeUp .55s ease both;}
.pr-prod-card:hover{border-color:rgba(201,168,76,.3);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.45);}
.pr-prod-img-wrap{height:290px;overflow:hidden;}
.pr-prod-img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.22,1,.36,1),filter .4s;filter:brightness(.85);}
.pr-prod-card:hover .pr-prod-img{transform:scale(1.07);filter:brightness(.95);}
.pr-prod-badge{position:absolute;top:10px;left:10px;}
.pr-prod-overlay{position:absolute;inset:0;background:rgba(10,10,10,.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .35s;}
.pr-prod-card:hover .pr-prod-overlay{opacity:1;}
.pr-prod-overlay-btn{background:var(--gold);border:none;color:#0a0a0a;font-family:'Montserrat',sans-serif;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;padding:.6rem 1.25rem;cursor:pointer;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);transform:translateY(10px);transition:transform .35s .05s;display:flex;align-items:center;gap:5px;}
.pr-prod-card:hover .pr-prod-overlay-btn{transform:translateY(0);}
.pr-prod-info{padding:.9rem 1rem 1rem;border-top:1px solid rgba(201,168,76,.07);display:flex;justify-content:space-between;align-items:flex-end;}
.pr-prod-name{font-family:'Cormorant Garamond',serif;font-size:.98rem;color:var(--cream);letter-spacing:.03em;margin:0 0 .2rem;line-height:1.2;}
.pr-prod-type{font-size:.56rem;letter-spacing:.14em;text-transform:uppercase;color:#3a3530;}
.pr-prod-price{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--gold);}
/* BANNER */
.pr-banner{position:relative;overflow:hidden;height:460px;display:flex;align-items:center;justify-content:center;}
.pr-banner-bg{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80');background-size:cover;background-position:center top;filter:brightness(.28);transform:scale(1.05);transition:transform 8s ease;}
.pr-banner:hover .pr-banner-bg{transform:scale(1);}
.pr-banner-ov{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,10,10,.7) 0%,transparent 60%,rgba(201,168,76,.05) 100%);}
.pr-banner-content{position:relative;z-index:2;text-align:center;padding:2rem;}
.pr-banner-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,5vw,3.8rem);font-weight:200;color:var(--cream);letter-spacing:.08em;margin-bottom:.85rem;line-height:1.1;}
.pr-banner-title em{color:var(--gold);font-style:italic;}
/* TESTIMONIOS */
.pr-testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.25rem;}
.pr-testi-card{background:var(--bg2);border:1px solid rgba(201,168,76,.1);padding:1.75rem;position:relative;transition:border-color .3s,transform .3s;}
.pr-testi-card:hover{border-color:rgba(201,168,76,.25);transform:translateY(-4px);}
.pr-testi-card::before{content:'"';font-family:'Cormorant Garamond',serif;font-size:4rem;color:rgba(201,168,76,.12);position:absolute;top:8px;left:14px;line-height:1;}
.pr-testi-stars{display:flex;gap:3px;margin-bottom:.85rem;}
.pr-testi-text{font-family:'Cormorant Garamond',serif;font-size:1rem;font-style:italic;color:rgba(245,240,232,.7);line-height:1.65;margin-bottom:1.1rem;}
.pr-testi-author{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:7px;}
.pr-testi-author::before{content:'';width:18px;height:1px;background:#a07830;}
/* INSTAGRAM */
.pr-insta-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;}
@media(max-width:768px){.pr-insta-grid{grid-template-columns:repeat(3,1fr);}}
.pr-insta-item{position:relative;overflow:hidden;aspect-ratio:1;}
.pr-insta-img{width:100%;height:100%;object-fit:cover;filter:brightness(.7) sepia(.12);transition:transform .6s cubic-bezier(.22,1,.36,1),filter .4s;}
.pr-insta-item:hover .pr-insta-img{transform:scale(1.1);filter:brightness(.9);}
.pr-insta-ov{position:absolute;inset:0;background:rgba(201,168,76,.15);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .35s;}
.pr-insta-item:hover .pr-insta-ov{opacity:1;}
/* NEWSLETTER */
.pr-newsletter{background:var(--bg2);border-top:1px solid rgba(201,168,76,.1);border-bottom:1px solid rgba(201,168,76,.1);padding:5rem 1.5rem;text-align:center;position:relative;overflow:hidden;}
.pr-newsletter::before{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:600px;height:250px;background:radial-gradient(ellipse,rgba(201,168,76,.07) 0%,transparent 70%);pointer-events:none;}
.pr-newsletter-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:300;color:var(--cream);letter-spacing:.06em;margin-bottom:.65rem;}
.pr-newsletter-title em{color:var(--gold);font-style:italic;}
.pr-newsletter-form{display:flex;max-width:440px;margin:1.5rem auto 0;border:1px solid rgba(201,168,76,.2);}
.pr-newsletter-input{flex:1;background:rgba(255,255,255,.03);border:none;outline:none;color:var(--cream);font-family:'Montserrat',sans-serif;font-size:.76rem;padding:.85rem 1rem;}
.pr-newsletter-input::placeholder{color:#3a3530;}
.pr-newsletter-btn{font-family:'Montserrat',sans-serif;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;background:var(--gold);color:#0a0a0a;border:none;padding:0 1.5rem;cursor:pointer;white-space:nowrap;transition:background .25s;}
.pr-newsletter-btn:hover{background:#e2c278;}
/* DIVIDER */
.pr-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent);}
/* REVEAL */
.reveal{opacity:0;transform:translateY(36px);transition:opacity .9s ease,transform .9s ease;}
.reveal.active{opacity:1;transform:translateY(0);}
.reveal-l{opacity:0;transform:translateX(-50px);transition:opacity .9s ease,transform .9s ease;}
.reveal-l.active{opacity:1;transform:translateX(0);}
.reveal-r{opacity:0;transform:translateX(50px);transition:opacity .9s ease,transform .9s ease;}
.reveal-r.active{opacity:1;transform:translateX(0);}
`;

export default function Principal() {
  const [products,  setProducts]  = useState([]);
  const [filter,    setFilter]    = useState('');
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    axios.get(`${API}/productos?limit=8${filter?`&genero=${filter}`:''}`).then(r => { setProducts(r.data.products||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, [filter]);

  useEffect(() => {
    const go = () => document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active'); });
    window.addEventListener('scroll', go); go();
    return () => window.removeEventListener('scroll', go);
  }, []);

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem('ds_cart')||'[]');
    const idx  = cart.findIndex(i => i.product_id === p.product_id);
    if (idx >= 0) { cart[idx].quantity++; } else {
      cart.push({ product_id:p.product_id, name:p.nombre, price:parseFloat(p.precio), image_url:p.imagen_url, quantity:1, talla:null, color:null, subtotal:parseFloat(p.precio) });
    }
    localStorage.setItem('ds_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartchange'));
    toast.success(`${p.nombre} agregado`, { className:'ds-toast' });
  };

  const subscribeNL = async () => {
    if (!email) return;
    try { await axios.post(`${API}/newsletter`, { email }); toast.success('¡Suscrito!'); setEmail(''); }
    catch { toast.error('Error al suscribirse'); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pr-root">
        <section className="pr-hero">
          <div className="pr-hero-bg"/>
          <div className="pr-hero-ov"/>
          <div className="pr-hero-line"/>
          <div className="pr-hero-content">
            <div className="pr-hero-eyebrow">
              <span className="pr-eyebrow-line"/>Colección 2026<span className="pr-eyebrow-line"/>
            </div>
            <h1 className="pr-hero-title">Denym<em><br/>Style</em></h1>
            <p className="pr-hero-sub">Elegancia urbana redefinida. Minimalismo, lujo y actitud en cada detalle. Viste lo que eres, no lo que tienes.</p>
            <div className="pr-cta-wrap">
              <Link to="/ventas" className="ds-btn">Explorar Colección <ArrowRight size={14}/></Link>
              <Link to="/nosotros" className="ds-btn-ghost">Nuestra historia</Link>
            </div>
          </div>
          <div className="pr-scroll-hint">
            <span className="pr-scroll-txt">Scroll</span>
            <ChevronDown size={16}/>
          </div>
        </section>
        <div className="pr-ticker" aria-hidden="true">
          <div className="pr-ticker-track">
            {[...Array(2)].map((_,rep)=> TICKER_ITEMS.map((t,i)=>(
              <span key={`${rep}-${i}`} className="pr-ticker-item"><span className="pr-ticker-dot">✦</span>{t}</span>
            )))}
          </div>
        </div>
        <section className="reveal">
          <div className="pr-features">
            {FEATURES.map(f=>(
              <div key={f.title} className="pr-feature">
                <span className="pr-feature-icon">{f.icon}</span>
                <p className="pr-feature-title">{f.title}</p>
                <p className="pr-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="pr-section">
          <div className="pr-about-grid">
            <div className="pr-about-img-wrap reveal-l">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="DenymStyle" className="pr-about-img"/>
            </div>
            <div className="reveal-r">
              <div className="pr-section-label">Nuestra historia</div>
              <h2 className="pr-section-title">Sobre <em>Nosotros</em></h2>
              <div className="pr-about-text">
                <p>DenymStyle nace para redefinir la moda urbana boliviana con una visión elegante y contemporánea. Creemos que la ropa es el lenguaje silencioso del poder personal.</p>
                <p>No seguimos tendencias, las creamos. Cada prenda transmite identidad, confianza y actitud. Trabajamos con los mejores materiales para que cada pieza sea una inversión en ti.</p>
              </div>
              <div className="pr-stats">
                {[['500+','Prendas'],['3+','Años'],['98%','Satisfacción']].map(([n,l])=>(
                  <div key={l}><span className="pr-stat-n">{n}</span><span className="pr-stat-l">{l}</span></div>
                ))}
              </div>
              <div style={{marginTop:'2rem'}}>
                <Link to="/nosotros" className="ds-btn">Conocernos <ArrowRight size={13}/></Link>
              </div>
            </div>
          </div>
        </section>
        <div className="pr-divider"/>
        <section className="pr-section">
          <div style={{textAlign:'center',marginBottom:'2.5rem'}} className="reveal">
            <div className="pr-section-label center">Temporada 2026</div>
            <h2 className="pr-section-title">Nuestro <em>Catálogo</em></h2>
            <p className="pr-section-sub" style={{margin:'0 auto'}}>Prendas diseñadas para quienes no siguen tendencias — las crean.</p>
          </div>
          <div className="pr-filters reveal">
            {[['','✦ Todo'],['hombre','♂ Hombre'],['mujer','♀ Mujer'],['unisex','◈ Unisex']].map(([k,l])=>(
              <button key={k} className={`pr-filter-btn ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>{l}</button>
            ))}
          </div>
          {loading ? (
            <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><div className="ds-spinner"/></div>
          ) : (
            <div className="pr-prod-grid">
              {products.map((p,i) => (
                <div key={p.product_id} className="pr-prod-card" style={{animationDelay:`${i*.06}s`}}>
                  {p.nuevo && <span className="pr-prod-badge ds-badge ds-badge-gold">Nuevo</span>}
                  <div className="pr-prod-img-wrap">
                    <img src={p.imagen_url} alt={p.nombre} className="pr-prod-img" loading="lazy"/>
                    <div className="pr-prod-overlay">
                      <button className="pr-prod-overlay-btn" onClick={()=>addToCart(p)}>
                        <ShoppingBag size={12}/> Agregar
                      </button>
                    </div>
                  </div>
                  <div className="pr-prod-info">
                    <div><p className="pr-prod-name">{p.nombre}</p><p className="pr-prod-type">{p.genero}</p></div>
                    <span className="pr-prod-price">Bs. {parseFloat(p.precio).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{textAlign:'center',marginTop:'2.5rem'}} className="reveal">
            <Link to="/ventas" className="ds-btn">Ver toda la colección <ArrowRight size={13}/></Link>
          </div>
        </section>
        <section className="pr-banner reveal">
          <div className="pr-banner-bg"/>
          <div className="pr-banner-ov"/>
          <div className="pr-banner-content" style={{position:'relative',zIndex:2}}>
            <p style={{fontSize:'.6rem',letterSpacing:'.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.65rem'}}>✦ Nueva temporada</p>
            <h2 className="pr-banner-title">El estilo no es un lujo,<br/>es una <em>actitud</em></h2>
            <p style={{fontSize:'.75rem',letterSpacing:'.1em',color:'rgba(245,240,232,.55)',marginBottom:'1.75rem'}}>Descubre piezas que hablan antes de que tú lo hagas.</p>
            <Link to="/ventas" className="ds-btn">Explorar ahora <ArrowRight size={13}/></Link>
          </div>
        </section>
        <section className="pr-section">
          <div style={{textAlign:'center',marginBottom:'2.5rem'}} className="reveal">
            <div className="pr-section-label center">Lo que dicen</div>
            <h2 className="pr-section-title">Nuestros <em>Clientes</em></h2>
          </div>
          <div className="pr-testi-grid">
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="pr-testi-card reveal" style={{transitionDelay:`${i*.15}s`}}>
                <div className="pr-testi-stars">{[...Array(5)].map((_,s)=><Star key={s} size={11} fill="#c9a84c" style={{color:'#c9a84c'}}/>)}</div>
                <p className="pr-testi-text">"{t.text}"</p>
                <span className="pr-testi-author">{t.name} — {t.city}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="pr-divider"/>
        <section className="pr-section" style={{paddingTop:'3.5rem',paddingBottom:'3.5rem'}}>
          <div style={{textAlign:'center',marginBottom:'1.75rem'}} className="reveal">
            <div className="pr-section-label center"><Instagram size={12}/>Síguenos</div>
            <h2 className="pr-section-title" style={{fontSize:'1.8rem'}}><em>@gsus_villalobos</em></h2>
          </div>
          <div className="pr-insta-grid reveal">
            {INSTA_IMGS.map((src,i)=>(
              <a key={i} href="https://instagram.com/gsus_villalobos" target="_blank" rel="noopener noreferrer" className="pr-insta-item">
                <img src={src} alt="" className="pr-insta-img" loading="lazy"/>
                <div className="pr-insta-ov"><Instagram size={20} style={{color:'#c9a84c'}}/></div>
              </a>
            ))}
          </div>
        </section>
        <section className="pr-newsletter reveal">
          <div className="pr-section-label center">Exclusivo</div>
          <h2 className="pr-newsletter-title">Sé el primero en <em>descubrirlo</em></h2>
          <p style={{fontSize:'.72rem',letterSpacing:'.1em',color:'var(--muted)'}}>Nuevas llegadas, ofertas exclusivas — directo a tu correo.</p>
          <div className="pr-newsletter-form">
            <input className="pr-newsletter-input" type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            <button className="pr-newsletter-btn" onClick={subscribeNL}>Suscribirme</button>
          </div>
          <p style={{fontSize:'.58rem',letterSpacing:'.12em',color:'#3a3530',marginTop:'.65rem',textTransform:'uppercase'}}>✦ Sin spam. Cancela cuando quieras.</p>
        </section>
      </div>
    </>
  );
}
