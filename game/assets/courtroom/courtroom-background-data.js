// ==================== COURTROOM BACKGROUND PIXEL ART DATA ====================
// VROOM VROOM - Disco Elysium Inspired Courtroom Scene
// Isometric/Straight-on hybrid view for bureaucratic atmosphere
// Resolution: 800x600 base canvas

// BACKGROUND PALETTE (extends JUDGE_PALETTE with environmental colors)
const COURTROOM_PALETTE = {
    // Wood tones (mahogany judicial furniture)
    wood_dark: '#2a2015',
    wood_base: '#3d2f1f',
    wood_highlight: '#52403a',
    wood_grain: '#241810',

    // Stone walls (old courthouse)
    stone_dark: '#3d3936',
    stone_base: '#5a5450',
    stone_highlight: '#706b65',
    mortar: '#2a2726',

    // Paper/documents (aged, bureaucratic)
    paper_white: '#f5efe0',
    paper_aged: '#e8dcc8',
    paper_old: '#d4c4a8',
    ink_black: '#1a1612',
    ink_faded: '#4a403a',

    // Metal fixtures (lamps, rails)
    brass_dark: '#5a4a2a',
    brass_base: '#8a7040',
    brass_highlight: '#aa9060',
    iron_dark: '#2a2a2a',
    iron_base: '#4a4a4a',

    // Atmospheric lighting
    light_warm: '#ffd080',
    light_glow: '#ffe8b0',
    shadow_deep: '#1a1612',
    shadow_mid: '#2d2620',

    // Book spines (law library feel)
    book_red: '#6a2020',
    book_brown: '#4a3020',
    book_green: '#2a4030',
    book_blue: '#20304a',

    // Green desk lamp (classic banker's lamp)
    lamp_green: '#2a5a3a',
    lamp_glow: '#4a8a5a'
};

// BACKGROUND LAYER SYSTEM (parallax-ready layers)
class CourtroomBackground {
    constructor(width = 800, height = 600) {
        this.width = width;
        this.height = height;
        this.layers = this.buildLayers();
    }

    buildLayers() {
        return {
            // Layer 0: Deep background (wall, paneling)
            wall: this.buildWallLayer(),

            // Layer 1: Background props (law books, shelves)
            background_props: this.buildBackgroundProps(),

            // Layer 2: Judge's bench (main focal point)
            judges_bench: this.buildJudgesBench(),

            // Layer 3: Foreground props (defendant stand, railing)
            foreground_props: this.buildForegroundProps(),

            // Layer 4: Atmospheric effects (dust, light rays)
            atmosphere: this.buildAtmosphere()
        };
    }

    // WALL LAYER (wood paneling, stone walls)
    buildWallLayer() {
        const pixels = [];

        // Background gradient (dark to slightly less dark)
        for (let y = 0; y < this.height; y++) {
            const darkness = 0.3 + (y / this.height) * 0.2;
            const color = this.lerpColor(
                COURTROOM_PALETTE.shadow_deep,
                COURTROOM_PALETTE.stone_dark,
                darkness
            );
            pixels.push([0, y, this.width, 1, color]);
        }

        // Wood paneling (vertical planks, lower 2/3)
        const panelingStart = Math.floor(this.height * 0.33);
        const plankWidth = 60;

        for (let x = 0; x < this.width; x += plankWidth) {
            // Main plank
            pixels.push([x, panelingStart, plankWidth - 4, this.height - panelingStart, COURTROOM_PALETTE.wood_base]);

            // Plank shadow (left edge)
            pixels.push([x, panelingStart, 3, this.height - panelingStart, COURTROOM_PALETTE.wood_dark]);

            // Plank highlight (right edge)
            pixels.push([x + plankWidth - 6, panelingStart, 2, this.height - panelingStart, COURTROOM_PALETTE.wood_highlight]);

            // Wood grain (vertical lines)
            for (let y = panelingStart + 10; y < this.height; y += 20) {
                const grainLength = 8 + Math.floor(Math.random() * 12);
                pixels.push([x + 15, y, 1, grainLength, COURTROOM_PALETTE.wood_grain]);
                pixels.push([x + 35, y + 10, 1, grainLength, COURTROOM_PALETTE.wood_grain]);
            }
        }

        // Chair rail molding (horizontal divider)
        pixels.push([0, panelingStart - 8, this.width, 8, COURTROOM_PALETTE.wood_highlight]);
        pixels.push([0, panelingStart - 6, this.width, 2, COURTROOM_PALETTE.wood_dark]);

        return { pixels, parallaxFactor: 0.1 };
    }

    // BACKGROUND PROPS (law books, wall clock, frames)
    buildBackgroundProps() {
        const pixels = [];

        // Law book shelves (behind judge)
        const shelfY = 100;
        const shelfX = 150;

        for (let shelf = 0; shelf < 3; shelf++) {
            const y = shelfY + shelf * 60;

            // Shelf board
            pixels.push([shelfX, y + 40, 200, 6, COURTROOM_PALETTE.wood_dark]);

            // Books on shelf
            const bookColors = [
                COURTROOM_PALETTE.book_red,
                COURTROOM_PALETTE.book_brown,
                COURTROOM_PALETTE.book_green,
                COURTROOM_PALETTE.book_blue
            ];

            for (let book = 0; book < 12; book++) {
                const x = shelfX + 10 + book * 16;
                const height = 32 + Math.floor(Math.random() * 8);
                const color = bookColors[Math.floor(Math.random() * bookColors.length)];

                // Book spine
                pixels.push([x, y + 46 - height, 14, height, color]);

                // Book highlight (spine edge)
                pixels.push([x + 12, y + 46 - height, 2, height, this.lighten(color, 0.2)]);

                // Book text (title on spine)
                pixels.push([x + 3, y + 46 - height + 8, 1, 8, COURTROOM_PALETTE.paper_aged]);
                pixels.push([x + 3, y + 46 - height + 18, 1, 4, COURTROOM_PALETTE.paper_aged]);
            }
        }

        // Wall clock (bureaucratic time tracking)
        const clockX = 600;
        const clockY = 120;

        // Clock face (circular approximation in pixel art)
        pixels.push([clockX + 8, clockY, 24, 40, COURTROOM_PALETTE.wood_dark]); // outer
        pixels.push([clockX + 12, clockY + 4, 16, 32, COURTROOM_PALETTE.paper_white]); // face

        // Clock hands (showing 3:47 - arbitrary bureaucratic time)
        pixels.push([clockX + 20, clockY + 20, 8, 2, COURTROOM_PALETTE.ink_black]); // hour
        pixels.push([clockX + 20, clockY + 12, 2, 8, COURTROOM_PALETTE.ink_black]); // minute

        // Clock numbers (tiny pixel dots)
        const clockNumbers = [
            [clockX + 20, clockY + 6],  // 12
            [clockX + 26, clockY + 20], // 3
            [clockX + 20, clockY + 34], // 6
            [clockX + 14, clockY + 20]  // 9
        ];
        clockNumbers.forEach(([x, y]) => {
            pixels.push([x, y, 2, 2, COURTROOM_PALETTE.ink_black]);
        });

        // Framed portrait (stern founder)
        const frameX = 50;
        const frameY = 140;

        pixels.push([frameX, frameY, 80, 100, COURTROOM_PALETTE.wood_dark]); // frame
        pixels.push([frameX + 6, frameY + 6, 68, 88, COURTROOM_PALETTE.shadow_deep]); // portrait (silhouette)

        // Portrait figure (vague stern face)
        pixels.push([frameX + 30, frameY + 20, 26, 30, COURTROOM_PALETTE.stone_base]); // head
        pixels.push([frameX + 25, frameY + 48, 36, 40, COURTROOM_PALETTE.stone_dark]); // shoulders

        return { pixels, parallaxFactor: 0.3 };
    }

    // JUDGE'S BENCH (main focal point, detailed)
    buildJudgesBench() {
        const pixels = [];

        // Bench dimensions (elevated, imposing)
        const benchX = 0;
        const benchY = 380;
        const benchWidth = this.width;
        const benchHeight = 120;

        // Bench platform (elevated)
        pixels.push([benchX, benchY - 20, benchWidth, 20, COURTROOM_PALETTE.wood_dark]);

        // Main bench body
        pixels.push([benchX, benchY, benchWidth, benchHeight, COURTROOM_PALETTE.wood_base]);

        // Bench top (darker mahogany)
        pixels.push([benchX, benchY, benchWidth, 24, COURTROOM_PALETTE.wood_dark]);

        // Front panel (decorative molding)
        pixels.push([benchX, benchY + 24, benchWidth, 8, COURTROOM_PALETTE.wood_highlight]);
        pixels.push([benchX, benchY + 32, benchWidth, 4, COURTROOM_PALETTE.wood_dark]);

        // Wood grain texture on bench
        for (let x = 0; x < benchWidth; x += 80) {
            for (let y = benchY + 40; y < benchY + benchHeight; y += 16) {
                pixels.push([x + 20, y, 40, 2, COURTROOM_PALETTE.wood_grain]);
                pixels.push([x + 30, y + 8, 1, 6, COURTROOM_PALETTE.wood_dark]);
            }
        }

        // Gavel strike point (worn wood, center of bench)
        const gavelX = this.width / 2 - 30;
        const gavelY = benchY + 8;

        pixels.push([gavelX, gavelY, 60, 12, COURTROOM_PALETTE.wood_dark]); // worn area
        pixels.push([gavelX + 10, gavelY + 2, 40, 8, COURTROOM_PALETTE.wood_grain]); // impact marks

        // Desk lamp (green banker's lamp, classic)
        const lampX = 120;
        const lampY = benchY - 60;

        // Lamp base
        pixels.push([lampX, lampY + 50, 20, 6, COURTROOM_PALETTE.brass_dark]);

        // Lamp stem
        pixels.push([lampX + 8, lampY + 20, 4, 30, COURTROOM_PALETTE.brass_base]);

        // Lamp shade (green glass)
        pixels.push([lampX, lampY, 36, 24, COURTROOM_PALETTE.lamp_green]);
        pixels.push([lampX + 4, lampY + 4, 28, 16, COURTROOM_PALETTE.lamp_glow]); // glow

        // Lamp light (warm glow on desk)
        pixels.push([lampX - 20, benchY + 4, 76, 8, 'rgba(255, 208, 128, 0.3)']);

        // Paperwork stacks (left side)
        const stackX = 30;
        const stackY = benchY + 8;

        for (let stack = 0; stack < 3; stack++) {
            const x = stackX + stack * 25;
            const height = 30 + Math.floor(Math.random() * 10);

            // Paper stack
            pixels.push([x, stackY, 20, height, COURTROOM_PALETTE.paper_aged]);

            // Stack layers (showing multiple pages)
            for (let layer = 0; layer < height; layer += 3) {
                pixels.push([x, stackY + layer, 20, 1, COURTROOM_PALETTE.paper_old]);
            }

            // Stack shadow
            pixels.push([x - 2, stackY, 2, height, COURTROOM_PALETTE.shadow_mid]);
        }

        // Law books (right side, thick tomes)
        const lawBookX = this.width - 120;

        for (let book = 0; book < 2; book++) {
            const x = lawBookX + book * 45;
            const y = benchY + 8;

            // Book
            pixels.push([x, y, 40, 48, COURTROOM_PALETTE.book_red]);
            pixels.push([x + 38, y, 2, 48, COURTROOM_PALETTE.wood_dark]); // spine edge
            pixels.push([x + 2, y + 2, 36, 44, this.darken(COURTROOM_PALETTE.book_red, 0.2)]); // cover

            // Gold text (title)
            pixels.push([x + 10, y + 12, 20, 2, COURTROOM_PALETTE.brass_highlight]);
            pixels.push([x + 10, y + 18, 16, 2, COURTROOM_PALETTE.brass_highlight]);
        }

        return { pixels, parallaxFactor: 0.5 };
    }

    // FOREGROUND PROPS (defendant stand, railing, evidence table)
    buildForegroundProps() {
        const pixels = [];

        // Defendant's stand (lower right, partial view)
        const standX = this.width - 180;
        const standY = 440;

        pixels.push([standX, standY, 140, 80, COURTROOM_PALETTE.wood_base]);
        pixels.push([standX, standY, 140, 6, COURTROOM_PALETTE.wood_dark]); // top edge
        pixels.push([standX, standY + 6, 4, 74, COURTROOM_PALETTE.wood_dark]); // left edge

        // Microphone on stand
        pixels.push([standX + 60, standY - 40, 4, 40, COURTROOM_PALETTE.iron_dark]); // mic stand
        pixels.push([standX + 54, standY - 48, 16, 8, COURTROOM_PALETTE.iron_base]); // mic head

        // Evidence table (lower left, partial view)
        const evidenceX = 40;
        const evidenceY = 480;

        pixels.push([evidenceX, evidenceY, 100, 60, COURTROOM_PALETTE.wood_base]);

        // Evidence items (vague shapes - driving-related)
        // License plate
        pixels.push([evidenceX + 10, evidenceY + 10, 30, 12, COURTROOM_PALETTE.paper_white]);
        pixels.push([evidenceX + 12, evidenceY + 12, 26, 8, COURTROOM_PALETTE.ink_black]);

        // Paperwork scattered
        pixels.push([evidenceX + 45, evidenceY + 8, 20, 28, COURTROOM_PALETTE.paper_aged]);
        pixels.push([evidenceX + 50, evidenceY + 15, 18, 24, COURTROOM_PALETTE.paper_white]);

        // Rubber stamp
        pixels.push([evidenceX + 72, evidenceY + 20, 16, 12, COURTROOM_PALETTE.wood_dark]);
        pixels.push([evidenceX + 74, evidenceY + 28, 12, 4, COURTROOM_PALETTE.iron_base]);

        return { pixels, parallaxFactor: 0.8 };
    }

    // ATMOSPHERIC EFFECTS (dust particles, light rays, film grain)
    buildAtmosphere() {
        const pixels = [];

        // Light rays (from high windows, implied)
        const rays = [
            { x: 200, width: 120, opacity: 0.1 },
            { x: 400, width: 100, opacity: 0.08 },
            { x: 600, width: 80, opacity: 0.06 }
        ];

        rays.forEach(ray => {
            for (let y = 0; y < 300; y += 4) {
                const width = ray.width + (y / 300) * 40; // widen as it goes down
                const x = ray.x - width / 2;
                pixels.push([x, y, width, 2, `rgba(255, 232, 176, ${ray.opacity})`]);
            }
        });

        // Dust particles (floating, atmospheric)
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = 1 + Math.floor(Math.random() * 2);
            const brightness = Math.random() * 0.4 + 0.2;

            pixels.push([x, y, size, size, `rgba(138, 127, 111, ${brightness})`]);
        }

        // Film grain (static overlay, randomized each frame)
        // Note: This should be regenerated each frame for authentic grain
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const brightness = Math.random() > 0.5 ? 255 : 0;
            const opacity = Math.random() * 0.15;

            pixels.push([x, y, 1, 1, `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`]);
        }

        return { pixels, parallaxFactor: 0, animated: true };
    }

    // HELPER: Color lerp
    lerpColor(color1, color2, t) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);

        const r = Math.floor(c1.r + (c2.r - c1.r) * t);
        const g = Math.floor(c1.g + (c2.g - c1.g) * t);
        const b = Math.floor(c1.b + (c2.b - c1.b) * t);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // HELPER: Lighten color
    lighten(color, amount) {
        const rgb = this.hexToRgb(color);
        const r = Math.min(255, rgb.r + Math.floor(255 * amount));
        const g = Math.min(255, rgb.g + Math.floor(255 * amount));
        const b = Math.min(255, rgb.b + Math.floor(255 * amount));
        return `rgb(${r}, ${g}, ${b})`;
    }

    // HELPER: Darken color
    darken(color, amount) {
        const rgb = this.hexToRgb(color);
        const r = Math.max(0, rgb.r - Math.floor(255 * amount));
        const g = Math.max(0, rgb.g - Math.floor(255 * amount));
        const b = Math.max(0, rgb.b - Math.floor(255 * amount));
        return `rgb(${r}, ${g}, ${b})`;
    }

    // HELPER: Hex to RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    // Render all layers to canvas
    render(ctx, parallaxOffset = { x: 0, y: 0 }) {
        const layerOrder = ['wall', 'background_props', 'judges_bench', 'foreground_props', 'atmosphere'];

        layerOrder.forEach(layerName => {
            const layer = this.layers[layerName];
            if (!layer) return;

            ctx.save();

            // Apply parallax
            const offsetX = parallaxOffset.x * layer.parallaxFactor;
            const offsetY = parallaxOffset.y * layer.parallaxFactor;
            ctx.translate(offsetX, offsetY);

            // Render pixels
            layer.pixels.forEach(pixel => {
                const [x, y, width, height, color] = pixel;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, width, height);
            });

            ctx.restore();
        });
    }
}

// EXPORT
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COURTROOM_PALETTE,
        CourtroomBackground
    };
}
