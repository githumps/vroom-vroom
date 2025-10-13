# 🚗 VROOM VROOM 🚔

> *Drive. Get arrested. Fill out paperwork. Go to prison. Repeat.*

## Play Now

Open `game/index.html` in your browser.

## What Is This?

An absurdist driving simulator where **driving is illegal**. You'll face:
- Over-zealous police presence
- Judge Hardcastle (who is very disappointed in you)
- Excessive bureaucratic paperwork
- Prison (with activities)
- Melancholic Disco Elysium-inspired visuals

## Controls

- **WASD/Arrows** - Drive (briefly)
- **Space** - Pull over voluntarily
- **Mouse** - Fill out forms, do prison activities

## Features

✅ **Disco Elysium Art Style** - Painterly isometric view with muted colors
✅ **Judge Hardcastle AI** - Increasingly snarky judge commentary as you fill forms
✅ **Cinematic Transitions** - Ken Burns-style dramatic scene changes
✅ **RPG Systems** - 12 skills across 4 attributes (Physical, Mental, Psyche, Motorics)
✅ **Thought Cabinet** - 10 collectible thoughts that affect gameplay
✅ **Prison Simulation** - 8 activities (weights, food, reading, tattoos, gangs, etc.)
✅ **Save/Load System** - Your suffering persists across sessions

## The Game Loop

1. Create character
2. **[CINEMATIC]** The road calls to you
3. Drive for 5-15 seconds
4. **[CINEMATIC]** Police arrest you (handcuffs, weapon drawn)
5. Judge Hardcastle insults you as you fill forms
6. **[CINEMATIC]** Gavel strikes, judge is disappointed
7. **[CINEMATIC]** Prison gates close
8. Do prison activities
9. Eventually get released
10. **[CINEMATIC]** Freedom (temporarily)
11. Drive again

## Technical Details

**Built with:**
- Three.js r128 (3D graphics)
- Vanilla JavaScript (no frameworks)
- CSS3 animations
- LocalStorage saves

**Features:**
- Isometric camera (45° fixed angle)
- Desaturated Disco Elysium color palette
- Atmospheric fog and lighting
- Judge AI with memory system
- Dynamic charge generation
- Skill checks (2d6 + modifiers)

## Project Structure

```
game/           - Playable game (index.html + game.js)
src/            - Advanced systems (skills, thoughts, AI, shaders)
docs/           - Status reports and documentation
Inspiration/    - Disco Elysium art references
archive/        - 80+ files from failed UE5 attempts
```

## Philosophy

Commentary on:
- Bureaucratic absurdity
- Over-policing
- Prison-industrial complex
- The criminalization of normal behavior
- Why are you reading this? Just drive.

## Sample Dialogue

**Judge Hardcastle:**
> "You again. 5 times now. Are you mentally incapable of NOT driving?"

> "INCOMPLETE PAPERWORK? Do you think this is a JOKE?"

**Prison:**
> "You lift the bar. It is heavy, like the weight of bureaucracy."

> "Your cellmate: 'Five years for driving. FIVE YEARS.'"

**Thought Cabinet:**
> "Why Is Driving Illegal? - A fundamental question that haunts you."

## Development History

- **March 2024:** Attempted Unreal Engine 5.6 (80+ docs, extensive C++ code)
- **October 2024:** Built web version in single session
- **October 2024:** Enhanced with Disco Elysium art, Judge AI, RPG systems
- **Now:** Fully playable, cinematic, melancholic masterpiece

## Credits

- **Concept:** Evan & Claude
- **Development:** VROOM VROOM ENFORCER (Claude Code)
- **Inspiration:** Disco Elysium, Papers Please, Kafka
- **Special Thanks:** Everyone who's been pulled over for no reason

---

*"NO EXCUSES WERE ACCEPTED IN THE MAKING OF THIS GAME"*
