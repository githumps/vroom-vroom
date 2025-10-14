# Voice Preview System - Integration Complete

## Overview
A Web Audio API-based voice preview system has been integrated into VROOM VROOM's character creation screen. Each of the 4 voice options now has a unique synthesized personality sound that players can preview before starting the game.

## Files Modified

### 1. `C:\Users\evan\Documents\GitHub\vroom-vroom\game\soundsystem.js`
- Added `playVoicePreview(voiceType)` method to the SoundSystem class
- Location: Lines 292-447 (after `playImpactNoise` method)

### 2. `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`
- Added "PREVIEW VOICE" button in character creation form
- Location: Lines 532-534 (inside voice dropdown form-field)

### 3. `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`
- Added `previewVoice()` method to handle button clicks
- Location: Lines 1246-1271 (after `finishCharacterCreation` method)

---

## Voice Characteristics

### 1. Deep and Resigned
**Sonic Character:**
- **Base Frequency:** 120 Hz (low, masculine register)
- **Pitch Curve:** Descending (starts at 120Hz, drops to 90Hz)
- **Wave Type:** Triangle (soft, mellow)
- **Duration:** 1.5 seconds (slow, deliberate)
- **Filter:** 400Hz bandpass (muffled, tired quality)
- **Envelope:** Slow attack (0.15s), long release (0.6s) - weary, exhausted
- **Vibrato:** None (flat, emotionless)

**Emotional Character:** Sounds like a tired sigh. The descending pitch conveys resignation and defeat. Perfect for someone who has given up arguing with bureaucracy.

---

### 2. High and Anxious
**Sonic Character:**
- **Base Frequency:** 280 Hz (high, tense register)
- **Pitch Curve:** Wavy/wavering (280Hz → 310Hz → 260Hz → 320Hz → 290Hz)
- **Wave Type:** Sine (pure, piercing)
- **Duration:** 1.2 seconds (rapid, nervous)
- **Filter:** 1200Hz bandpass (bright, sharp)
- **Envelope:** Fast attack (0.05s), quick release (0.25s) - jittery
- **Vibrato:** YES - 8Hz rate, 15Hz depth (rapid tremolo, nervous trembling)

**Emotional Character:** Sounds like nervous energy. The wavering pitch and fast vibrato create a sense of anxiety and uncertainty. Like someone about to face Judge Hardcastle.

---

### 3. Monotone Bureaucrat
**Sonic Character:**
- **Base Frequency:** 190 Hz (mid register, neutral)
- **Pitch Curve:** Flat (absolutely no variation)
- **Wave Type:** Square (robotic, mechanical)
- **Duration:** 1.3 seconds (measured, controlled)
- **Filter:** 600Hz bandpass (nasal, official)
- **Envelope:** Medium attack (0.08s), short release (0.2s) - clipped, efficient
- **Vibrato:** None (completely lifeless)

**Emotional Character:** Sounds like a government official reading from a script. No emotion, no inflection. Perfect for someone who has internalized the bureaucracy.

---

### 4. Disturbingly Enthusiastic
**Sonic Character:**
- **Base Frequency:** 220 Hz (mid-high register)
- **Pitch Curve:** Ascending (220Hz → 280Hz → 294Hz)
- **Wave Type:** Sawtooth (harsh, energetic, aggressive)
- **Duration:** 1.4 seconds (eager, forward-moving)
- **Filter:** 900Hz bandpass (bright, attention-seeking)
- **Envelope:** Very fast attack (0.03s), medium release (0.3s) - explosive energy
- **Vibrato:** YES - 5Hz rate, 8Hz depth (moderate warble, unsettling positivity)

**Emotional Character:** Sounds disturbingly upbeat. The ascending pitch conveys inappropriate enthusiasm. Like someone who is way too excited about paperwork and consequences.

---

## Technical Implementation

### Audio Graph Architecture
```
LFO (if vibrato enabled)
  └─> LFO Gain (vibrato depth)
        └─> Voice Oscillator.frequency

Voice Oscillator (main tone)
  └─> Bandpass Filter (voice-like quality)
        └─> Gain Node (ADSR envelope)
              └─> Master Gain (volume control)
                    └─> Audio Context Destination
```

### ADSR Envelope
Each voice uses a standard ADSR (Attack-Decay-Sustain-Release) envelope:
- **Attack:** Fade in from 0 to peak gain
- **Decay:** Ramp down to sustain level
- **Sustain:** Hold at sustain level for majority of duration
- **Release:** Fade out to 0 at end

### Vibrato System
Two voices use LFO (Low Frequency Oscillator) for vibrato:
- **High and Anxious:** Fast 8Hz vibrato (nervous trembling)
- **Disturbingly Enthusiastic:** Moderate 5Hz vibrato (unsettling warble)

The LFO modulates the main oscillator's frequency to create pitch variation.

---

## User Interface

### Button Behavior
1. **Default State:** "PREVIEW VOICE"
2. **Playing State:** "PLAYING..." (button disabled)
3. **Duration:** Button re-enables after 2 seconds (longer than longest sample)

### Location
The preview button appears directly below the voice dropdown in the character creation form:
```
Name: [input]
Skin Tone: [slider]
Height: [slider]
Voice: [dropdown]
       [PREVIEW VOICE] ← NEW BUTTON
[BEGIN YOUR JOURNEY]
```

---

## Integration Points

### soundsystem.js Integration
The `playVoicePreview()` method:
- Automatically initializes audio context if needed
- Uses existing `masterGain` for volume control
- Respects mute settings
- Follows same architecture as other sound effects

### game.js Integration
The `previewVoice()` method:
- Ensures sound system is initialized
- Reads selected voice from dropdown
- Provides visual feedback during playback
- Prevents multiple simultaneous previews

### Volume Control
Voice previews automatically respect:
- Volume slider in settings (0-100%)
- Mute toggle in settings
- Master gain node for consistent volume

---

## Code Snippets

### HTML Button (index.html)
```html
<button id="previewVoiceBtn" onclick="game.previewVoice()"
        style="margin-top: 10px; font-size: 0.9em; padding: 10px 20px;">
    PREVIEW VOICE
</button>
```

### Game Method (game.js)
```javascript
previewVoice() {
    if (!this.soundSystem.initialized) {
        this.soundSystem.init();
    }

    const voiceType = document.getElementById('voice').value;
    const previewBtn = document.getElementById('previewVoiceBtn');

    previewBtn.textContent = 'PLAYING...';
    previewBtn.disabled = true;

    this.soundSystem.playVoicePreview(voiceType);

    setTimeout(() => {
        previewBtn.textContent = 'PREVIEW VOICE';
        previewBtn.disabled = false;
    }, 2000);
}
```

### Sound System Method (soundsystem.js)
```javascript
playVoicePreview(voiceType) {
    if (!this.initialized) this.init();

    const config = voiceConfigs[voiceType];
    const voice = this.audioContext.createOscillator();
    const voiceFilter = this.audioContext.createBiquadFilter();
    const voiceGain = this.audioContext.createGain();

    // Configure oscillator, filter, envelope
    // Connect: voice -> filter -> gain -> masterGain
    // Start and stop playback
}
```

---

## Testing Instructions

1. **Open Game:**
   - Navigate to `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`

2. **Start New Game:**
   - Click "NEW GAME" from main menu
   - Reach character creation screen

3. **Test Each Voice:**
   - Select "Deep and Resigned" → Click "PREVIEW VOICE" → Listen for low, descending tone
   - Select "High and Anxious" → Click "PREVIEW VOICE" → Listen for high, wavering tone
   - Select "Monotone Bureaucrat" → Click "PREVIEW VOICE" → Listen for flat, robotic tone
   - Select "Disturbingly Enthusiastic" → Click "PREVIEW VOICE" → Listen for ascending, energetic tone

4. **Test Volume Control:**
   - Adjust volume slider in settings (should affect preview volume)
   - Toggle mute (preview should be silent when muted)
   - Test multiple rapid clicks (button should disable during playback)

---

## Design Decisions

### Why Synthesized Tones Instead of Speech?
- Fits game's retro aesthetic (like Sims gibberish or Undertale)
- No need for voice actors or audio files
- Instant loading, no buffering
- Pure Web Audio API maintains consistency with existing sound system
- Personality conveyed through tone/frequency rather than words

### Why These Specific Frequencies?
- **120Hz (Deep):** Male vocal range lower register
- **280Hz (High):** Female/child vocal range, higher tension
- **190Hz (Monotone):** Neutral mid-register, genderless
- **220Hz (Enthusiastic):** Slightly elevated, energetic but not shrill

### Why These Durations?
- 1.2-1.5 seconds: Long enough to convey personality, short enough to not annoy
- Quick preview for rapid decision-making
- Matches attention span for character creation

---

## Future Enhancements (Optional)

If you want to expand this system:

1. **Use voice during dialogue:**
   - Play voice sample when Judge Hardcastle speaks
   - Modulate based on emotion (anger = higher pitch, resignation = lower)

2. **Add more variety:**
   - Multiple samples per voice (random selection)
   - Pitch variation based on character height/gender

3. **Environmental effects:**
   - Add reverb for courtroom (official echo)
   - Add distortion for prison intercom

4. **Interactive preview:**
   - Hold button to extend sample
   - Add visualization (waveform or frequency bars)

---

## File Paths Summary

All modified files are in the game directory:

```
vroom-vroom/
├── game/
│   ├── soundsystem.js     (Modified - added playVoicePreview method)
│   ├── game.js            (Modified - added previewVoice method)
│   └── index.html         (Modified - added preview button)
└── VOICE_PREVIEW_INTEGRATION.md (This file)
```

---

## Conclusion

The voice preview system is fully integrated and ready to use. Players can now hear each voice's personality before committing to their character, enhancing the character creation experience and setting expectations for their courtroom confrontation with Judge Hardcastle.

The system uses pure Web Audio API synthesis, respects existing volume controls, and follows the same architecture as the rest of the game's sound system.
