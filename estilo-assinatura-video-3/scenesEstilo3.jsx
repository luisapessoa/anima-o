/* Estilo Assinaturas 3 — "fim do contrato / liberdade de escolher" — vertical brand video
   (1080×1920), 6 screens. Same engine/pattern as the previous Estilo films. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLUE  = '#173ded';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT  = "'Urbanist', system-ui, sans-serif";
const LOGO_W = 232, LOGO_TOP = 248;
const E = Easing;
const RUNTIME = { showLogo: true };

// Background clips for the 4 video zones — pending client footage.
const VID_2 = 'assets/bg-2.mp4';
const VID_3 = 'assets/bg-3.mp4';
const VID_4 = 'assets/bg-4.mp4';
const VID_6 = 'assets/bg-6.mp4';

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function pop(lt, delay, d) {
  const x = clamp((lt - delay) / (d || 0.7), 0, 1);
  return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)` };
}
/* **text** → bold in the same colour */
function fmt(text, weight, key) {
  const parts = String(text).split('**');
  return React.createElement('span', { key },
    parts.map((p, i) => i % 2 === 1
      ? React.createElement('span', { key: i, style: { fontWeight: weight || 800 } }, p)
      : React.createElement(React.Fragment, { key: i }, p)));
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

/* Full-bleed background video with a 45% black overlay for text contrast
   (used behind text in Telas 3/4/6 — no overlay needed where nothing sits
   on top, e.g. Tela 2's isolated video plate uses VideoSprite directly). */
function BgVideo({ src, start, end, speed }) {
  if (!RUNTIME.videoBg) return null;
  return (
    <React.Fragment>
      <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
    </React.Fragment>
  );
}

/* ── 1 · OPENER: bold centred title, blue rules flanking the last line, blue pill ── */
function Opener() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const lines = sc.head || [];
  const top = 430, lineH = 76;
  const ruleY = top + (lines.length - 1) * lineH + lineH / 2 - 2;
  const rule = ease(lt, 1.0, 0.7);
  const pill = pop(lt, 1.25, 0.85);
  const pillIn = ease(lt, 1.25, 0.45);
  return (
    <div style={{ ...shell, background: BLACK }}>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 70, right: 70, top, textAlign: 'center' }}>
        {lines.map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.4 + i * 0.14, 22), color: WHITE, fontWeight: 800,
            fontSize: 64, lineHeight: `${lineH}px`, letterSpacing: '-0.02em',
            whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 150, top: ruleY, width: 205, height: 4,
        background: BLUE, transform: `scaleX(${rule})`, transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', right: 150, top: ruleY, width: 205, height: 4,
        background: BLUE, transform: `scaleX(${rule})`, transformOrigin: 'right' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: ruleY + 82,
        display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: BLUE, borderRadius: 22, padding: '20px 52px', opacity: pillIn,
          transform: `translateY(${(1 - pill) * 34}px)` }}>
          <span style={{ color: WHITE, fontWeight: 400, fontSize: 58, lineHeight: 1.1,
            whiteSpace: 'nowrap' }}>{sc.pill}</span>
        </div>
      </div>
    </div>
  );
}

/* ── 2 · BLUE VIDEO: blue screen, heading, video plate (VÍDEO 1), body below ── */
function BlueVideo() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const plate = ease(lt, 0.7, 0.7);
  const plateTop = 660, plateH = 690;
  return (
    <div style={{ ...shell, background: BLUE }}>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 118, right: 100, top: 415 }}>
        {(sc.head || []).map((ln, i) => {
          const p = ease(lt, 0.3 + i * 0.16, 0.6);
          return (
            <div key={i} style={{ overflow: 'hidden', height: 78 }}>
              <div style={{ color: WHITE, fontWeight: 800, fontSize: 60, lineHeight: '78px',
                letterSpacing: '-0.02em', whiteSpace: 'nowrap', opacity: p,
                transform: `translateY(${(1 - p) * 78}px)` }}>{ln}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 125, right: 125, top: plateTop, height: plateH,
        background: BLACK, borderRadius: 60, overflow: 'hidden', opacity: plate,
        transform: `translateY(${(1 - plate) * 30}px) scale(${0.97 + 0.03 * plate})` }}>
        {RUNTIME.videoBg ? (
          <VideoSprite src={VID_2} start={0} end={3.7} speed={0.85}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: 118, right: 60, top: plateTop + plateH + 90 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.35 + i * 0.1, 16), color: WHITE, fontWeight: 400,
            fontSize: 52, lineHeight: '68px', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 3 · LONG VRULE: full-bleed video, blue line runs over it, paragraph in the lower third ── */
function LongVRule() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const body = sc.body || [];
  const draw = ease(lt, 0.2, 1.1);
  const lineH = 74, textTop = 1370;
  const gapTop = textTop - 60, gapBot = textTop + body.length * lineH + 40;
  const tailDraw = ease(lt, 0.95, 0.7);
  return (
    <div style={{ ...shell, background: BLACK }}>
      <div style={{ position: 'absolute', left: 0, top: 340, width: W, height: 940, overflow: 'hidden' }}>
        <BgVideo src={VID_3} start={0} end={1.7667} speed={0.8} />
      </div>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 176, top: 0, width: 4, height: gapTop, zIndex: 4,
        background: BLUE, transform: `scaleY(${draw})`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 166, right: 40, top: textTop, zIndex: 4 }}>
        {body.map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.75 + i * 0.1, 16), color: WHITE, fontWeight: 400,
            fontSize: 54, lineHeight: `${lineH}px`, whiteSpace: 'nowrap' }}>{fmt(ln, 800, i)}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 176, top: gapBot, width: 4, height: H - gapBot, zIndex: 4,
        background: BLUE, transform: `scaleY(${tailDraw})`, transformOrigin: 'top' }} />
    </div>
  );
}

/* ── 4 · LIST LINES: full-bleed video below the text, bold lead-in + left-aligned lines ── */
function LeadLines() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <div style={{ position: 'absolute', left: 0, top: 900, width: W, height: 1020, overflow: 'hidden' }}>
        <BgVideo src={VID_4} start={0} end={1.0} speed={0.8} />
      </div>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 140, right: 80, top: 430, zIndex: 4 }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ opacity: ease(lt, 0.3, 0.45),
            transform: `translateX(${(1 - pop(lt, 0.3, 0.8)) * -60}px)`,
            color: WHITE, fontWeight: 800, fontSize: 58, lineHeight: '76px',
            letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.8 + i * 0.13, 18), color: WHITE, fontWeight: 400,
            fontSize: 56, lineHeight: '76px', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 5 · SAVEIRO CARD: white screen, blue card, pickup breaking out of the card ── */
function SaveiroCard() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const card = ease(lt, 0.2, 0.65);
  const carIn = ease(lt, 0.9, 0.55);
  const car = ease(lt, 0.9, 1.1);
  const cx = 130, cy = 550, cw = 820, ch = 900;
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: cx, top: cy, width: cw, height: ch,
        background: BLUE, borderRadius: 60, opacity: card,
        transform: `translateY(${(1 - card) * 34}px) scale(${0.97 + 0.03 * card})` }} />
      <div style={{ position: 'absolute', left: cx + 40, width: cw - 80, top: cy + 110,
        textAlign: 'center', zIndex: 2 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.55 + i * 0.09, 14), color: WHITE, fontWeight: 400,
            fontSize: 54, lineHeight: '70px', whiteSpace: 'nowrap' }}>{fmt(ln, 800, i)}</div>
        ))}
      </div>
      <img src="assets/estilo/car-saveiro.png" alt="Volkswagen Saveiro Robust"
        style={{ position: 'absolute', left: 100, top: cy + ch - 320, width: 900, height: 'auto',
          zIndex: 3, opacity: carIn, transformOrigin: '38% 100%',
          transform: `scale(${0.82 + 0.18 * car}) translateY(${(1 - car) * 70}px)` }} />
    </div>
  );
}

/* ── 6 · BRACKET: full-bleed video band, paragraph top-left, blue bracket over it, bold close ── */
function Bracket() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const hx = ease(lt, 0.9, 0.5);
  const vy = ease(lt, 1.25, 0.9);
  const bx = 905, by = 590, bh = 880;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <div style={{ position: 'absolute', left: 0, top: 1010, width: W, height: 500, overflow: 'hidden' }}>
        <BgVideo src={VID_6} start={0} end={6.5} speed={1} />
      </div>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 116, right: 200, top: 430, zIndex: 4 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.3 + i * 0.11, 18), color: WHITE, fontWeight: 400,
            fontSize: 54, lineHeight: '74px', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: bx - 90, top: by, width: 94, height: 4, zIndex: 4,
        background: BLUE, transform: `scaleX(${hx})`, transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', left: bx, top: by, width: 4, height: bh, zIndex: 4,
        background: BLUE, transform: `scaleY(${vy})`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 200, right: 116, top: 1540, zIndex: 4,
        textAlign: 'right' }}>
        {(sc.tail || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.55 + i * 0.12, 18), color: WHITE, fontWeight: 800,
            fontSize: 58, lineHeight: '76px', letterSpacing: '-0.02em',
            whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

const LAYOUTS = {
  opener: Opener, bluevideo: BlueVideo, longvrule: LongVRule,
  leadlines: LeadLines, saveirocard: SaveiroCard, bracket: Bracket,
};

const PRELOAD = ['assets/estilo/opt-logo-white.png', 'assets/estilo/opt-logo-dark.png',
  'assets/estilo/car-saveiro.png'];

function EstiloVideo3() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => {
    PRELOAD.forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  RUNTIME.showLogo = t.showLogo !== false;
  RUNTIME.videoBg = t.videoBg !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || LeadLines; });
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
        <TweakToggle label="Vídeos de fundo" value={t.videoBg !== false}
          onChange={(v) => setTweak('videoBg', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.EstiloVideo3 = EstiloVideo3;
