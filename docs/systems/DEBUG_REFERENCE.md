# VROOM VROOM - Debugging Reference Guide

Complete reference for the dev mode and debugging system.

---

## Table of Contents
1. [Accessing Dev Mode](#accessing-dev-mode)
2. [Log Levels](#log-levels)
3. [Dev Mode Overlay](#dev-mode-overlay)
4. [API Monitoring](#api-monitoring)
5. [Console Logging](#console-logging)
6. [Testing Menu](#testing-menu)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Troubleshooting](#troubleshooting)

---

## Accessing Dev Mode

### Method 1: Cheat Code (Main Menu)
1. Go to main menu
2. Type **"DEBUG"** (without clicking anything)
3. Dev mode overlay appears

### Method 2: Settings Menu
1. Open Settings from main menu
2. Scroll to "Developer Mode" section
3. Check "Enable Developer Mode"
4. Click Close

### Method 3: Console Command
```javascript
// Enable dev mode
window.devMode.enable();

// Disable dev mode
window.devMode.disable();

// Toggle dev mode
window.devMode.toggle();
```

### Persistence
- Dev mode state is saved in **localStorage**
- Flag: `vroomVroomDevMode`
- Persists across browser sessions
- Can be manually cleared from Application → Local Storage

---

## Log Levels

### INFO (Cyan)
**Purpose**: General information and successful operations

**When to Use**:
- Game state changes
- Successful API calls
- Screen transitions
- User actions (non-error)

**Example**:
```javascript
vroomLogger.info('SYSTEM', 'Game initialized successfully');
vroomLogger.info('SAVE', 'Game saved', { playerName: 'John' });
```

**Console Output**:
```
[VROOM] [INFO] [SYSTEM] Game initialized successfully
```

### DEBUG (Green)
**Purpose**: Detailed debugging information

**When to Use**:
- Function entry/exit
- Variable states
- Calculation results
- Non-critical events

**Example**:
```javascript
vroomLogger.debug('DRIVING', 'Speed calculated', { speed: 85.3 });
vroomLogger.debug('PRISON', 'Activity reward calculated', { reward: 5 });
```

**Console Output**:
```
[VROOM] [DEBUG] [DRIVING] Speed calculated
Data: { speed: 85.3 }
```

### WARN (Yellow)
**Purpose**: Warning conditions that don't break the game

**When to Use**:
- Degraded functionality
- Rate limiting warnings
- Missing optional data
- Recoverable errors

**Example**:
```javascript
vroomLogger.warn('API', 'Approaching rate limit', { callsRemaining: 50 });
vroomLogger.warn('TATTOO', 'Tattoo became infected!');
```

**Console Output**:
```
[VROOM] [WARN] [API] Approaching rate limit
Data: { callsRemaining: 50 }
```

### ERROR (Red)
**Purpose**: Error conditions and failures

**When to Use**:
- API failures
- Save/load errors
- Network errors
- Unexpected exceptions

**Example**:
```javascript
vroomLogger.error('API', 'Failed to generate charges', { error: 'Network timeout' });
vroomLogger.error('SAVE', 'Failed to save game', { error: err.message });
```

**Console Output**:
```
[VROOM] [ERROR] [API] Failed to generate charges
Data: { error: 'Network timeout' }
```

---

## System Categories

Use these categories for the `system` parameter:

| Category | Purpose | Examples |
|----------|---------|----------|
| **SYSTEM** | Core game systems | Init, shutdown, mode changes |
| **API** | API calls and responses | Charge generation, tests |
| **SAVE** | Save/load operations | Save game, load game, export |
| **PRISON** | Prison activities | Weights, eating, reading |
| **TATTOO** | Tattoo system | Design, stencil, infection |
| **GANG** | Gang interactions | Joining, reputation, trades |
| **DRIVING** | Driving mechanics | Start, speed, arrest |
| **COURT** | Court/judge system | Forms, sentencing, charges |
| **USER** | User actions | Button clicks, inputs |
| **EATING** | Eating simulator | Bites, hunger, completion |
| **WEIGHTS** | Weight lifting | Sets, reps, fatigue |
| **LIBRARY** | Library/reading | Book selection, pages |
| **COMMISSARY** | Shop system | Purchases, stock |
| **ESCAPE** | Escape planning | Routes, attempts, success |
| **CINEMATIC** | Cutscenes | Scene start, end |
| **SOUND** | Audio system | Play sound, volume |

---

## Dev Mode Overlay

### Header Section
```
┌─────────────────────────────────┐
│ DEV MODE                  [−] [×]│
└─────────────────────────────────┘
```

- **Title**: Shows "DEV MODE"
- **[−]**: Collapse/expand overlay
- **[×]**: Close dev mode

### Current Screen
Shows which screen is currently active:
```
Screen: prisonMenu
Screen: courtroom
Screen: mainMenu
```

### Player Stats
Real-time player statistics:
```
Credits: 150 | Cigs: 25 | Days: 5 | Strength: 15
```

### API Counter (Highlighted Section)
```
API Calls: Total: 12 | Success: 11 | Failed: 1
Last: 3:45:12 PM | Avg: 1243ms
Key: Set ✓
```

**Indicators**:
- **Key: Set ✓** (green) = API key configured
- **Key: Not Set ✗** (red) = No API key

### Recent Logs
Shows last 5 log entries with timestamps:
```
[3:45:12] [USER] Jumped to tattoo studio
[3:45:10] [PRISON] Starting activity: tattoo
[3:45:05] [SAVE] Game saved successfully
```

**Color Coding**:
- INFO = Cyan
- DEBUG = Green
- WARN = Yellow
- ERROR = Red

### Quick Actions
```
[Test API] [Random Event] [View Logs] [Reset API]
```

- **Test API**: Tests API key connection
- **Random Event**: Triggers test event
- **View Logs**: Opens full log viewer
- **Reset API**: Clears API statistics

### Jump To Screen
Dropdown menu to instantly navigate:
```
Select Screen...
├── Main Menu
├── Character Creation
├── Driving
├── Courtroom
├── Prison
├── Tattoo Studio
├── Gang System
├── Escape Menu
├── Commissary
├── Library
├── Weight Lifting
└── Eating
```

### Modify Stats
Quick cheat buttons:
```
[+100 Credits] [+20 Cigs] [Max Stats]
```

- **+100 Credits**: Adds 100 credits
- **+20 Cigs**: Adds 20 cigarettes
- **Max Stats**: Sets all stats to max

---

## API Monitoring

### Tracked Metrics

**Per-Session Statistics**:
- Total API calls made
- Successful calls
- Failed calls
- Success rate percentage
- Average response time (ms)
- Last call timestamp
- Calls in last minute (rate limiting)

**Per-Call Data**:
- Call ID (unique identifier)
- Start time
- End time
- Duration (ms)
- Success/failure
- Request data (prompt, model, type)
- Response data (charges, tokens)
- Error details (if failed)

### Viewing API History

**Via Dev Overlay**:
- Shows last call time and average response time
- Updates in real-time

**Via Console**:
```javascript
// Get all statistics
const stats = window.apiMonitor.getStats();
console.log(stats);

// Get call history (last 10)
const history = window.apiMonitor.getHistory(10);
console.log(history);

// Get API key status
const status = window.apiMonitor.getApiKeyStatus();
console.log(status);
```

### Rate Limiting

**Free Tier Limits**:
- 14,000 requests per day
- ~580 requests per hour
- ~10 requests per minute (recommended max)

**Monitoring**:
```javascript
// Check if approaching rate limit
const stats = window.apiMonitor.getStats();
if (stats.rateLimitHit) {
    console.warn('Approaching rate limit!');
}

// Get calls in last minute
const recent = stats.callsInLastMinute;
console.log(`Calls in last minute: ${recent}`);
```

**Warning System**:
- Monitor tracks calls in sliding 1-minute window
- Warns when approaching 60 calls/minute
- Logs warning with details

---

## Console Logging

### Manual Logging

```javascript
// Info log
vroomLogger.info('SYSTEM', 'Something happened');

// With data
vroomLogger.info('SAVE', 'Game saved', {
    playerName: 'John',
    prisonDays: 10,
    credits: 500
});

// Debug log
vroomLogger.debug('DRIVING', 'Calculating speed', { speed: 85.3 });

// Warning
vroomLogger.warn('TATTOO', 'Infection risk high', { chance: 0.75 });

// Error
vroomLogger.error('API', 'Network failure', {
    error: 'Connection timeout',
    retries: 3
});
```

### Log Filtering

```javascript
// Get all logs
const allLogs = vroomLogger.getLogs();

// Filter by level
const errors = vroomLogger.getLogs({ level: 'ERROR' });

// Filter by system
const apiLogs = vroomLogger.getLogs({ system: 'API' });

// Get recent logs (last 10)
const recent = vroomLogger.getLogs({ limit: 10 });

// Combined filters
const recentApiErrors = vroomLogger.getLogs({
    level: 'ERROR',
    system: 'API',
    limit: 5
});
```

### Export Logs

```javascript
// Export as JSON
const jsonLogs = vroomLogger.exportLogs();
console.log(jsonLogs);

// Copy to clipboard
navigator.clipboard.writeText(vroomLogger.exportLogs());

// Download as file (manual)
const blob = new Blob([vroomLogger.exportLogs()], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// Create download link...
```

---

## Testing Menu

Access via **"TEST"** cheat code on main menu.

### Jump to System
- **TATTOO SYSTEM**: Opens tattoo studio
- **GANG SYSTEM**: Opens gang menu
- **ESCAPE SYSTEM**: Opens escape planning
- **WEIGHT LIFTING**: Opens weight room
- **EATING SIMULATOR**: Opens eating game
- **LIBRARY SYSTEM**: Opens prison library
- **COMMISSARY SHOP**: Opens shop
- **PRISON MENU**: Opens main prison menu
- **COURTROOM**: Opens court (need to set up first)
- **DRIVING MODE**: Starts driving

### Debug Tools
- **Add 100 Credits**: Adds money
- **Add 20 Cigarettes**: Adds cigarettes
- **Max All Gang Reps**: Sets all gang reputations to 100
- **Reset All Progress**: Clears game state

### New Debug Options (With Dev Mode)
- **TEST API CALL**: Tests API key connection
- **VIEW ALL LOGS**: Opens full log viewer modal
- **SIMULATE INFECTION**: Forces tattoo infection
- **CONTRABAND SEARCH**: Triggers random search
- **RANDOM EVENT**: Triggers random prison event

---

## Keyboard Shortcuts

### Main Menu
- Type **"TEST"** → Opens testing menu
- Type **"DEBUG"** → Toggles dev mode

### During Gameplay
- **Space** → Stop driving (when driving)
- No other shortcuts currently implemented

### Console Commands

```javascript
// Dev Mode Control
window.devMode.enable();          // Enable dev mode
window.devMode.disable();         // Disable dev mode
window.devMode.toggle();          // Toggle dev mode

// Logging Control
vroomLogger.enableDevMode();      // Enable logging
vroomLogger.disableDevMode();     // Disable logging
vroomLogger.clearLogs();          // Clear log history

// API Monitoring
apiMonitor.reset();               // Reset API stats
apiMonitor.getStats();            // Get statistics
apiMonitor.getHistory(10);        // Get call history

// Game State
game.saveGame();                  // Save game
game.loadGame();                  // Load game
game.showScreen('prisonMenu');    // Jump to screen

// Player Modification
game.player.money = 9999;         // Set credits
game.player.cigarettes = 999;     // Set cigarettes
game.player.strength = 100;       // Set strength
game.saveGame();                  // Don't forget to save!
```

---

## Troubleshooting

### Dev Mode Not Appearing

**Symptoms**: Typed "DEBUG" but overlay doesn't show

**Solutions**:
1. Make sure you're on the **main menu**
2. Check browser console for errors
3. Verify dev-mode.js loaded:
   ```javascript
   console.log(window.devMode);  // Should show DevMode object
   ```
4. Manually enable:
   ```javascript
   window.devMode.enable();
   ```

### Logs Not Showing

**Symptoms**: No logs in dev overlay or console

**Solutions**:
1. Verify logger is initialized:
   ```javascript
   console.log(window.vroomLogger);  // Should show VroomLogger object
   ```
2. Check if dev mode is enabled:
   ```javascript
   console.log(vroomLogger.enabled);  // Should be true
   ```
3. Manually enable logging:
   ```javascript
   vroomLogger.enableDevMode();
   ```
4. Test logging:
   ```javascript
   vroomLogger.info('TEST', 'Test log message');
   ```

### API Stats Not Updating

**Symptoms**: API counter shows 0 or doesn't increment

**Solutions**:
1. Verify API monitor loaded:
   ```javascript
   console.log(window.apiMonitor);  // Should show ApiMonitor object
   ```
2. Check if API key is set:
   ```javascript
   console.log(game.apiKeyManager.hasApiKey());  // Should be true
   ```
3. Make an API call:
   - Get arrested while driving
   - Or test API from settings
4. Check console for API errors
5. Reset stats:
   ```javascript
   apiMonitor.reset();
   ```

### Overlay Too Large / Off Screen

**Symptoms**: Dev overlay is cut off or too big

**Solutions**:
1. Collapse overlay (click **[−]** button)
2. Adjust browser zoom (Ctrl+0 to reset)
3. Resize browser window
4. On mobile: Overlay is responsive, should fit
5. Manual CSS override:
   ```javascript
   document.getElementById('devModeOverlay').style.maxHeight = '400px';
   ```

### Logging Slowing Down Game

**Symptoms**: Game feels laggy with dev mode on

**Solutions**:
1. This is normal with extensive logging
2. Collapse dev overlay to reduce redraws
3. Clear logs periodically:
   ```javascript
   vroomLogger.clearLogs();
   ```
4. Disable dev mode when not needed
5. Logging only impacts performance in dev mode

### API Key Not Saving

**Symptoms**: API key disappears after reload

**Solutions**:
1. This is **INTENTIONAL** (security feature)
2. API keys are stored in **sessionStorage**
3. Keys clear when browser closes
4. This prevents key theft from persistent storage
5. Re-enter key each session or use localStorage manually:
   ```javascript
   // NOT RECOMMENDED (security risk)
   localStorage.setItem('persistentApiKey', 'your-key');
   ```

### Console Errors About Missing Elements

**Symptoms**: Errors like "Cannot read property 'textContent' of null"

**Solutions**:
1. Make sure all script tags are loaded
2. Check script order in index.html:
   - debug-logger.js first
   - api-monitor.js second
   - dev-mode.js third
   - game.js last
3. Wait for page to fully load
4. Check for typos in element IDs

### Rate Limit Warning Not Showing

**Symptoms**: Making many API calls but no warning

**Solutions**:
1. Warning only shows when > 60 calls/minute
2. Check actual call rate:
   ```javascript
   const stats = apiMonitor.getStats();
   console.log(stats.callsInLastMinute);
   ```
3. Verify API monitor is working:
   ```javascript
   console.log(apiMonitor.stats);
   ```
4. Check console for WARN level logs

---

## Advanced Debugging

### Performance Monitoring

```javascript
// Track specific operation
console.time('save-game');
game.saveGame();
console.timeEnd('save-game');

// Monitor API response times
const history = apiMonitor.getHistory();
const times = history.map(call => call.duration);
console.log('Min:', Math.min(...times));
console.log('Max:', Math.max(...times));
console.log('Avg:', times.reduce((a,b) => a+b) / times.length);
```

### Memory Inspection

```javascript
// Check log memory usage
console.log('Logs stored:', vroomLogger.logs.length);
console.log('Max logs:', vroomLogger.maxLogs);

// Check API call history
console.log('API calls stored:', apiMonitor.stats.callHistory.length);
console.log('Max history:', apiMonitor.maxHistory);

// Clear if needed
vroomLogger.clearLogs();
apiMonitor.reset();
```

### Network Debugging

```javascript
// Enable fetch logging (dev mode does this automatically)
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('FETCH:', args[0]);
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('RESPONSE:', response.status, response.statusText);
            return response;
        });
};
```

### State Inspection

```javascript
// View entire player state
console.log('Player:', JSON.stringify(game.player, null, 2));

// View judge state
console.log('Judge:', JSON.stringify(game.judge, null, 2));

// View game state
console.log('Current screen:', document.querySelector('.screen.active')?.id);
console.log('Dev mode:', window.devMode.enabled);
console.log('API key set:', game.apiKeyManager.hasApiKey());
```

---

## localStorage Flags Reference

These flags are stored in browser localStorage:

| Flag | Purpose | Values |
|------|---------|--------|
| `vroomVroomDevMode` | Dev mode enabled | `"true"` / absent |
| `skip_api_prompt` | Don't show API prompt | `"true"` / absent |
| `vroom_vroom_save` | Game save data | JSON string |

### Clear All Flags

```javascript
// Clear everything
localStorage.clear();

// Clear specific flags
localStorage.removeItem('vroomVroomDevMode');
localStorage.removeItem('skip_api_prompt');
```

---

## sessionStorage Reference

These are stored in sessionStorage (cleared on browser close):

| Key | Purpose | Values |
|-----|---------|--------|
| `gemini_api_key` | Gemini API key | API key string |
| `vroomApiStats` | API call statistics | JSON object |

### View Session Data

```javascript
// View API key (redacted)
const key = sessionStorage.getItem('gemini_api_key');
console.log('API Key:', key ? `${key.substring(0, 10)}...` : 'Not set');

// View API stats
const stats = sessionStorage.getItem('vroomApiStats');
console.log('API Stats:', JSON.parse(stats));
```

---

## Best Practices

### For Game Development

1. **Log Important Events**
   - Save/load operations
   - Screen transitions
   - User actions
   - System state changes

2. **Use Appropriate Log Levels**
   - INFO for successful operations
   - DEBUG for detailed tracing
   - WARN for degraded functionality
   - ERROR for failures

3. **Include Relevant Data**
   ```javascript
   // Good
   vroomLogger.info('PRISON', 'Activity completed', {
       activity: 'weights',
       reward: 5,
       strength: 15
   });

   // Bad
   vroomLogger.info('PRISON', 'Done');
   ```

4. **Clear Logs Periodically**
   - Logs limited to last 100 entries
   - Auto-cleared, but can manual clear
   - Prevents memory bloat

### For API Usage

1. **Always Use apiMonitor**
   - Start call before fetch
   - End call after response
   - Log all outcomes

2. **Implement Fallbacks**
   - API calls can fail
   - Have default values
   - Don't break game

3. **Respect Rate Limits**
   - Monitor calls/minute
   - Add delays if needed
   - Cache responses when possible

### For Testing

1. **Use Testing Menu**
   - Jump to specific systems
   - Modify player stats
   - Test edge cases

2. **Enable Dev Mode Early**
   - See what's happening
   - Catch issues quickly
   - Monitor performance

3. **Check Logs Regularly**
   - Look for errors
   - Verify flow
   - Optimize based on data

---

## Support

If you encounter issues not covered here:

1. Check browser console for errors
2. Export logs and review them
3. Reset dev mode: `devMode.disable(); devMode.enable();`
4. Clear localStorage: `localStorage.clear();`
5. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

**Last Updated**: 2025-10-14
**Dev Mode Version**: 1.0.0
