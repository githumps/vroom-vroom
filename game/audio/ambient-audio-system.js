// VROOM VROOM - Ambient Audio System
// Environmental layers for atmospheric depth
// All sounds synthesized with Web Audio API

class AmbientAudioSystem {
    constructor(audioContext, masterGain) {
        this.audioContext = audioContext;
        this.masterGain = masterGain;
        this.ambientGain = null;
        this.volume = 0.15; // Ambient default volume (lower than music/SFX)

        // Active ambient layers
        this.activeLayers = [];
        this.currentEnvironment = null;

        // Layer control
        this.isPlaying = false;
    }

    init() {
        if (this.ambientGain) return;

        this.ambientGain = this.audioContext.createGain();
        this.ambientGain.gain.value = this.volume;
        this.ambientGain.connect(this.masterGain);

        console.log('Ambient audio system initialized');
    }

    // Set ambient volume (0.0 to 1.0)
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.ambientGain) {
            this.ambientGain.gain.value = this.volume;
        }
    }

    // Get current volume
    getVolume() {
        return this.volume;
    }

    // Stop all ambient audio
    stop() {
        if (!this.isPlaying) return;

        const now = this.audioContext.currentTime;

        // Fade out
        if (this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(this.volume, now);
            this.ambientGain.gain.linearRampToValueAtTime(0, now + 2);
        }

        // Stop all layers
        setTimeout(() => {
            this.stopAllLayers();
            if (this.ambientGain) {
                this.ambientGain.gain.value = this.volume;
            }
        }, 2100);

        this.isPlaying = false;
        this.currentEnvironment = null;
    }

    // Stop all active layers
    stopAllLayers() {
        this.activeLayers.forEach(layer => {
            try {
                if (layer.stop) layer.stop();
                if (layer.disconnect) layer.disconnect();
                if (layer.interval) clearInterval(layer.interval);
            } catch (e) {
                // Layer may already be stopped
            }
        });
        this.activeLayers = [];
    }

    // Play ambient environment
    play(environmentName) {
        if (this.currentEnvironment === environmentName && this.isPlaying) return;

        if (this.isPlaying) {
            // Crossfade to new environment
            this.crossfade(environmentName);
        } else {
            // Start fresh
            this.startEnvironment(environmentName);
        }
    }

    // Crossfade between environments
    crossfade(newEnvironment) {
        const now = this.audioContext.currentTime;
        const fadeDuration = 3; // 3 second crossfade

        // Fade out current environment
        if (this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(this.volume, now);
            this.ambientGain.gain.linearRampToValueAtTime(0, now + fadeDuration);
        }

        // After fade out, stop old environment and start new one
        setTimeout(() => {
            this.stopAllLayers();
            if (this.ambientGain) {
                this.ambientGain.gain.value = 0;
            }
            this.startEnvironment(newEnvironment);

            // Fade in new environment
            if (this.ambientGain) {
                this.ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
                this.ambientGain.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + fadeDuration);
            }
        }, fadeDuration * 1000);
    }

    // Start playing an environment
    startEnvironment(environmentName) {
        this.init(); // Ensure initialized

        this.stopAllLayers(); // Clean up any previous environment
        this.currentEnvironment = environmentName;
        this.isPlaying = true;

        // Select environment based on name
        switch (environmentName) {
            case 'menu':
                this.playMenuAmbient();
                break;
            case 'driving':
                this.playDrivingAmbient();
                break;
            case 'courtroom':
                this.playCourtroomAmbient();
                break;
            case 'prison':
                this.playPrisonAmbient();
                break;
            default:
                console.warn('Unknown environment:', environmentName);
        }
    }

    // === ENVIRONMENT PRESETS ===

    // Menu ambient - minimal, atmospheric
    playMenuAmbient() {
        // Subtle room tone
        this.createRoomTone(0.03);

        // Occasional digital artifacts (dystopian aesthetic)
        this.scheduleRandomEvent(() => {
            this.createDigitalGlitch(0.05);
        }, 10000, 20000); // Every 10-20 seconds
    }

    // Driving ambient - wind, road noise
    playDrivingAmbient() {
        // Wind noise
        this.createWindNoise(0.08);

        // Road rumble
        this.createRoadRumble(0.06);

        // Occasional car creaks
        this.scheduleRandomEvent(() => {
            this.createCarCreak(0.04);
        }, 5000, 15000);
    }

    // Courtroom ambient - ventilation, room tone
    playCourtroomAmbient() {
        // HVAC hum
        this.createHVACHum(0.05);

        // Room tone (empty courtroom)
        this.createRoomTone(0.04);

        // Occasional distant sounds (doors, footsteps)
        this.scheduleRandomEvent(() => {
            this.createDistantFootsteps(0.03);
        }, 15000, 30000);
    }

    // Prison ambient - distant voices, metal clangs, oppressive atmosphere
    playPrisonAmbient() {
        // Cell block ambience
        this.createCellBlockAmbience(0.07);

        // Distant conversations (murmur)
        this.createPrisonMurmur(0.05);

        // Random metal clangs (distant doors)
        this.scheduleRandomEvent(() => {
            this.createDistantClang(0.04);
        }, 8000, 20000);

        // Occasional guard whistles
        this.scheduleRandomEvent(() => {
            this.createGuardWhistle(0.03);
        }, 20000, 40000);

        // Footsteps in hallway
        this.scheduleRandomEvent(() => {
            this.createDistantFootsteps(0.03);
        }, 10000, 25000);
    }

    // === AMBIENT LAYER BUILDERS ===

    // Create continuous room tone
    createRoomTone(gain) {
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 4; // 4 second loop
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Very subtle pink noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        const toneGain = this.audioContext.createGain();
        toneGain.gain.value = gain;

        noise.connect(filter);
        filter.connect(toneGain);
        toneGain.connect(this.ambientGain);

        noise.start(now);

        this.activeLayers.push(noise);
    }

    // Wind noise (driving)
    createWindNoise(gain) {
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Whooshing wind
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin(i / 1000);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        filter.Q.value = 2;

        const windGain = this.audioContext.createGain();
        windGain.gain.value = gain;

        noise.connect(filter);
        filter.connect(windGain);
        windGain.connect(this.ambientGain);

        noise.start(now);

        this.activeLayers.push(noise);
    }

    // Road rumble (driving)
    createRoadRumble(gain) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const rumbleGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = 60 + Math.random() * 20;

        // Add LFO for variation
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.5;
        lfoGain.gain.value = 10;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        filter.type = 'lowpass';
        filter.frequency.value = 150;

        rumbleGain.gain.value = gain;

        osc.connect(filter);
        filter.connect(rumbleGain);
        rumbleGain.connect(this.ambientGain);

        osc.start(now);
        lfo.start(now);

        this.activeLayers.push(osc, lfo);
    }

    // HVAC hum (courtroom)
    createHVACHum(gain) {
        const now = this.audioContext.currentTime;
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const hvacGain = this.audioContext.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 120;
        osc2.frequency.value = 180;

        hvacGain.gain.value = gain;

        osc1.connect(hvacGain);
        osc2.connect(hvacGain);
        hvacGain.connect(this.ambientGain);

        osc1.start(now);
        osc2.start(now);

        this.activeLayers.push(osc1, osc2);
    }

    // Cell block ambience (prison)
    createCellBlockAmbience(gain) {
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Reverberant space noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.15 * (1 + Math.sin(i / 5000));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;

        const cellGain = this.audioContext.createGain();
        cellGain.gain.value = gain;

        noise.connect(filter);
        filter.connect(cellGain);
        cellGain.connect(this.ambientGain);

        noise.start(now);

        this.activeLayers.push(noise);
    }

    // Prison murmur (distant conversations)
    createPrisonMurmur(gain) {
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 4;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Murmuring voices (filtered noise)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.2 * Math.sin(i / 200) * Math.sin(i / 500);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 300;
        filter.Q.value = 5;

        const murmurGain = this.audioContext.createGain();
        murmurGain.gain.value = gain;

        noise.connect(filter);
        filter.connect(murmurGain);
        murmurGain.connect(this.ambientGain);

        noise.start(now);

        this.activeLayers.push(noise);
    }

    // === RANDOM EVENT SOUNDS ===

    // Schedule random events
    scheduleRandomEvent(soundFunction, minInterval, maxInterval) {
        const scheduleNext = () => {
            if (!this.isPlaying) return;

            const randomDelay = minInterval + Math.random() * (maxInterval - minInterval);
            setTimeout(() => {
                if (this.isPlaying) {
                    soundFunction();
                    scheduleNext();
                }
            }, randomDelay);
        };

        scheduleNext();
    }

    // Digital glitch (menu)
    createDigitalGlitch(gain) {
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000 + Math.random() * 3000;
        filter.Q.value = 15;

        const glitchGain = this.audioContext.createGain();
        glitchGain.gain.setValueAtTime(gain, now);
        glitchGain.gain.linearRampToValueAtTime(0, now + 0.1);

        noise.connect(filter);
        filter.connect(glitchGain);
        glitchGain.connect(this.ambientGain);

        noise.start(now);
    }

    // Car creak (driving)
    createCarCreak(gain) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const creakGain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200 + Math.random() * 100, now);
        osc.frequency.linearRampToValueAtTime(150 + Math.random() * 100, now + 0.3);

        creakGain.gain.setValueAtTime(0, now);
        creakGain.gain.linearRampToValueAtTime(gain, now + 0.05);
        creakGain.gain.setValueAtTime(gain, now + 0.2);
        creakGain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.connect(creakGain);
        creakGain.connect(this.ambientGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Distant footsteps
    createDistantFootsteps(gain) {
        const now = this.audioContext.currentTime;
        const steps = 3 + Math.floor(Math.random() * 4);
        const interval = 0.4 + Math.random() * 0.2;

        for (let i = 0; i < steps; i++) {
            const time = now + (i * interval);
            const osc = this.audioContext.createOscillator();
            const stepGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(80 + Math.random() * 40, time);
            osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

            stepGain.gain.setValueAtTime(gain, time);
            stepGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

            osc.connect(stepGain);
            stepGain.connect(this.ambientGain);

            osc.start(time);
            osc.stop(time + 0.08);
        }
    }

    // Distant metal clang (prison doors)
    createDistantClang(gain) {
        const now = this.audioContext.currentTime;
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const clangGain = this.audioContext.createGain();

        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.value = 400 + Math.random() * 200;
        osc2.frequency.value = 600 + Math.random() * 200;

        clangGain.gain.setValueAtTime(gain, now);
        clangGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc1.connect(clangGain);
        osc2.connect(clangGain);
        clangGain.connect(this.ambientGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
    }

    // Guard whistle
    createGuardWhistle(gain) {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const whistleGain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.linearRampToValueAtTime(2500, now + 0.15);
        osc.frequency.linearRampToValueAtTime(2000, now + 0.3);

        whistleGain.gain.setValueAtTime(0, now);
        whistleGain.gain.linearRampToValueAtTime(gain, now + 0.02);
        whistleGain.gain.setValueAtTime(gain, now + 0.28);
        whistleGain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.connect(whistleGain);
        whistleGain.connect(this.ambientGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }
}
