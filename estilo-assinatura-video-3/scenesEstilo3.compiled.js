/* Estilo Assinaturas 3 — "fim do contrato / liberdade de escolher" — vertical brand video
   (1080×1920), 6 screens. Same engine/pattern as the previous Estilo films. */
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
var WHITE = '#ffffff';
var BLACK = '#000000';
var FONT = "'Urbanist', system-ui, sans-serif";
var LOGO_W = 232,
    LOGO_TOP = 248;
var E = Easing;
var RUNTIME = { showLogo: true };

// Background clips for the 4 video zones — pending client footage.
var VID_2 = 'assets/bg-2.mp4';
var VID_3 = 'assets/bg-3.mp4';
var VID_4 = 'assets/bg-4.mp4';
var VID_6 = 'assets/bg-6.mp4';

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
/* **text** → bold in the same colour */
function fmt(text, weight, key) {
  var parts = String(text).split('**');
  return React.createElement('span', { key: key }, parts.map(function (p, i) {
    return i % 2 === 1 ? React.createElement('span', { key: i, style: { fontWeight: weight || 800 } }, p) : React.createElement(React.Fragment, { key: i }, p);
  }));
}

function Logo(_ref) {
  var variant = _ref.variant;
  var lt = _ref.lt;

  var p = ease(lt, 0.12, 0.7);
  var src = variant === 'dark' ? 'assets/estilo/opt-logo-dark.png' : 'assets/estilo/opt-logo-white.png';
  return React.createElement('img', { src: src, alt: 'Estilo Assinaturas',
    style: { position: 'absolute', top: LOGO_TOP, left: '50%',
      transform: 'translateX(-50%) translateY(' + (1 - p) * -12 + 'px)', opacity: p,
      width: LOGO_W, height: 'auto', zIndex: 5 } });
}

var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT };

/* Full-bleed background video with a 45% black overlay for text contrast
   (used behind text in Telas 3/4/6 — no overlay needed where nothing sits
   on top, e.g. Tela 2's isolated video plate uses VideoSprite directly). */
function BgVideo(_ref2) {
  var src = _ref2.src;
  var start = _ref2.start;
  var end = _ref2.end;
  var speed = _ref2.speed;

  if (!RUNTIME.videoBg) return null;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(VideoSprite, { src: src, start: start || 0, end: end || 3, speed: speed || 1,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' } })
  );
}

/* ── 1 · OPENER: bold centred title, blue rules flanking the last line, blue pill ── */
function Opener() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var lines = sc.head || [];
  var top = 430,
      lineH = 76;
  var ruleY = top + (lines.length - 1) * lineH + lineH / 2 - 2;
  var rule = ease(lt, 1.0, 0.7);
  var pill = pop(lt, 1.25, 0.85);
  var pillIn = ease(lt, 1.25, 0.45);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 70, right: 70, top: top, textAlign: 'center' } },
      lines.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.4 + i * 0.14, 22), { color: WHITE, fontWeight: 800,
              fontSize: 64, lineHeight: lineH + 'px', letterSpacing: '-0.02em',
              whiteSpace: 'nowrap' }) },
          ln
        );
      })
    ),
    React.createElement('div', { style: { position: 'absolute', left: 150, top: ruleY, width: 205, height: 4,
        background: BLUE, transform: 'scaleX(' + rule + ')', transformOrigin: 'left' } }),
    React.createElement('div', { style: { position: 'absolute', right: 150, top: ruleY, width: 205, height: 4,
        background: BLUE, transform: 'scaleX(' + rule + ')', transformOrigin: 'right' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: ruleY + 82,
          display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { background: BLUE, borderRadius: 22, padding: '20px 52px', opacity: pillIn,
            transform: 'translateY(' + (1 - pill) * 34 + 'px)' } },
        React.createElement(
          'span',
          { style: { color: WHITE, fontWeight: 400, fontSize: 58, lineHeight: 1.1,
              whiteSpace: 'nowrap' } },
          sc.pill
        )
      )
    )
  );
}

/* ── 2 · BLUE VIDEO: blue screen, heading, video plate (VÍDEO 1), body below ── */
function BlueVideo() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var plate = ease(lt, 0.7, 0.7);
  var plateTop = 660,
      plateH = 690;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLUE }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 118, right: 100, top: 415 } },
      (sc.head || []).map(function (ln, i) {
        var p = ease(lt, 0.3 + i * 0.16, 0.6);
        return React.createElement(
          'div',
          { key: i, style: { overflow: 'hidden', height: 78 } },
          React.createElement(
            'div',
            { style: { color: WHITE, fontWeight: 800, fontSize: 60, lineHeight: '78px',
                letterSpacing: '-0.02em', whiteSpace: 'nowrap', opacity: p,
                transform: 'translateY(' + (1 - p) * 78 + 'px)' } },
            ln
          )
        );
      })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 125, right: 125, top: plateTop, height: plateH,
          background: BLACK, borderRadius: 60, overflow: 'hidden', opacity: plate,
          transform: 'translateY(' + (1 - plate) * 30 + 'px) scale(' + (0.97 + 0.03 * plate) + ')' } },
      RUNTIME.videoBg ? React.createElement(VideoSprite, { src: VID_2, start: 0, end: 7, speed: 1,
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }) : null
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 118, right: 60, top: plateTop + plateH + 90 } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 1.35 + i * 0.1, 16), { color: WHITE, fontWeight: 400,
              fontSize: 52, lineHeight: '68px', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    )
  );
}

/* ── 3 · LONG VRULE: full-bleed video, blue line runs over it, paragraph in the lower third ── */
function LongVRule() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var body = sc.body || [];
  var draw = ease(lt, 0.2, 1.1);
  var lineH = 74,
      textTop = 1370;
  var gapTop = textTop - 60,
      gapBot = textTop + body.length * lineH + 40;
  var tailDraw = ease(lt, 0.95, 0.7);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, top: 340, width: W, height: 940, overflow: 'hidden' } },
      React.createElement(BgVideo, { src: VID_3, start: 0, end: 6, speed: 1 })
    ),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 176, top: 0, width: 4, height: gapTop, zIndex: 4,
        background: BLUE, transform: 'scaleY(' + draw + ')', transformOrigin: 'top' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 166, right: 40, top: textTop, zIndex: 4 } },
      body.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.75 + i * 0.1, 16), { color: WHITE, fontWeight: 400,
              fontSize: 54, lineHeight: lineH + 'px', whiteSpace: 'nowrap' }) },
          fmt(ln, 800, i)
        );
      })
    ),
    React.createElement('div', { style: { position: 'absolute', left: 176, top: gapBot, width: 4, height: H - gapBot, zIndex: 4,
        background: BLUE, transform: 'scaleY(' + tailDraw + ')', transformOrigin: 'top' } })
  );
}

/* ── 4 · LIST LINES: full-bleed video below the text, bold lead-in + left-aligned lines ── */
function LeadLines() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, top: 900, width: W, height: 1020, overflow: 'hidden' } },
      React.createElement(BgVideo, { src: VID_4, start: 0, end: 5.5, speed: 1 })
    ),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 140, right: 80, top: 430, zIndex: 4 } },
      (sc.head || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: { opacity: ease(lt, 0.3, 0.45),
              transform: 'translateX(' + (1 - pop(lt, 0.3, 0.8)) * -60 + 'px)',
              color: WHITE, fontWeight: 800, fontSize: 58, lineHeight: '76px',
              letterSpacing: '-0.02em', whiteSpace: 'nowrap' } },
          ln
        );
      }),
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.8 + i * 0.13, 18), { color: WHITE, fontWeight: 400,
              fontSize: 56, lineHeight: '76px', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    )
  );
}

/* ── 5 · SAVEIRO CARD: white screen, blue card, pickup breaking out of the card ── */
function SaveiroCard() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var card = ease(lt, 0.2, 0.65);
  var carIn = ease(lt, 0.9, 0.55);
  var car = ease(lt, 0.9, 1.1);
  var cx = 130,
      cy = 550,
      cw = 820,
      ch = 900;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'dark', lt: lt }) : null,
    React.createElement('div', { style: { position: 'absolute', left: cx, top: cy, width: cw, height: ch,
        background: BLUE, borderRadius: 60, opacity: card,
        transform: 'translateY(' + (1 - card) * 34 + 'px) scale(' + (0.97 + 0.03 * card) + ')' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: cx + 40, width: cw - 80, top: cy + 110,
          textAlign: 'center', zIndex: 2 } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.55 + i * 0.09, 14), { color: WHITE, fontWeight: 400,
              fontSize: 54, lineHeight: '70px', whiteSpace: 'nowrap' }) },
          fmt(ln, 800, i)
        );
      })
    ),
    React.createElement('img', { src: 'assets/estilo/car-saveiro.png', alt: 'Volkswagen Saveiro Robust',
      style: { position: 'absolute', left: 100, top: cy + ch - 320, width: 900, height: 'auto',
        zIndex: 3, opacity: carIn, transformOrigin: '38% 100%',
        transform: 'scale(' + (0.82 + 0.18 * car) + ') translateY(' + (1 - car) * 70 + 'px)' } })
  );
}

/* ── 6 · BRACKET: full-bleed video band, paragraph top-left, blue bracket over it, bold close ── */
function Bracket() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var hx = ease(lt, 0.9, 0.5);
  var vy = ease(lt, 1.25, 0.9);
  var bx = 905,
      by = 590,
      bh = 880;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: BLACK }) },
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, top: 1010, width: W, height: 500, overflow: 'hidden' } },
      React.createElement(BgVideo, { src: VID_6, start: 0, end: 6.5, speed: 1 })
    ),
    RUNTIME.showLogo ? React.createElement(Logo, { variant: 'white', lt: lt }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 116, right: 200, top: 430, zIndex: 4 } },
      (sc.body || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.3 + i * 0.11, 18), { color: WHITE, fontWeight: 400,
              fontSize: 54, lineHeight: '74px', whiteSpace: 'nowrap' }) },
          ln
        );
      })
    ),
    React.createElement('div', { style: { position: 'absolute', left: bx - 90, top: by, width: 94, height: 4, zIndex: 4,
        background: BLUE, transform: 'scaleX(' + hx + ')', transformOrigin: 'left' } }),
    React.createElement('div', { style: { position: 'absolute', left: bx, top: by, width: 4, height: bh, zIndex: 4,
        background: BLUE, transform: 'scaleY(' + vy + ')', transformOrigin: 'top' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 200, right: 116, top: 1540, zIndex: 4,
          textAlign: 'right' } },
      (sc.tail || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 1.55 + i * 0.12, 18), { color: WHITE, fontWeight: 800,
              fontSize: 58, lineHeight: '76px', letterSpacing: '-0.02em',
              whiteSpace: 'nowrap' }) },
          ln
        );
      })
    )
  );
}

var LAYOUTS = {
  opener: Opener, bluevideo: BlueVideo, longvrule: LongVRule,
  leadlines: LeadLines, saveirocard: SaveiroCard, bracket: Bracket
};

var PRELOAD = ['assets/estilo/opt-logo-white.png', 'assets/estilo/opt-logo-dark.png', 'assets/estilo/car-saveiro.png'];

function EstiloVideo3() {
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
    children[sc.name] = LAYOUTS[sc.layout] || LeadLines;
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

window.EstiloVideo3 = EstiloVideo3;
