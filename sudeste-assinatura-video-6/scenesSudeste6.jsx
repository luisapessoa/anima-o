/* Sudeste Assinatura — VÍDEO 6 (1080×1920). "Se o carro não vai ser seu no final,
   por que tanta gente ainda prefere assinar?" Mesmo motor/padrão dos vídeos
   anteriores. Telas 1, 4 e 6: fundo preto com vídeo de fundo full-bleed
   (trechos do making-of Park Assist/Otto VW Brasil — mulher dirigindo, detalhes
   internos e externos do carro). Telas 2 e 5: cinza claro. Tela 3: mint. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', HL = '#5edcc8';
const WHITE = '#ffffff', GREY = '#f0f0f0', INK = '#03433f';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200;
const E = Easing;
const RT = { showLogo: true, videoBg: true };

// Vídeos de fundo das Telas 1, 4 e 6 (trechos do vídeo Park Assist/Otto VW
// Brasil — mulher dirigindo, detalhe interno do volante/console e externo do
// carro). Velocidades próximas de 1x (no máx. ~10-20% mais lento) — sem
// câmera lenta pesada nem loop em boomerang.
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
  const parts = String(text).split('**');
  return parts.map((p, i) => i % 2 === 1
    ? <span key={i} style={{ color: accent }}>{p}</span>
    : <React.Fragment key={i}>{p}</React.Fragment>);
}
function Lines({ list, lt, delay, step, style, accent }) {
  return (list || []).map((ln, i) => (
    <div key={i} style={{ ...rise(lt, (delay || 0) + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>
      {rich(ln, accent)}
    </div>
  ));
}
function ULines({ list, lt, delay, step, uDelay, style, uTop, origin, accent }) {
  return (list || []).map((ln, i) => {
    const u = easeIO(lt, uDelay + i * 0.22, 0.55);
    return (
      <div key={i} style={{ ...rise(lt, delay + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {rich(ln, accent)}
          <span style={{ position: 'absolute', left: 0, right: 0, top: uTop, height: 3, background: MINT,
            transform: `scaleX(${u})`, transformOrigin: origin || 'left' }}></span>
        </span>
      </div>
    );
  });
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
function Target({ lt, delay, x, y, r, bg }) {
  const ring = pop(lt, delay, 0.8);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, boxSizing: 'border-box',
        border: `3px solid ${MINT}`, borderRadius: '50%', background: bg || 'transparent',
        opacity: ease(lt, delay, 0.3), transform: `scale(${ring})` }}></div>
      <div style={{ position: 'absolute', left: x - r * 0.32, top: y - r * 0.32, width: r * 0.64, height: r * 0.64,
        borderRadius: '50%', background: MINT, opacity: ease(lt, delay + 0.2, 0.3) }}></div>
    </React.Fragment>
  );
}

/* Full-bleed background video — fallback div + VideoSprite + dark overlay,
   opacity gated behind a "ready" state so the overlay never paints alone
   before the first frame decodes. Mesmo padrão do Vídeo 5. */
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

/* 1 · preto (vídeo) — capa alinhada à esquerda, embaixo; "assinar?" gigante revelado por barra mint */
function Question() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const bar = easeIO(lt, 1.1, 0.45), barOut = easeIO(lt, 1.55, 0.45);
  const word = lt >= 1.55 ? 1 : 0;
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_1} start={0} end={5.1} speed={0.95} scale={1.08} overlay="rgba(0,0,0,0.5)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1160, display: 'flex', justifyContent: 'center' }}>
      <div style={{ color: WHITE }}>
        <Lines list={sc.a} lt={lt} delay={0.3} step={0.1} style={REG(58, 68)} />
        <Lines list={sc.b} lt={lt} delay={0.55} step={0.1} style={BOLD(70, 78)} />
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 6 }}>
          <div style={{ color: MINT, ...BOLD(176, 190), letterSpacing: '-0.035em', opacity: word, whiteSpace: 'nowrap' }}>{sc.word}</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 28, bottom: 20, background: MINT,
            transform: `scaleX(${bar - barOut})`, transformOrigin: barOut > 0 ? 'right' : 'left' }}></div>
        </div>
      </div>
      </div>
    </div>
  );
}

/* 2 · cinza — "A resposta está em uma palavra:" + PERFIL com grifo + corpo */
function Word() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const w = pop(lt, 1.0, 0.9), wIn = ease(lt, 1.0, 0.35);
  const g = easeIO(lt, 1.6, 0.6);
  return (
    <div style={{ ...shell, background: GREY }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', color: INK }}>
        <Lines list={sc.head} lt={lt} delay={0.3} step={0.1} style={BOLD(77, 76)} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 770, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', padding: '0 36px', opacity: wIn, transform: `scale(${0.7 + 0.3 * w})` }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 70, bottom: 30, background: HL,
            transform: `scaleX(${g})`, transformOrigin: 'left' }}></div>
          <div style={{ position: 'relative', color: TEAL, ...BOLD(210, 230), letterSpacing: '-0.03em' }}>{sc.word}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 540 - 1.5, top: 1055, width: 3, height: 90, background: MINT,
        transform: `scaleY(${easeIO(lt, 2.2, 0.5)})`, transformOrigin: 'top' }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1160, textAlign: 'center', color: INK }}>
        <Lines list={sc.body} lt={lt} delay={2.5} step={0.09} style={REG(62, 68)} accent={TEAL} />
      </div>
    </div>
  );
}

/* 3 · mint — "É a pessoa que pensa:" + citação grande + régua + corpo */
function Quote() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: MINT }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 120, top: 500, color: INK }}>
        <Lines list={sc.lead} lt={lt} delay={0.3} style={REG(58, 64)} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: 600, color: INK }}>
        <Lines list={sc.quote} lt={lt} delay={0.8} step={0.12} style={BOLD(77, 80)} accent={WHITE} />
      </div>
      <div style={{ position: 'absolute', right: 120, top: 1070, width: 4, height: H - 1070, background: WHITE,
        transform: `scaleY(${easeIO(lt, 1.6, 0.9)})`, transformOrigin: 'bottom' }}></div>
      <div style={{ position: 'absolute', right: 160, top: 1060, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        {(sc.body || []).map((ln, i) => {
          const t = ease(lt, 2.6 + i * 0.12, 0.5);
          const g = easeIO(lt, 3.0 + Math.max(0, i - 2) * 0.35, 0.5);
          const segs = String(ln).split('**');
          return (
            <div key={i} style={{ height: 62, display: 'flex', alignItems: 'center', whiteSpace: 'pre',
              opacity: t, transform: `translateY(${(1 - t) * 14}px)` }}>
              {segs.map((sg, j) => sg === '' ? null : j % 2 === 1
                ? <span key={j} style={{ color: INK, ...BOLD(54, 60), marginTop: -4 }}>{sg}</span>
                : <span key={j} style={{ color: INK, ...REG(54, 60), marginTop: -4 }}>{sg}</span>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 4 · preto (vídeo) — título com destaque + barra vertical + corpo */
function Budget() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_4} start={0} end={8.4} speed={0.9} scale={1.08} overlay="rgba(0,0,0,0.45)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 260, boxSizing: 'border-box' }}>
        <div style={{ color: WHITE, textAlign: 'left' }}>
          <div style={{ width: 140, height: 4, background: MINT, marginBottom: 36,
            transform: `scaleX(${easeIO(lt, 0.2, 0.6)})`, transformOrigin: 'left' }}></div>
          <Lines list={sc.head} lt={lt} delay={0.4} step={0.1} style={BOLD(54, 64)} accent={MINT} />
          <div style={{ height: 24 }}></div>
          <Lines list={sc.body} lt={lt} delay={1.2} step={0.09} style={REG(46, 58)} />
        </div>
      </div>
    </div>
  );
}

/* 5 · cinza — introdução, card teal com a pergunta, fecho */
function Card() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const box = easeIO(lt, 1.3, 0.8);
  return (
    <div style={{ ...shell, background: GREY }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div style={{ position: 'absolute', left: 138, top: 470, color: INK }}>
        <Lines list={sc.lead} lt={lt} delay={0.3} step={0.09} style={REG(58, 66)} />
      </div>
      <div style={{ position: 'absolute', left: 170, right: 170, top: 810, height: 440, background: TEAL,
        borderTopRightRadius: 112, borderBottomLeftRadius: 112, clipPath: `inset(0 ${(1 - box) * 100}% 0 0)` }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 910, color: WHITE, textAlign: 'center' }}>
        <Lines list={sc.quote} lt={lt} delay={1.9} step={0.12} style={BOLD(77, 80)} accent={MINT} />
      </div>
      <div style={{ position: 'absolute', right: 138, top: 1340, color: INK, textAlign: 'right',
        transform: `translateX(${(easeIO(lt, 2.9, 0.8) - 1) * 500}px)` }}>
        <ULines list={sc.body} lt={lt} delay={2.9} step={0.09} uDelay={3.6} uTop={62} origin="right" style={BOLD(56, 64)} />
      </div>
    </div>
  );
}

/* 6 · preto (vídeo) — perfil A à esquerda, perfil B à direita com barra mint, pergunta final numa faixa mint */
function Profiles() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const band = easeIO(lt, 3.6, 0.6);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_6} start={0} end={8.4} speed={1.0} scale={1.08} overlay="rgba(0,0,0,0.45)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 110, top: 580, color: WHITE }}>
        <Lines list={sc.a} lt={lt} delay={0.3} step={0.09} style={REG(54, 64)} />
      </div>
      <div style={{ position: 'absolute', right: 150, top: 850, color: WHITE, textAlign: 'right' }}>
        <Lines list={sc.b} lt={lt} delay={1.4} step={0.09} style={BOLD(58, 68)} accent={MINT} />
      </div>
      <div style={{ position: 'absolute', right: 110, top: 856, width: 6, height: 260, background: MINT,
        transform: `scaleY(${easeIO(lt, 1.3, 0.8)})`, transformOrigin: 'top' }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', padding: '68px 56px', textAlign: 'center', color: TEAL }}>
          <div style={{ position: 'absolute', inset: 0, background: MINT, borderTopRightRadius: 80, borderBottomLeftRadius: 80,
            opacity: band, transform: `scale(${0.85 + 0.15 * band})` }}></div>
          <div style={{ position: 'relative' }}>
            <Lines list={sc.close} lt={lt} delay={4.0} step={0.12} style={BOLD(70, 78)} />
          </div>
        </div>
      </div>
    </div>
  );
}

const LAYOUTS = { question: Question, word: Word, quote: Quote, budget: Budget, card: Card, profiles: Profiles };

function SudesteVideo6() {
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

window.SudesteVideo6 = SudesteVideo6;
