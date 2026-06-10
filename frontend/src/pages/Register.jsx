// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X as XIcon } from 'react-feather';
import axios from 'axios';

const API = '/api';

const strength = (p) => {
  if (!p || p.length < 6) return { n: 0, label: '', color: '' };
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_]).{8,}$/.test(p)) return { n: 3, label: 'Fuerte', color: '#5ab87a' };
  if (/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(p)) return { n: 2, label: 'Intermedio', color: '#e2c278' };
  return { n: 1, label: 'Débil', color: '#c07060' };
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
.rg-root{min-height:100vh;background:var(--bg);display:grid;grid-template-columns:1fr 1fr;font-family:var(--fb);transition:background .4s;}
@media(max-width:900px){.rg-root{grid-template-columns:1fr;}}
.rg-left{padding:5rem 2.5rem 3rem;display:flex;flex-direction:column;justify-content:center;overflow-y:auto;}
.rg-eyebrow{font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;}
.rg-title{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:300;color:var(--cream);letter-spacing:.05em;margin:0 0 .5rem;}
.rg-sub{font-size:.72rem;letter-spacing:.07em;color:var(--muted);margin-bottom:2rem;line-height:1.75;}
.rg-grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem;}
@media(max-width:600px){.rg-grid2{grid-template-columns:1fr;}}
.rg-field{margin-bottom:.95rem;}
.rg-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.4rem;}
.rg-wrap{position:relative;}
.rg-input{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--border);outline:none;color:var(--cream);font-family:'Montserrat',sans-serif;font-size:.8rem;letter-spacing:.05em;padding:.65rem .9rem;transition:border-color .25s,box-shadow .25s;box-sizing:border-box;}
.rg-input::placeholder{color:var(--dim);}
.rg-input:focus{border-color:rgba(201,168,76,.5);box-shadow:0 0 0 3px rgba(201,168,76,.06);}
.rg-input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #141210 inset!important;-webkit-text-fill-color:var(--cream)!important;}
.rg-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);display:flex;transition:color .25s;}
.rg-eye:hover{color:var(--gold);}
.rg-bar-wrap{display:flex;gap:3px;margin-top:.45rem;}
.rg-bar{flex:1;height:3px;background:var(--dim);border-radius:2px;transition:background .3s;}
.rg-strength-label{font-size:.6rem;letter-spacing:.12em;margin-top:.3rem;}
.rg-reqs{display:flex;flex-direction:column;gap:3px;margin-top:.4rem;}
.rg-req{font-size:.62rem;letter-spacing:.06em;display:flex;align-items:center;gap:5px;}
.rg-req.ok{color:#5ab87a;} .rg-req.no{color:var(--dim);}
.rg-btn{width:100%;font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#0a0a0a;background:linear-gradient(135deg,#a07830,#c9a84c,#e2c278,#c9a84c);background-size:200% 200%;background-position:0% 50%;border:none;padding:.88rem;cursor:pointer;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);transition:background-position .4s,box-shadow .3s;margin-top:1.25rem;display:flex;align-items:center;justify-content:center;gap:8px;}
.rg-btn:hover:not(:disabled){background-position:100% 50%;box-shadow:0 6px 24px rgba(201,168,76,.35);}
.rg-btn:disabled{opacity:.5;cursor:not-allowed;}
.rg-alert{background:rgba(192,112,96,.1);border:1px solid rgba(192,112,96,.25);padding:.7rem 1rem;font-size:.72rem;color:#c07060;margin-bottom:1rem;}
.rg-link{font-size:.65rem;letter-spacing:.1em;color:var(--muted);text-decoration:none;transition:color .25s;}
.rg-link:hover,.rg-link-gold{color:var(--gold);}
/* Right panel */
.rg-right{background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2.5rem 3rem;position:relative;overflow:hidden;}
.rg-right::before{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:400px;background:radial-gradient(ellipse,rgba(201,168,76,.09) 0%,transparent 70%);pointer-events:none;}
.rg-brand{font-family:'Cormorant Garamond',serif;font-size:3.2rem;font-weight:200;color:var(--cream);letter-spacing:.15em;text-align:center;line-height:1.05;margin-bottom:2rem;position:relative;z-index:1;}
.rg-brand em{color:var(--gold);font-style:italic;}
.rg-divider{width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto 2rem;position:relative;z-index:1;}
.rg-points{display:flex;flex-direction:column;gap:1rem;width:100%;max-width:320px;position:relative;z-index:1;}
.rg-point{display:flex;align-items:flex-start;gap:.85rem;padding:1rem 1.1rem;border:1px solid rgba(201,168,76,.1);background:rgba(201,168,76,.03);transition:border-color .3s;}
.rg-point:hover{border-color:rgba(201,168,76,.25);}
.rg-point-icon{font-size:1rem;color:var(--gold);flex-shrink:0;margin-top:2px;}
.rg-point-title{font-family:'Cormorant Garamond',serif;font-size:.98rem;color:var(--cream);margin-bottom:.2rem;}
.rg-point-desc{font-size:.63rem;letter-spacing:.06em;color:var(--muted);line-height:1.6;}
`;

const POINTS = [
  { icon: '✦', title: 'Denym Style',              desc: 'Nueva moda — redefiniendo la estética urbana boliviana' },
  { icon: '◈', title: 'Materiales de alta calidad', desc: 'Selección rigurosa de telas y tejidos premium de primera' },
  { icon: '◇', title: 'Diseño moderno y atemporal', desc: 'Piezas que trascienden temporadas, siempre vigentes' },
  { icon: '○', title: 'Confección precisa',         desc: 'Cada costura pensada para durar y lucir impecable' },
  { icon: '◆', title: 'Experiencia de compra refinada', desc: 'Desde el primer clic hasta tu puerta, con excelencia' },
];

const REQS = [
  { fn: p => p.length >= 8,           text: 'Mínimo 8 caracteres' },
  { fn: p => /[A-Z]/.test(p),         text: 'Al menos una mayúscula' },
  { fn: p => /[0-9]/.test(p),         text: 'Al menos un número' },
  { fn: p => /[!@#$%^&*\-_]/.test(p), text: 'Al menos un símbolo (!@#...)' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '', username: '', email: '',
    password: '', confirm: '', telefono: '', ciudad: '', departamento: ''
  });
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const s   = strength(form.password);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const reqs = REQS.map(r => ({ ...r, ok: r.fn(form.password) }));

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (!reqs.every(r => r.ok)) return setError('La contraseña no cumple todos los requisitos.');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden.');
    if (!form.fullname || !form.username || !form.email) return setError('Completa todos los campos obligatorios.');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/register`, form);
      navigate('/login?registered=1');
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Error al registrar. Intenta de nuevo.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rg-root">
        {/* LEFT — form */}
        <div className="rg-left">
          <p className="rg-eyebrow">✦ DenymStyle</p>
          <h1 className="rg-title">Crear cuenta</h1>
          <p className="rg-sub">Únete y descubre moda premium. Es rápido y gratuito.</p>

          {error && <div className="rg-alert">{error}</div>}

          <form onSubmit={submit} noValidate>
            <div className="rg-grid2">
              <div className="rg-field">
                <label className="rg-label">Nombre completo *</label>
                <input className="rg-input" placeholder="Tu nombre" value={form.fullname} onChange={e=>set('fullname',e.target.value)} required/>
              </div>
              <div className="rg-field">
                <label className="rg-label">Usuario *</label>
                <input className="rg-input" placeholder="Cliente" value={form.username} onChange={e=>set('username',e.target.value)} required/>
              </div>
            </div>

            <div className="rg-field">
              <label className="rg-label">Correo electrónico *</label>
              <input className="rg-input" type="email" placeholder="tu@correo.com" value={form.email} onChange={e=>set('email',e.target.value)} required/>
            </div>

            <div className="rg-field">
              <label className="rg-label">Contraseña *</label>
              <div className="rg-wrap">
                <input className="rg-input" type={showP?'text':'password'} placeholder="Crea una contraseña segura"
                  value={form.password} onChange={e=>set('password',e.target.value)} required/>
                <button type="button" className="rg-eye" onClick={()=>setShowP(p=>!p)}>{showP?<EyeOff size={14}/>:<Eye size={14}/>}</button>
              </div>
              {form.password && (
                <>
                  <div className="rg-bar-wrap">
                    {[1,2,3].map(n=><div key={n} className="rg-bar" style={{background:s.n>=n?s.color:undefined}}/>)}
                  </div>
                  <p className="rg-strength-label" style={{color:s.color}}>Contraseña {s.label}</p>
                  <div className="rg-reqs">
                    {reqs.map((r,i)=>(
                      <span key={i} className={`rg-req ${r.ok?'ok':'no'}`}>
                        {r.ok?<Check size={11}/>:<XIcon size={11}/>} {r.text}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="rg-field">
              <label className="rg-label">Confirmar contraseña *</label>
              <div className="rg-wrap">
                <input className="rg-input" type={showC?'text':'password'} placeholder="Repite tu contraseña"
                  value={form.confirm} onChange={e=>set('confirm',e.target.value)} required/>
                <button type="button" className="rg-eye" onClick={()=>setShowC(c=>!c)}>{showC?<EyeOff size={14}/>:<Eye size={14}/>}</button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <span className="rg-req no"><XIcon size={11}/> Las contraseñas no coinciden</span>
              )}
            </div>

            <div className="rg-grid2">
              <div className="rg-field">
                <label className="rg-label">Teléfono</label>
                <input className="rg-input" placeholder="69800542" value={form.telefono} onChange={e=>set('telefono',e.target.value)}/>
              </div>
              <div className="rg-field">
                <label className="rg-label">Ciudad</label>
                <input className="rg-input" placeholder="La Paz" value={form.ciudad} onChange={e=>set('ciudad',e.target.value)}/>
              </div>
            </div>

            <div className="rg-field">
              <label className="rg-label">Departamento</label>
              <select className="rg-input" value={form.departamento} onChange={e=>set('departamento',e.target.value)}>
                <option value="">Selecciona...</option>
                {['La Paz','Cochabamba','Santa Cruz','Oruro','Potosí','Sucre','Tarija','Beni','Pando'].map(d=>(
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="rg-btn" disabled={loading}>
              {loading ? 'Creando cuenta...' : '✦ Crear cuenta gratis'}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:'1.25rem'}}>
            <Link to="/login" className="rg-link">¿Ya tienes cuenta? <span className="rg-link-gold">Inicia sesión</span></Link>
          </p>
        </div>

        {/* RIGHT — brand */}
        <div className="rg-right">
          <p className="rg-brand">Deny<em>m</em><br/>Style</p>
          <div className="rg-divider"/>
          <div className="rg-points">
            {POINTS.map(p=>(
              <div key={p.title} className="rg-point">
                <span className="rg-point-icon">{p.icon}</span>
                <div>
                  <p className="rg-point-title">{p.title}</p>
                  <p className="rg-point-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
