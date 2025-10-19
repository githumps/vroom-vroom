# NAIL ART VISUAL STYLE GUIDE

**Version:** 1.0.0
**Artist:** isometric-pixel-artist agent
**Created:** 2025-10-19
**Status:** Complete Reference Documentation

---

## EXECUTIVE SUMMARY

This style guide defines the complete visual language for the VROOM VROOM Nail Art Decoration System. All graphics are rendered procedurally via Canvas 2D API with **zero external image dependencies**. The system achieves a dazzling, glamorous aesthetic that contrasts beautifully with the game's dystopian world.

**Key Features:**
- Isometric 3/4 top-down hand rendering (26.565° angle, 2:1 pixel ratio)
- 5 unique guard hand styles with distinct personalities
- 40+ decoration options rendered as pure code
- Smooth animations (sparkle, shimmer, pulse effects)
- Mobile-responsive scaling with pixel-perfect rendering

---

## TABLE OF CONTENTS

1. [Isometric Projection Standards](#isometric-projection-standards)
2. [Guard Hand Styles](#guard-hand-styles)
3. [Color Palette](#color-palette)
4. [Nail Decoration Layers](#nail-decoration-layers)
5. [Animation Specifications](#animation-specifications)
6. [Rendering Pipeline](#rendering-pipeline)
7. [Code Integration Examples](#code-integration-examples)
8. [Performance Guidelines](#performance-guidelines)

---

## ISOMETRIC PROJECTION STANDARDS

### Projection Geometry

**Isometric Angle:** 26.565 degrees (arctan(0.5) for 2:1 pixel ratio)

```javascript
const ISO_ANGLE = 26.565; // degrees
const ISO_RATIO = 2.0;    // 2:1 pixel ratio (width:height)
```

**Coordinate System:**
- Origin: Canvas center (400, 300) at 1.0 scale
- X-axis: Horizontal (left-negative, right-positive)
- Y-axis: Vertical (up-negative, down-positive)
- Z-axis: Depth (simulated via layering, not true 3D)

### Canvas Dimensions

**Base Resolution:** 800 x 600 pixels (4:3 aspect ratio)

```javascript
// Desktop
canvas.width = 800;
canvas.height = 600;

// Mobile (responsive)
const maxWidth = Math.min(window.innerWidth - 30, 800);
canvas.width = maxWidth;
canvas.height = maxWidth * 0.75; // Maintain 4:3 ratio

scale = canvas.width / 800; // Scale factor for all coordinates
```

### Hand Positioning

**Left Hand:**
- Base position: (200, 350) at scale 1.0
- Fingers extend upward (negative Y)
- Thumb offset to left side

**Right Hand:**
- Base position: (600, 350) at scale 1.0
- Fingers extend upward (negative Y)
- Thumb offset to right side (mirrored)

**Finger Spread Angles:**
```javascript
// Left hand angles (degrees)
const leftAngles = [-20, -10, 0, 10, 20]; // Thumb to pinky

// Right hand angles (mirrored)
const rightAngles = [20, 10, 0, -10, -20]; // Thumb to pinky
```

---

## GUARD HAND STYLES

### Style Differentiation Matrix

| Guard | Skin Tone | Nail Color | Style | Knuckles | Nail Shape |
|-------|-----------|-----------|--------|----------|-----------|
| **Jenkins** | `#f4c8a8` | `#e8d4c0` | Rough, masculine | Yes (scars) | Square (70% height) |
| **Martinez** | `#d4a574` | `#c99766` | Delicate, elegant | No (smooth) | Oval (90% height) |
| **Chen** | `#f0d5be` | `#e8d0ba` | Nervous, bitten | No (cuticle damage) | Short (50% height) |
| **Thompson** | `#ffd7ba` | `#f5d8c4` | Worker, large | Yes (calluses) | Blunt (80% height, 120% width) |
| **Rodriguez** | `#c88a5a` | `#b87d52` | Elegant, graceful | No (smooth) | Almond (110% height) |

### Guard Jenkins - Rough & Masculine

**Visual Characteristics:**
- Larger palm ellipse (120x160 base size)
- Visible knuckle scars (3 circular outlines per hand)
- Square nail shape (shortened height)
- Thicker fingers (20px base width)

**Rendering Code:**
```javascript
// Knuckle scars
ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
ctx.lineWidth = 2;
const positions = [[-30, -10], [0, -15], [30, -10]];
positions.forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, 8, 0, Math.PI * 2);
    ctx.stroke();
});
```

### Guard Martinez - Delicate & Elegant

**Visual Characteristics:**
- Perfectly smooth hands (no texture)
- Oval nail shape (elegant proportions)
- Slender fingers (18px base width)
- Graceful finger curves

**Aesthetic Notes:**
- Requires **perfect symmetry** for bonus tokens
- Prefers white/gold colors with chrome effect
- No tolerance for messy decoration

### Guard Chen - Nervous & Bitten

**Visual Characteristics:**
- Very short nails (50% base height)
- Slightly jagged nail edges (irregular ellipse)
- Pale skin tone (`#f0d5be`)
- Tense finger positioning

**Rendering Notes:**
- Nails appear barely visible
- No cuticle definition (bitten away)
- Minimal decoration works best

### Guard Thompson - Worker & Large

**Visual Characteristics:**
- Widest nails (120% base width)
- Blunt nail tips (80% height)
- Calloused palm texture
- Thickest fingers (22px base width)

**Aesthetic Notes:**
- Loves pastels and fun colors
- Appreciates maximum decoration (stickers, glitter)
- Forgiving of asymmetry

### Guard Rodriguez - Elegant & Glamorous

**Visual Characteristics:**
- Longest nails (110% base height)
- Almond shape (tapered tips)
- Medium skin tone (`#c88a5a`)
- Slender, graceful fingers

**Aesthetic Notes:**
- Secretly loves MAXIMUM DAZZLE
- Pink and gold preferred
- Holographic effect highly valued

---

## COLOR PALETTE

### Skin Tones (Dystopian Muted)

```javascript
const SKIN_TONES = {
    jenkins: '#f4c8a8',    // Light peachy
    martinez: '#d4a574',   // Medium tan
    chen: '#f0d5be',       // Pale beige
    thompson: '#ffd7ba',   // Light warm
    rodriguez: '#c88a5a'   // Medium brown
};
```

### Base Colors (Vibrant Contrast)

**Classic Category:**
```javascript
const CLASSIC_COLORS = {
    red: '#dc143c',      // Crimson red
    pink: '#ff69b4',     // Hot pink
    black: '#000000',    // Pure black
    white: '#ffffff',    // Pure white
    nude: '#f5deb3'      // Wheat beige
};
```

**Pastels Category:**
```javascript
const PASTEL_COLORS = {
    lavender: '#e6e6fa',  // Light lavender
    mint: '#98ff98',      // Mint green
    peach: '#ffdab9',     // Peach puff
    blue: '#add8e6',      // Light blue
    coral: '#ff7f50'      // Coral
};
```

**Metallics Category:**
```javascript
const METALLIC_COLORS = {
    gold: '#ffd700',      // Gold
    silver: '#c0c0c0',    // Silver
    rosegold: '#b76e79',  // Rose gold
    bronze: '#cd7f32',    // Bronze
    copper: '#b87333'     // Copper
};
```

**Glamour Category (Extra Vibrant):**
```javascript
const GLAMOUR_COLORS = {
    neonPink: '#ff1493',   // Deep pink
    electricBlue: '#0000ff', // Electric blue
    violet: '#8a2be2'       // Blue violet
};
```

### Special Effect Colors

**Chrome (Jewel Beetle):**
- Base: `#c0c0c0` (silver)
- Highlight: `#00ffff` (cyan)
- Shadow: `#4b0082` (indigo)
- Opacity: 30-50% overlays

**Holographic:**
- HSL color space
- Hue: 0-360° (full spectrum)
- Saturation: 100%
- Lightness: 70%
- Opacity: 50%

**Iridescent:**
- Color cycle: `['#ff00ff', '#00ffff', '#ffff00']`
- Opacity: 40%
- Transition: Step animation (no smooth blend)

---

## NAIL DECORATION LAYERS

### Layer Rendering Order (Back to Front)

1. **Layer 1: Nail Base** (natural nail color)
2. **Layer 2: Base Color** (chosen lacquer color)
3. **Layer 3: Pattern** (french tip, ombre, solid)
4. **Layer 4: Special Effect** (chrome, holographic, etc.)
5. **Layer 5: Stickers** (stars, hearts, gems)
6. **Layer 6: Glitter** (sparkle particles)
7. **Layer 7: Selection Highlight** (if selected)
8. **Layer 8: Nail Outline** (always on top)

### Layer Details

#### Layer 1: Nail Base

```javascript
// Natural nail color (guard-specific)
ctx.fillStyle = guard.nail; // e.g., '#e8d4c0'
ctx.beginPath();
ctx.ellipse(0, 0, width * 0.5, height * 0.7, 0, 0, Math.PI * 2);
ctx.fill();
```

#### Layer 2: Base Color

```javascript
// User-selected base color
ctx.fillStyle = decoration.baseColor; // e.g., '#ff69b4'
ctx.beginPath();
ctx.ellipse(0, 0, width * 0.5, height * 0.7, 0, 0, Math.PI * 2);
ctx.fill();
```

#### Layer 3: Pattern - French Tip

```javascript
if (pattern === 'french') {
    ctx.fillStyle = '#ffffff'; // White tip
    ctx.beginPath();
    ctx.ellipse(
        0, -height * 0.35,  // Position at tip
        width * 0.5,
        height * 0.2,       // 20% of nail height
        0, 0, Math.PI * 2
    );
    ctx.fill();
}
```

#### Layer 3: Pattern - Ombre

```javascript
if (pattern === 'ombre') {
    const gradient = ctx.createLinearGradient(
        0, height * 0.35,   // Base (bottom)
        0, -height * 0.35   // Tip (top)
    );
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, lightenColor(baseColor, 40)); // +40% lighter

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.5, height * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
}
```

#### Layer 4: Special Effect - Chrome

```javascript
// Three-color gradient (cyan → silver → purple)
const gradient = ctx.createLinearGradient(-width * 0.5, -height * 0.35, width * 0.5, height * 0.35);
gradient.addColorStop(0, '#00ffff4d');   // Cyan 30%
gradient.addColorStop(0.5, '#c0c0c080'); // Silver 50%
gradient.addColorStop(1, '#4b00824d');   // Purple 30%

ctx.fillStyle = gradient;
ctx.ellipse(0, 0, width * 0.5, height * 0.7, 0, 0, Math.PI * 2);
ctx.fill();

// Animated shimmer
const shimmerX = Math.sin(time * 2) * width * 0.3;
ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
ctx.ellipse(shimmerX, -height * 0.2, width * 0.15, height * 0.3, 0, 0, Math.PI * 2);
ctx.fill();
```

#### Layer 5: Stickers - Star Example

```javascript
// 5-pointed star
const starSize = 8; // Base size
ctx.fillStyle = '#ffd700'; // Gold

ctx.beginPath();
for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(angle) * starSize;
    const y = Math.sin(angle) * starSize;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
}
ctx.closePath();
ctx.fill();

// Highlight
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
ctx.arc(0, -starSize * 0.3, starSize * 0.2, 0, Math.PI * 2);
ctx.fill();
```

#### Layer 6: Glitter

```javascript
// 12 sparkle particles
const particleCount = 12;
for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = Math.random() * width * 0.4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.7; // Elliptical

    // Fade animation
    const phase = (time * 3 + i * 0.5) % 2;
    const opacity = phase < 1 ? phase : 2 - phase;

    // Core sparkle
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();

    // Star cross (when bright)
    if (opacity > 0.7) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);
        ctx.stroke();
    }
}
```

#### Layer 7: Selection Highlight

```javascript
// Pulsing gold border
const pulsePhase = Math.sin(time * 4) * 0.5 + 0.5;
const opacity = 0.4 + 0.6 * pulsePhase;
const width = 4 + pulsePhase * 4;

ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
ctx.lineWidth = width;
ctx.ellipse(0, 0, nailWidth * 0.5 + width, nailHeight * 0.7 + width, 0, 0, Math.PI * 2);
ctx.stroke();
```

#### Layer 8: Nail Outline

```javascript
// Always on top, consistent brown outline
ctx.strokeStyle = '#8B7355';
ctx.lineWidth = 1.5;
ctx.ellipse(0, 0, width * 0.5, height * 0.7, 0, 0, Math.PI * 2);
ctx.stroke();
```

---

## ANIMATION SPECIFICATIONS

### Frame Rate Standards

**Desktop:** 60 FPS (16.67ms per frame)
**Mobile:** 30 FPS (33.33ms per frame) - graceful degradation

### Animation Types

#### 1. Sparkle/Glitter (Fade In/Out)

**Duration:** 0.67 seconds per cycle (2 seconds total loop)
**Frames:** Continuous (not frame-based)

```javascript
// Animation formula
const sparklePhase = (animationTime * 3 + particleOffset) % 2;
const opacity = sparklePhase < 1 ? sparklePhase : 2 - sparklePhase;

// Result: 0 → 1 → 0 over 2 seconds (fade in, fade out)
```

**Particle Offset:** Each particle offset by 0.5 seconds for cascading effect

#### 2. Holographic (Color Cycle)

**Duration:** 7.2 seconds per full spectrum (0-360°)
**Speed:** 50 degrees per second

```javascript
const hue = (animationTime * 50) % 360;
ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.5)`;
```

**Color Progression:**
- 0s: Red (0°)
- 1.2s: Yellow (60°)
- 2.4s: Green (120°)
- 3.6s: Cyan (180°)
- 4.8s: Blue (240°)
- 6.0s: Magenta (300°)
- 7.2s: Red (360°/0°) - loop

#### 3. Chrome Shimmer (Back and Forth)

**Duration:** 3.14 seconds per cycle (π seconds for smooth sine)
**Range:** ±30% of nail width

```javascript
const shimmerX = Math.sin(animationTime * 2) * nailWidth * 0.3;
// Oscillates left-right smoothly
```

**Shimmer Highlight:** White ellipse (40% opacity)
**Secondary Shimmer:** Cyan ellipse (20% opacity, opposite phase)

#### 4. Iridescent (Color Steps)

**Duration:** 6 seconds per full cycle (2 seconds per color)
**Colors:** 3-step cycle (no smooth blend)

```javascript
const colorIndex = Math.floor(animationTime * 0.5) % 3;
const colors = ['#ff00ff', '#00ffff', '#ffff00']; // Magenta, Cyan, Yellow
const color = colors[colorIndex];
```

**Transition:** Instant color swap every 2 seconds

#### 5. Selection Pulse (Sine Wave)

**Duration:** 1.57 seconds per cycle (π/2 for smooth pulse)
**Range:** Opacity 40-100%, Width 4-8px

```javascript
const pulsePhase = Math.sin(animationTime * 4) * 0.5 + 0.5;
const opacity = 0.4 + 0.6 * pulsePhase;
const width = 4 + pulsePhase * 4;
```

**Visual:** Gold border that breathes in and out

---

## RENDERING PIPELINE

### Initialization

```javascript
// 1. Create renderer instance
const renderer = new NailArtRenderer();

// 2. Initialize with canvas
const canvas = document.getElementById('nailArtCanvas');
const scale = canvas.width / 800;
renderer.initialize(canvas, scale);

// 3. Start animation loop
renderer.startAnimation();
```

### Frame Render Loop

```javascript
function renderFrame() {
    // 1. Update animation time
    renderer.animationTime += 0.016; // 16ms = 60 FPS

    // 2. Render complete scene
    renderer.renderScene(
        guardKey,           // 'jenkins', 'martinez', etc.
        decorationData,     // { leftHand: [...], rightHand: [...] }
        selectedNail        // { hand: 'left', index: 2 } or null
    );

    // 3. Request next frame
    requestAnimationFrame(renderFrame);
}
```

### Click Detection

```javascript
canvas.addEventListener('click', (event) => {
    // 1. Get canvas coordinates
    const coords = renderer.getCanvasCoordinates(event);

    // 2. Detect which nail was clicked
    const nail = renderer.detectNailClick(coords.x, coords.y, guardKey);

    // 3. Update selection
    if (nail) {
        selectedNail = nail; // { hand: 'left'|'right', index: 0-4 }
    }
});
```

### Mobile Touch Support

```javascript
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Prevent scroll

    const touch = event.touches[0];
    const coords = renderer.getCanvasCoordinates(touch);
    const nail = renderer.detectNailClick(coords.x, coords.y, guardKey);

    if (nail) selectedNail = nail;
}, { passive: false });
```

---

## CODE INTEGRATION EXAMPLES

### Example 1: Render Guard with Decorated Nails

```javascript
// Guard Martinez with fully decorated nails
const guardKey = 'martinez';
const decorationData = {
    leftHand: [
        {
            baseColor: '#ffffff',      // White base
            specialEffect: 'chrome',   // Chrome shimmer
            pattern: 'french',         // French tip
            stickers: [
                { type: 'star-gold', position: { x: 0, y: 0 }, size: 'small' }
            ],
            glitter: false
        },
        // ... 4 more nails
    ],
    rightHand: [
        // Mirror of left hand for symmetry
    ]
};

renderer.renderScene(guardKey, decorationData, null);
```

### Example 2: Apply Decoration to Selected Nail

```javascript
// User clicks "Classic Red" color button
function applyBaseColor(colorHex) {
    if (!selectedNail) {
        alert('Please select a nail first');
        return;
    }

    const hand = selectedNail.hand; // 'left' or 'right'
    const index = selectedNail.index; // 0-4

    decorationData[hand + 'Hand'][index].baseColor = colorHex;

    // Re-render scene
    renderer.renderScene(guardKey, decorationData, selectedNail);
}
```

### Example 3: Add Sparkle Effect

```javascript
// User clicks "Add Glitter" button
function toggleGlitter() {
    if (!selectedNail) return;

    const nail = decorationData[selectedNail.hand + 'Hand'][selectedNail.index];
    nail.glitter = !nail.glitter;

    renderer.renderScene(guardKey, decorationData, selectedNail);
}
```

---

## PERFORMANCE GUIDELINES

### Optimization Techniques

#### 1. Lazy Canvas Initialization

```javascript
// Only initialize when nail art system is accessed
if (!this.nailArtRenderer) {
    this.nailArtRenderer = new NailArtRenderer();
    this.nailArtRenderer.initialize(canvas, scale);
}
```

#### 2. Particle Caching

```javascript
// Cache sparkle positions per nail (don't regenerate every frame)
const cacheKey = `${guardKey}-${hand}-${index}`;
if (!particleCache.has(cacheKey)) {
    particleCache.set(cacheKey, generateParticles());
}
```

#### 3. Dirty Rectangle Rendering

```javascript
// Only re-render if decoration changed
if (decorationChanged) {
    renderer.renderScene(guardKey, decorationData, selectedNail);
    decorationChanged = false;
}
```

#### 4. Animation Frame Culling

```javascript
// Pause animation when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        renderer.stopAnimation();
    } else {
        renderer.startAnimation();
    }
});
```

### Performance Targets

**Desktop:**
- Render time: < 16ms per frame (60 FPS)
- Total canvas size: 800x600 (480,000 pixels)
- Max decorations: 50 stickers across all nails

**Mobile:**
- Render time: < 33ms per frame (30 FPS)
- Total canvas size: 400x300 (120,000 pixels, scaled)
- Max decorations: 30 stickers across all nails

### Memory Management

**Particle Cache Limit:** 100 entries (clear oldest when exceeded)
**Animation Frame Cleanup:** Always cancel on screen exit

```javascript
// Cleanup on screen close
function closeNailArtScreen() {
    renderer.stopAnimation();
    renderer.destroy();
    particleCache.clear();
}
```

---

## ACCESSIBILITY CONSIDERATIONS

### High Contrast Mode

```javascript
// Increase outline width and opacity for visibility
if (highContrastMode) {
    ctx.strokeStyle = '#000000'; // Black outline
    ctx.lineWidth = 3; // Thicker
    ctx.ellipse(0, 0, width * 0.5, height * 0.7, 0, 0, Math.PI * 2);
    ctx.stroke();
}
```

### Touch Target Size

**Minimum nail touch target:** 44x44 pixels (WCAG AAA standard)

```javascript
// Scale nails larger on mobile for touch accuracy
const nailSize = isMobile ? 60 : 50; // Pixels
```

### Color Blindness Support

**Alternative selection highlight colors:**
- Protanopia (red-blind): Use blue/yellow highlights
- Deuteranopia (green-blind): Use blue/orange highlights
- Tritanopia (blue-blind): Use red/green highlights

```javascript
// Configurable selection color
const selectionColors = {
    default: '#ffd700',     // Gold
    protanopia: '#0000ff',  // Blue
    deuteranopia: '#ff8c00', // Dark orange
    tritanopia: '#ff0000'   // Red
};
```

---

## CONCLUSION

This visual style guide provides complete specifications for rendering the Nail Art Decoration System. All graphics are code-generated, ensuring:

✅ **Zero external dependencies** (no image files required)
✅ **Infinite scalability** (vector-based rendering)
✅ **Consistent aesthetic** (procedural generation)
✅ **Mobile optimization** (responsive scaling)
✅ **Performance efficiency** (sub-16ms render times)

The system achieves a **dazzling, glamorous aesthetic** that perfectly contrasts the dystopian VROOM VROOM world, allowing players to create gorgeous nail art for prison guards.

**Integration:** Use in combination with:
- `/game/rendering/nail-art-renderer.js` - Core rendering engine
- `/game/rendering/nail-art-palette.js` - Color and decoration catalog
- `/game/rendering/nail-art-effects.js` - Animation and effects system

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-19
**Status:** Complete and Ready for Implementation
**Artist:** isometric-pixel-artist agent

*"In a dystopian world where driving is illegal, prisoners find freedom through fabulous pixel art nail designs. This is VROOM VROOM."* 💅✨
