/* Sudeste Assinatura — VÍDEO 12 (1080×1920). "Quero assinar um carro… mas não sei qual modelo escolher".
   1 verde (baralho de cards) · 2 neutro (editorial) · 3 verde (chips + carro) · 4 preto (linha → texto à direita) · 5 verde (centralizado com réguas) · 6 preto
   Destaques em amarelo Sudeste. Branco Sudeste = #efefef. Transições: push horizontal. */
const { useScene, SceneStage, Easing, clamp, VideoSprite, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio } = window;

const W = 1080, H = 1920;
const TEAL = '#034845', YEL = '#f2ff46', WHITE = '#efefef', NEUTRAL = '#efeee9', BLACK = '#000000';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200, PUSH = 0.9;
const E = Easing;
const RT = { showLogo: true, scenes: [], cardAnim: 'carrossel' };

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function easeIO(lt, delay, d) { return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function back(lt, delay, d) { const x = clamp((lt - delay) / (d || 0.7), 0, 1); const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function rise(lt, delay, px, d) { const p = ease(lt, delay, d); return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 22 : px)}px)` }; }
/* **negrito em cor** · ==marca-texto amarelo== */
function rich(text, o) {
  const out = []; let k = 0;
  String(text).split('==').forEach((seg, j) => {
    if (j % 2 === 1) {
      const m = o.mark == null ? 1 : o.mark;
      out.push(<span key={k++} style={{ color: TEAL, fontWeight: o.mw || 500, padding: '0 10px', margin: '0 -4px', backgroundImage: `linear-gradient(${YEL}, ${YEL})`, backgroundRepeat: 'no-repeat', backgroundPosition: o.markPos || 'left 58%', backgroundSize: `${m * 100}% ${o.markHeight || 78}%` }}>{seg}</span>);
      return;
    }
    seg.split('**').forEach((p, i) => out.push(i % 2 === 1
      ? <span key={k++} style={{ color: o.accent, fontWeight: o.w || 700, fontStyle: o.italic ? 'italic' : 'normal' }}>{p}</span>
      : <React.Fragment key={k++}>{p}</React.Fragment>));
  });
  return out;
}
function Lines({ list, lt, delay, step, style, accent, w, italic, markAt, mw, markHeight, markPos }) {
  return (list || []).map((ln, i) => {
    const d = (delay || 0) + i * (step || 0.08);
    const mark = markAt != null ? easeIO(lt, markAt, 0.4) : easeIO(lt, d + 0.35, 0.6);
    return <div key={i} style={{ ...rise(lt, d, 18), whiteSpace: 'nowrap', ...style }}>{rich(ln, { accent, w, italic, mark, mw, markHeight, markPos })}</div>;
  });
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };
const BOLD = (fs, lh) => ({ fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' });
const MED = (fs, lh) => ({ fontWeight: 500, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' });
const REG = (fs, lh) => ({ fontWeight: 400, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '0em' });
const LIGHT = (fs, lh) => ({ fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.02em' });
const THEMES = {
  teal: { bg: TEAL, ink: WHITE, acc: YEL, logo: 'assets/logo-white.png' },
  neutral: { bg: NEUTRAL, ink: TEAL, acc: TEAL, logo: 'assets/logo-dark.png' },
  black: { bg: BLACK, ink: WHITE, acc: YEL, logo: 'assets/logo-white.png' },
};

/* fundo de vídeo opcional (sc.video) — por enquanto as telas 4 e 6 ficam pretas */
function VideoBg({ v }) {
  if (!v) return null;
  return (
    <React.Fragment>
      <VideoSprite src={v.src} start={v.start || 0} end={v.end} style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.85) 100%)' }}></div>
    </React.Fragment>
  );
}
function usePush(lt, dur) { return easeIO(lt, dur - PUSH, PUSH); }
/* transições variadas: push · up · circle · wipe · zoom */
function curStyle(type, p) {
  if (type === 'up') return { transform: `translateY(${-p * H * 0.35}px)` };
  if (type === 'circle') return { transform: `scale(${1 + 0.06 * p})` };
  if (type === 'wipe') return { transform: `translateX(${-p * 260}px)` };
  if (type === 'zoom') return { transform: `scale(${1 - 0.12 * p})`, opacity: 1 - p };
  return { transform: `translateX(${-p * W}px)` };
}
function nextStyle(type, p) {
  if (type === 'up') return { transform: `translateY(${(1 - p) * H}px)`, borderRadius: `${(1 - p) * 90}px ${(1 - p) * 90}px 0 0` };
  if (type === 'circle') return { clipPath: `circle(${p * 120}% at 50% 62%)` };
  if (type === 'wipe') return { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` };
  if (type === 'zoom') return { opacity: p, transform: `scale(${1.08 - 0.08 * p})` };
  return { transform: `translateX(${(1 - p) * W}px)` };
}
function NextIn({ p, type }) {
  const s = useScene(); const sc = s.scene;
  const i = RT.scenes.findIndex((x) => x.name === sc.name);
  const nx = RT.scenes[i + 1];
  if (!nx || p <= 0) return null;
  const th = THEMES[nx.theme] || THEMES.teal;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: th.bg, zIndex: 30, overflow: 'hidden', ...nextStyle(type, p) }}>
        {nx.video ? <VideoBg v={nx.video} /> : null}
      </div>
      {type === 'wipe' && p < 1 ? <div style={{ position: 'absolute', top: 0, bottom: 0, left: p * W - 18, width: 18, background: YEL, zIndex: 31 }}></div> : null}
    </React.Fragment>
  );
}
function Frame({ theme, lt, dur, children, last, video }) {
  const th = THEMES[theme] || THEMES.teal;
  const sc = useScene().scene;
  const type = sc.trans || 'push';
  const p = last ? 0 : usePush(lt, dur);
  return (
    <div style={{ ...shell, background: th.bg }}>
      <div style={{ position: 'absolute', inset: 0, ...curStyle(type, p) }}>
        {video ? <VideoBg v={video} /> : null}
        {RT.showLogo ? <img src={th.logo} alt="Sudeste Assinaturas" decoding="sync" loading="eager"
          style={{ position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)', width: LOGO_W, height: 'auto', zIndex: 6 }} /> : null}
        {children}
      </div>
      <NextIn p={p} type={type} />
    </div>
  );
}

/* ── 1 · verde: título grande + baralho de cards ──────────────── */
const CARS = [
  { src: 'assets/s12-nivus.webp', name: 'Nivus', tag: 'SUV Coupé', feat: ['Design esportivo e', 'motor 200 TSI turbo'] },
  { src: 'assets/s12-polo.webp', name: 'Polo', tag: 'Hatch', feat: ['Compacto, econômico', 'e ágil na cidade'] },
  { src: 'assets/s12-saveiro.webp', name: 'Saveiro', tag: 'Picape', feat: ['Caçamba ampla para', 'trabalho e lazer'] },
  { src: 'assets/s12-tcross.webp', name: 'T-Cross', tag: 'SUV', feat: ['Espaço interno e', 'porta-malas generoso'] },
  { src: 'assets/s12-tera.webp', name: 'Tera', tag: 'SUV compacto', feat: ['O SUV mais novo', 'da Volkswagen'] },
];
const CARD_W = 560, CARD_H = 760;
function CarCard({ c, i }) {
  return (
    <div style={{ width: CARD_W, height: CARD_H, borderRadius: 52, background: WHITE, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 370, background: 'linear-gradient(180deg, #dde6e2 0%, #efefef 100%)' }}></div>
      <div style={{ position: 'absolute', top: 26, right: 28, padding: '12px 22px 6px', borderRadius: '22px 0 22px 0', background: TEAL, color: WHITE, ...MED(26, 32), letterSpacing: '0.02em' }}>{c.tag}</div>
      <img src={c.src} alt={c.name} style={{ position: 'absolute', left: -80, top: 50, width: 720, height: 'auto' }} />
      <div style={{ position: 'absolute', left: 30, right: 30, top: 428, textAlign: 'center' }}>
        <div style={{ ...BOLD(70, 72), color: TEAL }}>{c.name}</div>
        <div style={{ marginTop: 2, ...REG(32, 38), color: '#4b6260' }}>{c.feat.map((f, j) => <div key={j}>{f}</div>)}</div>
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 30, height: 92, display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, borderRadius: '46px 0 46px 0', background: YEL, color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', ...BOLD(34, 40) }}>Assinar</div>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={YEL} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </div>
      </div>
    </div>
  );
}
function deckPose(mode, i, pos, n) {
  if (mode === 'embaralhar') {
    const rel = (((i - pos) % n) + n) % n;
    if (rel > n - 1) { // carta da frente saindo: desce, vai pro lado e volta para o fundo
      const g = n - rel; const arc = Math.sin(g * Math.PI);
      const back = (n - 1) * g;
      return { x: -arc * 620, y: arc * 140 - back * 34, r: -arc * 14, s: 1 - back * 0.07, z: g < 0.5 ? 25 : 1, op: 1, shade: g * 0.4 };
    }
    return { x: rel * 34, y: -rel * 40, r: rel * 2.5, s: 1 - rel * 0.07, z: 20 - Math.round(rel * 2), op: clamp(3.6 - rel, 0, 1), shade: Math.min(rel, 3) * 0.16 };
  }
  let rel = (((i - pos) % n) + n) % n; if (rel > n / 2) rel -= n;
  const a = Math.abs(rel);
  return { x: rel * 430, y: a * 50, r: rel * 6, s: 1 - Math.min(a, 2) * 0.2, z: 20 - Math.round(a * 4), op: clamp(2.3 - a, 0, 1), shade: Math.min(a, 2) * 0.22 };
}
function Cover() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const enter = back(lt, 1.0, 0.9);
  const swaps = sc.swaps || [2.2, 3.3, 4.4, 5.5];
  const pos = swaps.reduce((a, t0) => a + easeIO(lt, t0, 0.65), 0);
  const top = sc.cardTop || 930, cx = W / 2 - CARD_W / 2;
  return (
    <Frame theme="teal" lt={lt} dur={sc.dur}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 370, color: WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Lines list={sc.intro} lt={lt} delay={0.2} step={0.1} style={REG(70, 84)} accent={YEL} />
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Lines list={sc.title} lt={lt} delay={0.6} step={0.12} style={LIGHT(108, 108)} accent={YEL} w={400} italic />
        </div>
      </div>
      {CARS.map((c, i) => {
        const q = deckPose(RT.cardAnim, i, pos, CARS.length);
        const ein = 1 - enter;
        return (
          <div key={i} style={{ position: 'absolute', left: cx, top, zIndex: q.z, opacity: q.op * clamp(enter * 2, 0, 1),
            transform: `translate(${q.x}px, ${q.y + ein * 260}px) rotate(${q.r}deg) scale(${q.s * (0.85 + 0.15 * enter)})`, transformOrigin: '50% 100%',
            boxShadow: '0 30px 60px rgba(0,0,0,0.28)', borderRadius: 52 }}>
            <CarCard c={c} i={i} />
            {q.shade > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 52, background: `rgba(1,40,38,${q.shade})` }}></div> : null}
          </div>
        );
      })}
    </Frame>
  );
}

/* ── 2 · neutro: frase grande + L longa + parágrafo ─────────────── */
function Editorial() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const v = easeIO(lt, 1.2, 0.45), h = easeIO(lt, 1.6, 0.6);
  return (
    <Frame theme="neutral" lt={lt} dur={sc.dur}>
      <div style={{ position: 'absolute', left: 190, top: 450, color: TEAL }}>
        <Lines list={sc.small} lt={lt} delay={0.3} step={0.1} style={REG(64, 76)} accent={TEAL} />
      </div>
      <div style={{ position: 'absolute', left: 200, top: 710, width: 3, height: 170, background: TEAL, transform: `scaleY(${v})`, transformOrigin: 'top' }}></div>
      <div style={{ position: 'absolute', left: 200, top: 877, width: 340, height: 3, background: TEAL, transform: `scaleX(${h})`, transformOrigin: 'left' }}></div>
      <div style={{ position: 'absolute', right: 90, top: 820, color: TEAL, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
        <Lines list={sc.big} lt={lt} delay={1.9} step={0.12} style={LIGHT(104, 108)} accent={TEAL} w={500} markAt={2.8} />
      </div>
      {sc.routines ? <div style={{ position: 'absolute', left: 0, right: 0, top: sc.routinesTop || 1480, display: 'flex', justifyContent: 'center', gap: 70 }}>
        {sc.routines.map((r, i) => {
          const d = 3.3 + i * 0.2, p = back(lt, d, 0.6), ip = easeIO(lt, d + 0.15, 0.8);
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: clamp(p, 0, 1), transform: `translateY(${(1 - p) * 40}px)` }}>
              <div style={{ width: 150, height: 150, borderRadius: '36px 0 36px 0', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="84" height="84" viewBox="0 0 48 48"><path d={RICONS[r.icon]} fill="none" stroke={YEL} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ip}></path></svg>
              </div>
            </div>
          );
        })}
      </div> : null}
    </Frame>
  );
}

const RICONS = {
  city: 'M6 42 H42 M9 42 V18 H19 V42 M19 42 V8 H31 V42 M31 42 V24 H39 V42 M13 24 V26 M13 32 V34 M25 14 V16 M25 22 V24 M25 30 V32 M35 30 V32',
  rural: 'M4 42 C13 32 21 32 29 38 C34 34 39 33 44 36 M12 34 V24 M12 24 C7 24 6 14 12 11 C18 14 17 24 12 24 M36 10 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
  family: 'M12 14 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M36 14 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M4 42 V31 C4 24 20 24 20 31 V42 M28 42 V31 C28 24 44 24 44 31 V42 M24 18 m-4.5 0 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 M17.5 42 V33 C17.5 28 30.5 28 30.5 33 V42',
};
/* ── 3 · verde: chips (círculo + retângulo de cantos opostos) + carro ─── */
const ICONS = {
  gauge: 'M7 33 A17 17 0 0 1 41 33 M11 33 H7 M41 33 H37 M12 21 L15 23.5 M36 21 L33 23.5 M24 16 V20 M24 33 L32 23 M10 40 H38',
  road: 'M6 42 H42 M10 42 V20 L18 15 V42 M18 24 H28 V42 M28 8 H38 V42 M32 14 V16 M32 22 V24 M32 30 V32 M22 30 V32',
  size: 'M8 18 V8 H18 M8 8 L18 18 M40 18 V8 H30 M40 8 L30 18 M8 30 V40 H18 M8 40 L18 30 M40 30 V40 H30 M40 40 L30 30',
};
function Chip({ q, lt, at }) {
  const p = back(lt, at, 0.8), o = ease(lt, at, 0.4);
  const ip = easeIO(lt, at + 0.25, 0.8);
  return (
    <div style={{ position: 'absolute', top: q.top, left: 80, display: 'flex', alignItems: 'center', gap: 10, opacity: o, transform: `translateX(${(1 - p) * -260}px)` }}>
      <div style={{ width: 176, height: 176, borderRadius: '64px 0 0 0', background: YEL, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <svg width="92" height="92" viewBox="0 0 48 48">
          <path d={ICONS[q.icon]} fill="none" stroke={TEAL} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ip}></path>
          {q.icon === 'gauge' ? <circle cx="24" cy="33" r={2.8 * ip} fill={TEAL}></circle> : null}
        </svg>
      </div>
      <div style={{ height: 176, width: 740, boxSizing: 'border-box', paddingLeft: 48, paddingRight: 40, borderRadius: '0 0 64px 0', background: WHITE, color: TEAL, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {q.lines.map((ln, i) => <div key={i} style={{ ...REG(46, 56), whiteSpace: 'nowrap' }}>{rich(ln, { accent: TEAL, w: 700 })}</div>)}
      </div>
    </div>
  );
}
function Questions() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const cp = ease(lt, sc.car ? sc.car.at : 0, 1.2);
  const bv = sc.bottomVideo, vp = bv ? ease(lt, bv.at || 0, 1.0) : 0;
  return (
    <Frame theme="teal" lt={lt} dur={sc.dur}>
      {bv ? <div style={{ position: 'absolute', left: 0, right: 0, top: bv.top, bottom: 0, overflow: 'hidden', opacity: vp }}>
        {/* ÁREA DO VÍDEO: o Claude Code substitui o fundo preto pelo vídeo final, mantendo o degradê verde por cima */}
        {bv.src ? <VideoSprite src={bv.src} start={bv.start || 0} end={bv.end} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, background: BLACK }}></div>}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${TEAL} 0%, rgba(3,72,69,0.55) 22%, rgba(3,72,69,0) 50%)` }}></div>
      </div> : null}
      {sc.qs.map((q, i) => <Chip key={i} q={q} lt={lt} at={q.at} />)}
      {sc.car ? <img src={sc.car.src} alt="" style={{ position: 'absolute', left: sc.car.left, top: sc.car.top, width: sc.car.w, height: 'auto', opacity: cp, transform: `translateX(${(1 - cp) * 500}px)` }} /> : null}
    </Frame>
  );
}

/* ── 4 · preto: linha sai da esquerda e leva ao texto à direita ─── */
function LineText() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const LX = sc.left || 330, T = sc.top;
  const a = easeIO(lt, 0.2, 0.7);
  return (
    <Frame theme="black" lt={lt} dur={sc.dur} video={sc.video}>
      <div style={{ position: 'absolute', left: 0, top: T + 50, width: LX - 34, height: 3, background: YEL, transform: `scaleX(${a})`, transformOrigin: 'left' }}></div>
      <div style={{ position: 'absolute', left: LX, right: 60, top: T, color: WHITE }}>
        <Lines list={sc.big} lt={lt} delay={0.6} step={0.12} style={LIGHT(84, 96)} accent={YEL} w={500} />
        <div style={{ marginTop: 44 }}>
          <Lines list={sc.sub} lt={lt} delay={1.6} step={0.1} style={REG(46, 58)} accent={YEL} />
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {sc.chips.map((ch, i) => {
            const p = back(lt, 2.3 + i * 0.25, 0.6);
            return <div key={i} style={{ padding: '14px 30px', borderRadius: '32px 0 32px 0', background: YEL, color: TEAL, ...BOLD(42, 50), opacity: clamp(p, 0, 1), transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: 'left center' }}>{ch}</div>;
          })}
        </div>
      </div>
    </Frame>
  );
}

/* ── 5 · verde: frase grande centralizada + régua + destaque ────── */
function Centered() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const T = sc.y || 520, VT = T + 545, R1 = VT + 170, R2 = R1 + 330;
  const v = easeIO(lt, 1.8, 0.4), r1 = easeIO(lt, 2.1, 0.5), r2 = easeIO(lt, 2.9, 0.5);
  return (
    <Frame theme="teal" lt={lt} dur={sc.dur}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: T, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE }}>
        <Lines list={sc.top} lt={lt} delay={0.3} step={0.12} style={LIGHT(94, 102)} accent={YEL} w={500} italic />
      </div>
      <div style={{ position: 'absolute', left: W / 2 - 1.5, top: VT, width: 3, height: R1 - VT, background: YEL, transform: `scaleY(${v})`, transformOrigin: 'top' }}></div>
      <div style={{ position: 'absolute', left: 130, right: 130, top: R1, height: 3, background: YEL, transform: `scaleX(${r1})` }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: R1 + 40, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE }}>
        <Lines list={sc.bottom} lt={lt} delay={2.3} step={0.1} style={MED(70, 84)} accent={YEL} markAt={2.65} mw={700} markHeight={60} markPos="left 50%" />
      </div>
      <div style={{ position: 'absolute', left: 130, right: 130, top: R2, height: 3, background: YEL, transform: `scaleX(${r2})` }}></div>
    </Frame>
  );
}

/* ── 6 · preto: fechamento ──────────────────────────────────── */
function Closing() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <Frame theme="black" lt={lt} dur={sc.dur} video={sc.video} last>
      <div style={{ position: 'absolute', left: 0, right: 0, top: sc.top || 1260, color: WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Lines list={sc.pre} lt={lt} delay={0.5} step={0.12} style={REG(56, 68)} accent={YEL} />
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Lines list={sc.big} lt={lt} delay={1.6} step={0.18} style={LIGHT(140, 138)} accent={YEL} w={400} italic />
        </div>
      </div>
    </Frame>
  );
}

const LAYOUTS = { cover: Cover, editorial: Editorial, questions: Questions, linetext: LineText, centered: Centered, closing: Closing };

function SudesteVideo12() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.cardAnim = t.cardAnim || 'carrossel';
  const scenes = React.useMemo(() => JSON.parse(window.OM_SCENES), [window.OM_SCENES]);
  RT.scenes = scenes;
  React.useEffect(() => {
    ['assets/logo-dark.png', 'assets/logo-white.png', ...CARS.map((c) => c.src)]
      .forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Cover; });
  return (
    <React.Fragment>
      <SceneStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={TEAL} transition="cut">
        {children}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Vídeo" />
        <TweakToggle label="Mostrar logo" value={t.showLogo !== false} onChange={(v) => setTweak('showLogo', v)} />
        <TweakRadio label="Cards (tela 1)" value={t.cardAnim || 'carrossel'} options={[{ value: 'carrossel', label: 'Carrossel' }, { value: 'embaralhar', label: 'Embaralhar' }]} onChange={(v) => setTweak('cardAnim', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.SudesteVideo12 = SudesteVideo12;
