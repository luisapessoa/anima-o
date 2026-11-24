/* Sudeste Assinatura — VÍDEO 8 (1080×1920). "Posso viajar com meu carro por assinatura?"
   Telas 1, 3 e 5: preto (vídeo por trás). Tela 2: verde menta. Tela 4: verde escuro.
   A linha da Tela 2 desce pela borda e continua na Tela 3 até o parágrafo. */
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
var BLACK = '#000000',
    TEAL = '#034845',
    MINT = '#00d1b2',
    PALE = '#c6f6d6';
var WHITE = '#ffffff',
    INK = '#03433f';
var FONT = "'DM Sans', system-ui, sans-serif";
var LOGO_W = 640,
    LOGO_TOP = 200;
var LX = 170;var Y3 = 1360; /* y onde a linha sai da Tela 2 e continua na Tela 3 */
var PAN = 0.75; /* duração do deslize Tela 2 → 3 */
var E = Easing;
var RT = { showLogo: true, videoBg: true };

// Vídeos de fundo das Telas 1, 3, 4 e 5 — trechos do "Volks Explica: Elétricos"
// e do "Novo Taos" (VW Brasil), recortados do original para preencher a tela
// vertical inteira, sem nenhuma legenda/UI de tela em cena.
var VID_1 = 'assets/videos/tela1.mp4';
var VID_3 = 'assets/videos/tela3.mp4';
var VID_4 = 'assets/videos/tela4.mp4';
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
function rich(text, accent) {
  return String(text).split('**').map(function (p, i) {
    return i % 2 === 1 ? React.createElement(
      'span',
      { key: i, style: { color: accent, fontWeight: 700 } },
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
/* linha desenhada (SVG path com pathLength=1) */
function Draw(_ref4) {
  var d = _ref4.d;
  var p = _ref4.p;
  var color = _ref4.color;
  var w = _ref4.w;

  return React.createElement('path', { d: d, fill: 'none', stroke: color, strokeWidth: w || 3, strokeLinecap: 'square', pathLength: '1',
    strokeDasharray: '1', strokeDashoffset: 1 - p });
}
var shell = { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK };
var BOLD = function BOLD(fs, lh) {
  return { fontWeight: 700, fontSize: fs, lineHeight: lh + 'px', letterSpacing: '-0.015em' };
};
var REG = function REG(fs, lh) {
  return { fontWeight: 400, fontSize: fs, lineHeight: lh + 'px' };
};
function iris(lt) {
  var r = easeIO(lt, 0, 0.7) * 125;return { clipPath: 'circle(' + r + '% at 50% 50%)' };
}

/* 1 · vídeo no topo; painel verde claro sobe por trás, depois o card entra; aspas simétricas */
function Cover() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var CT = 1270,
      CH = 430,
      MID = CT + CH / 2;
  var bg = E.easeInOutCubic(clamp((lt - 0.3) / 0.8, 0, 1));
  var c = E.easeOutCubic(clamp((lt - 1.0) / 0.8, 0, 1));
  var q1 = pop(lt, 1.6, 0.8),
      q2 = pop(lt, 2.5, 0.8);
  var Q = { position: 'absolute', color: MINT, fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 260, lineHeight: '200px', height: 130, transformOrigin: '50% 50%' };
  return React.createElement(
    'div',
    { style: _extends({}, shell) },
    React.createElement(BgVideo, { src: VID_1, start: 0, end: 3.0, speed: 0.6, scale: 1.08, overlay: 'rgba(0,0,0,0.4)' }),
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, top: MID, bottom: 0, background: PALE, transform: 'translateY(' + (1 - bg) * 100 + '%)' } }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 60, right: 60, top: CT, height: CH, opacity: ease(lt, 1.0, 0.3), transform: 'translateY(' + (1 - c) * 260 + 'px)' } },
      React.createElement(
        'div',
        { style: { position: 'absolute', inset: 0, background: PALE, borderTopRightRadius: 100, borderBottomLeftRadius: 100,
            boxShadow: '0 24px 60px rgba(3,72,69,0.28), 0 6px 16px rgba(3,72,69,0.18)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: TEAL } },
        React.createElement(Lines, { list: sc.a, lt: lt, delay: 1.5, step: 0.12, style: BOLD(88, 96) }),
        React.createElement(Lines, { list: [sc.hl], lt: lt, delay: 1.74, style: BOLD(88, 96) })
      ),
      React.createElement(
        'div',
        { style: _extends({}, Q, { left: 40, top: -34, opacity: ease(lt, 1.6, 0.3), transform: 'scale(' + q1 + ')' }) },
        '“'
      ),
      React.createElement(
        'div',
        { style: _extends({}, Q, { right: 40, bottom: -34, opacity: ease(lt, 2.5, 0.3), transform: 'rotate(180deg) scale(' + q2 + ')' }) },
        '“'
      )
    )
  );
}

/* 2 · verde claro — "Pode, sim." + parágrafo; linha sai de "dia.", desce e vira à direita; no fim a tela desliza para a esquerda */
function Answer() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var TY = 790,
      PT = TY - 34,
      LH = 64;
  var lastRef = React.useRef(null),
      headRef = React.useRef(null),
      paraRef = React.useRef(null);

  var _React$useState3 = React.useState({ endX: 760, dx: 0 });

  var _React$useState32 = _slicedToArray(_React$useState3, 2);

  var m = _React$useState32[0];
  var setM = _React$useState32[1];

  React.useLayoutEffect(function () {
    var el = lastRef.current,
        hd = headRef.current,
        pa = paraRef.current;if (!el || !hd || !pa) return;
    var endX = LX + 72 + el.offsetWidth;
    var pw = 0;Array.from(pa.querySelectorAll('span[data-ln]')).forEach(function (n) {
      pw = Math.max(pw, n.offsetWidth);
    });
    var right = Math.max(120 + hd.offsetWidth, LX + 72 + pw);
    var dx = Math.round((W - (LX + right)) / 2 - 0);
    if (Math.abs(endX - m.endX) > 1 || Math.abs(dx - m.dx) > 1) setM({ endX: endX, dx: dx });
  });
  var endX = m.endX,
      dx = m.dx;
  var n = (sc.body || []).length;
  var ly = PT + (n - 1) * LH + LH / 2 + 4;
  var dur = sc.dur || 6;
  var pan = E.easeInOutCubic(clamp((lt - (dur - PAN)) / PAN, 0, 1));
  var hl = easeIO(lt, 0.9, 0.5);
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: PALE }, iris(lt)) },
    React.createElement(
      'div',
      { style: { position: 'absolute', inset: 0, background: PALE, transform: 'translateX(' + -pan * W + 'px)' } },
      RT.showLogo ? React.createElement(Logo, { dark: true }) : null,
      React.createElement(
        'div',
        { style: _extends({ position: 'absolute', left: 120 + dx, top: 520, color: TEAL }, BOLD(170, 176), { letterSpacing: '-0.04em' }, rise(lt, 0.4, 30)) },
        React.createElement(
          'span',
          { ref: headRef, style: { display: 'inline-block' } },
          sc.head,
          ' ',
          React.createElement(
            'span',
            { style: { position: 'relative', display: 'inline-block' } },
            React.createElement('span', { style: { position: 'absolute', left: -10, right: -10, top: 96, bottom: 20, background: MINT,
                transform: 'scaleX(' + hl + ')', transformOrigin: 'left' } }),
            React.createElement(
              'span',
              { style: { position: 'relative' } },
              sc.word
            )
          )
        )
      ),
      React.createElement(
        'svg',
        { width: W, height: H, style: { position: 'absolute', inset: 0, overflow: 'visible' } },
        React.createElement(Draw, { d: 'M ' + (LX + dx) + ' 718 V ' + TY + ' H ' + (LX + dx + 50), p: easeIO(lt, 1.1, 0.7), color: MINT, w: 4 }),
        React.createElement(Draw, { d: 'M ' + (endX + dx + 20) + ' ' + ly + ' H ' + (endX + dx + 60) + ' V ' + Y3 + ' H ' + W, p: easeIO(lt, 2.9, 1.5), color: MINT, w: 4 })
      ),
      React.createElement('img', { src: 'assets/carro-tcross.png', alt: '', style: { position: 'absolute', left: 40, top: 1040, width: 1000, height: 'auto',
          transform: 'translateX(' + (1 - E.easeOutCubic(clamp((lt - 2.3) / 1.1, 0, 1))) * 1100 + 'px)' } }),
      React.createElement(
        'div',
        { ref: paraRef, style: { position: 'absolute', left: LX + 72 + dx, top: PT, color: TEAL } },
        (sc.body || []).map(function (ln, i) {
          return React.createElement(
            'div',
            { key: i, style: _extends({}, rise(lt, 1.7 + i * 0.1, 16), { whiteSpace: 'nowrap' }, REG(52, LH)) },
            React.createElement(
              'span',
              { 'data-ln': '1', ref: i === n - 1 ? lastRef : null },
              rich(ln, TEAL)
            )
          );
        })
      )
    )
  );
}

/* 3 · preto (vídeo) — continua o deslize; a linha atravessa sobre o parágrafo e termina num círculo */
function Road() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var lineP = easeIO(lt, 0.1, 1.0);
  var dot = pop(lt, 1.05, 0.6);
  return React.createElement(
    'div',
    { style: _extends({}, shell) },
    React.createElement(BgVideo, { src: VID_3, start: 0, end: 7, speed: 0.95, scale: 1.08, overlay: 'rgba(0,0,0,0.4)' }),
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, top: Y3 - 60, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)' } }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'svg',
      { width: W, height: H, style: { position: 'absolute', inset: 0 } },
      React.createElement(Draw, { d: 'M 0 ' + Y3 + ' H 540', p: lineP, color: MINT }),
      React.createElement('circle', { cx: 540, cy: Y3, r: 16, fill: MINT, style: { transform: 'scale(' + dot + ')', transformOrigin: '540px ' + Y3 + 'px' } })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: Y3 + 60, textAlign: 'center', color: WHITE } },
      React.createElement(Lines, { list: sc.body, lt: lt, delay: 1.3, step: 0.1, style: REG(52, 66), accent: MINT })
    )
  );
}

/* 4 · verde escuro — bloco de texto centralizado, entrelinha uniforme; pílulas inclinadas sobre as bordas; vídeo embaixo */
function Assist() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var LINE = _extends({}, BOLD(68, 80), { letterSpacing: '-0.025em' });
  var h24 = Math.round(24 * E.easeOutCubic(clamp((lt - 2.6) / 1.0, 0, 1)));
  var vid = easeIO(lt, 3.0, 0.8);
  var chip = function chip(d0, rot, bg, pos, draw, label) {
    var k = pop(lt, d0, 0.8),
        o = ease(lt, d0, 0.25),
        dr = easeIO(lt, d0 + 0.15, 0.8);
    return React.createElement(
      'div',
      { style: _extends({ position: 'absolute', height: 100, padding: '0 36px 0 26px' }, pos, { borderRadius: 50, background: bg,
          display: 'flex', alignItems: 'center', gap: 12, opacity: o, zIndex: 2, whiteSpace: 'nowrap',
          transform: 'rotate(' + rot + 'deg) scale(' + k + ')' }) },
      React.createElement(
        'svg',
        { width: '58', height: '58', viewBox: '0 0 160 160', style: { overflow: 'visible' } },
        draw(dr)
      ),
      label ? React.createElement(
        'span',
        { style: _extends({ color: TEAL }, BOLD(46, 50), { letterSpacing: 0 }) },
        label
      ) : null
    );
  };
  var shield = function shield(p) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M80 18 L132 38 V80 C132 112 110 134 80 144 C50 134 28 112 28 80 V38 Z', p: p, color: TEAL, w: 16 }),
      React.createElement(Draw, { d: 'M56 82 L74 100 L106 66', p: clamp(p * 1.6 - 0.6, 0, 1), color: TEAL, w: 16 })
    );
  };
  var clock = function clock(p) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Draw, { d: 'M132 80 A52 52 0 1 1 116 42', p: p, color: TEAL, w: 16 }),
      React.createElement(Draw, { d: 'M118 18 V44 H92', p: clamp(p * 1.6 - 0.6, 0, 1), color: TEAL, w: 16 }),
      React.createElement(Draw, { d: 'M80 52 V82 L100 94', p: clamp(p * 1.6 - 0.6, 0, 1), color: TEAL, w: 16 })
    );
  };
  var lines = sc.lines || [];
  return React.createElement(
    'div',
    { style: _extends({}, shell, { background: TEAL }, iris(lt)) },
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 390, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: WHITE } },
      lines.map(function (ln, i) {
        return React.createElement(
          'div',
          { key: i, style: _extends({ position: 'relative' }, LINE, { whiteSpace: 'nowrap' }, rise(lt, 0.4 + i * 0.14, 18)) },
          rich(ln, MINT),
          i === sc.shieldAt ? chip(1.5, -8, PALE, { left: '100%', marginLeft: 14, top: -6, padding: '0 26px' }, shield, null) : null,
          i === sc.clockAt ? chip(2.4, 7, MINT, { right: '100%', marginRight: 14, top: -6 }, clock, h24 + 'h') : null
        );
      })
    ),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: -40, right: -40, top: 980, bottom: -120, background: BLACK,
          borderTopRightRadius: 100, borderBottomLeftRadius: 100, overflow: 'hidden',
          clipPath: 'inset(' + (1 - vid) * 100 + '% 0 0 0 round 0 100px 0 100px)' } },
      vid > 0.001 ? React.createElement(BgVideo, { src: VID_4, start: 0, end: 5.24, speed: 0.64, overlay: 'rgba(0,0,0,0.25)' }) : null
    )
  );
}

/* 5 · preto (vídeo) — linhas desalinhadas em escada + "[ ou seja ]"; "ir mais longe" puxa a linha */
function Closing() {
  var s = useScene();var lt = s.localTime;var sc = s.scene;
  var BIG = _extends({}, BOLD(80, 84), { letterSpacing: '-0.035em' });
  var rows = sc.rows || [];
  return React.createElement(
    'div',
    { style: { position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: FONT, background: BLACK } },
    React.createElement(BgVideo, { src: VID_5, start: 0, end: 4.92, speed: 0.74, scale: 1.08, overlay: 'rgba(0,0,0,0.45)' }),
    React.createElement('div', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: 1100,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' } }),
    RT.showLogo ? React.createElement(Logo, null) : null,
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 0, right: 0, top: 330, color: WHITE } },
      rows.map(function (r, i) {
        var d = 0.3 + i * 0.16,
            p = ease(lt, d, 0.6);
        var far = !!r.far;
        return React.createElement(
          'div',
          { key: i, style: { display: 'flex', alignItems: 'center', gap: 24, paddingLeft: r.x || 0, paddingRight: r.r || 0, justifyContent: r.r != null ? 'flex-end' : 'flex-start', opacity: p,
              transform: 'translateX(' + (1 - p) * (i % 2 ? -50 : 50) + 'px)' } },
          r.tag ? React.createElement(
            'div',
            { style: _extends({ color: MINT }, REG(46, 60), { whiteSpace: 'nowrap' }) },
            '[ ',
            r.tag,
            ' ]'
          ) : null,
          r.t ? React.createElement(
            'div',
            { style: _extends({}, BIG, { color: far ? MINT : WHITE, whiteSpace: 'nowrap' }) },
            r.t
          ) : null
        );
      })
    )
  );
}

var LAYOUTS = { cover: Cover, answer: Answer, road: Road, assist: Assist, closing: Closing };

function SudesteVideo8() {
  var _useTweaks = useTweaks(window.TWEAK_DEFAULTS);

  var _useTweaks2 = _slicedToArray(_useTweaks, 2);

  var t = _useTweaks2[0];
  var setTweak = _useTweaks2[1];

  RT.showLogo = t.showLogo !== false;
  RT.videoBg = t.videoBg !== false;
  React.useEffect(function () {
    ['assets/logo-dark.png', 'assets/logo-white.png'].forEach(function (src) {
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

window.SudesteVideo8 = SudesteVideo8;
