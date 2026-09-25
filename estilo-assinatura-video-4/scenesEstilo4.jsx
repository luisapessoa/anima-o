/* Estilo Assinaturas 4 — "quilometragem" — vertical brand video (1080×1920), 7 screens.
   Tela 3 → 4: the white screen slides down and becomes the rounded white panel of Tela 4. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLUE  = '#173ded';
const NAVY  = '#000051';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT  = "'Urbanist', system-ui, sans-serif";
const LOGO_W = 232, LOGO_TOP = 248;
const E = Easing;
const RUNTIME = { showLogo: true };

// Background clips for the video zones — all 4 are the same Amarok pickup,
// so Telas 1 and 2 also reuse the Tela 4 / Tela 7 clips (not other vehicles).
const VID_4 = 'assets/bg-4.mp4';
const VID_7 = 'assets/bg-7.mp4';

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function inout(lt, delay, d) { return E.easeInOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function pop(lt, delay, d) {
  const x = clamp((lt - delay) / (d || 0.7), 0, 1);
  return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)` };
}

function Logo({ variant, lt, delay }) {
  const p = ease(lt, delay == null ? 0.12 : delay, 0.7);
  const src = variant === 'dark' ? 'assets/estilo/opt-logo-dark.png' : 'assets/estilo/opt-logo-white.png';
  return (
    <img src={src} alt="Estilo Assinaturas"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%',
               transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p,
               width: LOGO_W, height: 'auto', zIndex: 5 }} />
  );
}

const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };
const light = { fontWeight: 300, fontSize: 54, lineHeight: '65px', whiteSpace: 'nowrap' };

/* Full-bleed background video with a flat dark overlay for logo/text contrast. */
function BgVideo({ src, start, end, speed, overlay }) {
  if (!RUNTIME.videoBg) return null;
  return (
    <React.Fragment>
      <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${overlay == null ? 0.4 : overlay})` }} />
    </React.Fragment>
  );
}

/* ── 1 · QUOTE CARD: navy rounded card with bold quote, question at the bottom ── */
function QuoteCard() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const card = ease(lt, 0.25, 0.7);
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_7} start={0} end={4.4} speed={0.78} overlay={0.45} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 90, top: 455, width: 900, height: 374,
        background: NAVY, borderRadius: 46, opacity: card,
        transform: `translateY(${(1 - card) * 30}px) scale(${0.96 + 0.04 * card})` }} />
      <div style={{ position: 'absolute', left: 90, width: 900, top: 541, textAlign: 'center' }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.6 + i * 0.13, 18), color: WHITE, fontWeight: 700,
            fontSize: 55, lineHeight: '65px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1522, textAlign: 'center',
        color: WHITE, fontWeight: 600, fontSize: 72, lineHeight: '84px', letterSpacing: '-0.01em',
        whiteSpace: 'nowrap', opacity: ease(lt, 1.9, 0.5),
        transform: `translateY(${(1 - pop(lt, 1.9, 0.9)) * 40}px)` }}>{sc.tail}</div>
    </div>
  );
}

/* ── 2 · OUTLINE BOX: blue outline running off the left edge, bold question below ── */
function OutlineBox() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const draw = ease(lt, 0.2, 0.9);
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_4} start={0} end={6.0} speed={0.85} overlay={0.5} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: -60, top: 431, width: 1001, height: 422,
        boxSizing: 'border-box', border: `3px solid ${BLUE}`, borderRadius: 34,
        clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }} />
      <div style={{ position: 'absolute', left: 210, top: 503 }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.7 + i * 0.1, 16), color: WHITE, ...light }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1524, textAlign: 'center' }}>
        {(sc.tail || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 2.0 + i * 0.14, 20), color: WHITE, fontWeight: 600,
            fontSize: 56, lineHeight: '65px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 3 · KBB: white screen, thin→thick rule, paragraph + blue highlight, Tera below ── */
function KbbContent({ sc, lt }) {
  const body = sc.body || [], hi = sc.hi || [];
  const thin = ease(lt, 0.2, 1.0);
  const thickIn = ease(lt, 0.7, 0.4);
  const slide = inout(lt, 1.35, 0.8);
  const carIn = ease(lt, 2.3, 0.5);
  const car = ease(lt, 2.3, 1.2);
  return (
    <React.Fragment>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 199, top: 473, width: 2, height: 629,
        background: BLUE, transform: `scaleY(${thin})`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 195, top: 473 + 458 * slide, width: 10, height: 381 - 210 * slide,
        borderRadius: 3, background: BLUE, opacity: thickIn,
        transform: `scaleY(${thickIn})`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 250, top: 464 }}>
        {body.map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.45 + i * 0.09, 16), color: NAVY, ...light }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 250, top: 921 }}>
        {hi.map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.95 + i * 0.1, 16), color: BLUE, fontWeight: 700,
            fontSize: 54, lineHeight: '65px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <img src="assets/estilo/car-tera-12.webp" alt="Volkswagen Tera"
        style={{ position: 'absolute', left: -130, top: 1110, width: 1340, height: 'auto',
          opacity: carIn, transform: `translateX(${(1 - car) * 180}px)` }} />
    </React.Fragment>
  );
}
function Kbb() {
  const s = useScene();
  return <div style={{ ...shell, background: WHITE }}><KbbContent sc={s.scene} lt={s.localTime} /></div>;
}

/* ── 4 · PANEL: video fills the black area, Tela 3 slides down and becomes the white panel ── */
const PANEL_TOP = 1075, PANEL_R = 80, MORPH = 1.0;
function Panel() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const all = JSON.parse(window.OM_SCENES);
  const prev = all.find((x) => x.layout === 'kbb') || {};
  const m = inout(lt, 0.05, MORPH);
  const top = PANEL_TOP * m;
  const t0 = MORPH + 0.05;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_4} start={0} end={6.0} speed={0.72} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} delay={0.55} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top, height: H,
        background: WHITE, borderRadius: `${PANEL_R * m}px ${PANEL_R * m}px 0 0`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H,
          opacity: clamp(1 - m * 1.6, 0, 1) }}>
          <KbbContent sc={prev} lt={99} />
        </div>
        <div style={{ position: 'absolute', left: 119, top: 1253 - PANEL_TOP }}>
          {(sc.body || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, t0 + 0.1 + i * 0.1, 16), color: NAVY, ...light }}>{ln}</div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 119, top: 1514 - PANEL_TOP }}>
          {(sc.body2 || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, t0 + 0.75 + i * 0.1, 16), color: NAVY, ...light }}>
              {ln}{i === 1 ? <span style={{ color: BLUE, fontWeight: 700 }}> {sc.hi[0]}</span> : null}
            </div>
          ))}
          {(sc.hi || []).slice(1).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, t0 + 0.95 + i * 0.1, 16), color: BLUE, ...light,
              fontWeight: 700 }}>{ln}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 5 · CHECKLIST: navy screen, top rule, bold heading, blue-dot list ── */
function Checklist() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const rule = ease(lt, 0.1, 0.9);
  const TOP = 618;
  return (
    <div style={{ ...shell, background: NAVY }}>
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: TOP, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 15, top: -TOP, width: 3, height: TOP - 26,
            background: BLUE, transform: `scaleY(${rule})`, transformOrigin: 'top' }} />
          {(sc.head || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 0.5 + i * 0.12, 20), color: WHITE, fontWeight: 700,
              fontSize: 66, lineHeight: '75px', letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>{ln}</div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 21, marginTop: 68 }}>
            {(sc.items || []).map((it, i) => {
              const d = 1.2 + i * 0.22;
              const dot = pop(lt, d, 0.6);
              return (
                <div key={i} style={{ position: 'relative', paddingLeft: 40 }}>
                  <div style={{ position: 'absolute', left: 1, top: 26, width: 17, height: 17, borderRadius: '50%',
                    background: BLUE, transform: `scale(${dot})` }} />
                  <div style={{ opacity: ease(lt, d + 0.05, 0.5),
                    transform: `translateX(${(1 - ease(lt, d + 0.05, 0.6)) * 30}px)` }}>
                    {it.map((ln, j) => (
                      <div key={j} style={{ color: WHITE, ...light }}>{ln}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 6 · DIVIDER: blue question, paragraph, blue rule, paragraph ── */
function Divider() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const rule = ease(lt, 1.55, 0.8);
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 628, display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: BLUE, fontWeight: 700, fontSize: 64, lineHeight: '80px', letterSpacing: '-0.015em',
          whiteSpace: 'nowrap', opacity: ease(lt, 0.3, 0.45),
          transform: `translateX(${(1 - pop(lt, 0.3, 0.8)) * -50}px)` }}>{sc.head}</div>
        <div style={{ marginTop: 62 }}>
          {(sc.body || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 0.8 + i * 0.1, 16), color: NAVY, ...light }}>{ln}</div>
          ))}
        </div>
        <div style={{ height: 3, marginTop: 58, marginBottom: 71, background: BLUE,
          transform: `scaleX(${rule})`, transformOrigin: 'left' }} />
        <div>
          {(sc.body2 || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 2.0 + i * 0.1, 16), color: NAVY, ...light }}>{ln}</div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

/* ── 7 · CLOSING: full-bleed video, gradient to black at the bottom for the text ── */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_7} start={0} end={4.4} speed={0.78} overlay={0.25} />
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,.85) 100%)' }} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1382, textAlign: 'center' }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.35 + i * 0.14, 20), color: WHITE, fontWeight: 700,
            fontSize: 56, lineHeight: '64px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1553, textAlign: 'center' }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.0 + i * 0.12, 16), color: WHITE, fontWeight: 300,
            fontSize: 46, lineHeight: '56px', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

const LAYOUTS = { quote: QuoteCard, outline: OutlineBox, kbb: Kbb, panel: Panel,
  checklist: Checklist, divider: Divider, closing: Closing };

const PRELOAD = ['assets/estilo/opt-logo-white.png', 'assets/estilo/opt-logo-dark.png',
  'assets/estilo/car-tera-12.webp'];

function EstiloVideo4() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => {
    PRELOAD.forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  RUNTIME.showLogo = t.showLogo !== false;
  RUNTIME.videoBg = t.videoBg !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Closing; });
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

window.EstiloVideo4 = EstiloVideo4;
