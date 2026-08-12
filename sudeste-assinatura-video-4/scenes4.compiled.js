(function(){
/* Sudeste Assinatura — VÍDEO 4 (1080×1920).
   "Franquia de km: você está fazendo a conta do jeito certo?"
   Mesma estrutura dos Vídeos 2/3 (SceneStage, DM Sans, paleta, escalas, logo).
   Layout fiel ao esboço do cliente (v4_1…v4_7).
   Contador animado na Tela 1; caminhos "desenhados" (wipe) na Tela 3.
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
const CARD = '#edeeea'; // fundo claro (Tela 3)
const LMINT = '#c9f2d6'; // card claro (Tela 4)
const INK = '#0c3f36'; // texto escuro sobre claro
const FONT = "'DM Sans', system-ui, sans-serif";
const LOGO_W = 640,
  LOGO_TOP = 200;
const E = Easing;
const RT = {
  showLogo: true,
  videoBg: true
};

/* Each video-background scene gets its own small dedicated clip file
   (never a shared multi-scene composite — a shared file forces every
   scene to seek into it before it can paint anything, which reads as a
   stray black frame or a stutter under load). VideoSprite loops a clip
   that's shorter than `end/speed` seconds of scene time — the `speed`
   below is therefore NOT clip_length / this-scene's-visual-duration in
   isolation, it must use Video 4's REAL per-scene `dur` from OM_SCENES
   (6, 6, 6.5, 6.5, 6, 7, 6 — roughly double Video 1/3's ~3s scenes,
   easy to miscopy from those). Getting that wrong is exactly what
   caused the very visible "looping" bug: clips sized for a ~3s scene
   wrapped back to their start 2+ times inside Video 4's 6-7s scenes.
   speed = clip_length / (scene_dur * 0.96) — the 4% shaves a safety
   margin so the clip finishes just before scene end even if a render
   frame overshoots by a tick, rather than landing exactly on the wrap
   boundary. Each source video below is used in exactly one scene (T1
   vwbrasil_1, T2 infinito TSI Tiguan, T4 ssstik1 SUV aerial, T5 "Lindo
   de todos os ângulos" teal SUV, T7 vwbrasil Taos) so no two scenes
   show the same take. Telas 2, 4, 5 and 7 each concatenate two clips of
   comparable motion energy (never pairing something dynamic with
   something static, which reads as a jarring speed change) to reach a
   raw length that keeps `speed` in a comfortable ~0.45–0.75 range. */
const VID_1 = 'assets/videos/t1.mp4';
const VID_2 = 'assets/videos/t2.mp4';
const VID_4 = 'assets/videos/t4.mp4';
const VID_5 = 'assets/videos/t5.mp4';
const VID_7 = 'assets/videos/t7.mp4';

/* ── helpers ─────────────────────────────────────────────── */
function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * (px == null ? 24 : px)}px)`
  };
}
function rich(text, accent, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('b', {
    key: i,
    style: {
      fontWeight: 700,
      color: accent || 'inherit'
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}
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
  }, rich(ln, accent, i)));
}
function Logo({
  dark
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: dark ? "assets/logo-dark.png" : "assets/logo-white.png",
    alt: "Sudeste Assinaturas",
    decoding: "sync",
    loading: "eager",
    style: {
      position: 'absolute',
      top: LOGO_TOP,
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: 1,
      width: LOGO_W,
      height: 'auto',
      zIndex: 6
    }
  });
}
/* contador pt-BR — largura travada no valor final (sem reflow) */
function Counter({
  to,
  lt,
  delay,
  dur
}) {
  const p = ease(lt, delay == null ? 0.5 : delay, dur || 1.35);
  const cur = Math.round(to * p).toLocaleString('pt-BR');
  const res = to.toLocaleString('pt-BR');
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      position: 'relative',
      fontVariantNumeric: 'tabular-nums',
      color: 'inherit',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      visibility: 'hidden'
    }
  }, res), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0
    }
  }, cur));
}
const shell = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  fontFamily: FONT,
  background: BLACK
};

// Background video for the black scenes (Telas 1, 2, 4, 5, 7). Black
// fallback div + VideoSprite + dark overlay, opacity gated behind a
// "ready" state so the overlay never paints alone before the first frame
// decodes. Ported from Video 3's BgVideo — do not add autoPlay/loop on the
// <video>: VideoSprite already drives play()/pause()/currentTime itself,
// and a second native loop would race its corrections.
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
  shiftY,
  filter
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
    onLoadedData: markReady,
    style: {
      position: 'absolute',
      inset: 0,
      width: W,
      height: H,
      objectFit: 'cover',
      objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
      transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
      filter: filter || 'none',
      opacity: ready ? op == null ? 1 : op : 0,
      transition: 'opacity .25s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: overlay || 'rgba(0,0,0,0.35)',
      opacity: ready ? 1 : 0,
      transition: 'opacity .25s ease'
    }
  }));
}

/* ── TELA 1 · pergunta (números em destaque) + colchete mint ── */
function Bracket() {
  const s = useScene();
  const lt = s.localTime;
  const draw = ease(lt, 0.9, 1.2);
  const hs = {
    color: WHITE,
    fontWeight: 700,
    fontSize: 66,
    lineHeight: 1.16,
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap'
  };
  const num = {
    color: MINT
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_1,
    start: 0,
    end: 2.967,
    speed: 0.5151,
    scale: 1.15,
    overlay: "rgba(0,0,0,0.5)"
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 108,
      right: 100,
      top: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.25, 18),
      ...hs
    }
  }, "Voc\xEA acha que ", /*#__PURE__*/React.createElement("span", {
    style: num
  }, /*#__PURE__*/React.createElement(Counter, {
    to: 1000,
    lt: lt,
    delay: 0.55
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.33, 18),
      ...hs
    }
  }, "ou ", /*#__PURE__*/React.createElement("span", {
    style: num
  }, /*#__PURE__*/React.createElement(Counter, {
    to: 1500,
    lt: lt,
    delay: 0.7
  })), " km por m\xEAs \xE9"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.41, 18),
      ...hs
    }
  }, "pouco para assinar um"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.49, 18),
      ...hs
    }
  }, "carro?")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1080 1920",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 782 512 H 900 V 1400",
    fill: "none",
    stroke: MINT,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - draw
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 110,
      left: 400,
      top: 1440,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: ["Talvez você esteja", "fazendo essa conta", "do jeito errado!"],
    lt: lt,
    delay: 1.5,
    step: 0.1,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 64,
      lineHeight: 1.22,
      whiteSpace: 'nowrap'
    }
  })));
}

/* ── TELA 2 · régua amarela + dois parágrafos (preto) ──────── */
function Ruled() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_2,
    start: 0,
    end: 4.2125,
    speed: 0.7313,
    scale: 1.15,
    overlay: "rgba(0,0,0,0.5)"
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 108,
      right: 90,
      top: 1140
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 210,
      height: 8,
      background: YEL,
      borderRadius: 4,
      transformOrigin: 'left',
      transform: `scaleX(${ease(lt, 0.25, 0.6)})`,
      marginBottom: 66
    }
  }), /*#__PURE__*/React.createElement(Lines, {
    list: sc.p1,
    lt: lt,
    delay: 0.5,
    step: 0.08,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.28
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 52
    }
  }), /*#__PURE__*/React.createElement(Lines, {
    list: sc.p2,
    lt: lt,
    delay: 0.95,
    step: 0.08,
    style: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 68,
      lineHeight: 1.18,
      letterSpacing: '-0.01em'
    }
  })));
}

/* ── TELA 3 · caminhos do esboço (wipe) + dado (fundo claro) ── */
function Roads() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const wipeT = ease(lt, 0.15, 1.4);
  const wipeB = ease(lt, 0.3, 1.4);
  const clip = p => `inset(0 ${(1 - p) * 100}% 0 0)`;
  const lineW = ease(lt, 0.9, 0.7);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: CARD
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/roads-top.png",
    alt: "",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 1080,
      height: 'auto',
      clipPath: clip(wipeT),
      WebkitClipPath: clip(wipeT),
      maskImage: 'linear-gradient(to bottom, #000 72%, transparent 96%)',
      WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 96%)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/roads-bottom.png",
    alt: "",
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 1080,
      height: 'auto',
      clipPath: clip(wipeB),
      WebkitClipPath: clip(wipeB),
      maskImage: 'linear-gradient(to top, #000 78%, transparent 98%)',
      WebkitMaskImage: 'linear-gradient(to top, #000 78%, transparent 98%)'
    }
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    dark: true
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      right: 150,
      top: 620
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.p1,
    lt: lt,
    delay: 0.6,
    step: 0.08,
    style: {
      color: INK,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 1138,
      width: 380,
      height: 3,
      background: MINT,
      transformOrigin: 'left',
      transform: `scaleX(${lineW})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 470,
      right: 70,
      top: 1100,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.p2,
    lt: lt,
    delay: 1.05,
    step: 0.09,
    style: {
      color: INK,
      fontWeight: 400,
      fontSize: 62,
      lineHeight: 1.24,
      whiteSpace: 'nowrap'
    }
  })));
}

/* ── TELA 4 · card claro centralizado (canto BR reto), sem contador ── */
function MintCard() {
  const s = useScene();
  const lt = s.localTime;
  const cardTop = 560,
    cardH = 840;
  const ts = {
    color: INK,
    fontWeight: 400,
    fontSize: 58,
    lineHeight: 1.3
  };
  const b = {
    fontWeight: 700
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_4,
    start: 0,
    end: 4.0,
    speed: 0.6410,
    scale: 1.15,
    overlay: "rgba(0,0,0,0.5)"
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 130,
      right: 130,
      top: cardTop,
      height: cardH,
      background: LMINT,
      borderRadius: '66px 66px 0 66px',
      ...rise(lt, 0.15, 26)
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 78,
      right: 70,
      top: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.5, 16),
      ...ts
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: b
  }, "Ou seja:"), " para muitos perfis,", /*#__PURE__*/React.createElement("br", null), "uma franquia de ", /*#__PURE__*/React.createElement("b", {
    style: b
  }, "1.000 ou"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", {
    style: b
  }, "1.500 km mensais"), " atende", /*#__PURE__*/React.createElement("br", null), "muito bem a rotina."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 48
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(lt, 0.85, 16),
      ...ts
    }
  }, "Principalmente para quem", /*#__PURE__*/React.createElement("br", null), "usa o carro no dia a dia, em", /*#__PURE__*/React.createElement("br", null), "trajetos urbanos e", /*#__PURE__*/React.createElement("br", null), "deslocamentos comuns."))));
}

/* ── TELA 5 · título amarelo + corpo branco (preto) ────────── */
function TitleLead() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_5,
    start: 0,
    end: 3.0,
    speed: 0.5208,
    scale: 1.15,
    overlay: "rgba(0,0,0,0.5)"
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 108,
      right: 90,
      top: 380
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.title,
    lt: lt,
    delay: 0.3,
    step: 0.1,
    style: {
      color: YEL,
      fontWeight: 700,
      fontSize: 84,
      lineHeight: 1.12,
      letterSpacing: '-0.02em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64
    }
  }), /*#__PURE__*/React.createElement(Lines, {
    list: sc.body,
    lt: lt,
    delay: 0.7,
    step: 0.08,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 58,
      lineHeight: 1.32
    }
  })));
}

/* ── TELA 6 · checklist com conectores amarelos (teal) ─────── */
function Checklist() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const items = sc.items || [];
  const RAIL = 290,
    DOT = 20,
    FS = 58,
    LH = 1.2;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: TEAL
    }
  }, RT.showLogo ? /*#__PURE__*/React.createElement(Logo, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 130,
      right: 90,
      top: 540
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.title,
    lt: lt,
    delay: 0.3,
    step: 0.1,
    style: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 84,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 90,
      top: 960,
      display: 'flex',
      flexDirection: 'column',
      gap: 44
    }
  }, items.map((lines, i) => {
    const d = 0.7 + i * 0.24;
    const cy = FS * LH / 2;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: RAIL,
        flex: '0 0 auto',
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: cy - 1.5,
        width: RAIL - DOT - 56,
        height: 3,
        background: YEL,
        transformOrigin: 'left',
        transform: `scaleX(${ease(lt, d, 0.55)})`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: RAIL - DOT - 66,
        top: cy - DOT / 2,
        width: DOT,
        height: DOT,
        borderRadius: '50%',
        background: YEL,
        opacity: ease(lt, d + 0.4, 0.3)
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        ...rise(lt, d + 0.15, 12),
        color: WHITE,
        fontWeight: 400,
        fontSize: FS,
        lineHeight: LH
      }
    }, lines.map((ln, j) => /*#__PURE__*/React.createElement("div", {
      key: j
    }, ln))));
  })));
}

/* ── TELA 7 · fecho: texto → conector → placa mint (preto) ──── */
function Closer() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const conn = ease(lt, 0.95, 0.6);
  const box = ease(lt, 1.25, 0.7);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(BgVideo, {
    src: VID_7,
    start: 0,
    end: 2.6276,
    speed: 0.4562,
    scale: 1.15,
    overlay: "rgba(0,0,0,0.5)"
  }), RT.showLogo ? /*#__PURE__*/React.createElement(Logo, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 90,
      right: 90,
      top: 480,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.top,
    lt: lt,
    delay: 0.35,
    step: 0.09,
    style: {
      color: WHITE,
      fontWeight: 400,
      fontSize: 66,
      lineHeight: 1.24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 540,
      top: 900,
      width: 3,
      height: 240,
      background: MINT,
      transformOrigin: 'top',
      transform: `translateX(-1.5px) scaleY(${conn})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 70,
      right: 70,
      top: 1140,
      minHeight: 380,
      background: MINT,
      opacity: box,
      transform: `translateY(${(1 - box) * 24}px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Lines, {
    list: sc.box,
    lt: lt,
    delay: 1.45,
    step: 0.08,
    style: {
      color: INK,
      fontWeight: 700,
      fontSize: 58,
      lineHeight: 1.26,
      letterSpacing: '-0.02em',
      whiteSpace: 'nowrap'
    }
  }))));
}

/* ── root ────────────────────────────────────────────────── */
const LAYOUTS = {
  bracket: Bracket,
  ruled: Ruled,
  roads: Roads,
  mintcard: MintCard,
  titlelead: TitleLead,
  checklist: Checklist,
  closer: Closer
};
function SudesteVideo4() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach(sc => {
    children[sc.name] = LAYOUTS[sc.layout] || Bracket;
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
window.SudesteVideo4 = SudesteVideo4;
})();
