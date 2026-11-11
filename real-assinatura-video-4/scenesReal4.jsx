/* Real Assinatura 4 — "O Brasil nunca blindou tantos carros" — vertical 1080×1920, 6 screens.
   Same engine/pattern as scenesReal3.jsx. Loaded after animations-v2.jsx + tweaks-panel.jsx.
   Telas 1, 3 e 6 (fundo preto) ganharam vídeo de fundo full-bleed da mesma caminhonete
   usada em Estilo Assinatura 4 — cada uma com um recorte diferente, sem repetição entre si. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const NAVY = '#112750', SKY = '#9fd3e5', GREY = '#f0f0f0', WHITE = '#ffffff', BLACK = '#000000';
const FONT = "'Readex Pro', system-ui, sans-serif";
const LOGO_TOP = 210;
const E = Easing;
const RUNTIME = { showLogo: true, videoBg: true };

// Background clips for the 3 black video zones (Telas 1, 3, 6) — same Amarok
// pickup used across Estilo Assinatura 4, one distinct clip per screen.
const VID_1 = 'assets/bg-1.mp4';
const VID_3 = 'assets/bg-3.mp4';
const VID_6 = 'assets/bg-6.mp4';

const PRELOAD = ['assets/real/logo-white.png', 'assets/real/logo-navy.png',
  'assets/real/car-tera-12r.png', 'assets/real/car-virtus-12.png',
  'assets/real/ic12-family.png', 'assets/real/ic12-car.png', 'assets/real/ic12-shield.png'];

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function easeIO(lt, delay, d) { return E.easeInOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
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
  const src = variant === 'dark' ? 'assets/real/logo-navy.png' : 'assets/real/logo-white.png';
  return (
    <div style={{ position: 'absolute', top: LOGO_TOP, left: '50%', zIndex: 6,
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p }}>
      <img src={src} alt="Real Assinatura" style={{ height: 66, width: 'auto', display: 'block' }} />
    </div>
  );
}

const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };
const Lines = ({ lines, lt, delay, step, size, lh, weight, color, px, align }) => (
  <React.Fragment>
    {(lines || []).map((ln, i) => (
      <div key={i} style={{ ...rise(lt, delay + i * (step || 0.09), px == null ? 22 : px),
        color, fontWeight: weight, fontSize: size, lineHeight: lh + 'px',
        whiteSpace: 'nowrap', textAlign: align || 'left' }}>{ln}</div>
    ))}
  </React.Fragment>
);

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

/* 1 · black, bold statement + offset question */
function Intro() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_1} start={0} end={4.4} speed={0.78} overlay={0.5} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 180, top: 1262 }}>
        <Lines lines={sc.head} lt={lt} delay={0.35} step={0.12} size={70} lh={73} weight={700} color={WHITE} px={40} />
      </div>
      <div style={{ position: 'absolute', left: 474, top: 1472 }}>
        <Lines lines={sc.body} lt={lt} delay={1.3} step={0.1} size={62} lh={66} weight={400} color={WHITE} />
      </div>
    </div>
  );
}

/* 2 · sky, navy outline box drawn around the stat, Tera enters */
function StatBox() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const DY = 120, top = 385 + DY, right = 835, bottom = 1189 + DY, lw = 3;
  const a = easeIO(lt, 0.2, 0.5), b = easeIO(lt, 0.62, 0.45), c = easeIO(lt, 0.99, 0.5);
  const car = pop(lt, 1.0, 1.0), carIn = ease(lt, 1.0, 0.45);
  return (
    <div style={{ ...shell, background: SKY }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, top, width: right + lw, height: lw, background: NAVY,
        transform: `scaleX(${a})`, transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', left: right, top, width: lw, height: bottom - top + lw, background: NAVY,
        transform: `scaleY(${b})`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 0, top: bottom, width: right + lw, height: lw, background: NAVY,
        transform: `scaleX(${c})`, transformOrigin: 'right' }} />
      <div style={{ position: 'absolute', left: 180, top: 498 + DY }}>
        <Lines lines={sc.body} lt={lt} delay={0.45} size={62} lh={72} weight={400} color={NAVY} />
        <div style={{ height: 72 }} />
        <Lines lines={sc.head} lt={lt} delay={1.35} step={0.12} size={62} lh={72} weight={700} color={NAVY} />
      </div>
      <img src="assets/real/car-tera-12r.png" alt="Tera" style={{ position: 'absolute', left: 106, top: 1104 + DY,
        width: 874, height: 'auto', zIndex: 3, opacity: carIn,
        transform: `translateX(${(1 - car) * 320}px) rotate(${(1 - car) * -2}deg)` }} />
    </div>
  );
}

/* 3 · black, sky rule + growth stat */
function Growth() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_3} start={0} end={6.0} speed={0.92} overlay={0.5} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1246, display: 'flex', justifyContent: 'center' }}>
        <div>
          <div style={{ width: 234, height: 3, background: SKY,
            transform: `scaleX(${easeIO(lt, 0.25, 0.6)})`, transformOrigin: 'left' }} />
          <div style={{ marginTop: 41 }}>
            <Lines lines={sc.head} lt={lt} delay={0.55} step={0.12} size={62} lh={70} weight={700} color={WHITE} />
          </div>
          <div style={{ marginTop: 40 }}>
            <Lines lines={sc.body} lt={lt} delay={1.25} step={0.1} size={60} lh={74} weight={400} color={WHITE} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4 · grey, heading + icon list */
function Priorities() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
    return (
    <div style={{ ...shell, background: GREY }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 580, display: 'flex', justifyContent: 'center' }}>
        <div>
          <Lines lines={sc.head} lt={lt} delay={0.3} step={0.1} size={78} lh={75} weight={700} color={NAVY} />
          <div style={{ height: 117 }} />
          {(sc.items || []).map((it, i) => {
            const d = 1.15 + i * 0.3;
            const p = pop(lt, d, 0.8), pin = ease(lt, d, 0.35);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 44, height: 128, marginBottom: 68 }}>
                <img src={it.icon} alt="" style={{ width: 128, height: 128, flex: '0 0 auto',
                  opacity: pin, transform: `scale(${0.6 + 0.4 * p})` }} />
                <div style={{ marginTop: -4, opacity: ease(lt, d + 0.12, 0.4),
                  transform: `translateX(${(1 - pop(lt, d + 0.12, 0.7)) * -60}px)` }}>
                  {it.lines.map((ln, j) => (
                    <div key={j} style={{ color: NAVY, fontWeight: 400, fontSize: 57, lineHeight: '64px',
                      whiteSpace: 'nowrap' }}>{ln}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* 5 · sky, Virtus + subscription pitch */
function Pitch() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const car = pop(lt, 0.2, 1.0), carIn = ease(lt, 0.2, 0.45);
  return (
    <div style={{ ...shell, background: SKY }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <img src="assets/real/car-virtus-12.png" alt="Virtus" style={{ position: 'absolute', left: 134, top: 499,
        width: 806, height: 'auto', opacity: carIn,
        transform: `translateX(${(1 - car) * -300}px) rotate(${(1 - car) * 2}deg)` }} />
      <div style={{ position: 'absolute', left: 165, top: 952 }}>
        <Lines lines={sc.head} lt={lt} delay={0.75} step={0.1} size={60} lh={65} weight={700} color={NAVY} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1380, width: 317, height: 3, background: NAVY,
        transform: `scaleX(${easeIO(lt, 1.55, 0.6)})`, transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', left: 351, top: 1350 }}>
        <Lines lines={sc.body} lt={lt} delay={1.8} step={0.09} size={49} lh={55} weight={400} color={NAVY} />
      </div>
    </div>
  );
}

/* 6 · black, framed CTA */
function Cta() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const L = 93, R = 986, T = 748, B = 1342, lw = 3;
  const gapL = 205, gapR = 874, btnL = 279, btnR = 801;
  const v = easeIO(lt, 0.2, 0.7), h = easeIO(lt, 0.7, 0.5);
  const btn = ease(lt, 1.9, 0.5), btnT = ease(lt, 2.1, 0.45);
  const seg = (x0, x1, y, origin) => (
    <div style={{ position: 'absolute', left: x0, top: y, width: x1 - x0, height: lw, background: SKY,
      transform: `scaleX(${h})`, transformOrigin: origin }} />
  );
  return (
    <div style={{ ...shell, background: BLACK }}>
      <BgVideo src={VID_6} start={0} end={3.28} speed={0.45} overlay={0.55} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: L, top: T, width: lw, height: B - T + lw, background: SKY,
        transform: `scaleY(${v})`, transformOrigin: 'bottom' }} />
      <div style={{ position: 'absolute', left: R, top: T, width: lw, height: B - T + lw, background: SKY,
        transform: `scaleY(${v})`, transformOrigin: 'top' }} />
      {seg(L, gapL, T, 'left')}
      {seg(gapR, R + lw, T, 'right')}
      {seg(L, btnL, B, 'left')}
      {seg(btnR, R + lw, B, 'right')}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 668 }}>
        <Lines lines={sc.head} lt={lt} delay={0.35} step={0.12} size={72} lh={75} weight={700} color={WHITE} align="center" />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 862 }}>
        <Lines lines={sc.body} lt={lt} delay={1.0} step={0.08} size={54} lh={61} weight={400} color={WHITE} align="center" />
      </div>
      <div style={{ position: 'absolute', left: btnL, top: 1300, width: btnR - btnL, height: 83, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: SKY, transform: `scaleX(${btn})` }} />
        <span style={{ position: 'relative', color: NAVY, fontWeight: 700, fontSize: 58, whiteSpace: 'nowrap',
          opacity: btnT, transform: `translateY(${(1 - btnT) * 24}px)` }}>{sc.cta}</span>
      </div>
    </div>
  );
}

const LAYOUTS = { intro: Intro, statbox: StatBox, growth: Growth, priorities: Priorities, pitch: Pitch, cta: Cta };

function RealVideo4() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  RUNTIME.videoBg = t.videoBg !== false;
  React.useEffect(() => {
    PRELOAD.forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Intro; });
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

window.RealVideo4 = RealVideo4;
