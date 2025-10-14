# Gang Alliance and Relationship System - Integration Guide

## Overview
This document provides complete instructions for integrating the gang alliance and relationship system into the VROOM VROOM prison game.

## Files Created
1. `gang_system_html.txt` - HTML markup for gang system screens
2. `gang_system_js.txt` - JavaScript implementation code
3. This guide - `GANG_SYSTEM_INTEGRATION_GUIDE.md`

---

## STEP 1: Update Player Object (game.js)

In the `VroomVroomGame` constructor, add these properties to the `this.player` object (around line 576):

```javascript
gangRep: { safedrivers: 0, turnsignals: 0, roadwarriors: 0 },
currentGang: null,
cigarettes: 0,
gangEvents: []
```

The complete player object section should look like:

```javascript
this.player = {
    name: '',
    skinTone: 2,
    height: 175,
    voice: 'deep',
    wantedLevel: 0,
    speed: 0,
    drivingTime: 0,
    prisonDays: 0,
    sentence: 5,
    tattoos: [],
    gangMember: false,
    letters: [],
    lastPlayed: Date.now(),
    prisonStartTime: null,
    eventHistory: [],
    intelligence: 0,
    booksRead: [],
    bookProgress: [0, 0, 0],
    money: 0,
    inventory: {},
    // NEW GANG SYSTEM PROPERTIES:
    gangRep: { safedrivers: 0, turnsignals: 0, roadwarriors: 0 },
    currentGang: null,
    cigarettes: 0,
    gangEvents: []
};
```

---

## STEP 2: Add HTML Screens (index.html)

Insert the contents of `gang_system_html.txt` into `index.html` BEFORE the `<!-- CREDITS -->` section (around line 748).

The two screens to add are:
1. `gangSystem` - Main gang overview screen
2. `gangInteraction` - Individual gang interaction screen

---

## STEP 3: Add JavaScript Methods (game.js)

Copy all the methods from `gang_system_js.txt` into the `VroomVroomGame` class in `game.js`.

Add them AFTER the `sendLetter()` method (around line 1093) and BEFORE the `endPrison()` method.

The methods to add are:
- `initializeGangSystem()`
- `showGangSystem()`
- `updateGangUI()`
- `getGangName(gangId)`
- `getGangInfo(gangId)`
- `interactWithGang(gangId)`
- `getGangDialogue(gangId, rep)`
- `gangAction(action)`
- `gangActionTalk(gangId, rep)`
- `gangActionShareCigarettes(gangId)`
- `gangActionTrade(gangId, rep)`
- `gangActionJoin(gangId, rep)`
- `adjustGangRep(gangId, amount)`
- `triggerGangEvent(gangId)`
- `randomGangEvent()`
- `getCellmateGangAffiliation()`
- `cellmateGangDialogue()`

---

## STEP 4: Update prisonActivity Method (game.js)

Find the `prisonActivity(activity)` method (around line 1007) and add the gang handling:

```javascript
prisonActivity(activity) {
    this.player.prisonDays += 1;
    document.getElementById('timeServed').textContent = this.player.prisonDays;

    const messages = {
        // ... existing messages ...
    };

    // ADD THIS CONDITION:
    if (activity === 'gang') {
        this.showGangSystem();
        return;
    }

    // Rest of existing code...
}
```

---

## STEP 5: Update Prison Menu (index.html)

The prison menu button for gangs already exists in the HTML:

```html
<div class="prison-activity" onclick="game.prisonActivity('gang')">
    <h3>JOIN A GANG</h3>
    <p>The "Safe Drivers Club" is recruiting.</p>
</div>
```

No changes needed - this will now properly route to the gang system.

---

## STEP 6: Optional Enhancements

### A. Add Random Gang Events to Prison Activities

In the `prisonActivity()` method, call `this.randomGangEvent()` at the end to trigger random gang-related events.

### B. Integrate with Cellmate Dialogue

In the `prisonActivity('cellmate')` case, replace or add to the messages array:

```javascript
cellmate: [
    this.cellmateGangDialogue(),
    'Your cellmate: "I was just going to the store. That\'s all."',
    'Your cellmate: "Five years for driving. FIVE YEARS."',
    'Your cellmate stares at the wall. You understand completely.'
]
```

### C. Add Cigarette Rewards to Activities

Modify prison activities to sometimes reward cigarettes:

```javascript
// Example: Add cigarettes to commissary visit
if (activity === 'commissary') {
    const cigChance = Math.random();
    if (cigChance < 0.3) {
        this.player.cigarettes += Math.floor(Math.random() * 3) + 1;
        this.showMessage('You found some cigarettes!', 2000);
    }
}
```

---

## Gang System Features

### Three Gangs

1. **Safe Drivers Club**
   - Color: Blue (#4A8BFF)
   - Philosophy: Lawful, rule-following drivers
   - Leader: Marcus "Signal" Patterson
   - Benefits: Commissary discounts, Library access, Meditation
   - Enemies: Road Warriors

2. **The Turn Signals**
   - Color: Orange (#FFB84A)
   - Philosophy: Communication and diplomacy
   - Leader: Jasmine "Blinker" Chen
   - Benefits: Information network, Extra yard time, Better cellmates
   - Enemies: None (neutral)

3. **Road Warriors**
   - Color: Red (#FF4A4A)
   - Philosophy: Fast driving, no regrets
   - Leader: Viktor "Redline" Volkov
   - Benefits: Protection, Gym access, Black market
   - Enemies: Safe Drivers Club

### Reputation System

- Range: -100 (Hostile) to +100 (Allied)
- Reputation Levels:
  - **-100 to -50**: HOSTILE (refuse to interact)
  - **-50 to -20**: UNFRIENDLY (limited interaction)
  - **-20 to +20**: NEUTRAL (basic interaction)
  - **+20 to +50**: FRIENDLY (full interaction)
  - **+50 to +100**: ALLIED (can join gang)

### Actions

1. **Talk to Leader** (+2 to +4 rep, costs 1 day)
2. **Share Cigarettes** (+7 to +14 rep, costs 5 cigarettes + 1 day)
3. **Trade Items** (gain cigarettes, +1 to +3 rep, costs 1 day)
4. **Join Gang** (requires 50+ rep, makes enemy gangs hostile)

### Game Impact

- Joining a gang:
  - Grants access to gang benefits
  - Makes enemy gangs hostile (-50 rep)
  - Triggers special gang events
  - Affects cellmate interactions
- Random events occur when you're a gang member
- Cellmates have gang affiliations that affect dialogue

---

## Testing Checklist

After integration, test the following:

1. [ ] Navigate to Prison Menu
2. [ ] Click "JOIN A GANG" activity
3. [ ] Gang System screen displays with 3 gangs
4. [ ] Player status shows "None" for current gang and 0 cigarettes
5. [ ] All three gang reputation bars display
6. [ ] Click "INTERACT" on Safe Drivers Club
7. [ ] Gang interaction screen displays
8. [ ] Try "Talk to Leader" (should work)
9. [ ] Try "Share Cigarettes" (should fail - not enough cigarettes)
10. [ ] Try "Trade Items" (should work if rep >= 0)
11. [ ] Try "Join Gang" (should fail - rep too low)
12. [ ] Perform actions to raise rep to 50+
13. [ ] Join the gang successfully
14. [ ] Check that enemy gang (Road Warriors) reputation dropped
15. [ ] Return to gang system, verify "Current Gang" displays correctly
16. [ ] Interact with your gang again, verify dialogue changes
17. [ ] Test gang events trigger randomly in prison activities

---

## File Locations

All files are in: `C:\Users\evan\Documents\GitHub\vroom-vroom\game\`

- `gang_system_html.txt` - Copy HTML from here to index.html
- `gang_system_js.txt` - Copy JavaScript from here to game.js
- `GANG_SYSTEM_INTEGRATION_GUIDE.md` - This file

---

## Code Structure Summary

### HTML Structure
```
gangSystem (screen)
├── Player Status (gang, cigarettes)
├── Safe Drivers Club (activity div)
├── The Turn Signals (activity div)
├── Road Warriors (activity div)
└── Return Button

gangInteraction (screen)
├── Gang Title
├── Gang Info Content (dynamic)
├── Action Buttons (talk, share, trade, join)
└── Back Button
```

### JavaScript Structure
```
initializeGangSystem() - Setup gang data
showGangSystem() - Display gang overview
updateGangUI() - Refresh UI elements
getGangName() - Get gang display name
getGangInfo() - Get gang data object
interactWithGang() - Show gang interaction screen
getGangDialogue() - Generate contextual dialogue
gangAction() - Route actions
gangActionTalk() - Handle talking
gangActionShareCigarettes() - Handle sharing
gangActionTrade() - Handle trading
gangActionJoin() - Handle joining
adjustGangRep() - Modify reputation
triggerGangEvent() - Create gang events
randomGangEvent() - Random event chance
getCellmateGangAffiliation() - Assign cellmate gang
cellmateGangDialogue() - Gang-based cellmate dialogue
```

---

## Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Verify all methods were copied correctly
3. Ensure player object has all new properties
4. Confirm HTML element IDs match JavaScript selectors
5. Test with a new game save to avoid old data conflicts

---

## Future Enhancements

Potential additions to expand the system:

1. Gang wars/conflicts (random events where gangs fight)
2. Gang missions/quests
3. Gang territory control
4. Multiple gang membership levels (recruit, member, lieutenant, etc.)
5. Gang-specific tattoos and items
6. Reputation decay over time
7. Gang rivalries affecting prison activities
8. Guard reactions to gang affiliation
9. Gang escape planning mechanic
10. Post-prison gang connections

---

**Implementation Complete!**

The gang system adds significant depth to the prison experience with:
- 3 distinct gangs with unique philosophies
- Dynamic reputation system (-100 to +100)
- 4 interaction types
- Cigarette economy
- Random events
- Cellmate integration
- Enemy/ally dynamics
