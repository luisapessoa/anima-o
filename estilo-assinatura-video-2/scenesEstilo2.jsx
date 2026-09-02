/* Estilo Assinaturas 2 — "análise de crédito" — vertical brand video (1080×1920), 8 screens.
   Same animation engine/pattern as the first Estilo film. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const NAVY  = '#000051';
const BLUE  = '#173ded';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT  = "'Urbanist', system-ui, sans-serif";
const LOGO_W = 232, LOGO_TOP = 248;
const E = Easing;
const RUNTIME = { showLogo: true, videoBg: true };

const VID_1 = 'assets/bg-1.mp4';
const VID_3 = 'assets/bg-3.mp4';
const VID_4 = 'assets/bg-4.mp4';
const VID_6 = 'assets/bg-6.mp4';
const VID_8 = 'assets/bg-8.mp4';

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)` };
}
function groupIn(lt, dir, d) {
  const p = ease(lt, 0, d || 0.5);
  const off = (1 - p);
  let t = '';
  if (dir === 'up') t = `translateY(${off * 60}px)`;
  else if (dir === 'down') t = `translateY(${off * -60}px)`;
  else if (dir === 'left') t = `translateX(${off * 60}px)`;
  else if (dir === 'right') t = `translateX(${off * -60}px)`;
  else if (dir === 'scale') t = `scale(${0.96 + 0.04 * p})`;
  return { opacity: p, transform: t };
}
/* **text** → bold in the same colour */
function fmt(text, weight, key) {
  const parts = String(text).split('**');
  return React.createElement('span', { key },
    parts.map((p, i) => i % 2 === 1
      ? React.createElement('span', { key: i, style: { fontWeight: weight || 800 } }, p)
      : React.createElement(React.Fragment, { key: i }, p)));
}

/* Background video for the black scenes (Telas 1, 3, 4, 6, 8), per the
   estilo-assinatura-video-1 BgVideo pattern: cover fit, slight scale to
   fill. Black fallback + ready-gated opacity so nothing paints before the
   first frame decodes. `dim` (default on) applies the ~0.6 opacity + dark
   gradient overlay that keeps text-over-video scenes readable; Tela 6's
   video sits in its own black zone above a white text card, so it passes
   dim={false} to show at full brightness with no darkening filter. */
function BgVideo({ src, start, end, speed, shiftY, dim }) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => { if (!readyRef.current) { readyRef.current = true; setReady(true); } }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => { if (!readyRef.current) { readyRef.current = true; setReady(true); } };
  if (!RUNTIME.videoBg) return null;
  const dimOn = dim !== false;
  return (
    <React.Fragment>
      <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1}
        onLoadedData={markReady}
        style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover',
          transform: `translateY(${shiftY || 0}px) scale(1.2)`,
          opacity: ready ? (dimOn ? 0.6 : 1) : 0, transition: 'opacity .25s ease' }} />
      {dimOn ? (
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.30) 45%, rgba(0,0,0,.68) 100%)',
          opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} />
      ) : null}
    </React.Fragment>
  );
}

function Logo({ variant, lt }) {
  const p = ease(lt, 0.12, 0.7);
  const src = variant === 'dark' ? 'assets/estilo/opt-logo-dark.png' : 'assets/estilo/opt-logo-white.png';
  return (
    <img src={src} alt="Estilo Assinaturas"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%',
               transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p,
               width: LOGO_W, height: 'auto', zIndex: 5 }} />
  );
}

const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* ── 1 · BUBBLE: blue speech balloon with a tail, quote inside ── */
function Bubble() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const box = ease(lt, 0.2, 0.6);
  const bx = 100, by = 470, bw = W - 200;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_1} start={0} end={3.7333} speed={0.85} shiftY={-110} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: bx, top: by, width: bw, opacity: box,
        transform: `translateY(${(1 - box) * 34}px) scale(${0.96 + 0.04 * box})`,
        transformOrigin: '20% 100%' }}>
        <div style={{ background: BLUE, borderRadius: 46, padding: '96px 40px', textAlign: 'center' }}>
          {(sc.body || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 0.5 + i * 0.1, 14), color: WHITE, fontWeight: 800,
              fontSize: 52, lineHeight: 1.2, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{ln}</div>
          ))}
        </div>
        <svg width="200" height="120" style={{ position: 'absolute', left: 130, top: '100%',
          marginTop: -44, display: 'block' }}>
          <path d="M 0 0 L 200 0 L 88 106 Z" fill={BLUE} stroke={BLUE} strokeWidth="26"
            strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ── 2 · CAR CARD on white: navy card, car breaking out of the bottom ── */
function CarCard() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const card = ease(lt, 0.2, 0.6);
  const car = ease(lt, 0.9, 0.8);
  const cx = 135, cy = 560, cw = W - 270, ch = 870;
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: cx, top: cy, width: cw, height: ch,
        background: NAVY, borderRadius: 52, opacity: card,
        transform: `translateY(${(1 - card) * 34}px) scale(${0.97 + 0.03 * card})` }} />
      <div style={{ position: 'absolute', left: cx + 60, width: cw - 120, top: cy + 100,
        textAlign: 'center' }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.55 + i * 0.09, 14), color: WHITE, fontWeight: 400,
            fontSize: 46, lineHeight: 1.28 }}>{ln}</div>
        ))}
        <div style={{ marginTop: 46 }}>
          {(sc.tail || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 1.05 + i * 0.09, 14), color: WHITE, fontWeight: 800,
              fontSize: 48, lineHeight: 1.26, letterSpacing: '-0.01em' }}>{ln}</div>
          ))}
        </div>
      </div>
      <img src="assets/estilo/opt-car-taos.png" alt="Volkswagen Taos"
        style={{ position: 'absolute', left: '50%', top: cy + ch - 250, width: 930, height: 'auto',
          transform: `translateX(-50%) translateY(${(1 - car) * 40}px)`, opacity: car }} />
    </div>
  );
}

/* ── 3 · RULES: text framed by two blue horizontal rules (lower third) ── */
function Rules() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const body = sc.body || [];
  const topRule = ease(lt, 0.25, 0.6);
  const botRule = ease(lt, 1.25, 0.6);
  const rTop = 1290, lineH = 62, gap = 46;
  const rBot = rTop + gap + body.length * lineH + gap;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_3} start={0} end={6.0} speed={1} shiftY={-110} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 150, top: rTop, width: W - 300, height: 4,
        background: BLUE, transform: `scaleX(${topRule})`, transformOrigin: 'center' }} />
      <div style={{ position: 'absolute', left: 130, right: 130, top: rTop + gap, textAlign: 'center' }}>
        {body.map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.6 + i * 0.09, 14), color: WHITE, fontWeight: 400,
            fontSize: 48, lineHeight: `${lineH}px` }}>{fmt(ln, 800, i)}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 150, top: rBot, width: W - 300, height: 4,
        background: BLUE, transform: `scaleX(${botRule})`, transformOrigin: 'center' }} />
    </div>
  );
}

/* ── 4 · VRULE: vertical blue rule dropping into a left-aligned paragraph ── */
function VRule() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const draw = ease(lt, 0.3, 0.9);
  const rTop = 0, rH = 430;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_4} start={0} end={6.5} speed={1} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: rTop,
        display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', textAlign: 'left' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 5, height: rH,
            background: BLUE, transform: `scaleY(${draw})`, transformOrigin: 'top' }} />
          <div style={{ paddingTop: rH + 60 }}>
            {(sc.body || []).map((ln, i) => (
              <div key={i} style={{ ...rise(lt, 0.85 + i * 0.09, 16), color: WHITE, fontWeight: 400,
                fontSize: 52, lineHeight: 1.28, whiteSpace: 'nowrap' }}>{fmt(ln, 800, i)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 5 · STARS LIST on navy: 3D stars balloon + heading + dotted list ── */
function StarsList() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const items = sc.items || [];
  const img = ease(lt, 0.2, 0.7);
  const conn = ease(lt, 1.25, 0.8);
  const listTop = 670, lineH = 60, gapRow = 96, GW = 790, GTOP = 380;
  const offsets = []; let acc = 0;
  items.forEach((it) => {
    offsets.push(acc);
    acc += (Array.isArray(it) ? it.length : 1) * lineH + gapRow;
  });
  const listSpan = offsets[offsets.length - 1] || 0;
  return (
    <div style={{ ...shell, background: NAVY }}>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: '50%', top: GTOP + 40, width: GW,
        transform: 'translateX(-46%)' }}>
      <img src="assets/estilo/opt-stars-bubble.png" alt=""
        style={{ position: 'absolute', left: 0, top: 60, width: 520, height: 'auto',
          opacity: img, transform: `translateY(${(1 - img) * -26}px) scale(${0.94 + 0.06 * img})` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 410 }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.7 + i * 0.09, 16), color: WHITE, fontWeight: 800,
            fontSize: 54, lineHeight: 1.16, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 40, top: listTop + 34, width: 4,
        height: listSpan * conn, background: BLUE }} />
      {items.map((it, i) => {
        const p = ease(lt, 1.3 + i * 0.18, 0.55);
        const y = listTop + offsets[i];
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: 30, top: y + 22, width: 24, height: 24,
              borderRadius: 999, background: BLUE, opacity: p, transform: `scale(${0.6 + 0.4 * p})` }} />
            <div style={{ position: 'absolute', left: 100, right: 0, top: y,
              ...rise(lt, 1.3 + i * 0.18, 14) }}>
              {(Array.isArray(it) ? it : [it]).map((ln, j) => (
                <div key={j} style={{ color: WHITE, fontWeight: 400, fontSize: 48,
                  lineHeight: `${lineH}px`, whiteSpace: 'nowrap' }}>{ln}</div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
      </div>
    </div>
  );
}

/* ── 6 · WHITE CARD: big white panel anchored to the bottom of a black screen ── */
function WhiteCard() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const card = ease(lt, 0.2, 0.65);
  const cTop = 1250;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_6} start={0} end={4.3667} speed={0.85} dim={false} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, top: cTop, width: W, height: H - cTop,
        background: WHITE, borderTopLeftRadius: 60, borderTopRightRadius: 60, opacity: card,
        transform: `translateY(${(1 - card) * 60}px)` }} />
      <div style={{ position: 'absolute', left: 150, right: 130, top: cTop + 170 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.6 + i * 0.09, 14), color: NAVY, fontWeight: 400,
            fontSize: 48, lineHeight: 1.28 }}>{ln}</div>
        ))}
        <div style={{ marginTop: 56 }}>
          {(sc.tail || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 1.15 + i * 0.09, 14), color: NAVY, fontWeight: 800,
              fontSize: 50, lineHeight: 1.24, letterSpacing: '-0.01em' }}>{ln}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 7 · NIVUS CARD on navy: white card, car below, closing line ── */
function NivusCard() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const card = ease(lt, 0.2, 0.6);
  const car = ease(lt, 0.85, 0.8);
  return (
    <div style={{ ...shell, background: NAVY }}>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 100, right: 100, top: 540, background: WHITE,
        borderRadius: 44, padding: '76px 56px', textAlign: 'center', opacity: card,
        transform: `translateY(${(1 - card) * 34}px) scale(${0.97 + 0.03 * card})` }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.55 + i * 0.09, 14), color: NAVY, fontWeight: 400,
            fontSize: 46, lineHeight: 1.3 }}>{fmt(ln, 800, i)}</div>
        ))}
      </div>
      <img src="assets/estilo/opt-car-nivus.png" alt="Volkswagen Nivus"
        style={{ position: 'absolute', left: '50%', top: 925, width: 1000, height: 'auto',
          transform: `translateX(-50%) translateY(${(1 - car) * 40}px)`, opacity: car }} />
      <div style={{ position: 'absolute', left: 130, right: 130, top: 1520, textAlign: 'center' }}>
        {(sc.tail || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.35 + i * 0.09, 14), color: WHITE, fontWeight: 400,
            fontSize: 46, lineHeight: 1.3 }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 8 · FINAL: centred bold question, each line underlined in blue ── */
function Final() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const lines = sc.body || [];
  return (
    <div style={{ ...shell, background: BLACK, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start', paddingTop: 470 }}>
      <BgVideo src={VID_8} start={0} end={3.1} speed={0.85} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ ...groupIn(lt, 'up'), textAlign: 'center' }}>
        {lines.map((ln, i) => {
          const ul = ease(lt, 0.55 + i * 0.18, 0.6);
          return (
            <div key={i} style={{ position: 'relative', display: 'block', marginBottom: 10 }}>
              <span style={{ ...rise(lt, 0.2 + i * 0.1, 18), display: 'inline-block',
                position: 'relative', color: WHITE, fontWeight: 800, fontSize: 62,
                lineHeight: 1.18, letterSpacing: '-0.02em' }}>
                {ln}
                <span style={{ position: 'absolute', left: 0, bottom: -6, height: 6,
                  width: `${ul * 100}%`, background: BLUE, borderRadius: 3 }} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LAYOUTS = {
  bubble: Bubble, carcard: CarCard, rules: Rules, vrule: VRule,
  starslist: StarsList, whitecard: WhiteCard, nivuscard: NivusCard, final: Final,
};

const PRELOAD = ['opt-logo-white.png', 'opt-logo-dark.png', 'opt-stars-bubble.png',
  'opt-car-taos.png', 'opt-car-nivus.png'].map((f) => 'assets/estilo/' + f);

function EstiloVideo2() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => {
    PRELOAD.forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  RUNTIME.showLogo = t.showLogo !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Rules; });
  return (
    <React.Fragment>
      <SceneStage width={W} height={H} scenes={window.OM_SCENES}
        playback={window.OM_PLAYBACK} bg={BLACK} transition="cut">
        {children}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Vídeo" />
        <TweakToggle label="Mostrar logo" value={t.showLogo !== false}
          onChange={(v) => setTweak('showLogo', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.EstiloVideo2 = EstiloVideo2;
