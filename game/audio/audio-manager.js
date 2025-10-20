// VROOM VROOM - Audio Manager (Master Controller)
// Coordinates Music, SFX, and Ambient audio systems
// Provides unified API for game.js integration

class AudioManager {
    constructor() {
        // Audio systems (initialized on first interaction)
        this.soundSystem = null;
        this.musicSystem = null;
        this.ambientSystem = null;

        // Master volume control
        this.masterVolume = 0.7;
        this.muted = false;

        // Individual volume controls
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.ambientVolume = 0.15;

        // Current state tracking
        this.currentMusicTrack = null;
        this.currentAmbient = null;
        this.musicIntensity = 0.5;

        // Initialization state
        this.initialized = false;

        // Load saved settings from localStorage
        this.loadSettings();
    }

    // Initialize all audio systems (call on first user interaction)
    init() {
        if (this.initialized) return;

        console.log('Initializing Audio Manager...');

        // Create existing SoundSystem instance
        this.soundSystem = new SoundSystem();
        this.soundSystem.init();

        // Create music and ambient systems
        this.musicSystem = new MusicSystem(
            this.soundSystem.audioContext,
            this.soundSystem.masterGain
        );
        this.musicSystem.init();
        this.musicSystem.setVolume(this.musicVolume);

        this.ambientSystem = new AmbientAudioSystem(
            this.soundSystem.audioContext,
            this.soundSystem.masterGain
        );
        this.ambientSystem.init();
        this.ambientSystem.setVolume(this.ambientVolume);

        // Apply saved settings
        this.setMasterVolume(this.masterVolume);
        this.setSFXVolume(this.sfxVolume);
        this.setMusicVolume(this.musicVolume);
        this.setAmbientVolume(this.ambientVolume);

        if (this.muted) {
            this.toggleMute();
        }

        this.initialized = true;
        console.log('Audio Manager initialized successfully');
    }

    // === VOLUME CONTROLS ===

    // Set master volume (0.0 to 1.0)
    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        if (this.soundSystem) {
            this.soundSystem.setVolume(this.masterVolume);
        }
        this.saveSettings();
    }

    // Set music volume (0.0 to 1.0)
    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
        if (this.musicSystem) {
            this.musicSystem.setVolume(this.musicVolume);
        }
        this.saveSettings();
    }

    // Set SFX volume (0.0 to 1.0)
    setSFXVolume(value) {
        this.sfxVolume = Math.max(0, Math.min(1, value));
        // SFX volume is controlled by master gain
        // Individual SFX gain values are set in SoundSystem
        this.saveSettings();
    }

    // Set ambient volume (0.0 to 1.0)
    setAmbientVolume(value) {
        this.ambientVolume = Math.max(0, Math.min(1, value));
        if (this.ambientSystem) {
            this.ambientSystem.setVolume(this.ambientVolume);
        }
        this.saveSettings();
    }

    // Toggle global mute
    toggleMute() {
        if (!this.soundSystem) return false;

        this.muted = this.soundSystem.toggleMute();
        this.saveSettings();
        return this.muted;
    }

    // Get current volume settings
    getVolumes() {
        return {
            master: this.masterVolume,
            music: this.musicVolume,
            sfx: this.sfxVolume,
            ambient: this.ambientVolume,
            muted: this.muted
        };
    }

    // === MUSIC CONTROL ===

    // Play music track for game state
    playMusic(gameState, intensity = 0.5) {
        if (!this.initialized) this.init();
        if (!this.musicSystem) return;

        let trackName;
        switch (gameState) {
            case 'menu':
                trackName = 'menu';
                break;
            case 'characterCreation':
                trackName = 'creation';
                break;
            case 'driving':
                trackName = 'driving';
                intensity = Math.min(1, intensity); // Clamp to 0-1
                break;
            case 'courtroom':
                trackName = 'courtroom';
                break;
            case 'prison':
                trackName = 'prison';
                break;
            default:
                console.warn('Unknown game state for music:', gameState);
                return;
        }

        this.currentMusicTrack = trackName;
        this.musicIntensity = intensity;
        this.musicSystem.play(trackName, intensity);
    }

    // Stop music
    stopMusic() {
        if (!this.musicSystem) return;
        this.musicSystem.stop();
        this.currentMusicTrack = null;
    }

    // Update music intensity (for dynamic tracks like driving/prison)
    updateMusicIntensity(intensity) {
        if (!this.musicSystem) return;
        this.musicIntensity = Math.max(0, Math.min(1, intensity));
        this.musicSystem.updateIntensity(this.musicIntensity);
    }

    // === AMBIENT AUDIO CONTROL ===

    // Play ambient audio for game state
    playAmbient(gameState) {
        if (!this.initialized) this.init();
        if (!this.ambientSystem) return;

        let environmentName;
        switch (gameState) {
            case 'menu':
                environmentName = 'menu';
                break;
            case 'driving':
                environmentName = 'driving';
                break;
            case 'courtroom':
                environmentName = 'courtroom';
                break;
            case 'prison':
                environmentName = 'prison';
                break;
            default:
                console.warn('Unknown game state for ambient:', gameState);
                return;
        }

        this.currentAmbient = environmentName;
        this.ambientSystem.play(environmentName);
    }

    // Stop ambient audio
    stopAmbient() {
        if (!this.ambientSystem) return;
        this.ambientSystem.stop();
        this.currentAmbient = null;
    }

    // === SOUND EFFECTS (Proxied from SoundSystem) ===

    // UI Sounds
    playButtonClick() {
        if (!this.soundSystem) return;
        this.soundSystem.playButtonClick();
    }

    playMenuBeep() {
        if (!this.soundSystem) return;
        this.soundSystem.playMenuBeep();
    }

    playSuccessSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playSuccessSound();
    }

    playFailSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playFailSound();
    }

    playNotification() {
        if (!this.soundSystem) return;
        this.soundSystem.playNotification();
    }

    playErrorSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playErrorSound();
    }

    playTransitionWhoosh() {
        if (!this.soundSystem) return;
        this.soundSystem.playTransitionWhoosh();
    }

    // Courtroom Sounds
    playPaperShuffle() {
        if (!this.soundSystem) return;
        this.soundSystem.playPaperShuffle();
    }

    playStampSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playStampSound();
    }

    playTypingSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playTypingSound();
    }

    playGavelStrike() {
        if (!this.soundSystem) return;
        this.soundSystem.playGavelStrike();
    }

    // Driving Sounds
    playEngineStart() {
        if (!this.soundSystem) return;
        this.soundSystem.playEngineStart();
    }

    playAcceleration() {
        if (!this.soundSystem) return;
        this.soundSystem.playAcceleration();
    }

    playBrake() {
        if (!this.soundSystem) return;
        this.soundSystem.playBrake();
    }

    playHorn() {
        if (!this.soundSystem) return;
        this.soundSystem.playHorn();
    }

    playArrestSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playArrestSound();
    }

    playCopMumbling() {
        if (!this.soundSystem) return;
        this.soundSystem.playCopMumbling();
    }

    // Prison Sounds
    playPrisonDoorClang() {
        if (!this.soundSystem) return;
        this.soundSystem.playPrisonDoorClang();
    }

    playFootsteps(count = 4) {
        if (!this.soundSystem) return;
        this.soundSystem.playFootsteps(count);
    }

    playMoneyCount() {
        if (!this.soundSystem) return;
        this.soundSystem.playMoneyCount();
    }

    playCigaretteLighter() {
        if (!this.soundSystem) return;
        this.soundSystem.playCigaretteLighter();
    }

    playTattooMachine(duration = 2) {
        if (!this.soundSystem) return;
        this.soundSystem.playTattooMachine(duration);
    }

    playEatingSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playEatingSound();
    }

    playWeightLift() {
        if (!this.soundSystem) return;
        this.soundSystem.playWeightLift();
    }

    playPageTurn() {
        if (!this.soundSystem) return;
        this.soundSystem.playPageTurn();
    }

    playLockSound(isLocking = true) {
        if (!this.soundSystem) return;
        this.soundSystem.playLockSound(isLocking);
    }

    playDrinkingSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playDrinkingSound();
    }

    playShowerSound(duration = 3) {
        if (!this.soundSystem) return;
        this.soundSystem.playShowerSound(duration);
    }

    playCoinSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playCoinSound();
    }

    playStatIncrease() {
        if (!this.soundSystem) return;
        this.soundSystem.playStatIncrease();
    }

    playStatDecrease() {
        if (!this.soundSystem) return;
        this.soundSystem.playStatDecrease();
    }

    playTimeAdvance() {
        if (!this.soundSystem) return;
        this.soundSystem.playTimeAdvance();
    }

    playGlitchSound() {
        if (!this.soundSystem) return;
        this.soundSystem.playGlitchSound();
    }

    // Character voice preview
    playVoicePreview(voiceType) {
        if (!this.soundSystem) return;
        this.soundSystem.playVoicePreview(voiceType);
    }

    // === CONVENIENCE METHODS ===

    // Play full audio environment for game state
    playEnvironment(gameState, options = {}) {
        const {
            playMusic = true,
            playAmbient = true,
            musicIntensity = 0.5
        } = options;

        if (playMusic) {
            this.playMusic(gameState, musicIntensity);
        }

        if (playAmbient) {
            this.playAmbient(gameState);
        }
    }

    // Stop all audio
    stopAll() {
        this.stopMusic();
        this.stopAmbient();
    }

    // === SETTINGS PERSISTENCE ===

    // Save settings to localStorage
    saveSettings() {
        const settings = {
            masterVolume: this.masterVolume,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            ambientVolume: this.ambientVolume,
            muted: this.muted
        };

        localStorage.setItem('vroomVroomAudioSettings', JSON.stringify(settings));
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('vroomVroomAudioSettings');
        if (!saved) return;

        try {
            const settings = JSON.parse(saved);
            this.masterVolume = settings.masterVolume ?? 0.7;
            this.musicVolume = settings.musicVolume ?? 0.3;
            this.sfxVolume = settings.sfxVolume ?? 0.5;
            this.ambientVolume = settings.ambientVolume ?? 0.15;
            this.muted = settings.muted ?? false;
        } catch (e) {
            console.error('Failed to load audio settings:', e);
        }
    }

    // Reset all settings to defaults
    resetSettings() {
        this.masterVolume = 0.7;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.ambientVolume = 0.15;
        this.muted = false;

        this.setMasterVolume(this.masterVolume);
        this.setMusicVolume(this.musicVolume);
        this.setSFXVolume(this.sfxVolume);
        this.setAmbientVolume(this.ambientVolume);

        if (this.soundSystem && this.soundSystem.muted) {
            this.toggleMute();
        }

        this.saveSettings();
    }

    // === DEBUG HELPERS ===

    // Get current state for debugging
    getState() {
        return {
            initialized: this.initialized,
            currentMusicTrack: this.currentMusicTrack,
            currentAmbient: this.currentAmbient,
            musicIntensity: this.musicIntensity,
            volumes: this.getVolumes()
        };
    }

    // Test all systems
    testAllSystems() {
        console.log('Testing Audio Manager...');
        console.log('State:', this.getState());

        console.log('Playing test sound...');
        this.playButtonClick();

        setTimeout(() => {
            console.log('Playing test music...');
            this.playMusic('menu');
        }, 500);

        setTimeout(() => {
            console.log('Playing test ambient...');
            this.playAmbient('menu');
        }, 1000);

        setTimeout(() => {
            console.log('Stopping all audio...');
            this.stopAll();
        }, 5000);
    }
}
