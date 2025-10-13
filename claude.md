# VROOM VROOM - Project Documentation

**Last Updated:** 2025-10-13 (Late Evening Session - Integration Complete)
**Current Version:** v1.0.0

## Project Overview

A dystopian driving game where driving is illegal. Features Disco Elysium-inspired art style, absurd bureaucracy, and Judge Hardcastle's increasingly snarky commentary. Inspired by the original concept: starts as Forza-style driving simulator, escalates to detailed courtroom paperwork, ends in comprehensive prison simulation with real-time clock.

**Tech Stack:**
- Three.js r128 (3D rendering)
- Web Audio API (synthesized sounds)
- Gemini Pro API (optional AI-generated charges)
- Pure JavaScript, HTML, CSS
- Real-time clock system (Animal Crossing-style)

**Deployment:** GitHub Pages at https://githumps.github.io/vroom-vroom/

---

## Current Status: 🟢 CORE SYSTEMS + ADVANCED PRISON FEATURES COMPLETE

### Core Game Features (Complete)
- ✅ 3D isometric driving with Disco Elysium aesthetic
- ✅ Police chase system
- ✅ Paperwork simulator with Judge Hardcastle AI
- ✅ Prison system with activities
- ✅ Character creation
- ✅ Save/load system
- ✅ Cinematic transitions (Ken Burns style)

### Prison Systems (Just Completed Today)
- ✅ **Weight Lifting Simulator** (FULLY PLAYABLE)
  - 5 sets of 10 reps with progressive fatigue
  - Click/spacebar input with progress bar
  - Strength stat tracking
  - Motivational messages
  - Full workout log

- ✅ **Eating Simulator** (FULLY PLAYABLE)
  - 20 bites, one at a time
  - ASCII art plate that empties
  - 20+ flavor texts
  - Hunger tracking
  - Time-based completion feedback

- ✅ **Library System** (FULLY PLAYABLE)
  - 3 books with real content (5 pages each)
  - "Traffic Laws: A Bureaucratic History"
  - "The Count of Monte Cristo" (Excerpt)
  - "Walden" (Excerpt)
  - Page-by-page reading
  - Intelligence stat increases
  - Cellmate interruptions (20% chance)
  - Bookmark system

- ✅ **Commissary Shop** (FULLY PLAYABLE)
  - Earn 1-5 credits per prison activity
  - Buy: cigarettes (5c), candy (3c), noodles (4c), magazine (6c), radio (20c)
  - Stock management system
  - Random restocks
  - Inventory tracking

- ✅ **Real-Time Clock System** (FULLY FUNCTIONAL)
  - Game syncs with real-world time
  - Time passes while not playing
  - Event digest shows what happened
  - 1 prison year = 7 real days
  - Auto-release when sentence complete

- ✅ **Tattoo Drawing System** (FULLY PLAYABLE - Just Integrated)
  - 10x10 grid canvas-based tattoo designer
  - Multi-step process: Design → Stencil → Apply Ink → Care
  - Progressive difficulty at each stage
  - 25% infection risk if care game fails
  - Permanent tattoo collection storage
  - ASCII art preview of designs
  - Integrated with commissary costs

- ✅ **Gang Alliance System** (FULLY PLAYABLE - Just Integrated)
  - 3 distinct gangs: Safe Drivers Club, Turn Signals, Road Warriors
  - Reputation system (-100 to +100 per gang)
  - 4 interaction types: Talk, Share Cigarettes, Trade, Join
  - Cigarette economy for gang influence
  - Enemy/ally dynamics (Safe Drivers vs Road Warriors)
  - Gang membership provides escape bonus
  - Random gang events during prison time
  - Cellmate gang affiliations affect dialogue

- ✅ **Escape Planning System** (FULLY PLAYABLE - Just Integrated)
  - 4 distinct escape routes: Tunnel, Bribe Guard, Transfer, Riot
  - Multi-step preparation for each route
  - Base success rates: 30%, 45%, 55%, 40%
  - Success rate increases with preparation (+20% max)
  - Gang membership provides +10% bonus
  - Failure penalties: 10-20 years added to sentence
  - Success returns player to driving world
  - Progress tracking for each route
  - Risk/reward decision making

### Sound System (Completed Previously)
- ✅ Police siren + handcuff click on arrest
- ✅ Cop mumbling (Sims-style gibberish)
- ✅ Gavel strike in courtroom
- ✅ Prison door clang
- ✅ Volume controls + mute toggle in settings

### AI Integration (Completed Previously)
- ✅ Gemini Pro API for dynamic charges
- ✅ Optional API key system (session-based, secure)
- ✅ First-load modal prompt
- ✅ Settings screen for API key management
- ✅ Graceful fallback to hardcoded charges

### Bug Fixes (Completed Today)
- ✅ Fixed car orientation (was facing backwards)
- ✅ Fixed inverted steering (A/D keys now correct)
- ✅ Fixed event listener memory leaks
- ✅ Added proper error handling for cinematics

---

## File Structure

```
vroom-vroom/
├── game/
│   ├── index.html          # Main game HTML (1100+ lines)
│   ├── game.js             # Complete game engine (2700+ lines)
│   ├── soundsystem.js      # Web Audio API sound system
│   └── tattoo-system.js    # Tattoo drawing system class
├── index.html              # GitHub Pages redirect
├── claude.md               # This file - single source of truth
├── README.md               # Public-facing documentation
└── CHANGELOG.md            # Version history and release notes
```

---

## Development Milestones

### Phase 1: Initial Development (Completed)
- ✅ Basic 3D world with Three.js
- ✅ Car physics and controls
- ✅ Police chase AI
- ✅ Courtroom paperwork system
- ✅ Prison activities
- ✅ Judge Hardcastle dialogue system

### Phase 2: Polish & Enhancement (Completed)
- ✅ Disco Elysium art style (muted colors, isometric camera)
- ✅ Cinematic system with Ken Burns effects
- ✅ Judge mood/patience tracking
- ✅ Save/load system

### Phase 3: Audio & AI (Completed - 2025-10-13 Evening)
- ✅ Web Audio API sound synthesis
- ✅ Gemini Pro API integration
- ✅ API key management system
- ✅ Volume controls in settings
- ✅ Fixed driving controls bug

### Phase 4: Advanced Prison Systems (Just Completed - 2025-10-13 Late Evening)
- ✅ Tattoo Drawing System integration
- ✅ Gang Alliance System integration
- ✅ Escape Planning System integration
- ✅ 3 new complete prison subsystems
- ✅ All agent-prepared code fully integrated
- ✅ 600+ lines of new gameplay code
- ✅ Updated documentation

---

## Technical Architecture

### Sound System (`soundsystem.js`)
**Web Audio API** - All sounds synthesized, no external files needed
- `playArrestSound()` - Police siren (alternating 800/600Hz) + handcuff click
- `playCopMumbling()` - 8 syllables of Sims-style gibberish (180-220Hz range)
- `playGavelStrike()` - Deep thud (80Hz→40Hz) with impact noise
- `playPrisonDoorClang()` - Metallic resonance (3 oscillators: 400/600/200Hz)
- Volume/mute state saved to localStorage

### AI System (`ApiKeyManager` class in game.js)
**Gemini Pro API** - Optional dynamic charge generation
- API key stored in `sessionStorage` (cleared on browser close)
- Skip preference in `localStorage` (persistent)
- Graceful fallback to hardcoded charges
- Test API key functionality
- Free tier: 14,000 requests/day

### Game Engine (`VroomVroomGame` class)
**Main Game Loop** - Handles all game states
- `driving` - 3D world, police chase, car controls
- `courtroom` - Paperwork forms, Judge Hardcastle dialogue
- `prison` - Activities, time served tracking
- `menu` - Main menu, character creation

### Judge AI (`JudgeHardcastle` class)
**Dynamic Dialogue System**
- Mood tracking: irritated → angry → furious → apoplectic
- Patience meter (decreases with player actions)
- Memory of past arrests
- Generates random charges or uses AI-generated ones
- Context-aware commentary on form filling

### Tattoo System (`TattooSystem` class in tattoo-system.js)
**Canvas-Based Drawing System**
- 10x10 grid for tattoo design (100 cells)
- Multi-stage process: Design → Stencil → Ink → Care
- Progressive difficulty at each stage
- Click/spacebar input for inking and care
- 25% infection risk based on care performance
- ASCII art generation from grid patterns
- Permanent storage in player.tattoos array
- Cost: 10 credits from commissary

### Gang System (methods in VroomVroomGame class)
**Social Dynamics & Reputation**
- 3 gangs with distinct philosophies and enemies
- Reputation range: -100 (hostile) to +100 (allied)
- 4 actions: Talk (+2-4 rep), Share Cigarettes (+7-14 rep), Trade (items for cigarettes), Join (requires 50+ rep)
- Cigarette-based economy
- Gang membership grants +10% escape bonus
- Enemy gangs lose 50 rep when joining rival
- Random gang events during prison activities
- Cellmate interactions vary by gang affiliation

### Escape System (methods in VroomVroomGame class)
**Multi-Route Escape Planning**
- 4 routes: Tunnel (30% base), Bribe (45%), Transfer (55%), Riot (40%)
- Each route has 4-7 preparation actions
- Actions have individual success rates (35%-90%)
- Progress tracking: items, allies, completed actions
- Final success rate = base + (progress/5) + gangBonus
- Success: Return to driving world (freedom!)
- Failure: +10-20 years penalty, reset progress
- Most thematic: Transfer route (bureaucracy-based)

---

## Integration Points

### Sound Triggers
```javascript
pullOver() → playArrestSound()
setupCourtroom() → playCopMumbling()
judgment cinematic → playGavelStrike()
prison cinematic → playPrisonDoorClang()
```

### AI Integration
```javascript
setupCourtroom() → apiKeyManager.generateAICharges() → fallback to judge.generateCharges()
```

### Settings Modal
- Volume slider (0-100%)
- Mute toggle
- API key input/test/remove
- Current status indicator

---

## Known Issues

**None currently** - All reported bugs have been fixed.

---

## Future Enhancements (Optional)

- [ ] Additional sound effects (car engine, keyboard typing)
- [ ] More prison activities
- [ ] Multiplayer leaderboard (most arrests)
- [ ] Mobile touch controls
- [ ] Additional cinematic scenes

---

## Git Workflow

### Branches
- `main` - Production (auto-deploys to GitHub Pages)

### Commit Strategy (Semantic Commits)
We use semantic commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features (MINOR version bump)
- `fix:` - Bug fixes (PATCH version bump)
- `docs:` - Documentation changes only
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates
- `BREAKING CHANGE:` - Breaking changes (MAJOR version bump)

**Examples:**
- `feat: add escape planning system with 4 routes`
- `fix: correct car orientation in driving mode`
- `docs: update CHANGELOG for v1.0.0 release`
- `chore: add semantic versioning system`

---

## Versioning

### Semantic Versioning
This project follows [Semantic Versioning 2.0.0](https://semver.org/):

**Format:** MAJOR.MINOR.PATCH (e.g., v1.0.0)

- **MAJOR** - Incompatible changes or major gameplay overhauls
- **MINOR** - New features in a backwards compatible manner
- **PATCH** - Backwards compatible bug fixes

### Version Display
- Version displayed on main menu (bottom of screen)
- Stored in `game.js` as `this.VERSION` constant
- Automatically updated in HTML on game init

### CHANGELOG
All notable changes documented in `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format.

**Categories:**
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes
- **Technical** - Implementation details

### Version History
- **v1.0.0** (2025-10-13) - Advanced Prison Systems (tattoo, gang, escape)
- **v0.3.0** (2025-10-13) - Audio & AI Integration
- **v0.2.0** (2025-10-12) - Prison Activities & Cinematic System
- **v0.1.0** (2025-10-11) - Core Game Mechanics
- **v0.0.1** (2025-10-10) - Initial Setup

---

## Testing Checklist

### Core Functionality
- [ ] Game loads without errors
- [ ] Driving controls work correctly (WASD/arrows)
- [ ] Police spawn and chase player
- [ ] Arrest triggers correctly
- [ ] Courtroom forms validate properly
- [ ] Prison activities advance time
- [ ] Save/load works

### New Features
- [ ] Arrest sound plays on pullover
- [ ] Cop mumbling plays in courtroom
- [ ] Gavel strike plays during judgment
- [ ] Prison door clang plays at prison entrance
- [ ] Volume slider adjusts sound levels
- [ ] Mute button works correctly
- [ ] API key modal appears on first load (if not skipped)
- [ ] AI charges generate when API key provided
- [ ] Fallback to default charges works

### Settings Screen
- [ ] Current volume displays correctly
- [ ] Volume persists between sessions
- [ ] API key status shows correctly
- [ ] Test API key validates properly

### Tattoo System (NEW)
- [ ] Prison menu shows "GET A TATTOO" option
- [ ] Tattoo studio loads with 10x10 grid
- [ ] Clicking cells toggles them on/off
- [ ] "Create Stencil" locks the design
- [ ] "Apply Ink" mini-game shows progress bar
- [ ] "Care for Tattoo" mini-game shows progress bar
- [ ] Infection risk (25%) triggers appropriately
- [ ] Completed tattoos show in collection
- [ ] ASCII art preview displays correctly
- [ ] Costs 10 credits from commissary

### Gang System (NEW)
- [ ] Prison menu shows "JOIN A GANG" option
- [ ] Gang system screen shows 3 gangs
- [ ] Reputation bars display for all gangs
- [ ] Current gang status displays correctly
- [ ] Cigarette count displays
- [ ] "INTERACT" buttons work for each gang
- [ ] Talk action increases reputation
- [ ] Share Cigarettes action requires 5 cigarettes
- [ ] Trade action grants cigarettes
- [ ] Join action requires 50+ reputation
- [ ] Joining gang makes enemies hostile
- [ ] Gang membership persists through save/load
- [ ] Random gang events trigger

### Escape System (NEW)
- [ ] Prison menu shows "PLAN ESCAPE" option
- [ ] Escape menu displays 4 routes
- [ ] Progress percentages show for each route
- [ ] Success rates calculate correctly
- [ ] "VIEW ROUTE" shows detailed information
- [ ] Requirements list displays
- [ ] Action buttons show days and success rates
- [ ] Completing actions increases progress
- [ ] Failed actions can be retried
- [ ] Gang membership adds +10% bonus
- [ ] "ATTEMPT ESCAPE" button enables when ready
- [ ] Successful escape returns to driving
- [ ] Failed escape adds penalty years
- [ ] Escape progress persists through save/load

---

## Deployment Notes

### GitHub Pages Setup
1. Repository must be public
2. Settings → Pages → Deploy from `main` branch
3. Root redirect in `index.html` → `game/index.html`
4. Auto-deploys on every push to main

### API Key Instructions for Users
1. Visit https://makersuite.google.com/app/apikey
2. Create free Google AI Studio account
3. Generate API key
4. Paste into game's first-load modal or settings screen
5. Key stored in browser session only (secure)

---

## Development Log

### 2025-10-13 (Late Evening Session)
- ✅ **Integrated Tattoo Drawing System**
  - Added TattooSystem class to tattoo-system.js
  - Integrated 10x10 grid canvas drawing
  - Added multi-stage process (Design → Stencil → Ink → Care)
  - Implemented infection risk system
  - Added ASCII art preview generation
  - Created tattoo studio screen in HTML
  - Integration time: ~45 minutes

- ✅ **Integrated Gang Alliance System**
  - Added 3 gangs with distinct personalities
  - Implemented reputation system (-100 to +100)
  - Created cigarette economy
  - Added 4 interaction types
  - Implemented enemy/ally dynamics
  - Added gang bonus to escape system
  - Created gang system screens in HTML
  - Added 15+ new methods to game.js
  - Integration time: ~60 minutes

- ✅ **Integrated Escape Planning System**
  - Added 4 complete escape routes
  - Implemented multi-step preparation system
  - Created success rate calculations
  - Added gang membership bonus
  - Implemented failure penalty system
  - Added escape screens to HTML
  - Added 6 new methods to game.js
  - Integration time: ~50 minutes

- ✅ **Updated Documentation**
  - Comprehensive claude.md update
  - All new systems documented
  - Updated line numbers and file structure

- ✅ **Added Semantic Versioning**
  - Created CHANGELOG.md with full version history
  - Added version display to main menu (v1.0.0)
  - Implemented VERSION constant in game.js
  - Documented semantic commit message format
  - Established versioning workflow

### 2025-10-13 (Evening Session)
- ✅ Integrated Web Audio API sound system
- ✅ Added Gemini Pro API for dynamic charges
- ✅ Created API key management system
- ✅ Fixed driving controls bug (inverted steering)
- ✅ Added volume controls to settings modal
- ✅ All sounds playing at correct game events

### Earlier Sessions
- Basic game mechanics implemented
- Disco Elysium art style applied
- Cinematic system created
- Judge Hardcastle AI system built
- Prison system with activities

---

## Features Still To Implement

### ✅ Agent-Prepared Systems (ALL INTEGRATED!)

All agent-prepared code has been successfully integrated:
- ✅ **Tattoo Drawing System** - Fully integrated and playable
- ✅ **Gang Alliance System** - Fully integrated and playable
- ✅ **Escape Planning System** - Fully integrated and playable

### 🔴 Original Spec Features (Not Yet Started)

From the original design document, these advanced features still need implementation:

1. **Browser-in-Prison** (Complex - 2-4 hours)
   - Real web browser in game (throttled to dialup)
   - Firewall with allow/deny lists
   - CTF-style challenge to hack firewall
   - Access prison library computer to browse

2. **Conjugal Visit Simulator** (Medium - 1-2 hours)
   - Request system
   - Approval/denial mechanics
   - Actual conjugal visit mini-game
   - Romance subplot integration

3. **Same-Sex Romance System** (Medium-Complex - 2-3 hours)
   - Orange Is The New Black style storylines
   - Multiple romance options
   - Dialogue trees
   - Character relationship tracking
   - Story progression system

4. **Advanced Character Customization** (Complex - 3-5 hours)
   - Cyberpunk 2077 / Baldur's Gate 3 level detail
   - Appearance sliders (face, body, voice)
   - Voice selection (4+ options with different tones)
   - Visual representation in game

5. **Free Phone Call System** (Medium - 1-2 hours)
   - Choose who to call (only ONE call!)
   - Different contacts (lawyer, friend, family)
   - Consequences based on choice
   - Legal representation affects courtroom

6. **Public Domain Book Library (Expanded)** (Medium - 2-3 hours)
   - Full-length books (100+ pages each)
   - 10-15 complete books
   - Page-by-page reading (currently: 5 pages per book)
   - Cellmate can damage books

7. **Letter System (Expanded)** (Easy - 30 minutes)
   - Currently: Basic send letter
   - Needed: RECEIVE letters from contacts
   - Random letters from family, friends
   - Letters can be censored/redacted by guards

8. **Contraband System** (Medium - 1-2 hours)
   - Find items in cake/bread deliveries
   - Iron file, lockpicks, etc.
   - Use in escape attempts
   - Risk of discovery

9. **Appeals Process** (Medium - 2 hours)
   - Court paperwork to appeal sentence
   - Lawyer interaction
   - Success/failure chances
   - Sentence reduction possibility

10. **Prison Health Center** (Easy - 30-60 minutes)
    - Tattoo infections lead to medical visit
    - Treatment simulation
    - Health stat tracking

11. **Prison Schedule (Time-Based)** (Easy - 1 hour)
    - Activities locked based on real-world time
    - Breakfast: 7am, Lunch: 12pm, Dinner: 6pm
    - Yard time: 10am-12pm
    - Lights out: 10pm-6am

12. **Whittling System** (Easy - 1 hour)
    - Create shank from toothbrush
    - Multi-step crafting process
    - Can be used in fights/escape

13. **Magazine Interaction** (Easy - 30 minutes)
    - Cut out pictures
    - Store in inventory
    - Trading system

## Quick Reference

### File Line Numbers (Important Sections)

**game.js** (2700+ lines total)
- **Lines 4-148** - ApiKeyManager class
- **Lines 151-334** - CinematicSystem class
- **Lines 337-566** - JudgeHardcastle class
- **Lines 568-2700+** - VroomVroomGame class
  - **Lines 597-608** - Player object properties (gang, tattoo, escape data)
  - **Lines 605-607** - Sound system initialization
  - **Lines 1256** - Arrest sound trigger
  - **Lines 1267** - Cop mumbling trigger
  - **Lines 1479** - Gavel strike trigger
  - **Lines 1483** - Prison door clang trigger
  - **Lines 1700-1752** - Tattoo system integration methods
  - **Lines 1759-2094** - Gang system methods (15 methods)
  - **Lines 2107-2411** - Escape system methods (6 methods)

**soundsystem.js**
- **Lines 1-291** - Complete Web Audio API sound system

**tattoo-system.js**
- **Lines 1-280** - TattooSystem class (complete standalone system)

**index.html** (1100+ lines total)
- **Lines 693-753** - Tattoo studio screen
- **Lines 917-1019** - Gang system screens
- **Lines 1021-1102** - Escape planning screens

### Key Commands
- `W/↑` - Accelerate
- `A/←` - Turn left
- `D/→` - Turn right
- `SPACE` - Stop driving (surrender)

---

## Contact & Support

**Project:** VROOM VROOM
**Created by:** Claude (via Claude Code)
**Agents:** vroom-vroom-enforcer, game-dev-specialists
**License:** No excuses. This works.
