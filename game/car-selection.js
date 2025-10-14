// CAR SELECTION AND CUSTOMIZATION SYSTEM
// Disco Elysium-inspired "shitty car" aesthetics
// Simple geometry, muted colors, painterly style

// CAR GEOMETRY DEFINITIONS
// Each car has distinct proportions but simple box-based geometry
class CarGeometry {
    static getCarModels() {
        return {
            beater: {
                name: 'The Beater',
                description: 'Beat-up sedan. Wide, low, barely functional.',
                bodyDimensions: [2.2, 0.9, 4.2],      // Wide sedan
                topDimensions: [2.0, 0.7, 2.0],
                topOffset: [0, 1.35, -0.2],
                wheelRadius: 0.38,
                wheelWidth: 0.3,
                wheelPositions: [
                    [-1.1, 0, 1.4],
                    [1.1, 0, 1.4],
                    [-1.1, 0, -1.4],
                    [1.1, 0, -1.4]
                ]
            },
            box: {
                name: 'The Box',
                description: 'Boxy van/wagon. Tall, square, utilitarian.',
                bodyDimensions: [2.0, 1.4, 3.8],      // Tall box
                topDimensions: [1.9, 0.9, 2.5],
                topOffset: [0, 1.65, -0.1],
                wheelRadius: 0.42,
                wheelWidth: 0.35,
                wheelPositions: [
                    [-1.0, 0, 1.3],
                    [1.0, 0, 1.3],
                    [-1.0, 0, -1.3],
                    [1.0, 0, -1.3]
                ]
            },
            clunker: {
                name: 'The Clunker',
                description: 'Compact hatchback. Small, round, pitiful.',
                bodyDimensions: [1.8, 0.8, 3.2],      // Small compact
                topDimensions: [1.7, 0.75, 1.8],
                topOffset: [0, 1.2, -0.15],
                wheelRadius: 0.35,
                wheelWidth: 0.28,
                wheelPositions: [
                    [-0.95, 0, 1.1],
                    [0.95, 0, 1.1],
                    [-0.95, 0, -1.1],
                    [0.95, 0, -1.1]
                ]
            },
            rustbucket: {
                name: 'The Rust Bucket',
                description: 'Pickup truck. Long bed, flat, depressing.',
                bodyDimensions: [2.1, 0.85, 3.0],     // Truck cabin
                topDimensions: [1.85, 0.7, 1.5],
                topOffset: [0, 1.3, 0.5],              // Cabin forward
                // Add truck bed
                bedDimensions: [2.0, 0.6, 2.0],
                bedOffset: [0, 0.8, -1.5],
                wheelRadius: 0.40,
                wheelWidth: 0.32,
                wheelPositions: [
                    [-1.05, 0, 1.2],
                    [1.05, 0, 1.2],
                    [-1.05, 0, -1.8],
                    [1.05, 0, -1.8]
                ]
            }
        };
    }

    // Generate Three.js mesh for a car model
    static createCarMesh(modelName, color) {
        const models = this.getCarModels();
        const model = models[modelName];

        if (!model) {
            console.error(`Car model "${modelName}" not found`);
            return null;
        }

        const carGroup = new THREE.Group();

        // Create materials with slightly different shades for depth
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.75,
            metalness: 0.25
        });

        // Top is slightly darker for painterly effect
        const topColor = this.darkenColor(color, 0.85);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: topColor,
            roughness: 0.75,
            metalness: 0.25
        });

        // Car body
        const bodyGeometry = new THREE.BoxGeometry(...model.bodyDimensions);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = model.bodyDimensions[1] / 2;
        carGroup.add(body);

        // Car top (cabin/roof)
        const topGeometry = new THREE.BoxGeometry(...model.topDimensions);
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.set(...model.topOffset);
        carGroup.add(top);

        // Truck bed (only for rustbucket)
        if (model.bedDimensions) {
            const bedGeometry = new THREE.BoxGeometry(...model.bedDimensions);
            const bedMaterial = new THREE.MeshStandardMaterial({
                color: this.darkenColor(color, 0.7),
                roughness: 0.8,
                metalness: 0.15
            });
            const bed = new THREE.Mesh(bedGeometry, bedMaterial);
            bed.position.set(...model.bedOffset);
            carGroup.add(bed);
        }

        // Wheels (always black)
        const wheelGeometry = new THREE.CylinderGeometry(
            model.wheelRadius,
            model.wheelRadius,
            model.wheelWidth,
            16
        );
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x1A1A1A,
            roughness: 0.9,
            metalness: 0.1
        });

        model.wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            carGroup.add(wheel);
        });

        // Rotate car 180 degrees to face correct direction
        carGroup.rotation.y = Math.PI;

        return carGroup;
    }

    // Helper to darken a color for painterly depth
    static darkenColor(color, factor) {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;

        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);

        return (newR << 16) | (newG << 8) | newB;
    }
}

// CAR PREVIEW RENDERER
// 3D rotating preview of selected car
class CarPreviewRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas "${canvasId}" not found`);
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.carMesh = null;
        this.animationId = null;
        this.rotationSpeed = 0.005; // Slow rotation

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Camera - isometric-ish angle
        const aspect = this.canvas.width / this.canvas.height;
        this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000);
        this.camera.position.set(8, 6, 8);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Lighting - Disco Elysium style (soft, painterly)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.5);
        mainLight.position.set(5, 10, 5);
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x8B9DC3, 0.3); // Disco blue tint
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);

        // Ground plane for context
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1A1A1A,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        this.scene.add(ground);

        // Start animation
        this.animate();
    }

    // Update car model and color
    updateCar(modelName, color) {
        // Remove existing car
        if (this.carMesh) {
            this.scene.remove(this.carMesh);
            this.carMesh = null;
        }

        // Create new car
        this.carMesh = CarGeometry.createCarMesh(modelName, color);
        if (this.carMesh) {
            this.carMesh.position.set(0, 0.2, 0);
            this.scene.add(this.carMesh);
        }
    }

    // Animation loop - slow rotation
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.carMesh) {
            this.carMesh.rotation.y += this.rotationSpeed;
        }

        this.renderer.render(this.scene, this.camera);
    }

    // Clean up
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// COLOR PALETTE - Disco Elysium muted colors
class ColorPalette {
    static getColors() {
        return {
            rustbrown: { hex: 0x8B7355, name: 'Rust Brown', desc: 'Oxidized. Forgotten.' },
            militarygreen: { hex: 0x5A6B4A, name: 'Military Green', desc: 'Utilitarian. Depressing.' },
            dullgrey: { hex: 0x6B6B6B, name: 'Dull Grey', desc: 'Bureaucratic. Soulless.' },
            fadedblue: { hex: 0x4A5A6B, name: 'Faded Blue', desc: 'Once bright. No more.' },
            primergrey: { hex: 0x7A7A7A, name: 'Primer Grey', desc: 'Unfinished. Always.' },
            oxidizedred: { hex: 0x8B4A4A, name: 'Oxidized Red', desc: 'Rust with ambition.' },
            muddyyellow: { hex: 0x8B8B4A, name: 'Muddy Yellow', desc: 'Jaundiced hope.' },
            sickgreen: { hex: 0x4A6B4A, name: 'Sick Green', desc: 'Nauseous optimism.' },
            asphaltblack: { hex: 0x2A2A2A, name: 'Asphalt Black', desc: 'The road. The void.' },
            dingewhite: { hex: 0x9B9B9B, name: 'Dinge White', desc: 'Clean once. Never again.' }
        };
    }

    static getColorKeys() {
        return Object.keys(this.getColors());
    }

    static getColorHex(key) {
        return this.getColors()[key]?.hex || 0x888888;
    }
}
