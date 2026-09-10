/* Real Assinatura 3 — "qual SUV você escolheria?" — vertical brand video (1080×1920), 7 screens.
   Same animation engine/pattern as scenesReal2.jsx. Loaded after animations-v2.jsx + tweaks-panel.jsx. */
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
var NAVY = '#112750';
var SKY = '#9fd3e5';
var GREY = '#f0f0f0';
var WHITE = '#ffffff';
var BLACK = '#000000';
var FONT = "'Readex Pro', system-ui, sans-serif";
var LOGO_TOP = 210;
var E = Easing;
var RUNTIME = { showLogo: true };

var VID_7 = 'assets/bg-7.mp4';

var PRELOAD = ['assets/real/logo-white.png', 'assets/real/logo-navy.png', 'assets/real/logo-sky.png', 'assets/real/suv-tera.png', 'assets/real/suv-tcross.png', 'assets/real/suv-taos.png', 'assets/real/suv-tiguan.png', 'assets/real/suv-tera-t.png', 'assets/real/suv-tcross-tm.png', 'assets/real/suv-taos-tm.png', 'assets/real/suv-tiguan-t.png'];

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1));
}
function pop(lt, delay, d) {
  var x = clamp((lt - delay) / (d || 0.7), 0, 1);
  return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  var p = ease(lt, delay, d);
  return { opacity: p, transform: 'translateY(' + (1 - p) * (px == null ? 26 : px) + 'px)' };
}

function Logo(_ref) {
  var variant = _ref.variant;
  var lt = _ref.lt;

  var p = ease(lt, 0, 0.6);
  var src = variant === 'dark' ? 'assets/real/logo-navy.png' : variant === 'sky' ? 'assets/real/logo-sky.png' : 'assets/real/logo-white.png';
  return React.createElement(
    'div',
    { style: { position: 'absolute', top: LOGO_TOP, left: '50%', zIndex: 6,
        transform: 'translateX(-50%) translateY(' + (1 - p) * -12 + 'px)', opacity: p } },
    React.createElement('img', { src: src, alt: 'Real Assinatura', style: { height: 66, width: 'auto', display: 'block' } })
  );
}

var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* ── 1 · SUV GRID: grey bg, navy bands, four SUVs, highlighted question ─── */
function SuvGrid() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var bandA = ease(lt, 0.2, 0.65);
  var bandB = ease(lt, 0.4, 0.65);
  var cars = [{ src: 'assets/real/suv-tcross-tm.png', left: 420, top: 355, width: 600, delay: 0.55, flip: true }, { src: 'assets/real/suv-tera-t.png', left: 88, top: 500, width: 692, delay: 0.75 }, { src: 'assets/real/suv-taos-tm.png', left: 370, top: 960, width: 684, delay: 0.95, flip: true }, { src: 'assets/real/suv-tiguan-t.png', left: 66, top: 1120, width: 740, delay: 1.15 }];
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: GREY }) },
    React.createElement('div', { style: { position: 'absolute', left: 0, top: 455, width: 860, height: 334,
        background: NAVY, transform: 'scaleX(' + bandA + ')', transformOrigin: 'left' } }),
    React.createElement('div', { style: { position: 'absolute', left: 420, top: 915, width: 660, height: 334,
        background: NAVY, transform: 'scaleX(' + bandB + ')', transformOrigin: 'right' } }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'dark', lt: lt }) : null,
    cars.map(function (c, i) {
      var p = ease(lt, c.delay, 0.7);
      return React.createElement('img', { key: i, src: c.src, alt: '', style: { position: 'absolute', left: c.left, top: c.top,
          width: c.width, height: 'auto', opacity: p,
          transform: 'translateY(' + (1 - p) * 28 + 'px) scale(' + (0.96 + 0.04 * p) + ')' + (c.flip ? ' scaleX(-1)' : '') } });
    }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 60, right: 60, top: 1560, textAlign: 'center' } },
      (sc.head || []).map(function (ln, i) {
        var d = 1.4 + i * 0.18;
        var wipe = ease(lt, d, 0.5);
        var txt = ease(lt, d + 0.18, 0.45);
        return React.createElement(
          'div',
          { key: i, style: { marginBottom: 8, overflow: 'hidden', display: 'block' } },
          React.createElement(
            'span',
            { style: { position: 'relative', display: 'inline-block', overflow: 'hidden',
                padding: '4px 16px', fontWeight: 700, fontSize: 56, lineHeight: 1.34,
                letterSpacing: '-0.01em', whiteSpace: 'nowrap', color: 'transparent' } },
            React.createElement('span', { style: { position: 'absolute', inset: 0, background: NAVY,
                transform: 'scaleX(' + wipe + ')', transformOrigin: 'left' } }),
            React.createElement(
              'span',
              { style: { position: 'absolute', left: 16, right: 16, top: 4, color: WHITE,
                  opacity: txt, transform: 'translateY(' + (1 - txt) * 28 + 'px)' } },
              ln
            ),
            React.createElement(
              'span',
              { style: { visibility: 'hidden' } },
              ln
            )
          )
        );
      })
    )
  );
}

/* ── 2–5 · MODEL CARD: big model name, SUV, outlined spec box ──────────── */
function ModelCard() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var navy = sc.theme !== 'grey';
  var bg = navy ? NAVY : GREY;
  var title = navy ? SKY : NAVY;
  var text = navy ? WHITE : NAVY;
  var items = sc.items || [];
  var box = ease(lt, 0.7, 0.65);
  var car = pop(lt, 0.45, 0.95);
  var carIn = ease(lt, 0.45, 0.5);
  var boxTop = 985;
  var carW = sc.carW || 1220;
  var carTop = sc.carTop == null ? 510 : sc.carTop;
  var boxH = sc.boxH || 1250;
  var ttl = pop(lt, 0.12, 0.85);
  var ttlIn = ease(lt, 0.12, 0.45);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: bg }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: navy ? 'white' : 'dark', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 130, right: 90, top: 400, zIndex: 2,
          opacity: ttlIn, transform: 'translateX(' + (1 - ttl) * -180 + 'px)',
          color: title, fontWeight: 700, fontSize: 150,
          lineHeight: 1, letterSpacing: '-0.03em' } },
      sc.model
    ),
    React.createElement('div', { style: { position: 'absolute', left: 55, right: 55, top: boxTop, height: boxH,
        border: '3px solid ' + SKY, borderBottom: 'none', opacity: box,
        transform: 'scaleY(' + (0.82 + 0.18 * box) + ')', transformOrigin: 'top' } }),
    React.createElement('img', { src: sc.car, alt: sc.model, style: { position: 'absolute', left: '50%', top: carTop,
        width: carW, height: 'auto', zIndex: 3, opacity: carIn,
        transform: 'translateX(calc(-50% + ' + (1 - car) * 260 + 'px)) rotate(' + (1 - car) * -2 + 'deg)' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: boxTop + 175, zIndex: 4,
          display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { textAlign: 'left' } },
        items.map(function (lines, i) {
          return React.createElement(
            'div',
            { key: i, style: { opacity: ease(lt, 1.0 + i * 0.13, 0.4),
                transform: 'translateX(' + (1 - pop(lt, 1.0 + i * 0.13, 0.7)) * -70 + 'px)', display: 'flex',
                alignItems: 'flex-start', gap: 22, marginBottom: 26 } },
            React.createElement('div', { style: { width: 16, height: 16, background: SKY, flex: '0 0 auto', marginTop: 16,
                transform: 'rotate(' + (1 - ease(lt, 1.05 + i * 0.13, 0.6)) * 135 + 'deg)' } }),
            React.createElement(
              'div',
              null,
              lines.map(function (ln, j) {
                return React.createElement(
                  'div',
                  { key: j, style: { color: text, fontWeight: 400, fontSize: 38,
                      lineHeight: '48px', whiteSpace: 'nowrap' } },
                  ln
                );
              })
            )
          );
        })
      )
    )
  );
}

/* ── 6 · BOX CHAIN: navy, four outlined boxes joined by a line + closer ── */
function BoxChain() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var boxes = sc.boxes || [];
  var boxH = 130,
      gap = 92,
      top = 470;
  var BOXW = 590;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: NAVY }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    boxes.map(function (label, i) {
      var p = ease(lt, 0.25 + i * 0.22, 0.55);
      var y = top + i * (boxH + gap);
      var conn = ease(lt, 0.45 + i * 0.22, 0.4);
      return React.createElement(
        React.Fragment,
        { key: i },
        i < boxes.length - 1 ? React.createElement('div', { style: { position: 'absolute', left: '50%', top: y + boxH + 2, width: 3, height: gap - 4,
            background: SKY, transform: 'translateX(-50%) scaleY(' + conn + ')', transformOrigin: 'top' } }) : null,
        React.createElement(
          'div',
          { style: { position: 'absolute', left: '50%', top: y,
              width: BOXW, height: boxH, border: '3px solid ' + SKY, background: NAVY, zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p,
              transform: 'translateX(-50%) translateY(' + (1 - p) * 20 + 'px)' } },
          React.createElement(
            'span',
            { style: { color: WHITE, fontWeight: 700, fontSize: 60,
                letterSpacing: '-0.01em' } },
            label
          )
        )
      );
    }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 130, right: 130, top: 1380, textAlign: 'center' } },
      (sc.tail || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 1.35 + i * 0.1, 14), { color: WHITE, fontWeight: 400,
              fontSize: 52, lineHeight: 1.28 }) },
          ln
        );
      })
    )
  );
}

/* ── 7 · FINAL RULE: black, sky rule with square, closing question · VIDEO ── */
function FinalRule() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var draw = ease(lt, 0.25, 0.7);
  var ruleY = 1330;
  var vid = ease(lt, 0.1, 0.6);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, top: 340, width: W, height: 900,
          overflow: 'hidden', background: BLACK, opacity: vid,
          transform: 'translateY(' + (1 - vid) * 30 + 'px)' } },
      React.createElement(VideoSprite, { src: VID_7, start: 0, end: 6.2, speed: 1,
        style: { width: '100%', height: '100%', objectFit: 'cover' } })
    ),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 0, top: ruleY, width: 145, height: 4,
        background: SKY, transform: 'scaleX(' + draw + ')', transformOrigin: 'left' } }),
    React.createElement('div', { style: { position: 'absolute', left: 133, top: ruleY - 8, width: 20, height: 20,
        background: SKY, opacity: ease(lt, 0.85, 0.4) } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 130, right: 110, top: ruleY + 60 } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.6 + i * 0.09, 16), { color: WHITE, fontWeight: 400,
              fontSize: 50, lineHeight: 1.24, whiteSpace: 'nowrap' }) },
          ln
        );
      }),
      React.createElement(
        'div',
        { style: _extends({}, rise(lt, 1.2, 16), { marginTop: 66, color: WHITE, fontWeight: 700,
            fontSize: 52, lineHeight: 1.2, whiteSpace: 'nowrap' }) },
        sc.tail
      )
    )
  );
}

/* ── root ────────────────────────────────────────────────────── */
var LAYOUTS = { suvgrid: SuvGrid, modelcard: ModelCard, boxchain: BoxChain, finalrule: FinalRule };

function RealVideo3() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  RUNTIME.showLogo = t.showLogo !== false;
  React.useEffect(function () {
    PRELOAD.forEach(function (src) {
      var im = new Image();im.src = src;if (im.decode) im.decode()['catch'](function () {});
    });
  }, []);
  var scenes = JSON.parse(window.OM_SCENES);
  var children = {};
  scenes.forEach(function (sc) {
    children[sc.name] = LAYOUTS[sc.layout] || SuvGrid;
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

window.RealVideo3 = RealVideo3;
