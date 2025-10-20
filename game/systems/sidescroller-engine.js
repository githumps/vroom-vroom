// VROOM VROOM - Sidescroller Engine
// Replaces Three.js 3D driving with 2D pixel art sidescroller
// Maintains all game mechanics while providing smooth 60 FPS sidescrolling

class SidescrollerEngine {
    constructor(canvasId = 'gameCanvas', game) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        this.game = game; // Reference to main game object

        // Canvas setup
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Camera (follows player car)
        this.camera = {
            x: 0,               // World position
            y: 0,
            targetX: 0,
            targetY: 0,
            followSpeed: 0.1,   // Smooth lerp
            shakeDuration: 0,   // Screen shake timer
            shakeIntensity: 0,
        };

        // World settings
        this.world = {
            gravity: 0.5,       // Pixels per frame
            groundY: this.height * 0.7, // Ground level
            width: 10000,       // Infinite scrolling (wraps around)
        };

        // Parallax background layers
        this.backgroundLayers = [
            { scrollSpeed: 0.1, y: 0, color: '#8B9DC3' },      // Sky (Disco Elysium blue)
            { scrollSpeed: 0.3, y: 50, color: '#6A7A8A' },     // Distant buildings
            { scrollSpeed: 0.5, y: 150, color: '#5A6A7A' },    // Mid buildings
            { scrollSpeed: 0.7, y: 250, color: '#4A5A6A' },    // Near buildings
        ];

        // Player car (replaces Three.js mesh)
        this.playerCar = {
            x: this.width * 0.3,    // Screen position (stays relatively fixed)
            y: this.world.groundY - 40,
            worldX: 0,              // World position (accumulates)
            velocityX: 0,
            velocityY: 0,
            width: 48,
            height: 32,
            grounded: true,
            speed: 0,               // Current speed (0-50)
            rotation: 0,            // For visual tilt
            sprite: null,           // Will load from sprite generator
        };

        // Police car
        this.policeCar = {
            x: -200,                // Offscreen initially
            y: this.world.groundY - 40,
            worldX: 0,
            velocityX: 0,
            velocityY: 0,
            width: 48,
            height: 32,
            grounded: true,
            speed: 0,
            active: false,
            sprite: null,
            flashingLights: false,
            flashTimer: 0,
        };

        // Road/environment tiles
        this.roadTiles = [];
        this.buildingTiles = [];
        this.generateInitialWorld();

        // Particle effects
        this.particles = [];

        // Animation state
        this.animationTime = 0;
        this.running = false;

        // Performance tracking
        this.stats = {
            fps: 60,
            drawCalls: 0,
            particleCount: 0,
        };

        console.log('[SidescrollerEngine] Initialized - Canvas 2D sidescroller ready');
    }

    // === INITIALIZATION ===

    generateInitialWorld() {
        // Generate road tiles (repeating pattern)
        const roadTileWidth = 64;
        const tilesNeeded = Math.ceil(this.width / roadTileWidth) + 5;

        for (let i = 0; i < tilesNeeded; i++) {
            this.roadTiles.push({
                x: i * roadTileWidth,
                y: this.world.groundY,
                width: roadTileWidth,
                height: this.height - this.world.groundY,
                type: 'asphalt',
            });
        }

        // Generate random buildings for parallax effect
        const buildingCount = 20;
        for (let i = 0; i < buildingCount; i++) {
            this.buildingTiles.push({
                x: Math.random() * this.world.width,
                y: Math.random() * 200 + 50,
                width: Math.random() * 100 + 50,
                height: Math.random() * 150 + 100,
                color: this.randomBuildingColor(),
                layer: Math.floor(Math.random() * 3), // 0, 1, 2 (far to near)
            });
        }
    }

    randomBuildingColor() {
        const colors = ['#5A5A5A', '#6A6A6A', '#4A4A4A', '#7A7A7A', '#3A3A3A'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // === GAME LOOP ===

    start() {
        this.running = true;
        this.animationTime = 0;
        console.log('[SidescrollerEngine] Started - entering game loop');
    }

    stop() {
        this.running = false;
        console.log('[SidescrollerEngine] Stopped');
    }

    // Main update function (called every frame)
    update(delta) {
        if (!this.running) return;

        this.animationTime += delta;
        this.stats.drawCalls = 0;

        // Update physics
        this.updatePlayerPhysics(delta);
        this.updatePolicePhysics(delta);

        // Update camera
        this.updateCamera(delta);

        // Update particles
        this.updateParticles(delta);

        // Update police car AI
        if (this.policeCar.active) {
            this.updatePoliceAI(delta);
        }

        // Update screen shake
        if (this.camera.shakeDuration > 0) {
            this.camera.shakeDuration -= delta;
        }
    }

    // Main render function (called every frame)
    render() {
        if (!this.running) return;

        // Clear canvas
        this.ctx.fillStyle = '#8B9DC3'; // Disco Elysium sky
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Apply screen shake
        this.ctx.save();
        if (this.camera.shakeDuration > 0) {
            const shakeX = (Math.random() - 0.5) * this.camera.shakeIntensity;
            const shakeY = (Math.random() - 0.5) * this.camera.shakeIntensity;
            this.ctx.translate(shakeX, shakeY);
        }

        // Render parallax backgrounds
        this.renderParallaxBackgrounds();

        // Render road
        this.renderRoad();

        // Render player car
        this.renderPlayerCar();

        // Render police car
        if (this.policeCar.active) {
            this.renderPoliceCar();
        }

        // Render particles (dust, smoke)
        this.renderParticles();

        // Render debug info (if needed)
        if (this.game.devMode) {
            this.renderDebugInfo();
        }

        this.ctx.restore();
        this.stats.drawCalls++;
    }

    // === PHYSICS ===

    updatePlayerPhysics(delta) {
        // Horizontal acceleration
        const acceleration = 0.5;
        const deceleration = 0.3;
        const maxSpeed = 50;

        // Apply horizontal input (from game.keys)
        if (this.game.keys['w'] || this.game.keys['arrowup']) {
            this.playerCar.speed = Math.min(this.playerCar.speed + acceleration, maxSpeed);
        } else {
            this.playerCar.speed = Math.max(this.playerCar.speed - deceleration, 0);
        }

        // Update velocity
        this.playerCar.velocityX = this.playerCar.speed;

        // Apply gravity (if not grounded)
        if (!this.playerCar.grounded) {
            this.playerCar.velocityY += this.world.gravity;
        }

        // Update world position (accumulate distance traveled)
        this.playerCar.worldX += this.playerCar.velocityX * delta;
        this.playerCar.y += this.playerCar.velocityY * delta;

        // Ground collision
        if (this.playerCar.y >= this.world.groundY - 40) {
            this.playerCar.y = this.world.groundY - 40;
            this.playerCar.velocityY = 0;
            this.playerCar.grounded = true;
        } else {
            this.playerCar.grounded = false;
        }

        // Visual tilt based on acceleration
        const targetRotation = (this.playerCar.speed - 25) * 0.02; // Subtle tilt forward
        this.playerCar.rotation += (targetRotation - this.playerCar.rotation) * 0.1;

        // Spawn dust particles when driving
        if (this.playerCar.speed > 5 && Math.random() < 0.3) {
            this.spawnDustParticle(this.playerCar.x, this.playerCar.y + 20);
        }
    }

    updatePolicePhysics(delta) {
        if (!this.policeCar.active) return;

        // Police AI speed (always faster than player)
        const policeSpeed = this.playerCar.speed + 5;
        this.policeCar.speed = policeSpeed;
        this.policeCar.velocityX = policeSpeed;

        // Update world position (chasing player)
        this.policeCar.worldX += this.policeCar.velocityX * delta;

        // Keep police on ground
        this.policeCar.y = this.world.groundY - 40;
        this.policeCar.grounded = true;

        // Update screen position relative to camera
        const relativeX = this.policeCar.worldX - this.playerCar.worldX;
        this.policeCar.x = this.playerCar.x + relativeX;

        // Flashing police lights
        this.policeCar.flashTimer += delta;
        if (this.policeCar.flashTimer > 0.5) {
            this.policeCar.flashingLights = !this.policeCar.flashingLights;
            this.policeCar.flashTimer = 0;
        }

        // Spawn smoke particles
        if (Math.random() < 0.2) {
            this.spawnSmokeParticle(this.policeCar.x, this.policeCar.y + 20);
        }
    }

    updatePoliceAI(delta) {
        // Police car chases player (closes gap)
        const distance = this.playerCar.worldX - this.policeCar.worldX;

        // Check if caught
        if (distance < 50 && this.policeCar.x > this.playerCar.x - 100) {
            // Trigger arrest
            this.triggerArrest();
        }
    }

    // === CAMERA ===

    updateCamera(delta) {
        // Camera follows player's world position
        this.camera.targetX = this.playerCar.worldX - this.width * 0.3;
        this.camera.targetY = 0; // Fixed Y position

        // Smooth lerp
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.followSpeed;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.followSpeed;
    }

    screenShake(intensity = 5, duration = 0.2) {
        this.camera.shakeIntensity = intensity;
        this.camera.shakeDuration = duration;
    }

    // === RENDERING ===

    renderParallaxBackgrounds() {
        this.backgroundLayers.forEach((layer, index) => {
            // Calculate parallax offset
            const parallaxX = this.camera.x * layer.scrollSpeed;
            const offsetX = -parallaxX % this.width;

            // Draw building silhouettes
            this.buildingTiles
                .filter(b => b.layer === index)
                .forEach(building => {
                    const screenX = building.x - parallaxX;
                    if (screenX > -building.width - 100 && screenX < this.width + 100) {
                        this.ctx.fillStyle = building.color;
                        this.ctx.fillRect(
                            screenX,
                            building.y,
                            building.width,
                            building.height
                        );
                    }
                });
        });
    }

    renderRoad() {
        // Draw ground (muted brown/gray)
        this.ctx.fillStyle = '#5A5A4A';
        this.ctx.fillRect(0, this.world.groundY, this.width, this.height - this.world.groundY);

        // Draw road tiles
        this.roadTiles.forEach(tile => {
            const screenX = tile.x - this.camera.x;

            // Wrap tiles around (infinite scrolling)
            let wrappedX = screenX % (this.width + 200);
            if (wrappedX < -tile.width) wrappedX += this.width + 200;

            // Draw asphalt
            this.ctx.fillStyle = '#3A3A3A';
            this.ctx.fillRect(wrappedX, tile.y, tile.width, tile.height);

            // Draw center line (dashed yellow)
            this.ctx.strokeStyle = '#9A9A4A';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([10, 10]);
            this.ctx.beginPath();
            this.ctx.moveTo(wrappedX, this.world.groundY + 30);
            this.ctx.lineTo(wrappedX + tile.width, this.world.groundY + 30);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }

    renderPlayerCar() {
        // Simple placeholder rectangle (will be replaced by sprite)
        this.ctx.save();
        this.ctx.translate(this.playerCar.x, this.playerCar.y);
        this.ctx.rotate(this.playerCar.rotation);

        // Car body (use selected car color)
        const carColor = this.game.player.selectedCar?.color || '#8B3A3A';
        this.ctx.fillStyle = carColor;
        this.ctx.fillRect(-24, -16, 48, 32);

        // Car windows
        this.ctx.fillStyle = '#2A2A2E';
        this.ctx.fillRect(-18, -12, 12, 24);
        this.ctx.fillRect(6, -12, 12, 24);

        // Car wheels
        this.ctx.fillStyle = '#1A1A1A';
        this.ctx.fillRect(-20, -18, 8, 6);
        this.ctx.fillRect(-20, 12, 8, 6);
        this.ctx.fillRect(12, -18, 8, 6);
        this.ctx.fillRect(12, 12, 8, 6);

        this.ctx.restore();
    }

    renderPoliceCar() {
        // Simple placeholder rectangle (will be replaced by sprite)
        this.ctx.save();
        this.ctx.translate(this.policeCar.x, this.policeCar.y);

        // Police car body (blue)
        this.ctx.fillStyle = '#3A5A7A';
        this.ctx.fillRect(-24, -16, 48, 32);

        // Police car windows
        this.ctx.fillStyle = '#2A2A2E';
        this.ctx.fillRect(-18, -12, 12, 24);
        this.ctx.fillRect(6, -12, 12, 24);

        // Flashing lights (red/blue)
        if (this.policeCar.flashingLights) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(-10, -20, 8, 4);
            this.ctx.fillStyle = '#0000FF';
            this.ctx.fillRect(2, -20, 8, 4);
        }

        // Police car wheels
        this.ctx.fillStyle = '#1A1A1A';
        this.ctx.fillRect(-20, -18, 8, 6);
        this.ctx.fillRect(-20, 12, 8, 6);
        this.ctx.fillRect(12, -18, 8, 6);
        this.ctx.fillRect(12, 12, 8, 6);

        this.ctx.restore();
    }

    // === PARTICLES ===

    spawnDustParticle(x, y) {
        this.particles.push({
            x: x - 10,
            y: y,
            velocityX: -Math.random() * 2 - 1,
            velocityY: -Math.random() * 2,
            life: 1.0,
            maxLife: 1.0,
            size: Math.random() * 3 + 2,
            color: '#8A7A6A',
            type: 'dust',
        });
    }

    spawnSmokeParticle(x, y) {
        this.particles.push({
            x: x - 15,
            y: y,
            velocityX: -Math.random() * 3 - 1,
            velocityY: -Math.random() * 1,
            life: 1.5,
            maxLife: 1.5,
            size: Math.random() * 5 + 3,
            color: '#5A5A5A',
            type: 'smoke',
        });
    }

    updateParticles(delta) {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.life -= delta;
            p.velocityY += 0.1; // Gravity
        });
        this.stats.particleCount = this.particles.length;
    }

    renderParticles() {
        this.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            this.ctx.globalAlpha = 1.0;
        });
    }

    // === POLICE SPAWNING ===

    spawnPolice() {
        this.policeCar.active = true;
        this.policeCar.worldX = this.playerCar.worldX - 300; // Spawn behind player
        this.policeCar.x = this.playerCar.x - 300;
        this.policeCar.y = this.world.groundY - 40;
        this.policeCar.flashingLights = true;
        console.log('[SidescrollerEngine] Police spawned - chasing player');
    }

    despawnPolice() {
        this.policeCar.active = false;
        this.policeCar.x = -200;
    }

    // === GAME EVENTS ===

    triggerArrest() {
        console.log('[SidescrollerEngine] Player caught by police - triggering arrest');
        this.stop();
        this.screenShake(10, 0.5);

        // Call game's pullOver method
        if (this.game && this.game.pullOver) {
            setTimeout(() => {
                this.game.pullOver();
            }, 500);
        }
    }

    reset() {
        // Reset player car
        this.playerCar.worldX = 0;
        this.playerCar.y = this.world.groundY - 40;
        this.playerCar.velocityX = 0;
        this.playerCar.velocityY = 0;
        this.playerCar.speed = 0;
        this.playerCar.rotation = 0;

        // Reset police car
        this.despawnPolice();

        // Clear particles
        this.particles = [];

        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.shakeDuration = 0;

        console.log('[SidescrollerEngine] Reset - ready for new driving session');
    }

    // === DEBUG ===

    renderDebugInfo() {
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.stats.fps}`, 10, 20);
        this.ctx.fillText(`Speed: ${Math.floor(this.playerCar.speed)}`, 10, 35);
        this.ctx.fillText(`WorldX: ${Math.floor(this.playerCar.worldX)}`, 10, 50);
        this.ctx.fillText(`Particles: ${this.stats.particleCount}`, 10, 65);
        this.ctx.fillText(`Police: ${this.policeCar.active ? 'ACTIVE' : 'INACTIVE'}`, 10, 80);
    }

    // === WINDOW RESIZE ===

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.world.groundY = this.height * 0.7;
        console.log('[SidescrollerEngine] Resized to', this.width, 'x', this.height);
    }
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidescrollerEngine;
}
