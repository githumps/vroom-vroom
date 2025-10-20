# DRIVER'S LICENSE - VISUAL REFERENCE

**Version:** 1.5.0
**Created:** 2025-10-19
**Artist:** isometric-pixel-artist agent

---

## 📐 DIMENSIONS & LAYOUT

### Full License Card: 320x180 pixels

```
┌────────────────────────────────────────────────────────┐
│  DYSTOPIAN DEPARTMENT OF MOTOR VEHICLES                │
│  Official Driver Identification                        │  ← Header (20px height)
├────────────────────────────────────────────────────────┤
│  ┌────────┐  ┌──────────────────────────────────────┐ │
│  │        │  │ Full Name: ________________           │ │
│  │ MUGSHOT│  │ Height: ___   Skin: ______            │ │
│  │ 80x100 │  │ Vehicle: ______________               │ │
│  │  B&W   │  │ Status: ________                      │ │  ← Info Section
│  │        │  │ Violations: ___                       │ │
│  │ ###### │  └──────────────────────────────────────┘ │
│  └────────┘                                            │
│  ▐████████▌  ID: DMV-######                            │  ← Barcode
│  ┌────────────────────────────────────────────────────┤
│  │ $ 💰  🍽️ 💪 🧠  ← Stats                           │  ← Status Bar (20px)
└──┴────────────────────────────────────────────────────┘
   320px wide, 180px tall
```

---

## 🎨 COLOR PALETTE

### Document Colors

```
Paper Base:        #E8D4B8  ████████  (Aged manila)
Paper Dark:        #D4C4A8  ████████  (Worn edges)
Paper Light:       #F4E4C8  ████████  (Highlights)
Coffee Stain:      #B89868  ████████  (Top right corner)
```

### Ink Colors

```
Black Text:        #2A2A2A  ████████  (Official forms)
Faded Text:        #5A5A5A  ████████  (Labels)
Blue Official:     #4A6AA8  ████████  (Header, seals)
```

### Stamp Colors

```
Red Stamp:         #D84448  ████████  (VOID, REVOKED)
Red Dark:          #B83838  ████████  (Stamp shadow)
Blue Stamp:        #4A6AA8  ████████  (Official seals)
Purple Stamp:      #7A4A8A  ████████  (Inspection)
Yellow Caution:    #FFD670  ████████  (CAUTION)
Green Approved:    #6ABF69  ████████  (INSPECTED - rare)
```

---

## 📋 STAMP COLLECTION (15 DESIGNS)

### Tier 1: First Offense (1 arrest)

```
┌─────────────┐
│   CAUTION   │  Yellow ink, no border
└─────────────┘  16px font, 5° rotation

┌─────────────┐
│  INSPECTED  │  Green ink, no border (rare)
└─────────────┘  10px font, -3° rotation
```

### Tier 2: Second Offense (2 arrests)

```
╔═════════════╗
║  HIGH RISK  ║  Red ink, no border
╚═════════════╝  14px font, 8° rotation

┌─────────────┐
│  SUSPENDED  │  Purple ink, 2px border
└─────────────┘  16px font, -10° rotation
```

### Tier 3: Serious (3 arrests)

```
╔═══════════╗
║  REVOKED  ║  Red ink, 3px border, background tint
╚═══════════╝  20px font, 8° rotation

╔═══════════╗
║  DANGER   ║  Red ink, 3px border
╚═══════════╝  18px font, -12° rotation
```

### Tier 4: Major (4 arrests)

```
    DENIED     Red ink, bold, shadow
               24px font, 15° rotation

┌──────────────┐
│ UNFIT TO     │  Blue ink, no border
│    DRIVE     │  11px font, 10° rotation
└──────────────┘
```

### Tier 5: Chronic (5+ arrests)

```
┌──────────────┐
│  DO NOT      │  Red ink, 2px border
│   OPERATE    │  12px font, -8° rotation
└──────────────┘

┌──────────────┐
│ CONFISCATED  │  Blue ink, 2px border
└──────────────┘  12px font, -7° rotation
```

### Tier 6: Habitual (7+ arrests)

```
   REPEAT       Red dark ink, shadow
   OFFENDER     14px font, -6° rotation


┌──────────────┐
│ MENACE TO    │  Purple ink, 2px border
│   SOCIETY    │  10px font, 12° rotation
└──────────────┘
```

### Tier 7: Terminal (10+ arrests)

```
┌──────────────────┐
│  PERMANENTLY     │  Red ink, 2px border
│     BANNED       │  9px font, -5° rotation
└──────────────────┘


        V O I D     MASSIVE red stamp
                     32px font, -15° rotation
                     Often placed twice on license
```

### Special: Official Seal

```
     ╔═══════╗
    ║  DEPT  ║
   ║   OF    ║      Blue circular stamp
   ║  MOTOR  ║      40px diameter
   ║ VEHICLES║      3px border
    ╚═══════╝       6px font
```

---

## 👤 MUGSHOT SPECIFICATIONS

### Size: 80x100 pixels

### Processing Pipeline:

1. **Source:** Character sprite from `character-sprites.js` (64x96)
2. **Crop:** Top 64x80 pixels (head + shoulders only)
3. **Scale:** Stretch vertically by 2.5x to fill 80x100 canvas
4. **Grayscale:** Convert to black & white (filter: grayscale(100%))
5. **Contrast:** Increase contrast by 120%
6. **Grain:** Add random noise ±15 brightness per pixel
7. **Vignette:** Radial gradient from center (60% opacity at edges)

### Background:

```
Horizontal measurement lines every 10 pixels:
─────────────────────  0
                      10
─────────────────────  20
                      30
─────────────────────  40
                      50
(etc.)
```

### Color Mapping (Grayscale):

```
Hair:      #5A5A5A  ████████  (Dark gray)
Skin:      #A8A8A8  ████████  (Mid gray)
Clothing:  #D8D8D8  ████████  (Light gray)
Shadow:    #2A2A2A  ████████  (Black)
```

### Prisoner Number Overlay:

```
Position: Bottom 16px of mugshot
Background: rgba(42, 42, 42, 0.8)  (80% black)
Text: #F5E6D3 (cream), 8px Courier New
Format: "#123456" (6-digit hash of player name)
```

---

## 🎯 STAT ICONS (12x12 PIXEL ART)

### Money Icon ($)
```
  ██████████
 ████████████
██░░██░░░░████
██░░░░░░░░░░██
██░░░███░░░░██
██░░██░██░░░██
██░░░███░░░░██
██░░░░░░░░░░██
████░░░░██░░██
 ████████████
  ██████████
```
Colors: Green (#6ABF69) with black detail

### Cigarette Icon
```


  ░░░░░░░░
  ████████░░
  ██▓▓▓▓██░░
  ██▓▓▓▓██
  ████████
    ████


```
Colors: Cream paper, yellow filter, orange ember

### Hunger Icon (Bowl)
```


   ██████
  ██░░░░██
 ██░░░░░░██
 ██░░░░░░██
 ██░░░░░░██
  ████████
   ██████

```
Colors: Gray bowl, black interior

### Strength Icon (Arm)
```

   ████
  ██░░██
 ██░░░░██
 ██░░░░████
██░░░░░░░░██
██░░░░░░░░██
 ██░░░░████
  ██████

```
Colors: Skin tone (#D4A88C), muscle shadow

### Intelligence Icon (Brain)
```

   ██████
  ██▓▓▓▓██
 ██▓▓░░▓▓██
██▓▓░░░░▓▓██
██▓▓░░░░▓▓██
 ██▓▓░░▓▓██
  ██▓▓▓▓██
   ██████

```
Colors: Blue (#6AB5FF) with darker detail

### Behavior Icon (Star)
```

     ██
    ████
   ██░░██
  ██░░░░██
 ████░░████
██░░░░░░░░██
 ██░░░░░░██
  ██░░░░██
   ██████
```
Colors: Purple (#9A6AAA) with shadow

### Arrests Icon (Handcuffs)
```

  ████████
 ██░░░░░░██
 ██░░██░░██
 ██░░██░░██
 ██░░██░░██
 ██░░░░░░██
  ████████


```
Colors: Gray metal (#7A7A7A)

### Days Icon (Calendar)
```

 ██████████
 ██████████
 ██░░░░░░██
 ██░██░██░██
 ██░██░██░██
 ██░░░░░░██
 ██░██░██░██
 ██████████

```
Colors: Red (#B85450) with black squares

---

## 🔍 COP INSPECTION SPRITES

### Magnifying Glass (64x64)

```
              ██████████
          ████░░░░░░░░░░████
        ██░░░░░░░░░░░░░░░░░░██
      ██░░░░░░░░░░░░░░░░░░░░░░██
    ██░░░░░░░░░░░░░░░░░░░░░░░░░░██
    ██░░░░░░░░░░░░░░░░░░░░░░░░░░██
      ██░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░██
          ████░░░░░░░░░░████
              ██████████
                  ▓▓▓▓  ← Wood handle
                  ▓▓▓▓
              ████████████
            ██▒▒▒▒▒▒▒▒▒▒██  ← Hand
          ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
```

Colors:
- Frame: Dark metal (#3A3A3A)
- Glass: Light blue tint (#E8F4FF, semi-transparent)
- Handle: Wood (#5A4A3A)
- Hand: Skin tone (#D4A88C)

### Cop Face (48x48)

```
                  ████████████
              ████░░░░░░░░░░░░████
            ██░░░░░░░░░░░░░░░░░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░██████░░░░░░░░██████░░░░██  ← Eyes (suspicious)
        ██░░░░██▓▓██░░░░░░░░██▓▓██░░░░██
      ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░░░██████░░░░░░░░░░░░██  ← Nose
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░████████████████░░██      ← Mouth (frown)
              ██░░░░░░░░░░░░░░░░██
                ████████████████
```

Colors:
- Hair/uniform: Dark (#3A3A3A)
- Skin: Medium tone (#D4A88C)
- Eyes: Black (#1A1A1A)

---

## 📊 LAYOUT COORDINATES

### Mugshot Container
- Position: `top: 30px, left: 12px`
- Size: `80x100px`
- Border: `2px solid #2A2A2A`

### Info Section
- Position: `top: 30px, left: 100px`
- Size: `208x140px`
- Fields: 5 total (name, height, skin, vehicle, status, violations)

### Barcode
- Position: `bottom: 34px, left: 12px`
- Size: `80x24px`
- Bars: 8 bars with varying heights (60-95%)

### ID Number
- Position: `top: 138px, left: 12px`
- Font: `7px Courier New`
- Format: `DMV-######`

### Status Bar
- Position: `bottom: 8px, left: 12px, right: 12px`
- Height: `20px`
- Icons: 4 icons (money, hunger, strength, intelligence)
- Spacing: `justify-content: space-between`

### Stamp Positions (Suggested)

Common stamp positions (to avoid overlapping key info):

```
Position 1: { x: 120, y: 90 }   (Center, safe)
Position 2: { x: 220, y: 120 }  (Bottom right)
Position 3: { x: 180, y: 60 }   (Upper right)
Position 4: { x: 240, y: 40 }   (Far right corner)
Position 5: { x: 160, y: 140 }  (Bottom left)
Position 6: { x: 200, y: 80 }   (Mid right)
Position 7: { x: 140, y: 110 }  (Lower center)
```

Avoid stamping over:
- Mugshot (0-92px from left)
- Header (0-20px from top)
- Status bar (160-180px from top)

---

## 🎬 ANIMATION TIMINGS

### Stamp Impact Animation (0.4s)

```
Frame 0ms:   Scale 0.0,  Rotation 0°,     Opacity 0%
Frame 100ms: Scale 0.7,  Rotation 50%,    Opacity 60%
Frame 200ms: Scale 1.3,  Rotation 100%,   Opacity 100%
Frame 400ms: Scale 1.0,  Rotation 100%,   Opacity 85%
```

### Violation Shake (0.5s)

```
0ms:   translateX(0)
100ms: translateX(-4px)
200ms: translateX(+4px)
300ms: translateX(-4px)
400ms: translateX(+4px)
500ms: translateX(0)
```

### Breathing Idle (4s loop)

```
0s:   Scale 1.00, translateY(0)
2s:   Scale 1.01, translateY(-2px)
4s:   Scale 1.00, translateY(0)
```

### Inspection Sequence (4s total)

```
t=0.0s: Start inspection
        - License scales to 2.5x
        - License moves to center (translate -50%, -50%)
        - Overlay fades in (500ms)

t=0.5s: Cop hand enters
        - Slides from bottom (-120px → 20px)
        - Rotation -15° → -8°
        - Duration 800ms

t=1.2s: Magnifying glass appears
        - Scale 0.5 → 1.0
        - Opacity 0 → 60%
        - Duration 800ms

t=2.0s: Cop face appears
        - Slides from right (100px → 0)
        - Opacity 0 → 100%
        - Duration 500ms

t=4.0s: End inspection
        - All elements fade out (300ms)
        - License returns to corner
```

---

## 📐 PIXEL ART SPECIFICATIONS

### Grid System
- Base pixel size: 1px
- UI scale multiplier: 2x (for retro look)
- License rendered at 320x180 (native resolution)
- Scales down on mobile (0.7x tablet, 0.6x phone)

### Anti-Aliasing
- Disabled: `image-rendering: pixelated`
- Crisp edges: `image-rendering: crisp-edges`
- Canvas smoothing: `imageSmoothingEnabled = false`

### Texture Effects

**Paper Grain:**
```css
repeating-linear-gradient(
    45deg,
    transparent 0px,
    rgba(42, 42, 42, 0.02) 1px,
    transparent 2px
)
```

**Scanlines:**
```css
repeating-linear-gradient(
    0deg,
    transparent 0px,
    rgba(42, 42, 42, 0.03) 1px,
    transparent 2px
)
```

**Coffee Stain:**
```css
radial-gradient(
    circle at 85% 15%,
    #B89868 0%,
    transparent 12%
)
```

### Shadow System

**License Card Shadow:**
```css
box-shadow:
    0 4px 8px rgba(42, 42, 42, 0.6),
    inset 0 0 40px rgba(180, 150, 100, 0.2);
```

**Stamp Text Shadow:**
```css
text-shadow:
    2px 2px 0 #B83838,      /* Offset shadow */
    0 0 8px #D84448;         /* Glow */
```

**Mugshot Vignette:**
```javascript
radialGradient(
    centerX, centerY, 0,
    centerX, centerY, maxRadius
)
stops: [
    0.0: rgba(0,0,0,0),
    0.7: rgba(0,0,0,0),
    1.0: rgba(0,0,0,0.6)
]
```

---

## 🎨 DESIGN PHILOSOPHY

### Papers Please Influence
- Government document aesthetic
- Aged, worn appearance
- Authoritarian bureaucracy
- Stamps as permanent marks

### Disco Elysium Influence
- Muted, painterly colors
- Warm tones despite bleakness
- Character-driven design
- Personality in text

### DMV Realism
- Actual driver's license layout
- Barcode and ID numbers
- Official seals and stamps
- Mugshot police lineup style

### Dystopian Elements
- Oppressive surveillance
- Permanent record
- No escape from past
- Identity as government property

---

## 💡 ARTISTIC INTENT

The driver's license is designed to feel like a **living document** that accumulates damage and bureaucratic markings over time. Each stamp represents a failure, a violation, a moment when the system caught you.

The **mugshot aesthetic** (black & white, film grain, police lineup) reinforces the prison/arrest theme—you're not a citizen, you're a criminal.

The **always-visible placement** ensures the player can never forget their record. It's a constant reminder of consequences.

The **cop inspection animation** creates tension and humiliation—your identity being scrutinized by authority.

The **progressive stamp system** visualizes the player's descent from "CAUTION" (first offense) to "VOID" (permanently banned). By the time your license is covered in red stamps, you're a marked person in this dystopian society.

Every design choice reinforces the central theme: **in this world, driving is illegal, and your license is proof of your crimes.**

---

## 📸 MOCKUP EXAMPLES

### Clean License (0 arrests)
```
┌────────────────────────────────────────┐
│ DYSTOPIAN DEPT OF MOTOR VEHICLES       │
├────────────────────────────────────────┤
│ ┌──────┐  Name: JOHN DOE               │
│ │      │  Height: 5'10"  Skin: Medium  │
│ │ 😐   │  Vehicle: THE BEATER          │
│ │      │  Status: ACTIVE                │
│ │#12345│  Violations: 0                 │
│ └──────┘                                │
│ ▐██████▌ DMV-012345                     │
│ [$100] [🍽️50] [💪10] [🧠15]           │
└────────────────────────────────────────┘
```

### Marked License (5 arrests)
```
┌────────────────────────────────────────┐
│ DYSTOPIAN DEPT OF MOTOR VEHICLES       │
├────────────────────────────────────────┤
│ ┌──────┐  Name: JOHN DOE     ┌─────┐  │
│ │      │  Height: 5'10"      │VOID │  │
│ │ 😐   │  Vehicle: THE BEATER└─────┘  │
│ │      │  Status: SUSPENDED            │
│ │#12345│  Violations: 5    REVOKED     │
│ └──────┘        ┌──────────┐           │
│ ▐██████▌        │ DANGER   │           │
│ [$50] [🍽️30] [💪└──────────┘           │
└────────────────────────────────────────┘
```

### Destroyed License (10+ arrests)
```
┌────────────────────────────────────────┐
│ DYSTOPIAN DEPT OF MOTOR VEHICLES       │
├────────────────────────────────────────┤
│ ┌──────┐   V O I D                     │
│ │      │  ┌────────────┐               │
│ │ 😐   │  │PERMANENTLY │    MENACE     │
│ │      │  │  BANNED    │    TO         │
│ │#12345│  └────────────┘   SOCIETY     │
│ └──────┘      DENIED                   │
│ ▐██████▌ REVOKED  REPEAT OFFENDER      │
│ [$0] [🍽️10] [💪20] [🧠5]              │
└────────────────────────────────────────┘
```

---

**Reference Status:** ✅ COMPLETE
**For Use In:** Visual development, QA testing, design iteration

— isometric-pixel-artist agent
