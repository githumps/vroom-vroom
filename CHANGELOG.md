# Changelog

All notable changes to VROOM VROOM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Development
- **Hospital/Clinic System** - Medical treatment for infected tattoos (designed, pending integration)
- **Conjugal Visit System** - Good behavior rewards with contraband mechanics (designed, pending integration)
- **Dev Mode & Debugging** - Comprehensive logging and API monitoring (files created, pending integration)
- **20 Random Prison Events** - Daily events for replayability (designed, pending integration)
- **Reputation System** - Guards, inmates, warden, legend tracking (designed, pending integration)

---

## [1.6.0] - 2025-10-19

### Added - NAIL ART DECORATION SYSTEM 💅✨

**The Most Glamorous Prison Update Ever Created**

Transform guard hands into dazzling works of isometric pixel art! A complete creative expression system that contrasts beautifully with the dystopian VROOM VROOM world.

#### **Isometric Pixel Art Rendering System**
- **Complete code-based graphics** - Zero external image dependencies
- **5 unique guard hand styles** with distinct personalities, skin tones, and nail shapes
  - **Guard Jenkins** (Masculine, rough) - Prefers red/black, matte, NO stickers
  - **Guard Martinez** (Delicate, perfectionist) - Loves white/gold, chrome, perfect symmetry
  - **Guard Chen** (Nervous, impatient) - Likes black/gray, matte, minimal decoration
  - **Guard Thompson** (Chatty, fun-loving) - Adores pastels, glossy, ALL THE STICKERS
  - **Guard Rodriguez** (Secretly glamorous) - Craves neon pink/gold, holographic, maximum dazzle
- **Isometric 3/4 top-down view** (26.565° angle, 2:1 pixel ratio)
- **10 individually rendered nails** per scene (5 per hand)
- **8-layer decoration rendering** (hand → nail → color → pattern → effect → stickers → glitter → selection)
- **Mobile-responsive** canvas scaling (800x600 → 400x300 for phones)

#### **40+ Decoration Options**
- **15 base colors** across 5 categories:
  - Classic: Hot pink, gold, red, white, black
  - Pastels: Lavender, light pink, pale green, peach, powder blue
  - Metallics: Rose gold
  - Glamour: Neon pink
  - Dystopian: Rust brown, olive, slate gray, steel blue, dark red
- **5 special effects**:
  - **Chrome** - Jewel beetle iridescent shimmer 🪲
  - **Holographic** - Rainbow sparkle with 360° hue rotation
  - **Iridescent** - Multi-color shimmer (3-color cycle)
  - **Matte** - Flat, non-reflective finish
  - **Glossy** - High-shine finish
- **3 patterns**:
  - Solid (single color)
  - French tip (classic white/colored tips)
  - Ombre (two-color gradient)
- **20 stickers & dazzles**:
  - Stars (gold, silver, sparkle, tiny, huge)
  - Hearts (red, pink, holo, tiny)
  - Gems (diamond, ruby, emerald, sapphire, crystal)
  - Shapes (circle, square, crescent)
  - Thematic (skull, lightning, flame)
- **Glitter toggle** - Animated sparkle overlay (12 particles, fade in/out)

#### **Advanced Animation System**
- **Sparkle/glitter particles** - 2-second fade cycle with randomized positions
- **Holographic color cycling** - 7.2-second full spectrum rotation
- **Chrome shimmer effect** - 3.14-second oscillating highlight
- **Iridescent multi-color** - 6-second 3-color cycle
- **Selection pulse animation** - 1.57-second gold border breathing
- **Performance optimized**: 60 FPS desktop, 30 FPS mobile

#### **Quality-Based Reward System**
- **Base reward**: 1 favor token (guaranteed completion)
- **+1 bonus**: All 10 nails decorated
- **+1 bonus**: 60%+ nails use guard's favorite colors
- **+1 bonus**: Guard-specific preference met
  - Jenkins: NO stickers (clean/simple)
  - Martinez: Perfect left/right symmetry
  - Chen: Completed in < 2 minutes (speed bonus)
  - Thompson: 15+ total stickers (maximum dazzle)
  - Rodriguez: 5+ nails with holographic + glitter (DOUBLE BONUS!)
- **Maximum**: 4 favor tokens per session
- **Diminishing returns**: 100% → 75% → 50% → 25% (prevents grinding)

#### **Persistent Guard Hand Saves**
- **guardHands player property** - Stores decorated designs per guard
- **Complete decoration data** - Base colors, effects, patterns, stickers, glitter
- **Session tracking** - Total decorations, tokens earned, last decorated date
- **24-hour cooldown** per guard (rotate between 5 guards)
- **Gallery view** - View all 5 guards' decorated hands with statistics
- **Referenced throughout game** - Guards mention their fabulous nails in dialogue

#### **UI/UX Enhancements**
- **3 new screens**:
  - Guard selection screen (5 guard buttons with stats)
  - Nail art canvas (full decoration interface with toolbar)
  - Gallery view (grid of all decorated hands)
- **Responsive toolbar** - Scrollable decoration palette (colors, effects, patterns, stickers)
- **Undo system** - 20-level undo stack for mistake correction
- **Clear functions** - Clear current nail or all nails
- **Visual feedback** - Selected nail highlighting, real-time preview
- **Prison menu integration** - 2 new buttons:
  - "💅 DECORATE GUARD NAILS (Advanced)" - Full decoration system
  - "💅 VIEW NAIL ART GALLERY" - View all decorated hands

### Technical Details

**New Files Created (7 files, ~3,100 lines, ~128 KB):**
- `game/rendering/nail-art-renderer.js` (1,012 lines, 32 KB) - Isometric hand rendering engine
- `game/rendering/nail-art-palette.js` (518 lines, 20 KB) - Color catalog and guard preferences
- `game/rendering/nail-art-effects.js` (521 lines, 17 KB) - Animation system (sparkle, chrome, holographic)
- `game/systems/nail-art-integration.js` (1,051 lines, 37 KB) - Game mechanics integration
- `docs/systems/NAIL_ART_DECORATION_SYSTEM.md` (95 KB) - Complete design specification
- `docs/integration/NAIL_ART_INTEGRATION_GUIDE.md` (35 KB) - Implementation guide
- `docs/systems/NAIL_ART_QUICK_REFERENCE.md` (9 KB) - Quick reference guide

**Modified Files:**
- `game/index.html`:
  - Added 3 new screens (guard selection, canvas, gallery) - 200 lines
  - Added 4 script tags for nail art system
  - Updated prison menu with 2 new buttons
- `game/core/game.js`:
  - Added `guardHands` to player object initialization
  - Added nail art system initialization in constructor
  - Auto-saves guardHands in save/load system

**Cost & Time Balance:**
- **Cost**: 20 credits (reasonable for advanced feature)
- **Time**: 45 minutes per session
- **Cooldown**: 24 hours per guard (5 guards = daily opportunities)
- **Max tokens/day**: ~10 (5 guards × 2 avg tokens)

### Changed
- **Basic manicure renamed** - "GIVE MANICURE TO GUARD (Basic)" to differentiate from advanced system
- **Prison menu layout** - Nail art buttons added between manicure and favors

### Design Philosophy
*"In a dystopian world where driving is illegal, prisoners find freedom through fabulous pixel art nail designs. Every nail is a masterpiece. Every guard a canvas. This is VROOM VROOM."*

The nail art system achieves the perfect balance of:
- **Depth without complexity** - 40+ options, intuitive interface
- **Persistence creates meaning** - Designs saved, referenced, admired
- **Personality creates connection** - 5 unique guards with distinct preferences
- **Visual delight** - Gorgeous pixel art contrasts with bleak prison world
- **Balanced rewards** - Fair favor token economy, no exploitation

### Collaboration Credit
- **Isometric pixel art system**: isometric-pixel-artist agent
- **Game mechanics design**: game-dev-specialist agent
- **Integration & implementation**: Claude Code

---

## [1.4.3] - 2025-10-19

### Added
- **Comprehensive Debug Menu Overhaul** - Professional-grade development tools
  - **6 Categorized Sections**: Core Gameplay, Prison Activities, Social Systems, Special Systems, Save System
  - **7 New System Jump-To Shortcuts**: Manicure, Letter, Cellmate, Favors, Character Creation, Save Export/Import
  - **15 New Debug Functions**: Complete player stat manipulation and testing utilities

- **Resource & Currency Tools**
  - `testAddGoodBehavior(amount)` - Add/manage good behavior points (0-100)
  - `testAddFavorTokens(amount)` - Add favor tokens for guard manicure system

- **Physical Stats Tools**
  - `testSetStrength(value)` - Set strength stat (0-100)
  - `testSetIntelligence(value)` - Set intelligence stat (0-100)
  - `testSetHunger(value)` - Set hunger stat (0-100)
  - `testMaxAllStats()` - Instantly max all physical stats

- **Time Control Tools**
  - `testAddDays(days)` - Add days to prison time served
  - `testSkipDays(days)` - Skip forward in time
  - `testReduceSentence(years)` - Reduce prison sentence
  - `testSetSentence(years)` - Set custom sentence length

- **Special Testing Tools**
  - `testInfectTattoo()` - Force random tattoo infection (for clinic testing)
  - `testShowStats()` - View complete player stats in console and alert
  - `testAddContraband()` - Add random contraband items
  - `testVoicePreviews()` - Preview all 4 voice types sequentially
  - `testApiKey()` - Test Gemini API key connection and functionality

- **Grid Layout** - Responsive CSS grid for better organization on all screen sizes

### Changed
- **Testing Menu Organization** - Reorganized from flat list to 6 categorized sections
- **Debug Tools Layout** - Grouped into 5 themed sections (Resources, Stats, Time, Special, System)
- **testJumpTo() Function** - Added 7 new cases: manicure, letter, cellmate, favors, character, saveExport, saveImport
- **Menu Max Width** - Increased from 900px to 1200px for better desktop experience

### Technical
- Updated `game/index.html`:
  - Reorganized testing menu HTML with categorical sections (177 lines)
  - Added grid layouts for responsive design
  - Added color-coded section headers (yellow for systems, green for tools, red for system controls)
  - Total testing menu: ~175 lines (was ~70 lines)
- Updated `game/core/game.js`:
  - Added 15 new test helper functions (217 lines)
  - Enhanced `testJumpTo()` with 7 new cases (28 lines)
  - Total testing methods: ~345 lines (was ~128 lines)
- **Coverage Improvement**: Testing menu now covers ~95% of game systems (was ~60%)

---

## [1.4.2] - 2025-10-15

### Fixed
- **Mobile Modal Visibility Improvements** - Comprehensive modal accessibility fixes
  - Added `max-height: 85vh` and `overflow-y: auto` to tablet breakpoint (768px)
  - Added `-webkit-overflow-scrolling: touch` for smooth iOS scrolling
  - Added `overflow-y: auto` to base `.modal` class for keyboard handling
  - Added `margin: 20px` to `.modal-content` for safe spacing
  - Added landscape/short viewport media query (`max-height: 600px`)
    - Optimized modal spacing when keyboard is open
    - Reduced padding and margins for tight spaces
    - Scaled down font sizes (title: 1.3em, text: 0.9em)
  - Enhanced viewport meta tag with `maximum-scale=1.0`, `user-scalable=no`, `viewport-fit=cover`
  - Added iOS web app capability meta tags
  - Added iOS safe area insets to body element
    - `padding-top: env(safe-area-inset-top)`
    - `padding-bottom: env(safe-area-inset-bottom)`
    - `padding-left: env(safe-area-inset-left)`
    - `padding-right: env(safe-area-inset-right)`

### Technical
- Updated `index.html` mobile CSS:
  - Modified tablet breakpoint (768px) modal styles (5 lines)
  - Modified base modal class (2 lines)
  - Modified base modal-content class (1 line)
  - Added landscape/short viewport breakpoint (23 lines)
  - Updated viewport meta tag (1 line)
  - Added 2 web app meta tags
  - Updated body CSS with safe area support (4 lines)
- All modals now properly scrollable on mobile devices
- Settings modal, save code modals, API key modal all tested and working
- Keyboard appearance no longer hides modal content
- Proper support for iOS notches and home indicators

---

## [1.4.1] - 2025-10-14

### Fixed
- **Mobile Modal Visibility** - Critical mobile UX improvements
  - Added comprehensive mobile styles for 480px breakpoint (phones)
  - Fixed modal content sizing: 95% max-width, 90vh max-height on phones
  - Reduced modal padding to 15px on phones (from 40px desktop)
  - Scaled modal titles to 1.5em on phones (from 2em)
  - Scaled modal text to 0.95em on phones (from 1.1em)
  - Fixed modal buttons: 0.9em font, proper padding for touch
  - Added scrollable overflow to modals and screens
  - Fixed `.screen.active` centering on mobile (flex-start instead of center)
  - Added smooth scrolling with `-webkit-overflow-scrolling: touch`
- **Visual Manicure Canvas Mobile Support**
  - Made canvas responsive: max 400px on mobile, scales to viewport
  - Implemented scale factor system (canvas adapts 800px → device width)
  - Scaled all hand/nail coordinates proportionally
  - Scaled text sizes (title, instructions) based on canvas width
  - Shortened instruction text on very small screens
  - Fixed click detection with proper canvas scaling
  - Palm positions scale correctly
- **All Game Screens Mobile Optimized**
  - Prison activity cards: reduced padding to 12px on phones
  - Exploit buttons: reduced padding to 15px on phones
  - Form containers: reduced padding to 15px on phones
  - HUD stats: reduced to 0.9em font, 5px padding on phones
  - All screens: max-height 100vh with auto overflow

### Technical
- Updated `index.html` mobile CSS (480px breakpoint):
  - Added 13 new mobile-specific style rules
  - Total mobile CSS: ~85 lines for phone optimization
- Updated `guard-manicure-visual.js`:
  - Added responsive canvas sizing logic
  - Implemented `this.scale` factor for coordinate scaling
  - Updated `startManicure()`, `generateHands()`, `render()`, `drawHand()`, `handleClick()`
  - 67 lines changed (+40 insertions, -27 deletions)

---

## [1.4.0] - 2025-10-14

### Added
- **Visual Guard Manicure Mini-Game** - Canvas-based interactive nail cleaning
  - Top-down view of guard's hands with realistic rendering
  - 10 individual nails to clean (5 per hand)
  - Click on dirt spots to clean each nail (3 spots per nail)
  - Risk mechanic: Clicking on skin hurts the guard
  - Guard wincing animation with screen shake effect
  - 3 strikes system: 3 mistakes = guard injured
  - 5 guards with unique personalities and nervousness levels
  - Guard skin tone and nail color variation
  - Sparkle effect on cleaned nails
  - Real-time stats tracking (nails cleaned, mistakes)
- **Clinic Exploitation System** - Exploit injured guards on pain meds
  - Injured guards sent to medical bay (heavily medicated)
  - 4 exploitation options with risk/reward mechanics:
    - Steal Keys (70% risk) = Master key (opens any door)
    - Get Future Favor (30% risk) = +2 favor tokens
    - Extract Intel (50% risk) = +20% escape success rate
    - Show Mercy (0% risk) = +10 good behavior
  - Success/failure outcomes with consequences
  - Failed exploitation = -15 good behavior
  - Narrative consequences for each choice
- **Unit Test Suite** - Comprehensive automated testing
  - Custom TestRunner class with assertion methods
  - 12 test suites covering all game systems:
    - Core Game State, Save/Load, Prison Economy, Good Behavior
    - Tattoo System, Gang System, Contraband, Favor Tokens
    - Stats/Progression, Escape System, Time System, Character Creation
  - 60+ individual tests
  - MockGame class for browser-independent testing
  - Exit codes for CI/CD integration
  - Run with: `node test-suite.js`

### Fixed
- **Favor Token Spending Bug** - Critical integration issue resolved
  - Added `spendFavorToken()` method to game.js (was missing)
  - Added `showGuardFavorsMenu()` method to game.js
  - Integrated favor token properties into player object
  - Added manicure activity handler to `prisonActivity()` method
  - Favor tokens now properly deduct when spending
  - All 5 favor token benefits now functional:
    - Ignore violation (1 token)
    - Smuggle cigarettes (2 tokens)
    - Get contraband (3 tokens)
    - Escape assistance (3 tokens)
    - Reduce sentence by 7 days (4 tokens)

### Changed
- Guard manicure system upgraded from text-based to visual canvas game
- Manicure mini-game now uses VisualManicureSystem class
- Enhanced manicure with injury mechanics and clinic integration

### Technical
- Added `guard-manicure-visual.js` (670 lines) - VisualManicureSystem class:
  - Canvas-based rendering with requestAnimationFrame loop
  - Hand/finger/nail geometry generation
  - Click detection with coordinate transformation
  - Dirt spot generation and tracking
  - Guard injury mechanics with animation
  - Clinic exploitation mini-game
- Added `test-suite.js` (500+ lines) - Comprehensive test framework:
  - TestRunner class with 8 assertion methods
  - MockGame class for testing
  - 12 test suites with 60+ tests
- Updated game.js:
  - Added favor token properties to player object (favorTokens, guardManicures, guardFavors, goodBehavior)
  - Added `initManicureSystem()` method
  - Added `spendFavorToken(type)` method (~105 lines)
  - Added `showGuardFavorsMenu()` method
  - Added manicure case to `prisonActivity()` method
  - Changed manicure system to use VisualManicureSystem
- Updated index.html:
  - Added visualManicure screen with canvas and stats display
  - Added clinicExploit screen with dynamic option generation
  - Added CSS for exploit-button class with hover effects
  - Added script tag for guard-manicure-visual.js
- Total new code: ~1,300 lines

### Documentation
- Updated SYSTEMS.md to v1.4.0
- Updated Guard Manicure section with visual mini-game details
- Added clinic exploitation mechanics documentation
- Added test-suite.js to file organization
- Updated version references (1.3.0 → 1.4.0)

---

## [1.3.0] - 2025-10-14

### Added
- **Mobile Browser Support** - Full touch controls for mobile devices
  - Touch-based driving controls (left, right, accelerate)
  - Stop driving button for mobile users
  - Automatic mobile device detection
  - Responsive UI layout for tablets and phones
  - Touch-friendly button sizes (min 48px)
  - iOS-specific optimizations (16px input font to prevent zoom)
- **Tattoo Body Placement System** - Choose where tattoos appear on your body
  - 9 body placement locations: Left Arm, Right Arm, Chest, Back, Left Shoulder, Right Shoulder, Neck, Left Hand, Right Hand
  - Enhanced tattoo workflow: Design → Stencil → Ink → **Placement** → Care
  - Body part selection UI with descriptions and flavors
  - Placement stored permanently with each tattoo
  - Tattoo collection display shows placement location
  - Each body part has unique descriptive text
- **Save Code Export/Import System** - Portable game state management
  - Generate Base64-encoded save codes from game state
  - Export save codes via modal with copy-to-clipboard functionality
  - Import save codes from any device/browser
  - Session-independent save code system (works across devices)
  - Main menu buttons for export/import access
  - Automatic state restoration (prison/driving) on import
  - Version tracking in save codes
  - Invalid code detection and error handling
  - Privacy notices and usage instructions in UI
  - Overwrite warnings before import

### Technical
- Added `isMobile()` detection method to Game class
- Added `initMobileTouchControls()` method with touch event listeners
- Mobile controls show/hide automatically in driving mode
- CSS media queries for 768px (tablet) and 480px (phone) breakpoints
- Touch controls use semi-transparent green aesthetic matching game theme
- Viewport meta tag already present for proper mobile scaling
- Total mobile code: ~100 lines of JavaScript, ~140 lines of CSS
- Modified `tattoo-system.js` with body placement features (~120 lines):
  - Added `bodyParts` object with 9 body locations and descriptions
  - Added `selectBodyPlacement()` method - Shows placement selection UI
  - Added `choosePlacement()` method - Handles body part selection
  - Modified `applyInk()`, `completeTattoo()`, `displayTattooCollection()`, `resetForNewTattoo()`
  - Added `placementSelected` and `selectedPlacement` state tracking
  - Dynamic body part button generation from `bodyParts` object
- Added 6 save code methods to game.js (~110 lines):
  - `generateSaveCode()` - Base64 encodes player state to portable string
  - `importSaveCode(code)` - Decodes and validates save code, restores state
  - `exportSaveCode()` - Generates code and displays export modal
  - `showSaveCodeModal(code)` - Renders save code with copy functionality
  - `showImportModal()` - Shows import dialog with paste area
  - `importFromModal()` - Handles import button click with validation
- Added save code UI to index.html (~80 lines):
  - Two modal dialogs (export and import) with green terminal aesthetic
  - Copy-to-clipboard button using Clipboard API
  - Main menu buttons for export/import access
  - Privacy notices and overwrite warnings
- Save code format: `{v: VERSION, p: player}` encoded as Base64 URI string
- Total new code: ~310 lines (tattoo placement + save codes)
- Reorganized all documentation:
  - Created `SYSTEMS.md` master reference (1000+ lines) documenting all game systems
  - Created `docs/systems/` directory for system reference documentation (13 files)
  - Created `docs/integration/` directory for integration guides (9 files)
  - Moved all scattered .md files to organized structure
  - Cleaned up 15+ obsolete documentation files
  - Updated `claude.md` with mandatory development workflow
  - Added structured workflow: Pre-Task Check → Execute → Document → Test → Code Quality → Git Commit
- Game-dev-specialist agents created 5 complete system designs:
  - Hospital/Clinic System (complete specs, ready for integration)
  - Conjugal Visit System (complete specs, ready for integration)
  - Guard Manicure System (complete specs, ready for integration)
  - Dev Mode System (files created: debug-logger.js, api-monitor.js, dev-mode.js, dev-mode.css)
  - Prison System Comprehensive Review (20 random events designed, balance analysis)

### Documentation
- **New Master Documentation:** SYSTEMS.md (comprehensive overview of all systems)
- **System References (docs/systems/):**
  - SAVE_CODE_SYSTEM.md, TATTOO_PLACEMENT.md, CAR_MODELS_REFERENCE.md
  - TIME_SYSTEM_README.md, API_VERIFICATION_REPORT.md
  - DEBUG_REFERENCE.md, LOGGING_EXAMPLES.md
  - DEV_MODE_SUMMARY.md, DEV_MODE_QUICK_REFERENCE.md
  - PRISON_SYSTEM.md, PRISON_REVIEW_EXECUTIVE_SUMMARY.md
  - CAR_SELECTION_SUMMARY.md, GUARD_MANICURE_SYSTEM_SUMMARY.md
- **Integration Guides (docs/integration/):**
  - TATTOO_SYSTEM_INTEGRATION.md, GANG_SYSTEM_INTEGRATION_GUIDE.md
  - ESCAPE_SYSTEM_INTEGRATION.md, CAR_SELECTION_INTEGRATION.md
  - DEV_MODE_INTEGRATION.md, GUARD_MANICURE_IMPLEMENTATION.md
  - PRISON_ENHANCEMENTS_IMPLEMENTATION.md, CAR_SELECTION_CODE_SNIPPETS.md
  - INTEGRATION_STEPS.md

## [1.2.0] - 2025-10-13

### Added
- **Car Selection System** - Choose your criminal ride during character creation
  - 4 distinct car models with unique silhouettes:
    - The Beater: Wide, low sedan (beat-up and barely functional)
    - The Box: Tall, square van (utilitarian prison transport vibes)
    - The Clunker: Small, round hatchback (economical failure)
    - The Rust Bucket: Pickup truck with exposed bed (working-class despair)
  - 10 muted Disco Elysium-inspired colors:
    - Rust Brown, Military Green, Dull Grey, Faded Blue, Primer Grey
    - Oxidized Red, Muddy Yellow, Sick Green, Asphalt Black, Dinge White
  - Real-time 3D rotating preview (400x400 canvas)
  - Painterly depth via color variation
  - Isometric camera angle with slow rotation (0.005 rad/frame)
  - Dynamic flavor text for each car/color combination
  - Selected car appears in driving mode
  - Save/load compatible
- **Voice Preview System** - Hear your character's voice before gameplay
  - 4 distinct voice personalities with unique audio characteristics:
    - Deep and Resigned: Low frequency (120Hz), descending tone, triangle wave
    - High and Anxious: High frequency (280Hz), rapid vibrato (8Hz), wavering pitch
    - Monotone Bureaucrat: Mid frequency (190Hz), flat pitch, square wave
    - Disturbingly Enthusiastic: Mid-high frequency (220Hz), ascending tone, moderate vibrato (5Hz)
  - Web Audio API oscillator-based synthesis
  - ADSR envelopes for realistic attack/decay
  - Bandpass filtering (400-1200Hz) for voice-like quality
  - LFO-based vibrato for anxious/enthusiastic voices
  - Preview button in character creation screen
  - Voices used for Judge Hardcastle sentencing encounters
- **Enhanced Character Creation**
  - Integrated car selection into character creation flow
  - Visual car preview updates in real-time
  - Selected state highlighting for UI elements
  - Comprehensive car and color descriptions

### Changed
- **Gemini API Migration** - Updated AI model for better performance
  - Migrated from `gemini-pro` to `gemma-3-27b-it` model
  - Free tier increased to 14,000 requests/day
  - Updated API endpoints and documentation
  - Improved AI-generated charge quality
- Car creation now uses selected model and color from character creation
- Character creation screen now features multiple preview systems

### Fixed
- API endpoint compatibility with latest Gemini/Gemma models

### Technical
- Added `car-selection.js` (331 lines) with 3 core classes:
  - `CarGeometry` class - Defines 4 car models with box-based geometry (~200 triangles per car)
  - `CarPreviewRenderer` class - Three.js 3D preview with auto-rotation and cleanup
  - `ColorPalette` class - 10 muted color definitions with hex values and descriptions
- Added 4 new car selection methods to game.js (~90 lines):
  - `selectCarModel()` - Handle model selection and UI updates
  - `selectCarColor()` - Handle color selection and UI updates
  - `updateCarPreview()` - Update 3D preview renderer
  - `initializeCarPreview()` - Setup preview on character creation screen load
- Updated `createCar()` method to use selected car geometry
- Added `createCarFallback()` method for robust error handling
- Added `this.carPreview` property to Game class
- Added `selectedCar` property to player object: `{model: 'beater', color: 0x8B7355}`
- Enhanced `soundsystem.js` with voice preview method (156 lines)
  - 4 voice configuration objects with frequency, waveform, and envelope settings
  - Oscillator node creation and audio graph routing
  - Filter node for voice-like quality
  - LFO implementation for vibrato effects
- Updated character creation HTML with:
  - Car selection UI (166 lines): 4 model buttons, 10 color swatches, 400x400 preview canvas
  - CSS for selected states and hover effects
  - Voice preview button integration
- Performance: ~200 triangles per car, 60fps preview, <5MB memory footprint
- Total new code: ~650 lines
- Documentation: 6 new reference files (CAR_SELECTION_*.md, VOICE_PREVIEW_INTEGRATION.md)

## [1.1.0] - 2025-10-13

### Added
- **Testing/Debug Menu** - Hidden developer tools for system testing
  - "TEST" cheat code on main menu unlocks testing menu
  - 10 system shortcuts: Tattoo, Gang, Escape, Weights, Eating, Library, Commissary, Cellmate, Letter, Driving
  - Direct access to any game system without normal progression
  - Auto-initialization of test player with resources (100 credits, 20 cigarettes)
  - 4 debug tools: Add Credits, Add Cigarettes, Max Gang Rep, Reset Progress
- Improved developer experience for testing and debugging

### Changed
- Enhanced testability of all prison systems
- All major game systems now accessible for isolated testing

### Technical
- Added `initCheatCodeListener()` method for keyboard input monitoring
- Added `testJumpTo()` method with 10 system shortcuts
- Added 4 debug helper methods: `testAddMoney()`, `testAddCigarettes()`, `testMaxGangRep()`, `testResetProgress()`
- Added testing menu HTML screen (~70 lines)
- Total new code: ~150 lines

## [1.0.0] - 2025-10-13

### Added
- **Tattoo Drawing System** - Complete canvas-based tattoo designer
  - 10x10 grid drawing interface
  - Multi-stage process: Design → Stencil → Apply Ink → Care
  - 25% infection risk based on care performance
  - ASCII art preview generation
  - Permanent tattoo collection
  - Cost: 10 commissary credits
- **Gang Alliance System** - Social dynamics and reputation
  - 3 gangs: Safe Drivers Club, Turn Signals, Road Warriors
  - Reputation range: -100 (hostile) to +100 (allied)
  - 4 interaction types: Talk, Share Cigarettes, Trade, Join Gang
  - Cigarette-based economy
  - Enemy/ally dynamics between gangs
  - +10% escape bonus for gang members
  - Random gang events during prison activities
  - Gang-specific cellmate dialogue
- **Escape Planning System** - Four routes to freedom
  - Tunnel Escape (30% base success, +10 years if caught)
  - Bribe a Guard (45% base success, +12 years if caught)
  - Manipulate Transfer (55% base success, +15 years if caught)
  - Incite a Riot (40% base success, +20 years if caught)
  - Multi-step preparation for each route
  - Success rate increases with preparation (+20% max)
  - Gang membership bonus (+10%)
  - Successful escape returns player to driving world
- Version number display on main menu (v1.0.0)

### Changed
- Prison system now includes 8 complete activities
- Enhanced save/load system to support gang and escape progress
- Improved documentation with comprehensive system descriptions

### Technical
- Added `tattoo-system.js` (280 lines) - TattooSystem class
- Added 15 gang system methods to game.js (~330 lines)
- Added 6 escape system methods to game.js (~305 lines)
- Added 5 new HTML screens for new systems
- Total new gameplay code: ~1,200 lines

## [0.3.0] - 2025-10-13

### Added
- **Web Audio API Sound System**
  - Police siren with alternating tones (800Hz/600Hz)
  - Handcuff click sound on arrest
  - Cop mumbling (Sims-style gibberish, 8 syllables)
  - Gavel strike in courtroom (deep thud with impact noise)
  - Prison door clang (metallic resonance)
  - Volume controls (0-100%) in settings
  - Mute toggle in settings
  - Sound preferences saved to localStorage
- **Gemini Pro API Integration**
  - Optional AI-generated court charges
  - API key management system
  - Session-based key storage (secure, cleared on browser close)
  - First-load modal for API key setup
  - Settings screen API key management
  - Test API key functionality
  - Graceful fallback to hardcoded charges
  - Free tier: 14,000 requests/day

### Fixed
- Car orientation (was facing backwards)
- Inverted steering controls (A/D keys now correct)
- Event listener memory leaks
- Cinematic system error handling

### Technical
- Added `soundsystem.js` (291 lines) - Complete Web Audio API implementation
- Added ApiKeyManager class to game.js (144 lines)
- Integrated sound triggers at key game events

## [0.2.0] - 2025-10-12

### Added
- **Disco Elysium Art Style**
  - Muted color palette (greys, muted greens)
  - Isometric camera angle
  - Painterly aesthetic
- **Cinematic System**
  - Ken Burns-style camera movements
  - Arrest cinematic with zoom and fade
  - Judgment cinematic with gavel close-up
  - Prison cinematic with slow pan
  - Release cinematic with freedom theme
- **Advanced Prison Activities**
  - Weight Lifting Simulator (5 sets, 10 reps, progressive fatigue)
  - Eating Simulator (20 bites, ASCII art plate)
  - Library System (3 books with 5 pages each, intelligence stat)
  - Commissary Shop (buy items with prison credits)
  - Real-Time Clock System (1 prison year = 7 real days)
  - Talk to Cellmate (relationship building)
  - Send Letter (communication with outside)
- **Enhanced Judge Hardcastle**
  - Mood tracking: irritated → angry → furious → apoplectic
  - Patience meter system
  - Memory of past arrests
  - Context-aware form commentary
- **Save/Load System**
  - Complete game state persistence
  - localStorage-based saves
  - Resume from exact prison day
  - Time-based progression while offline

### Changed
- Improved courtroom paperwork validation
- Enhanced form filling experience
- Better prison activity feedback messages

### Technical
- Added CinematicSystem class (183 lines)
- Expanded JudgeHardcastle class with mood tracking
- Implemented real-time clock calculations
- Added comprehensive save/load methods

## [0.1.0] - 2025-10-11

### Added
- **Core Driving Mechanics**
  - 3D isometric world using Three.js r128
  - Car physics and controls (WASD/Arrow keys)
  - Acceleration and turning
  - Surrender mechanic (Spacebar)
- **Police Chase System**
  - Dynamic police car spawning
  - AI pursuit logic
  - Arrest system when caught
  - Wanted level tracking
- **Courtroom System**
  - Judge Hardcastle character
  - Multi-page paperwork forms
  - Form validation
  - Sentencing based on violations
  - Snarky judge commentary
- **Prison System**
  - Time served tracking
  - Prison day counter
  - Basic prison activities
  - Sentence completion
  - Release mechanics
- **Character Creation**
  - Name input
  - Skin tone selection (5 options)
  - Height slider (150-200cm)
  - Voice selection (4 options: deep, normal, high, robotic)
- **Main Menu**
  - New game option
  - Continue game option
  - Credits screen

### Technical
- Three.js r128 for 3D rendering
- Pure vanilla JavaScript (no frameworks)
- Responsive canvas-based rendering
- Game state management
- Screen transition system

## [0.0.1] - 2025-10-10

### Added
- Initial project setup
- Basic HTML structure
- Game loop architecture
- Development environment

---

## Version Format

Given a version number MAJOR.MINOR.PATCH:

- **MAJOR** version - Incompatible API changes or major gameplay overhauls
- **MINOR** version - New features in a backwards compatible manner
- **PATCH** version - Backwards compatible bug fixes

### Categories

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes
- **Technical** - Implementation details, code structure

---

[Unreleased]: https://github.com/githumps/vroom-vroom/compare/v1.4.2...HEAD
[1.4.2]: https://github.com/githumps/vroom-vroom/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/githumps/vroom-vroom/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/githumps/vroom-vroom/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/githumps/vroom-vroom/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/githumps/vroom-vroom/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/githumps/vroom-vroom/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/githumps/vroom-vroom/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/githumps/vroom-vroom/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/githumps/vroom-vroom/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/githumps/vroom-vroom/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/githumps/vroom-vroom/releases/tag/v0.0.1
