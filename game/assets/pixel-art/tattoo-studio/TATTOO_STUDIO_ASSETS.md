# TATTOO STUDIO - Pixel Art Asset Specifications

## 1. ISOMETRIC BACKGROUND SCENE

### Scene Name: `tattoo_studio_background.png`
**Dimensions:** 640x480 pixels (isometric view, 2:1 ratio)

### Layout Description
```
Isometric room view (top-down 45° angle)
┌─────────────────────────────────────────┐
│  FLASH ART   FLASH ART   FLASH ART     │ ← Back wall
│  [skull]     [dagger]    [rose]        │
│                                         │
│       ┌──────┐                         │
│       │ INK  │     [WARM LIGHT]        │ ← Hanging bulb
│       │BOOTH │          ☼              │
│       └──────┘                          │
│                                         │
│  [CHAIR]═══════════  [TOOLS]           │ ← Tattoo station
│   ╱╲                  on tray          │
│  ╱  ╲                                   │
│                                         │
│  [STOOL]         [WASTE BIN]           │ ← Floor details
│                                         │
└─────────────────────────────────────────┘
```

### Color Palette
- **Walls:** #1a1a1a (dark grey, concrete texture)
- **Floor:** #2a1810 (dark wood shadow) → #4d3319 (wood base)
- **Lighting:** #ffcc66 (warm bulb) with #ff9933 (amber glow)
- **Shadows:** Multiply blend mode, 60% opacity

### Detailed Elements

#### A. Back Wall Flash Art (3 pieces)
**Position:** Top third of image, evenly spaced

**Flash #1 - Skull**
```
Size: 48x48px each
  ▄▄███▄▄
 ██░░░░░██
 ██▀░▀░░██
 ███▄▄▄███
  ▀█████▀
```
- Colors: #c0c0c0 (bone white), #444444 (shadows)
- Frame: #4d3319 (wood) 2px border
- Mounted on wall with small shadow

**Flash #2 - Dagger**
```
    ╱╲
   ╱  ╲
  ╱════╲
  ║    ║
  ║    ║
  ║▓▓▓▓║
  ╚════╝
```
- Blade: #9a9a9a (steel light) → #3d3d3d (steel dark)
- Handle: #4d3319 (wood)
- Frame: Same as Flash #1

**Flash #3 - Rose**
```
  ░▒▓█▓▒░
 ▓█████████▓
░███████████░
 ▓█████████▓
  ░▒▓█▓▒░
    ███
    ███
```
- Petals: #8b0000 (blood red) → #aa3333 (rust red)
- Stem: #004400 (dark green)
- Frame: Same as Flash #1

#### B. Hanging Light Bulb
**Position:** Center-top, slightly right
**Dimensions:** 32x64px (bulb + cord + glow)

```
    ║ ← Cord (4px wide, #1a1a1a)
    ║
   ▄█▄
  ▐███▌ ← Bulb (#ffcc66 core)
   ▀█▀
```
- **Glow Effect:** Radial gradient, 128px diameter
  - Center: #ffcc66 @ 80% opacity
  - Mid: #ff9933 @ 40% opacity
  - Edge: #cc6600 @ 0% opacity
- **Animation:** 4-frame flicker (optional)
  - Frame 1-3: Normal brightness
  - Frame 4: -10% brightness

#### C. Ink Station
**Position:** Left-center area
**Dimensions:** 80x96px

```
┌──────────┐ ← Top shelf
│ ●●●●●●●● │   Ink bottles
│ ●●●●●●●● │   (8 colors visible)
└──────────┘
    ████      Support structure
    ████
┌──────────┐
│          │ ← Lower shelf
│  [TOOLS] │   Wrapped needles
└──────────┘
```

**Ink Bottles (8x per row, 8x8px each):**
- Black: #0d0d0d
- Blue-black: #1a3366
- Green-black: #2d4d3d
- Red: #8b0000
- Grey: #444444
- White: #c0c0c0
- Browns: #4d3319, #6b4423

**Shelf Material:** #4d3319 (dark wood) with #8b5a2b (highlights)

#### D. Tattoo Chair (Main Focus)
**Position:** Center-bottom
**Dimensions:** 96x80px (isometric view)

```
Isometric chair view (adjustable medical-style)
     ╱▔▔▔▔╲
    ╱      ╲  ← Headrest
   ╱▔▔▔▔▔▔▔▔╲
  │          │ ← Backrest (leather)
  │  ▓▓▓▓▓▓  │
  │  ▓▓▓▓▓▓  │
  ╰──╱▔▔╲──╯ ← Seat
    ╱    ╲
   ╱      ╲   ← Base (hydraulic)
  ▓▓▓▓▓▓▓▓▓▓
  ──────────  ← Floor mount
```

**Materials:**
- **Leather:** #5c3d2e (base) with #3d2a1e (shadows), #7a5540 (highlights)
- **Metal Frame:** #3d3d3d (dark steel) with #6a6a6a (highlights)
- **Hydraulic Base:** #1a1a1a (black) with #444444 (segments)

**Details:**
- Stitching on leather (1px dashed line, #3d2a1e)
- Wear marks (lighter patches, #7a5540)
- Adjustable headrest (visible hinge, #6a6a6a)

#### E. Tool Tray
**Position:** Right of chair
**Dimensions:** 64x32px

```
┌────────────────┐
│ ╪  ═  ↕  ⊕  ◊ │ ← Tools
│ ╪  ═  ↕  ⊕  ◊ │
└────────────────┘
```

**Tools (left to right):**
1. **Tattoo Gun:** 16x12px, #3d3d3d (body), #b8860b (brass tip)
2. **Razor:** 12x8px, #9a9a9a (blade)
3. **Transfer Paper Roll:** 10x14px, #c0c0c0
4. **Petroleum Jelly Tub:** 12x12px, #ffcc66 (cap), #c0c0c0 (jar)
5. **Ink Caps:** 8x8px each, small circles, various colors

**Tray:** #6a6a6a (stainless steel) with #9a9a9a (rim highlight)

#### F. Artist Stool
**Position:** Bottom-left
**Dimensions:** 48x40px

```
    ▓▓▓ ← Padded seat
   ▓▓▓▓▓
   ──┬──  ← Pivot
     │
   ──┴──  ← Base (4 legs)
  ╱  │  ╲
```

**Materials:**
- Seat: #1a1a1a (black vinyl) with #444444 (highlights)
- Frame: #3d3d3d (steel) with #6a6a6a (chrome accent)

#### G. Waste Bin
**Position:** Bottom-right corner
**Dimensions:** 32x32px

```
  ╱▔▔▔▔▔╲
 │  ◊ ◊  │ ← Used paper/gloves
 │ ◊  ◊  │   visible inside
 │◊  ◊ ◊ │
 ╰──────╯
```

**Material:** #444444 (grey plastic/metal)
**Contents:** #c0c0c0 (white paper), #d4a5a5 (pink gloves), #aa3333 (blood)

### Atmospheric Effects

#### Lighting Zones
1. **Hot Spot (under bulb):** 200% brightness, #ffcc66
2. **Mid Light (center area):** 100% brightness, normal colors
3. **Shadow Zones (corners):** 40% brightness, multiply #1a1a1a

#### Texture Overlays
1. **Concrete Wall:** Subtle noise (2-3% variation)
2. **Wood Floor:** Grain lines (1px dark lines, 8-12px apart)
3. **Metal Surfaces:** Scratches (1-2px highlights, random)

#### Ambient Particles (Optional Animation)
- **Dust Motes:** 1px white dots (#c0c0c0 @ 30% opacity)
- **Movement:** Slow float upward (0.5px/frame)
- **Count:** 8-12 particles in light beam

---

## 2. TATTOO ARTIST CHARACTER

### Sprite Sheet: `tattoo_artist_spritesheet.png`
**Dimensions:** 192x192px (4 frames x 4 expressions = 16 sprites)
**Individual Sprite Size:** 48x48px

### Character Design
**Name:** "INK" (prison nickname)
**Appearance:**
- Heavily tattooed arms (full sleeves)
- Buzzed head or slicked back hair
- Prison-issued shirt (modified with rolled sleeves)
- Weathered, experienced look
- Always wearing nitrile gloves (one hand)

### Color Palette
- **Skin:** #c68662 (medium tan)
- **Tattoos:** #0d0d0d (black ink) on skin
- **Hair:** #1a1a1a (black/dark brown)
- **Shirt:** #1a3366 (dark blue, faded)
- **Gloves:** #3366cc (blue nitrile)
- **Pants:** #2a1810 (dark grey/black)

### Base Sprite (Idle Stance)
```
48x48px isometric character
     ▄██▄      ← Head (8x8px)
    ██░░██
   ▐██▀▀██▌
    ██  ██     ← Body (16x24px)
   ███████
   ██░░░██     ← Tattooed arms
  ▐██  ██▌
   ██  ██      ← Legs (8x16px)
   ██  ██
  ▐▌  ▐▌
```

### Tattoo Patterns (Arm Sleeves)
**Left Arm:** Geometric/tribal pattern
```
8x16px arm detail:
████  ← Shoulder
██░█
█░░█  ← Patterns
█░█░
██░█
████  ← Wrist
```

**Right Arm:** Traditional imagery (dagger, skull)
```
8x16px arm detail:
████
█▓█░  ← Skull motif
█░▓█
░█░█  ← Dagger
█░░█
████
```

### Animation Frames

#### Frame 1: Idle
- Standing neutral, arms at sides
- Looking down (at work)

#### Frame 2: Prepping Needle
- Right arm raised, holding tattoo gun
- Left arm extended (preparing equipment)

#### Frame 3: Tattooing (Active)
- Leaning forward slightly
- Right hand with gun angled down
- Left hand holding skin taut
- Focused expression

#### Frame 4: Wiping/Checking
- Right hand lowered
- Left hand with cloth/paper towel
- Examining work

### Expression Variations

#### Expression A: Focused (Default)
- Brow slightly furrowed
- Mouth neutral/slight frown
- Eyes looking down

#### Expression B: Talking
- Mouth open (2px)
- Eyes up (making eye contact)
- Relaxed brow

#### Expression C: Grimacing
- Eyes narrowed
- Mouth tight line
- Tense shoulders (subtle)

#### Expression D: Smirking
- Slight smile (1-side mouth raise)
- One eyebrow raised
- Confident posture

### Sprite Sheet Layout
```
┌─────┬─────┬─────┬─────┐
│ A-1 │ A-2 │ A-3 │ A-4 │ ← Focused expression
├─────┼─────┼─────┼─────┤
│ B-1 │ B-2 │ B-3 │ B-4 │ ← Talking expression
├─────┼─────┼─────┼─────┤
│ C-1 │ C-2 │ C-3 │ C-4 │ ← Grimacing expression
├─────┼─────┼─────┼─────┤
│ D-1 │ D-2 │ D-3 │ D-4 │ ← Smirking expression
└─────┴─────┴─────┴─────┘

A/B/C/D = Expression type
1/2/3/4 = Animation frame
```

### Animation Sequences

**Idle Loop (2 frames, 1 second each):**
- Frame A-1 → Frame A-1 (breathing subtle)

**Working Loop (4 frames, 0.5 seconds each):**
- Frame A-2 → A-3 → A-4 → A-2

**Dialogue (alternate frames):**
- Frame B-1 ↔ Frame B-2 (talking animation)

---

## 3. TATTOO CANVAS UI ENHANCEMENT

### Element: `tattoo_canvas_frame.png`
**Dimensions:** 360x360px (surrounds existing 10x10 grid)

### Frame Design
```
┌─═══════════════════════════════─┐
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║ ← Ornate border
║ ▓                           ▓ ║
║ ▓  [10x10 GRID GOES HERE]   ▓ ║
║ ▓                           ▓ ║
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
└─═══════════════════════════════─┐
```

**Frame Colors:**
- Outer border: #b8860b (brass/gold)
- Inner padding: #1a1a1a (dark background)
- Corner accents: #daa520 (bright brass)
- Shadow: #000000 @ 40% opacity, 4px offset

**Corner Ornaments (16x16px each):**
```
Top-left:
▓▓▓▓░░░░
▓▓▓░░░░░
▓▓░░░░░░
▓░░░░░░░

Top-right, bottom-left, bottom-right: Rotated versions
```

### Stencil Overlay Effect
**Element:** `stencil_overlay.png` (semi-transparent)
**Dimensions:** Match canvas (320x320px inner area)

```
When "Create Stencil" is active:
- Player's design shown in #3366cc (transfer paper blue)
- 60% opacity
- Slightly offset (+2px, +2px) for "transferred" look
- Grid lines visible underneath
```

### Active Cell Highlight
**Element:** Cursor/selection indicator

```
When hovering over cell:
┌─────┐
│ ░▒▓ │ ← Pulsing glow effect
│ ▒█▓ │
│ ▓▓▓ │
└─────┘
```
- Color: #00ff00 (terminal green)
- Opacity: 40% → 70% → 40% (pulse, 1 second)
- Blend mode: Additive

---

## 4. ADDITIONAL UI ELEMENTS

### Progress Indicators

#### Infection Risk Gauge
**File:** `infection_gauge.png`
**Dimensions:** 200x40px

```
┌─────────────────────────────────┐
│ INFECTION RISK: [████░░░░] 25% │
└─────────────────────────────────┘
```
- Empty: #1a1a1a (dark)
- Fill: #8b0000 (blood red) → #aa3333 (gradient)
- Border: #444444 (grey)
- Text: #00ff00 (terminal green)

#### Step Progress Bar
**File:** `tattoo_steps.png`
**Dimensions:** 400x32px

```
DESIGN → STENCIL → INK → PLACEMENT → CARE
  ●        ○        ○        ○        ○
```
- Completed: #00ff00 (filled circle)
- Current: #88ff88 (pulsing filled circle)
- Pending: #004400 (empty circle)
- Arrows: #444444 (grey)

### Care Mini-Game Icons

#### Clean Icon (32x32px)
```
   ▄▄▄
  █░░░█  ← Sponge/cloth
 █░░░░█
 █████
   ║    ← Dripping water
  ║ ║
```
Colors: #c0c0c0 (cloth), #3366cc (water drops)

#### Bandage Icon (32x32px)
```
 ████████
 █▓▓▓▓▓▓█ ← Adhesive bandage
 █▓░░░░▓█
 ████████
```
Colors: #d4a5a5 (skin-tone adhesive), #c0c0c0 (pad)

---

## 5. ATMOSPHERIC DETAILS

### Smoke/Steam Particle
**File:** `smoke_particle.png`
**Dimensions:** 16x16px (for particle system)

```
4-frame animation:
Frame 1:  ░░▒▒░░   (small, dense)
Frame 2:  ░▒▒▒▒░   (expanding)
Frame 3:  ▒▒░░▒▒   (larger, thinner)
Frame 4:  ▒░░░░▒   (dissipating)
```
- Color: #c0c0c0 @ 30% opacity → 0% opacity
- Movement: Drift upward + slight horizontal wobble
- Use: Ambient atmosphere in tattoo studio

### Blood Drop (Infection Animation)
**File:** `blood_drop.png`
**Dimensions:** 8x12px

```
   ▄
  ▀█▀  ← Drop forming
   █
   █
  ▐█▌  ← Falling
   █
   ●   ← Splat (frame 2)
  ◉◉◉
```
Colors: #8b0000 (blood red) → #aa3333 (splatter)

---

## Technical Implementation Notes

### Canvas Integration (JavaScript)
```javascript
// Frame overlay
const frameImg = new Image();
frameImg.src = 'assets/pixel-art/tattoo-studio/tattoo_canvas_frame.png';

// Draw frame around existing grid
ctx.drawImage(frameImg, gridX - 20, gridY - 20);

// Hover effect
function drawCellHighlight(x, y, opacity) {
    ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
    ctx.fillRect(x, y, cellSize, cellSize);
}

// Pulse animation
let pulseOpacity = 0.4;
setInterval(() => {
    pulseOpacity = 0.4 + Math.sin(Date.now() / 500) * 0.15;
}, 16);
```

### Artist Animation Loop
```javascript
class TattooArtist {
    constructor() {
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/pixel-art/tattoo-studio/tattoo_artist_spritesheet.png';
        this.currentFrame = 0;
        this.currentExpression = 'focused'; // A, B, C, or D
        this.frameWidth = 48;
        this.frameHeight = 48;
    }

    animate() {
        // Cycle through frames for current expression
        const expressionRow = this.getExpressionRow(this.currentExpression);
        this.currentFrame = (this.currentFrame + 1) % 4;

        ctx.drawImage(
            this.spriteSheet,
            this.currentFrame * this.frameWidth,
            expressionRow * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            artistX, artistY,
            this.frameWidth * 2, // 2x scale
            this.frameHeight * 2
        );
    }

    getExpressionRow(expression) {
        return {'focused': 0, 'talking': 1, 'grimacing': 2, 'smirking': 3}[expression];
    }
}
```

### Background Parallax (Optional Depth)
```javascript
// Layers for depth
const layers = [
    { img: 'bg_back_wall.png', depth: 0.2 },  // Flash art, far wall
    { img: 'bg_furniture.png', depth: 0.5 },  // Ink station, chair
    { img: 'bg_foreground.png', depth: 1.0 }  // Close details
];

// Draw with slight offset based on mouse position
layers.forEach(layer => {
    const offsetX = (mouseX - canvasCenter) * layer.depth * 0.1;
    const offsetY = (mouseY - canvasCenter) * layer.depth * 0.05;
    ctx.drawImage(layer.img, offsetX, offsetY);
});
```

---

## Asset Checklist

### Must-Have (Priority 1)
- [x] Main background scene (tattoo_studio_background.png)
- [x] Tattoo artist sprite sheet (tattoo_artist_spritesheet.png)
- [x] Canvas frame overlay (tattoo_canvas_frame.png)
- [x] Care mini-game icons (clean, bandage, clean)

### Nice-to-Have (Priority 2)
- [ ] Smoke/steam particles (animated)
- [ ] Infection blood drops (animated)
- [ ] Stencil overlay effect
- [ ] Progress indicators (steps, risk gauge)

### Optional Polish (Priority 3)
- [ ] Background layers (parallax)
- [ ] Additional artist expressions
- [ ] Tool detail close-ups
- [ ] Ambient light flicker animation

---

**Status:** Specification Complete
**Next Steps:** Create pixel art assets using Aseprite, Pixaki, or similar
**Integration:** Add to game/assets/pixel-art/tattoo-studio/
