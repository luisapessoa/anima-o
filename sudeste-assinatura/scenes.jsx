/* Sudeste Assinatura — vertical brand video (1080×1920).
   Dynamic per-screen layouts. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const { useScene, SceneStage, Easing, clamp, VideoSprite, useTweaks, TweaksPanel,
        TweakSection, TweakToggle } = window;

const W = 1080, H = 1920;
const TEAL  = '#034845';   // dark brand green
const TEAL2 = '#012f2d';   // deeper green for gradients
const MINT  = '#00d1b2';   // accent
const PALE  = '#c6f6d6';   // pale mint (accent lines)
const YEL   = '#f2ff46';   // key highlight (dark bg only)
const WHITE = '#ffffff';
const FONT  = "'DM Sans', system-ui, sans-serif";
const BODY  = 54;          // non-bold body size
const LOGO_W = 640, LOGO_TOP = 252;   // logo size shared across all screens
const E = Easing;
const RUNTIME = { showLogo: true, videoBg: true };

/* video clips per screen — one clean, caption-free clip per background scene
   (Telas 1, 3, 5, 7 e 9/Encerramento). Each file is pre-cropped/zoomed so no
   burned-in caption text from the source reels is visible. */
const VID_HERO     = 'assets/bg-hero.mp4';      // Tela 1  — rua arborizada, VW passando
const VID_TIMELINE = 'assets/bg-timeline.mp4';  // Tela 3  — Tiguan, lanterna + emblema
const VID_CARDUP   = 'assets/bg-cardup.mp4';    // Tela 5  — SUV azul em curva
const VID_FRAMED   = 'assets/bg-framed.mp4';    // Tela 7  — estrada sinuosa, carro vermelho
const VID_CLOSING  = 'assets/bg-closing.mp4';   // Tela 9  — pôr do sol na rodovia

/* ── motion helpers ──────────────────────────────────────────── */
function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.65), 0, 1)); }
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)` };
}

/* emphasis: **text** rendered in `accent` colour */
function fmt(text, accent, key) {
  const parts = String(text).split('**');
  return React.createElement('span', { key },
    parts.map((p, i) => i % 2 === 1
      ? React.createElement('span', { key: i, style: { color: accent, fontWeight: 700 } }, p)
      : React.createElement(React.Fragment, { key: i }, p)));
}

/* ── shared pieces ───────────────────────────────────────────── */
function Logo({ variant, lt }) {
  const p = ease(lt, 0.12, 0.7);
  const src = variant === 'dark' ? 'assets/logo-dark.png' : 'assets/logo-white.png';
  return (
    <img src={src} alt="Sudeste Assinaturas"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%',
               transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p,
               width: LOGO_W, height: 'auto', zIndex: 5,
               filter: variant === 'dark' ? 'none' : 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }} />
  );
}

/* Black base + video (croppable via scale/posY) + optional colour overlay.
   Darken by lowering `op` (video opacity) so the black #000 shows through. */
function VideoBg({ src, start, end, scale, posX, posY, op, overlay, speed, shiftY }) {
  const [ready, setReady] = React.useState(false);
  if (!RUNTIME.videoBg) {
    return <div style={{ position: 'absolute', inset: 0, background: '#000000' }} />;
  }
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: '#000000' }} />
      <VideoSprite src={src || VID_HERO} start={start || 0} end={end || 3} speed={speed || 1}
        onLoadedData={() => setReady(true)}
        style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover',
          objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
          transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
          opacity: ready ? (op == null ? 1 : op) : 0, transition: 'opacity .25s ease' }} />
      {/* Held back until the first frame decodes — without this the base
          black div shows through the (often tinted) overlay alone for a
          beat, reading as a flat colour flash before the footage appears. */}
      {overlay ? <div style={{ position: 'absolute', inset: 0, background: overlay,
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} /> : null}
    </React.Fragment>
  );
}

const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };
// Mostly-neutral dark wash — darkens the video for text contrast without
// leaning green/teal the way an all-brand-colour overlay would.
const dimOverlay = `linear-gradient(160deg, rgba(8,14,16,0.42) 0%, rgba(2,4,5,0.6) 100%)`;

/* ── 1 · HERO: dark video, centred title + bracket frame + mint box ── */
function HeroVideo() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const draw = ease(lt, 0.95, 0.8);
  const box = ease(lt, 1.35, 0.55);
  return (
    <div style={{ ...shell, background: '#000000' }}>
      <VideoBg src={VID_HERO} start={0} end={2.4} speed={0.43} scale={1} posY={50} op={0.55}
        overlay={`linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.68) 100%)`} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      {/* centred heading (kept inside the frame lines) */}
      <div style={{ position: 'absolute', left: 150, right: 150, top: 508, textAlign: 'center' }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.25 + i * 0.11, 20),
            color: WHITE, fontWeight: 700, fontSize: 84, lineHeight: 1.16,
            letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
            {ln}
          </div>
        ))}
      </div>
      {/* bracket frame — verticals sit outside the text */}
      <svg width="940" height="668" viewBox="0 0 940 668"
        style={{ position: 'absolute', left: 70, top: 588, opacity: 0.95 }}>
        {['M82 4 L6 4 L6 664 L82 664', 'M858 4 L934 4 L934 664 L858 664'].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={MINT} strokeWidth="6" strokeLinecap="square"
            strokeDasharray="820" strokeDashoffset={820 * (1 - draw)} />
        ))}
      </svg>
      {/* mint box — centred text, covers the frame's lower ticks */}
      <div style={{ position: 'absolute', left: 120, right: 120, top: 1058,
        transform: `scale(${0.95 + 0.05 * box})`, opacity: box, transformOrigin: 'center top',
        background: MINT, color: TEAL, padding: '48px 52px',
        borderRadius: '26px 26px 0 26px', textAlign: 'center' }}>
        {(sc.boxes || []).map((ln, i) => (
          <div key={i} style={{ fontWeight: 700, fontSize: 62, lineHeight: 1.2,
            letterSpacing: '-0.01em' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 2 · LEFT-BAR on white — text lowered ─────────────────────── */
function LeftBar() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const bar1 = ease(lt, 0.15, 0.5), bar2 = ease(lt, 0.9, 0.5);
  return (
    <div style={{ ...shell, background: WHITE, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-start', paddingTop: 1180, paddingLeft: 90, paddingRight: 90 }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <img src="assets/vw-car.webp" alt="" style={{ position: 'absolute', top: 430, left: '50%',
        transform: `translateX(-50%) translateY(${(1 - ease(lt, 0.2, 0.7)) * 22}px)`,
        opacity: ease(lt, 0.2, 0.7), width: 1040, height: 'auto' }} />
      <div style={{ display: 'flex', gap: 34, marginBottom: 70 }}>
        <div style={{ width: 8, background: MINT, borderRadius: 4,
          transform: `scaleY(${bar1})`, transformOrigin: 'top' }} />
        <div style={{ flex: 1 }}>
          {(sc.head || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 0.25 + i * 0.1, 20),
              color: TEAL, fontWeight: 700, fontSize: 80, lineHeight: 1.08, letterSpacing: '-0.025em' }}>
              {fmt(ln, MINT, i)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 34 }}>
        <div style={{ width: 8, background: PALE, borderRadius: 4,
          transform: `scaleY(${bar2})`, transformOrigin: 'top' }} />
        <div style={{ flex: 1 }}>
          {(sc.body || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 1.0 + i * 0.09, 16),
              color: 'rgba(3,52,50,0.92)', fontWeight: 500, fontSize: BODY, lineHeight: 1.34 }}>
              {fmt(ln, TEAL, i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 3 · TIMELINE: video+teal, heading top, line (no arrowhead), body ── */
function Timeline() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const line = ease(lt, 0.7, 1.0);
  const HT = 800, HB = 1296; // arrow span, equal margins between paragraphs
  return (
    <div style={{ ...shell }}>
      <VideoBg src={VID_TIMELINE} start={0} end={3.16} speed={0.52} scale={1.12} posY={50} op={0.85} overlay={dimOverlay} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 90, top: 380, width: 840 }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.2 + i * 0.1, 22),
            color: WHITE, fontWeight: 700, fontSize: 72, lineHeight: 1.1, letterSpacing: '-0.02em',
            textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
            {fmt(ln, YEL, i)}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 108, top: HT, width: 5, height: (HB - HT) * line,
        background: MINT, borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: 90, top: 1400, width: 860 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.3 + i * 0.09, 16),
            color: 'rgba(255,255,255,0.94)', fontWeight: 500, fontSize: BODY, lineHeight: 1.36,
            textShadow: '0 2px 14px rgba(0,0,0,0.4)' }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 4 · CENTER-STACK on white ────────────────────────────────── */
function CenterStack() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const div = ease(lt, 0.55, 0.6);
  return (
    <div style={{ ...shell, background: WHITE, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingLeft: 90, paddingRight: 90, paddingTop: 640 }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      {(sc.lead || []).map((ln, i) => (
        <div key={i} style={{ ...rise(lt, 0.2 + i * 0.08, 14),
          color: 'rgba(3,52,50,0.8)', fontWeight: 500, fontSize: 58, lineHeight: 1.24, maxWidth: 900 }}>
          {fmt(ln, MINT, i)}
        </div>
      ))}
      <div style={{ width: 4, height: 210 * div, background: MINT, margin: '60px 0', borderRadius: 3 }} />
      {(sc.head || []).map((ln, i) => (
        <div key={i} style={{ ...rise(lt, 0.9 + i * 0.1, 22),
          color: TEAL, fontWeight: 700, fontSize: 74, lineHeight: 1.14, letterSpacing: '-0.02em', maxWidth: 940 }}>
          {fmt(ln, MINT, i)}
        </div>
      ))}
    </div>
  );
}

/* ── 5 · CARD-UP: video+teal green area, smaller white card ───── */
function CardUp() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const up = E.easeOutCubic(clamp((lt - 0.2) / 0.85, 0, 1));
  const cardH = 880;
  return (
    <div style={{ ...shell }}>
      <VideoBg src={VID_CARDUP} start={0} end={1.36} speed={0.24} scale={1.18} posY={50} shiftY={-140} op={1} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: cardH,
        background: WHITE, borderTopLeftRadius: 64, borderTopRightRadius: 64,
        transform: `translateY(${(1 - up) * (cardH + 40)}px)`, padding: '84px 84px',
        boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        boxShadow: '0 -30px 80px rgba(0,0,0,0.35)' }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.9 + i * 0.1, 18),
            color: TEAL, fontWeight: 700, fontSize: 70, lineHeight: 1.12, letterSpacing: '-0.02em' }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
        <div style={{ height: 34 }} />
        {(sc.sub || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.15 + i * 0.1, 16),
            color: TEAL, fontWeight: 700, fontSize: 56, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
        <div style={{ height: 26 }} />
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.35 + i * 0.09, 14),
            color: 'rgba(3,52,50,0.9)', fontWeight: 500, fontSize: BODY, lineHeight: 1.36 }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 6 · CHIPS on white: vertical stack, lowered ──────────────── */
function Chips() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const chips = sc.chips || [];
  const conn = ease(lt, 0.45, 0.9);
  const gap = 104, chipH = 176, top = 500, chipW = 340;
  const cx = (W - chipW) / 2;
  const total = chips.length * chipH + (chips.length - 1) * gap;
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: cx + chipW / 2 - 2.5, top: top + chipH / 2,
        width: 5, height: (total - chipH) * conn, background: MINT, borderRadius: 3 }} />
      {chips.map((c, i) => {
        const p = ease(lt, 0.2 + i * 0.2, 0.5);
        const y = top + i * (chipH + gap);
        return (
          <div key={i} style={{ position: 'absolute', left: cx, top: y,
            width: chipW, height: chipH, borderRadius: 28, background: TEAL, color: WHITE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '0 26px', boxSizing: 'border-box', fontWeight: 700, fontSize: 42, lineHeight: 1.12,
            opacity: p, transform: `translateY(${(1 - p) * -22}px) scale(${0.92 + 0.08 * p})`,
            boxShadow: '0 18px 40px rgba(3,72,69,0.22)' }}>
            {c}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 90, right: 90, top: top + total + 130, textAlign: 'center' }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.05 + i * 0.1, 20),
            color: TEAL, fontWeight: 700, fontSize: 70, lineHeight: 1.14, letterSpacing: '-0.02em' }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 7 · FRAMED: video+teal, raised box, diagonal-cut corners ─── */
function Framed() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const box = ease(lt, 0.15, 0.6);
  return (
    <div style={{ ...shell, padding: '0 72px' }}>
      <VideoBg src={VID_FRAMED} start={0} end={2.8} speed={0.58} scale={1} posY={50} op={0.85} overlay={dimOverlay} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 72, right: 72, top: 380,
        border: `3px solid ${MINT}`, borderRadius: '90px 0 90px 0',
        padding: '90px 76px', boxSizing: 'border-box', opacity: box,
        transform: `scale(${0.95 + 0.05 * box})`, transformOrigin: 'center top',
        background: 'rgba(1,32,31,0.5)' }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.4 + i * 0.1, 18),
            color: WHITE, fontWeight: 700, fontSize: 68, lineHeight: 1.14, letterSpacing: '-0.02em' }}>
            {fmt(ln, YEL, i)}
          </div>
        ))}
        <div style={{ height: 50 }} />
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.9 + i * 0.09, 14),
            color: 'rgba(255,255,255,0.94)', fontWeight: 500, fontSize: BODY, lineHeight: 1.36 }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 8 · CTA on white: heading + spaced block + pill ──────────── */
function CTA() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const bar = ease(lt, 0.75, 0.5);
  const pill = E.easeOutBack ? E.easeOutBack(clamp((lt - 1.5) / 0.7, 0, 1)) : ease(lt, 1.5, 0.6);
  const cta = Array.isArray(sc.cta) ? sc.cta : [sc.cta];
  return (
    <div style={{ ...shell, background: WHITE, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-start', paddingLeft: 90, paddingRight: 90, paddingTop: 600 }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ marginBottom: 96 }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.2 + i * 0.1, 22),
            color: TEAL, fontWeight: 700, fontSize: 72, lineHeight: 1.12, letterSpacing: '-0.02em' }}>
            {fmt(ln, MINT, i)}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 110 }}>
        <div style={{ width: 8, background: MINT, borderRadius: 4,
          transform: `scaleY(${bar})`, transformOrigin: 'top' }} />
        <div style={{ flex: 1 }}>
          {(sc.body || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 0.85 + i * 0.09, 14), whiteSpace: 'nowrap',
              color: 'rgba(3,52,50,0.92)', fontWeight: 500, fontSize: 46, lineHeight: 1.44 }}>
              {fmt(ln, TEAL, i)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ alignSelf: 'center', background: TEAL, color: WHITE, fontWeight: 700,
        fontSize: 52, lineHeight: 1.18, textAlign: 'center', padding: '44px 70px',
        borderRadius: 999, opacity: clamp(pill, 0, 1),
        transform: `scale(${0.7 + 0.3 * clamp(pill, 0, 1.2)})`,
        boxShadow: '0 20px 46px rgba(3,72,69,0.28)', maxWidth: 880 }}>
        {cta.map((ln, i) => <div key={i}>{ln}</div>)}
      </div>
    </div>
  );
}

/* ── Closing over video: big logo + tagline ──────────────────── */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const p = E.easeOutCubic(clamp((lt - 0.3) / 0.9, 0, 1));
  const sweep = clamp((lt - 0.95) / 0.7, 0, 1);
  const tag = ease(lt, 1.25, 0.7);
  return (
    <div style={{ ...shell, background: '#000000', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center' }}>
      <VideoBg src={VID_CLOSING} start={0} end={3.0} speed={0.74} scale={1} posY={50} op={0.8}
        overlay={`linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(1,32,31,0.68) 100%)`} />
      <img src="assets/logo-white.png" alt="Sudeste Assinaturas"
        style={{ position: 'relative', width: 760, height: 'auto', opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`, filter: 'drop-shadow(0 6px 22px rgba(0,0,0,0.5))' }} />
      <div style={{ position: 'relative', height: 5, width: 300 * sweep, background: MINT,
        borderRadius: 3, marginTop: 40 }} />
      <div style={{ position: 'relative', marginTop: 44, color: WHITE, fontSize: 50, fontWeight: 500,
        textAlign: 'center', maxWidth: 820, lineHeight: 1.3, opacity: tag,
        transform: `translateY(${(1 - tag) * 16}px)`, textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
        {fmt(sc.tag || '', YEL)}
      </div>
    </div>
  );
}

/* ── root ────────────────────────────────────────────────────── */
const LAYOUTS = {
  hero: HeroVideo, leftbar: LeftBar, timeline: Timeline, center: CenterStack,
  cardup: CardUp, chips: Chips, framed: Framed, cta: CTA, closing: Closing,
};

// ?bare=1 in the URL renders just the animation — no play/pause/scrub bar,
// no tweaks panel — for recording a clean export with nothing but the
// animation itself burned into the video.
const BARE = typeof location !== 'undefined' &&
  new URLSearchParams(location.search).get('bare') === '1';

function SudesteVideo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  RUNTIME.videoBg = t.videoBg === true;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || CenterStack; });
  return (
    <React.Fragment>
      <SceneStage width={W} height={H} scenes={window.OM_SCENES}
        playback={window.OM_PLAYBACK} bg={'#000000'} transition="cut" controls={!BARE}>
        {children}
      </SceneStage>
      {!BARE && (
        <TweaksPanel>
          <TweakSection label="Vídeo" />
          <TweakToggle label="Mostrar logo" value={t.showLogo !== false}
            onChange={(v) => setTweak('showLogo', v)} />
          <TweakToggle label="Fundo de vídeo" value={t.videoBg === true}
            onChange={(v) => setTweak('videoBg', v)} />
          <TweakSection label="Edição" />
          <TweakToggle label="Editor de tempo" value={t.motionEditor}
            onChange={(v) => setTweak('motionEditor', v)} />
        </TweaksPanel>
      )}
    </React.Fragment>
  );
}

window.SudesteVideo = SudesteVideo;
