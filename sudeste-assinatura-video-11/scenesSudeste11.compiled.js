/* Sudeste Assinatura — VÍDEO 11 (1080×1920). "Quem teve a ideia de assinar um carro?" — linha do tempo.
   Uma linha contínua atravessa as telas: sai sempre pela direita e a tela seguinte entra empurrando (push).
   1 preta (vídeo) · 2 menta (Havaí + EUA) · 3 preta (vídeo, montadoras) · 4 verde escuro (Brasil) · 5 verde escuro (2020 + carros) · 6 preta (vídeo) */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _VID_DUR;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useScene = window.useScene;
var SceneStage = window.SceneStage;
var Easing = window.Easing;
var clamp = window.clamp;
var useTweaks = window.useTweaks;
var TweaksPanel = window.TweaksPanel;
var TweakSection = window.TweakSection;
var TweakToggle = window.TweakToggle;
var VideoSprite = window.VideoSprite;

var W = 1080,
    H = 1920;
var VID_A = 'assets/videos/videoA.mp4',
    VID_B = 'assets/videos/videoB.mp4',
    VID_C = 'assets/videos/videoC.mp4';
var VID_DUR = (_VID_DUR = {}, _defineProperty(_VID_DUR, VID_A, 6.5), _defineProperty(_VID_DUR, VID_B, 7.5), _defineProperty(_VID_DUR, VID_C, 7.2), _VID_DUR);
var BLACK = '#000000',
    TEAL = '#034845',
    MINT = '#00d1b2',
    PALE = '#c6f6d6',
    WHITE = '#ffffff';
var FONT = "'DM Sans', system-ui, sans-serif";
var LOGO_W = 640,
    LOGO_TOP = 200,
    PUSH = 0.9,
    HEAD = 0.05;
var E = Easing;
var RT = { showLogo: true, scenes: [] };

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function easeIO(lt, delay, d) {
  return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function pop(lt, delay, d) {
  var x = clamp((lt - delay) / (d || 0.6), 0, 1);return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  var p = ease(lt, delay, d);return { opacity: p, transform: 'translateY(' + (1 - p) * (px == null ? 22 : px) + 'px)' };
}
function rich(text, accent, w, italic) {
  return String(text).split('**').map(function (p, i) {
    return i % 2 === 1 ? React.createElement(
      'span',
      { key: i, style: { color: accent, fontWeight: w || 700, fontStyle: italic ? 'italic' : 'normal' } },
      p
    ) : React.createElement(
      React.Fragment,
      { key: i },
      p
    );
  });
}
function Lines(_ref) {
  var list = _ref.list;
  var lt = _ref.lt;
  var delay = _ref.delay;
  var step = _ref.step;
  var style = _ref.style;
  var accent = _ref.accent;
  var w = _ref.w;
  var italic = _ref.italic;

  return (list || []).map(function (ln, i) {
    return React.createElement(
      'div',
      { key: i, style: _extends({}, rise(lt, (delay || 0) + i * (step || 0.08), 16), { whiteSpace: 'nowrap' }, style) },
      rich(ln, accent, w, italic)
    );
  });
}
var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* vídeo de fundo — fade-in só quando o <video> já decodificou o 1º frame,
   pra não piscar preto/frame velho; VideoSprite (animations-v2.jsx) ancora
   o início no momento em que a cena monta, então start é sempre 0. */
function BgVideo(_ref2) {
  var src = _ref2.src;

  var _React$useState = React.useState(false);

  var _React$useState2 = _slicedToArray(_React$useState, 2);

  var ready = _React$useState2[0];
  var setReady = _React$useState2[1];

  var readyRef = React.useRef(false);
  React.useEffect(function () {
    var t = setTimeout(function () {
      if (!readyRef.current) {
        readyRef.current = true;setReady(true);
      }
    }, 1200);
    return function () {
      return clearTimeout(t);
    };
  }, []);
  var markReady = function markReady() {
    if (!readyRef.current) {
      readyRef.current = true;setReady(true);
    }
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: BLACK } }),
    React.createElement(VideoSprite, { src: src, start: 0, end: VID_DUR[src] || 6, onLoadedData: markReady,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' } })
  );
}
var BOLD = function BOLD(fs, lh) {
  return { fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.03em' };
};
var REG = function REG(fs, lh) {
  return { fontWeight: 400, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' };
};
var LIGHT = function LIGHT(fs, lh) {
  return { fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.045em' };
};
var THEMES = {
  black: { bg: BLACK, ink: WHITE, line: PALE, acc: PALE, logo: 'assets/logo-white.png' },
  pale: { bg: PALE, ink: TEAL, line: TEAL, acc: TEAL, logo: 'assets/logo-dark.png' },
  teal: { bg: TEAL, ink: WHITE, line: PALE, acc: PALE, logo: 'assets/logo-white.png' }
};

/* medição de path (getPointAtLength) */
var PATHS = {};
function measure(d) {
  if (PATHS[d]) return PATHS[d];
  var svg = document.getElementById('__measure_svg');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = '__measure_svg';svg.setAttribute('width', '0');svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';
    document.body.appendChild(svg);
  }
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);svg.appendChild(p);
  var len = p.getTotalLength();
  var at = function at(f) {
    var q = p.getPointAtLength(clamp(f, 0, 1) * len);return { x: q.x, y: q.y };
  };
  var nc = {};
  var near = function near(x, y) {
    var k = x + ',' + y;if (nc[k] != null) return nc[k];var best = 0,
        bd = 1e9;for (var i = 0; i <= 600; i++) {
      var q = at(i / 600);var dd = Math.pow(q.x - x, 2) + Math.pow(q.y - y, 2);if (dd < bd) {
        bd = dd;best = i / 600;
      }
    }return nc[k] = best;
  };
  return PATHS[d] = { len: len, at: at, near: near };
}
/* progresso da linha por keyframes [[t, frac], …] */
function track(lt, keys) {
  if (lt <= keys[0][0]) return keys[0][1];
  for (var i = 1; i < keys.length; i++) {
    var _keys = _slicedToArray(keys[i - 1], 2);

    var t0 = _keys[0];
    var f0 = _keys[1];
    var _keys$i = _slicedToArray(keys[i], 2);

    var t1 = _keys$i[0];
    var f1 = _keys$i[1];

    if (lt <= t1) return f0 + (f1 - f0) * E.easeInOutCubic((lt - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
}
function Line(_ref3) {
  var d = _ref3.d;
  var f = _ref3.f;
  var color = _ref3.color;
  var dots = _ref3.dots;
  var lt = _ref3.lt;
  var head = _ref3.head;

  var m = measure(d);
  var tip = m.at(f);
  return React.createElement(
    'svg',
    { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, style: { position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' } },
    React.createElement('path', { d: d, fill: 'none', stroke: color, strokeWidth: '4', strokeLinecap: 'round', pathLength: '1', strokeDasharray: '1', strokeDashoffset: 1 - f }),
    (dots || []).map(function (dt, i) {
      var fr = m.near(dt[0], dt[1]);var q = m.at(fr);
      var s = f >= fr ? pop(lt, dt[2] || 0, 0.6) : 0;
      return React.createElement('circle', { key: i, cx: q.x, cy: q.y, r: 20 * s, fill: color });
    }),
    head && f > 0.001 && f < 0.999 ? React.createElement('circle', { cx: tip.x, cy: tip.y, r: '9', fill: color }) : null
  );
}
/* push: a cena atual sai para a esquerda, a próxima (cor + começo da linha) entra pela direita */
function usePush(lt, dur) {
  return easeIO(lt, dur - PUSH, PUSH);
}
var GRADIENT_OVERLAY = 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.15) 100%)';
var GRADIENT_OVERLAY_B = 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.58) 45%, rgba(0,0,0,0.4) 100%)';
function NextIn(_ref4) {
  var p = _ref4.p;

  var s = useScene();var sc = s.scene;
  var i = RT.scenes.findIndex(function (x) {
    return x.name === sc.name;
  });
  var nx = RT.scenes[i + 1];
  if (!nx || p <= 0) return null;
  var th = THEMES[nx.theme] || THEMES.black;
  return React.createElement(
    'div',
    { style: { position: 'absolute', inset: 0, background: th.bg, transform: 'translateX(' + (1 - p) * W + 'px)', zIndex: 30, overflow: 'hidden' } },
    nx.video ? React.createElement(BgVideo, { src: nx.video }) : null,
    nx.video ? React.createElement('div', { style: { position: 'absolute', inset: 0, background: nx.video === VID_B ? GRADIENT_OVERLAY_B : GRADIENT_OVERLAY } }) : null,
    nx.path && !nx.fresh ? React.createElement(Line, { d: nx.path, f: HEAD * clamp((p - 0.5) / 0.5, 0, 1), color: th.line, lt: 0, head: true }) : null
  );
}
function Frame(_ref5) {
  var theme = _ref5.theme;
  var lt = _ref5.lt;
  var dur = _ref5.dur;
  var children = _ref5.children;
  var last = _ref5.last;
  var video = _ref5.video;
  var overlay = _ref5.overlay;

  var th = THEMES[theme] || THEMES.black;
  var p = last ? 0 : usePush(lt, dur);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: th.bg }) },
    React.createElement(
      'div',
      { style: { position: 'absolute', inset: 0, transform: 'translateX(' + -p * W + 'px)' } },
      video ? React.createElement(BgVideo, { src: video }) : null,
      video && overlay ? React.createElement('div', { style: { position: 'absolute', inset: 0, background: overlay } }) : null,
      RT.showLogo ? React.createElement('img', { src: th.logo, alt: 'Sudeste Assinaturas', decoding: 'sync', loading: 'eager',
        style: { position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)', width: LOGO_W, height: 'auto', zIndex: 6 } }) : null,
      children
    ),
    React.createElement(NextIn, { p: p })
  );
}
/* tópico: rótulo + parágrafo */
var ICONS = {
  palm: 'M25 44 C27 34 27 24 24 15 M24 15 C18 9 10 9 5 14 M24 15 C30 9 38 9 43 14 M24 15 C19 16 13 21 11 28 M24 15 C29 16 35 21 37 28 M14 44 H36',
  flag: 'M12 44 V5 M12 8 C20 4 28 12 38 8 V26 C28 30 20 22 12 26',
  pin: 'M24 44 C24 44 38 30 38 19 A14 14 0 0 0 10 19 C10 30 24 44 24 44 Z M24 14 A5 5 0 1 1 24 24 A5 5 0 1 1 24 14',
  factory: 'M6 42 V22 L16 28 V22 L26 28 V22 L36 28 V8 H42 V42 Z M13 36 H17 M23 36 H27 M33 36 H37',
  calendar: 'M8 12 H40 V42 H8 Z M8 20 H40 M16 6 V16 M32 6 V16 M17 31 L22 36 L31 27'
};
function Topic(_ref6) {
  var lt = _ref6.lt;
  var delay = _ref6.delay;
  var tp = _ref6.tp;
  var th = _ref6.th;

  var right = tp.align === 'right';
  var ip = easeIO(lt, delay - 0.1, 0.8);
  var bs = tp.bodySize || [48, 60];
  return React.createElement(
    'div',
    { style: _extends({ position: 'absolute', textAlign: right ? 'right' : 'left', display: 'flex', flexDirection: 'column', alignItems: right ? 'flex-end' : 'flex-start' }, tp.pos) },
    tp.icon ? React.createElement(
      'svg',
      { width: '64', height: '64', viewBox: '0 0 48 48', style: { marginBottom: 18, transform: 'scale(' + pop(lt, delay - 0.1, 0.6) + ')' } },
      React.createElement('path', { d: ICONS[tp.icon], fill: 'none', stroke: th.acc, strokeWidth: '2.6', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: '1', strokeDasharray: '1', strokeDashoffset: 1 - ip })
    ) : null,
    Array.isArray(tp.label) ? React.createElement(Lines, { list: tp.label, lt: lt, delay: delay, step: 0.12, style: _extends({}, LIGHT(150, 144), { color: th.ink }), accent: th.acc, w: 400 }) : React.createElement(
      'div',
      { style: _extends({}, BOLD(68, 74), { color: th.ink }, rise(lt, delay, 20)) },
      tp.label
    ),
    React.createElement(
      'div',
      { style: { marginTop: 24 } },
      React.createElement(Lines, { list: tp.body, lt: lt, delay: delay + 0.2, step: 0.08, style: _extends({}, REG(bs[0], bs[1]), { color: th.ink }), accent: th.acc })
    )
  );
}

/* 1 · preto (vídeo) — editorial: parágrafo pequeno em cima, linha em L, pergunta grande alinhada à direita */
function Cover() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;var th = THEMES.black;
  var v = easeIO(lt, 1.3, 0.5),
      h = easeIO(lt, 1.7, 0.6);
  return React.createElement(
    Frame,
    { theme: 'black', lt: lt, dur: sc.dur, video: VID_A, overlay: 'rgba(0,0,0,0.58)' },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 370, display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { position: 'relative', display: 'flex', flexDirection: 'column', color: WHITE } },
        React.createElement(
          'div',
          null,
          React.createElement(Lines, { list: sc.intro, lt: lt, delay: 0.3, step: 0.1, style: LIGHT(66, 76), accent: WHITE, w: 700 })
        ),
        React.createElement('div', { style: { position: 'absolute', left: 30, top: 170, width: 3, height: 82, background: PALE, transform: 'scaleY(' + v + ')', transformOrigin: 'top' } }),
        React.createElement('div', { style: { position: 'absolute', left: 30, top: 249, width: 180, height: 3, background: PALE, transform: 'scaleX(' + h + ')', transformOrigin: 'left' } }),
        React.createElement(
          'div',
          { style: { marginTop: 40, paddingLeft: 240, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          React.createElement(Lines, { list: sc.title, lt: lt, delay: 2.0, step: 0.16, style: LIGHT(116, 112), accent: PALE, w: 400, italic: true })
        )
      )
    )
  );
}

/* timeline genérica: linha + tópicos */
function Timeline() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;var th = THEMES[sc.theme];
  var m = measure(sc.path);
  var keys = React.useMemo(function () {
    return sc.keys.map(function (_ref7) {
      var _ref72 = _slicedToArray(_ref7, 2);

      var t = _ref72[0];
      var v = _ref72[1];
      return [t, typeof v === 'string' ? m.near(sc.dots[+v.slice(1)][0], sc.dots[+v.slice(1)][1]) + 0.004 : v];
    });
  }, [sc.path, JSON.stringify(sc.keys)]);
  var f = track(lt, keys);
  return React.createElement(
    Frame,
    { theme: sc.theme, lt: lt, dur: sc.dur, last: sc.last, video: sc.video, overlay: sc.video === VID_B ? GRADIENT_OVERLAY_B : GRADIENT_OVERLAY },
    React.createElement(Line, { d: sc.path, f: f, color: th.line, dots: sc.dots, lt: lt, head: true }),
    (sc.topics || []).map(function (tp, i) {
      return React.createElement(Topic, { key: i, lt: lt, delay: tp.at, tp: tp, th: th });
    }),
    sc.big ? React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: sc.big.top, color: th.ink, display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', alignItems: sc.big.center ? 'center' : 'flex-start', textAlign: sc.big.center ? 'center' : 'left' } },
        React.createElement(Lines, { list: sc.big.lines, lt: lt, delay: sc.big.at, step: 0.12, style: LIGHT(sc.big.size[0], sc.big.size[1]), accent: th.acc, w: 500 }),
        sc.big.sub ? React.createElement(
          'div',
          { style: { marginTop: 36 } },
          React.createElement(Lines, { list: sc.big.sub, lt: lt, delay: sc.big.at + 0.6, step: 0.1, style: sc.big.subBold ? _extends({}, BOLD(sc.big.subSize[0], sc.big.subSize[1]), { color: PALE }) : REG(sc.big.subSize[0], sc.big.subSize[1]), accent: th.acc })
        ) : null
      )
    ) : null,
    sc.hero ? React.createElement(Hero, { lt: lt, h: sc.hero, th: th }) : null,
    sc.cars ? React.createElement(Cars, { lt: lt, at: sc.cars.at, top: sc.cars.top }) : null
  );
}

function Hero(_ref8) {
  var lt = _ref8.lt;
  var h = _ref8.h;
  var th = _ref8.th;

  var r = easeIO(lt, h.at + 0.3, 0.8);
  return React.createElement(
    'div',
    { style: { position: 'absolute', left: 0, right: 0, top: h.top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: th.ink } },
    React.createElement(
      'div',
      { style: _extends({}, LIGHT(100, 104), rise(lt, h.at, 20)) },
      h.pre
    ),
    React.createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 36, marginTop: 60 } },
      React.createElement('div', { style: { width: 150, height: 3, background: PALE, transform: 'scaleX(' + r + ')', transformOrigin: 'right' } }),
      React.createElement(
        'div',
        { style: _extends({}, LIGHT(210, 200), { color: PALE, fontWeight: 400 }, rise(lt, h.at + 0.15, 30)) },
        h.year
      ),
      React.createElement('div', { style: { width: 150, height: 3, background: PALE, transform: 'scaleX(' + r + ')', transformOrigin: 'left' } })
    ),
    React.createElement(
      'div',
      { style: { marginTop: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      React.createElement(Lines, { list: h.body, lt: lt, delay: h.at + 0.5, step: 0.08, style: REG(50, 64), accent: WHITE })
    )
  );
}
/* Saveiro espelhada; placa e "ROBUST" re-espelhadas para continuarem legíveis (coords no PNG 1920×960) */
var PATCHES = [[484, 618, 176, 76], [1196, 618, 132, 38]];
function FlippedCar(_ref9) {
  var src = _ref9.src;
  var w = _ref9.w;
  var style = _ref9.style;

  var k = w / 1920;
  return React.createElement(
    'div',
    { style: _extends({}, style, { width: w, height: 960 * k }) },
    React.createElement(
      'div',
      { style: { position: 'absolute', inset: 0, transform: 'scaleX(-1)' } },
      React.createElement('img', { src: src, alt: '', style: { position: 'absolute', left: 0, top: 0, width: w, height: 'auto' } }),
      PATCHES.map(function (_ref10, i) {
        var _ref102 = _slicedToArray(_ref10, 4);

        var x = _ref102[0];
        var y = _ref102[1];
        var pw = _ref102[2];
        var ph = _ref102[3];
        return React.createElement(
          'div',
          { key: i, style: { position: 'absolute', left: x * k, top: y * k, width: pw * k, height: ph * k, overflow: 'hidden' } },
          React.createElement(
            'div',
            { style: { position: 'absolute', inset: 0, transform: 'scaleX(-1)' } },
            React.createElement('img', { src: src, alt: '', style: { position: 'absolute', left: -x * k, top: -y * k, width: w, height: 'auto' } })
          )
        );
      })
    )
  );
}
/* 3 carros VW: o do meio na frente, os dois laterais atrás */
function Cars(_ref11) {
  var lt = _ref11.lt;
  var at = _ref11.at;
  var top = _ref11.top;

  var list = [{ src: 'assets/carro-tcross.webp', x: -220, y: -70, w: 760, z: 1, d: 0.35 }, { src: 'assets/carro-saveiro.webp', x: 220, y: -70, w: 760, z: 1, d: 0.6, flip: true }, { src: 'assets/carro-tera-preto.webp', x: 0, y: 90, w: 1100, z: 2, d: 0 }];
  return list.map(function (c, i) {
    var p = ease(lt, at + c.d, 0.9);
    var st = { position: 'absolute', left: W / 2 - c.w / 2 + c.x, top: top + c.y, zIndex: c.z, opacity: p, transform: 'translateY(' + (1 - p) * 60 + 'px)' };
    if (c.flip) return React.createElement(FlippedCar, { key: i, src: c.src, w: c.w, style: st });
    return React.createElement('img', { key: i, src: c.src, alt: '', style: _extends({}, st, { width: c.w, height: 'auto' }) });
  });
}

var LAYOUTS = { cover: Cover, timeline: Timeline };

function SudesteVideo11() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  RT.showLogo = t.showLogo !== false;
  var scenes = React.useMemo(function () {
    return JSON.parse(window.OM_SCENES);
  }, [window.OM_SCENES]);
  RT.scenes = scenes;
  React.useEffect(function () {
    ['assets/logo-dark.png', 'assets/logo-white.png', 'assets/carro-tcross.webp', 'assets/carro-saveiro.webp', 'assets/carro-tera-preto.webp'].forEach(function (src) {
      var im = new Image();im.src = src;if (im.decode) im.decode()['catch'](function () {});
    });
  }, []);
  var children = {};
  scenes.forEach(function (sc) {
    children[sc.name] = LAYOUTS[sc.layout] || Timeline;
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      SceneStage,
      { width: W, height: H, scenes: window.OM_SCENES, playback: window.OM_PLAYBACK, bg: BLACK, transition: 'cut' },
      children
    ),
    React.createElement(
      TweaksPanel,
      null,
      React.createElement(TweakSection, { label: 'Vídeo' }),
      React.createElement(TweakToggle, { label: 'Mostrar logo', value: t.showLogo !== false, onChange: function (v) {
          return setTweak('showLogo', v);
        } }),
      React.createElement(TweakSection, { label: 'Edição' }),
      React.createElement(TweakToggle, { label: 'Editor de tempo', value: t.motionEditor, onChange: function (v) {
          return setTweak('motionEditor', v);
        } })
    )
  );
}
window.SudesteVideo11 = SudesteVideo11;
/* vídeo da próxima tela já tocando durante o push — sem isso, a tela
   preta deste painel ficava visível por um instante na transição. */
