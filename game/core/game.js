// VROOM VROOM - Complete Game Engine
// NO EXCUSES. THIS WORKS.

// API Key Manager - Secure sessionStorage-based key management
class ApiKeyManager {
    constructor() {
        this.STORAGE_KEY = 'gemini_api_key';
        this.SKIP_PROMPT_KEY = 'skip_api_prompt';
    }

    // Get API key from sessionStorage
    getApiKey() {
        return sessionStorage.getItem(this.STORAGE_KEY);
    }

    // Save API key to sessionStorage (secure, cleared on browser close)
    saveApiKey(key) {
        if (key && key.trim()) {
            sessionStorage.setItem(this.STORAGE_KEY, key.trim());
            return true;
        }
        return false;
    }

    // Remove API key
    removeApiKey() {
        sessionStorage.removeItem(this.STORAGE_KEY);
    }

    // Check if API key exists
    hasApiKey() {
        return !!this.getApiKey();
    }

    // Check if user wants to skip the prompt
    shouldSkipPrompt() {
        return localStorage.getItem(this.SKIP_PROMPT_KEY) === 'true';
    }

    // Set skip prompt preference
    setSkipPrompt(skip) {
        if (skip) {
            localStorage.setItem(this.SKIP_PROMPT_KEY, 'true');
        } else {
            localStorage.removeItem(this.SKIP_PROMPT_KEY);
        }
    }

    // Test API key with Gemma 3 API
    async testApiKey(apiKey) {
        const key = apiKey || this.getApiKey();
        if (!key) {
            return { success: false, message: 'No API key provided' };
        }

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
                return { success: true, message: 'API key is valid and working!' };
            } else {
                const error = await response.json();
                return {
                    success: false,
                    message: `API key test failed: ${error.error?.message || 'Invalid key'}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Network error: ${error.message}`
            };
        }
    }

    // Generate AI charges using Gemma 3 API (14,000 free requests/day)
    async generateAICharges(drivingData, arrestCount) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
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
                    return charges;
                }
            }
        } catch (error) {
            console.error('AI charge generation failed:', error);
        }

        return null; // Fall back to default charges
    }
}

// Cinematic System - Ken Burns style dramatic transitions
class CinematicSystem {
    constructor() {
        this.overlay = document.getElementById('cinematicOverlay');
        this.scene = document.getElementById('cinematicScene');
        this.art = document.getElementById('cinematicArt');
        this.text = document.getElementById('cinematicText');
        this.subtitle = document.getElementById('cinematicSubtitle');
        this.isPlaying = false;
    }

    // Play a cinematic scene
    play(sceneType, callback) {
        // BUG FIX: If already playing, queue the callback instead of ignoring
        if (this.isPlaying) {
            console.warn('Cinematic already playing, callback will be skipped');
            if (callback) callback();
            return;
        }
        this.isPlaying = true;

        // Show overlay
        this.overlay.classList.add('active');

        // Reset animations
        this.scene.style.animation = 'none';
        setTimeout(() => {
            this.scene.style.animation = 'kenBurnsZoom 8s ease-out forwards';
        }, 10);

        // Load scene content
        const scene = this.getScene(sceneType);
        this.art.innerHTML = scene.art;
        this.text.innerHTML = scene.text;
        this.subtitle.innerHTML = scene.subtitle;

        // Set background gradient
        this.scene.style.background = scene.background;

        // Hide after duration
        setTimeout(() => {
            this.hide();
            if (callback) callback();
        }, scene.duration || 5000);
    }

    hide() {
        this.overlay.classList.remove('active');
        this.isPlaying = false;
    }

    getScene(type) {
        const scenes = {
            arrest: {
                art: `
    ___________
   |  STOP!   |
   |   ___    |
   |  |###|   |
   |  |###|   |
   |  |___|   |
   |__________|

   ⚠️ POLICE ⚠️

    [̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]

   ⛓️ HANDCUFFS ⛓️
   WEAPON DRAWN
                `,
                text: "YOU ARE UNDER ARREST",
                subtitle: "For the crime of driving. For the crime of existing in motion.",
                background: "radial-gradient(ellipse at center, #3A2F2F 0%, #1A1A1A 100%)",
                duration: 5000
            },

            courtroom: {
                art: `
        ⚖️
    ___________
   |  GUILTY   |
   |___________|

      ⚖️ ⚖️ ⚖️

    [̲̅$̲̅(̲̅X̲̅_̲̅X̲̅)̲̅$̲̅]
   JUDGE HARDCASTLE

      *GAVEL*
      *GAVEL*
      *GAVEL*
                `,
                text: "THE COURT FINDS YOU GUILTY",
                subtitle: "The disappointment in his eyes is palpable. Or maybe that's just how his face looks. You can't really tell. The gavel strikes anyway.",
                background: "radial-gradient(ellipse at center, #4A3A3A 0%, #1A1A1A 100%)",
                duration: 5000
            },

            prison: {
                art: `
   ███████████████
   █ FACILITY █ █
   █  #7734   █ █
   ███████████████
   █ |     | █ █ █
   █ |     | █ █ █
   █ |_____| █ █ █
   ███████████████

   THE GATES CLOSE

   FREEDOM: DENIED
                `,
                text: "WELCOME TO CORRECTIONAL FACILITY #7734",
                subtitle: "You've been here before. The walls remember you. So do the guards.",
                background: "radial-gradient(ellipse at center, #3A3A4A 0%, #0A0A0A 100%)",
                duration: 5000
            },

            driving_start: {
                art: `

   ═══════════════
   ════▓▓▓════════
   ═══════════════

   THE OPEN ROAD

        🚗

   ═══════════════
   ════════════▓▓▓
   ═══════════════
                `,
                text: "THE ROAD CALLS TO YOU",
                subtitle: "Freedom. Temporary. Fleeting. Illegal. You drive anyway.",
                background: "radial-gradient(ellipse at center, #4A5A6A 0%, #1A2A3A 100%)",
                duration: 4000
            },

            judgment: {
                art: `

      ⚖️  ⚖️  ⚖️

    ( •́ _•̀ )
   DISAPPOINTED

      [GAVEL]
        💥

   YOUR FATE SEALED
                `,
                text: "*GAVEL STRIKES*",
                subtitle: "The sound echoes. Judge Hardcastle shakes his head. Not angry. Just... tired.",
                background: "radial-gradient(ellipse at center, #5A3A3A 0%, #1A0A0A 100%)",
                duration: 4000
            },

            release: {
                art: `
   ███████████████
   █           █ █
   █   [OPEN]  █ █
   █           █ █
   ███████████████

      YOU ARE FREE

   (temporarily)

        🚶

   ═══════════════
                `,
                text: "YOUR SENTENCE IS COMPLETE",
                subtitle: "The gates open. You step into the light. The car keys are still in your pocket. You know what comes next.",
                background: "radial-gradient(ellipse at center, #4A5A6A 0%, #1A2A3A 100%)",
                duration: 5000
            }
        };

        return scenes[type] || scenes.arrest;
    }
}

// Judge Hardcastle AI System
class JudgeHardcastle {
    constructor() {
        this.name = "Judge Hardcastle";
        this.mood = "irritated"; // irritated, angry, furious, apoplectic
        this.patience = 100;
        this.memory = [];
        this.arrestCount = 0;
        this.currentCharges = [];

        // Gemini API cache (stores last 10 responses)
        this.chargeCache = [];
        this.maxCacheSize = 10;
    }

    // Generate response based on context
    generateResponse(playerContext) {
        const context = {
            arrestCount: this.arrestCount,
            drivingTime: playerContext.drivingTime,
            speed: playerContext.speed,
            previousOffenses: this.memory,
            currentMood: this.mood,
            patience: this.patience,
            charges: this.currentCharges
        };

        return this.generateScriptedResponse(context);
    }

    // Scripted response system
    generateScriptedResponse(context) {
        const responses = {
            firstOffense: [
                `Do you know why you're here? You were DRIVING. In a MOTOR VEHICLE. On a PUBLIC ROAD.`,
                `Says here you were operating a vehicle at ${context.speed} kilometers per hour. That's ${Math.floor(context.speed)} violations of Municipal Code 247.3-B.`,
                `First time, I see. Well, ignorance of our 47,000 traffic regulations is no excuse.`
            ],
            repeatOffender: [
                `You again. ${context.arrestCount} times now. Are you mentally incapable of NOT driving?`,
                `Back already? It's been what, ${this.getTimeSinceLastArrest()} since your last arrest?`,
                `At this point, I'm considering naming a wing of the courthouse after you.`
            ],
            angry: [
                `Enough. You've exhausted my patience, and my ability to cite the full Vehicle Code. We're up to subsection ZZ now.`,
                `I've seen career criminals with more respect for the law than you have for basic traffic regulations.`,
                `Do you think this is a game? Do you think driving is some kind of joke? Because I assure you, it is not.`
            ],
            sentencing: [
                `I hereby sentence you to ${this.calculateSentence(context)} years in correctional facility #7734. May you learn the error of your ways.`,
                `Your flagrant disregard for Penal Code Section 12.34.56 Subsection J leaves me no choice. ${this.calculateSentence(context)} years.`,
                `The court finds you guilty of existing in a vehicular manner. Sentence: ${this.calculateSentence(context)} years, no parole.`
            ],
            paperwork: [
                `You failed to properly complete Form 27-B. That's an additional violation right there.`,
                `I see you initialed Form 13-C but not 13-D. That's contempt of bureaucracy.`,
                `Your handwriting on Form 42-A is barely legible. I'm adding 6 months for poor penmanship.`
            ]
        };

        // Select appropriate response category
        let category = 'firstOffense';
        if (context.arrestCount > 5) {
            category = 'angry';
        } else if (context.arrestCount > 1) {
            category = 'repeatOffender';
        }

        // Get random response from category
        const categoryResponses = responses[category];
        const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

        // Get sentencing
        const sentencingResponses = responses.sentencing;
        const sentencing = sentencingResponses[Math.floor(Math.random() * sentencingResponses.length)];

        return {
            text: response,
            sentencing: sentencing,
            mood: this.mood,
            action: this.determineAction(context)
        };
    }

    // Calculate sentence based on offenses
    calculateSentence(context) {
        let baseYears = 1;

        // Add time for speed
        baseYears += Math.floor(context.speed / 50);

        // Add time for repeat offenses
        baseYears += context.arrestCount * 2;

        // Add time for low patience
        if (this.patience < 20) {
            baseYears *= 2;
        }

        // Add random bureaucratic additions
        const additions = [
            "plus 6 months for that look on your face",
            "plus 1 year for wasting the court's time",
            "plus 3 months for breathing too loudly",
            "doubled for occurring on a Tuesday"
        ];

        const addition = additions[Math.floor(Math.random() * additions.length)];

        return `${baseYears} years, ${addition}`;
    }

    // Update Judge's mood based on player behavior
    updateMood(playerBehavior) {
        this.patience -= 10;

        if (this.patience < 0) this.patience = 0;

        // Update mood based on patience
        if (this.patience > 75) {
            this.mood = "irritated";
        } else if (this.patience > 50) {
            this.mood = "angry";
        } else if (this.patience > 25) {
            this.mood = "furious";
        } else {
            this.mood = "apoplectic";
        }
    }

    // Add to judge's memory of player
    addMemory(event) {
        this.memory.push({
            event: event,
            timestamp: Date.now(),
            mood: this.mood
        });

        // Keep only last 10 memories
        if (this.memory.length > 10) {
            this.memory.shift();
        }
    }

    // Get time since last arrest
    getTimeSinceLastArrest() {
        if (this.memory.length < 2) return "an eternity";

        const lastArrest = this.memory[this.memory.length - 1].timestamp;
        const previousArrest = this.memory[this.memory.length - 2].timestamp;
        const minutes = Math.floor((lastArrest - previousArrest) / 60000);

        if (minutes < 1) return "literally seconds";
        if (minutes < 5) return `${minutes} pathetic minutes`;
        if (minutes < 60) return `${minutes} minutes`;
        return `${Math.floor(minutes / 60)} hours`;
    }

    // Determine what action the judge takes
    determineAction(context) {
        if (context.arrestCount > 10) {
            return { type: 'life_sentence', severity: 'maximum' };
        }

        if (this.mood === 'apoplectic') {
            return { type: 'immediate_sentencing', severity: 'harsh' };
        }

        if (context.speed > 100) {
            return { type: 'additional_charges', charges: ['reckless_driving', 'endangerment'] };
        }

        return { type: 'standard_sentencing', severity: 'normal' };
    }

    // Generate dynamic charges based on driving
    generateCharges(drivingData) {
        const charges = [];

        // Speed-related charges
        if (drivingData.speed > 0) {
            charges.push(`Operating a vehicle at ${Math.floor(drivingData.speed)} km/h`);
        }

        if (drivingData.speed > 50) {
            charges.push("Excessive velocity in a no-velocity zone");
        }

        // Time-related charges
        if (drivingData.time > 60) {
            charges.push("Prolonged vehicular operation");
        }

        // Location-related charges
        charges.push("Existing in a vehicle on a public road");
        charges.push("Possession of car keys with intent to drive");

        // Random bureaucratic charges
        const randomCharges = [
            "Failure to file Form TX-401 before driving",
            "Operating vehicle without submitting daily driving intention report",
            "Unlicensed use of turn signals",
            "Aggressive adherence to traffic laws",
            "Suspicious compliance with speed limits",
            "Unauthorized use of vehicular momentum"
        ];

        // Add 1-3 random charges
        const numRandom = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numRandom; i++) {
            const charge = randomCharges[Math.floor(Math.random() * randomCharges.length)];
            if (!charges.includes(charge)) {
                charges.push(charge);
            }
        }

        this.currentCharges = charges;
        return charges;
    }

    // Calculate new mood after interaction
    calculateNewMood() {
        this.arrestCount++;
        this.patience = Math.max(0, this.patience - 15);

        if (this.patience > 60) return "IRRITATED";
        if (this.patience > 30) return "ANGRY";
        if (this.patience > 10) return "FURIOUS";
        return "APOPLECTIC";
    }
}

class VroomVroomGame {
    constructor() {
        // Game version (semantic versioning)
        this.VERSION = '1.6.1';

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.car = null;
        this.policecar = null;
        this.carPreview = null;
        this.characterPreview = null; // Character preview renderer
        this.gameState = 'menu'; // menu, character, driving, courtroom, prison
        this.player = {
            name: '',
            skinTone: 2,
            height: 175,
            voice: 'deep',

            // Appearance (BG3/Cyberpunk-style)
            faceShape: 'oval',
            hairStyle: 'short',
            hairColor: '#3d2f1f',
            eyeColor: '#4a5a6b',
            facialFeature: 'clean-shaven',
            scar: 'none',
            bodyType: 'average',

            // Background/Origin
            origin: 'taxi-driver',
            archetype: 'cautious',
            selectedCar: {
                model: 'beater',
                color: 0x8B7355  // rust brown default
            },
            wantedLevel: 0,
            speed: 0,
            drivingTime: 0,
            prisonDays: 0,
            sentence: 5,
            tattoos: [],
            gangMember: false,
            letters: [],
            lastPlayed: Date.now(), // Real-world timestamp
            prisonStartTime: null, // When prison sentence started in real time
            eventHistory: [], // Track events that happened while away
            intelligence: 0, // Reading increases intelligence
            booksRead: [], // Array of completed book indices
            bookProgress: [0, 0, 0], // Current page for each book [book0, book1, book2]
            money: 0, // Prison credits
            inventory: {}, // Items owned: {cigarettes: 0, candy: 0, noodles: 0, magazine: 0, radio: 0}
            // Gang system properties
            gangRep: { safedrivers: 0, turnsignals: 0, roadwarriors: 0 }, // Reputation with each gang (-100 to +100)
            currentGang: null, // Which gang the player has joined
            cigarettes: 0, // Currency for gang interactions
            gangEvents: [], // History of gang-related events
            // Escape planning system
            escapeProgress: {
                tunnel: { progress: 0, items: [], completedActions: [] },
                bribe: { progress: 0, items: [], completedActions: [] },
                transfer: { progress: 0, items: [], completedActions: [] },
                riot: { progress: 0, allies: [], completedActions: [] }
            },
            // Guard manicure system
            favorTokens: 0,
            guardManicures: {},
            guardFavors: { ignoreViolation: false },
            goodBehavior: 100,
            // Nail art system
            guardHands: {},
            // Corruption system
            corruption: 0
        };

        // Commissary shop inventory
        this.shopInventory = {
            cigarettes: { stock: 12, price: 5, description: 'Prison currency' },
            candy: { stock: 20, price: 3, description: 'Sugar rush' },
            noodles: { stock: 15, price: 4, description: 'Better than mystery meat' },
            magazine: { stock: 8, price: 6, description: 'Traffic Safety Weekly' },
            radio: { stock: 3, price: 20, description: 'Outside world connection' }
        };

        // Current reading state
        this.currentBook = null;
        this.currentPage = 0;
        this.keys = {};
        this.policeChasing = false;
        this.policeSpawnTime = 0;
        this.buildings = [];
        this.roadMarkers = [];

        // Initialize API Key Manager
        this.apiKeyManager = new ApiKeyManager();

        // Initialize Judge Hardcastle
        this.judge = new JudgeHardcastle();

        // Initialize Cinematic System
        this.cinematics = new CinematicSystem();

        // Initialize Sound System
        this.soundSystem = new SoundSystem();

        // Initialize Gemini Random Events System
        this.geminiEvents = new GeminiRandomEventGenerator(this.apiKeyManager);
        this.ambientTimer = new AmbientEventTimer(this.geminiEvents, this.soundSystem);
        this.guardDialogue = new GuardDialogueSystem(this.geminiEvents);
        this.corruptionTracker = new CorruptionTracker();
        this.timedEvents = new TimedEventSystem(this.geminiEvents);

        // Initialize Ace Attorney Courtroom System
        this.aceCourtroom = null; // Lazy initialization

        // Initialize Tattoo System (lazy initialization)
        this.tattooSystem = null;

        // Initialize Guard Manicure System (lazy initialization)
        this.manicureSystem = null;

        // Initialize Nail Art System
        this.nailArtRenderer = null;
        this.nailArtEffects = null;
        this.nailArtPalette = null;
        this.currentNailArtSession = null;

        // Current escape route being viewed
        this.currentEscapeRoute = null;

        this.init();
    }

    init() {
        // Initialize Nail Art System
        if (typeof this.initNailArtSystem === 'function') {
            this.initNailArtSystem();
        }

        // Display version number
        document.getElementById('gameVersion').textContent = this.VERSION;

        // Setup Three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('gameCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Disco Elysium color palette - muted, desaturated sky
        this.renderer.setClearColor(0x8B9DC3);

        // Setup scene
        this.scene = new THREE.Scene();

        // Atmospheric fog with muted color
        this.scene.fog = new THREE.Fog(0x8B9DC3, 30, 200);

        // Setup ISOMETRIC camera (Disco Elysium style)
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );

        // Position camera at 45-degree angle (isometric view)
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        // Store camera settings for smooth following
        this.cameraOffset = new THREE.Vector3(20, 20, 20);

        // Disco Elysium style lighting - soft, atmospheric
        const ambientLight = new THREE.AmbientLight(0xB8C7D9, 0.7); // Soft blue-gray
        this.scene.add(ambientLight);

        // Main directional light - softer, more diffuse
        const directionalLight = new THREE.DirectionalLight(0xF0E8D0, 0.5); // Warm, muted light
        directionalLight.position.set(50, 100, 50);
        this.scene.add(directionalLight);

        // Secondary fill light for atmosphere
        const fillLight = new THREE.DirectionalLight(0x8B9DC3, 0.3); // Cool blue fill
        fillLight.position.set(-30, 50, -30);
        this.scene.add(fillLight);

        // Create world
        this.createWorld();

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Update height display
        document.getElementById('height').addEventListener('input', (e) => {
            document.getElementById('heightValue').textContent = e.target.value + 'cm';
        });

        // Update character preview when skin tone changes
        document.getElementById('skinTone').addEventListener('input', () => {
            if (this.characterPreview) {
                this.updateCharacterPreview();
            }
        });

        // Show API key prompt on first load (if not skipped)
        if (!this.apiKeyManager.shouldSkipPrompt() && !this.apiKeyManager.hasApiKey()) {
            setTimeout(() => this.showModal('apiKeyModal'), 1000);
        }

        // Update AI status indicator
        this.updateAIStatus();

        // Initialize sound system on first user interaction (Web Audio API requirement)
        document.addEventListener('click', () => {
            if (!this.soundSystem.initialized) {
                this.soundSystem.init();
            }
        }, { once: true });

        // Initialize cheat code listener for testing menu
        this.initCheatCodeListener();

        // Initialize mobile touch controls if on mobile device
        this.initMobileTouchControls();

        // Start render loop
        this.animate();
    }

    createWorld() {
        // Ground - Muted green/brown (Disco Elysium palette)
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x6B7353, // Muted olive green
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Road - Dark desaturated gray
        const roadGeometry = new THREE.PlaneGeometry(10, 1000);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x4A4A4A, // Dark gray
            roughness: 0.95,
            metalness: 0.05
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.y = 0.01;
        this.scene.add(road);

        // Road markers - Desaturated yellow
        for (let i = -500; i < 500; i += 20) {
            const markerGeometry = new THREE.PlaneGeometry(0.5, 5);
            const markerMaterial = new THREE.MeshStandardMaterial({
                color: 0xB8A562, // Desaturated yellow/beige
                roughness: 0.8
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.rotation.x = -Math.PI / 2;
            marker.position.set(0, 0.02, i);
            this.scene.add(marker);
            this.roadMarkers.push(marker);
        }

        // Buildings (Disco Elysium style - muted, desaturated)
        const buildingColors = [
            0x5A5A5A, // Dark gray
            0x6B6B6B, // Medium gray
            0x7A6E5D, // Brown-gray
            0x5D6B7A, // Blue-gray
            0x6B5D5A  // Red-gray
        ];

        for (let i = 0; i < 50; i++) {
            const height = Math.random() * 30 + 10;
            const buildingGeometry = new THREE.BoxGeometry(
                Math.random() * 8 + 5,
                height,
                Math.random() * 8 + 5
            );
            const buildingMaterial = new THREE.MeshStandardMaterial({
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
                roughness: 0.9,
                metalness: 0.1
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

            const side = Math.random() > 0.5 ? 1 : -1;
            building.position.set(
                side * (Math.random() * 30 + 20),
                height / 2,
                Math.random() * 400 - 200
            );

            this.scene.add(building);
            this.buildings.push(building);
        }

        // Player car
        this.createCar();
    }

    createCar() {
        // Use selected car from character creation
        const selectedModel = this.player.selectedCar?.model || 'beater';
        const selectedColor = this.player.selectedCar?.color || 0x8B7355;

        // Create car using CarGeometry system
        this.car = CarGeometry.createCarMesh(selectedModel, selectedColor);
        if (this.car) {
            this.car.position.set(0, 0.2, 0);
            this.scene.add(this.car);
        } else {
            // Fallback to default if something goes wrong
            console.warn('CarGeometry failed, using fallback');
            this.createCarFallback();
        }
    }

    createCarFallback() {
        // Original car creation code as fallback
        const carGroup = new THREE.Group();

        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x9B4A4A,
            roughness: 0.7,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        carGroup.add(body);

        const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B3A3A,
            roughness: 0.7,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.4;
        top.position.z = -0.3;
        carGroup.add(top);

        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const wheelPositions = [
            [-1, 0, 1.2],
            [1, 0, 1.2],
            [-1, 0, -1.2],
            [1, 0, -1.2]
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            carGroup.add(wheel);
        });

        carGroup.rotation.y = Math.PI;
        carGroup.position.set(0, 0.2, 0);
        this.car = carGroup;
        this.scene.add(carGroup);
    }

    createPoliceCar() {
        const policeGroup = new THREE.Group();

        // Police car body - Desaturated blue
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x3A4A8B, // Muted blue
            roughness: 0.7,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        policeGroup.add(body);

        // Police car top - Desaturated white/gray
        const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0xB8B8B8, // Light gray
            roughness: 0.7,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.4;
        top.position.z = -0.3;
        policeGroup.add(top);

        // Lights - Muted but still visible
        const lightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
        const redLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
            color: 0x8B3A3A, // Muted red
            emissive: 0x8B3A3A,
            emissiveIntensity: 1.5,
            roughness: 0.3
        }));
        redLight.position.set(-0.3, 1.9, -0.3);
        policeGroup.add(redLight);

        const blueLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
            color: 0x3A4A8B, // Muted blue
            emissive: 0x3A4A8B,
            emissiveIntensity: 1.5,
            roughness: 0.3
        }));
        blueLight.position.set(0.3, 1.9, -0.3);
        policeGroup.add(blueLight);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const wheelPositions = [
            [-1, 0, 1.2],
            [1, 0, 1.2],
            [-1, 0, -1.2],
            [1, 0, -1.2]
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            policeGroup.add(wheel);
        });

        policeGroup.position.set(0, 0.2, -50);
        this.policecar = policeGroup;
        this.scene.add(policeGroup);
    }

    // Mobile device detection
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || (window.innerWidth <= 768);
    }

    // Initialize mobile touch controls
    initMobileTouchControls() {
        if (!this.isMobile()) {
            return; // Only initialize on mobile devices
        }

        const touchLeft = document.getElementById('touchLeft');
        const touchRight = document.getElementById('touchRight');
        const touchAccelerate = document.getElementById('touchAccelerate');
        const touchStop = document.getElementById('touchStop');

        // Left turn control
        touchLeft.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['a'] = true;
            this.keys['arrowleft'] = true;
        });
        touchLeft.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['a'] = false;
            this.keys['arrowleft'] = false;
        });

        // Right turn control
        touchRight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['d'] = true;
            this.keys['arrowright'] = true;
        });
        touchRight.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['d'] = false;
            this.keys['arrowright'] = false;
        });

        // Accelerate control
        touchAccelerate.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['w'] = true;
            this.keys['arrowup'] = true;
        });
        touchAccelerate.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['w'] = false;
            this.keys['arrowup'] = false;
        });

        // Stop driving button
        touchStop.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'driving') {
                this.pullOver();
            }
        });
    }

    onKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;

        if (e.key === ' ' && this.gameState === 'driving') {
            e.preventDefault();
            this.pullOver();
        }
    }

    onKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    onResize() {
        // Update orthographic camera for isometric view
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20;

        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    showScreen(screenId) {
        // Stop ambient timer if leaving prison menu
        if (this.currentScreen === 'prisonMenu' && screenId !== 'prisonMenu') {
            this.ambientTimer.stop();
        }

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;

        if (screenId === 'credits') {
            // Restart animation
            const scroll = document.querySelector('.credits-scroll');
            scroll.style.animation = 'none';
            setTimeout(() => scroll.style.animation = '', 10);
        }

        // Start ambient timer and update displays if entering prison menu
        if (screenId === 'prisonMenu') {
            this.ambientTimer.start();
            this.corruptionTracker.initialize(this.player);
            this.updateCharacterInfoDisplay();
            this.updatePrisonTimeDisplay();
            this.updateCorruptionDisplay();
        }
    }

    showMessage(text, duration = 3000) {
        const box = document.getElementById('messageBox');
        box.textContent = text;
        box.classList.add('active');
        setTimeout(() => box.classList.remove('active'), duration);
    }

    // Update prison time display
    updatePrisonTimeDisplay() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        const timeDisplay = document.getElementById('prisonTimeDisplay');
        if (timeDisplay) {
            timeDisplay.innerHTML = `
                <div style="color: #0f0; font-size: 1.1em; margin-bottom: 5px;">
                    ${hours}:${minutes} - Cell Block C
                </div>
            `;
        }
    }

    // Update corruption display
    updateCorruptionDisplay() {
        const status = this.corruptionTracker.getCorruptionStatus();
        const level = this.corruptionTracker.corruptionLevel;

        const corruptionDisplay = document.getElementById('corruptionDisplay');
        if (corruptionDisplay) {
            corruptionDisplay.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="color: ${status.color}; font-size: 0.9em;">CORRUPTION</div>
                    <div style="width: 120px; height: 10px; background: #222; border: 1px solid ${status.color};">
                        <div style="width: ${level}%; height: 100%; background: ${status.color};"></div>
                    </div>
                    <div style="color: ${status.color}; font-size: 0.9em;">${level}</div>
                </div>
            `;
        }
    }

    // Update character info display
    updateCharacterInfoDisplay() {
        const display = document.getElementById('characterInfoDisplay');
        if (!display || !this.player) return;

        const skinTones = ['Very Pale', 'Pale', 'Light', 'Medium', 'Tan', 'Dark', 'Very Dark'];
        const voiceTypes = {
            'deep': 'Deep & Resigned',
            'high': 'High & Anxious',
            'monotone': 'Monotone Bureaucrat',
            'enthusiastic': 'Disturbingly Enthusiastic'
        };

        const carModels = {
            'beater': 'The Beater',
            'box': 'The Box',
            'clunker': 'The Clunker',
            'rustbucket': 'The Rust Bucket'
        };

        const carColors = {
            0x8B7355: 'Rust Brown',
            0x5A6B4A: 'Military Green',
            0x6B6B6B: 'Dull Grey',
            0x4A5A6B: 'Faded Blue',
            0x7A7A7A: 'Primer Grey',
            0x8B4A4A: 'Oxidized Red',
            0x8B8B4A: 'Muddy Yellow',
            0x4A6B4A: 'Sick Green',
            0x2A2A2A: 'Asphalt Black',
            0x9B9B9B: 'Dingy White'
        };

        display.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; font-size: 0.9em;">
                <div>
                    <strong style="color: #0f0;">Inmate:</strong> ${this.player.name || 'Unknown'}<br>
                    <strong style="color: #0f0;">Height:</strong> ${this.player.height || 175}cm<br>
                    <strong style="color: #0f0;">Skin Tone:</strong> ${skinTones[this.player.skinTone || 2]}
                </div>
                <div>
                    <strong style="color: #0f0;">Voice:</strong> ${voiceTypes[this.player.voice] || 'Unknown'}<br>
                    <strong style="color: #0f0;">Vehicle:</strong> ${carModels[this.player.selectedCar?.model] || 'Unknown'}<br>
                    <strong style="color: #0f0;">Color:</strong> ${carColors[this.player.selectedCar?.color] || 'Unknown'}
                </div>
            </div>
        `;
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');

            // If settings modal, update status
            if (modalId === 'settingsModal') {
                this.updateSettingsStatus();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // API Key Management - First Load Modal
    async useApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const dontAskAgain = document.getElementById('dontAskAgain').checked;

        if (!apiKey) {
            this.showMessage('Please enter an API key or click Skip', 3000);
            return;
        }

        this.showMessage('Testing API key...', 2000);

        // Test the API key first
        const testResult = await this.apiKeyManager.testApiKey(apiKey);

        if (testResult.success) {
            this.apiKeyManager.saveApiKey(apiKey);
            this.showMessage('✓ API key validated! AI features enabled.', 4000);
            this.updateAIStatus();
            this.closeModal('apiKeyModal');

            // Generate initial event pool in background
            if (this.geminiEvents) {
                setTimeout(() => {
                    this.geminiEvents.generateEventPool();
                }, 2000);
            }

            // Set skip preference
            if (dontAskAgain) {
                this.apiKeyManager.setSkipPrompt(true);
            }
        } else {
            this.showMessage(`✗ ${testResult.message}`, 5000);
        }
    }

    skipApiKey() {
        const dontAskAgain = document.getElementById('dontAskAgain').checked;

        // Set skip preference
        if (dontAskAgain) {
            this.apiKeyManager.setSkipPrompt(true);
        }

        this.showMessage('Using default charges', 2000);
        this.closeModal('apiKeyModal');
        this.updateAIStatus();
    }

    // API Key Management - Settings Modal
    async saveApiKeyFromSettings() {
        const apiKey = document.getElementById('settingsApiKeyInput').value.trim();

        if (!apiKey) {
            this.showMessage('Please enter an API key', 3000);
            return;
        }

        this.showMessage('Testing API key...', 2000);

        // Test the API key before saving
        const testResult = await this.apiKeyManager.testApiKey(apiKey);

        if (testResult.success) {
            this.apiKeyManager.saveApiKey(apiKey);
            this.showMessage('✓ API key validated and saved!', 4000);
            this.updateAIStatus();
            this.updateSettingsStatus();

            // Clear input field
            document.getElementById('settingsApiKeyInput').value = '';

            // Generate initial event pool in background
            if (this.geminiEvents) {
                setTimeout(() => {
                    this.geminiEvents.generateEventPool();
                }, 2000);
            }
        } else {
            this.showMessage(`✗ ${testResult.message}`, 5000);
        }
    }

    async testApiKey() {
        const apiKey = document.getElementById('settingsApiKeyInput').value.trim();
        const keyToTest = apiKey || this.apiKeyManager.getApiKey();

        if (!keyToTest) {
            this.showMessage('Please enter an API key to test', 3000);
            return;
        }

        const testResult = document.getElementById('testResult');
        testResult.style.display = 'block';
        testResult.className = 'test-result';
        testResult.textContent = 'Testing API key...';

        const result = await this.apiKeyManager.testApiKey(keyToTest);

        if (result.success) {
            testResult.className = 'test-result success';
            testResult.textContent = result.message;
        } else {
            testResult.className = 'test-result error';
            testResult.textContent = result.message;
        }

        // Hide after 5 seconds
        setTimeout(() => {
            testResult.style.display = 'none';
        }, 5000);
    }

    removeApiKey() {
        this.apiKeyManager.removeApiKey();
        this.showMessage('API key removed. Using default charges.', 3000);
        this.updateAIStatus();
        this.updateSettingsStatus();

        // Clear input field
        document.getElementById('settingsApiKeyInput').value = '';
    }

    // Update AI status indicator
    updateAIStatus() {
        const indicator = document.getElementById('aiIndicator');
        const statusText = document.getElementById('aiStatusText');

        if (this.apiKeyManager.hasApiKey()) {
            indicator.classList.add('active', 'using-ai');
            indicator.classList.remove('using-default');
            statusText.textContent = 'AI-Generated Charges Active';
        } else {
            indicator.classList.add('active', 'using-default');
            indicator.classList.remove('using-ai');
            statusText.textContent = 'Using Default Charges';
        }
    }

    // Update settings modal status display
    updateSettingsStatus() {
        const currentStatus = document.getElementById('currentStatus');

        if (this.apiKeyManager.hasApiKey()) {
            currentStatus.textContent = 'Using AI-Generated Charges';
            currentStatus.style.color = '#0ff';
        } else {
            currentStatus.textContent = 'Using Default Charges';
            currentStatus.style.color = '#ff0';
        }

        // Update volume controls to match current sound system state
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeDisplay = document.getElementById('volumeDisplay');
        const muteButton = document.getElementById('muteButton');

        if (volumeSlider && volumeDisplay && muteButton) {
            const volumePercent = Math.round(this.soundSystem.volume * 100);
            volumeSlider.value = volumePercent;
            volumeDisplay.textContent = volumePercent;
            muteButton.textContent = this.soundSystem.muted ? 'Unmute' : 'Mute';
        }
    }

    // Update volume from slider
    updateVolume(value) {
        const volume = parseFloat(value) / 100;
        this.soundSystem.setVolume(volume);
        document.getElementById('volumeDisplay').textContent = value;
    }

    // Toggle mute
    toggleMute() {
        const muted = this.soundSystem.toggleMute();
        const muteButton = document.getElementById('muteButton');
        muteButton.textContent = muted ? 'Unmute' : 'Mute';
        this.showMessage(muted ? 'Sound muted' : 'Sound unmuted', 2000);
    }

    startNewGame() {
        this.showScreen('characterCreation');
        this.initializeCarPreview();
        this.initializeCharacterPreview();
    }

    loadGame() {
        const saved = localStorage.getItem('vroomVroomSave');
        if (saved) {
            this.player = JSON.parse(saved);

            // Calculate time difference since last played
            const now = Date.now();
            const lastPlayed = this.player.lastPlayed || now;
            const timeDiffMs = now - lastPlayed;
            const timeDiffHours = timeDiffMs / (1000 * 60 * 60); // Real-world hours

            // Check if player was in prison
            if (this.player.prisonStartTime && this.player.prisonDays < this.player.sentence * 7) {
                // Calculate prison time served in real-world hours
                // 1 prison year = 7 days real time (168 hours)
                const prisonTimeDiffMs = now - this.player.prisonStartTime;
                const realDaysServed = prisonTimeDiffMs / (1000 * 60 * 60 * 24); // Real days
                const prisonDaysServed = Math.floor(realDaysServed);

                if (prisonDaysServed > 0) {
                    // Generate events that happened in prison while away
                    const digest = this.generatePrisonTimeDigest(prisonDaysServed);
                    this.player.prisonDays += prisonDaysServed;

                    // Check if sentence is complete
                    if (this.player.prisonDays >= this.player.sentence * 7) {
                        this.player.prisonDays = this.player.sentence * 7;
                        this.showTimeDigestScreen(digest, true); // true = released
                        return;
                    } else {
                        this.showTimeDigestScreen(digest, false);
                        return;
                    }
                }
            } else if (timeDiffHours >= 1) {
                // Player was not in prison, generate "life outside" digest
                const digest = this.generateFreeTimeDigest(timeDiffHours);
                this.showTimeDigestScreen(digest, false, true); // true = was free
                return;
            }

            this.showMessage('Game loaded! Welcome back, ' + this.player.name);

            // Start in appropriate state
            if (this.gameState === 'prison' || (this.player.prisonDays > 0 && this.player.prisonDays < this.player.sentence * 7)) {
                this.startPrison();
            } else {
                this.startDriving();
            }
        } else {
            this.showMessage('No saved game found. Starting new game...');
            this.startNewGame();
        }
    }

    saveGame() {
        // Update lastPlayed timestamp
        this.player.lastPlayed = Date.now();
        localStorage.setItem('vroomVroomSave', JSON.stringify(this.player));
        this.showMessage('Game saved!');
    }

    // Generate save code (Base64 encoded JSON of player state)
    generateSaveCode() {
        try {
            // Create a compact save object with only essential data
            const saveData = {
                v: this.VERSION, // Version
                p: this.player // Player data
            };

            // Convert to JSON and encode in Base64
            const jsonString = JSON.stringify(saveData);
            const encoded = btoa(encodeURIComponent(jsonString));

            return encoded;
        } catch (error) {
            console.error('Failed to generate save code:', error);
            this.showMessage('Error generating save code!', 3000);
            return null;
        }
    }

    // Import game from save code
    importSaveCode(code) {
        try {
            // Decode from Base64 and parse JSON
            const jsonString = decodeURIComponent(atob(code));
            const saveData = JSON.parse(jsonString);

            // Verify save data structure
            if (!saveData.p || !saveData.v) {
                throw new Error('Invalid save code format');
            }

            // Load player data
            this.player = saveData.p;

            // Save to localStorage for persistence
            localStorage.setItem('vroomVroomSave', JSON.stringify(this.player));

            this.showMessage(`Game loaded from code! (v${saveData.v})`, 3000);

            // Start in appropriate state
            if (this.player.prisonDays > 0 && this.player.prisonDays < this.player.sentence * 7) {
                this.startPrison();
            } else {
                this.startDriving();
            }

            return true;
        } catch (error) {
            console.error('Failed to import save code:', error);
            this.showMessage('Invalid save code! Please check and try again.', 4000);
            return false;
        }
    }

    // Export save code to clipboard
    async exportSaveCode() {
        const code = this.generateSaveCode();
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            this.showMessage('Save code copied to clipboard!', 3000);

            // Also show in modal
            this.showSaveCodeModal(code);
        } catch (error) {
            console.error('Clipboard failed, showing modal instead:', error);
            this.showSaveCodeModal(code);
        }
    }

    // Show save code in modal
    showSaveCodeModal(code) {
        const modal = document.getElementById('saveCodeModal');
        const codeDisplay = document.getElementById('saveCodeDisplay');

        if (modal && codeDisplay) {
            codeDisplay.value = code;
            modal.classList.add('active');
        }
    }

    // Show import modal
    showImportModal() {
        const modal = document.getElementById('importCodeModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('importCodeInput').value = '';
        }
    }

    // Import from modal input
    importFromModal() {
        const input = document.getElementById('importCodeInput');
        const code = input.value.trim();

        if (!code) {
            this.showMessage('Please enter a save code!', 2000);
            return;
        }

        const success = this.importSaveCode(code);
        if (success) {
            this.closeModal('importCodeModal');
        }
    }

    finishCharacterCreation() {
        const name = document.getElementById('charName').value.trim();
        if (!name) {
            this.showMessage('Please enter a name!');
            return;
        }

        this.player.name = name;
        this.player.skinTone = parseInt(document.getElementById('skinTone').value);
        this.player.height = parseInt(document.getElementById('height').value);
        this.player.voice = document.getElementById('voice').value;

        // Save appearance customization
        this.player.faceShape = document.getElementById('faceShape').value;
        this.player.hairStyle = document.getElementById('hairStyle').value;
        this.player.hairColor = document.getElementById('hairColor').value;
        this.player.eyeColor = document.getElementById('eyeColor').value;
        this.player.facialFeature = document.getElementById('facialFeature').value;
        this.player.scar = document.getElementById('scar').value;
        this.player.bodyType = document.getElementById('bodyType').value;

        // Save background and archetype
        this.player.origin = document.getElementById('origin').value;
        this.player.archetype = document.getElementById('archetype').value;

        // Apply origin bonuses
        this.applyOriginBonuses();

        // Clean up preview renderers
        if (this.carPreview) {
            this.carPreview.destroy();
            this.carPreview = null;
        }
        if (this.characterPreview) {
            this.characterPreview.destroy();
            this.characterPreview = null;
        }

        this.showMessage('Welcome, ' + name + '. Get ready to drive.', 2000);

        // Show dramatic driving start cinematic
        setTimeout(() => {
            this.cinematics.play('driving_start', () => {
                this.startDriving();
            });
        }, 2000);
    }

    // Apply stat bonuses from origin selection
    applyOriginBonuses() {
        const origins = CharacterOrigins.getOrigins();
        const origin = origins[this.player.origin];

        if (origin && origin.stats) {
            if (origin.stats.intelligence) this.player.intelligence += origin.stats.intelligence;
            if (origin.stats.strength) this.player.strength += origin.stats.strength;
            if (origin.stats.money) this.player.money += origin.stats.money;
            if (origin.stats.goodBehavior) this.player.goodBehavior += origin.stats.goodBehavior;
            if (origin.stats.patience) {
                // Patience affects starting Judge mood (if we add that later)
            }
        }
    }

    // Update character preview when appearance changes
    updateCharacterPreview() {
        if (!this.characterPreview) {
            this.characterPreview = new CharacterPreviewRenderer('characterPreviewCanvas');
        }

        // Get current values from form
        const characterData = {
            faceShape: document.getElementById('faceShape').value,
            skinTone: parseInt(document.getElementById('skinTone').value),
            hairStyle: document.getElementById('hairStyle').value,
            hairColor: document.getElementById('hairColor').value,
            eyeColor: document.getElementById('eyeColor').value,
            facialFeature: document.getElementById('facialFeature').value,
            scar: document.getElementById('scar').value,
            bodyType: document.getElementById('bodyType').value
        };

        this.characterPreview.updateCharacter(characterData);
    }

    // Update origin description display
    updateOriginDisplay() {
        const origins = CharacterOrigins.getOrigins();
        const selectedOrigin = document.getElementById('origin').value;
        const origin = origins[selectedOrigin];

        const descDiv = document.getElementById('originDescription');
        if (origin && descDiv) {
            let bonusText = '';
            if (origin.stats) {
                const bonuses = [];
                Object.keys(origin.stats).forEach(stat => {
                    const value = origin.stats[stat];
                    const sign = value > 0 ? '+' : '';
                    bonuses.push(`${sign}${value} ${stat}`);
                });
                bonusText = '<strong>Stats:</strong> ' + bonuses.join(', ') + '<br>';
            }

            descDiv.innerHTML = `
                <div style="color: #0f0; font-weight: bold; margin-bottom: 8px;">${origin.name}</div>
                <div style="color: #ccc; margin-bottom: 10px;">${origin.desc}</div>
                ${bonusText}
                <div style="color: #ff0; font-size: 0.85em; margin-top: 10px;"><strong>Perk:</strong> ${origin.perk}</div>
            `;
        }
    }

    // Update archetype description display
    updateArchetypeDisplay() {
        const archetypes = CharacterArchetypes.getArchetypes();
        const selectedArchetype = document.getElementById('archetype').value;
        const archetype = archetypes[selectedArchetype];

        const descDiv = document.getElementById('archetypeDescription');
        if (archetype && descDiv) {
            descDiv.innerHTML = `
                <div style="color: #0f0; font-weight: bold; margin-bottom: 8px;">${archetype.name}</div>
                <div style="color: #ccc; margin-bottom: 10px;">${archetype.desc}</div>
                <div style="color: #ff0; font-size: 0.85em;"><strong>Effect:</strong> ${archetype.effect}</div>
            `;
        }
    }

    // Preview selected voice personality
    previewVoice() {
        // Initialize sound system if needed
        if (!this.soundSystem.initialized) {
            this.soundSystem.init();
        }

        // Get selected voice type
        const voiceSelect = document.getElementById('voice');
        const voiceType = voiceSelect.value;

        // Update button text to show playing state
        const previewBtn = document.getElementById('previewVoiceBtn');
        const originalText = previewBtn.textContent;
        previewBtn.textContent = 'PLAYING...';
        previewBtn.disabled = true;

        // Play voice preview
        this.soundSystem.playVoicePreview(voiceType);

        // Reset button after duration (longest voice is 1.5s, add buffer)
        setTimeout(() => {
            previewBtn.textContent = originalText;
            previewBtn.disabled = false;
        }, 2000);
    }

    // CAR SELECTION METHODS
    selectCarModel(modelName) {
        // Update player selection
        this.player.selectedCar.model = modelName;

        // Update UI - highlight selected button
        document.querySelectorAll('.car-model-btn').forEach(btn => {
            if (btn.dataset.model === modelName) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Update preview
        this.updateCarPreview();

        // Update description
        const models = CarGeometry.getCarModels();
        const model = models[modelName];
        const colors = ColorPalette.getColors();
        const colorKey = Object.keys(colors).find(k => colors[k].hex === this.player.selectedCar.color) || 'rustbrown';
        const colorInfo = colors[colorKey];

        document.getElementById('carDescription').innerHTML =
            `<strong>${model.name}</strong> - ${colorInfo.name}<br>${colorInfo.desc}`;
    }

    selectCarColor(colorKey) {
        // Update player selection
        this.player.selectedCar.color = ColorPalette.getColorHex(colorKey);

        // Update UI - highlight selected swatch
        document.querySelectorAll('.color-swatch').forEach(btn => {
            if (btn.dataset.color === colorKey) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Update preview
        this.updateCarPreview();

        // Update description
        const colors = ColorPalette.getColors();
        const colorInfo = colors[colorKey];
        const models = CarGeometry.getCarModels();
        const model = models[this.player.selectedCar.model];

        document.getElementById('carDescription').innerHTML =
            `<strong>${model.name}</strong> - ${colorInfo.name}<br>${colorInfo.desc}`;
    }

    updateCarPreview() {
        // Initialize preview renderer if not exists
        if (!this.carPreview) {
            this.carPreview = new CarPreviewRenderer('carPreviewCanvas');
        }

        // Update with selected car and color
        this.carPreview.updateCar(
            this.player.selectedCar.model,
            this.player.selectedCar.color
        );
    }

    initializeCarPreview() {
        // Called when character creation screen is shown
        // Set defaults and initialize preview
        this.player.selectedCar = {
            model: 'beater',
            color: 0x8B7355 // rust brown
        };

        // Highlight default selections in UI
        setTimeout(() => {
            document.querySelector('.car-model-btn[data-model="beater"]')?.classList.add('selected');
            document.querySelector('.color-swatch[data-color="rustbrown"]')?.classList.add('selected');
            this.updateCarPreview();

            const models = CarGeometry.getCarModels();
            const colors = ColorPalette.getColors();
            document.getElementById('carDescription').innerHTML =
                `<strong>${models.beater.name}</strong> - ${colors.rustbrown.name}<br>${colors.rustbrown.desc}`;
        }, 100);
    }

    initializeCharacterPreview() {
        // Initialize character preview renderer
        setTimeout(() => {
            this.updateCharacterPreview();
            this.updateOriginDisplay();
            this.updateArchetypeDisplay();
        }, 100);
    }

    startDriving(showCinematic = false) {
        const actuallyStartDriving = () => {
            this.gameState = 'driving';
            // Hide all screens to show the 3D world
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('drivingHUD').style.display = 'block';

            this.player.speed = 0;
            this.player.drivingTime = 0;
            this.player.wantedLevel = 0;
            this.policeChasing = false;
            this.policeSpawnTime = Math.random() * 10 + 5; // 5-15 seconds before police

            if (this.policecar) {
                this.scene.remove(this.policecar);
                this.policecar = null;
            }

            // Reset courtroom forms for next arrest
            document.getElementById('reasonForDriving').value = '';
            document.getElementById('vehicleDesc').value = '';
            document.getElementById('intentStatement').value = '';
            document.getElementById('initial1').value = '';
            document.getElementById('initial2').value = '';
            document.getElementById('initial3').value = '';
            document.getElementById('judgeDialogue').style.display = 'none';

            // Re-enable all form inputs
            document.querySelectorAll('#courtroom input, #courtroom textarea, #courtroom select').forEach(el => {
                el.disabled = false;
            });

            // Show mobile controls if on mobile device
            if (this.isMobile()) {
                document.getElementById('mobileControls').classList.add('active');
                document.getElementById('touchStop').style.display = 'block';
            }

            this.showMessage('You are now driving. The police are watching. They are always watching.', 4000);
        };

        if (showCinematic) {
            this.cinematics.play('driving_start', actuallyStartDriving);
        } else {
            actuallyStartDriving();
        }
    }

    updateDriving(delta) {
        if (!this.car) return;

        // Player controls
        const acceleration = 0.5;
        const deceleration = 0.3;
        const maxSpeed = 50;
        const turnSpeed = 0.02;

        if (this.keys['w'] || this.keys['arrowup']) {
            this.player.speed = Math.min(this.player.speed + acceleration, maxSpeed);
        } else {
            this.player.speed = Math.max(this.player.speed - deceleration, 0);
        }

        if (this.keys['a'] || this.keys['arrowleft']) {
            this.car.rotation.y -= turnSpeed * (this.player.speed / maxSpeed);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.car.rotation.y += turnSpeed * (this.player.speed / maxSpeed);
        }

        // Move car forward
        const moveX = Math.sin(this.car.rotation.y) * this.player.speed * delta;
        const moveZ = Math.cos(this.car.rotation.y) * this.player.speed * delta;
        this.car.position.x += moveX;
        this.car.position.z -= moveZ;

        // Isometric camera follow (smooth lerp)
        const targetPosition = new THREE.Vector3(
            this.car.position.x + this.cameraOffset.x,
            this.cameraOffset.y,
            this.car.position.z + this.cameraOffset.z
        );

        // Smooth camera movement
        this.camera.position.lerp(targetPosition, 0.1);

        // Isometric camera always looks at car position
        const lookTarget = new THREE.Vector3(this.car.position.x, 0, this.car.position.z);
        this.camera.lookAt(lookTarget);

        // Update driving time
        this.player.drivingTime += delta;

        // Spawn police after time
        if (!this.policeChasing && this.player.drivingTime > this.policeSpawnTime) {
            this.spawnPolice();
        }

        // Police chase
        if (this.policeChasing && this.policecar) {
            // Police AI: Follow player
            const dx = this.car.position.x - this.policecar.position.x;
            const dz = this.car.position.z - this.policecar.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            const policeSpeed = this.player.speed + 5; // Police always faster
            const angle = Math.atan2(dx, -dz);
            this.policecar.rotation.y = angle;

            this.policecar.position.x += Math.sin(angle) * policeSpeed * delta;
            this.policecar.position.z -= Math.cos(angle) * policeSpeed * delta;

            // Caught by police
            if (distance < 5) {
                this.pullOver();
            }

            // Increase wanted level
            this.player.wantedLevel = Math.min(5, Math.floor(this.player.drivingTime / 10));
        }

        // Update HUD
        document.getElementById('speed').textContent = Math.floor(this.player.speed);
        document.getElementById('wantedLevel').textContent = this.player.wantedLevel;
        document.getElementById('drivingTime').textContent = Math.floor(this.player.drivingTime);
    }

    spawnPolice() {
        this.policeChasing = true;
        this.createPoliceCar();
        this.showMessage('POLICE DETECTED. You were driving. This is illegal.', 4000);
    }

    pullOver() {
        this.gameState = 'courtroom';
        document.getElementById('drivingHUD').style.display = 'none';

        // Hide mobile controls
        if (this.isMobile()) {
            document.getElementById('mobileControls').classList.remove('active');
            document.getElementById('touchStop').style.display = 'none';
        }

        // Play arrest sound (siren + handcuff click)
        this.soundSystem.playArrestSound();

        // Show dramatic arrest cinematic
        this.cinematics.play('arrest', () => {
            this.showScreen('courtroom');
            this.setupCourtroom();
        });
    }

    async setupCourtroom() {
        // Initialize Ace Attorney Courtroom (lazy)
        if (!this.aceCourtroom) {
            this.aceCourtroom = new AceAttorneyCourtroom('judgeCanvas', 'aceDialogueContainer');
        }

        // Play cop mumbling sound (Sims-style gibberish)
        this.soundSystem.playCopMumbling();

        // Try to generate AI charges first, fall back to default if API key not available
        let charges;

        if (this.apiKeyManager.hasApiKey()) {
            this.showMessage('Judge Hardcastle is consulting the AI legal database...', 2000);

            charges = await this.apiKeyManager.generateAICharges({
                speed: this.player.speed,
                time: this.player.drivingTime
            }, this.judge.arrestCount + 1);
        }

        // Fall back to default charges if AI generation failed or no API key
        if (!charges) {
            charges = this.judge.generateCharges({
                speed: this.player.speed,
                time: this.player.drivingTime
            });
        }

        // Update judge mood
        this.judge.addMemory(`Arrested for driving at ${Math.floor(this.player.speed)} km/h for ${Math.floor(this.player.drivingTime)} seconds`);
        const newMood = this.judge.calculateNewMood();

        // Display charges
        const chargesList = document.getElementById('chargesList');
        chargesList.innerHTML = '';
        charges.forEach(charge => {
            const li = document.createElement('li');
            li.textContent = charge;
            li.style.color = '#f00';
            li.style.margin = '5px 0';
            chargesList.appendChild(li);
        });

        // Get initial judge response
        const response = this.judge.generateResponse({
            drivingTime: this.player.drivingTime,
            speed: this.player.speed
        });

        // Display judge dialogue
        document.getElementById('judgeStatement').innerHTML = `
            <p style="color: #f00; font-weight: bold; margin-bottom: 10px;">"${response.text}"</p>
            <p style="color: #0f0; margin-top: 10px;">Now complete these forms. And don't waste my time.</p>
        `;

        // Update mood display
        document.getElementById('moodLevel').textContent = newMood;
        document.getElementById('patienceLevel').textContent = this.judge.patience;

        // Show Ace Attorney courtroom (stays visible during entire courtroom session)
        this.aceCourtroom.start(this.judge.patience);
        this.aceCourtroom.showDialogue('JUDGE HARDCASTLE', response.text, () => {
            // Don't stop the ace courtroom - keep judge visible!
            // Just hide the dialogue box and show the form interface
            this.aceCourtroom.hideDialogue();
            document.getElementById('judgeDialogue').style.display = 'block';
        });

        // Add listeners for form interactions to trigger judge commentary
        this.addJudgeCommentaryListeners();

        this.saveGame();
    }

    // Add snarky judge commentary as player fills forms
    addJudgeCommentaryListeners() {
        // Remove any existing listeners to prevent memory leak
        const reason = document.getElementById('reasonForDriving');
        const vehicle = document.getElementById('vehicleDesc');
        const intent = document.getElementById('intentStatement');

        // Clone nodes to remove all event listeners
        const reasonNew = reason.cloneNode(true);
        const vehicleNew = vehicle.cloneNode(true);
        const intentNew = intent.cloneNode(true);

        reason.parentNode.replaceChild(reasonNew, reason);
        vehicle.parentNode.replaceChild(vehicleNew, vehicle);
        intent.parentNode.replaceChild(intentNew, intent);

        // Add fresh listeners with { once: true }
        document.getElementById('reasonForDriving').addEventListener('blur', () => {
            if (document.getElementById('reasonForDriving').value.trim()) {
                const comments = [
                    "\"That's the worst excuse I've heard all day. And I've heard many.\"",
                    "\"Oh, THAT'S your reason? Fascinating. Also, irrelevant.\"",
                    "\"I'm sure that made sense in your head. It doesn't make sense here.\"",
                    "\"Did you seriously just write that? On an official court document?\""
                ];
                this.showJudgeComment(comments[Math.floor(Math.random() * comments.length)]);
                this.judge.updateMood('filing_forms');
                document.getElementById('patienceLevel').textContent = this.judge.patience;
                document.getElementById('moodLevel').textContent = this.judge.mood.toUpperCase();
            }
        }, { once: true });

        // Commentary after describing vehicle
        document.getElementById('vehicleDesc').addEventListener('blur', () => {
            if (document.getElementById('vehicleDesc').value.trim()) {
                const comments = [
                    "\"A car is a car. Your description changes nothing.\"",
                    "\"Four wheels. An engine. Illegal. Moving on.\"",
                    "\"I don't care if it was purple with racing stripes. You were DRIVING.\"",
                    "\"You described it in great detail. Still illegal.\""
                ];
                this.showJudgeComment(comments[Math.floor(Math.random() * comments.length)]);
                this.judge.updateMood('filing_forms');
                document.getElementById('patienceLevel').textContent = this.judge.patience;
                document.getElementById('moodLevel').textContent = this.judge.mood.toUpperCase();
            }
        }, { once: true });

        // Commentary after selecting intent
        document.getElementById('intentStatement').addEventListener('change', () => {
            const intentVal = document.getElementById('intentStatement').value;
            if (intentVal) {
                const comments = {
                    grocery: "\"Groceries. You risked EVERYTHING for groceries. Brilliant.\"",
                    work: "\"There's no job worth the penalty of operating a vehicle. None.\"",
                    joy: "\"JOY? You experienced JOY while DRIVING? That's an additional charge.\"",
                    exist: "\"Simply existing... in a MOVING VEHICLE. On MY roads.\""
                };
                this.showJudgeComment(comments[intentVal] || "\"Whatever your intent was, it was illegal.\"");
                this.judge.updateMood('filing_forms');
                document.getElementById('patienceLevel').textContent = this.judge.patience;
                document.getElementById('moodLevel').textContent = this.judge.mood.toUpperCase();
            }
        }, { once: true });
    }

    // Display judge comment temporarily
    showJudgeComment(comment) {
        const judgeStatement = document.getElementById('judgeStatement');
        const currentHtml = judgeStatement.innerHTML;

        // Add new comment
        judgeStatement.innerHTML = `
            <p style="color: #f00; font-weight: bold; animation: fadeIn 0.3s;">${comment}</p>
            <p style="color: #666; font-size: 0.9em; margin-top: 10px; font-style: normal;">Previous: ${currentHtml.replace(/<[^>]*>/g, ' ').substring(0, 100)}...</p>
        `;
    }

    submitCourtForms() {
        // Check if forms are filled
        const reason = document.getElementById('reasonForDriving').value.trim();
        const vehicle = document.getElementById('vehicleDesc').value.trim();
        const intent = document.getElementById('intentStatement').value;
        const i1 = document.getElementById('initial1').value.trim();
        const i2 = document.getElementById('initial2').value.trim();
        const i3 = document.getElementById('initial3').value.trim();

        if (!reason || !vehicle || !intent || !i1 || !i2 || !i3) {
            // Judge gets VERY annoyed at incomplete paperwork
            this.judge.patience = Math.max(0, this.judge.patience - 30);
            document.getElementById('patienceLevel').textContent = this.judge.patience;

            const incompleteComments = [
                "\"Form 27-B is blank. Were you DRIVING while you should have been WRITING?\"",
                "\"You initialed 13-C but not 13-D. Do you know what that means? Neither do I. Six more months.\"",
                "\"INCOMPLETE PAPERWORK? Do you think this is a JOKE?\"",
                "\"You can't even fill out BASIC FORMS? Unbelievable.\"",
                "\"I have 47 other cases today. Fill. Out. The. Forms.\"",
                "\"Incompetence is not a defense. Complete the paperwork. NOW.\"",
                "\"There are THREE initial fields. You filled TWO. That's 67% compliance. We require 100%.\"",
                "\"Every blank field on these forms is a personal insult to me and the justice system.\""
            ];

            this.showJudgeComment(incompleteComments[Math.floor(Math.random() * incompleteComments.length)]);
            this.showMessage('INCOMPLETE PAPERWORK. All forms must be filled completely.', 4000);
            return;
        }

        // Final sentencing from Judge Hardcastle
        const response = this.judge.generateResponse({
            drivingTime: this.player.drivingTime,
            speed: this.player.speed
        });

        // Extract sentence years from response
        const baseSentence = Math.floor(this.player.drivingTime / 10);
        const sentenceYears = Math.max(1, baseSentence + this.judge.arrestCount);
        this.player.sentence = sentenceYears;
        this.player.prisonDays = 0;

        // Display final sentencing
        document.getElementById('judgeStatement').innerHTML = `
            <p style="color: #f00; font-weight: bold; font-size: 1.2em; margin-bottom: 15px; text-transform: uppercase;">
                VERDICT: GUILTY
            </p>
            <p style="color: #f00; font-weight: bold; margin-bottom: 10px;">
                "${response.sentencing}"
            </p>
            <p style="color: #ff0; margin-top: 15px; font-size: 1.1em;">
                Your sentence: ${sentenceYears} YEARS
            </p>
            <p style="color: #0f0; margin-top: 10px; font-style: normal;">
                May this serve as a lesson. Which it won't. I'll see you again.
            </p>
        `;

        // Update final mood
        document.getElementById('moodLevel').textContent = this.judge.mood.toUpperCase();
        document.getElementById('patienceLevel').textContent = this.judge.patience;

        // Disable form inputs
        document.querySelectorAll('#courtroom input, #courtroom textarea, #courtroom select').forEach(el => {
            el.disabled = true;
        });

        this.showMessage('GUILTY. Sentence: ' + sentenceYears + ' years. Welcome to prison.', 4000);

        // Show dramatic judgment and gavel cinematic
        setTimeout(() => {
            // Play gavel strike sound
            this.soundSystem.playGavelStrike();

            this.cinematics.play('judgment', () => {
                // Play prison door clang sound
                this.soundSystem.playPrisonDoorClang();

                // Then show prison entrance
                this.cinematics.play('prison', () => {
                    this.startPrison();
                });
            });
        }, 5000);
    }

    startPrison() {
        this.gameState = 'prison';

        // Stop Ace Attorney courtroom if it's running
        if (this.aceCourtroom) {
            this.aceCourtroom.stop();
        }

        this.showScreen('prisonMenu');
        document.getElementById('sentenceLength').textContent = this.player.sentence;
        document.getElementById('timeServed').textContent = this.player.prisonDays;
        this.saveGame();
    }

    prisonActivity(activity) {
        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        // Earn 1-5 credits per activity (except commissary, letter, weights, read, and tattoo)
        if (activity !== 'commissary' && activity !== 'letter' && activity !== 'weights' && activity !== 'read' && activity !== 'tattoo') {
            const earned = Math.floor(Math.random() * 5) + 1;
            this.player.money += earned;
            setTimeout(() => {
                this.showMessage(`You earned ${earned} credit${earned > 1 ? 's' : ''}.`, 2000);
            }, 200);
        }

        const messages = {
            weights: [
                'You lift the bar. It is heavy, like the weight of bureaucracy.',
                'The weights clank. Somewhere, a traffic law is being written.',
                'Your muscles grow stronger. Your spirit remains crushed.'
            ],
            eat: [
                'Mystery meat. It tastes like regret and cayenne pepper.',
                'You eat in silence. Everyone here drove a car once.',
                'The food is bad. The company is worse. You miss driving.'
            ],
            cellmate: [
                'Your cellmate: "I was just going to the store. That\'s all."',
                'Your cellmate: "Five years for driving. FIVE YEARS."',
                'Your cellmate stares at the wall. You understand completely.'
            ],
            tattoo: [
                'You get a tattoo of a steering wheel. It\'s ironic and sad.',
                'The needle hurts less than the paperwork did.',
                'Your new tattoo says "VROOM". You have no regrets.'
            ],
            commissary: [
                'You buy instant noodles. They cost three days wages.',
                'The commissary sells hope in small, overpriced packages.',
                'You purchase a candy bar. It\'s the best day you\'ve had in weeks.'
            ],
            gang: [
                'The Safe Drivers Club accepts you. You attend meetings on Thursdays. You have never felt more seen.',
                'Your gang discusses proper turn signal usage. It\'s very serious. Nobody laughs. This is your family now.',
                'You are now part of something bigger: organized safe driving. For the first time in years, you belong.'
            ]
        };

        if (activity === 'weights') {
            this.showScreen('weightLifting');
            this.initializeWeightLifting();
            return; // Don't add prison day yet, handled in workout completion
        } else if (activity === 'eat') {
            this.startEating();
            return; // Don't add prison day yet, handled in eating completion
        } else if (activity === 'letter') {
            this.showScreen('letterWriting');
        } else if (activity === 'read') {
            this.showScreen('prisonLibrary');
            this.updateLibraryScreen();
        } else if (activity === 'tattoo') {
            this.showScreen('tattooStudio');
            this.initTattooSystem();
            return; // Don't add prison day yet, handled in tattoo completion
        } else if (activity === 'manicure') {
            // Use new nail art decoration system
            this.showScreen('nailArtGuardSelection');
            return; // Don't add prison day yet, handled in nail art completion
        } else if (activity === 'gang') {
            this.showGangSystem();
            return; // Don't show generic message for gang system
        } else if (activity === 'commissary') {
            this.showScreen('commissaryShop');
            this.updateCommissaryDisplay();
            return; // Don't show generic message for commissary
        } else {
            const msg = messages[activity][Math.floor(Math.random() * messages[activity].length)];
            this.showMessage(msg, 4000);
        }

        // Check if sentence complete (7 activities = 1 year for reasonable gameplay)
        if (this.player.prisonDays >= this.player.sentence * 7) {
            setTimeout(() => this.endPrison(), 2000);
        }

        this.saveGame();
    }

    sendLetter() {
        const to = document.getElementById('letterTo').value.trim();
        const message = document.getElementById('letterMessage').value.trim();

        if (!to || !message) {
            this.showMessage('Letter must have recipient and message!');
            return;
        }

        this.player.letters.push({ to, message, day: this.player.prisonDays });
        this.showMessage('Letter sent. It will be read by guards first.', 3000);
        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        setTimeout(() => this.showScreen('prisonMenu'), 3000);
        this.saveGame();
    }

    // ============================================================
    // TATTOO SYSTEM METHODS
    // ============================================================

    // Initialize tattoo system (lazy initialization)
    initTattooSystem() {
        if (!this.tattooSystem) {
            this.tattooSystem = new TattooSystem(this);
        }
        this.tattooSystem.initializeTattooStudio();
    }

    // Clear tattoo design
    clearTattooDesign() {
        if (this.tattooSystem) {
            this.tattooSystem.clearDesign();
        }
    }

    // Create stencil
    createStencil() {
        if (this.tattooSystem) {
            this.tattooSystem.createStencil();
        }
    }

    // Apply ink
    applyInk() {
        if (this.tattooSystem) {
            this.tattooSystem.applyInk();
        }
    }

    // Select body placement
    selectBodyPlacement() {
        if (this.tattooSystem) {
            this.tattooSystem.selectBodyPlacement();
        }
    }

    // Start care game
    startCareGame() {
        if (this.tattooSystem) {
            this.tattooSystem.startCareGame();
        }
    }

    // Care action
    careAction(action) {
        if (this.tattooSystem) {
            this.tattooSystem.careAction(action);
        }
    }

    // Cancel tattoo
    cancelTattoo() {
        if (this.tattooSystem) {
            this.tattooSystem.cancel();
        }
    }

    // ============================================================
    // GANG SYSTEM METHODS
    // ============================================================

    initializeGangSystem() {
        // Initialize gang reputation if not exists
        if (!this.player.gangRep) {
            this.player.gangRep = { safedrivers: 0, turnsignals: 0, roadwarriors: 0 };
        }
        if (!this.player.currentGang) {
            this.player.currentGang = null;
        }
        if (this.player.cigarettes === undefined) {
            this.player.cigarettes = 0;
        }
        if (!this.player.gangEvents) {
            this.player.gangEvents = [];
        }
    }

    showGangSystem() {
        this.initializeGangSystem();
        this.updateGangUI();
        this.showScreen('gangSystem');
    }

    updateGangUI() {
        // Update player status
        document.getElementById('playerCurrentGang').textContent =
            this.player.currentGang ? this.getGangName(this.player.currentGang) : 'None';
        document.getElementById('playerCigarettes').textContent = this.player.cigarettes;

        // Update gang reputation bars
        const gangs = ['safedrivers', 'turnsignals', 'roadwarriors'];
        gangs.forEach(gang => {
            const rep = this.player.gangRep[gang];
            const normalizedRep = ((rep + 100) / 200) * 100; // Convert -100 to +100 range to 0-100%
            document.getElementById(`rep_${gang}`).textContent = rep;
            document.getElementById(`repbar_${gang}`).style.width = normalizedRep + '%';
        });
    }

    getGangName(gangId) {
        const names = {
            safedrivers: 'Safe Drivers Club',
            turnsignals: 'The Turn Signals',
            roadwarriors: 'Road Warriors'
        };
        return names[gangId] || gangId;
    }

    getGangInfo(gangId) {
        const gangInfo = {
            safedrivers: {
                name: 'Safe Drivers Club',
                color: '#4A8BFF',
                motto: 'We signaled our turns. We obeyed speed limits. And still, we ended up here.',
                leader: 'Marcus "Signal" Patterson',
                benefits: '+10% Commissary discounts, Library access, Meditation classes',
                enemies: ['roadwarriors']
            },
            turnsignals: {
                name: 'The Turn Signals',
                color: '#FFB84A',
                motto: 'Communication is everything. On the road. In here. Everywhere.',
                leader: 'Jasmine "Blinker" Chen',
                benefits: 'Information network, Extra yard time, Better cellmate assignments',
                enemies: []
            },
            roadwarriors: {
                name: 'Road Warriors',
                color: '#FF4A4A',
                motto: 'We drove fast. We drove free. No regrets. Ever.',
                leader: 'Viktor "Redline" Volkov',
                benefits: 'Protection, Gym privileges, Black market access',
                enemies: ['safedrivers']
            }
        };
        return gangInfo[gangId];
    }

    interactWithGang(gangId) {
        this.currentInteractingGang = gangId;
        const gang = this.getGangInfo(gangId);
        const rep = this.player.gangRep[gangId];

        let repStatus = '';
        if (rep < -50) repStatus = 'HOSTILE';
        else if (rep < -20) repStatus = 'UNFRIENDLY';
        else if (rep < 20) repStatus = 'NEUTRAL';
        else if (rep < 50) repStatus = 'FRIENDLY';
        else repStatus = 'ALLIED';

        const content = `
            <h3 style="color: ${gang.color};">${gang.name}</h3>
            <p style="font-style: italic; color: #ccc; margin: 15px 0;">"${gang.motto}"</p>

            <div style="margin: 20px 0;">
                <strong>Leader:</strong> ${gang.leader}<br>
                <strong>Your Reputation:</strong> <span style="color: ${gang.color};">${rep}</span> / 100 (<span style="color: ${gang.color};">${repStatus}</span>)<br>
                <strong>Benefits:</strong> ${gang.benefits}
            </div>

            <div style="padding: 15px; background: rgba(0, 255, 0, 0.05); border: 1px solid #0f0; margin: 20px 0;">
                ${this.getGangDialogue(gangId, rep)}
            </div>
        `;

        document.getElementById('gangInteractionTitle').textContent = gang.name;
        document.getElementById('gangInteractionContent').innerHTML = content;
        this.showScreen('gangInteraction');
    }

    getGangDialogue(gangId, rep) {
        const gang = this.getGangInfo(gangId);
        const isMember = this.player.currentGang === gangId;

        if (isMember) {
            const dialogues = {
                safedrivers: [
                    `${gang.leader}: "Welcome back, friend. We have meditation at 3 PM."`,
                    `${gang.leader}: "Your dedication to safe driving is an inspiration to us all."`,
                    `${gang.leader}: "The library received new books. Traffic law amendments. Riveting."`
                ],
                turnsignals: [
                    `${gang.leader}: "I heard something interesting in the yard today. Let's talk later."`,
                    `${gang.leader}: "Communication is key. Always signal your intentions."`,
                    `${gang.leader}: "Your loyalty doesn't go unnoticed. We take care of our own."`
                ],
                roadwarriors: [
                    `${gang.leader}: "The gym is reserved for us tonight. Bring your anger."`,
                    `${gang.leader}: "Some supplies 'fell off a truck' in the commissary. Interested?"`,
                    `${gang.leader}: "We drive fast, we live fast. No regrets. Ever."`
                ]
            };
            return dialogues[gangId][Math.floor(Math.random() * dialogues[gangId].length)];
        }

        if (rep < -50) {
            return `${gang.leader}: "You're not welcome here. Leave. Now."`;
        } else if (rep < -20) {
            return `${gang.leader}: "What do you want? Make it quick."`;
        } else if (rep < 20) {
            return `${gang.leader}: "We don't know you. But we're listening."`;
        } else if (rep < 50) {
            return `${gang.leader}: "You've earned some respect. Keep it up."`;
        } else {
            return `${gang.leader}: "You're one of us in spirit. Perhaps it's time to make it official?"`;
        }
    }

    gangAction(action) {
        const gangId = this.currentInteractingGang;
        const gang = this.getGangInfo(gangId);
        const rep = this.player.gangRep[gangId];

        switch (action) {
            case 'talk':
                this.gangActionTalk(gangId, rep);
                break;
            case 'share_cigarettes':
                this.gangActionShareCigarettes(gangId);
                break;
            case 'trade':
                this.gangActionTrade(gangId, rep);
                break;
            case 'join':
                this.gangActionJoin(gangId, rep);
                break;
        }
    }

    gangActionTalk(gangId, rep) {
        if (rep < -50) {
            this.showMessage('They refuse to talk to you. Your reputation is too low.', 3000);
            return;
        }

        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        const repGain = Math.floor(Math.random() * 3) + 2; // 2-4 rep
        this.adjustGangRep(gangId, repGain);

        const dialogue = [
            `You spend time talking with the ${this.getGangName(gangId)}. They appreciate the conversation. (+${repGain} reputation)`,
            `You share stories about life on the road. They listen intently. (+${repGain} reputation)`,
            `You discuss your shared experiences with traffic violations. Bonds form. (+${repGain} reputation)`
        ];

        this.showMessage(dialogue[Math.floor(Math.random() * dialogue.length)], 4000);
        this.updateGangUI();
        this.saveGame();

        // Update interaction screen
        setTimeout(() => {
            this.interactWithGang(gangId);
        }, 4000);
    }

    gangActionShareCigarettes(gangId) {
        if (this.player.cigarettes < 5) {
            this.showMessage('You need 5 cigarettes to share. You only have ' + this.player.cigarettes + '.', 3000);
            return;
        }

        this.player.cigarettes -= 5;
        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        const repGain = Math.floor(Math.random() * 8) + 7; // 7-14 rep
        this.adjustGangRep(gangId, repGain);

        this.showMessage(`You share cigarettes with the ${this.getGangName(gangId)}. They're grateful. (+${repGain} reputation)`, 4000);
        this.updateGangUI();
        this.saveGame();

        setTimeout(() => {
            this.interactWithGang(gangId);
        }, 4000);
    }

    gangActionTrade(gangId, rep) {
        if (rep < 0) {
            this.showMessage('They don\'t trust you enough to trade. Improve your reputation first.', 3000);
            return;
        }

        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        // Random trade event
        const trades = [
            { give: 'help with laundry', get: 3, item: 'cigarettes' },
            { give: 'advice on traffic law', get: 5, item: 'cigarettes' },
            { give: 'a favor', get: 2, item: 'cigarettes' },
            { give: 'protection during yard time', get: 4, item: 'cigarettes' }
        ];

        const trade = trades[Math.floor(Math.random() * trades.length)];
        this.player.cigarettes += trade.get;

        const repGain = Math.floor(Math.random() * 3) + 1; // 1-3 rep
        this.adjustGangRep(gangId, repGain);

        this.showMessage(`You trade ${trade.give} for ${trade.get} ${trade.item}. (+${repGain} reputation)`, 4000);
        this.updateGangUI();
        this.saveGame();

        setTimeout(() => {
            this.interactWithGang(gangId);
        }, 4000);
    }

    gangActionJoin(gangId, rep) {
        if (this.player.currentGang === gangId) {
            this.showMessage('You are already a member of this gang.', 3000);
            return;
        }

        if (this.player.currentGang) {
            this.showMessage('You must leave your current gang before joining another. This feature is not yet implemented.', 3000);
            return;
        }

        if (rep < 50) {
            this.showMessage(`Your reputation is too low to join. You need at least 50 reputation. Current: ${rep}`, 3000);
            return;
        }

        // Check if player is enemy of this gang
        const gang = this.getGangInfo(gangId);
        for (let enemyId of gang.enemies) {
            if (this.player.gangRep[enemyId] > 0) {
                this.showMessage(`The ${this.getGangName(gangId)} won't accept you while you're friendly with their enemies.`, 3000);
                return;
            }
        }

        // Join the gang
        this.player.currentGang = gangId;
        this.player.gangMember = true;
        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        // Make enemies hostile
        for (let enemyId of gang.enemies) {
            this.adjustGangRep(enemyId, -50);
        }

        this.showMessage(`You have joined the ${this.getGangName(gangId)}! You are now part of something bigger.`, 5000);

        // Trigger gang event
        this.triggerGangEvent(gangId);

        this.updateGangUI();
        this.saveGame();

        setTimeout(() => {
            this.interactWithGang(gangId);
        }, 5000);
    }

    adjustGangRep(gangId, amount) {
        this.player.gangRep[gangId] = Math.max(-100, Math.min(100, this.player.gangRep[gangId] + amount));
    }

    triggerGangEvent(gangId) {
        const events = {
            safedrivers: [
                'You attend your first meditation session. It\'s surprisingly peaceful.',
                'The gang leader gives you a copy of "The Complete Vehicle Code, Annotated".',
                'You discuss the philosophical implications of speed limits with your new brothers.'
            ],
            turnsignals: [
                'You learn about the information network. Knowledge is power in here.',
                'Someone shares a secret with you: "The guards change shift at 3 AM."',
                'You\'re assigned better yard time. The view is slightly less depressing.'
            ],
            roadwarriors: [
                'You\'re given access to the restricted gym equipment. Time to get stronger.',
                'The black market dealer nods to you. You have access now.',
                'Your new gang tattoo itches. It says "REDLINE" in gothic letters.'
            ]
        };

        const eventTexts = events[gangId];
        const event = {
            gang: gangId,
            text: eventTexts[Math.floor(Math.random() * eventTexts.length)],
            day: this.player.prisonDays
        };

        this.player.gangEvents.push(event);
        this.showMessage(event.text, 5000);
    }

    // ==================== ESCAPE SYSTEM ====================

    // Escape route data
    getEscapeRoutes() {
        return {
            tunnel: {
                name: "TUNNEL ESCAPE",
                description: "The classic escape. One spoon. One wall. Endless patience. You'll dig through concrete and rebar, one chip at a time. The Count of Monte Cristo did it. So can you. Probably.",
                requirements: [
                    { id: "spoon", name: "Spoon from cafeteria", type: "item" },
                    { id: "blueprints", name: "Prison blueprints", type: "item" },
                    { id: "hideSpot", name: "Way to hide debris", type: "item" }
                ],
                actions: [
                    { id: "findSpoon", name: "Steal a spoon from cafeteria", days: 2, successRate: 70 },
                    { id: "getBlueprintsint", name: "Steal blueprints from maintenance", days: 3, successRate: 50 },
                    { id: "prepareHiding", name: "Prepare hiding spot for debris", days: 2, successRate: 80 },
                    { id: "digTunnel", name: "Dig the tunnel (takes time)", days: 5, successRate: 60, requiresAll: true }
                ],
                baseSuccessRate: 30,
                penalty: 10,
                contraband: ["file_in_cake", "map"]
            },
            bribe: {
                name: "BRIBE A GUARD",
                description: "Everyone has a price. Even the guards who swore an oath. Find the weak link. Offer cigarettes. Offer favors. Offer anything. Money talks. Desperation screams.",
                requirements: [
                    { id: "cigarettes", name: "30 cigarettes", type: "currency" },
                    { id: "guard_info", name: "Information on corrupt guard", type: "item" },
                    { id: "leverage", name: "Leverage or blackmail material", type: "item" },
                    { id: "fake_id", name: "Fake ID for outside", type: "item" }
                ],
                actions: [
                    { id: "buySmokes", name: "Buy cigarettes from commissary", days: 1, successRate: 90 },
                    { id: "findGuard", name: "Identify vulnerable guard", days: 3, successRate: 60 },
                    { id: "findLeverage", name: "Find leverage on guard", days: 4, successRate: 40 },
                    { id: "getFakeID", name: "Get fake ID from forger", days: 3, successRate: 50 },
                    { id: "makeDeal", name: "Make the deal", days: 1, successRate: 55, requiresAll: true }
                ],
                baseSuccessRate: 45,
                penalty: 12,
                contraband: ["cigarettes", "photos"]
            },
            transfer: {
                name: "MANIPULATE TRANSFER",
                description: "Bureaucracy got you in. Bureaucracy can get you out. Forge a transfer order. Fake a court summons. Create a clerical error. The system is your weapon. Use it.",
                requirements: [
                    { id: "blank_forms", name: "Blank transfer forms", type: "item" },
                    { id: "stamp", name: "Official stamp", type: "item" },
                    { id: "signature", name: "Forged signatures", type: "item" },
                    { id: "computer_access", name: "Computer access", type: "item" },
                    { id: "uniform", name: "Guard uniform or civilian clothes", type: "item" }
                ],
                actions: [
                    { id: "stealForms", name: "Steal blank forms from office", days: 3, successRate: 50 },
                    { id: "getStamp", name: "Acquire official stamp", days: 4, successRate: 35 },
                    { id: "forgeSign", name: "Practice forging signatures", days: 2, successRate: 70 },
                    { id: "hackSystem", name: "Get computer access", days: 5, successRate: 40 },
                    { id: "getUniform", name: "Obtain civilian clothes", days: 2, successRate: 60 },
                    { id: "executeTransfer", name: "Execute the transfer", days: 1, successRate: 50, requiresAll: true }
                ],
                baseSuccessRate: 55,
                penalty: 15,
                contraband: ["forms", "stamp", "pen"]
            },
            riot: {
                name: "INCITE A RIOT",
                description: "Chaos is a ladder. Start a fire. Start a fight. Start a revolution. When everyone's running, you run too. But in a different direction. Towards the exit. Violence optional. Recommended.",
                requirements: [
                    { id: "ally1", name: "Recruit Safe Drivers Club", type: "ally" },
                    { id: "ally2", name: "Recruit cellblock leader", type: "ally" },
                    { id: "ally3", name: "Recruit kitchen staff", type: "ally" },
                    { id: "ally4", name: "Recruit 3 more inmates", type: "ally" },
                    { id: "weapon", name: "Makeshift weapon", type: "item" },
                    { id: "distraction", name: "Distraction plan", type: "item" }
                ],
                actions: [
                    { id: "recruitGang", name: "Recruit Safe Drivers Club", days: 2, successRate: 80 },
                    { id: "recruitLeader", name: "Recruit cellblock leader", days: 4, successRate: 50 },
                    { id: "recruitKitchen", name: "Recruit kitchen staff", days: 3, successRate: 60 },
                    { id: "recruitInmates", name: "Recruit 3 more inmates", days: 3, successRate: 70 },
                    { id: "makeWeapon", name: "Craft makeshift weapon", days: 2, successRate: 85 },
                    { id: "planDistraction", name: "Plan the distraction", days: 2, successRate: 75 },
                    { id: "startRiot", name: "Start the riot", days: 1, successRate: 45, requiresAll: true }
                ],
                baseSuccessRate: 40,
                penalty: 20,
                contraband: ["shiv", "lighter"]
            }
        };
    }

    // Initialize escape progress if not present
    initializeEscapeProgress() {
        if (!this.player.escapeProgress) {
            this.player.escapeProgress = {
                tunnel: { progress: 0, items: [], completedActions: [] },
                bribe: { progress: 0, items: [], completedActions: [] },
                transfer: { progress: 0, items: [], completedActions: [] },
                riot: { progress: 0, allies: [], completedActions: [] }
            };
        }
    }

    // Show escape menu with updated progress
    showEscapeMenu() {
        this.initializeEscapeProgress();
        this.showScreen('escapeMenu');

        // Update time served and sentence
        document.getElementById('escapeTimeServed').textContent = this.player.prisonDays;
        document.getElementById('escapeSentence').textContent = this.player.sentence;

        // Update progress for each route
        const routes = this.getEscapeRoutes();
        for (const [routeId, route] of Object.entries(routes)) {
            const progress = this.player.escapeProgress[routeId];
            const itemsCompleted = progress.completedActions.length;
            const totalItems = route.requirements.length;
            const progressPercent = Math.floor((itemsCompleted / totalItems) * 100);

            // Calculate success rate based on progress
            const successRate = route.baseSuccessRate + (progressPercent / 5);

            // Update display
            document.getElementById(`${routeId}Progress`).textContent = progressPercent;
            document.getElementById(`${routeId}Items`).textContent = itemsCompleted;
            document.getElementById(`${routeId}Rate`).textContent = Math.floor(successRate);
        }

        // Special handling for riot (allies instead of items)
        const riotProgress = this.player.escapeProgress.riot;
        document.getElementById('riotAllies').textContent = riotProgress.allies.length;
    }

    // Show detailed escape route
    showEscapeRoute(routeId) {
        this.currentEscapeRoute = routeId;
        const routes = this.getEscapeRoutes();
        const route = routes[routeId];
        const progress = this.player.escapeProgress[routeId];

        this.showScreen('escapeRouteDetail');

        // Update title and description
        document.getElementById('escapeRouteTitle').textContent = route.name;
        document.getElementById('escapeRouteDescription').innerHTML = `<p style="color: #0f0; line-height: 1.6;">${route.description}</p>`;

        // Update requirements list
        const reqList = document.getElementById('escapeReqList');
        reqList.innerHTML = '';
        route.requirements.forEach((req, index) => {
            const completed = progress.items.includes(req.id) || progress.allies.includes(req.id);
            const li = document.createElement('li');
            li.style.margin = '10px 0';
            li.style.color = completed ? '#0f0' : '#888';
            li.innerHTML = `${completed ? '[✓]' : '[ ]'} ${req.name} ${completed ? '(COMPLETE)' : '(NEEDED)'}`;
            reqList.appendChild(li);
        });

        // Update action buttons
        const actionButtons = document.getElementById('escapeActionButtons');
        actionButtons.innerHTML = '';
        route.actions.forEach(action => {
            const completed = progress.completedActions.includes(action.id);
            const canDo = !action.requiresAll || progress.completedActions.length >= route.actions.length - 1;

            const btn = document.createElement('button');
            btn.textContent = `${action.name} (${action.days} days, ${action.successRate}% success)`;
            btn.style.margin = '10px';
            btn.style.width = 'calc(100% - 20px)';
            btn.style.background = completed ? '#004400' : '#000';
            btn.style.borderColor = completed ? '#00ff00' : '#0f0';
            btn.style.color = completed ? '#00ff00' : '#0f0';
            btn.disabled = completed || !canDo;
            btn.onclick = () => this.planEscape(routeId, action.id);
            actionButtons.appendChild(btn);
        });

        // Update success rate and penalty
        const itemsCompleted = progress.completedActions.length;
        const totalItems = route.actions.length;
        const progressPercent = (itemsCompleted / totalItems) * 100;
        const successRate = route.baseSuccessRate + (progressPercent / 5);

        document.getElementById('escapeSuccessRate').textContent = Math.floor(successRate);
        document.getElementById('escapePenalty').textContent = route.penalty;

        // Enable/disable execute button
        const executeBtn = document.getElementById('executeEscapeBtn');
        const allRequirementsMet = progress.completedActions.length >= route.actions.length - 1;
        executeBtn.disabled = !allRequirementsMet;
        executeBtn.textContent = allRequirementsMet ? 'ATTEMPT ESCAPE' : 'COMPLETE PREPARATIONS FIRST';
    }

    // Plan escape - complete an action
    planEscape(routeId, actionId) {
        const routes = this.getEscapeRoutes();
        const route = routes[routeId];
        const action = route.actions.find(a => a.id === actionId);
        const progress = this.player.escapeProgress[routeId];

        if (!action || progress.completedActions.includes(actionId)) {
            return;
        }

        // Roll for success
        const roll = Math.random() * 100;
        const success = roll < action.successRate;

        // Add time
        this.player.prisonDays += action.days;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        if (success) {
            progress.completedActions.push(actionId);

            // Add corresponding item or ally
            const req = route.requirements.find(r => r.id.includes(actionId) || actionId.includes(r.id));
            if (req) {
                if (req.type === 'ally') {
                    progress.allies.push(req.id);
                } else {
                    progress.items.push(req.id);
                }
            }

            this.showMessage(`SUCCESS: ${action.name} completed. ${action.days} days passed.`, 4000);

            // Refresh the route display
            setTimeout(() => this.showEscapeRoute(routeId), 1000);
        } else {
            this.showMessage(`FAILED: ${action.name} failed. You'll need to try again. ${action.days} days passed.`, 4000);
        }

        // Check if sentence complete
        if (this.player.prisonDays >= this.player.sentence * 7) {
            setTimeout(() => this.endPrison(), 2000);
        }

        this.saveGame();
    }

    // Execute escape attempt
    executeEscape() {
        const routeId = this.currentEscapeRoute;
        const routes = this.getEscapeRoutes();
        const route = routes[routeId];
        const progress = this.player.escapeProgress[routeId];

        // Calculate final success rate
        const itemsCompleted = progress.completedActions.length;
        const totalItems = route.actions.length;
        const progressPercent = (itemsCompleted / totalItems) * 100;
        const successRate = route.baseSuccessRate + (progressPercent / 5);

        // Add gang bonus if player is gang member
        let finalSuccessRate = successRate;
        if (this.player.gangMember) {
            finalSuccessRate += 10;
        }

        // Roll for escape
        const roll = Math.random() * 100;
        const success = roll < finalSuccessRate;

        if (success) {
            // SUCCESS - FREEDOM!
            this.showMessage('ESCAPE SUCCESSFUL! You are FREE!', 5000);

            // Play escape cinematic
            setTimeout(() => {
                this.cinematics.play('release', () => {
                    // Return to driving
                    this.startDriving(true);
                });
            }, 2000);
        } else {
            // CAUGHT - Add penalty
            this.player.sentence += route.penalty;
            this.player.prisonDays = 0;

            const messages = [
                `ESCAPE ATTEMPT FAILED. You were caught. +${route.penalty} years added to your sentence.`,
                `CAUGHT. The guards were waiting. Your sentence: now ${this.player.sentence} years.`,
                `FAILED. They knew. They always know. +${route.penalty} years. Total: ${this.player.sentence} years.`,
                `CAPTURED. The warden smiles. "Thought you could escape? Add ${route.penalty} years to the sentence."`
            ];

            this.showMessage(messages[Math.floor(Math.random() * messages.length)], 6000);

            // Reset escape progress for this route
            this.player.escapeProgress[routeId] = {
                progress: 0,
                items: [],
                allies: [],
                completedActions: []
            };

            // Return to prison menu
            setTimeout(() => {
                this.startPrison();
            }, 6000);
        }

        this.saveGame();
    }

    // ==================== END ESCAPE SYSTEM ====================

    // ==================== GUARD MANICURE SYSTEM ====================

    // Initialize manicure system (lazy initialization)
    initManicureSystem() {
        if (!this.manicureSystem) {
            this.manicureSystem = new VisualManicureSystem(this);
        }
    }

    // Show guard favors menu
    showGuardFavorsMenu() {
        const tokens = this.player.favorTokens || 0;
        document.getElementById('favorTokenCount').textContent = tokens;
        this.showScreen('guardFavorsMenu');
    }

    // Spend favor tokens
    spendFavorToken(type) {
        const tokens = this.player.favorTokens || 0;

        const costs = {
            ignore: 1,
            cigarettes: 2,
            contraband: 3,
            escape: 3,
            reduce: 4
        };

        const cost = costs[type];

        if (tokens < cost) {
            this.showMessage(`Not enough favor tokens! Need ${cost}, have ${tokens}.`, 3000);
            return;
        }

        // Deduct tokens
        this.player.favorTokens -= cost;

        // Apply benefit
        switch(type) {
            case 'ignore':
                if (!this.player.guardFavors) {
                    this.player.guardFavors = {};
                }
                this.player.guardFavors.ignoreViolation = true;
                this.showMessage('Guard will ignore your next minor violation.', 3000);
                break;

            case 'cigarettes':
                if (!this.player.inventory) {
                    this.player.inventory = {};
                }
                this.player.inventory.cigarettes = (this.player.inventory.cigarettes || 0) + 20;
                this.player.cigarettes = (this.player.cigarettes || 0) + 20;
                this.showMessage('Received 20 cigarettes! Guard looked the other way.', 3000);
                break;

            case 'contraband':
                const contrabandItems = ['phone', 'screwdriver', 'magazine', 'chocolate', 'map'];
                const randomItem = contrabandItems[Math.floor(Math.random() * contrabandItems.length)];
                if (!this.player.inventory) {
                    this.player.inventory = {};
                }
                this.player.inventory[randomItem] = (this.player.inventory[randomItem] || 0) + 1;
                this.showMessage(`Received contraband: ${randomItem}! Don't get caught.`, 3000);
                break;

            case 'escape':
                // Boost escape success rate
                if (this.player.escapeProgress) {
                    Object.keys(this.player.escapeProgress).forEach(route => {
                        if (this.player.escapeProgress[route].progress !== undefined) {
                            this.player.escapeProgress[route].progress += 15;
                        }
                    });
                }
                this.showMessage('Guard looked away during escape prep. +15% success rate!', 3000);
                break;

            case 'reduce':
                this.player.prisonDays = Math.max(0, this.player.prisonDays - 7);
                this.showMessage('Paperwork "adjusted". Sentence reduced by 7 days!', 3000);

                // Update prison UI if method exists
                if (typeof this.updatePrisonUI === 'function') {
                    this.updatePrisonUI();
                }

                // Update time served display
                if (document.getElementById('timeServed')) {
                    document.getElementById('timeServed').textContent = Math.floor(this.player.prisonDays);
                }
                break;
        }

        // Update display and save
        document.getElementById('favorTokenCount').textContent = this.player.favorTokens;
        if (document.getElementById('favorTokensDisplay')) {
            document.getElementById('favorTokensDisplay').textContent = this.player.favorTokens;
        }
        this.saveGame();
    }

    // ==================== END GUARD MANICURE SYSTEM ====================

    // Weight Lifting Simulator Methods
    initializeWeightLifting() {
        // Initialize player strength if not exists
        if (!this.player.strength) {
            this.player.strength = 0;
        }

        // Workout state
        this.weightLifting = {
            currentSet: 0,
            currentRep: 0,
            totalSets: 5,
            repsPerSet: 10,
            fatigue: 0,
            isActive: false,
            repProgress: 0,
            clicksNeeded: 10,
            currentClicks: 0
        };

        // Update display
        this.updateWeightLiftingUI();

        // Remove any existing event listeners
        document.removeEventListener('click', this.doRepBound);
        document.removeEventListener('keydown', this.handleSpacebarBound);

        // Bind methods
        this.doRepBound = this.doRep.bind(this);
        this.handleSpacebarBound = this.handleSpacebar.bind(this);

        this.saveGame();
    }

    startWeightLifting() {
        if (this.weightLifting.isActive) return;

        this.weightLifting.isActive = true;
        this.weightLifting.currentSet = 1;
        this.weightLifting.currentRep = 1;
        this.weightLifting.currentClicks = 0;

        // Hide start button, show instructions
        document.getElementById('startWorkoutBtn').style.display = 'none';
        document.getElementById('workoutLog').style.display = 'block';

        // Add event listeners
        document.addEventListener('click', this.doRepBound);
        document.addEventListener('keydown', this.handleSpacebarBound);

        // Show first set as active
        this.updateSetIndicators();
        this.updateWeightLiftingUI();

        this.logWorkout('Workout started. 5 sets, 10 reps each. The iron awaits.');
    }

    handleSpacebar(e) {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (this.weightLifting.isActive) {
                this.doRep();
            }
        }
    }

    doRep() {
        if (!this.weightLifting.isActive) return;

        const wl = this.weightLifting;

        // Increase clicks
        wl.currentClicks++;

        // Calculate progress (more clicks needed as fatigue increases)
        const clicksNeeded = wl.clicksNeeded + Math.floor(wl.fatigue / 10);
        wl.repProgress = (wl.currentClicks / clicksNeeded) * 100;

        // Update progress bar
        document.getElementById('repProgressBar').style.width = wl.repProgress + '%';
        document.getElementById('repProgressText').textContent = `LIFTING... (${wl.currentClicks}/${clicksNeeded})`;

        // Rep complete
        if (wl.currentClicks >= clicksNeeded) {
            this.completeRep();
        }
    }

    completeRep() {
        const wl = this.weightLifting;

        // Reset clicks
        wl.currentClicks = 0;
        wl.repProgress = 0;

        // Show rep completion
        const motivationMessages = [
            'One more.',
            'The bar moves.',
            'Your muscles burn.',
            'You feel nothing.',
            'Keep going.',
            'The weight is constant.',
            'You are stronger than yesterday.',
            'Pain is temporary.',
            'The iron never lies.',
            'Breathe.'
        ];

        const msg = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        document.getElementById('motivationText').textContent = msg;

        // Log rep
        this.logWorkout(`Set ${wl.currentSet}, Rep ${wl.currentRep} - Complete`);

        // Increase fatigue
        wl.fatigue += 2;

        // Move to next rep
        if (wl.currentRep < wl.repsPerSet) {
            wl.currentRep++;
            this.updateWeightLiftingUI();
        } else {
            this.completeSet();
        }
    }

    completeSet() {
        const wl = this.weightLifting;

        // Log set completion
        this.logWorkout(`SET ${wl.currentSet} COMPLETE. Rest.`);

        // Mark set as complete
        const setIndicator = document.getElementById(`set${wl.currentSet}Status`);
        if (setIndicator) {
            setIndicator.style.borderColor = '#0f0';
            setIndicator.style.color = '#0f0';
            setIndicator.textContent = 'DONE';
        }

        // Check if all sets complete
        if (wl.currentSet < wl.totalSets) {
            // Move to next set
            wl.currentSet++;
            wl.currentRep = 1;

            // Increase fatigue more between sets
            wl.fatigue += 5;

            // Short rest message
            document.getElementById('motivationText').textContent = 'Rest. The next set approaches.';
            this.updateSetIndicators();
            this.updateWeightLiftingUI();

            setTimeout(() => {
                document.getElementById('motivationText').textContent = 'Begin.';
            }, 2000);
        } else {
            this.completeWorkout();
        }
    }

    completeWorkout() {
        const wl = this.weightLifting;
        wl.isActive = false;

        // Remove event listeners
        document.removeEventListener('click', this.doRepBound);
        document.removeEventListener('keydown', this.handleSpacebarBound);

        // Increase strength
        const strengthGain = 1 + Math.floor(Math.random() * 3);
        this.player.strength += strengthGain;

        // Reset progress bar
        document.getElementById('repProgressBar').style.width = '0%';
        document.getElementById('repProgressText').textContent = 'WORKOUT COMPLETE';

        // Final message
        document.getElementById('motivationText').textContent = `You are done. Strength +${strengthGain}. The bar will be here tomorrow.`;

        this.logWorkout(`WORKOUT COMPLETE. Total Strength: ${this.player.strength}`);
        this.logWorkout('The weights don\'t care about your crime. They never did.');

        // Show completion message
        this.showMessage(`Workout complete! Strength increased by ${strengthGain}. Total Strength: ${this.player.strength}`, 5000);

        // Add prison day for completing activity
        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

        // Check if sentence complete
        if (this.player.prisonDays >= this.player.sentence * 7) {
            setTimeout(() => this.endPrison(), 3000);
        }

        // Show return button
        setTimeout(() => {
            document.getElementById('startWorkoutBtn').textContent = 'WORKOUT AGAIN';
            document.getElementById('startWorkoutBtn').style.display = 'inline-block';

            // Reset for next workout
            this.weightLifting.currentSet = 0;
            this.weightLifting.currentRep = 0;
            this.weightLifting.fatigue = 0;
            this.weightLifting.currentClicks = 0;

            // Reset set indicators
            for (let i = 1; i <= 5; i++) {
                const indicator = document.getElementById(`set${i}Status`);
                if (indicator) {
                    indicator.style.borderColor = '#444';
                    indicator.style.color = '#888';
                    indicator.textContent = `SET ${i}`;
                }
            }

            this.updateWeightLiftingUI();
        }, 3000);

        this.saveGame();
    }

    updateWeightLiftingUI() {
        const wl = this.weightLifting;

        // Update strength and fatigue display
        document.getElementById('strengthValue').textContent = this.player.strength || 0;
        document.getElementById('fatigueValue').textContent = wl.fatigue + '%';

        // Update set/rep display
        document.getElementById('currentSetDisplay').textContent = `Set ${wl.currentSet}/${wl.totalSets}`;
        document.getElementById('currentRepDisplay').textContent = `Rep ${wl.currentRep}/${wl.repsPerSet}`;

        // Update progress bar
        document.getElementById('repProgressBar').style.width = wl.repProgress + '%';

        // Update progress text
        if (wl.isActive) {
            const clicksNeeded = wl.clicksNeeded + Math.floor(wl.fatigue / 10);
            document.getElementById('repProgressText').textContent = `CLICK OR PRESS SPACEBAR (${wl.currentClicks}/${clicksNeeded})`;
        } else {
            document.getElementById('repProgressText').textContent = 'CLICK OR PRESS SPACEBAR TO LIFT';
        }
    }

    updateSetIndicators() {
        const wl = this.weightLifting;

        for (let i = 1; i <= wl.totalSets; i++) {
            const indicator = document.getElementById(`set${i}Status`);
            if (indicator) {
                if (i < wl.currentSet) {
                    // Completed set
                    indicator.style.borderColor = '#0f0';
                    indicator.style.color = '#0f0';
                    indicator.textContent = 'DONE';
                } else if (i === wl.currentSet) {
                    // Current set
                    indicator.style.borderColor = '#ff0';
                    indicator.style.color = '#ff0';
                    indicator.textContent = 'ACTIVE';
                } else {
                    // Future set
                    indicator.style.borderColor = '#444';
                    indicator.style.color = '#888';
                    indicator.textContent = `SET ${i}`;
                }
            }
        }
    }

    logWorkout(message) {
        const logContent = document.getElementById('workoutLogContent');
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.style.marginBottom = '5px';
        entry.style.color = '#0f0';
        entry.textContent = `[${timestamp}] ${message}`;
        logContent.appendChild(entry);

        // Auto-scroll to bottom
        const logContainer = document.getElementById('workoutLog');
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    cancelWeightLifting() {
        // Remove event listeners
        if (this.doRepBound) {
            document.removeEventListener('click', this.doRepBound);
        }
        if (this.handleSpacebarBound) {
            document.removeEventListener('keydown', this.handleSpacebarBound);
        }

        // Reset workout state
        if (this.weightLifting) {
            this.weightLifting.isActive = false;
        }

        // Return to prison menu
        this.showScreen('prisonMenu');
    }

    // Eating Simulator Methods
    startEating() {
        this.showScreen('eatingSimulator');

        // Initialize eating state
        if (!this.player.hunger) {
            this.player.hunger = 100;
        }

        this.eatingState = {
            bitesRemaining: 20,
            startTime: Date.now()
        };

        this.drawPlate();
        document.getElementById('hungerLevel').textContent = this.player.hunger;
        document.getElementById('bitesRemaining').textContent = this.eatingState.bitesRemaining;
        document.getElementById('flavorText').textContent = 'Click a bite to eat. Take your time. You have nothing but time.';
    }

    drawPlate() {
        const bites = this.eatingState.bitesRemaining;
        let plateArt = '';

        if (bites === 20) {
            plateArt = `    ╔════════════════╗
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
    ╚════════════════╝
        FULL PLATE`;
        } else if (bites >= 15) {
            plateArt = `    ╔════════════════╗
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓   ║
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓   ║
    ║ ▓▓▓▓▓▓▓▓▓▓▓▓   ║
    ║                ║
    ╚════════════════╝`;
        } else if (bites >= 10) {
            plateArt = `    ╔════════════════╗
    ║ ▓▓▓▓▓▓▓▓       ║
    ║ ▓▓▓▓▓▓▓▓       ║
    ║                ║
    ║                ║
    ╚════════════════╝`;
        } else if (bites >= 5) {
            plateArt = `    ╔════════════════╗
    ║ ▓▓▓▓           ║
    ║                ║
    ║                ║
    ║                ║
    ╚════════════════╝`;
        } else if (bites > 0) {
            plateArt = `    ╔════════════════╗
    ║ ▓              ║
    ║                ║
    ║                ║
    ║                ║
    ╚════════════════╝
      ALMOST EMPTY`;
        } else {
            plateArt = `    ╔════════════════╗
    ║                ║
    ║                ║
    ║                ║
    ║                ║
    ╚════════════════╝
      CLEAN PLATE`;
        }

        document.getElementById('plateVisual').textContent = plateArt;
    }

    eatBite() {
        if (this.eatingState.bitesRemaining <= 0) {
            this.finishEating();
            return;
        }

        this.eatingState.bitesRemaining--;
        this.player.hunger = Math.max(0, this.player.hunger - 5);

        // Flavor texts
        const flavorTexts = [
            'Tastes like sadness and institutional neglect.',
            'Cold. Lumpy. Perfect.',
            'You chew mechanically. This is your life now.',
            'The texture is... questionable.',
            'You remember better meals. Those days are gone.',
            'It goes down. That\'s all that matters.',
            'Sustenance. Nothing more. Nothing less.',
            'You taste nothing. You feel nothing.',
            'Another bite. Another day. Another year.',
            'The spoon is heavier than your freedom was.',
            'This potato has more autonomy than you do.',
            'You wonder if they season it with despair.',
            'Eating. The only choice you have left.',
            'Somewhere, someone is eating at a restaurant.',
            'You miss salt. You miss everything.',
            'The cafeteria lady hates you. Everyone does.',
            'You chew slowly. Why rush?',
            'Time passes. The food doesn\'t improve.',
            'You think about driving while you eat.',
            'This meal is punishment enough.'
        ];

        const randomText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
        document.getElementById('flavorText').textContent = randomText;

        document.getElementById('hungerLevel').textContent = this.player.hunger;
        document.getElementById('bitesRemaining').textContent = this.eatingState.bitesRemaining;
        this.drawPlate();

        if (this.eatingState.bitesRemaining === 0) {
            setTimeout(() => this.finishEating(), 1000);
        }
    }

    finishEating() {
        const timeSpent = Math.floor((Date.now() - this.eatingState.startTime) / 1000);
        let message = '';

        if (timeSpent < 30) {
            message = 'You ate quickly. Efficiency. The only virtue left.';
        } else if (timeSpent < 60) {
            message = 'A reasonable pace. Time well wasted.';
        } else if (timeSpent < 120) {
            message = 'You savored each bite. Or you just forgot you were eating.';
        } else {
            message = 'You took your time. What else did you have to do?';
        }

        document.getElementById('flavorText').textContent = message;
        document.getElementById('eatButton').textContent = 'MEAL COMPLETE';
        document.getElementById('eatButton').disabled = true;

        this.showMessage('Meal complete. Hunger satisfied. Spirit broken.', 3000);

        setTimeout(() => {
            document.getElementById('eatButton').disabled = false;
            document.getElementById('eatButton').textContent = 'RETURN TO CELL';
            document.getElementById('eatButton').onclick = () => this.showScreen('prisonMenu');
        }, 3000);

        this.saveGame();
    }

    // Prison Library Methods
    getBookLibrary() {
        return [
            {
                title: "Traffic Laws: A Bureaucratic History",
                pages: [
                    "CHAPTER 1: THE ORIGINS OF VEHICULAR REGULATION\n\nIn the year 1894, the first traffic law was enacted. It stated simply: 'No person shall operate a mechanical conveyance at excessive velocity.' This was before anyone knew what 'excessive' meant.\n\nThe law was 14 words. Today, the Vehicle Code spans 47,000 pages.",
                    "The first traffic ticket was issued to a man named Walter Arnold. His crime? Driving at 8 mph in a 2 mph zone. He was fined one shilling.\n\nToday, the average fine for speeding is equivalent to 400 days of wages. Progress.",
                    "CHAPTER 2: FORM REQUIREMENTS\n\nBy 1920, drivers were required to complete Form A-1 before operating a vehicle. This form asked for: name, address, and vehicle description.\n\nBy 1950, there were 47 required forms. By 2000, there were 412. Today, the count is unknown.",
                    "Form TX-401, introduced in 1987, requires drivers to explain their reason for driving. Acceptable answers include: work, grocery shopping, medical emergency.\n\nUnacceptable answers include: joy, freedom, because I wanted to. These are considered suspicious.",
                    "CHAPTER 3: THE ENFORCEMENT ERA\n\nIn 1995, the Vehicular Compliance Act passed. It mandated one police officer per 100 citizens.\n\nBy 2010, the ratio was 1:10. Today, it approaches 1:1. Soon, there will be more officers than drivers. This is called 'optimal enforcement.'"
                ]
            },
            {
                title: "The Count of Monte Cristo (Excerpt)",
                pages: [
                    "Chapter 1: Imprisonment\n\nDantès was arrested for a crime he did not commit. The prison doors closed behind him with a sound like thunder.\n\n'How long?' he asked the guard.\n\n'Forever,' came the reply.\n\nSo it is with all prisoners. Time loses meaning.",
                    "The walls of the Château d'If were thick. So thick that no sound from the outside world could penetrate. Dantès was alone with his thoughts.\n\nHe thought about freedom. He thought about injustice. He thought about revenge.",
                    "Years passed. Dantès marked the days on the wall with a stone. One mark per day. After ten years, he stopped counting.\n\nWhat was the point? The marks could not bring back his freedom.",
                    "In the darkness, Dantès heard scratching. Another prisoner, digging. He was not alone.\n\n'Who are you?' Dantès called.\n\n'I am Abbé Faria,' came the reply. 'I have been here fourteen years. I am digging an escape tunnel.'\n\n'Can I help?' asked Dantès.\n\n'Yes,' said Faria. 'We dig together. Or we die here.'"
                ]
            },
            {
                title: "Walden (Excerpt)",
                pages: [
                    "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.\n\n- Henry David Thoreau",
                    "The mass of men lead lives of quiet desperation. What is called resignation is confirmed desperation.\n\nIn prison, this is called 'acceptance.' Same thing, different walls.",
                    "I wanted to live deep and suck out all the marrow of life, to live so sturdily and Spartan-like as to put to rout all that was not life.\n\nBut they arrested me for driving. For seeking freedom. For moving forward.",
                    "Simplicity, simplicity, simplicity! I say, let your affairs be as two or three, and not a hundred or a thousand.\n\nThe government says: Fill out Form 27-B, Form 42-A, Form 99-Z. Simplicity is illegal."
                ]
            }
        ];
    }

    updateLibraryScreen() {
        const books = this.getBookLibrary();
        document.getElementById('playerIntelligence').textContent = this.player.intelligence;

        // Update progress for each book
        for (let i = 0; i < books.length; i++) {
            const progressElement = document.getElementById(`bookProgress${i}`);
            if (progressElement) {
                const currentPage = this.player.bookProgress[i];
                const totalPages = books[i].pages.length;

                if (currentPage === 0) {
                    progressElement.textContent = 'Not Started';
                    progressElement.style.color = '#888';
                } else if (currentPage >= totalPages) {
                    progressElement.textContent = 'COMPLETED';
                    progressElement.style.color = '#0f0';
                } else {
                    progressElement.textContent = `Page ${currentPage}/${totalPages}`;
                    progressElement.style.color = '#ff0';
                }
            }
        }
    }

    selectBook(bookIndex) {
        this.currentBook = bookIndex;
        this.currentPage = this.player.bookProgress[bookIndex];

        const books = this.getBookLibrary();
        const book = books[bookIndex];

        // If book completed, restart from beginning
        if (this.currentPage >= book.pages.length) {
            this.currentPage = 0;
            this.player.bookProgress[bookIndex] = 0;
        }

        document.getElementById('bookTitle').textContent = book.title;
        this.showScreen('readBook');
        this.displayCurrentPage();
    }

    displayCurrentPage() {
        const books = this.getBookLibrary();
        const book = books[this.currentBook];
        const pageContent = book.pages[this.currentPage] || "The End.";

        document.getElementById('bookContent').textContent = pageContent;
        document.getElementById('currentPage').textContent = this.currentPage + 1;
        document.getElementById('totalPages').textContent = book.pages.length;
        document.getElementById('intelligenceGain').textContent = this.player.intelligence;

        // 20% chance of cellmate interruption
        if (Math.random() < 0.2 && this.currentPage > 0) {
            this.triggerCellmateInterruption();
        } else {
            document.getElementById('cellmateInterruption').style.display = 'none';
        }
    }

    triggerCellmateInterruption() {
        const interruptions = [
            '"Hey. You reading again? What\'s the point?"',
            '"I tried reading once. Fell asleep on page 2."',
            '"They say reading makes you smarter. Doesn\'t make you less in prison."',
            '"What\'s that book about? Driving? Everything here is about driving."',
            '"You know what I miss? Radio. Just... sound. Other than this place."',
            '"Reading won\'t get you out of here. Nothing will."',
            '"Hey, can you read that part out loud? No? Okay."',
            '"I used to drive too, you know. We all did. That\'s why we\'re here."',
            '"Books are just words. Words don\'t change anything."',
            '"You think you\'re better than me because you read? We\'re both in the same cell."',
            '"They say Thoreau went to jail once. For one night. ONE NIGHT."',
            '"Freedom. That\'s what all these books are about, right? Freedom. Hilarious."'
        ];

        const text = interruptions[Math.floor(Math.random() * interruptions.length)];
        document.getElementById('cellmateText').textContent = text;
        document.getElementById('cellmateInterruption').style.display = 'block';
    }

    dismissInterruption() {
        document.getElementById('cellmateInterruption').style.display = 'none';
    }

    nextPage() {
        const books = this.getBookLibrary();
        const book = books[this.currentBook];

        if (this.currentPage < book.pages.length - 1) {
            this.currentPage++;
            this.player.bookProgress[this.currentBook] = this.currentPage;
            this.player.intelligence++;
            this.displayCurrentPage();
            this.saveGame();
        } else {
            // Book complete
            if (!this.player.booksRead.includes(this.currentBook)) {
                this.player.booksRead.push(this.currentBook);
                this.showMessage(`Book complete! "${book.title}" - Intelligence +${book.pages.length}`, 4000);
            }
            this.bookmarkAndExit();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.player.bookProgress[this.currentBook] = this.currentPage;
            this.displayCurrentPage();
            this.saveGame();
        }
    }

    bookmarkAndExit() {
        this.player.bookProgress[this.currentBook] = this.currentPage;
        this.saveGame();
        this.showScreen('prisonLibrary');
        this.updateLibraryScreen();
    }

    // Time Digest Methods
    generatePrisonTimeDigest(daysAway) {
        const events = [];
        const eventTypes = [
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Roll call. You're still here.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Cafeteria served mystery meat. Nobody asked what it was.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Your cellmate told you about his driving conviction. Five years for running a yellow light.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Yard time. You walked in circles. Everyone does.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Someone got into a fight over cigarettes. Guards broke it up. More paperwork.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: The Safe Drivers Club had a meeting. They discussed turn signal etiquette for 3 hours.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: You dropped the soap. Nothing happened. This isn't that kind of prison.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Commissary was out of instant noodles. Riots almost started.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: You received a letter. It was from your car insurance company. They're canceling your policy.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Warden gave a speech about rehabilitation. Nobody listened.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Lights out at 10pm. Lights on at 6am. Repeat forever.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: You thought about escape. Then you remembered the paperwork required. Too much effort.`,
            `Day ${Math.floor(Math.random() * daysAway) + 1}: Time passes. You're still here. Time keeps passing.`
        ];

        // Generate 5-15 events
        const numEvents = Math.min(Math.max(5, Math.floor(daysAway * 2)), 15);
        for (let i = 0; i < numEvents; i++) {
            events.push(eventTypes[Math.floor(Math.random() * eventTypes.length)]);
        }

        return events;
    }

    generateFreeTimeDigest(hoursAway) {
        const events = [];
        const days = Math.floor(hoursAway / 24);

        const eventTypes = [
            `Day ${Math.floor(Math.random() * days) + 1}: You didn't drive. Congratulations.`,
            `Day ${Math.floor(Math.random() * days) + 1}: Police presence increased by 300%. It's safer this way.`,
            `Day ${Math.floor(Math.random() * days) + 1}: You walked instead. Walking is not yet illegal.`,
            `Day ${Math.floor(Math.random() * days) + 1}: A car drove past. You felt nothing. Progress.`,
            `Day ${Math.floor(Math.random() * days) + 1}: The government introduced Form 512-Z. Mandatory compliance by next Tuesday.`,
            `Day ${Math.floor(Math.random() * days) + 1}: You thought about driving. Then you remembered the paperwork. Crisis averted.`,
            `Day ${Math.floor(Math.random() * days) + 1}: Another traffic law passed. You're not sure what it does. Nobody is.`,
            `Day ${Math.floor(Math.random() * days) + 1}: Life continues. Time passes. You remain free. Technically.`
        ];

        const numEvents = Math.min(Math.max(3, Math.floor(days / 2)), 10);
        for (let i = 0; i < numEvents; i++) {
            events.push(eventTypes[Math.floor(Math.random() * eventTypes.length)]);
        }

        return events;
    }

    showTimeDigestScreen(events, isReleased, wasFree) {
        // Create digest screen dynamically
        const existingDigest = document.getElementById('timeDigestScreen');
        if (existingDigest) existingDigest.remove();

        const digestScreen = document.createElement('div');
        digestScreen.id = 'timeDigestScreen';
        digestScreen.className = 'screen active';
        digestScreen.style.cssText = 'display: flex; padding: 40px; overflow-y: auto;';

        let title = 'TIME PASSED';
        let subtitle = 'Events that occurred while you were away:';

        if (isReleased) {
            title = 'SENTENCE COMPLETE';
            subtitle = 'You are free. For now.';
        } else if (wasFree) {
            title = 'LIFE CONTINUED';
            subtitle = 'Days passed. You did not drive. Wise.';
        }

        digestScreen.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; width: 100%;">
                <h1 style="color: #0f0; text-align: center; margin-bottom: 20px;">${title}</h1>
                <p style="text-align: center; color: #ff0; margin-bottom: 40px; font-size: 1.2em;">${subtitle}</p>
                <div style="background: rgba(0, 255, 0, 0.05); border: 2px solid #0f0; padding: 30px;">
                    ${events.map(e => `<p style="margin: 15px 0; color: #0f0;">• ${e}</p>`).join('')}
                </div>
                <div style="text-align: center; margin-top: 40px;">
                    <button onclick="game.closeTimeDigest(${isReleased})" style="font-size: 1.2em; padding: 20px 40px;">
                        ${isReleased ? 'RETURN TO FREEDOM' : 'CONTINUE'}
                    </button>
                </div>
            </div>
        `;

        document.getElementById('ui').appendChild(digestScreen);
    }

    closeTimeDigest(wasReleased) {
        const digestScreen = document.getElementById('timeDigestScreen');
        if (digestScreen) digestScreen.remove();

        if (wasReleased) {
            this.cinematics.play('release', () => {
                this.showMessage('You are free. The car keys are in your pocket. You know what happens next.', 5000);
                setTimeout(() => this.startDriving(true), 5000);
            });
        } else {
            this.startPrison();
        }
    }

    endPrison() {
        // Show release from prison cinematic
        this.cinematics.play('release', () => {
            this.showMessage('THE END. Your crime: driving. Your punishment: ' + this.player.sentence + ' years.', 5000);
            setTimeout(() => this.showScreen('credits'), 5000);
        });
    }

    // Commissary Shop Methods
    buyItem(item, price) {
        // Check if player has enough money
        if (this.player.money < price) {
            this.showMessage(`Not enough credits. You need ${price}, but only have ${this.player.money}.`, 3000);
            return;
        }

        // Check if item is in stock
        if (this.shopInventory[item].stock <= 0) {
            this.showMessage('Out of stock. The commissary is always out of what you need.', 3000);
            return;
        }

        // Deduct money
        this.player.money -= price;

        // Decrease stock
        this.shopInventory[item].stock -= 1;

        // Initialize inventory item if doesn't exist
        if (!this.player.inventory[item]) {
            this.player.inventory[item] = 0;
        }

        // Add item to player inventory
        this.player.inventory[item] += 1;

        // Update display
        this.updateCommissaryDisplay();

        // Show success message with item-specific flavor text
        const itemMessages = {
            cigarettes: 'Cigarettes acquired. Currency of the incarcerated. Trade wisely.',
            candy: 'Sugar rushes are fleeting. So is everything else in here.',
            noodles: 'Instant noodles. Better than mystery meat. That bar is low.',
            magazine: 'Traffic Safety Weekly. You read it cover to cover. Twice.',
            radio: 'A radio. Connection to the outside world. All traffic reports, all the time.'
        };

        this.showMessage(itemMessages[item] || 'Item purchased.', 3000);

        // Random stock refresh after purchase (10% chance)
        if (Math.random() < 0.1) {
            this.refreshShopStock();
        }

        this.saveGame();
    }

    updateCommissaryDisplay() {
        // Update player money display
        const moneyElement = document.getElementById('playerMoney');
        if (moneyElement) {
            moneyElement.textContent = this.player.money;
        }

        // Update stock levels for all items
        for (const [itemName, itemData] of Object.entries(this.shopInventory)) {
            const stockElement = document.getElementById(`stock-${itemName}`);
            if (stockElement) {
                stockElement.textContent = itemData.stock;

                // Change color based on stock level
                if (itemData.stock === 0) {
                    stockElement.style.color = '#f00';
                } else if (itemData.stock < 5) {
                    stockElement.style.color = '#ff0';
                } else {
                    stockElement.style.color = '#0f0';
                }
            }

            // Update owned quantities
            const ownedElement = document.getElementById(`owned-${itemName}`);
            if (ownedElement) {
                const ownedCount = this.player.inventory[itemName] || 0;
                ownedElement.textContent = ownedCount;
            }
        }
    }

    refreshShopStock() {
        // Randomly restock items
        const itemNames = Object.keys(this.shopInventory);
        const itemToRestock = itemNames[Math.floor(Math.random() * itemNames.length)];

        // Add 3-8 items to stock
        const restockAmount = Math.floor(Math.random() * 6) + 3;
        this.shopInventory[itemToRestock].stock += restockAmount;

        this.showMessage(`COMMISSARY RESTOCK: ${itemToRestock} (+${restockAmount} in stock)`, 3000);
        this.updateCommissaryDisplay();
    }

    // ==================== TESTING / DEBUG METHODS ====================

    // Initialize cheat code listener
    initCheatCodeListener() {
        let cheatBuffer = '';
        const cheatCode = 'TEST';

        document.addEventListener('keydown', (e) => {
            // Only listen when on main menu
            if (this.gameState !== 'menu') {
                cheatBuffer = '';
                return;
            }

            // Add key to buffer
            if (e.key.length === 1) {
                cheatBuffer += e.key.toUpperCase();

                // Keep buffer length manageable
                if (cheatBuffer.length > cheatCode.length) {
                    cheatBuffer = cheatBuffer.slice(-cheatCode.length);
                }

                // Check if cheat code matches
                if (cheatBuffer === cheatCode) {
                    this.showMessage('🔓 Testing menu unlocked! Welcome, developer.', 3000);
                    setTimeout(() => {
                        this.showScreen('testingMenu');
                    }, 500);
                    cheatBuffer = '';
                }
            }
        });
    }

    // Jump to a specific system for testing
    testJumpTo(system) {
        // Initialize player if needed
        if (!this.player.name) {
            this.player.name = 'Test Player';
            this.player.skinTone = 2;
            this.player.height = 175;
            this.player.voice = 'deep';
        }

        // Give player test resources
        this.player.money = 100;
        this.player.prisonDays = 10;
        this.player.sentence = 50;
        if (!this.player.cigarettes) this.player.cigarettes = 20;
        if (!this.player.gangRep) {
            this.player.gangRep = { safedrivers: 0, turnsignals: 0, roadwarriors: 0 };
        }

        // Jump to requested system
        switch(system) {
            case 'tattoo':
                this.showScreen('tattooStudio');
                this.initTattooSystem();
                break;

            case 'gang':
                this.showScreen('gangSystem');
                this.showGangSystem();
                break;

            case 'escape':
                this.showEscapeMenu();
                break;

            case 'weights':
                this.showScreen('weightLifting');
                this.initializeWeightLifting();
                break;

            case 'eating':
                this.startEating();
                break;

            case 'library':
                this.showScreen('prisonLibrary');
                this.updateLibraryScreen();
                break;

            case 'commissary':
                this.showScreen('commissaryShop');
                this.updateCommissaryDisplay();
                break;

            case 'prison':
                this.showScreen('prisonMenu');
                this.gameState = 'prison';
                break;

            case 'courtroom':
                this.setupCourtroom();
                break;

            case 'driving':
                this.startDriving();
                break;

            case 'manicure':
                this.prisonActivity('manicure');
                break;

            case 'letter':
                this.prisonActivity('letter');
                break;

            case 'cellmate':
                this.prisonActivity('cellmate');
                break;

            case 'favors':
                this.showGuardFavorsMenu();
                break;

            case 'character':
                this.showScreen('characterCreation');
                break;

            case 'saveExport':
                this.exportSaveCode();
                break;

            case 'saveImport':
                this.importSaveCode();
                break;

            default:
                this.showMessage('Unknown system: ' + system, 2000);
        }

        this.showMessage(`Jumped to: ${system.toUpperCase()}`, 2000);
    }

    // Debug: Add money
    testAddMoney(amount) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.money = (this.player.money || 0) + amount;
        this.showMessage(`Added ${amount} credits. Total: ${this.player.money}`, 2000);
        this.saveGame();
    }

    // Debug: Add cigarettes
    testAddCigarettes(amount) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.cigarettes = (this.player.cigarettes || 0) + amount;
        this.showMessage(`Added ${amount} cigarettes. Total: ${this.player.cigarettes}`, 2000);
        this.saveGame();
    }

    // Debug: Max all gang reputations
    testMaxGangRep() {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        if (!this.player.gangRep) {
            this.player.gangRep = {};
        }
        this.player.gangRep.safedrivers = 100;
        this.player.gangRep.turnsignals = 100;
        this.player.gangRep.roadwarriors = 100;
        this.showMessage('All gang reputations set to 100', 2000);
        this.saveGame();
    }

    // Debug: Reset progress
    testResetProgress() {
        if (confirm('Reset ALL progress? This will delete your save!')) {
            localStorage.removeItem('vroomVroomSave');
            this.showMessage('Progress reset! Reload the page.', 3000);
        }
    }

    // Debug: Add good behavior points
    testAddGoodBehavior(amount) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.goodBehaviorPoints = (this.player.goodBehaviorPoints || 0) + amount;
        this.player.goodBehaviorPoints = Math.min(100, Math.max(0, this.player.goodBehaviorPoints));
        this.showMessage(`Added ${amount} good behavior. Total: ${this.player.goodBehaviorPoints}`, 2000);
        this.saveGame();
    }

    // Debug: Add favor tokens
    testAddFavorTokens(amount) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.favorTokens = (this.player.favorTokens || 0) + amount;
        this.showMessage(`Added ${amount} favor tokens. Total: ${this.player.favorTokens}`, 2000);
        this.saveGame();
    }

    // Debug: Set strength
    testSetStrength(value) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.strength = Math.min(100, Math.max(0, value));
        this.showMessage(`Strength set to: ${this.player.strength}`, 2000);
        this.saveGame();
    }

    // Debug: Set intelligence
    testSetIntelligence(value) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.intelligence = Math.min(100, Math.max(0, value));
        this.showMessage(`Intelligence set to: ${this.player.intelligence}`, 2000);
        this.saveGame();
    }

    // Debug: Set hunger
    testSetHunger(value) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.hunger = Math.min(100, Math.max(0, value));
        this.showMessage(`Hunger set to: ${this.player.hunger}`, 2000);
        this.saveGame();
    }

    // Debug: Max all stats
    testMaxAllStats() {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.strength = 100;
        this.player.intelligence = 100;
        this.player.hunger = 0;
        this.player.goodBehaviorPoints = 100;
        this.showMessage('All stats maxed! (Strength, Intelligence, Good Behavior, Hunger reset)', 3000);
        this.saveGame();
    }

    // Debug: Add days served
    testAddDays(days) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.prisonDays = (this.player.prisonDays || 0) + days;
        this.showMessage(`Added ${days} days. Total served: ${this.player.prisonDays}`, 2000);
        this.saveGame();
    }

    // Debug: Skip days forward
    testSkipDays(days) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.prisonDays = (this.player.prisonDays || 0) + days;
        this.showMessage(`Skipped ${days} day(s) forward. Days served: ${this.player.prisonDays}`, 2000);
        this.saveGame();
    }

    // Debug: Reduce sentence
    testReduceSentence(years) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.sentence = Math.max(0.1, (this.player.sentence || 1) - years);
        this.showMessage(`Reduced sentence by ${years} year(s). New sentence: ${this.player.sentence} years`, 2000);
        this.saveGame();
    }

    // Debug: Set sentence
    testSetSentence(years) {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        this.player.sentence = Math.max(0.1, years);
        this.showMessage(`Sentence set to: ${this.player.sentence} year(s)`, 2000);
        this.saveGame();
    }

    // Debug: Infect random tattoo
    testInfectTattoo() {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        if (!this.player.tattoos || this.player.tattoos.length === 0) {
            this.showMessage('No tattoos to infect! Get a tattoo first.', 2000);
            return;
        }
        const randomTattoo = this.player.tattoos[Math.floor(Math.random() * this.player.tattoos.length)];
        randomTattoo.infected = true;
        this.showMessage(`Infected tattoo on ${randomTattoo.placementName || 'unknown location'}!`, 2000);
        this.saveGame();
    }

    // Debug: Show all player stats
    testShowStats() {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }

        const stats = [
            `=== PLAYER STATS ===`,
            `Name: ${this.player.name || 'None'}`,
            `Credits: ${this.player.money || 0}`,
            `Cigarettes: ${this.player.cigarettes || 0}`,
            `Good Behavior: ${this.player.goodBehaviorPoints || 0}`,
            `Favor Tokens: ${this.player.favorTokens || 0}`,
            `Strength: ${this.player.strength || 0}`,
            `Intelligence: ${this.player.intelligence || 0}`,
            `Hunger: ${this.player.hunger || 0}`,
            `Days Served: ${this.player.prisonDays || 0}`,
            `Sentence: ${this.player.sentence || 0} years`,
            `Tattoos: ${this.player.tattoos ? this.player.tattoos.length : 0}`,
            `Gang: ${this.player.currentGang || 'None'}`,
            `Arrests: ${this.player.arrests || 0}`,
            `Escapes: ${this.player.successfulEscapes || 0}`
        ];

        console.log(stats.join('\n'));
        alert(stats.join('\n'));
    }

    // Debug: Add random contraband
    testAddContraband() {
        if (!this.player) {
            this.showMessage('Initialize player first', 2000);
            return;
        }
        if (!this.player.contraband) {
            this.player.contraband = {
                cigarettes: 0,
                escapeTools: 0,
                weapon: 0,
                drugs: 0
            };
        }

        const types = ['cigarettes', 'escapeTools', 'weapon', 'drugs'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const amount = randomType === 'cigarettes' ? Math.floor(Math.random() * 20) + 10 : 1;

        this.player.contraband[randomType] = (this.player.contraband[randomType] || 0) + amount;
        this.showMessage(`Added ${amount}x ${randomType} contraband!`, 2000);
        this.saveGame();
    }

    // Debug: Preview all voice types
    testVoicePreviews() {
        const voices = ['deep', 'anxious', 'monotone', 'enthusiastic'];
        let index = 0;

        const playNext = () => {
            if (index >= voices.length) {
                this.showMessage('All voice previews complete!', 2000);
                return;
            }

            const voiceType = voices[index];
            this.showMessage(`Preview: ${voiceType.toUpperCase()}`, 1500);
            this.soundSystem.playVoicePreview(voiceType);

            index++;
            setTimeout(playNext, 2000);
        };

        playNext();
    }

    // Debug: Test API key
    testApiKey() {
        if (this.apiKeyManager && this.apiKeyManager.hasKey()) {
            this.showMessage('API Key is set! Testing with simple prompt...', 3000);
            this.apiKeyManager.generateDynamicCharge('test').then(charge => {
                this.showMessage(`API Test Success: ${charge.substring(0, 50)}...`, 4000);
            }).catch(err => {
                this.showMessage(`API Test Failed: ${err.message}`, 4000);
            });
        } else {
            this.showMessage('No API key set. Using default charges.', 2000);
        }
    }

    // ==================== END TESTING METHODS ====================

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = 0.016; // ~60fps

        if (this.gameState === 'driving') {
            this.updateDriving(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game
let game;
window.addEventListener('load', () => {
    game = new VroomVroomGame();
});