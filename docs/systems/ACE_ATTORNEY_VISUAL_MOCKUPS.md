# ACE ATTORNEY COURTROOM - VISUAL MOCKUPS

**Purpose:** ASCII art mockups showing exactly what the player sees
**Target Version:** v1.5.0
**Created:** 2025-10-16

---

## SCREEN 1: DESK VIEW (Filling Out Forms)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                          COURTROOM - DESK VIEW                            ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │                     [Wooden desk surface]                           │ ║
║  │                                                                     │ ║
║  │         ┌───────────────────────────────────────────┐              │ ║
║  │         │  TRAFFIC VIOLATION FORM 27-B              │              │ ║
║  │         │  ═══════════════════════════════════════  │              │ ║
║  │         │                                           │              │ ║
║  │         │  Violation Date: [_________________]     │              │ ║
║  │         │                                           │              │ ║
║  │         │  Vehicle Description: [____________]     │              │ ║
║  │         │                                           │              │ ║
║  │         │  Officer Name: [___________________]     │              │ ║
║  │         │                                           │              │ ║
║  │         │  Reason for Stop: [________________]     │              │ ║
║  │         │                                           │              │ ║
║  │         │                                           │              │ ║
║  │         │   [Stamp Form]        [Submit Form]      │              │ ║
║  │         └───────────────────────────────────────────┘              │ ║
║  │                                                                     │ ║
║  │  (Desk continues, paperwork scattered)                             │ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
║                                                                           ║
║  ┌─────────────────────────────┐                                         ║
║  │ JUDGE PATIENCE: ████████░░  │  ← Small meter (top-right corner)      ║
║  │ 78 / 100 (FURIOUS)          │                                         ║
║  └─────────────────────────────┘                                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Notes:**
- Player fills out forms on desk surface
- Small patience meter in corner (always visible)
- Vignette darkens edges (not shown in ASCII)
- Film grain texture over everything
- Desaturated brown/gray color palette

---

## SCREEN 2: JUDGE VIEW - NEUTRAL STATE (0-15 Patience)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                        COURTROOM - JUDGE VIEW                             ║
║                                                                           ║
║  [Dark courtroom background, barely visible walls]                       ║
║  [Single dim light from above]                                           ║
║                                                                           ║
║                      ┌────────────────────┐                              ║
║                      │   JUDGE'S BENCH    │                              ║
║                      │  [Dark wood desk]  │                              ║
║                      └────────────────────┘                              ║
║                                                                           ║
║                           ╭───────╮                                       ║
║                          ╱  ⚆ ⚆  ╲         ← Half-closed eyes           ║
║                         │    ◡    │        ← Slight frown               ║
║                          ╲   │   ╱         ← Neutral expression         ║
║                           ╰───╯                                          ║
║                         ┌──────┐                                         ║
║                         │ ROBE │           ← Judge robe                 ║
║                         │      │                                         ║
║                         └──────┘                                         ║
║                  ┌──────────────────┐                                    ║
║                  │  Judge's Bench   │     ← Wooden bench                ║
║                  └──────────────────┘                                    ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │  JUDGE HARDCASTLE:                                                 │  ║
║  │  "Let us proceed with this... tedious exercise in bureaucracy."   │  ║
║  │                                                                    │  ║
║  │                                    [Continue →]                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌──────────────────────┐                                                ║
║  │ PATIENCE: ██░░░░░░░░ │  ← Large patience meter (visible)             ║
║  │ 12 / 100 (NEUTRAL)   │                                                ║
║  └──────────────────────┘                                                ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Animation Notes:**
- Eyes slowly blink (close → open)
- Occasional yawn
- Slumped posture
- Very slow animation (2 second loop)

---

## SCREEN 3: JUDGE VIEW - ANGRY STATE (36-60 Patience)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                        COURTROOM - JUDGE VIEW                             ║
║                                                                           ║
║  [Courtroom background, warmer lighting on judge]                        ║
║                                                                           ║
║                      ┌────────────────────┐                              ║
║                      │   JUDGE'S BENCH    │                              ║
║                      └────────────────────┘                              ║
║                                                                           ║
║                    ╱╲    ╭───────╮    ╱╲   ← Veins pulsing              ║
║                   │  │  ╱  ◉ ◉  ╲  │  │                                  ║
║                    ╲╱  │    ◡    │   ╲╱   ← Wide eyes, furrowed brow    ║
║                         ╲   │   ╱          ← Deep frown                  ║
║                          ╰───╯                                           ║
║                        ┌──────┐                                          ║
║                        │ ROBE │            ← Leaning forward            ║
║                        │ (^^) │            ← Breathing heavily          ║
║                        └──────┘                                          ║
║                 ┌──────────────────┐                                     ║
║                 │  Judge's Bench   │                                     ║
║                 └──────────────────┘                                     ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │  JUDGE HARDCASTLE:                                                 │  ║
║  │  "Your INCOMPETENCE is a stain on this courtroom! Do you have     │  ║
║  │  ANY idea how many forms you've botched?!"                         │  ║
║  │                                                                    │  ║
║  │                                    [Continue →]                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌──────────────────────┐                                                ║
║  │ PATIENCE: ██████░░░░ │  ← Meter turning red                          ║
║  │ 54 / 100 (ANGRY)     │                                                ║
║  └──────────────────────┘                                                ║
║                                                                           ║
║  [Subtle red vignette at edges]                                          ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Animation Notes:**
- Veins pulse thicker/thinner (╱╲ grow/shrink)
- Chest rises and falls (breathing)
- Eyes bloodshot (red lines in whites)
- Face color slightly redder than neutral
- 1 second animation loop

---

## SCREEN 4: JUDGE VIEW - FURIOUS STATE (61-85 Patience)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                   COURTROOM - JUDGE VIEW [SHAKING ±5px]                  ║
║                                                                           ║
║  [Screen trembles, courtroom background shifting left/right]             ║
║                                                                           ║
║                      ┌────────────────────┐                              ║
║                      │   JUDGE'S BENCH    │                              ║
║                      └────────────────────┘                              ║
║                                     ┌───┐  ← Gavel raised, trembling    ║
║                    ╱╲╱╲  ╭───────╮  │ ╱ │                                ║
║                   │││││ ╱  ◉ ◉  ╲ │╱  │  ← Many veins                   ║
║                    ╲╱╲╱│  ≈◡≈   │ └───┘                                  ║
║                         ╲  │ │ ╱          ← Grimace, teeth visible      ║
║                          ╰─┴─╯                                           ║
║                        ┌──────┐            ← Sweat drops ◦◦              ║
║                        │ ROBE │            ← Halfway standing           ║
║                        │ (^^) │                                          ║
║                        └──────┘                                          ║
║                 ┌──────────────────┐                                     ║
║                 │  Judge's Bench   │                                     ║
║                 └──────────────────┘                                     ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │  JUDGE HARDCASTLE:                                                 │  ║
║  │  "ONE. MORE. MISTAKE. And I will PERSONALLY ensure you spend the  │  ║
║  │  rest of your NATURAL LIFE behind bars!"                           │  ║
║  │                                                                    │  ║
║  │                                    [Continue →]                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌──────────────────────┐                                                ║
║  │ PATIENCE: ████████░░ │  ← Deep red                                    ║
║  │ 78 / 100 (FURIOUS)   │                                                ║
║  └──────────────────────┘                                                ║
║                                                                           ║
║  [Red vignette 30% opacity, screen shaking ±5px]                         ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Animation Notes:**
- Gavel trembles (moves left/right ±3px)
- All veins pulse in sync
- Screen shakes ±5px horizontally
- Red vignette visible at edges
- Face crimson red
- 0.8 second loop

---

## SCREEN 5: JUDGE VIEW - APOPLECTIC STATE (86-99 Patience)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║             COURTROOM - JUDGE VIEW [VIOLENTLY SHAKING ±10px]             ║
║                                                                           ║
║  [Screen shaking radially, red overlay pulsing]                          ║
║  [White flash on gavel impact]                                           ║
║                                                                           ║
║                      ┌────────────────────┐                              ║
║                      │   JUDGE'S BENCH    │                              ║
║                      └────────────────────┘                              ║
║                                                                           ║
║                    ╱╲╱╲╱╲ ╭───────╮                                      ║
║                   │││││││╱  ●●  ╲        ← Extremely wide eyes         ║
║                    ╲╱╲╱╲╱│       │       ← Purple veins everywhere     ║
║                           ╲═══╱           ← Mouth wide open (yelling)   ║
║                             │                                            ║
║                        ┌───┴───┐          ◦◦◦ ← Spit flying            ║
║                        │ ROBE  │          ← Fully standing             ║
║                        │  ▲▲   │                                         ║
║                        └───────┘                                         ║
║                   ╱              ╲        ← Both hands visible          ║
║                  │   ╲│   ═     │ │      ← Gavel MID-STRIKE            ║
║                 ┌┴────▼────────┴─┴┐      ← IMPACT POINT                ║
║                 │  Judge's Bench  │      ✦✦✦ ← Impact burst            ║
║                 └──────────────────┘                                     ║
║                                                                           ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │  JUDGE HARDCASTLE:                                                 │  ║
║  │  "THAT'S IT! MAXIMUM SENTENCE! You have DESTROYED any hope of     │  ║
║  │  leniency! GUARDS! TAKE THIS... THIS... CRIMINAL AWAY!"           │  ║
║  │                                                                    │  ║
║  │                                    [Continue →]                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌──────────────────────┐                                                ║
║  │ PATIENCE: █████████░ │  ← Nearly maxed                               ║
║  │ 94 / 100 (APOPLECTIC)│                                                ║
║  └──────────────────────┘                                                ║
║                                                                           ║
║  [Red screen pulse 50%, violent shake ±10px, gavel strike sound]         ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Animation Notes:**
- Gavel strikes desk (motion from top to bottom)
- Screen shakes ±10px radially
- White flash on impact
- Impact burst (radiating lines)
- 0.6 second loop
- Sound: BANG

---

## SCREEN 6: JUDGE VIEW - VOLCANIC STATE (100 Patience) - GAME OVER

```
╔═══════════════════════════════════════════════════════════════════════════╗
║        COURTROOM - JUDGE VIEW [MAXIMUM SHAKE ±15px] [FREEZE FRAME]       ║
║                                                                           ║
║  [Screen shaking violently, entire screen red overlay 60%]               ║
║  [Gavel SHATTERED, fragments frozen mid-air]                             ║
║                                                                           ║
║                      ┌────────────────────┐                              ║
║                      │   JUDGE'S BENCH    │                              ║
║                      └────────────────────┘                              ║
║                                                                           ║
║               ╱╲╱╲╱╲╱╲╱╲ ╭───────╮     ┌─╮ ┌╮ ╱─╲  ← Gavel fragments  ║
║              │││││││││││╱  ▓▓  ╲    │╱│ └╯ │  │    flying              ║
║               ╲╱╲╱╲╱╲╱╲╱│  ░░░  │   └─┘   ╱─╯                           ║
║                          ╲══╦══╱           ◦◦◦◦◦ ← More spit            ║
║                            ║║║                                           ║
║                        ┌───┴┴───┐         ← Purple-red face            ║
║                       │  ROBE   │         ← Black veins                ║
║                      │    ▲▲▲    │        ← Standing, leaning over     ║
║                      └───────────┘                                       ║
║                  ╱                 ╲      ← Both hands on desk          ║
║                 │   ═══════════════ │     ← SLAMMING desk               ║
║                ┌┴────────────────────┴┐   ◆◆◆ ← Dust cloud             ║
║                │    Judge's Bench     │                                  ║
║                └───────────────────────┘                                 ║
║                                                                           ║
║                                                                           ║
║                   ╔═══════════════════════════════╗                      ║
║                   ║  MAXIMUM SENTENCE             ║                      ║
║                   ║                               ║                      ║
║                   ║  999 YEARS                    ║                      ║
║                   ╚═══════════════════════════════╝                      ║
║                                                                           ║
║  ┌──────────────────────┐                                                ║
║  │ PATIENCE: ██████████ │  ← MAXED OUT (red)                            ║
║  │ 100 / 100 (VOLCANIC) │                                                ║
║  └──────────────────────┘                                                ║
║                                                                           ║
║  [Purple-red full screen overlay 60%, violent shake, CRACK BOOM sound]   ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

**Animation Notes:**
- Plays ONCE, then FREEZES on frame 5
- Gavel fragments fly outward
- Screen shake ±15px (violent)
- Purple-red face color
- Sound: CRACK + BOOM + fragments falling
- Text "MAXIMUM SENTENCE" appears
- No loop (stays frozen)

---

## TRANSITION: DESK VIEW → JUDGE VIEW

```
FRAME 1: Desk View (player just made mistake)
┌──────────────────────────────┐
│  [Form with error marked]    │
│                               │
│  ERROR: Incorrect date format │
└──────────────────────────────┘

   ↓ [Fade to black - 0.3s]

FRAME 2: Black screen
┌──────────────────────────────┐
│                               │
│           [BLACK]             │
│                               │
└──────────────────────────────┘

   ↓ [Sound: Gavel strike]

FRAME 3: Judge View fades in (0.5s)
┌──────────────────────────────┐
│     [Judge sprite visible]    │
│      [Angry expression]       │
│                               │
└──────────────────────────────┘

   ↓ [Dialogue appears]

FRAME 4: Judge reacts
┌──────────────────────────────┐
│  JUDGE: "Another mistake?!"   │
│  [Judge visibly angrier]      │
│  [Veins pulsing]              │
└──────────────────────────────┘

   ↓ [Player clicks Continue]

FRAME 5: Fade back to desk view
┌──────────────────────────────┐
│  [Form back in view]          │
│  [Patience meter updated]     │
│                               │
└──────────────────────────────┘
```

**Timing:** ~2-3 seconds total for full cycle

---

## COLOR PALETTE VISUAL

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                           COLOR PALETTE                                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  BACKGROUNDS:                                                             ║
║  ███ #1a1612  Dark brown-black (courtroom walls)                         ║
║  ███ #2d2418  Lighter brown (wallpaper)                                  ║
║  ███ #3d2f1f  Mahogany brown (wood desk/bench)                           ║
║                                                                           ║
║  JUDGE SKIN (PROGRESSION):                                               ║
║  ███ #c5a789  Neutral (pale, sickly)                                     ║
║  ███ #cc8866  Irritated (slight warmth)                                  ║
║  ███ #dd6655  Angry (reddening)                                          ║
║  ███ #ee5544  Furious (red)                                              ║
║  ███ #dd3333  Apoplectic (crimson)                                       ║
║  ███ #aa2244  Volcanic (purple-red)                                      ║
║                                                                           ║
║  VEINS:                                                                   ║
║  ███ #8b0000  Angry (dark red)                                           ║
║  ███ #6b0f1a  Furious (purple-red)                                       ║
║  ███ #4a0e1e  Apoplectic (deep purple-red)                               ║
║  ███ #000000  Volcanic (black)                                           ║
║                                                                           ║
║  UI ELEMENTS:                                                             ║
║  ███ #f5ede1  Paper white (aged, off-white)                              ║
║  ███ #ffd995  Candlelight (warm, dim light)                              ║
║  ███ #8b0000  Stamp red                                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## PATIENCE METER PROGRESSION

```
NEUTRAL (0-15):
┌─────────────────────────────┐
│ PATIENCE: ██░░░░░░░░░░░░░░ │  Green gradient
│ 12 / 100                    │
└─────────────────────────────┘

IRRITATED (16-35):
┌─────────────────────────────┐
│ PATIENCE: ████░░░░░░░░░░░░ │  Yellow-green
│ 28 / 100                    │
└─────────────────────────────┘

ANGRY (36-60):
┌─────────────────────────────┐
│ PATIENCE: ██████░░░░░░░░░░ │  Orange
│ 54 / 100                    │
└─────────────────────────────┘

FURIOUS (61-85):
┌─────────────────────────────┐
│ PATIENCE: ████████░░░░░░░░ │  Red
│ 78 / 100                    │
└─────────────────────────────┘

APOPLECTIC (86-99):
┌─────────────────────────────┐
│ PATIENCE: █████████░░░░░░░ │  Deep red
│ 94 / 100                    │
└─────────────────────────────┘

VOLCANIC (100):
┌─────────────────────────────┐
│ PATIENCE: ██████████████████│  Flashing red
│ 100 / 100 ⚠ MAXIMUM!       │
└─────────────────────────────┘
```

---

## SOUND EFFECTS TIMELINE

```
STATE CHANGE: NEUTRAL → IRRITATED
─────────────────────────────────────
[0.0s] State transition starts
[0.2s] Finger drum sound (tap)
[0.6s] Second tap
[1.0s] Third tap (loop continues)


STATE CHANGE: IRRITATED → ANGRY
─────────────────────────────────────
[0.0s] State transition starts
[0.3s] Heavy breathing starts (loop)
[0.5s] Deep exhale through nose
[0.8s] Inhale (loop continues)


STATE CHANGE: ANGRY → FURIOUS
─────────────────────────────────────
[0.0s] State transition starts
[0.2s] Desk creak (wood stress)
[0.5s] Heavy breathing (louder)
[0.8s] Gavel being gripped tightly


STATE CHANGE: FURIOUS → APOPLECTIC
─────────────────────────────────────
[0.0s] State transition starts
[0.3s] Gavel raised (whoosh)
[0.6s] ANGRY GAVEL STRIKE (BANG!)
       - 60Hz sine wave → 30Hz (0.15s)
       - Impact noise (white noise burst)
[0.8s] Reverberation


STATE CHANGE: APOPLECTIC → VOLCANIC
─────────────────────────────────────
[0.0s] State transition starts
[0.1s] CRACK! (wood splitting)
       - 180Hz sawtooth → 60Hz (0.15s)
[0.2s] BOOM! (impact)
       - 50Hz sine → 20Hz (0.3s)
[0.3s] Fragments falling (5x taps)
       - 200-300Hz, staggered timing
[0.5s] Silence (freeze frame)
[2.0s] "MAXIMUM SENTENCE" appears
```

---

## MOBILE LAYOUT ADJUSTMENTS

### Desktop (1920x1080):
```
┌──────────────────────────────────────────────────┐
│                                                  │
│         [Full judge sprite - 70% screen]         │
│                                                  │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Dialogue box (80% width)                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Patience meter (top-right)                     │
└──────────────────────────────────────────────────┘
```

### Tablet (768x1024):
```
┌──────────────────────────────┐
│                              │
│  [Judge sprite - 60% screen] │
│                              │
│                              │
│ ┌──────────────────────────┐ │
│ │ Dialogue (90% width)     │ │
│ └──────────────────────────┘ │
│                              │
│ Patience meter (top-right)  │
└──────────────────────────────┘
```

### Phone (375x667):
```
┌──────────────────────┐
│                      │
│ [Judge sprite - 50%] │
│                      │
│ ┌──────────────────┐ │
│ │ Dialogue (95%)   │ │
│ │ (smaller font)   │ │
│ └──────────────────┘ │
│                      │
│ Patience (compact)  │
└──────────────────────┘
```

---

## IMPLEMENTATION VISUAL CHECKLIST

Use these mockups to verify implementation:

### Desk View:
- [ ] Wooden desk surface rendered
- [ ] Form appears centered
- [ ] Small patience meter in corner
- [ ] Vignette darkens edges
- [ ] Film grain visible

### Judge View - NEUTRAL:
- [ ] Judge sprite 70% of screen height
- [ ] Half-closed eyes
- [ ] Slow blink animation
- [ ] Dark courtroom background
- [ ] Judge's bench visible

### Judge View - ANGRY:
- [ ] 2-3 visible veins pulsing
- [ ] Face reddened (#dd6655)
- [ ] Eyes bloodshot
- [ ] Heavy breathing animation
- [ ] Slight red vignette

### Judge View - FURIOUS:
- [ ] Gavel raised and trembling
- [ ] Many veins (5-6)
- [ ] Screen shaking ±5px
- [ ] Sweat drops visible
- [ ] Red vignette 30%

### Judge View - APOPLECTIC:
- [ ] Gavel mid-strike
- [ ] Screen shake ±10px
- [ ] Impact burst on strike
- [ ] White flash frame
- [ ] Red overlay 50%

### Judge View - VOLCANIC:
- [ ] Gavel shattered (6+ fragments)
- [ ] Screen shake ±15px violent
- [ ] Purple-red face (#aa2244)
- [ ] Freeze frame works
- [ ] "MAXIMUM SENTENCE" text

---

**These mockups represent the EXACT visual experience players will have. Use them as reference during implementation.**

**Created:** 2025-10-16
**For:** v1.5.0 Ace Attorney Courtroom System
**Status:** ✅ VISUAL REFERENCE COMPLETE
