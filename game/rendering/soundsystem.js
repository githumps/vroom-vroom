// Sound System - Web Audio API synthesized sounds
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.volume = 0.5; // Default volume
        this.muted = false;

        // Initialize audio context on first user interaction
        this.initialized = false;

        // Load volume from localStorage
        const savedVolume = localStorage.getItem('vroomVroomVolume');
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }

        const savedMuted = localStorage.getItem('vroomVroomMuted');
        if (savedMuted !== null) {
            this.muted = savedMuted === 'true';
        }
    }

    // Initialize audio context (must be called after user interaction)
    init() {
        if (this.initialized) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.updateVolume();

        this.initialized = true;
        console.log('Sound system initialized');
    }

    // Update master volume
    updateVolume() {
        if (!this.masterGain) return;
        this.masterGain.gain.value = this.muted ? 0 : this.volume;
    }

    // Set volume (0.0 to 1.0)
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.updateVolume();
        localStorage.setItem('vroomVroomVolume', this.volume.toString());
    }

    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        this.updateVolume();
        localStorage.setItem('vroomVroomMuted', this.muted.toString());
        return this.muted;
    }

    // ARREST SOUND - Police siren + handcuff click
    playArrestSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Police Siren (alternating high/low tones)
        const sirenOsc1 = this.audioContext.createOscillator();
        const sirenOsc2 = this.audioContext.createOscillator();
        const sirenGain = this.audioContext.createGain();

        sirenOsc1.type = 'sine';
        sirenOsc2.type = 'sine';

        // Alternating frequencies for siren effect
        sirenOsc1.frequency.setValueAtTime(800, now);
        sirenOsc1.frequency.setValueAtTime(600, now + 0.3);
        sirenOsc1.frequency.setValueAtTime(800, now + 0.6);
        sirenOsc1.frequency.setValueAtTime(600, now + 0.9);

        sirenOsc2.frequency.setValueAtTime(600, now);
        sirenOsc2.frequency.setValueAtTime(800, now + 0.3);
        sirenOsc2.frequency.setValueAtTime(600, now + 0.6);
        sirenOsc2.frequency.setValueAtTime(800, now + 0.9);

        sirenGain.gain.setValueAtTime(0, now);
        sirenGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
        sirenGain.gain.setValueAtTime(0.35, now + 1.2);
        sirenGain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

        sirenOsc1.connect(sirenGain);
        sirenOsc2.connect(sirenGain);
        sirenGain.connect(this.masterGain);

        sirenOsc1.start(now);
        sirenOsc2.start(now);
        sirenOsc1.stop(now + 1.8);
        sirenOsc2.stop(now + 1.8);

        // Handcuff click sound (metallic click)
        setTimeout(() => {
            this.playHandcuffClick();
        }, 1800);
    }

    // Handcuff click - metallic snap
    playHandcuffClick() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Create noise for metallic click
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const clickFilter = this.audioContext.createBiquadFilter();
        clickFilter.type = 'bandpass';
        clickFilter.frequency.value = 2000;
        clickFilter.Q.value = 10;

        const clickGain = this.audioContext.createGain();
        clickGain.gain.setValueAtTime(0.35, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        noise.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 0.05);
    }

    // COP MUMBLING - Sims-style gibberish talking
    playCopMumbling() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const duration = 3;
        const syllables = 8; // Number of gibberish syllables

        for (let i = 0; i < syllables; i++) {
            const startTime = now + (i * duration / syllables);
            const syllableDuration = 0.15 + Math.random() * 0.1;

            // Create oscillator for voice
            const voice = this.audioContext.createOscillator();
            const voiceGain = this.audioContext.createGain();
            const voiceFilter = this.audioContext.createBiquadFilter();

            // Random pitch for irritated/disappointed tone
            const basePitch = 180 + Math.random() * 40; // Lower pitch for irritation
            voice.type = 'sawtooth';
            voice.frequency.setValueAtTime(basePitch, startTime);

            // Add pitch variation for talking effect
            voice.frequency.linearRampToValueAtTime(basePitch * (0.9 + Math.random() * 0.2), startTime + syllableDuration * 0.5);
            voice.frequency.linearRampToValueAtTime(basePitch * 0.95, startTime + syllableDuration);

            // Filter for voice-like quality
            voiceFilter.type = 'bandpass';
            voiceFilter.frequency.value = 500 + Math.random() * 300;
            voiceFilter.Q.value = 5;

            // Envelope for syllable
            voiceGain.gain.setValueAtTime(0, startTime);
            voiceGain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
            voiceGain.gain.setValueAtTime(0.3, startTime + syllableDuration - 0.02);
            voiceGain.gain.linearRampToValueAtTime(0, startTime + syllableDuration);

            voice.connect(voiceFilter);
            voiceFilter.connect(voiceGain);
            voiceGain.connect(this.masterGain);

            voice.start(startTime);
            voice.stop(startTime + syllableDuration);
        }
    }

    // GAVEL STRIKE - Deep thud sound
    playGavelStrike() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Low frequency thump
        const gavelOsc = this.audioContext.createOscillator();
        const gavelGain = this.audioContext.createGain();
        const gavelFilter = this.audioContext.createBiquadFilter();

        gavelOsc.type = 'sine';
        gavelOsc.frequency.setValueAtTime(80, now);
        gavelOsc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

        gavelFilter.type = 'lowpass';
        gavelFilter.frequency.value = 200;

        gavelGain.gain.setValueAtTime(0.9, now);
        gavelGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        gavelOsc.connect(gavelFilter);
        gavelFilter.connect(gavelGain);
        gavelGain.connect(this.masterGain);

        gavelOsc.start(now);
        gavelOsc.stop(now + 0.3);

        // Add impact noise
        this.playImpactNoise(now, 0.45);
    }

    // PRISON DOOR CLANG - Metal door sound
    playPrisonDoorClang() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Metallic resonance
        const clang1 = this.audioContext.createOscillator();
        const clang2 = this.audioContext.createOscillator();
        const clang3 = this.audioContext.createOscillator();
        const clangGain = this.audioContext.createGain();

        clang1.type = 'square';
        clang2.type = 'square';
        clang3.type = 'sine';

        // Multiple frequencies for metallic sound
        clang1.frequency.setValueAtTime(400, now);
        clang1.frequency.exponentialRampToValueAtTime(350, now + 0.5);

        clang2.frequency.setValueAtTime(600, now);
        clang2.frequency.exponentialRampToValueAtTime(500, now + 0.5);

        clang3.frequency.setValueAtTime(200, now);
        clang3.frequency.exponentialRampToValueAtTime(150, now + 0.5);

        clangGain.gain.setValueAtTime(0.3, now);
        clangGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        clang1.connect(clangGain);
        clang2.connect(clangGain);
        clang3.connect(clangGain);
        clangGain.connect(this.masterGain);

        clang1.start(now);
        clang2.start(now);
        clang3.start(now);
        clang1.stop(now + 0.8);
        clang2.stop(now + 0.8);
        clang3.stop(now + 0.8);

        // Add impact noise for door slam
        this.playImpactNoise(now, 0.35);
    }

    // Helper: Impact noise for thuds and clangs
    playImpactNoise(startTime, gain) {
        if (!this.initialized) return;

        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.05));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 800;

        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(gain, startTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(startTime);
        noise.stop(startTime + 0.1);
    }

    // VOICE PREVIEW SYSTEM - Character voice personality samples
    playVoicePreview(voiceType) {
        if (!this.initialized) this.init();
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Voice configurations for each personality type
        const voiceConfigs = {
            deep: {
                // Deep and Resigned: Low frequency, slow, descending tone
                baseFreq: 120,
                freqRange: 30,
                duration: 1.5,
                waveType: 'triangle',
                filterFreq: 400,
                filterQ: 3,
                pitchCurve: 'down', // Descending
                vibrato: false,
                attack: 0.15,
                decay: 0.4,
                sustain: 0.3,
                release: 0.6,
                gain: 0.6 // Increased from 0.25
            },
            high: {
                // High and Anxious: High frequency, rapid, wavering/vibrato
                baseFreq: 280,
                freqRange: 70,
                duration: 1.2,
                waveType: 'sine',
                filterFreq: 1200,
                filterQ: 4,
                pitchCurve: 'wavy',
                vibrato: true,
                vibratoRate: 8, // Hz - rapid tremolo
                vibratoDepth: 15, // Hz
                attack: 0.05,
                decay: 0.1,
                sustain: 0.4,
                release: 0.25,
                gain: 0.5 // Increased from 0.2
            },
            monotone: {
                // Monotone Bureaucrat: Mid frequency, flat, no variation
                baseFreq: 190,
                freqRange: 0, // No variation
                duration: 1.3,
                waveType: 'square',
                filterFreq: 600,
                filterQ: 2,
                pitchCurve: 'flat',
                vibrato: false,
                attack: 0.08,
                decay: 0.05,
                sustain: 0.7,
                release: 0.2,
                gain: 0.55 // Increased from 0.22
            },
            enthusiastic: {
                // Disturbingly Enthusiastic: Mid-high, ascending, energetic
                baseFreq: 220,
                freqRange: 60,
                duration: 1.4,
                waveType: 'sawtooth',
                filterFreq: 900,
                filterQ: 5,
                pitchCurve: 'up', // Ascending
                vibrato: true,
                vibratoRate: 5, // Hz - moderate
                vibratoDepth: 8,
                attack: 0.03,
                decay: 0.08,
                sustain: 0.5,
                release: 0.3,
                gain: 0.58 // Increased from 0.23
            }
        };

        const config = voiceConfigs[voiceType];
        if (!config) return;

        // Main voice oscillator
        const voice = this.audioContext.createOscillator();
        voice.type = config.waveType;

        // LFO for vibrato (if enabled)
        let lfo = null;
        let lfoGain = null;
        if (config.vibrato) {
            lfo = this.audioContext.createOscillator();
            lfo.frequency.value = config.vibratoRate;
            lfoGain = this.audioContext.createGain();
            lfoGain.gain.value = config.vibratoDepth;
            lfo.connect(lfoGain);
            lfoGain.connect(voice.frequency);
        }

        // Set pitch envelope based on personality
        const startFreq = config.baseFreq;
        const endFreq = startFreq + config.freqRange;

        switch (config.pitchCurve) {
            case 'down':
                // Descending for resigned
                voice.frequency.setValueAtTime(startFreq, now);
                voice.frequency.linearRampToValueAtTime(startFreq - config.freqRange, now + config.duration);
                break;
            case 'up':
                // Ascending for enthusiastic
                voice.frequency.setValueAtTime(startFreq, now);
                voice.frequency.linearRampToValueAtTime(endFreq, now + config.duration * 0.7);
                voice.frequency.linearRampToValueAtTime(endFreq * 1.05, now + config.duration);
                break;
            case 'wavy':
                // Anxious wavering
                voice.frequency.setValueAtTime(startFreq, now);
                voice.frequency.linearRampToValueAtTime(startFreq + 30, now + 0.3);
                voice.frequency.linearRampToValueAtTime(startFreq - 20, now + 0.6);
                voice.frequency.linearRampToValueAtTime(startFreq + 40, now + 0.9);
                voice.frequency.linearRampToValueAtTime(startFreq + 10, now + config.duration);
                break;
            case 'flat':
                // Monotone
                voice.frequency.setValueAtTime(startFreq, now);
                break;
        }

        // Bandpass filter for voice-like quality
        const voiceFilter = this.audioContext.createBiquadFilter();
        voiceFilter.type = 'bandpass';
        voiceFilter.frequency.value = config.filterFreq;
        voiceFilter.Q.value = config.filterQ;

        // ADSR Envelope
        const voiceGain = this.audioContext.createGain();
        voiceGain.gain.setValueAtTime(0, now);
        voiceGain.gain.linearRampToValueAtTime(config.gain, now + config.attack); // Attack
        voiceGain.gain.linearRampToValueAtTime(config.gain * config.sustain, now + config.attack + config.decay); // Decay
        voiceGain.gain.setValueAtTime(config.gain * config.sustain, now + config.duration - config.release); // Sustain
        voiceGain.gain.linearRampToValueAtTime(0, now + config.duration); // Release

        // Connect audio graph
        voice.connect(voiceFilter);
        voiceFilter.connect(voiceGain);
        voiceGain.connect(this.masterGain);

        // Start playback
        voice.start(now);
        if (lfo) lfo.start(now);

        // Stop playback
        voice.stop(now + config.duration);
        if (lfo) lfo.stop(now + config.duration);
    }

    // === NEW SOUND EFFECTS (25+) ===

    // UI SOUNDS

    // Button click - satisfying tactile click
    playButtonClick() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const clickGain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        clickGain.gain.setValueAtTime(0.15, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(clickGain);
        clickGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Menu navigation - soft beep
    playMenuBeep() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const beepGain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = 440;

        beepGain.gain.setValueAtTime(0.1, now);
        beepGain.gain.linearRampToValueAtTime(0, now + 0.1);

        osc.connect(beepGain);
        beepGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Success jingle - positive feedback
    playSuccessSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const notes = [
            { freq: 523, time: 0, duration: 0.15 },
            { freq: 659, time: 0.12, duration: 0.15 },
            { freq: 784, time: 0.24, duration: 0.25 }
        ];

        notes.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = note.freq;

            const startTime = now + note.time;
            noteGain.gain.setValueAtTime(0.12, startTime);
            noteGain.gain.linearRampToValueAtTime(0, startTime + note.duration);

            osc.connect(noteGain);
            noteGain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + note.duration);
        });
    }

    // Fail sound - negative feedback
    playFailSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const failGain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);

        failGain.gain.setValueAtTime(0.15, now);
        failGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(failGain);
        failGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // Notification sound - attention grabbing
    playNotification() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const notifGain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(660, now + 0.1);

        notifGain.gain.setValueAtTime(0.12, now);
        notifGain.gain.setValueAtTime(0.12, now + 0.1);
        notifGain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.connect(notifGain);
        notifGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // COURTROOM SOUNDS

    // Paper shuffling
    playPaperShuffle() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Create rustling noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin(i / 100);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 3;

        const paperGain = this.audioContext.createGain();
        paperGain.gain.setValueAtTime(0.15, now);
        paperGain.gain.linearRampToValueAtTime(0, now + 0.5);

        noise.connect(filter);
        filter.connect(paperGain);
        paperGain.connect(this.masterGain);

        noise.start(now);
    }

    // Stamp sound - form stamping
    playStampSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Impact
        const impact = this.audioContext.createOscillator();
        const impactGain = this.audioContext.createGain();

        impact.type = 'sine';
        impact.frequency.setValueAtTime(120, now);
        impact.frequency.exponentialRampToValueAtTime(60, now + 0.08);

        impactGain.gain.setValueAtTime(0.2, now);
        impactGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        impact.connect(impactGain);
        impactGain.connect(this.masterGain);

        impact.start(now);
        impact.stop(now + 0.08);

        // Add ink squish
        this.playImpactNoise(now, 0.12);
    }

    // Typing sound - form filling
    playTypingSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const duration = 0.6;
        const keystrokes = 8;

        for (let i = 0; i < keystrokes; i++) {
            const time = now + (i * duration / keystrokes);
            const osc = this.audioContext.createOscillator();
            const typeGain = this.audioContext.createGain();

            osc.type = 'square';
            osc.frequency.value = 2000 + Math.random() * 500;

            typeGain.gain.setValueAtTime(0.08, time);
            typeGain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

            osc.connect(typeGain);
            typeGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.03);
        }
    }

    // DRIVING SOUNDS

    // Engine start
    playEngineStart() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const engineGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.5);
        osc.frequency.linearRampToValueAtTime(100, now + 1.5);

        filter.type = 'lowpass';
        filter.frequency.value = 400;

        engineGain.gain.setValueAtTime(0, now);
        engineGain.gain.linearRampToValueAtTime(0.25, now + 0.3);
        engineGain.gain.setValueAtTime(0.25, now + 1.3);
        engineGain.gain.linearRampToValueAtTime(0.15, now + 1.5);

        osc.connect(filter);
        filter.connect(engineGain);
        engineGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.5);
    }

    // Acceleration sound
    playAcceleration() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const accelGain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.3);

        accelGain.gain.setValueAtTime(0.15, now);
        accelGain.gain.linearRampToValueAtTime(0.08, now + 0.3);

        osc.connect(accelGain);
        accelGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Brake/skid sound
    playBrake() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.4;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Skid noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;

        const brakeGain = this.audioContext.createGain();
        brakeGain.gain.setValueAtTime(0.18, now);
        brakeGain.gain.linearRampToValueAtTime(0, now + 0.4);

        noise.connect(filter);
        filter.connect(brakeGain);
        brakeGain.connect(this.masterGain);

        noise.start(now);
    }

    // Horn honk
    playHorn() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const hornGain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.value = 220;

        hornGain.gain.setValueAtTime(0.2, now);
        hornGain.gain.setValueAtTime(0.2, now + 0.3);
        hornGain.gain.linearRampToValueAtTime(0, now + 0.35);

        osc.connect(hornGain);
        hornGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    // PRISON SOUNDS

    // Footsteps - heavy boots
    playFootsteps(count = 4) {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const stepInterval = 0.4; // Time between steps

        for (let i = 0; i < count; i++) {
            const time = now + (i * stepInterval);
            const osc = this.audioContext.createOscillator();
            const stepGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, time);
            osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);

            stepGain.gain.setValueAtTime(0.15, time);
            stepGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

            osc.connect(stepGain);
            stepGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.1);
        }
    }

    // Money counting
    playMoneyCount() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bills = 5;
        const interval = 0.08;

        for (let i = 0; i < bills; i++) {
            const time = now + (i * interval);
            this.playPaperShuffle();
        }
    }

    // Cigarette lighter
    playCigaretteLighter() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Flick sound
        const flick = this.audioContext.createOscillator();
        const flickGain = this.audioContext.createGain();

        flick.type = 'square';
        flick.frequency.value = 1200;

        flickGain.gain.setValueAtTime(0.1, now);
        flickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        flick.connect(flickGain);
        flickGain.connect(this.masterGain);

        flick.start(now);
        flick.stop(now + 0.05);

        // Flame ignition (hiss)
        setTimeout(() => {
            const bufferSize = this.audioContext.sampleRate * 0.3;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.05;
            }

            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;

            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;

            const flameGain = this.audioContext.createGain();
            flameGain.gain.value = 0.08;

            noise.connect(filter);
            filter.connect(flameGain);
            flameGain.connect(this.masterGain);

            noise.start(this.audioContext.currentTime);
        }, 50);
    }

    // Tattoo machine buzz
    playTattooMachine(duration = 2) {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const buzzGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = 120;

        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 5;

        // Pulsing gain for machine effect
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 8; // 8 Hz pulse
        lfoGain.gain.value = 0.05;

        lfo.connect(lfoGain);
        lfoGain.connect(buzzGain.gain);

        buzzGain.gain.setValueAtTime(0.1, now);
        buzzGain.gain.setValueAtTime(0.1, now + duration - 0.1);
        buzzGain.gain.linearRampToValueAtTime(0, now + duration);

        osc.connect(filter);
        filter.connect(buzzGain);
        buzzGain.connect(this.masterGain);

        osc.start(now);
        lfo.start(now);
        osc.stop(now + duration);
        lfo.stop(now + duration);
    }

    // Eating sound - chewing
    playEatingSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const chews = 6;
        const interval = 0.5;

        for (let i = 0; i < chews; i++) {
            const time = now + (i * interval);
            const osc = this.audioContext.createOscillator();
            const chewGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.linearRampToValueAtTime(180, time + 0.2);

            chewGain.gain.setValueAtTime(0.06, time);
            chewGain.gain.linearRampToValueAtTime(0, time + 0.2);

            osc.connect(chewGain);
            chewGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.2);
        }
    }

    // Weight lifting - exertion grunt
    playWeightLift() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Effort grunt
        const osc = this.audioContext.createOscillator();
        const gruntGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.4);

        filter.type = 'bandpass';
        filter.frequency.value = 300;
        filter.Q.value = 3;

        gruntGain.gain.setValueAtTime(0, now);
        gruntGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gruntGain.gain.setValueAtTime(0.12, now + 0.3);
        gruntGain.gain.linearRampToValueAtTime(0, now + 0.4);

        osc.connect(filter);
        filter.connect(gruntGain);
        gruntGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.4);

        // Weights clang
        setTimeout(() => {
            this.playImpactNoise(this.audioContext.currentTime, 0.15);
        }, 450);
    }

    // Reading/page turn
    playPageTurn() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2 * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2500;
        filter.Q.value = 2;

        const pageGain = this.audioContext.createGain();
        pageGain.gain.setValueAtTime(0.1, now);
        pageGain.gain.linearRampToValueAtTime(0, now + 0.2);

        noise.connect(filter);
        filter.connect(pageGain);
        pageGain.connect(this.masterGain);

        noise.start(now);
    }

    // Lock/unlock sound
    playLockSound(isLocking = true) {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;

        // Mechanical click
        const click = this.audioContext.createOscillator();
        const clickGain = this.audioContext.createGain();

        click.type = 'square';
        click.frequency.value = isLocking ? 800 : 1200;

        clickGain.gain.setValueAtTime(0.12, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        click.connect(clickGain);
        clickGain.connect(this.masterGain);

        click.start(now);
        click.stop(now + 0.08);
    }

    // Water drinking
    playDrinkingSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const gulps = 3;
        const interval = 0.4;

        for (let i = 0; i < gulps; i++) {
            const time = now + (i * interval);
            const osc = this.audioContext.createOscillator();
            const gulpGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.linearRampToValueAtTime(120, time + 0.15);

            gulpGain.gain.setValueAtTime(0.08, time);
            gulpGain.gain.linearRampToValueAtTime(0, time + 0.15);

            osc.connect(gulpGain);
            gulpGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.15);
        }
    }

    // Shower/water sound
    playShowerSound(duration = 3) {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // White noise for water
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        filter.Q.value = 1;

        const showerGain = this.audioContext.createGain();
        showerGain.gain.setValueAtTime(0, now);
        showerGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
        showerGain.gain.setValueAtTime(0.12, now + duration - 0.5);
        showerGain.gain.linearRampToValueAtTime(0, now + duration);

        noise.connect(filter);
        filter.connect(showerGain);
        showerGain.connect(this.masterGain);

        noise.start(now);
    }

    // Coin drop/transaction
    playCoinSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const coins = [800, 600, 500, 400];

        coins.forEach((freq, i) => {
            const time = now + (i * 0.05);
            const osc = this.audioContext.createOscillator();
            const coinGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.8, time + 0.2);

            coinGain.gain.setValueAtTime(0.1, time);
            coinGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

            osc.connect(coinGain);
            coinGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.2);
        });
    }

    // Screen transition whoosh
    playTransitionWhoosh() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.4;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.linearRampToValueAtTime(400, now + 0.4);
        filter.Q.value = 5;

        const whooshGain = this.audioContext.createGain();
        whooshGain.gain.setValueAtTime(0.15, now);
        whooshGain.gain.linearRampToValueAtTime(0, now + 0.4);

        noise.connect(filter);
        filter.connect(whooshGain);
        whooshGain.connect(this.masterGain);

        noise.start(now);
    }

    // Stat increase sound
    playStatIncrease() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const notes = [392, 440, 494];

        notes.forEach((freq, i) => {
            const time = now + (i * 0.08);
            const osc = this.audioContext.createOscillator();
            const statGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            statGain.gain.setValueAtTime(0.1, time);
            statGain.gain.linearRampToValueAtTime(0, time + 0.15);

            osc.connect(statGain);
            statGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.15);
        });
    }

    // Stat decrease sound
    playStatDecrease() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const statGain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);

        statGain.gain.setValueAtTime(0.12, now);
        statGain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.connect(statGain);
        statGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Time advance sound (days passing)
    playTimeAdvance() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const ticks = 4;
        const interval = 0.1;

        for (let i = 0; i < ticks; i++) {
            const time = now + (i * interval);
            const osc = this.audioContext.createOscillator();
            const tickGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = 1000 + (i * 100);

            tickGain.gain.setValueAtTime(0.08, time);
            tickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

            osc.connect(tickGain);
            tickGain.connect(this.masterGain);

            osc.start(time);
            osc.stop(time + 0.05);
        }
    }

    // Generic error/warning sound
    playErrorSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const errorGain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(440, now + 0.1);
        osc.frequency.setValueAtTime(440, now + 0.2);

        errorGain.gain.setValueAtTime(0.12, now);
        errorGain.gain.setValueAtTime(0, now + 0.05);
        errorGain.gain.setValueAtTime(0.12, now + 0.1);
        errorGain.gain.setValueAtTime(0, now + 0.15);
        errorGain.gain.setValueAtTime(0.12, now + 0.2);
        errorGain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.connect(errorGain);
        errorGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Glitch sound (for dystopian aesthetic)
    playGlitchSound() {
        if (!this.initialized) return;

        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.15;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Chaotic noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000 + Math.random() * 2000;
        filter.Q.value = 10;

        const glitchGain = this.audioContext.createGain();
        glitchGain.gain.setValueAtTime(0.15, now);
        glitchGain.gain.linearRampToValueAtTime(0, now + 0.15);

        noise.connect(filter);
        filter.connect(glitchGain);
        glitchGain.connect(this.masterGain);

        noise.start(now);
    }
}
