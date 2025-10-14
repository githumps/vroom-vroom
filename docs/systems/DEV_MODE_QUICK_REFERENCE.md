# VROOM VROOM - Dev Mode Quick Reference Card

**Fast reference for common dev mode operations**

---

## Activation

| Method | Action |
|--------|--------|
| Main Menu | Type **"DEBUG"** |
| Settings | Toggle "Enable Developer Mode" |
| Console | `window.devMode.toggle()` |
| Testing Menu | Type **"TEST"** on main menu |

---

## Log Levels

| Level | Color | When to Use |
|-------|-------|-------------|
| **INFO** | Cyan | Successful operations, state changes |
| **DEBUG** | Green | Detailed tracing, variable values |
| **WARN** | Yellow | Warnings, degraded functionality |
| **ERROR** | Red | Errors, failures, exceptions |

---

## Logging Syntax

```javascript
// Basic log
vroomLogger.info('SYSTEM', 'Message here');

// With data
vroomLogger.debug('API', 'Request sent', { url: '...' });

// Different levels
vroomLogger.warn('SAVE', 'Storage almost full');
vroomLogger.error('API', 'Network failed', { error: err });
```

---

## System Categories

```
API       - API calls and responses
SAVE      - Save/load operations
PRISON    - Prison activities
TATTOO    - Tattoo system
GANG      - Gang interactions
DRIVING   - Driving mechanics
COURT     - Court/judge system
USER      - User actions
EATING    - Eating simulator
WEIGHTS   - Weight lifting
LIBRARY   - Library/reading
COMMISSARY - Shop system
ESCAPE    - Escape planning
CINEMATIC - Cutscenes
SOUND     - Audio system
```

---

## Dev Overlay Controls

```
┌─────────────────────────────┐
│ DEV MODE            [−] [×] │ ← Header
├─────────────────────────────┤
│ Screen: prisonMenu          │ ← Current screen
│ Credits: 150 | Cigs: 25     │ ← Player stats
│ API Calls: 12 | Success: 11 │ ← API stats
│ [Recent Logs]               │ ← Last 5 logs
│ [Quick Actions]             │ ← Test/Debug buttons
│ [Jump To Screen ▼]          │ ← Screen dropdown
│ [Modify Stats]              │ ← Cheat buttons
└─────────────────────────────┘
```

**Buttons**:
- **[−]** = Collapse/expand
- **[×]** = Close dev mode

---

## Quick Actions

| Button | Action |
|--------|--------|
| **Test API** | Validate API key connection |
| **Random Event** | Trigger test event |
| **View Logs** | Open full log viewer modal |
| **Reset API** | Clear API statistics |

---

## Stat Cheats

| Button | Effect |
|--------|--------|
| **+100 Credits** | Adds 100 credits |
| **+20 Cigs** | Adds 20 cigarettes |
| **Max Stats** | Sets all stats to maximum |

---

## Console Commands

### Dev Mode
```javascript
window.devMode.enable();          // Enable
window.devMode.disable();         // Disable
window.devMode.toggle();          // Toggle
```

### Logging
```javascript
vroomLogger.enableDevMode();      // Enable logging
vroomLogger.disableDevMode();     // Disable logging
vroomLogger.clearLogs();          // Clear history
vroomLogger.getLogs();            // Get all logs
vroomLogger.exportLogs();         // Export as JSON
```

### API Monitoring
```javascript
apiMonitor.getStats();            // Get statistics
apiMonitor.getHistory(10);        // Get last 10 calls
apiMonitor.reset();               // Reset counters
apiMonitor.getApiKeyStatus();     // Check key status
```

### Game State
```javascript
game.saveGame();                  // Save game
game.loadGame();                  // Load game
game.showScreen('prisonMenu');    // Jump to screen
game.player.money = 9999;         // Set credits
game.player.cigarettes = 999;     // Set cigarettes
```

---

## Instrumenting API Calls

### Before/After Pattern
```javascript
// Start monitoring
const callId = window.apiMonitor.startCall({
    prompt: prompt,
    model: 'gemma-3-27b-it',
    type: 'charge_generation'
});

// Log start
vroomLogger.info('API', 'Requesting charges');

try {
    // Make API call
    const response = await fetch(url, options);

    // End monitoring - success
    window.apiMonitor.endCall(callId, true, responseData);
    vroomLogger.info('API', 'Charges generated');

} catch (error) {
    // End monitoring - failure
    window.apiMonitor.endCall(callId, false, null, error);
    vroomLogger.error('API', 'Request failed', { error });
}
```

---

## Common Logging Patterns

### Save/Load
```javascript
vroomLogger.info('SAVE', 'Saving game', { playerName: 'John' });
// ... save operation ...
vroomLogger.debug('SAVE', 'Game saved successfully');
```

### User Actions
```javascript
vroomLogger.info('USER', 'Button clicked: Start Game');
```

### State Transitions
```javascript
vroomLogger.info('SYSTEM', 'State transition', {
    from: 'menu',
    to: 'driving'
});
```

### Error Handling
```javascript
try {
    // operation
} catch (error) {
    vroomLogger.error('SYSTEM', 'Operation failed', {
        error: error.message,
        stack: error.stack
    });
}
```

---

## Testing Menu Options

Access via **"TEST"** cheat code:

```
Jump to System:
├── Tattoo System
├── Gang System
├── Escape System
├── Weight Lifting
├── Eating Simulator
├── Library System
├── Commissary Shop
├── Prison Menu
├── Courtroom
└── Driving Mode

Debug Tools:
├── Add 100 Credits
├── Add 20 Cigarettes
├── Max All Gang Reps
└── Reset All Progress

New Debug (with Dev Mode):
├── Test API Call
├── View All Logs
├── Simulate Infection
├── Contraband Search
└── Random Event
```

---

## API Stats Explained

```
Total: 12        - Total API calls this session
Success: 11      - Successful calls
Failed: 1        - Failed calls
Last: 3:45 PM    - Last call timestamp
Avg: 1243ms      - Average response time
Key: Set ✓       - API key is configured
```

**Rate Limiting**:
- Free tier: 14,000 requests/day
- Recommended: <60 requests/minute
- Warning shows if approaching limit

---

## Log Viewer

**Access**: Click "View Logs" in dev overlay or testing menu

**Features**:
- Full log history (last 100 entries)
- Timestamps for each entry
- Copy to clipboard button
- Clear logs button
- Scrollable text area

**Format**:
```
[3:45:12 PM] [INFO] [USER] Button clicked: Start
[3:45:10 PM] [DEBUG] [SAVE] Game saved
[3:45:05 PM] [WARN] [API] Rate limit warning
[3:45:00 PM] [ERROR] [SAVE] Save failed
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Overlay not showing | Check main menu, type "DEBUG" again |
| Logs not appearing | Check `vroomLogger.enabled` in console |
| API stats at zero | Make API call (get arrested) |
| Overlay too big | Click [−] to collapse |
| Stats not updating | Check console for errors |

### Reset Everything
```javascript
vroomLogger.clearLogs();
apiMonitor.reset();
window.devMode.disable();
window.devMode.enable();
```

---

## localStorage Flags

```javascript
// Check dev mode
localStorage.getItem('vroomVroomDevMode')  // 'true' or null

// Enable dev mode
localStorage.setItem('vroomVroomDevMode', 'true')

// Disable dev mode
localStorage.removeItem('vroomVroomDevMode')

// Clear all
localStorage.clear()
```

---

## sessionStorage Flags

```javascript
// Check API key
sessionStorage.getItem('gemini_api_key')  // Key or null

// View API stats
sessionStorage.getItem('vroomApiStats')  // JSON string

// Clear session
sessionStorage.clear()
```

---

## Keyboard Shortcuts

| Keys | Action |
|------|--------|
| **DEBUG** | Toggle dev mode (main menu) |
| **TEST** | Open testing menu (main menu) |
| **Space** | Stop driving (when driving) |

---

## Integration Checklist

```
□ Add script tags to index.html
□ Add DEBUG cheat code listener
□ Add dev mode toggle to settings
□ Instrument API calls with monitoring
□ Add logging to key game events
□ Add testing menu debug options
□ Test dev mode activation
□ Test API monitoring
□ Test log viewer
□ Test quick actions
```

---

## File Locations

```
game/
├── debug-logger.js          ← Logger utility
├── api-monitor.js           ← API tracking
├── dev-mode.js              ← Dev overlay
├── dev-mode.css             ← Overlay styles
├── DEV_MODE_INTEGRATION.md  ← Integration guide
├── API_VERIFICATION_REPORT.md  ← API audit
├── DEBUG_REFERENCE.md       ← Full reference
├── LOGGING_EXAMPLES.md      ← Code examples
└── DEV_MODE_SUMMARY.md      ← Overview
```

---

## Support Resources

**Full Documentation**:
- `DEV_MODE_INTEGRATION.md` - Step-by-step integration
- `DEBUG_REFERENCE.md` - Complete reference
- `LOGGING_EXAMPLES.md` - Copy-paste code
- `API_VERIFICATION_REPORT.md` - API analysis

**Console Help**:
```javascript
// Check if systems loaded
console.log(window.devMode);      // DevMode object
console.log(window.vroomLogger);  // VroomLogger object
console.log(window.apiMonitor);   // ApiMonitor object
```

---

**Quick Reference Version**: 1.0.0
**Last Updated**: 2025-10-14

---

## One-Liners for Copy-Paste

```javascript
// Enable dev mode
window.devMode.enable();

// Add logging to function
vroomLogger.info('SYSTEM', 'Function started');

// Monitor API call
const id = apiMonitor.startCall(data); /* do fetch */ apiMonitor.endCall(id, true);

// View all logs
window.devMode.showLogViewer();

// Jump to screen
game.showScreen('prisonMenu');

// Add credits
game.player.money += 100; game.saveGame();

// Check API stats
console.table(apiMonitor.getStats());

// Export logs
console.log(vroomLogger.exportLogs());
```

---

**Print this page for quick reference during development!**
