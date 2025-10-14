# VROOM VROOM - COMPLETE SYSTEMS DOCUMENTATION

**Version:** 1.3.0
**Last Updated:** 2025-10-14
**Game:** Dystopian prison driving simulator with Disco Elysium aesthetic

This document provides a comprehensive overview of ALL game systems in VROOM VROOM. For detailed documentation on each system, see the linked reference documents.

---

## 📚 TABLE OF CONTENTS

1. [Core Gameplay Loop](#core-gameplay-loop)
2. [Character Creation](#character-creation)
3. [Driving & World](#driving--world)
4. [Police & Arrest](#police--arrest)
5. [Court System](#court-system)
6. [Prison System](#prison-system)
7. [Save System](#save-system)
8. [Sound & Audio](#sound--audio)
9. [Developer Tools](#developer-tools)
10. [System Status Reference](#system-status-reference)

---

## CORE GAMEPLAY LOOP

```
START
  ↓
CHARACTER CREATION → DRIVING → GET CAUGHT → COURT → PRISON → SERVE TIME → RELEASE
  ↑                                                                          ↓
  └──────────────────────────────────────────────────────────────────────────┘
         (ESCAPE or SENTENCE COMPLETE)
```

**Status:** ✅ Fully Implemented
**Last Modified:** v1.2.0

---

## CHARACTER CREATION

### Overview
Players create their character before entering the driving world.

### Features
- **Name Input** - Enter prisoner name
- **Skin Tone Selection** - 5 skin tone options
- **Height Slider** - 150-200cm
- **Voice Selection** - 4 voice types with audio preview
- **Car Selection** - 4 car models with 10 color options
- **3D Car Preview** - Real-time rotating preview

### Car Models
| Model | Description | Style |
|-------|-------------|-------|
| The Beater | Wide, low sedan | Beat-up and barely functional |
| The Box | Tall, square van | Prison transport vibes |
| The Clunker | Small, round hatchback | Economical failure |
| The Rust Bucket | Pickup truck | Working-class despair |

### Colors (10 total)
Rust Brown, Military Green, Dull Grey, Faded Blue, Primer Grey, Oxidized Red, Muddy Yellow, Sick Green, Asphalt Black, Dinge White

**Documentation:** [docs/systems/CAR_MODELS_REFERENCE.md](docs/systems/CAR_MODELS_REFERENCE.md)
**Integration Guide:** [docs/integration/CAR_SELECTION_INTEGRATION.md](docs/integration/CAR_SELECTION_INTEGRATION.md)
**Status:** ✅ Fully Implemented (v1.2.0)

---

## DRIVING & WORLD

### Controls
**Desktop:**
- WASD / Arrow Keys - Drive
- Spacebar - Surrender to police

**Mobile:**
- Touch controls (left, right, accelerate buttons)
- Stop driving button

### World
- 3D isometric view (Disco Elysium style)
- Muted color palette
- Infinite driving space
- Dynamic police spawning

### Car Physics
- Acceleration and deceleration
- Turning mechanics
- Speed tracking
- Collision detection (police contact)

**Status:** ✅ Fully Implemented
**Mobile Support:** ✅ Added v1.3.0

---

## POLICE & ARREST

### Police System
- Dynamic spawning based on time
- AI pursuit logic
- Collision-based arrest
- Cinematic arrest sequence

### Arrest Mechanics
- Contact with police car triggers arrest
- Arrest cinematic (Ken Burns style zoom)
- Sound effects (siren, handcuffs, cop mumbling)
- Automatic transition to courtroom

**Status:** ✅ Fully Implemented
**Last Modified:** v0.3.0

---

## COURT SYSTEM

### Judge Hardcastle
- Procedurally snarky judge
- Mood tracking (irritated → angry → furious → apoplectic)
- Patience meter
- Remembers previous arrests
- Voice system with 4 distinct voices

### Paperwork System
- Multi-page form filling
- Field validation
- Judge commentary on mistakes
- Sentencing based on violations

### Charges (AI-Generated)
- **Gemini API Integration** - Optional AI-generated charges
- **Fallback System** - Hardcoded charges if API unavailable
- API Key Management (sessionStorage, optional)
- 6-8 unique charge types

**Documentation:** [docs/systems/API_VERIFICATION_REPORT.md](docs/systems/API_VERIFICATION_REPORT.md)
**Status:** ✅ Fully Implemented
**AI Integration:** ✅ Optional (v0.3.0)

---

## PRISON SYSTEM

### Overview
Prison is the core gameplay hub with 12+ activities.

### Activities

#### 1. **Tattoo Studio**
- 10x10 grid drawing interface
- Multi-stage process: Design → Stencil → Ink → Placement → Care
- 9 body placement locations
- 25% infection risk
- ASCII art preview
- Permanent tattoo collection

**Documentation:** [docs/systems/TATTOO_PLACEMENT.md](docs/systems/TATTOO_PLACEMENT.md)
**Integration:** [docs/integration/TATTOO_SYSTEM_INTEGRATION.md](docs/integration/TATTOO_SYSTEM_INTEGRATION.md)
**Status:** ✅ Enhanced v1.3.0 (body placement added)
**Cost:** 10 credits

#### 2. **Medical Clinic** ⭐ NEW
- Treat infected tattoos
- Random medical events (veterinarian doctor, expired medicine, etc.)
- Simon Says mini-game (5 instructions)
- Wrong answers add 1 day to sentence
- 7 dark humor medical scenarios

**Documentation:** See agent deliverables (clinic system)
**Status:** ✅ New in v1.3.0
**Cost:** 50 credits, 1 day

#### 3. **Gang Alliance System**
- 3 gangs: Safe Drivers Club, Turn Signals, Road Warriors
- Reputation range: -100 (hostile) to +100 (allied)
- 4 interaction types: Talk, Share Cigarettes, Trade, Join Gang
- Cigarette economy
- +10% escape bonus for members
- Random gang events

**Documentation:** [docs/integration/GANG_SYSTEM_INTEGRATION_GUIDE.md](docs/integration/GANG_SYSTEM_INTEGRATION_GUIDE.md)
**Status:** ✅ Fully Implemented (v1.0.0)

#### 4. **Weight Lifting**
- 5 sets × 10 reps
- Progressive fatigue simulation
- Strength stat tracking
- ASCII art plate animation

**Status:** ✅ Fully Implemented
**Cost:** Free, 30 minutes

#### 5. **Eating Simulator**
- 20 bites to complete meal
- Hunger stat (0-100)
- ASCII art plate visualization
- Dark humor descriptions ("This potato has more autonomy than you")

**Status:** ✅ Fully Implemented
**Cost:** Free, 20 minutes

#### 6. **Library System**
- 3 books with 5 pages each
- Intelligence stat tracking
- Weird dystopian book titles
- Page-by-page reading

**Status:** ✅ Fully Implemented
**Cost:** Free, 1 hour per book

#### 7. **Commissary Shop**
- Buy items with commissary credits
- Cigarettes, soap, tattoo service, etc.
- Variable pricing
- Credit economy

**Status:** ✅ Fully Implemented
**Currency:** Commissary credits

#### 8. **Escape Planning**
- 4 escape routes with different success rates:
  - Tunnel (30% base, +10 years if caught)
  - Bribe Guard (45% base, +12 years if caught)
  - Manipulate Transfer (55% base, +15 years if caught)
  - Incite Riot (40% base, +20 years if caught)
- Multi-step preparation
- Success rate increases with prep (+20% max)
- Gang membership bonus (+10%)

**Documentation:** [docs/integration/ESCAPE_SYSTEM_INTEGRATION.md](docs/integration/ESCAPE_SYSTEM_INTEGRATION.md)
**Status:** ✅ Fully Implemented (v1.0.0)

#### 9. **Talk to Cellmate**
- Relationship building
- Static dialogue (3 topics)
- Gang-specific responses

**Status:** ⚠️ Basic Implementation (needs enhancement)
**Cost:** Free, 10 minutes

#### 10. **Send Letter**
- Communication with outside world
- Write letters to contacts
- Static responses

**Status:** ⚠️ Basic Implementation (needs enhancement)
**Cost:** 5 credits, 1 day delivery

#### 11. **Conjugal Visit** ⭐ NEW
- Requires 75+ good behavior points
- Requires 30+ days served
- 14-day cooldown
- 7 conversation topics with awkward dystopian dialogue
- 60% chance of receiving contraband
- 15% chance of guard search (lose all contraband, -30 good behavior)

**Contraband Types:**
- Cigarettes (20-40 count)
- Credits (50-100)
- Escape tools (+15% escape chance)
- Drugs (sell for 50cr each OR use for +20 good behavior)
- Weapon (+10 gang rep)

**Documentation:** See agent deliverables (conjugal visit system)
**Status:** ✅ New in v1.3.0
**Cost:** 25 credits, 2 hours

#### 12. **Guard Manicure Bribery** ⭐ NEW
- Give manicures to guards for favor tokens
- 5-step mini-game process:
  1. Soak (timing game)
  2. Trim (precision game)
  3. File (pattern matching)
  4. Polish (guard preference)
  5. Dry (patience game)
- 5 guards with unique personalities
- 3+ successful steps = 1 favor token

**Favor Token Uses:**
- Ignore violation (1 token)
- Smuggle cigarettes (2 tokens)
- Get contraband (3 tokens)
- Escape assistance (3 tokens)
- Reduce sentence (4 tokens)

**Documentation:** [docs/integration/GUARD_MANICURE_IMPLEMENTATION.md](docs/integration/GUARD_MANICURE_IMPLEMENTATION.md)
**Status:** ✅ New in v1.3.0
**Cost:** 30 minutes

### Prison Stats Tracked
- Days served
- Sentence length (in years, converted to days: 1 year = 7 days)
- Commissary credits
- Cigarettes
- Hunger (0-100)
- Strength (0-100)
- Intelligence (0-100)
- Good behavior points (0-100) ⭐ NEW
- Gang reputation (per gang, -100 to +100)
- Contraband inventory ⭐ NEW
- Favor tokens ⭐ NEW

### Time System
- Real-time clock (1 prison year = 7 real days)
- Activities consume time
- Day/night cycle
- Automatic sentence progression
- Release when sentence complete

**Documentation:** [docs/systems/TIME_SYSTEM_README.md](docs/systems/TIME_SYSTEM_README.md)
**Status:** ✅ Fully Implemented

### Prison System Review
Comprehensive review conducted covering:
- Tone consistency (silly but realistic balance)
- 20 random events designed
- System enhancements proposed
- Balance adjustments recommended
- Gemini API integration opportunities identified

**Documentation:** [docs/systems/PRISON_SYSTEM.md](docs/systems/PRISON_SYSTEM.md)
**Enhancements:** [docs/integration/PRISON_ENHANCEMENTS_IMPLEMENTATION.md](docs/integration/PRISON_ENHANCEMENTS_IMPLEMENTATION.md)
**Status:** ✅ Review Complete (v1.3.0)

---

## SAVE SYSTEM

### localStorage Auto-Save
- Automatic save after major actions
- Complete game state persistence
- Resume from exact prison day
- Player progress, stats, tattoos, gang rep, etc.

### Save Code Export/Import ⭐ NEW
- Generate Base64-encoded save codes
- Export via modal with copy-to-clipboard
- Import save codes from any device/browser
- Session-independent (works across devices)
- Version tracking
- Invalid code detection

**Save Code Format:**
```javascript
{
    v: "1.3.0",      // Version
    p: { /* player object */ }
}
// Encoded as Base64 + URI encoding
```

**Documentation:** [docs/systems/SAVE_CODE_SYSTEM.md](docs/systems/SAVE_CODE_SYSTEM.md)
**Status:** ✅ New in v1.3.0

---

## SOUND & AUDIO

### Web Audio API System
- Police siren (alternating 800Hz/600Hz)
- Handcuff click sound
- Cop mumbling (Sims-style gibberish)
- Gavel strike (courtroom)
- Prison door clang
- Volume controls (0-100%)
- Mute toggle
- Preferences saved to localStorage

### Voice Preview System
- 4 distinct voice types with audio preview
- ADSR envelopes
- Bandpass filtering (400-1200Hz)
- LFO vibrato
- Used for Judge Hardcastle

**Voice Types:**
1. Deep and Resigned (120Hz, triangle wave)
2. High and Anxious (280Hz, vibrato)
3. Monotone Bureaucrat (190Hz, square wave)
4. Disturbingly Enthusiastic (220Hz, ascending)

**Status:** ✅ Fully Implemented (v0.3.0, v1.2.0)

---

## DEVELOPER TOOLS

### Dev Mode ⭐ NEW
- Cheat code: Type "DEBUG" on main menu
- Settings toggle
- Semi-transparent overlay (top-right)
- Real-time stat display
- API usage counter
- Recent logs display
- Quick actions (test API, random event, jump screens)
- Stat modification buttons
- Collapsible interface

### Debug Logging ⭐ NEW
- 4 log levels: INFO, DEBUG, WARN, ERROR
- 15 system categories
- Format: `[VROOM] [LEVEL] [System] Message`
- 100-log circular buffer
- Export to JSON
- Full log viewer modal

### API Monitoring ⭐ NEW
- Total/success/failed call counts
- Average response time
- Rate limit detection (warns at 60 calls/min)
- Last 20 calls history
- API key status indicator
- Call detail inspection

### Testing Menu
- "TEST" cheat code on main menu
- 10 system shortcuts (jump to any activity)
- 4 debug tools (add credits, cigarettes, gang rep, reset)
- Direct access without progression

**Documentation:**
- [docs/integration/DEV_MODE_INTEGRATION.md](docs/integration/DEV_MODE_INTEGRATION.md)
- [docs/systems/DEBUG_REFERENCE.md](docs/systems/DEBUG_REFERENCE.md)
- [docs/systems/DEV_MODE_SUMMARY.md](docs/systems/DEV_MODE_SUMMARY.md)
- [docs/systems/LOGGING_EXAMPLES.md](docs/systems/LOGGING_EXAMPLES.md)

**Status:** ✅ New in v1.3.0

---

## SYSTEM STATUS REFERENCE

### Version History

| Version | Date | Major Features |
|---------|------|----------------|
| **1.3.0** | 2025-10-14 | Hospital clinic, conjugal visits, guard manicures, dev mode, save codes, tattoo placement, mobile support |
| **1.2.0** | 2025-10-13 | Car selection, voice preview, Gemini API migration |
| **1.1.0** | 2025-10-13 | Testing/debug menu |
| **1.0.0** | 2025-10-13 | Tattoos, gangs, escape planning |
| **0.3.0** | 2025-10-13 | Sound system, Gemini API |
| **0.2.0** | 2025-10-12 | Disco Elysium art, cinematics, prison activities |
| **0.1.0** | 2025-10-11 | Core driving, police, court, prison |

### Current Implementation Status

```
✅ FULLY IMPLEMENTED (Production-Ready)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Character Creation (car selection, voice preview)
✓ Driving & World (desktop + mobile)
✓ Police & Arrest (AI pursuit, cinematics)
✓ Court System (Judge Hardcastle, AI charges)
✓ Tattoo System (drawing, placement, infection, clinic)
✓ Gang System (3 gangs, reputation, interactions)
✓ Escape Planning (4 routes, consequences)
✓ Weight Lifting (full simulation)
✓ Eating Simulator (hunger tracking)
✓ Library System (3 books, intelligence)
✓ Commissary Shop (credit economy)
✓ Medical Clinic (treat infections)
✓ Conjugal Visits (contraband, good behavior)
✓ Guard Manicures (favor tokens, bribery)
✓ Save System (localStorage + save codes)
✓ Sound System (Web Audio API)
✓ Dev Mode (logging, API monitoring, debugging)
✓ Testing Menu (cheat codes, shortcuts)

⚠️ BASIC / NEEDS ENHANCEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠ Cellmate System (only 3 static dialogues)
⚠ Letter System (no responses, static)
⚠ Random Events (designed but not implemented)
⚠ Stats Impact (tracked but not used in gameplay)

📋 DESIGNED / NOT IMPLEMENTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
○ 20 Random Prison Events (spec complete)
○ Reputation System (guards/inmates/warden/legend)
○ Condition Cascades (hunger/strength/intelligence effects)
○ Cellmate Depth (relationship progression)
○ Letter Responses (AI or scripted)
```

### File Organization

```
vroom-vroom/
├── game/                          # Main game files
│   ├── index.html                 # Main game HTML
│   ├── game.js                    # Core game logic
│   ├── tattoo-system.js           # Tattoo drawing system
│   ├── soundsystem.js             # Web Audio API
│   ├── car-selection.js           # Car preview
│   ├── debug-logger.js            # ⭐ NEW: Logging utility
│   ├── api-monitor.js             # ⭐ NEW: API tracking
│   ├── dev-mode.js                # ⭐ NEW: Dev overlay
│   ├── dev-mode.css               # ⭐ NEW: Dev styles
│   └── README.md                  # Game-specific readme
│
├── docs/
│   ├── systems/                   # ⭐ ORGANIZED: System references
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
│   ├── integration/               # ⭐ ORGANIZED: Integration guides
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
├── SYSTEMS.md                     # ⭐ THIS FILE: Master system reference
├── CHANGELOG.md                   # Complete version history
├── claude.md                      # Claude Code configuration
└── README.md                      # Project overview
```

### Documentation Quick Reference

| What You Need | Where To Look |
|---------------|---------------|
| **System Overview** | This file (SYSTEMS.md) |
| **Version History** | CHANGELOG.md |
| **Specific System Details** | docs/systems/{SYSTEM_NAME}.md |
| **Integration Instructions** | docs/integration/ |
| **Development Tools** | docs/systems/DEV_MODE_*.md |
| **API Documentation** | docs/systems/API_VERIFICATION_REPORT.md |
| **Code Examples** | docs/systems/LOGGING_EXAMPLES.md |

---

## QUICK START FOR DEVELOPERS

### 1. Understanding the Game
```bash
# Read these in order:
1. README.md              # Project overview
2. SYSTEMS.md            # This file - all systems
3. CHANGELOG.md          # What's been added
```

### 2. Setting Up Development
```bash
# Enable dev mode:
1. Open game in browser
2. Type "DEBUG" on main menu
3. Dev overlay appears

# Or use testing menu:
1. Type "TEST" on main menu
2. Jump to any system
3. Add resources with debug tools
```

### 3. Adding a New System
```bash
# Follow this pattern:
1. Design system (docs/systems/YOUR_SYSTEM.md)
2. Implement in game.js
3. Create integration guide (docs/integration/YOUR_SYSTEM_INTEGRATION.md)
4. Add to CHANGELOG.md
5. Update this file (SYSTEMS.md)
```

### 4. Debugging
```bash
# Use comprehensive logging:
logger.info('PRISON', 'Player started activity');
logger.debug('TATTOO', 'Design grid updated');
logger.warn('SAVE', 'Save took longer than expected');
logger.error('API', 'API call failed');

# View logs:
- Dev overlay shows last 5 logs
- Click "View All Logs" for full viewer
- Export logs for bug reports
```

---

## FUTURE ENHANCEMENTS

### Priority: HIGH
- [ ] Implement 20 random prison events
- [ ] Add reputation system (guards/inmates/warden/legend)
- [ ] Make stats matter (hunger/strength/intelligence gameplay effects)
- [ ] Enhance cellmate system (relationship progression)

### Priority: MEDIUM
- [ ] Letter response system (AI or scripted)
- [ ] Condition cascades (hunger affects strength, etc.)
- [ ] More escape routes
- [ ] Prison job system

### Priority: LOW
- [ ] Multiplayer support
- [ ] Achievement system
- [ ] Steam integration
- [ ] Mod support

---

## NOTES FOR MAINTAINERS

### When Adding a New System:
1. ✅ Create system reference doc in `docs/systems/`
2. ✅ Create integration guide in `docs/integration/`
3. ✅ Update this file (SYSTEMS.md)
4. ✅ Update CHANGELOG.md
5. ✅ Add logging throughout system
6. ✅ Add to testing menu if applicable
7. ✅ Update save/load if needed

### When Modifying Existing System:
1. ✅ Update relevant docs in `docs/systems/`
2. ✅ Update CHANGELOG.md
3. ✅ Update this file if major changes
4. ✅ Test with dev mode enabled
5. ✅ Verify save/load compatibility

### Documentation Standards:
- **System Docs:** Comprehensive technical reference
- **Integration Docs:** Step-by-step implementation
- **This File:** High-level overview with links
- **CHANGELOG:** User-facing changes
- **Code Comments:** Why, not what

---

## CONTACT & SUPPORT

**Issues:** [GitHub Issues](https://github.com/githumps/vroom-vroom/issues)
**Discussions:** [GitHub Discussions](https://github.com/githumps/vroom-vroom/discussions)
**Wiki:** [GitHub Wiki](https://github.com/githumps/vroom-vroom/wiki)

---

**Last Updated:** 2025-10-14
**Current Version:** 1.3.0
**Next Planned Release:** 1.4.0 (Random Events & Reputation System)

**Status:** ✅ ALL CORE SYSTEMS IMPLEMENTED
**Production Ready:** ✅ YES
**Documentation:** ✅ COMPREHENSIVE
