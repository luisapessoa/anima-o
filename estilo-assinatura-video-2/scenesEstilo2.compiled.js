import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
/* Estilo Assinaturas 2 — "análise de crédito" — vertical brand video (1080×1920), 8 screens.
   Same animation engine/pattern as the first Estilo film. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
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
const NAVY = '#000051';
const BLUE = '#173ded';
const WHITE = '#ffffff';
const BLACK = '#000000';
const FONT = "'Urbanist', system-ui, sans-serif";
const LOGO_W = 232,
  LOGO_TOP = 248;
const E = Easing;
const RUNTIME = {
  showLogo: true,
  videoBg: true
};
const VID_1 = 'assets/bg-1.mp4';
const VID_3 = 'assets/bg-3.mp4';
const VID_4 = 'assets/bg-4.mp4';
const VID_6 = 'assets/bg-6.mp4';
const VID_8 = 'assets/bg-8.mp4';
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
/* **text** → bold in the same colour */
function fmt(text, weight, key) {
  const parts = String(text).split('**');
  return React.createElement('span', {
    key
  }, parts.map((p, i) => i % 2 === 1 ? React.createElement('span', {
    key: i,
    style: {
      fontWeight: weight || 800
    }
  }, p) : React.createElement(React.Fragment, {
    key: i
  }, p)));
}

/* Background video for the black scenes (Telas 1, 3, 4, 6, 8), per the
   estilo-assinatura-video-1 BgVideo pattern: cover fit, slight scale to
   fill, video opacity ~0.6 over the black backdrop plus a dark gradient
   overlay on top so the white/navy text keeps contrast. Black fallback +
   ready-gated opacity so nothing paints before the first frame decodes. */
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
  return /*#__PURE__*/_jsxDEV(React.Fragment, {
    children: [/*#__PURE__*/_jsxDEV(VideoSprite, {
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
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.30) 45%, rgba(0,0,0,.68) 100%)',
        opacity: ready ? 1 : 0,
        transition: 'opacity .25s ease'
      }
    }, void 0, false)]
  }, void 0, true);
}
function Logo({
  variant,
  lt
}) {
  const p = ease(lt, 0.12, 0.7);
  const src = variant === 'dark' ? 'assets/estilo/opt-logo-dark.png' : 'assets/estilo/opt-logo-white.png';
  return /*#__PURE__*/_jsxDEV("img", {
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
  }, void 0, false);
}
const shell = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  fontFamily: FONT
};

/* ── 1 · BUBBLE: blue speech balloon with a tail, quote inside ── */
function Bubble() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const box = ease(lt, 0.2, 0.6);
  const bx = 100,
    by = 470,
    bw = W - 200;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: BLACK
    },
    children: [/*#__PURE__*/_jsxDEV(BgVideo, {
      src: VID_1,
      start: 0,
      end: 5.5,
      speed: 1
    }, void 0, false), RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: bx,
        top: by,
        width: bw,
        opacity: box,
        transform: `translateY(${(1 - box) * 34}px) scale(${0.96 + 0.04 * box})`,
        transformOrigin: '20% 100%'
      },
      children: [/*#__PURE__*/_jsxDEV("div", {
        style: {
          background: BLUE,
          borderRadius: 46,
          padding: '96px 40px',
          textAlign: 'center'
        },
        children: (sc.body || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
          style: {
            ...rise(lt, 0.5 + i * 0.1, 14),
            color: WHITE,
            fontWeight: 800,
            fontSize: 52,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          },
          children: ln
        }, i, false))
      }, void 0, false), /*#__PURE__*/_jsxDEV("svg", {
        width: "200",
        height: "120",
        style: {
          position: 'absolute',
          left: 130,
          top: '100%',
          marginTop: -44,
          display: 'block'
        },
        children: /*#__PURE__*/_jsxDEV("path", {
          d: "M 0 0 L 200 0 L 88 106 Z",
          fill: BLUE,
          stroke: BLUE,
          strokeWidth: "26",
          strokeLinejoin: "round"
        }, void 0, false)
      }, void 0, false)]
    }, void 0, true)]
  }, void 0, true);
}

/* ── 2 · CAR CARD on white: navy card, car breaking out of the bottom ── */
function CarCard() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const card = ease(lt, 0.2, 0.6);
  const car = ease(lt, 0.9, 0.8);
  const cx = 135,
    cy = 560,
    cw = W - 270,
    ch = 870;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: WHITE
    },
    children: [RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "dark",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: cx,
        top: cy,
        width: cw,
        height: ch,
        background: NAVY,
        borderRadius: 52,
        opacity: card,
        transform: `translateY(${(1 - card) * 34}px) scale(${0.97 + 0.03 * card})`
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: cx + 60,
        width: cw - 120,
        top: cy + 100,
        textAlign: 'center'
      },
      children: [(sc.body || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
        style: {
          ...rise(lt, 0.55 + i * 0.09, 14),
          color: WHITE,
          fontWeight: 400,
          fontSize: 46,
          lineHeight: 1.28
        },
        children: ln
      }, i, false)), /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: 46
        },
        children: (sc.tail || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
          style: {
            ...rise(lt, 1.05 + i * 0.09, 14),
            color: WHITE,
            fontWeight: 800,
            fontSize: 48,
            lineHeight: 1.26,
            letterSpacing: '-0.01em'
          },
          children: ln
        }, i, false))
      }, void 0, false)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("img", {
      src: "assets/estilo/opt-car-taos.png",
      alt: "Volkswagen Taos",
      style: {
        position: 'absolute',
        left: '50%',
        top: cy + ch - 250,
        width: 930,
        height: 'auto',
        transform: `translateX(-50%) translateY(${(1 - car) * 40}px)`,
        opacity: car
      }
    }, void 0, false)]
  }, void 0, true);
}

/* ── 3 · RULES: text framed by two blue horizontal rules (lower third) ── */
function Rules() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const body = sc.body || [];
  const topRule = ease(lt, 0.25, 0.6);
  const botRule = ease(lt, 1.25, 0.6);
  const rTop = 1290,
    lineH = 62,
    gap = 46;
  const rBot = rTop + gap + body.length * lineH + gap;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: BLACK
    },
    children: [/*#__PURE__*/_jsxDEV(BgVideo, {
      src: VID_3,
      start: 0,
      end: 6,
      speed: 1
    }, void 0, false), RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 150,
        top: rTop,
        width: W - 300,
        height: 4,
        background: BLUE,
        transform: `scaleX(${topRule})`,
        transformOrigin: 'center'
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 130,
        right: 130,
        top: rTop + gap,
        textAlign: 'center'
      },
      children: body.map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
        style: {
          ...rise(lt, 0.6 + i * 0.09, 14),
          color: WHITE,
          fontWeight: 400,
          fontSize: 48,
          lineHeight: `${lineH}px`
        },
        children: fmt(ln, 800, i)
      }, i, false))
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 150,
        top: rBot,
        width: W - 300,
        height: 4,
        background: BLUE,
        transform: `scaleX(${botRule})`,
        transformOrigin: 'center'
      }
    }, void 0, false)]
  }, void 0, true);
}

/* ── 4 · VRULE: vertical blue rule dropping into a left-aligned paragraph ── */
function VRule() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const draw = ease(lt, 0.3, 0.9);
  const rTop = 0,
    rH = 430;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: BLACK
    },
    children: [/*#__PURE__*/_jsxDEV(BgVideo, {
      src: VID_4,
      start: 0,
      end: 6.5,
      speed: 1
    }, void 0, false), RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: rTop,
        display: 'flex',
        justifyContent: 'center'
      },
      children: /*#__PURE__*/_jsxDEV("div", {
        style: {
          position: 'relative',
          textAlign: 'left'
        },
        children: [/*#__PURE__*/_jsxDEV("div", {
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: 5,
            height: rH,
            background: BLUE,
            transform: `scaleY(${draw})`,
            transformOrigin: 'top'
          }
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          style: {
            paddingTop: rH + 60
          },
          children: (sc.body || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
            style: {
              ...rise(lt, 0.85 + i * 0.09, 16),
              color: WHITE,
              fontWeight: 400,
              fontSize: 52,
              lineHeight: 1.28,
              whiteSpace: 'nowrap'
            },
            children: fmt(ln, 800, i)
          }, i, false))
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false)]
  }, void 0, true);
}

/* ── 5 · STARS LIST on navy: 3D stars balloon + heading + dotted list ── */
function StarsList() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const items = sc.items || [];
  const img = ease(lt, 0.2, 0.7);
  const conn = ease(lt, 1.25, 0.8);
  const listTop = 670,
    lineH = 60,
    gapRow = 96,
    GW = 790,
    GTOP = 380;
  const offsets = [];
  let acc = 0;
  items.forEach(it => {
    offsets.push(acc);
    acc += (Array.isArray(it) ? it.length : 1) * lineH + gapRow;
  });
  const listSpan = offsets[offsets.length - 1] || 0;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: NAVY
    },
    children: [RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GTOP + 40,
        width: GW,
        transform: 'translateX(-46%)'
      },
      children: [/*#__PURE__*/_jsxDEV("img", {
        src: "assets/estilo/opt-stars-bubble.png",
        alt: "",
        style: {
          position: 'absolute',
          left: 0,
          top: 60,
          width: 520,
          height: 'auto',
          opacity: img,
          transform: `translateY(${(1 - img) * -26}px) scale(${0.94 + 0.06 * img})`
        }
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 410
        },
        children: (sc.head || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
          style: {
            ...rise(lt, 0.7 + i * 0.09, 16),
            color: WHITE,
            fontWeight: 800,
            fontSize: 54,
            lineHeight: 1.16,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          },
          children: ln
        }, i, false))
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        style: {
          position: 'absolute',
          left: 40,
          top: listTop + 34,
          width: 4,
          height: listSpan * conn,
          background: BLUE
        }
      }, void 0, false), items.map((it, i) => {
        const p = ease(lt, 1.3 + i * 0.18, 0.55);
        const y = listTop + offsets[i];
        return /*#__PURE__*/_jsxDEV(React.Fragment, {
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              position: 'absolute',
              left: 30,
              top: y + 22,
              width: 24,
              height: 24,
              borderRadius: 999,
              background: BLUE,
              opacity: p,
              transform: `scale(${0.6 + 0.4 * p})`
            }
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            style: {
              position: 'absolute',
              left: 100,
              right: 0,
              top: y,
              ...rise(lt, 1.3 + i * 0.18, 14)
            },
            children: (Array.isArray(it) ? it : [it]).map((ln, j) => /*#__PURE__*/_jsxDEV("div", {
              style: {
                color: WHITE,
                fontWeight: 400,
                fontSize: 48,
                lineHeight: `${lineH}px`,
                whiteSpace: 'nowrap'
              },
              children: ln
            }, j, false))
          }, void 0, false)]
        }, i, true);
      })]
    }, void 0, true)]
  }, void 0, true);
}

/* ── 6 · WHITE CARD: big white panel anchored to the bottom of a black screen ── */
function WhiteCard() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const card = ease(lt, 0.2, 0.65);
  const cTop = 1250;
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: BLACK
    },
    children: [/*#__PURE__*/_jsxDEV(BgVideo, {
      src: VID_6,
      start: 0,
      end: 6,
      speed: 1
    }, void 0, false), RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: cTop,
        width: W,
        height: H - cTop,
        background: WHITE,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        opacity: card,
        transform: `translateY(${(1 - card) * 60}px)`
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 150,
        right: 130,
        top: cTop + 170
      },
      children: [(sc.body || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
        style: {
          ...rise(lt, 0.6 + i * 0.09, 14),
          color: NAVY,
          fontWeight: 400,
          fontSize: 48,
          lineHeight: 1.28
        },
        children: ln
      }, i, false)), /*#__PURE__*/_jsxDEV("div", {
        style: {
          marginTop: 56
        },
        children: (sc.tail || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
          style: {
            ...rise(lt, 1.15 + i * 0.09, 14),
            color: NAVY,
            fontWeight: 800,
            fontSize: 50,
            lineHeight: 1.24,
            letterSpacing: '-0.01em'
          },
          children: ln
        }, i, false))
      }, void 0, false)]
    }, void 0, true)]
  }, void 0, true);
}

/* ── 7 · NIVUS CARD on navy: white card, car below, closing line ── */
function NivusCard() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const card = ease(lt, 0.2, 0.6);
  const car = ease(lt, 0.85, 0.8);
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: NAVY
    },
    children: [RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 100,
        right: 100,
        top: 540,
        background: WHITE,
        borderRadius: 44,
        padding: '76px 56px',
        textAlign: 'center',
        opacity: card,
        transform: `translateY(${(1 - card) * 34}px) scale(${0.97 + 0.03 * card})`
      },
      children: (sc.body || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
        style: {
          ...rise(lt, 0.55 + i * 0.09, 14),
          color: NAVY,
          fontWeight: 400,
          fontSize: 46,
          lineHeight: 1.3
        },
        children: fmt(ln, 800, i)
      }, i, false))
    }, void 0, false), /*#__PURE__*/_jsxDEV("img", {
      src: "assets/estilo/opt-car-nivus.png",
      alt: "Volkswagen Nivus",
      style: {
        position: 'absolute',
        left: '50%',
        top: 925,
        width: 1000,
        height: 'auto',
        transform: `translateX(-50%) translateY(${(1 - car) * 40}px)`,
        opacity: car
      }
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      style: {
        position: 'absolute',
        left: 130,
        right: 130,
        top: 1520,
        textAlign: 'center'
      },
      children: (sc.tail || []).map((ln, i) => /*#__PURE__*/_jsxDEV("div", {
        style: {
          ...rise(lt, 1.35 + i * 0.09, 14),
          color: WHITE,
          fontWeight: 400,
          fontSize: 46,
          lineHeight: 1.3
        },
        children: ln
      }, i, false))
    }, void 0, false)]
  }, void 0, true);
}

/* ── 8 · FINAL: centred bold question, each line underlined in blue ── */
function Final() {
  const s = useScene();
  const lt = s.localTime;
  const sc = s.scene;
  const lines = sc.body || [];
  return /*#__PURE__*/_jsxDEV("div", {
    style: {
      ...shell,
      background: BLACK,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 470
    },
    children: [/*#__PURE__*/_jsxDEV(BgVideo, {
      src: VID_8,
      start: 0,
      end: 4.5,
      speed: 1
    }, void 0, false), RUNTIME.showLogo ? /*#__PURE__*/_jsxDEV(Logo, {
      variant: "white",
      lt: lt
    }, void 0, false) : null, /*#__PURE__*/_jsxDEV("div", {
      style: {
        ...groupIn(lt, 'up'),
        textAlign: 'center'
      },
      children: lines.map((ln, i) => {
        const ul = ease(lt, 0.55 + i * 0.18, 0.6);
        return /*#__PURE__*/_jsxDEV("div", {
          style: {
            position: 'relative',
            display: 'block',
            marginBottom: 10
          },
          children: /*#__PURE__*/_jsxDEV("span", {
            style: {
              ...rise(lt, 0.2 + i * 0.1, 18),
              display: 'inline-block',
              position: 'relative',
              color: WHITE,
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1.18,
              letterSpacing: '-0.02em'
            },
            children: [ln, /*#__PURE__*/_jsxDEV("span", {
              style: {
                position: 'absolute',
                left: 0,
                bottom: -6,
                height: 6,
                width: `${ul * 100}%`,
                background: BLUE,
                borderRadius: 3
              }
            }, void 0, false)]
          }, void 0, true)
        }, i, false);
      })
    }, void 0, false)]
  }, void 0, true);
}
const LAYOUTS = {
  bubble: Bubble,
  carcard: CarCard,
  rules: Rules,
  vrule: VRule,
  starslist: StarsList,
  whitecard: WhiteCard,
  nivuscard: NivusCard,
  final: Final
};
const PRELOAD = ['opt-logo-white.png', 'opt-logo-dark.png', 'opt-stars-bubble.png', 'opt-car-taos.png', 'opt-car-nivus.png'].map(f => 'assets/estilo/' + f);
function EstiloVideo2() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => {
    PRELOAD.forEach(src => {
      const im = new Image();
      im.src = src;
      if (im.decode) im.decode().catch(() => {});
    });
  }, []);
  RUNTIME.showLogo = t.showLogo !== false;
  const scenes = JSON.parse(window.OM_SCENES);
  const children = {};
  scenes.forEach(sc => {
    children[sc.name] = LAYOUTS[sc.layout] || Rules;
  });
  return /*#__PURE__*/_jsxDEV(React.Fragment, {
    children: [/*#__PURE__*/_jsxDEV(SceneStage, {
      width: W,
      height: H,
      scenes: window.OM_SCENES,
      playback: window.OM_PLAYBACK,
      bg: BLACK,
      transition: "cut",
      children: children
    }, void 0, false), /*#__PURE__*/_jsxDEV(TweaksPanel, {
      children: [/*#__PURE__*/_jsxDEV(TweakSection, {
        label: "Vídeo"
      }, void 0, false), /*#__PURE__*/_jsxDEV(TweakToggle, {
        label: "Mostrar logo",
        value: t.showLogo !== false,
        onChange: v => setTweak('showLogo', v)
      }, void 0, false), /*#__PURE__*/_jsxDEV(TweakSection, {
        label: "Edição"
      }, void 0, false), /*#__PURE__*/_jsxDEV(TweakToggle, {
        label: "Editor de tempo",
        value: t.motionEditor,
        onChange: v => setTweak('motionEditor', v)
      }, void 0, false)]
    }, void 0, true)]
  }, void 0, true);
}
window.EstiloVideo2 = EstiloVideo2;
