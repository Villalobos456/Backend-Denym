// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, Smartphone, DollarSign, Briefcase, Zap, Package, Check, ArrowLeft, Lock } from 'react-feather';
import axios from 'axios';

const API = '/api';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
.ck-root{background:var(--bg);min-height:100vh;padding:5rem 1rem 4rem;font-family:var(--fb);}
.ck-wrap{max-width:1060px;margin:0 auto;}
.ck-steps{display:flex;align-items:center;justify-content:center;margin-bottom:2.5rem;flex-wrap:wrap;gap:.35rem;}
.ck-step{display:flex;align-items:center;gap:.4rem;}
.ck-step-num{width:30px;height:30px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:600;color:var(--muted);transition:all .3s;}
.ck-step-num.done{background:var(--gold,#c9a84c);border-color:var(--gold,#c9a84c);color:#0a0a0a;}
.ck-step-num.active{border-color:var(--gold,#c9a84c);color:var(--gold,#c9a84c);}
.ck-step-lbl{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);}
.ck-step-lbl.active{color:var(--gold,#c9a84c);}
.ck-step-line{width:36px;height:1px;background:var(--border);margin:0 .35rem;}
.ck-layout{display:grid;grid-template-columns:1fr 360px;gap:2rem;}
@media(max-width:900px){.ck-layout{grid-template-columns:1fr;}}
.ck-card{background:var(--bg2);border:1px solid var(--border);padding:1.75rem;margin-bottom:1.25rem;position:relative;}
.ck-card::before,.ck-card::after{content:'';position:absolute;width:14px;height:14px;border-color:rgba(201,168,76,.25);border-style:solid;}
.ck-card::before{top:8px;left:8px;border-width:1px 0 0 1px;}
.ck-card::after{bottom:8px;right:8px;border-width:0 1px 1px 0;}
.ck-card-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--cream);margin-bottom:1.1rem;display:flex;align-items:center;gap:.5rem;}
.ck-grid2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}
@media(max-width:500px){.ck-grid2{grid-template-columns:1fr;}}
.ck-field{margin-bottom:.8rem;}
.ck-label{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.35rem;}
.ck-input{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--border);outline:none;color:var(--cream);font-family:'Montserrat',sans-serif;font-size:.78rem;padding:.62rem .85rem;transition:border-color .25s;box-sizing:border-box;}
.ck-input:focus{border-color:rgba(201,168,76,.5);}
.ck-options{display:flex;flex-direction:column;gap:.75rem;}
.ck-opt{border:1px solid var(--border);padding:1rem;cursor:pointer;transition:border-color .25s,background .25s;display:flex;align-items:flex-start;gap:.75rem;position:relative;}
.ck-opt:hover{border-color:rgba(201,168,76,.3);background:rgba(201,168,76,.03);}
.ck-opt.sel{border-color:#c9a84c;background:rgba(201,168,76,.05);}
.ck-opt-radio{width:16px;height:16px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
.ck-opt.sel .ck-opt-radio{border-color:#c9a84c;background:#c9a84c;}
.ck-opt-icon{color:#c9a84c;flex-shrink:0;}
.ck-opt-name{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--cream);margin-bottom:.2rem;}
.ck-opt-desc{font-size:.65rem;letter-spacing:.06em;color:var(--muted);line-height:1.65;}
.ck-opt-price{position:absolute;top:.9rem;right:.9rem;font-size:.7rem;letter-spacing:.1em;color:#c9a84c;}
.ck-opt-time{font-size:.58rem;color:#c9a84c;margin-top:.25rem;}
.ck-iframe-panel{margin-top:.85rem;border:1px solid rgba(201,168,76,.12);overflow:hidden;}
.ck-iframe-label{font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:#c9a84c;padding:.55rem .85rem;background:rgba(201,168,76,.06);border-bottom:1px solid rgba(201,168,76,.1);}
.ck-info-rows{padding:1.1rem;}
.ck-info-row{display:flex;justify-content:space-between;font-size:.72rem;padding:.35rem 0;border-bottom:1px solid rgba(201,168,76,.07);}
.ck-info-key{color:var(--muted);}
.ck-info-val{color:var(--cream);font-family:monospace;font-size:.7rem;}
.ck-qr-box{display:flex;flex-direction:column;align-items:center;padding:1.25rem;}
.ck-qr-img{width:140px;height:140px;background:white;padding:8px;margin-bottom:.75rem;}
.ck-qr-note{font-size:.65rem;color:var(--muted);text-align:center;}
.ck-sum-item{display:flex;gap:.75rem;padding:.7rem 0;border-bottom:1px solid rgba(201,168,76,.07);}
.ck-sum-img{width:55px;height:65px;object-fit:cover;flex-shrink:0;}
.ck-sum-name{font-family:'Cormorant Garamond',serif;font-size:.95rem;color:var(--cream);}
.ck-sum-qty{font-size:.62rem;color:var(--muted);}
.ck-sum-price{font-family:'Cormorant Garamond',serif;color:#c9a84c;margin-left:auto;white-space:nowrap;}
.ck-sum-total{display:flex;justify-content:space-between;align-items:flex-end;padding:1rem 0 0;}
.ck-sum-total-lbl{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);}
.ck-sum-total-amt{font-family:'Cormorant Garamond',serif;font-size:1.75rem;font-weight:300;color:var(--cream);}
.ck-actions{display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-top:.75rem;}
.ck-btn-next{font-family:'Montserrat',sans-serif;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:#0a0a0a;background:linear-gradient(135deg,#a07830,#c9a84c,#e2c278,#c9a84c);background-size:200% 200%;background-position:0% 50%;border:none;padding:.75rem 1.75rem;cursor:pointer;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);transition:background-position .4s,box-shadow .3s;display:flex;align-items:center;gap:7px;flex:1;justify-content:center;}
.ck-btn-next:hover:not(:disabled){background-position:100% 50%;box-shadow:0 6px 24px rgba(201,168,76,.35);}
.ck-btn-next:disabled{opacity:.45;cursor:not-allowed;}
.ck-btn-back{font-family:'Montserrat',sans-serif;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);background:transparent;border:1px solid var(--border);padding:.75rem 1.1rem;cursor:pointer;display:flex;align-items:center;gap:5px;transition:border-color .25s,color .25s;}
.ck-btn-back:hover{border-color:#c9a84c;color:#c9a84c;}
.ck-success{text-align:center;padding:4rem 2rem;}
.ck-success-sym{font-family:'Cormorant Garamond',serif;font-size:4rem;color:#c9a84c;margin-bottom:1.5rem;line-height:1;}
.ck-success-title{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:300;color:var(--cream);margin-bottom:.75rem;}
`;

const PAYMENTS = [
  { id:1, code:'deposito', icon:<Briefcase size={18}/>,  name:'Depósito bancario',      desc:'BCP / Tigo Money — Comprobante al WhatsApp 69800542' },
  { id:2, code:'tarjeta',  icon:<CreditCard size={18}/>, name:'Tarjeta crédito/débito', desc:'Pago seguro procesado por Stripe' },
  { id:3, code:'qr',       icon:<Smartphone size={18}/>, name:'Código QR',              desc:'Escanea desde tu app bancaria o billetera digital' },
  { id:4, code:'efectivo', icon:<DollarSign size={18}/>, name:'Efectivo con adelanto',  desc:'50% de adelanto para confirmar el pedido' },
];

const DELIVERY = [
  { id:1, icon:<MapPin size={18}/>,  name:'Recojo gratuito',   desc:'Punto: Teleférico Morado / El Prado de La Paz',                        price:0,  time:'2-3 días' },
  { id:2, icon:<Package size={18}/>, name:'Entrega estándar',  desc:'A domicilio en La Paz — entrega sin prioridad',                        price:15, time:'3-5 días' },
  { id:3, icon:<Zap size={18}/>,     name:'⚡ Express PLUS',  desc:'Prioridad máxima — 24h con seguimiento en tiempo real.',               price:35, time:'24 horas' },
];

const QRCode = () => (
  <div className="ck-qr-box">
    <div className="ck-qr-img">
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <rect width="80" height="80" fill="white"/>
        <rect x="5" y="5" width="22" height="22" fill="none" stroke="#000" strokeWidth="3"/>
        <rect x="53" y="5" width="22" height="22" fill="none" stroke="#000" strokeWidth="3"/>
        <rect x="5" y="53" width="22" height="22" fill="none" stroke="#000" strokeWidth="3"/>
        <rect x="10" y="10" width="12" height="12" fill="#000"/>
        <rect x="58" y="10" width="12" height="12" fill="#000"/>
        <rect x="10" y="58" width="12" height="12" fill="#000"/>
        <rect x="33" y="5"  width="7" height="7" fill="#000"/>
        <rect x="43" y="5"  width="7" height="7" fill="#000"/>
        <rect x="33" y="15" width="7" height="7" fill="#000"/>
        <rect x="5"  y="33" width="7" height="7" fill="#000"/>
        <rect x="15" y="33" width="7" height="7" fill="#000"/>
        <rect x="33" y="33" width="7" height="7" fill="#000"/>
        <rect x="43" y="43" width="7" height="7" fill="#000"/>
        <rect x="55" y="33" width="7" height="7" fill="#000"/>
        <rect x="65" y="43" width="7" height="7" fill="#000"/>
      </svg>
    </div>
    <p className="ck-qr-note">Escanea con tu app bancaria<br/>o billetera Tigo / BCP</p>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('ds_token');
  const user     = JSON.parse(localStorage.getItem('ds_user') || 'null');
  const items    = JSON.parse(localStorage.getItem('ds_cart') || '[]');

  const [step,    setStep]    = useState(1);
  const [pay,     setPay]     = useState(1);
  const [del,     setDel]     = useState(1);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    nombre: user?.fullname || '', telefono: user?.telefono || '',
    direccion: user?.direccion || '', ciudad: user?.ciudad || 'La Paz',
    punto_recojo: 'Teleférico Morado / El Prado', notas: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const selDel  = DELIVERY.find(d => d.id === del);
  const cargo   = selDel?.price || 0;
  const sub     = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total   = sub + cargo;

  const confirm = async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/ordenes`, {
        metodo_pago_id: pay, entrega_id: del,
        subtotal: sub, cargo_entrega: cargo, descuento: 0, total,
        nombre_receptor: form.nombre, telefono_entrega: form.telefono,
        direccion_entrega: form.direccion, ciudad_entrega: form.ciudad,
        punto_recojo: form.punto_recojo, notas: form.notas,
        items: items.map(i => ({
          product_id: i.product_id, name: i.name, price: i.price,
          quantity: i.quantity, subtotal: i.price * i.quantity,
          image_url: i.image_url, talla_id: null, color_id: null
        })),
      }, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('ds_cart', '[]');
      window.dispatchEvent(new Event('cartchange'));
      setDone(true);
    } catch (e) {
      alert(e?.response?.data?.message || 'Error al crear la orden');
    }
    setLoading(false);
  };

  if (!items.length && !done) return (
    <>
      <style>{styles}</style>
      <div className="ck-root">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Carrito vacío</p>
          <Link to="/ventas" className="ds-btn">Ir a la tienda</Link>
        </div>
      </div>
    </>
  );

  if (done) return (
    <>
      <style>{styles}</style>
      <div className="ck-root">
        <div className="ck-success">
          <p className="ck-success-sym">✦</p>
          <h1 className="ck-success-title">¡Pedido confirmado!</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '2rem', lineHeight: 1.8 }}>
            Tu orden ha sido registrada.<br/>
            Te contactaremos por WhatsApp al <strong style={{ color: '#c9a84c' }}>{form.telefono || '69800542'}</strong>.
          </p>
          <Link to="/" className="ds-btn">Volver al inicio</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ck-root">
        <div className="ck-wrap">
          <div className="ck-steps">
            {['Entrega', 'Pago', 'Confirmar'].map((s, i) => (
              <div key={s} className="ck-step">
                <div className={`ck-step-num ${step > i+1 ? 'done' : step === i+1 ? 'active' : ''}`}>
                  {step > i+1 ? <Check size={13} /> : i+1}
                </div>
                <span className={`ck-step-lbl ${step === i+1 ? 'active' : ''}`}>{s}</span>
                {i < 2 && <div className="ck-step-line" />}
              </div>
            ))}
          </div>

          <div className="ck-layout">
            <div>
              {step === 1 && (
                <>
                  <div className="ck-card">
                    <p className="ck-card-title"><MapPin size={15} style={{ color: '#c9a84c' }} /> Datos de entrega</p>
                    <div className="ck-grid2">
                      <div className="ck-field"><label className="ck-label">Nombre receptor</label><input className="ck-input" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Tu nombre" /></div>
                      <div className="ck-field"><label className="ck-label">Teléfono WhatsApp</label><input className="ck-input" value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="69800542" /></div>
                    </div>
                    <div className="ck-field"><label className="ck-label">Dirección</label><input className="ck-input" value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Calle, número, zona" /></div>
                    <div className="ck-field"><label className="ck-label">Ciudad</label><input className="ck-input" value={form.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="La Paz" /></div>
                    <div className="ck-field"><label className="ck-label">Notas adicionales</label><input className="ck-input" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Instrucciones especiales..." /></div>
                  </div>

                  <div className="ck-card">
                    <p className="ck-card-title"><Package size={15} style={{ color: '#c9a84c' }} /> Tipo de entrega</p>
                    <div className="ck-options">
                      {DELIVERY.map(d => (
                        <div key={d.id} className={`ck-opt ${del === d.id ? 'sel' : ''}`} onClick={() => { setDel(d.id); if (d.id === 1) set('punto_recojo', 'Teleférico Morado / El Prado'); }}>
                          <div className="ck-opt-radio">{del === d.id && <Check size={10} style={{ color: '#0a0a0a' }} />}</div>
                          <div className="ck-opt-icon">{d.icon}</div>
                          <div style={{ flex: 1 }}>
                            <p className="ck-opt-name">{d.name}</p>
                            <p className="ck-opt-desc">{d.desc}</p>
                            <p className="ck-opt-time">⏱ {d.time}</p>
                            {d.id === 1 && del === 1 && (
                              <div style={{ marginTop: '.5rem' }}>
                                <label className="ck-label">Punto de encuentro</label>
                                <input className="ck-input" value={form.punto_recojo} onChange={e => set('punto_recojo', e.target.value)} placeholder="Ej: Teleférico morado, El Prado..." />
                              </div>
                            )}
                          </div>
                          <span className="ck-opt-price">{d.price === 0 ? 'Gratis' : `+Bs.${d.price}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="ck-btn-next" onClick={() => setStep(2)}>Continuar al pago →</button>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="ck-card">
                    <p className="ck-card-title"><CreditCard size={15} style={{ color: '#c9a84c' }} /> Método de pago</p>
                    <div className="ck-options">
                      {PAYMENTS.map(m => (
                        <div key={m.id} className={`ck-opt ${pay === m.id ? 'sel' : ''}`} onClick={() => setPay(m.id)}>
                          <div className="ck-opt-radio">{pay === m.id && <Check size={10} style={{ color: '#0a0a0a' }} />}</div>
                          <div className="ck-opt-icon">{m.icon}</div>
                          <div><p className="ck-opt-name">{m.name}</p><p className="ck-opt-desc">{m.desc}</p></div>
                        </div>
                      ))}
                    </div>
                    {pay === 2 && (
                      <div className="ck-iframe-panel">
                        <p className="ck-iframe-label">Pago con tarjeta — Stripe</p>
                        <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,.02)' }}>
                          <div style={{ border: '1px solid var(--border)', padding: '1rem', background: 'var(--bg)', marginBottom: '.75rem' }}>
                            <p style={{ fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: '.1em' }}>•••• •••• •••• ••••</p>
                          </div>
                          <p style={{ fontSize: '.65rem', color: 'var(--muted)', lineHeight: 1.65 }}>🔒 Pago procesado de forma segura por Stripe. DenymStyle no almacena datos de tarjetas.</p>
                        </div>
                      </div>
                    )}
                    {pay === 3 && (
                      <div className="ck-iframe-panel">
                        <p className="ck-iframe-label">Escanea el QR</p>
                        <QRCode />
                      </div>
                    )}
                    {pay === 1 && (
                      <div className="ck-iframe-panel">
                        <p className="ck-iframe-label">Datos de depósito bancario</p>
                        <div className="ck-info-rows">
                          {[['Banco', 'BNB'], ['Cuenta', '6789-0123456'], ['Titular', 'DenymStyle / Marcelo Villalobos'], ['Tigo Money', '69800542']].map(([k, v]) => (
                            <div key={k} className="ck-info-row"><span className="ck-info-key">{k}</span><span className="ck-info-val">{v}</span></div>
                          ))}
                          <p style={{ fontSize: '.65rem', color: '#c9a84c', marginTop: '.5rem' }}>📱 Envía comprobante: WhatsApp 69800542</p>
                        </div>
                      </div>
                    )}
                    {pay === 4 && (
                      <div className="ck-iframe-panel">
                        <p className="ck-iframe-label">Efectivo — adelanto del 50%</p>
                        <div className="ck-info-rows">
                          {[['Adelanto (50%)', `Bs. ${(total / 2).toFixed(2)}`], ['Al recibir', `Bs. ${(total / 2).toFixed(2)}`], ['Total', `Bs. ${total.toFixed(2)}`]].map(([k, v]) => (
                            <div key={k} className="ck-info-row"><span className="ck-info-key">{k}</span><span className="ck-info-val" style={{ color: '#c9a84c' }}>{v}</span></div>
                          ))}
                          <p style={{ fontSize: '.65rem', color: '#c9a84c', marginTop: '.5rem' }}>📱 Coordina: WhatsApp 69800542</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ck-actions">
                    <button className="ck-btn-back" onClick={() => setStep(1)}><ArrowLeft size={13} /> Volver</button>
                    <button className="ck-btn-next" onClick={() => setStep(3)}>Revisar pedido →</button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="ck-card">
                    <p className="ck-card-title">✦ Confirmar pedido</p>
                    {[
                      ['Receptor',  form.nombre],
                      ['Teléfono',  form.telefono],
                      ['Entrega',   selDel?.name],
                      ['Punto',     del === 1 ? form.punto_recojo : form.direccion],
                      ['Pago',      PAYMENTS.find(p => p.id === pay)?.name],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
                        <span style={{ fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{k}</span>
                        <span style={{ fontSize: '.75rem', color: 'var(--cream)' }}>{v || '-'}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem', fontSize: '.62rem', color: 'var(--muted)' }}>
                    <Lock size={12} style={{ color: '#c9a84c' }} /> Pago seguro — SSL encriptado
                  </div>
                  <div className="ck-actions">
                    <button className="ck-btn-back" onClick={() => setStep(2)}><ArrowLeft size={13} /> Volver</button>
                    <button className="ck-btn-next" onClick={confirm} disabled={loading}>
                      {loading ? 'Procesando...' : `Confirmar — Bs. ${total.toFixed(2)}`}
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <div className="ck-card" style={{ position: 'sticky', top: '80px' }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: 'var(--cream)', marginBottom: '1rem' }}>Resumen</p>
                {items.map(i => (
                  <div key={i.product_id} className="ck-sum-item">
                    <img src={i.image_url} alt={i.name} className="ck-sum-img" loading="lazy" />
                    <div style={{ flex: 1 }}>
                      <p className="ck-sum-name">{i.name}</p>
                      <p className="ck-sum-qty">×{i.quantity}</p>
                    </div>
                    <span className="ck-sum-price">Bs. {(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ marginTop: '.85rem' }}>
                  {[['Subtotal', `Bs. ${sub.toFixed(2)}`], ['Envío', cargo === 0 ? 'Gratis' : `Bs. ${cargo.toFixed(2)}`]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: 'var(--muted)', padding: '.35rem 0', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
                      <span>{k}</span><span>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="ck-sum-total">
                  <p className="ck-sum-total-lbl">Total</p>
                  <p className="ck-sum-total-amt">Bs. {total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
