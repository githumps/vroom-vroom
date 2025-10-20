// VROOM VROOM - Sidescroller Pixel Art Renderer Utilities
// Utilities for rendering pixel-perfect sprites in the sidescroller

class SidescrollerRenderer {
    constructor() {
        // Disco Elysium color palette
        this.colors = {
            // Sky/atmosphere
            skyBlue: '#8B9DC3',
            skyDark: '#6A7A8A',
            fog: 'rgba(139, 157, 195, 0.3)',

            // Buildings
            buildingDark: '#3A3A3A',
            buildingMid: '#5A5A5A',
            buildingLight: '#7A7A7A',
            buildingAccent: '#4A5A6A',

            // Roads
            asphalt: '#3A3A3A',
            asphaltDark: '#2A2A2A',
            roadLine: '#9A9A4A',
            sidewalk: '#5A5A4A',

            // Vehicles
            carRed: '#8B3A3A',
            carBlue: '#3A5A7A',
            carGreen: '#4A6A4A',
            carYellow: '#9A8A4A',
            carGray: '#5A5A5A',
            policeBlue: '#3A5A7A',
            policeLightRed: '#FF0000',
            policeLightBlue: '#0000FF',

            // Vehicle details
            window: '#2A2A2E',
            windowLight: '#5A5A6E',
            tire: '#1A1A1A',
            tireRubber: '#3A3A3A',
            chrome: '#AAAAAA',
            shadow: '#1A1A1E',

            // Particles
            dustBrown: '#8A7A6A',
            smoke: '#5A5A5A',
            sparkYellow: '#FFAA00',
        };

        console.log('[SidescrollerRenderer] Initialized with Disco Elysium palette');
    }

    // === SPRITE RENDERING ===

    // Draw a simple car sprite (placeholder until full sprite system)
    drawCarSprite(ctx, x, y, width, height, color, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Car body (main color)
        ctx.fillStyle = color;
        ctx.fillRect(-width / 2, -height / 2, width, height);

        // Windows (dark)
        const windowInset = 4;
        ctx.fillStyle = this.colors.window;
        ctx.fillRect(-width / 2 + windowInset, -height / 2 + 2, width / 3, height - 4);
        ctx.fillRect(width / 6, -height / 2 + 2, width / 3, height - 4);

        // Window highlights (subtle)
        ctx.fillStyle = this.colors.windowLight;
        ctx.fillRect(-width / 2 + windowInset, -height / 2 + 2, width / 3, 2);

        // Wheels (black circles)
        const wheelRadius = 3;
        const wheelOffsetX = width / 2 - 6;
        const wheelOffsetY = height / 2;

        ctx.fillStyle = this.colors.tire;
        // Front wheels
        ctx.beginPath();
        ctx.arc(-wheelOffsetX, -wheelOffsetY + 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-wheelOffsetX, wheelOffsetY - 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        // Back wheels
        ctx.beginPath();
        ctx.arc(wheelOffsetX, -wheelOffsetY + 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wheelOffsetX, wheelOffsetY - 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();

        // Chrome details
        ctx.fillStyle = this.colors.chrome;
        ctx.fillRect(-width / 2, -height / 2, width, 1);
        ctx.fillRect(-width / 2, height / 2 - 1, width, 1);

        ctx.restore();
    }

    // Draw police car with flashing lights
    drawPoliceCar(ctx, x, y, width, height, flashingLights = false) {
        ctx.save();
        ctx.translate(x, y);

        // Police car body (blue)
        ctx.fillStyle = this.colors.policeBlue;
        ctx.fillRect(-width / 2, -height / 2, width, height);

        // Windows
        ctx.fillStyle = this.colors.window;
        ctx.fillRect(-width / 2 + 4, -height / 2 + 2, width / 3, height - 4);
        ctx.fillRect(width / 6, -height / 2 + 2, width / 3, height - 4);

        // Flashing lights on roof
        if (flashingLights) {
            const lightHeight = 4;
            const lightWidth = 8;
            const roofY = -height / 2 - lightHeight - 2;

            // Red light (left)
            ctx.fillStyle = this.colors.policeLightRed;
            ctx.fillRect(-10, roofY, lightWidth, lightHeight);

            // Blue light (right)
            ctx.fillStyle = this.colors.policeLightBlue;
            ctx.fillRect(2, roofY, lightWidth, lightHeight);

            // Light glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = flashingLights ? this.colors.policeLightRed : this.colors.policeLightBlue;
            ctx.fillRect(-10, roofY, lightWidth, lightHeight);
            ctx.shadowBlur = 0;
        }

        // Wheels
        const wheelRadius = 3;
        ctx.fillStyle = this.colors.tire;
        ctx.beginPath();
        ctx.arc(-width / 2 + 6, -height / 2 + 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-width / 2 + 6, height / 2 - 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width / 2 - 6, -height / 2 + 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width / 2 - 6, height / 2 - 2, wheelRadius, 0, Math.PI * 2);
        ctx.fill();

        // Police markings
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('POLICE', 0, 2);

        ctx.restore();
    }

    // === ENVIRONMENT RENDERING ===

    // Draw parallax building silhouette
    drawBuilding(ctx, x, y, width, height, shade = 0) {
        const color = [this.colors.buildingDark, this.colors.buildingMid, this.colors.buildingLight][shade] || this.colors.buildingMid;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);

        // Windows (simple grid)
        ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
        const windowCols = Math.floor(width / 12);
        const windowRows = Math.floor(height / 16);

        for (let row = 1; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                const wx = x + col * 12 + 4;
                const wy = y + row * 16 + 4;
                const lit = Math.random() > 0.5; // Random lit windows
                if (lit) {
                    ctx.fillRect(wx, wy, 6, 8);
                }
            }
        }
    }

    // Draw road with center line
    drawRoad(ctx, x, y, width, height, cameraOffset = 0) {
        // Asphalt
        ctx.fillStyle = this.colors.asphalt;
        ctx.fillRect(x, y, width, height);

        // Center dashed line
        ctx.strokeStyle = this.colors.roadLine;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -cameraOffset * 0.5; // Animate with camera
        ctx.beginPath();
        ctx.moveTo(x, y + height / 2);
        ctx.lineTo(x + width, y + height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Road edges (darker)
        ctx.fillStyle = this.colors.asphaltDark;
        ctx.fillRect(x, y, width, 2);
        ctx.fillRect(x, y + height - 2, width, 2);
    }

    // Draw ground/sidewalk
    drawGround(ctx, x, y, width, height) {
        ctx.fillStyle = this.colors.sidewalk;
        ctx.fillRect(x, y, width, height);

        // Texture (simple noise pattern)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 50; i++) {
            const px = x + Math.random() * width;
            const py = y + Math.random() * height;
            ctx.fillRect(px, py, 1, 1);
        }
    }

    // === PARTICLE RENDERING ===

    // Draw dust particle
    drawDustParticle(ctx, x, y, size, alpha = 1.0) {
        ctx.fillStyle = this.colors.dustBrown;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.globalAlpha = 1.0;
    }

    // Draw smoke particle
    drawSmokeParticle(ctx, x, y, size, alpha = 1.0) {
        ctx.fillStyle = this.colors.smoke;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    // Draw spark particle (for collisions)
    drawSparkParticle(ctx, x, y, size, alpha = 1.0) {
        ctx.fillStyle = this.colors.sparkYellow;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.globalAlpha = 1.0;
    }

    // === EFFECTS ===

    // Draw motion blur (speed lines)
    drawMotionBlur(ctx, x, y, speed, direction = 1) {
        const lineCount = Math.floor(speed / 10);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        for (let i = 0; i < lineCount; i++) {
            const offsetY = (Math.random() - 0.5) * 40;
            const length = Math.random() * 20 + 10;
            ctx.beginPath();
            ctx.moveTo(x - length * direction, y + offsetY);
            ctx.lineTo(x, y + offsetY);
            ctx.stroke();
        }
    }

    // Draw shadow (simple ellipse)
    drawShadow(ctx, x, y, width, height, alpha = 0.3) {
        ctx.fillStyle = this.colors.shadow;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    // Draw screen shake overlay
    drawScreenShake(ctx, intensity = 5) {
        const offsetX = (Math.random() - 0.5) * intensity;
        const offsetY = (Math.random() - 0.5) * intensity;
        ctx.translate(offsetX, offsetY);
    }

    // === TEXT RENDERING ===

    // Draw pixel-perfect text
    drawPixelText(ctx, text, x, y, color = '#FFFFFF', size = 16) {
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.fillText(text, x, y);
    }

    // Draw outlined text (for visibility)
    drawOutlinedText(ctx, text, x, y, fillColor = '#FFFFFF', outlineColor = '#000000', size = 16) {
        ctx.font = `bold ${size}px monospace`;
        ctx.textAlign = 'center';

        // Outline
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 3;
        ctx.strokeText(text, x, y);

        // Fill
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
    }

    // === UTILITY ===

    // Get color from palette
    getColor(name) {
        return this.colors[name] || '#FFFFFF';
    }

    // Darken color (for shading)
    darkenColor(color, amount = 0.5) {
        const rgb = this.hexToRgb(color);
        return `rgb(${Math.floor(rgb.r * amount)}, ${Math.floor(rgb.g * amount)}, ${Math.floor(rgb.b * amount)})`;
    }

    // Lighten color (for highlights)
    lightenColor(color, amount = 1.5) {
        const rgb = this.hexToRgb(color);
        return `rgb(${Math.min(255, Math.floor(rgb.r * amount))}, ${Math.min(255, Math.floor(rgb.g * amount))}, ${Math.min(255, Math.floor(rgb.b * amount))})`;
    }

    // Convert hex to RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidescrollerRenderer;
}
