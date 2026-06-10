// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Shield, Sun, Moon, RefreshCw } from 'react-feather';
import axios from 'axios';

const API = '/api';

function makeCaptcha() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
.lg-root{min-height:100vh;display:flex;background:var(--bg);font-family:var(--fb);transition:background .4s;}
.lg-left{flex:1;display:none;position:relative;overflow:hidden;}
@media(min-width:900px){.lg-left{display:flex;align-items:flex-end;}}
.lg-bg{position:absolute;inset:0;background-image:url('https://th.bing.com/th/id/R.a0ad087dfe0e91993503941af6c9d98d?rik=27bmbuxjITqM5g&pid=ImgRaw&r=0');background-size:cover;background-position:center;filter:brightness(.25);animation:lgZoom 22s ease-in-out infinite alternate;}
@keyframes lgZoom{from{transform:scale(1);}to{transform:scale(1.08);}}
.lg-bg-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(10,10,10,.9) 0%,transparent 60%),linear-gradient(to top,rgba(10,10,10,.95) 0%,transparent 50%);}
.lg-left-content{position:relative;z-index:2;padding:3rem;}
.lg-brand{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:200;color:#f5f0e8;letter-spacing:.14em;}
.lg-brand em{color:#c9a84c;font-style:italic;}
.lg-tagline{font-size:.72rem;letter-spacing:.1em;color:rgba(245,240,232,.45);line-height:1.9;max-width:340px;margin-top:.75rem;}
.lg-right{width:100%;max-width:500px;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;position:relative;}
.lg-theme{position:absolute;top:1.25rem;right:1.25rem;background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;padding:7px;display:flex;transition:color .25s,border-color .25s;}
.lg-theme:hover{color:var(--gold);border-color:var(--gold);}
.lg-card{width:100%;background:var(--bg2);border:1px solid var(--border);box-shadow:0 0 0 1px rgba(201,168,76,.04),0 40px 80px rgba(0,0,0,.55);position:relative;padding:2.5rem 2rem;animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both;}
.lg-card::before,.lg-card::after{content:'';position:absolute;width:16px;height:16px;border-color:rgba(201,168,76,.3);border-style:solid;}
.lg-card::before{top:8px;left:8px;border-width:1px 0 0 1px;}
.lg-card::after{bottom:8px;right:8px;border-width:0 1px 1px 0;}
.lg-eyebrow{font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;text-align:center;}
.lg-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;color:var(--cream);letter-spacing:.05em;text-align:center;margin:0 0 1.75rem;}
.lg-field{margin-bottom:1.1rem;}
.lg-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.45rem;}
.lg-wrap{position:relative;}
.lg-input{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--border);outline:none;color:var(--cream);font-family:'Montserrat',sans-serif;font-size:.82rem;letter-spacing:.05em;padding:.7rem 2.6rem .7rem .9rem;transition:border-color .25s,box-shadow .25s;box-sizing:border-box;}
.lg-input::placeholder{color:var(--dim);}
.lg-input:focus{border-color:rgba(201,168,76,.55);box-shadow:0 0 0 3px rgba(201,168,76,.07);}
.lg-input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #141210 inset!important;-webkit-text-fill-color:var(--cream)!important;}
.lg-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);display:flex;transition:color .25s;}
.lg-eye:hover{color:var(--gold);}
.lg-captcha-row{display:flex;gap:.75rem;align-items:center;margin-bottom:1.1rem;}
.lg-captcha-box{background:var(--bg);border:1px solid var(--border);padding:.6rem 1rem;font-family:monospace;font-size:1.15rem;letter-spacing:.28em;color:var(--gold);user-select:none;cursor:default;min-width:120px;text-align:center;flex-shrink:0;filter:url(#cap-filter);}
.lg-captcha-refresh{background:none;border:none;cursor:pointer;color:var(--muted);transition:color .25s;display:flex;align-items:center;padding:4px;}
.lg-captcha-refresh:hover{color:var(--gold);}
.lg-btn{width:100%;font-family:'Montserrat',sans-serif;font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:#0a0a0a;background:linear-gradient(135deg,#a07830,#c9a84c,#e2c278,#c9a84c);background-size:200% 200%;background-position:0% 50%;border:none;padding:.88rem;cursor:pointer;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);transition:background-position .4s,box-shadow .3s;margin-top:1.25rem;display:flex;align-items:center;justify-content:center;gap:8px;}
.lg-btn:hover:not(:disabled){background-position:100% 50%;box-shadow:0 6px 24px rgba(201,168,76,.35);}
.lg-btn:disabled{opacity:.5;cursor:not-allowed;}
.lg-alert{background:rgba(192,112,96,.1);border:1px solid rgba(192,112,96,.25);padding:.7rem 1rem;font-size:.72rem;letter-spacing:.06em;color:#c07060;margin-bottom:1rem;}
.lg-success{background:rgba(90,184,122,.1);border:1px solid rgba(90,184,122,.2);padding:.7rem 1rem;font-size:.72rem;color:#5ab87a;margin-bottom:1rem;}
.lg-links{text-align:center;margin-top:1.5rem;display:flex;flex-direction:column;gap:.5rem;}
.lg-link{font-size:.65rem;letter-spacing:.1em;color:var(--muted);text-decoration:none;transition:color .25s;}
.lg-link:hover,.lg-link-gold{color:var(--gold);}
.lg-divider{display:flex;align-items:center;gap:.75rem;margin:.75rem 0;}
.lg-div-line{flex:1;height:1px;background:var(--border);}
.lg-div-txt{font-size:.55rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);}
.lg-secure{display:flex;align-items:center;justify-content:center;gap:6px;font-size:.58rem;letter-spacing:.12em;color:var(--dim);margin-top:1rem;}
`;

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form,    setForm]    = useState({ email: '', password: '', captcha: '' });
  const [show,    setShow]    = useState(false);
  const [captcha, setCaptcha] = useState(makeCaptcha());
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(params.get('registered') ? '✓ Cuenta creada. Inicia sesión.' : '');
  const [loading, setLoading] = useState(false);
  const [dark,    setDark]    = useState(localStorage.getItem('ds_theme') !== 'light');

  useEffect(() => {
    document.body.classList.toggle('light-mode', !dark);
    localStorage.setItem('ds_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.email || !form.password) return setError('Completa todos los campos.');
    if (form.captcha.trim() !== captcha) {
      setError('CAPTCHA incorrecto. Inténtalo de nuevo.');
      setCaptcha(makeCaptcha()); setForm(f => ({ ...f, captcha: '' })); return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email: form.email, password: form.password });
      localStorage.setItem('ds_token', data.token);
      localStorage.setItem('ds_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('authchange'));
      const role = data.user?.role_name;
      navigate(role === 'admin' || role === 'vendedor' ? '/admin' : '/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Credenciales inválidas.');
      setCaptcha(makeCaptcha()); setForm(f => ({ ...f, captcha: '' }));
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="cap-filter">
            <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>
      <div className="lg-root">
        <div className="lg-left">
          <div className="lg-bg"/>
          <div className="lg-bg-overlay"/>
          <div className="lg-left-content">
            <p className="lg-brand">Denym<em>Style</em></p>
            <p className="lg-tagline">
              Elegancia urbana redefinida. Minimalismo, lujo y actitud en cada detalle.
              Viste lo que eres, no lo que tienes.
            </p>
          </div>
        </div>
        <div className="lg-right">
          <button className="lg-theme" onClick={() => setDark(d => !d)}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
          </button>

          <div className="lg-card">
            <p className="lg-eyebrow">✦ Acceso seguro</p>
            <h1 className="lg-title">Iniciar Sesión</h1>

            {error   && <div className="lg-alert">{error}</div>}
            {success && <div className="lg-success">{success}</div>}

            <form onSubmit={submit} noValidate>
              <div className="lg-field">
                <label className="lg-label">Correo electrónico</label>
                <div className="lg-wrap">
                  <input className="lg-input" type="email" placeholder="tu@correo.com"
                    value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email"/>
                </div>
              </div>

              <div className="lg-field">
                <label className="lg-label">Contraseña</label>
                <div className="lg-wrap">
                  <input className="lg-input" type={show ? 'text' : 'password'} placeholder="Tu contraseña"
                    value={form.password} onChange={e => set('password', e.target.value)} required autoComplete="current-password"/>
                  <button type="button" className="lg-eye" onClick={() => setShow(s => !s)}>
                    {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <div className="lg-field">
                <label className="lg-label">Verificación CAPTCHA</label>
                <div className="lg-captcha-row">
                  <span className="lg-captcha-box">{captcha}</span>
                  <button type="button" className="lg-captcha-refresh" onClick={() => { setCaptcha(makeCaptcha()); setForm(f => ({ ...f, captcha: '' })); }}>
                    <RefreshCw size={14}/>
                  </button>
                  <input className="lg-input" placeholder="Escribe el código" style={{ flex: 1 }}
                    value={form.captcha} onChange={e => set('captcha', e.target.value)} required/>
                </div>
              </div>

              <button type="submit" className="lg-btn" disabled={loading}>
                {loading ? 'Verificando...' : '✦ Entrar'}
              </button>
            </form>

            <div className="lg-divider" style={{ marginTop: '1.5rem' }}>
              <div className="lg-div-line"/><span className="lg-div-txt">¿No tienes cuenta?</span><div className="lg-div-line"/>
            </div>

            <div className="lg-links">
              <Link to="/registro" className="lg-link lg-link-gold">Crear cuenta gratis →</Link>
              <Link to="/forgot-password" className="lg-link">¿Olvidaste tu contraseña?</Link>
            </div>

            <div className="lg-secure">
              <Shield size={11} style={{ color: 'var(--gold)' }}/> Conexión SSL encriptada
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
