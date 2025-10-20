# GANG EMBLEMS - Pixel Art Specifications
## Three Prison Gang Factions

---

## 1. SAFE DRIVERS CLUB

### Gang Identity
- **Philosophy:** Lawful, cautious, ironically dedicated to "safe driving"
- **Members:** Former driving instructors, rule-followers, bureaucrats
- **Motto:** "Signal Before You Swerve"
- **Color Scheme:** Safety yellow, caution orange, reflective accents

### Emblem Design: `gang_safe_drivers_emblem.png`
**Dimensions:** 128x128px (high detail for main display)
**Simplified Version:** 64x64px (for UI badges)

#### Primary Emblem Layout
```
        ═══════
       ║CAUTION║  ← Yellow warning banner (top)
       ═══════
     ▄▄▄▄▄▄▄▄▄▄▄
    ║           ║
    ║  ▲  ▲  ▲ ║  ← Yield triangle pattern
    ║ ▲ ▼ ▲ ▼ ▲║
    ║▲ ▲ ▼ ▲ ▼ ║
    ║           ║
    ║   SAFE    ║  ← Text (center)
    ║  DRIVERS  ║
    ║           ║
     ▀▀▀▀▀▀▀▀▀▀▀
       ║     ║
       ║     ║    ← "Post" support
       ╚═════╝
```

#### Color Specifications
- **Background Shield:** #222222 (caution black)
- **Banner Top:** #ffcc00 (safety yellow)
- **Banner Border:** #000000 (black outline, 2px)
- **Triangles:** Alternating #ffcc00 (yellow) and #ff8800 (orange)
- **Text:** #000000 (black) on #ffffaa (reflective highlight)
- **Post:** #444444 (grey metal)

#### Detailed Pixel Map (128x128px version)

**Top Banner (rows 1-16):**
```
Row 1-2:   All black (outline)
Row 3-14:  Yellow (#ffcc00) with black text "CAUTION"
           Font: 8x8 pixel bold, centered
Row 15-16: Black outline + grey shadow
```

**Shield Body (rows 17-96):**
```
Shield outline: 2px black border
Inner fill: Gradient #222222 (top) → #1a1a1a (bottom)

Triangle Pattern (centered, 64x32px area):
     ▲        16x16px triangle (yellow)
    ▲▲▲       Each triangle: equilateral
   ▲ ▼ ▲      Yellow (#ffcc00) and orange (#ff8800)
  ▲ ▲ ▼ ▲     alternating pattern
 ▲ ▲ ▼ ▲ ▲
```

**Text Area (rows 65-88):**
```
"SAFE" in pixel font, 10px height:
  ███  ███  ███  ███
  █    █ █  █    █
  ███  ███  ███  ███
    █  █ █  █    █
  ███  █ █  █    ███

"DRIVERS" in pixel font, 8px height:
  ██   ██   ██  █ █  ███  ██   ███
  █ █  █ █   █  █ █  █    █ █  █
  █ █  ██    █  ███  ███  ██   ███
  █ █  █ █   █  ███  █    █ █    █
  ██   █ █  ██  █ █  ███  █ █  ███
```

**Support Post (rows 97-128):**
```
Two vertical bars, 8px wide each, 24px apart:
Grey (#444444) with darker left edge (#2a2a2a)
Lighter right edge (#6a6a6a) for 3D effect

Bottom base: Horizontal bar connecting posts
┌────────┐
│        │ (recessed base)
└────────┘
```

#### Simplified 64x64px Version
```
Same design, reduced detail:
- Banner: 4-8 rows (smaller "CAUTION" text)
- Shield: Single line outline (1px)
- Triangles: 8x8px each (fewer triangles)
- Text: "SD" initials instead of full words
- Post: Thinner, 4px wide bars
```

#### Icon Version (32x32px)
```
Ultra-simplified badge:
   ▄▄▄▄
  █WARN█  ← Tiny banner
  ▄▄▄▄▄
  █▲ ▲█
  █ ▼ █  ← Triangle symbol only
  █▲ ▲█
  ▀▀▀▀▀
```

---

## 2. TURN SIGNALS FACTION

### Gang Identity
- **Philosophy:** Order through communication, precision in chaos
- **Members:** Engineers, signal operators, control freaks
- **Motto:** "Indicate Your Intentions"
- **Color Scheme:** Indicator amber, hazard red, chrome silver, tech blue

### Emblem Design: `gang_turn_signals_emblem.png`
**Dimensions:** 128x128px (high detail for main display)
**Simplified Version:** 64x64px (for UI badges)

#### Primary Emblem Layout
```
       ◄══════►    ← Bidirectional arrows (top)

    ┌───────────┐
    │   ╔═══╗   │  ← Indicator light (left)
    │ ◄═║ L ║   │
    │   ╚═══╝   │
    │           │
    │  ╔═══╗   │  ← Indicator light (center)
    │  ║ ⊕ ║   │  ← Hazard symbol
    │  ╚═══╝   │
    │           │
    │   ╔═══╗  │  ← Indicator light (right)
    │   ║ R ║═►│
    │   ╚═══╝  │
    └───────────┘

     T  S  F     ← Initials below
```

#### Color Specifications
- **Background Panel:** #1a1a1a (dark base)
- **Panel Frame:** #a8a8a8 (chrome silver)
- **Left Arrow:** #ff9900 (signal amber)
- **Center Hazard:** #ff3300 (hazard red)
- **Right Arrow:** #ff9900 (signal amber)
- **Indicator Boxes:** #3366cc (tech blue glow)
- **Text (L/R/⊕):** #ffffaa (bright indicator color)

#### Detailed Pixel Map (128x128px version)

**Top Arrows (rows 1-16):**
```
◄══════►  Double-ended arrow
Left arrow: Points left, amber (#ff9900)
Right arrow: Points right, amber (#ff9900)
Center bar: Chrome (#a8a8a8)

Arrow structure (16x8px each):
◄ = triangle pointing left + horizontal lines
► = horizontal lines + triangle pointing right

Glow effect: Add 40% opacity halo (#ff9900 @ 40%)
```

**Main Panel (rows 17-112):**
```
Outer frame: 2px silver border (#a8a8a8)
Recessed edge: 1px dark line (#3d3d3d) inside border
Background: Dark grey (#1a1a1a)

Three indicator sections (vertical layout):
Each section: 32x32px

TOP INDICATOR (LEFT):
┌─────────┐
│ ░░░░░░░ │ ← Subtle glow
│ ░╔═══╗░ │
│ ◄═║ L ║░│ ← Letter "L" in center
│ ░╚═══╝░ │
│ ░░░░░░░ │
└─────────┘

MIDDLE INDICATOR (HAZARD):
┌─────────┐
│ ░░RED░░ │ ← Stronger glow (danger)
│ ░╔═══╗░ │
│ ░║ ⊕ ║░ │ ← Hazard symbol
│ ░╚═══╝░ │
│ ░░░░░░░ │
└─────────┘

BOTTOM INDICATOR (RIGHT):
┌─────────┐
│ ░░░░░░░ │
│ ░╔═══╗░ │
│ ░║ R ║═►│ ← Letter "R" + right arrow
│ ░╚═══╝░ │
│ ░░░░░░░ │
└─────────┘
```

**Indicator Box Details (each 24x24px inner):**
- Border: 2px #3366cc (tech blue)
- Inner glow: Radial gradient from center
  - Center: #3366cc @ 80% opacity
  - Edge: #1a3366 @ 20% opacity
- Letter: 12x12px, #ffffaa (bright yellow-white)
- Font: Bold, blocky, high contrast

**Hazard Symbol (⊕):**
```
16x16px circular symbol:
   ▄▄▄▄
  ██████   Outer circle (#ff3300)
  ██▓▓██   Cross in center (#ffffaa)
  ██▓▓██
  ██████
   ▀▀▀▀
```

**Bottom Text (rows 113-128):**
```
"T  S  F" (Turn Signals Faction)
Each letter: 8x10px, spaced 8px apart
Color: #a8a8a8 (chrome)
Font: Technical/stencil style
```

#### Simplified 64x64px Version
```
Vertical stack of 3 indicators:
- Single indicator light (12x12px each)
- Left/Right arrows only (no letters)
- Hazard in center (simplified ⊕)
- "TSF" below (4px font)
```

#### Icon Version (32x32px)
```
Single indicator:
┌─────┐
│ ◄ ► │ ← Just arrows
│  ⊕  │ ← Hazard symbol
└─────┘
```

---

## 3. ROAD WARRIORS

### Gang Identity
- **Philosophy:** Speed is freedom, chaos is liberation
- **Members:** Street racers, daredevils, thrill-seekers
- **Motto:** "Full Throttle or Nothing"
- **Color Scheme:** Warrior red, flame orange, exhaust black, chrome white

### Emblem Design: `gang_road_warriors_emblem.png`
**Dimensions:** 128x128px (high detail for main display)
**Simplified Version:** 64x64px (for UI badges)

#### Primary Emblem Layout
```
      ░▒▓ FLAMES ▓▒░     ← Fire on top
     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

    ╔═══════════════╗
    ║    ▄▄▄▄▄▄▄    ║
    ║   ▐███████▌   ║  ← Skull (danger)
    ║   ▐██▀ ▀██▌   ║
    ║    ███▄▄███   ║
    ║               ║
    ║   ═══════    ║  ← Speed lines
    ║  ═══════     ║
    ║ ═══════      ║
    ║               ║
    ║  ROAD         ║
    ║ WARRIORS      ║
    ╚═══════════════╝

     ╱╲  ╱╲  ╱╲       ← Tire treads
```

#### Color Specifications
- **Flames:** Gradient #cc0000 (red) → #ff4400 (orange) → #ff9900 (yellow tips)
- **Skull:** #e0e0e0 (chrome white) with #6a6a6a (shadows)
- **Background:** #1a1a1a (exhaust black)
- **Border:** #cc0000 (warrior red), 3px wide
- **Speed Lines:** #ff4400 (flame orange)
- **Text:** #e0e0e0 (chrome white)
- **Tire Treads:** #1a1a1a (black) on #444444 (grey)

#### Detailed Pixel Map (128x128px version)

**Flame Layer (rows 1-24):**
```
Animated flames (optional 4-frame animation):

Frame 1:
      ▒▒▓▓▓▒▒       ← Tips (yellow #ff9900)
     ▓▓▓██▓▓▓▓
    ▓▓████████▓     ← Mid (orange #ff4400)
   ▓██████████▓▓
  ▓████████████▓    ← Base (red #cc0000)
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

Frame 2-4: Slightly shifted shapes for flicker

Static version: Use Frame 1 only
```

**Main Shield (rows 25-104):**
```
Border: 3px red (#cc0000)
Outer glow: 2px #ff4400 @ 60% opacity
Background: Solid black (#1a1a1a)

┌─────────────────┐
│                 │
│   SKULL ICON    │ ← Top third
│                 │
├─────────────────┤
│                 │
│  SPEED LINES    │ ← Middle third
│                 │
├─────────────────┤
│                 │
│  TEXT: ROAD     │ ← Bottom third
│      WARRIORS   │
│                 │
└─────────────────┘
```

**Skull Design (48x48px):**
```
   ▄▄▄▄▄▄▄▄
  ███████████     Top of skull (#e0e0e0)
 █████░░█████
 ████░██░████     Eye sockets (black)
 ████████████
  ███▄▄▄███      Teeth area
   ███████
    █████        Jaw

Shading:
- Right side darker (#a8a8a8)
- Left side highlight (#ffffff)
- Eyes: Pure black (#000000)
- Cracks: 1px dark lines (#6a6a6a)
```

**Speed Lines (middle section):**
```
Three horizontal streaks, decreasing length:

Line 1: ═══════════  (64px, #ff4400)
Line 2:  ══════════  (56px, #ff4400 @ 80%)
Line 3:   ═════════  (48px, #ff4400 @ 60%)

Blur effect on trailing edge (optional):
- Use 2px gradient fade on right side
- Motion blur: #ff4400 → transparent
```

**Text "ROAD WARRIORS" (24px height total):**
```
"ROAD" in bold pixel font (12px):
  ██   ███   ███  ██
  █ █  █ █  █ █  █ █
  ██   █ █  █ █  █ █
  █ █  █ █  █ █  █ █
  █ █  ███   ███  ██

"WARRIORS" in bold pixel font (10px):
  █ █ █  ███  ██  ██  ██  ███  ██  ███
  █ █ █  █ █  █ █ █ █  █  █ █  █ █ █
  █ █ █  ███  ██  ██   █  █ █  ██  ███
  ██ ██  █ █  █ █ █ █  █  █ █  █ █   █
  ██ ██  █ █  █ █ █ █ ██  ███  █ █ ███

Color: #e0e0e0 (chrome white)
Outline: 1px #cc0000 (red) for extra pop
```

**Tire Treads (rows 105-128):**
```
Three chevron patterns (like tire tread):

 ╱╲    ╱╲    ╱╲
╱  ╲  ╱  ╲  ╱  ╲

Each chevron: 16x16px
Foreground: #1a1a1a (black tread)
Background: #444444 (grey rubber)
Spacing: 8px between each chevron
```

#### Simplified 64x64px Version
```
Reduced elements:
- Smaller flames (8px height)
- Simplified skull (24x24px)
- Single speed line
- "RW" initials instead of full text
- Two tire chevrons instead of three
```

#### Icon Version (32x32px)
```
Minimal badge:
  ▓▓▓
 ┌───┐
 │░▀░│  ← Simplified skull
 │───│  ← Single speed line
 └───┘
```

---

## COMPARATIVE EMBLEM OVERVIEW

### Side-by-Side Layout (for gang selection UI)
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  YELLOW  │  │  CHROME  │  │   RED    │
│  SHIELD  │  │  PANEL   │  │  FLAMES  │
│    ▲▲    │  │   ◄►⊕   │  │   💀    │
│   SAFE   │  │  TURN    │  │   ROAD   │
│  DRIVERS │  │ SIGNALS  │  │ WARRIORS │
└──────────┘  └──────────┘  └──────────┘
   LAWFUL       NEUTRAL       CHAOTIC
```

### Emblem Uses in Game

#### 1. Gang Selection Screen (128x128px)
- Large, detailed version
- Animated on hover (glow pulse)
- Click to view gang info

#### 2. Player Badge (64x64px)
- Shows current gang affiliation
- Displayed in prison menu
- Next to player stats

#### 3. Mini Icons (32x32px)
- Reputation meters
- Gang member indicators
- Event notifications

#### 4. Tattoo Flash Art (64x64px)
- Available as tattoo designs
- Player can get gang emblem tattooed
- Shows loyalty/membership

---

## ANIMATION SPECIFICATIONS

### Idle Glow Pulse (all emblems)
**Frames:** 4 (loop)
**Duration:** 2 seconds total (0.5s per frame)

```
Frame 1: Base opacity (100%)
Frame 2: +10% brightness
Frame 3: +20% brightness (peak)
Frame 4: +10% brightness
[Loop back to Frame 1]
```

### Hover State
- Glow radius increases by 4px
- Brightness +30%
- Slight scale increase (105%)
- Transition: 0.3s ease-in-out

### Selection State
- Solid glow (no pulse)
- +40% brightness
- 2px green outline (#00ff00)
- Persistent until deselected

---

## EMBLEM VARIANTS

### Worn/Graffiti Versions (prison wall)
Each emblem also has a "painted on wall" variant:
- Rougher edges (1px jitter)
- Drip marks (paint running down)
- Partial coverage (chipped/worn areas)
- Lower saturation (-20%)

### Faction Rankings
Each gang has 3 rank badges:

#### Initiate (simplified, grey)
- Base emblem in greyscale
- Small size (32x32px)
- No glow effects

#### Member (normal, colored)
- Full color emblem (64x64px)
- Standard glow
- Current specs

#### Lieutenant (enhanced, gold trim)
- Full color + gold border (#daa520)
- Larger size (96x96px)
- Enhanced glow
- Additional ornamental details

---

## TECHNICAL EXPORT SETTINGS

### File Formats
- **PNG-24:** For transparency support
- **No dithering:** Clean pixel edges
- **Nearest-neighbor:** No smoothing/interpolation

### Resolution Exports (per emblem)
1. `gang_[name]_128.png` - High detail
2. `gang_[name]_64.png` - Standard UI
3. `gang_[name]_32.png` - Icon/badge
4. `gang_[name]_wall.png` - Graffiti variant

### Sprite Sheet Option
**File:** `gang_emblems_spritesheet.png`
**Dimensions:** 512x384px

```
Layout (128x128px cells with 1px padding):
┌─────┬─────┬─────┬─────┐
│ SD  │ SD  │ SD  │ SD  │  Row 1: Safe Drivers
│ 128 │ 64  │ 32  │WALL │  (4 variants)
├─────┼─────┼─────┼─────┤
│ TS  │ TS  │ TS  │ TS  │  Row 2: Turn Signals
│ 128 │ 64  │ 32  │WALL │  (4 variants)
├─────┼─────┼─────┼─────┤
│ RW  │ RW  │ RW  │ RW  │  Row 3: Road Warriors
│ 128 │ 64  │ 32  │WALL │  (4 variants)
└─────┴─────┴─────┴─────┘
```

---

## INTEGRATION CODE EXAMPLE

### HTML (gang selection screen)
```html
<div id="gangSelection" class="screen">
    <h2>CHOOSE YOUR FACTION</h2>

    <div class="gang-grid">
        <div class="gang-card" data-gang="safedrivers" onclick="selectGang('safedrivers')">
            <img src="assets/pixel-art/gangs/gang_safe_drivers_128.png"
                 alt="Safe Drivers Club"
                 class="gang-emblem">
            <h3>SAFE DRIVERS CLUB</h3>
            <p class="gang-motto">"Signal Before You Swerve"</p>
            <div class="gang-colors">
                <span class="color-dot" style="background: #ffcc00;"></span>
                <span class="color-dot" style="background: #ff8800;"></span>
            </div>
        </div>

        <!-- Repeat for Turn Signals and Road Warriors -->
    </div>
</div>
```

### CSS
```css
.gang-emblem {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    transition: all 0.3s ease;
}

.gang-card:hover .gang-emblem {
    transform: scale(1.1);
    filter: brightness(1.3) drop-shadow(0 0 10px currentColor);
}

.gang-card[data-gang="safedrivers"]:hover .gang-emblem {
    filter: brightness(1.3) drop-shadow(0 0 10px #ffcc00);
}

.gang-card[data-gang="turnsignals"]:hover .gang-emblem {
    filter: brightness(1.3) drop-shadow(0 0 10px #ff9900);
}

.gang-card[data-gang="roadwarriors"]:hover .gang-emblem {
    filter: brightness(1.3) drop-shadow(0 0 10px #cc0000);
}
```

### JavaScript
```javascript
function selectGang(gangId) {
    // Update player gang affiliation
    game.player.currentGang = gangId;

    // Show emblem badge
    const badgeImg = document.getElementById('playerGangBadge');
    badgeImg.src = `assets/pixel-art/gangs/gang_${gangId}_64.png`;
    badgeImg.style.display = 'block';

    // Animate selection
    document.querySelectorAll('.gang-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-gang="${gangId}"]`).classList.add('selected');

    game.showMessage(`You joined the ${getGangName(gangId)}!`, 3000);
}
```

---

## Asset Checklist

### Safe Drivers Club
- [x] Main emblem (128x128px)
- [x] UI badge (64x64px)
- [x] Mini icon (32x32px)
- [ ] Wall graffiti variant
- [ ] Rank variants (initiate/member/lieutenant)

### Turn Signals Faction
- [x] Main emblem (128x128px)
- [x] UI badge (64x64px)
- [x] Mini icon (32x32px)
- [ ] Wall graffiti variant
- [ ] Rank variants

### Road Warriors
- [x] Main emblem (128x128px)
- [x] UI badge (64x64px)
- [x] Mini icon (32x32px)
- [ ] Wall graffiti variant
- [ ] Rank variants

---

**Status:** Specification Complete
**Next Steps:** Create pixel art assets using Aseprite or Pixaki
**Integration:** Add to game/assets/pixel-art/gangs/
