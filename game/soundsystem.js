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
        sirenGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        sirenGain.gain.setValueAtTime(0.3, now + 1.2);
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
        clickGain.gain.setValueAtTime(0.5, now);
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
            voiceGain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
            voiceGain.gain.setValueAtTime(0.15, startTime + syllableDuration - 0.02);
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

        gavelGain.gain.setValueAtTime(0.6, now);
        gavelGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        gavelOsc.connect(gavelFilter);
        gavelFilter.connect(gavelGain);
        gavelGain.connect(this.masterGain);

        gavelOsc.start(now);
        gavelOsc.stop(now + 0.3);

        // Add impact noise
        this.playImpactNoise(now, 0.3);
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

        clangGain.gain.setValueAtTime(0.4, now);
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
        this.playImpactNoise(now, 0.5);
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
}
