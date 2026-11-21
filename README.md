# Lantern Lane — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Halimcuk/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Halimcuk/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Referral code: `jcrs26fr`

LANTERN LANE is an original spot-the-difference game built for make.fun's
"Make the best spot the difference game" bounty ($50 in USDC).

Two pictures hang side by side. They look identical — but seven small things
changed in the second one. Click a difference on either picture to mark it
with a golden ring, and find them all before the clock runs out.

## The game

- **3 original hand-drawn scenes** — Night Market Lane, Harbor at Dawn, and
  Moonlit Garden — every picture drawn in code on canvas, no borrowed art.
- **7 differences per scene** — a missing lantern, a winking frog, a sail
  that changed colour, a beam that went dark. Fair, but never obvious.
- **A hunt with teeth** — a countdown per level, wrong clicks cost 3 seconds,
  chains of finds build a combo bonus, and leftover time pays out at the end.
- **Hints that behave** — 3 per level, each one pulses a ring around one
  unfound difference for 50 points.
- **Feel and polish** — golden marker rings with a check on every find,
  a red X flash on a miss, a low-time tick, and fully synthesised WebAudio
  sounds (chime, buzz, win arpeggio). No audio files, no network, ever.
- **Keyboard and mouse** — click either picture, `H` for a hint,
  `R` to restart the level, `M` to mute.

## Play it

Serve `game/` with any static server and open `index.html` in desktop
Chrome. It plays offline: every file it loads lives under `game/`.

## Files

- `game/index.html` — page, HUD and overlays
- `game/styles.css` — lantern-lit theme
- `game/src/main.js` — bootstrap, HUD, level flow and overlays
- `game/src/engine.js` — one level: rendering, clicks, markers, timer, hints
- `game/src/scenes.js` — the three-scene registry
- `game/src/scene-market.js` — Night Market Lane
- `game/src/scene-harbor.js` — Harbor at Dawn
- `game/src/scene-garden.js` — Moonlit Garden
- `game/src/audio.js` — synthesised WebAudio sounds
- `main.ts` — hands the game in (copies `game/` + `screenshots/`, writes `dossier.json`)
- `screenshots/` — real renders of the game itself
- `vendor/makefun-game.ts` — make.fun's dossier library, unchanged from the kit

## License

MIT — see `LICENSE`.
