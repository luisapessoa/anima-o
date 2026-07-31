/* Sudeste Assinatura — VÍDEO 2 (1080×1920).
   "5 preocupações que você pode tirar da lista ao assinar um carro."
   Layout fiel aos esboços do cliente. Vídeos de fundo nas telas pretas
   (Tela 1, 3, 5 e 7) — telas 2/4/6 (teal) permanecem sem vídeo.
   Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLACK = '#000000';
const TEAL  = '#034845';   // brand green (fundo + texto em card)
const GHOST = '#02332f';   // numeral fantasma sobre o teal
const MINT  = '#00d1b2';   // acento / número em card
const YEL   = '#eaff4a';   // título destaque
const WHITE = '#ffffff';
const CARD  = '#edefe9';    // off-white dos cards
const CINK  = '#0a4b47';    // corpo dentro do card
const FONT  = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 252;
const E = Easing;
const RUNTIME2 = { showLogo: true, videoBg: true };

const VID_HERO = 'assets/bg-hero.mp4';
const VID_CARD1 = 'assets/bg-card1.mp4';
const VID_CARD2 = 'assets/bg-card2.mp4';
const VID_CLOSING = 'assets/bg-closing.mp4';

/* ── helpers ─────────────────────────────────────────────── */
function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.65), 0, 1)); }
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 24 : px)}px)` };
}
function fmt(text, accent, key) {
  const parts = String(text).split('**');
  return React.createElement('span', { key },
    parts.map((p, i) => i % 2 === 1
      ? React.createElement('span', { key: i, style: { color: accent, fontWeight: 700 } }, p)
      : React.createElement(React.Fragment, { key: i }, p)));
}
function Logo({ lt }) {
  const p = ease(lt, 0.12, 0.7);
  return (
    <img src="assets/logo-white.png" alt="Sudeste Assinaturas"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%',
               transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p,
               width: LOGO_W, height: 'auto', zIndex: 6 }} />
  );
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
// Mostly-neutral dark wash — darkens the video for text/logo contrast
// without leaning green/teal the way an all-brand-colour overlay would.
const dimOverlay = `linear-gradient(160deg, rgba(8,14,16,0.38) 0%, rgba(2,4,5,0.58) 100%)`;

// Background video for the black scenes (Telas 1, 3, 5, 7). Same pattern
// as the first Sudeste Assinatura video: black fallback div + VideoSprite
// + optional overlay, gated behind a `ready` state so the overlay never
// paints alone (flat colour flash) before the first frame decodes.
function VideoBg({ src, start, end, scale, posX, posY, op, overlay, speed, shiftY }) {
  const [ready, setReady] = React.useState(false);
  // Reveal on "canplaythrough" (browser estimates it can play to the end
  // without further buffering stalls) instead of "loadeddata" (only
  // guarantees the current frame decoded). The extra wait happens while
  // the clip is still hidden behind the black fallback, so any seek the
  // drift-correction effect needs to do to catch up to the scene's
  // already-elapsed time happens off-screen — revealing too early was
  // showing that catch-up as a visible stutter/jump right as the video
  // appeared, worst on Tela 1 since its clip has zero preload head start.
  // Falls back to a fixed delay in case the event never fires (some
  // browsers are flaky about it for short/looping sources).
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => { if (!readyRef.current) { readyRef.current = true; setReady(true); } }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => { if (!readyRef.current) { readyRef.current = true; setReady(true); } };
  if (!RUNTIME2.videoBg) {
    return <div style={{ position: 'absolute', inset: 0, background: BLACK }} />;
  }
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: BLACK }} />
      <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1}
        onCanPlayThrough={markReady}
        style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover',
          objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
          transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
          opacity: ready ? (op == null ? 1 : op) : 0, transition: 'opacity .25s ease' }} />
      {overlay ? <div style={{ position: 'absolute', inset: 0, background: overlay,
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} /> : null}
    </React.Fragment>
  );
}

/* Renderiza linhas explícitas (uma <div> por linha = quebra exata). */
function Lines({ list, lt, delay, step, style, accent }) {
  return (list || []).map((ln, i) => (
    <div key={i} style={{ ...rise(lt, (delay || 0) + i * (step || 0.08), 14), ...style }}>
      {fmt(ln, accent || MINT, i)}
    </div>
  ));
}

/* ── TELA 1 · HERO (preto): "5" + texto no rodapé ─────────── */
function HeroCount() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const num = ease(lt, 0.2, 0.7);
  return (
    <div style={{ ...shell }}>
      <VideoBg src={VID_HERO} start={0} end={3.7} speed={1} scale={1.04} posY={42} op={0.62} overlay={dimOverlay} />
      {RUNTIME2.showLogo ? <Logo lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 40 }}>
        <div style={{ fontWeight: 700, fontSize: 440, lineHeight: 0.78, color: '#f2ff46',
          letterSpacing: '-0.05em', opacity: num, transform: `translateY(${(1 - num) * 26}px)` }}>5</div>
        <div style={{ marginTop: -8 }}>
          <Lines list={sc.head} lt={lt} delay={0.5} step={0.1} accent={WHITE}
            style={{ color: WHITE, fontWeight: 700, fontSize: 74, lineHeight: 1.12, letterSpacing: '-0.02em' }} />
        </div>
      </div>
    </div>
  );
}

/* ── TELAS 2·4·6 · TEAL: numeral fantasma + título + corpo ── */
function TealScreen() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const ghost = ease(lt, 0.15, 0.9);
  const blocks = sc.body || [];
  let d = 0.85;
  return (
    <div style={{ ...shell, background: TEAL }}>
      {/* numeral fantasma — 2º dígito centralizado sobre o título, "0" cortado à esquerda */}
      {/* numeral fantasma — dígitos grandes e juntos; 2º dígito centralizado sobre o título, "0" cortado à esquerda */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', zIndex: 0,
        opacity: ghost, transform: `translateY(${(1 - ghost) * 24}px)` }}>
        <span style={{ position: 'relative', display: 'inline-block', fontWeight: 700, fontSize: 860,
          lineHeight: 0.8, color: GHOST, letterSpacing: '-0.06em' }}>
          <span style={{ position: 'absolute', right: '100%', top: 0, whiteSpace: 'nowrap' }}>{(sc.num || '')[0]}</span>
          {(sc.num || '').slice(1)}
        </span>
      </div>
      {RUNTIME2.showLogo ? <Logo lt={lt} /> : null}
      {/* título amarelo — centralizado */}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 786, zIndex: 2, textAlign: 'center' }}>
        <Lines list={sc.title} lt={lt} delay={0.35} step={0.1}
          style={{ color: YEL, fontWeight: 700, fontSize: 88, lineHeight: 1.06, letterSpacing: '-0.02em' }} />
      </div>
      {/* corpo (parágrafos) — se há régua, agrupa e centraliza o grupo (mantendo o desalinhamento interno) */}
      {(() => {
        const hasRule = blocks.some((b) => b.rule);
        const bodyFs = sc.num === '01' ? 50 : 56;
        // Telas 2/4 (rule present) sit lower, away from the title, while
        // Tela 6 (no rule, has the car photo) keeps its original position.
        const bodyTop = hasRule ? 1090 : 1016;
        const items = blocks.map((blk, bi) => {
          const start = d; d += (blk.lines.length) * 0.08 + 0.28;
          const inner = (
            <Lines list={blk.lines} lt={lt} delay={start} step={0.08} accent={YEL}
              style={{ color: WHITE, fontWeight: blk.w || 500, fontSize: bodyFs, lineHeight: 1.26 }} />
          );
          if (blk.rule === 'v') {
            return (
              <div key={bi} style={{ position: 'relative', marginLeft: 120, paddingLeft: 60, marginTop: 54 }}>
                <div style={{ position: 'absolute', left: 16, top: 8, bottom: 8, width: 4, background: MINT, opacity: ease(lt, start, 0.5), transform: 'translateY(-2px)' }} />
                {inner}
              </div>
            );
          }
          if (blk.rule === 'h') {
            return (
              <div key={bi} style={{ position: 'relative', paddingLeft: 232, marginTop: 58 }}>
                <div style={{ position: 'absolute', left: 0, top: 32, width: 176, height: 4, background: MINT, opacity: ease(lt, start, 0.5) }} />
                {inner}
              </div>
            );
          }
          return <div key={bi} style={{ marginTop: bi ? 44 : 0 }}>{inner}</div>;
        });
        if (hasRule) {
          return (
            <div style={{ position: 'absolute', left: 0, right: 0, top: bodyTop, zIndex: 2,
              display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'inline-block' }}>{items}</div>
            </div>
          );
        }
        return (
          <div style={{ position: 'absolute', left: 90, right: 84, top: bodyTop, zIndex: 2 }}>{items}</div>
        );
      })()}
      {/* carro (tela 6) */}
      {sc.car ? (
        <img src="assets/vw-virtus.webp" alt="" style={{ position: 'absolute', left: '50%', bottom: 96,
          width: 1030, height: 'auto', transform: `translateX(-50%) translateY(${(1 - ease(lt, 0.9, 0.8)) * 26}px)`,
          opacity: ease(lt, 0.9, 0.8), zIndex: 1 }} />
      ) : null}
    </div>
  );
}

/* ── TELAS 3·5 · CARD: preto em cima, card off-white embaixo ─ */
function CardScreen() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const up = E.easeOutCubic(clamp((lt - 0.15) / 0.8, 0, 1));
  const cardTop = 980;
  const isCard2 = sc.num === '04';
  const videoSrc = isCard2 ? VID_CARD2 : VID_CARD1;
  // Tela 5's clip (backlit rear, then open trunk) frames its subject
  // higher up than Tela 3's GTI pan, and the card was still covering too
  // much of it — raised further so the whole trunk/car is visible above
  // the card on both takes.
  const videoScale = isCard2 ? 1.0 : 1.35;
  const videoShiftY = isCard2 ? -340 : -260;
  const videoPosY = isCard2 ? 38 : 35;
  return (
    <div style={{ ...shell }}>
      <VideoBg src={videoSrc} start={0} end={6.2} speed={1} scale={videoScale} shiftY={videoShiftY} posY={videoPosY} op={0.65} overlay={dimOverlay} />
      {RUNTIME2.showLogo ? <Logo lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: cardTop, bottom: 0,
        background: CARD, borderTopLeftRadius: 66, borderTopRightRadius: 66,
        transform: `translateY(${(1 - up) * (H - cardTop)}px)`,
        padding: '96px 90px 80px', boxSizing: 'border-box', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 152, lineHeight: 1, color: MINT, letterSpacing: '-0.03em',
          ...rise(lt, 0.55, 18) }}>{sc.num}</div>
        <div style={{ marginTop: 26 }}>
          <Lines list={sc.title} lt={lt} delay={0.75} step={0.1}
            style={{ color: TEAL, fontWeight: 700, fontSize: 78, lineHeight: 1.08, letterSpacing: '-0.02em' }} />
        </div>
        <div style={{ marginTop: 40, maxWidth: 900 }}>
          <Lines list={sc.body} lt={lt} delay={1.0} step={0.08} accent={MINT}
            style={{ color: CINK, fontWeight: 500, fontSize: 52, lineHeight: 1.3 }} />
        </div>
      </div>
    </div>
  );
}

/* ── TELA 7 · CLOSING (preto): frase + colchete + fecho ────── */
function ClosingStatement() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const br = ease(lt, 0.7, 0.7);
  const vx = 344, vTop = 1504, vBot = 1764;
  return (
    <div style={{ ...shell }}>
      <VideoBg src={VID_CLOSING} start={0} end={6.2} speed={0.73} scale={1.1} posY={45} op={0.6} overlay={dimOverlay} />
      {RUNTIME2.showLogo ? <Logo lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1230 }}>
        <Lines list={sc.head} lt={lt} delay={0.25} step={0.1}
          style={{ color: WHITE, fontWeight: 700, fontSize: 86, lineHeight: 1.1, letterSpacing: '-0.02em',
            textDecoration: 'underline', textDecorationColor: MINT, textDecorationThickness: '4px', textUnderlineOffset: '14px' }} />
      </div>
      {/* conector: apenas uma linha vertical à esquerda do 2º parágrafo */}
      <div style={{ position: 'absolute', left: vx, top: vTop, width: 4, height: (vBot - vTop) * br, background: MINT }} />
      {/* parágrafo fecho */}
      <div style={{ position: 'absolute', left: 372, right: 84, top: 1480 }}>
        <Lines list={sc.body} lt={lt} delay={0.9} step={0.09} accent={WHITE}
          style={{ color: WHITE, fontWeight: 500, fontSize: 62, lineHeight: 1.18 }} />
      </div>
    </div>
  );
}

/* ── root ────────────────────────────────────────────────── */
const LAYOUTS = {
  hero: HeroCount, teal: TealScreen, card: CardScreen, closing: ClosingStatement,
};

// ?bare=1 in the URL renders just the animation — no play/pause/scrub bar,
// no tweaks panel — for recording a clean export with nothing but the
// animation itself burned into the video.
const BARE = typeof location !== 'undefined' &&
  new URLSearchParams(location.search).get('bare') === '1';

function SudesteVideo2() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME2.showLogo = t.showLogo !== false;
  RUNTIME2.videoBg = t.videoBg !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || TealScreen; });
  return (
    <React.Fragment>
      <SceneStage width={W} height={H} scenes={window.OM_SCENES}
        playback={window.OM_PLAYBACK} bg={BLACK} transition="cut" controls={!BARE}>
        {children}
      </SceneStage>
      {!BARE && (
        <TweaksPanel>
          <TweakSection label="Vídeo" />
          <TweakToggle label="Mostrar logo" value={t.showLogo !== false}
            onChange={(v) => setTweak('showLogo', v)} />
          <TweakToggle label="Vídeo de fundo" value={t.videoBg !== false}
            onChange={(v) => setTweak('videoBg', v)} />
          <TweakSection label="Edição" />
          <TweakToggle label="Editor de tempo" value={t.motionEditor}
            onChange={(v) => setTweak('motionEditor', v)} />
        </TweaksPanel>
      )}
    </React.Fragment>
  );
}

window.SudesteVideo2 = SudesteVideo2;
