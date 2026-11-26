/* Sudeste Assinatura — VÍDEO 11 (1080×1920). "Quem teve a ideia de assinar um carro?" — linha do tempo.
   Uma linha contínua atravessa as telas: sai sempre pela direita e a tela seguinte entra empurrando (push).
   1 preta (vídeo) · 2 menta (Havaí + EUA) · 3 preta (vídeo, montadoras) · 4 verde escuro (Brasil) · 5 verde escuro (2020 + carros) · 6 preta (vídeo) */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const VID_A = 'assets/videos/videoA.mp4', VID_B = 'assets/videos/videoB.mp4', VID_C = 'assets/videos/videoC.mp4';
const VID_DUR = { [VID_A]: 6.5, [VID_B]: 7.5, [VID_C]: 7.2 };
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', PALE = '#c6f6d6', WHITE = '#ffffff';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200, PUSH = 0.9, HEAD = 0.05;
const E = Easing;
const RT = { showLogo: true, scenes: [] };

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function easeIO(lt, delay, d) { return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1)); }
function pop(lt, delay, d) { const x = clamp((lt - delay) / (d || 0.6), 0, 1); return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11); }
function rise(lt, delay, px, d) { const p = ease(lt, delay, d); return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 22 : px)}px)` }; }
function rich(text, accent, w, italic) {
  return String(text).split('**').map((p, i) => i % 2 === 1
    ? <span key={i} style={{ color: accent, fontWeight: w || 700, fontStyle: italic ? 'italic' : 'normal' }}>{p}</span>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}
function Lines({ list, lt, delay, step, style, accent, w, italic }) {
  return (list || []).map((ln, i) => (
    <div key={i} style={{ ...rise(lt, (delay || 0) + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>{rich(ln, accent, w, italic)}</div>
  ));
}
const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* vídeo de fundo — fade-in só quando o <video> já decodificou o 1º frame,
   pra não piscar preto/frame velho; VideoSprite (animations-v2.jsx) ancora
   o início no momento em que a cena monta, então start é sempre 0. */
function BgVideo({ src }) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => { if (!readyRef.current) { readyRef.current = true; setReady(true); } }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => { if (!readyRef.current) { readyRef.current = true; setReady(true); } };
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: BLACK }} />
      <VideoSprite src={src} start={0} end={VID_DUR[src] || 6} onLoadedData={markReady}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} />
    </React.Fragment>
  );
}
const BOLD = (fs, lh) => ({ fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.03em' });
const REG = (fs, lh) => ({ fontWeight: 400, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' });
const LIGHT = (fs, lh) => ({ fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.045em' });
const THEMES = {
  black: { bg: BLACK, ink: WHITE, line: PALE, acc: PALE, logo: 'assets/logo-white.png' },
  pale: { bg: PALE, ink: TEAL, line: TEAL, acc: TEAL, logo: 'assets/logo-dark.png' },
  teal: { bg: TEAL, ink: WHITE, line: PALE, acc: PALE, logo: 'assets/logo-white.png' },
};

/* medição de path (getPointAtLength) */
const PATHS = {};
function measure(d) {
  if (PATHS[d]) return PATHS[d];
  let svg = document.getElementById('__measure_svg');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = '__measure_svg'; svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';
    document.body.appendChild(svg);
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d); svg.appendChild(p);
  const len = p.getTotalLength();
  const at = (f) => { const q = p.getPointAtLength(clamp(f, 0, 1) * len); return { x: q.x, y: q.y }; };
  const nc = {};
  const near = (x, y) => { const k = x + ',' + y; if (nc[k] != null) return nc[k]; let best = 0, bd = 1e9; for (let i = 0; i <= 600; i++) { const q = at(i / 600); const dd = (q.x - x) ** 2 + (q.y - y) ** 2; if (dd < bd) { bd = dd; best = i / 600; } } return (nc[k] = best); };
  return (PATHS[d] = { len, at, near });
}
/* progresso da linha por keyframes [[t, frac], …] */
function track(lt, keys) {
  if (lt <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t0, f0] = keys[i - 1], [t1, f1] = keys[i];
    if (lt <= t1) return f0 + (f1 - f0) * E.easeInOutCubic((lt - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
}
function Line({ d, f, color, dots, lt, head }) {
  const m = measure(d);
  const tip = m.at(f);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - f}></path>
      {(dots || []).map((dt, i) => {
        const fr = m.near(dt[0], dt[1]); const q = m.at(fr);
        const s = f >= fr ? pop(lt, dt[2] || 0, 0.6) : 0;
        return <circle key={i} cx={q.x} cy={q.y} r={20 * s} fill={color}></circle>;
      })}
      {head && f > 0.001 && f < 0.999 ? <circle cx={tip.x} cy={tip.y} r="9" fill={color}></circle> : null}
    </svg>
  );
}
/* push: a cena atual sai para a esquerda, a próxima (cor + começo da linha) entra pela direita */
function usePush(lt, dur) { return easeIO(lt, dur - PUSH, PUSH); }
const GRADIENT_OVERLAY = 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.15) 100%)';
const GRADIENT_OVERLAY_B = 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.58) 45%, rgba(0,0,0,0.4) 100%)';
function NextIn({ p }) {
  const s = useScene(); const sc = s.scene;
  const i = RT.scenes.findIndex((x) => x.name === sc.name);
  const nx = RT.scenes[i + 1];
  if (!nx || p <= 0) return null;
  const th = THEMES[nx.theme] || THEMES.black;
  return (
    <div style={{ position: 'absolute', inset: 0, background: th.bg, transform: `translateX(${(1 - p) * W}px)`, zIndex: 30, overflow: 'hidden' }}>
      {/* vídeo da próxima tela já tocando durante o push — sem isso, a tela
          preta deste painel ficava visível por um instante na transição. */}
      {nx.video ? <BgVideo src={nx.video} /> : null}
      {nx.video ? <div style={{ position: 'absolute', inset: 0, background: nx.video === VID_B ? GRADIENT_OVERLAY_B : GRADIENT_OVERLAY }} /> : null}
      {nx.path && !nx.fresh ? <Line d={nx.path} f={HEAD * clamp((p - 0.5) / 0.5, 0, 1)} color={th.line} lt={0} head /> : null}
    </div>
  );
}
function Frame({ theme, lt, dur, children, last, video, overlay }) {
  const th = THEMES[theme] || THEMES.black;
  const p = last ? 0 : usePush(lt, dur);
  return (
    <div style={{ ...shell, background: th.bg }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-p * W}px)` }}>
        {video ? <BgVideo src={video} /> : null}
        {video && overlay ? <div style={{ position: 'absolute', inset: 0, background: overlay }} /> : null}
        {RT.showLogo ? <img src={th.logo} alt="Sudeste Assinaturas" decoding="sync" loading="eager"
          style={{ position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)', width: LOGO_W, height: 'auto', zIndex: 6 }} /> : null}
        {children}
      </div>
      <NextIn p={p} />
    </div>
  );
}
/* tópico: rótulo + parágrafo */
const ICONS = {
  palm: 'M25 44 C27 34 27 24 24 15 M24 15 C18 9 10 9 5 14 M24 15 C30 9 38 9 43 14 M24 15 C19 16 13 21 11 28 M24 15 C29 16 35 21 37 28 M14 44 H36',
  flag: 'M12 44 V5 M12 8 C20 4 28 12 38 8 V26 C28 30 20 22 12 26',
  pin: 'M24 44 C24 44 38 30 38 19 A14 14 0 0 0 10 19 C10 30 24 44 24 44 Z M24 14 A5 5 0 1 1 24 24 A5 5 0 1 1 24 14',
  factory: 'M6 42 V22 L16 28 V22 L26 28 V22 L36 28 V8 H42 V42 Z M13 36 H17 M23 36 H27 M33 36 H37',
  calendar: 'M8 12 H40 V42 H8 Z M8 20 H40 M16 6 V16 M32 6 V16 M17 31 L22 36 L31 27',
};
function Topic({ lt, delay, tp, th }) {
  const right = tp.align === 'right';
  const ip = easeIO(lt, delay - 0.1, 0.8);
  const bs = tp.bodySize || [48, 60];
  return (
    <div style={{ position: 'absolute', textAlign: right ? 'right' : 'left', display: 'flex', flexDirection: 'column', alignItems: right ? 'flex-end' : 'flex-start', ...tp.pos }}>
      {tp.icon ? <svg width="64" height="64" viewBox="0 0 48 48" style={{ marginBottom: 18, transform: `scale(${pop(lt, delay - 0.1, 0.6)})` }}>
        <path d={ICONS[tp.icon]} fill="none" stroke={th.acc} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ip}></path>
      </svg> : null}
      {Array.isArray(tp.label)
        ? <Lines list={tp.label} lt={lt} delay={delay} step={0.12} style={{ ...LIGHT(150, 144), color: th.ink }} accent={th.acc} w={400} />
        : <div style={{ ...BOLD(68, 74), color: th.ink, ...rise(lt, delay, 20) }}>{tp.label}</div>}
      <div style={{ marginTop: 24 }}>
        <Lines list={tp.body} lt={lt} delay={delay + 0.2} step={0.08} style={{ ...REG(bs[0], bs[1]), color: th.ink }} accent={th.acc} />
      </div>
    </div>
  );
}

/* 1 · preto (vídeo) — editorial: parágrafo pequeno em cima, linha em L, pergunta grande alinhada à direita */
function Cover() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene; const th = THEMES.black;
  const v = easeIO(lt, 1.3, 0.5), h = easeIO(lt, 1.7, 0.6);
  return (
    <Frame theme="black" lt={lt} dur={sc.dur} video={VID_A} overlay="rgba(0,0,0,0.45)">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 370, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', color: WHITE }}>
          <div><Lines list={sc.intro} lt={lt} delay={0.3} step={0.1} style={LIGHT(66, 76)} accent={WHITE} w={700} /></div>
          <div style={{ position: 'absolute', left: 30, top: 170, width: 3, height: 82, background: PALE, transform: `scaleY(${v})`, transformOrigin: 'top' }}></div>
          <div style={{ position: 'absolute', left: 30, top: 249, width: 180, height: 3, background: PALE, transform: `scaleX(${h})`, transformOrigin: 'left' }}></div>
          <div style={{ marginTop: 40, paddingLeft: 240, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Lines list={sc.title} lt={lt} delay={2.0} step={0.16} style={LIGHT(116, 112)} accent={PALE} w={400} italic />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* timeline genérica: linha + tópicos */
function Timeline() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene; const th = THEMES[sc.theme];
  const m = measure(sc.path);
  const keys = React.useMemo(() => sc.keys.map(([t, v]) => [t, typeof v === 'string' ? m.near(sc.dots[+v.slice(1)][0], sc.dots[+v.slice(1)][1]) + 0.004 : v]), [sc.path, JSON.stringify(sc.keys)]);
  const f = track(lt, keys);
  return (
    <Frame theme={sc.theme} lt={lt} dur={sc.dur} last={sc.last} video={sc.video} overlay={sc.video === VID_B ? GRADIENT_OVERLAY_B : GRADIENT_OVERLAY}>
      <Line d={sc.path} f={f} color={th.line} dots={sc.dots} lt={lt} head />
      {(sc.topics || []).map((tp, i) => (
        <Topic key={i} lt={lt} delay={tp.at} tp={tp} th={th} />
      ))}
      {sc.big ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: sc.big.top, color: th.ink, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: sc.big.center ? 'center' : 'flex-start', textAlign: sc.big.center ? 'center' : 'left' }}>
          <Lines list={sc.big.lines} lt={lt} delay={sc.big.at} step={0.12} style={LIGHT(sc.big.size[0], sc.big.size[1])} accent={th.acc} w={500} />
          {sc.big.sub ? <div style={{ marginTop: 36 }}>
            <Lines list={sc.big.sub} lt={lt} delay={sc.big.at + 0.6} step={0.1} style={sc.big.subBold ? { ...BOLD(sc.big.subSize[0], sc.big.subSize[1]), color: PALE } : REG(sc.big.subSize[0], sc.big.subSize[1])} accent={th.acc} />
          </div> : null}
        </div>
        </div>
      ) : null}
      {sc.hero ? <Hero lt={lt} h={sc.hero} th={th} /> : null}
      {sc.cars ? <Cars lt={lt} at={sc.cars.at} top={sc.cars.top} /> : null}
    </Frame>
  );
}

function Hero({ lt, h, th }) {
  const r = easeIO(lt, h.at + 0.3, 0.8);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: h.top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: th.ink }}>
      <div style={{ ...LIGHT(100, 104), ...rise(lt, h.at, 20) }}>{h.pre}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36, marginTop: 34 }}>
        <div style={{ width: 150, height: 3, background: PALE, transform: `scaleX(${r})`, transformOrigin: 'right' }}></div>
        <div style={{ ...LIGHT(210, 200), color: PALE, fontWeight: 400, ...rise(lt, h.at + 0.15, 30) }}>{h.year}</div>
        <div style={{ width: 150, height: 3, background: PALE, transform: `scaleX(${r})`, transformOrigin: 'left' }}></div>
      </div>
      <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Lines list={h.body} lt={lt} delay={h.at + 0.5} step={0.08} style={REG(50, 64)} accent={WHITE} />
      </div>
    </div>
  );
}
/* Saveiro espelhada; placa e "ROBUST" re-espelhadas para continuarem legíveis (coords no PNG 1920×960) */
const PATCHES = [[484, 618, 176, 76], [1196, 618, 132, 38]];
function FlippedCar({ src, w, style }) {
  const k = w / 1920;
  return (
    <div style={{ ...style, width: w, height: 960 * k }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'scaleX(-1)' }}>
        <img src={src} alt="" style={{ position: 'absolute', left: 0, top: 0, width: w, height: 'auto' }} />
        {PATCHES.map(([x, y, pw, ph], i) => (
          <div key={i} style={{ position: 'absolute', left: x * k, top: y * k, width: pw * k, height: ph * k, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, transform: 'scaleX(-1)' }}>
              <img src={src} alt="" style={{ position: 'absolute', left: -x * k, top: -y * k, width: w, height: 'auto' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
/* 3 carros VW: o do meio na frente, os dois laterais atrás */
function Cars({ lt, at, top }) {
  const list = [
    { src: 'assets/carro-tcross.webp', x: -220, y: -70, w: 760, z: 1, d: 0.35 },
    { src: 'assets/carro-saveiro.webp', x: 220, y: -70, w: 760, z: 1, d: 0.6, flip: true },
    { src: 'assets/carro-tera-preto.webp', x: 0, y: 90, w: 1100, z: 2, d: 0 },
  ];
  return list.map((c, i) => {
    const p = ease(lt, at + c.d, 0.9);
    const st = { position: 'absolute', left: W / 2 - c.w / 2 + c.x, top: top + c.y, zIndex: c.z, opacity: p, transform: `translateY(${(1 - p) * 60}px)` };
    if (c.flip) return <FlippedCar key={i} src={c.src} w={c.w} style={st} />;
    return <img key={i} src={c.src} alt="" style={{ ...st, width: c.w, height: 'auto' }} />;
  });
}

const LAYOUTS = { cover: Cover, timeline: Timeline };

function SudesteVideo11() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  const scenes = React.useMemo(() => JSON.parse(window.OM_SCENES), [window.OM_SCENES]);
  RT.scenes = scenes;
  React.useEffect(() => {
    ['assets/logo-dark.png', 'assets/logo-white.png', 'assets/carro-tcross.webp', 'assets/carro-saveiro.webp', 'assets/carro-tera-preto.webp']
      .forEach((src) => { const im = new Image(); im.src = src; if (im.decode) im.decode().catch(() => {}); });
  }, []);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || Timeline; });
  return (
    <React.Fragment>
      <SceneStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={BLACK} transition="cut">
        {children}
      </SceneStage>
      <TweaksPanel>
        <TweakSection label="Vídeo" />
        <TweakToggle label="Mostrar logo" value={t.showLogo !== false} onChange={(v) => setTweak('showLogo', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}
window.SudesteVideo11 = SudesteVideo11;
