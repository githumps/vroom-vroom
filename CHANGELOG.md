# Changelog

All notable changes to VROOM VROOM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Development
- **Hospital/Clinic System** - Medical treatment for infected tattoos (designed, pending integration)
- **Conjugal Visit System** - Good behavior rewards with contraband mechanics (designed, pending integration)
- **Guard Manicure Bribery** - Favor token economy via manicures (designed, pending integration)
- **Dev Mode & Debugging** - Comprehensive logging and API monitoring (files created, pending integration)
- **20 Random Prison Events** - Daily events for replayability (designed, pending integration)
- **Reputation System** - Guards, inmates, warden, legend tracking (designed, pending integration)

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

[Unreleased]: https://github.com/githumps/vroom-vroom/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/githumps/vroom-vroom/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/githumps/vroom-vroom/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/githumps/vroom-vroom/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/githumps/vroom-vroom/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/githumps/vroom-vroom/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/githumps/vroom-vroom/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/githumps/vroom-vroom/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/githumps/vroom-vroom/releases/tag/v0.0.1
