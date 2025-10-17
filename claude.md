# VROOM VROOM - Project Documentation

**Last Updated:** 2025-10-15
**Current Version:** v1.4.2
**Status:** 🟢 PRODUCTION READY - All Core Systems Implemented

---

## ⚡ MODERN DEVELOPMENT WORKFLOW (MANDATORY)

**Every session and every task MUST follow this workflow. No exceptions.**

### 🤖 Agent-First Development

**IMPORTANT:** For complex tasks, use specialized agents in the optimal order:

1. **Use `Task` tool with `general-purpose` agent** for:
   - Researching existing code patterns
   - Searching for files and code references
   - Planning multi-step implementations
   - Understanding system architecture

2. **Use `Task` tool with `game-dev-specialist` agent** for:
   - Implementing new game features
   - Designing game systems
   - Creating game mechanics
   - 3D rendering tasks
   - UI/UX design for game screens

**When to use agents:**
- Task involves 5+ files
- Need to search/understand unfamiliar codebase
- Implementing complete new systems
- Researching integration patterns

**Example workflow:**
```javascript
// 1. Research phase (general-purpose agent)
Task: "Search codebase for tattoo system implementation and identify integration points"

// 2. Implementation phase (game-dev-specialist agent)
Task: "Implement hospital clinic system with medical events following the tattoo system pattern"

// 3. Documentation phase (do yourself)
Update SYSTEMS.md, CHANGELOG.md, claude.md
```

---

## 📋 MANDATORY 7-STEP WORKFLOW

**Follow this for EVERY change:**

### Step 1: Pre-Task Check ✅
```
□ Check TODO list for current tasks (use TodoWrite tool)
□ Review SYSTEMS.md for system overview
□ Check relevant docs in docs/systems/ and docs/integration/
□ Verify no conflicting changes: git status
□ Read relevant code sections before modifying
□ Consider if agents needed (complex/multi-file tasks)
```

### Step 2: Execute Task 🔨
```
□ Use agents for complex tasks (see Agent-First Development)
□ Implement changes with comprehensive logging
□ Add error handling for all user-facing features
□ Test manually during development
□ Follow existing code patterns and naming conventions
□ Design for BOTH desktop AND mobile (always responsive)
```

### Step 3: Linting & Syntax Check 🔍 **MANDATORY**
```
□ Run syntax check on ALL modified JavaScript files:
  node -c game/game.js
  node -c game/guard-manicure-visual.js
  node -c game/test-suite.js
  (add more as needed)
□ Verify no syntax errors before proceeding
□ Check for proper semicolons, braces, etc.
```

### Step 4: Unit Testing 🧪 **MANDATORY**
```
□ Run unit test suite: node game/test-suite.js
□ Verify all tests pass (97%+ pass rate required)
□ Add new tests for new features
□ Test feature in browser (desktop)
□ Test feature in browser (mobile - critical!)
□ Use testing menu (type TEST on menu) for quick access
□ Test save/load compatibility
□ Verify no console errors
□ Test edge cases and error conditions
```

### Step 5: Update Documentation 📝 **MANDATORY**
```
□ Update game VERSION in game.js (this.VERSION)
□ Update SYSTEMS.md if new system or major changes
□ Update/create docs in docs/systems/ for system reference
□ Update/create docs in docs/integration/ for integration steps
□ Update CHANGELOG.md with user-facing changes (new version section)
□ Update this file (claude.md) current version and status
□ Update line numbers and file references
□ Update version comparison links in CHANGELOG.md
```

### Step 6: Code Quality Review 🎯
```
□ Review for console.log() - keep only with logger
□ Check for proper error handling
□ Verify all functions have clear purposes
□ Remove TODO comments or convert to issues
□ Check mobile responsiveness (modals, screens, canvas)
□ Verify all text readable on small screens
```

### Step 7: Git Commit 📦
```
□ Stage changed files: git add <files>
□ Write semantic commit message:
  - feat: New feature (MINOR version bump)
  - fix: Bug fix (PATCH version bump)
  - docs: Documentation only
  - refactor: Code restructure
  - perf: Performance improvement
  - BREAKING CHANGE: Major version bump
□ Include detailed description
□ Include technical summary (files changed, lines added)
□ Add "🤖 Generated with Claude Code" footer
□ Add "Co-Authored-By: Claude <noreply@anthropic.com>" footer
□ Reference issue numbers if applicable
```

**NEVER skip steps. This workflow ensures quality and prevents bugs.**

---

## 📚 DOCUMENTATION STRUCTURE

### Master References
- **SYSTEMS.md** - Complete overview of all game systems (START HERE)
- **CHANGELOG.md** - User-facing version history
- **claude.md** - This file - technical reference for Claude

### System Documentation (`docs/systems/`)
Detailed technical references for each system:
- SAVE_CODE_SYSTEM.md
- TATTOO_PLACEMENT.md
- CAR_MODELS_REFERENCE.md
- TIME_SYSTEM_README.md
- API_VERIFICATION_REPORT.md
- DEBUG_REFERENCE.md
- LOGGING_EXAMPLES.md
- DEV_MODE_SUMMARY.md
- DEV_MODE_QUICK_REFERENCE.md
- PRISON_SYSTEM.md
- PRISON_REVIEW_EXECUTIVE_SUMMARY.md
- CAR_SELECTION_SUMMARY.md
- GUARD_MANICURE_SYSTEM_SUMMARY.md

### Integration Guides (`docs/integration/`)
Step-by-step implementation instructions:
- TATTOO_SYSTEM_INTEGRATION.md
- GANG_SYSTEM_INTEGRATION_GUIDE.md
- ESCAPE_SYSTEM_INTEGRATION.md
- CAR_SELECTION_INTEGRATION.md
- DEV_MODE_INTEGRATION.md
- GUARD_MANICURE_IMPLEMENTATION.md
- PRISON_ENHANCEMENTS_IMPLEMENTATION.md
- CAR_SELECTION_CODE_SNIPPETS.md
- INTEGRATION_STEPS.md

### Agent Deliverables
Agent-created system designs (ready for implementation):
- Hospital/Clinic System (v1.3.0 agent report)
- Conjugal Visit System (v1.3.0 agent report)
- Guard Manicure System (v1.3.0 agent report)
- Dev Mode System (v1.3.0 agent report)
- Prison System Review (v1.3.0 agent report)

**When adding new systems:**
1. Create reference doc in `docs/systems/`
2. Create integration guide in `docs/integration/`
3. Update SYSTEMS.md with overview and links
4. Update CHANGELOG.md with user-facing info
5. Update this file with technical details

---

## PROJECT OVERVIEW

A dystopian driving game where driving is illegal. Features Disco Elysium-inspired art style, absurd bureaucracy, and Judge Hardcastle's increasingly snarky commentary. Inspired by the original concept: starts as Forza-style driving simulator, escalates to detailed courtroom paperwork, ends in comprehensive prison simulation with real-time clock.

**Tech Stack:**
- Three.js r128 (3D rendering)
- Web Audio API (synthesized sounds)
- Gemini API (optional AI-generated charges)
- Pure JavaScript, HTML, CSS
- Real-time clock system (Animal Crossing-style)

**Deployment:** GitHub Pages at https://githumps.github.io/vroom-vroom/

---

## CURRENT STATUS: v1.3.0 🎉

### ✅ Core Game Features (Complete)
- 3D isometric driving with Disco Elysium aesthetic
- Police chase system with AI pursuit
- Paperwork simulator with Judge Hardcastle
- Comprehensive prison system (12+ activities)
- Character creation with car selection and voice preview
- Dual save system (localStorage + exportable save codes)
- Cinematic transitions (Ken Burns style)
- Web Audio API sound system
- Mobile browser support (touch controls)

### ⭐ NEW in v1.3.0 (2025-10-14)
All systems designed by game-dev-specialist agents and ready for integration:

1. **Hospital/Clinic System**
   - Treat infected tattoos (cost: 50 credits, 1 day)
   - 7 dark humor medical events
   - Simon Says mini-game (5 instructions)
   - Wrong answers add 1 day to sentence
   - Status: 🟡 Agent deliverable complete, pending integration

2. **Conjugal Visit System**
   - Requires 75+ good behavior points, 30+ days served
   - 7 awkward conversation topics
   - 60% chance of contraband (cigarettes, credits, tools, drugs, weapon)
   - 15% chance of guard search (lose all, -30 behavior)
   - 14-day cooldown
   - Status: 🟡 Agent deliverable complete, pending integration

3. **Guard Manicure Bribery**
   - 5-step mini-game (Soak, Trim, File, Polish, Dry)
   - 5 guards with unique personalities
   - Earn favor tokens (3+ steps = 1 token)
   - Spend tokens (1-4 tokens for various benefits)
   - Dark humor subversion of prison tropes
   - Status: 🟡 Agent deliverable complete, pending integration

4. **Dev Mode & API Debugging** ⭐ PRIORITY
   - Type "DEBUG" on menu for dev overlay
   - Comprehensive logging (4 levels, 15 categories)
   - API usage monitoring and statistics
   - Quick actions and stat modification
   - Enhanced testing menu
   - Status: ✅ Files created, pending integration

5. **Save Code Export/Import** ✅ IMPLEMENTED
   - Base64-encoded portable save codes
   - Export/import modals with copy-to-clipboard
   - Works across all devices/browsers
   - Version tracking and validation

6. **Tattoo Body Placement** ✅ IMPLEMENTED
   - 9 body locations (arms, chest, back, shoulders, neck, hands)
   - Enhanced workflow: Design → Stencil → Ink → **Placement** → Care
   - Poetic descriptions for each location
   - Permanent placement storage

7. **Mobile Browser Support** ✅ IMPLEMENTED
   - Touch controls for driving
   - Stop driving button
   - Responsive UI (tablet + phone breakpoints)
   - Touch-friendly button sizes (48px minimum)
   - iOS optimizations

8. **Prison System Review** ✅ COMPLETE
   - Comprehensive tone analysis
   - 20 random events designed
   - System enhancement proposals
   - Balance adjustments recommended
   - Gemini API integration opportunities

---

## FILE STRUCTURE

```
vroom-vroom/
├── game/                          # Main game files
│   ├── index.html                 # Main game HTML (1800+ lines)
│   ├── game.js                    # Core game engine (3500+ lines)
│   ├── soundsystem.js             # Web Audio API (350+ lines)
│   ├── tattoo-system.js           # Tattoo drawing system (389 lines)
│   ├── car-selection.js           # Car preview system (331 lines)
│   ├── debug-logger.js            # 🟡 Logging utility (165 lines) [PENDING]
│   ├── api-monitor.js             # 🟡 API tracking (204 lines) [PENDING]
│   ├── dev-mode.js                # 🟡 Dev overlay (400+ lines) [PENDING]
│   ├── dev-mode.css               # 🟡 Dev styles (250+ lines) [PENDING]
│   └── README.md                  # Game-specific readme
│
├── docs/
│   ├── systems/                   # System reference documentation
│   │   ├── SAVE_CODE_SYSTEM.md
│   │   ├── TATTOO_PLACEMENT.md
│   │   ├── CAR_MODELS_REFERENCE.md
│   │   ├── TIME_SYSTEM_README.md
│   │   ├── API_VERIFICATION_REPORT.md
│   │   ├── DEBUG_REFERENCE.md
│   │   ├── LOGGING_EXAMPLES.md
│   │   ├── DEV_MODE_SUMMARY.md
│   │   ├── DEV_MODE_QUICK_REFERENCE.md
│   │   ├── PRISON_SYSTEM.md
│   │   ├── PRISON_REVIEW_EXECUTIVE_SUMMARY.md
│   │   ├── CAR_SELECTION_SUMMARY.md
│   │   └── GUARD_MANICURE_SYSTEM_SUMMARY.md
│   │
│   ├── integration/               # Integration guides
│   │   ├── TATTOO_SYSTEM_INTEGRATION.md
│   │   ├── GANG_SYSTEM_INTEGRATION_GUIDE.md
│   │   ├── ESCAPE_SYSTEM_INTEGRATION.md
│   │   ├── CAR_SELECTION_INTEGRATION.md
│   │   ├── DEV_MODE_INTEGRATION.md
│   │   ├── GUARD_MANICURE_IMPLEMENTATION.md
│   │   ├── PRISON_ENHANCEMENTS_IMPLEMENTATION.md
│   │   ├── CAR_SELECTION_CODE_SNIPPETS.md
│   │   └── INTEGRATION_STEPS.md
│   │
│   ├── GAME_DELIVERY_REPORT.md    # Game delivery summary
│   └── PROJECT_STATUS_REPORT.md   # Project status
│
├── archive/
│   └── unreal_attempts/           # Archived Unreal Engine attempts
│
├── SYSTEMS.md                     # Master system reference
├── CHANGELOG.md                   # Complete version history
├── claude.md                      # This file - technical reference
└── README.md                      # Project overview
```

---

## TECHNICAL ARCHITECTURE

### Core Engine (`game.js`)

**VroomVroomGame class** - Main game loop (3500+ lines)
- **Lines 4-148** - ApiKeyManager class
- **Lines 151-334** - CinematicSystem class
- **Lines 337-566** - JudgeHardcastle class
- **Lines 568-3500+** - Main VroomVroomGame class

**Game States:**
- `menu` - Main menu, character creation
- `driving` - 3D world, police chase, car controls
- `courtroom` - Paperwork forms, Judge Hardcastle dialogue
- `prison` - 12+ activities, time tracking, progression

**Player Object Properties:**
```javascript
{
    // Character
    name, skinTone, height, voice,
    selectedCar: { model, color },

    // Prison Stats
    sentence, prisonDays,
    money, cigarettes,
    hunger, strength, intelligence,
    goodBehaviorPoints, // NEW v1.3.0

    // Collections
    tattoos: [{ design, infected, placement, placementName, timestamp }],
    gangRep: { safeDrivers, turnSignals, roadWarriors },
    currentGang,
    escapeProgress: { tunnel, bribe, transfer, riot },

    // Contraband NEW v1.3.0
    contraband: {
        cigarettes, escapeTools, weapon, drugs
    },

    // Tracking
    arrests, successfulEscapes,
    clinicVisits, successfulTreatments, // NEW v1.3.0
    lastConjugalVisit, conjugalVisitsTotal, // NEW v1.3.0
    favorTokens, guardsManicured, // NEW v1.3.0
}
```

### Sound System (`soundsystem.js`)

**Web Audio API** - All sounds synthesized (350+ lines)
- `playArrestSound()` - Police siren (alternating 800/600Hz) + handcuff click
- `playCopMumbling()` - 8 syllables Sims-style gibberish (180-220Hz)
- `playGavelStrike()` - Deep thud (80Hz→40Hz) + impact noise
- `playPrisonDoorClang()` - Metallic resonance (3 oscillators)
- `playVoicePreview(voiceType)` - 4 character voice personalities
  - Deep and Resigned: 120Hz, triangle wave, descending tone
  - High and Anxious: 280Hz, 8Hz vibrato, wavering pitch
  - Monotone Bureaucrat: 190Hz, square wave, flat
  - Disturbingly Enthusiastic: 220Hz, ascending, 5Hz vibrato
- Volume/mute state saved to localStorage

### Car Selection System (`car-selection.js`)

**Three.js 3D Preview System** (331 lines)
- **CarGeometry** - 4 car models (~200 triangles each)
  - The Beater: Wide sedan (2.2 x 0.9 x 4.2)
  - The Box: Tall van (2.0 x 1.4 x 3.8)
  - The Clunker: Small hatchback (1.8 x 0.8 x 3.2)
  - The Rust Bucket: Pickup truck (2.1 x 0.85 x 3.0)
- **ColorPalette** - 10 muted Disco Elysium colors
- **CarPreviewRenderer** - Real-time 400x400 canvas
  - Isometric camera, slow rotation (0.005 rad/frame)
  - Auto-cleanup on destroy

### Tattoo System (`tattoo-system.js`)

**Canvas-Based Drawing System** (389 lines)
- **TattooSystem class** - Complete standalone system
- 10x10 grid drawing interface
- 5-step process: Design → Stencil → Ink → Placement → Care
- 9 body placement locations (NEW v1.3.0)
- 25% infection risk
- ASCII art preview generation
- Permanent tattoo collection
- Cost: 10 credits

### AI System (`ApiKeyManager` in game.js)

**Gemini API (gemma-3-27b-it)** - Optional dynamic charges
- API key in sessionStorage (cleared on close)
- Skip preference in localStorage (persistent)
- Graceful fallback to hardcoded charges
- Test API key functionality
- Free tier: 14,000 requests/day

### Dev Mode System 🟡 PENDING INTEGRATION

**debug-logger.js** (165 lines)
- VroomLogger class with 4 log levels (INFO, DEBUG, WARN, ERROR)
- 15 system categories
- 100-log circular buffer
- Real-time event emission
- Export functionality

**api-monitor.js** (204 lines)
- ApiMonitor class for tracking API calls
- Success/failure statistics
- Response time metrics
- Rate limiting detection
- Session persistence

**dev-mode.js** (400+ lines)
- DevMode class with overlay UI
- Real-time stat updates
- Quick action buttons
- Screen jumping
- Stat modification cheats
- Full log viewer modal

**dev-mode.css** (250+ lines)
- Overlay styling
- Color-coded log levels
- Responsive design
- Smooth animations

---

## INTEGRATION TASKS PENDING

### Priority 1: Dev Mode (CRITICAL FOR DEBUGGING)
**Files:** debug-logger.js, api-monitor.js, dev-mode.js, dev-mode.css
**Time:** 30-60 minutes
**Guide:** docs/integration/DEV_MODE_INTEGRATION.md
**Benefits:**
- Real-time debugging during development
- API usage monitoring
- Quick access to all systems
- Professional development workflow

### Priority 2: Hospital/Clinic
**Time:** 45-60 minutes
**Guide:** Agent deliverable report (clinic system)
**Integration:**
- Add HTML screen to index.html
- Add clinic methods to game.js
- Add "VISIT CLINIC" button to prison menu (conditional on infected tattoos)
- Update player object properties

### Priority 3: Conjugal Visit
**Time:** 60-90 minutes
**Guide:** Agent deliverable report (conjugal visit)
**Integration:**
- Add HTML screens to index.html
- Add conjugal visit methods to game.js
- Implement good behavior tracking throughout game
- Add contraband management system
- Update player object properties

### Priority 4: Guard Manicure
**Time:** 45-60 minutes
**Guide:** docs/integration/GUARD_MANICURE_IMPLEMENTATION.md
**Integration:**
- Add guard-manicure.js script
- Add HTML screens to index.html
- Add manicure methods to game.js
- Add favor token economy
- Update player object properties

### Priority 5: Prison Enhancements
**Time:** 2-4 hours
**Guide:** docs/integration/PRISON_ENHANCEMENTS_IMPLEMENTATION.md
**Features:**
- 20 random prison events
- Unified reputation system
- Condition cascades
- Stats actually matter
- Cellmate depth

---

## TESTING CHECKLIST

### Core Systems ✅
- [x] Game loads without errors
- [x] Driving controls work (WASD/arrows)
- [x] Mobile touch controls work
- [x] Police spawn and chase
- [x] Arrest triggers correctly
- [x] Courtroom forms validate
- [x] Prison activities work
- [x] Save/load system works

### New Systems (v1.3.0) ✅
- [x] Save code export generates valid Base64
- [x] Save code import validates and restores state
- [x] Tattoo body placement selection works
- [x] Body parts display correctly
- [x] Placement stored with tattoos
- [x] Mobile touch controls respond
- [x] Mobile UI scales properly

### Pending Systems 🟡
- [ ] Dev mode activates with "DEBUG"
- [ ] Logging system captures events
- [ ] API monitor tracks calls
- [ ] Clinic treats infections
- [ ] Conjugal visits work
- [ ] Guard manicures give tokens
- [ ] Random events trigger
- [ ] Stats affect gameplay

---

## VERSION HISTORY

| Version | Date | Features |
|---------|------|----------|
| **v1.3.0** | 2025-10-14 | Mobile support, save codes, tattoo placement, dev mode, clinic, conjugal visits, guard manicures, prison review |
| **v1.2.0** | 2025-10-13 | Car selection, voice preview, Gemini API migration |
| **v1.1.0** | 2025-10-13 | Testing/debug menu |
| **v1.0.0** | 2025-10-13 | Tattoos, gangs, escape planning |
| **v0.3.0** | 2025-10-13 | Sound system, Gemini API |
| **v0.2.0** | 2025-10-12 | Disco Elysium art, cinematics, prison activities |
| **v0.1.0** | 2025-10-11 | Core driving, police, court, prison |
| **v0.0.1** | 2025-10-10 | Initial setup |

**See CHANGELOG.md for detailed version history.**

---

## GIT WORKFLOW

### Semantic Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features (MINOR version bump)
- `fix:` - Bug fixes (PATCH version bump)
- `docs:` - Documentation changes only
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks
- `BREAKING CHANGE:` - Breaking changes (MAJOR version bump)

**Examples:**
```bash
git commit -m "feat: add hospital clinic system with medical events"
git commit -m "fix: correct save code Base64 encoding"
git commit -m "docs: update SYSTEMS.md with v1.3.0 features"
git commit -m "refactor: consolidate prison system methods"
```

### Versioning (Semantic Versioning 2.0.0)

**Format:** MAJOR.MINOR.PATCH (e.g., v1.3.0)

- **MAJOR** - Incompatible changes or major gameplay overhauls
- **MINOR** - New features (backwards compatible)
- **PATCH** - Bug fixes (backwards compatible)

**Version Display:**
- Shown on main menu (bottom of screen)
- Stored in `game.js` as `this.VERSION`
- Auto-updated in HTML on game init

---

## DEPLOYMENT

### GitHub Pages
1. Repository must be public
2. Settings → Pages → Deploy from `main` branch
3. Root redirect in `index.html` → `game/index.html`
4. Auto-deploys on every push to main

### API Key Instructions for Users
1. Visit https://makersuite.google.com/app/apikey
2. Create free Google AI Studio account
3. Generate API key
4. Paste into game's modal or settings
5. Key stored in browser session only (secure)

---

## QUICK REFERENCE

### Key Controls
- **Desktop:**
  - W/↑ - Accelerate
  - A/← - Turn left
  - D/→ - Turn right
  - SPACE - Surrender
- **Mobile:**
  - Touch controls (left, right, accelerate buttons)
  - Stop driving button

### Cheat Codes
- Type "**TEST**" on main menu → Testing menu (jump to systems, add resources)
- Type "**DEBUG**" on main menu → Dev mode overlay 🟡 PENDING

### Quick Testing
```javascript
// Open browser console:

// Jump to specific system:
game.showScreen('prisonClinic');
game.showScreen('conjugalVisit');
game.showScreen('guardManicure');

// Add resources:
game.player.money = 1000;
game.player.cigarettes = 100;
game.player.goodBehaviorPoints = 100;

// Force infected tattoo:
game.player.tattoos[0].infected = true;

// Save/load:
game.saveGame();
game.loadGame();
```

---

## KNOWN ISSUES

**None currently** - All reported bugs fixed.

---

## FUTURE ENHANCEMENTS

### Priority: HIGH (v1.4.0)
- [ ] Integrate dev mode (CRITICAL)
- [ ] Integrate clinic system
- [ ] Integrate conjugal visits
- [ ] Integrate guard manicures
- [ ] Implement 20 random prison events
- [ ] Add reputation system
- [ ] Make stats matter in gameplay

### Priority: MEDIUM (v1.5.0)
- [ ] Enhance cellmate system
- [ ] Add letter responses
- [ ] Implement condition cascades
- [ ] More escape routes

### Priority: LOW (Future)
- [ ] Browser-in-prison system
- [ ] Advanced character customization
- [ ] Free phone call system
- [ ] Expanded library (full books)
- [ ] Contraband discovery
- [ ] Appeals process

---

## CONTACT & SUPPORT

**Issues:** [GitHub Issues](https://github.com/githumps/vroom-vroom/issues)
**Discussions:** [GitHub Discussions](https://github.com/githumps/vroom-vroom/discussions)
**Project:** VROOM VROOM
**Created by:** Claude (via Claude Code)
**Agents:** game-dev-specialists, vroom-vroom-enforcer

---

**Last Updated:** 2025-10-15
**Current Version:** v1.4.2
**Next Planned Release:** v1.5.0 (Dev Mode + Prison Enhancements)
**Documentation Status:** ✅ ORGANIZED AND UP-TO-DATE
