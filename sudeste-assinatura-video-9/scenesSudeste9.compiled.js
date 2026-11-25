/* Sudeste Assinatura — VÍDEO 9 (1080×1920). "Quais os requisitos para eu assinar meu 0km?"
   Tela 1 branca (card verde escuro + carro), 2 verde escuro (timeline), 3 preta (vídeo),
   4 verde claro (texto editorial), 5 preta (vídeo, texto em escada). */
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

var W = 1080,
    H = 1920;
var BLACK = '#000000',
    TEAL = '#034845',
    MINT = '#00d1b2',
    PALE = '#c6f6d6',
    WHITE = '#ffffff',
    YEL = '#f2ff46';
var FONT = "'DM Sans', system-ui, sans-serif";
var LOGO_W = 640,
    LOGO_TOP = 200;
var E = Easing;
var RT = { showLogo: true, videoBg: true };

// Vídeos de fundo das Telas 3 e 5 (placeholders pretos no handoff).
var VID_3 = 'assets/videos/tela3.mp4';
var VID_5 = 'assets/videos/tela5.mp4';

function BgVideo(_ref) {
  var src = _ref.src;
  var start = _ref.start;
  var end = _ref.end;
  var scale = _ref.scale;
  var posX = _ref.posX;
  var posY = _ref.posY;
  var op = _ref.op;
  var overlay = _ref.overlay;
  var speed = _ref.speed;
  var shiftY = _ref.shiftY;
  var filter = _ref.filter;

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
  if (!RT.videoBg) {
    return React.createElement('div', { style: { position: 'absolute', inset: 0, background: BLACK } });
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: BLACK } }),
    React.createElement(VideoSprite, { src: src, start: start || 0, end: end || 3, speed: speed || 1,
      onLoadedData: markReady,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        objectPosition: (posX == null ? 50 : posX) + '% ' + (posY == null ? 50 : posY) + '%',
        transform: 'translateY(' + (shiftY || 0) + 'px) scale(' + (scale || 1) + ')',
        filter: filter || 'none',
        opacity: ready ? op == null ? 1 : op : 0, transition: 'opacity .25s ease' } }),
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: overlay || 'rgba(0,0,0,0.35)',
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' } })
  );
}

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function easeIO(lt, delay, d) {
  return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function pop(lt, delay, d) {
  var x = clamp((lt - delay) / (d || 0.7), 0, 1);
  return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  var p = ease(lt, delay, d);
  return { opacity: p, transform: 'translateY(' + (1 - p) * (px == null ? 22 : px) + 'px)' };
}
function rich(text, accent, w) {
  return String(text).split('**').map(function (p, i) {
    return i % 2 === 1 ? React.createElement(
      'span',
      { key: i, style: { color: accent, fontWeight: w || 700 } },
      p
    ) : React.createElement(
      React.Fragment,
      { key: i },
      p
    );
  });
}
function Lines(_ref2) {
  var list = _ref2.list;
  var lt = _ref2.lt;
  var delay = _ref2.delay;
  var step = _ref2.step;
  var style = _ref2.style;
  var accent = _ref2.accent;

  return (list || []).map(function (ln, i) {
    return React.createElement(
      'div',
      { key: i, style: _extends({}, rise(lt, (delay || 0) + i * (step || 0.08), 16), { whiteSpace: 'nowrap' }, style) },
      rich(ln, accent)
    );
  });
}
function Logo(_ref3) {
  var dark = _ref3.dark;

  return React.createElement('img', { src: dark ? 'assets/logo-dark.png' : 'assets/logo-white.png', alt: 'Sudeste Assinaturas',
    decoding: 'sync', loading: 'eager',
    style: { position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)',
      width: LOGO_W, height: 'auto', zIndex: 6 } });
}
function Draw(_ref4) {
  var d = _ref4.d;
  var p = _ref4.p;
  var color = _ref4.color;
  var w = _ref4.w;

  return React.createElement('path', { d: d, fill: 'none', stroke: color, strokeWidth: w || 3, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: '1',
    strokeDasharray: '1', strokeDashoffset: 1 - p });
}
var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
var BOLD = function BOLD(fs, lh) {
  return { fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.02em' };
};
var REG = function REG(fs, lh) {
  return { fontWeight: 400, fontSize: fs, lineHeight: lh + 'px' };
};
var LIGHT = function LIGHT(fs, lh) {
  return { fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.03em' };
};
function exitOut(lt, dur) {
  var p = E.easeInCubic(clamp((lt - (dur - 0.55)) / 0.5, 0, 1));return { opacity: 1 - p, transform: 'translateY(' + -50 * p + 'px)' };
}
/* painel da próxima tela entrando no fim da tela atual (sem buraco preto entre cenas) */
function NextPanel(_ref5) {
  var lt = _ref5.lt;
  var dur = _ref5.dur;
  var color = _ref5.color;
  var dir = _ref5.dir;

  var p = easeIO(lt, dur - 0.75, 0.75);
  if (p <= 0) return null;
  var clip = dir === 'left' ? 'inset(0 ' + (1 - p) * 100 + '% 0 0)' : 'inset(' + (1 - p) * 100 + '% 0 0 0)';
  return React.createElement('div', { style: { position: 'absolute', inset: 0, background: color, clipPath: clip, zIndex: 20 } });
}
function iris(lt) {
  var r = easeIO(lt, 0, 0.7) * 125;return { clipPath: 'circle(' + r + '% at 50% 50%)' };
}

/* ícones (viewBox 160) */
var IC = {
  doc: function doc(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M44 20 H100 L124 44 V140 H44 Z', p: p, color: c, w: 10 }),
      React.createElement(Draw, { d: 'M62 74 H106 M62 96 H106 M62 118 H90', p: clamp(p * 1.6 - 0.6, 0, 1), color: c, w: 10 })
    );
  },
  key: function key(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M86 60 A28 28 0 1 1 86 100 A28 28 0 0 1 86 60', p: p, color: c, w: 10 }),
      React.createElement(Draw, { d: 'M86 80 H140 M124 80 V102 M140 80 V96', p: clamp(p * 1.6 - 0.6, 0, 1), color: c, w: 10 })
    );
  },
  cnh: function cnh(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M22 40 H138 V120 H22 Z', p: p, color: c, w: 9 }),
      React.createElement(Draw, { d: 'M58 70 A12 12 0 1 1 58 94 A12 12 0 0 1 58 70 M40 108 C44 98 72 98 76 108 M92 70 H122 M92 88 H122', p: clamp(p * 1.5 - 0.5, 0, 1), color: c, w: 9 })
    );
  },
  renda: function renda(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M20 48 H140 V112 H20 Z', p: p, color: c, w: 9 }),
      React.createElement(Draw, { d: 'M80 64 A16 16 0 1 1 80 96 A16 16 0 0 1 80 64 M38 64 V96 M122 64 V96', p: clamp(p * 1.5 - 0.5, 0, 1), color: c, w: 9 })
    );
  },
  casa: function casa(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M24 76 L80 28 L136 76 M40 64 V132 H120 V64', p: p, color: c, w: 9 }),
      React.createElement(Draw, { d: 'M68 132 V100 H92 V132', p: clamp(p * 1.5 - 0.5, 0, 1), color: c, w: 9 })
    );
  }
};

/* 1 · branco — logo escuro; card verde escuro abaixo do logo com pergunta + "0km?" gigante; CTA; carro grande */
function Cover() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var card = easeIO(lt, 0.1, 0.8);
  var car = E.easeOutCubic(clamp((lt - 1.6) / 1.1, 0, 1));
  var big = pop(lt, 1.0, 0.9);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RT.showLogo ? React.createElement(Logo, { dark: true }) : null,
    React.createElement('div', { style: { position: 'absolute', left: 60, right: 60, top: 420, height: 1020, background: TEAL, borderRadius: 64,
        borderBottomRightRadius: 260, clipPath: 'inset(0 0 ' + (1 - card) * 100 + '% 0 round 64px)' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 60, right: 60, top: 530, color: WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } },
      (sc.q || []).map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({}, rise(lt, 0.6 + i * 0.1, 16), { whiteSpace: 'nowrap' }, BOLD(72, 80)) },
          React.createElement(
            'span',
            { style: { position: 'relative' } },
            i === 0 ? React.createElement(
              'span',
              { style: { position: 'absolute', right: '100%', marginRight: 4 } },
              '“'
            ) : null,
            ln
          )
        );
      }),
      React.createElement(
        'div',
        { style: _extends({ color: YEL }, BOLD(250, 230), { letterSpacing: '-0.06em', paddingLeft: '0.06em', whiteSpace: 'nowrap',
            opacity: ease(lt, 1.0, 0.2), transform: 'scale(' + (0.7 + 0.3 * big) + ')', transformOrigin: 'center bottom' }) },
        React.createElement(
          'span',
          { style: { position: 'relative' } },
          sc.big,
          React.createElement(
            'span',
            { style: { position: 'absolute', left: '100%' } },
            '”'
          )
        )
      ),
      React.createElement(
        'div',
        { style: { marginTop: 72, display: 'inline-flex', alignItems: 'center', gap: 18, padding: '20px 20px 20px 40px', alignSelf: 'center',
            background: WHITE, borderRadius: 999, clipPath: 'inset(0 ' + (1 - easeIO(lt, 2.0, 0.6)) * 100 + '% 0 0 round 999px)' } },
        React.createElement(
          'span',
          { style: _extends({ color: TEAL }, REG(44, 52), { letterSpacing: '-0.01em', whiteSpace: 'nowrap' }) },
          rich(sc.cta, TEAL, 800)
        ),
        React.createElement(
          'span',
          { style: { width: 60, height: 60, borderRadius: '50%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement(
            'svg',
            { width: '30', height: '30', viewBox: '0 0 30 30' },
            React.createElement('path', { d: 'M11 7 L19 15 L11 23', fill: 'none', stroke: YEL, strokeWidth: '4', strokeLinecap: 'round', strokeLinejoin: 'round' })
          )
        )
      )
    ),
    React.createElement('img', { src: 'assets/carro-polo.webp', alt: '', style: { position: 'absolute', left: -190, top: 1010, width: 1460, height: 'auto', zIndex: 4,
        opacity: ease(lt, 1.6, 0.3), transform: 'translateX(' + (1 - car) * 1000 + 'px)' } }),
    React.createElement(NextPanel, { lt: lt, dur: sc.dur, color: TEAL, dir: 'up' })
  );
}

/* 2 · verde escuro — bloco centralizado: título + timeline (todos os círculos só com traçado amarelo) */
function Docs() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var items = sc.items || [];
  var R = 56,
      STEP = 210;
  var und = easeIO(lt, 1.2, 0.6);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: TEAL }) },
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center' }, exitOut(lt, sc.dur)) },
      React.createElement(
        'div',
        { style: { color: WHITE } },
        React.createElement(Lines, { list: sc.label, lt: lt, delay: 0.4, step: 0.08, style: REG(56, 68) }),
        React.createElement(Lines, { list: [sc.head], lt: lt, delay: 0.7, style: BOLD(80, 90) }),
        React.createElement(
          'div',
          { style: _extends({}, rise(lt, 0.85, 16), { color: YEL }, BOLD(80, 96), { position: 'relative', display: 'inline-block' }) },
          sc.hl,
          React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 2, height: 6, background: YEL, transform: 'scaleX(' + und + ')', transformOrigin: 'left' } })
        ),
        React.createElement(
          'div',
          { style: { position: 'relative', marginTop: 72 } },
          React.createElement('div', { style: { position: 'absolute', left: R - 1.5, top: R, width: 3, height: STEP * (items.length - 1), background: YEL,
              transform: 'scaleY(' + easeIO(lt, 1.6, 0.6 + 0.55 * items.length) + ')', transformOrigin: 'top' } }),
          items.map(function (it, i) {
            var d0 = 1.8 + i * 0.6;
            return React.createElement(
              'div',
              { key: i, style: { position: 'relative', height: R * 2, marginBottom: i < items.length - 1 ? STEP - R * 2 : 0,
                  display: 'flex', alignItems: 'center', gap: 44 } },
              React.createElement(
                'div',
                { style: { width: R * 2, height: R * 2, flexShrink: 0, borderRadius: '50%', boxSizing: 'border-box', background: TEAL,
                    border: '3px solid ' + YEL, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(' + pop(lt, d0, 0.7) + ')' } },
                React.createElement(
                  'svg',
                  { width: '62', height: '62', viewBox: '0 0 160 160' },
                  IC[it.icon](easeIO(lt, d0 + 0.1, 0.8), WHITE)
                )
              ),
              React.createElement(
                'div',
                { style: _extends({ color: WHITE }, BOLD(54, 64), { whiteSpace: 'nowrap' }, rise(lt, d0 + 0.15, 16)) },
                it.t
              )
            );
          })
        )
      )
    )
  );
}

/* 3 · preto (vídeo) — parágrafo 1 à esquerda; parágrafo 2 à direita, com linha + ponto apontando para ele; tudo embaixo */
function Digital() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var P2X = 400,
      P2Y = 1400,
      LH = 60,
      LY = P2Y + LH / 2 + 2;
  var ln = easeIO(lt, 1.2, 0.8);
  var dot = pop(lt, 1.9, 0.6);
  return React.createElement(
    'div',
    { style: _extends({}, shell) },
    React.createElement(BgVideo, { src: VID_3, start: 0, end: 7.0, speed: 1, overlay: 'rgba(0,0,0,0.3)' }),
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 900,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 70%)' } }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 120, top: 1200, color: WHITE } },
      React.createElement(Lines, { list: sc.p1, lt: lt, delay: 0.3, step: 0.1, style: BOLD(64, 74), accent: WHITE })
    ),
    React.createElement(
      'svg',
      { width: W, height: H, style: { position: 'absolute', inset: 0 } },
      React.createElement(Draw, { d: 'M 0 ' + LY + ' H ' + (P2X - 50), p: ln, color: YEL, w: 3 }),
      React.createElement('circle', { cx: P2X - 36, cy: LY, r: 10, fill: YEL, style: { transform: 'scale(' + dot + ')', transformOrigin: P2X - 36 + 'px ' + LY + 'px' } })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: P2X, top: P2Y, color: WHITE } },
      React.createElement(Lines, { list: sc.p2, lt: lt, delay: 2.0, step: 0.1, style: REG(46, LH), accent: YEL })
    ),
    React.createElement(NextPanel, { lt: lt, dur: sc.dur, color: WHITE, dir: 'left' })
  );
}

/* 4 · branco — título sentence-case à esquerda + fio vertical à direita; pergunta e resposta alinhadas à direita */
function Paper() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var M = 120;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RT.showLogo ? React.createElement(Logo, { dark: true }) : null,
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', inset: 0 }, exitOut(lt, sc.dur)) },
      React.createElement(
        'div',
        { style: { position: 'absolute', left: M, top: 450, color: TEAL } },
        React.createElement(Lines, { list: sc.title, lt: lt, delay: 0.4, step: 0.14, style: BOLD(100, 104), accent: MINT })
      ),
      React.createElement(
        'div',
        { style: { position: 'absolute', left: M, top: 690, color: TEAL } },
        React.createElement(Lines, { list: sc.sub, lt: lt, delay: 1.2, step: 0.09, style: _extends({}, REG(52, 62), { letterSpacing: '-0.02em' }), accent: TEAL })
      ),
      React.createElement('div', { style: { position: 'absolute', right: M + 24, top: 720, width: 3, height: 440, background: MINT,
          transform: 'scaleY(' + easeIO(lt, 1.8, 1.2) + ')', transformOrigin: 'top' } }),
      React.createElement(
        'div',
        { style: { position: 'absolute', right: M, top: 1200, color: TEAL, textAlign: 'right' } },
        React.createElement(Lines, { list: sc.micro, lt: lt, delay: 2.8, step: 0.14, style: BOLD(100, 104), accent: MINT })
      ),
      React.createElement(
        'div',
        { style: { position: 'absolute', right: M, top: 1450, color: TEAL, textAlign: 'right' } },
        React.createElement(Lines, { list: sc.ans, lt: lt, delay: 3.6, step: 0.1, style: _extends({}, REG(52, 62), { letterSpacing: '-0.02em' }), accent: TEAL })
      )
    )
  );
}

/* 5 · preto (vídeo) — "Simples, rápido e prático!" grande e centralizado; frase final normal e centralizada */
function Closing() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var big = sc.big || [];
  return React.createElement(
    'div',
    { style: _extends({}, shell) },
    React.createElement(BgVideo, { src: VID_5, start: 0, end: 3.0, speed: 0.5, overlay: 'rgba(0,0,0,0.45)' }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 120, right: 120, top: 700, textAlign: 'center', color: WHITE } },
      big.map(function (t, i) {
        var p = ease(lt, 0.3 + i * 0.2, 0.6);
        var just = ['flex-start', 'flex-end', 'center'][i % 3];
        return React.createElement(
          'div',
          { key: i, style: { display: 'flex', justifyContent: just } },
          React.createElement(
            'div',
            { style: _extends({}, BOLD(124, 124), { letterSpacing: '-0.045em', whiteSpace: 'nowrap', color: i === big.length - 1 ? YEL : WHITE,
                opacity: p, transform: 'translateX(' + (1 - p) * (i % 2 ? -60 : 60) + 'px)' }) },
            t
          )
        );
      }),
      React.createElement('div', { style: { height: 60 } }),
      React.createElement(Lines, { list: sc.small, lt: lt, delay: 1.3, step: 0.12, style: REG(52, 64) })
    )
  );
}

var LAYOUTS = { cover: Cover, docs: Docs, digital: Digital, paper: Paper, closing: Closing };

function SudesteVideo9() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(function () {
    ['assets/logo-dark.png', 'assets/logo-white.png', 'assets/carro-polo.webp'].forEach(function (src) {
      var im = new Image();im.src = src;if (im.decode) im.decode()['catch'](function () {});
    });
  }, []);
  var scenes = JSON.parse(window.OM_SCENES);
  var children = {};
  scenes.forEach(function (sc) {
    children[sc.name] = LAYOUTS[sc.layout] || Cover;
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
      React.createElement(TweakToggle, { label: 'Vídeo de fundo', value: t.videoBg !== false,
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

window.SudesteVideo9 = SudesteVideo9;
