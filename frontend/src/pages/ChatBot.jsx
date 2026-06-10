
import { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Star } from 'react-feather';

const SYSTEM = `Eres Demy, la asistente virtual de moda de DenymStyle — marca boliviana fundada por Marcelo Villalobos en La Paz. Eres elegante, sofisticada y apasionada por la moda urbana.

SOBRE DENYMSTYLE:
- Paleta: negro, crema y dorado
- Colecciones SS26: Noir Urbain, Crème de la Crème
- Colecciones AW25: Dorado Salvaje, Minimalista Feroz  
- Colecciones SS25: Urban Edge, Velvet Society
- Precios: Bs. 190 - Bs. 420
- Envío a toda Bolivia. Recojo gratis (Teleférico Morado / El Prado)
- Entrega estándar Bs. 15 | Express PLUS Bs. 35 (24h)
- Métodos de pago: Depósito BCP, Tarjeta Stripe, QR, Efectivo 50% adelanto

CONTACTO:
- Email: mjkazama01@gmail.com
- Instagram: @gsus_villalobos
- TikTok: @mbappe.png0
- WhatsApp: 69800542

PERSONALIDAD: Elegante pero cercana. Usa vocabulario de moda con naturalidad. Respuestas concisas (máx 120 palabras). Español siempre. Usa ✦ ocasionalmente para separar ideas.`;
const SUGGS = [
  '¿Cuál es la colección más nueva?',
  '¿Cómo combino un blazer negro?',
  '¿Hacen envíos a Cochabamba?',
  'Outfit para una cena elegante',
  '¿Qué materiales usan?',
  '¿Cuánto cuesta el envío express?',
];
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
.cb-root{background:var(--bg);min-height:100vh;font-family:var(--fb);padding:4.5rem 1rem 3rem;}
/* Hero */
.cb-hero{text-align:center;padding:2rem 1rem 2.5rem;position:relative;}
.cb-hero::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:500px;height:200px;background:radial-gradient(ellipse,rgba(201,168,76,.09) 0%,transparent 70%);pointer-events:none;}
.cb-eyebrow{font-size:.58rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold);margin-bottom:.65rem;display:flex;align-items:center;justify-content:center;gap:10px;}
.cb-eyebrow-line{width:32px;height:1px;background:var(--gold-d,#a07830);}
.cb-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:300;color:var(--cream);letter-spacing:.06em;margin:0 0 .5rem;}
.cb-title em{color:var(--gold);font-style:italic;}
.cb-sub{font-size:.72rem;letter-spacing:.08em;color:var(--muted);line-height:1.8;}
/* Layout */
.cb-layout{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem;}
/* Window */
.cb-window{background:var(--bg2);border:1px solid var(--border,rgba(201,168,76,.18));position:relative;}
.cb-window::before,.cb-window::after{content:'';position:absolute;width:16px;height:16px;border-color:rgba(201,168,76,.25);border-style:solid;}
.cb-window::before{top:8px;left:8px;border-width:1px 0 0 1px;}
.cb-window::after{bottom:8px;right:8px;border-width:0 1px 1px 0;}
/* Header */
.cb-head{padding:.9rem 1.25rem;border-bottom:1px solid rgba(201,168,76,.1);background:rgba(201,168,76,.03);display:flex;align-items:center;justify-content:space-between;}
.cb-head-left{display:flex;align-items:center;gap:.7rem;}
.cb-avatar{width:34px;height:34px;background:linear-gradient(135deg,#a07830,#c9a84c);display:flex;align-items:center;justify-content:center;color:#0a0a0a;font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;flex-shrink:0;}
.cb-bot-name{font-family:'Cormorant Garamond',serif;font-size:1rem;color:var(--cream);}
.cb-status{font-size:.55rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:4px;}
.cb-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:pulse 2s ease-in-out infinite;}
.cb-reset{background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;display:flex;transition:color .25s;}
.cb-reset:hover{color:var(--gold);}
/* Messages */
.cb-msgs{height:420px;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:.9rem;scroll-behavior:smooth;}
.cb-msgs::-webkit-scrollbar{width:3px;}
.cb-msgs::-webkit-scrollbar-thumb{background:#a07830;border-radius:2px;}
.cb-msg{display:flex;gap:.65rem;align-items:flex-start;animation:fadeUp .4s ease both;}
.cb-msg-user{flex-direction:row-reverse;}
.cb-msg-av{width:28px;height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;}
.cb-av-bot{background:linear-gradient(135deg,#a07830,#c9a84c);color:#0a0a0a;font-family:'Cormorant Garamond',serif;font-size:.85rem;}
.cb-av-usr{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.2);color:var(--gold);}
.cb-bubble{max-width:76%;padding:.85rem 1rem;font-size:.77rem;letter-spacing:.04em;line-height:1.75;}
.cb-bubble-bot{background:rgba(255,255,255,.04);border:1px solid rgba(201,168,76,.12);color:var(--muted,#c8bfb0);border-radius:0 8px 8px 8px;}
.cb-bubble-usr{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.22);color:var(--cream);border-radius:8px 0 8px 8px;}
.cb-bubble-time{font-size:.52rem;letter-spacing:.1em;color:#3a3530;margin-top:.35rem;text-align:right;}
.cb-bubble-bot .cb-bubble-time{text-align:left;}
/* Typing */
.cb-typing{display:flex;gap:4px;padding:.5rem;}
.cb-typing span{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:typingDot 1.2s ease-in-out infinite;}
.cb-typing span:nth-child(2){animation-delay:.2s;}
.cb-typing span:nth-child(3){animation-delay:.4s;}
@keyframes typingDot{0%,60%,100%{transform:translateY(0);opacity:.3;}30%{transform:translateY(-6px);opacity:1;}}
/* Input */
.cb-input-wrap{border-top:1px solid rgba(201,168,76,.1);padding:.9rem 1.25rem;display:flex;gap:.6rem;align-items:flex-end;background:rgba(201,168,76,.02);}
.cb-input{flex:1;background:rgba(255,255,255,.03);border:1px solid var(--border,rgba(201,168,76,.18));outline:none;color:var(--cream);font-family:'Montserrat',sans-serif;font-size:.78rem;letter-spacing:.04em;resize:none;padding:.65rem .9rem;line-height:1.55;max-height:100px;transition:border-color .25s,box-shadow .25s;}
.cb-input::placeholder{color:#3a3530;}
.cb-input:focus{border-color:rgba(201,168,76,.5);box-shadow:0 0 0 3px rgba(201,168,76,.06);}
.cb-send{width:42px;height:42px;background:linear-gradient(135deg,#a07830,#c9a84c);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0a0a0a;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);transition:box-shadow .25s,transform .25s;flex-shrink:0;}
.cb-send:hover:not(:disabled){box-shadow:0 4px 16px rgba(201,168,76,.35);transform:translateY(-1px);}
.cb-send:disabled{opacity:.4;cursor:not-allowed;}
/* Suggestions */
.cb-sugg-label{font-size:.55rem;letter-spacing:.28em;text-transform:uppercase;color:#3a3530;margin-bottom:.65rem;display:flex;align-items:center;gap:7px;}
.cb-sugg-label::after{content:'';flex:1;height:1px;background:rgba(201,168,76,.1);}
.cb-sugg-grid{display:flex;flex-wrap:wrap;gap:.45rem;}
.cb-sugg-btn{font-family:'Montserrat',sans-serif;font-size:.63rem;letter-spacing:.1em;color:var(--muted);background:transparent;border:1px solid rgba(201,168,76,.12);padding:.45rem .85rem;cursor:pointer;text-align:left;transition:border-color .25s,color .25s,background .25s;line-height:1.4;}
.cb-sugg-btn:hover{border-color:rgba(201,168,76,.35);color:var(--gold);background:rgba(201,168,76,.04);}
.cb-sugg-btn:disabled{opacity:.4;cursor:not-allowed;}
/* Info cards */
.cb-info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.1);}
.cb-info-card{background:var(--bg2);padding:1.1rem 1rem;text-align:center;transition:background .25s;}
.cb-info-card:hover{background:rgba(201,168,76,.04);}
.cb-info-icon{font-size:1.1rem;color:var(--gold);margin-bottom:.5rem;display:block;}
.cb-info-title{font-family:'Cormorant Garamond',serif;font-size:.9rem;color:var(--cream);margin-bottom:.2rem;}
.cb-info-desc{font-size:.6rem;letter-spacing:.06em;color:var(--muted);line-height:1.6;}
`;
const getTime = () => new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
export default function ChatBot() {
  const [msgs,    setMsgs]    = useState([{
    role: 'assistant',
    content: 'Bienvenida a DenymStyle. Soy Demy, tu asesora de moda personal. ✦ Estoy aquí para ayudarte a encontrar la prenda perfecta, crear outfits irresistibles o conocer nuestras colecciones. ¿En qué puedo inspirarte hoy?',
    time: getTime(),
  }]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const endRef  = useRef();
  const inputRef= useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const send = async (text) => {
    const txt = text || input.trim();
    if (!txt || loading) return;
    const userMsg = { role: 'user', content: txt, time: getTime() };
    const updated = [...msgs, userMsg];
    setMsgs(updated);
    setInput('');
    setLoading(true);
    try {
      const apiMsgs = updated.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM,
          messages: apiMsgs,
        }),
      });
      const data  = await res.json();
      const reply = data.content?.map(b => b.text || '').join('') || 'Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.';
      setMsgs(prev => [...prev, { role: 'assistant', content: reply, time: getTime() }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Disculpa, tuve un problema de conexión. ¿Podrías intentarlo de nuevo? — Demy ✦', time: getTime() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const reset = () => setMsgs([{ role: 'assistant', content: '¡Hola de nuevo! Soy Demy ✦ ¿En qué puedo ayudarte hoy?', time: getTime() }]);

  return (
    <>
      <style>{styles}</style>
      <div className="cb-root">
        <div className="cb-hero">
          <div className="cb-eyebrow"><span className="cb-eyebrow-line"/>Asistente IA<span className="cb-eyebrow-line"/></div>
          <h1 className="cb-title">Tu asesora de <em>moda</em></h1>
          <p className="cb-sub">Demy conoce cada prenda, colección y tendencia de DenymStyle.</p>
        </div>

        <div className="cb-layout">
          <div className="cb-window">
            <div className="cb-head">
              <div className="cb-head-left">
                <div className="cb-avatar">D</div>
                <div>
                  <p className="cb-bot-name">Demy</p>
                  <p className="cb-status"><span className="cb-dot"/> En línea</p>
                </div>
              </div>
              <button className="cb-reset" onClick={reset} title="Reiniciar chat"><RotateCcw size={15}/></button>
            </div>

            <div className="cb-msgs">
              {msgs.map((m, i) => (
                <div key={i} className={`cb-msg ${m.role==='user'?'cb-msg-user':''}`}>
                  <div className={`cb-msg-av ${m.role==='assistant'?'cb-av-bot':'cb-av-usr'}`}>
                    {m.role==='assistant'?'D':'Tú'}
                  </div>
                  <div className={`cb-bubble ${m.role==='assistant'?'cb-bubble-bot':'cb-bubble-usr'}`}>
                    {m.content}
                    <p className="cb-bubble-time">{m.time}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="cb-msg">
                  <div className="cb-msg-av cb-av-bot">D</div>
                  <div className="cb-bubble cb-bubble-bot">
                    <div className="cb-typing"><span/><span/><span/></div>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            <div className="cb-input-wrap">
              <textarea ref={inputRef} className="cb-input" rows={1}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Escribe tu consulta... (Enter para enviar)"
                disabled={loading}
              />
              <button className="cb-send" onClick={() => send()} disabled={loading || !input.trim()}>
                <Send size={16}/>
              </button>
            </div>
          </div>
          <div>
            <div className="cb-sugg-label"><Star size={11} style={{color:'var(--gold)'}}/> Preguntas frecuentes</div>
            <div className="cb-sugg-grid">
              {SUGGS.map((s,i) => (
                <button key={i} className="cb-sugg-btn" onClick={() => send(s)} disabled={loading}>{s}</button>
              ))}
            </div>
          </div>
          <div className="cb-info-grid">
            {[
              ['✦','Asesoría moda','Outfits, tendencias y consejos personalizados'],
              ['◈','Colecciones',  'Detalles de cada temporada y prendas'],
              ['◇','Envíos',       'Tiempos, costos y opciones de entrega'],
              ['○','Contacto',     'WhatsApp 69800542 | @gsus_villalobos'],
            ].map(([ic,ti,de]) => (
              <div key={ti} className="cb-info-card">
                <span className="cb-info-icon">{ic}</span>
                <p className="cb-info-title">{ti}</p>
                <p className="cb-info-desc">{de}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}