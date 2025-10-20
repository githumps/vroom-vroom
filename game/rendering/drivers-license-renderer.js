/**
 * VROOM VROOM - DRIVER'S LICENSE RENDERER
 * Canvas-Based Rendering System for License UI
 *
 * Version: 1.5.0
 * Last Updated: 2025-10-19
 *
 * RESPONSIBILITIES:
 * - Render character mugshot from character sprite data
 * - Apply black & white police lineup aesthetic
 * - Dynamically place stamps on license as they're earned
 * - Handle inspection animation sequences
 * - Manage license state changes (collapsed/expanded/inspection)
 *
 * INTEGRATION:
 * - Works with character-sprites.js for mugshot rendering
 * - Uses drivers-license-assets.js for stamps and icons
 * - Updates DOM elements in real-time
 *
 * @artist isometric-pixel-artist agent
 * @developer game-dev-specialist agent
 */

class DriversLicenseRenderer {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.mugshotCanvas = null;
        this.mugshotCtx = null;
        this.stampCanvas = null;
        this.stampCtx = null;

        // State tracking
        this.state = 'expanded';  // 'collapsed', 'expanded', 'inspection'
        this.stamps = [];  // Array of applied stamps
        this.isInspecting = false;

        // Animation timers
        this.inspectionTimer = null;
        this.stampAnimations = [];

        // Initialize
        this.initialize();
    }

    /**
     * Initialize license UI system
     */
    initialize() {
        console.log("[LICENSE] Initializing driver's license UI...");

        // Create main container
        this.createContainer();

        // Create mugshot canvas
        this.createMugshotCanvas();

        // Create stamp overlay canvas
        this.createStampCanvas();

        // Render initial license
        this.renderLicense();

        // Setup event listeners
        this.setupEventListeners();

        console.log("[LICENSE] Driver's license UI initialized successfully");
    }

    /**
     * Create main license container
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'drivers-license-container expanded';
        this.container.innerHTML = `
            <div class="drivers-license-card">
                <!-- Header -->
                <div class="license-header">
                    DYSTOPIAN DEPARTMENT OF MOTOR VEHICLES
                    <div class="license-header-subtext">Official Driver Identification</div>
                </div>

                <!-- Mugshot section -->
                <div class="license-mugshot-container">
                    <canvas class="license-mugshot-canvas" width="80" height="100"></canvas>
                    <div class="license-prisoner-number">#<span id="license-prisoner-id">000000</span></div>
                </div>

                <!-- Barcode -->
                <div class="license-barcode">
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                    <div class="license-barcode-bar"></div>
                </div>
                <div class="license-id-number">ID: <span id="license-barcode-text">DMV-000000</span></div>

                <!-- Info fields -->
                <div class="license-info-section">
                    <div class="license-field">
                        <span class="license-field-label">Full Name</span>
                        <span class="license-field-value" id="license-name">UNKNOWN</span>
                    </div>
                    <div class="license-field-row">
                        <div class="license-field">
                            <span class="license-field-label">Height</span>
                            <span class="license-field-value" id="license-height">0'0"</span>
                        </div>
                        <div class="license-field">
                            <span class="license-field-label">Skin Tone</span>
                            <span class="license-field-value" id="license-skin">N/A</span>
                        </div>
                    </div>
                    <div class="license-field">
                        <span class="license-field-label">Vehicle Class</span>
                        <span class="license-field-value" id="license-vehicle">NONE</span>
                    </div>
                    <div class="license-field">
                        <span class="license-field-label">Status</span>
                        <span class="license-field-value" id="license-status">ACTIVE</span>
                    </div>
                    <div class="license-field">
                        <span class="license-field-label">Violations</span>
                        <span class="license-field-value" id="license-violations">0</span>
                    </div>
                </div>

                <!-- Status bar with stats -->
                <div class="license-status-bar">
                    <div class="license-stat" title="Credits">
                        <canvas class="license-stat-icon" width="12" height="12" data-icon="money"></canvas>
                        <span class="license-stat-value" id="license-money">0</span>
                    </div>
                    <div class="license-stat" title="Hunger">
                        <canvas class="license-stat-icon" width="12" height="12" data-icon="hunger"></canvas>
                        <span class="license-stat-value" id="license-hunger">0</span>
                    </div>
                    <div class="license-stat" title="Strength">
                        <canvas class="license-stat-icon" width="12" height="12" data-icon="strength"></canvas>
                        <span class="license-stat-value" id="license-strength">0</span>
                    </div>
                    <div class="license-stat" title="Intelligence">
                        <canvas class="license-stat-icon" width="12" height="12" data-icon="intelligence"></canvas>
                        <span class="license-stat-value" id="license-intelligence">0</span>
                    </div>
                </div>

                <!-- Toggle button -->
                <button class="license-toggle-btn" title="Collapse/Expand">−</button>

                <!-- Stamp overlay canvas (positioned absolutely) -->
                <canvas class="license-stamp-canvas" width="320" height="180"></canvas>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(this.container);
    }

    /**
     * Create mugshot canvas for character rendering
     */
    createMugshotCanvas() {
        this.mugshotCanvas = this.container.querySelector('.license-mugshot-canvas');
        this.mugshotCtx = this.mugshotCanvas.getContext('2d');

        // Enable pixel-perfect rendering
        this.mugshotCtx.imageSmoothingEnabled = false;
    }

    /**
     * Create stamp overlay canvas
     */
    createStampCanvas() {
        this.stampCanvas = this.container.querySelector('.license-stamp-canvas');
        this.stampCtx = this.stampCanvas.getContext('2d');

        // Position absolutely over license card
        this.stampCanvas.style.position = 'absolute';
        this.stampCanvas.style.top = '0';
        this.stampCanvas.style.left = '0';
        this.stampCanvas.style.pointerEvents = 'none';

        // Enable pixel-perfect rendering
        this.stampCtx.imageSmoothingEnabled = false;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle button
        const toggleBtn = this.container.querySelector('.license-toggle-btn');
        toggleBtn.addEventListener('click', () => this.toggleState());

        // Click license during inspection to dismiss
        this.container.addEventListener('click', (e) => {
            if (this.isInspecting && !e.target.classList.contains('license-toggle-btn')) {
                this.endInspection();
            }
        });
    }

    /**
     * Render complete license with all data
     */
    renderLicense() {
        if (!this.game || !this.game.player) {
            console.warn("[LICENSE] No player data available yet");
            return;
        }

        const player = this.game.player;

        // Update text fields
        this.updateField('license-name', (player.name || 'UNKNOWN').toUpperCase());
        this.updateField('license-height', player.height || "0'0\"");
        this.updateField('license-skin', this.formatSkinTone(player.skinTone));
        this.updateField('license-vehicle', this.formatVehicle(player.selectedCar));
        this.updateField('license-status', this.getStatus(player));
        this.updateField('license-violations', player.arrests || 0);

        // Update prisoner number and barcode
        const prisonerId = this.generatePrisonerId(player);
        this.updateField('license-prisoner-id', prisonerId);
        this.updateField('license-barcode-text', `DMV-${prisonerId}`);

        // Update stats
        this.updateField('license-money', player.money || 0);
        this.updateField('license-hunger', player.hunger || 0);
        this.updateField('license-strength', player.strength || 0);
        this.updateField('license-intelligence', player.intelligence || 0);

        // Render mugshot
        this.renderMugshot(player);

        // Render stat icons
        this.renderStatIcons();

        // Render existing stamps
        this.renderStamps();
    }

    /**
     * Update a license field
     */
    updateField(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Render character mugshot
     */
    renderMugshot(player) {
        if (!CharacterSprites) {
            console.warn("[LICENSE] CharacterSprites not loaded");
            return;
        }

        const ctx = this.mugshotCtx;
        const canvas = this.mugshotCanvas;

        // Clear canvas
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw police lineup background (horizontal lines)
        ctx.strokeStyle = '#2A2A2A';
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Get character sprite data (from character-sprites.js)
        const skinToneIndex = player.skinTone || 1;
        const characterData = CharacterSprites.base_character;

        if (!characterData || !characterData.pixelData) {
            console.warn("[LICENSE] No character sprite data available");
            return;
        }

        // Render character sprite (cropped to head/shoulders)
        // Character sprite is 64x96, we want top 64x80 (head + torso)
        const pixelSize = 1;  // Base pixel size
        const startRow = 2;   // Skip first 2 rows (empty)
        const endRow = 42;    // Stop at row 42 (shoulders)
        const centerOffset = (canvas.width - 64) / 2;

        ctx.save();

        // Apply grayscale filter for mugshot aesthetic
        ctx.filter = 'grayscale(100%) contrast(120%)';

        characterData.pixelData.slice(startRow, endRow).forEach((row, rowIndex) => {
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const char = row[colIndex];
                if (char === ' ') continue;

                // Map character to color (simplified for grayscale)
                let color = '#2A2A2A';
                if (char === '█') {
                    // Determine if skin, hair, or clothing
                    if (rowIndex < 15) {
                        color = '#5A5A5A';  // Hair (gray)
                    } else if (rowIndex < 30) {
                        color = '#A8A8A8';  // Face/skin (light gray)
                    } else {
                        color = '#D8D8D8';  // Clothing (lightest gray)
                    }
                }

                ctx.fillStyle = color;
                ctx.fillRect(
                    centerOffset + colIndex * pixelSize,
                    rowIndex * pixelSize * 2.5,  // Scale vertically
                    pixelSize,
                    pixelSize * 2.5
                );
            }
        });

        ctx.restore();

        // Add film grain effect
        this.addFilmGrain(ctx, canvas.width, canvas.height);

        // Add vignette
        this.addVignette(ctx, canvas.width, canvas.height);
    }

    /**
     * Add film grain to mugshot
     */
    addFilmGrain(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 30;  // -15 to +15
            data[i] += noise;     // R
            data[i + 1] += noise; // G
            data[i + 2] += noise; // B
        }

        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Add vignette to mugshot
     */
    addVignette(ctx, width, height) {
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, 0,
            width / 2, height / 2, Math.max(width, height) / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * Render stat icons in status bar
     */
    renderStatIcons() {
        if (!DriversLicenseAssets) {
            console.warn("[LICENSE] DriversLicenseAssets not loaded");
            return;
        }

        const icons = this.container.querySelectorAll('.license-stat-icon');
        icons.forEach(canvas => {
            const iconKey = canvas.dataset.icon;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, 12, 12);
            DriversLicenseAssets.renderIcon(ctx, iconKey, 0, 0);
        });
    }

    /**
     * Render all stamps on overlay canvas
     */
    renderStamps() {
        if (!DriversLicenseAssets) return;

        const ctx = this.stampCtx;
        ctx.clearRect(0, 0, this.stampCanvas.width, this.stampCanvas.height);

        this.stamps.forEach(stamp => {
            DriversLicenseAssets.renderStamp(
                ctx,
                stamp.type,
                stamp.x,
                stamp.y,
                stamp.opacity || 0.85
            );
        });
    }

    /**
     * Add a new stamp to the license
     * @param {string} stampType - Type of stamp from DriversLicenseAssets
     */
    addStamp(stampType) {
        if (!DriversLicenseAssets || !DriversLicenseAssets.stamps[stampType]) {
            console.warn(`[LICENSE] Invalid stamp type: ${stampType}`);
            return;
        }

        const stampData = DriversLicenseAssets.stamps[stampType];
        const positions = stampData.positions;

        // Choose random position from available positions
        const position = positions[Math.floor(Math.random() * positions.length)];

        // Add to stamps array
        const newStamp = {
            type: stampType,
            x: position.x,
            y: position.y,
            opacity: 0,
            timestamp: Date.now()
        };

        this.stamps.push(newStamp);

        // Animate stamp appearing
        this.animateStamp(newStamp);

        console.log(`[LICENSE] Added stamp: ${stampType}`);
    }

    /**
     * Animate stamp appearing with impact effect
     */
    animateStamp(stamp) {
        const duration = 400;  // 400ms animation
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            // Fade in opacity
            stamp.opacity = eased * 0.85;

            // Re-render stamps
            this.renderStamps();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Add CSS class for impact shake
                this.container.classList.add('violation');
                setTimeout(() => {
                    this.container.classList.remove('violation');
                }, 500);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Toggle license state (collapsed/expanded)
     */
    toggleState() {
        if (this.isInspecting) return;

        if (this.state === 'expanded') {
            this.state = 'collapsed';
            this.container.classList.remove('expanded');
            this.container.classList.add('collapsed');
            this.container.querySelector('.license-toggle-btn').textContent = '+';
        } else {
            this.state = 'expanded';
            this.container.classList.remove('collapsed');
            this.container.classList.add('expanded');
            this.container.querySelector('.license-toggle-btn').textContent = '−';
        }
    }

    /**
     * Start cop inspection sequence
     * @param {number} duration - Duration in milliseconds (default 4000)
     */
    startInspection(duration = 4000) {
        if (this.isInspecting) return;

        console.log("[LICENSE] Starting cop inspection sequence...");
        this.isInspecting = true;

        // Add inspection state
        this.container.classList.add('inspection');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'cop-inspection-overlay active';
        document.body.appendChild(overlay);

        // Create cop hand (magnifying glass)
        const hand = document.createElement('div');
        hand.className = 'cop-inspection-hand';
        document.body.appendChild(hand);

        // Create magnifying glass effect
        const magnify = document.createElement('div');
        magnify.className = 'cop-magnifying-glass';
        document.body.appendChild(magnify);

        // Create cop face
        const face = document.createElement('div');
        face.className = 'cop-inspection-face';
        document.body.appendChild(face);

        // Auto-end after duration
        this.inspectionTimer = setTimeout(() => {
            this.endInspection();
        }, duration);
    }

    /**
     * End cop inspection sequence
     */
    endInspection() {
        if (!this.isInspecting) return;

        console.log("[LICENSE] Ending cop inspection sequence");
        this.isInspecting = false;

        // Clear timer
        if (this.inspectionTimer) {
            clearTimeout(this.inspectionTimer);
            this.inspectionTimer = null;
        }

        // Remove inspection state
        this.container.classList.remove('inspection');

        // Remove overlays
        document.querySelectorAll('.cop-inspection-overlay, .cop-inspection-hand, .cop-magnifying-glass, .cop-inspection-face').forEach(el => {
            el.remove();
        });
    }

    /**
     * Update license when player data changes
     */
    update() {
        this.renderLicense();
    }

    /**
     * Helper: Format skin tone for display
     */
    formatSkinTone(skinTone) {
        const tones = ['', 'Light', 'Fair', 'Medium', 'Tan', 'Brown', 'Deep'];
        return tones[skinTone] || 'N/A';
    }

    /**
     * Helper: Format vehicle for display
     */
    formatVehicle(car) {
        if (!car || !car.model) return 'NONE';
        return car.model.toUpperCase();
    }

    /**
     * Helper: Get license status
     */
    getStatus(player) {
        const arrests = player.arrests || 0;
        if (arrests >= 10) return 'REVOKED';
        if (arrests >= 5) return 'SUSPENDED';
        if (arrests >= 3) return 'PROBATION';
        return 'ACTIVE';
    }

    /**
     * Helper: Generate prisoner ID
     */
    generatePrisonerId(player) {
        const name = player.name || 'UNKNOWN';
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const id = String(hash).padStart(6, '0').slice(-6);
        return id;
    }

    /**
     * Destroy license renderer (cleanup)
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }

        if (this.inspectionTimer) {
            clearTimeout(this.inspectionTimer);
        }

        console.log("[LICENSE] Driver's license renderer destroyed");
    }
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DriversLicenseRenderer;
}
