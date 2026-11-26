/* Sudeste Assinatura — VÍDEO 10 (1080×1920). Frota por assinatura PJ.
   1 preta (vídeo, palavras justificadas), 2 branca (caixa + 3 carros), 3 verde-água (2 parágrafos + círculos),
   4 branca com faixa de vídeo à esquerda → faixa abre para a tela 5 preta (vídeo cheio). */
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
    WHITE = '#ffffff',
    YEL = '#f2ff46';
var FONT = "'DM Sans', system-ui, sans-serif";
var LOGO_W = 640,
    LOGO_TOP = 200,
    CAR = 'assets/carro-tera-preto.webp';
var E = Easing;
var RT = { showLogo: true, videoBg: true };
var STRIP_W = 150;

// Vídeo A (Tela 1, capa) e vídeo B (um único clipe contínuo — tocado em
// parte pela faixa estreita da Tela 4 e depois em tela cheia na Tela 5).
var VID_A = 'assets/videos/videoA.mp4';
var VID_B = 'assets/videos/videoB.mp4';

function BgVideo(_ref) {
  var src = _ref.src;
  var start = _ref.start;
  var end = _ref.end;
  var speed = _ref.speed;
  var overlay = _ref.overlay;
  var fixed = _ref.fixed;
  var op = _ref.op;

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
  var videoStyle = fixed ? { position: 'absolute', left: 0, top: 0, width: W, height: H, objectFit: 'cover',
    opacity: ready ? op == null ? 1 : op : 0, transition: 'opacity .25s ease' } : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
    opacity: ready ? op == null ? 1 : op : 0, transition: 'opacity .25s ease' };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: BLACK } }),
    React.createElement(VideoSprite, { src: src, start: start || 0, end: end || 3, speed: speed || 1, onLoadedData: markReady, style: videoStyle }),
    overlay ? React.createElement('div', { style: { position: 'absolute', inset: 0, background: overlay,
        opacity: ready ? 1 : 0, transition: 'opacity .25s ease' } }) : null
  );
}

function ease(lt, delay, d) {
  return E.easeOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function easeIO(lt, delay, d) {
  return E.easeInOutCubic(clamp((lt - (delay || 0)) / (d || 0.65), 0, 1));
}
function pop(lt, delay, d) {
  var x = clamp((lt - delay) / (d || 0.7), 0, 1);return 1 - Math.pow(2, -10 * x) * Math.cos(x * 11);
}
function rise(lt, delay, px, d) {
  var p = ease(lt, delay, d);return { opacity: p, transform: 'translateY(' + (1 - p) * (px == null ? 22 : px) + 'px)' };
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
  var w = _ref2.w;

  return (list || []).map(function (ln, i) {
    return React.createElement(
      'div',
      { key: i, style: _extends({}, rise(lt, (delay || 0) + i * (step || 0.08), 16), { whiteSpace: 'nowrap' }, style) },
      rich(ln, accent, w)
    );
  });
}
function Logo(_ref3) {
  var dark = _ref3.dark;

  return React.createElement('img', { src: dark ? 'assets/logo-dark.png' : 'assets/logo-white.png', alt: 'Sudeste Assinaturas', decoding: 'sync', loading: 'eager',
    style: { position: 'absolute', top: LOGO_TOP, left: '50%', transform: 'translateX(-50%)', width: LOGO_W, height: 'auto', zIndex: 6 } });
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
  return { fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.03em' };
};
var REG = function REG(fs, lh) {
  return { fontWeight: 400, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.01em' };
};
var LIGHT = function LIGHT(fs, lh) {
  return { fontWeight: 300, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.04em' };
};
function exitOut(lt, dur) {
  var p = E.easeInCubic(clamp((lt - (dur - 0.55)) / 0.5, 0, 1));return { opacity: 1 - p, transform: 'translateY(' + -50 * p + 'px)' };
}
/* tela branca com a faixa de vídeo entra deslizando da direita e para exatamente na posição final */
function SlideIn(_ref5) {
  var lt = _ref5.lt;
  var dur = _ref5.dur;

  var p = easeIO(lt, dur - 0.8, 0.8);
  if (p <= 0) return null;
  return React.createElement(
    'div',
    { style: { position: 'absolute', inset: 0, zIndex: 20, background: WHITE, transform: 'translateX(' + (1 - p) * W + 'px)' } },
    React.createElement('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: STRIP_W, background: BLACK } })
  );
}
function NextPanel(_ref6) {
  var lt = _ref6.lt;
  var dur = _ref6.dur;
  var color = _ref6.color;
  var dir = _ref6.dir;

  var p = easeIO(lt, dur - 0.75, 0.75);
  if (p <= 0) return null;
  var clip = dir === 'left' ? 'inset(0 0 0 ' + (1 - p) * 100 + '%)' : 'inset(' + (1 - p) * 100 + '% 0 0 0)';
  return React.createElement('div', { style: { position: 'absolute', inset: 0, background: color, clipPath: clip, zIndex: 20 } });
}

/* ícones (viewBox 160) */
var GEAR = Array.from({ length: 8 }, function (_, i) {
  var a = i * Math.PI / 4,
      c = Math.cos(a),
      sn = Math.sin(a);
  return 'M' + (80 + 46 * c).toFixed(1) + ' ' + (80 + 46 * sn).toFixed(1) + ' L' + (80 + 60 * c).toFixed(1) + ' ' + (80 + 60 * sn).toFixed(1);
}).join(' ');
var IC = {
  doc: function doc(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M44 20 H100 L124 44 V140 H44 Z', p: p, color: c, w: 9 }),
      React.createElement(Draw, { d: 'M62 74 H106 M62 96 H106 M62 118 H90', p: clamp(p * 1.6 - 0.6, 0, 1), color: c, w: 9 })
    );
  },
  lic: function lic(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M80 20 L130 38 V80 C130 110 108 130 80 142 C52 130 30 110 30 80 V38 Z', p: p, color: c, w: 9 }),
      React.createElement(Draw, { d: 'M56 82 L74 100 L106 66', p: clamp(p * 1.6 - 0.6, 0, 1), color: c, w: 9 })
    );
  },
  man: function man(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'g',
        { transform: 'translate(8 8) scale(6)' },
        React.createElement(Draw, { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', p: p, color: c, w: 1.5 })
      )
    );
  },
  rev: function rev(p, c) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M26 38 H134 V138 H26 Z M26 66 H134 M54 22 V48 M106 22 V48', p: p, color: c, w: 9 }),
      React.createElement(Draw, { d: 'M58 102 L74 118 L104 86', p: clamp(p * 1.6 - 0.6, 0, 1), color: c, w: 9 })
    );
  }
};

/* 1 · preto (vídeo) — palavras distribuídas/justificadas na tela, entrando uma a uma */
function Cover() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var rows = sc.rows || [];var k = 0;
  return React.createElement(
    'div',
    { style: _extends({}, shell) },
    React.createElement(BgVideo, { src: VID_A, start: 0, end: 6.7, speed: 1, overlay: 'rgba(0,0,0,0.4)' }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', left: 110, right: 110, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          paddingTop: 120 }, exitOut(lt, sc.dur)) },
      rows.map(function (row, i) {
        return React.createElement(
          'div',
          { key: i, style: { display: 'flex', justifyContent: row.length === 1 ? i % 2 ? 'flex-end' : 'flex-start' : 'space-between' } },
          row.map(function (w, j) {
            var d = 0.3 + k++ * 0.11;
            var hl = (sc.hl || []).indexOf(i + ':' + j) >= 0;
            return React.createElement(
              'div',
              { key: j, style: _extends({}, BOLD(128, 124), { letterSpacing: '-0.045em', whiteSpace: 'nowrap', color: hl ? MINT : WHITE }, rise(lt, d, 40, 0.55)) },
              w
            );
          })
        );
      })
    )
  );
}

/* 2 · branco — caixa verde escuro com a pergunta, seta, texto; 1 carro → 3 carros (frota) */
function Fleet() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var box = easeIO(lt, 0.2, 0.7);
  var spread = easeIO(lt, sc.spreadAt || 3.6, 1.1);
  var car0 = ease(lt, 1.4, 0.9);
  var CW = 1180;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RT.showLogo ? React.createElement(Logo, { dark: true }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 90, right: 90, top: 440, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      React.createElement(
        'div',
        { style: { alignSelf: 'stretch', position: 'relative', background: MINT, padding: '64px 40px 80px', textAlign: 'center',
            clipPath: 'inset(0 0 ' + (1 - box) * 100 + '% 0)' } },
        React.createElement(Lines, { list: sc.box, lt: lt, delay: 0.5, step: 0.12, style: _extends({}, LIGHT(92, 98), { color: TEAL }), accent: TEAL, w: 600 })
      ),
      React.createElement(
        'div',
        { style: { marginTop: -50, width: 100, height: 100, borderRadius: '50%', background: WHITE, position: 'relative', zIndex: 2,
            boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(' + pop(lt, 1.1, 0.6) + ')' } },
        React.createElement(
          'svg',
          { width: '46', height: '46', viewBox: '0 0 46 46' },
          React.createElement('path', { d: 'M23 8 V37 M12 26 L23 37 L34 26', fill: 'none', stroke: TEAL, strokeWidth: '4', strokeLinecap: 'round', strokeLinejoin: 'round' })
        )
      ),
      React.createElement(
        'div',
        { style: { marginTop: 40, textAlign: 'center', color: TEAL } },
        React.createElement(Lines, { list: sc.sub, lt: lt, delay: 1.6, step: 0.12, style: REG(52, 64), accent: TEAL })
      )
    ),
    [-1, 1].map(function (side) {
      return React.createElement('img', { key: side, src: CAR, alt: '', style: { position: 'absolute', left: (W - CW) / 2, top: 1210, width: CW, height: 'auto', zIndex: 2,
          opacity: spread > 0 ? 1 : 0, filter: 'brightness(' + (1 + 0.15 * spread) + ')', transformOrigin: '50% 80%',
          transform: 'translate(' + side * 330 * spread + 'px, ' + -110 * spread + 'px) scale(' + (1 - 0.22 * spread) + ')' } });
    }),
    React.createElement('img', { src: CAR, alt: '', style: { position: 'absolute', left: (W - CW) / 2, top: 1210, width: CW, height: 'auto', zIndex: 3,
        opacity: car0, transform: 'translateY(' + (1 - car0) * 60 + 'px) scale(1)' } }),
    React.createElement(NextPanel, { lt: lt, dur: sc.dur, color: MINT, dir: 'up' })
  );
}

/* 3 · verde-água — parágrafo em cima, seta ligando ao parágrafo de baixo; círculos com ícones */
function Care() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var items = sc.items || [];
  var D = 200,
      OV = 18,
      rowW = items.length * D - (items.length - 1) * OV;
  var ln = easeIO(lt, 1.8, 0.8);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: MINT }) },
    RT.showLogo ? React.createElement(Logo, { dark: true }) : null,
    React.createElement(
      'div',
      { style: _extends({ position: 'absolute', inset: 0 }, exitOut(lt, sc.dur)) },
      React.createElement(
        'div',
        { style: { position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', color: TEAL, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement(Lines, { list: sc.top, lt: lt, delay: 0.4, step: 0.12, style: LIGHT(68, 76), accent: TEAL, w: 600 })
      ),
      React.createElement(
        'svg',
        { width: W, height: H, style: { position: 'absolute', inset: 0 } },
        React.createElement(Draw, { d: 'M540 830 V1110', p: ln, color: TEAL, w: 3 }),
        React.createElement(Draw, { d: 'M522 1092 L540 1110 L558 1092', p: clamp(ln * 3 - 2, 0, 1), color: TEAL, w: 3 })
      ),
      React.createElement(
        'div',
        { style: { position: 'absolute', left: 0, right: 0, top: 1160, textAlign: 'center', color: TEAL, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        React.createElement(Lines, { list: sc.bottom, lt: lt, delay: 2.5, step: 0.1, style: REG(50, 62), accent: TEAL })
      ),
      React.createElement(
        'div',
        { style: { position: 'absolute', left: (W - rowW) / 2, top: 1460, width: rowW, height: D } },
        items.map(function (it, i) {
          var d0 = 3.6 + i * 0.35;
          return React.createElement(
            'div',
            { key: i, style: { position: 'absolute', left: i * (D - OV), top: 0, width: D, height: D, borderRadius: '50%', boxSizing: 'border-box',
                border: '3px solid ' + TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'scale(' + pop(lt, d0, 0.7) + ')' } },
            React.createElement(
              'svg',
              { width: '92', height: '92', viewBox: '0 0 160 160' },
              IC[it.icon](easeIO(lt, d0 + 0.15, 0.8), TEAL)
            )
          );
        })
      )
    ),
    React.createElement(NextPanel, { lt: lt, dur: sc.dur, color: WHITE, dir: 'left' })
  );
}

/* 4 · branco com faixa de vídeo à esquerda; no fim, a faixa abre da esquerda p/ direita e vira a tela 5 */
function Strip() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var SW = STRIP_W,
      X = 250;
  var inW = easeIO(lt, 0.1, 0.7) * SW;
  var open = E.easeInOutCubic(clamp((lt - (sc.dur - 1.0)) / 1.0, 0, 1));
  var stripW = inW + (W - SW) * open;
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: WHITE }) },
    RT.showLogo ? React.createElement('img', { src: 'assets/logo-dark.png', alt: 'Sudeste Assinaturas', style: { position: 'absolute', top: LOGO_TOP, left: X, width: 520, height: 'auto' } }) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: X, top: 480, color: TEAL } },
      React.createElement(Lines, { list: sc.title, lt: lt, delay: 0.6, step: 0.14, style: LIGHT(118, 118), accent: MINT, w: 600 })
    ),
    React.createElement('div', { style: { position: 'absolute', left: X, top: 980, width: 420, height: 4, background: MINT, transform: 'scaleX(' + easeIO(lt, 1.4, 0.7) + ')', transformOrigin: 'left' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: X, top: 1086, color: TEAL } },
      React.createElement(Lines, { list: sc.body, lt: lt, delay: 1.8, step: 0.1, style: REG(52, 64), accent: TEAL })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: stripW, overflow: 'hidden', zIndex: 10 } },
      React.createElement(BgVideo, { src: VID_B, start: 0, end: 7, speed: 1, fixed: true })
    )
  );
}

/* 5 · preto (vídeo cheio) — informações na parte de baixo */
function Closing() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  return React.createElement(
    'div',
    { style: _extends({}, shell) },
    React.createElement(BgVideo, { src: VID_B, start: 7, end: 13, speed: 1, fixed: true, overlay: 'rgba(0,0,0,0.35)' }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { color: WHITE } },
        React.createElement(Lines, { list: sc.head, lt: lt, delay: 0.4, step: 0.12, style: BOLD(76, 82) }),
        React.createElement('div', { style: { width: 120, height: 6, background: MINT, margin: '44px 0 40px', transform: 'scaleX(' + easeIO(lt, 1.0, 0.6) + ')', transformOrigin: 'left' } }),
        React.createElement(Lines, { list: sc.sub, lt: lt, delay: 1.2, step: 0.12, style: REG(52, 64), accent: MINT })
      )
    )
  );
}

var LAYOUTS = { cover: Cover, fleet: Fleet, care: Care, strip: Strip, closing: Closing };

function SudesteVideo10() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(function () {
    ['assets/logo-dark.png', 'assets/logo-white.png', CAR].forEach(function (src) {
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
      React.createElement(TweakToggle, { label: 'Vídeo de fundo', value: t.videoBg !== false, onChange: function (v) {
          return setTweak('videoBg', v);
        } }),
      React.createElement(TweakSection, { label: 'Edição' }),
      React.createElement(TweakToggle, { label: 'Editor de tempo', value: t.motionEditor, onChange: function (v) {
          return setTweak('motionEditor', v);
        } })
    )
  );
}

window.SudesteVideo10 = SudesteVideo10;
/* área do vídeo (mesmo vídeo da tela 5) — janela estreita revelando a borda esquerda do quadro cheio */
