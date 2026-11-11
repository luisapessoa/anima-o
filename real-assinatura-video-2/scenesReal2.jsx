/* Real Assinatura 2 — vertical brand video (1080×1920), 6 screens.
   Same animation engine/pattern as scenesReal.jsx; new copy + layouts.
   Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const { useScene, SceneStage, Easing, clamp, useTweaks, TweaksPanel,
        TweakSection, TweakToggle, VideoSprite } = window;

const W = 1080, H = 1920;
const NAVY  = '#112750';
const SKY   = '#9fd3e5';
const GREY  = '#f0f0f0';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT  = "'Readex Pro', system-ui, sans-serif";
const LOGO_TOP = 210;
const E = Easing;
const RUNTIME = { showLogo: true };

function ease(lt, delay, d) { return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1)); }
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return { opacity: p, transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)` };
}
function groupIn(lt, dir, d) {
  const p = ease(lt, 0, d || 0.5);
  const off = (1 - p);
  let t = '';
  if (dir === 'up')    t = `translateY(${off * 60}px)`;
  else if (dir === 'down')  t = `translateY(${off * -60}px)`;
  else if (dir === 'left')  t = `translateX(${off * 60}px)`;
  else if (dir === 'right') t = `translateX(${off * -60}px)`;
  return { opacity: p, transform: t };
}
/* underline: **text** underlined in the given colour */
function fmtU(text, color, key) {
  const parts = String(text).split('**');
  return React.createElement('span', { key },
    parts.map((p, i) => i % 2 === 1
      ? React.createElement('span', { key: i, style: { borderBottom: `5px solid ${color}`,
          paddingBottom: 1 } }, p)
      : React.createElement(React.Fragment, { key: i }, p)));
}
/* bold state persists across an array of lines: '**' toggles weight, even mid-word across breaks */
function fmtLinesBold(lines) {
  let bold = false;
  return lines.map((line, li) => {
    const parts = String(line).split('**');
    const spans = parts.map((p, i) => {
      const el = React.createElement('span', { key: i, style: { fontWeight: bold ? 700 : 400 } }, p);
      if (i < parts.length - 1) bold = !bold;
      return el;
    });
    return React.createElement('div', { key: li }, spans);
  });
}

function Logo({ variant, lt }) {
  const p = ease(lt, 0, 0.6);
  const src = variant === 'dark' ? 'assets/real/logo-navy.png'
            : variant === 'sky' ? 'assets/real/logo-sky.png'
            : 'assets/real/logo-white.png';
  return (
    <div style={{ position: 'absolute', top: LOGO_TOP, left: '50%', zIndex: 5,
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`, opacity: p }}>
      <img src={src} alt="Real Assinatura" style={{ height: 66, width: 'auto', display: 'block' }} />
    </div>
  );
}

const shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* ── 1 · WHY MATTERS: black, bold hook + elbow connector to repeated tag ── */
function WhyMatters() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const draw = ease(lt, 1.05, 0.85);
  return (
    <div style={{ ...shell, background: BLACK }}>
      <VideoSprite src="assets/bg-1.mp4" start={0} end={5.5} speed={1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.42)' }} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 160, right: 150, top: 420 }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.2 + i * 0.09, 18), color: WHITE, fontWeight: 700,
            fontSize: 58, lineHeight: 1.16, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d="M 820 560 H 900 V 1580" fill="none" stroke={SKY} strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round" pathLength="1"
          strokeDasharray="1" strokeDashoffset={1 - draw} />
      </svg>
      <div style={{ position: 'absolute', left: 150, right: 160, top: 1620, textAlign: 'right' }}>
        {(sc.tag || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.2 + i * 0.09, 14), color: WHITE, fontWeight: 700,
            fontSize: 52, lineHeight: 1.22, whiteSpace: 'nowrap' }}>{String(ln).trim()}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 2 · TICK LIST: sky bg, left tick-marked list + bold underlined tail ── */
function TickList() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const items = sc.items || [];
  const rowH = 140;
  const listTop = 600;
  const staggerStep = 0.34, revealDur = 0.6;
  return (
    <div style={{ ...shell, background: SKY }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      {items.map((lines, i) => {
        const p = ease(lt, 0.3 + i * staggerStep, revealDur);
        const y = listTop + i * rowH;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: 0, top: y + 26, width: 90, height: 4,
              background: NAVY, transform: `scaleX(${p})`, transformOrigin: 'left' }} />
            <div style={{ position: 'absolute', left: 150, right: 90, top: y, ...rise(lt, 0.3 + i * staggerStep, 14) }}>
              {lines.map((ln, j) => (
                <div key={j} style={{ color: NAVY, fontWeight: 400, fontSize: 52, lineHeight: 1.22 }}>{ln}</div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 150, right: 150, top: listTop + items.length * rowH + 100,
        textAlign: 'right' }}>
        {(sc.tail || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 2.5 + i * 0.12, 16), color: NAVY, fontWeight: 700,
            fontSize: 50, lineHeight: 1.16, borderBottom: `4px solid ${NAVY}`, display: 'inline-block',
            paddingBottom: 2 }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 3 · V-LINE PARA: black, bold-inline para + vertical rule + plain para ── */
function VLinePara() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const lines1 = sc.lines1 || []; const lines2 = sc.lines2 || [];
  const draw = ease(lt, 0.9, 0.7);
  const lineTop = 725, lineH = 620;
  return (
    <div style={{ ...shell, background: BLACK }}>
      <VideoSprite src="assets/bg-3.mp4" start={0} end={6.5} speed={1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.42)' }} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 150, right: 120, top: 400, ...groupIn(lt, 'up') }}>
        {fmtLinesBold(lines1).map((el, i) => React.cloneElement(el, {
          style: { ...rise(lt, 0.2 + i * 0.08, 16), color: WHITE, fontSize: 50, lineHeight: 1.2, whiteSpace: 'nowrap' } }))}
      </div>
      <div style={{ position: 'absolute', left: 150, top: lineTop, width: 6, height: lineH,
        background: SKY, transform: `scaleY(${draw})`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 150, right: 120, top: lineTop + lineH + 90 }}>
        {lines2.map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.25 + i * 0.08, 14), color: WHITE, fontWeight: 400,
            fontSize: 46, lineHeight: 1.26, whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── 4 · QUESTION LIST: grey, bold heading + vertical-line question list ── */
function QuestionList() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const items = sc.items || [];
  const listTop = 900, sqX = 150, textX = 210;
  const lineHeightPx = 46 * 1.1, gap = 78;
  const offsets = []; let acc = 0;
  items.forEach((lines) => { offsets.push(acc); acc += lines.length * lineHeightPx + gap; });
  const draw = ease(lt, 0.85, 0.9);
  const lineBottom = listTop + (offsets[offsets.length - 1] || 0);
  return (
    <div style={{ ...shell, background: GREY }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 150, right: 150, top: 620, ...groupIn(lt, 'up') }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.2 + i * 0.08, 16), color: NAVY, fontWeight: 700,
            fontSize: 52, lineHeight: 1.16, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={sqX + 10} y1={listTop + 6} x2={sqX + 10} y2={lineBottom - 6} stroke={SKY} strokeWidth="4"
          strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
      </svg>
      {items.map((lines, i) => {
        const p = ease(lt, 0.95 + i * 0.14, 0.5);
        const y = listTop + offsets[i];
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: sqX, top: y - 4, width: 22, height: 22,
              background: SKY, opacity: p, transform: `scale(${0.6 + 0.4 * p})` }} />
            <div style={{ position: 'absolute', left: textX, right: 150, top: y - 24, ...rise(lt, 0.95 + i * 0.14, 12) }}>
              {lines.map((ln, j) => (
                <div key={j} style={{ color: NAVY, fontWeight: 400, fontSize: 46, lineHeight: 1.1 }}>{ln}</div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── 5 · VIDEO RULE: black video zone above, ruled centered text below ─── */
function VideoRule() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const ruleTop = ease(lt, 0.4, 0.6);
  const ruleBottom = ease(lt, 1.5, 0.6);
  const zoneH = 1370;
  return (
    <div style={{ ...shell, background: BLACK }}>
      {/* video zone: full-bleed — VW footage, natural speed, no loop */}
      <VideoSprite src="assets/bg-5.mp4" start={0} end={6.0} speed={1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(0,0,0,.72) 100%)' }} />
      {RUNTIME.showLogo ? <Logo variant="white" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 150, top: zoneH, width: W - 300, height: 4, background: SKY,
        transform: `scaleX(${ruleTop})`, transformOrigin: 'center' }} />
      <div style={{ position: 'absolute', left: 130, right: 130, top: zoneH + 55, textAlign: 'center' }}>
        {(sc.body || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.75 + i * 0.09, 14), color: WHITE, fontWeight: 400,
            fontSize: 44, lineHeight: 1.28 }}>{ln}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 150, top: zoneH + 55 + sc.body.length * 61 + 40, width: W - 300, height: 4, background: SKY,
        transform: `scaleX(${ruleBottom})`, transformOrigin: 'center' }} />
    </div>
  );
}

/* ── 6 · VIDEO BOX BOTTOM: sky bg, heading + video box + bold tail ──────── */
function VideoBoxBottom() {
  const s = useScene(); const lt = s.localTime; const sc = s.scene;
  const box = ease(lt, 0.75, 0.6);
  return (
    <div style={{ ...shell, background: SKY }}>
      {RUNTIME.showLogo ? <Logo variant="dark" lt={lt} /> : null}
      <div style={{ position: 'absolute', left: 150, right: 120, top: 380, ...groupIn(lt, 'up') }}>
        {(sc.head || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 0.2 + i * 0.08, 16), color: NAVY, fontWeight: 400,
            fontSize: 44, lineHeight: 1.24, whiteSpace: 'nowrap' }}>{ln}</div>
        ))}
      </div>
      {/* video zone: box for VW footage, centered between the two paragraphs */}
      <div style={{ position: 'absolute', left: 150, top: 670, width: W - 300, height: 660, overflow: 'hidden',
        background: BLACK, opacity: box, transform: `translateY(${(1 - box) * 30}px)` }}>
        <VideoSprite src="assets/bg-6.mp4" start={0} end={6.0} speed={1}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', left: 150, right: 120, top: 1400 }}>
        {(sc.tail || []).map((ln, i) => (
          <div key={i} style={{ ...rise(lt, 1.35 + i * 0.08, 14), color: NAVY, fontWeight: 700,
            fontSize: 48, lineHeight: 1.22 }}>{ln}</div>
        ))}
      </div>
    </div>
  );
}

/* ── root ────────────────────────────────────────────────────── */
const LAYOUTS = {
  whymatters: WhyMatters, ticklist: TickList, vlinepara: VLinePara,
  questionlist: QuestionList, videorule: VideoRule, videoboxbottom: VideoBoxBottom,
};

function RealVideo2() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach((sc) => { children[sc.name] = LAYOUTS[sc.layout] || WhyMatters; });
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
        <TweakSection label="Edição" />
        <TweakToggle label="Editor de tempo" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.RealVideo2 = RealVideo2;
