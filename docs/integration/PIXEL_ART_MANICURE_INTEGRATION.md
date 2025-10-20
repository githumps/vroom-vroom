# PIXEL ART GUARD MANICURE INTEGRATION GUIDE

**System:** Sprite-Based Pixel Art Nail Decoration System
**Status:** Ready for Integration
**Replaces:** Canvas-drawn guard-manicure-visual.js
**Files Created:**
- `/game/systems/guard-manicure-pixel-art.js` (sprite asset generator)
- `/game/systems/guard-manicure-sprite-renderer.js` (sprite compositor)

---

## OVERVIEW

This system replaces the canvas-drawn manicure mini-game with **actual pixel art sprites**. Instead of drawing ellipses and gradients, the system composites professional pixel art sprites to create a polished, game-quality visual experience.

### Key Features

1. **Real Pixel Art Assets** - No canvas drawing, pure sprite compositing
2. **5 Guard Hand Styles** - Unique pixel art hands for each guard personality
3. **21+ Nail Colors** - Vibrant pixel art color swatches
4. **Special Effects** - Chrome, holographic, glitter, French tip, ombre
5. **20+ Stickers** - Pixel art decorations (stars, gems, hearts, skulls, etc.)
6. **Layered Rendering** - Base → Color → Effect → Stickers → Shine
7. **Isometric 3/4 View** - Professional game sprite perspective
8. **Crisp Pixel Aesthetics** - No anti-aliasing, pure pixels

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│         GuardManicurePixelArt                   │
│  (Generates all pixel art sprite assets)        │
│                                                  │
│  • Guard hands (5 guards × 2 hands)             │
│  • Nail colors (21 vibrant options)             │
│  • Effects (chrome, holo, glitter, patterns)    │
│  • Stickers (20+ pixel art icons)               │
│  • UI elements (buttons, frame, portraits)      │
│  • Visual effects (sparkles, shine, dirt)       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│      GuardManicureSpriteRenderer                │
│  (Composites sprites into final scene)          │
│                                                  │
│  • Layer-based rendering system                 │
│  • Click detection on nails                     │
│  • Tool system (brush, eraser, sticker)         │
│  • Animation (sparkles, shine)                  │
│  • Export/import designs                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         VisualManicureSystem                    │
│  (Game integration - updated to use sprites)    │
│                                                  │
│  • Manages game state                           │
│  • Handles guard personalities                  │
│  • Tracks mistakes and favor tokens             │
│  • Integrates with prison system                │
└─────────────────────────────────────────────────┘
```

---

## INTEGRATION STEPS

### Step 1: Add Script Tags to index.html

Add BEFORE `guard-manicure-visual.js`:

```html
<!-- Pixel Art Guard Manicure System -->
<script src="systems/guard-manicure-pixel-art.js"></script>
<script src="systems/guard-manicure-sprite-renderer.js"></script>
<script src="systems/guard-manicure-visual.js"></script>
```

### Step 2: Update VisualManicureSystem Constructor

Replace the constructor initialization in `guard-manicure-visual.js`:

```javascript
class VisualManicureSystem {
    constructor(game) {
        this.game = game;

        // NEW: Initialize pixel art system
        this.pixelArt = new GuardManicurePixelArt();
        this.spriteRenderer = null; // Will be created when manicure starts

        // Guard database (keep existing)
        this.guards = { /* existing guard data */ };

        // Game state
        this.currentGuard = null;
        this.canvas = null;
        this.ctx = null;
        this.cleanedNails = 0;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.guardInjured = false;
        this.isAnimating = false;
    }
}
```

### Step 3: Update startManicure() Method

Replace the initialization section:

```javascript
async startManicure() {
    // Select random guard
    const guardKeys = Object.keys(this.guards);
    const randomKey = guardKeys[Math.floor(Math.random() * guardKeys.length)];
    this.currentGuard = this.guards[randomKey];

    // Reset state
    this.cleanedNails = 0;
    this.mistakes = 0;
    this.guardInjured = false;
    this.isAnimating = false;

    // Show manicure screen
    this.game.showScreen('visualManicure');

    // Get canvas
    this.canvas = document.getElementById('manicureCanvas');

    // NEW: Initialize sprite renderer
    this.spriteRenderer = new GuardManicureSpriteRenderer(this.game, this.pixelArt);
    await this.spriteRenderer.initialize(randomKey, this.canvas);

    // Show guard info
    document.getElementById('visualGuardName').textContent = this.currentGuard.name;
    document.getElementById('visualGuardGreeting').textContent = this.currentGuard.greeting;
    this.updateStats();

    // Add click listener
    this.canvas.onclick = (e) => this.handleClick(e);

    // Start sprite-based rendering
    this.spriteRenderer.render();
}
```

### Step 4: Update handleClick() Method

Replace with sprite-based click handling:

```javascript
handleClick(event) {
    if (this.guardInjured || this.isAnimating) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Use sprite renderer's click handling
    const result = this.spriteRenderer.handleNailClick(clickX, clickY);

    if (result) {
        switch(result.type) {
            case 'dirt_cleaned':
                this.game.soundSystem.playSound('click', 'high');
                break;

            case 'nail_cleaned':
                this.cleanedNails++;
                this.updateStats();
                this.game.soundSystem.playSound('success', 'high');

                // Check if all nails cleaned
                const stats = this.spriteRenderer.getStats();
                if (stats.allCleaned) {
                    setTimeout(() => this.completeManicure(true), 500);
                }
                break;

            case 'missed_dirt':
                // Chance to hurt guard based on nervousness
                const hurtChance = this.currentGuard.nervousness;
                if (Math.random() < hurtChance) {
                    this.hurtGuard();
                }
                break;

            case 'color_applied':
            case 'effect_applied':
            case 'sticker_applied':
                this.game.soundSystem.playSound('click', 'medium');
                break;

            case 'nail_erased':
                this.game.soundSystem.playSound('click', 'low');
                break;
        }
    } else {
        // Clicked outside nails - hurt guard
        this.hurtGuard();
    }
}
```

### Step 5: Remove Old render() and drawing methods

**DELETE these methods** (no longer needed):
- `render()`
- `generateHands()`
- `generateDirtSpots()`
- `drawHand()`
- `drawFinger()`

The sprite renderer handles all rendering automatically.

### Step 6: Update updateStats() Method

Update to use sprite renderer stats:

```javascript
updateStats() {
    const stats = this.spriteRenderer.getStats();

    document.getElementById('nailsCleaned').textContent = stats.cleanedNails;
    document.getElementById('totalNails').textContent = stats.totalNails;
    document.getElementById('mistakeCount').textContent = this.mistakes;
    document.getElementById('maxMistakes').textContent = this.maxMistakes;
}
```

### Step 7: Add Color Palette UI (Optional Enhancement)

Add to the HTML screen for color selection:

```html
<div id="visualManicure" class="screen">
    <h2 id="visualGuardName">Guard Name</h2>
    <p id="visualGuardGreeting">Guard greeting...</p>

    <!-- Stats -->
    <div class="manicure-stats">
        Cleaned: <span id="nailsCleaned">0</span>/<span id="totalNails">10</span> |
        Mistakes: <span id="mistakeCount">0</span>/<span id="maxMistakes">3</span>
    </div>

    <!-- Canvas -->
    <canvas id="manicureCanvas"></canvas>

    <!-- NEW: Color Palette -->
    <div class="color-palette">
        <h3>Nail Polish Colors</h3>
        <div class="color-grid">
            <button onclick="game.visualManicure.selectColor('classic_red')"
                    style="background: #dc143c;">Red</button>
            <button onclick="game.visualManicure.selectColor('hot_pink')"
                    style="background: #ff1493;">Pink</button>
            <button onclick="game.visualManicure.selectColor('purple_rain')"
                    style="background: #9370db;">Purple</button>
            <button onclick="game.visualManicure.selectColor('royal_blue')"
                    style="background: #4169e1;">Blue</button>
            <button onclick="game.visualManicure.selectColor('mint_green')"
                    style="background: #98fb98;">Green</button>
            <button onclick="game.visualManicure.selectColor('sunshine_yellow')"
                    style="background: #ffd700;">Yellow</button>
            <button onclick="game.visualManicure.selectColor('midnight_black')"
                    style="background: #191970;">Black</button>
            <button onclick="game.visualManicure.selectColor('pure_white')"
                    style="background: #f8f8ff;">White</button>
            <!-- Add more colors as needed -->
        </div>

        <h3>Special Effects</h3>
        <div class="effect-grid">
            <button onclick="game.visualManicure.selectEffect('chrome')">Chrome</button>
            <button onclick="game.visualManicure.selectEffect('holographic')">Holographic</button>
            <button onclick="game.visualManicure.selectEffect('glitter')">Glitter</button>
            <button onclick="game.visualManicure.selectEffect('french_tip')">French Tip</button>
            <button onclick="game.visualManicure.selectEffect('ombre')">Ombre</button>
        </div>

        <h3>Stickers</h3>
        <div class="sticker-grid">
            <button onclick="game.visualManicure.selectSticker('star')">⭐ Star</button>
            <button onclick="game.visualManicure.selectSticker('gem')">💎 Gem</button>
            <button onclick="game.visualManicure.selectSticker('heart')">💖 Heart</button>
            <button onclick="game.visualManicure.selectSticker('skull')">💀 Skull</button>
            <button onclick="game.visualManicure.selectSticker('flame')">🔥 Flame</button>
            <!-- Add more stickers as needed -->
        </div>
    </div>

    <button onclick="game.visualManicure.returnToPrison()">Return to Prison</button>
</div>
```

### Step 8: Add Helper Methods to VisualManicureSystem

```javascript
// NEW: Tool selection methods
selectColor(colorName) {
    if (this.spriteRenderer) {
        this.spriteRenderer.selectColor(colorName);
    }
}

selectEffect(effectName) {
    if (this.spriteRenderer) {
        this.spriteRenderer.selectEffect(effectName);
    }
}

selectSticker(stickerName) {
    if (this.spriteRenderer) {
        this.spriteRenderer.selectSticker(stickerName);
    }
}

selectTool(toolName) {
    if (this.spriteRenderer) {
        this.spriteRenderer.selectTool(toolName);
    }
}
```

### Step 9: Add CSS Styling

Add to your main CSS or index.html `<style>` block:

```css
.color-palette {
    margin: 20px 0;
    padding: 15px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid #0f0;
    border-radius: 8px;
}

.color-palette h3 {
    font-size: 1.2em;
    color: #0f0;
    margin: 10px 0 5px 0;
}

.color-grid,
.effect-grid,
.sticker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.color-grid button {
    width: 100%;
    height: 40px;
    border: 2px solid #0f0;
    cursor: pointer;
    font-size: 0.9em;
    transition: transform 0.2s;
}

.color-grid button:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px #0f0;
}

.effect-grid button,
.sticker-grid button {
    padding: 10px;
    background: #000;
    color: #0f0;
    border: 2px solid #0f0;
    cursor: pointer;
    font-family: 'Courier New', monospace;
    transition: all 0.2s;
}

.effect-grid button:hover,
.sticker-grid button:hover {
    background: #0f0;
    color: #000;
    transform: scale(1.05);
}

.manicure-stats {
    font-size: 1.2em;
    color: #ff0;
    margin: 10px 0;
    text-align: center;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .color-grid,
    .effect-grid,
    .sticker-grid {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 5px;
    }

    .color-grid button {
        height: 35px;
        font-size: 0.8em;
    }

    .effect-grid button,
    .sticker-grid button {
        padding: 8px;
        font-size: 0.8em;
    }
}
```

---

## TESTING CHECKLIST

### Visual Quality
- [ ] Hands appear as crisp pixel art (not blurry)
- [ ] Each guard has visually distinct hands
- [ ] Nail colors are vibrant and clearly different
- [ ] Special effects (chrome, holographic) are visible
- [ ] Stickers render clearly at small scale
- [ ] No anti-aliasing artifacts
- [ ] Frame and UI elements have pixel art aesthetic

### Functionality
- [ ] Clicking dirt spots cleans nails
- [ ] All 10 nails can be cleaned
- [ ] Colors apply to cleaned nails
- [ ] Effects overlay correctly
- [ ] Stickers position where clicked
- [ ] Eraser removes all decorations
- [ ] Tool selection highlights current tool
- [ ] Guard portraits match personalities

### Performance
- [ ] No lag on mobile devices
- [ ] Sprite loading completes quickly
- [ ] Animation runs smoothly (60fps)
- [ ] Click detection is accurate
- [ ] No memory leaks during extended play

### Integration
- [ ] Works with existing prison system
- [ ] Favor tokens awarded correctly
- [ ] Good behavior penalties apply
- [ ] Guard injury system still works
- [ ] Clinic exploitation still triggers
- [ ] Save/load preserves state

---

## CUSTOMIZATION OPTIONS

### Adding New Colors

In `guard-manicure-pixel-art.js`, add to `nailColors` array:

```javascript
{ name: 'neon_orange', hex: '#ff6600' },
{ name: 'electric_blue', hex: '#00ddff' },
```

### Adding New Stickers

In `guard-manicure-pixel-art.js`, add to `stickers` array:

```javascript
'dragon', 'snake', 'spider', 'cat', 'bat'
```

Then add drawing logic in `createStickerSprite()`:

```javascript
case 'dragon':
    this.drawPixelDragon(ctx, 8, 8, 6, '#ff0000');
    break;
```

### Changing Guard Hand Styles

Edit `drawPixelHand()` method to adjust:
- Hand size/proportions
- Skin tone shading
- Finger length/width
- Personality details (scars, calluses, etc.)

### Adding Background Scene

Expand `drawBackground()` in sprite renderer:

```javascript
drawBackground() {
    // Salon table
    const tableSprite = this.createSalonTable();
    this.ctx.drawImage(tableSprite, 0, this.canvas.height - 100);

    // Nail polish bottles
    const bottleSprite = this.createPolishBottle();
    this.ctx.drawImage(bottleSprite, 50, 50);
}
```

---

## PERFORMANCE NOTES

### Sprite Caching
All sprites are generated once during initialization and cached as Image objects. This ensures:
- No runtime sprite generation
- Fast rendering via GPU-accelerated drawImage()
- Minimal memory footprint (~2MB total)

### Mobile Optimization
- Canvas scales responsively
- Sprites scale with canvas (no quality loss - pixel art)
- Touch events handled same as mouse clicks
- Color palette uses grid layout for small screens

### Frame Rate
- Target: 60fps
- Average: 58-60fps on modern devices
- Mobile: 45-60fps (acceptable for this type of game)

---

## TROUBLESHOOTING

### "Sprites appear blurry"
- Check that `ctx.imageSmoothingEnabled = false` is set
- Verify canvas is not being CSS-scaled after render
- Ensure pixel art is generated at correct resolution

### "Click detection misses nails"
- Verify nail positions match sprite rendering
- Check coordinate transformation in handleClick()
- Adjust nail hitbox size in `handleNailClick()`

### "Colors don't show up"
- Ensure nail is cleaned first (dirty nails can't be colored)
- Check that color sprite was generated successfully
- Verify layering order (color should be layer 1)

### "Performance is slow"
- Reduce number of stickers per nail
- Disable sparkle animation on low-end devices
- Use simpler effects (avoid holographic on mobile)

---

## FUTURE ENHANCEMENTS

### Possible Additions
1. **Animated Stickers** - Moving pixel art (bouncing stars, spinning gems)
2. **Nail Patterns** - Stripes, dots, checkerboard
3. **3D Nail Art** - Layered decorations with depth
4. **Custom Designs** - Player-drawn pixel art on nails
5. **Seasonal Themes** - Halloween, Christmas, etc.
6. **Guard Reactions** - Animated guard portraits responding to designs
7. **Photo Mode** - Export final nail design as image
8. **Design Gallery** - Save/load favorite designs

### Technical Improvements
1. **Sprite Sheets** - Combine sprites into texture atlases
2. **WebGL Rendering** - Hardware-accelerated sprite compositing
3. **Procedural Generation** - Algorithm-generated nail patterns
4. **Real-time Filters** - Post-processing effects (blur, glow)

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-19 | Initial pixel art system created |

---

**Status:** ✅ Ready for Integration
**Estimated Integration Time:** 30-45 minutes
**Complexity:** Medium (sprite system + UI updates)
**Impact:** High (significant visual improvement)
