/* Estilo Assinaturas 4 — "quilometragem" — vertical brand video (1080×1920), 7 screens.
   Tela 3 → 4: the white screen slides down and becomes the rounded white panel of Tela 4. */
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
var BLUE = '#173ded';
var NAVY = '#000051';
var WHITE = '#ffffff';
var BLACK = '#000000';
var FONT = "'Urbanist', system-ui, sans-serif";
var LOGO_W = 232,
    LOGO_TOP = 248;
var E = Easing;
var RUNTIME = { showLogo: true };

// Background clips for the 2 video zones (Telas 1 and 2 have none yet).
var VID_4 = 'assets/bg-4.mp4';
var VID_7 = 'assets/bg-7.mp4';

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1));
}
function inout(lt, delay, d) {
  return E.easeInOutCubic(clamp((lt - delay) / (d || 0.6), 0, 1));
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
  var delay = _ref.delay;

  var p = ease(lt, delay == null ? 0.12 : delay, 0.7);
  var src = variant === 'dark' ? 'assets/estilo/opt-logo-dark.png' : 'assets/estilo/opt-logo-white.png';
  return React.createElement('img', { src: src, alt: 'Estilo Assinaturas',
    style: { position: 'absolute', top: LOGO_TOP, left: '50%',
      transform: 'translateX(-50%) translateY(' + (1 - p) * -12 + 'px)', opacity: p,
      width: LOGO_W, height: 'auto', zIndex: 5 } });
}

var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };
var light = { fontWeight: 300, fontSize: 54, lineHeight: '65px', whiteSpace: 'nowrap' };

/* Full-bleed background video with a flat dark overlay for logo/text contrast. */
function BgVideo(_ref2) {
  var src = _ref2.src;
  var start = _ref2.start;
  var end = _ref2.end;
  var speed = _ref2.speed;
  var overlay = _ref2.overlay;

  if (!RUNTIME.videoBg) return null;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(VideoSprite, { src: src, start: start || 0, end: end || 3, speed: speed || 1,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,' + (overlay == null ? 0.4 : overlay) + ')' } })
  );
}

/* ── 1 · QUOTE CARD: navy rounded card with bold quote, question at the bottom ── */
function QuoteCard() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var card = ease(lt, 0.25, 0.7);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 90, top: 455, width: 900, height: 374,
        background: NAVY, borderRadius: 46, opacity: card,
        transform: 'translateY(' + (1 - card) * 30 + 'px) scale(' + (0.96 + 0.04 * card) + ')' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 90, width: 900, top: 541, textAlign: 'center' } },
      (sc.head || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.6 + i * 0.13, 18), { color: WHITE, fontWeight: 700,
              fontSize: 55, lineHeight: '65px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 1522, textAlign: 'center',
          color: WHITE, fontWeight: 600, fontSize: 72, lineHeight: '84px', letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', opacity: ease(lt, 1.9, 0.5),
          transform: 'translateY(' + (1 - pop(lt, 1.9, 0.9)) * 40 + 'px)' } },
      sc.tail
    )
  );
}

/* ── 2 · OUTLINE BOX: blue outline running off the left edge, bold question below ── */
function OutlineBox() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var draw = ease(lt, 0.2, 0.9);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: -60, top: 431, width: 1001, height: 422,
        boxSizing: 'border-box', border: '3px solid ' + BLUE, borderRadius: 34,
        clipPath: 'inset(0 ' + (1 - draw) * 100 + '% 0 0)' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 210, top: 503 } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.7 + i * 0.1, 16), { color: WHITE }, light) },
          ln
        );
      })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 1524, textAlign: 'center' } },
      (sc.tail || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 2.0 + i * 0.14, 20), { color: WHITE, fontWeight: 600,
              fontSize: 56, lineHeight: '65px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    )
  );
}

/* ── 3 · KBB: white screen, thin→thick rule, paragraph + blue highlight, Tera below ── */
function KbbContent(_ref3) {
  var sc = _ref3.sc;
  var lt = _ref3.lt;

  var body = sc.body || [],
      hi = sc.hi || [];
  var thin = ease(lt, 0.2, 1.0);
  var thickIn = ease(lt, 0.7, 0.4);
  var slide = inout(lt, 1.35, 0.8);
  var carIn = ease(lt, 2.3, 0.5);
  var car = ease(lt, 2.3, 1.2);
  return React.createElement(
    React.Fragment,
    null,
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'dark', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 199, top: 473, width: 2, height: 629,
        background: BLUE, transform: 'scaleY(' + thin + ')', transformOrigin: 'top' } }),
    React.createElement('div', { style: { position: 'absolute', left: 195, top: 473 + 458 * slide, width: 10, height: 381 - 210 * slide,
        borderRadius: 3, background: BLUE, opacity: thickIn,
        transform: 'scaleY(' + thickIn + ')', transformOrigin: 'top' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 250, top: 464 } },
      body.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.45 + i * 0.09, 16), { color: NAVY }, light) },
          ln
        );
      })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 250, top: 921 } },
      hi.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 1.95 + i * 0.1, 16), { color: BLUE, fontWeight: 700,
              fontSize: 54, lineHeight: '65px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    ),
    React.createElement('img', { src: 'assets/estilo/car-tera-12.webp', alt: 'Volkswagen Tera',
      style: { position: 'absolute', left: -130, top: 1110, width: 1340, height: 'auto',
        opacity: carIn, transform: 'translateX(' + (1 - car) * 180 + 'px)' } })
  );
}
function Kbb() {
  var s = useScene();
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    React.createElement(KbbContent, { sc: s.scene, lt: s.localTime })
  );
}

/* ── 4 · PANEL: video fills the black area, Tela 3 slides down and becomes the white panel ── */
var PANEL_TOP = 1075,
    PANEL_R = 80,
    MORPH = 1.0;
function Panel() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var all = JSON.parse(window.OM_SCENES);
  var prev = all.find(function (x) {
    return x.layout === 'kbb';
  }) || {};
  var m = inout(lt, 0.05, MORPH);
  var top = PANEL_TOP * m;
  var t0 = MORPH + 0.05;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(BgVideo, { src: VID_4, start: 0, end: 4.9667, speed: 0.6 }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt, delay: 0.55 }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: top, height: H,
          background: WHITE, borderRadius: PANEL_R * m + 'px ' + PANEL_R * m + 'px 0 0', overflow: 'hidden' } },
      React.createElement(
        'div',
        { style: { position: 'absolute', left: 0, top: 0, width: W, height: H,
            opacity: clamp(1 - m * 1.6, 0, 1) } },
        React.createElement(KbbContent, { sc: prev, lt: 99 })
      ),
      React.createElement(
        'div',
        { style: { position: 'absolute', left: 119, top: 1253 - PANEL_TOP } },
        (sc.body || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, t0 + 0.1 + i * 0.1, 16), { color: NAVY }, light) },
            ln
          );
        })
      ),
      React.createElement(
        'div',
        { style: { position: 'absolute', left: 119, top: 1514 - PANEL_TOP } },
        (sc.body2 || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, t0 + 0.75 + i * 0.1, 16), { color: NAVY }, light) },
            ln,
            i === 1 ? React.createElement(
              'span',
              { style: { color: BLUE, fontWeight: 700 } },
              ' ',
              sc.hi[0]
            ) : null
          );
        }),
        (sc.hi || []).slice(1).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, t0 + 0.95 + i * 0.1, 16), { color: BLUE }, light, {
                fontWeight: 700 }) },
            ln
          );
        })
      )
    )
  );
}

/* ── 5 · CHECKLIST: navy screen, top rule, bold heading, blue-dot list ── */
function Checklist() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var rule = ease(lt, 0.1, 0.9);
  var TOP = 618;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: NAVY }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: TOP, display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { position: 'relative' } },
        React.createElement('div', { style: { position: 'absolute', left: 15, top: -TOP, width: 3, height: TOP - 26,
            background: BLUE, transform: 'scaleY(' + rule + ')', transformOrigin: 'top' } }),
        (sc.head || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, 0.5 + i * 0.12, 20), { color: WHITE, fontWeight: 700,
                fontSize: 66, lineHeight: '75px', letterSpacing: '-0.015em', whiteSpace: 'nowrap' }) },
            ln
          );
        }),
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: 21, marginTop: 68 } },
          (sc.items || []).map(function (it, i) {
            var d = 1.2 + i * 0.22;
            var dot = pop(lt, d, 0.6);
            return React.createElement(
              'div',
              { key: i, style: { position: 'relative', paddingLeft: 40 } },
              React.createElement('div', { style: { position: 'absolute', left: 1, top: 26, width: 17, height: 17, borderRadius: '50%',
                  background: BLUE, transform: 'scale(' + dot + ')' } }),
              React.createElement(
                'div',
                { style: { opacity: ease(lt, d + 0.05, 0.5),
                    transform: 'translateX(' + (1 - ease(lt, d + 0.05, 0.6)) * 30 + 'px)' } },
                it.map(function (ln, j) {
                  return React.createElement(
                    'div',
                    { key: j, style: _extends({ color: WHITE }, light) },
                    ln
                  );
                })
              )
            );
          })
        )
      )
    )
  );
}

/* ── 6 · DIVIDER: blue question, paragraph, blue rule, paragraph ── */
function Divider() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var rule = ease(lt, 1.55, 0.8);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'dark', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 628, display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column' } },
        React.createElement(
          'div',
          { style: { color: BLUE, fontWeight: 700, fontSize: 64, lineHeight: '80px', letterSpacing: '-0.015em',
              whiteSpace: 'nowrap', opacity: ease(lt, 0.3, 0.45),
              transform: 'translateX(' + (1 - pop(lt, 0.3, 0.8)) * -50 + 'px)' } },
          sc.head
        ),
        React.createElement(
          'div',
          { style: { marginTop: 62 } },
          (sc.body || []).map(function (ln, i) {
            return React.createElement(
              'div',
              { key: i, style: _extends({}, rise(lt, 0.8 + i * 0.1, 16), { color: NAVY }, light) },
              ln
            );
          })
        ),
        React.createElement('div', { style: { height: 3, marginTop: 58, marginBottom: 71, background: BLUE,
            transform: 'scaleX(' + rule + ')', transformOrigin: 'left' } }),
        React.createElement(
          'div',
          null,
          (sc.body2 || []).map(function (ln, i) {
            return React.createElement(
              'div',
              { key: i, style: _extends({}, rise(lt, 2.0 + i * 0.1, 16), { color: NAVY }, light) },
              ln
            );
          })
        )
      )
    )
  );
}

/* ── 7 · CLOSING: full-bleed video, gradient to black at the bottom for the text ── */
function Closing() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(BgVideo, { src: VID_7, start: 0, end: 4.4, speed: 0.78, overlay: 0.25 }),
    React.createElement('div', { style: { position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,.85) 100%)' } }),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 1382, textAlign: 'center' } },
      (sc.head || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.35 + i * 0.14, 20), { color: WHITE, fontWeight: 700,
              fontSize: 56, lineHeight: '64px', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 1553, textAlign: 'center' } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 1.0 + i * 0.12, 16), { color: WHITE, fontWeight: 300,
              fontSize: 46, lineHeight: '56px', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    )
  );
}

var LAYOUTS = { quote: QuoteCard, outline: OutlineBox, kbb: Kbb, panel: Panel,
  checklist: Checklist, divider: Divider, closing: Closing };

var PRELOAD = ['assets/estilo/opt-logo-white.png', 'assets/estilo/opt-logo-dark.png', 'assets/estilo/car-tera-12.webp'];

function EstiloVideo4() {
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
  RUNTIME.videoBg = t.videoBg !== false;
  var scenes = JSON.parse(window.OM_SCENES);
  var children = {};
  scenes.forEach(function (sc) {
    children[sc.name] = LAYOUTS[sc.layout] || Closing;
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
      React.createElement(TweakToggle, { label: 'Vídeos de fundo', value: t.videoBg !== false,
        onChange: function (v) {
          return setTweak('videoBg', v);
        } }),
      React.createElement(TweakSection, { label: 'Edição' }),
      React.createElement(TweakToggle, { label: 'Editor de tempo', value: t.motionEditor,
        onChange: function (v) {
          return setTweak('motionEditor', v);
        } })
    )
  );
}

window.EstiloVideo4 = EstiloVideo4;
