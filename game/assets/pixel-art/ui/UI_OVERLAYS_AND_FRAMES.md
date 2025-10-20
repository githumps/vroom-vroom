# UI OVERLAYS AND FRAMES - Pixel Art Specifications
## Enhanced Visual Feedback for Tattoo and Gang Systems

---

## 1. TATTOO CANVAS ENHANCEMENTS

### A. Canvas Border Frame
**File:** `tattoo_canvas_ornate_frame.png`
**Dimensions:** 360x360px (wraps around 320x320px grid)

#### Frame Design
```
Ornate brass/gold frame with prison aesthetic:

┌─══════════════════════════════════─┐
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ ╔═══════════════════════════╗ ┃ ║
║ ┃ ║                           ║ ┃ ║ ← Triple border
║ ┃ ║  [10x10 DRAWING GRID]     ║ ┃ ║
║ ┃ ║                           ║ ┃ ║
║ ┃ ╚═══════════════════════════╝ ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
└─══════════════════════════════════─┘
```

#### Layer Structure
1. **Outer Shadow:** 4px blur, #000000 @ 60% opacity
2. **Outer Border:** 8px wide, #b8860b (dark brass)
3. **Middle Border:** 4px wide, #1a1a1a (black gap)
4. **Inner Border:** 2px wide, #daa520 (bright brass)
5. **Canvas Area:** 320x320px transparent center

#### Corner Ornaments (24x24px each corner)
```
Top-left corner detail:
╔════════╗
║▓▓▓▓░░░░║  Brass gradient
║▓▓▓░░░░░║  (#b8860b → #daa520)
║▓▓░░░░░░║
║▓░░░░░░░║  Diagonal fade pattern
║░░░░░░░░║
╚════════╝

Additional details:
- Rivet screws in corners (4x4px circles, #6a6a6a)
- Scratches/wear marks (1px highlights)
- Tarnish spots (darker areas, #8b7355)
```

---

### B. Grid Cell Hover Effect
**File:** `cell_hover_glow.png`
**Dimensions:** 32x32px per cell (scales to grid size)

#### Glow Animation (4 frames)
```
Frame 1 (40% opacity):
░░░░░░░░
░▒▒▒▒▒▒░
░▒▓▓▓▓▒░  Base green glow
░▒▓██▓▒░  (#00ff00)
░▒▓██▓▒░
░▒▓▓▓▓▒░
░▒▒▒▒▒▒░
░░░░░░░░

Frame 2 (55% opacity):
░░░░░░░░
░▒▓▓▓▓▒░
░▒████▒░  Brighter
░▓████▓░
░▓████▓░
░▒████▒░
░▒▓▓▓▓▒░
░░░░░░░░

Frame 3 (70% opacity):
░░░░░░░░
░▓████▓░
▒██████▒  Peak brightness
▓██████▓
▓██████▓
▒██████▒
░▓████▓░
░░░░░░░░

Frame 4 (55% opacity):
Same as Frame 2 (return)
```

**Animation Loop:** 1 second (250ms per frame)
**Blend Mode:** Additive
**Color:** #00ff00 (terminal green) to #88ff88 (bright green)

---

### C. Active Cell Fill Indicator
**File:** `cell_active_fill.png`
**Dimensions:** 32x32px

#### Fill States

**Empty Cell:**
```
┌──────┐
│      │  Transparent
│      │
│      │
│      │
└──────┘
```

**Filled Cell:**
```
┌──────┐
│██████│  Solid black (#0d0d0d)
│██████│  with subtle texture
│██████│  (1-2% noise overlay)
│██████│
└──────┘
```

**Hover + Empty:**
```
┌──────┐
│░░░░░░│  Green tint (#00ff00 @ 20%)
│░▒▒▒░░│  with pulse glow
│░▒▒▒░░│
│░░░░░░│
└──────┘
```

**Hover + Filled:**
```
┌──────┐
│██████│  Black + green outline
│██▓▓██│  Glowing edge (#00ff00)
│██▓▓██│
│██████│
└──────┘
```

---

### D. Stencil Overlay
**File:** `stencil_transfer_overlay.png`
**Dimensions:** 320x320px (matches canvas inner size)

#### Transfer Paper Effect
```
Blue-purple tint over design (like carbon paper):

Original design cells: #0d0d0d (black)
Stencil version: #3366cc (transfer blue) @ 70% opacity

Additional effects:
- Slight blur (1px) for "ink transfer" look
- 2px offset down-right (shows layering)
- Wrinkle texture (subtle noise, 5% variation)
- Edge glow (darker #1a3366) on filled cells
```

#### Corner Registration Marks
```
Four corners (8x8px each):
┌─┐     ┌─┐
│ │     │ │
└─┘     └─┘  Alignment crosshairs
            (#3366cc, thin 1px lines)
┌─┐     ┌─┐
│ │     │ │
└─┘     └─┘
```

---

### E. Ink Application Effect
**File:** `ink_wet_effect.png` (animated, 8 frames)
**Dimensions:** 32x32px per cell

#### Animation Sequence (ink filling cell)
```
Frame 1: Empty cell
Frame 2: ░  Ink starts at corner (top-left)
Frame 3: ░▒ Spreading
Frame 4: ▒▓ Expanding
Frame 5: ▓█ Almost full
Frame 6: ██ Fully inked
Frame 7: ██ Wet shine (highlight top-left)
Frame 8: ██ Dried (matte finish)
```

**Colors:**
- Frames 1-5: Gradient #3366cc → #0d0d0d (blue ink → black)
- Frame 7: Add #6a6a6a highlight (wet sheen, 40% opacity)
- Frame 8: Pure #0d0d0d (dried, final state)

**Speed:** 80ms per frame (640ms total per cell)
**Trigger:** When "Apply Ink" button pressed

---

### F. Infection Warning Overlay
**File:** `infection_warning.png`
**Dimensions:** 320x320px

#### Red Pulsing Danger Indicator
```
┌════════════════════════════════┐
║  ⚠️ INFECTION RISK: 25% ⚠️    ║  Top banner
╠════════════════════════════════╣
║                                ║
║  [Canvas area with red tint]   ║  Semi-transparent red
║                                ║  (#8b0000 @ 15%)
║                                ║
╠════════════════════════════════╣
║   CARE SEQUENCE REQUIRED       ║  Bottom warning
╚════════════════════════════════╝
```

**Animation:** Pulse opacity 15% → 25% → 15% (2-second loop)
**Display:** Only during "Care" step

---

## 2. GANG SYSTEM UI OVERLAYS

### A. Gang Selection Cards
**File:** `gang_card_frame.png`
**Dimensions:** 200x280px per card

#### Card Structure
```
┌──────────────────────┐
│ ╔════════════════╗   │  2px colored border (gang color)
│ ║  [EMBLEM 128]  ║   │
│ ╚════════════════╝   │
│                      │
│  GANG NAME           │  20px bold text
│  ──────────────      │  Divider line
│  "Gang Motto"        │  16px italic
│                      │
│  ● REP: ##/100       │  Stats display
│  ● MEMBERS: ###      │
│                      │
│ [JOIN] [INFO]        │  Action buttons
└──────────────────────┘
```

#### Color Variants

**Safe Drivers Card:**
- Border: #ffcc00 (safety yellow), 2px
- Background: #1a1a1a (dark) with subtle yellow tint
- Hover glow: #ffcc00 @ 40% opacity

**Turn Signals Card:**
- Border: #ff9900 (signal amber), 2px
- Background: #1a1a1a with subtle orange tint
- Hover glow: #ff9900 @ 40% opacity

**Road Warriors Card:**
- Border: #cc0000 (warrior red), 2px
- Background: #1a1a1a with subtle red tint
- Hover glow: #cc0000 @ 40% opacity

---

### B. Reputation Bar
**File:** `reputation_bar.png`
**Dimensions:** 200x40px

#### Bar Design
```
┌────────────────────────────────────┐
│ REP: [████████░░░░░░░░░░] 40/100  │
└────────────────────────────────────┘

Empty section: #1a1a1a (dark)
Fill section: Gang color (gradient)
Border: #444444 (grey)
Text: #00ff00 (terminal green)
```

#### Gradient Fill (Safe Drivers example)
```
Low rep (0-33):   #4d4400 → #665500 (dark yellow)
Mid rep (34-66):  #997700 → #cc9900 (medium yellow)
High rep (67-100): #ffcc00 → #ffffaa (bright yellow)
```

**Animation:** Fill grows left-to-right with 0.5s transition
**Particles:** Small sparkles at 100% completion

---

### C. Gang Emblem Badge (Player HUD)
**File:** `player_gang_badge.png`
**Dimensions:** 64x80px

#### Badge Frame Design
```
    ┌─────┐
    │ [E] │    E = Emblem (64x64px)
    │  M  │
    │ BL  │
    │  EM │
    └─────┘
   ╱       ╲   Badge ribbon
  ╱  GANG   ╲  (16px height)
 ╱___________╲
```

**Materials:**
- Emblem: Gang emblem 64x64px version
- Badge frame: #b8860b (brass) with #daa520 (highlights)
- Ribbon: Gang color
- Text on ribbon: #000000 (black) or #ffffff (white) for contrast

**Placement:** Top-right of prison screen, next to player stats

---

### D. Gang Interaction Dialogue Box
**File:** `dialogue_box_ornate.png`
**Dimensions:** 600x200px

#### Box Design (Speech Bubble Style)
```
        ╱╲  ← Pointer to character
       ╱  ╲
┌─────────────────────────────────────┐
│ ╔═══════════════════════════════╗ │
│ ║ [CHARACTER NAME]              ║ │  Header bar
│ ╠═══════════════════════════════╣ │
│ ║                               ║ │
│ ║  "Dialogue text appears       ║ │  Text area
│ ║   here in pixel font."        ║ │
│ ║                               ║ │
│ ║                     [CONTINUE]║ │  Button
│ ╚═══════════════════════════════╝ │
└─────────────────────────────────────┘
```

**Colors:**
- Background: #000000 (black) @ 90% opacity
- Border: Gang color (matches speaker's affiliation)
- Text: #00ff00 (terminal green)
- Header: Gang color @ 30% opacity background
- Button: Gang color border with hover effect

---

### E. Gang Action Menu
**File:** `action_menu_radial.png`
**Dimensions:** 240x240px

#### Radial Menu Layout
```
        [TALK]
           ↑
    [INFO] ● [TRADE]  Center = Gang emblem icon
           ↓
      [CHALLENGE]

Each button: 60x40px
Center icon: 48x48px (gang emblem small)
Connection lines: 2px, gang color
```

**Button States:**
- **Idle:** #1a1a1a background, gang color border (1px)
- **Hover:** Gang color background @ 30%, border thickens to 2px
- **Active:** Gang color background @ 60%, white text
- **Disabled:** #444444 (grey), 50% opacity

---

## 3. SHARED UI ELEMENTS

### A. Button Standard (Game-Wide)
**File:** `button_standard.png`
**Dimensions:** 160x48px (medium), 200x64px (large)

#### Button Design
```
┌─══════════════════════════════─┐
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃   BUTTON TEXT (CENTERED)   ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└─══════════════════════════════─┘
```

**States:**

**Normal:**
- Border: #00ff00 (terminal green), 2px
- Background: #000000 (black)
- Text: #00ff00 (green), 16px bold
- Shadow: #004400 @ 40%, 2px offset

**Hover:**
- Border: #88ff88 (bright green), 3px
- Background: #001100 (dark green tint)
- Text: #88ff88 (brighter)
- Glow: #00ff00 @ 30%, 4px blur

**Active/Pressed:**
- Border: #00ff00, 2px
- Background: #003300 (darker green)
- Text: #ffffff (white)
- Offset: 1px down-right (pressed effect)

**Disabled:**
- Border: #444444 (grey), 1px
- Background: #1a1a1a (dark grey)
- Text: #666666 (mid grey)
- No shadow/glow

---

### B. Modal Window Frame
**File:** `modal_frame.png`
**Dimensions:** 640x480px (standard modal size)

#### Frame Structure
```
┌══════════════════════════════════════┐
║ ╔══════════════════════════════════╗ ║
║ ║  [TITLE BAR]              [X]    ║ ║  Header (48px)
║ ╠══════════════════════════════════╣ ║
║ ║                                  ║ ║
║ ║                                  ║ ║  Content area
║ ║  [Modal content goes here]       ║ ║  (384px)
║ ║                                  ║ ║
║ ║                                  ║ ║
║ ╠══════════════════════════════════╣ ║
║ ║  [BUTTONS]                       ║ ║  Footer (48px)
║ ╚══════════════════════════════════╝ ║
└══════════════════════════════════════┘
```

**Design Elements:**
- Outer shadow: 8px blur, #000000 @ 80%
- Border: #00ff00 (terminal green), 3px
- Background: #000000 @ 95% (slight transparency)
- Title bar: #001100 (dark green tint)
- Close button: 32x32px, red X (#ff0000) on hover

---

### C. Progress Bar (Generic)
**File:** `progress_bar.png`
**Dimensions:** 200x32px

#### Bar Design
```
┌──────────────────────────────────┐
│ [████████████░░░░░░░░░░░░] 60%  │
└──────────────────────────────────┘
```

**Components:**
- Container: #444444 border, #1a1a1a background
- Fill: Gradient (context-dependent color)
- Text: #00ff00 (terminal green)
- Segments: Optional tick marks every 10%

**Color Schemes:**
- **Health/Safety:** #00ff00 → #88ff88 (green)
- **Danger/Risk:** #ff0000 → #ff4400 (red-orange)
- **Progress/XP:** #3366cc → #6699ff (blue)
- **Energy:** #ffcc00 → #ffffaa (yellow)

---

### D. Notification Banner
**File:** `notification_banner.png`
**Dimensions:** 400x80px

#### Banner Design (Top of Screen)
```
╔════════════════════════════════════╗
║  [ICON]  NOTIFICATION TEXT         ║
║          Additional info line      ║
╚════════════════════════════════════╝
```

**Variants:**

**Success (Green):**
- Border: #00ff00, 2px
- Background: #001100 @ 90%
- Icon: ✓ checkmark, 32x32px

**Warning (Yellow):**
- Border: #ffcc00, 2px
- Background: #332200 @ 90%
- Icon: ⚠️ warning, 32x32px

**Error (Red):**
- Border: #ff0000, 2px
- Background: #330000 @ 90%
- Icon: ✗ X mark, 32x32px

**Info (Blue):**
- Border: #3366cc, 2px
- Background: #001133 @ 90%
- Icon: ℹ️ info, 32x32px

**Animation:** Slide down from top (300ms), pause (3s), slide up (300ms)

---

### E. Tooltip Popup
**File:** `tooltip_frame.png`
**Dimensions:** Variable (auto-size to content)

#### Tooltip Design
```
       ▼  Pointer to element
┌─────────────────┐
│ Tooltip text    │
│ goes here       │
└─────────────────┘
```

**Styling:**
- Background: #000000 @ 95%
- Border: #00ff00, 1px
- Text: #88ff88, 12px
- Padding: 8px
- Max width: 200px
- Pointer: 8x8px triangle

**Behavior:** Appears on hover (500ms delay), fades in (200ms)

---

## 4. ANIMATION OVERLAYS

### A. Sparkle Effect (Success/Completion)
**File:** `sparkle_particle.png`
**Dimensions:** 16x16px (8-frame animation)

```
Frame 1:    ·        (1px white dot)
Frame 2:   ·+·       (3px cross)
Frame 3:  · + ·      (5px expanding)
Frame 4: ·  +  ·     (7px peak)
Frame 5:  · + ·      (5px contracting)
Frame 6:   ·+·       (3px)
Frame 7:    ·        (1px)
Frame 8:    ø        (fade out)
```

**Colors:** #ffffff → #ffffaa → transparent
**Use:** Completing tattoo, gaining gang rep, achievements

---

### B. Blood Drop (Infection)
**File:** `blood_drop_anim.png`
**Dimensions:** 12x24px (6-frame animation)

```
Frame 1:   ·       Top of tattoo (forming)
Frame 2:  ·█·      Drop grows
Frame 3:   █       Detaches
Frame 4:   █       Falling
Frame 5:   █
Frame 6:  ◉◉◉     Splat on ground
```

**Colors:** #8b0000 (blood red) → #aa3333 (splatter)
**Use:** Infection warning, bad care sequence

---

### C. Glow Pulse (Selection/Highlight)
**File:** `glow_pulse.png`
**Dimensions:** Variable (wraps around element)

```
4-frame radial glow animation:
Frame 1: 0px radius, 80% opacity
Frame 2: 2px radius, 60% opacity
Frame 3: 4px radius, 40% opacity
Frame 4: 6px radius, 20% opacity
[Loop back to Frame 1]
```

**Colors:** Context-dependent (gang colors, UI green, etc.)
**Use:** Selected items, active buttons, important elements

---

## TECHNICAL IMPLEMENTATION

### CSS Image Rendering
```css
.pixel-art {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    image-rendering: -webkit-crisp-edges;
}
```

### Canvas Drawing Example
```javascript
// Draw ornate frame around canvas
const frameImg = new Image();
frameImg.src = 'assets/pixel-art/ui/tattoo_canvas_ornate_frame.png';

function drawCanvasFrame() {
    ctx.drawImage(
        frameImg,
        canvasX - 20, canvasY - 20,  // Offset for border
        360, 360                      // Frame size
    );
}

// Draw hover glow
function drawHoverGlow(cellX, cellY, opacity) {
    ctx.globalAlpha = opacity;
    ctx.drawImage(
        glowImg,
        cellX, cellY,
        cellSize, cellSize
    );
    ctx.globalAlpha = 1.0;
}
```

### Animation Loop
```javascript
class UIAnimator {
    constructor() {
        this.frame = 0;
        this.animations = [];
    }

    addAnimation(type, x, y, duration) {
        this.animations.push({
            type: type,        // 'sparkle', 'blood', 'glow'
            x: x, y: y,
            frame: 0,
            maxFrames: duration,
            active: true
        });
    }

    update() {
        this.animations.forEach(anim => {
            if (!anim.active) return;

            anim.frame++;
            if (anim.frame >= anim.maxFrames) {
                anim.active = false;
            }

            this.drawAnimFrame(anim);
        });

        // Remove completed animations
        this.animations = this.animations.filter(a => a.active);
    }

    drawAnimFrame(anim) {
        const spriteSheet = this.getSheet(anim.type);
        const frameWidth = 16; // Example
        const frameX = anim.frame * frameWidth;

        ctx.drawImage(
            spriteSheet,
            frameX, 0, frameWidth, 16,
            anim.x, anim.y, frameWidth, 16
        );
    }
}
```

---

## ASSET CHECKLIST

### Tattoo UI
- [x] Ornate canvas frame (360x360px)
- [x] Cell hover glow (32x32px, 4 frames)
- [x] Active cell fill states
- [x] Stencil overlay (320x320px)
- [x] Ink application animation (8 frames)
- [x] Infection warning overlay

### Gang UI
- [x] Gang selection cards (200x280px, 3 variants)
- [x] Reputation bars (200x40px, 3 color schemes)
- [x] Player gang badge (64x80px)
- [x] Dialogue box (600x200px)
- [x] Action menu radial (240x240px)

### Shared UI
- [x] Standard button (160x48, 200x64)
- [x] Modal window frame (640x480)
- [x] Progress bar (200x32)
- [x] Notification banners (400x80, 4 variants)
- [x] Tooltip popup (variable size)

### Animations
- [x] Sparkle effect (16x16, 8 frames)
- [x] Blood drop (12x24, 6 frames)
- [x] Glow pulse (variable, 4 frames)

---

**Status:** Specification Complete
**Next Steps:** Create pixel art UI elements using Aseprite or Figma
**Integration:** Add to game/assets/pixel-art/ui/
