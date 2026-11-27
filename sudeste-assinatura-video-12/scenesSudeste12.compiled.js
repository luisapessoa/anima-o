/* Sudeste Assinatura — VÍDEO 12 (1080×1920). "Quero assinar um carro… mas não sei qual modelo escolher".
   1 verde (baralho de cards) · 2 neutro (editorial) · 3 verde (chips + carro) · 4 preto (linha → texto à direita) · 5 verde (centralizado com réguas) · 6 preto
   Destaques em amarelo Sudeste. Branco Sudeste = #efefef. Transições: push horizontal. */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var useScene = window.useScene;
var SceneStage = window.SceneStage;
var Easing = window.Easing;
var clamp = window.clamp;
var VideoSprite = window.VideoSprite;
var useTweaks = window.useTweaks;
var TweaksPanel = window.TweaksPanel;
var TweakSection = window.TweakSection;
var TweakToggle = window.TweakToggle;
var TweakRadio = window.TweakRadio;

var W = 1080,
    H = 1920;
var TEAL = '#034845',
    YEL = '#f2ff46',
    WHITE = '#efefef',
    NEUTRAL = '#efeee9',
    BLACK = '#000000';
var FONT = "'DM Sans', system-ui, sans-serif";
var LOGO_W = 640,
    LOGO_TOP = 200,
    PUSH = 0.9;
var E = Easing;
var RT = { showLogo: true, scenes: [], cardAnim: 'carrossel' };

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function easeIO(lt, delay, d) {
  return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function back(lt, delay, d) {
  var x = clamp((lt - delay) / (d || 0.7), 0, 1);var c = 1.5;return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}
function rise(lt, delay, px, d) {
  var p = ease(lt, delay, d);return { opacity: p, transform: 'translateY(' + (1 - p) * (px == null ? 22 : px) + 'px)' };
}
/* **negrito em cor** · ==marca-texto amarelo== */
function rich(text, o) {
  var out = [];var k = 0;
  String(text).split('==').forEach(function (seg, j) {
    if (j % 2 === 1) {
      var m = o.mark == null ? 1 : o.mark;
      out.push(React.createElement(
        'span',
        { key: k++, style: { color: TEAL, fontWeight: o.mw || 500, padding: '0 10px', margin: '0 -4px', backgroundImage: 'linear-gradient(' + YEL + ', ' + YEL + ')', backgroundRepeat: 'no-repeat', backgroundPosition: o.markPos || 'left 58%', backgroundSize: m * 100 + '% ' + (o.markHeight || 78) + '%' } },
        seg
      ));
      return;
    }
    seg.split('**').forEach(function (p, i) {
      return out.push(i % 2 === 1 ? React.createElement(
        'span',
        { key: k++, style: { color: o.accent, fontWeight: o.w || 700, fontStyle: o.italic ? 'italic' : 'normal' } },
        p
      ) : React.createElement(
        React.Fragment,
        { key: k++ },
        p
      ));
    });
  });
  return out;
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
  var markAt = _ref.markAt;
  var mw = _ref.mw;
  var markHeight = _ref.markHeight;
  var markPos = _ref.markPos;

  return (list || []).map(function (ln, i) {
    var d = (delay || 0) + i * (step || 0.08);
    var mark = markAt != null ? easeIO(lt, markAt, 0.4) : easeIO(lt, d + 0.35, 0.6);
    return React.createElement(
      'div',
      { key: i, style: _extends({}, rise(lt, d, 18), { whiteSpace: 'nowrap' }, style) },
      rich(ln, { accent: accent, w: w, italic: italic, mark: mark, mw: mw, markHeight: markHeight, markPos: markPos })
    );
  });
}
var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };
var BOLD = function BOLD(fs, lh) {
  return { fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' };
};
var MED = function MED(fs, lh) {
  return { fontWeight: 500, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' };
};
var REG = function REG(fs, lh) {
  return { fontWeight: 400, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '0em' };
};
var LIGHT = function LIGHT(fs, lh) {
  return { fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.02em' };
};
var THEMES = {
  teal: { bg: TEAL, ink: WHITE, acc: YEL, logo: 'assets/logo-white.png' },
  neutral: { bg: NEUTRAL, ink: TEAL, acc: TEAL, logo: 'assets/logo-dark.png' },
  black: { bg: BLACK, ink: WHITE, acc: YEL, logo: 'assets/logo-white.png' }
};

/* fundo de vídeo opcional (sc.video) — por enquanto as telas 4 e 6 ficam pretas */
function VideoBg(_ref2) {
  var v = _ref2.v;

  if (!v) return null;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(VideoSprite, { src: v.src, start: v.start || 0, end: v.end, style: { position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover' } }),
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.85) 100%)' } })
  );
}
function usePush(lt, dur) {
  return easeIO(lt, dur - PUSH, PUSH);
}
/* transições variadas: push · up · circle · wipe · zoom */
function curStyle(type, p) {
  if (type === 'up') return { transform: 'translateY(' + -p * H * 0.35 + 'px)' };
  if (type === 'circle') return { transform: 'scale(' + (1 + 0.06 * p) + ')' };
  if (type === 'wipe') return { transform: 'translateX(' + -p * 260 + 'px)' };
  if (type === 'zoom') return { transform: 'scale(' + (1 - 0.12 * p) + ')', opacity: 1 - p };
  return { transform: 'translateX(' + -p * W + 'px)' };
}
function nextStyle(type, p) {
  if (type === 'up') return { transform: 'translateY(' + (1 - p) * H + 'px)', borderRadius: (1 - p) * 90 + 'px ' + (1 - p) * 90 + 'px 0 0' };
  if (type === 'circle') return { clipPath: 'circle(' + p * 120 + '% at 50% 62%)' };
  if (type === 'wipe') return { clipPath: 'inset(0 ' + (1 - p) * 100 + '% 0 0)' };
  if (type === 'zoom') return { opacity: p, transform: 'scale(' + (1.08 - 0.08 * p) + ')' };
  return { transform: 'translateX(' + (1 - p) * W + 'px)' };
}
function NextIn(_ref3) {
  var p = _ref3.p;
  var type = _ref3.type;

  var s = useScene();var sc = s.scene;
  var i = RT.scenes.findIndex(function (x) {
    return x.name === sc.name;
  });
  var nx = RT.scenes[i + 1];
  if (!nx || p <= 0) return null;
  var th = THEMES[nx.theme] || THEMES.teal;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', inset: 0, background: th.bg, zIndex: 30, overflow: 'hidden' }, nextStyle(type, p)) },
      nx.video ? React.createElement(VideoBg, { v: nx.video }) : null
    ),
    type === 'wipe' && p < 1 ? React.createElement('div', { style: { position: 'absolute', top: 0, bottom: 0, left: p * W - 18, width: 18, background: YEL, zIndex: 31 } }) : null
  );
}
function Frame(_ref4) {
  var theme = _ref4.theme;
  var lt = _ref4.lt;
  var dur = _ref4.dur;
  var children = _ref4.children;
  var last = _ref4.last;
  var video = _ref4.video;

  var th = THEMES[theme] || THEMES.teal;
  var sc = useScene().scene;
  var type = sc.trans || 'push';
  var p = last ? 0 : usePush(lt, dur);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: th.bg }) },
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', inset: 0 }, curStyle(type, p)) },
      video ? React.createElement(VideoBg, { v: video }) : null,
      RT.showLogo ? React.createElement('img', { src: th.logo, alt: 'Sudeste Assinaturas', decoding: 'sync', loading: 'eager',
        style: { position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)', width: LOGO_W, height: 'auto', zIndex: 6 } }) : null,
      children
    ),
    React.createElement(NextIn, { p: p, type: type })
  );
}

/* ── 1 · verde: título grande + baralho de cards ──────────────── */
var CARS = [{ src: 'assets/s12-nivus.webp', name: 'Nivus', tag: 'SUV Coupé', feat: ['Design esportivo e', 'motor 200 TSI turbo'] }, { src: 'assets/s12-polo.webp', name: 'Polo', tag: 'Hatch', feat: ['Compacto, econômico', 'e ágil na cidade'] }, { src: 'assets/s12-saveiro.webp', name: 'Saveiro', tag: 'Picape', feat: ['Caçamba ampla para', 'trabalho e lazer'] }, { src: 'assets/s12-tcross.webp', name: 'T-Cross', tag: 'SUV', feat: ['Espaço interno e', 'porta-malas generoso'] }, { src: 'assets/s12-tera.webp', name: 'Tera', tag: 'SUV compacto', feat: ['O SUV mais novo', 'da Volkswagen'] }];
var CARD_W = 560,
    CARD_H = 760;
function CarCard(_ref5) {
  var c = _ref5.c;
  var i = _ref5.i;

  return React.createElement(
    'div',
    { style: { width: CARD_W, height: CARD_H, borderRadius: 52, background: WHITE, position: 'relative', overflow: 'hidden' } },
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: 370, background: 'linear-gradient(180deg, #dde6e2 0%, #efefef 100%)' } }),
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', top: 26, right: 28, padding: '12px 22px 6px', borderRadius: '22px 0 22px 0', background: TEAL, color: WHITE }, MED(26, 32), { letterSpacing: '0.02em' }) },
      c.tag
    ),
    React.createElement('img', { src: c.src, alt: c.name, style: { position: 'absolute', left: -80, top: 50, width: 720, height: 'auto' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 30, right: 30, top: 428, textAlign: 'center' } },
      React.createElement(
        'div',
        { style: _extends({}, BOLD(70, 72), { color: TEAL }) },
        c.name
      ),
      React.createElement(
        'div',
        { style: _extends({ marginTop: 2 }, REG(32, 38), { color: '#4b6260' }) },
        c.feat.map(function (f, j) {
          return React.createElement(
            'div',
            { key: j },
            f
          );
        })
      )
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 30, right: 30, bottom: 30, height: 92, display: 'flex', gap: 6 } },
      React.createElement(
        'div',
        { style: _extends({ flex: 1, borderRadius: '46px 0 46px 0', background: YEL, color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }, BOLD(34, 40)) },
        'Assinar'
      ),
      React.createElement(
        'div',
        { style: { width: 92, height: 92, borderRadius: 46, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement(
          'svg',
          { width: '40', height: '40', viewBox: '0 0 24 24' },
          React.createElement('path', { d: 'M5 12 H19 M13 6 L19 12 L13 18', fill: 'none', stroke: YEL, strokeWidth: '2.4', strokeLinecap: 'round', strokeLinejoin: 'round' })
        )
      )
    )
  );
}
function deckPose(mode, i, pos, n) {
  if (mode === 'embaralhar') {
    var _rel = ((i - pos) % n + n) % n;
    if (_rel > n - 1) {
      // carta da frente saindo: desce, vai pro lado e volta para o fundo
      var g = n - _rel;var arc = Math.sin(g * Math.PI);
      var _back = (n - 1) * g;
      return { x: -arc * 620, y: arc * 140 - _back * 34, r: -arc * 14, s: 1 - _back * 0.07, z: g < 0.5 ? 25 : 1, op: 1, shade: g * 0.4 };
    }
    return { x: _rel * 34, y: -_rel * 40, r: _rel * 2.5, s: 1 - _rel * 0.07, z: 20 - Math.round(_rel * 2), op: clamp(3.6 - _rel, 0, 1), shade: Math.min(_rel, 3) * 0.16 };
  }
  var rel = ((i - pos) % n + n) % n;if (rel > n / 2) rel -= n;
  var a = Math.abs(rel);
  return { x: rel * 430, y: a * 50, r: rel * 6, s: 1 - Math.min(a, 2) * 0.2, z: 20 - Math.round(a * 4), op: clamp(2.3 - a, 0, 1), shade: Math.min(a, 2) * 0.22 };
}
function Cover() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var enter = back(lt, 1.0, 0.9);
  var swaps = sc.swaps || [2.2, 3.3, 4.4, 5.5];
  var pos = swaps.reduce(function (a, t0) {
    return a + easeIO(lt, t0, 0.65);
  }, 0);
  var top = sc.cardTop || 930,
      cx = W / 2 - CARD_W / 2;
  return React.createElement(
    Frame,
    { theme: 'teal', lt: lt, dur: sc.dur },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 370, color: WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } },
      React.createElement(Lines, { list: sc.intro, lt: lt, delay: 0.2, step: 0.1, style: REG(70, 84), accent: YEL }),
      React.createElement(
        'div',
        { style: { marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement(Lines, { list: sc.title, lt: lt, delay: 0.6, step: 0.12, style: LIGHT(108, 108), accent: YEL, w: 400, italic: true })
      )
    ),
    CARS.map(function (c, i) {
      var q = deckPose(RT.cardAnim, i, pos, CARS.length);
      var ein = 1 - enter;
      return React.createElement(
        'div',
        { key: i, style: { position: 'absolute', left: cx, top: top, zIndex: q.z, opacity: q.op * clamp(enter * 2, 0, 1),
            transform: 'translate(' + q.x + 'px, ' + (q.y + ein * 260) + 'px) rotate(' + q.r + 'deg) scale(' + q.s * (0.85 + 0.15 * enter) + ')', transformOrigin: '50% 100%',
            boxShadow: '0 30px 60px rgba(0,0,0,0.28)', borderRadius: 52 } },
        React.createElement(CarCard, { c: c, i: i }),
        q.shade > 0 ? React.createElement('div', { style: { position: 'absolute', inset: 0, borderRadius: 52, background: 'rgba(1,40,38,' + q.shade + ')' } }) : null
      );
    })
  );
}

/* ── 2 · neutro: frase grande + L longa + parágrafo ─────────────── */
function Editorial() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var v = easeIO(lt, 1.2, 0.45),
      h = easeIO(lt, 1.6, 0.6);
  return React.createElement(
    Frame,
    { theme: 'neutral', lt: lt, dur: sc.dur },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 190, top: 450, color: TEAL } },
      React.createElement(Lines, { list: sc.small, lt: lt, delay: 0.3, step: 0.1, style: REG(64, 76), accent: TEAL })
    ),
    React.createElement('div', { style: { position: 'absolute', left: 200, top: 710, width: 3, height: 170, background: TEAL, transform: 'scaleY(' + v + ')', transformOrigin: 'top' } }),
    React.createElement('div', { style: { position: 'absolute', left: 200, top: 877, width: 340, height: 3, background: TEAL, transform: 'scaleX(' + h + ')', transformOrigin: 'left' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', right: 90, top: 820, color: TEAL, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' } },
      React.createElement(Lines, { list: sc.big, lt: lt, delay: 1.9, step: 0.12, style: LIGHT(104, 108), accent: TEAL, w: 500, markAt: 2.8 })
    ),
    sc.routines ? React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: sc.routinesTop || 1480, display: 'flex', justifyContent: 'center', gap: 70 } },
      sc.routines.map(function (r, i) {
        var d = 3.3 + i * 0.2,
            p = back(lt, d, 0.6),
            ip = easeIO(lt, d + 0.15, 0.8);
        return React.createElement(
          'div',
          { key: i, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: clamp(p, 0, 1), transform: 'translateY(' + (1 - p) * 40 + 'px)' } },
          React.createElement(
            'div',
            { style: { width: 150, height: 150, borderRadius: '36px 0 36px 0', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(
              'svg',
              { width: '84', height: '84', viewBox: '0 0 48 48' },
              React.createElement('path', { d: RICONS[r.icon], fill: 'none', stroke: YEL, strokeWidth: '2.6', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: '1', strokeDasharray: '1', strokeDashoffset: 1 - ip })
            )
          )
        );
      })
    ) : null
  );
}

var RICONS = {
  city: 'M6 42 H42 M9 42 V18 H19 V42 M19 42 V8 H31 V42 M31 42 V24 H39 V42 M13 24 V26 M13 32 V34 M25 14 V16 M25 22 V24 M25 30 V32 M35 30 V32',
  rural: 'M4 42 C13 32 21 32 29 38 C34 34 39 33 44 36 M12 34 V24 M12 24 C7 24 6 14 12 11 C18 14 17 24 12 24 M36 10 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
  family: 'M12 14 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M36 14 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M4 42 V31 C4 24 20 24 20 31 V34 M28 42 V31 C28 24 44 24 44 31 V34 M24 18 m-4.5 0 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 M18 42 V34 H30 V42'
};
/* ── 3 · verde: chips (círculo + retângulo de cantos opostos) + carro ─── */
var ICONS = {
  gauge: 'M7 33 A17 17 0 0 1 41 33 M11 33 H7 M41 33 H37 M12 21 L15 23.5 M36 21 L33 23.5 M24 16 V20 M24 33 L32 23 M10 40 H38',
  road: 'M6 42 H42 M10 42 V20 L18 15 V42 M18 24 H28 V42 M28 8 H38 V42 M32 14 V16 M32 22 V24 M32 30 V32 M22 30 V32',
  size: 'M8 18 V8 H18 M8 8 L18 18 M40 18 V8 H30 M40 8 L30 18 M8 30 V40 H18 M8 40 L18 30 M40 30 V40 H30 M40 40 L30 30'
};
function Chip(_ref6) {
  var q = _ref6.q;
  var lt = _ref6.lt;
  var at = _ref6.at;

  var p = back(lt, at, 0.8),
      o = ease(lt, at, 0.4);
  var ip = easeIO(lt, at + 0.25, 0.8);
  return React.createElement(
    'div',
    { style: { position: 'absolute', top: q.top, left: 80, display: 'flex', alignItems: 'center', gap: 10, opacity: o, transform: 'translateX(' + (1 - p) * -260 + 'px)' } },
    React.createElement(
      'div',
      { style: { width: 176, height: 176, borderRadius: '64px 0 0 0', background: YEL, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } },
      React.createElement(
        'svg',
        { width: '92', height: '92', viewBox: '0 0 48 48' },
        React.createElement('path', { d: ICONS[q.icon], fill: 'none', stroke: TEAL, strokeWidth: '2.8', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: '1', strokeDasharray: '1', strokeDashoffset: 1 - ip }),
        q.icon === 'gauge' ? React.createElement('circle', { cx: '24', cy: '33', r: 2.8 * ip, fill: TEAL }) : null
      )
    ),
    React.createElement(
      'div',
      { style: { height: 176, width: 740, boxSizing: 'border-box', paddingLeft: 48, paddingRight: 40, borderRadius: '0 0 64px 0', background: WHITE, color: TEAL, display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      q.lines.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, REG(46, 56), { whiteSpace: 'nowrap' }) },
          rich(ln, { accent: TEAL, w: 700 })
        );
      })
    )
  );
}
function Questions() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var cp = ease(lt, sc.car ? sc.car.at : 0, 1.2);
  var bv = sc.bottomVideo,
      vp = bv ? ease(lt, bv.at || 0, 1.0) : 0;
  return React.createElement(
    Frame,
    { theme: 'teal', lt: lt, dur: sc.dur },
    bv ? React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: bv.top, bottom: 0, overflow: 'hidden', opacity: vp } },
      bv.src ? React.createElement(VideoSprite, { src: bv.src, start: bv.start || 0, end: bv.end, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }) : React.createElement('div', { style: { position: 'absolute', inset: 0, background: BLACK } }),
      React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, ' + TEAL + ' 0%, rgba(3,72,69,0.55) 22%, rgba(3,72,69,0) 50%)' } })
    ) : null,
    sc.qs.map(function (q, i) {
      return React.createElement(Chip, { key: i, q: q, lt: lt, at: q.at });
    }),
    sc.car ? React.createElement('img', { src: sc.car.src, alt: '', style: { position: 'absolute', left: sc.car.left, top: sc.car.top, width: sc.car.w, height: 'auto', opacity: cp, transform: 'translateX(' + (1 - cp) * 500 + 'px)' } }) : null
  );
}

/* ── 4 · preto: linha sai da esquerda e leva ao texto à direita ─── */
function LineText() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var LX = sc.left || 330,
      T = sc.top;
  var a = easeIO(lt, 0.2, 0.7);
  return React.createElement(
    Frame,
    { theme: 'black', lt: lt, dur: sc.dur, video: sc.video },
    React.createElement('div', { style: { position: 'absolute', left: 0, top: T + 50, width: LX - 34, height: 3, background: YEL, transform: 'scaleX(' + a + ')', transformOrigin: 'left' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: LX, right: 60, top: T, color: WHITE } },
      React.createElement(Lines, { list: sc.big, lt: lt, delay: 0.6, step: 0.12, style: LIGHT(84, 96), accent: YEL, w: 500 }),
      React.createElement(
        'div',
        { style: { marginTop: 44 } },
        React.createElement(Lines, { list: sc.sub, lt: lt, delay: 1.6, step: 0.1, style: REG(46, 58), accent: YEL })
      ),
      React.createElement(
        'div',
        { style: { marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 14 } },
        sc.chips.map(function (ch, i) {
          var p = back(lt, 2.3 + i * 0.25, 0.6);
          return React.createElement(
            'div',
            { key: i, style: _extends({ padding: '14px 30px', borderRadius: '32px 0 32px 0', background: YEL, color: TEAL }, BOLD(42, 50), { opacity: clamp(p, 0, 1), transform: 'scale(' + (0.6 + 0.4 * p) + ')', transformOrigin: 'left center' }) },
            ch
          );
        })
      )
    )
  );
}

/* ── 5 · verde: frase grande centralizada + régua + destaque ────── */
function Centered() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var T = sc.y || 520,
      VT = T + 545,
      R1 = VT + 170,
      R2 = R1 + 330;
  var v = easeIO(lt, 1.8, 0.4),
      r1 = easeIO(lt, 2.1, 0.5),
      r2 = easeIO(lt, 2.9, 0.5);
  return React.createElement(
    Frame,
    { theme: 'teal', lt: lt, dur: sc.dur },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: T, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE } },
      React.createElement(Lines, { list: sc.top, lt: lt, delay: 0.3, step: 0.12, style: LIGHT(94, 102), accent: YEL, w: 500, italic: true })
    ),
    React.createElement('div', { style: { position: 'absolute', left: W / 2 - 1.5, top: VT, width: 3, height: R1 - VT, background: YEL, transform: 'scaleY(' + v + ')', transformOrigin: 'top' } }),
    React.createElement('div', { style: { position: 'absolute', left: 130, right: 130, top: R1, height: 3, background: YEL, transform: 'scaleX(' + r1 + ')' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: R1 + 40, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE } },
      React.createElement(Lines, { list: sc.bottom, lt: lt, delay: 2.3, step: 0.1, style: MED(70, 84), accent: YEL, markAt: 2.65, mw: 700, markHeight: 60, markPos: 'left 50%' })
    ),
    React.createElement('div', { style: { position: 'absolute', left: 130, right: 130, top: R2, height: 3, background: YEL, transform: 'scaleX(' + r2 + ')' } })
  );
}

/* ── 6 · preto: fechamento ──────────────────────────────────── */
function Closing() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  return React.createElement(
    Frame,
    { theme: 'black', lt: lt, dur: sc.dur, video: sc.video, last: true },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: sc.top || 1260, color: WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } },
      React.createElement(Lines, { list: sc.pre, lt: lt, delay: 0.5, step: 0.12, style: REG(56, 68), accent: YEL }),
      React.createElement(
        'div',
        { style: { marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement(Lines, { list: sc.big, lt: lt, delay: 1.6, step: 0.18, style: LIGHT(140, 138), accent: YEL, w: 400, italic: true })
      )
    )
  );
}

var LAYOUTS = { cover: Cover, editorial: Editorial, questions: Questions, linetext: LineText, centered: Centered, closing: Closing };

function SudesteVideo12() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  RT.showLogo = t.showLogo !== false;
  RT.cardAnim = t.cardAnim || 'carrossel';
  var scenes = React.useMemo(function () {
    return JSON.parse(window.OM_SCENES);
  }, [window.OM_SCENES]);
  RT.scenes = scenes;
  React.useEffect(function () {
    ['assets/logo-dark.png', 'assets/logo-white.png'].concat(_toConsumableArray(CARS.map(function (c) {
      return c.src;
    }))).forEach(function (src) {
      var im = new Image();im.src = src;if (im.decode) im.decode()['catch'](function () {});
    });
  }, []);
  var children = {};
  scenes.forEach(function (sc) {
    children[sc.name] = LAYOUTS[sc.layout] || Cover;
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      SceneStage,
      { width: W, height: H, scenes: window.OM_SCENES, playback: window.OM_PLAYBACK, bg: TEAL, transition: 'cut' },
      children
    ),
    React.createElement(
      TweaksPanel,
      null,
      React.createElement(TweakSection, { label: 'Vídeo' }),
      React.createElement(TweakToggle, { label: 'Mostrar logo', value: t.showLogo !== false, onChange: function (v) {
          return setTweak('showLogo', v);
        } }),
      React.createElement(TweakRadio, { label: 'Cards (tela 1)', value: t.cardAnim || 'carrossel', options: [{ value: 'carrossel', label: 'Carrossel' }, { value: 'embaralhar', label: 'Embaralhar' }], onChange: function (v) {
          return setTweak('cardAnim', v);
        } }),
      React.createElement(TweakSection, { label: 'Edição' }),
      React.createElement(TweakToggle, { label: 'Editor de tempo', value: t.motionEditor, onChange: function (v) {
          return setTweak('motionEditor', v);
        } })
    )
  );
}
window.SudesteVideo12 = SudesteVideo12;
/* ÁREA DO VÍDEO: o Claude Code substitui o fundo preto pelo vídeo final, mantendo o degradê verde por cima */
