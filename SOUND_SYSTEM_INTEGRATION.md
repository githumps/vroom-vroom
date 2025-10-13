# Sound System Integration Guide

## Overview
Complete Web Audio API sound effects system for VROOM VROOM game using synthesized sounds (no external files required).

## Files Created
- `C:\Users\evan\Documents\GitHub\vroom-vroom\game\soundsystem.js` - Complete SoundSystem class

## Integration Steps

### Step 1: Add Script Tag to index.html

Add this line BEFORE the `<script src="game.js"></script>` tag in `index.html`:

```html
<script src="soundsystem.js"></script>
<script src="game.js"></script>
```

Location: Around line 554 in index.html

### Step 2: Add Volume Control UI to index.html

Add this HTML inside the Settings Modal (around line 760 in index.html), after the API key section and before the modal buttons:

```html
<div class="modal-text" style="margin-top: 30px;">
    <strong>Sound Settings</strong>
</div>

<div class="form-field" style="margin: 20px 0;">
    <label for="volumeSlider">Volume: <span id="volumeValue">50%</span></label>
    <input type="range" id="volumeSlider" min="0" max="100" value="50" style="width: 100%;">
</div>

<div class="form-field" style="margin: 20px 0;">
    <label style="cursor: pointer; display: flex; align-items: center;">
        <input type="checkbox" id="muteCheckbox" style="width: auto; margin-right: 10px;">
        Mute All Sounds
    </label>
</div>
```

### Step 3: Initialize Sound System in VroomVroomGame class

In `game.js`, find the constructor of `VroomVroomGame` class (around line 429-467) and add this line after the cinematic system initialization:

```javascript
// Initialize Cinematic System
this.cinematics = new CinematicSystem();

// Initialize Sound System
this.soundSystem = new SoundSystem();
```

### Step 4: Initialize Audio Context on User Interaction

In `game.js`, find the `init()` method (around line 469-542) and add this code at the END of the method, just before `this.animate()`:

```javascript
// Initialize sound system on first click
document.addEventListener('click', () => {
    this.soundSystem.init();
}, { once: true });

// Setup volume controls
this.setupVolumeControls();

// Start render loop
this.animate();
```

### Step 5: Add Volume Control Setup Method

Add this new method to the `VroomVroomGame` class (add it after the `updateSettingsStatus()` method, around line 930):

```javascript
// Setup volume control listeners
setupVolumeControls() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const muteCheckbox = document.getElementById('muteCheckbox');

    if (volumeSlider) {
        // Load saved volume
        const savedVolume = localStorage.getItem('vroomVroomVolume');
        if (savedVolume !== null) {
            const volumePercent = Math.floor(parseFloat(savedVolume) * 100);
            volumeSlider.value = volumePercent;
            volumeValue.textContent = volumePercent + '%';
        }

        // Volume slider change
        volumeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) / 100;
            this.soundSystem.setVolume(value);
            volumeValue.textContent = e.target.value + '%';
        });
    }

    if (muteCheckbox) {
        // Load saved mute state
        const savedMuted = localStorage.getItem('vroomVroomMuted');
        if (savedMuted === 'true') {
            muteCheckbox.checked = true;
        }

        // Mute checkbox change
        muteCheckbox.addEventListener('change', (e) => {
            this.soundSystem.toggleMute();
        });
    }
}
```

### Step 6: Integrate Sounds into Game Events

#### A. Arrest Sound (line ~1098 in pullOver() method)

Find this code:
```javascript
pullOver() {
    this.gameState = 'courtroom';
    document.getElementById('drivingHUD').style.display = 'none';

    // Show dramatic arrest cinematic
    this.cinematics.play('arrest', () => {
```

Add sound BEFORE the cinematic plays:
```javascript
pullOver() {
    this.gameState = 'courtroom';
    document.getElementById('drivingHUD').style.display = 'none';

    // Play arrest sound
    this.soundSystem.playArrestSound();

    // Show dramatic arrest cinematic
    this.cinematics.play('arrest', () => {
```

#### B. Cop Mumbling (line ~1115 in setupCourtroom() method)

Find this code:
```javascript
async setupCourtroom() {
    // Try to generate AI charges first, fall back to default if API key not available
    let charges;

    if (this.apiKeyManager.hasApiKey()) {
        this.showMessage('Judge Hardcastle is consulting the AI legal database...', 2000);
```

Add sound right after the message:
```javascript
async setupCourtroom() {
    // Try to generate AI charges first, fall back to default if API key not available
    let charges;

    if (this.apiKeyManager.hasApiKey()) {
        this.showMessage('Judge Hardcastle is consulting the AI legal database...', 2000);

        // Play cop mumbling sound during AI generation
        this.soundSystem.playCopMumbling();
```

#### C. Gavel Strike (line ~1323 in submitCourtForms() method)

Find this code:
```javascript
// Show dramatic judgment and gavel cinematic
setTimeout(() => {
    this.cinematics.play('judgment', () => {
```

Add sound before the cinematic:
```javascript
// Show dramatic judgment and gavel cinematic
setTimeout(() => {
    // Play gavel strike sound
    this.soundSystem.playGavelStrike();

    this.cinematics.play('judgment', () => {
```

#### D. Prison Door Clang (line ~1325 in submitCourtForms() method)

Find this code:
```javascript
this.cinematics.play('judgment', () => {
    // Then show prison entrance
    this.cinematics.play('prison', () => {
        this.startPrison();
```

Add sound before the prison cinematic:
```javascript
this.cinematics.play('judgment', () => {
    // Then show prison entrance
    // Play prison door clang sound
    this.soundSystem.playPrisonDoorClang();

    this.cinematics.play('prison', () => {
        this.startPrison();
```

## Testing the Sounds

### Test Each Sound:

1. **Arrest Sound:**
   - Start game → Create character → Drive → Let police catch you
   - Should hear: Police siren (alternating tones) followed by handcuff click

2. **Cop Mumbling:**
   - Get arrested → During courtroom scene with AI enabled
   - Should hear: Sims-style gibberish talking with varying pitch

3. **Gavel Strike:**
   - Complete courtroom forms → Submit
   - Should hear: Deep thud sound during judgment cinematic

4. **Prison Door Clang:**
   - After judgment cinematic → Prison entrance
   - Should hear: Metallic clang during prison entrance cinematic

### Volume Controls:
- Open Settings (from main menu)
- Adjust volume slider (0-100%)
- Toggle mute checkbox
- Settings persist in localStorage

## Sound Specifications

### 1. Arrest Sound
- **Components:** Police siren + handcuff click
- **Duration:** ~2 seconds total
- **Siren:** Alternating 800Hz/600Hz tones
- **Handcuff:** Bandpass filtered noise at 2000Hz

### 2. Cop Mumbling
- **Style:** Sims-style gibberish
- **Duration:** 3 seconds
- **Syllables:** 8 varied syllables
- **Pitch Range:** 180-220Hz (irritated/disappointed tone)

### 3. Gavel Strike
- **Type:** Deep thud
- **Duration:** ~0.3 seconds
- **Frequency:** 80Hz sliding to 40Hz
- **Impact:** Lowpass filtered noise

### 4. Prison Door Clang
- **Type:** Metallic resonance
- **Duration:** ~0.8 seconds
- **Frequencies:** 400Hz, 600Hz, 200Hz (sliding down)
- **Impact:** Lowpass filtered noise

## Features

- All sounds synthesized programmatically (no external files)
- Volume control (0-100%)
- Mute toggle
- Settings persist in localStorage
- Automatic audio context initialization on user interaction
- Graceful handling of non-initialized state

## File Locations

- Sound System Class: `C:\Users\evan\Documents\GitHub\vroom-vroom\game\soundsystem.js`
- Main Game File: `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`
- HTML File: `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`

## Summary of Changes

1. Created `soundsystem.js` with complete SoundSystem class
2. Added volume slider and mute checkbox to settings modal
3. Initialize sound system in game constructor
4. Setup audio context on first user click
5. Added volume control handlers
6. Integrated 4 sounds at key game events:
   - Arrest sound when pulled over
   - Cop mumbling during courtroom AI generation
   - Gavel strike during judgment cinematic
   - Prison door clang during prison entrance

All sounds are fully synthesized using Web Audio API with no external dependencies.
