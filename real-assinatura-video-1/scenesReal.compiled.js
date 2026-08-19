(function(){
/* Real Assinatura — vertical brand video (1080×1920).
   Same animation engine/pattern as the Estilo/Sudeste films; new brand + 7 screens.
   Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const {
  useScene,
  SceneStage,
  Easing,
  clamp,
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakToggle,
  VideoSprite
} = window;
const W = 1080,
  H = 1920;
const NAVY = '#112750'; // deep brand blue
const SKY = '#9fd3e5'; // light-blue accent
const GREY = '#f0f0f0'; // light neutral background
const GREY2 = '#cccccc';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT = "'Readex Pro', system-ui, sans-serif";
const LOGO_TOP = 210; // logo shared across all screens (matches example)
const E = Easing;
const RUNTIME = {
  showLogo: true,
  videoBg: true
};
const VID_1 = 'assets/bg-1.mp4';
const VID_4 = 'assets/bg-4.mp4';
const VID_6 = 'assets/bg-6.mp4';
const VID_7 = 'assets/bg-7.mp4';

/* ── background video helpers ────────────────────────────────── */
/* Top-anchored, no scrim: used where text sits below the video zone
   (Question's 1080x1080 top square, Factors' 1080x830 top band). */
function TopVideo({
  src,
  start,
  end,
  speed,
  w,
  h,
  shiftY
}) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => {
    if (!readyRef.current) {
      readyRef.current = true;
      setReady(true);
    }
  };
  if (!RUNTIME.videoBg) return null;
  return /*#__PURE__*/React.createElement(VideoSprite, {
    src: src,
    start: start || 0,
    end: end || 3,
    speed: speed || 1,
    onLoadedData: markReady,
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: w,
      height: h,
      objectFit: 'cover',
      transform: `translateY(${shiftY || 0}px) scale(1.15)`,
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  });
}
/* Full-bleed with a bottom-weighted scrim: used for Line's full-screen
   video behind body text starting around y≈1230. */
function FullVideoScrim({
  src,
  start,
  end,
  speed,
  shiftY
}) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => {
    if (!readyRef.current) {
      readyRef.current = true;
      setReady(true);
    }
  };
  if (!RUNTIME.videoBg) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(VideoSprite, {
    src: src,
    start: start || 0,
    end: end || 3,
    speed: speed || 1,
    onLoadedData: markReady,
    style: {
      position: 'absolute',
      inset: 0,
      width: W,
      height: H,
      objectFit: 'cover',
      transform: `translateY(${shiftY || 0}px) scale(1.15)`,
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,.40) 0%, rgba(0,0,0,.40) 50%, rgba(0,0,0,.68) 100%)',
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  }));
}
/* Full-bleed, no global scrim — a local scrim panel is layered separately
   behind the frame/CTA area in LogoFrame. */
function FullVideoPlain({
  src,
  start,
  end,
  speed,
  shiftY
}) {
  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  const markReady = () => {
    if (!readyRef.current) {
      readyRef.current = true;
      setReady(true);
    }
  };
  if (!RUNTIME.videoBg) return null;
  return /*#__PURE__*/React.createElement(VideoSprite, {
    src: src,
    start: start || 0,
    end: end || 3,
    speed: speed || 1,
    onLoadedData: markReady,
    style: {
      position: 'absolute',
      inset: 0,
      width: W,
      height: H,
      objectFit: 'cover',
      transform: `translateY(${shiftY || 0}px) scale(1.15)`,
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  });
}

/* ── motion helpers ──────────────────────────────────────────── */
function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1));
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)`
  };
}
function groupIn(lt, dir, d) {
  const p = ease(lt, 0, d || 0.5);
  const off = 1 - p;
  let t = '';
  if (dir === 'up') t = `translateY(${off * 60}px)`;else if (dir === 'down') t = `translateY(${off * -60}px)`;else if (dir === 'left') t = `translateX(${off * 60}px)`;else if (dir === 'right') t = `translateX(${off * -60}px)`;else if (dir === 'scale') t = `scale(${0.96 + 0.04 * p})`;
  return {
    opacity: p,
    transform: t
  };
}

/* emphasis: **text** rendered bold in the given colour */
function fmt(text, color, weight, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      color,
      fontWeight: weight || 700
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}
/* highlight sweep: **text** background wipes in left→right (marker) */
function fmtHiAnim(text, hi, tc, p, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((part, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      backgroundImage: `linear-gradient(${hi}, ${hi})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left center',
      backgroundSize: `${p * 100}% 76%`,
      color: tc,
      fontWeight: 700,
      padding: '2px 8px',
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone'
    }
  }, part) : React.createElement(React.Fragment, {
    key: i
  }, part)));
}
/* highlight: **text** gets a coloured background swatch */
function fmtHi(text, hi, tc, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      background: hi,
      color: tc,
      fontWeight: 700,
      padding: '2px 8px',
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone'
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}
/* underline: **text** underlined in the given colour */
function fmtU(text, color, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      borderBottom: `5px solid ${color}`,
      paddingBottom: 1
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}

/* ── official Real Assinatura logo (PNG lockups) ─────────────── */
function Logo({
  variant,
  lt
}) {
  const p = ease(lt, 0, 0.6);
  const src = variant === 'dark' ? 'assets/real/logo-navy.png' : variant === 'sky' ? 'assets/real/logo-sky.png' : 'assets/real/logo-white.png';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: LOGO_TOP,
      left: '50%',
      zIndex: 5,
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`,
      opacity: p
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Real Assinatura",
    style: {
      height: 66,
      width: 'auto',
      display: 'block'
    }
  }));
}
const shell = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  fontFamily: FONT
};
const CHAT_D = "m352.101562 48.398438c-39-30.898438-90.703124-48-145.703124-48s-106.796876 17-145.699219 48c-39.199219 31.101562-60.699219 72.5-60.699219 116.703124 0 44.199219 21.601562 85.597657 60.699219 116.699219.800781.597657 1.601562 1.199219 2.402343 1.898438l.296876.199219c2.070312 1.59375 3.226562 4.09375 3.101562 6.703124l-2.898438 75.296876 93.296876-39.398438c1.417968-.613281 2.984374-.785156 4.5-.5 14.859374 2.609375 29.917968 3.914062 45 3.898438 55 0 106.800781-17 145.703124-48 39.199219-31.097657 60.699219-72.5 60.699219-116.699219s-21.5-85.699219-60.699219-116.800781zm-154.703124 201.800781c0 4.417969-3.582032 8-8 8-4.417969 0-8-3.582031-8-8v-8.5c0-4.417969 3.582031-8 8-8 4.417968 0 8 3.582031 8 8zm53-114.5c-.035157 19.039062-15.460938 34.460937-34.5 34.5-10.210938.011719-18.484376 8.289062-18.5 18.5v22.5c0 4.417969-3.582032 8-8 8-4.417969 0-8-3.582031-8-8v-22.5c.039062-19.039063 15.464843-34.460938 34.5-34.5 10.214843-.011719 18.488281-8.285157 18.5-18.5v-20.5c0-14.898438-11.597657-27-26.5-27h-3c-14.898438 0-27.5 12.101562-27.5 27v1c0 4.417969-3.582032 8-8 8-4.417969 0-8-3.582031-8-8v-1c0-23.699219 19.800781-43 43.5-43h3c11.347656.035156 22.214843 4.59375 30.191406 12.664062 7.976562 8.070313 12.40625 18.988281 12.308594 30.335938zm0 0";

/* ── 1 · QUESTION: black, navy panel at the bottom + sky chat tile ── */
function Question() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const box = ease(lt, 0.5, 0.6);
  const tile = ease(lt, 0.95, 0.5);
  const boxL = 90,
    boxTop = 1080,
    boxW = W - boxL * 2,
    sq = 200;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK
    }
  }, /*#__PURE__*/React.createElement(FullVideoPlain, {
    src: VID_1,
    start: 0,
    end: 2.002,
    speed: 0.3844
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: boxL,
      top: boxTop,
      width: boxW,
      bottom: 0,
      background: NAVY,
      opacity: box,
      transform: `translateY(${(1 - box) * 40}px)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: boxL + boxW - sq - 160,
      top: boxTop - sq * 0.55,
      width: sq,
      height: sq,
      background: SKY,
      opacity: tile,
      transform: `scale(${0.85 + 0.15 * tile})`,
      transformOrigin: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 -23 412.8 412",
    style: {
      width: sq * 0.52,
      height: sq * 0.52
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: NAVY,
    d: CHAT_D
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: boxL + 66,
      right: boxL + 66,
      top: boxTop + 150
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.85 + i * 0.1, 16),
      color: WHITE,
      fontWeight: 700,
      fontSize: 74,
      lineHeight: 1.16,
      letterSpacing: '-0.02em'
    }
  }, ln))));
}

/* ── 2 · LIGHT LIST: grey, left column, quote bar + bold tail ──── */
function LightList() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const bar = ease(lt, 0.9, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: GREY,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '520px 0 0 0',
      ...groupIn(lt, 'up')
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "dark",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'fit-content'
    }
  }, /*#__PURE__*/React.createElement("div", null, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.08, 18),
      color: NAVY,
      fontWeight: 700,
      fontSize: 76,
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap'
    }
  }, ln))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.55 + i * 0.08, 14),
      color: NAVY,
      fontWeight: 400,
      fontSize: 54,
      lineHeight: 1.28,
      whiteSpace: 'nowrap'
    }
  }, ln))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 34,
      marginTop: 52,
      marginLeft: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      background: SKY,
      borderRadius: 4,
      transform: `scaleY(${bar})`,
      transformOrigin: 'top'
    }
  }), /*#__PURE__*/React.createElement("div", null, (sc.quote || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.0 + i * 0.08, 12),
      color: NAVY,
      fontWeight: 400,
      fontSize: 54,
      lineHeight: 1.28,
      whiteSpace: 'nowrap'
    }
  }, ln)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, (sc.strong || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.45 + i * 0.08, 12),
      color: NAVY,
      fontWeight: 700,
      fontSize: 54,
      lineHeight: 1.24,
      whiteSpace: 'nowrap'
    }
  }, ln)))));
}

/* ── 3 · SKY BOX: navy, heading + elbow + body + sky panel + Polo ─ */
function SkyBox() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const draw = ease(lt, 0.55, 0.8);
  const box = ease(lt, 1.0, 0.6);
  const car = ease(lt, 1.25, 0.9);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: NAVY
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      top: 470,
      width: 820,
      ...groupIn(lt, 'right')
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.08, 16),
      color: SKY,
      fontWeight: 700,
      fontSize: 68,
      lineHeight: 1.12,
      letterSpacing: '-0.02em'
    }
  }, ln))), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 165 690 V 785 H 300 M 300 690 V 884",
    fill: "none",
    stroke: SKY,
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - draw
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 330,
      right: 100,
      top: 690
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.75 + i * 0.09, 14),
      color: WHITE,
      fontWeight: 400,
      fontSize: 52,
      lineHeight: 1.24
    }
  }, ln))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 120,
      right: 120,
      top: 1000,
      background: SKY,
      padding: '52px 56px',
      textAlign: 'center',
      opacity: box,
      transform: `translateY(${(1 - box) * 34}px)`
    }
  }, (sc.box || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.1 + i * 0.07, 10),
      color: NAVY,
      fontWeight: 400,
      fontSize: 48,
      lineHeight: 1.26
    }
  }, fmt(ln, NAVY, 700, i)))), /*#__PURE__*/React.createElement("img", {
    src: "assets/real/car-polo.webp",
    alt: "Volkswagen Polo",
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 90,
      width: 1060,
      height: 'auto',
      transform: `translateX(-50%) translateY(${(1 - car) * 40}px)`,
      opacity: car
    }
  }));
}

/* ── 4 · FACTORS: black video top + grey list bottom ──────────── */
function Factors() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const splitY = 830;
  const Sq = ({
    d
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 22,
      height: 22,
      background: SKY,
      marginRight: 20,
      marginTop: 30,
      flex: '0 0 auto',
      opacity: ease(lt, d, 0.4)
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: GREY
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: splitY,
      background: BLACK,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(TopVideo, {
    src: VID_4,
    start: 0,
    end: 5.505,
    speed: 0.8131,
    w: W,
    h: splitY
  })), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      right: 120,
      top: splitY + 160,
      ...groupIn(lt, 'up')
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.08, 16),
      color: NAVY,
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 1.14,
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap'
    }
  }, ln)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      marginTop: 58
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, (sc.colA || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.7 + i * 0.07, 12),
      color: NAVY,
      fontWeight: 400,
      fontSize: 52,
      lineHeight: 1.2,
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, i === 0 ? /*#__PURE__*/React.createElement(Sq, {
    d: 0.7
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", null, ln)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, (sc.colB || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.85 + i * 0.07, 12),
      color: NAVY,
      fontWeight: 400,
      fontSize: 52,
      lineHeight: 1.2,
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, i === 0 ? /*#__PURE__*/React.createElement(Sq, {
    d: 0.85
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", null, ln))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, (sc.wide || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.05 + i * 0.07, 12),
      color: NAVY,
      fontWeight: 400,
      fontSize: 52,
      lineHeight: 1.2,
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, i === 0 ? /*#__PURE__*/React.createElement(Sq, {
    d: 1.05
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", null, ln)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, (sc.strong || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.35 + i * 0.08, 12),
      color: NAVY,
      fontWeight: 700,
      fontSize: 54,
      lineHeight: 1.3
    }
  }, fmtHiAnim(ln, SKY, NAVY, ease(lt, 1.55 + i * 0.45, 0.55), i))))));
}

/* ── 5 · INCLUDED: navy, heading + bracketed list + tail + note ── */
function Included() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const items = sc.items || [];
  const draw = ease(lt, 1.0, 0.9);
  const listTop = 780,
    itemGap = 124,
    lineX = 163,
    sqX = 150,
    textX = 222;
  const elbowY = listTop + items.length * itemGap + 24;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: NAVY
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      transform: 'translateX(-40px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      right: 130,
      top: 420,
      ...groupIn(lt, 'up')
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.07, 14),
      color: SKY,
      fontWeight: 700,
      fontSize: 54,
      lineHeight: 1.18,
      letterSpacing: '-0.01em'
    }
  }, ln))), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: `M ${lineX} ${listTop + 8} V ${elbowY - 12} H 400`,
    fill: "none",
    stroke: SKY,
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - draw
  })), items.map((it, i) => {
    const p = ease(lt, 0.55 + i * 0.12, 0.5);
    const y = listTop + i * itemGap;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: sqX,
        top: y - 4,
        width: 26,
        height: 26,
        background: SKY,
        opacity: p,
        transform: `scale(${0.6 + 0.4 * p})`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: textX,
        top: y - 22,
        ...rise(lt, 0.55 + i * 0.12, 12),
        color: WHITE,
        fontWeight: 500,
        fontSize: 62,
        lineHeight: 1
      }
    }, it));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 70,
      top: elbowY - 46
    }
  }, (sc.tail || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.6 + i * 0.08, 12),
      color: WHITE,
      fontWeight: 400,
      fontSize: 56,
      lineHeight: 1.26,
      whiteSpace: 'nowrap'
    }
  }, ln)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 1560,
      textAlign: 'center',
      ...rise(lt, 2.0, 10)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 40,
      opacity: 0.85
    }
  }, sc.note)));
}

/* ── 6 · LINE: black, short rule + heading + body ─────────────── */
function Line() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const rule = ease(lt, 0.3, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK
    }
  }, /*#__PURE__*/React.createElement(FullVideoScrim, {
    src: VID_6,
    start: 0,
    end: 4.254,
    speed: 0.7422
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      top: 1230,
      width: 300,
      height: 7,
      background: SKY,
      transform: `scaleX(${rule})`,
      transformOrigin: 'left'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      right: 120,
      top: 1310,
      ...groupIn(lt, 'up')
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.5 + i * 0.09, 16),
      color: WHITE,
      fontWeight: 700,
      fontSize: 64,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  }, ln)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 46
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.9 + i * 0.08, 14),
      color: WHITE,
      fontWeight: 400,
      fontSize: 46,
      lineHeight: 1.34,
      whiteSpace: 'nowrap'
    }
  }, fmt(ln, WHITE, 700, i))))));
}

/* ── 7 · LOGO FRAME: black, sky border + logo on top edge + CTA ── */
function LogoFrame() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const drawT = clamp((lt - 0.7) / 1.2, 0, 1);
  const draw = E.easeInOutSine(drawT);
  const FR = {
    l: 90,
    r: 90,
    t: 720,
    b: 600
  };
  const fw = W - FR.l - FR.r,
    fh = H - FR.t - FR.b;
  const moveP = ease(lt, 0.05, 0.55);
  const logoTop = LOGO_TOP + (FR.t - LOGO_TOP) * moveP;
  // The logo lockup sits centered on the frame's top edge with no opaque
  // backing behind it; relying on its glyphs to visually "cut" the border
  // line reads as a broken/interrupted line rather than a deliberate gap.
  // Build the border as a single open path with a real geometric gap
  // sized to the logo's rendered box (height 66 * its 9498/1182 aspect
  // ratio + the wrapper's 26px side padding) instead.
  const logoHalfW = 66 * 9498 / 1182 / 2 + 26;
  const gapL = W / 2 - logoHalfW,
    gapR = W / 2 + logoHalfW;
  const fx0 = FR.l,
    fy0 = FR.t,
    fx1 = FR.l + fw,
    fy1 = FR.t + fh;
  const framePath = `M ${gapL} ${fy0} L ${fx0} ${fy0} L ${fx0} ${fy1} L ${fx1} ${fy1} L ${fx1} ${fy0} L ${gapR} ${fy0}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK
    }
  }, /*#__PURE__*/React.createElement(FullVideoPlain, {
    src: VID_7,
    start: 0,
    end: 2.419,
    speed: 0.4223
  }), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: framePath,
    fill: "none",
    stroke: SKY,
    strokeWidth: "4",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - draw
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: logoTop,
      transform: 'translate(-50%,-50%)',
      padding: '0 26px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/real/logo-white.png",
    alt: "Real Assinatura",
    style: {
      height: 66,
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: FR.l,
      right: FR.r,
      top: FR.t + fh / 2,
      transform: 'translateY(-50%)',
      textAlign: 'center',
      padding: '0 40px'
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.1 + i * 0.1, 14),
      color: WHITE,
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    }
  }, fmtU(ln, SKY, i)))));
}

/* ── root ────────────────────────────────────────────────────── */
const LAYOUTS = {
  question: Question,
  lightlist: LightList,
  skybox: SkyBox,
  factors: Factors,
  included: Included,
  line: Line,
  logoframe: LogoFrame
};
function RealVideo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach(sc => {
    children[sc.name] = LAYOUTS[sc.layout] || LightList;
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SceneStage, {
    width: W,
    height: H,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: BLACK,
    transition: "cut"
  }, children), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "V\xEDdeo"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Mostrar logo",
    value: t.showLogo !== false,
    onChange: v => setTweak('showLogo', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Edi\xE7\xE3o"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Editor de tempo",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  })));
}
window.RealVideo = RealVideo;
})();
