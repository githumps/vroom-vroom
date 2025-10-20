# SIDESCROLLER PIXEL ART ASSETS

**VROOM VROOM - Dystopian Driving Game**
Gorgeous voxel/isometric pixel art for browser-based sidescroller driving scene

---

## 📦 ASSET FILES

All assets created with **Disco Elysium aesthetic** - muted, atmospheric, vibey, dystopian.

### 1. **car-sprites.js** - Vehicle Pixel Art
- 4 unique car models (isometric voxel style, 64x48px)
- 10 color variations per car (muted palette)
- Idle and driving animations
- Police car with flashing lights
- Rust, dents, dystopian wear details

**Cars:**
- **The Beater** - Wide sedan (burgundy/olive/slate/etc)
- **The Box** - Tall van (suspicious and boxy)
- **The Clunker** - Small hatchback (sounds terrible)
- **The Rust Bucket** - Pickup truck (more rust than metal)
- **Police Cruiser** - Menacing authority vehicle

**Features:**
- Pixel-perfect rendering (no anti-aliasing)
- 2:1 isometric projection
- Wheel rotation animations
- Wear overlays (rust spots, dents, dirt streaks)
- Shadow generation

---

### 2. **environment-tiles.js** - Road and Cityscape
- Isometric road tiles (straight, curves, intersections)
- Cracked asphalt with faded markings
- Dystopian background buildings
- Street furniture (lampposts, signs, hydrants, trash)
- Atmospheric effects system

**Road Tiles:**
- Straight horizontal (128x64px, tileable)
- Curves and turns
- 4-way intersections
- Worn, cracked texture
- Faded yellow/white line markings

**Buildings (Background Layers):**
- Apartment blocks (brutalist concrete)
- Factory smokestacks
- Street-level storefronts (closed/boarded)
- Parallax layering (0.2-1.0 speed)

**Street Furniture:**
- Lampposts (with day/night states)
- Road signs (bureaucratic messages)
- Fire hydrants
- Overflowing trash cans

**Atmosphere:**
- Dust particles (100 count, floating)
- Factory smoke plumes
- Light rays (oppressive god rays)
- Atmospheric haze layers
- Time-of-day lighting

---

### 3. **character-sprites.js** - Character Creation Art
- Full-body character sprite (64x96px)
- 6 skin tone variations (matching game)
- Prison orange jumpsuit
- Defeated/resigned posture
- Idle breathing animation

**Customization:**
- Height variations (short/average/tall)
- Skin tones (light/fair/medium/tan/brown/deep)
- Expression overlays (defeated/resigned/defiant/nervous)
- Hair styles (simple overlays)

**Style:**
- 3/4 isometric view
- Dystopian citizen aesthetic
- Muted, desaturated colors
- Pixel-perfect rendering

---

### 4. **effects.js** - Atmospheric Particle Systems
- Dust particles (ambient floating, kicked up by cars)
- Pollution/smog layers
- Light ray beams
- Motion blur trails
- Collision/impact effects
- Optional weather (rain, fog)

**Particle Systems:**

**Dust:**
- Ambient floating (80 particles, persistent)
- Kicked up by wheels (10/sec, 1.5s lifetime)
- Brake dust clouds (20 burst)

**Pollution:**
- Background smog (3 gradient layers)
- Factory smoke plumes (rising, dissipating)

**Light Effects:**
- God rays (5 beams, time-based, oppressive)
- Street lamp glow (evening/night only)

**Motion:**
- Car motion trails (speed-based)
- Speed lines (subtle, manga-inspired)
- Background parallax blur

**Impact:**
- Collision flash (0.15s white flash)
- Debris particles (20 count, physics-based)
- Screen shake (intensity scales with impact)

**Weather (Optional):**
- Rain (150 droplets, angled, splashing)
- Fog (dense, reduces visibility)

---

## 🎨 COLOR PALETTE

All assets use **Disco Elysium muted aesthetic**:

### Vehicle Colors (Desaturated)
- Burgundy, Olive, Slate, Ochre, Charcoal
- Rust, Teal, Mustard, Plum, Sage
- Police Blue/White

### Environment
- Asphalt: #2a2a2a - #4a4a4a
- Concrete: #4a4a4a - #6a6a6a
- Building brick: #5a3a2a - #6a4a3a
- Sky: #6a7a8a (oppressive)

### Atmospheric
- Dust: #a8a8a8 - #c8c8c8
- Smog: #7a7a7a - #b8b8b8
- Light rays: #ffe8c8 - #ffc8a8

### Characters
- 6 skin tones (light to deep)
- Prison orange: #ff8c42 - #b85d1a
- Hair: black/brown/blonde/red/gray

---

## 📐 TECHNICAL SPECS

### Projection
- **Isometric 2:1** (road, cars, environment)
- **Isometric 3/4** (characters)

### Sprite Sizes
- Cars: 64x48 pixels (base)
- Road tiles: 128x64 pixels
- Characters: 64x96 pixels
- Street furniture: varies (16x24 to 32x64)

### Performance
- Particle budget: 200 max
- Target framerate: 60 fps (animations at 8 fps)
- Canvas-based rendering
- No smooth curves (pixel-perfect)

### Animation Framerates
- Car idle: 2 frames @ 800ms
- Car driving: 4 frames @ 150ms
- Police lights: 4 frames @ 200ms
- Character breathing: 4 frames @ 800ms

---

## 🎮 INTEGRATION GUIDE

### Basic Usage

```javascript
// Import assets
import CarSprites from './car-sprites.js';
import EnvironmentTiles from './environment-tiles.js';
import CharacterSprites from './character-sprites.js';
import AtmosphericEffects from './effects.js';

// Render car
const beater = CarSprites.cars.beater;
const beaterColor = CarSprites.colorVariations.beater[0]; // burgundy

// Apply color and render
const renderedCar = CarSprites.rendering.applyColor(
    beater.idle.pixelData[0],
    beaterColor
);

// Add wear
CarSprites.rendering.applyWear(renderedCar, beater.wear);

// Render to canvas
context.drawImage(renderedCar, x, y);
```

### Particle System

```javascript
// Initialize particle system
AtmosphericEffects.particleSystem.initialize();

// Spawn dust when car moves
if (carSpeed > 0) {
    AtmosphericEffects.particleSystem.spawn(
        'dust.kicked_up',
        { x: carX - 20, y: carY + 40 },
        { speed: carSpeed }
    );
}

// Update and render
function gameLoop(deltaTime) {
    AtmosphericEffects.particleSystem.update(deltaTime);
    AtmosphericEffects.particleSystem.render(context, camera);
}
```

### Time-of-Day Lighting

```javascript
// Set time of day
const currentTime = 'evening'; // morning/noon/afternoon/evening/night

// Apply lighting
const lighting = EnvironmentTiles.lighting[currentTime];
skyColor = lighting.sky_color;
ambientColor = lighting.ambient;
lampState = lighting.lamp_state; // on/off

// Update street lamps
EnvironmentTiles.furniture.lamppost.states[lampState];
```

---

## 🎯 STYLE GUIDELINES

### Pixel Art Rules
1. **No anti-aliasing** - Crisp, sharp pixels only
2. **Limited palette** - Muted, desaturated Disco Elysium colors
3. **Consistent shading** - 3-level shading (highlight, mid, shadow)
4. **Isometric consistency** - All assets use 2:1 projection
5. **Atmospheric** - Vibey, moody, oppressive dystopian feel

### Color Philosophy
- **Muted, never vibrant** - Desaturated tones
- **Bureaucratic gray** - Concrete, asphalt dominance
- **Rust and decay** - Wear shows history
- **Pollution haze** - Atmosphere reduces contrast
- **No pure black/white** - Always slightly tinted

### Animation Philosophy
- **Economy of frames** - 2-4 frames for most animations
- **8 fps target** - Retro pixel art feel
- **Subtle motion** - Breathing, swaying, not frantic
- **Atmospheric** - Effects enhance mood, not distract

---

## 📁 FILE STRUCTURE

```
game/assets/sidescroller/
├── car-sprites.js           # 4 car models + police
├── environment-tiles.js     # Road tiles + buildings + furniture
├── character-sprites.js     # Character creation sprites
├── effects.js               # Particle systems + atmosphere
└── README.md                # This file
```

---

## 🚀 NEXT STEPS

### To Complete Integration:

1. **Create Renderer Class**
   - Canvas-based isometric renderer
   - Sprite sheet generator
   - Layer management (parallax)

2. **Implement Color System**
   - Palette swapping function
   - Shader-like color replacement
   - Dynamic recoloring

3. **Animation Controller**
   - Frame sequencing
   - Timing management
   - State transitions

4. **Particle Manager**
   - Object pooling
   - Update/render loop
   - Culling system

5. **Replace Three.js Scene**
   - Swap 3D driving with 2D sidescroller
   - Maintain game logic
   - Add parallax scrolling

---

## 🎨 ARTISTIC VISION

**Disco Elysium meets pixel art driving game**

### Mood
- Oppressive yet beautiful
- Bureaucratic dystopia
- Worn and decaying
- Atmospheric and vibey
- Darkly humorous

### Influences
- Disco Elysium (color palette, mood)
- Stardew Valley (pixel art warmth)
- Hyper Light Drifter (atmosphere)
- Papers Please (bureaucratic aesthetic)

### Visual Identity
Every pixel tells a story of a world where driving is illegal, cars are rusted relics, and the city crumbles under bureaucratic weight. The art is beautiful in its decay, vibey in its oppression, and absolutely gorgeous in its muted melancholy.

---

**Created by:** isometric-pixel-artist agent
**Date:** 2025-10-19
**Version:** 1.0.0
**For:** VROOM VROOM - Dystopian Driving Game
