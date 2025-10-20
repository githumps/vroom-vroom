/**
 * VROOM VROOM - Pixel Art Asset Generator
 *
 * Generates professional isometric pixel art for main menu and character creation
 * Style: Vibey, atmospheric, warm cyberpunk aesthetic
 * Inspired by: Stardew Valley, Celeste, Disco Elysium
 *
 * Output: Base64-encoded PNG sprite sheets with JSON metadata
 */

class PixelArtGenerator {
    constructor() {
        // Color palette: Warm cyberpunk vibes (pinks, purples, teals)
        this.palette = {
            // Sky/Background gradients
            skyDark: '#1a0f2e',
            skyMid: '#2d1b3d',
            skyLight: '#4a2d5c',
            horizonPink: '#8b4d6f',
            horizonOrange: '#c96a5e',

            // Neon accents
            neonPink: '#ff6ec7',
            neonPurple: '#bf5af2',
            neonTeal: '#52ffe8',
            neonYellow: '#ffd700',

            // Building/Structure colors
            buildingDark: '#2a1f3d',
            buildingMid: '#4a3d5c',
            buildingLight: '#6b5d7c',
            windowLight: '#ffeb8a',
            windowDark: '#8b7355',

            // UI Elements
            uiFrameDark: '#1f1833',
            uiFrameMid: '#332d47',
            uiFrameLight: '#4a4363',
            uiAccent: '#ff6ec7',
            uiHighlight: '#ffffff',

            // Shadows and depth
            shadowDark: '#0d0616',
            shadowMid: '#1a0f2e',

            // Character skin tones
            skin1: '#ffdfc4',
            skin2: '#e8b892',
            skin3: '#c98b6f',
            skin4: '#a66e4a',
            skin5: '#7d5436',
            skin6: '#5a3825'
        };

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.spriteSheets = {};
    }

    /**
     * Generate main menu background (800x600px)
     * Isometric cityscape at dusk with atmospheric depth
     */
    generateMainMenuBackground() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        const ctx = this.ctx;

        // Clear canvas
        ctx.fillStyle = this.palette.skyDark;
        ctx.fillRect(0, 0, 800, 600);

        // Sky gradient (top to horizon)
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 400);
        skyGradient.addColorStop(0, this.palette.skyDark);
        skyGradient.addColorStop(0.4, this.palette.skyMid);
        skyGradient.addColorStop(0.7, this.palette.skyLight);
        skyGradient.addColorStop(0.9, this.palette.horizonPink);
        skyGradient.addColorStop(1, this.palette.horizonOrange);
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, 800, 400);

        // Draw stars (small pixels)
        this.drawStars(ctx, 40);

        // Draw isometric city buildings (background layer)
        this.drawIsometricCityscape(ctx, 'background');

        // Draw ground/street (middle layer)
        this.drawIsometricStreet(ctx);

        // Draw foreground buildings
        this.drawIsometricCityscape(ctx, 'foreground');

        // Atmospheric glow
        this.addAtmosphericGlow(ctx);

        // Store sprite sheet
        this.spriteSheets.mainMenuBg = {
            name: 'mainMenuBackground',
            width: 800,
            height: 600,
            dataUrl: this.canvas.toDataURL('image/png')
        };

        return this.spriteSheets.mainMenuBg;
    }

    /**
     * Draw pixel-perfect stars
     */
    drawStars(ctx, count) {
        ctx.fillStyle = this.palette.uiHighlight;
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * 800);
            const y = Math.floor(Math.random() * 300);
            const size = Math.random() > 0.7 ? 2 : 1;
            ctx.fillRect(x, y, size, size);

            // Occasional twinkle
            if (Math.random() > 0.8) {
                ctx.fillStyle = this.palette.neonTeal;
                ctx.fillRect(x, y, size, size);
                ctx.fillStyle = this.palette.uiHighlight;
            }
        }
    }

    /**
     * Draw isometric cityscape with depth layers
     */
    drawIsometricCityscape(ctx, layer) {
        const buildings = layer === 'background'
            ? this.generateBackgroundBuildings()
            : this.generateForegroundBuildings();

        buildings.forEach(building => {
            this.drawIsometricBuilding(ctx, building);
        });
    }

    generateBackgroundBuildings() {
        return [
            { x: 50, y: 250, w: 40, h: 80, depth: 30, windows: 8 },
            { x: 120, y: 230, w: 50, h: 100, depth: 35, windows: 10 },
            { x: 200, y: 240, w: 45, h: 90, depth: 32, windows: 9 },
            { x: 280, y: 220, w: 55, h: 110, depth: 38, windows: 12 },
            { x: 370, y: 235, w: 42, h: 85, depth: 30, windows: 8 },
            { x: 450, y: 225, w: 48, h: 95, depth: 34, windows: 10 },
            { x: 530, y: 240, w: 40, h: 80, depth: 28, windows: 7 },
            { x: 600, y: 230, w: 52, h: 105, depth: 36, windows: 11 }
        ];
    }

    generateForegroundBuildings() {
        return [
            { x: 620, y: 380, w: 70, h: 140, depth: 50, windows: 14, highlight: true },
            { x: 80, y: 400, w: 60, h: 120, depth: 45, windows: 12 }
        ];
    }

    /**
     * Draw a single isometric building with pixel-perfect edges
     */
    drawIsometricBuilding(ctx, building) {
        const { x, y, w, h, depth, windows, highlight } = building;

        // Front face (darker)
        ctx.fillStyle = this.palette.buildingDark;
        ctx.fillRect(x, y, w, h);

        // Top face (isometric)
        ctx.fillStyle = this.palette.buildingLight;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + depth * 0.5, y - depth * 0.5);
        ctx.closePath();
        ctx.fill();

        // Right side face
        ctx.fillStyle = this.palette.buildingMid;
        ctx.beginPath();
        ctx.moveTo(x + w, y);
        ctx.lineTo(x + w + depth * 0.5, y - depth * 0.5);
        ctx.lineTo(x + w + depth * 0.5, y + h - depth * 0.5);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();

        // Draw windows (pixel perfect grid)
        this.drawWindows(ctx, x, y, w, h, windows, highlight);

        // Neon accent (random chance)
        if (highlight || Math.random() > 0.6) {
            const neonColor = [this.palette.neonPink, this.palette.neonTeal, this.palette.neonPurple][Math.floor(Math.random() * 3)];
            ctx.fillStyle = neonColor;
            ctx.fillRect(x + 2, y + 2, 3, h - 4);
        }
    }

    /**
     * Draw window grid on building
     */
    drawWindows(ctx, x, y, w, h, count, lit = false) {
        const cols = Math.floor(w / 10);
        const rows = Math.floor(count / cols);
        const spacing = 8;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const wx = x + 4 + col * spacing;
                const wy = y + 8 + row * (spacing + 2);

                if (wx + 4 > x + w || wy + 4 > y + h) continue;

                // Window lit or dark (random or forced)
                const isLit = lit ? true : Math.random() > 0.5;
                ctx.fillStyle = isLit ? this.palette.windowLight : this.palette.windowDark;
                ctx.fillRect(wx, wy, 4, 4);
            }
        }
    }

    /**
     * Draw isometric street/ground plane
     */
    drawIsometricStreet(ctx) {
        // Ground base
        ctx.fillStyle = '#2a2438';
        ctx.fillRect(0, 420, 800, 180);

        // Street lines (pixel perfect)
        ctx.fillStyle = this.palette.neonYellow;
        for (let i = 0; i < 800; i += 40) {
            ctx.fillRect(i, 500, 20, 2);
        }

        // Sidewalk edge
        ctx.fillStyle = '#1a1628';
        ctx.fillRect(0, 570, 800, 30);
    }

    /**
     * Add atmospheric glow and light rays
     */
    addAtmosphericGlow(ctx) {
        // Radial gradient from center-bottom (horizon glow)
        const glowGradient = ctx.createRadialGradient(400, 400, 50, 400, 400, 300);
        glowGradient.addColorStop(0, 'rgba(255, 110, 199, 0.15)');
        glowGradient.addColorStop(0.5, 'rgba(191, 90, 242, 0.08)');
        glowGradient.addColorStop(1, 'rgba(26, 15, 46, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, 800, 600);
    }

    /**
     * Generate logo: "VROOM VROOM" pixel art
     * Returns sprite with glowing neon effect
     */
    generateLogo() {
        this.canvas.width = 400;
        this.canvas.height = 80;
        const ctx = this.ctx;

        // Clear
        ctx.clearRect(0, 0, 400, 80);

        // Draw pixel text "VROOM VROOM"
        // Using 8x8 pixel font grid
        this.drawPixelText(ctx, 'VROOM', 20, 20, 8, this.palette.neonPink);
        this.drawPixelText(ctx, 'VROOM', 20, 50, 8, this.palette.neonTeal);

        // Add glow effect
        ctx.globalCompositeOperation = 'destination-over';
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.palette.neonPink;
        ctx.fillStyle = this.palette.neonPink;
        ctx.fillRect(0, 0, 400, 40);

        ctx.shadowColor = this.palette.neonTeal;
        ctx.fillStyle = this.palette.neonTeal;
        ctx.fillRect(0, 40, 400, 40);

        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;

        this.spriteSheets.logo = {
            name: 'vroomLogo',
            width: 400,
            height: 80,
            dataUrl: this.canvas.toDataURL('image/png')
        };

        return this.spriteSheets.logo;
    }

    /**
     * Generate UI frame borders (9-slice compatible)
     */
    generateUIFrame() {
        this.canvas.width = 48;
        this.canvas.height = 48;
        const ctx = this.ctx;

        // Clear
        ctx.clearRect(0, 0, 48, 48);

        // Corner pieces (16x16 each)
        // Top-left
        this.drawFrameCorner(ctx, 0, 0, 'tl');
        // Top-right
        this.drawFrameCorner(ctx, 32, 0, 'tr');
        // Bottom-left
        this.drawFrameCorner(ctx, 0, 32, 'bl');
        // Bottom-right
        this.drawFrameCorner(ctx, 32, 32, 'br');

        // Edge pieces
        // Top edge
        this.drawFrameEdge(ctx, 16, 0, 'h');
        // Bottom edge
        this.drawFrameEdge(ctx, 16, 32, 'h');
        // Left edge
        this.drawFrameEdge(ctx, 0, 16, 'v');
        // Right edge
        this.drawFrameEdge(ctx, 32, 16, 'v');

        this.spriteSheets.uiFrame = {
            name: 'uiFrame',
            width: 48,
            height: 48,
            sliceInfo: {
                cornerSize: 16,
                edgeSize: 16
            },
            dataUrl: this.canvas.toDataURL('image/png')
        };

        return this.spriteSheets.uiFrame;
    }

    drawFrameCorner(ctx, x, y, corner) {
        // Outer border (light)
        ctx.fillStyle = this.palette.uiFrameLight;

        if (corner === 'tl') {
            ctx.fillRect(x, y, 16, 2);
            ctx.fillRect(x, y, 2, 16);
        } else if (corner === 'tr') {
            ctx.fillRect(x, y, 16, 2);
            ctx.fillRect(x + 14, y, 2, 16);
        } else if (corner === 'bl') {
            ctx.fillRect(x, y + 14, 16, 2);
            ctx.fillRect(x, y, 2, 16);
        } else if (corner === 'br') {
            ctx.fillRect(x, y + 14, 16, 2);
            ctx.fillRect(x + 14, y, 2, 16);
        }

        // Inner fill
        ctx.fillStyle = this.palette.uiFrameDark;
        ctx.fillRect(x + 2, y + 2, 12, 12);

        // Accent dot
        ctx.fillStyle = this.palette.neonPink;
        ctx.fillRect(x + 6, y + 6, 2, 2);
    }

    drawFrameEdge(ctx, x, y, orientation) {
        ctx.fillStyle = this.palette.uiFrameLight;

        if (orientation === 'h') {
            ctx.fillRect(x, y, 16, 2);
            ctx.fillStyle = this.palette.uiFrameDark;
            ctx.fillRect(x, y + 2, 16, 14);
        } else {
            ctx.fillRect(x, y, 2, 16);
            ctx.fillStyle = this.palette.uiFrameDark;
            ctx.fillRect(x + 2, y, 14, 16);
        }
    }

    /**
     * Generate button sprite (3 states: normal, hover, active)
     */
    generateButton() {
        this.canvas.width = 200;
        this.canvas.height = 150; // 3 states × 50px height
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 200, 150);

        // Normal state
        this.drawButtonState(ctx, 0, 0, 'normal');

        // Hover state
        this.drawButtonState(ctx, 0, 50, 'hover');

        // Active/pressed state
        this.drawButtonState(ctx, 0, 100, 'active');

        this.spriteSheets.button = {
            name: 'uiButton',
            width: 200,
            height: 150,
            states: {
                normal: { y: 0, height: 50 },
                hover: { y: 50, height: 50 },
                active: { y: 100, height: 50 }
            },
            dataUrl: this.canvas.toDataURL('image/png')
        };

        return this.spriteSheets.button;
    }

    drawButtonState(ctx, x, y, state) {
        const colors = {
            normal: {
                bg: this.palette.uiFrameDark,
                border: this.palette.uiFrameLight,
                text: this.palette.neonPink
            },
            hover: {
                bg: this.palette.uiFrameMid,
                border: this.palette.neonPink,
                text: this.palette.uiHighlight
            },
            active: {
                bg: this.palette.neonPink,
                border: this.palette.uiHighlight,
                text: this.palette.uiFrameDark
            }
        };

        const c = colors[state];

        // Border
        ctx.fillStyle = c.border;
        ctx.fillRect(x, y, 200, 50);

        // Inner fill
        ctx.fillStyle = c.bg;
        ctx.fillRect(x + 2, y + 2, 196, 46);

        // Corner accents
        if (state === 'hover' || state === 'active') {
            ctx.fillStyle = c.border;
            ctx.fillRect(x + 4, y + 4, 2, 2);
            ctx.fillRect(x + 194, y + 4, 2, 2);
            ctx.fillRect(x + 4, y + 44, 2, 2);
            ctx.fillRect(x + 194, y + 44, 2, 2);
        }
    }

    /**
     * Generate icon set (save, load, settings, etc.)
     */
    generateIcons() {
        this.canvas.width = 192; // 32px × 6 icons
        this.canvas.height = 32;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 192, 32);

        // Save icon (floppy disk)
        this.drawSaveIcon(ctx, 0, 0);

        // Load icon (folder)
        this.drawLoadIcon(ctx, 32, 0);

        // Settings icon (gear)
        this.drawSettingsIcon(ctx, 64, 0);

        // Export icon (arrow up)
        this.drawExportIcon(ctx, 96, 0);

        // Import icon (arrow down)
        this.drawImportIcon(ctx, 128, 0);

        // Credits icon (star)
        this.drawCreditsIcon(ctx, 160, 0);

        this.spriteSheets.icons = {
            name: 'uiIcons',
            width: 192,
            height: 32,
            icons: {
                save: { x: 0, y: 0, size: 32 },
                load: { x: 32, y: 0, size: 32 },
                settings: { x: 64, y: 0, size: 32 },
                export: { x: 96, y: 0, size: 32 },
                import: { x: 128, y: 0, size: 32 },
                credits: { x: 160, y: 0, size: 32 }
            },
            dataUrl: this.canvas.toDataURL('image/png')
        };

        return this.spriteSheets.icons;
    }

    drawSaveIcon(ctx, x, y) {
        ctx.fillStyle = this.palette.neonPink;
        // Floppy outline
        ctx.fillRect(x + 4, y + 4, 24, 24);
        ctx.fillStyle = this.palette.uiFrameDark;
        ctx.fillRect(x + 6, y + 6, 20, 20);
        // Shutter
        ctx.fillStyle = this.palette.neonPink;
        ctx.fillRect(x + 8, y + 8, 16, 8);
        // Label area
        ctx.fillRect(x + 8, y + 18, 16, 6);
    }

    drawLoadIcon(ctx, x, y) {
        ctx.fillStyle = this.palette.neonTeal;
        // Folder shape
        ctx.fillRect(x + 4, y + 10, 24, 18);
        ctx.fillRect(x + 4, y + 8, 12, 4);
        // Folder detail
        ctx.fillStyle = this.palette.uiFrameDark;
        ctx.fillRect(x + 6, y + 12, 20, 14);
    }

    drawSettingsIcon(ctx, x, y) {
        ctx.fillStyle = this.palette.neonYellow;
        // Gear (simplified pixel version)
        ctx.fillRect(x + 12, y + 4, 8, 24); // vertical
        ctx.fillRect(x + 4, y + 12, 24, 8); // horizontal
        // Center hub
        ctx.fillStyle = this.palette.uiFrameDark;
        ctx.fillRect(x + 12, y + 12, 8, 8);
    }

    drawExportIcon(ctx, x, y) {
        ctx.fillStyle = this.palette.neonPurple;
        // Arrow up
        ctx.fillRect(x + 14, y + 4, 4, 20); // shaft
        ctx.fillRect(x + 10, y + 8, 12, 4); // arrowhead horizontal
        ctx.fillRect(x + 12, y + 6, 8, 2); // arrowhead tip
        // Base line
        ctx.fillRect(x + 6, y + 26, 20, 2);
    }

    drawImportIcon(ctx, x, y) {
        ctx.fillStyle = this.palette.neonPurple;
        // Arrow down
        ctx.fillRect(x + 14, y + 8, 4, 20); // shaft
        ctx.fillRect(x + 10, y + 20, 12, 4); // arrowhead horizontal
        ctx.fillRect(x + 12, y + 24, 8, 2); // arrowhead tip
        // Base line
        ctx.fillRect(x + 6, y + 4, 20, 2);
    }

    drawCreditsIcon(ctx, x, y) {
        ctx.fillStyle = this.palette.neonYellow;
        // Star (simplified 5-point)
        ctx.fillRect(x + 14, y + 4, 4, 24); // vertical
        ctx.fillRect(x + 4, y + 14, 24, 4); // horizontal
        ctx.fillRect(x + 8, y + 8, 16, 2); // diagonal 1
        ctx.fillRect(x + 8, y + 22, 16, 2); // diagonal 2
    }

    /**
     * Generate isometric character sprite (for preview in creation screen)
     */
    generateCharacterSprite(skinTone = 2, hairStyle = 'short', hairColor = '#3d2f1f') {
        this.canvas.width = 64;
        this.canvas.height = 64;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 64, 64);

        // Get skin color
        const skin = this.palette[`skin${skinTone + 1}`] || this.palette.skin3;

        // Draw isometric character (simplified pixel person)
        // Head
        ctx.fillStyle = skin;
        ctx.fillRect(24, 12, 16, 16);

        // Hair (depends on style)
        ctx.fillStyle = hairColor;
        if (hairStyle === 'short') {
            ctx.fillRect(24, 8, 16, 8);
        } else if (hairStyle === 'long') {
            ctx.fillRect(24, 8, 16, 12);
            ctx.fillRect(20, 16, 24, 4);
        } else if (hairStyle === 'bald') {
            // No hair
        } else {
            ctx.fillRect(24, 8, 16, 8);
        }

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(28, 18, 2, 2);
        ctx.fillRect(34, 18, 2, 2);

        // Body (prison jumpsuit orange)
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(20, 28, 24, 20);

        // Arms
        ctx.fillStyle = skin;
        ctx.fillRect(16, 32, 4, 12);
        ctx.fillRect(44, 32, 4, 12);

        // Legs
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(24, 48, 8, 12);
        ctx.fillRect(32, 48, 8, 12);

        this.spriteSheets.character = {
            name: 'characterPreview',
            width: 64,
            height: 64,
            dataUrl: this.canvas.toDataURL('image/png')
        };

        return this.spriteSheets.character;
    }

    /**
     * Draw pixel text (simple 8x8 bitmap font)
     */
    drawPixelText(ctx, text, x, y, size, color) {
        ctx.fillStyle = color;
        const charWidth = size;
        const charHeight = size;

        // Simple pixel font mapping (uppercase only)
        const font = this.getPixelFont();

        for (let i = 0; i < text.length; i++) {
            const char = text[i].toUpperCase();
            const pattern = font[char] || font['?'];

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (pattern[row] && pattern[row][col] === 1) {
                        ctx.fillRect(
                            x + i * (charWidth + 2) + col,
                            y + row,
                            1,
                            1
                        );
                    }
                }
            }
        }
    }

    /**
     * Pixel font bitmap (8x8 grid)
     */
    getPixelFont() {
        return {
            'V': [
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1],
                [0,1,0,0,0,0,1,0],
                [0,1,0,0,0,0,1,0],
                [0,0,1,0,0,1,0,0],
                [0,0,1,0,0,1,0,0],
                [0,0,0,1,1,0,0,0]
            ],
            'R': [
                [1,1,1,1,1,0,0,0],
                [1,0,0,0,0,1,0,0],
                [1,0,0,0,0,1,0,0],
                [1,1,1,1,1,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,0,1,0,0,0],
                [1,0,0,0,0,1,0,0],
                [1,0,0,0,0,0,1,0]
            ],
            'O': [
                [0,1,1,1,1,1,0,0],
                [1,0,0,0,0,0,1,0],
                [1,0,0,0,0,0,1,0],
                [1,0,0,0,0,0,1,0],
                [1,0,0,0,0,0,1,0],
                [1,0,0,0,0,0,1,0],
                [1,0,0,0,0,0,1,0],
                [0,1,1,1,1,1,0,0]
            ],
            'M': [
                [1,0,0,0,0,0,0,1],
                [1,1,0,0,0,0,1,1],
                [1,0,1,0,0,1,0,1],
                [1,0,0,1,1,0,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1]
            ],
            '?': [
                [1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1]
            ]
        };
    }

    /**
     * Export all sprite sheets as JSON manifest
     */
    exportManifest() {
        const manifest = {
            version: '1.0',
            created: new Date().toISOString(),
            palette: this.palette,
            sprites: {}
        };

        Object.keys(this.spriteSheets).forEach(key => {
            const sheet = this.spriteSheets[key];
            manifest.sprites[key] = {
                name: sheet.name,
                width: sheet.width,
                height: sheet.height,
                dataUrl: sheet.dataUrl,
                metadata: sheet.states || sheet.sliceInfo || sheet.icons || {}
            };
        });

        return JSON.stringify(manifest, null, 2);
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelArtGenerator;
}
