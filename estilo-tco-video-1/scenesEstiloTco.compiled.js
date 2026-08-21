(function(){
// estilo-scene.jsx — Estilo Assinaturas TCO explainer, built on animations-v3.jsx
var useComposition = window.useComposition;
var Easing = window.Easing;
var animate = window.animate;
var clamp = window.clamp;
var NAVY = '#000051';
var BLUE = '#173ded';
var WHITE = '#ffffff';
var BLACK = '#000000';
var FONT = "'Urbanist', sans-serif";
var SCENE_ORDER = ['Tela 1', 'Tela 2', 'Tela 3', 'Tela 4', 'Tela 5', 'Tela 6', 'Tela 7', 'Tela 8'];
var TRANSITIONS = ['up', 'down', 'left', 'right', 'fade', 'up', 'down'];
var BG_KIND = {
  'Tela 1': 'black',
  'Tela 2': 'white',
  'Tela 3': 'black',
  'Tela 4': 'white',
  'Tela 5': 'blue',
  'Tela 6': 'black',
  'Tela 7': 'white',
  'Tela 8': 'black'
};
var BG_COLOR = {
  black: BLACK,
  blue: BLUE,
  white: WHITE
};
// Vídeo nos 4 fundos pretos — clipes a velocidade natural (sem desacelerar),
// tocando em loop para preencher a duração da tela quando mais curtos que ela.
var BG_VIDEO = {
  'Tela 1': 'assets/bg-1',
  'Tela 3': 'assets/bg-3',
  'Tela 6': 'assets/bg-6',
  'Tela 8': 'assets/bg-8'
};

// three motion helpers, used everywhere
var MOTION = {
  enter: function (T, start, dur, dist) {
    dur = dur || 0.55;
    dist = dist == null ? 28 : dist;
    var p = clamp((T - start) / dur, 0, 1);
    var e = Easing.easeOutCubic(p);
    return {
      opacity: e,
      transform: 'translateY(' + (1 - e) * dist + 'px)'
    };
  },
  draw: function (T, start, dur) {
    dur = dur || 0.6;
    return clamp((T - start) / dur, 0, 1);
  },
  pop: function (T, start, dur) {
    dur = dur || 0.5;
    var p = clamp((T - start) / dur, 0, 1);
    var e = Easing.easeOutBack(p);
    return {
      opacity: clamp(p * 3, 0, 1),
      transform: 'scale(' + e + ')'
    };
  }
};
function wipeFor(T, name, i, CUES, cornerR) {
  if (i === 0) return {};
  var start = CUES[name] - 0.45,
    end = CUES[name] + 0.05;
  var p = animate({
    from: 0,
    to: 1,
    start: start,
    end: end,
    ease: Easing.easeOutCubic
  })(T);
  var kind = TRANSITIONS[(i - 1) % TRANSITIONS.length];
  var r = Math.min(56 * (1 - p), cornerR);
  var q = 1 - p;
  switch (kind) {
    case 'down':
      return {
        transform: 'translateY(' + -100 * q + '%)',
        borderBottomLeftRadius: r,
        borderBottomRightRadius: r
      };
    case 'left':
      return {
        transform: 'translateX(' + -100 * q + '%)',
        borderTopRightRadius: r,
        borderBottomRightRadius: r
      };
    case 'right':
      return {
        transform: 'translateX(' + 100 * q + '%)',
        borderTopLeftRadius: r,
        borderBottomLeftRadius: r
      };
    case 'fade':
      return {
        opacity: p,
        transform: 'scale(' + (0.94 + 0.06 * p) + ')'
      };
    case 'iris':
      return {
        clipPath: 'circle(' + p * 75 + '% at 50% 50%)'
      };
    case 'diagTL':
      return {
        transform: 'translate(' + -100 * q + '%, ' + -34 * q + '%)',
        borderBottomRightRadius: Math.min(r * 1.4, cornerR)
      };
    case 'diagBR':
      return {
        transform: 'translate(' + 100 * q + '%, ' + 34 * q + '%)',
        borderTopLeftRadius: Math.min(r * 1.4, cornerR)
      };
    default:
      return {
        transform: 'translateY(' + 100 * q + '%)',
        borderTopLeftRadius: r,
        borderTopRightRadius: r
      };
  }
}
function logoNavyOpacity(T, CUES) {
  var baseVal = BG_KIND[SCENE_ORDER[0]] === 'white' ? 1 : 0;
  for (var i = 1; i < SCENE_ORDER.length; i++) {
    var name = SCENE_ORDER[i];
    var start = CUES[name] - 0.45,
      end = CUES[name] + 0.05;
    if (T <= start) break;
    var prevLight = BG_KIND[SCENE_ORDER[i - 1]] === 'white' ? 1 : 0;
    var currLight = BG_KIND[name] === 'white' ? 1 : 0;
    var p = animate({
      from: 0,
      to: 1,
      start: start,
      end: end,
      ease: Easing.easeOutCubic
    })(T);
    baseVal = prevLight * (1 - p) + currLight * p;
  }
  return baseVal;
}
function Line(props) {
  return /*#__PURE__*/React.createElement("div", {
    style: Object.assign({
      position: 'absolute',
      background: BLUE
    }, props.style)
  });
}
function Dot(props) {
  return /*#__PURE__*/React.createElement("div", {
    style: Object.assign({
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      background: BLUE
    }, props.style)
  });
}

// Logo: real brand PNGs, cross-fading color by background, fixed position/size
// matching the reference screenshot (centered, ~26% of canvas width).
var LOGO_TOP = 260;
var LOGO_WIDTH = 280;
function Logo(props) {
  var navyOp = logoNavyOpacity(props.T, props.CUES);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: LOGO_TOP,
      left: '50%',
      transform: 'translateX(-50%)',
      width: LOGO_WIDTH,
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/estilo/logo-navy.png",
    alt: "Estilo Assinaturas",
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      display: 'block',
      opacity: navyOp
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/estilo/logo-white.png",
    alt: "Estilo Assinaturas",
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      display: 'block',
      opacity: 1 - navyOp
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      paddingTop: 824 / 1958 * 100 + '%'
    }
  }));
}
var PAD = 96;
var TOP = 470; // safe top offset below the fixed logo for every scene

function Tela1(T, CUES) {
  var s = CUES['Tela 1'];
  var box = MOTION.enter(T, s + 0.25, 0.6, 60);
  var l1 = MOTION.enter(T, s + 0.55);
  var l2 = MOTION.enter(T, s + 0.85);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      right: 64,
      bottom: -20,
      borderRadius: 44,
      textAlign: 'center',
      background: BLUE,
      padding: '112px 64px 260px',
      opacity: box.opacity,
      transform: box.transform
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1.24,
      color: WHITE,
      opacity: l1.opacity,
      transform: l1.transform
    }
  }, "Voc\xEA conhece o custo", /*#__PURE__*/React.createElement("br", null), "total de ter um carro?"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 48
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 50,
      lineHeight: 1.3,
      color: WHITE,
      opacity: l2.opacity,
      transform: l2.transform
    }
  }, "Ou costuma considerar", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 700
    }
  }, "apenas"), " o valor da parcela?")));
}
function Tela2(T, CUES) {
  var s = CUES['Tela 2'];
  var title = MOTION.enter(T, s + 0.15);
  var b1 = MOTION.enter(T, s + 0.5);
  var b2 = MOTION.enter(T, s + 0.8);
  var nested = MOTION.enter(T, s + 1.15);
  var icon = MOTION.pop(T, s + 1.5, 0.55);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: PAD + 'px',
      paddingTop: 480,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 10,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1.26,
      color: NAVY,
      textAlign: 'left',
      opacity: title.opacity,
      transform: title.transform
    }
  }, "Na hora de escolher um", /*#__PURE__*/React.createElement("br", null), "carro, \xE9 comum come\xE7ar", /*#__PURE__*/React.createElement("br", null), "por perguntas como:"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 96,
      marginLeft: 10
    }
  }, /*#__PURE__*/React.createElement(Line, {
    style: {
      left: 10,
      top: 32,
      width: 4,
      height: 112,
      opacity: Math.min(b1.opacity, b2.opacity)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 10,
      top: 144,
      width: 66,
      height: 107,
      borderLeft: '4px solid ' + BLUE,
      borderBottom: '4px solid ' + BLUE,
      borderBottomLeftRadius: 32,
      opacity: nested.opacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      height: 64
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    style: {
      position: 'relative',
      left: 0,
      top: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      opacity: b1.opacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 50,
      color: NAVY,
      opacity: b1.opacity,
      transform: b1.transform
    }
  }, "\u201CQual \xE9 o valor da entrada?\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 48
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      height: 64
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    style: {
      position: 'relative',
      left: 0,
      top: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      opacity: b2.opacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 50,
      color: NAVY,
      opacity: b2.opacity,
      transform: b2.transform
    }
  }, "\u201CQuanto fica a parcela?")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 96,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 54,
      lineHeight: 1.3,
      color: NAVY,
      opacity: nested.opacity,
      transform: nested.transform
    }
  }, "Esses valores s\xE3o", /*#__PURE__*/React.createElement("br", null), "importantes, mas", /*#__PURE__*/React.createElement("br", null), "representam apenas", /*#__PURE__*/React.createElement("br", null), "uma parte da decis\xE3o")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      left: 70,
      marginTop: 70,
      width: 380,
      opacity: icon.opacity,
      transform: icon.transform
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/estilo/question-icon.png",
    alt: "",
    style: {
      width: '100%',
      display: 'block'
    }
  })));
}
function Tela3(T, CUES) {
  var s = CUES['Tela 3'];
  var title = MOTION.enter(T, s + 0.2);
  var body = MOTION.enter(T, s + 0.55);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      background: BLUE,
      borderBottomLeftRadius: 64,
      borderBottomRightRadius: 64,
      paddingTop: TOP,
      paddingBottom: 120,
      paddingLeft: PAD,
      paddingRight: PAD,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 46,
      lineHeight: 1.25,
      color: WHITE,
      whiteSpace: 'nowrap',
      opacity: title.opacity,
      transform: title.transform
    }
  }, "Existe um conceito chamado TCO."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 44,
      lineHeight: 1.4,
      color: WHITE,
      opacity: body.opacity,
      transform: body.transform
    }
  }, "A sigla significa Custo Total de Propriedade e re\xFAne os diferentes valores envolvidos na compra, no uso e na manuten\xE7\xE3o de um ve\xEDculo ao longo do tempo.")));
}
var LISTA_ITEMS = ['Entrada;', 'Parcelas e Juros;', 'IPVA;', 'Seguro;', 'Documentação;', 'Licenciamento;'];
function Tela4(T, CUES) {
  var s = CUES['Tela 4'];
  var title = MOTION.enter(T, s + 0.15);
  var closing = MOTION.enter(T, s + 2.0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: PAD + 'px',
      paddingTop: 380,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 60,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1.26,
      color: NAVY,
      textAlign: 'left',
      opacity: title.opacity,
      transform: title.transform
    }
  }, "Dependendo da forma", /*#__PURE__*/React.createElement("br", null), "de aquisi\xE7\xE3o, essa conta", /*#__PURE__*/React.createElement("br", null), "pode incluir:"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 52,
      marginLeft: -PAD
    }
  }, LISTA_ITEMS.map(function (item, i) {
    var it = MOTION.enter(T, s + 0.5 + i * 0.18);
    return /*#__PURE__*/React.createElement("div", {
      key: item,
      style: {
        position: 'relative',
        height: 70,
        opacity: it.opacity,
        transform: it.transform
      }
    }, /*#__PURE__*/React.createElement(Line, {
      style: {
        left: 0,
        top: 32,
        width: PAD + 40,
        height: 4
      }
    }), /*#__PURE__*/React.createElement(Dot, {
      style: {
        left: PAD + 30,
        top: 25,
        width: 24,
        height: 24,
        borderRadius: 12
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: PAD + 108,
        top: 4,
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: 54,
        color: NAVY
      }
    }, item));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      marginLeft: 60,
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 54,
      lineHeight: 1.32,
      color: NAVY,
      textAlign: 'left',
      opacity: closing.opacity,
      transform: closing.transform
    }
  }, "Considerar todos esses pontos", /*#__PURE__*/React.createElement("br", null), "ajuda a ter uma ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: BLUE,
      fontWeight: 700
    }
  }, "vis\xE3o mais"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", {
    style: {
      color: BLUE,
      fontWeight: 700
    }
  }, "completa do investimento.")));
}
function Tela5(T, CUES) {
  var s = CUES['Tela 5'];
  var title = MOTION.enter(T, s + 0.15);
  var closing = MOTION.enter(T, s + 2.1);
  var p1 = MOTION.pop(T, s + 0.55);
  var p2 = MOTION.pop(T, s + 0.78);
  var p3 = MOTION.pop(T, s + 1.01);
  var p4 = MOTION.pop(T, s + 1.24);
  function pill(text, motion) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: WHITE,
        color: BLUE,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 50,
        borderRadius: 24,
        padding: '20px 30px',
        opacity: motion.opacity,
        transform: motion.transform,
        whiteSpace: 'nowrap'
      }
    }, text);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: PAD + 'px',
      paddingTop: 360,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 60,
      textAlign: 'center',
      color: WHITE,
      opacity: title.opacity,
      transform: title.transform
    }
  }, "Tamb\xE9m fazem", /*#__PURE__*/React.createElement("br", null), "parte do custo de uso:"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 52,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 44,
      width: '100%'
    }
  }, pill('manutenção preventiva', p1), pill('manutenção corretiva', p2), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 36
    }
  }, pill('revisões', p3), pill('troca de pneus', p3)), pill('eventuais imprevistos', p4)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 52,
      lineHeight: 1.32,
      textAlign: 'center',
      color: WHITE,
      opacity: closing.opacity,
      transform: closing.transform
    }
  }, "Cada modelo, rotina e", /*#__PURE__*/React.createElement("br", null), "per\xEDodo de uso pode gerar", /*#__PURE__*/React.createElement("br", null), "uma realidade diferente."));
}
function Tela6(T, CUES) {
  var s = CUES['Tela 6'];
  var title = MOTION.enter(T, s + 0.15);
  var line = MOTION.draw(T, s + 0.6, 0.9);
  var body = MOTION.enter(T, s + 1.4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: PAD + 'px',
      paddingTop: TOP,
      paddingBottom: 120,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 1.3,
      color: WHITE,
      opacity: title.opacity,
      transform: title.transform
    }
  }, "Al\xE9m dos valores financeiros,", /*#__PURE__*/React.createElement("br", null), "tamb\xE9m existe o tempo dedicado", /*#__PURE__*/React.createElement("br", null), "\xE0 gest\xE3o do ve\xEDculo."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 4,
      height: 780 * line,
      background: BLUE,
      alignSelf: 'flex-start',
      marginLeft: 20
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 48,
      lineHeight: 1.35,
      color: WHITE,
      opacity: body.opacity,
      transform: body.transform
    }
  }, "Organizar documentos, contratar", /*#__PURE__*/React.createElement("br", null), "seguro, acompanhar revis\xF5es e planejar", /*#__PURE__*/React.createElement("br", null), "uma futura troca tamb\xE9m fazem parte", /*#__PURE__*/React.createElement("br", null), "dessa experi\xEAncia."));
}
function Tela7(T, CUES) {
  var s = CUES['Tela 7'];
  var carM = MOTION.enter(T, s + 0.15, 0.7, 40);
  var p1 = MOTION.enter(T, s + 0.9);
  var p2 = MOTION.enter(T, s + 1.3);
  var p3 = MOTION.enter(T, s + 1.6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -210,
      top: TOP - 60,
      width: 420,
      height: 420,
      borderRadius: '50%',
      background: BLUE,
      opacity: carM.opacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -180,
      top: TOP + 120,
      width: 360,
      height: 360,
      borderRadius: '50%',
      background: BLUE,
      opacity: carM.opacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: TOP,
      width: '68%',
      transform: 'translateX(-50%) translateY(' + 40 * (1 - carM.opacity) + 'px)',
      opacity: carM.opacity
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/estilo/car-virtus-crop.png",
    alt: "Volkswagen Virtus",
    style: {
      width: '100%',
      display: 'block',
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: TOP + 440,
      padding: '0 ' + PAD + 'px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 50,
      lineHeight: 1.32,
      textAlign: 'left',
      color: NAVY,
      opacity: p1.opacity,
      transform: p1.transform
    }
  }, "Por isso, antes de escolher", /*#__PURE__*/React.createElement("br", null), "entre compra, financiamento", /*#__PURE__*/React.createElement("br", null), "ou assinatura, vale analisar o", /*#__PURE__*/React.createElement("br", null), "cen\xE1rio completo."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 36
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 50,
      lineHeight: 1.32,
      textAlign: 'left',
      color: BLUE,
      opacity: p2.opacity,
      transform: p2.transform
    }
  }, "Mais do que comparar", /*#__PURE__*/React.createElement("br", null), "parcelas, \xE9 importante", /*#__PURE__*/React.createElement("br", null), "considerar:"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 36,
      marginLeft: -PAD,
      marginRight: -PAD,
      height: 340,
      opacity: p3.opacity,
      transform: p3.transform
    }
  }, /*#__PURE__*/React.createElement(Line, {
    style: {
      left: 0,
      top: 28,
      width: 320,
      height: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: PAD,
      top: 0,
      display: 'inline-block',
      width: 'max-content',
      maxWidth: 650,
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 50,
      lineHeight: 1.32,
      textAlign: 'left',
      color: NAVY
    }
  }, "quanto o carro representa", /*#__PURE__*/React.createElement("br", null), "ao longo do tempo e qual", /*#__PURE__*/React.createElement("br", null), "mobilidade combina melhor", /*#__PURE__*/React.createElement("br", null), "com a sua rotina."))));
}
function Tela8(T, CUES) {
  var s = CUES['Tela 8'];
  var p1 = MOTION.enter(T, s + 0.2);
  var line = MOTION.draw(T, s + 0.9, 0.6);
  var p2 = MOTION.enter(T, s + 1.5);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: PAD + 'px',
      paddingBottom: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 50,
      lineHeight: 1.34,
      color: WHITE,
      opacity: p1.opacity,
      transform: p1.transform
    }
  }, "Cada pessoa tem um perfil, uma", /*#__PURE__*/React.createElement("br", null), "necessidade e uma forma diferente", /*#__PURE__*/React.createElement("br", null), "de se relacionar com o carro."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      height: 64 * line,
      background: BLUE,
      margin: '36px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 50,
      lineHeight: 1.34,
      color: WHITE,
      opacity: p2.opacity,
      transform: p2.transform
    }
  }, "Conhecer o custo total ajuda a", /*#__PURE__*/React.createElement("br", null), "fazer uma escolha mais consciente", /*#__PURE__*/React.createElement("br", null), "e alinhada ao seu momento."));
}
var CONTENT_BY_NAME = {
  'Tela 1': Tela1,
  'Tela 2': Tela2,
  'Tela 3': Tela3,
  'Tela 4': Tela4,
  'Tela 5': Tela5,
  'Tela 6': Tela6,
  'Tela 7': Tela7,
  'Tela 8': Tela8
};
function EstiloPiece(props) {
  var c = useComposition();
  var T = c.T,
    CUES = c.CUES;
  var cornerR = props.cornerRadius != null ? +props.cornerRadius : 40;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      fontFamily: FONT,
      overflow: 'hidden'
    }
  }, SCENE_ORDER.map(function (name, i) {
    var w = wipeFor(T, name, i, CUES, cornerR);
    return /*#__PURE__*/React.createElement("div", {
      key: 'bg-' + name,
      "data-screen-label": name,
      style: Object.assign({
        position: 'absolute',
        inset: 0,
        zIndex: i * 2,
        overflow: 'hidden',
        background: BG_COLOR[BG_KIND[name]]
      }, w)
    }, BG_VIDEO[name] ? /*#__PURE__*/React.createElement("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }, /*#__PURE__*/React.createElement("source", {
      src: BG_VIDEO[name] + '.mp4',
      type: "video/mp4"
    }), /*#__PURE__*/React.createElement("source", {
      src: BG_VIDEO[name] + '.webm',
      type: "video/webm"
    })) : null);
  }), SCENE_ORDER.map(function (name, i) {
    var Content = CONTENT_BY_NAME[name];
    var visible = T >= CUES[name] - 0.05;
    return /*#__PURE__*/React.createElement("div", {
      key: 'ct-' + name,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: i * 2 + 1,
        visibility: visible ? 'visible' : 'hidden'
      }
    }, Content(T, CUES));
  }), /*#__PURE__*/React.createElement(Logo, {
    T: T,
    CUES: CUES
  }));
}
Object.assign(window, {
  EstiloPiece: EstiloPiece
});
})();
