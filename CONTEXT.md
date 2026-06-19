# VROOM VROOM - Domain & Architecture Context

Shared vocabulary for the game. Architecture terms follow the
`improve-codebase-architecture` skill's LANGUAGE.md (module, interface,
implementation, depth, seam, adapter, leverage, locality). Domain terms are the
game's own. Keep names here in sync with the code.

## The macro loop (domain)

The game is one closed cycle, not a game with a win screen:

> **Free-roam Driving** -> (caught) -> **Arrest** -> **Intake** -> **Courtroom** ->
> **Prison** -> (sentence served) -> released -> Driving again

If the player *evades* the police during Driving, they stay in Driving with raised
**Heat**; only being *caught* (or crashing into a roadblock) advances the loop.

## Domain terms

- **Heat / Wanted level** - how hard the police press. Rises with time driven, crashes,
  and reckless proximity; falls when you evade or lie low. Drives police spawn rate and
  pursuit aggression.
- **Pursuit** - the police chase as real state: a *gap* the player pushes open with
  skilled driving and the police pull closed with pressure. Resolves to **Evade** or
  **Caught**.
- **Track** - the procedurally spawned road ahead: lanes, traffic, and obstacles the
  player weaves through. Owns spawning and collision tests.
- **Standing** - the single canonical "how the system sees you" axis (0-100), replacing
  the drifting trio `goodBehaviorPoints` / `goodBehavior` / `corruption`. "Good
  behaviour" and "corruption" are *views* of standing.
- **Prison activity** - one thing you can do in prison (gym, cafeteria, library, gang,
  escape, manicure, commissary, letter, tattoo). Each costs days and yields a uniform
  result (day delta, credit/stat/inventory deltas, events).

## Architecture seams being introduced (this refactor)

- **Clock / FixedTimestep** (`systems/fixed-timestep.js`) - turns wall-clock time into a
  fixed-step `update(dt)` + a render `alpha` for interpolation. One module fixes
  frame-rate coupling everywhere. Deep: tiny interface (`tick(now, step) -> {steps,
  alpha}`), real behaviour (accumulator, spiral-of-death clamp) behind it.
- **Pursuit / DrivingEngine** (`systems/sidescroller-engine.js`) - owns Driving as real
  game state and resolves Evade/Caught. Render is an **adapter** at a seam: a canvas
  `DrivingRenderer` for play, a headless reader for tests.
- **PrisonActivity** (planned) - one interface, nine adapters; `game.js` becomes a
  dispatcher.
- **Phase** (planned) - the macro loop as data; one `enter(phase)` does screen +
  body-class + audio and guards transitions.
- **Save** (planned) - versioned load/save with a migration chain behind a tiny
  interface.

## Conventions

- No build step. Plain `<script>` tags in `game/index.html`; load order is the
  dependency graph. A subsystem `game.js` calls loads *above* `core/game.js`; a prototype
  mixin loads *below*.
- Canvas 2D pixel art for play; Three.js only for the character-creation previews.
- Single global `game`; HTML wires to it via inline `onclick="game.x()"`.
