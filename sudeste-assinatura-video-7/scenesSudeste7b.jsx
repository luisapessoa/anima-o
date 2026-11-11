/* Sudeste Assinatura — VÍDEO 7 v2 (1080×1920). Novos layouts: digitação, carimbo + waffle,
   donut, caminhos até o 0km, "30" enchendo, pílulas. Telas 1, 4 e 6: preto, com vídeo de
   fundo full-bleed (trechos do vídeo "For all life's journeys — The new Tiguan" VW Brasil,
   recortados do 16:9 original para preencher a tela vertical inteira e remover as legendas
   que o clipe tinha). */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', HL = '#5edcc8';
const YEL = '#f2ff46';
const WHITE = '#ffffff', GREY = '#f0f0f0', INK = '#03433f';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200;
const E = Easing;
const RT = { showLogo: true, videoBg: true };

// Vídeos de fundo das Telas 1, 4 e 6 — trechos do Tiguan (estrada, chegada no
// camping, montanha/lago), já conferidos quadro a quadro sem nenhuma escrita
// em tela.
const VID_1 = 'assets/videos/tela1.mp4';
const VID_4 = 'assets/videos/tela4.mp4';
const VID_6 = 'assets/videos/tela6.mp4';

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
function rich(text, accent) {
  return String(text).split('**').map((p, i) => i % 2 === 1
    ? <span key={i} style={{ color: accent, fontWeight: 700 }}>{p}</span>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}
function Lines({ list, lt, delay, step, style, accent }) {
  return (list || []).map((ln, i) => (
    <div key={i} style={{ ...rise(lt, (delay || 0) + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>
      {rich(ln, accent)}
    </div>
  ));
}
function Count({ lt, delay, to, d, suffix }) {
  const p = E.easeOutCubic(clamp((lt - delay) / (d || 1.1), 0, 1));
  return <React.Fragment>{Math.round(to * p)}{suffix}</React.Fragment>;
}
function Logo({ dark }) {
  return (
    <img src={dark ? 'assets/logo-dark.png' : 'assets/logo-white.png'} alt="Sudeste Assinaturas"
      decoding="sync" loading="eager"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)',
               width: LOGO_W, height: 'auto', zIndex: 6 }} />
  );
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
const BOLD = (fs, lh) => ({ fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' });
const REG = (fs, lh) => ({ fontWeight: 400, fontSize: fs, lineHeight: lh + 'px' });
/* abertura em íris para telas de cor */
function iris(lt) { const r = easeIO(lt, 0, 0.7) * 125; return { clipPath: `circle(${r}% at 50% 50%)` }; }

/* Full-bleed background video — fallback div + VideoSprite + dark overlay,
   opacity gated behind a "ready" state so the overlay never paints alone
   before the first frame decodes. Mesmo padrão dos Vídeos 5 e 6. */
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
        style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover',
          objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
          transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
          filter: filter || 'none',
          opacity: ready ? (op == null ? 1 : op) : 0, transition: 'opacity .25s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: overlay || 'rgba(0,0,0,0.35)',
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} />
    </React.Fragment>
  );
}

/* 1 · preto (vídeo) — editorial à esquerda; "Geração Z" amarelo dentro de caixa de seleção tracejada */
function Question() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const LIGHT = { fontWeight: 300, fontSize: 112, lineHeight: '104px', letterSpacing: '-0.045em' };
  const MIX = { fontWeight: 300, fontSize: 100, lineHeight: '102px', letterSpacing: '-0.035em' };
  const sel = easeIO(lt, 0.9, 0.5);
  const word = ease(lt, 1.25, 0.6);
  const handle = (pos, i) => (
    <div key={i} style={{ position: 'absolute', width: 18, height: 18, background: WHITE, ...pos,
      transform: `translate(-50%, -50%) scale(${pop(lt, 1.1 + i * 0.06, 0.5)})` }}></div>
  );
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_1} start={0} end={5.8} speed={0.95} scale={1.08} overlay="rgba(0,0,0,0.5)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 110, top: 330, color: WHITE }}>
        <Lines list={sc.a} lt={lt} delay={0.3} step={0.12} style={LIGHT} />
        <div style={{ position: 'relative', display: 'inline-block', margin: '28px 0 30px', padding: '6px 26px 20px' }}>
          <div style={{ position: 'absolute', inset: 0, border: `3px dashed ${WHITE}`, opacity: sel,
            clipPath: `inset(0 ${(1 - sel) * 100}% 0 0)` }}></div>
          {handle({ left: 0, top: 0 }, 0)}{handle({ left: '100%', top: 0 }, 1)}
          {handle({ left: '100%', top: '100%' }, 2)}{handle({ left: 0, top: '100%' }, 3)}
          <div style={{ color: YEL, fontWeight: 700, fontSize: 158, lineHeight: '160px', letterSpacing: '-0.045em', whiteSpace: 'nowrap',
            opacity: word, transform: `translateY(${(1 - word) * 30}px)` }}>{sc.word}</div>
        </div>
        <Lines list={sc.b} lt={lt} delay={1.8} step={0.12} style={MIX} accent={WHITE} />
      </div>
    </div>
  );
}

/* 2 · cinza — "A resposta é sim." + 51% central + waffle retangular (20×5) + faixa centralizada */
function Answer() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const mk = easeIO(lt, 0.8, 0.5);
  const dot = 34, gap = 9, COLS = 20, ROWS = 5;
  const gw = COLS * dot + (COLS - 1) * gap, gh = ROWS * dot + (ROWS - 1) * gap;
  const dots = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const f = c * ROWS + r;
    const on = f < sc.stat ? pop(lt, 2.1 + f * 0.022, 0.5) : 0;
    dots.push(
      <div key={f} style={{ position: 'absolute', left: c * (dot + gap), top: r * (dot + gap), width: dot, height: dot,
        borderRadius: '50%', boxSizing: 'border-box', border: `3px solid ${TEAL}`, opacity: 0.3 * ease(lt, 1.7 + c * 0.02, 0.4) + 0.7 * (on > 0 ? 1 : 0) }}>
        <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: TEAL, transform: `scale(${on})` }}></div>
      </div>);
  }
  return (
    <div style={{ ...shell, background: GREY, ...iris(lt) }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', color: INK, ...BOLD(80, 92), ...rise(lt, 0.2, 18) }}>
        {sc.head}{' '}
        <span style={{ position: 'relative', display: 'inline-block', color: TEAL }}>
          <span style={{ position: 'absolute', left: -10, right: -10, top: 40, bottom: 8, background: YEL,
            transform: `scaleX(${mk})`, transformOrigin: 'left' }}></span>
          <span style={{ position: 'relative' }}>{sc.word}</span>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 570, textAlign: 'center', color: TEAL,
        ...BOLD(210, 210), letterSpacing: '-0.045em', paddingLeft: '0.045em', ...rise(lt, 1.1, 24) }}>
        <Count lt={lt} delay={1.1} to={sc.stat} d={1.2} suffix="%" />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', color: INK }}>
        <Lines list={sc.side} lt={lt} delay={1.4} style={BOLD(50, 60)} />
      </div>
      <div style={{ position: 'absolute', left: (W - gw) / 2, top: 900, width: gw, height: gh }}>{dots}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1170, textAlign: 'center', color: INK }}>
        <Lines list={sc.body} lt={lt} delay={3.3} step={0.08} style={REG(50, 60)} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', padding: '40px 64px', textAlign: 'center', color: WHITE }}>
          <div style={{ position: 'absolute', inset: 0, background: TEAL, borderTopRightRadius: 80, borderBottomLeftRadius: 80,
            clipPath: `inset(0 ${(1 - easeIO(lt, 4.0, 0.7)) * 100}% 0 0)` }}></div>
          <div style={{ position: 'relative' }}>
            <Lines list={sc.close} lt={lt} delay={4.4} step={0.1} style={BOLD(52, 64)} accent={YEL} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3 · verde escuro — "mudar" + donut de 31% equidistante dos textos */
function Shift() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const R = 175, SW = 46, C = 2 * Math.PI * R, D = (R + SW / 2) * 2;
  const arc = E.easeInOutCubic(clamp((lt - 2.9) / 1.3, 0, 1));
  const ring = ease(lt, 2.5, 0.6);
  const G = 70, PRE = 800, DTOP = PRE + 64 + G, BODY = DTOP + D + G;
  return (
    <div style={{ ...shell, background: TEAL, ...iris(lt) }}>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 120, top: 440, color: WHITE }}>
        <Lines list={sc.lead} lt={lt} delay={0.5} step={0.1} style={BOLD(70, 80)} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 630, color: WHITE }}>
        <Lines list={sc.quote} lt={lt} delay={1.2} step={0.1} style={REG(52, 62)} accent={YEL} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: PRE, textAlign: 'center', color: WHITE, ...BOLD(54, 64), ...rise(lt, 2.3, 12) }}>{sc.pre}</div>
      <div style={{ position: 'absolute', left: 540 - D / 2, top: DTOP, width: D, height: D,
        opacity: ring, transform: `scale(${0.85 + 0.15 * ring}) rotate(${(1 - ring) * -40}deg)` }}>
        <svg width={D} height={D} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <circle cx={D / 2} cy={D / 2} r={R} fill="none" stroke={WHITE} strokeWidth={SW} opacity="0.18"></circle>
          <circle cx={D / 2} cy={D / 2} r={R} fill="none" stroke={YEL} strokeWidth={SW}
            strokeDasharray={C} strokeDashoffset={C * (1 - (sc.stat / 100) * arc)}></circle>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE,
          ...BOLD(130, 130), letterSpacing: '-0.045em' }}>
          <Count lt={lt} delay={2.9} to={sc.stat} d={1.3} suffix="%" />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: BODY, textAlign: 'center', color: WHITE }}>
        <Lines list={sc.body} lt={lt} delay={4.0} step={0.09} style={REG(48, 60)} accent={YEL} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: BODY + 300, textAlign: 'center', color: WHITE, ...REG(30, 38), opacity: 0.85 * ease(lt, 4.8, 0.5) }}>
        {sc.source}
      </div>
    </div>
  );
}

/* 4 · preto (vídeo) — três caminhos (à vista, financiamento, assinatura) convergindo ao "0km" */
function Paths() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const X = [200, 540, 880];
  const P = [
    { d: 'M 200 560 Q 200 240 540 110', a: 1.3 },
    { d: 'M 540 560 L 540 110', a: 1.45 },
    { d: 'M 880 560 Q 880 240 540 110', a: 1.6, hot: true },
  ];
  const t = E.easeInOutCubic(clamp((lt - 2.9) / 1.4, 0, 1));
  const bx = (1 - t) * (1 - t) * 880 + 2 * (1 - t) * t * 880 + t * t * 540;
  const by = (1 - t) * (1 - t) * 560 + 2 * (1 - t) * t * 240 + t * t * 110;
  const node = pop(lt, 2.3, 0.8);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_4} start={0} end={8.0} speed={0.95} scale={1.08} overlay="rgba(0,0,0,0.55)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 120, top: 440, color: WHITE }}>
        <Lines list={sc.head} lt={lt} delay={0.2} step={0.1} style={BOLD(72, 84)} accent={YEL} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 680, width: W, height: 680 }}>
        <svg width={W} height={640} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {P.map((p, i) => (
            <path key={i} d={p.d} fill="none" pathLength="1" strokeLinecap="round"
              stroke={p.hot ? YEL : WHITE} strokeWidth={p.hot ? 9 : 4} opacity={p.hot ? 1 : 0.6}
              strokeDasharray={p.hot ? '1' : '0.02 0.03'} strokeDashoffset={p.hot ? 1 - easeIO(lt, p.a, 1.0) : 0}
              style={p.hot ? null : { clipPath: `inset(${(1 - easeIO(lt, p.a, 1.0)) * 100}% 0 0 0)` }}></path>
          ))}
          {P.map((p, i) => (
            <circle key={'s' + i} cx={X[i]} cy={560} r={12} fill={p.hot ? YEL : WHITE} opacity={ease(lt, p.a - 0.2, 0.3)}></circle>
          ))}
          <circle cx={bx} cy={by} r={18} fill={WHITE} opacity={lt > 2.9 && t < 1 ? 1 : 0}></circle>
        </svg>
        <div style={{ position: 'absolute', left: 540 - 95, top: 110 - 95, width: 190, height: 190, borderRadius: '50%',
          background: YEL, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEAL, ...BOLD(60, 60),
          transform: `scale(${node})`, boxShadow: `0 0 0 ${t >= 1 ? (1 - clamp((lt - 4.3) / 0.6, 0, 1)) * 40 : 0}px rgba(242,255,70,0.3)` }}>{sc.node}</div>
        {(sc.labels || []).map((lb, i) => (
          <div key={i} style={{ position: 'absolute', left: X[i] - 170, width: 340, top: 592, textAlign: 'center',
            color: i === 2 ? YEL : WHITE, ...(i === 2 ? BOLD(40, 48) : REG(38, 48)), whiteSpace: 'nowrap',
            ...rise(lt, 1.6 + i * 0.15, 12) }}>{lb}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', color: WHITE }}>
        <Lines list={sc.body} lt={lt} delay={3.6} step={0.09} style={REG(48, 60)} accent={YEL} />
      </div>
    </div>
  );
}

/* 5 · cinza — "30" vazado que se enche de baixo para cima; faixa teal com o fecho */
function Legacy() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const fill = E.easeInOutCubic(clamp((lt - 1.5) / 1.6, 0, 1));
  const num = ease(lt, 1.1, 0.6);
  const big = { ...BOLD(440, 400), letterSpacing: '-0.06em', paddingRight: 60 };
  return (
    <div style={{ ...shell, background: GREY, ...iris(lt) }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 120, top: 440, color: INK }}>
        <Lines list={sc.lead} lt={lt} delay={0.5} step={0.09} style={REG(56, 66)} accent={TEAL} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 680, color: INK, ...REG(44, 52), ...rise(lt, 1.0, 14) }}>{sc.cardPre}</div>
      <div style={{ position: 'absolute', left: 90, top: 740, opacity: num, transform: `translateY(${(1 - num) * 40}px)` }}>
        <div style={{ ...big, color: 'transparent', WebkitTextStroke: `4px ${TEAL}`, opacity: fill >= 1 ? 0 : 1 }}>{sc.years}</div>
        <div style={{ ...big, color: TEAL, position: 'absolute', inset: 0, clipPath: `inset(${(1 - fill) * 100}% 0 0 0)` }}>{sc.years}</div>
      </div>
      <div style={{ position: 'absolute', left: 640, top: 850, color: INK }}>
        <div style={{ color: TEAL, ...BOLD(110, 116), letterSpacing: '-0.03em', ...rise(lt, 2.2, 18) }}>{sc.unit}</div>
        <div style={{ marginTop: 6 }}>
          <Lines list={sc.cardPost} lt={lt} delay={2.5} step={0.08} style={REG(38, 46)} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 1210, color: INK }}>
        <Lines list={sc.body} lt={lt} delay={3.1} step={0.09} style={REG(50, 60)} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 1430, background: TEAL, color: WHITE, padding: '40px 120px 40px 90px',
        borderBottomLeftRadius: 80, clipPath: `inset(0 0 0 ${(1 - easeIO(lt, 3.9, 0.7)) * 100}%)` }}>
        <Lines list={sc.close} lt={lt} delay={4.3} step={0.1} style={BOLD(58, 68)} accent={YEL} />
      </div>
    </div>
  );
}

/* 6 · preto (vídeo) — tudo centralizado; pílulas só com traçado; "para você!" sublinhado */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const pill = (p, i) => {
    const k = pop(lt, 1.0 + i * 0.35, 0.7), o = ease(lt, 1.0 + i * 0.35, 0.25);
    return (
      <div key={i} style={{ padding: '20px 46px', boxSizing: 'border-box', border: `2px solid ${MINT}`,
        borderTopRightRadius: 48, borderBottomLeftRadius: 48, color: WHITE, ...BOLD(56, 66),
        opacity: o, transform: `scale(${k})`, whiteSpace: 'nowrap' }}>{p}</div>
    );
  };
  const pills = sc.pills || [];
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_6} start={0} end={8.0} speed={0.95} scale={1.08} overlay="rgba(0,0,0,0.55)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE }}>
        <Lines list={sc.a} lt={lt} delay={0.2} step={0.1} style={REG(54, 66)} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, marginTop: 64 }}>
          <div style={{ display: 'flex', gap: 32 }}>{pills.slice(0, 2).map((p, i) => pill(p, i))}</div>
          <div style={{ display: 'flex', gap: 32 }}>{pills.slice(2).map((p, i) => pill(p, i + 2))}</div>
        </div>
        <div style={{ marginTop: 110 }}>
          <Lines list={sc.close} lt={lt} delay={2.6} step={0.1} style={BOLD(62, 74)} />
        </div>
        <div style={{ marginTop: 4, color: YEL, ...BOLD(140, 140), letterSpacing: '-0.035em',
          ...rise(lt, 3.7, 120, 0.8), whiteSpace: 'nowrap' }}>{sc.you}</div>
      </div>
    </div>
  );
}

const LAYOUTS = { question: Question, answer: Answer, shift: Shift, paths: Paths, legacy: Legacy, closing: Closing };

function SudesteVideo7b() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(() => {
    ['assets/logo-dark.png', 'assets/logo-white.png'].forEach((src) => {
      const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Question; });
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

window.SudesteVideo7b = SudesteVideo7b;
