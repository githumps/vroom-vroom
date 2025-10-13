// VROOM VROOM - Complete Game Engine
// NO EXCUSES. THIS WORKS.

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

        this.init();
    }

    init() {
        // Setup Three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('gameCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB);

        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 500);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        this.scene.add(directionalLight);

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
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Road
        const roadGeometry = new THREE.PlaneGeometry(10, 1000);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.y = 0.01;
        this.scene.add(road);

        // Road markers
        for (let i = -500; i < 500; i += 20) {
            const markerGeometry = new THREE.PlaneGeometry(0.5, 5);
            const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.rotation.x = -Math.PI / 2;
            marker.position.set(0, 0.02, i);
            this.scene.add(marker);
            this.roadMarkers.push(marker);
        }

        // Buildings (over-policed city aesthetic)
        for (let i = 0; i < 50; i++) {
            const height = Math.random() * 30 + 10;
            const buildingGeometry = new THREE.BoxGeometry(
                Math.random() * 8 + 5,
                height,
                Math.random() * 8 + 5
            );
            const buildingMaterial = new THREE.MeshStandardMaterial({
                color: Math.random() > 0.5 ? 0x555555 : 0x777777
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

        // Car body
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        carGroup.add(body);

        // Car top
        const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const topMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
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

        // Police car body (blue and white)
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        policeGroup.add(body);

        // Police car top
        const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const topMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.4;
        top.position.z = -0.3;
        policeGroup.add(top);

        // Lights (the most important part)
        const lightGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
        const redLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 2
        }));
        redLight.position.set(-0.3, 1.9, -0.3);
        policeGroup.add(redLight);

        const blueLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
            color: 0x0000FF,
            emissive: 0x0000FF,
            emissiveIntensity: 2
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
        this.camera.aspect = window.innerWidth / window.innerHeight;
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
        setTimeout(() => this.startDriving(), 2000);
    }

    startDriving() {
        this.gameState = 'driving';
        this.showScreen('mainMenu');
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

        this.showMessage('You are now driving. The police are watching. They are always watching.', 4000);
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

        // Camera follow
        const cameraOffset = new THREE.Vector3(0, 5, 10);
        cameraOffset.applyQuaternion(this.car.quaternion);
        this.camera.position.copy(this.car.position).add(cameraOffset);
        this.camera.lookAt(this.car.position);

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
        this.showScreen('courtroom');
        this.saveGame();
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
            this.showMessage('INCOMPLETE PAPERWORK. All forms must be filled completely.', 4000);
            return;
        }

        // Calculate sentence based on driving time and forms
        const baseSentence = Math.floor(this.player.drivingTime / 10);
        const sentenceYears = Math.max(1, baseSentence);
        this.player.sentence = sentenceYears;
        this.player.prisonDays = 0;

        this.showMessage('GUILTY. Sentence: ' + sentenceYears + ' years. Welcome to prison.', 4000);
        setTimeout(() => this.startPrison(), 4000);
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
                'The Safe Drivers Club accepts you. You attend meetings on Thursdays.',
                'Your gang discusses proper turn signal usage. It\'s very serious.',
                'You are now part of something bigger: organized safe driving.'
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

        // Check if sentence complete
        if (this.player.prisonDays >= this.player.sentence * 365) {
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
        this.showMessage('You have served your time. You are free. Do not drive.', 5000);
        setTimeout(() => {
            this.showMessage('THE END. Your crime: driving. Your punishment: ' + this.player.sentence + ' years.', 5000);
            setTimeout(() => this.showScreen('credits'), 5000);
        }, 5000);
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