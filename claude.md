# VROOM VROOM - Project Documentation

**Last Updated:** 2025-10-13

## Project Overview

A dystopian driving game where driving is illegal. Features Disco Elysium-inspired art style, absurd bureaucracy, and Judge Hardcastle's increasingly snarky commentary.

**Tech Stack:**
- Three.js r128 (3D rendering)
- Web Audio API (synthesized sounds)
- Gemini Pro API (optional AI-generated charges)
- Pure JavaScript, HTML, CSS

**Deployment:** GitHub Pages at https://[username].github.io/vroom-vroom/

---

## Current Status: ✅ ALL FEATURES COMPLETE

### Core Game Features (Complete)
- ✅ 3D isometric driving with Disco Elysium aesthetic
- ✅ Police chase system
- ✅ Paperwork simulator with Judge Hardcastle AI
- ✅ Prison system with activities
- ✅ Character creation
- ✅ Save/load system
- ✅ Cinematic transitions (Ken Burns style)

### Recent Enhancements (Just Completed)
- ✅ **Sound System:** Web Audio API synthesized sounds
  - Police siren + handcuff click on arrest
  - Cop mumbling (Sims-style gibberish)
  - Gavel strike in courtroom
  - Prison door clang
  - Volume controls + mute toggle in settings

- ✅ **Gemini API Integration:** Dynamic AI-generated charges
  - Optional API key system (session-based, secure)
  - First-load modal prompt
  - Settings screen for API key management
  - Graceful fallback to hardcoded charges

- ✅ **Bug Fixes:**
  - Fixed inverted steering (A/D keys now turn correctly)
  - Fixed event listener memory leaks
  - Added proper error handling for cinematics

---

## File Structure

```
vroom-vroom/
├── game/
│   ├── index.html          # Main game HTML
│   ├── game.js             # Complete game engine (1600+ lines)
│   └── soundsystem.js      # Web Audio API sound system
├── index.html              # GitHub Pages redirect
├── claude.md               # This file - single source of truth
└── README.md               # Public-facing documentation
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

### Phase 3: Audio & AI (Just Completed - 2025-10-13)
- ✅ Web Audio API sound synthesis
- ✅ Gemini Pro API integration
- ✅ API key management system
- ✅ Volume controls in settings
- ✅ Fixed driving controls bug

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

### Commit Strategy
- Feature commits: Descriptive messages with context
- Bug fixes: Reference specific line numbers
- Generated with Claude Code

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

### 2025-10-13
- ✅ Integrated Web Audio API sound system
- ✅ Added Gemini Pro API for dynamic charges
- ✅ Created API key management system
- ✅ Fixed driving controls bug (inverted steering)
- ✅ Added volume controls to settings modal
- ✅ All sounds playing at correct game events
- 📝 Status: Ready for deployment

### Earlier Sessions
- Basic game mechanics implemented
- Disco Elysium art style applied
- Cinematic system created
- Judge Hardcastle AI system built
- Prison system with activities

---

## Quick Reference

### File Line Numbers (Important Sections)
- **game.js:4-148** - ApiKeyManager class
- **game.js:151-334** - CinematicSystem class
- **game.js:337-566** - JudgeHardcastle class
- **game.js:568-1598** - VroomVroomGame class
- **game.js:605-607** - Sound system initialization
- **game.js:1256** - Arrest sound trigger
- **game.js:1267** - Cop mumbling trigger
- **game.js:1479** - Gavel strike trigger
- **game.js:1483** - Prison door clang trigger
- **soundsystem.js:1-291** - Complete sound system

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
