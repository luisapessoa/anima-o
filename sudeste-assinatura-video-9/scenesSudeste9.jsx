/* Sudeste Assinatura — VÍDEO 9 (1080×1920). "Quais os requisitos para eu assinar meu 0km?"
   Tela 1 branca (card verde escuro + carro), 2 verde escuro (timeline), 3 preta (vídeo),
   4 verde claro (texto editorial), 5 preta (vídeo, texto em escada). */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle } = window;

const W = 1080, H = 1920;
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', PALE = '#c6f6d6', WHITE = '#ffffff', YEL = '#f2ff46';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200;
const E = Easing;
const RT = { showLogo: true, videoBg: true };

// Vídeos de fundo das Telas 3 e 5 (placeholders pretos no handoff).
const VID_3 = 'assets/videos/tela3.mp4';
const VID_5 = 'assets/videos/tela5.mp4';

function BgVideo({ src, start, end, scale, posX, posY, op, overlay, speed, shiftY, filter }) {
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
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: BLACK }} />
      <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1}
        onLoadedData={markReady}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
          transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
          filter: filter || 'none',
          opacity: ready ? (op == null ? 1 : op) : 0, transition: 'opacity .25s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: overlay || 'rgba(0,0,0,0.35)',
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} />
    </React.Fragment>
  );
}

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function easeIO(lt, delay, d) { return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function pop(lt, delay, d) {
  const x = clamp((lt - delay) / (d || 0.7), 0, 1);
  return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 22 : px)}px)` };
}
function rich(text, accent, w) {
  return String(text).split('**').map((p, i) => i % 2 === 1
    ? <span key={i} style={{ color: accent, fontWeight: w || 700 }}>{p}</span>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}
function Lines({ list, lt, delay, step, style, accent }) {
  return (list || []).map((ln, i) => (
    <div key={i} style={{ ...rise(lt, (delay || 0) + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>
      {rich(ln, accent)}
    </div>
  ));
}
function Logo({ dark }) {
  return (
    <img src={dark ? 'assets/logo-dark.png' : 'assets/logo-white.png'} alt="Sudeste Assinaturas"
      decoding="sync" loading="eager"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)',
               width: LOGO_W, height: 'auto', zIndex: 6 }} />
  );
}
function Draw({ d, p, color, w }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={w || 3} strokeLinecap="round" strokeLinejoin="round" pathLength="1"
    strokeDasharray="1" strokeDashoffset={1 - p}></path>;
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
const BOLD = (fs, lh) => ({ fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.02em' });
const REG = (fs, lh) => ({ fontWeight: 400, fontSize: fs, lineHeight: lh + 'px' });
const LIGHT = (fs, lh) => ({ fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.03em' });
function exitOut(lt, dur) { const p = E.easeInCubic(clamp((lt - (dur - 0.55)) / 0.5, 0, 1)); return { opacity: 1 - p, transform: `translateY(${-50 * p}px)` }; }
/* painel da próxima tela entrando no fim da tela atual (sem buraco preto entre cenas) */
function NextPanel({ lt, dur, color, dir }) {
  const p = easeIO(lt, dur - 0.75, 0.75);
  if (p <= 0) return null;
  const clip = dir === 'left' ? `inset(0 ${(1 - p) * 100}% 0 0)` : `inset(${(1 - p) * 100}% 0 0 0)`;
  return <div style={{ position: 'absolute', inset: 0, background: color, clipPath: clip, zIndex: 20 }}></div>;
}
function iris(lt) { const r = easeIO(lt, 0, 0.7) * 125; return { clipPath: `circle(${r}% at 50% 50%)` }; }

/* ícones (viewBox 160) */
const IC = {
  doc: (p, c) => <React.Fragment>
    <Draw d="M44 20 H100 L124 44 V140 H44 Z" p={p} color={c} w={10} />
    <Draw d="M62 74 H106 M62 96 H106 M62 118 H90" p={clamp(p * 1.6 - 0.6, 0, 1)} color={c} w={10} />
  </React.Fragment>,
  key: (p, c) => <React.Fragment>
    <Draw d="M86 60 A28 28 0 1 1 86 100 A28 28 0 0 1 86 60" p={p} color={c} w={10} />
    <Draw d="M86 80 H140 M124 80 V102 M140 80 V96" p={clamp(p * 1.6 - 0.6, 0, 1)} color={c} w={10} />
  </React.Fragment>,
  cnh: (p, c) => <React.Fragment>
    <Draw d="M22 40 H138 V120 H22 Z" p={p} color={c} w={9} />
    <Draw d="M58 70 A12 12 0 1 1 58 94 A12 12 0 0 1 58 70 M40 108 C44 98 72 98 76 108 M92 70 H122 M92 88 H122" p={clamp(p * 1.5 - 0.5, 0, 1)} color={c} w={9} />
  </React.Fragment>,
  renda: (p, c) => <React.Fragment>
    <Draw d="M20 48 H140 V112 H20 Z" p={p} color={c} w={9} />
    <Draw d="M80 64 A16 16 0 1 1 80 96 A16 16 0 0 1 80 64 M38 64 V96 M122 64 V96" p={clamp(p * 1.5 - 0.5, 0, 1)} color={c} w={9} />
  </React.Fragment>,
  casa: (p, c) => <React.Fragment>
    <Draw d="M24 76 L80 28 L136 76 M40 64 V132 H120 V64" p={p} color={c} w={9} />
    <Draw d="M68 132 V100 H92 V132" p={clamp(p * 1.5 - 0.5, 0, 1)} color={c} w={9} />
  </React.Fragment>,
};

/* 1 · branco — logo escuro; card verde escuro abaixo do logo com pergunta + "0km?" gigante; CTA; carro grande */
function Cover() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const card = easeIO(lt, 0.1, 0.8);
  const car = E.easeOutCubic(clamp((lt - 1.6) / 1.1, 0, 1));
  const big = pop(lt, 1.0, 0.9);
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 420, height: 1020, background: TEAL, borderRadius: 64,
        borderBottomRightRadius: 260, clipPath: `inset(0 0 ${(1 - card) * 100}% 0 round 64px)` }}></div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 530, color: WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {(sc.q || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.6 + i * 0.1, 16), whiteSpace: 'nowrap', ...BOLD(72, 80) }}>
            <span style={{ position: 'relative' }}>
              {i === 0 ? <span style={{ position: 'absolute', right: '100%', marginRight: 4 }}>“</span> : null}{ln}
            </span>
          </div>
        ))}
        <div style={{ color: YEL, ...BOLD(250, 230), letterSpacing: '-0.06em', paddingLeft: '0.06em', whiteSpace: 'nowrap',
          opacity: ease(lt, 1.0, 0.2), transform: `scale(${0.7 + 0.3 * big})`, transformOrigin: 'center bottom' }}><span style={{ position: 'relative' }}>{sc.big}<span style={{ position: 'absolute', left: '100%' }}>”</span></span></div>
        <div style={{ marginTop: 72, display: 'inline-flex', alignItems: 'center', gap: 18, padding: '20px 20px 20px 40px', alignSelf: 'center',
          background: WHITE, borderRadius: 999, clipPath: `inset(0 ${(1 - easeIO(lt, 2.0, 0.6)) * 100}% 0 0 round 999px)` }}>
          <span style={{ color: TEAL, ...REG(44, 52), letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{rich(sc.cta, TEAL, 800)}</span>
          <span style={{ width: 60, height: 60, borderRadius: '50%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30" height="30" viewBox="0 0 30 30"><path d="M11 7 L19 15 L11 23" fill="none" stroke={YEL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </span>
        </div>
      </div>
      <img src="assets/carro-polo.webp" alt="" style={{ position: 'absolute', left: -190, top: 1010, width: 1460, height: 'auto', zIndex: 4,
        opacity: ease(lt, 1.6, 0.3), transform: `translateX(${(1 - car) * 1000}px)` }} />
      <NextPanel lt={lt} dur={sc.dur} color={TEAL} dir="up" />
    </div>
  );
}

/* 2 · verde escuro — bloco centralizado: título + timeline (todos os círculos só com traçado amarelo) */
function Docs() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const items = sc.items || [];
  const R = 56, STEP = 210;
  const und = easeIO(lt, 1.2, 0.6);
  return (
    <div style={{ ...shell, background: TEAL }}>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', ...exitOut(lt, sc.dur) }}>
        <div style={{ color: WHITE }}>
          <Lines list={sc.label} lt={lt} delay={0.4} step={0.08} style={REG(56, 68)} />
          <Lines list={[sc.head]} lt={lt} delay={0.7} style={BOLD(80, 90)} />
          <div style={{ ...rise(lt, 0.85, 16), color: YEL, ...BOLD(80, 96), position: 'relative', display: 'inline-block' }}>
            {sc.hl}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 2, height: 6, background: YEL, transform: `scaleX(${und})`, transformOrigin: 'left' }}></div>
          </div>
          <div style={{ position: 'relative', marginTop: 72 }}>
            <div style={{ position: 'absolute', left: R - 1.5, top: R, width: 3, height: STEP * (items.length - 1), background: YEL,
              transform: `scaleY(${easeIO(lt, 1.6, 0.6 + 0.55 * items.length)})`, transformOrigin: 'top' }}></div>
            {items.map((it, i) => {
              const d0 = 1.8 + i * 0.6;
              return (
                <div key={i} style={{ position: 'relative', height: R * 2, marginBottom: i < items.length - 1 ? STEP - R * 2 : 0,
                  display: 'flex', alignItems: 'center', gap: 44 }}>
                  <div style={{ width: R * 2, height: R * 2, flexShrink: 0, borderRadius: '50%', boxSizing: 'border-box', background: TEAL,
                    border: `3px solid ${YEL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(lt, d0, 0.7)})` }}>
                    <svg width="62" height="62" viewBox="0 0 160 160">{IC[it.icon](easeIO(lt, d0 + 0.1, 0.8), WHITE)}</svg>
                  </div>
                  <div style={{ color: WHITE, ...BOLD(54, 64), whiteSpace: 'nowrap', ...rise(lt, d0 + 0.15, 16) }}>{it.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3 · preto (vídeo) — parágrafo 1 à esquerda; parágrafo 2 à direita, com linha + ponto apontando para ele; tudo embaixo */
function Digital() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const P2X = 400, P2Y = 1400, LH = 60, LY = P2Y + LH / 2 + 2;
  const ln = easeIO(lt, 1.2, 0.8);
  const dot = pop(lt, 1.9, 0.6);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_3} start={0} end={7.0} speed={1} overlay="rgba(0,0,0,0.3)" />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 900,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 70%)' }}></div>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 120, top: 1200, color: WHITE }}>
        <Lines list={sc.p1} lt={lt} delay={0.3} step={0.1} style={BOLD(64, 74)} accent={WHITE} />
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <Draw d={`M 0 ${LY} H ${P2X - 50}`} p={ln} color={YEL} w={3} />
        <circle cx={P2X - 36} cy={LY} r={10} fill={YEL} style={{ transform: `scale(${dot})`, transformOrigin: `${P2X - 36}px ${LY}px` }}></circle>
      </svg>
      <div style={{ position: 'absolute', left: P2X, top: P2Y, color: WHITE }}>
        <Lines list={sc.p2} lt={lt} delay={2.0} step={0.1} style={REG(46, LH)} accent={YEL} />
      </div>
      <NextPanel lt={lt} dur={sc.dur} color={WHITE} dir="left" />
    </div>
  );
}

/* 4 · branco — título sentence-case à esquerda + fio vertical à direita; pergunta e resposta alinhadas à direita */
function Paper() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const M = 120;
  return (
    <div style={{ ...shell, background: WHITE }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', inset: 0, ...exitOut(lt, sc.dur) }}>
      <div style={{ position: 'absolute', left: M, top: 450, color: TEAL }}>
        <Lines list={sc.title} lt={lt} delay={0.4} step={0.14} style={BOLD(100, 104)} accent={MINT} />
      </div>
      <div style={{ position: 'absolute', left: M, top: 690, color: TEAL }}>
        <Lines list={sc.sub} lt={lt} delay={1.2} step={0.09} style={{ ...REG(52, 62), letterSpacing: '-0.02em' }} accent={TEAL} />
      </div>
      <div style={{ position: 'absolute', right: M + 24, top: 720, width: 3, height: 440, background: MINT,
        transform: `scaleY(${easeIO(lt, 1.8, 1.2)})`, transformOrigin: 'top' }}></div>
      <div style={{ position: 'absolute', right: M, top: 1200, color: TEAL, textAlign: 'right' }}>
        <Lines list={sc.micro} lt={lt} delay={2.8} step={0.14} style={BOLD(100, 104)} accent={MINT} />
      </div>
      <div style={{ position: 'absolute', right: M, top: 1450, color: TEAL, textAlign: 'right' }}>
        <Lines list={sc.ans} lt={lt} delay={3.6} step={0.1} style={{ ...REG(52, 62), letterSpacing: '-0.02em' }} accent={TEAL} />
      </div>
      </div>
    </div>
  );
}

/* 5 · preto (vídeo) — "Simples, rápido e prático!" grande e centralizado; frase final normal e centralizada */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const big = sc.big || [];
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_5} start={0} end={3.0} speed={0.5} overlay="rgba(0,0,0,0.45)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 120, right: 120, top: 700, textAlign: 'center', color: WHITE }}>
        {big.map((t, i) => {
          const p = ease(lt, 0.3 + i * 0.2, 0.6);
          const just = ['flex-start', 'flex-end', 'center'][i % 3];
          return (
            <div key={i} style={{ display: 'flex', justifyContent: just }}>
              <div style={{ ...BOLD(124, 124), letterSpacing: '-0.045em', whiteSpace: 'nowrap', color: i === big.length - 1 ? YEL : WHITE,
                opacity: p, transform: `translateX(${(1 - p) * (i % 2 ? -60 : 60)}px)` }}>{t}</div>
            </div>
          );
        })}
        <div style={{ height: 60 }}></div>
        <Lines list={sc.small} lt={lt} delay={1.3} step={0.12} style={REG(52, 64)} />
      </div>
    </div>
  );
}

const LAYOUTS = { cover: Cover, docs: Docs, digital: Digital, paper: Paper, closing: Closing };

function SudesteVideo9() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(() => {
    ['assets/logo-dark.png', 'assets/logo-white.png', 'assets/carro-polo.webp'].forEach((src) => {
      const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Cover; });
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
        <TweakToggle label="Vídeo de fundo" value={t.videoBg !== false}
          onChange={(v) => setTweak('videoBg', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.SudesteVideo9 = SudesteVideo9;
