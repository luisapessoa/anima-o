# Handoff: Sudeste Assinatura — Vídeo 12 "Escolha pela rotina" (Reels 1080×1920, 44s)

## ⚠ READ FIRST — scope is ONLY background video
The design is **final and approved by the client**. Your only job is to put 3 videos into the black areas of Telas 3, 4 and 6.
Previous handoffs broke font sizes, alignment and icons. Do NOT:
- change any `fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`, `fontStyle`, `textAlign`, `top/left/right` value or `borderRadius`
- re-wrap text — every string in the `OM_SCENES` arrays = ONE rendered line (`whiteSpace: nowrap`). Never merge, split or reflow lines
- replace icons with a library (Lucide, Heroicons, emoji…) — they are hand-drawn inline SVG paths in `ICONS` and `RICONS` and **must stay byte-identical**
- swap the font, convert px → rem/vw/%, or make the stage responsive — it is a fixed 1080×1920 canvas scaled as a whole
- "normalize" the corner radii — each shape has deliberately different square/rounded corners (table below)
- restructure components, move styles to CSS/Tailwind, or change timings / transitions
- touch the `**…**` (coloured bold) and `==…==` (yellow highlighter) markers in the copy

**Acceptance test:** compare your render against `reference/01…06-frame.jpg` (times listed below). Everything must be identical except the video now visible in the black areas.

## Run it
`npx serve .` → open `Sudeste Assinatura Video 12.dc.html`. Loops; space = play/pause, ←/→ = seek.
- `scenesSudeste12.jsx` — all screens. **Video support is already wired** — normally you don't need to edit this file at all.
- `window.OM_SCENES` in the `.dc.html` — copy, durations, positions. The ONLY allowed edit: adding the `src`/`video` fields described below.
- `animations-v2.jsx`, `tweaks-panel.jsx`, `support.js` — runtime, don't edit.

## Screens
| # | Scene | Time (s) | Background | Video | Reference frame |
|---|---|---|---|---|---|
| 1 | Tela 1 | 0–7 | `#034845` | — | `01-frame.jpg` @ 3.2s |
| 2 | Tela 2 | 7–14 | `#efeee9` | — | `02-frame.jpg` @ 12.8s |
| 3 | Tela 3 | 14–22 | `#034845` + **black bottom half** | **VIDEO A** (bottom half, y 960→1920) | `03-frame.jpg` @ 21.0s |
| 4 | Tela 4 | 22–29 | black | **VIDEO B** full screen | `04-frame.jpg` @ 27.8s |
| 5 | Tela 5 | 29–37 | `#034845` | — | `05-frame.jpg` @ 35.8s |
| 6 | Tela 6 | 37–44 | black | **VIDEO C** full screen | `06-frame.jpg` @ 43.5s |

Videos: 9:16, 1080×1920, H.264 mp4, muted, **minimum 8s / 7s / 7s** → put them in `videos/videoA.mp4`, `videos/videoB.mp4`, `videos/videoC.mp4`.

## How to add the videos (exact edits in `OM_SCENES`)
1. **Tela 3**: change `bottomVideo: { at: 0.2, top: 960 }` → `bottomVideo: { at: 0.2, top: 960, src: "videos/videoA.mp4", start: 0, end: 8 }`.
   The component `Questions` then renders the video in the area y 960→1920 (`objectFit: cover`) and **keeps the green gradient on top** (`#034845` at the top edge → transparent at 50% of the area) so the video fades out of the green. The third topic chip (y 912–1088) intentionally overlaps the top of the video. Keep the gradient.
2. **Tela 4**: add `video: { src: "videos/videoB.mp4", start: 0, end: 7 }` to the scene object.
3. **Tela 6**: add `video: { src: "videos/videoC.mp4", start: 0, end: 7 }` to the scene object.

`Frame` renders `<VideoBg>` (a `VideoSprite` + darkening overlay `linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 35%, rgba(0,0,0,.85) 100%)`) as the **first child of the moving content layer**, so the video moves with the screen during transitions and stays under logo/text. `VideoSprite` is synced to the timeline clock (scrub + export frame-accurate). No `autoplay`. `NextIn` also paints the incoming video during the transition.
⚠ Scene objects already have a `top` key in some scenes (number = position) — Tela 5 uses `y` because `top` there is the copy array. Don't rename these.

## Typography — must match exactly
Font: **DM Sans** only (Google Fonts in `<helmet>`: weights 300/400/500/700 + italic 300/400). If self-hosted, include the italic files — "modelo", "uso", "vem depois!" are italic.
Helpers (px at the 1080 stage):
- `LIGHT(fs, lh)` = 300, letter-spacing **-0.02em**
- `REG(fs, lh)` = 400, **0em**
- `MED(fs, lh)` = 500, **-0.01em**
- `BOLD(fs, lh)` = 700, **-0.01em**
- `**x**` = coloured accent (yellow on dark, teal on light), weight 700 unless `w` is passed (400/500). `==x==` = teal text on animated yellow highlighter.

| Tela | Element | Style | Position / align |
|---|---|---|---|
| all | Logo | 640px wide | top 200, centered |
| 1 | "“Quero assinar um carro…" | REG 70/84 #efefef | centered, block top 410 |
| 1 | "Mas ainda não sei / qual modelo / escolher!”" | LIGHT 108/108, "modelo" italic 400 #f2ff46 | centered, 14px below intro |
| 1 | Cards | 560×760, radius 52, bg #efefef, top 930, centered | carousel (see below) |
| 1 | Card tag (SUV, Hatch…) | MED 26/32 white on teal, radius `22px 0 22px 0` | top 26 / right 28 |
| 1 | Card car image | 720px wide, left −80, top 50 | — |
| 1 | Card name | BOLD 70/72 teal | centered, top 410 |
| 1 | Card feature (2 lines) | REG 32/38 #4b6260, 2px below name | centered |
| 1 | "Assinar" button | BOLD 34/40 teal on #f2ff46, h 92, radius `46px 0 46px 0` + 92px teal circle with yellow arrow, gap 6 | bottom 30, left/right 30 |
| 2 | "E você não precisa / chegar com essa / decisão tomada." | REG 64/76 teal, last line 700 | left 190, top 450 |
| 2 | L-line | 3px teal: vertical x200 y710 h170 → horizontal y877 w340 | connects paragraph 1 → first line of paragraph 2 |
| 2 | "Antes de / escolher o carro, / vale entender como / ele vai entrar na / sua rotina." | LIGHT 104/108 teal, "rotina." highlighter | **right-aligned**, right 90, top 820 |
| 2 | 3 routine icons (city / rural / family) | 150×150 teal squares, radius `36px 0 36px 0`, 84px yellow stroke icons, gap 70, **no labels** | centered row, top 1480 |
| 3 | Topic chips (×3) | yellow square 176×176 radius `64px 0 0 0` + 10px gap + white #efefef box 740×176 radius `0 0 64px 0` | left 80, tops 420 / 666 / 912 |
| 3 | Chip text | REG 46/56 teal, bold parts 700 | left, padding-left 48 |
| 3 | Chip icons | 92px, stroke teal 2.8 | centered in yellow square |
| 4 | Yellow line | 3px #f2ff46, from x 0 to x 306 at y 1230 (horizontal only) | leads to text |
| 4 | "Essas respostas / ajudam a definir / não só o modelo." | LIGHT 84/96 #efefef, "modelo." yellow 500 | left 340, top 1180 |
| 4 | "Também ajudam na escolha da" | REG 46/58, 44px below | left 340 |
| 4 | Chips "versão · quilometragem · período de contratação" | BOLD 42/50 teal on yellow, padding 14/30, radius `32px 0 32px 0` (all the same), gap 14, wrap | 24px below |
| 5 | "Às vezes, o carro que / … / seu uso." | LIGHT 94/102 #efefef, "uso." italic 500 yellow | centered, top 470 |
| 5 | Vertical line | 3px yellow, x 538.5, y 1015 → 1185 (touches rule 1) | centered |
| 5 | Rules | 3px **yellow**, left/right 130, y 1185 and y 1515 | — |
| 5 | "E descobrir isso / antes de assinar / faz toda diferença." | MED 70/84 #efefef, "toda diferença." highlighter | centered, top 1225 |
| 6 | "Por isso, a escolha / começa pela sua rotina." | REG 56/68 #efefef, "sua rotina." yellow 700 | centered, top 1300 |
| 6 | "O carro vem / depois!" | LIGHT 140/138, "vem" + "depois!" italic 400 yellow | centered, 30px below |

## Icons (inline SVG — keep exactly)
viewBox `0 0 48 48`, `fill="none"`, round caps/joins, drawn on with `pathLength=1` + `strokeDashoffset`.
- `ICONS.gauge` (rodar por mês, + filled centre dot r 2.8), `ICONS.road` (cidade/estrada), `ICONS.size` (espaço — 4 outward arrows). Teal, stroke 2.8.
- `RICONS.city`, `RICONS.rural`, `RICONS.family` (Tela 2). Yellow, stroke 2.6.

## Motion (keep)
- Tela 1 cards: tweak `cardAnim` = `"carrossel"` (approved default): centre card full size, neighbours ±430px, scale 0.8, darker, rotate 6°; swaps at 2.2 / 3.3 / 4.4 / 5.5s (0.65s easeInOut). `"embaralhar"` is an alternative — do not change the default.
- Transitions between screens (`trans` per scene, last 0.9s of each scene): 1→2 `push`, 2→3 `up` (rounded sheet rises), 3→4 `circle` (clip reveal), 4→5 `wipe` (yellow bar sweep), 5→6 `zoom`. All different on purpose.
- Texts rise 18px + fade, staggered per line. Highlighter sweeps in 0.4s.

## Colours
Dark green `#034845` · Sudeste yellow `#f2ff46` (all highlights) · Sudeste white `#efefef` (never #ffffff) · Neutral `#efeee9` (Tela 2 bg) · Black `#000` (video placeholder). Card feature text `#4b6260`.

## Files
- `Sudeste Assinatura Video 12.dc.html` — entry + copy (`OM_SCENES`)
- `scenesSudeste12.jsx` — screens
- `animations-v2.jsx`, `tweaks-panel.jsx`, `support.js` — runtime
- `assets/` — logos (white/dark) + 5 VW car WebPs (Nivus, Polo, Saveiro, T-Cross, Tera)
- `reference/01…06-frame.jpg` — approved frames for visual QA (the stage is shown letterboxed inside the preview)
