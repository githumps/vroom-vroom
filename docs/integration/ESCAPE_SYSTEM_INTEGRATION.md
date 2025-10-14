# Prison Escape System - Integration Guide

## Overview
Complete escape planning and execution system with 4 escape routes, each requiring preparation, items/allies, and offering risk/reward gameplay.

## Files Created
1. **escape_system_html.txt** - HTML screens for escape menu and route detail
2. **escape_system_js.txt** - Complete JavaScript implementation

## Features Implemented

### 1. Four Escape Routes

#### Tunnel Escape (30% base success, +10 years if caught)
- Requires: spoon, blueprints, hiding spot for debris
- Actions: steal spoon, get blueprints, prepare hiding, dig tunnel
- Classic prison break approach

#### Bribe a Guard (45% base success, +12 years if caught)
- Requires: 30 cigarettes, guard info, leverage, fake ID
- Actions: buy smokes, find guard, find leverage, get fake ID, make deal
- Social engineering approach

#### Manipulate Transfer (55% base success, +15 years if caught)
- Requires: blank forms, official stamp, forged signatures, computer access, uniform
- Actions: steal forms, get stamp, forge signatures, hack system, get uniform, execute transfer
- Bureaucratic approach (most thematic with game's themes)

#### Incite a Riot (40% base success, +20 years if caught)
- Requires: multiple allies including Safe Drivers Club, weapons, distraction plan
- Actions: recruit various groups, craft weapon, plan distraction, start riot
- Chaotic approach with highest penalty if caught

### 2. Planning System
- Each route has multiple preparation steps
- Each step takes time (days) and has success/failure chance
- Progress tracked per route
- Requirements must be met before escape attempt

### 3. Success/Failure Mechanics
- Base success rate increases with preparation
- Gang membership provides +10% bonus
- Successful escape returns player to driving world
- Failed escape adds significant time to sentence and resets progress

### 4. Integration with Existing Systems
- Uses existing gang system (bonus for gang members)
- Uses existing time system (prison days)
- Uses cinematics system for escape success
- Tracks contraband items (file in cake, lockpicks, etc.)

## Integration Steps

### Step 1: Add HTML to index.html
Insert the content from **escape_system_html.txt** before the `<!-- CREDITS -->` section.

Location: After `<!-- BOOK READING SCREEN -->` div

### Step 2: Add JavaScript to game.js
Insert the content from **escape_system_js.txt** after the gang methods (around line 1650, after `sendLetter()` method).

### Step 3: Update Player Constructor
Add escapeProgress property to player object in constructor (around line 588):

```javascript
escapeProgress: {
    tunnel: { progress: 0, items: [], completedActions: [] },
    bribe: { progress: 0, items: [], completedActions: [] },
    transfer: { progress: 0, items: [], completedActions: [] },
    riot: { progress: 0, allies: [], completedActions: [] }
}
```

### Step 4: Add Escape Button to Prison Menu
Add this prison activity to the prisonMenu div in index.html (around line 643):

```html
<div class="prison-activity" onclick="game.showEscapeMenu()">
    <h3>PLAN ESCAPE</h3>
    <p>Freedom. It's possible. Probably. Maybe. Worth a try.</p>
</div>
```

### Step 5: Update prisonActivity Method
Modify the prisonActivity method in game.js to handle the escape activity:

```javascript
else if (activity === 'escape') {
    this.showEscapeMenu();
    return; // Don't add prison day
}
```

## Testing Checklist
- [ ] Escape menu displays all 4 routes with progress
- [ ] Clicking a route shows detailed view
- [ ] Action buttons work and consume time
- [ ] Success/failure mechanics work correctly
- [ ] Failed actions can be retried
- [ ] Successful escape returns to driving
- [ ] Failed escape adds penalty years
- [ ] Gang membership bonus applies
- [ ] Progress persists through save/load
- [ ] All requirements track properly

## Design Notes

### Success Rates
- Base rates reflect difficulty (tunnel=30%, bribe=45%, transfer=55%, riot=40%)
- Preparation adds up to +20% bonus (from 100% completion)
- Gang membership adds +10%
- Maximum achievable: ~85% for transfer route with gang

### Time Investment
- Each route requires 10-20+ prison days of preparation
- Failed attempts lose time but can retry
- Successful escape: return to freedom
- Failed escape: massive time penalty + reset

### Thematic Elements
- **Tunnel**: Classic, patient, physical
- **Bribe**: Social, corrupting, transactional
- **Transfer**: Bureaucratic (fits game's theme perfectly)
- **Riot**: Chaotic, violent, desperate

### Balance Considerations
- Transfer route has highest success but highest penalty (15 years)
- Riot has lowest success but highest penalty (20 years)
- All routes require significant investment
- Risk/reward is balanced against just serving time

## Future Enhancements (Optional)
1. Random events during planning (guard inspections, cellmate betrayal)
2. Contraband discovery mini-games
3. Multiple escape attempts with escalating difficulty
4. Different endings based on escape method
5. AI-generated judge reactions if caught
6. Escape attempt cinematics (success animations)
7. Ally recruitment dialogue trees
8. Item crafting system for contraband

## File Locations
- C:\Users\evan\Documents\GitHub\vroom-vroom\game\escape_system_html.txt
- C:\Users\evan\Documents\GitHub\vroom-vroom\game\escape_system_js.txt
- C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html (target for HTML)
- C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js (target for JavaScript)
