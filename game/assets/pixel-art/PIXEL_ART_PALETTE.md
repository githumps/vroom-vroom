# VROOM VROOM - Pixel Art Color Palette
## Disco Elysium-Inspired Gritty Aesthetic

## Master Palette (Hex Codes)

### Core Colors (Prison/Dystopian)
```
BLACK_VOID:      #000000  // Deep shadows, night
DARK_GREY:       #1a1a1a  // Prison walls
MID_GREY:        #444444  // Concrete, metal
LIGHT_GREY:      #888888  // Highlights
DIRTY_WHITE:     #c0c0c0  // Worn surfaces

TERMINAL_GREEN:  #00ff00  // UI elements
DARK_GREEN:      #004400  // Shadows on green
NEON_GREEN:      #88ff88  // Highlights

BLOOD_RED:       #8b0000  // Infection, danger
RUST_RED:        #aa3333  // Rust, old metal
FLESH_PINK:      #d4a5a5  // Skin tones
```

### Tattoo Studio Palette
```
WARM_BULB:       #ffcc66  // Dim lighting
AMBER_GLOW:      #ff9933  // Warm shadows
DEEP_ORANGE:     #cc6600  // Deep warm tones

INK_BLACK:       #0d0d0d  // Tattoo ink
INK_BLUE:        #1a3366  // Blue-black ink
INK_GREEN:       #2d4d3d  // Green-black ink

WOOD_BROWN:      #4d3319  // Furniture
LEATHER_BROWN:   #5c3d2e  // Chair, upholstery
BRASS_GOLD:      #b8860b  // Equipment highlights
```

### Gang Colors

#### Safe Drivers (Lawful/Cautious)
```
SAFETY_YELLOW:   #ffcc00  // Primary emblem color
YIELD_ORANGE:    #ff8800  // Secondary
CAUTION_BLACK:   #222222  // Outline/text
REFLECTIVE:      #ffffaa  // Highlights
```

#### Turn Signals (Order/Precision)
```
SIGNAL_AMBER:    #ff9900  // Primary emblem color
INDICATOR_RED:   #ff3300  // Secondary (hazard)
CHROME_SILVER:   #a8a8a8  // Metallic accents
TECH_BLUE:       #3366cc  // Electronic glow
```

#### Road Warriors (Chaos/Speed)
```
WARRIOR_RED:     #cc0000  // Primary emblem color
FLAME_ORANGE:    #ff4400  // Secondary
EXHAUST_BLACK:   #1a1a1a  // Dark accents
CHROME_WHITE:    #e0e0e0  // Metal highlights
```

### Material Reference

#### Skin Tones (5 options)
```
SKIN_1_PALE:     #f5d5c3
SKIN_2_LIGHT:    #e8b89a
SKIN_3_MEDIUM:   #c68662
SKIN_4_TAN:      #a86e4a
SKIN_5_DARK:     #6d4c3d
```

#### Metals
```
STEEL_DARK:      #3d3d3d
STEEL_MID:       #6a6a6a
STEEL_LIGHT:     #9a9a9a
BRASS_DARK:      #8b7355
BRASS_MID:       #b8860b
BRASS_LIGHT:     #daa520
```

#### Wood/Furniture
```
WOOD_SHADOW:     #2a1810
WOOD_BASE:       #4d3319
WOOD_MID:        #6b4423
WOOD_LIGHT:      #8b5a2b
```

## Isometric Pixel Art Standards

### Grid Specifications
- **Tile Size:** 32x16 pixels (2:1 isometric ratio)
- **Character Height:** 48 pixels (3 tiles)
- **Building Height:** Variable (16px per floor)
- **Canvas Size:** Multiples of 16px

### Lighting Direction
- **Light Source:** Top-left (45° angle)
- **Shadow Direction:** Bottom-right
- **Ambient Occlusion:** Contact shadows at 30% opacity

### Outline Style
- **Width:** 1-2 pixels
- **Color:** 30% darker than base color
- **Anti-aliasing:** None (pure pixel art)

## Pixel Art Technical Specs

### Export Settings
- **Format:** PNG-24 (transparent background)
- **Resolution:** 1x (native pixel size)
- **Scaling:** Nearest-neighbor (no smoothing)
- **Color Profile:** sRGB

### Sprite Sheet Layout
- **Grid:** 16px or 32px cells
- **Padding:** 1px between sprites (prevent bleeding)
- **Animation Frames:** Left-to-right, top-to-bottom
- **Naming:** `character_action_frame##.png`

## Color Application Guidelines

### Tattoo Studio Scene
1. **Background:** Dark grey walls (#1a1a1a)
2. **Lighting:** Warm amber bulbs (#ffcc66) with orange glow
3. **Furniture:** Dark wood (#4d3319) with brass accents
4. **Atmosphere:** Moody, intimate, underground vibe
5. **Contrast:** High contrast between lit and shadow areas

### Gang Emblems
1. **Primary Color:** Bold, saturated (yellow/orange/red)
2. **Outlines:** Black (#000000) 2px weight
3. **Highlights:** 40% lighter than base color
4. **Shadows:** 40% darker than base color
5. **Background:** Transparent or solid black

### UI Elements
1. **Frame/Border:** Terminal green (#00ff00)
2. **Background:** Black void (#000000)
3. **Text:** Bright green (#88ff88)
4. **Hover State:** Pulsing glow effect
5. **Selected State:** Solid green background (20% opacity)

## Dithering Patterns

### 2x2 Checkerboard (50% blend)
```
█░
░█
```

### 4x4 Gradient (25% → 75%)
```
░░░░  →  ░░█░  →  ░█░█  →  █░█░  →  █████
░░░░     ░░░█     █░█░     ░█░█     ████
░░░░     ░░░░     ░█░█     █░█░     ████
░░░░     ░░░░     ░░░█     ░░█░     ████
```

### Atmospheric Haze (vertical gradient)
```
████████  (solid top)
███░███░
██░█░█░█
█░█░█░░░
░░░░░░░░  (fade to nothing)
```

## Style Reference Notes

### Disco Elysium Influence
- **Painterly Pixels:** Slightly loose, artistic edges
- **Limited Palette:** 16-32 colors per scene maximum
- **High Contrast:** Deep shadows, bright highlights
- **Expressive Characters:** Big silhouettes, readable features
- **Environmental Storytelling:** Details tell the world's story

### Isometric Prison Aesthetic
- **Industrial:** Exposed pipes, ventilation, harsh lighting
- **Worn:** Scratches, rust, age visible on all surfaces
- **Claustrophobic:** Tight spaces, low ceilings
- **Institutional:** Uniform, repetitive elements (cells, bars)
- **Underground Economy:** Contraband, makeshift modifications

## Animation Palette (Frame-by-Frame)

### Flickering Light (4 frames)
```
Frame 1: Base color (#ffcc66)
Frame 2: +10% brightness (#ffdb7f)
Frame 3: Base color (#ffcc66)
Frame 4: -10% brightness (#e6b85c)
```

### Tattoo Gun Vibration (2 frames)
```
Frame 1: Position (0, 0)
Frame 2: Position (1px, 0) + slight blur effect
```

### Character Breathing (4 frames)
```
Frame 1: Base height
Frame 2: +1px height (inhale)
Frame 3: +2px height (peak)
Frame 4: +1px height (exhale)
```

---

**Last Updated:** 2025-10-19
**Version:** 1.0.0
**Purpose:** Pixel art asset creation reference for VROOM VROOM
