# Changelog

All notable changes to VROOM VROOM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/githumps/vroom-vroom/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/githumps/vroom-vroom/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/githumps/vroom-vroom/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/githumps/vroom-vroom/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/githumps/vroom-vroom/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/githumps/vroom-vroom/releases/tag/v0.0.1
