(function(){
/* Sudeste Assinatura — vertical brand video (1080×1920).
   Dynamic per-screen layouts. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
const {
  useScene,
  SceneStage,
  Easing,
  clamp,
  VideoSprite,
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakToggle
} = window;
const W = 1080,
  H = 1920;
const TEAL = '#034845'; // dark brand green
const TEAL2 = '#012f2d'; // deeper green for gradients
const MINT = '#00d1b2'; // accent
const PALE = '#c6f6d6'; // pale mint (accent lines)
const YEL = '#f2ff46'; // key highlight (dark bg only)
const WHITE = '#ffffff';
const FONT = "'DM Sans', system-ui, sans-serif";
const BODY = 54; // non-bold body size
const LOGO_W = 640,
  LOGO_TOP = 252; // logo size shared across all screens
const E = Easing;
const RUNTIME = {
  showLogo: true,
  videoBg: false
};

/* Five separate background clips, one per video scene, each its own small
   file starting at 0 — NOT one shared multi-scene composite. A shared
   file meant every scene mount had to seek deep into a large file before
   it could show anything, which under load painted a stray black frame
   (or, worse, a stale frame from whatever scene last had the decoder)
   for the first moment a scene was on screen. A dedicated small file
   needs no seek at all — it already starts where the scene needs it.
   Tela 1 uses a Taos-branded walkaround/driving clip (vwbrasil.mp4,
   plate reads "TAOS") instead of the T-Cross picnic ad's static
   parked/interior shots — those read as frozen even before any
   slowdown, since there's near-zero camera motion in the source itself.
   Tela 5 uses a different, non-overlapping window of that same driving
   clip rather than concatenating it after a slower T-Cross shot — two
   clips with different motion energy cut together read as a jarring
   speed jump even at one uniform `speed` value. Its window stops at
   6.9s of the source, not the 8.3s used earlier — the source settles
   into a held, static hero shot right after that, which reads as the
   video freezing at the scene's end no matter the speed (a still shot
   IS still, at any playback rate — the fix is keeping the window inside
   footage that's actually moving, not adjusting speed). Tela 7's
   elevated-highway shot (Tiguan clip, caption band cropped off the
   bottom, zoomed back to fill 720×1280 with a proportional
   scale+center-crop instead of a plain `pad`, which left a black strip)
   is trimmed for the same reason — the source itself holds still past
   ~18.3s. Encerramento concatenates seal + lake + glasses in that
   order specifically so the *last* clip (glasses) ends on a hand
   raising photos, not the lake footage, which is static throughout —
   putting static content mid-scene is fine, ending on it isn't. Each
   clip's `speed` is sized so its own natural duration, slowed or sped
   as needed, exactly fills the scene's duration — speed = clip length /
   scene duration — so it plays through exactly once and never
   wraps/repeats. */
const VID_T1 = 'assets/vw-t1.mp4';
const VID_T3 = 'assets/vw-t3.mp4';
const VID_T5 = 'assets/vw-t5.mp4';
const VID_T7 = 'assets/vw-t7.mp4';
const VID_ENC = 'assets/vw-enc.mp4';

/* ── motion helpers ──────────────────────────────────────────── */
function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - delay) / (d || 0.65), 0, 1));
}
function rise(lt, delay, px, d) {
  const p = ease(lt, delay, d);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * (px == null ? 26 : px)}px)`
  };
}

/* emphasis: **text** rendered in `accent` colour */
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

/* ── shared pieces ───────────────────────────────────────────── */
function Logo({
  variant,
  lt
}) {
  const p = ease(lt, 0.12, 0.7);
  const src = variant === 'dark' ? 'assets/logo-dark.png' : 'assets/logo-white.png';
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Sudeste Assinaturas",
    style: {
      position: 'absolute',
      top: LOGO_TOP,
      left: '50%',
      transform: `translateX(-50%) translateY(${(1 - p) * -12}px)`,
      opacity: p,
      width: LOGO_W,
      height: 'auto',
      zIndex: 5,
      filter: variant === 'dark' ? 'none' : 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))'
    }
  });
}

/* Black base + video (croppable via scale/posY) + optional colour overlay.
   Darken by lowering `op` (video opacity) so the black #000 shows through. */
function VideoBg({
  src,
  start,
  end,
  scale,
  posX,
  posY,
  shiftY,
  speed,
  op,
  overlay
}) {
  if (!RUNTIME.videoBg) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: '#000000'
      }
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: '#000000'
    }
  }), /*#__PURE__*/React.createElement(VideoSprite, {
    src: src || VID_T1,
    start: start || 0,
    end: end || 49,
    speed: speed || 1,
    style: {
      position: 'absolute',
      inset: 0,
      width: W,
      height: H,
      objectFit: 'cover',
      objectPosition: `${posX == null ? 50 : posX}% ${posY == null ? 50 : posY}%`,
      transform: `translateY(${shiftY || 0}px) scale(${scale || 1})`,
      opacity: op == null ? 1 : op
    }
  }), overlay ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: overlay
    }
  }) : null);
}
const shell = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  fontFamily: FONT
};
const tealOverlay = `linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)`;

/* ── 1 · HERO: dark video, centred title + bracket frame + mint box ── */
function HeroVideo() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const draw = ease(lt, 0.95, 0.8);
  const box = ease(lt, 1.35, 0.55);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: '#000000'
    }
  }, /*#__PURE__*/React.createElement(VideoBg, {
    src: VID_T1,
    start: 0,
    end: 3.0,
    speed: 0.546,
    scale: 1.24,
    posY: 24,
    op: 0.6,
    overlay: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.68) 100%)`
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 150,
      right: 150,
      top: 508,
      textAlign: 'center'
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.25 + i * 0.11, 20),
      color: WHITE,
      fontWeight: 700,
      fontSize: 84,
      lineHeight: 1.16,
      letterSpacing: '-0.02em',
      textShadow: '0 2px 20px rgba(0,0,0,0.6)'
    }
  }, ln))), /*#__PURE__*/React.createElement("svg", {
    width: "940",
    height: "668",
    viewBox: "0 0 940 668",
    style: {
      position: 'absolute',
      left: 70,
      top: 588,
      opacity: 0.95
    }
  }, ['M82 4 L6 4 L6 664 L82 664', 'M858 4 L934 4 L934 664 L858 664'].map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d,
    fill: "none",
    stroke: MINT,
    strokeWidth: "6",
    strokeLinecap: "square",
    strokeDasharray: "820",
    strokeDashoffset: 820 * (1 - draw)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 120,
      right: 120,
      top: 1058,
      transform: `scale(${0.95 + 0.05 * box})`,
      opacity: box,
      transformOrigin: 'center top',
      background: MINT,
      color: TEAL,
      padding: '48px 52px',
      borderRadius: '26px 26px 0 26px',
      textAlign: 'center'
    }
  }, (sc.boxes || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontWeight: 700,
      fontSize: 62,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    }
  }, ln))));
}

/* ── 2 · LEFT-BAR on white — text lowered ─────────────────────── */
function LeftBar() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const bar1 = ease(lt, 0.15, 0.5),
    bar2 = ease(lt, 0.9, 0.5);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: WHITE,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingTop: 1180,
      paddingLeft: 90,
      paddingRight: 90
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "dark",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("img", {
    src: "assets/vw-car.webp",
    alt: "",
    style: {
      position: 'absolute',
      top: 430,
      left: '50%',
      transform: `translateX(-50%) translateY(${(1 - ease(lt, 0.2, 0.7)) * 22}px)`,
      opacity: ease(lt, 0.2, 0.7),
      width: 1040,
      height: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 34,
      marginBottom: 70
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      background: MINT,
      borderRadius: 4,
      transform: `scaleY(${bar1})`,
      transformOrigin: 'top'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.25 + i * 0.1, 20),
      color: TEAL,
      fontWeight: 700,
      fontSize: 80,
      lineHeight: 1.08,
      letterSpacing: '-0.025em'
    }
  }, fmt(ln, MINT, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      background: PALE,
      borderRadius: 4,
      transform: `scaleY(${bar2})`,
      transformOrigin: 'top'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.0 + i * 0.09, 16),
      color: 'rgba(3,52,50,0.92)',
      fontWeight: 500,
      fontSize: BODY,
      lineHeight: 1.34
    }
  }, fmt(ln, TEAL, i))))));
}

/* ── 3 · TIMELINE: video+teal, heading top, line (no arrowhead), body ── */
function Timeline() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const line = ease(lt, 0.7, 1.0);
  const HT = 800,
    HB = 1296; // arrow span, equal margins between paragraphs
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(VideoBg, {
    src: VID_T3,
    start: 0,
    end: 2.2,
    speed: 0.3667,
    scale: 1.24,
    posY: 24,
    op: 1,
    overlay: tealOverlay
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 90,
      top: 380,
      width: 840
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.1, 22),
      color: WHITE,
      fontWeight: 700,
      fontSize: 72,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      textShadow: '0 2px 16px rgba(0,0,0,0.4)'
    }
  }, fmt(ln, YEL, i)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 108,
      top: HT,
      width: 5,
      height: (HB - HT) * line,
      background: MINT,
      borderRadius: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 90,
      top: 1400,
      width: 860
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.3 + i * 0.09, 16),
      color: 'rgba(255,255,255,0.94)',
      fontWeight: 500,
      fontSize: BODY,
      lineHeight: 1.36,
      textShadow: '0 2px 14px rgba(0,0,0,0.4)'
    }
  }, fmt(ln, MINT, i)))));
}

/* ── 4 · CENTER-STACK on white ────────────────────────────────── */
function CenterStack() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const div = ease(lt, 0.55, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: WHITE,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'center',
      paddingLeft: 90,
      paddingRight: 90,
      paddingTop: 640
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "dark",
    lt: lt
  }) : null, (sc.lead || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.08, 14),
      color: 'rgba(3,52,50,0.8)',
      fontWeight: 500,
      fontSize: 58,
      lineHeight: 1.24,
      maxWidth: 900
    }
  }, fmt(ln, MINT, i))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 4,
      height: 210 * div,
      background: MINT,
      margin: '60px 0',
      borderRadius: 3
    }
  }), (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.9 + i * 0.1, 22),
      color: TEAL,
      fontWeight: 700,
      fontSize: 74,
      lineHeight: 1.14,
      letterSpacing: '-0.02em',
      maxWidth: 940
    }
  }, fmt(ln, MINT, i))));
}

/* ── 5 · CARD-UP: video+teal green area, smaller white card ───── */
function CardUp() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const up = E.easeOutCubic(clamp((lt - 0.2) / 0.85, 0, 1));
  const cardH = 880;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell
    }
  }, /*#__PURE__*/React.createElement(VideoBg, {
    src: VID_T5,
    start: 0,
    end: 2.419,
    speed: 0.4320,
    scale: 1,
    shiftY: -480,
    op: 1,
    overlay: tealOverlay
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: cardH,
      background: WHITE,
      borderTopLeftRadius: 64,
      borderTopRightRadius: 64,
      transform: `translateY(${(1 - up) * (cardH + 40)}px)`,
      padding: '84px 84px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: '0 -30px 80px rgba(0,0,0,0.35)'
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.9 + i * 0.1, 18),
      color: TEAL,
      fontWeight: 700,
      fontSize: 70,
      lineHeight: 1.12,
      letterSpacing: '-0.02em'
    }
  }, fmt(ln, MINT, i))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 34
    }
  }), (sc.sub || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.15 + i * 0.1, 16),
      color: TEAL,
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    }
  }, fmt(ln, MINT, i))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 26
    }
  }), (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.35 + i * 0.09, 14),
      color: 'rgba(3,52,50,0.9)',
      fontWeight: 500,
      fontSize: BODY,
      lineHeight: 1.36
    }
  }, fmt(ln, MINT, i)))));
}

/* ── 6 · CHIPS on white: vertical stack, lowered ──────────────── */
function Chips() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const chips = sc.chips || [];
  const conn = ease(lt, 0.45, 0.9);
  const gap = 104,
    chipH = 176,
    top = 500,
    chipW = 340;
  const cx = (W - chipW) / 2;
  const total = chips.length * chipH + (chips.length - 1) * gap;
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
      left: cx + chipW / 2 - 2.5,
      top: top + chipH / 2,
      width: 5,
      height: (total - chipH) * conn,
      background: MINT,
      borderRadius: 3
    }
  }), chips.map((c, i) => {
    const p = ease(lt, 0.2 + i * 0.2, 0.5);
    const y = top + i * (chipH + gap);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: cx,
        top: y,
        width: chipW,
        height: chipH,
        borderRadius: 28,
        background: TEAL,
        color: WHITE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 26px',
        boxSizing: 'border-box',
        fontWeight: 700,
        fontSize: 42,
        lineHeight: 1.12,
        opacity: p,
        transform: `translateY(${(1 - p) * -22}px) scale(${0.92 + 0.08 * p})`,
        boxShadow: '0 18px 40px rgba(3,72,69,0.22)'
      }
    }, c);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 90,
      right: 90,
      top: top + total + 130,
      textAlign: 'center'
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 1.05 + i * 0.1, 20),
      color: TEAL,
      fontWeight: 700,
      fontSize: 70,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  }, fmt(ln, MINT, i)))));
}

/* ── 7 · FRAMED: video+teal, raised box, diagonal-cut corners ─── */
function Framed() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const box = ease(lt, 0.15, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      padding: '0 72px'
    }
  }, /*#__PURE__*/React.createElement(VideoBg, {
    src: VID_T7,
    start: 0,
    end: 3.003,
    speed: 0.6256,
    scale: 1.24,
    posY: 24,
    op: 1,
    overlay: tealOverlay
  }), RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 72,
      right: 72,
      top: 380,
      border: `3px solid ${MINT}`,
      borderRadius: '90px 0 90px 0',
      padding: '90px 76px',
      boxSizing: 'border-box',
      opacity: box,
      transform: `scale(${0.95 + 0.05 * box})`,
      transformOrigin: 'center top',
      background: 'rgba(1,32,31,0.5)'
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.4 + i * 0.1, 18),
      color: WHITE,
      fontWeight: 700,
      fontSize: 68,
      lineHeight: 1.14,
      letterSpacing: '-0.02em'
    }
  }, fmt(ln, YEL, i))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50
    }
  }), (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.9 + i * 0.09, 14),
      color: 'rgba(255,255,255,0.94)',
      fontWeight: 500,
      fontSize: BODY,
      lineHeight: 1.36
    }
  }, fmt(ln, MINT, i)))));
}

/* ── 8 · CTA on white: heading + spaced block + pill ──────────── */
function CTA() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const bar = ease(lt, 0.75, 0.5);
  const pill = E.easeOutBack ? E.easeOutBack(clamp((lt - 1.5) / 0.7, 0, 1)) : ease(lt, 1.5, 0.6);
  const cta = Array.isArray(sc.cta) ? sc.cta : [sc.cta];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: WHITE,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingLeft: 90,
      paddingRight: 90,
      paddingTop: 600
    }
  }, RUNTIME.showLogo ? /*#__PURE__*/React.createElement(Logo, {
    variant: "dark",
    lt: lt
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 96
    }
  }, (sc.head || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.2 + i * 0.1, 22),
      color: TEAL,
      fontWeight: 700,
      fontSize: 72,
      lineHeight: 1.12,
      letterSpacing: '-0.02em'
    }
  }, fmt(ln, MINT, i)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      marginBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      background: MINT,
      borderRadius: 4,
      transform: `scaleY(${bar})`,
      transformOrigin: 'top'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, (sc.body || []).map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...rise(lt, 0.85 + i * 0.09, 14),
      whiteSpace: 'nowrap',
      color: 'rgba(3,52,50,0.92)',
      fontWeight: 500,
      fontSize: 46,
      lineHeight: 1.44
    }
  }, fmt(ln, TEAL, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'center',
      background: TEAL,
      color: WHITE,
      fontWeight: 700,
      fontSize: 52,
      lineHeight: 1.18,
      textAlign: 'center',
      padding: '44px 70px',
      borderRadius: 999,
      opacity: clamp(pill, 0, 1),
      transform: `scale(${0.7 + 0.3 * clamp(pill, 0, 1.2)})`,
      boxShadow: '0 20px 46px rgba(3,72,69,0.28)',
      maxWidth: 880
    }
  }, cta.map((ln, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, ln))));
}

/* ── Closing over video: big logo + tagline ──────────────────── */
function Closing() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const p = E.easeOutCubic(clamp((lt - 0.3) / 0.9, 0, 1));
  const sweep = clamp((lt - 0.95) / 0.7, 0, 1);
  const tag = ease(lt, 1.25, 0.7);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shell,
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(VideoBg, {
    src: VID_ENC,
    start: 0,
    end: 4.16,
    speed: 1.04,
    scale: 1.24,
    posY: 24,
    op: 0.72,
    overlay: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(1,32,31,0.68) 100%)`
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-white.png",
    alt: "Sudeste Assinaturas",
    style: {
      position: 'relative',
      width: 760,
      height: 'auto',
      opacity: p,
      transform: `translateY(${(1 - p) * 24}px)`,
      filter: 'drop-shadow(0 6px 22px rgba(0,0,0,0.5))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 5,
      width: 300 * sweep,
      background: MINT,
      borderRadius: 3,
      marginTop: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 44,
      color: WHITE,
      fontSize: 50,
      fontWeight: 500,
      textAlign: 'center',
      maxWidth: 820,
      lineHeight: 1.3,
      opacity: tag,
      transform: `translateY(${(1 - tag) * 16}px)`,
      textShadow: '0 2px 16px rgba(0,0,0,0.5)'
    }
  }, fmt(sc.tag || '', YEL)));
}

/* ── root ────────────────────────────────────────────────────── */
const LAYOUTS = {
  hero: HeroVideo,
  leftbar: LeftBar,
  timeline: Timeline,
  center: CenterStack,
  cardup: CardUp,
  chips: Chips,
  framed: Framed,
  cta: CTA,
  closing: Closing
};
function SudesteVideo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  RUNTIME.showLogo = t.showLogo !== false;
  RUNTIME.videoBg = t.videoBg === true;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach(sc => {
    children[sc.name] = LAYOUTS[sc.layout] || CenterStack;
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SceneStage, {
    width: W,
    height: H,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: '#000000',
    transition: "cut"
  }, children), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "V\xEDdeo"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Mostrar logo",
    value: t.showLogo !== false,
    onChange: v => setTweak('showLogo', v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Fundo de v\xEDdeo",
    value: t.videoBg === true,
    onChange: v => setTweak('videoBg', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Edi\xE7\xE3o"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Editor de tempo",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  })));
}
window.SudesteVideo = SudesteVideo;
})();
