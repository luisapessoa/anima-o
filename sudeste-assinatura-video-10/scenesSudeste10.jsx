/* Sudeste Assinatura — VÍDEO 10 (1080×1920). Frota por assinatura PJ.
   1 preta (vídeo, palavras justificadas), 2 branca (caixa + 3 carros), 3 verde-água (2 parágrafos + círculos),
   4 branca com faixa de vídeo à esquerda → faixa abre para a tela 5 preta (vídeo cheio). */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;

const W = 1080, H = 1920;
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', WHITE = '#ffffff', YEL = '#f2ff46';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200, CAR = 'assets/carro-tera-preto.webp';
const E = Easing;
const RT = { showLogo: true, videoBg: true };
const STRIP_W = 150;

// Vídeo A (Tela 1, capa) e vídeo B (um único clipe contínuo — tocado em
// parte pela faixa estreita da Tela 4 e depois em tela cheia na Tela 5).
const VID_A = 'assets/videos/videoA.mp4';
const VID_B = 'assets/videos/videoB.mp4';

function BgVideo({ src, start, end, speed, overlay, fixed, op }) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => { if (!readyRef.current) { readyRef.current = true; setReady(true); } }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => { if (!readyRef.current) { readyRef.current = true; setReady(true); } };
  if (!RT.videoBg) {
    return <div style={{ position: 'absolute', inset: 0, background: BLACK }} />;
  }
  const videoStyle = fixed
    ? { position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover',
        opacity: ready ? (op == null ? 1 : op) : 0, transition: 'opacity .25s ease' }
    : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        opacity: ready ? (op == null ? 1 : op) : 0, transition: 'opacity .25s ease' };
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: BLACK }} />
      <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1} onLoadedData={markReady} style={videoStyle} />
      {overlay ? <div style={{ position: 'absolute', inset: 0, background: overlay,
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} /> : null}
    </React.Fragment>
  );
}

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function easeIO(lt, delay, d) { return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function pop(lt, delay, d) { const x = clamp((lt - delay) / (d || 0.7), 0, 1); return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11); }
function rise(lt, delay, px, d) { const p = ease(lt, delay, d); return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 22 : px)}px)` }; }
function rich(text, accent, w) {
  return String(text).split('**').map((p, i) => i % 2 === 1
    ? <span key={i} style={{ color: accent, fontWeight: w || 700 }}>{p}</span>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}
function Lines({ list, lt, delay, step, style, accent, w }) {
  return (list || []).map((ln, i) => (
    <div key={i} style={{ ...rise(lt, (delay || 0) + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>{rich(ln, accent, w)}</div>
  ));
}
function Logo({ dark }) {
  return <img src={dark ? 'assets/logo-dark.png' : 'assets/logo-white.png'} alt="Sudeste Assinaturas" decoding="sync" loading="eager"
    style={{ position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)', width: LOGO_W, height: 'auto', zIndex: 6 }} />;
}
function Draw({ d, p, color, w }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={w || 3} strokeLinecap="round" strokeLinejoin="round" pathLength="1"
    strokeDasharray="1" strokeDashoffset={1 - p}></path>;
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
const BOLD = (fs, lh) => ({ fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.03em' });
const REG = (fs, lh) => ({ fontWeight: 400, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' });
const LIGHT = (fs, lh) => ({ fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.04em' });
function exitOut(lt, dur) { const p = E.easeInCubic(clamp((lt - (dur - 0.55)) / 0.5, 0, 1)); return { opacity: 1 - p, transform: `translateY(${-50 * p}px)` }; }
/* tela branca com a faixa de vídeo entra deslizando da direita e para exatamente na posição final */
function SlideIn({ lt, dur }) {
  const p = easeIO(lt, dur - 0.8, 0.8);
  if (p <= 0) return null;
  return <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: WHITE, transform: `translateX(${(1 - p) * W}px)` }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: STRIP_W, background: BLACK }}></div>
  </div>;
}
function NextPanel({ lt, dur, color, dir }) {
  const p = easeIO(lt, dur - 0.75, 0.75);
  if (p <= 0) return null;
  const clip = dir === 'left' ? `inset(0 0 0 ${(1 - p) * 100}%)` : `inset(${(1 - p) * 100}% 0 0 0)`;
  return <div style={{ position: 'absolute', inset: 0, background: color, clipPath: clip, zIndex: 20 }}></div>;
}

/* ícones (viewBox 160) */
const GEAR = Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, c = Math.cos(a), sn = Math.sin(a);
  return `M${(80 + 46 * c).toFixed(1)} ${(80 + 46 * sn).toFixed(1)} L${(80 + 60 * c).toFixed(1)} ${(80 + 60 * sn).toFixed(1)}`; }).join(' ');
const IC = {
  doc: (p, c) => <React.Fragment>
    <Draw d="M44 20 H100 L124 44 V140 H44 Z" p={p} color={c} w={9} />
    <Draw d="M62 74 H106 M62 96 H106 M62 118 H90" p={clamp(p * 1.6 - 0.6, 0, 1)} color={c} w={9} />
  </React.Fragment>,
  lic: (p, c) => <React.Fragment>
    <Draw d="M80 20 L130 38 V80 C130 110 108 130 80 142 C52 130 30 110 30 80 V38 Z" p={p} color={c} w={9} />
    <Draw d="M56 82 L74 100 L106 66" p={clamp(p * 1.6 - 0.6, 0, 1)} color={c} w={9} />
  </React.Fragment>,
  man: (p, c) => <React.Fragment>
    <g transform="translate(8 8) scale(6)"><Draw d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" p={p} color={c} w={1.5} /></g>
  </React.Fragment>,
  rev: (p, c) => <React.Fragment>
    <Draw d="M26 38 H134 V138 H26 Z M26 66 H134 M54 22 V48 M106 22 V48" p={p} color={c} w={9} />
    <Draw d="M58 102 L74 118 L104 86" p={clamp(p * 1.6 - 0.6, 0, 1)} color={c} w={9} />
  </React.Fragment>,
};

/* 1 · preto (vídeo) — palavras distribuídas/justificadas na tela, entrando uma a uma */
function Cover() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const rows = sc.rows || []; let k = 0;
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_A} start={0} end={6.7} speed={1} overlay="rgba(0,0,0,0.4)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 110, right: 110, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 120, ...exitOut(lt, sc.dur) }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: row.length === 1 ? (i % 2 ? 'flex-end' : 'flex-start') : 'space-between' }}>
            {row.map((w, j) => {
              const d = 0.3 + (k++) * 0.11;
              const hl = (sc.hl || []).indexOf(i + ':' + j) >= 0;
              return <div key={j} style={{ ...BOLD(128, 124), letterSpacing: '-0.045em', whiteSpace: 'nowrap', color: hl ? MINT : WHITE, ...rise(lt, d, 40, 0.55) }}>{w}</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 2 · branco — caixa verde escuro com a pergunta, seta, texto; 1 carro → 3 carros (frota) */
function Fleet() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const box = easeIO(lt, 0.2, 0.7);
  const spread = easeIO(lt, sc.spreadAt || 3.6, 1.1);
  const car0 = ease(lt, 1.4, 0.9);
  const CW = 1180;
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 440, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ alignSelf: 'stretch', position: 'relative', background: MINT, padding: '64px 40px 80px', textAlign: 'center',
          clipPath: `inset(0 0 ${(1 - box) * 100}% 0)` }}>
          <Lines list={sc.box} lt={lt} delay={0.5} step={0.12} style={{ ...LIGHT(92, 98), color: TEAL }} accent={TEAL} w={600} />
        </div>
        <div style={{ marginTop: -50, width: 100, height: 100, borderRadius: '50%', background: WHITE, position: 'relative', zIndex: 2,
          boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(lt, 1.1, 0.6)})` }}>
          <svg width="46" height="46" viewBox="0 0 46 46"><path d="M23 8 V37 M12 26 L23 37 L34 26" fill="none" stroke={TEAL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </div>
        <div style={{ marginTop: 40, textAlign: 'center', color: TEAL }}>
          <Lines list={sc.sub} lt={lt} delay={1.6} step={0.12} style={REG(52, 64)} accent={TEAL} />
        </div>
      </div>
      {[-1, 1].map((side) => (
        <img key={side} src={CAR} alt="" style={{ position: 'absolute', left: (W - CW) / 2, top: 1210, width: CW, height: 'auto', zIndex: 2,
          opacity: spread > 0 ? 1 : 0, filter: `brightness(${1 + 0.15 * spread})`, transformOrigin: '50% 80%',
          transform: `translate(${side * 330 * spread}px, ${-110 * spread}px) scale(${1 - 0.22 * spread})` }} />
      ))}
      <img src={CAR} alt="" style={{ position: 'absolute', left: (W - CW) / 2, top: 1210, width: CW, height: 'auto', zIndex: 3,
        opacity: car0, transform: `translateY(${(1 - car0) * 60}px) scale(1)` }} />
      <NextPanel lt={lt} dur={sc.dur} color={MINT} dir="up" />
    </div>
  );
}

/* 3 · verde-água — parágrafo em cima, seta ligando ao parágrafo de baixo; círculos com ícones */
function Care() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const items = sc.items || [];
  const D = 200, OV = 18, rowW = items.length * D - (items.length - 1) * OV;
  const ln = easeIO(lt, 1.8, 0.8);
  return (
    <div style={{ ...shell, background: MINT }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', inset: 0, ...exitOut(lt, sc.dur) }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', color: TEAL, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Lines list={sc.top} lt={lt} delay={0.4} step={0.12} style={LIGHT(68, 76)} accent={TEAL} w={600} />
        </div>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <Draw d="M540 830 V1110" p={ln} color={TEAL} w={3} />
          <Draw d="M522 1092 L540 1110 L558 1092" p={clamp(ln * 3 - 2, 0, 1)} color={TEAL} w={3} />
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1160, textAlign: 'center', color: TEAL, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Lines list={sc.bottom} lt={lt} delay={2.5} step={0.1} style={REG(50, 62)} accent={TEAL} />
        </div>
        <div style={{ position: 'absolute', left: (W - rowW) / 2, top: 1460, width: rowW, height: D }}>
          {items.map((it, i) => {
            const d0 = 3.6 + i * 0.35;
            return (
              <div key={i} style={{ position: 'absolute', left: i * (D - OV), top: 0, width: D, height: D, borderRadius: '50%', boxSizing: 'border-box',
                border: `3px solid ${TEAL}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${pop(lt, d0, 0.7)})` }}>
                <svg width="92" height="92" viewBox="0 0 160 160">{IC[it.icon](easeIO(lt, d0 + 0.15, 0.8), TEAL)}</svg>
              </div>
            );
          })}
        </div>
      </div>
      <NextPanel lt={lt} dur={sc.dur} color={WHITE} dir="left" />
    </div>
  );
}

/* 4 · branco com faixa de vídeo à esquerda; no fim, a faixa abre da esquerda p/ direita e vira a tela 5 */
function Strip() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const SW = STRIP_W, X = 250;
  const inW = easeIO(lt, 0.1, 0.7) * SW;
  const open = E.easeInOutCubic(clamp((lt - (sc.dur - 1.0)) / 1.0, 0, 1));
  const stripW = inW + (W - SW) * open;
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RT.showLogo ? <img src="assets/logo-dark.png" alt="Sudeste Assinaturas" style={{ position: 'absolute', top: LOGO_TOP, left: X, width: 520, height: 'auto' }} /> : null}
      <div style={{ position: 'absolute', left: X, top: 480, color: TEAL }}>
        <Lines list={sc.title} lt={lt} delay={0.6} step={0.14} style={LIGHT(118, 118)} accent={MINT} w={600} />
      </div>
      <div style={{ position: 'absolute', left: X, top: 934, width: 420, height: 4, background: MINT, transform: `scaleX(${easeIO(lt, 1.4, 0.7)})`, transformOrigin: 'left' }}></div>
      <div style={{ position: 'absolute', left: X, top: 1040, color: TEAL }}>
        <Lines list={sc.body} lt={lt} delay={1.8} step={0.1} style={REG(52, 64)} accent={TEAL} />
      </div>
      {/* área do vídeo (mesmo vídeo da tela 5) — janela estreita revelando a borda esquerda do quadro cheio */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: stripW, overflow: 'hidden', zIndex: 10 }}>
        <BgVideo src={VID_B} start={0} end={7} speed={1} fixed />
      </div>
    </div>
  );
}

/* 5 · preto (vídeo cheio) — informações na parte de baixo */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_B} start={7} end={13} speed={1} fixed overlay="rgba(0,0,0,0.35)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center' }}>
      <div style={{ color: WHITE }}>
        <Lines list={sc.head} lt={lt} delay={0.4} step={0.12} style={BOLD(76, 82)} />
        <div style={{ width: 120, height: 6, background: MINT, margin: '44px 0 40px', transform: `scaleX(${easeIO(lt, 1.0, 0.6)})`, transformOrigin: 'left' }}></div>
        <Lines list={sc.sub} lt={lt} delay={1.2} step={0.12} style={REG(52, 64)} accent={MINT} />
      </div>
      </div>
    </div>
  );
}

const LAYOUTS = { cover: Cover, fleet: Fleet, care: Care, strip: Strip, closing: Closing };

function SudesteVideo10() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(() => {
    ['assets/logo-dark.png', 'assets/logo-white.png', CAR].forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Cover; });
  return (
    <React.Fragment>
      <SceneStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={BLACK} transition="cut">
        {children}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Vídeo" />
        <TweakToggle label="Mostrar logo" value={t.showLogo !== false} onChange={(v) => setTweak('showLogo', v)} />
        <TweakToggle label="Vídeo de fundo" value={t.videoBg !== false} onChange={(v) => setTweak('videoBg', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.SudesteVideo10 = SudesteVideo10;
