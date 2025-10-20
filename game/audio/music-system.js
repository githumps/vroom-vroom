// VROOM VROOM - Procedural Music System
// Disco Elysium-inspired dystopian synthwave
// All music generated with Web Audio API (no audio files)

class MusicSystem {
    constructor(audioContext, masterGain) {
        this.audioContext = audioContext;
        this.masterGain = masterGain;
        this.musicGain = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.volume = 0.3; // Music default volume (lower than SFX)

        // Active oscillators and nodes for cleanup
        this.activeNodes = [];

        // Track transition state
        this.isCrossfading = false;
        this.nextTrackCallback = null;
    }

    init() {
        if (this.musicGain) return;

        this.musicGain = this.audioContext.createGain();
        this.musicGain.gain.value = this.volume;
        this.musicGain.connect(this.masterGain);

        console.log('Music system initialized');
    }

    // Set music volume (0.0 to 1.0)
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.musicGain) {
            this.musicGain.gain.value = this.volume;
        }
    }

    // Get current volume
    getVolume() {
        return this.volume;
    }

    // Stop all music
    stop() {
        if (!this.isPlaying) return;

        const now = this.audioContext.currentTime;

        // Fade out over 1 second
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(this.volume, now);
            this.musicGain.gain.linearRampToValueAtTime(0, now + 1);
        }

        // Stop all active nodes
        setTimeout(() => {
            this.cleanupNodes();
            if (this.musicGain) {
                this.musicGain.gain.value = this.volume;
            }
        }, 1100);

        this.isPlaying = false;
        this.currentTrack = null;
    }

    // Cleanup all active audio nodes
    cleanupNodes() {
        this.activeNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {
                // Node may already be stopped
            }
        });
        this.activeNodes = [];
    }

    // Play a music track with crossfade
    play(trackName, intensity = 0.5) {
        if (this.currentTrack === trackName && this.isPlaying) return;

        if (this.isPlaying) {
            // Crossfade to new track
            this.crossfade(trackName, intensity);
        } else {
            // Start fresh
            this.startTrack(trackName, intensity);
        }
    }

    // Crossfade between tracks
    crossfade(newTrack, intensity) {
        if (this.isCrossfading) return;
        this.isCrossfading = true;

        const now = this.audioContext.currentTime;
        const fadeDuration = 2; // 2 second crossfade

        // Fade out current track
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(this.volume, now);
            this.musicGain.gain.linearRampToValueAtTime(0, now + fadeDuration);
        }

        // After fade out, stop old track and start new one
        setTimeout(() => {
            this.cleanupNodes();
            if (this.musicGain) {
                this.musicGain.gain.value = 0;
            }
            this.startTrack(newTrack, intensity);

            // Fade in new track
            if (this.musicGain) {
                this.musicGain.gain.setValueAtTime(0, this.audioContext.currentTime);
                this.musicGain.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + fadeDuration);
            }

            this.isCrossfading = false;
        }, fadeDuration * 1000);
    }

    // Start playing a track
    startTrack(trackName, intensity = 0.5) {
        this.init(); // Ensure initialized

        this.cleanupNodes(); // Clean up any previous track
        this.currentTrack = trackName;
        this.isPlaying = true;

        // Select track based on name
        switch (trackName) {
            case 'menu':
                this.playMenuTrack();
                break;
            case 'creation':
                this.playCreationTrack();
                break;
            case 'driving':
                this.playDrivingTrack(intensity);
                break;
            case 'courtroom':
                this.playCourtroomTrack();
                break;
            case 'prison':
                this.playPrisonTrack(intensity);
                break;
            default:
                console.warn('Unknown track:', trackName);
        }
    }

    // TRACK 1: Main Menu - Moody, atmospheric
    playMenuTrack() {
        const now = this.audioContext.currentTime;

        // Ambient pad - slow moving
        const pad = this.createPad(80, 0.15, now);

        // Subtle melody - melancholic
        this.createMelody([
            { freq: 220, time: 0, duration: 2 },
            { freq: 196, time: 2.5, duration: 2 },
            { freq: 165, time: 5, duration: 2 },
            { freq: 196, time: 7.5, duration: 2 },
        ], now, 10, 0.08); // Loop every 10 seconds

        // Deep bass pulse
        this.createBassPulse(55, 0.12, 5, now); // Every 5 seconds
    }

    // TRACK 2: Character Creation - Bureaucratic, tense
    playCreationTrack() {
        const now = this.audioContext.currentTime;

        // Tense pad
        const pad = this.createPad(110, 0.12, now);

        // Bureaucratic rhythm - mechanical
        this.createTypewriterRhythm(0.1, 1.2, now); // Every 1.2 seconds

        // Anxious arpeggio
        this.createArpeggio([165, 220, 247, 330], 0.4, 0.06, now); // Loop every 0.4s per note
    }

    // TRACK 3: Driving - Dystopian synthwave
    playDrivingTrack(intensity = 0.5) {
        const now = this.audioContext.currentTime;

        // Driving bass line
        const bassFreqs = [55, 55, 73, 65, 55, 55, 82, 73];
        this.createBassline(bassFreqs, 0.5, 0.15 * intensity, now);

        // Synthwave lead
        this.createSynthLead([
            { freq: 440, time: 0, duration: 1 },
            { freq: 392, time: 1, duration: 1 },
            { freq: 330, time: 2, duration: 1 },
            { freq: 392, time: 3, duration: 1 },
        ], now, 4, 0.1 * intensity);

        // Pad for atmosphere
        const pad = this.createPad(110, 0.08, now);

        // Police chase intensity (if high)
        if (intensity > 0.7) {
            this.createSiren(0.05, now);
        }
    }

    // TRACK 4: Courtroom - Ominous, judge theme
    playCourtroomTrack() {
        const now = this.audioContext.currentTime;

        // Ominous low pad
        const pad = this.createPad(65, 0.18, now);

        // Authoritative bass
        this.createBassPulse(41, 0.2, 3, now); // Every 3 seconds - slow, heavy

        // Gavel rhythm (subtle metallic percussion)
        this.createGavelRhythm(0.08, 6, now); // Every 6 seconds

        // Tense high note (judgment)
        this.createHighTensionNote(880, 0.05, 12, now); // Every 12 seconds
    }

    // TRACK 5: Prison - Oppressive, rhythmic
    playPrisonTrack(intensity = 0.5) {
        const now = this.audioContext.currentTime;

        // Oppressive low drone
        const drone = this.createDrone(49, 0.15, now);

        // Metallic rhythm (prison bars)
        this.createMetallicRhythm(0.08, 2.5, now); // Every 2.5 seconds

        // Slow descending melody (hopelessness)
        this.createMelody([
            { freq: 196, time: 0, duration: 3 },
            { freq: 175, time: 4, duration: 3 },
            { freq: 147, time: 8, duration: 3 },
            { freq: 131, time: 12, duration: 3 },
        ], now, 16, 0.06);

        // Time passing (clock-like pulse)
        this.createClockPulse(0.04, 1, now); // Every second
    }

    // === MUSICAL BUILDING BLOCKS ===

    // Create ambient pad (sustained chords)
    createPad(baseFreq, gain, startTime) {
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const osc3 = this.audioContext.createOscillator();
        const padGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';

        // Create chord (root, fifth, octave)
        osc1.frequency.value = baseFreq;
        osc2.frequency.value = baseFreq * 1.5; // Fifth
        osc3.frequency.value = baseFreq * 2; // Octave

        // Slow LFO for movement
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.1; // Very slow
        lfoGain.gain.value = 5; // Subtle pitch drift

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        // Low-pass filter for warmth
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;

        padGain.gain.value = gain;

        osc1.connect(filter);
        osc2.connect(filter);
        osc3.connect(filter);
        filter.connect(padGain);
        padGain.connect(this.musicGain);

        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);
        lfo.start(startTime);

        this.activeNodes.push(osc1, osc2, osc3, lfo, padGain, filter);

        return padGain;
    }

    // Create drone (single sustained note)
    createDrone(freq, gain, startTime) {
        const osc = this.audioContext.createOscillator();
        const droneGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 300;

        droneGain.gain.value = gain;

        osc.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(this.musicGain);

        osc.start(startTime);

        this.activeNodes.push(osc, droneGain, filter);

        return droneGain;
    }

    // Create melody sequence
    createMelody(notes, startTime, loopDuration, gain) {
        const scheduleNotes = (offset) => {
            notes.forEach(note => {
                const osc = this.audioContext.createOscillator();
                const noteGain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                osc.type = 'triangle';
                osc.frequency.value = note.freq;

                filter.type = 'bandpass';
                filter.frequency.value = note.freq * 2;
                filter.Q.value = 3;

                const noteStart = startTime + offset + note.time;
                const noteEnd = noteStart + note.duration;

                // ADSR envelope
                noteGain.gain.setValueAtTime(0, noteStart);
                noteGain.gain.linearRampToValueAtTime(gain, noteStart + 0.1);
                noteGain.gain.setValueAtTime(gain, noteEnd - 0.2);
                noteGain.gain.linearRampToValueAtTime(0, noteEnd);

                osc.connect(filter);
                filter.connect(noteGain);
                noteGain.connect(this.musicGain);

                osc.start(noteStart);
                osc.stop(noteEnd);

                this.activeNodes.push(osc, noteGain, filter);
            });
        };

        // Schedule initial notes
        scheduleNotes(0);

        // Schedule looping
        let loopCount = 0;
        const maxLoops = 100; // Prevent infinite scheduling
        const loopInterval = setInterval(() => {
            if (!this.isPlaying || loopCount >= maxLoops) {
                clearInterval(loopInterval);
                return;
            }
            loopCount++;
            scheduleNotes(loopCount * loopDuration);
        }, loopDuration * 1000);
    }

    // Create bassline sequence
    createBassline(freqs, noteDuration, gain, startTime) {
        const scheduleBass = (offset) => {
            freqs.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const bassGain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                osc.type = 'sawtooth';
                osc.frequency.value = freq;

                filter.type = 'lowpass';
                filter.frequency.value = 400;
                filter.Q.value = 5;

                const noteStart = startTime + offset + (i * noteDuration);
                const noteEnd = noteStart + noteDuration * 0.9; // Slight gap

                bassGain.gain.setValueAtTime(0, noteStart);
                bassGain.gain.linearRampToValueAtTime(gain, noteStart + 0.02);
                bassGain.gain.setValueAtTime(gain, noteEnd - 0.05);
                bassGain.gain.linearRampToValueAtTime(0, noteEnd);

                osc.connect(filter);
                filter.connect(bassGain);
                bassGain.connect(this.musicGain);

                osc.start(noteStart);
                osc.stop(noteEnd);

                this.activeNodes.push(osc, bassGain, filter);
            });
        };

        const loopDuration = freqs.length * noteDuration;
        scheduleBass(0);

        let loopCount = 0;
        const loopInterval = setInterval(() => {
            if (!this.isPlaying || loopCount >= 100) {
                clearInterval(loopInterval);
                return;
            }
            loopCount++;
            scheduleBass(loopCount * loopDuration);
        }, loopDuration * 1000);
    }

    // Create bass pulse (kick drum-like)
    createBassPulse(freq, gain, interval, startTime) {
        const schedulePulse = (time) => {
            const osc = this.audioContext.createOscillator();
            const pulseGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.1);

            pulseGain.gain.setValueAtTime(gain, time);
            pulseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

            osc.connect(pulseGain);
            pulseGain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 0.3);

            this.activeNodes.push(osc, pulseGain);
        };

        schedulePulse(startTime);

        let count = 0;
        const pulseInterval = setInterval(() => {
            if (!this.isPlaying || count >= 100) {
                clearInterval(pulseInterval);
                return;
            }
            count++;
            schedulePulse(this.audioContext.currentTime);
        }, interval * 1000);
    }

    // Create arpeggio pattern
    createArpeggio(freqs, noteDuration, gain, startTime) {
        const scheduleArp = (offset) => {
            freqs.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const arpGain = this.audioContext.createGain();

                osc.type = 'square';
                osc.frequency.value = freq;

                const noteStart = startTime + offset + (i * noteDuration);
                const noteEnd = noteStart + noteDuration * 0.8;

                arpGain.gain.setValueAtTime(0, noteStart);
                arpGain.gain.linearRampToValueAtTime(gain, noteStart + 0.01);
                arpGain.gain.linearRampToValueAtTime(0, noteEnd);

                osc.connect(arpGain);
                arpGain.connect(this.musicGain);

                osc.start(noteStart);
                osc.stop(noteEnd);

                this.activeNodes.push(osc, arpGain);
            });
        };

        const loopDuration = freqs.length * noteDuration;
        scheduleArp(0);

        let loopCount = 0;
        const loopInterval = setInterval(() => {
            if (!this.isPlaying || loopCount >= 100) {
                clearInterval(loopInterval);
                return;
            }
            loopCount++;
            scheduleArp(loopCount * loopDuration);
        }, loopDuration * 1000);
    }

    // Create synthwave lead
    createSynthLead(notes, startTime, loopDuration, gain) {
        const scheduleNotes = (offset) => {
            notes.forEach(note => {
                const osc = this.audioContext.createOscillator();
                const leadGain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                osc.type = 'sawtooth';
                osc.frequency.value = note.freq;

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(note.freq, startTime + offset + note.time);
                filter.frequency.linearRampToValueAtTime(note.freq * 4, startTime + offset + note.time + note.duration);
                filter.Q.value = 8;

                const noteStart = startTime + offset + note.time;
                const noteEnd = noteStart + note.duration;

                leadGain.gain.setValueAtTime(0, noteStart);
                leadGain.gain.linearRampToValueAtTime(gain, noteStart + 0.05);
                leadGain.gain.setValueAtTime(gain, noteEnd - 0.1);
                leadGain.gain.linearRampToValueAtTime(0, noteEnd);

                osc.connect(filter);
                filter.connect(leadGain);
                leadGain.connect(this.musicGain);

                osc.start(noteStart);
                osc.stop(noteEnd);

                this.activeNodes.push(osc, leadGain, filter);
            });
        };

        scheduleNotes(0);

        let loopCount = 0;
        const loopInterval = setInterval(() => {
            if (!this.isPlaying || loopCount >= 100) {
                clearInterval(loopInterval);
                return;
            }
            loopCount++;
            scheduleNotes(loopCount * loopDuration);
        }, loopDuration * 1000);
    }

    // === SPECIAL EFFECTS ===

    // Typewriter rhythm (bureaucratic)
    createTypewriterRhythm(gain, interval, startTime) {
        const scheduleClick = (time) => {
            const noise = this.createNoiseBuffer(0.02);
            const click = this.audioContext.createBufferSource();
            click.buffer = noise;

            const clickGain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            filter.type = 'highpass';
            filter.frequency.value = 2000;

            clickGain.gain.setValueAtTime(gain, time);
            clickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.02);

            click.connect(filter);
            filter.connect(clickGain);
            clickGain.connect(this.musicGain);

            click.start(time);

            this.activeNodes.push(click, clickGain, filter);
        };

        scheduleClick(startTime);

        let count = 0;
        const clickInterval = setInterval(() => {
            if (!this.isPlaying || count >= 100) {
                clearInterval(clickInterval);
                return;
            }
            count++;
            scheduleClick(this.audioContext.currentTime);
        }, interval * 1000);
    }

    // Gavel rhythm
    createGavelRhythm(gain, interval, startTime) {
        const scheduleGavel = (time) => {
            const osc = this.audioContext.createOscillator();
            const gavelGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, time);
            osc.frequency.exponentialRampToValueAtTime(50, time + 0.15);

            gavelGain.gain.setValueAtTime(gain, time);
            gavelGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

            osc.connect(gavelGain);
            gavelGain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 0.15);

            this.activeNodes.push(osc, gavelGain);
        };

        scheduleGavel(startTime);

        let count = 0;
        const gavelInterval = setInterval(() => {
            if (!this.isPlaying || count >= 50) {
                clearInterval(gavelInterval);
                return;
            }
            count++;
            scheduleGavel(this.audioContext.currentTime);
        }, interval * 1000);
    }

    // High tension note
    createHighTensionNote(freq, gain, interval, startTime) {
        const scheduleNote = (time) => {
            const osc = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            noteGain.gain.setValueAtTime(0, time);
            noteGain.gain.linearRampToValueAtTime(gain, time + 0.5);
            noteGain.gain.setValueAtTime(gain, time + 2);
            noteGain.gain.linearRampToValueAtTime(0, time + 3);

            osc.connect(noteGain);
            noteGain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 3);

            this.activeNodes.push(osc, noteGain);
        };

        scheduleNote(startTime);

        let count = 0;
        const noteInterval = setInterval(() => {
            if (!this.isPlaying || count >= 25) {
                clearInterval(noteInterval);
                return;
            }
            count++;
            scheduleNote(this.audioContext.currentTime);
        }, interval * 1000);
    }

    // Metallic rhythm (prison bars)
    createMetallicRhythm(gain, interval, startTime) {
        const scheduleClang = (time) => {
            const osc1 = this.audioContext.createOscillator();
            const osc2 = this.audioContext.createOscillator();
            const clangGain = this.audioContext.createGain();

            osc1.type = 'square';
            osc2.type = 'square';
            osc1.frequency.value = 800;
            osc2.frequency.value = 1200;

            clangGain.gain.setValueAtTime(gain, time);
            clangGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

            osc1.connect(clangGain);
            osc2.connect(clangGain);
            clangGain.connect(this.musicGain);

            osc1.start(time);
            osc2.start(time);
            osc1.stop(time + 0.2);
            osc2.stop(time + 0.2);

            this.activeNodes.push(osc1, osc2, clangGain);
        };

        scheduleClang(startTime);

        let count = 0;
        const clangInterval = setInterval(() => {
            if (!this.isPlaying || count >= 100) {
                clearInterval(clangInterval);
                return;
            }
            count++;
            scheduleClang(this.audioContext.currentTime);
        }, interval * 1000);
    }

    // Clock pulse (time passing)
    createClockPulse(gain, interval, startTime) {
        const scheduleTick = (time) => {
            const osc = this.audioContext.createOscillator();
            const tickGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = 1000;

            tickGain.gain.setValueAtTime(gain, time);
            tickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

            osc.connect(tickGain);
            tickGain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 0.05);

            this.activeNodes.push(osc, tickGain);
        };

        scheduleTick(startTime);

        let count = 0;
        const tickInterval = setInterval(() => {
            if (!this.isPlaying || count >= 1000) {
                clearInterval(tickInterval);
                return;
            }
            count++;
            scheduleTick(this.audioContext.currentTime);
        }, interval * 1000);
    }

    // Siren effect (police chase)
    createSiren(gain, startTime) {
        const scheduleSiren = (time) => {
            const osc = this.audioContext.createOscillator();
            const sirenGain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, time);
            osc.frequency.setValueAtTime(600, time + 0.3);
            osc.frequency.setValueAtTime(800, time + 0.6);

            sirenGain.gain.value = gain;

            osc.connect(sirenGain);
            sirenGain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 0.6);

            this.activeNodes.push(osc, sirenGain);
        };

        scheduleSiren(startTime);

        let count = 0;
        const sirenInterval = setInterval(() => {
            if (!this.isPlaying || count >= 50) {
                clearInterval(sirenInterval);
                return;
            }
            count++;
            scheduleSiren(this.audioContext.currentTime);
        }, 2000); // Every 2 seconds
    }

    // Helper: Create noise buffer
    createNoiseBuffer(duration) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }

        return buffer;
    }

    // Update intensity for dynamic tracks
    updateIntensity(intensity) {
        if (!this.isPlaying) return;

        // Re-start current track with new intensity
        if (this.currentTrack === 'driving' || this.currentTrack === 'prison') {
            this.startTrack(this.currentTrack, intensity);
        }
    }
}
