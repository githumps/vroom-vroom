# COURTROOM LEVEL - COMPLETE SETUP GUIDE
## Courtroom.umap - Detailed Construction Specifications

---

## OVERVIEW

The Courtroom level is where players are taken after arrest. It features a basic courtroom with judge's desk, proper lighting, and the paperwork UI system.

**Location:** `Content/Maps/Courtroom.umap`

**Theme:** Serious courtroom atmosphere (which makes the absurd charges funnier)

---

## LEVEL CREATION STEPS

### Step 1: Create New Level

1. **File → New Level**
2. Select: **Empty Level** (for complete control)
3. Save As: `Courtroom.umap` in `Content/Maps/`

---

## GEOMETRY CONSTRUCTION

### Floor (Base Platform)

**Actor:** Static Mesh - Cube (or SM_Template_Cube)

**Transform:**
- Location: X=0, Y=0, Z=0
- Rotation: X=0, Y=0, Z=0
- Scale: X=20.0, Y=20.0, Z=0.2

**Material:**
- Assign: M_Wood_Floor_Walnut_01 (Engine Content)
- OR: M_Concrete_Tiles (if no wood available)
- Color: Dark brown/gray wood texture

**Collision:**
- Collision Preset: BlockAll
- Generate Overlap Events: FALSE

**Settings:**
- Mobility: Static
- Cast Shadow: TRUE
- Lightmap Resolution: 128

---

### Walls

#### Front Wall (Behind Player Start)

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=0, Y=1000, Z=250
- Rotation: X=0, Y=0, Z=0
- Scale: X=20.0, Y=0.4, Z=5.0

**Material:** M_Basic_Wall (or M_Concrete_Poured)
- Color: Light gray/beige

**Collision:** BlockAll

---

#### Back Wall (Behind Judge)

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=0, Y=-1000, Z=250
- Rotation: X=0, Y=0, Z=0
- Scale: X=20.0, Y=0.4, Z=5.0

**Material:** M_Basic_Wall
- Color: Same as front wall

**Collision:** BlockAll

---

#### Left Wall

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=-1000, Y=0, Z=250
- Rotation: X=0, Y=0, Z=0
- Scale: X=0.4, Y=20.0, Z=5.0

**Material:** M_Basic_Wall

**Collision:** BlockAll

---

#### Right Wall

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=1000, Y=0, Z=250
- Rotation: X=0, Y=0, Z=0
- Scale: X=0.4, Y=20.0, Z=5.0

**Material:** M_Basic_Wall

**Collision:** BlockAll

---

### Ceiling (Optional but Recommended)

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=0, Y=0, Z=500
- Rotation: X=0, Y=0, Z=0
- Scale: X=20.0, Y=20.0, Z=0.2

**Material:** M_Basic_Wall
- Color: Slightly darker than walls

**Collision:** BlockAll

**Settings:**
- Double-sided: TRUE (check in material)

---

## COURTROOM FURNITURE

### Judge's Desk (Main Platform)

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=0, Y=-600, Z=75
- Rotation: X=0, Y=0, Z=0
- Scale: X=4.0, Y=1.5, Z=1.5

**Material:** M_Wood_Oak
- Color: Dark mahogany/oak

**Collision:** BlockAll

**Details:**
- This is the centerpiece - make it prominent
- Add beveled edges if using custom mesh

---

### Judge's Desk - Front Panel

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=0, Y=-525, Z=50
- Rotation: X=15, Y=0, Z=0 (slight angle forward)
- Scale: X=4.0, Y=0.1, Z=1.2

**Material:** M_Wood_Oak (same as desk)

**Purpose:** Creates traditional courtroom desk look

---

### Judge's Chair

**Actor:** Static Mesh - Cube (simplified chair)

**Transform:**
- Location: X=0, Y=-700, Z=120
- Rotation: X=0, Y=0, Z=0
- Scale: X=1.0, Y=1.0, Z=2.0

**Material:** M_Leather_Chair (or dark fabric material)
- Color: Black or dark brown

---

### Witness Stand (Optional)

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=-400, Y=-300, Z=50
- Rotation: X=0, Y=45, Z=0
- Scale: X=1.5, Y=1.5, Z=1.0

**Material:** M_Wood_Oak

---

### Defendant's Table (Where Player "Sits")

**Actor:** Static Mesh - Cube

**Transform:**
- Location: X=0, Y=200, Z=50
- Rotation: X=0, Y=0, Z=0
- Scale: X=3.0, Y=1.0, Z=0.8

**Material:** M_Wood_Oak

**Note:** Position in front of PlayerStart

---

## DECORATIVE ELEMENTS (OPTIONAL)

### American Flag (or Generic Flag)

**Actor:** Static Mesh - Plane with flag texture

**Transform:**
- Location: X=-300, Y=-900, Z=200
- Rotation: X=0, Y=45, Z=0
- Scale: X=2.0, Y=3.0, Z=1.0

**Material:** Flag texture (if available)

---

### Courtroom Seal

**Actor:** Decal Actor

**Transform:**
- Location: X=0, Y=-995, Z=300 (on back wall)
- Rotation: X=0, Y=90, Z=0
- Scale: X=2.0, Y=2.0, Z=2.0

**Material:** Circular emblem/seal texture

---

### Wooden Benches (Gallery Seating)

**Actor:** Static Mesh - Cube (multiple instances)

**Positions:**
- Row 1: Y=500, Z=40, Scale X=8, Y=0.8, Z=0.8
- Row 2: Y=600, Z=40, Scale X=8, Y=0.8, Z=0.8
- Row 3: Y=700, Z=40, Scale X=8, Y=0.8, Z=0.8

**Material:** M_Wood_Oak

---

## LIGHTING SETUP

### Directional Light (Sun/Main Light)

**Actor:** Directional Light

**Transform:**
- Location: X=0, Y=0, Z=1000 (position doesn't matter for directional)
- Rotation: Pitch=-45, Yaw=-30, Roll=0

**Light Properties:**
- Intensity: 3.0 lux
- Light Color: (R:1.0, G:0.98, B:0.95) - Warm white
- Cast Shadows: TRUE
- Dynamic Shadow Distance: 20000
- Mobility: Stationary

**Settings:**
- Atmosphere Sun Light: TRUE (if sky atmosphere present)
- Used As Atmosphere Sun Light: TRUE

---

### Sky Light

**Actor:** Sky Light

**Transform:**
- Location: X=0, Y=0, Z=500

**Light Properties:**
- Intensity: 1.0
- Light Color: (R:0.9, G:0.95, B:1.0) - Cool blue tint
- Source Type: SLS Captured Scene
- Mobility: Stationary

**Settings:**
- Cast Shadows: TRUE
- Lower Hemisphere Is Solid Color: TRUE
- Lower Hemisphere Color: Dark gray (R:0.1, G:0.1, B:0.1)

---

### Spotlight - Judge Area (Left)

**Actor:** Spot Light

**Transform:**
- Location: X=-200, Y=-600, Z=400
- Rotation: Pitch=-60, Yaw=0, Roll=0

**Light Properties:**
- Intensity: 5000 lumens
- Light Color: White (R:1.0, G:1.0, B:1.0)
- Attenuation Radius: 1000
- Inner Cone Angle: 20 degrees
- Outer Cone Angle: 35 degrees
- Source Radius: 10.0
- Soft Source Radius: 20.0
- Source Length: 50.0

**Settings:**
- Cast Shadows: TRUE
- Mobility: Stationary
- Use Inverse Squared Falloff: TRUE

---

### Spotlight - Judge Area (Right)

**Actor:** Spot Light

**Transform:**
- Location: X=200, Y=-600, Z=400
- Rotation: Pitch=-60, Yaw=0, Roll=0

**Light Properties:**
- Same as left spotlight

**Purpose:** Creates dramatic lighting on judge's desk

---

### Spotlight - Defendant Area

**Actor:** Spot Light

**Transform:**
- Location: X=0, Y=300, Z=400
- Rotation: Pitch=-70, Yaw=180, Roll=0

**Light Properties:**
- Intensity: 3000 lumens
- Inner Cone Angle: 25 degrees
- Outer Cone Angle: 40 degrees
- Light Color: Slightly cool white (R:0.95, G:0.97, B:1.0)

**Purpose:** Illuminates player spawn area

---

### Point Lights - Ceiling (Ambient Lighting)

**Actor:** Point Light (4 instances)

**Positions:**
- Position 1: X=-500, Y=-500, Z=450
- Position 2: X=500, Y=-500, Z=450
- Position 3: X=-500, Y=500, Z=450
- Position 4: X=500, Y=500, Z=450

**Light Properties:**
- Intensity: 1000 lumens
- Attenuation Radius: 1500
- Light Color: Warm white (R:1.0, G:0.95, B:0.9)
- Source Radius: 50.0

**Settings:**
- Cast Shadows: FALSE (performance)
- Mobility: Stationary

---

## ATMOSPHERIC EFFECTS

### Sky Atmosphere

**Actor:** Sky Atmosphere

**Transform:**
- Location: X=0, Y=0, Z=0

**Properties:**
- Rayleigh Scattering: Default
- Mie Scattering: Default
- Absorption: Default

**Purpose:** Provides basic sky gradient (even if not visible)

---

### Exponential Height Fog (Optional)

**Actor:** Exponential Height Fog

**Transform:**
- Location: X=0, Y=0, Z=0

**Properties:**
- Fog Density: 0.02
- Fog Height Falloff: 0.2
- Fog Inscattering Color: Light gray (R:0.7, G:0.7, B:0.75)
- Directional Inscattering Exponent: 4.0
- Directional Inscattering Start Distance: 10000

**Purpose:** Adds subtle depth and atmosphere

---

### Post Process Volume

**Actor:** Post Process Volume

**Transform:**
- Location: X=0, Y=0, Z=250
- Scale: X=30, Y=30, Z=10 (cover entire room)

**Settings:**
- Infinite Extent (Unbound): TRUE

**Post Process Settings:**

**Exposure:**
- Metering Mode: Auto Exposure Histogram
- Min Brightness: 0.5
- Max Brightness: 2.0

**Color Grading:**
- Temperature: 6500 (neutral)
- Tint: 0 (no tint)
- Saturation: 1.0
- Contrast: 1.05 (slightly increased)

**Bloom:**
- Intensity: 0.5
- Threshold: 1.0

**Ambient Occlusion:**
- Intensity: 0.5
- Radius: 100.0

---

## PLAYER START

### PlayerStart Actor

**Actor:** Player Start

**Transform:**
- Location: X=0, Y=400, Z=100
- Rotation: Pitch=0, Yaw=0, Roll=0 (facing negative Y - toward judge)

**Settings:**
- Player Start Tag: "Default"
- Auto Receive Input: Player 0

**Purpose:** Where player spawns after arrest

**Visual Verification:**
- Place preview cylinder should face judge's desk
- Should be centered in defendant's area

---

## BP_CourtroomManager PLACEMENT

### Add to Level

**Actor:** BP_CourtroomManager (after creating the blueprint)

**Transform:**
- Location: X=0, Y=0, Z=100 (exact position doesn't matter)
- Rotation: X=0, Y=0, Z=0

**Settings:**
- Auto Activate: TRUE
- Begin Play Events Enabled: TRUE

**Purpose:** Manages UI spawning and courtroom logic

---

## LEVEL SETTINGS

### World Settings

**Open:** Settings → World Settings

**Lightmass Settings:**
- Force No Precomputed Lighting: FALSE (allow baking)
- Static Lighting Level Scale: 1.0
- Num Indirect Lighting Bounces: 3
- Indirect Lighting Quality: 1.0
- Indirect Lighting Smoothness: 1.0

**Lightmass Importance Volume:**
- Add to scene, scale to cover entire courtroom
- Location: X=0, Y=0, Z=250
- Scale: X=20, Y=20, Z=10

---

### Game Mode Override (IMPORTANT)

**World Settings → Game Mode:**
- Game Mode Override: Leave as default (or set to your game mode)
- Default Pawn Class: None (or your player character if needed)
- Player Controller Class: PlayerController

**Note:** Player doesn't need to drive in courtroom, so no vehicle pawn needed

---

## LIGHTING BUILD SETTINGS

### Lightmass Quality Settings

**Build → Lighting Quality:**
- For Preview: Preview quality
- For Final: Production quality

**Build → Build Lighting Only:**
- Click to bake static lighting

**Expected Build Time:**
- Preview: 2-5 minutes
- Production: 10-20 minutes

---

## COLLISION SETUP

### NavMesh (Not Needed)

Since player doesn't navigate in courtroom, NavMesh is unnecessary.

### Collision Volumes

**All walls, floor, furniture:**
- Collision Preset: BlockAll
- Collision Complexity: Use Simple Collision as Complex

---

## AUDIO (OPTIONAL)

### Ambient Sound

**Actor:** Ambient Sound

**Transform:**
- Location: X=0, Y=0, Z=250

**Sound Properties:**
- Sound: Courtroom_Ambience (air conditioning hum, if available)
- Volume Multiplier: 0.3
- Pitch Multiplier: 1.0
- Is UI Sound: FALSE

**Attenuation:**
- Allow Spatialization: FALSE (play everywhere)

---

### Sound on Level Load

**In BP_CourtroomManager Event BeginPlay:**
- Add "Play Sound 2D" node
- Sound: Gavel_Bang_Sound (if available)
- Volume: 1.0

---

## LEVEL STREAMING SETUP

### Add Level to Project

**Project Settings → Maps & Modes:**

1. Navigate to: Project Settings → Maps & Modes
2. Scroll to "Default Maps"
3. Verify Courtroom is added to build

**OR**

**Project Settings → Packaging:**
- Scroll to "List of maps to include in a packaged build"
- Add: /Game/Maps/Courtroom

---

## TESTING CHECKLIST

### Visual Tests:

1. [ ] Floor is solid and walkable (collision working)
2. [ ] Walls block player movement
3. [ ] Judge's desk is prominently visible
4. [ ] All lighting is visible (no pitch black areas)
5. [ ] No light leaks through geometry
6. [ ] Player spawns facing judge

### Functional Tests:

1. [ ] Level loads from "Open Level" node
2. [ ] BP_CourtroomManager spawns UI on begin play
3. [ ] Player input works (mouse visible, UI clickable)
4. [ ] Button in paperwork UI works
5. [ ] Can return to main menu or restart level

### Performance Tests:

1. [ ] Consistent 60+ FPS
2. [ ] No frame drops during level load
3. [ ] Lighting builds without errors
4. [ ] No texture streaming issues

---

## OPTIMIZATION NOTES

### For Better Performance:

1. **Use Lightmap Resolution:**
   - Floor: 64
   - Walls: 32
   - Furniture: 16

2. **Static Lighting:**
   - Set all lights to "Stationary" (not Movable)
   - Bake lighting before final build

3. **Material Optimization:**
   - Use simple materials (no complex shaders)
   - Minimize material instances

4. **Geometry:**
   - Use instanced static meshes for repeated objects
   - Keep poly count low (cubes are optimal)

---

## CONSTRUCTION TIME ESTIMATE

**Level Creation Breakdown:**

1. Create level and save: 2 minutes
2. Add floor and walls: 8 minutes
3. Add courtroom furniture: 10 minutes
4. Place and configure lighting: 15 minutes
5. Add PlayerStart and manager: 3 minutes
6. Configure level settings: 5 minutes
7. Build lighting: 5 minutes (preview)
8. Test functionality: 5 minutes

**Total Time: ~53 minutes**

---

## ALTERNATIVE: MINIMAL COURTROOM

If time is critical, create simplified version:

**Required Elements ONLY:**
1. Floor (1 cube)
2. Judge's desk (1 cube)
3. Directional Light
4. Sky Light
5. PlayerStart
6. BP_CourtroomManager

**Time: ~15 minutes**

---

## LEVEL POLISH (OPTIONAL ENHANCEMENTS)

### Add Later:

1. **Custom Meshes:**
   - Import actual courtroom furniture models
   - Add detailed judge's bench
   - Add gallery pews

2. **Better Materials:**
   - PBR wood materials with normal maps
   - Fabric materials for chairs
   - Marble or granite for judge's platform

3. **Additional Lighting:**
   - Window light sources
   - Ceiling light fixtures
   - Practical lights on desk

4. **Sound Design:**
   - Courtroom ambience loop
   - Gavel sound on level load
   - Paper rustle sounds for UI

5. **Visual Effects:**
   - Dust particles in light beams
   - Subtle camera shake on gavel sound
   - Depth of field on judge's desk

---

## TROUBLESHOOTING

### Issue: Level Won't Load

**Fix:**
- Verify level name matches exactly: "Courtroom"
- Check level is saved in Content/Maps
- Verify level is added to project settings
- Use "Open Level (by Object Reference)" instead of by name

### Issue: Pitch Black Level

**Fix:**
- Add Sky Light (essential for ambient lighting)
- Add Directional Light
- Build lighting (Build → Build Lighting Only)
- Check light mobility is not "Static" (use "Stationary")

### Issue: Player Spawns in Wrong Location

**Fix:**
- Check PlayerStart location and rotation
- Verify only one PlayerStart in level
- Check Game Mode Override settings

### Issue: UI Not Appearing

**Fix:**
- Verify BP_CourtroomManager is in level
- Check BeginPlay is firing (add print strings)
- Verify widget class reference is valid
- Check Add to Viewport is called

---

## COURTROOM READY FOR CONSTRUCTION

All specifications complete. Follow steps in order for best results.

Build geometry first, then lighting, then test functionality.

The courtroom is where justice happens. Make it look official so the absurd charges are even funnier.

ORDER IN THE COURT. BUILD THE LAW.
