// CHARACTER PREVIEW SYSTEM - PIXEL ART RENDERER
// Canvas-based pixel art character sprite rendering
// Uses CharacterSprites data from game/assets/sidescroller/character-sprites.js

class CharacterPreviewRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        // Disable anti-aliasing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Default character properties
        this.character = {
            faceShape: 'oval',
            skinTone: 2, // 0-5 scale
            hairStyle: 'short',
            hairColor: '#3d2f1f',
            eyeColor: '#4a5a6b',
            facialFeature: 'clean-shaven',
            scar: 'none',
            bodyType: 'average'
        };

        this.animationFrame = 0;
        this.breathing = 0;
        this.animationLoop = null;

        this.startAnimation();
    }

    updateCharacter(properties) {
        Object.assign(this.character, properties);
        this.draw();
    }

    startAnimation() {
        const animate = () => {
            this.animationFrame++;
            // Subtle breathing animation (4 frames @ 800ms = 3.2s cycle)
            const breathingSpeed = 0.025;
            this.breathing = Math.sin(this.animationFrame * breathingSpeed) * 2;

            this.draw();
            this.animationLoop = requestAnimationFrame(animate);
        };
        animate();
    }

    draw() {
        // Clear canvas with dark background
        this.ctx.fillStyle = '#1a1612';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Check if CharacterSprites is available
        if (typeof CharacterSprites === 'undefined') {
            this.drawFallback();
            return;
        }

        // Get character sprite data
        const spriteData = CharacterSprites.base_character;
        const palette = CharacterSprites.palette;

        // Get skin tone colors (0-5 maps to skin_1 through skin_6)
        const skinToneIndex = this.character.skinTone + 1;
        const skinKey = `skin_${skinToneIndex}`;

        // Build color map for rendering
        const colorMap = {
            '█': palette.hair_black,                    // Hair (darkest)
            '▓': palette[`${skinKey}_shadow`],          // Skin shadow
            '▒': palette[`${skinKey}_mid`],             // Skin mid-tone
            '░': palette[`${skinKey}_light`],           // Skin highlight
            '██': palette.orange_shadow,                 // Uniform shadow
            '▓▓': palette.orange_mid,                    // Uniform mid-tone
            '▒▒': palette.orange_bright,                 // Uniform highlight
            '░░': palette.orange_highlight,              // Uniform bright
            '  ': 'transparent'
        };

        // Calculate pixel size and position
        const spriteWidth = 64;
        const spriteHeight = 96;
        const pixelSize = Math.min(
            (this.width * 0.8) / spriteWidth,
            (this.height * 0.9) / spriteHeight
        );

        const startX = (this.width - (spriteWidth * pixelSize)) / 2;
        const startY = (this.height - (spriteHeight * pixelSize)) / 2 + this.breathing;

        // Render pixel art
        this.renderPixelArt(spriteData.pixelData, colorMap, startX, startY, pixelSize);

        // Add vignette effect
        this.drawVignette();
    }

    renderPixelArt(pixelData, colorMap, startX, startY, pixelSize) {
        pixelData.forEach((line, y) => {
            for (let x = 0; x < line.length; x += 2) {
                const char = line.substr(x, 2);

                // Try two-character symbols first, then single character
                let color = colorMap[char];
                if (!color && char[0] !== ' ') {
                    color = colorMap[char[0]] || colorMap[char[1]];
                }

                if (color && color !== 'transparent') {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        startX + (x / 2) * pixelSize,
                        startY + y * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        });
    }

    drawFallback() {
        // Fallback if CharacterSprites not loaded
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = '16px monospace';
        this.ctx.fillText('Character sprites not loaded', 20, this.height / 2);
    }

    drawVignette() {
        // Radial gradient vignette (dark edges)
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, this.width * 0.3,
            this.width / 2, this.height / 2, this.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.6)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    destroy() {
        if (this.animationLoop) {
            cancelAnimationFrame(this.animationLoop);
            this.animationLoop = null;
        }
    }
}
