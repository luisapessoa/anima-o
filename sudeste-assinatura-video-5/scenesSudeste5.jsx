/* Sudeste Assinatura — VÍDEO 5 (1080×1920). "E se o seu próximo 0km pudesse ser mais a sua cara?"
   Mesmo motor/padrão dos vídeos anteriores (SceneStage, DM Sans, paleta, logo top 200 / 640px).
   Tela 2: grifo animado no 2º parágrafo. Tela 4→5: painel teal expande e preenche a tela.
   Telas 1, 3 e 4 ganharam vídeo de fundo full-bleed (detalhes do Tera e do Virtus GT) —
   não previsto no handoff original, adicionado a pedido. Tela 6 usa o slot de vídeo
   reservado do handoff, preenchido com um vídeo do carro andando na estrada (claro, sem
   animação de revelação — visível desde o frame 0). */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const BLACK = '#000000', TEAL = '#034845', MINT = '#00d1b2', HL = '#5edcc8';
const WHITE = '#ffffff', GREY = '#f0f0f0', INK = '#03433f';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640, LOGO_TOP = 200;
const E = Easing;
const RT = { showLogo: true, videoBg: true };

// Background clips for Telas 1, 3, 4 e 6 (detalhes internos do Tera e do Virtus GT).
const VID_1 = 'assets/videos/t1.mp4';
const VID_3 = 'assets/videos/t3.mp4';
const VID_4 = 'assets/videos/t4.mp4';
const VID_6 = 'assets/videos/t6.mp4';

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
/* linha com sublinhado mint desenhado da esquerda (ou direita) */
function ULines({ list, lt, delay, step, uDelay, style, uTop, origin }) {
  return (list || []).map((ln, i) => {
    const u = easeIO(lt, uDelay + i * 0.22, 0.55);
    return (
      <div key={i} style={{ ...rise(lt, delay + i * (step || 0.08), 16), whiteSpace: 'nowrap', ...style }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {ln}
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

/* Full-bleed background video — fallback div + VideoSprite + dark overlay,
   opacity gated behind a "ready" state so the overlay never paints alone
   before the first frame decodes. Ported from Vídeo 3/4's BgVideo — do not
   add autoPlay/loop on the <video>: VideoSprite already drives
   play()/pause()/currentTime itself. */
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

/* Video confined to a box (Tela 6's reserved vídeo slot) instead of
   full-bleed — same ready-gated fade-in pattern as BgVideo, but sized to
   `left/top/width/height` and with no extra dark overlay (the box already
   reveals from black via the clipPath in VideoClose). */
function BoxVideo({ src, start, end, scale, posX, posY, speed, left, top, width, height }) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => { if (!readyRef.current) { readyRef.current = true; setReady(true); } }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => { if (!readyRef.current) { readyRef.current = true; setReady(true); } };
  if (!RT.videoBg) return null;
  return (
    <VideoSprite src={src} start={start || 0} end={end || 3} speed={speed || 1}
      onLoadedData={markReady}
      style={{ position: 'absolute', left, top, width, height, objectFit: 'cover',
        objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
        transform: `scale(${scale || 1})`,
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' }} />
  );
}

/* 1 · preto — pergunta centralizada, sublinhado, alvo + linha descendo */
function Question() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const ring = pop(lt, 1.55, 0.8), dot = ease(lt, 1.75, 0.35), line = easeIO(lt, 1.9, 1.1);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_1} start={0} end={1.84} speed={0.35} scale={1.1} overlay="rgba(0,0,0,0.5)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 804, textAlign: 'center', color: WHITE }}>
        <Lines list={sc.a} lt={lt} delay={0.3} step={0.1} style={BOLD(77, 76)} />
        <ULines list={sc.b} lt={lt} delay={0.5} step={0.1} uDelay={1.0} uTop={90} style={BOLD(77, 76)} />
      </div>
      <div style={{ position: 'absolute', left: 540 - 26, top: 1202 - 26, width: 52, height: 52, boxSizing: 'border-box',
        border: `3px solid ${MINT}`, borderRadius: '50%', opacity: ease(lt, 1.55, 0.3), transform: `scale(${ring})` }}></div>
      <div style={{ position: 'absolute', left: 540 - 8, top: 1202 - 8, width: 16, height: 16, borderRadius: '50%',
        background: MINT, opacity: dot, transform: `scale(${dot})` }}></div>
      <div style={{ position: 'absolute', left: 540 - 1.5, top: 1202, width: 3, height: H - 1202, background: MINT,
        transform: `scaleY(${line})`, transformOrigin: 'top' }}></div>
    </div>
  );
}

/* 2 · cinza — arco mint, Tera, título + parágrafo grifado */
function Highlight() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const arch = easeIO(lt, 0.1, 0.8);
  const car = pop(lt, 0.45, 1.0), carIn = ease(lt, 0.45, 0.4);
  return (
    <div style={{ ...shell, background: GREY }}>
      <div style={{ position: 'absolute', left: 172, top: 0, width: 736, height: 735, background: MINT,
        borderRadius: '0 0 368px 368px / 0 0 362px 362px',
        transform: `translateY(${(arch - 1) * 735}px)` }}></div>
      {RT.showLogo ? <Logo dark /> : null}
      <img src="assets/sudeste-tera.webp" alt="Tera" style={{ position: 'absolute', left: -55, top: 318, width: 1192,
        height: 'auto', zIndex: 3, opacity: carIn, transform: `translateX(${(1 - car) * 320}px)` }} />
      <div style={{ position: 'absolute', left: 125, top: 932, color: INK }}>
        <Lines list={sc.head} lt={lt} delay={1.1} step={0.1} style={BOLD(77, 76)} />
      </div>
      <div style={{ position: 'absolute', left: 262, top: 1320, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(sc.body || []).map((ln, i) => {
          const t = ease(lt, 1.7 + i * 0.08, 0.5);
          const g = easeIO(lt, 2.35 + i * 0.42, 0.5);
          return (
            <div key={i} style={{ position: 'relative', alignSelf: 'flex-start', height: 60, padding: '0 14px',
              display: 'flex', alignItems: 'center', opacity: t, transform: `translateY(${(1 - t) * 14}px)` }}>
              <div style={{ position: 'absolute', inset: 0, background: HL, transform: `scaleX(${g})`, transformOrigin: 'left' }}></div>
              <span style={{ position: 'relative', color: INK, ...REG(67, 60), whiteSpace: 'nowrap', marginTop: -6 }}>{ln}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 3 · preto — régua horizontal com alvo + parágrafo (vídeo: detalhe interno do Tera) */
function Rule() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const line = easeIO(lt, 0.15, 0.9), ring = pop(lt, 0.35, 0.8);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_3} start={0} end={1.7} speed={0.29} scale={1.1} overlay="rgba(0,0,0,0.45)" />
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, top: 441 - 1.5, width: W, height: 3, background: MINT,
        transform: `scaleX(${line})`, transformOrigin: 'left' }}></div>
      <div style={{ position: 'absolute', left: 157 - 17, top: 441 - 17, width: 34, height: 34, boxSizing: 'border-box',
        border: `3px solid ${MINT}`, borderRadius: '50%',
        opacity: ease(lt, 0.35, 0.3), transform: `scale(${ring})` }}></div>
      <div style={{ position: 'absolute', left: 157 - 6, top: 441 - 6, width: 12, height: 12, borderRadius: '50%',
        background: MINT, opacity: ease(lt, 0.55, 0.3) }}></div>
      <div style={{ position: 'absolute', left: 138, top: 497, color: WHITE }}>
        <Lines list={sc.body} lt={lt} delay={0.8} step={0.09} style={REG(65, 66)} />
      </div>
    </div>
  );
}

/* 4 · preto — painel teal no rodapé; no fim expande e preenche a tela (→ Tela 5)
   (vídeo: detalhe interno do Virtus GT, atrás do painel) */
function Panel() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const dur = s.dur || sc.dur || 6;
  const inP = easeIO(lt, 0.1, 0.8);
  const x = easeIO(lt, dur - 1.0, 0.9);
  const top0 = 1233 + (1 - inP) * (H - 1233);
  const top = top0 * (1 - x);
  return (
    <div style={{ ...shell }}>
      <BgVideo src={VID_4} start={0} end={2.5} speed={0.36} scale={1.1} overlay="rgba(0,0,0,0.45)" />
      <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, background: TEAL,
        borderTopRightRadius: 112 * (1 - x) }}></div>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 186, top: 1407, color: WHITE, opacity: 1 - ease(lt, dur - 1.0, 0.45) }}>
        <Lines list={sc.body} lt={lt} delay={0.7} step={0.09} style={REG(65, 66)} />
      </div>
    </div>
  );
}

/* 5 · teal — título centralizado, conector vertical, corpo */
function Center() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: TEAL }}>
      {RT.showLogo ? <Logo /> : null}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 554, textAlign: 'center', color: WHITE }}>
        <Lines list={sc.head} lt={lt} delay={0.25} step={0.1} style={BOLD(77, 76)} accent={MINT} />
      </div>
      <div style={{ position: 'absolute', left: 540 - 1.5, top: 835, width: 3, height: 318, background: MINT,
        transform: `scaleY(${easeIO(lt, 0.8, 0.7)})`, transformOrigin: 'top' }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1198, textAlign: 'center', color: WHITE }}>
        <Lines list={sc.body} lt={lt} delay={1.3} step={0.09} style={REG(65, 66)} />
      </div>
    </div>
  );
}

/* 6 · cinza — título, retângulo com vídeo (carro na estrada, claro, sem wipe-in), fecho alinhado à direita sublinhado */
function VideoClose() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  return (
    <div style={{ ...shell, background: GREY }}>
      {RT.showLogo ? <Logo dark /> : null}
      <div data-video-slot="tela6" style={{ position: 'absolute', left: 208, top: 593, width: 664, height: 857,
        background: BLACK, overflow: 'hidden' }}>
        <BoxVideo src={VID_6} start={0} end={4.9} speed={0.65} left={0} top={0} width={664} height={857} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)' }}></div>
      </div>
      <div style={{ position: 'absolute', left: 155, top: 429, color: INK, zIndex: 2 }}>
        <Lines list={sc.head} lt={lt} delay={0.5} step={0.09} style={BOLD(67, 66)} />
      </div>
      <div style={{ position: 'absolute', right: 1080 - 924, top: 1343, textAlign: 'right', color: INK, zIndex: 2 }}>
        <ULines list={sc.close} lt={lt} delay={1.4} step={0.09} uDelay={2.0} uTop={82} origin="right" style={BOLD(67, 65)} />
      </div>
    </div>
  );
}

const LAYOUTS = { question: Question, highlight: Highlight, rule: Rule, panel: Panel, center: Center, videoclose: VideoClose };

function SudesteVideo5() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(() => {
    ['assets/sudeste-tera.webp', 'assets/logo-dark.png', 'assets/logo-white.png'].forEach((src) => {
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
        <TweakToggle label="Vídeos de fundo" value={t.videoBg !== false}
          onChange={(v) => setTweak('videoBg', v)} />
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.SudesteVideo5 = SudesteVideo5;
