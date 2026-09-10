/* Real Assinatura 3 — "qual SUV você escolheria?" — vertical brand video (1080×1920), 7 screens.
   Same animation engine/pattern as scenesReal2.jsx. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const NAVY  = '#112750';
const SKY   = '#9fd3e5';
const GREY  = '#f0f0f0';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT  = "'Readex Pro', system-ui, sans-serif";
const LOGO_TOP = 210;
const E = Easing;
const RUNTIME = { showLogo: true };

const VID_7 = 'assets/bg-7.mp4';

const PRELOAD = ['assets/real/logo-white.png', 'assets/real/logo-navy.png', 'assets/real/logo-sky.png',
  'assets/real/suv-tera.png', 'assets/real/suv-tcross.png',
  'assets/real/suv-taos.png', 'assets/real/suv-tiguan.png',
  'assets/real/suv-tera-t.png', 'assets/real/suv-tcross-tm.png',
  'assets/real/suv-taos-tm.png', 'assets/real/suv-tiguan-t.png'];

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function pop(lt, delay, d) {
  const x = clamp((lt - delay) / (d || 0.7), 0, 1);
  return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)` };
}

function Logo({ variant, lt }) {
  const p = ease(lt, 0, 0.6);
  const src = variant === 'dark' ? 'assets/real/logo-navy.png'
            : variant === 'sky' ? 'assets/real/logo-sky.png'
            : 'assets/real/logo-white.png';
  return (
    <div style={{ position: 'absolute', top: LOGO_TOP, left: '50%', zIndex: 6,
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p }}>
      <img src={src} alt="Real Assinatura" style={{ height: 66, width: 'auto', display: 'block' }} />
    </div>
  );
}

const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* ── 1 · SUV GRID: grey bg, navy bands, four SUVs, highlighted question ─── */
function SuvGrid() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const bandA = ease(lt, 0.2, 0.65);
  const bandB = ease(lt, 0.4, 0.65);
  const cars = [
    { src: 'assets/real/suv-tcross-tm.png', left: 420, top: 355, width: 600, delay: 0.55, flip: true },
    { src: 'assets/real/suv-tera-t.png',   left: 88,  top: 500, width: 692, delay: 0.75 },
    { src: 'assets/real/suv-taos-tm.png',   left: 370, top: 960, width: 684, delay: 0.95, flip: true },
    { src: 'assets/real/suv-tiguan-t.png', left: 66,  top: 1120, width: 740, delay: 1.15 },
  ];
  return (
    <div style={{ ...shell, background: GREY }}>
      <div style={{ position: 'absolute', left: 0, top: 455, width: 860, height: 334,
        background: NAVY, transform: `scaleX(${bandA})`, transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', left: 420, top: 915, width: 660, height: 334,
        background: NAVY, transform: `scaleX(${bandB})`, transformOrigin: 'right' }} />
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      {cars.map((c, i) => {
        const p = ease(lt, c.delay, 0.7);
        return (
          <img key={i} src={c.src} alt="" style={{ position: 'absolute', left: c.left, top: c.top,
            width: c.width, height: 'auto', opacity: p,
            transform: `translateY(${(1 - p) * 28}px) scale(${0.96 + 0.04 * p})${c.flip ? ' scaleX(-1)' : ''}` }} />
        );
      })}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1560, textAlign: 'center' }}>
        {(sc.head || []).map((ln, i) => {
          const d = 1.4 + i * 0.18;
          const wipe = ease(lt, d, 0.5);
          const txt = ease(lt, d + 0.18, 0.45);
          return (
            <div key={i} style={{ marginBottom: 8, overflow: 'hidden', display: 'block' }}>
              <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden',
                padding: '4px 16px', fontWeight: 700, fontSize: 56, lineHeight: 1.34,
                letterSpacing: '-0.01em', whiteSpace: 'nowrap', color: 'transparent' }}>
                <span style={{ position: 'absolute', inset: 0, background: NAVY,
                  transform: `scaleX(${wipe})`, transformOrigin: 'left' }} />
                <span style={{ position: 'absolute', left: 16, right: 16, top: 4, color: WHITE,
                  opacity: txt, transform: `translateY(${(1 - txt) * 28}px)` }}>{ln}</span>
                <span style={{ visibility: 'hidden' }}>{ln}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 2–5 · MODEL CARD: big model name, SUV, outlined spec box ──────────── */
function ModelCard() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const navy = sc.theme !== 'grey';
  const bg = navy ? NAVY : GREY;
  const title = navy ? SKY : NAVY;
  const text = navy ? WHITE : NAVY;
  const items = sc.items || [];
  const box = ease(lt, 0.7, 0.65);
  const car = pop(lt, 0.45, 0.95);
  const carIn = ease(lt, 0.45, 0.5);
  const boxTop = 985;
  const carW = sc.carW || 1220;
  const carTop = sc.carTop == null ? 510 : sc.carTop;
  const boxH = sc.boxH || 1250;
  const ttl = pop(lt, 0.12, 0.85);
  const ttlIn = ease(lt, 0.12, 0.45);
  return (
    <div style={{ ...shell, background: bg }}>
      {RUNTIME.showLogo ? <Logo variant={navy ? 'white' : 'dark'} lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 130, right: 90, top: 400, zIndex: 2,
        opacity: ttlIn, transform: `translateX(${(1 - ttl) * -180}px)`,
        color: title, fontWeight: 700, fontSize: 150,
        lineHeight: 1, letterSpacing: '-0.03em' }}>{sc.model}</div>
      <div style={{ position: 'absolute', left: 55, right: 55, top: boxTop, height: boxH,
        border: `3px solid ${SKY}`, borderBottom: 'none', opacity: box,
        transform: `scaleY(${0.82 + 0.18 * box})`, transformOrigin: 'top' }} />
      <img src={sc.car} alt={sc.model} style={{ position: 'absolute', left: '50%', top: carTop,
        width: carW, height: 'auto', zIndex: 3, opacity: carIn,
        transform: `translateX(calc(-50% + ${(1 - car) * 260}px)) rotate(${(1 - car) * -2}deg)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: boxTop + 175, zIndex: 4,
        display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'left' }}>
        {items.map((lines, i) => (
          <div key={i} style={{ opacity: ease(lt, 1.0 + i * 0.13, 0.4),
            transform: `translateX(${(1 - pop(lt, 1.0 + i * 0.13, 0.7)) * -70}px)`, display: 'flex',
            alignItems: 'flex-start', gap: 22, marginBottom: 26 }}>
            <div style={{ width: 16, height: 16, background: SKY, flex: '0 0 auto', marginTop: 16,
              transform: `rotate(${(1 - ease(lt, 1.05 + i * 0.13, 0.6)) * 135}deg)` }} />
            <div>
              {lines.map((ln, j) => (
                <div key={j} style={{ color: text, fontWeight: 400, fontSize: 38,
                  lineHeight: '48px', whiteSpace: 'nowrap' }}>{ln}</div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

/* ── 6 · BOX CHAIN: navy, four outlined boxes joined by a line + closer ── */
function BoxChain() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const boxes = sc.boxes || [];
  const boxH = 130, gap = 92, top = 470;
  const BOXW = 590;
  return (
    <div style={{ ...shell, background: NAVY }}>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      {boxes.map((label, i) => {
        const p = ease(lt, 0.25 + i * 0.22, 0.55);
        const y = top + i * (boxH + gap);
        const conn = ease(lt, 0.45 + i * 0.22, 0.4);
        return (
          <React.Fragment key={i}>
            {i < boxes.length - 1 ? (
              <div style={{ position: 'absolute', left: '50%', top: y + boxH + 2, width: 3, height: gap - 4,
                background: SKY, transform: `translateX(-50%) scaleY(${conn})`, transformOrigin: 'top' }} />
            ) : null}
            <div style={{ position: 'absolute', left: '50%', top: y,
              width: BOXW, height: boxH, border: `3px solid ${SKY}`, background: NAVY, zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p,
              transform: `translateX(-50%) translateY(${(1 - p) * 20}px)` }}>
              <span style={{ color: WHITE, fontWeight: 700, fontSize: 60,
                letterSpacing: '-0.01em' }}>{label}</span>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 130, right: 130, top: 1380, textAlign: 'center' }}>
        {(sc.tail || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.35 + i * 0.1, 14), color: WHITE, fontWeight: 400,
            fontSize: 52, lineHeight: 1.28 }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 7 · FINAL RULE: black, sky rule with square, closing question · VIDEO ── */
function FinalRule() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const draw = ease(lt, 0.25, 0.7);
  const ruleY = 1330;
  const vid = ease(lt, 0.1, 0.6);
  return (
    <div style={{ ...shell, background: BLACK }}>
      <div style={{ position: 'absolute', left: 0, top: 340, width: W, height: 900,
        overflow: 'hidden', background: BLACK, opacity: vid,
        transform: `translateY(${(1 - vid) * 30}px)` }}>
        <VideoSprite src={VID_7} start={0} end={6.2} speed={1}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, top: ruleY, width: 145, height: 4,
        background: SKY, transform: `scaleX(${draw})`, transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', left: 133, top: ruleY - 8, width: 20, height: 20,
        background: SKY, opacity: ease(lt, 0.85, 0.4) }} />
      <div style={{ position: 'absolute', left: 130, right: 110, top: ruleY + 60 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.6 + i * 0.09, 16), color: WHITE, fontWeight: 400,
            fontSize: 50, lineHeight: 1.24, whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
        <div style={{ ...rise(lt, 1.2, 16), marginTop: 66, color: WHITE, fontWeight: 700,
          fontSize: 52, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{sc.tail}</div>
      </div>
    </div>
  );
}

/* ── root ────────────────────────────────────────────────────── */
const LAYOUTS = { suvgrid: SuvGrid, modelcard: ModelCard, boxchain: BoxChain, finalrule: FinalRule };

function RealVideo3() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  React.useEffect(() => {
    PRELOAD.forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || SuvGrid; });
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

window.RealVideo3 = RealVideo3;
