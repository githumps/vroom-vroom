// Isometric camera system for Disco Elysium style view
// Provides fixed 45-degree angle camera with smooth following and cinematic effects

class IsometricCamera {
    constructor(scene) {
        this.scene = scene;

        // Create orthographic camera for isometric view
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20;

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            -100,
            1000
        );

        // Set up isometric angle (45 degrees rotation, 35.264 degrees tilt)
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        // Camera settings
        this.config = {
            distance: 20,
            height: 15,
            angle: Math.PI / 4, // 45 degrees
            tilt: Math.PI / 6,  // 30 degrees
            smoothing: 0.1,
            zoomLevel: 1,
            minZoom: 0.5,
            maxZoom: 2,
            offset: new THREE.Vector3(0, 0, 0),
            shakeIntensity: 0,
            shakeDuration: 0
        };

        // Target to follow
        this.target = null;
        this.targetPosition = new THREE.Vector3();
        this.currentPosition = new THREE.Vector3();

        // Cinematic effects
        this.cinematicMode = false;
        this.cinematicPoints = [];
        this.cinematicIndex = 0;
        this.cinematicSpeed = 0.02;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('wheel', (e) => this.onZoom(e));
    }

    onResize() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20 * this.config.zoomLevel;

        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;

        this.camera.updateProjectionMatrix();
    }

    onZoom(event) {
        event.preventDefault();

        const delta = event.deltaY > 0 ? 1.1 : 0.9;
        this.config.zoomLevel = Math.max(
            this.config.minZoom,
            Math.min(this.config.maxZoom, this.config.zoomLevel * delta)
        );

        this.onResize();
    }

    setTarget(object) {
        this.target = object;
    }

    // Smooth camera following
    update(deltaTime) {
        if (this.cinematicMode) {
            this.updateCinematic(deltaTime);
            return;
        }

        if (this.target) {
            // Get target position
            this.targetPosition.copy(this.target.position);
            this.targetPosition.add(this.config.offset);

            // Smooth interpolation
            this.currentPosition.lerp(this.targetPosition, this.config.smoothing);

            // Calculate camera position
            const x = this.currentPosition.x + this.config.distance * Math.cos(this.config.angle);
            const y = this.currentPosition.y + this.config.height;
            const z = this.currentPosition.z + this.config.distance * Math.sin(this.config.angle);

            // Apply camera shake if active
            if (this.config.shakeDuration > 0) {
                const shake = this.calculateShake();
                this.camera.position.set(x + shake.x, y + shake.y, z + shake.z);
                this.config.shakeDuration -= deltaTime;
            } else {
                this.camera.position.set(x, y, z);
            }

            // Look at target
            this.camera.lookAt(this.currentPosition);
        }

        // Update projection matrix
        this.camera.updateProjectionMatrix();
    }

    // Camera shake effect for impacts
    shake(intensity = 1, duration = 0.5) {
        this.config.shakeIntensity = intensity;
        this.config.shakeDuration = duration;
    }

    calculateShake() {
        const intensity = this.config.shakeIntensity * this.config.shakeDuration;
        return {
            x: (Math.random() - 0.5) * intensity,
            y: (Math.random() - 0.5) * intensity,
            z: (Math.random() - 0.5) * intensity
        };
    }

    // Cinematic camera movements
    startCinematic(points) {
        this.cinematicMode = true;
        this.cinematicPoints = points;
        this.cinematicIndex = 0;
    }

    stopCinematic() {
        this.cinematicMode = false;
        this.cinematicPoints = [];
    }

    updateCinematic(deltaTime) {
        if (this.cinematicIndex >= this.cinematicPoints.length - 1) {
            this.stopCinematic();
            return;
        }

        const current = this.cinematicPoints[this.cinematicIndex];
        const next = this.cinematicPoints[this.cinematicIndex + 1];

        // Interpolate between points
        const t = this.cinematicSpeed;
        this.camera.position.lerp(next.position, t);

        if (next.lookAt) {
            const lookAtPos = new THREE.Vector3().lerpVectors(
                current.lookAt || this.camera.position,
                next.lookAt,
                t
            );
            this.camera.lookAt(lookAtPos);
        }

        // Check if reached next point
        if (this.camera.position.distanceTo(next.position) < 0.5) {
            this.cinematicIndex++;
        }
    }

    // Focus on specific area
    focusOn(position, zoomLevel = 1.5, duration = 1000) {
        const startZoom = this.config.zoomLevel;
        const startOffset = this.config.offset.clone();
        const targetOffset = position.clone().sub(this.target ? this.target.position : new THREE.Vector3());

        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing
            const eased = 1 - Math.pow(1 - progress, 3);

            this.config.zoomLevel = startZoom + (zoomLevel - startZoom) * eased;
            this.config.offset.lerpVectors(startOffset, targetOffset, eased);

            this.onResize();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Get screen position of world object
    getScreenPosition(worldPosition) {
        const vector = worldPosition.clone();
        vector.project(this.camera);

        return {
            x: (vector.x + 1) * window.innerWidth / 2,
            y: (-vector.y + 1) * window.innerHeight / 2
        };
    }

    // Convert screen click to world position (for point-and-click movement)
    getWorldPosition(screenX, screenY, targetY = 0) {
        const vector = new THREE.Vector3(
            (screenX / window.innerWidth) * 2 - 1,
            -(screenY / window.innerHeight) * 2 + 1,
            0.5
        );

        vector.unproject(this.camera);

        const direction = vector.sub(this.camera.position).normalize();
        const distance = (targetY - this.camera.position.y) / direction.y;
        const worldPosition = this.camera.position.clone().add(direction.multiplyScalar(distance));

        return worldPosition;
    }

    // Transition between camera modes
    transitionTo(mode) {
        const transitions = {
            driving: {
                distance: 20,
                height: 15,
                angle: Math.PI / 4,
                zoomLevel: 1
            },
            courtroom: {
                distance: 15,
                height: 10,
                angle: Math.PI / 6,
                zoomLevel: 1.5
            },
            prison: {
                distance: 12,
                height: 8,
                angle: Math.PI / 3,
                zoomLevel: 1.8
            },
            dialogue: {
                distance: 8,
                height: 5,
                angle: 0,
                zoomLevel: 2
            }
        };

        const targetConfig = transitions[mode];
        if (!targetConfig) return;

        // Animate transition
        const duration = 1500;
        const startConfig = { ...this.config };
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            for (const key in targetConfig) {
                if (typeof startConfig[key] === 'number') {
                    this.config[key] = startConfig[key] + (targetConfig[key] - startConfig[key]) * eased;
                }
            }

            this.onResize();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
}

export default IsometricCamera;