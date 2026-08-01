(function(){
/* Sudeste Assinatura — VÍDEO 3 (1080×1920).
   "E se o seu carro acompanhasse as suas fases?"
   Mesma estrutura do Vídeo 2 (logo, escalas de tipo, cores, fonte).
   Layout fiel ao esquema do cliente — atenção à quebra dos textos.
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
const BLACK = '#000000';
const TEAL = '#034845';
const MINT = '#00d1b2';
const YEL = '#eaff4a';
const WHITE = '#ffffff';
const CARD = '#edefe9';
const CINK = '#0a4b47';
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640,
  LOGO_TOP = 200;
const E = Easing;
const RT = {
  showLogo: true,
  videoBg: true
};
const VID_1 = 'assets/bg-1.mp4';
const VID_3 = 'assets/bg-3.mp4';
const VID_4 = 'assets/bg-4.mp4';
const VID_6 = 'assets/bg-6.mp4';

/* ── helpers ─────────────────────────────────────────────── */
function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - delay) / (d || 0.65), 0, 1));
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  // willChange promotes the element to its own GPU layer for the opacity+
  // transform animation — without it, some browsers recompute text
  // anti-aliasing on every intermediate frame of the fade, which reads as
  // a flicker right as the text reveals rather than a smooth fade.
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * (px == null ? 24 : px)}px)`,
    willChange: 'opacity, transform'
  };
}
function fmt(text, accent, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      color: accent,
      fontWeight: 700
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}
function Logo({
  lt,
  dark
}) {
  const p = ease(lt, 0.12, 0.7);
  return /*#__PURE__*/React.createElement("img", {
    src: dark ? "assets/logo-dark.png" : "assets/logo-white.png",
    alt: "Sudeste Assinaturas",
    style: {
      position: 'absolute',
      top: LOGO_TOP,
      left: '50%',
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`,
      opacity: p,
      width: LOGO_W,
      height: 'auto',
      zIndex: 6,
      willChange: 'opacity, transform'
    }
  });
}
const shell = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  fontFamily: FONT,
  background: BLACK
};

// Background video for the black scenes (Telas 1, 3, 4, 6). Black fallback
// div + VideoSprite + dark overlay, opacity gated behind a "ready" state so
// the overlay never paints alone (flat colour flash) before the first frame
// decodes, and any drift-correction catch-up seek happens off-screen.
// VideoSprite here only corrects drift via periodic seeks (no native
// play() call), which alone can look choppier than real decode-driven
// playback — passing autoPlay+loop through (VideoSprite spreads unknown
// props onto the underlying <video>) lets the browser actually play the
// clip natively; VideoSprite's own seeks then just keep it honest against
// the scene clock instead of being the only thing advancing the frame.
function BgVideo({
  src,
  start,
  end,
  scale,
  posX,
  posY,
  op,
  overlay,
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
  if (!RT.videoBg) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: BLACK
      }
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: BLACK
    }
  }), /*#__PURE__*/React.createElement(VideoSprite, {
    src: src,
    start: start || 0,
    end: end || 3,
    speed: speed || 1,
    autoPlay: true,
    loop: true,
    onCanPlayThrough: markReady,
    style: {
      position: 'absolute',
      inset: 0,
      width: W,
      height: H,
      objectFit: 'cover',
      objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
      transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
      opacity: ready ? op == null ? 1 : op : 0,
      transition: 'opacity .25s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: overlay || 'rgba(0,0,0,0.55)',
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  }));
}

/* Uma <div> por linha = quebra exata do esquema. */
function Lines({
  list,
  lt,
  delay,
  step,
  style,
  accent
}) {
  return (list || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, (delay || 0) + i * (step || 0.08), 14),
      ...style
    }
  }, fmt(ln, accent || YEL, i)));
}
const ICONS = {
  clock: 'assets/ic-clock.png',
  cal: 'assets/ic-calendar.png',
  car: 'assets/ic-car.png'
};
function TLIcon({
  name
}) {
  const sz = name === 'car' ? 60 : 52;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: '50%',
      background: YEL,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: sz,
      height: sz,
      background: TEAL,
      WebkitMaskImage: `url(${ICONS[name]})`,
      maskImage: `url(${ICONS[name]})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center'
    }
  }));
}

/* ── TELA 1 · pergunta de abertura (preto, rodapé, centrado) ─ */
function Opening() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_1,
    start: 0,
    end: 3.26,
    scale: 1.04,
    posY: 45
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      right: 60,
      top: 1360,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.head,
    lt: lt,
    delay: 0.3,
    step: 0.12,
    style: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 82,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.3 + sc.head.length * 0.12, 14),
      position: 'relative',
      display: 'inline-block',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      background: TEAL,
      transformOrigin: 'left',
      transform: `scaleX(${ease(lt, 1.2, 0.5)})`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      color: YEL,
      fontWeight: 700,
      display: 'inline-block',
      fontSize: 82,
      lineHeight: 1.18,
      letterSpacing: '-0.02em',
      padding: '4px 26px 10px'
    }
  }, sc.hi))));
}

/* ── TELA 2 · timeline "há dois anos" (teal, grupo centrado) ─ */
function Timeline() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const items = sc.items || [];
  const rowH = [96, 168, 300],
    gap = 36;
  const rowTop = [];
  let acc = 0;
  items.forEach((_, i) => {
    rowTop[i] = acc;
    acc += rowH[i] + gap;
  });
  const grow = ease(lt, 0.7, 0.9);
  const c0 = rowTop[0] + 42,
    cN = rowTop[items.length - 1] + 42;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: TEAL
    }
  }, RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -40,
      right: 0,
      top: 320,
      bottom: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.title,
    lt: lt,
    delay: 0.3,
    step: 0.1,
    style: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 88,
      lineHeight: 1.12,
      letterSpacing: '-0.02em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 84,
      height: acc
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 40,
      top: c0,
      width: 4,
      height: (cN - c0) * grow,
      background: YEL
    }
  }), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: 0,
      top: rowTop[i],
      right: 0,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 44,
      ...rise(lt, 0.55 + i * 0.28, 16)
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(TLIcon, {
    name: it.icon
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 60,
      lineHeight: 1.18,
      paddingTop: 4,
      whiteSpace: 'nowrap'
    }
  }, it.lines.map((ln, j) => /*#__PURE__*/React.createElement("div", {
    key: j
  }, ln)))))))));
}

/* ── TELA 3 · "a vida muda rápido" (retângulos saindo da esquerda) ─ */
function HighlightBox() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const PADL = 108;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_3,
    start: 0,
    end: 2.62,
    scale: 1.06,
    posY: 45
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 84,
      top: 320
    }
  }, sc.hi.map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      clipPath: `inset(0 ${(1 - ease(lt, 0.9 + i * 0.22, 0.5)) * 100}% 0 0)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: MINT,
      color: TEAL,
      fontWeight: 700,
      fontSize: 80,
      lineHeight: 1.16,
      letterSpacing: '-0.02em',
      padding: `2px 22px 8px ${PADL}px`
    }
  }, ln)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      paddingLeft: PADL
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.body,
    lt: lt,
    delay: 0.25,
    step: 0.08,
    accent: MINT,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.2,
      textAlign: 'left'
    }
  }))));
}

/* ── TELA 4 · título + linha à esquerda + corpo (preto) ────── */
function LineSplit() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const grow = ease(lt, 0.55, 0.9);
  const lTop = 652,
    lBot = 1342;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_4,
    start: 0,
    end: 4.62,
    scale: 1.06,
    posY: 45
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 108,
      right: 84,
      top: 320
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.title,
    lt: lt,
    delay: 0.3,
    step: 0.1,
    accent: YEL,
    style: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 80,
      lineHeight: 1.16,
      letterSpacing: '-0.02em'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 132,
      top: lTop,
      width: 3,
      height: (lBot - lTop) * grow,
      background: YEL
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 108,
      right: 84,
      top: 1420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 1.0, 14),
      color: WHITE,
      fontWeight: 700,
      fontSize: 62,
      lineHeight: 1.2,
      marginBottom: 16
    }
  }, sc.lead), /*#__PURE__*/React.createElement(Lines, {
    list: sc.body,
    lt: lt,
    delay: 1.12,
    step: 0.08,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.3
    }
  })));
}

/* ── TELA 5 · card cinza (sem logo) com Amarok + conector ──── */
function TruckCard() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const cn = ease(lt, 1.0, 0.7);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: CARD
    }
  }, RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt,
    dark: true
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 190,
      top: 440,
      width: 700,
      height: 250,
      background: MINT,
      borderRadius: '78px 0 78px 0',
      ...rise(lt, 0.15, 20)
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/amarok.webp",
    alt: "Amarok",
    style: {
      position: 'absolute',
      left: 150,
      top: 380,
      width: 780,
      height: 'auto',
      objectFit: 'contain',
      ...rise(lt, 0.2, 22)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 130,
      top: 800
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.body,
    lt: lt,
    delay: 0.5,
    step: 0.08,
    accent: TEAL,
    style: {
      color: TEAL,
      fontWeight: 500,
      fontSize: 60,
      lineHeight: 1.22
    }
  })), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 320 200",
    width: "320",
    height: "200",
    style: {
      position: 'absolute',
      left: 380,
      top: 1108,
      opacity: cn
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "84",
    y1: "20",
    x2: "194",
    y2: "150",
    stroke: MINT,
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeDasharray: "180",
    strokeDashoffset: (1 - cn) * 180
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "206",
    cy: "162",
    r: "30",
    fill: "none",
    stroke: MINT,
    strokeWidth: "4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 110,
      top: 1346,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.body2,
    lt: lt,
    delay: 1.35,
    step: 0.08,
    style: {
      color: TEAL,
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1.2
    }
  })));
}

/* ── TELA 6 · dois parágrafos à esquerda, 2º com linha vertical ─ */
function LineLeft() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const grow = ease(lt, 0.9, 0.8);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_6,
    start: 0,
    end: 2.2,
    scale: 1.06,
    posY: 45
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 200,
      right: 40,
      top: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingTop: 900
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.title,
    lt: lt,
    delay: 0.3,
    step: 0.1,
    style: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 78,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 56,
      paddingLeft: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: YEL,
      transformOrigin: 'top',
      transform: `scaleY(${grow})`
    }
  }), /*#__PURE__*/React.createElement(Lines, {
    list: sc.body,
    lt: lt,
    delay: 0.75,
    step: 0.08,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.24
    }
  }))));
}

/* ── TELA 7 · card teal (topo) com fecho + logo ────────────── */
function TealCard() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const up = E.easeOutCubic(clamp((lt - 0.1) / 0.8, 0, 1));
  const cardH = 940;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: cardH,
      background: TEAL,
      borderBottomLeftRadius: 66,
      borderBottomRightRadius: 66,
      transform: `translateY(${(1 - up) * -cardH}px)`
    }
  }, RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 90,
      right: 90,
      top: 300,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.title,
    lt: lt,
    delay: 0.5,
    step: 0.1,
    style: {
      color: YEL,
      fontWeight: 700,
      fontSize: 80,
      lineHeight: 1.12,
      letterSpacing: '-0.02em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.body,
    lt: lt,
    delay: 0.85,
    step: 0.09,
    accent: MINT,
    style: {
      color: WHITE,
      fontWeight: 500,
      fontSize: 58,
      lineHeight: 1.26
    }
  })))));
}

/* ── root ────────────────────────────────────────────────── */
const LAYOUTS = {
  opening: Opening,
  timeline: Timeline,
  highlight: HighlightBox,
  linesplit: LineSplit,
  truckcard: TruckCard,
  lineleft: LineLeft,
  tealcard: TealCard
};
function SudesteVideo3() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach(sc => {
    children[sc.name] = LAYOUTS[sc.layout] || Opening;
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
window.SudesteVideo3 = SudesteVideo3;
})();
