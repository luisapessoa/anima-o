# Handoff: Sudeste Assinatura — Vídeo 11 "A história da assinatura de carros" (Reels 1080×1920)

## ⚠ READ FIRST — scope is ONLY background video
The design is **final and approved**. Your only job is to put background videos into the 3 black screens.
Previous handoffs broke font sizes, text alignment and icons. Do NOT:
- change any `fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`, `fontStyle`, or `textAlign`
- re-wrap text (every line break is intentional; each string in the `OM_SCENES` arrays = one rendered line, `whiteSpace: nowrap`)
- replace the icons with an icon library (Lucide, Heroicons, emoji…) — they are hand-drawn inline SVG paths in `ICONS` and **must stay as-is**
- swap the font, convert px to rem/vw, or "responsive-ize" the stage — it is a fixed 1080×1920 canvas scaled as a whole
- edit path strings, dot coordinates or keyframes in `OM_SCENES`
- restructure components or move styles into CSS files/Tailwind

**Acceptance test:** compare your render frame-by-frame against `reference/01…06-frame.jpg`. Text, line, dots and icons must be pixel-identical except for the video now visible behind black screens.

## Run it
`npx serve .` → open `Sudeste Assinatura Video 11.dc.html`. Loops; space = play/pause, ←/→ = seek.
- `scenesSudeste11.jsx` — all screens (**only file to edit**)
- `window.OM_SCENES` in the `.dc.html` — copy, durations, line paths (don't touch)

## Screens & where video goes
| # | Scene name | Start–end (s) | Theme | Video |
|---|---|---|---|---|
| 1 | Tela 1 | 0–6 | `black` | **VIDEO A** full screen |
| 2 | Tela 2 + 3 | 6–18 | `pale` #c6f6d6 | — |
| 3 | Tela 4 | 18–25 | `black` | **VIDEO B** full screen |
| 4 | Tela 5 + 6 | 25–37 | `teal` #034845 | — |
| 5 | Tela 7 | 37–45 | `teal` #034845 | — |
| 6 | Tela 8 | 45–51 | `black` | **VIDEO C** full screen |

All three videos: 9:16, 1080×1920, H.264 mp4, at least 6s / 7s / 6s respectively → `videos/videoA.mp4`, `videos/videoB.mp4`, `videos/videoC.mp4`.

## How to add the video (exact steps)
Every screen renders through `Frame({ theme, … })`. Its structure is:
```
<div shell background=th.bg>            ← root
  <div translateX(-p*W)>                ← sliding content (logo, line, texts)
  <NextIn p={p}/>                       ← incoming panel during push transition
```
1. Create `BgVideo({ src })`: `<video muted playsInline preload="auto">`, style `position:absolute; inset:0; width:100%; height:100%; objectFit:'cover'`. **No autoplay attribute.** Sync to the scene clock:
   `const t = useScene().localTime;` in a `useLayoutEffect`, if `Math.abs(v.currentTime - t) > 0.08` → `v.currentTime = t`; play when the timeline plays, pause otherwise. (Frame-accurate scrub + export.)
2. Add an optional `video` prop to `Frame`. When set, render `<BgVideo src={video}/>` **as the first child of the sliding content div** (so the video slides out with the screen during the push), followed by a legibility overlay:
   - Tela 1: `rgba(0,0,0,0.45)` full-screen.
   - Tela 4 and Tela 8 (text at the bottom, y≈1300–1800): `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.15) 100%)`.
3. Pass the video:
   - `Cover` → `<Frame theme="black" video="videos/videoA.mp4" …>`
   - `Timeline` → `video={sc.video}`; add `video: "videos/videoB.mp4"` to scene "Tela 4" and `video: "videos/videoC.mp4"` to "Tela 8" in `OM_SCENES` (this is the ONLY allowed edit there).
4. Keep `zIndex`/DOM order: video + overlay must sit **under** the line `<svg>` and text. Do not set zIndex on texts.
5. `NextIn` (incoming panel) paints a solid colour for the next screen. For black→video screens leave it black — the cut to the real scene happens at the end of the push, where the video starts at t=0.

## Typography — must match exactly
Font: **DM Sans** (Google Fonts, loaded in `<helmet>` with weights 300/400/500/700 + italic 300/400). Must stay loaded before first paint. If you inline/self-host it, include the **italic 300/400** files — Tela 1 "assinar" is italic.
Helpers in code (px at 1080 stage):
- `LIGHT(fs, lh)` = weight 300, letter-spacing -0.045em
- `REG(fs, lh)` = weight 400, -0.01em
- `BOLD(fs, lh)` = weight 700, -0.03em
- Highlight `**text**` → weight 700 (or 400/500 where `w` is passed) in accent colour.

| Screen | Element | Style | Align |
|---|---|---|---|
| 1 | "Hoje você assina…" | LIGHT 66/76, white, bold part 700 | left; whole block centered on stage |
| 1 | "Mas quem… um carro?" | LIGHT 116/112, "assinar" italic pale | left, indented 240px inside block |
| 1 | L-line | 3px #c6f6d6, vertical 82px + horizontal 180px | — |
| 2 | Topic labels | BOLD 68/74 teal | Havaí left / Estados Unidos right |
| 2 | Topic body | REG 48/60 teal | same as label |
| 3 | Title | LIGHT 72/82 white | left, block centered |
| 3 | Sub | REG 52/64 white | left, block centered |
| 4 | Labels / body | BOLD 68/74 · REG 48/60, white | Brasil left / Montadoras right |
| 5 | "Novembro de" | LIGHT 100/104 white | centered |
| 5 | "2020" | weight 400, 210/200, #c6f6d6 + 150px rules each side | centered |
| 5 | Body | REG 50/64 white | centered |
| 6 | Title | LIGHT 80/88 white | centered |
| 6 | "Você já conhecia essa história?" | BOLD 54/64 #c6f6d6 | centered, ONE line |

Topic side margins: 130px. Logo: 640px wide, top 200, centered.

## Icons (inline SVG — keep)
`ICONS` map, viewBox 0 0 48 48, rendered 64×64, stroke 2.6, round caps/joins, no fill, drawn on with stroke-dashoffset:
`palm` (Havaí), `flag` (Estados Unidos), `pin` (Brasil), `factory` (Montadoras). Colour = theme accent (teal on pale, #c6f6d6 on dark).

## The timeline line (keep)
One continuous line runs through all screens. Each scene's `path` exits at x=1120 and the next scene's path enters at x=-40 at the **same y** with straight `L` stubs, and the screen transition is a horizontal **push** (current slides left, next slides in from the right, `PUSH = 0.9s`). The line keeps drawing during the push. Don't change paths, `keys`, `dots`, `PUSH` or `HEAD`.
Line/dots: 4px stroke, dots r=20 — teal on pale, #c6f6d6 on black/teal.

## Tela 7 cars
Tera (front, 1100px), T-Cross (left, 760px), Saveiro (right, 760px, mirrored). `FlippedCar` re-mirrors the plate and "ROBUST" lettering so they stay readable — keep that component.

## Colours
Dark green `#034845` · Mint/pale `#c6f6d6` (backgrounds + accents on dark) · White · Black (video placeholder). Verde-água `#00d1b2` is NOT used in this video.

## Files
- `Sudeste Assinatura Video 11.dc.html` — entry + copy
- `scenesSudeste11.jsx` — screens (edit here, only for video)
- `animations-v2.jsx`, `tweaks-panel.jsx`, `support.js` — runtime (don't edit)
- `assets/` — logos, 3 car PNG/WebPs
- `reference/01…06-frame.jpg` — approved frames (one per screen) for visual QA
