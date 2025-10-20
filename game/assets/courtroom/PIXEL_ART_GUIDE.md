# COURTROOM PIXEL ART SYSTEM - COMPREHENSIVE GUIDE

**VROOM VROOM - Judge Hardcastle Courtroom Pixel Art Assets**
**Style:** Disco Elysium inspired - Painterly pixel art with bureaucratic oppression
**Resolution:** 128x128 base sprites, 800x600 background
**Artist:** Isometric Pixel Artist Agent
**Date:** 2025-10-19

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Visual Style Guide](#visual-style-guide)
3. [Color Palette](#color-palette)
4. [Asset List](#asset-list)
5. [Sprite Specifications](#sprite-specifications)
6. [Animation Data](#animation-data)
7. [Integration Instructions](#integration-instructions)
8. [Rendering Pipeline](#rendering-pipeline)
9. [Creating PNG Sprite Sheets](#creating-png-sprite-sheets)

---

## 🎨 OVERVIEW

This system provides a complete pixel art replacement for the courtroom scene, transforming the programmatic canvas drawing into authentic Disco Elysium-style pixel art.

### Key Features

- **Judge Hardcastle Sprites** - 6 anger states with dynamic expressions
- **Courtroom Background** - Layered parallax-ready scene
- **Paperwork UI** - Bureaucratic form rendering
- **Gavel Animations** - 3-frame strike sequence
- **Atmospheric Effects** - Dust particles, light rays, film grain

### System Architecture

```
courtroom-pixel-renderer.js (Main Renderer)
    ↓
├── judge-sprite-data.js (Judge sprites + animations)
├── courtroom-background-data.js (Background layers)
├── paperwork-ui-data.js (Form UI elements)
└── ace-attorney-courtroom.js (Original system - can coexist or replace)
```

---

## 🖌️ VISUAL STYLE GUIDE

### Disco Elysium Aesthetic

**Core Principles:**
- Painterly pixel art (not clean/geometric)
- Limited palette with atmospheric gradients
- Heavy vignette and film grain
- Warm, oppressive lighting
- Bureaucratic decay (aged paper, worn wood)

### Reference Mood

- **Lighting:** Warm amber desk lamp, cold stone walls
- **Textures:** Wood grain, paper fibers, coffee stains
- **Atmosphere:** Dusty air, god rays, shadows
- **Tone:** Serious but absurd, official but decaying

### Pixel Art Style Rules

1. **No Anti-Aliasing** - Hard pixel edges only
2. **Limited Palette** - 30 colors max per scene
3. **Readable at Scale** - Works at 1x, 2x, 3x zoom
4. **Expressive Details** - Personality in small touches
5. **Consistent Light Source** - Top-left ambient, desk lamp local

---

## 🎨 COLOR PALETTE

### Judge Hardcastle (Skin Tones)

Progression from neutral to volcanic rage:

```css
NEUTRAL:     #c5a789 (bureaucratic beige)
IRRITATED:   #c59f85 (slight flush)
ANGRY:       #cc8870 (pink irritation)
FURIOUS:     #dd6655 (red anger)
APOPLECTIC:  #ee5544 (purple rage)
VOLCANIC:    #aa2244 (dark crimson fury)
```

**Skin Shadows:** `#9a7d5f`
**Skin Highlights:** `#d4b89a`

### Judicial Robes

```css
Robe Black:    #0a0a0a
Robe Shadow:   #000000
Collar White:  #f5f5f5
Collar Shadow: #d8d8d8
```

### Wig (Powdered Judicial Wig)

```css
Wig White:     #e8e8e8
Wig Shadow:    #c0c0c0
Wig Highlight: #ffffff
```

### Facial Features

```css
Eye Black:     #000000
Eye White:     #ffffff
Eyebrow Dark:  #2a2015
Mustache Grey: #4a4a4a
Mouth Dark:    #1a0f08
```

### Anger Veins

```css
Vein Red:   #8b0000
Vein Dark:  #660000
Vein Black: #000000
```

### Wood Tones (Courtroom)

```css
Wood Dark:      #2a2015 (shadows)
Wood Base:      #3d2f1f (mahogany)
Wood Highlight: #52403a (edge highlights)
Wood Grain:     #241810 (grain lines)
```

### Stone Walls

```css
Stone Dark:      #3d3936
Stone Base:      #5a5450
Stone Highlight: #706b65
Mortar:          #2a2726
```

### Paper/Documents (Aged Bureaucracy)

```css
Paper White:  #f5efe0
Paper Aged:   #e8dcc8
Paper Old:    #d4c4a8
Ink Black:    #1a1612
Ink Faded:    #4a403a
```

### Coffee Stains

```css
Stain Light:  #d4b89a
Stain Medium: #a68860
Stain Dark:   #7a5a3a
```

### Metal/Brass

```css
Brass Dark:      #5a4a2a
Brass Base:      #8a7040
Brass Highlight: #aa9060
Iron Dark:       #2a2a2a
Iron Base:       #4a4a4a
```

### Stamps (Official)

```css
Stamp Red:   #aa2020 (approved/rejected)
Stamp Green: #2a6a3a (approved)
Stamp Blue:  #2a4a7a (processing)
```

### Atmospheric

```css
Light Warm:   #ffd080 (desk lamp)
Light Glow:   #ffe8b0 (lamp halo)
Shadow Deep:  #1a1612 (dark corners)
Shadow Mid:   #2d2620 (general shadow)
Dust Light:   #8a7f6f (floating particles)
```

---

## 📦 ASSET LIST

### Sprites

#### Judge Hardcastle (128x128 base)

- `judge_neutral.png` - Default resting state
- `judge_blink.png` - Blinking frame
- `judge_irritated.png` - Eyebrows slightly angled
- `judge_angry.png` - Eyebrows angled, frown
- `judge_furious.png` - Deep frown, veins (3)
- `judge_apoplectic.png` - Severe expression, veins (7)
- `judge_volcanic.png` - Maximum anger, veins (9)

Each sprite has:
- 6 layers: wig_back, head, features, robes, veins
- Anchor point: bottom-center (64, 100)

#### Gavel (32x64 base)

- `gavel_rest.png` - Lying on desk
- `gavel_raised.png` - Held aloft (trembling)
- `gavel_strike.png` - Impact frame with flash

### Backgrounds (800x600)

#### Layers (Parallax-ready)

1. **wall.png** (parallax 0.1) - Wood paneling, stone walls
2. **background_props.png** (0.3) - Law books, clock, portrait
3. **judges_bench.png** (0.5) - Main desk, lamp, paperwork
4. **foreground_props.png** (0.8) - Defendant stand, evidence table
5. **atmosphere.png** (0.0, animated) - Dust, light rays, grain

### UI Elements (Paperwork)

- `paper_texture.png` - Aged paper background (600x800)
- `form_header.png` - Official seal and title area
- `checkbox_empty.png` - 12x12 empty box
- `checkbox_checked.png` - 12x12 with X mark
- `stamp_approved.png` - 72x72 red circular stamp
- `stamp_rejected.png` - 72x72 red circular stamp
- `stamp_processing.png` - 72x72 gold circular stamp
- `signature_scrawl.png` - Handwritten signature overlay

---

## 📐 SPRITE SPECIFICATIONS

### Judge Hardcastle Sprite (128x128)

**Pixel Layout:**

```
Y=0-30:    Judicial wig (white/grey)
Y=30-90:   Head and face
Y=90-105:  White collar (clerical bands)
Y=105-128: Black robe (top portion)
```

**Facial Feature Positions:**

```
Eyes:      X=46-58 (left), X=70-82 (right), Y=50-62
Eyebrows:  X=44-60 (left), X=68-84 (right), Y=42-45
Nose:      X=62-66, Y=60-72
Mouth:     X=52-76, Y=76-79
Mustache:  X=48-80, Y=72-76
```

**Anger State Modifications:**

| State | Skin Color | Brow Offset | Mouth Droop | Vein Count | Shake |
|-------|-----------|-------------|-------------|------------|-------|
| Neutral | #c5a789 | 0px | 0px | 0 | 0 |
| Irritated | #c59f85 | 2px | 3px | 1 | 0 |
| Angry | #cc8870 | 4px | 6px | 3 | 0 |
| Furious | #dd6655 | 6px | 10px | 5 | 2px |
| Apoplectic | #ee5544 | 8px | 14px | 7 | 4px |
| Volcanic | #aa2244 | 10px | 18px | 9 | 8px |

**Vein Placement:**

- Forehead area (Y=32-48)
- Zigzag pattern, 2px wide
- Distributed evenly across forehead
- Color: #8b0000 with #660000 shadow

### Gavel Sprite (32x64)

**Rest Position:**
```
Handle: X=10-16, Y=15-60
Head:   X=4-22, Y=8-18
```

**Raised Position:**
```
Handle: X=12-18, Y=5-55
Head:   X=6-24, Y=0-10
Motion blur: Y=15-50
```

**Strike Position:**
```
Handle: X=10-16, Y=30-60
Head:   X=4-22, Y=55-63
Impact flash: Y=58-64 (white)
Dust particles: Y=54-58
```

### Background Layers

**Wall Layer (parallax 0.1):**
- Wood planks: 60px width, vertical grain
- Chair rail: Y=200 (divider between wall/paneling)

**Background Props (parallax 0.3):**
- Book shelves: X=150-350, Y=100-260
- Wall clock: X=600, Y=120 (40x40)
- Portrait frame: X=50, Y=140 (80x100)

**Judge's Bench (parallax 0.5):**
- Bench top: Y=380-400
- Bench front: Y=400-500
- Desk lamp: X=120, Y=320-380
- Paperwork stacks: X=30-105, Y=388-420
- Law books: X=680-760, Y=388-436

**Foreground Props (parallax 0.8):**
- Defendant stand: X=620-760, Y=440-520
- Microphone: X=674-690, Y=400-440
- Evidence table: X=40-140, Y=480-540

---

## 🎬 ANIMATION DATA

### Judge Animations

**Idle Loop:**
```javascript
frames: ['neutral']
duration: 1000ms
loop: true
```

**Blink:**
```javascript
frames: ['neutral', 'blink', 'neutral']
duration: 200ms (total)
loop: false
triggerChance: 0.01 per frame (~1% chance)
```

**Breathing:**
```javascript
offset_y: sin(time * 2) * 2px
continuous: true
```

**Anger Transition:**
```javascript
frames: ['neutral' → 'irritated' → 'angry' → 'furious']
duration: 500ms
interpolation: linear
loop: false
```

### Gavel Animations

**Raise:**
```javascript
frames: ['rest', 'raised']
duration: 300ms
easing: ease-out
```

**Strike:**
```javascript
frames: ['raised', 'strike', 'raised']
duration: 200ms (50ms strike frame)
effects: ['screen_flash', 'sound_gavel']
loop: false
```

**Trembling (Anger ≥61):**
```javascript
offset_x: sin(time * 0.3) * 3px
continuous: true
```

### Atmospheric Animations

**Dust Particles:**
```javascript
count: 40
movement: {
    y: +0.1 to +0.3 px/frame
    x: sin(time + drift) * 0.5 px/frame
}
wrap: true (screen edges)
```

**Light Rays:**
```javascript
subtle_wave: sin(time * 0.5) * 2px
opacity_pulse: 0.05 to 0.10
```

**Film Grain:**
```javascript
regenerate: every frame
particles: 120
opacity: 0.12
```

---

## 🔧 INTEGRATION INSTRUCTIONS

### Step 1: Load Asset Files

Add to `index.html` before closing `</body>`:

```html
<!-- Courtroom Pixel Art System -->
<script src="assets/courtroom/judge-sprite-data.js"></script>
<script src="assets/courtroom/courtroom-background-data.js"></script>
<script src="assets/courtroom/paperwork-ui-data.js"></script>
<script src="systems/courtroom-pixel-renderer.js"></script>
```

### Step 2: Initialize Renderer

Replace existing `AceAttorneyCourtroom` initialization:

```javascript
// OLD:
// this.courtroom = new AceAttorneyCourtroom('judgeCanvas', 'courtroomDialogue');

// NEW (drop-in replacement):
this.courtroom = new PixelArtCourtroom('judgeCanvas', 'courtroomDialogue');
```

### Step 3: Usage (No Changes Required!)

The pixel art system is a drop-in replacement. All existing API calls work:

```javascript
// Start courtroom scene
game.courtroom.start(0); // patience = 0

// Update judge's patience
game.courtroom.updatePatience(50);

// Show dialogue
game.courtroom.showDialogue('Judge Hardcastle', 'Your driving is UNACCEPTABLE!', callback);

// Trigger gavel strike
game.courtroom.triggerGavelStrike();

// Stop courtroom
game.courtroom.stop();
```

### Step 4: Paperwork Overlay (Optional)

Add paperwork form rendering:

```javascript
// Create paperwork overlay
const paperwork = new PaperworkOverlay('paperworkContainer');

// Show traffic violation form
paperwork.show({
    name: player.name,
    vehicle: player.selectedCar.model,
    date: currentDate,
    location: 'Highway 17',
    violations: {
        speeding: true,
        reckless: true,
        unlicensed: false,
        evading: true
    },
    charges: 'Existential recklessness',
    sentence: player.sentence,
    signed: true,
    approved: true
});

// Update form dynamically
paperwork.updateForm({ sentence: newSentence });

// Hide form
paperwork.hide();
```

---

## 🖼️ RENDERING PIPELINE

### Frame Render Order

```
1. Clear canvas (#1a1612 background)
2. Apply screen shake offset (if patience ≥61)
3. Render background layers (back to front):
   - Wall layer (parallax 0.1)
   - Background props (parallax 0.3)
   - Judge's bench (parallax 0.5)
   - Foreground props (parallax 0.8)
4. Render light rays (atmospheric)
5. Render dust particles (background layer)
6. Render Judge sprite (center, with breathing offset)
7. Render gavel sprite (if raised/striking)
8. Render dust particles (foreground layer)
9. Restore from shake offset
10. Render vignette (radial gradient)
11. Render anger overlay (red tint if patience ≥61)
12. Render film grain (random static)
```

### Performance Optimizations

- **Pixel Cache:** Background layers cached, only redraw on change
- **Dirty Regions:** Only update animated regions when possible
- **Layer Compositing:** Use separate canvases for static vs animated
- **Dust Pooling:** Reuse particle objects

### Canvas Settings

```javascript
ctx.imageSmoothingEnabled = false; // Crisp pixels
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
```

---

## 🎨 CREATING PNG SPRITE SHEETS

### Tools Recommended

- **Aseprite** (pixel art editor, best for animations)
- **GraphicsGale** (free alternative)
- **Photoshop** with pixel grid
- **Piskel** (browser-based, free)

### Workflow

#### 1. Judge Hardcastle Sprites

**Create in Aseprite:**

1. New file: 128x128, indexed color mode
2. Set up palette (copy from `JUDGE_PALETTE` above)
3. Create layers:
   - Layer 0: Wig (back)
   - Layer 1: Head
   - Layer 2: Features
   - Layer 3: Robes
   - Layer 4: Veins (if applicable)
4. Paint sprite following pixel data in `judge-sprite-data.js`
5. Create animation frames:
   - Frame 1: Neutral
   - Frame 2: Blink
   - Frames 3-7: Anger states
6. Export as sprite sheet: 128x896 (7 frames vertical)

**Export Settings:**
- Format: PNG-8 (indexed)
- Transparency: Yes
- Trim: No (keep 128x128 per frame)

#### 2. Gavel Sprites

1. New file: 32x64, indexed color
2. Create 3 frames (rest, raised, strike)
3. Paint following `GavelSprite` data
4. Export as 32x192 vertical sprite sheet

#### 3. Background Layers

**Multi-layer PSD workflow:**

1. Create 800x600 canvas
2. Create 5 layers (wall, bg_props, bench, fg_props, atmosphere)
3. Paint each layer separately
4. Export each layer as individual PNG
5. Export composite for preview

**Parallax Testing:**
- Test layers at different offsets
- Ensure seamless edges if layers repeat

#### 4. Paperwork UI

1. Create 600x800 paper texture
2. Add coffee stains, fibers, creases
3. Export as `paper_texture.png`
4. Create UI elements separately:
   - Checkboxes: 12x12
   - Stamps: 72x72 (circular)
   - Signature: variable width, transparent

### Sprite Sheet Layout

**Judge Sprite Sheet (128x896):**
```
Row 0 (Y=0-128):     Neutral
Row 1 (Y=128-256):   Blink
Row 2 (Y=256-384):   Irritated
Row 3 (Y=384-512):   Angry
Row 4 (Y=512-640):   Furious
Row 5 (Y=640-768):   Apoplectic
Row 6 (Y=768-896):   Volcanic
```

**Gavel Sprite Sheet (32x192):**
```
Row 0 (Y=0-64):   Rest
Row 1 (Y=64-128): Raised
Row 2 (Y=128-192): Strike
```

### Loading Sprite Sheets in Code

Update `courtroom-pixel-renderer.js` to load PNGs:

```javascript
class PixelArtRenderer {
    constructor(canvas) {
        // ... existing code ...

        // Load sprite sheets
        this.loadAssets();
    }

    async loadAssets() {
        this.judgeSheet = await this.loadImage('assets/courtroom/sprites/judge_spritesheet.png');
        this.gavelSheet = await this.loadImage('assets/courtroom/sprites/gavel_spritesheet.png');
        this.bgWall = await this.loadImage('assets/courtroom/backgrounds/wall.png');
        this.bgBench = await this.loadImage('assets/courtroom/backgrounds/judges_bench.png');
        // ... etc
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    drawJudgeSprite(state, x, y) {
        const frameIndex = this.getJudgeFrameIndex(state);
        const sourceY = frameIndex * 128;

        this.ctx.drawImage(
            this.judgeSheet,
            0, sourceY, 128, 128,  // source
            x, y, 320, 320         // dest (scaled 2.5x)
        );
    }
}
```

---

## 📝 NOTES FOR ARTISTS

### Pixel Art Best Practices

1. **Work at 1x Scale** - Paint at native resolution, scale up for preview
2. **Use Limited Palette** - Constrain to defined colors for consistency
3. **Dithering Sparingly** - Use for gradients only, not details
4. **Readable Silhouettes** - Judge recognizable as shape alone
5. **Consistent Light Source** - Top-left general, desk lamp specific

### Disco Elysium Style Tips

- **Painterly Feel:** Use color variation, not perfect fills
- **Atmospheric Depth:** Layer shadows and highlights organically
- **Bureaucratic Decay:** Age everything (scratches, stains, wear)
- **Expressive Minimalism:** Convey emotion with few pixels

### Testing Checklist

- [ ] Judge readable at 128px, 256px, 320px
- [ ] All anger states clearly distinct
- [ ] Veins visible and pulsing
- [ ] Gavel strike has impact
- [ ] Background layers separate correctly
- [ ] Paperwork forms legible
- [ ] Film grain not overwhelming
- [ ] Vignette frames scene properly

---

## 🔗 REFERENCES

### Code Files

- `/game/assets/courtroom/judge-sprite-data.js` - Judge pixel data
- `/game/assets/courtroom/courtroom-background-data.js` - Background layers
- `/game/assets/courtroom/paperwork-ui-data.js` - UI elements
- `/game/systems/courtroom-pixel-renderer.js` - Main renderer
- `/game/systems/ace-attorney-courtroom.js` - Original system (reference)

### External References

- Disco Elysium (visual style reference)
- Ace Attorney (courtroom structure reference)
- Darkest Dungeon (stress/anger visual progression)

---

**Last Updated:** 2025-10-19
**Version:** 1.0.0
**Status:** Ready for sprite sheet creation
**Artist:** Isometric Pixel Artist Agent
