// src/pages/Carrito.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'react-feather';

const cartStyles = `
.cart-root { background: var(--bg); min-height: 100vh; padding: 5rem 1rem 4rem; font-family: var(--fb); }
.cart-wrap { max-width: 1100px; margin: 0 auto; }
.cart-header { margin-bottom: 2.5rem; }
.cart-title { font-family: var(--fd); font-size: clamp(2rem,5vw,3.5rem); font-weight: 300; color: var(--cream); letter-spacing: 0.06em; }
.cart-title em { color: var(--gold); font-style: italic; }
.cart-count { font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-top: 0.4rem; }
.cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; }
@media(max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }

/* Item */
.cart-item {
  display: flex; gap: 1.25rem;
  padding: 1.25rem;
  background: var(--bg2); border: 1px solid var(--border2);
  margin-bottom: 0.75rem;
  transition: border-color var(--transition), transform var(--transition);
  animation: fadeUp .5s ease both;
}
.cart-item:hover { border-color: rgba(201,168,76,0.2); transform: translateY(-2px); }
.cart-item-img { width: 110px; height: 130px; object-fit: cover; flex-shrink: 0; filter: brightness(.9); }
.cart-item-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.cart-item-name { font-family: var(--fd); font-size: 1.15rem; color: var(--cream); letter-spacing: .04em; margin-bottom: .25rem; }
.cart-item-meta { font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); display: flex; gap: .75rem; margin-bottom: .5rem; }
.cart-item-price-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; }
.cart-item-unit { font-size: .7rem; color: var(--muted); letter-spacing: .06em; }
.cart-item-subtotal { font-family: var(--fd); font-size: 1.15rem; color: var(--gold); }

/* Qty control */
.cart-qty { display: flex; align-items: center; gap: .5rem; }
.cart-qty-btn { width: 28px; height: 28px; background: transparent; border: 1px solid var(--border); color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .25s; }
.cart-qty-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,.06); }
.cart-qty-btn:disabled { opacity: .25; cursor: not-allowed; }
.cart-qty-num { font-size: .82rem; color: var(--cream); min-width: 24px; text-align: center; font-weight: 500; }
.cart-del { background: none; border: none; cursor: pointer; color: var(--dim); transition: color .25s; display: flex; align-items: center; padding: 4px; }
.cart-del:hover { color: var(--error); }

/* Empty */
.cart-empty { text-align: center; padding: 4rem 2rem; }
.cart-empty-icon { font-size: 3rem; color: var(--dim); margin-bottom: 1.5rem; }
.cart-empty-title { font-family: var(--fd); font-size: 2rem; font-weight: 300; color: var(--cream); margin-bottom: .75rem; }
.cart-empty-sub { font-size: .75rem; color: var(--muted); margin-bottom: 2rem; }

/* Summary panel */
.cart-summary { background: var(--bg2); border: 1px solid var(--border); padding: 1.75rem; position: sticky; top: 80px; }
.cart-summary-title { font-family: var(--fd); font-size: 1.3rem; color: var(--cream); margin-bottom: 1.25rem; letter-spacing: .04em; }
.cart-summary-row { display: flex; justify-content: space-between; font-size: .75rem; letter-spacing: .06em; color: var(--muted); padding: .5rem 0; border-bottom: 1px solid var(--border2); }
.cart-summary-total { display: flex; justify-content: space-between; align-items: flex-end; padding: 1rem 0 0; }
.cart-summary-total-label { font-size: .62rem; letter-spacing: .22em; text-transform: uppercase; color: var(--muted); }
.cart-summary-total-amount { font-family: var(--fd); font-size: 2rem; font-weight: 300; color: var(--cream); }

/* Cupon */
.cart-cupon-wrap { display: flex; gap: 0; margin-top: 1rem; border: 1px solid var(--border); }
.cart-cupon-input { flex: 1; background: transparent; border: none; outline: none; color: var(--cream); font-family: var(--fb); font-size: .75rem; padding: .6rem .85rem; }
.cart-cupon-input::placeholder { color: var(--dim); }
.cart-cupon-btn { font-family: var(--fb); font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; background: var(--gold); color: #0a0a0a; border: none; padding: 0 1rem; cursor: pointer; font-weight: 600; transition: background .25s; }
.cart-cupon-btn:hover { background: var(--gold-l); }
`;

export default function Carrito() {
  const navigate   = useNavigate();
  const [cupon, setCupon] = useState('');
  const [cuponMsg, setCuponMsg] = useState('');

  // Load from localStorage (real app would use CartContext)
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ds_cart') || '[]'); } catch { return []; }
  });

  const save = (next) => { setItems(next); localStorage.setItem('ds_cart', JSON.stringify(next)); };

  const updateQty = (product_id, talla, color, delta) => {
    const next = items.map(i => {
      if (i.product_id !== product_id || i.talla !== talla || i.color !== color) return i;
      const qty = i.quantity + delta;
      if (qty <= 0) return null;
      return { ...i, quantity: qty, subtotal: i.price * qty };
    }).filter(Boolean);
    save(next);
  };

  const remove = (product_id, talla, color) => {
    save(items.filter(i => !(i.product_id === product_id && i.talla === talla && i.color === color)));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const applyCupon = () => {
    if (cupon.toUpperCase() === 'DENYM10') setCuponMsg('✓ 10% de descuento aplicado');
    else if (cupon.toUpperCase() === 'BIENVENIDO') setCuponMsg('✓ 15% de descuento aplicado');
    else setCuponMsg('✗ Código inválido');
  };

  if (!items.length) return (
    <>
      <style>{cartStyles}</style>
      <div className="cart-root">
        <div className="cart-wrap">
          <div className="cart-empty">
            <div className="cart-empty-icon"><ShoppingBag size={48} style={{color:'var(--dim)'}}/></div>
            <h1 className="cart-empty-title">Tu carrito está <em style={{color:'var(--gold)',fontStyle:'italic'}}>vacío</em></h1>
            <p className="cart-empty-sub">Explora nuestra colección y encuentra la prenda que te define.</p>
            <Link to="/ventas" className="ds-btn">Ver tienda <ArrowRight size={14}/></Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{cartStyles}</style>
      <div className="cart-root">
        <div className="cart-wrap">
          <div className="cart-header">
            <div className="ds-section-label">Tu selección</div>
            <h1 className="cart-title">Mi <em>Carrito</em></h1>
            <p className="cart-count">{items.reduce((s,i)=>s+i.quantity,0)} prenda(s) seleccionada(s)</p>
          </div>

          <div className="cart-layout">
            {/* Items */}
            <div>
              {items.map((item, idx) => (
                <div key={`${item.product_id}-${item.talla}-${item.color}`} className="cart-item" style={{animationDelay:`${idx*.06}s`}}>
                  <img src={item.image_url} alt={item.name} className="cart-item-img" loading="lazy"/>
                  <div className="cart-item-body">
                    <div>
                      <p className="cart-item-name">{item.name}</p>
                      <div className="cart-item-meta">
                        {item.talla && <span>Talla: {item.talla}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="cart-item-unit">Bs. {item.price.toFixed(2)} / unidad</p>
                    </div>
                    <div className="cart-item-price-row">
                      <div className="cart-qty">
                        <button className="cart-qty-btn" disabled={item.quantity<=1} onClick={()=>updateQty(item.product_id,item.talla,item.color,-1)}>
                          <Minus size={12}/>
                        </button>
                        <span className="cart-qty-num">{item.quantity}</span>
                        <button className="cart-qty-btn" onClick={()=>updateQty(item.product_id,item.talla,item.color,1)}>
                          <Plus size={12}/>
                        </button>
                      </div>
                      <span className="cart-item-subtotal">Bs. {(item.price*item.quantity).toFixed(2)}</span>
                      <button className="cart-del" onClick={()=>remove(item.product_id,item.talla,item.color)} title="Eliminar">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="cart-summary ds-card">
                <p className="cart-summary-title">Resumen</p>

                {items.map(i=>(
                  <div key={i.product_id} className="cart-summary-row">
                    <span>{i.name} ×{i.quantity}</span>
                    <span>Bs. {(i.price*i.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {/* Cupón */}
                <div className="cart-cupon-wrap" style={{marginTop:'1rem'}}>
                  <input className="cart-cupon-input" placeholder="Código de descuento" value={cupon} onChange={e=>setCupon(e.target.value)}/>
                  <button className="cart-cupon-btn" onClick={applyCupon}><Tag size={12}/></button>
                </div>
                {cuponMsg && (
                  <p style={{fontSize:'.65rem',color:cuponMsg.startsWith('✓')?'var(--success)':'var(--error)',marginTop:'.35rem',letterSpacing:'.06em'}}>{cuponMsg}</p>
                )}

                <div className="cart-summary-total">
                  <div>
                    <p className="cart-summary-total-label">Total estimado</p>
                    <p style={{fontSize:'.6rem',color:'var(--dim)',letterSpacing:'.1em'}}>+ cargo de envío</p>
                  </div>
                  <span className="cart-summary-total-amount">Bs. {subtotal.toFixed(2)}</span>
                </div>

                <button
                  className="ds-btn" style={{width:'100%',justifyContent:'center',marginTop:'1.25rem'}}
                  onClick={()=>navigate('/checkout')}
                >
                  Proceder al pago <ArrowRight size={14}/>
                </button>

                <Link to="/ventas" className="ds-btn-ghost" style={{width:'100%',justifyContent:'center',marginTop:'.75rem',fontSize:'.6rem'}}>
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
