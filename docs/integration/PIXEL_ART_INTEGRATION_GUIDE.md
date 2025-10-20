# VROOM VROOM - Isometric Pixel Art Integration Guide

## Overview

This guide explains how to replace the existing Three.js 3D renderer with the new isometric pixel art system. The pixel art renderer is a **drop-in replacement** that maintains the same world coordinate system and game logic while delivering gorgeous atmospheric pixel art visuals.

---

## What's Included

### Sprite Generators
- **car-sprite-generator.js** - 320 car sprites (4 models × 10 colors × 8 directions)
- **road-tile-generator.js** - Seamless isometric road tiles (straight, turns, intersections)
- **police-sprite-generator.js** - 40 police car sprites (8 directions × 5 animation frames)
- **environment-sprite-generator.js** - Buildings, trees, streetlights, effects
- **hud-generator.js** - Speedometer, radar, minimap (pixel art HUD)

### Core Renderer
- **isometric-renderer.js** - Main rendering engine (replaces Three.js)

### Tools
- **atlas-generator.html** - Web-based tool to generate all sprite atlases
- **isometric-pixel-art-style-guide.md** - Complete style reference

---

## Step 1: Generate Sprite Atlases

### Using the Atlas Generator Tool

1. **Open the generator:**
   ```bash
   cd /Users/ccqw/Developer/vroom-vroom/game/rendering/pixel-art
   # Open atlas-generator.html in a browser
   open atlas-generator.html
   ```

2. **Generate all atlases:**
   - Click "Generate All Atlases" button
   - Wait for all 5 atlases to generate (~30 seconds)
   - Progress bar will show completion

3. **Download assets:**
   - Click "Download All" to get:
     - `cars-atlas.png` + `cars-atlas.json`
     - `roads-atlas.png` + `roads-atlas.json`
     - `police-atlas.png` + `police-atlas.json`
     - `environment-atlas.png` + `environment-atlas.json`
     - `hud-atlas.png` + `hud-atlas.json`

4. **Place files in project:**
   ```
   /Users/ccqw/Developer/vroom-vroom/game/rendering/pixel-art/assets/
   ├── cars-atlas.png
   ├── cars-atlas.json
   ├── roads-atlas.png
   ├── roads-atlas.json
   ├── police-atlas.png
   ├── police-atlas.json
   ├── environment-atlas.png
   ├── environment-atlas.json
   ├── hud-atlas.png
   └── hud-atlas.json
   ```

---

## Step 2: Update index.html

### Replace Three.js Script Tag

**REMOVE:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

**ADD:**
```html
<!-- Isometric Pixel Art Renderer -->
<script src="rendering/pixel-art/isometric-renderer.js"></script>
```

### Add Pixel Art CSS (Optional)

Add to `<style>` section:
```css
#gameCanvas {
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    image-rendering: -moz-crisp-edges;
}
```

---

## Step 3: Update game.js - Initialization

### Find init() Method (Line ~700)

**REPLACE THIS SECTION:**
```javascript
// Setup Three.js
this.renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('gameCanvas'),
    antialias: true
});
this.renderer.setSize(window.innerWidth, window.innerHeight);
this.renderer.setClearColor(0x8B9DC3);

// Setup scene
this.scene = new THREE.Scene();
this.scene.fog = new THREE.Fog(0x8B9DC3, 30, 200);

// Setup ISOMETRIC camera
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 20;
this.camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
);
this.camera.position.set(20, 20, 20);
this.camera.lookAt(0, 0, 0);
```

**WITH THIS:**
```javascript
// Setup Isometric Pixel Art Renderer
this.renderer = new IsometricRenderer('gameCanvas');
this.renderer.setSize(window.innerWidth, window.innerHeight);
this.renderer.setClearColor('#8B9DC3'); // Disco Elysium sky blue

// Load sprite atlases
await this.loadPixelArtAssets();

// Setup camera (simplified - no Three.js camera needed)
this.camera = {
    followTarget: null, // Will be set to player car
    zoom: 1.0,
};
```

---

## Step 4: Add Asset Loading Method

**ADD THIS METHOD to VroomVroomGame class:**

```javascript
async loadPixelArtAssets() {
    console.log('[PixelArt] Loading sprite atlases...');

    const assetsPath = 'rendering/pixel-art/assets/';

    // Load all atlases
    await Promise.all([
        this.renderer.loadAtlas('cars', `${assetsPath}cars-atlas.png`, `${assetsPath}cars-atlas.json`),
        this.renderer.loadAtlas('roads', `${assetsPath}roads-atlas.png`, `${assetsPath}roads-atlas.json`),
        this.renderer.loadAtlas('police', `${assetsPath}police-atlas.png`, `${assetsPath}police-atlas.json`),
        this.renderer.loadAtlas('environment', `${assetsPath}environment-atlas.png`, `${assetsPath}environment-atlas.json`),
        this.renderer.loadAtlas('hud', `${assetsPath}hud-atlas.png`, `${assetsPath}hud-atlas.json`),
    ]);

    console.log('[PixelArt] All atlases loaded!');
}
```

---

## Step 5: Update createWorld() Method

### Find createWorld() (Line ~758)

**REPLACE all Three.js world creation with pixel art world:**

```javascript
createWorld() {
    console.log('[PixelArt] Creating isometric pixel art world...');

    // Store world data (for rendering each frame)
    this.world = {
        groundTiles: [],
        roadTiles: [],
        buildings: [],
        props: [],
    };

    // Create ground tiles (50×50 grid)
    for (let x = -25; x < 25; x++) {
        for (let y = -25; y < 25; y++) {
            this.world.groundTiles.push({
                x, y,
                type: 'groundDirt' // or 'groundGrass', 'groundConcrete'
            });
        }
    }

    // Create road tiles (main road through center)
    for (let i = -20; i < 20; i++) {
        this.world.roadTiles.push({
            x: i, y: 0,
            type: 'roadStraightEW'
        });
    }

    // Create buildings along road
    for (let i = -15; i < 15; i += 5) {
        // Left side
        this.world.buildings.push({
            x: i, y: -8,
            type: 'small',
            lit: Math.random() < 0.7
        });

        // Right side
        this.world.buildings.push({
            x: i, y: 8,
            type: 'small',
            lit: Math.random() < 0.7
        });
    }

    // Create props (trees, streetlights)
    for (let i = -18; i < 18; i += 6) {
        this.world.props.push({ x: i, y: -5, type: 'streetlightLit' });
        this.world.props.push({ x: i, y: 5, type: 'streetlightLit' });
        this.world.props.push({ x: i + 3, y: -10, type: 'tree' });
        this.world.props.push({ x: i + 3, y: 10, type: 'tree' });
    }

    console.log('[PixelArt] World created!');
}
```

---

## Step 6: Update createPlayerCar() Method

### Find createPlayerCar() (Line ~880)

**REPLACE Three.js car creation:**

```javascript
createPlayerCar() {
    // Store player car data
    this.car = {
        position: { x: 0, y: 0, z: 0 },
        rotation: 0, // Radians
        speed: 0,
        model: this.player.selectedCar.model || 'beater',
        color: this.player.selectedCar.color || 'red',
    };

    console.log(`[PixelArt] Player car created: ${this.car.model} (${this.car.color})`);
}
```

---

## Step 7: Update createPoliceCar() Method

### Find createPoliceCar() (Line ~945)

**REPLACE Three.js police car:**

```javascript
createPoliceCar() {
    this.policecar = {
        position: { x: -20, y: 10, z: 0 },
        rotation: 0,
        speed: 0,
        state: 'patrol', // 'patrol', 'chase', 'idle'
    };

    console.log('[PixelArt] Police car created');
}
```

---

## Step 8: Update Main Game Loop - render() Method

### Find render() method (Line ~4402)

**REPLACE:**
```javascript
this.renderer.render(this.scene, this.camera);
```

**WITH:**
```javascript
// Clear layers from previous frame
this.renderer.clearLayers();

// Add world to render layers
this.renderWorld();

// Add player car
if (this.car) {
    const direction = this.getCarDirection(this.car.rotation);
    this.renderer.addCar(
        this.car.position.x,
        this.car.position.y,
        this.car.model,
        this.car.color,
        direction,
        'vehicles'
    );
}

// Add police car
if (this.policecar && this.gameState === 'driving') {
    const direction = this.getCarDirection(this.policecar.rotation);
    this.renderer.addPolice(
        this.policecar.position.x,
        this.policecar.position.y,
        direction,
        'vehicles'
    );
}

// Add HUD elements
if (this.gameState === 'driving') {
    this.renderHUD();
}

// Update camera to follow player
if (this.car) {
    this.renderer.setCameraTarget(
        this.car.position.x * 32,
        this.car.position.y * 16
    );
}

// Render everything
this.renderer.render(null, null);
```

---

## Step 9: Add Helper Methods

**ADD THESE METHODS to VroomVroomGame class:**

```javascript
// Convert rotation (radians) to direction name (N, NE, E, etc.)
getCarDirection(rotation) {
    // Normalize rotation to 0-2π
    const normalized = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const degrees = normalized * (180 / Math.PI);

    // Map to 8 directions
    if (degrees >= 337.5 || degrees < 22.5) return 'E';
    if (degrees >= 22.5 && degrees < 67.5) return 'NE';
    if (degrees >= 67.5 && degrees < 112.5) return 'N';
    if (degrees >= 112.5 && degrees < 157.5) return 'NW';
    if (degrees >= 157.5 && degrees < 202.5) return 'W';
    if (degrees >= 202.5 && degrees < 247.5) return 'SW';
    if (degrees >= 247.5 && degrees < 292.5) return 'S';
    if (degrees >= 292.5 && degrees < 337.5) return 'SE';

    return 'E'; // Default
}

// Render world tiles and props
renderWorld() {
    // Render ground tiles
    for (const tile of this.world.groundTiles) {
        this.renderer.addRoadTile(tile.x, tile.y, tile.type, 'ground');
    }

    // Render road tiles
    for (const tile of this.world.roadTiles) {
        this.renderer.addRoadTile(tile.x, tile.y, tile.type, 'road');
    }

    // Render props (trees, streetlights)
    for (const prop of this.world.props) {
        this.renderer.addProp(prop.x, prop.y, prop.type, 'props');
    }

    // Render buildings
    for (const building of this.world.buildings) {
        this.renderer.addBuilding(building.x, building.y, building.type, building.lit, 'buildings');
    }
}

// Render HUD elements
renderHUD() {
    // Note: HUD elements are dynamically generated each frame
    // For now, we'll render them directly to canvas in the renderer
    // Future: Create HUDGenerator instance and update with game data
}
```

---

## Step 10: Update onResize() Method

### Find onResize() (Line ~1099)

**REPLACE:**
```javascript
this.renderer.setSize(window.innerWidth, window.innerHeight);
this.camera.aspect = window.innerWidth / window.innerHeight;
this.camera.updateProjectionMatrix();
```

**WITH:**
```javascript
this.renderer.setSize(window.innerWidth, window.innerHeight);
```

---

## Step 11: Remove Three.js References

**SEARCH AND REMOVE/REPLACE:**

1. **Remove Three.js lighting setup** (Lines ~744-756)
2. **Remove Three.js ground/road mesh creation** (Lines ~790-825)
3. **Remove Three.js building mesh creation** (Lines ~840-871)
4. **Remove scene.add() calls**

**These are no longer needed** - the pixel art renderer handles all rendering.

---

## Step 12: Test the Integration

### Checklist

1. **Start the game:**
   ```bash
   cd /Users/ccqw/Developer/vroom-vroom/game
   # Open index.html in browser
   ```

2. **Verify pixel art rendering:**
   - [ ] Ground tiles render correctly
   - [ ] Road tiles are seamless
   - [ ] Player car sprites show in correct direction
   - [ ] Police car appears with animated siren
   - [ ] Buildings and props render with proper depth sorting
   - [ ] Camera follows player smoothly

3. **Test car controls:**
   - [ ] WASD/Arrow keys move car
   - [ ] Car sprite changes direction when turning
   - [ ] Speed affects animation

4. **Test police chase:**
   - [ ] Police car renders with siren animation
   - [ ] Police follows player
   - [ ] Arrest triggers correctly

5. **Performance check:**
   - [ ] 60 FPS maintained
   - [ ] No rendering artifacts
   - [ ] Smooth camera movement

---

## Troubleshooting

### Issue: Atlases not loading

**Solution:**
- Check console for 404 errors
- Verify asset paths are correct
- Ensure atlas files are in `/game/rendering/pixel-art/assets/`

### Issue: Black screen / no rendering

**Solution:**
- Check browser console for errors
- Verify `IsometricRenderer` class is loaded
- Check that `loadPixelArtAssets()` completed successfully

### Issue: Sprites appear blurry

**Solution:**
- Ensure CSS has `image-rendering: pixelated`
- Check canvas context has `imageSmoothingEnabled = false`

### Issue: Poor performance / low FPS

**Solution:**
- Reduce world tile count
- Optimize frustum culling
- Reduce number of animated sprites on screen

---

## Advanced Customization

### Add New Car Model

1. Edit `car-sprite-generator.js`
2. Add model definition to `this.models`:
   ```javascript
   newModel: {
       name: 'The New Car',
       width: 40,
       height: 20,
       length: 70,
       bodyShape: 'sedan',
       windows: 4,
       roofHeight: 12,
   }
   ```
3. Regenerate car atlas

### Add New Road Tile Type

1. Edit `road-tile-generator.js`
2. Add method to `generateAllTiles()`:
   ```javascript
   roadSpecial: this.generateSpecialRoad()
   ```
3. Implement generation method
4. Regenerate road atlas

### Modify Color Palette

1. Edit `isometric-pixel-art-style-guide.md`
2. Update colors in all generator files
3. Regenerate all atlases

---

## Performance Optimization

### Recommended Settings

- **Max Ground Tiles:** 2500 (50×50 grid)
- **Max Road Tiles:** 200
- **Max Buildings:** 50
- **Max Props:** 100
- **Max Vehicles On Screen:** 10

### Optimization Techniques

1. **Frustum Culling** - Already implemented in renderer
2. **Sprite Batching** - Group draws by atlas
3. **Object Pooling** - Reuse entity objects
4. **LOD (Level of Detail)** - Show simpler sprites when zoomed out

---

## File Structure Summary

```
/game/rendering/pixel-art/
├── car-sprite-generator.js          # 320 car sprites
├── road-tile-generator.js           # Road tiles
├── police-sprite-generator.js       # Police cars
├── environment-sprite-generator.js  # Buildings, props, effects
├── hud-generator.js                 # HUD elements
├── isometric-renderer.js            # Main renderer
├── atlas-generator.html             # Tool to generate atlases
├── isometric-pixel-art-style-guide.md
└── assets/
    ├── cars-atlas.png
    ├── cars-atlas.json
    ├── roads-atlas.png
    ├── roads-atlas.json
    ├── police-atlas.png
    ├── police-atlas.json
    ├── environment-atlas.png
    ├── environment-atlas.json
    ├── hud-atlas.png
    └── hud-atlas.json
```

---

## Next Steps

1. **Generate all atlases** using atlas-generator.html
2. **Integrate renderer** following steps 1-11
3. **Test thoroughly** using checklist in Step 12
4. **Fine-tune visuals** (camera zoom, colors, animations)
5. **Optimize performance** if needed
6. **Add HUD elements** (speedometer, radar, minimap)
7. **Polish animations** (exhaust, dust, effects)

---

**Created:** 2025-10-19
**Artist:** Claude (isometric-pixel-artist agent)
**Version:** 1.0.0
**Status:** Ready for Integration

For questions or issues, refer to the style guide or check the generator source code.
