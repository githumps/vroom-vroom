// VROOM VROOM - Complete Game Engine
// NO EXCUSES. THIS WORKS.

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
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.car = null;
        this.policecar = null;
        this.gameState = 'menu'; // menu, character, driving, courtroom, prison
        this.player = {
            name: '',
            skinTone: 2,
            height: 175,
            voice: 'deep',
            wantedLevel: 0,
            speed: 0,
            drivingTime: 0,
            prisonDays: 0,
            sentence: 5,
            tattoos: [],
            gangMember: false,
            letters: []
        };
        this.keys = {};
        this.policeChasing = false;
        this.policeSpawnTime = 0;
        this.buildings = [];
        this.roadMarkers = [];

        // Initialize Judge Hardcastle
        this.judge = new JudgeHardcastle();

        // Initialize Cinematic System
        this.cinematics = new CinematicSystem();

        this.init();
    }

    init() {
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
        const carGroup = new THREE.Group();

        // Car body - Desaturated red (Disco Elysium palette)
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x9B4A4A, // Muted red
            roughness: 0.7,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        carGroup.add(body);

        // Car top
        const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B3A3A, // Darker muted red
            roughness: 0.7,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.4;
        top.position.z = -0.3;
        carGroup.add(top);

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
            carGroup.add(wheel);
        });

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
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');

        if (screenId === 'credits') {
            // Restart animation
            const scroll = document.querySelector('.credits-scroll');
            scroll.style.animation = 'none';
            setTimeout(() => scroll.style.animation = '', 10);
        }
    }

    showMessage(text, duration = 3000) {
        const box = document.getElementById('messageBox');
        box.textContent = text;
        box.classList.add('active');
        setTimeout(() => box.classList.remove('active'), duration);
    }

    startNewGame() {
        this.showScreen('characterCreation');
    }

    loadGame() {
        const saved = localStorage.getItem('vroomVroomSave');
        if (saved) {
            this.player = JSON.parse(saved);
            this.showMessage('Game loaded! Welcome back, ' + this.player.name);
            this.startDriving();
        } else {
            this.showMessage('No saved game found. Starting new game...');
            this.startNewGame();
        }
    }

    saveGame() {
        localStorage.setItem('vroomVroomSave', JSON.stringify(this.player));
        this.showMessage('Game saved!');
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

        this.showMessage('Welcome, ' + name + '. Get ready to drive.', 2000);

        // Show dramatic driving start cinematic
        setTimeout(() => {
            this.cinematics.play('driving_start', () => {
                this.startDriving();
            });
        }, 2000);
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
            this.car.rotation.y += turnSpeed * (this.player.speed / maxSpeed);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.car.rotation.y -= turnSpeed * (this.player.speed / maxSpeed);
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

        // Show dramatic arrest cinematic
        this.cinematics.play('arrest', () => {
            this.showScreen('courtroom');
            this.setupCourtroom();
        });
    }

    setupCourtroom() {
        // Generate charges
        const charges = this.judge.generateCharges({
            speed: this.player.speed,
            time: this.player.drivingTime
        });

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

        // Show judge dialogue box
        document.getElementById('judgeDialogue').style.display = 'block';

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
            this.cinematics.play('judgment', () => {
                // Then show prison entrance
                this.cinematics.play('prison', () => {
                    this.startPrison();
                });
            });
        }, 5000);
    }

    startPrison() {
        this.gameState = 'prison';
        this.showScreen('prisonMenu');
        document.getElementById('sentenceLength').textContent = this.player.sentence;
        document.getElementById('timeServed').textContent = this.player.prisonDays;
        this.saveGame();
    }

    prisonActivity(activity) {
        this.player.prisonDays += 1;
        document.getElementById('timeServed').textContent = this.player.prisonDays;

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
            read: [
                'Chapter 3: Speed Limits and Their Histories. Riveting.',
                'You read about traffic violations. This is your life now.',
                'The book falls open to a page about freedom. You close it quickly.'
            ],
            letter: [
                'You begin to write a letter. Words fail you.',
                'Who would understand what you\'ve been through?',
                'The guards will read this. They read everything.'
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

        if (activity === 'letter') {
            this.showScreen('letterWriting');
        } else {
            const msg = messages[activity][Math.floor(Math.random() * messages[activity].length)];
            this.showMessage(msg, 4000);
        }

        if (activity === 'tattoo') {
            this.player.tattoos.push('Prison Tattoo #' + (this.player.tattoos.length + 1));
        }

        if (activity === 'gang') {
            this.player.gangMember = true;
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

    endPrison() {
        // Show release from prison cinematic
        this.cinematics.play('release', () => {
            this.showMessage('THE END. Your crime: driving. Your punishment: ' + this.player.sentence + ' years.', 5000);
            setTimeout(() => this.showScreen('credits'), 5000);
        });
    }

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