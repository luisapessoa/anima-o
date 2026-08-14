(function(){
/* Estilo Assinaturas — vertical brand video (1080×1920).
   Same animation engine/pattern as the Sudeste film; new brand + 7 screens.
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
const NAVY = '#000051'; // deepest brand blue — text on white
const BLUE = '#173ded'; // primary accent
const WHITE = '#ffffff';
const GREY = '#e6e6e9'; // light neutral
const BLACK = '#000000';
const FONT = "'Urbanist', system-ui, sans-serif";
const LOGO_W = 232,
  LOGO_TOP = 248; // logo shared across all screens
const E = Easing;
const RUNTIME = {
  showLogo: true,
  videoBg: true
};
const VID_1 = 'assets/bg-1.mp4';
const VID_2 = 'assets/bg-2.mp4';
const VID_3 = 'assets/bg-3.mp4';
const VID_4 = 'assets/bg-4.mp4';
const VID_7 = 'assets/bg-7.mp4';

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
/* whole-scene entrance — the "transition" into a screen. dir: 'up'|'down'|'left'|'right'|'scale' */
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

/* emphasis: **text** rendered with the given colour + weight */
function fmt(text, color, weight, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      color,
      fontWeight: weight || 800
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}

/* Background video for the black scenes (Telas 1, 2, 4, 7), per the
   handoff README's "Vídeos de fundo" spec: cover fit, object-position
   ~50% 24%, slight scale to fill, video opacity ~0.6 over the black
   backdrop plus a dark gradient overlay on top so the white text keeps
   contrast. Black fallback + ready-gated opacity so nothing paints
   before the first frame decodes (mirrors the Sudeste BgVideo pattern). */
function BgVideo({
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
      transform: `translateY(${shiftY || 0}px) scale(1.2)`,
      opacity: ready ? 0.6 : 0,
      transition: 'opacity .25s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.30) 45%, rgba(0,0,0,.68) 100%)',
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  }));
}

/* Video for Tela 3's media card — full-bleed inside the rounded card
   (parent has overflow:hidden), no dark overlay since no text sits on
   top of it here; same ready-gated black fallback as BgVideo. */
function CardVideo({
  src,
  start,
  end,
  speed
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
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  });
}

/* ── shared logo ─────────────────────────────────────────────── */
function Logo({
  variant,
  lt
}) {
  const p = ease(lt, 0.12, 0.7);
  const src = variant === 'dark' ? 'assets/estilo/logo-dark.png' : 'assets/estilo/logo-white.png';
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Estilo Assinaturas",
    style: {
      position: 'absolute',
      top: LOGO_TOP,
      left: '50%',
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`,
      opacity: p,
      width: LOGO_W,
      height: 'auto',
      zIndex: 5
    }
  });
}
const shell = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  fontFamily: FONT
};

/* ── 1 · FRAME: "Assinei um carro." + big rounded frame + bottom pill ── */
function FrameScreen() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const draw = ease(lt, 0.6, 1.0);
  const pill = ease(lt, 1.15, 0.55);
  const FR = {
    l: 100,
    r: 100,
    t: 552,
    b: 300
  };
  const fw = W - FR.l - FR.r,
    fh = H - FR.t - FR.b;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_1,
    start: 0,
    end: 1.29,
    speed: 0.2758
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: FR.l,
    y: FR.t,
    width: fw,
    height: fh,
    rx: "30",
    ry: "30",
    fill: "none",
    stroke: BLUE,
    strokeWidth: "4",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - draw
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: FR.t,
      textAlign: 'center',
      transform: 'translateY(-50%)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...rise(lt, 0.25, 20),
      display: 'inline-block',
      padding: '0 14px',
      color: WHITE,
      fontWeight: 800,
      fontSize: 82,
      lineHeight: 1,
      letterSpacing: '-0.03em'
    }
  }, sc.head)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: H - FR.b,
      transform: `translateX(-50%) translateY(-50%) scale(${0.94 + 0.06 * pill})`,
      opacity: pill,
      border: `4px solid ${BLUE}`,
      borderRadius: 26,
      padding: '24px 40px',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: WHITE,
      fontWeight: 600,
      fontSize: 54,
      letterSpacing: '-0.01em'
    }
  }, sc.pill)));
}

/* ── 2 · UNDERLINE: centred bold underlined heading + body (dark) ─ */
function Underline() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const ul = ease(lt, 0.55, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'left',
      padding: '470px 80px 0'
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_2,
    start: 0,
    end: 5.0,
    speed: 0.9610
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...groupIn(lt, 'up')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.2, 22),
      color: WHITE,
      fontWeight: 800,
      fontSize: 56,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      whiteSpace: 'nowrap'
    }
  }, sc.head), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: -14,
      height: 7,
      width: `${ul * 100}%`,
      background: BLUE,
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.7 + i * 0.1, 16),
      color: WHITE,
      fontWeight: 500,
      fontSize: 50,
      lineHeight: 1.4,
      whiteSpace: 'nowrap'
    }
  }, ln)))));
}

/* ── 3 · MEDIA CARD on white: centred black card + dot over the E + body ── */
function MediaCard() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const card = ease(lt, 0.25, 0.6);
  const conn = ease(lt, 0.85, 0.6);
  const cardW = 820,
    cardH = 820,
    cardTop = 430;
  const bodyW = 720,
    bodyLeft = (W - bodyW) / 2,
    bodyTop = cardTop + cardH + 130;
  const dotY = bodyTop - 48,
    dotX = bodyLeft + 14;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: WHITE
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "dark",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      marginLeft: -cardW / 2,
      top: cardTop,
      width: cardW,
      height: cardH,
      background: BLACK,
      borderRadius: 44,
      opacity: card,
      transform: `scale(${0.96 + 0.04 * card})`,
      transformOrigin: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CardVideo, {
    src: VID_3,
    start: 0,
    end: 3.2,
    speed: 0.5585
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: dotY - 3,
      width: (dotX - 13) * conn,
      height: 6,
      background: BLUE,
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: dotX - 13,
      top: dotY - 13,
      width: 26,
      height: 26,
      borderRadius: 999,
      background: BLUE,
      opacity: conn
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: bodyLeft,
      width: bodyW,
      top: bodyTop,
      textAlign: 'left'
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.05 + i * 0.09, 16),
      color: NAVY,
      fontWeight: 600,
      fontSize: 54,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    }
  }, ln))));
}

/* ── 4 · BLUE BOX centred on black ────────────────────────────── */
function BlueBox() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const box = ease(lt, 0.2, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: 430
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_4,
    start: 0,
    end: 3.67,
    speed: 0.7047
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      margin: '0 40px',
      background: BLUE,
      borderRadius: 40,
      padding: '72px 66px',
      textAlign: 'center',
      opacity: box,
      transform: `translateY(${(1 - box) * 40}px) scale(${0.95 + 0.05 * box})`,
      transformOrigin: 'center'
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.55 + i * 0.08, 12),
      color: WHITE,
      fontWeight: 500,
      fontSize: 56,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    }
  }, fmt(ln, WHITE, 800, i)))));
}

/* ── 5 · BRACKET: heading top + right-side bracket line + bottom text ── */
function Bracket() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const draw = ease(lt, 0.7, 1.0);
  const headTop = 520,
    headRight = 640;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLACK
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_7,
    start: 0,
    end: 4.21,
    speed: 0.7353
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 120,
      top: 460,
      width: 780,
      ...groupIn(lt, 'right')
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.1, 20),
      color: WHITE,
      fontWeight: 800,
      fontSize: 58,
      lineHeight: 1.16,
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap'
    }
  }, ln))), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 765 540 H 905 V 1490",
    fill: "none",
    stroke: BLUE,
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - draw
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 120,
      right: 120,
      top: 1510,
      textAlign: 'right'
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.5 + i * 0.09, 14),
      whiteSpace: 'nowrap',
      color: WHITE,
      fontWeight: i === 0 ? 800 : 500,
      fontSize: i === 0 ? 50 : 48,
      lineHeight: 1.34,
      marginBottom: i === 0 ? 16 : 0
    }
  }, ln))));
}

/* ── 6 · ICONS on blue: three white icon tiles + body + quote ─── */
function Icons() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const icons = ['assets/estilo/ic-family.svg', 'assets/estilo/ic-clock.svg', 'assets/estilo/ic-doc.svg'];
  const tile = 176,
    gap = 130,
    top = 490;
  const rowW = icons.length * tile + (icons.length - 1) * gap;
  const rowX = (W - rowW) / 2,
    cy = top + tile / 2;
  const conn = ease(lt, 0.9, 0.7);
  const bar = ease(lt, 1.55, 0.5);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: BLUE
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: rowX + tile,
      top: cy - 2.5,
      width: (rowW - 2 * tile) * conn,
      height: 5,
      background: WHITE,
      borderRadius: 3
    }
  }), icons.map((src, i) => {
    const p = ease(lt, 0.25 + i * 0.16, 0.5);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: rowX + i * (tile + gap),
        top,
        width: tile,
        height: tile,
        borderRadius: 34,
        background: WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p,
        transform: `translateY(${(1 - p) * -20}px) scale(${0.9 + 0.1 * p})`
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      style: {
        width: 96,
        height: 96
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 130,
      right: 130,
      top: 740
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.05 + i * 0.09, 16),
      color: WHITE,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    }
  }, ln))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 190,
      right: 100,
      top: 1230,
      display: 'flex',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      background: WHITE,
      borderRadius: 4,
      transform: `scaleY(${bar})`,
      transformOrigin: 'top'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, (sc.quote || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.65 + i * 0.09, 14),
      color: WHITE,
      fontWeight: 500,
      fontSize: 52,
      lineHeight: 1.34
    }
  }, fmt(ln, WHITE, 800, i))))));
}

/* ── 7 · CRITERIA on white: heading + bulleted list + car on arc ── */
function Criteria() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const items = sc.items || [];
  const conn = ease(lt, 0.95, 0.7);
  const car = ease(lt, 0.9, 0.8);
  const groupW = 860,
    itemGap = 122;
  const listH = (items.length - 1) * itemGap;
  /* end-of-scene wipe: the blue circle grows to "take over" the screen,
     handing off seamlessly to Tela 6 (same blue background) */
  const wipe = E.easeInCubic(clamp((s.progress - 0.84) / 0.16, 0, 1));
  const arcScale = 1 + wipe * 3.4;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: WHITE
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "dark",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 452,
      width: groupW,
      opacity: ease(lt, 0, 0.5),
      transform: `translateX(-50%) translateY(${(1 - ease(lt, 0, 0.5)) * 60}px)`
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.1, 20),
      color: BLUE,
      fontWeight: 800,
      fontSize: 68,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  }, ln)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 44,
      height: listH + 150
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      top: 20,
      width: 6,
      height: listH * conn,
      background: BLUE,
      borderRadius: 3
    }
  }), items.map((it, i) => {
    const p = ease(lt, 0.7 + i * 0.14, 0.5);
    const y = i * itemGap;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: y + 5,
        width: 30,
        height: 30,
        borderRadius: 999,
        background: BLUE,
        opacity: p,
        transform: `scale(${0.6 + 0.4 * p})`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 74,
        right: 0,
        top: y,
        ...rise(lt, 0.7 + i * 0.14, 14)
      }
    }, (Array.isArray(it) ? it : [it]).map((ln, j) => /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        color: NAVY,
        fontWeight: 500,
        fontSize: 54,
        lineHeight: 1.18,
        letterSpacing: '-0.01em'
      }
    }, ln))));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: -980,
      width: 1500,
      height: 1500,
      marginLeft: -750,
      background: BLUE,
      borderRadius: '50%',
      opacity: car,
      transform: `scale(${arcScale})`,
      transformOrigin: 'center'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/estilo/car-tera.webp",
    alt: "Volkswagen Tera",
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 240,
      width: 1120,
      height: 'auto',
      transform: `translateX(-50%) translateY(${(1 - car) * 40}px)`,
      opacity: car * (1 - wipe)
    }
  }));
}

/* ── root ────────────────────────────────────────────────────── */
const LAYOUTS = {
  frame: FrameScreen,
  underline: Underline,
  mediacard: MediaCard,
  bluebox: BlueBox,
  bracket: Bracket,
  icons: Icons,
  criteria: Criteria
};
function EstiloVideo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  RUNTIME.videoBg = t.videoBg !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach(sc => {
    children[sc.name] = LAYOUTS[sc.layout] || Underline;
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
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "V\xEDdeo de fundo",
    value: t.videoBg !== false,
    onChange: v => setTweak('videoBg', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Edi\xE7\xE3o"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Editor de tempo",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  })));
}
window.EstiloVideo = EstiloVideo;
})();
