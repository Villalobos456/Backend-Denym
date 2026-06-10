// src/pages/Nosotros.jsx — Marcelo Villalobos
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, ArrowRight } from 'react-feather';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
.nos-root{background:var(--bg);color:var(--cream);font-family:var(--fb);overflow-x:hidden;}
/* Hero */
.nos-hero{height:70vh;min-height:480px;position:relative;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;}
.nos-hero-bg{position:absolute;inset:0;background-image:url('https://tse3.mm.bing.net/th/id/OIP.fWlPRR2HZ8IAIaAEY8m2cwHaD4?rs=1&pid=ImgDetMain&o=7&rm=3');background-size:cover;background-position:center;filter:brightness(.2);animation:nosZoom 22s ease-in-out infinite alternate;}
@keyframes nosZoom{from{transform:scale(1);}to{transform:scale(1.07);}}
.nos-hero-ov{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(201,168,76,.05) 0%,rgba(10,10,10,.65) 70%),linear-gradient(to bottom,transparent 50%,var(--bg) 100%);}
.nos-hero-content{position:relative;z-index:2;padding:0 2rem;animation:fadeUp .9s cubic-bezier(.22,1,.36,1) both;}
.nos-eyebrow{font-size:.58rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold);margin-bottom:.85rem;display:flex;align-items:center;justify-content:center;gap:12px;}
.nos-ey-line{width:36px;height:1px;background:#a07830;}
.nos-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,8vw,5rem);font-weight:200;color:var(--cream);letter-spacing:.06em;line-height:1;margin:0 0 1rem;}
.nos-hero-title em{color:var(--gold);font-style:italic;}
.nos-hero-sub{font-size:.8rem;letter-spacing:.1em;color:rgba(245,240,232,.45);line-height:1.9;max-width:520px;margin:0 auto;}
/* Section */
.nos-section{max-width:1100px;margin:0 auto;padding:6rem 1.5rem;}
.nos-lbl{font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.65rem;display:flex;align-items:center;gap:8px;}
.nos-lbl::after{content:'';flex:1;max-width:50px;height:1px;background:linear-gradient(90deg,#a07830,transparent);}
.nos-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,5vw,3rem);font-weight:300;color:var(--cream);letter-spacing:.05em;margin:0 0 .75rem;line-height:1.1;}
.nos-title em{color:var(--gold);font-style:italic;}
/* Founder */
.nos-founder{display:grid;grid-template-columns:1fr 1.2fr;gap:4rem;align-items:center;}
@media(max-width:768px){.nos-founder{grid-template-columns:1fr;gap:2rem;}}
.nos-img-wrap{position:relative;overflow:hidden;}
.nos-img-wrap::before{content:'';position:absolute;top:16px;left:16px;right:-16px;bottom:-16px;border:1px solid rgba(201,168,76,.18);z-index:-1;}
.nos-img{width:100%;height:480px;object-fit:cover;object-position:top;filter:brightness(.82) sepia(.08);transition:transform .8s cubic-bezier(.22,1,.36,1),filter .5s;}
.nos-img-wrap:hover .nos-img{transform:scale(1.04);filter:brightness(.92);}
.nos-name{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:300;color:var(--cream);letter-spacing:.05em;margin:0 0 .3rem;}
.nos-role{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;}
.nos-text p{font-size:.77rem;letter-spacing:.06em;color:var(--muted);line-height:1.9;margin-bottom:.85rem;}
/* Stats */
.nos-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.08);margin-top:2rem;}
.nos-stat{background:var(--bg2);padding:1.5rem 1rem;text-align:center;transition:background .3s;}
.nos-stat:hover{background:rgba(201,168,76,.04);}
.nos-stat-n{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--gold);display:block;line-height:1;}
.nos-stat-l{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:#3a3530;margin-top:.3rem;display:block;}
/* Valores */
.nos-vals{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.08);margin-top:2rem;}
.nos-val{background:var(--bg2);padding:1.75rem 1.5rem;transition:background .3s;}
.nos-val:hover{background:rgba(201,168,76,.04);}
.nos-val-sym{font-family:'Cormorant Garamond',serif;font-size:2rem;color:rgba(201,168,76,.15);display:block;margin-bottom:.65rem;}
.nos-val-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--cream);margin-bottom:.5rem;}
.nos-val-desc{font-size:.68rem;letter-spacing:.06em;color:var(--muted);line-height:1.75;}
/* Timeline */
.nos-timeline{position:relative;margin-top:2.5rem;}
.nos-timeline::before{content:'';position:absolute;top:0;bottom:0;left:17px;width:1px;background:linear-gradient(to bottom,transparent,rgba(201,168,76,.3),transparent);}
.nos-tl-item{display:flex;gap:2rem;align-items:flex-start;padding:1rem 0;}
.nos-tl-dot{width:12px;height:12px;border:1px solid rgba(201,168,76,.35);background:var(--bg);flex-shrink:0;margin-top:3px;transform:rotate(45deg);transition:all .25s;z-index:1;position:relative;}
.nos-tl-item:hover .nos-tl-dot{background:rgba(201,168,76,.2);border-color:var(--gold);}
.nos-tl-year{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:300;color:var(--muted);min-width:52px;transition:color .25s;}
.nos-tl-item:hover .nos-tl-year{color:var(--gold);}
.nos-tl-event{font-size:.73rem;letter-spacing:.05em;color:var(--cream);line-height:1.65;padding-top:1px;}
/* Contacto */
.nos-contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:2rem;}
.nos-contact-card{background:var(--bg2);border:1px solid var(--border,rgba(201,168,76,.18));padding:1.5rem;display:flex;flex-direction:column;align-items:center;gap:.65rem;text-align:center;transition:border-color .3s,transform .3s;text-decoration:none;color:inherit;}
.nos-contact-card:hover{border-color:rgba(201,168,76,.4);transform:translateY(-4px);}
.nos-contact-icon{color:var(--gold);}
.nos-contact-platform{font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);}
.nos-contact-value{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--cream);}
/* CTA */
.nos-cta{text-align:center;padding:6rem 1.5rem;background:var(--bg2);border-top:1px solid rgba(201,168,76,.1);position:relative;overflow:hidden;}
.nos-cta::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:600px;height:200px;background:radial-gradient(ellipse,rgba(201,168,76,.07) 0%,transparent 70%);pointer-events:none;}
.nos-cta-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:200;color:var(--cream);letter-spacing:.06em;margin-bottom:.75rem;}
.nos-cta-title em{color:var(--gold);font-style:italic;}
/* Divider */
.nos-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent);}
/* Reveal */
.reveal{opacity:0;transform:translateY(30px);transition:opacity .85s ease,transform .85s ease;}
.reveal.active{opacity:1;transform:translateY(0);}
.reveal-l{opacity:0;transform:translateX(-40px);transition:opacity .85s ease,transform .85s ease;}
.reveal-l.active{opacity:1;transform:translateX(0);}
.reveal-r{opacity:0;transform:translateX(40px);transition:opacity .85s ease,transform .85s ease;}
.reveal-r.active{opacity:1;transform:translateX(0);}
`;

const VALORES = [
  { sym:'I',   title:'Pasión por la moda',    desc:'Cada prenda refleja años de amor por el diseño y la estética boliviana contemporánea.' },
  { sym:'II',  title:'Autenticidad',           desc:'Sin fórmulas ni copias. Cada colección nace de una historia genuina y una visión única.' },
  { sym:'III', title:'Calidad premium',        desc:'Los mejores materiales, confección cuidadosa. Porque el cliente merece lo mejor.' },
  { sym:'IV',  title:'Comunidad',              desc:'DenymStyle es más que una tienda — es un movimiento de moda urbana boliviana.' },
];

const TIMELINE = [
  { year:'2020', event:'Fundación de DenymStyle en La Paz, Bolivia' },
  { year:'2021', event:'Primera colección — 80 prendas agotadas en 2 semanas' },
  { year:'2022', event:'Apertura del showroom y presencia en redes sociales' },
  { year:'2023', event:'Colaboraciones con fotógrafos y creadores locales' },
  { year:'2024', event:'Expansión a Santa Cruz y Cochabamba' },
  { year:'2025', event:'Lanzamiento de la plataforma e-commerce completa' },
  { year:'2026', event:'Colección SS26 — Noir Urbain · Crème de la Crème' },
];

const CONTACTO = [
  { platform:'Email',     value:'mjkazama01@gmail.com',  icon:<Mail size={20}/>,      href:'mailto:mjkazama01@gmail.com' },
  { platform:'Instagram', value:'@gsus_villalobos',       icon:<Instagram size={20}/>, href:'https://instagram.com/gsus_villalobos' },
  { platform:'TikTok',    value:'@mbappe.png0',           icon:<span style={{fontSize:'1.1rem',color:'var(--gold)'}}>♪</span>, href:'https://tiktok.com/@mbappe.png0' },
  { platform:'WhatsApp',  value:'69800542',               icon:<Phone size={20}/>,     href:'https://wa.me/59169800542' },
];

export default function Nosotros() {
  useEffect(() => {
    const go = () => {
      document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', go); go();
    return () => window.removeEventListener('scroll', go);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="nos-root">
        <section className="nos-hero">
          <div className="nos-hero-bg"/>
          <div className="nos-hero-ov"/>
          <div className="nos-hero-content">
            <div className="nos-eyebrow"><span className="nos-ey-line"/>DenymStyle<span className="nos-ey-line"/></div>
            <h1 className="nos-hero-title">Sobre <em>Mí</em></h1>
            <p className="nos-hero-sub">La historia detrás de una marca nacida de la pasión por la moda y el deseo de redefinir la estética urbana boliviana.</p>
          </div>
        </section>
        <section className="nos-section">
          <div className="nos-founder">
            <div className="nos-img-wrap reveal-l">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80" alt="Marcelo Villalobos" className="nos-img"/>
            </div>
            <div className="reveal-r">
              <div className="nos-lbl">El fundador</div>
              <h2 className="nos-name">Marcelo <em style={{fontStyle:'italic',color:'var(--gold)'}}>Villalobos</em></h2>
              <p className="nos-role">Fundador & Director Creativo — DenymStyle</p>
              <div className="nos-text">
                <p>Soy Marcelo Villalobos, el creador detrás de DenymStyle. Desde pequeño la moda fue mi lenguaje — la forma en que entendía el mundo y me expresaba en él.</p>
                <p>DenymStyle nació de una simple convicción: Bolivia merece una marca de moda que combine la estética urbana internacional con el alma local. No quería vender ropa, quería vender identidad.</p>
                <p>Cada colección que diseño es una conversación entre lo que veo en el mundo y lo que siento en las calles de La Paz. Mi inspiración: arquitectura, cultura callejera y arte contemporáneo.</p>
              </div>
              <div className="nos-stats">
                {[['500+','Prendas'],['6','Colecciones'],['3','Ciudades'],['100%','Pasión']].map(([n,l])=>(
                  <div key={l} className="nos-stat"><span className="nos-stat-n">{n}</span><span className="nos-stat-l">{l}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="nos-divider"/>
        <section className="nos-section">
          <div className="reveal">
            <div className="nos-lbl">Lo que me mueve</div>
            <h2 className="nos-title">Mis <em>Valores</em></h2>
          </div>
          <div className="nos-vals reveal">
            {VALORES.map(v=>(
              <div key={v.title} className="nos-val">
                <span className="nos-val-sym">{v.sym}</span>
                <p className="nos-val-title">{v.title}</p>
                <p className="nos-val-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="nos-divider"/>
        <section className="nos-section">
          <div className="reveal-l">
            <div className="nos-lbl">Nuestra historia</div>
            <h2 className="nos-title">El <em>Camino</em></h2>
          </div>
          <div className="nos-timeline reveal">
            {TIMELINE.map((t,i)=>(
              <div key={t.year} className="nos-tl-item" style={{transitionDelay:`${i*.05}s`}}>
                <div className="nos-tl-dot"/>
                <span className="nos-tl-year">{t.year}</span>
                <span className="nos-tl-event">{t.event}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="nos-divider"/>
        <section className="nos-section">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="nos-lbl" style={{justifyContent:'center'}}>Conéctate</div>
            <h2 className="nos-title" style={{textAlign:'center'}}>Mis <em>Redes</em></h2>
          </div>
          <div className="nos-contact-grid reveal">
            {CONTACTO.map(c=>(
              <a key={c.platform} href={c.href} target="_blank" rel="noopener noreferrer" className="nos-contact-card">
                <span className="nos-contact-icon">{c.icon}</span>
                <span className="nos-contact-platform">{c.platform}</span>
                <span className="nos-contact-value">{c.value}</span>
              </a>
            ))}
          </div>
        </section>
        <section className="nos-cta">
          <p style={{fontSize:'.6rem',letterSpacing:'.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.75rem'}}>✦ Únete a la historia</p>
          <h2 className="nos-cta-title">¿Listo para vestir <em>diferente</em>?</h2>
          <p style={{color:'var(--muted)',fontSize:'.75rem',marginBottom:'2rem'}}>Explora la colección y encuentra la prenda que te define.</p>
          <Link to="/ventas" className="ds-btn">Ver colección <ArrowRight size={13}/></Link>
        </section>
      </div>
    </>
  );
}
