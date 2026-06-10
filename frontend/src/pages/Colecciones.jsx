// src/pages/Colecciones.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Filter } from 'react-feather';
const API = '/api';
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
.cl-root{background:var(--bg);min-height:100vh;font-family:var(--fb);overflow-x:hidden;}
/* Hero */
.cl-hero{height:55vh;min-height:380px;position:relative;display:flex;align-items:flex-end;overflow:hidden;}
.cl-hero-bg{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80');background-size:cover;background-position:center 30%;filter:brightness(.25);animation:clZoom 22s ease-in-out infinite alternate;}
@keyframes clZoom{from{transform:scale(1);}to{transform:scale(1.08);}}
.cl-hero-ov{position:absolute;inset:0;background:linear-gradient(to right,rgba(10,10,10,.85) 0%,transparent 60%),linear-gradient(to top,rgba(10,10,10,.9) 0%,transparent 50%);}
.cl-hero-content{position:relative;z-index:2;padding:3rem 2rem 3.5rem;max-width:640px;animation:fadeUp .8s cubic-bezier(.22,1,.36,1) both;}
.cl-eyebrow{font-size:.58rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold);margin-bottom:.85rem;}
.cl-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,6vw,4.2rem);font-weight:200;color:var(--cream);letter-spacing:.05em;line-height:1;margin:0 0 .85rem;}
.cl-hero-title em{color:var(--gold);font-style:italic;}
.cl-hero-sub{font-size:.75rem;letter-spacing:.1em;color:rgba(245,240,232,.5);line-height:1.8;max-width:400px;}
/* Filtros */
.cl-filters{background:var(--bg2);border-top:1px solid rgba(201,168,76,.08);border-bottom:1px solid rgba(201,168,76,.08);padding:0;overflow-x:auto;}
.cl-filters-inner{max-width:1280px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;}
.cl-filter-btn{font-family:'Montserrat',sans-serif;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);background:none;border:none;padding:.95rem 1.1rem;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:color .25s,border-color .25s;}
.cl-filter-btn:hover{color:var(--gold);}
.cl-filter-btn.active{color:var(--gold);border-bottom-color:var(--gold);}
/* Grid */
.cl-section{max-width:1280px;margin:0 auto;padding:3.5rem 1.5rem 5rem;}
.cl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.5rem;}
@media(max-width:600px){.cl-grid{grid-template-columns:1fr;}}
/* Card */
.cl-card{background:var(--bg2);border:1px solid rgba(201,168,76,.1);overflow:hidden;cursor:pointer;transition:border-color .35s,transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s;animation:fadeUp .6s ease both;}
.cl-card:hover{border-color:rgba(201,168,76,.35);transform:translateY(-6px);box-shadow:0 24px 64px rgba(0,0,0,.6);}
.cl-card-img-wrap{overflow:hidden;position:relative;}
.cl-card-img{width:100%;height:260px;object-fit:cover;filter:brightness(.7) sepia(.08);transition:transform .7s cubic-bezier(.22,1,.36,1),filter .4s;}
.cl-card:hover .cl-card-img{transform:scale(1.07);filter:brightness(.9);}
.cl-card-badge{position:absolute;top:12px;right:12px;}
.cl-card-season{position:absolute;bottom:12px;left:12px;font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(201,168,76,.8);font-family:'Montserrat',sans-serif;}
.cl-card-body{padding:1.4rem 1.4rem 1.2rem;border-top:1px solid rgba(201,168,76,.08);}
.cl-card-name{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:300;color:var(--cream);letter-spacing:.04em;margin:0 0 .4rem;line-height:1.15;}
.cl-card-desc{font-size:.68rem;letter-spacing:.06em;color:#5a5045;line-height:1.7;margin-bottom:1.1rem;}
.cl-card-footer{display:flex;justify-content:space-between;align-items:center;}
.cl-card-count{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#3a3530;}
.cl-card-cta{font-family:'Montserrat',sans-serif;font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:#0a0a0a;background:var(--gold);border:none;padding:6px 14px;cursor:pointer;font-weight:600;clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);text-decoration:none;display:inline-flex;align-items:center;gap:4px;transition:background .25s;}
.cl-card-cta:hover{background:#e2c278;}
/* Featured — primera card más grande */
.cl-card-featured .cl-card-img{height:380px;}
@media(min-width:900px){.cl-card-featured{grid-column:span 2;}}
`;
const SEAS = ['Todas','SS26','AW25','SS25'];
const IMGS = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80',
];

export default function Colecciones() {
  const [cols,  setCols]  = useState([]);
  const [sea,   setSea]   = useState('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/colecciones`).then(r => { setCols(r.data||[]); setLoading(false); }).catch(()=>setLoading(false));
    const go = () => document.querySelectorAll('.reveal').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active'); });
    window.addEventListener('scroll', go); go();
    return () => window.removeEventListener('scroll', go);
  }, []);

  const filtered = sea === 'Todas' ? cols : cols.filter(c => c.temporada === sea);

  return (
    <>
      <style>{styles}</style>
      <div className="cl-root">
        <section className="cl-hero">
          <div className="cl-hero-bg"/>
          <div className="cl-hero-ov"/>
          <div className="cl-hero-content">
            <p className="cl-eyebrow">✦ DenymStyle — Temporadas</p>
            <h1 className="cl-hero-title">Nuestras <em>Colecciones</em></h1>
            <p className="cl-hero-sub">Cada temporada, una historia. Cada prenda, un capítulo de identidad y distinción.</p>
          </div>
        </section>

        {/* Filtros */}
        <nav className="cl-filters">
          <div className="cl-filters-inner">
            <Filter size={13} style={{color:'#3a3530',marginRight:'.5rem',flexShrink:0}}/>
            {SEAS.map(s=>(
              <button key={s} className={`cl-filter-btn ${sea===s?'active':''}`} onClick={()=>setSea(s)}>{s}</button>
            ))}
          </div>
        </nav>

        <section className="cl-section">
          {loading ? (
            <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}><div className="ds-spinner"/></div>
          ) : (
            <div className="cl-grid">
              {filtered.map((col, i) => (
                <div key={col.coleccion_id} className={`cl-card reveal ${i===0?'cl-card-featured':''}`}
                  style={{animationDelay:`${i*.07}s`,transitionDelay:`${i*.07}s`}}>
                  <div className="cl-card-img-wrap">
                    <img src={IMGS[i%IMGS.length]} alt={col.nombre} className="cl-card-img" loading="lazy"/>
                    <span className="cl-card-season">{col.temporada}</span>
                    {i===0&&<span className="ds-badge ds-badge-gold" style={{position:'absolute',top:12,right:12}}>Nueva temporada</span>}
                  </div>
                  <div className="cl-card-body">
                    <h2 className="cl-card-name">{col.nombre}</h2>
                    <p className="cl-card-desc">{col.descripcion}</p>
                    <div className="cl-card-footer">
                      <span className="cl-card-count">{col.temporada}</span>
                      <Link to="/ventas" className="cl-card-cta">Ver colección <ArrowRight size={11}/></Link>
                    </div>
                  </div>
                </div>
              ))}
              {!filtered.length && !loading && (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:'var(--muted)'}}>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.5rem'}}>Sin colecciones para esta temporada</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
