/* Sudeste Assinatura — VÍDEO 8 (1080×1920). "Posso viajar com meu carro por assinatura?"
   Telas 1, 3 e 5: preto (vídeo por trás). Tela 2: verde menta. Tela 4: verde escuro.
   A linha da Tela 2 desce pela borda e continua na Tela 3 até o parágrafo. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', PALE = '#c6f6d6';
const WHITE = '#ffffff', INK = '#03433f';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200;
const LX = 170; const Y3 = 1360; /* y onde a linha sai da Tela 2 e continua na Tela 3 */
const PAN = 0.75; /* duração do deslize Tela 2 → 3 */
const E = Easing;
const RT = { showLogo: true, videoBg: true };

// Vídeos de fundo das Telas 1, 3, 4 e 5 — trechos do "Volks Explica: Elétricos"
// e do "Novo Taos" (VW Brasil), recortados do original para preencher a tela
// vertical inteira, sem nenhuma legenda/UI de tela em cena.
const VID_1 = 'assets/videos/tela1.mp4';
const VID_3 = 'assets/videos/tela3.mp4';
const VID_4 = 'assets/videos/tela4.mp4';
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
function Logo({ dark }) {
  return (
    <img src={dark ? 'assets/logo-dark.png' : 'assets/logo-white.png'} alt="Sudeste Assinaturas"
      decoding="sync" loading="eager"
      style={{ position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)',
               width: LOGO_W, height: 'auto', zIndex: 6 }} />
  );
}
/* linha desenhada (SVG path com pathLength=1) */
function Draw({ d, p, color, w }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={w || 3} strokeLinecap="square" pathLength="1"
    strokeDasharray="1" strokeDashoffset={1 - p}></path>;
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
const BOLD = (fs, lh) => ({ fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.015em' });
const REG = (fs, lh) => ({ fontWeight: 400, fontSize: fs, lineHeight: lh + 'px' });
function iris(lt) { const r = easeIO(lt, 0, 0.7) * 125; return { clipPath: `circle(${r}% at 50% 50%)` }; }

/* 1 · vídeo no topo; painel verde claro sobe por trás, depois o card entra; aspas simétricas */
function Cover() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const CT = 1270, CH = 430, MID = CT + CH / 2;
  const bg = E.easeInOutCubic(clamp((lt - 0.3) / 0.8, 0, 1));
  const c = E.easeOutCubic(clamp((lt - 1.0) / 0.8, 0, 1));
  const q1 = pop(lt, 1.6, 0.8), q2 = pop(lt, 2.5, 0.8);
  const Q = { position: 'absolute', color: MINT, fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 260, lineHeight: '200px', height: 130, transformOrigin: '50% 50%' };
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_1} start={0} end={3.48} speed={0.65} scale={1.08} overlay="rgba(0,0,0,0.4)" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: MID, bottom: 0, background: PALE, transform: `translateY(${(1 - bg) * 100}%)` }}></div>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 60, right: 60, top: CT, height: CH, opacity: ease(lt, 1.0, 0.3), transform: `translateY(${(1 - c) * 260}px)` }}>
        <div style={{ position: 'absolute', inset: 0, background: PALE, borderTopRightRadius: 100, borderBottomLeftRadius: 100,
          boxShadow: '0 24px 60px rgba(3,72,69,0.28), 0 6px 16px rgba(3,72,69,0.18)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: TEAL }}>
          <Lines list={sc.a} lt={lt} delay={1.5} step={0.12} style={BOLD(88, 96)} />
          <Lines list={[sc.hl]} lt={lt} delay={1.74} style={BOLD(88, 96)} />
        </div>
        <div style={{ ...Q, left: 40, top: -34, opacity: ease(lt, 1.6, 0.3), transform: `scale(${q1})` }}>“</div>
        <div style={{ ...Q, right: 40, bottom: -34, opacity: ease(lt, 2.5, 0.3), transform: `rotate(180deg) scale(${q2})` }}>“</div>
      </div>
    </div>
  );
}

/* 2 · verde claro — "Pode, sim." + parágrafo; linha sai de "dia.", desce e vira à direita; no fim a tela desliza para a esquerda */
function Answer() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const TY = 790, PT = TY - 34, LH = 64;
  const lastRef = React.useRef(null), headRef = React.useRef(null), paraRef = React.useRef(null);
  const [m, setM] = React.useState({ endX: 760, dx: 0 });
  React.useLayoutEffect(() => {
    const el = lastRef.current, hd = headRef.current, pa = paraRef.current; if (!el || !hd || !pa) return;
    const endX = LX + 72 + el.offsetWidth;
    let pw = 0; Array.from(pa.querySelectorAll('span[data-ln]')).forEach((n) => { pw = Math.max(pw, n.offsetWidth); });
    const right = Math.max(120 + hd.offsetWidth, LX + 72 + pw);
    const dx = Math.round((W - (LX + right)) / 2 - 0);
    if (Math.abs(endX - m.endX) > 1 || Math.abs(dx - m.dx) > 1) setM({ endX, dx });
  });
  const endX = m.endX, dx = m.dx;
  const n = (sc.body || []).length;
  const ly = PT + (n - 1) * LH + LH / 2 + 4;
  const dur = sc.dur || 6;
  const pan = E.easeInOutCubic(clamp((lt - (dur - PAN)) / PAN, 0, 1));
  const hl = easeIO(lt, 0.9, 0.5);
  return (
    <div style={{ ...shell, background: PALE, ...iris(lt) }}>
      <div style={{ position: 'absolute', inset: 0, background: PALE, transform: `translateX(${-pan * W}px)` }}>
        {RT.showLogo ? <Logo dark /> : null}
        <div style={{ position: 'absolute', left: 120 + dx, top: 520, color: TEAL, ...BOLD(170, 176), letterSpacing: '-0.04em', ...rise(lt, 0.4, 30) }}>
          <span ref={headRef} style={{ display: 'inline-block' }}>{sc.head}{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', left: -10, right: -10, top: 96, bottom: 20, background: MINT,
              transform: `scaleX(${hl})`, transformOrigin: 'left' }}></span>
            <span style={{ position: 'relative' }}>{sc.word}</span>
          </span></span>
        </div>
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Draw d={`M ${LX + dx} 718 V ${TY} H ${LX + dx + 50}`} p={easeIO(lt, 1.1, 0.7)} color={MINT} w={4} />
          <Draw d={`M ${endX + dx + 20} ${ly} H ${endX + dx + 60} V ${Y3} H ${W}`} p={easeIO(lt, 2.9, 1.5)} color={MINT} w={4} />
        </svg>
        <img src="assets/carro-tcross.png" alt="" style={{ position: 'absolute', left: 40, top: 1040, width: 1000, height: 'auto',
          transform: `translateX(${(1 - E.easeOutCubic(clamp((lt - 2.3) / 1.1, 0, 1))) * 1100}px)` }} />
        <div ref={paraRef} style={{ position: 'absolute', left: LX + 72 + dx, top: PT, color: TEAL }}>
          {(sc.body || []).map((ln, i) => (
            <div key={i} style={{ ...rise(lt, 1.7 + i * 0.1, 16), whiteSpace: 'nowrap', ...REG(52, LH) }}>
              <span data-ln="1" ref={i === n - 1 ? lastRef : null}>{rich(ln, TEAL)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3 · preto (vídeo) — continua o deslize; a linha atravessa sobre o parágrafo e termina num círculo */
function Road() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const lineP = easeIO(lt, 0.1, 1.0);
  const dot = pop(lt, 1.05, 0.6);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_3} start={0} end={7} speed={0.95} scale={1.08} overlay="rgba(0,0,0,0.4)" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: Y3 - 60, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)' }}></div>
      {RT.showLogo ? <Logo /> : null}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <Draw d={`M 0 ${Y3} H 540`} p={lineP} color={MINT} />
        <circle cx={540} cy={Y3} r={16} fill={MINT} style={{ transform: `scale(${dot})`, transformOrigin: '540px ' + Y3 + 'px' }}></circle>
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: Y3 + 60, textAlign: 'center', color: WHITE }}>
        <Lines list={sc.body} lt={lt} delay={1.3} step={0.1} style={REG(52, 66)} accent={MINT} />
      </div>
    </div>
  );
}

/* 4 · verde escuro — bloco de texto centralizado, entrelinha uniforme; pílulas inclinadas sobre as bordas; vídeo embaixo */
function Assist() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const LINE = { ...BOLD(68, 80), letterSpacing: '-0.025em' };
  const h24 = Math.round(24 * E.easeOutCubic(clamp((lt - 2.6) / 1.0, 0, 1)));
  const vid = easeIO(lt, 3.0, 0.8);
  const chip = (d0, rot, bg, pos, draw, label) => {
    const k = pop(lt, d0, 0.8), o = ease(lt, d0, 0.25), dr = easeIO(lt, d0 + 0.15, 0.8);
    return (
      <div style={{ position: 'absolute', height: 100, padding: '0 36px 0 26px', ...pos, borderRadius: 50, background: bg,
        display: 'flex', alignItems: 'center', gap: 12, opacity: o, zIndex: 2, whiteSpace: 'nowrap',
        transform: `rotate(${rot}deg) scale(${k})` }}>
        <svg width="58" height="58" viewBox="0 0 160 160" style={{ overflow: 'visible' }}>{draw(dr)}</svg>
        {label ? <span style={{ color: TEAL, ...BOLD(46, 50), letterSpacing: 0 }}>{label}</span> : null}
      </div>
    );
  };
  const shield = (p) => (
    <React.Fragment>
      <Draw d="M80 18 L132 38 V80 C132 112 110 134 80 144 C50 134 28 112 28 80 V38 Z" p={p} color={TEAL} w={16} />
      <Draw d="M56 82 L74 100 L106 66" p={clamp(p * 1.6 - 0.6, 0, 1)} color={TEAL} w={16} />
    </React.Fragment>
  );
  const clock = (p) => (
    <React.Fragment>
      <Draw d="M132 80 A52 52 0 1 1 116 42" p={p} color={TEAL} w={16} />
      <Draw d="M118 18 V44 H92" p={clamp(p * 1.6 - 0.6, 0, 1)} color={TEAL} w={16} />
      <Draw d="M80 52 V82 L100 94" p={clamp(p * 1.6 - 0.6, 0, 1)} color={TEAL} w={16} />
    </React.Fragment>
  );
  const lines = sc.lines || [];
  return (
    <div style={{ ...shell, background: TEAL, ...iris(lt) }}>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 390, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE }}>
        {lines.map((ln, i) => (
          <div key={i} style={{ position: 'relative', ...LINE, whiteSpace: 'nowrap', ...rise(lt, 0.4 + i * 0.14, 18) }}>
            {rich(ln, MINT)}
            {i === sc.shieldAt ? chip(1.5, -8, PALE, { left: '100%', marginLeft: 14, top: -6, padding: '0 26px' }, shield, null) : null}
            {i === sc.clockAt ? chip(2.4, 7, MINT, { right: '100%', marginRight: 14, top: -6 }, clock, h24 + 'h') : null}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: -40, right: -40, top: 980, bottom: -120, background: BLACK,
        borderTopRightRadius: 100, borderBottomLeftRadius: 100, overflow: 'hidden',
        clipPath: `inset(${(1 - vid) * 100}% 0 0 0 round 0 100px 0 100px)` }}>
        <BgVideo src={VID_4} start={0} end={6.76} speed={0.83} overlay="rgba(0,0,0,0.25)" />
      </div>
    </div>
  );
}

/* 5 · preto (vídeo) — linhas desalinhadas em escada + "[ ou seja ]"; "ir mais longe" puxa a linha */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const BIG = { ...BOLD(80, 84), letterSpacing: '-0.035em' };
  const rows = sc.rows || [];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK }}>
      <BgVideo src={VID_5} start={0} end={5.2} speed={0.78} scale={1.08} overlay="rgba(0,0,0,0.45)" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1100,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }}></div>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 330, color: WHITE }}>
        {rows.map((r, i) => {
          const d = 0.3 + i * 0.16, p = ease(lt, d, 0.6);
          const far = !!r.far;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, paddingLeft: r.x || 0, paddingRight: r.r || 0, justifyContent: r.r != null ? 'flex-end' : 'flex-start', opacity: p,
              transform: `translateX(${(1 - p) * (i % 2 ? -50 : 50)}px)` }}>
              {r.tag ? <div style={{ color: MINT, ...REG(46, 60), whiteSpace: 'nowrap' }}>[ {r.tag} ]</div> : null}
              {r.t ? <div style={{ ...BIG, color: far ? MINT : WHITE, whiteSpace: 'nowrap' }}>{r.t}</div> : null}
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LAYOUTS = { cover: Cover, answer: Answer, road: Road, assist: Assist, closing: Closing };

function SudesteVideo8() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(() => {
    ['assets/logo-dark.png', 'assets/logo-white.png'].forEach((src) => {
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

window.SudesteVideo8 = SudesteVideo8;
