# VROOM VROOM - Architecture & Systems Reference

> **Status of this document:** Written from a first-hand read of the live source on
> 2026-06-19. It supersedes the descriptions in the root `claude.md` / `SYSTEMS.md`,
> which describe an older **monolithic** `game/game.js` that no longer exists. The
> codebase has since been refactored into the layered structure documented here.
> Treat **this file + the `index.html` `<script>` load order** as the source of truth.

---

## 1. What the game is (in one paragraph)

VROOM VROOM is a single-page, vanilla-JavaScript browser game about a dystopia where
*driving is illegal*. It is built as one long **gameplay cycle** rather than a game with
a win screen: you drive (a 2D side-scroller), get caught by police, are dragged through
an absurd **courtroom paperwork** mini-game presided over by Judge Hardcastle, get
sentenced, and then serve time in a deep **prison simulator** (stats, activities,
gangs, escape planning, random events, an offline real-time clock). When your sentence
ends you are released... and immediately handed the car keys again. The loop closes.

There is no engine framework. Rendering is almost entirely **HTML5 Canvas 2D pixel
art**; Three.js (r128, via CDN) survives only to render the rotating 3D car/character
**previews** on the character-creation screen.

---

## 2. High-level architecture

### 2.1 Directory layout (`game/`)

| Path | Role |
|------|------|
| `core/game.js` | **The orchestrator.** ~4,800 lines, holds the `VroomVroomGame` class, the player model, the state machine, save/load, and the render loop. Everything else is a subsystem it owns. |
| `core/test-suite.js` | Stand-alone unit tests. |
| `systems/` | Gameplay subsystems (driving engine, courtroom controller, stats, random events, gangs/escape live in `game.js` but lean on these, tattoo, guard manicure, achievements, time, Gemini events). |
| `rendering/` | Canvas renderers + the synthesized Web Audio sound system + nail-art renderer + driver's-license renderer. |
| `audio/` | Music, ambient, and the `AudioManager` facade. |
| `assets/` | Pure data + draw helpers: pixel sprites for cars, characters, courtroom, prison scenes; the side-scroller sprite atlas. |
| `dev/` | Debug logger, API monitor, dev-mode overlay. |
| `index.html` | The whole DOM: every screen, modal, canvas, the HUD, and the **ordered `<script>` manifest** at the bottom (~line 2800+). |
| `visual-system.css` / `design-tokens.json` | The design system (CSS variables + the JSON they mirror). |

### 2.2 The load order *is* the dependency graph

`index.html` loads ~40 scripts in a deliberate order (bottom of the file). The contract:

1. **Three.js** (CDN) first.
2. **`design-tokens.json`** is fetched into a global `DESIGN_TOKENS`.
3. **Audio**, then **UI helpers/assets**, then **systems**, then **renderers**, then
   **stat systems** (`stat-thresholds.js`, `stat-effects.js`, `random-events-manager.js`)
   - all of which must exist *before* `core/game.js`.
4. **`core/game.js`** loads and, on `window.load`, instantiates the global `game`.
5. **`systems/nail-art-integration.js`** loads *after* `game.js` because it extends
   `VroomVroomGame.prototype` with methods (a mixin pattern).

> **Rule for new subsystems:** if `game.js` calls into it, the `<script>` tag goes
> *above* `core/game.js`. If it patches `game`'s prototype, it goes *below*.

### 2.3 The one global

After load there is a single global `game` (`window.game`), an instance of
`VroomVroomGame`. **Every HTML button calls into it inline**, e.g.
`onclick="game.startNewGame()"`. This is the entire UI->logic wiring convention
(a handful of inputs use `addEventListener` set up in `init()` instead).

---

## 3. The core game loop & state machine

### 3.1 Game states

`game.gameState` is one of: `'menu'`, `'driving'`, `'courtroom'`, `'prison'`
(`game.js:584`). It gates what the per-frame loop does and which audio/CSS body-class
is active (`document.body.classList` carries `state-driving` / `state-courtroom` /
`state-prison` / `state-menu`).

### 3.2 The macro cycle (the actual "game loop")

```
            startNewGame ──► character creation ──┐
                                                  ▼
   ┌──────────────►  startDriving()  ──►  [DRIVING]  side-scroller
   │                                          │ police catch you, or SPACE = surrender
   │                                          ▼
   │                              pullOver() ──► setupCourtroom()
   │                                          │  [COURTROOM] paperwork + Judge Hardcastle
   │                                          ▼  submit forms -> verdict cinematic
   │                                  startPrison()
   │                                          │  [PRISON] activities advance prisonDays
   │                                          ▼  prisonDays >= sentence*7
   │                                  endPrison()  ──► credits, then...
   └──────────────────────────────────────────┘  release -> startDriving(true) again
```

Key transition functions in `core/game.js`:

| From -> To | Function | Notes |
|-----------|----------|-------|
| menu -> driving | `startDriving(showCinematic)` `:1893` | resets side-scroller, HUD on, randomizes police spawn time (5-15 s). |
| driving -> court | `pullOver()` `:2021` | triggered by arrest **or** pressing SPACE; plays a 4 s license-inspection + arrest cinematic, then `setupCourtroom()`. |
| court -> prison | `proceedToJudgmentCinematic()` `:2373` | nested judgment->prison cinematics, then `startPrison()`. |
| prison -> end | `endPrison()` `:4252` | "release" cinematic -> credits. |
| end -> driving | `closeTimeDigest(true)` `:4238` | release path loops back to `startDriving(true)`. |

> **There is no lose state and no real win state.** The judge is *always* guilty; player
> input only scales the sentence. The only "ending" is the credits roll, and even that
> leads back to driving. This is intentional - the joke is the inescapable loop.

### 3.3 The render loop

`animate()` (`game.js:4782`) is a `requestAnimationFrame` loop. **Important nuance:**

```js
animate() {
    requestAnimationFrame(() => this.animate());
    const delta = 0.016; // HARD-CODED ~60fps
    if (this.gameState === 'driving') {
        this.updateDriving(delta);
        this.sidescroller.render();
    }
}
```

`delta` is a **constant 0.016**, not real elapsed time. So all driving physics is
**frame-count-based, not wall-clock-based** - on a 144 Hz display the car effectively
moves ~2.4x faster than on 60 Hz. Only the *driving* state runs per-frame logic; every
other screen is static DOM updated on events. (See "Known sharp edges" below.)

### 3.4 The screen state machine (DOM layer)

Screens are `<div class="screen">`. Exactly one is visible at a time via
`showScreen(screenId)` (`game.js:1051`):

```js
showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active'); // CSS: .active { display:flex }
    this.currentScreen = screenId;
    // ...plays the right audio environment; if entering 'prisonMenu', boots
    //    the ambient timer + refreshes stat/time/corruption panels.
}
```

Modals are parallel: `showModal(id)` / `closeModal(id)` (`:1247`/`:1259`) toggle
`.active` on `.modal` elements, which sit at a higher `z-index` than screens.

Screen IDs (load-bearing - JS calls `showScreen('<id>')` and `getElementById` on them):
`mainMenu`, `characterCreation`, `courtroom`, `prisonMenu`, `letterWriting`,
`eatingSimulator`, `tattooStudio`, `weightLifting`, `commissaryShop`, `prisonLibrary`,
`readBook`, `gangSystem`, `gangInteraction`, `escapeMenu`, `escapeRouteDetail`,
`nailArtGuardSelection`, `nailArtCanvas`, `nailArtGallery`, `testingMenu`, `credits`.
Modals: `apiKeyModal`, `settingsModal`, `saveCodeModal`, `importCodeModal`,
`randomEventModal`.

---

## 4. The player model (single source of game state)

Everything persistable lives on `game.player` (constructed at `game.js:585`). Saving is
just `JSON.stringify(game.player)`. Notable fields:

- **Identity / appearance:** `name`, `skinTone`, `height`, `voice`, `faceShape`,
  `hairStyle`, `hairColor`, `eyeColor`, `facialFeature`, `scar`, `bodyType`,
  `origin`, `archetype`.
- **Vehicle:** `selectedCar = { model, color }` (cosmetic only - see Section 8).
- **Driving/legal:** `speed`, `drivingTime`, `wantedLevel`, `arrests`, `sentence` (years).
- **Prison core stats (0-100):** `intelligence`, `strength`, `hunger` (lower = hungrier),
  `goodBehaviorPoints`, plus a separate `corruption` (0-100) and legacy `goodBehavior`.
- **Time:** `prisonDays`, `prisonStartTime`, `lastPlayed` (real timestamps for the
  offline digest).
- **Economy / inventory:** `money` (credits), `cigarettes` (prison currency),
  `inventory{}`, contraband.
- **Collections:** `tattoos[]`, `gangRep{}`, `currentGang`, `escapeProgress{}`,
  `favorTokens`, `booksRead[]`, `bookProgress[]`, `letters[]`.
- **Telemetry for achievements:** `workoutCount`, `foodsEaten[]`, `fightWins`,
  `activitiesCompleted[]`, `maxSpeed`, `successfulEscapes`, `randomEventHistory[]`, etc.

> **Add a stat or collection? Add it here**, default it sanely, and remember old saves
> won't have it - read defensively (`this.player.x || 0`).

---

## 5. Subsystem 1 - Driving (the side-scroller)

**Files:** `systems/sidescroller-engine.js`, `systems/sidescroller-renderer.js`,
`assets/sidescroller/*`. **Bridge in core:** `game.js:1893-2019`.

### 5.1 Physics model (all constants in `sidescroller-engine.js`)

| Quantity | Value | Note |
|----------|-------|------|
| Acceleration | `0.5` /frame^2 | while W / ArrowUp held |
| Deceleration (coast) | `0.3` /frame | no brake key; releasing throttle coasts to 0 |
| Max speed | `50` | engine units; displayed raw on HUD |
| Gravity | `0.5` | only relevant to the vertical/jump axis |
| Camera follow | lerp `0.1` toward `worldX - width*0.3` | player car is pinned at 30% screen width |

The player car advances `worldX` (an infinite odometer); the world scrolls past it.
There is **no lane or steering system** - it is a pure throttle/coast runner.

### 5.2 Police & arrest

- Police spawn after a random `5-15 s` (`game.js:1908`, checked in `updateDriving`).
- Police always travel at `playerSpeed + 5`, so they *will* close the gap.
- **Wanted level** = `min(5, floor(drivingTime / 10))` while chased (`game.js:1971`).
- **Arrest** fires when `worldX` gap `< 50`; the engine screen-shakes and calls back
  into `game.pullOver()` after 500 ms.
- The player can also **surrender** any time with SPACE (`onKeyDown`, `game.js:1023`).

### 5.3 Rendering

Canvas 2D, `imageSmoothingEnabled = false`. Each `render()` draws: sky fill -> 4
parallax building layers (scroll speeds 0.1/0.3/0.5/0.7) -> road + dashed line ->
player car -> police car (flashing lights) -> particles (dust/smoke) -> optional debug
HUD. The detailed sprite atlas in `assets/sidescroller/car-sprites.js` exists but the
live engine currently draws simple primitives.

### 5.4 Public API (what `game.js` calls)

`new SidescrollerEngine(canvasId, game)` then `reset()`, `start()`, `stop()`,
`update(delta)`, `render()`, `spawnPolice()`, `despawnPolice()`, `resize()`. It calls
**back** into the game via `this.game.pullOver()` on arrest and reads input from
`this.game.keys`.

---

## 6. Subsystem 2 - Courtroom (paperwork + Judge Hardcastle)

**Files:** `systems/ace-attorney-courtroom.js`, `systems/enhanced-courtroom-controller.js`,
`systems/courtroom-pixel-renderer.js`, `systems/pixel-art-forms.js`,
`assets/courtroom/*`. **Judge logic** lives in core (`JudgeHardcastle`, `game.js:337-566`)
and the flow in `setupCourtroom()`/`submitCourtForms()`/`handleCourtFormSubmit()`
(`game.js:2054-2450`).

### 6.1 Flow

1. `pullOver()` -> `setupCourtroom()` lazily builds an `EnhancedCourtroomController`
   bound to `#courtroomCanvas`.
2. **Charges** are generated: if a Gemini API key is present, `ApiKeyManager.generateAICharges()`
   asks Gemma-3 for absurd bureaucratic charges; **on any failure it falls back** to
   `JudgeHardcastle.generateCharges()` (speed-based + existential + random form charges).
3. Judge delivers opening dialogue, then the **6 forms** appear (canvas-drawn inputs).
4. Player fills forms; the judge snipes after each field. Submitting **incomplete**
   forms angers the judge (patience penalty + "OBJECTION!" overlay) and blocks progress.
5. Valid submission -> verdict dialogue + gavel strike -> `proceedToJudgmentCinematic()`
   -> `startPrison()`.

### 6.2 The sentence

The stored sentence is computed in `submitCourtForms()` roughly as
`max(1, floor(drivingTime / 10) + judge.arrestCount)` years. `JudgeHardcastle.calculateSentence()`
adds the flavor (`+= floor(speed/50)`, `+= arrestCount*2`, doubled when patience is very
low, plus a random "...for that look on your face" rider). Net effect: drive longer /
get arrested more -> longer sentence. **Verdict is always guilty.**

### 6.3 The 6 forms (`pixel-art-forms.js`)

Reason for driving (textarea), vehicle description (text), statement of intent (select:
grocery/work/joy/exist), and three 3-char "initial here" acknowledgements. All required;
blank fields are the only validation failure.

---

## 7. Subsystem 3 - Prison (the deep end)

**Bridge:** `game.js:2451-4400`. **Supporting systems:** `systems/stat-thresholds.js`,
`systems/stat-effects.js`, `systems/random-events-manager.js`, `systems/time-system.js`,
`systems/guard-manicure.js`, `systems/tattoo-system.js`, `systems/library-methods.js`,
`systems/game_eating.js`, `systems/achievements.js`, `systems/achievement-tracker.js`.

### 7.1 Time & the release condition

A "day" is an action: `prisonActivity(activity)` (`game.js:2528`) does `prisonDays += 1`
and awards `1-5` credits - **except** weights/eat/tattoo/manicure, which defer the
day-increment to their mini-game's completion handler, and except commissary/letter/read
which award no credits. **Release** triggers when
`prisonDays >= sentence * 7` (`game.js:2622`) -> `endPrison()`. (1 sentence-year = 7
in-game activity-days.)

### 7.2 The four core stats (0-100, `stat-thresholds.js` defines 6 tiers each)

| Stat | Raised by | Lowered by | What tiers do |
|------|-----------|-----------|---------------|
| **Intelligence** | reading library pages (+1/page) | solitary | gates the library; high INT cuts sentence, auto-fills court forms, unlocks an escape route. |
| **Strength** | weight-lifting mini-game | starvation, bullying (STR<20) | low STR loses fights / gets you bullied; high STR unlocks jobs, fight betting, a wall-break escape. |
| **Hunger** (lower=hungrier) | rises over time/events | eating (-5/bite) | starving applies stat penalties + collapse risk; well-fed grants stat-gain bonuses. |
| **Good behavior** | guard manicures, good event choices | failed escapes, solitary, bad choices | gates parole/privileges; very high gives big sentence reductions; very low risks solitary. A parallel `corruption` stat tracks the dark path. |

`stat-effects.js` applies the *passive* per-day consequences (collapse, solitary,
bullying, shop price modifiers) and checks stat achievements.

### 7.3 Activities (all reached from `prisonMenu` via `game.prisonActivity('...')`)

| Activity | Mini-game | Reward / cost |
|----------|-----------|---------------|
| **Weights** | spam SPACE/click through 5 sets x 10 reps, fatigue ramps | +1-3 STR (x hunger & tier modifiers), +5 hunger |
| **Eat** | click ~20 bites off an ASCII plate | -100 hunger over the meal |
| **Library** | pick 1 of 3 books, page through (cellmate may interrupt) | +1 INT/page; library blocked under INT 20 |
| **Tattoo** | 10x10 grid design -> stencil -> ink -> body placement -> aftercare sequence | new tattoo, 25% infection chance |
| **Gang** | talk / share cigs / trade / join, 3 rival gangs | reputation, cigarettes, membership perks |
| **Escape** | 4 multi-step routes (tunnel/bribe/transfer/riot), each step a probability roll | success = freedom + achievement; failure = +10-20 yrs sentence |
| **Guard manicure** | 5 steps (soak/trim/file/polish/dry); 3+ to pass | +1 favor token (spendable 1-4 tokens for perks); failure -10 good behavior |
| **Commissary** | buy from 5-item shop with dynamic stock/restock | spends credits, builds inventory/cigs |
| **Letter** | type recipient + message | flavor only; counts toward completionist |

### 7.4 Random events (`random-events-manager.js`)

~21 authored events, each with 3-4 choices that may be **stat-gated** (e.g. "Confront
[STR 40+]"). A 10% roll per activity (`game.js:2627`) surfaces one in the
`randomEventModal`. The last 7 fired events are tracked in `player.randomEventHistory`
to avoid repeats.

### 7.5 The offline real-time clock & "time away" digest

Two time models coexist:
- **In-session:** a day per activity (Section 7.1).
- **Offline:** `loadGame()` (`game.js:1452`) compares `Date.now()` to `lastPlayed`. If
  you were imprisoned, **1 prison-year = 7 real days**; elapsed real days are added to
  `prisonDays`, and `generatePrisonTimeDigest()` invents the events you "missed". If you
  were free, `generateFreeTimeDigest()` does the equivalent. The digest is shown on a
  dynamically-built `timeDigestScreen`, and if the sentence completed while away you go
  straight to release.

### 7.6 Achievements

30 achievements across prison/stat/meta/absurd/driving/courtroom categories
(`achievements.js`), tracked by `AchievementTracker` (`achievement-tracker.js`) and
unlocked from many call-sites (driving milestones in `updateDriving`, prison entry in
`checkMetaAchievements`, stat tiers in `stat-effects.js`).

---

## 8. How to add things

### 8.1 Add a new vehicle

A car lives in **two** places and is **purely cosmetic** - it has no effect on physics
(all cars share the constants in Section 5.1).

1. **3D preview (character creation):** add an entry to
   `CarGeometry.getCarModels()` in `systems/car-selection.js` - box dimensions, roof,
   wheels (and optional `bedDimensions` like `rustbucket`). This is what the rotating
   preview renders.
2. **Selectable button:** add a `<button onclick="game.selectCarModel('yourkey')">` in
   the car-selection block of `index.html` (matching the new model key).
3. **(Optional) driving sprite:** add a sprite to
   `assets/sidescroller/car-sprites.js` if/when the engine is wired to draw sprites
   instead of primitives.
4. The choice is stored as `player.selectedCar.model`. No `game.js` logic change is
   needed unless you want the car to *matter* (then add a stats table and read it in
   `sidescroller-engine.js` physics).

### 8.2 Add a new prison activity

1. Add a `<div class="prison-activity-card" onclick="game.prisonActivity('myactivity')">`
   to the `prisonMenu` block in `index.html`.
2. Handle `'myactivity'` in the `prisonActivity()` switch (`game.js:2528`). Decide
   whether it advances the day inline (default) or defers to a completion handler
   (`return;` early like weights/eat/tattoo do).
3. If it has its own screen, add a `<div class="screen" id="myActivityScreen">` and
   `showScreen('myActivityScreen')`. If it's a real subsystem, give it a file under
   `systems/` and a `<script>` tag **above** `core/game.js`.
4. Add it to the `activityMap` / completionist list if it should count.

### 8.3 Add a new screen

1. `<div class="screen" id="myScreen">...</div>` in `index.html`.
2. Navigate to it with `game.showScreen('myScreen')`. It auto-participates in the
   show/hide machine - no registration needed.
3. Add an audio-environment branch in `showScreen()` if it needs music.

### 8.4 Add a new subsystem class

Create `systems/my-system.js`, expose a class, add the `<script>` tag in `index.html`
**above** `core/game.js`, and instantiate it from the `VroomVroomGame` constructor or
`init()`. Follow the existing **lazy-init** pattern (`this.x = null;` in the constructor,
build on first use) for anything heavy or canvas-bound.

---

## 9. Save / load

- **Autosave:** `saveGame()` writes `localStorage['vroomVroomSave'] = JSON.stringify(player)`
  and stamps `lastPlayed` (`game.js:1512`). Called on prison entry and after each activity.
- **Load:** `loadGame()` (`:1452`) restores the player, runs the offline-time digest, and
  resumes in the correct state.
- **Portable codes:** `generateSaveCode()`/`importSaveCode()` (`:1520`/`:1541`) wrap the
  player JSON in `btoa(encodeURIComponent(...))` for copy-paste sharing, surfaced through
  `saveCodeModal` / `importCodeModal`.

---

## 10. The design system (for UI/UX)

- **Tokens** live in `design-tokens.json` and are mirrored as CSS custom properties in
  `visual-system.css :root` - colors (`--color-primary-*`, `--color-bg-*`,
  `--color-text-*`), spacing (`--space-xs..3xl`, a 4px grid), type (`--font-pixel` =
  'Press Start 2P', `--font-mono`; `--text-xs..4xl`), z-index layers, animation timings.
- **Aesthetic:** muted "Disco Elysium / cozy-dystopia" palette; `#gameCanvas` carries a
  `contrast(1.1) saturate(0.8) brightness(0.95)` filter + inset vignette.
- **Responsive breakpoints:** 768px (tablet), 480px (phone), and a `max-height:600px`
  landscape rule; touch targets are kept >=48px and inputs >=16px to avoid iOS zoom.

### 10.1 Designer hooks - the seams

**Safe to restyle freely (no JS depends on it):**
- Any `--color-*`, `--space-*`, `--text-*`, `--font-*`, `--duration-*` value.
- `.pixel-button`, `.prison-activity-card`, `.car-model-btn`, `.color-swatch`,
  `.stat-row`/`.stat-bar` *appearance* (background, border, hover, radius).
- Media-query thresholds and per-breakpoint sizing.
- `@keyframes` and transitions.
- Canvas CSS sizing (the JS reads the canvas's pixel buffer, not its CSS box, for layout
  - but verify after resizing).

**Load-bearing - do NOT rename without a matching `game.js` change:**
- **Screen IDs** and **modal IDs** (the lists in Section 3.4) - looked up by
  `getElementById`.
- The classes `.screen`, `.modal`, and especially **`.active`** - the visibility toggle.
- **Form input IDs** read during character creation and courtroom (`charName`,
  `skinTone`, `height`/`heightValue`, `voice`, `faceShape`, `hairStyle`, `hairColor`,
  `eyeColor`, `facialFeature`, `scar`, `bodyType`, `origin`, `archetype`, and the court
  fields `reasonForDriving`, `vehicleDesc`, `intentStatement`, `initial1/2/3`).
- **Canvas IDs:** `gameCanvas` (driving), `courtroomCanvas`, `characterPreviewCanvas`,
  `carPreviewCanvas`, `cafeteriaCanvas`, `gymCanvas`, `libraryCanvas`, `manicureCanvas`,
  `nailArtMainCanvas`, `galleryCanvas{Jenkins|Martinez|Chen|Thompson|Rodriguez}`.
- **Live-updated elements:** `#messageBox`, `#prisonTimeDisplay`, `#corruptionDisplay`,
  `#characterInfoDisplay`, and the stat bars (`#moneyBar`/`#moneyValue`, `#hungerBar`,
  `#strengthBar`, `#intelligenceBar`, `#behaviorBar`, ...) - JS writes to these by ID.
- **`onclick="game.x()"` attributes** - the only wiring between buttons and logic. Move
  the markup, keep the handler.

> **Designer's mental model:** structure (IDs, `.active`, the `game.x()` handlers) is the
> contract with the code; everything visual (CSS variables, layout, animation, copy
> inside non-id'd elements) is yours. Pixel canvases are drawn by JS - to restyle those
> scenes you edit the sprite/renderer files in `assets/` and `rendering/`, not CSS.

---

## 11. AI integration (optional)

`ApiKeyManager` (`game.js:4`) stores a Google Gemini key in `sessionStorage` (cleared on
close; a "skip" preference persists in `localStorage`). It powers two optional features:
courtroom charges (`generateAICharges`) and prison ambient/random events
(`systems/gemini-events.js`). **Every AI path has a hardcoded fallback** - the game is
fully playable with no key. Model used: `gemma-3-27b-it`.

---

## 12. Known sharp edges (documented, not yet fixed)

1. **Frame-rate-coupled physics:** `delta` is hardcoded `0.016` in `animate()`
   (`game.js:4785`). Driving speed scales with the display's refresh rate. Fix = measure
   real delta with timestamps.
2. **Two parallel "good behavior" fields:** `goodBehaviorPoints` (threshold system) and
   the legacy `goodBehavior` (plus `corruption`) coexist; keep them in sync or consolidate.
3. **Doc drift:** root `claude.md` / `SYSTEMS.md` still describe the pre-refactor
   monolith and list integrated systems as "pending." This file is the current truth;
   those should be reconciled or pointed here.
4. **Sprite atlas vs. primitives:** the side-scroller defines rich car sprites it does
   not yet draw; the live renderer uses rectangles.

---

## 13. Quick reference

- **Run it:** open `game/index.html` (or the repo-root `index.html` redirect) in a
  browser; it's a static site (GitHub Pages-deployable). No build step.
- **Cheats / dev:** type `TEST` on the menu for the testing menu; the `game.test*()`
  methods (`game.js:4414+`) jump screens and grant resources. `dev/` holds the debug
  overlay.
- **Console pokes:**
  ```js
  game.showScreen('prisonMenu');
  game.player.money = 1000; game.updateStatsPanel();
  game.startDriving();
  game.saveGame();
  ```
