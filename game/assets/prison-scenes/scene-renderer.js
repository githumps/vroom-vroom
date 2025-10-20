/**
 * PRISON SCENE RENDERER - ANIMATION & RENDERING ENGINE
 * Converts pixel art data into playable canvas scenes
 *
 * FEATURES:
 * - Renders layered isometric scenes
 * - Animates sprites and interactive elements
 * - Handles lighting and atmospheric effects
 * - Manages character placement and movement
 * - Interactive hotspot detection
 */

class PrisonSceneRenderer {
    constructor(canvas, sceneData) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sceneData = sceneData;

        // Set canvas size
        this.canvas.width = sceneData.metadata.dimensions.width;
        this.canvas.height = sceneData.metadata.dimensions.height;

        // Animation state
        this.animations = new Map();
        this.frameCounter = 0;
        this.lastFrameTime = 0;

        // Character instances
        this.characters = [];

        // Lighting system
        this.lightingEnabled = true;
        this.timeOfDay = 'noon'; // morning, noon, afternoon, evening, night

        // Interaction state
        this.hoveredElement = null;
        this.clickedElement = null;

        // Cached renders (for performance)
        this.layerCache = new Map();
        this.cacheEnabled = true;

        this.init();
    }

    init() {
        // Pre-render static layers
        this.preRenderLayers();

        // Set up animation loop
        this.startAnimationLoop();

        // Set up interaction handlers
        this.setupInteractionHandlers();
    }

    // ==================== RENDERING ====================

    preRenderLayers() {
        // Cache static layers for performance
        this.sceneData.layers.forEach(layer => {
            if (this.isLayerStatic(layer)) {
                const cached = document.createElement('canvas');
                cached.width = this.canvas.width;
                cached.height = this.canvas.height;
                const ctx = cached.getContext('2d');

                this.renderLayer(layer, ctx);
                this.layerCache.set(layer.id, cached);
            }
        });
    }

    isLayerStatic(layer) {
        // Static layers don't change (backgrounds, floors, furniture)
        return !['characters', 'foreground'].includes(layer.id);
    }

    render(timestamp) {
        this.frameCounter++;
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render layers in order
        this.sceneData.layers.forEach(layer => {
            if (this.layerCache.has(layer.id) && this.cacheEnabled) {
                // Use cached static layer
                this.ctx.drawImage(this.layerCache.get(layer.id), 0, 0);
            } else {
                // Render dynamic layer
                this.renderLayer(layer, this.ctx, timestamp);
            }
        });

        // Update animations
        this.updateAnimations(deltaTime);

        // Render interaction highlights
        this.renderInteractionHighlights();
    }

    renderLayer(layer, ctx, timestamp = 0) {
        ctx.save();

        layer.elements.forEach(element => {
            this.renderElement(element, ctx, timestamp);
        });

        ctx.restore();
    }

    renderElement(element, ctx, timestamp) {
        const { type, position, size, pixelData } = element;

        // Validate position exists
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            console.warn('[Scene Renderer] Element missing valid position:', element);
            return; // Skip rendering this element
        }

        ctx.save();
        ctx.translate(position.x, position.y);

        // Handle different element types
        switch(type) {
            case 'wall':
                this.renderWall(element, ctx);
                break;
            case 'isometric_floor':
                this.renderIsometricFloor(element, ctx);
                break;
            case 'bookshelf_wall':
                this.renderBookshelf(element, ctx);
                break;
            case 'punching_bag':
                this.renderPunchingBag(element, ctx, timestamp);
                break;
            case 'food_tray':
                this.renderFoodTray(element, ctx);
                break;
            case 'basketball_court':
                this.renderBasketballCourt(element, ctx);
                break;
            case 'chain_link_fence':
                this.renderChainLinkFence(element, ctx);
                break;
            default:
                this.renderGenericElement(element, ctx);
        }

        ctx.restore();
    }

    // ==================== SPECIFIC RENDERERS ====================

    renderWall(element, ctx) {
        const { size, pattern, color } = element;
        const palette = this.sceneData.palette;

        ctx.fillStyle = palette[color] || palette.wall_mid;
        ctx.fillRect(0, 0, size.width, size.height);

        // Apply pattern/texture
        if (pattern) {
            this.applyPattern(ctx, pattern, size);
        }

        // Render stains if present
        if (element.stains) {
            element.stains.forEach(stain => {
                this.renderStain(ctx, stain);
            });
        }
    }

    renderIsometricFloor(element, ctx) {
        const { size, grid, pattern } = element;
        const palette = this.sceneData.palette;
        const tileWidth = size.width / grid.cols;
        const tileHeight = size.height / grid.rows;

        for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.cols; col++) {
                const x = col * tileWidth;
                const y = row * tileHeight;

                // Draw isometric tile
                ctx.save();
                ctx.translate(x, y);

                // Slight color variation for realism
                const variation = Math.random() * 0.1;
                ctx.fillStyle = this.adjustColor(palette.floor_mid, variation);

                // Diamond shape for isometric
                ctx.beginPath();
                ctx.moveTo(tileWidth / 2, 0);
                ctx.lineTo(tileWidth, tileHeight / 2);
                ctx.lineTo(tileWidth / 2, tileHeight);
                ctx.lineTo(0, tileHeight / 2);
                ctx.closePath();
                ctx.fill();

                // Grout lines
                ctx.strokeStyle = palette.floor_dark;
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.restore();
            }
        }
    }

    renderBookshelf(element, ctx) {
        const { size, shelves, sections, books } = element;
        const palette = this.sceneData.palette;
        const shelfHeight = size.height / shelves;
        const sectionWidth = size.width / sections;

        for (let shelf = 0; shelf < shelves; shelf++) {
            const y = shelf * shelfHeight;

            // Shelf board
            ctx.fillStyle = palette.wood_dark;
            ctx.fillRect(0, y, size.width, 4);

            // Books on shelf
            let bookX = 5;
            while (bookX < size.width - 10) {
                const bookWidth = 2 + Math.floor(Math.random() * 3);
                const bookHeight = shelfHeight - 8;
                const bookColor = this.getRandomBookColor();

                const bookSpineColor = palette[bookColor] || palette.book_spine_1;
                ctx.fillStyle = bookSpineColor;
                ctx.fillRect(bookX, y + 4, bookWidth, bookHeight);

                // Book spine highlight
                ctx.fillStyle = this.adjustColor(bookSpineColor, 0.2);
                ctx.fillRect(bookX, y + 4, 1, bookHeight);

                bookX += bookWidth + 1;
            }
        }
    }

    renderPunchingBag(element, ctx, timestamp) {
        const { size, components, animated, states } = element;
        const palette = this.sceneData.palette;

        // Calculate swing animation
        let swingAngle = 0;
        if (animated && states.idle) {
            const phase = (timestamp / 1000) % 2; // 2-second cycle
            swingAngle = Math.sin(phase * Math.PI * 2) * 2; // ±2 degrees
        }

        ctx.save();

        // Chain
        ctx.strokeStyle = palette.metal_dark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(size.width / 2, -40);
        ctx.lineTo(size.width / 2 + swingAngle, 0);
        ctx.stroke();

        // Bag body (rotate with swing)
        ctx.translate(size.width / 2, size.height / 2);
        ctx.rotate(swingAngle * Math.PI / 180);

        ctx.fillStyle = palette.padding_gray;
        ctx.fillRect(-12, -40, 24, 80);

        // Wear marks
        ctx.fillStyle = palette.shadow_deep;
        ctx.fillRect(-10, -20, 3, 8);
        ctx.fillRect(-8, 10, 4, 6);

        ctx.restore();
    }

    renderFoodTray(element, ctx) {
        const { size, compartments, pixelData } = element;
        const palette = this.sceneData.palette;

        // Tray base
        ctx.fillStyle = palette.table_metal;
        ctx.fillRect(0, 0, size.width, size.height);

        // Compartment dividers
        ctx.strokeStyle = palette.metal_dark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(size.width * 0.6, 0);
        ctx.lineTo(size.width * 0.6, size.height * 0.6);
        ctx.moveTo(0, size.height * 0.6);
        ctx.lineTo(size.width, size.height * 0.6);
        ctx.stroke();

        // Food items
        if (pixelData.compartment_main) {
            this.renderFood(ctx, 'mashed_potato', 10, 10, 30, 25);
        }
        if (pixelData.compartment_protein) {
            this.renderFood(ctx, 'mystery_meat', 50, 10, 20, 15);
        }
        if (pixelData.compartment_vegetable) {
            this.renderFood(ctx, 'green_beans', 50, 40, 20, 10);
        }
        if (pixelData.compartment_dessert) {
            this.renderJello(ctx, 10, 40, 15, 15);
        }
    }

    renderFood(ctx, type, x, y, width, height) {
        const palette = this.sceneData.palette;
        const color = palette[type] || palette.mashed_potato;

        ctx.fillStyle = color;
        ctx.beginPath();
        // Irregular blob shape
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = this.adjustColor(color, 0.2);
        ctx.beginPath();
        ctx.ellipse(x + width/3, y + height/3, width/4, height/4, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    renderJello(ctx, x, y, width, height) {
        const palette = this.sceneData.palette;
        const phase = (Date.now() / 200) % (Math.PI * 2);
        const jiggle = Math.sin(phase) * 2;

        ctx.fillStyle = palette.jello_red;
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        ctx.scale(1 + jiggle * 0.02, 1 - jiggle * 0.02);
        ctx.fillRect(-width/2, -height/2, width, height);
        ctx.restore();

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x + 2, y + 2, 4, 4);
    }

    renderBasketballCourt(element, ctx) {
        const { size, components } = element;
        const palette = this.sceneData.palette;

        // Court surface
        ctx.fillStyle = palette.asphalt_old;
        ctx.fillRect(0, 0, size.width, size.height);

        // Court lines (faded)
        ctx.strokeStyle = `${palette.court_line}99`; // 60% opacity
        ctx.lineWidth = 2;

        // Perimeter
        ctx.strokeRect(5, 5, size.width - 10, size.height - 10);

        // Center line
        ctx.beginPath();
        ctx.moveTo(size.width / 2, 5);
        ctx.lineTo(size.width / 2, size.height - 5);
        ctx.stroke();

        // Key paint (faded red)
        ctx.fillStyle = `${palette.court_key}44`;
        ctx.fillRect(10, size.height / 2 - 30, 40, 60);
        ctx.fillRect(size.width - 50, size.height / 2 - 30, 40, 60);

        // Cracks
        if (components.court_surface.cracks) {
            ctx.strokeStyle = palette.shadow_deep;
            ctx.lineWidth = 1;
            components.court_surface.cracks.forEach(crack => {
                ctx.beginPath();
                ctx.moveTo(crack.start.x, crack.start.y);
                ctx.lineTo(crack.end.x, crack.end.y);
                ctx.stroke();
            });
        }
    }

    renderChainLinkFence(element, ctx) {
        const { size, pixelData } = element;
        const palette = this.sceneData.palette;
        const meshSize = 8;

        // Create diamond mesh pattern
        ctx.strokeStyle = palette.fence_metal;
        ctx.lineWidth = 1;

        for (let y = 0; y < size.height; y += meshSize) {
            for (let x = 0; x < size.width; x += meshSize) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + meshSize/2, y + meshSize/2);
                ctx.lineTo(x, y + meshSize);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x + meshSize/2, y + meshSize/2);
                ctx.lineTo(x + meshSize, y);
                ctx.lineTo(x + meshSize, y + meshSize);
                ctx.stroke();
            }
        }

        // Fence posts
        ctx.fillStyle = palette.fence_metal;
        for (let x = 0; x < size.width; x += pixelData.post_spacing) {
            ctx.fillRect(x, 0, 4, size.height);
        }

        // Rust spots
        if (element.rust_spots) {
            ctx.fillStyle = palette.fence_rust;
            element.rust_spots.forEach(spot => {
                ctx.fillRect(spot.x, spot.y, spot.size, spot.size);
            });
        }
    }

    renderGenericElement(element, ctx) {
        // Fallback for simple pixel data rendering
        if (element.pixelData && Array.isArray(element.pixelData)) {
            this.renderPixelData(ctx, element.pixelData, element.size);
        } else if (element.size) {
            // Draw placeholder only if size is defined
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(0, 0, element.size.width, element.size.height);
        }
        // If no pixelData and no size, skip rendering (animated elements, etc.)
    }

    renderPixelData(ctx, pixelData, size) {
        // Convert ASCII pixel art to canvas pixels
        if (!pixelData || !Array.isArray(pixelData) || pixelData.length === 0) {
            return; // Nothing to render
        }

        const palette = this.sceneData.palette;
        const charMap = {
            '█': palette.metal_dark || '#3a3a3a',
            '▓': palette.metal_mid || '#5a5a5a',
            '▒': palette.metal_highlight || '#7a7a7a',
            '░': palette.wall_light || '#8a8a8a',
            '  ': 'transparent'
        };

        // Calculate size from pixelData if not provided
        const actualSize = size || {
            width: pixelData[0].length / 2, // ASCII uses 2 chars per pixel
            height: pixelData.length
        };

        const lineHeight = actualSize.height / pixelData.length;

        pixelData.forEach((line, y) => {
            for (let x = 0; x < line.length; x += 2) {
                const char = line.substr(x, 2);
                const color = charMap[char] || 'transparent';

                if (color !== 'transparent') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x / 2, y * lineHeight, 1, lineHeight);
                }
            }
        });
    }

    // ==================== ANIMATION SYSTEM ====================

    updateAnimations(deltaTime) {
        this.animations.forEach((anim, id) => {
            anim.elapsed += deltaTime;

            if (anim.elapsed >= anim.frameDuration) {
                anim.currentFrame = (anim.currentFrame + 1) % anim.totalFrames;
                anim.elapsed = 0;

                if (!anim.loop && anim.currentFrame === 0) {
                    this.animations.delete(id);
                }
            }
        });
    }

    startAnimation(elementId, animationData) {
        this.animations.set(elementId, {
            currentFrame: 0,
            totalFrames: animationData.frames,
            frameDuration: animationData.speed,
            elapsed: 0,
            loop: animationData.loop,
            data: animationData
        });
    }

    stopAnimation(elementId) {
        this.animations.delete(elementId);
    }

    // ==================== INTERACTION SYSTEM ====================

    setupInteractionHandlers() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.checkHover(x, y);
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.handleClick(x, y);
        });
    }

    checkHover(x, y) {
        let found = null;

        this.sceneData.interactions.forEach(interaction => {
            if (this.isPointInArea(x, y, interaction.area)) {
                found = interaction;
            }
        });

        if (found !== this.hoveredElement) {
            this.hoveredElement = found;
            this.canvas.style.cursor = found ? found.cursor : 'default';
        }
    }

    handleClick(x, y) {
        this.sceneData.interactions.forEach(interaction => {
            if (this.isPointInArea(x, y, interaction.area)) {
                this.onInteraction(interaction);
            }
        });
    }

    isPointInArea(x, y, area) {
        return x >= area.x && x <= area.x + area.width &&
               y >= area.y && y <= area.y + area.height;
    }

    onInteraction(interaction) {
        // Emit event for game to handle
        const event = new CustomEvent('sceneInteraction', {
            detail: {
                id: interaction.id,
                action: interaction.action
            }
        });
        this.canvas.dispatchEvent(event);
    }

    renderInteractionHighlights() {
        if (this.hoveredElement) {
            const area = this.hoveredElement.area;
            this.ctx.strokeStyle = '#0f0';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(area.x, area.y, area.width, area.height);

            // Tooltip
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(area.x, area.y - 30, 200, 25);
            this.ctx.fillStyle = '#0f0';
            this.ctx.font = '14px "Courier New"';
            this.ctx.fillText(this.hoveredElement.tooltip, area.x + 5, area.y - 10);
        }
    }

    // ==================== LIGHTING SYSTEM ====================

    applyLighting(ctx, timestamp) {
        if (!this.lightingEnabled) return;

        const lighting = this.sceneData.lighting;
        const timeData = lighting.ambient.time_based ?
            lighting.ambient.color[this.timeOfDay] :
            lighting.ambient.color;

        // Ambient overlay
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = timeData;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';

        // Light sources
        lighting.sources.forEach(source => {
            this.renderLightSource(ctx, source, timestamp);
        });
    }

    renderLightSource(ctx, source, timestamp) {
        const { position, radius, intensity, flicker } = source;

        let alpha = intensity;
        if (flicker) {
            const flickerPhase = (timestamp / 100) % 1;
            alpha *= 0.95 + Math.random() * 0.05;
        }

        const gradient = ctx.createRadialGradient(
            position.x, position.y, 0,
            position.x, position.y, radius
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 200, ${alpha * 0.1})`);
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.fillRect(
            position.x - radius, position.y - radius,
            radius * 2, radius * 2
        );
        ctx.globalCompositeOperation = 'source-over';
    }

    // ==================== HELPERS ====================

    getRandomBookColor() {
        const colors = ['book_spine_1', 'book_spine_2', 'book_spine_3', 'book_spine_4', 'book_spine_5'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    adjustColor(hex, amount) {
        // Validate hex color input
        if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
            console.warn('[Scene Renderer] Invalid hex color:', hex);
            return '#808080'; // Return gray as fallback
        }

        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount * 255));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount * 255));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount * 255));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    applyPattern(ctx, pattern, size) {
        // Apply texture patterns
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * size.width;
            const y = Math.random() * size.height;
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1.0;
    }

    renderStain(ctx, stain) {
        ctx.fillStyle = 'rgba(100, 80, 60, 0.3)';
        ctx.beginPath();
        ctx.ellipse(stain.x, stain.y, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // ==================== ANIMATION LOOP ====================

    startAnimationLoop() {
        const loop = (timestamp) => {
            this.render(timestamp);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    // ==================== PUBLIC API ====================

    setTimeOfDay(time) {
        this.timeOfDay = time;
        this.cacheEnabled = false; // Force re-render
        setTimeout(() => { this.cacheEnabled = true; }, 100);
    }

    addCharacter(characterData, position) {
        this.characters.push({
            data: characterData,
            position: position,
            animation: 'idle'
        });
    }

    removeCharacter(index) {
        this.characters.splice(index, 1);
    }

    destroy() {
        // Cleanup
        this.animations.clear();
        this.layerCache.clear();
        this.characters = [];
    }
}

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrisonSceneRenderer;
}
