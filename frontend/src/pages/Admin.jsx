import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Package, Users, ShoppingBag, AlertTriangle,
  FileText, Plus, Edit2, Trash2, Eye, LogOut, Settings,
  Menu, X, Sun, Moon, Download, RefreshCw
} from 'react-feather';
const API = '/api';
const GOLD = '#c9a84c'; const BLK = '#0a0a0a'; const CRM = '#f5f0e8';
const PIE_COLORS = ['#c9a84c','#e2c278','#a07830','#7a5a30','#4a3a20'];
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;}
.adm-root{display:flex;min-height:100vh;background:var(--bg);color:var(--cream);font-family:var(--fb);}
/* SIDEBAR */
.adm-sb{width:220px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:50;transition:transform .3s;}
.adm-sb.closed{transform:translateX(-100%);}
@media(max-width:900px){.adm-sb{transform:translateX(-100%);}  .adm-sb.open{transform:translateX(0);}}
.adm-sb-head{padding:1.5rem 1.25rem 1rem;border-bottom:1px solid var(--border);}
.adm-sb-brand{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:300;color:var(--cream);letter-spacing:.1em;}
.adm-sb-brand em{color:#c9a84c;font-style:italic;}
.adm-sb-role{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:#c9a84c;margin-top:.25rem;}
.adm-nav{flex:1;padding:.75rem 0;overflow-y:auto;}
.adm-nav-sec{font-size:.52rem;letter-spacing:.28em;text-transform:uppercase;color:var(--dim);padding:.7rem 1.25rem .2rem;}
.adm-nav-btn{display:flex;align-items:center;gap:.65rem;width:100%;background:none;border:none;border-left:2px solid transparent;padding:.65rem 1.25rem;cursor:pointer;color:var(--muted);font-family:var(--fb);font-size:.68rem;letter-spacing:.08em;text-decoration:none;transition:color .2s,background .2s,border-color .2s;}
.adm-nav-btn:hover{color:#c9a84c;background:rgba(201,168,76,.05);}
.adm-nav-btn.active{color:#c9a84c;background:rgba(201,168,76,.08);border-left-color:#c9a84c;}
.adm-nav-btn.danger{color:#c07060;} .adm-nav-btn.danger:hover{background:rgba(192,112,96,.06);}
.adm-sb-foot{padding:.75rem 1.25rem;border-top:1px solid var(--border);}
/* MAIN */
.adm-main{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh;}
@media(max-width:900px){.adm-main{margin-left:0;}}
.adm-top{background:var(--bg2);border-bottom:1px solid var(--border);padding:0 1.5rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:30;}
.adm-top-title{font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--cream);display:flex;align-items:center;gap:.5rem;}
.adm-top-right{display:flex;align-items:center;gap:.75rem;}
.adm-icon-btn{background:none;border:none;cursor:pointer;color:var(--muted);display:flex;padding:5px;transition:color .25s;}
.adm-icon-btn:hover{color:#c9a84c;}
.adm-mob-btn{display:none;} @media(max-width:900px){.adm-mob-btn{display:flex;}}
.adm-content{padding:1.5rem;flex:1;}
/* STAT CARDS */
.adm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:1rem;margin-bottom:1.5rem;}
.adm-stat{background:var(--bg2);border:1px solid var(--border);padding:1.25rem;position:relative;overflow:hidden;transition:border-color .3s,transform .3s;}
.adm-stat:hover{border-color:rgba(201,168,76,.35);transform:translateY(-3px);}
.adm-stat::after{content:'';position:absolute;bottom:-20px;right:-10px;width:80px;height:80px;background:radial-gradient(circle,rgba(201,168,76,.08),transparent 70%);}
.adm-stat-icon{color:#c9a84c;margin-bottom:.75rem;}
.adm-stat-n{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--cream);line-height:1;}
.adm-stat-l{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:.3rem;}
/* CHARTS */
.adm-charts{display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem;}
@media(max-width:1100px){.adm-charts{grid-template-columns:1fr;}}
.adm-chart-card{background:var(--bg2);border:1px solid var(--border);padding:1.25rem;}
.adm-chart-title{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--cream);margin-bottom:1rem;letter-spacing:.03em;}
/* TABLE */
.adm-tcard{background:var(--bg2);border:1px solid var(--border);overflow:hidden;margin-bottom:1.5rem;}
.adm-thead{padding:.9rem 1.25rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;}
.adm-thead-title{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--cream);}
.adm-thead-actions{display:flex;gap:.5rem;flex-wrap:wrap;}
.adm-twrap{overflow-x:auto;}
table.adm-tbl{width:100%;border-collapse:collapse;}
.adm-tbl th{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);padding:.7rem 1rem;text-align:left;background:rgba(201,168,76,.04);border-bottom:1px solid var(--border);}
.adm-tbl td{padding:.7rem 1rem;border-bottom:1px solid rgba(201,168,76,.05);color:var(--cream);font-size:.72rem;letter-spacing:.04em;}
.adm-tbl tr:hover td{background:rgba(201,168,76,.03);}
/* BADGE */
.adm-bdg{display:inline-block;font-size:.55rem;letter-spacing:.16em;text-transform:uppercase;padding:2px 8px;font-weight:600;}
.adm-bdg-ok{background:rgba(90,184,122,.15);color:#5ab87a;}
.adm-bdg-warn{background:rgba(201,168,76,.15);color:#c9a84c;}
.adm-bdg-err{background:rgba(192,112,96,.12);color:#c07060;}
.adm-bdg-blue{background:rgba(100,150,200,.12);color:#6496c8;}
/* ACTION BTNS */
.adm-act{background:none;border:none;cursor:pointer;padding:4px;color:var(--muted);transition:color .2s;display:inline-flex;}
.adm-act:hover{color:#c9a84c;} .adm-act.del:hover{color:#c07060;}
/* GOLD BTN */
.adm-btn{font-family:var(--fb);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:#0a0a0a;background:#c9a84c;border:none;padding:.5rem 1.1rem;cursor:pointer;display:inline-flex;align-items:center;gap:5px;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);transition:background .25s;}
.adm-btn:hover{background:#e2c278;}
.adm-btn-ghost{font-family:var(--fb);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);background:transparent;border:1px solid var(--border);padding:.5rem 1.1rem;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:border-color .25s,color .25s;}
.adm-btn-ghost:hover{border-color:#c9a84c;color:#c9a84c;}
/* MODAL */
.adm-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;}
.adm-modal{background:var(--bg2);border:1px solid var(--border);width:100%;max-width:500px;max-height:90vh;overflow-y:auto;}
.adm-modal-head{padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
.adm-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--cream);}
.adm-modal-body{padding:1.25rem 1.5rem;}
.adm-modal-footer{padding:1rem 1.5rem;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:.5rem;}
.adm-minput{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--border);outline:none;color:var(--cream);font-family:var(--fb);font-size:.78rem;padding:.6rem .85rem;transition:border-color .25s;margin-top:.35rem;margin-bottom:.75rem;box-sizing:border-box;}
.adm-minput:focus{border-color:rgba(201,168,76,.5);}
.adm-mlabel{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);}
/* TABS */
.adm-tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:1.5rem;overflow-x:auto;}
.adm-tab{font-family:var(--fb);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;background:none;border:none;border-bottom:2px solid transparent;padding:.85rem 1.1rem;cursor:pointer;color:var(--muted);white-space:nowrap;transition:color .25s,border-color .25s;}
.adm-tab:hover{color:#c9a84c;} .adm-tab.active{color:#c9a84c;border-bottom-color:#c9a84c;}
/* Alert stock */
.adm-stock-alert{background:rgba(192,112,96,.08);border:1px solid rgba(192,112,96,.2);padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;font-size:.72rem;color:#c07060;margin-bottom:1rem;}
/* Overlay mobile */
.adm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:40;}
`;
const getBadge = (estado) => {
  const m = { pagado:'ok',entregado:'ok',pendiente:'warn',procesando:'blue',enviado:'blue',cancelado:'err',devuelto:'err',aprobado:'ok',rechazado:'err',verificando:'warn' };
  return `adm-bdg adm-bdg-${m[estado]||'warn'}`;
};

const NAV_ITEMS = [
  { tab:'dashboard', icon:<TrendingUp size={15}/>, label:'Dashboard' },
  { tab:'productos',  icon:<Package size={15}/>,    label:'Productos' },
  { tab:'categorias', icon:<Package size={15}/>,    label:'Categorías' },
  { tab:'ordenes',    icon:<ShoppingBag size={15}/>, label:'Órdenes' },
  { tab:'inventario', icon:<Package size={15}/>,    label:'Inventario' },
  { tab:'usuarios',   icon:<Users size={15}/>,      label:'Usuarios' },
  { tab:'logs',       icon:<Eye size={15}/>,        label:'Log acceso' },
];

export default function Admin() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('ds_token');
  const user     = JSON.parse(localStorage.getItem('ds_user')||'null');
  const hdrs     = { Authorization: `Bearer ${token}` };

  const [tab,    setTab]    = useState('dashboard');
  const [mob,    setMob]    = useState(false);
  const [dark,   setDark]   = useState(localStorage.getItem('ds_theme') !== 'light');
  const [stats,  setStats]  = useState(null);
  const [prods,  setProds]  = useState([]);
  const [cats,   setCats]   = useState([]);
  const [ords,   setOrds]   = useState([]);
  const [inv,    setInv]    = useState([]);
  const [users,  setUsers]  = useState([]);
  const [logs,   setLogs]   = useState([]);
  const [modal,  setModal]  = useState(null);
  const [mForm,  setMForm]  = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.body.classList.toggle('light-mode', !dark);
    localStorage.setItem('ds_theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    if (!token || !['admin','vendedor'].includes(user?.role_name)) { navigate('/login'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [s,p,c,o,i,u,l] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: hdrs }),
        axios.get(`${API}/productos?limit=100`, { headers: hdrs }),
        axios.get(`${API}/categorias`, { headers: hdrs }),
        axios.get(`${API}/ordenes`, { headers: hdrs }),
        axios.get(`${API}/admin/inventario`, { headers: hdrs }),
        axios.get(`${API}/admin/usuarios`, { headers: hdrs }),
        axios.get(`${API}/admin/logs?limit=100`, { headers: hdrs }),
      ]);
      setStats(s.data);
      setProds(p.data.products||[]);
      setCats(c.data||[]);
      setOrds(o.data||[]);
      setInv(i.data||[]);
      setUsers(u.data||[]);
      setLogs(l.data||[]);
    } catch (e) { console.error(e.message); }
  };

  const dlPDF = async (type) => {
    const res = await axios.get(`${API}/admin/pdf/${type}`, { headers: hdrs, responseType: 'blob' });
    const a   = document.createElement('a');
    a.href    = URL.createObjectURL(res.data);
    a.download= `${type}_${Date.now()}.pdf`;
    a.click();
  };

  const delProd = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    await axios.delete(`${API}/productos/${id}`, { headers: hdrs });
    setProds(p => p.filter(x => x.product_id !== id));
  };

  const delUser = async (id) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    await axios.delete(`${API}/admin/usuarios/${id}`, { headers: hdrs });
    setUsers(u => u.filter(x => x.user_id !== id));
  };

  const delCat = async (id) => {
    if (!window.confirm('¿Eliminar categoría?')) return;
    await axios.delete(`${API}/categorias/${id}`, { headers: hdrs });
    setCats(c => c.filter(x => x.categoria_id !== id));
  };

  const saveModal = async () => {
    setSaving(true);
    try {
      if (modal === 'prod-nuevo') {
        await axios.post(`${API}/productos`, mForm, { headers: hdrs });
      } else if (modal === 'prod-editar') {
        await axios.put(`${API}/productos/${mForm.product_id}`, mForm, { headers: hdrs });
      } else if (modal === 'cat-nuevo') {
        await axios.post(`${API}/categorias`, mForm, { headers: hdrs });
      } else if (modal === 'cat-editar') {
        await axios.put(`${API}/categorias/${mForm.categoria_id}`, mForm, { headers: hdrs });
      }
      setModal(null); loadAll();
    } catch (e) { alert(e?.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const logout = () => {
    localStorage.removeItem('ds_user'); localStorage.removeItem('ds_token');
    navigate('/login');
  };

  const filteredProds = prods.filter(p => !search || p.nombre.toLowerCase().includes(search.toLowerCase()));
  const filteredOrds  = ords.filter(o => !search || o.fullname?.toLowerCase().includes(search.toLowerCase()) || String(o.order_id).includes(search));

  const tabLabel = NAV_ITEMS.find(n => n.tab === tab)?.label || 'Admin';

  return (
    <>
      <style>{styles}</style>
      <div className="adm-root">
        {mob && <div className="adm-overlay" onClick={() => setMob(false)}/>}
        <aside className={`adm-sb ${mob ? 'open' : ''}`}>
          <div className="adm-sb-head">
            <p className="adm-sb-brand">Denym<em>Style</em></p>
            <p className="adm-sb-role">✦ {user?.role_name || 'admin'}</p>
          </div>
          <nav className="adm-nav">
            <p className="adm-nav-sec">Principal</p>
            {NAV_ITEMS.map(n => (
              <button key={n.tab} className={`adm-nav-btn ${tab===n.tab?'active':''}`}
                onClick={() => { setTab(n.tab); setMob(false); }}>
                {n.icon} {n.label}
              </button>
            ))}
            <p className="adm-nav-sec">Reportes</p>
            <button className="adm-nav-btn" onClick={() => dlPDF('ventas')}><Download size={15}/> PDF Ventas</button>
            <button className="adm-nav-btn" onClick={() => dlPDF('inventario')}><Download size={15}/> PDF Inventario</button>
            <p className="adm-nav-sec">Sistema</p>
            <Link to="/" className="adm-nav-btn"><Package size={15}/> Ver tienda</Link>
          </nav>
          <div className="adm-sb-foot">
            <button className="adm-nav-btn" onClick={() => { setDark(d=>!d); }}>
              {dark ? <Sun size={15}/> : <Moon size={15}/>} {dark ? 'Modo día' : 'Modo noche'}
            </button>
            <button className="adm-nav-btn danger" onClick={logout}><LogOut size={15}/> Cerrar sesión</button>
          </div>
        </aside>
        <div className="adm-main">
          <header className="adm-top">
            <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
              <button className="adm-icon-btn adm-mob-btn" onClick={() => setMob(m=>!m)}><Menu size={20}/></button>
              <span className="adm-top-title">{tabLabel}</span>
            </div>
            <div className="adm-top-right">
              <input
                placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--cream)',outline:'none',padding:'.35rem .75rem',fontSize:'.72rem',fontFamily:'var(--fb)',width:160}}
              />
              <button className="adm-icon-btn" onClick={loadAll} title="Recargar"><RefreshCw size={16}/></button>
              <span style={{fontSize:'.68rem',color:'var(--muted)'}}>{user?.fullname}</span>
            </div>
          </header>

          <div className="adm-content">
            {tab === 'dashboard' && stats && (
              <>
                <div className="adm-stats">
                  {[
                    { icon:<TrendingUp size={20}/>, n:`Bs.${parseFloat(stats.resumen?.ventas?.ingresos||0).toFixed(0)}`, l:'Ingresos totales' },
                    { icon:<ShoppingBag size={20}/>, n:stats.resumen?.ventas?.total_ord||0, l:'Órdenes' },
                    { icon:<Package size={20}/>, n:stats.resumen?.productos?.total||0, l:'Productos activos' },
                    { icon:<Users size={20}/>, n:stats.resumen?.clientes?.total||0, l:'Clientes' },
                    { icon:<AlertTriangle size={20}/>, n:stats.resumen?.pendientes?.total||0, l:'Pendientes' },
                  ].map((s,i) => (
                    <div key={i} className="adm-stat">
                      <div className="adm-stat-icon">{s.icon}</div>
                      <p className="adm-stat-n">{s.n}</p>
                      <p className="adm-stat-l">{s.l}</p>
                    </div>
                  ))}
                </div>

                {stats.stockBajo?.length > 0 && (
                  <div className="adm-stock-alert">
                    <AlertTriangle size={16}/> {stats.stockBajo.length} producto(s) con stock bajo — revisa inventario
                  </div>
                )}

                <div className="adm-charts">
                  <div className="adm-chart-card">
                    <p className="adm-chart-title">Ventas últimos 30 días (Bs.)</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={stats.ventasDia||[]}>
                        <XAxis dataKey="fecha" tick={{fontSize:9,fill:GOLD}} tickFormatter={v=>v?.slice(5)||v}/>
                        <YAxis tick={{fontSize:9,fill:GOLD}}/>
                        <Tooltip contentStyle={{background:BLK,border:`1px solid ${GOLD}`,color:CRM,fontSize:11}}/>
                        <Line type="monotone" dataKey="ingresos" stroke={GOLD} strokeWidth={2} dot={false}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="adm-chart-card">
                    <p className="adm-chart-title">Por categoría</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={stats.ventasCat||[]} dataKey="ingresos" nameKey="categoria" cx="50%" cy="50%" outerRadius={75}>
                          {(stats.ventasCat||[]).map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:BLK,border:`1px solid ${GOLD}`,color:CRM,fontSize:11}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="adm-chart-card" style={{marginBottom:'1.5rem'}}>
                  <p className="adm-chart-title">Top 5 productos más vendidos</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={stats.topProds||[]}>
                      <XAxis dataKey="nombre" tick={{fontSize:8,fill:GOLD}} tickFormatter={v=>v?.substring(0,15)||v}/>
                      <YAxis tick={{fontSize:9,fill:GOLD}}/>
                      <Tooltip contentStyle={{background:BLK,border:`1px solid ${GOLD}`,color:CRM,fontSize:11}}/>
                      <Bar dataKey="vendidos" fill={GOLD} radius={[2,2,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            {tab === 'productos' && (
              <div className="adm-tcard">
                <div className="adm-thead">
                  <span className="adm-thead-title">Productos ({filteredProds.length})</span>
                  <div className="adm-thead-actions">
                    <button className="adm-btn-ghost" onClick={() => dlPDF('inventario')}><FileText size={12}/> PDF</button>
                    <button className="adm-btn" onClick={() => { setMForm({ genero:'unisex', activo:1, nuevo:0, destacado:0 }); setModal('prod-nuevo'); }}>
                      <Plus size={12}/> Agregar
                    </button>
                  </div>
                </div>
                <div className="adm-twrap">
                  <table className="adm-tbl">
                    <thead><tr>
                      <th>ID</th><th>Imagen</th><th>Nombre</th><th>Cat.</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th>
                    </tr></thead>
                    <tbody>
                      {filteredProds.map(p => (
                        <tr key={p.product_id}>
                          <td>#{p.product_id}</td>
                          <td><img src={p.imagen_url} alt="" style={{width:40,height:48,objectFit:'cover'}}/></td>
                          <td style={{maxWidth:160}}>{p.nombre}</td>
                          <td>{p.categoria}</td>
                          <td style={{color:GOLD}}>Bs. {parseFloat(p.precio).toFixed(2)}</td>
                          <td>{p.stock_total}</td>
                          <td><span className={p.activo?'adm-bdg adm-bdg-ok':'adm-bdg adm-bdg-err'}>{p.activo?'Activo':'Inactivo'}</span></td>
                          <td>
                            <button className="adm-act" onClick={() => { setMForm({...p}); setModal('prod-editar'); }}><Edit2 size={14}/></button>
                            <button className="adm-act del" onClick={() => delProd(p.product_id)}><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === 'categorias' && (
              <div className="adm-tcard">
                <div className="adm-thead">
                  <span className="adm-thead-title">Categorías</span>
                  <button className="adm-btn" onClick={() => { setMForm({ activo:1, orden:0 }); setModal('cat-nuevo'); }}><Plus size={12}/> Nueva</button>
                </div>
                <div className="adm-twrap">
                  <table className="adm-tbl">
                    <thead><tr><th>ID</th><th>Nombre</th><th>Slug</th><th>Orden</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                      {cats.map(c => (
                        <tr key={c.categoria_id}>
                          <td>#{c.categoria_id}</td>
                          <td>{c.nombre}</td>
                          <td style={{color:'var(--muted)'}}>{c.slug}</td>
                          <td>{c.orden}</td>
                          <td><span className={c.activo?'adm-bdg adm-bdg-ok':'adm-bdg adm-bdg-err'}>{c.activo?'Activa':'Inactiva'}</span></td>
                          <td>
                            <button className="adm-act" onClick={() => { setMForm({...c}); setModal('cat-editar'); }}><Edit2 size={14}/></button>
                            <button className="adm-act del" onClick={() => delCat(c.categoria_id)}><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === 'ordenes' && (
              <div className="adm-tcard">
                <div className="adm-thead">
                  <span className="adm-thead-title">Órdenes ({filteredOrds.length})</span>
                  <button className="adm-btn-ghost" onClick={() => dlPDF('ventas')}><Download size={12}/> PDF</button>
                </div>
                <div className="adm-twrap">
                  <table className="adm-tbl">
                    <thead><tr><th>#</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th>Entrega</th><th>Fecha</th></tr></thead>
                    <tbody>
                      {filteredOrds.map(o => (
                        <tr key={o.order_id}>
                          <td>#{o.order_id}</td>
                          <td>{o.fullname}</td>
                          <td style={{color:GOLD}}>Bs. {parseFloat(o.total).toFixed(2)}</td>
                          <td>{o.metodo}</td>
                          <td><span className={getBadge(o.estado)}>{o.estado}</span></td>
                          <td>{o.entrega}</td>
                          <td>{new Date(o.creado_en).toLocaleDateString('es')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === 'inventario' && (
              <div className="adm-tcard">
                <div className="adm-thead">
                  <span className="adm-thead-title">Inventario completo</span>
                  <button className="adm-btn-ghost" onClick={() => dlPDF('inventario')}><Download size={12}/> PDF</button>
                </div>
                <div className="adm-twrap">
                  <table className="adm-tbl">
                    <thead><tr><th>Producto</th><th>SKU</th><th>Talla</th><th>Color</th><th>Stock actual</th><th>Mínimo</th><th>Faltante</th></tr></thead>
                    <tbody>
                      {inv.map((it,i) => (
                        <tr key={i}>
                          <td>{it.producto}</td>
                          <td style={{fontFamily:'monospace',fontSize:'.7rem',color:'var(--muted)'}}>{it.sku||'-'}</td>
                          <td>{it.talla}</td>
                          <td>{it.color}</td>
                          <td style={{color:it.stock<=2?'#c07060':GOLD,fontWeight:600}}>{it.stock}</td>
                          <td>{it.stock_minimo}</td>
                          <td style={{color:'#c07060'}}>{it.faltante}</td>
                        </tr>
                      ))}
                      {!inv.length && <tr><td colSpan={7} style={{textAlign:'center',color:'var(--muted)',padding:'2rem'}}>Sin alertas de stock ✓</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === 'usuarios' && (
              <div className="adm-tcard">
                <div className="adm-thead"><span className="adm-thead-title">Usuarios ({users.length})</span></div>
                <div className="adm-twrap">
                  <table className="adm-tbl">
                    <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Pwd</th><th>Estado</th><th>Último login</th><th>Acc.</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.user_id}>
                          <td>#{u.user_id}</td>
                          <td>{u.fullname}</td>
                          <td style={{fontSize:'.68rem',color:'var(--muted)'}}>{u.email}</td>
                          <td><span className="adm-bdg adm-bdg-blue">{u.rol}</span></td>
                          <td>
                            <span className={`adm-bdg ${u.pwd_strength==='fuerte'?'adm-bdg-ok':u.pwd_strength==='intermedio'?'adm-bdg-warn':'adm-bdg-err'}`}>
                              {u.pwd_strength}
                            </span>
                          </td>
                          <td><span className={u.activo?'adm-bdg adm-bdg-ok':'adm-bdg adm-bdg-err'}>{u.activo?'Activo':'Inactivo'}</span></td>
                          <td style={{fontSize:'.68rem',color:'var(--muted)'}}>{u.ultimo_login?new Date(u.ultimo_login).toLocaleString('es'):'-'}</td>
                          <td><button className="adm-act del" onClick={() => delUser(u.user_id)}><Trash2 size={14}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === 'logs' && (
              <div className="adm-tcard">
                <div className="adm-thead"><span className="adm-thead-title">Log de acceso ({logs.length})</span></div>
                <div className="adm-twrap">
                  <table className="adm-tbl">
                    <thead><tr><th>Usuario</th><th>IP</th><th>Evento</th><th>Browser</th><th>SO</th><th>Fecha y hora</th></tr></thead>
                    <tbody>
                      {logs.map(l => (
                        <tr key={l.log_id}>
                          <td>{l.fullname||l.log_username||'-'}</td>
                          <td style={{fontFamily:'monospace',fontSize:'.7rem'}}>{l.ip_address}</td>
                          <td>
                            <span className={`adm-bdg ${l.evento==='ingreso'?'adm-bdg-ok':l.evento==='salida'?'adm-bdg-blue':l.evento==='registro'?'adm-bdg-warn':'adm-bdg-err'}`}>
                              {l.evento}
                            </span>
                          </td>
                          <td style={{fontSize:'.68rem',color:'var(--muted)',maxWidth:140}}>{l.browser}</td>
                          <td style={{fontSize:'.68rem',color:'var(--muted)'}}>{l.sistema_op}</td>
                          <td style={{fontSize:'.68rem'}}>{new Date(l.fecha_hora).toLocaleString('es')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
        {modal && (
          <div className="adm-modal-bg" onClick={e => e.target===e.currentTarget && setModal(null)}>
            <div className="adm-modal">
              <div className="adm-modal-head">
                <span className="adm-modal-title">
                  {modal.includes('nuevo') ? 'Nuevo' : 'Editar'} {modal.includes('prod') ? 'Producto' : 'Categoría'}
                </span>
                <button className="adm-act" onClick={() => setModal(null)}><X size={16}/></button>
              </div>
              <div className="adm-modal-body">
                {modal.includes('prod') && (
                  <>
                    {[['nombre','Nombre'],['descripcion_corta','Descripción corta'],['precio','Precio (Bs.)'],['sku','SKU'],['imagen_url','URL Imagen'],['material','Material']].map(([k,l])=>(
                      <div key={k}>
                        <label className="adm-mlabel">{l}</label>
                        <input className="adm-minput" type={k==='precio'?'number':'text'} value={mForm[k]||''} onChange={e=>setMForm(f=>({...f,[k]:e.target.value}))} placeholder={l}/>
                      </div>
                    ))}
                    <label className="adm-mlabel">Género</label>
                    <select className="adm-minput" value={mForm.genero||'unisex'} onChange={e=>setMForm(f=>({...f,genero:e.target.value}))}>
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                      <option value="unisex">Unisex</option>
                    </select>
                    <label className="adm-mlabel">Categoría ID</label>
                    <select className="adm-minput" value={mForm.categoria_id||''} onChange={e=>setMForm(f=>({...f,categoria_id:e.target.value}))}>
                      <option value="">Selecciona...</option>
                      {cats.map(c=><option key={c.categoria_id} value={c.categoria_id}>{c.nombre}</option>)}
                    </select>
                    <div style={{display:'flex',gap:'1rem'}}>
                      {[['destacado','Destacado'],['nuevo','Nuevo'],['activo','Activo']].map(([k,l])=>(
                        <label key={k} style={{display:'flex',alignItems:'center',gap:'.35rem',fontSize:'.68rem',color:'var(--muted)',cursor:'pointer'}}>
                          <input type="checkbox" checked={!!mForm[k]} onChange={e=>setMForm(f=>({...f,[k]:e.target.checked?1:0}))}/> {l}
                        </label>
                      ))}
                    </div>
                  </>
                )}
                {modal.includes('cat') && (
                  <>
                    {[['nombre','Nombre'],['slug','Slug (ej: hombre)'],['descripcion','Descripción'],['orden','Orden']].map(([k,l])=>(
                      <div key={k}>
                        <label className="adm-mlabel">{l}</label>
                        <input className="adm-minput" type={k==='orden'?'number':'text'} value={mForm[k]||''} onChange={e=>setMForm(f=>({...f,[k]:e.target.value}))} placeholder={l}/>
                      </div>
                    ))}
                    <label style={{display:'flex',alignItems:'center',gap:'.35rem',fontSize:'.68rem',color:'var(--muted)',cursor:'pointer'}}>
                      <input type="checkbox" checked={!!mForm.activo} onChange={e=>setMForm(f=>({...f,activo:e.target.checked?1:0}))}/> Activa
                    </label>
                  </>
                )}
              </div>
              <div className="adm-modal-footer">
                <button className="adm-btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button className="adm-btn" onClick={saveModal} disabled={saving}>{saving?'Guardando...':'Guardar'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
