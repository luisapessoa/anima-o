/* Estilo Assinaturas 2 — "análise de crédito" — vertical brand video (1080×1920), 8 screens.
   Same animation engine/pattern as the first Estilo film. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
var NAVY = '#000051';
var BLUE = '#173ded';
var WHITE = '#ffffff';
var BLACK = '#000000';
var FONT = "'Urbanist', system-ui, sans-serif";
var LOGO_W = 232,
    LOGO_TOP = 248;
var E = Easing;
var RUNTIME = { showLogo: true, videoBg: true };

var VID_1 = 'assets/bg-1.mp4';
var VID_3 = 'assets/bg-3.mp4';
var VID_4 = 'assets/bg-4.mp4';
var VID_6 = 'assets/bg-6.mp4';
var VID_8 = 'assets/bg-8.mp4';

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1));
}
function rise(lt, delay, px, d) {
  var p = ease(lt, delay, d);
  return { opacity: p, transform: 'translateY(' + (1 - p) * (px == null ? 26 : px) + 'px)' };
}
function groupIn(lt, dir, d) {
  var p = ease(lt, 0, d || 0.5);
  var off = 1 - p;
  var t = '';
  if (dir === 'up') t = 'translateY(' + off * 60 + 'px)';else if (dir === 'down') t = 'translateY(' + off * -60 + 'px)';else if (dir === 'left') t = 'translateX(' + off * 60 + 'px)';else if (dir === 'right') t = 'translateX(' + off * -60 + 'px)';else if (dir === 'scale') t = 'scale(' + (0.96 + 0.04 * p) + ')';
  return { opacity: p, transform: t };
}
/* **text** → bold in the same colour */
function fmt(text, weight, key) {
  var parts = String(text).split('**');
  return React.createElement('span', { key: key }, parts.map(function (p, i) {
    return i % 2 === 1 ? React.createElement('span', { key: i, style: { fontWeight: weight || 800 } }, p) : React.createElement(React.Fragment, { key: i }, p);
  }));
}

/* Background video for the black scenes (Telas 1, 3, 4, 6, 8), per the
   estilo-assinatura-video-1 BgVideo pattern: cover fit, slight scale to
   fill. Black fallback + ready-gated opacity so nothing paints before the
   first frame decodes. `dim` (default on) applies the ~0.6 opacity + dark
   gradient overlay that keeps text-over-video scenes readable; Tela 6's
   video sits in its own black zone above a white text card, so it passes
   dim={false} to show at full brightness with no darkening filter. */
function BgVideo(_ref) {
  var src = _ref.src;
  var start = _ref.start;
  var end = _ref.end;
  var speed = _ref.speed;
  var shiftY = _ref.shiftY;
  var dim = _ref.dim;

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
  if (!RUNTIME.videoBg) return null;
  var dimOn = dim !== false;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(VideoSprite, { src: src, start: start || 0, end: end || 3, speed: speed || 1,
      onLoadedData: markReady,
      style: { position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover',
        transform: 'translateY(' + (shiftY || 0) + 'px) scale(1.2)',
        opacity: ready ? dimOn ? 0.6 : 1 : 0, transition: 'opacity .25s ease' } }),
    dimOn ? React.createElement('div', { style: { position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.30) 45%, rgba(0,0,0,.68) 100%)',
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' } }) : null
  );
}

function Logo(_ref2) {
  var variant = _ref2.variant;
  var lt = _ref2.lt;

  var p = ease(lt, 0.12, 0.7);
  var src = variant === 'dark' ? 'assets/estilo/opt-logo-dark.png' : 'assets/estilo/opt-logo-white.png';
  return React.createElement('img', { src: src, alt: 'Estilo Assinaturas',
    style: { position: 'absolute', top: LOGO_TOP, left: '50%',
      transform: 'translateX(-50%) translateY(' + (1 - p) * -12 + 'px)', opacity: p,
      width: LOGO_W, height: 'auto', zIndex: 5 } });
}

var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* ── 1 · BUBBLE: blue speech balloon with a tail, quote inside ── */
function Bubble() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var box = ease(lt, 0.2, 0.6);
  var bx = 100,
      by = 390,
      bw = W - 200;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(BgVideo, { src: VID_1, start: 0, end: 4.9333, speed: 0.85, shiftY: -160 }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: bx, top: by, width: bw, opacity: box,
          transform: 'translateY(' + (1 - box) * 34 + 'px) scale(' + (0.96 + 0.04 * box) + ')',
          transformOrigin: '20% 100%' } },
      React.createElement(
        'div',
        { style: { background: BLUE, borderRadius: 46, padding: '96px 40px', textAlign: 'center' } },
        (sc.body || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, 0.5 + i * 0.1, 14), { color: WHITE, fontWeight: 800,
                fontSize: 52, lineHeight: 1.2, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }) },
            ln
          );
        })
      ),
      React.createElement(
        'svg',
        { width: '200', height: '120', style: { position: 'absolute', left: 130, top: '100%',
            marginTop: -44, display: 'block' } },
        React.createElement('path', { d: 'M 0 0 L 200 0 L 88 106 Z', fill: BLUE, stroke: BLUE, strokeWidth: '26',
          strokeLinejoin: 'round' })
      )
    )
  );
}

/* ── 2 · CAR CARD on white: navy card, car breaking out of the bottom ── */
function CarCard() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var card = ease(lt, 0.2, 0.6);
  var car = ease(lt, 0.9, 0.8);
  var cx = 135,
      cy = 560,
      cw = W - 270,
      ch = 870;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'dark', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: cx, top: cy, width: cw, height: ch,
        background: NAVY, borderRadius: 52, opacity: card,
        transform: 'translateY(' + (1 - card) * 34 + 'px) scale(' + (0.97 + 0.03 * card) + ')' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: cx + 60, width: cw - 120, top: cy + 100,
          textAlign: 'center' } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.55 + i * 0.09, 14), { color: WHITE, fontWeight: 400,
              fontSize: 46, lineHeight: 1.28 }) },
          ln
        );
      }),
      React.createElement(
        'div',
        { style: { marginTop: 46 } },
        (sc.tail || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, 1.05 + i * 0.09, 14), { color: WHITE, fontWeight: 800,
                fontSize: 48, lineHeight: 1.26, letterSpacing: '-0.01em' }) },
            ln
          );
        })
      )
    ),
    React.createElement('img', { src: 'assets/estilo/opt-car-taos.png', alt: 'Volkswagen Taos',
      style: { position: 'absolute', left: '50%', top: cy + ch - 250, width: 930, height: 'auto',
        transform: 'translateX(-50%) translateY(' + (1 - car) * 40 + 'px)', opacity: car } })
  );
}

/* ── 3 · RULES: text framed by two blue horizontal rules (lower third) ── */
function Rules() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var body = sc.body || [];
  var topRule = ease(lt, 0.25, 0.6);
  var botRule = ease(lt, 1.25, 0.6);
  var rTop = 1290,
      lineH = 62,
      gap = 46;
  var rBot = rTop + gap + body.length * lineH + gap;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(BgVideo, { src: VID_3, start: 0, end: 6.0, speed: 1, shiftY: -110 }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 150, top: rTop, width: W - 300, height: 4,
        background: BLUE, transform: 'scaleX(' + topRule + ')', transformOrigin: 'center' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 130, right: 130, top: rTop + gap, textAlign: 'center' } },
      body.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.6 + i * 0.09, 14), { color: WHITE, fontWeight: 400,
              fontSize: 48, lineHeight: lineH + 'px' }) },
          fmt(ln, 800, i)
        );
      })
    ),
    React.createElement('div', { style: { position: 'absolute', left: 150, top: rBot, width: W - 300, height: 4,
        background: BLUE, transform: 'scaleX(' + botRule + ')', transformOrigin: 'center' } })
  );
}

/* ── 4 · VRULE: vertical blue rule dropping into a left-aligned paragraph ── */
function VRule() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var draw = ease(lt, 0.3, 0.9);
  var rTop = 0,
      rH = 430;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(BgVideo, { src: VID_4, start: 0, end: 6.5, speed: 1 }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: rTop,
          display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { position: 'relative', textAlign: 'left' } },
        React.createElement('div', { style: { position: 'absolute', left: 0, top: 0, width: 5, height: rH,
            background: BLUE, transform: 'scaleY(' + draw + ')', transformOrigin: 'top' } }),
        React.createElement(
          'div',
          { style: { paddingTop: rH + 60 } },
          (sc.body || []).map(function (ln, i) {
            return React.createElement(
              'div',
              { key: i, style: _extends({}, rise(lt, 0.85 + i * 0.09, 16), { color: WHITE, fontWeight: 400,
                  fontSize: 52, lineHeight: 1.28, whiteSpace: 'nowrap' }) },
              fmt(ln, 800, i)
            );
          })
        )
      )
    )
  );
}

/* ── 5 · STARS LIST on navy: 3D stars balloon + heading + dotted list ── */
function StarsList() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var items = sc.items || [];
  var img = ease(lt, 0.2, 0.7);
  var conn = ease(lt, 1.25, 0.8);
  var listTop = 670,
      lineH = 60,
      gapRow = 96,
      GW = 790,
      GTOP = 380;
  var offsets = [];var acc = 0;
  items.forEach(function (it) {
    offsets.push(acc);
    acc += (Array.isArray(it) ? it.length : 1) * lineH + gapRow;
  });
  var listSpan = offsets[offsets.length - 1] || 0;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: NAVY }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: '50%', top: GTOP + 40, width: GW,
          transform: 'translateX(-46%)' } },
      React.createElement('img', { src: 'assets/estilo/opt-stars-bubble.png', alt: '',
        style: { position: 'absolute', left: 0, top: 60, width: 520, height: 'auto',
          opacity: img, transform: 'translateY(' + (1 - img) * -26 + 'px) scale(' + (0.94 + 0.06 * img) + ')' } }),
      React.createElement(
        'div',
        { style: { position: 'absolute', left: 0, right: 0, top: 410 } },
        (sc.head || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, 0.7 + i * 0.09, 16), { color: WHITE, fontWeight: 800,
                fontSize: 54, lineHeight: 1.16, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }) },
            ln
          );
        })
      ),
      React.createElement('div', { style: { position: 'absolute', left: 40, top: listTop + 34, width: 4,
          height: listSpan * conn, background: BLUE } }),
      items.map(function (it, i) {
        var p = ease(lt, 1.3 + i * 0.18, 0.55);
        var y = listTop + offsets[i];
        return React.createElement(
          React.Fragment,
          { key: i },
          React.createElement('div', { style: { position: 'absolute', left: 30, top: y + 22, width: 24, height: 24,
              borderRadius: 999, background: BLUE, opacity: p, transform: 'scale(' + (0.6 + 0.4 * p) + ')' } }),
          React.createElement(
            'div',
            { style: _extends({ position: 'absolute', left: 100, right: 0, top: y
              }, rise(lt, 1.3 + i * 0.18, 14)) },
            (Array.isArray(it) ? it : [it]).map(function (ln, j) {
              return React.createElement(
                'div',
                { key: j, style: { color: WHITE, fontWeight: 400, fontSize: 48,
                    lineHeight: lineH + 'px', whiteSpace: 'nowrap' } },
                ln
              );
            })
          )
        );
      })
    )
  );
}

/* ── 6 · WHITE CARD: big white panel anchored to the bottom of a black screen ── */
function WhiteCard() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var card = ease(lt, 0.2, 0.65);
  var cTop = 1250;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(BgVideo, { src: VID_6, start: 0, end: 4.3667, speed: 0.85, dim: false }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 0, top: cTop, width: W, height: H - cTop,
        background: WHITE, borderTopLeftRadius: 60, borderTopRightRadius: 60, opacity: card,
        transform: 'translateY(' + (1 - card) * 60 + 'px)' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 150, right: 130, top: cTop + 170 } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.6 + i * 0.09, 14), { color: NAVY, fontWeight: 400,
              fontSize: 48, lineHeight: 1.28 }) },
          ln
        );
      }),
      React.createElement(
        'div',
        { style: { marginTop: 56 } },
        (sc.tail || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, 1.15 + i * 0.09, 14), { color: NAVY, fontWeight: 800,
                fontSize: 50, lineHeight: 1.24, letterSpacing: '-0.01em' }) },
            ln
          );
        })
      )
    )
  );
}

/* ── 7 · NIVUS CARD on navy: white card, car below, closing line ── */
function NivusCard() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var card = ease(lt, 0.2, 0.6);
  var car = ease(lt, 0.85, 0.8);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: NAVY }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 100, right: 100, top: 540, background: WHITE,
          borderRadius: 44, padding: '76px 56px', textAlign: 'center', opacity: card,
          transform: 'translateY(' + (1 - card) * 34 + 'px) scale(' + (0.97 + 0.03 * card) + ')' } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.55 + i * 0.09, 14), { color: NAVY, fontWeight: 400,
              fontSize: 46, lineHeight: 1.3 }) },
          fmt(ln, 800, i)
        );
      })
    ),
    React.createElement('img', { src: 'assets/estilo/opt-car-nivus.png', alt: 'Volkswagen Nivus',
      style: { position: 'absolute', left: '50%', top: 925, width: 1000, height: 'auto',
        transform: 'translateX(-50%) translateY(' + (1 - car) * 40 + 'px)', opacity: car } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 130, right: 130, top: 1520, textAlign: 'center' } },
      (sc.tail || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 1.35 + i * 0.09, 14), { color: WHITE, fontWeight: 400,
              fontSize: 46, lineHeight: 1.3 }) },
          ln
        );
      })
    )
  );
}

/* ── 8 · FINAL: centred bold question, each line underlined in blue ── */
function Final() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var lines = sc.body || [];
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start', paddingTop: 470 }) },
    React.createElement(BgVideo, { src: VID_8, start: 0, end: 4.2333, speed: 0.85 }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: _extends({}, groupIn(lt, 'up'), { textAlign: 'center' }) },
      lines.map(function (ln, i) {
        var ul = ease(lt, 0.55 + i * 0.18, 0.6);
        return React.createElement(
          'div',
          { key: i, style: { position: 'relative', display: 'block', marginBottom: 10 } },
          React.createElement(
            'span',
            { style: _extends({}, rise(lt, 0.2 + i * 0.1, 18), { display: 'inline-block',
                position: 'relative', color: WHITE, fontWeight: 800, fontSize: 62,
                lineHeight: 1.18, letterSpacing: '-0.02em' }) },
            ln,
            React.createElement('span', { style: { position: 'absolute', left: 0, bottom: -6, height: 6,
                width: ul * 100 + '%', background: BLUE, borderRadius: 3 } })
          )
        );
      })
    )
  );
}

var LAYOUTS = {
  bubble: Bubble, carcard: CarCard, rules: Rules, vrule: VRule,
  starslist: StarsList, whitecard: WhiteCard, nivuscard: NivusCard, final: Final
};

var PRELOAD = ['opt-logo-white.png', 'opt-logo-dark.png', 'opt-stars-bubble.png', 'opt-car-taos.png', 'opt-car-nivus.png'].map(function (f) {
  return 'assets/estilo/' + f;
});

function EstiloVideo2() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  React.useEffect(function () {
    PRELOAD.forEach(function (src) {
      var im = new Image();im.src = src;if (im.decode) im.decode()['catch'](function () {});
    });
  }, []);
  RUNTIME.showLogo = t.showLogo !== false;
  var scenes = JSON.parse(window.OM_SCENES);
  var children = {};
  scenes.forEach(function (sc) {
    children[sc.name] = LAYOUTS[sc.layout] || Rules;
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      SceneStage,
      { width: W, height: H, scenes: window.OM_SCENES,
        playback: window.OM_PLAYBACK, bg: BLACK, transition: 'cut' },
      children
    ),
    React.createElement(
      TweaksPanel,
      null,
      React.createElement(TweakSection, { label: 'Vídeo' }),
      React.createElement(TweakToggle, { label: 'Mostrar logo', value: t.showLogo !== false,
        onChange: function (v) {
          return setTweak('showLogo', v);
        } }),
      React.createElement(TweakSection, { label: 'Edição' }),
      React.createElement(TweakToggle, { label: 'Editor de tempo', value: t.motionEditor,
        onChange: function (v) {
          return setTweak('motionEditor', v);
        } })
    )
  );
}

window.EstiloVideo2 = EstiloVideo2;
