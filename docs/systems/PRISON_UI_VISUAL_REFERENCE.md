# PRISON UI SYSTEM - VISUAL REFERENCE

**Version:** 1.5.0
**Created:** 2025-10-19
**Agent:** isometric-pixel-artist

---

## 🎨 COLOR PALETTE

### Primary Colors

```
PRISON ORANGE FAMILY
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Prison Orange      │  Orange Dark        │  Orange Light       │
│  #FF8C42            │  #D97028            │  #FFB380            │
│  rgb(255,140,66)    │  rgb(217,112,40)    │  rgb(255,179,128)   │
│  Main accent        │  Hover/active       │  Highlights         │
└─────────────────────┴─────────────────────┴─────────────────────┘

CONCRETE/BACKGROUND TONES
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Concrete Dark      │  Concrete Mid       │  Concrete Light     │
│  #3E3E42            │  #5A5A60            │  #7A7A80            │
│  rgb(62,62,66)      │  rgb(90,90,96)      │  rgb(122,122,128)   │
│  Dark walls         │  Mid walls          │  Light concrete     │
└─────────────────────┴─────────────────────┴─────────────────────┘

WARM ACCENT COLORS
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Warm Yellow        │  Warm Amber         │  Rust Red           │
│  #FFD670            │  #FFA940            │  #B85450            │
│  rgb(255,214,112)   │  rgb(255,169,64)    │  rgb(184,84,80)     │
│  Light/warnings     │  Lamp glow          │  Danger/errors      │
└─────────────────────┴─────────────────────┴─────────────────────┘

TEXT COLORS
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Warm White         │  Text Secondary     │  Text Disabled      │
│  #F5E6D3            │  #C5B6A3            │  #7A7A80            │
│  rgb(245,230,211)   │  rgb(197,182,163)   │  rgb(122,122,128)   │
│  Primary text       │  Secondary text     │  Disabled state     │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

---

## 📐 COMPONENT DIMENSIONS

### Button Sizes

```
PIXEL BUTTON (Default)
┌────────────────────────────────────┐
│  Padding: 16px 24px                │
│  Font: 16px bold                   │
│  Border: 2px solid                 │
│  Min Height: 48px (mobile touch)   │
│  Gap (with icon): 12px             │
└────────────────────────────────────┘

PIXEL BUTTON (Mobile < 480px)
┌────────────────────────────────────┐
│  Width: 100%                       │
│  Padding: 20px 16px                │
│  Font: 14px bold                   │
└────────────────────────────────────┘
```

### Activity Cards

```
PRISON ACTIVITY CARD
┌─────────────────────────────────────────────┐
│  ▌ ICON  TITLE                              │  ← 4px accent bar
│  ▌                                          │
│  ▌ Description text goes here...           │
│  ▌ Can span multiple lines                 │
│  ▌                                          │
│  ▌ Cost: X • Gain: Y                       │
└─────────────────────────────────────────────┘

Padding: 20px
Margin: 12px 0
Border: 2px solid
Icon: 48x48px
Shadow: 4px 4px 0 rgba(0,0,0,0.2)
```

### Stats Panel

```
STATS PANEL (Desktop)
┌────────────────────────────────────┐
│  PRISONER NAME                     │
│                                    │
│  💰 999 Credits                    │
│  🚬 99 Cigarettes                  │
│                                    │
│  HUNGER    [████████--] 80         │
│  STRENGTH  [████------] 40         │
│  INTELL.   [██████----] 60         │
│                                    │
└────────────────────────────────────┘

Position: Fixed top-left (20px, 20px)
Width: 280px minimum
Border: 2px solid
Background: rgba(42,42,46,0.95)

STATS PANEL (Mobile < 768px)
┌──────────────────────────────────────────┐
│  PRISONER NAME                           │
│  💰 999 Credits  🚬 99 Cigs             │
│  HUNGER    [████████--] 80               │
│  STRENGTH  [████------] 40               │
│  INTELL.   [██████----] 60               │
└──────────────────────────────────────────┘

Position: Static (top of screen)
Width: 100%
```

### Stat Bar Details

```
STAT BAR ANATOMY
┌────────────────────────────────────────────┐
│  LABEL   [██████████░░░░░░░░░░]  VALUE     │
└────────────────────────────────────────────┘
   ↑       ↑                       ↑
   11px    16px height             16px bold
   100px   Flex: 1                 60px min-width
   width

Bar Container:
- Background: dark
- Border: 2px solid
- Inset shadow for depth

Bar Fill:
- Colored background (varies by stat)
- Repeating gradient stripes (4px)
- Smooth width transition (0.3s)
```

---

## 🎭 VISUAL STATES

### Button States

```
DEFAULT STATE
┌──────────────────────┐
│   BUTTON TEXT        │  Background: #3A3A3E
└──────────────────────┘  Border: 2px #FF8C42
                          Shadow: 0 4px 0

HOVER STATE
┌──────────────────────┐
│   BUTTON TEXT        │  Background: #FF8C42
└──────────────────────┘  Border: 2px #D97028
    ↑ 2px               Shadow: 0 6px 0
                          Transform: translateY(-2px)

ACTIVE STATE
┌──────────────────────┐
│   BUTTON TEXT        │  Background: #FF8C42
└──────────────────────┘  Border: 2px #D97028
    ↓ 2px               Shadow: 0 1px 0
                          Transform: translateY(2px)

DISABLED STATE
┌──────────────────────┐
│   BUTTON TEXT        │  Background: #2A2A2E
└──────────────────────┘  Border: 2px #4A4A4E
                          Color: #7A7A80
                          Cursor: not-allowed
```

### Activity Card States

```
DEFAULT STATE
┌────────────────────────────────────┐
│▌ ICON  TITLE                       │  Accent bar: 4px
│▌ Description...                    │  Background: #3A3A3E
└────────────────────────────────────┘  Border: 2px #FF8C42

HOVER STATE
┌────────────────────────────────────┐
│▌▌ ICON  TITLE                      │  Accent bar: 8px (glowing)
│▌▌ Description...                   │  Background: #2A2A2E
└────────────────────────────────────┘  Border: 2px #FFB380
    → 4px                                Transform: translateX(4px)

ACTIVE STATE
┌────────────────────────────────────┐
│▌ ICON  TITLE                       │  Reduced shadow
│▌ Description...                    │  Transform: translate(2px, 2px)
└────────────────────────────────────┘
```

---

## 🌅 ATMOSPHERIC EFFECTS

### Prison Cell Background

```
LAYERED EFFECTS:

Layer 1: Base Gradient
┌────────────────────────────────────┐
│                                    │  Linear gradient:
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  #3E3E42 → #2A2A2E
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  135deg diagonal
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                    │
└────────────────────────────────────┘

Layer 2: Concrete Texture (::before)
┌────┬────┬────┬────┬────┬────┬────┐
│    │    │    │    │    │    │    │  Grid pattern:
├────┼────┼────┼────┼────┼────┼────┤  40px × 40px
│    │    │    │    │    │    │    │  Subtle white lines
├────┼────┼────┼────┼────┼────┼────┤  Opacity: 0.5
│    │    │    │    │    │    │    │
└────┴────┴────┴────┴────┴────┴────┘

Layer 3: Window Light Beam (::after)
┌────────────────────────────────────┐
│              ╱╱                    │  Diagonal light beam
│             ╱╱                     │  200px wide
│            ╱╱                      │  Animated position
│           ╱╱                       │  Warm yellow glow
│          ╱╱                        │  Opacity: 0.4-0.6
│         ╱╱                         │  8s animation loop
└────────────────────────────────────┘

Layer 4: Scanlines
────────────────────────────────────  Repeating gradient
────────────────────────────────────  Every 3px
────────────────────────────────────  Subtle texture
────────────────────────────────────
```

---

## 🎯 ICON SPECIFICATIONS

### Activity Icons (48×48px)

```
CURRENT IMPLEMENTATION (Emoji-based):
┌──────┬──────┬──────┬──────┐
│ 💪   │ 🍽️   │ 📚   │ ✉️   │
│Weights│ Eat  │ Read │Letter│
├──────┼──────┼──────┼──────┤
│ 💬   │ 🎨   │ 🛒   │ 👥   │
│Cell- │Tattoo│Comm- │ Gang │
│mate  │      │issary│      │
├──────┼──────┼──────┼──────┤
│ 💅   │ 🚪   │ 🏥   │ 💑   │
│Mani- │Escape│Clinic│Conju-│
│cure  │      │      │ gal  │
└──────┴──────┴──────┴──────┘

Container Styling:
- Size: 48×48px
- Background: #2A2A2E
- Border: 2px solid #FF8C42
- Inset shadow: 1px 1px 0 rgba(0,0,0,0.3)
- Font-size: 24px (for emoji)
- Centered (flex)

FUTURE PIXEL ART SPRITES (Optional):
Create 48×48px pixel art icons
Export as sprite sheet: icons.png
Grid: 4 columns × 3 rows
Total size: 192×144px
Each icon: 8×8 color palette
```

---

## 📊 LAYOUT TEMPLATES

### Prison Menu Layout (Desktop)

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  ┌──────────┐  ┌───────────────────────────────────────┐│
│  │ STATS    │  │         YOUR CELL                     ││
│  │ PANEL    │  │                                       ││
│  │          │  │  ┌────────────────────────────────┐  ││
│  │ Name     │  │  │ DAY 5  │  SENTENCE 25d         │  ││
│  │ 💰 999   │  │  └────────────────────────────────┘  ││
│  │ 🚬 99    │  │                                       ││
│  │          │  │  ┌─ ACTIVITY CARD ─────────────────┐ ││
│  │ HUNGER   │  │  │▌ 💪 LIFT WEIGHTS               │ ││
│  │ [████]   │  │  │▌ Build strength...             │ ││
│  │          │  │  └────────────────────────────────┘ ││
│  │ STRENGTH │  │                                       ││
│  │ [██]     │  │  ┌─ ACTIVITY CARD ─────────────────┐ ││
│  │          │  │  │▌ 🍽️ EAT IN CAFETERIA          │ ││
│  │ INTELL.  │  │  │▌ Consume questionable food...  │ ││
│  │ [███]    │  │  └────────────────────────────────┘ ││
│  │          │  │                                       ││
│  └──────────┘  │  [More activity cards...]             ││
│   Fixed left   │                                       ││
│   280px width  │  ┌──────────────────────┐            ││
│                │  │ SERVE TIME (SKIP)   │            ││
│                │  └──────────────────────┘            ││
│                └───────────────────────────────────────┘│
│                  Max-width: 800px, margin-left: 320px  │
└───────────────────────────────────────────────────────────┘
```

### Prison Menu Layout (Mobile < 768px)

```
┌──────────────────────────┐
│                          │
│  ┌──────────────────────┐│
│  │ STATS PANEL          ││
│  │ Name  💰999  🚬99    ││
│  │ HUNGER   [████]  80  ││
│  │ STRENGTH [██]    40  ││
│  │ INTELL.  [███]   60  ││
│  └──────────────────────┘│
│                          │
│    YOUR CELL             │
│                          │
│  ┌──────────────────────┐│
│  │ DAY 5 │ SENTENCE 25d ││
│  └──────────────────────┘│
│                          │
│  ┌─ ACTIVITY CARD ──────┐│
│  │▌ 💪                  ││
│  │▌ LIFT WEIGHTS        ││
│  │▌ Build strength...   ││
│  └──────────────────────┘│
│                          │
│  ┌─ ACTIVITY CARD ──────┐│
│  │▌ 🍽️                 ││
│  │▌ EAT IN CAFETERIA    ││
│  │▌ Consume food...     ││
│  └──────────────────────┘│
│                          │
│  [More cards...]         │
│                          │
│  ┌──────────────────────┐│
│  │ SERVE TIME (SKIP)   ││
│  └──────────────────────┘│
│                          │
└──────────────────────────┘
```

---

## 🎬 ANIMATIONS

### Button Hover Animation

```
Timeline (0.1s total):

0ms     ┌──────────┐
        │  BUTTON  │  Y: 0px
        └──────────┘  Shadow: 0 4px 0

50ms    ┌──────────┐
         │ BUTTON  │   Y: -1px (transitioning)
        └──────────┘  Shadow: growing

100ms   ┌──────────┐
         │ BUTTON  │   Y: -2px (final)
        └──────────┘  Shadow: 0 6px 0
         ↑ hover

Properties animated:
- transform: translateY()
- background-color
- box-shadow
- border-color

Easing: ease (default cubic-bezier)
```

### Activity Card Hover Animation

```
Timeline (0.15s total):

0ms     ┌────────────┐
        │▌ CARD      │  X: 0px, Accent: 4px
        └────────────┘

75ms    ┌────────────┐
         │▌▌CARD     │   X: 2px, Accent: 6px
        └────────────┘  (transitioning)

150ms   ┌────────────┐
         │▌▌CARD     │   X: 4px, Accent: 8px
        └────────────┘  (final)
         → hover

Properties animated:
- transform: translateX()
- background-color
- border-color
- ::before width (accent bar)
- box-shadow

Easing: ease
```

### Light Beam Animation

```
Timeline (8s loop, infinite):

0s      Light beam: opacity 0.4, X: 0px
        ╱╱

4s      Light beam: opacity 0.6, X: 20px
         ╱╱

8s      Light beam: opacity 0.4, X: 0px (loop)
        ╱╱

Properties animated:
- opacity: 0.4 → 0.6 → 0.4
- transform: translateX(0) → translateX(20px) → translateX(0)

Easing: ease-in-out
Duration: 8s
Iteration: infinite
```

### Stat Change Indicator

```
Timeline (1s, plays once):

0ms     +10 ←─ Value appears above stat
        ↑
        Opacity: 1, Y: 0px

500ms   +10
          ↑
        Opacity: 0.5, Y: -10px

1000ms  (invisible)
          ↑
        Opacity: 0, Y: -20px, removed

Properties animated:
- opacity: 1 → 0
- transform: translateY(0 → -20px)

Easing: ease-out
Duration: 1s
Forwards: true (stays hidden)
```

### Modal Appear Animation

```
Timeline (0.2s):

0ms     Overlay: opacity 0
        Modal: opacity 0, scale 0.9

100ms   Overlay: opacity 0.5
        Modal: opacity 0.5, scale 0.95

200ms   Overlay: opacity 1
        Modal: opacity 1, scale 1

Properties animated:
- opacity: 0 → 1
- transform: scale(0.9) → scale(1)

Easing: ease-out
Duration: 0.2s
```

---

## 🎨 PIXEL ART TECHNIQUES

### Inset/Outset Shadows (Pseudo-3D)

```
BUTTON RAISED EFFECT:
┌──────────────────┐
│░ Top-left light  │  box-shadow:
│                 ▓│  inset 2px 2px 0 rgba(255,255,255,0.2)
│               ▓▓│  inset -2px -2px 0 rgba(0,0,0,0.4)
└─────────────▓▓▓▓┘  0 4px 0 rgba(0,0,0,0.3)
  Bottom-right dark

BUTTON PRESSED EFFECT:
┌──────────────────┐
│▓                 │  box-shadow:
│▓▓ Bottom-left    │  inset 2px 2px 0 rgba(0,0,0,0.3)
│   dark           │  inset -2px -2px 0 rgba(255,255,255,0.2)
└──────────────────┘  0 1px 0 rgba(0,0,0,0.3)
  Top-right light
```

### Pixel Border Technique

```
ACTIVITY CARD BORDER:
    ┌─────────────────┐
  ┌─┤ 2px solid color │
┌─┤ │                 │
│ │ │   Content       │
│ │ └─────────────────┘
│ └───┘ 4px accent bar
└─────┘

Implementation:
- Border: 2px solid (main)
- ::before: Accent bar (animated width)
```

### Texture Patterns

```
SCANLINE EFFECT:
────────────────────  Repeating linear gradient
────────────────────  0px: rgba(0,0,0,0.1)
────────────────────  1px: transparent
────────────────────  2px: transparent
────────────────────  3px: rgba(0,0,0,0.1)

CONCRETE GRID:
┌───┬───┬───┬───┐  Repeating linear gradient
│   │   │   │   │  90deg and 0deg overlaid
├───┼───┼───┼───┤  95%: transparent
│   │   │   │   │  95%-100%: rgba(255,255,255,0.02)
├───┼───┼───┼───┤  40×40px size
│   │   │   │   │
└───┴───┴───┴───┘

STAT BAR STRIPES:
[████████████]  Repeating linear gradient
                90deg direction
                0-3px: transparent
                3-4px: rgba(255,255,255,0.1)
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
DESKTOP (> 768px)
┌────────────────────────────────┐
│ [Stats Panel]  [Main Content]  │  Stats: Fixed left, 280px
│                                 │  Content: margin-left 320px
│                                 │  Buttons: Auto width
└────────────────────────────────┘

TABLET (≤ 768px)
┌────────────────────────────────┐
│     [Stats Panel - Full]       │  Stats: Static, 100% width
├────────────────────────────────┤  Content: No left margin
│                                 │  Buttons: 100% width
│      [Main Content]             │  Cards: Full width
│                                 │
└────────────────────────────────┘

PHONE (≤ 480px)
┌──────────────────┐
│ [Stats - Compact]│  Stats: Compressed
├──────────────────┤  Icons: Smaller (40px)
│                  │  Font: Reduced (14px)
│  [Card Header]   │  Headers: Stack vertical
│  [Icon]          │  Time: Wraps to 2 lines
│  [Title]         │  Toast: Full width
│  [Description]   │  Padding: Reduced
│                  │
└──────────────────┘
```

---

## ♿ ACCESSIBILITY CHECKLIST

```
✅ KEYBOARD NAVIGATION
   - Tab order: Logical top-to-bottom
   - Focus indicators: 3px yellow outline
   - Enter/Space: Activates buttons
   - Escape: Closes modals

✅ SCREEN READER
   - Semantic HTML (h1, h2, p, button)
   - ARIA labels on icons (recommended addition)
   - Alt text for images (when implemented)

✅ COLOR CONTRAST
   - Text on background: 7:1 (AAA)
   - Buttons on background: 4.5:1 (AA)
   - Disabled text: Intentionally low

✅ MOTION SENSITIVITY
   - prefers-reduced-motion: All animations 0.01ms
   - Maintains layout, removes motion

✅ TOUCH TARGETS
   - Minimum: 48×48px (WCAG Level AAA)
   - Buttons: 48px+ height
   - Activity cards: 80px+ height
   - Adequate spacing: 12px+ between

✅ HIGH CONTRAST MODE
   - prefers-contrast: high
   - Brighter colors
   - Stronger borders
```

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: Core UI (IMMEDIATE)
1. ✅ Add CSS file to project
2. ✅ Link in HTML `<head>`
3. ✅ Update prison menu HTML structure
4. ✅ Apply `.prison-cell-bg` wrapper
5. ✅ Convert buttons to `.pixel-button`

### Phase 2: Interactive Elements (HIGH)
1. Stats panel with live updates
2. Activity cards with proper icons
3. Time/date display
4. Toast notification system

### Phase 3: Advanced Features (MEDIUM)
1. Modal system for dialogs
2. Prisoner info card
3. Stat change animations
4. Custom color variants

### Phase 4: Polish (LOW)
1. Replace emoji icons with pixel sprites
2. Add custom sound effects
3. Particle effects (optional)
4. Additional animations

---

**Created with pixel-perfect precision**
**isometric-pixel-artist • VROOM VROOM v1.5.0**
