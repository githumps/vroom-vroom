# VROOM VROOM - Dev Mode Integration Guide

## Overview
This guide explains how to integrate the comprehensive dev mode and API debugging system into the VROOM VROOM game.

## Files Created
1. **debug-logger.js** - Logging utility with levels and history
2. **api-monitor.js** - API call tracking and statistics
3. **dev-mode.js** - Dev mode overlay and controls
4. **dev-mode.css** - Styling for dev overlay

---

## STEP 1: Add Script Tags to index.html

Add these script tags **BEFORE** the `game.js` script tag (around line 1708):

```html
<!-- Dev Mode and Debugging Systems -->
<link rel="stylesheet" href="dev-mode.css">
<script src="debug-logger.js"></script>
<script src="api-monitor.js"></script>
<script src="dev-mode.js"></script>

<!-- Existing scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="soundsystem.js"></script>
<script src="tattoo-system.js"></script>
<script src="car-selection.js"></script>
<script src="game.js"></script>
```

---

## STEP 2: Add "DEBUG" Cheat Code to Main Menu

In **game.js**, find the keyboard event listener in the constructor (search for "keydown" or main menu input handling).

Add this code to detect the "DEBUG" cheat code:

```javascript
// Add to the Game class constructor or initializeGame method
this.cheatCodeBuffer = '';
this.cheatCodeTimeout = null;

// Add keyboard listener for cheat codes
document.addEventListener('keydown', (e) => {
    // Only on main menu
    const mainMenu = document.getElementById('mainMenu');
    if (!mainMenu.classList.contains('active')) return;

    // Add key to buffer
    this.cheatCodeBuffer += e.key.toUpperCase();

    // Clear buffer after 2 seconds
    clearTimeout(this.cheatCodeTimeout);
    this.cheatCodeTimeout = setTimeout(() => {
        this.cheatCodeBuffer = '';
    }, 2000);

    // Check for cheat codes
    if (this.cheatCodeBuffer.includes('TEST')) {
        this.cheatCodeBuffer = '';
        this.showScreen('testingMenu');
        vroomLogger.info('USER', 'Testing menu accessed via cheat code');
    }

    if (this.cheatCodeBuffer.includes('DEBUG')) {
        this.cheatCodeBuffer = '';
        if (window.devMode) {
            window.devMode.toggle();
            this.showMessage(
                window.devMode.enabled ? 'Dev Mode Enabled' : 'Dev Mode Disabled',
                2000
            );
        }
    }
});
```

---

## STEP 3: Add Dev Mode Toggle to Settings Modal

In **index.html**, add a dev mode toggle to the settings modal (around line 1600):

```html
<hr style="border: 1px solid #0f0; margin: 30px 0;">

<!-- DEV MODE SETTINGS -->
<div class="modal-text">
    <strong>Developer Mode</strong><br>
    Enable debug overlay, logging, and testing tools.
</div>

<div class="checkbox-container">
    <input type="checkbox" id="devModeToggle" onchange="game.toggleDevModeFromSettings(this.checked)">
    <label for="devModeToggle">Enable Developer Mode</label>
</div>

<div class="status-text" id="devModeStatus">
    <strong>Status:</strong> <span id="devModeStatusText">Disabled</span>
</div>

<hr style="border: 1px solid #0f0; margin: 30px 0;">
```

Add this method to the **Game class** in game.js:

```javascript
// Toggle dev mode from settings
toggleDevModeFromSettings(enabled) {
    if (window.devMode) {
        if (enabled) {
            window.devMode.enable();
        } else {
            window.devMode.disable();
        }

        // Update status display
        const statusText = document.getElementById('devModeStatusText');
        if (statusText) {
            statusText.textContent = enabled ? 'Enabled' : 'Disabled';
            statusText.style.color = enabled ? '#0f0' : '#888';
        }
    }
}

// Update settings modal when opened
showModal(modalId) {
    // Existing code...
    document.getElementById(modalId).classList.add('active');

    // Update dev mode checkbox if settings modal
    if (modalId === 'settingsModal' && window.devMode) {
        const checkbox = document.getElementById('devModeToggle');
        if (checkbox) {
            checkbox.checked = window.devMode.enabled;
        }
        this.toggleDevModeFromSettings(window.devMode.enabled);
    }
}
```

---

## STEP 4: Instrument API Calls with Monitoring

In **game.js**, find the `ApiKeyManager.generateAICharges()` method (around line 92).

**REPLACE** the entire method with this instrumented version:

```javascript
async generateAICharges(drivingData, arrestCount) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
        vroomLogger.debug('API', 'No API key set, using default charges');
        return null; // Fall back to default charges
    }

    const prompt = `You are Judge Hardcastle, an absurdly strict judge in a dystopian world where driving is illegal. Generate 4-6 creative, bureaucratic charges for someone arrested for driving.

Context:
- Speed: ${Math.floor(drivingData.speed)} km/h
- Driving time: ${Math.floor(drivingData.time)} seconds
- This is arrest #${arrestCount}

Requirements:
- Make charges absurd but legal-sounding
- Include form numbers (like "Form TX-401")
- Mix real violations with ridiculous ones
- Escalate severity with arrest count
- Keep charges under 15 words each

Return ONLY a JSON array of charge strings, nothing else. Example format:
["Charge 1", "Charge 2", "Charge 3"]`;

    // Start monitoring
    const callId = window.apiMonitor
        ? window.apiMonitor.startCall({ prompt, model: 'gemma-3-27b-it', type: 'charge_generation' })
        : null;

    vroomLogger.info('API', 'Requesting AI-generated charges', {
        speed: Math.floor(drivingData.speed),
        time: Math.floor(drivingData.time),
        arrestCount
    });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            // Try to parse JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const charges = JSON.parse(jsonMatch[0]);

                // End monitoring - success
                if (callId && window.apiMonitor) {
                    window.apiMonitor.endCall(callId, true, { chargeCount: charges.length });
                }

                vroomLogger.info('API', 'Successfully generated charges', {
                    chargeCount: charges.length,
                    charges: charges
                });

                return charges;
            } else {
                throw new Error('Failed to parse JSON from API response');
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }
    } catch (error) {
        // End monitoring - failure
        if (callId && window.apiMonitor) {
            window.apiMonitor.endCall(callId, false, null, error);
        }

        vroomLogger.error('API', 'Failed to generate charges', {
            error: error.message,
            stack: error.stack
        });

        return null; // Fall back to default charges
    }
}
```

Do the same for the `testApiKey()` method around line 50:

```javascript
async testApiKey(apiKey) {
    const key = apiKey || this.getApiKey();
    if (!key) {
        vroomLogger.warn('API', 'Test attempted without API key');
        return { success: false, message: 'No API key provided' };
    }

    const callId = window.apiMonitor
        ? window.apiMonitor.startCall({ type: 'api_test', model: 'gemma-3-27b-it' })
        : null;

    vroomLogger.info('API', 'Testing API key...');

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Say "test successful" if you receive this.'
                        }]
                    }]
                })
            }
        );

        if (response.ok) {
            if (callId && window.apiMonitor) {
                window.apiMonitor.endCall(callId, true, { testResult: 'valid' });
            }

            vroomLogger.info('API', 'API key test successful');
            return { success: true, message: 'API key is valid and working!' };
        } else {
            const error = await response.json();
            const errorMsg = error.error?.message || 'Invalid key';

            if (callId && window.apiMonitor) {
                window.apiMonitor.endCall(callId, false, null, new Error(errorMsg));
            }

            vroomLogger.error('API', 'API key test failed', { error: errorMsg });

            return {
                success: false,
                message: `API key test failed: ${errorMsg}`
            };
        }
    } catch (error) {
        if (callId && window.apiMonitor) {
            window.apiMonitor.endCall(callId, false, null, error);
        }

        vroomLogger.error('API', 'Network error during test', { error: error.message });

        return {
            success: false,
            message: `Network error: ${error.message}`
        };
    }
}
```

---

## STEP 5: Add Logging Throughout Game Systems

Add logging to key game events. Here are examples:

### Save/Load Operations
```javascript
saveGame() {
    vroomLogger.info('SAVE', 'Saving game state', {
        player: this.player.name,
        prisonDays: this.player.prisonDays,
        credits: this.player.money
    });

    // Existing save code...

    vroomLogger.debug('SAVE', 'Game saved successfully');
}

loadGame() {
    vroomLogger.info('SAVE', 'Loading game state');

    // Existing load code...

    vroomLogger.debug('SAVE', 'Game loaded successfully', {
        player: this.player.name,
        prisonDays: this.player.prisonDays
    });
}
```

### Prison Activities
```javascript
prisonActivity(activity) {
    vroomLogger.info('PRISON', `Starting activity: ${activity}`, {
        playerStrength: this.player.strength,
        playerIntelligence: this.player.intelligence
    });

    // Existing activity code...
}
```

### Driving
```javascript
startDriving() {
    vroomLogger.info('DRIVING', 'Player started driving', {
        arrestCount: this.judge.arrestCount,
        carModel: this.player.carModel
    });

    // Existing driving code...
}

arrestPlayer() {
    vroomLogger.warn('DRIVING', 'Player arrested', {
        speed: Math.floor(this.player.speed),
        drivingTime: Math.floor(this.player.drivingTime),
        totalArrests: this.judge.arrestCount + 1
    });

    // Existing arrest code...
}
```

### Court/Judge
```javascript
setupCourtroom() {
    vroomLogger.info('COURT', 'Entering courtroom', {
        arrestNumber: this.judge.arrestCount + 1,
        judgeMood: this.judge.mood
    });

    // Existing courtroom code...
}

submitCourtForms() {
    vroomLogger.debug('COURT', 'Forms submitted', {
        allFieldsFilled: true,
        judgePatienceRemaining: this.judge.patience
    });

    // Existing form submission code...
}
```

### Tattoo System
```javascript
createStencil() {
    vroomLogger.info('TATTOO', 'Creating tattoo stencil', {
        designSize: this.tattooGrid.filter(c => c).length
    });

    // Existing stencil code...
}

applyInk() {
    vroomLogger.info('TATTOO', 'Applying ink to tattoo');

    // Check for infection
    if (Math.random() < 0.25) {
        vroomLogger.warn('TATTOO', 'Tattoo became infected!');
    }

    // Existing ink code...
}
```

### Gang System
```javascript
gangAction(action) {
    vroomLogger.info('GANG', `Gang action: ${action}`, {
        currentGang: this.player.gang,
        cigarettes: this.player.cigarettes
    });

    // Existing gang code...
}
```

---

## STEP 6: Enhance Testing Menu

In **index.html**, find the testing menu (around line 1440) and add these new options:

```html
<div class="prison-activity" onclick="game.testApiCall()">
    <h3>TEST API CALL</h3>
    <p>Test Gemini API with custom prompt</p>
</div>

<div class="prison-activity" onclick="game.testViewAllLogs()">
    <h3>VIEW ALL LOGS</h3>
    <p>View complete log history</p>
</div>

<div class="prison-activity" onclick="game.testInfection()">
    <h3>SIMULATE INFECTION</h3>
    <p>Force tattoo infection event</p>
</div>

<div class="prison-activity" onclick="game.testContrabandSearch()">
    <h3>CONTRABAND SEARCH</h3>
    <p>Trigger random contraband search</p>
</div>

<div class="prison-activity" onclick="game.testRandomEvent()">
    <h3>RANDOM EVENT</h3>
    <p>Trigger a random prison event</p>
</div>
```

Add these methods to **game.js**:

```javascript
testApiCall() {
    if (window.devMode) {
        window.devMode.testApiCall();
    } else {
        alert('Dev mode required');
    }
}

testViewAllLogs() {
    if (window.devMode) {
        window.devMode.showLogViewer();
    } else {
        alert('Dev mode required');
    }
}

testInfection() {
    vroomLogger.warn('USER', 'Forcing tattoo infection via debug menu');
    // Simulate infection
    this.showMessage('Your tattoo has become infected!', 3000);
    if (this.player.tattoos && this.player.tattoos.length > 0) {
        this.player.tattoos[this.player.tattoos.length - 1].infected = true;
    }
}

testContrabandSearch() {
    vroomLogger.warn('USER', 'Forcing contraband search via debug menu');
    const found = Math.random() < 0.5;
    if (found && this.player.cigarettes > 0) {
        const confiscated = Math.floor(this.player.cigarettes / 2);
        this.player.cigarettes -= confiscated;
        this.showMessage(`CONTRABAND SEARCH! ${confiscated} cigarettes confiscated!`, 4000);
        vroomLogger.warn('PRISON', 'Contraband found during search', { confiscated });
    } else {
        this.showMessage('Contraband search: Nothing found. This time.', 3000);
        vroomLogger.info('PRISON', 'Contraband search: clean');
    }
}

testRandomEvent() {
    vroomLogger.info('USER', 'Triggering random event via debug menu');
    const events = [
        'A fight breaks out in the yard. You stay out of it.',
        'The guards rotate shifts. New faces. Same oppression.',
        'Someone starts a rumor about an escape attempt.',
        'The cafeteria runs out of mystery meat. Everyone celebrates.',
        'Your cellmate won\'t stop talking about traffic violations.'
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    this.showMessage(event, 4000);
    vroomLogger.debug('PRISON', 'Random event triggered', { event });
}
```

---

## STEP 7: Initialize Dev Mode on Game Start

In the **Game class constructor** (game.js), add initialization:

```javascript
constructor() {
    // Existing initialization...

    // Initialize dev mode if enabled
    if (window.devMode && window.devMode.enabled) {
        vroomLogger.info('SYSTEM', 'Game initialized with dev mode active');
    }

    // Log game start
    vroomLogger.info('SYSTEM', 'VROOM VROOM initialized', {
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
}
```

---

## COMPLETE!

The dev mode system is now fully integrated. Users can:

1. Type **"DEBUG"** on main menu to toggle dev mode
2. Type **"TEST"** on main menu to access testing menu
3. Toggle dev mode in Settings
4. View real-time API statistics
5. See comprehensive logging
6. Use quick debug actions

All API calls are now monitored and logged automatically.
