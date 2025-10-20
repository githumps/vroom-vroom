/**
 * VROOM VROOM - DRIVER'S LICENSE ASSETS
 * Stamp Sprites, Icons, and Visual Elements
 *
 * Version: 1.5.0
 * Last Updated: 2025-10-19
 *
 * CONTENTS:
 * - 15 bureaucratic stamps (VOID, REVOKED, etc.)
 * - 8 stat icons (money, hunger, strength, etc.)
 * - Cop inspection hand sprite
 * - Magnifying glass sprite
 * - Official seal patterns
 *
 * STYLE: Isometric pixel art, Papers Please aesthetic
 *
 * @artist isometric-pixel-artist agent
 */

const DriversLicenseAssets = {
    metadata: {
        version: "1.5.0",
        sprite_size: { stamp: "variable", icon: "12x12" },
        palette: "bureaucratic-documents",
        projection: "orthographic-top-down"
    },

    // COLOR PALETTE - BUREAUCRATIC INKS
    palette: {
        // Red stamp ink (most common)
        red_stamp: "#D84448",
        red_stamp_dark: "#B83838",
        red_stamp_fade: "#E88888",

        // Blue official ink
        blue_official: "#4A6AA8",
        blue_dark: "#3A5A88",
        blue_light: "#6A8AC8",

        // Purple inspection stamp
        purple_inspect: "#7A4A8A",
        purple_dark: "#6A3A7A",
        purple_light: "#9A6AAA",

        // Black text
        ink_black: "#2A2A2A",
        ink_gray: "#5A5A5A",

        // Stat icon colors
        money_green: "#6ABF69",
        hunger_yellow: "#FFD670",
        strength_red: "#B85450",
        intel_blue: "#6AB5FF",
        behavior_purple: "#9A6AAA",
        cig_orange: "#FF8C42"
    },

    /* ============================================
       STAMP COLLECTION (15 STAMPS)
       Format: SVG-style path data for canvas rendering
       ============================================ */

    stamps: {
        // 1. VOID - Large diagonal stamp
        VOID: {
            type: "text",
            text: "VOID",
            fontSize: 32,
            color: "#D84448",
            rotation: -15,
            letterSpacing: 4,
            border: false,
            shadow: true,
            positions: [
                { x: 120, y: 90 },  // Center
                { x: 220, y: 120 }  // Bottom right (for emphasis)
            ]
        },

        // 2. REVOKED - Official boxed stamp
        REVOKED: {
            type: "text-boxed",
            text: "REVOKED",
            fontSize: 20,
            color: "#D84448",
            rotation: 8,
            letterSpacing: 2,
            border: true,
            borderWidth: 3,
            padding: { x: 8, y: 4 },
            positions: [{ x: 180, y: 60 }]
        },

        // 3. DO NOT OPERATE
        DO_NOT_OPERATE: {
            type: "text-boxed",
            text: "DO NOT\nOPERATE",
            fontSize: 12,
            color: "#D84448",
            rotation: -8,
            letterSpacing: 1,
            border: true,
            borderWidth: 2,
            padding: { x: 6, y: 3 },
            positions: [{ x: 240, y: 40 }]
        },

        // 4. MENACE TO SOCIETY
        MENACE_TO_SOCIETY: {
            type: "text-boxed",
            text: "MENACE TO\nSOCIETY",
            fontSize: 10,
            color: "#7A4A8A",
            rotation: 12,
            letterSpacing: 0.5,
            border: true,
            borderWidth: 2,
            padding: { x: 4, y: 2 },
            positions: [{ x: 160, y: 140 }]
        },

        // 5. REPEAT OFFENDER
        REPEAT_OFFENDER: {
            type: "text",
            text: "REPEAT\nOFFENDER",
            fontSize: 14,
            color: "#B83838",
            rotation: -6,
            letterSpacing: 1,
            border: false,
            shadow: true,
            positions: [{ x: 140, y: 110 }]
        },

        // 6. DANGER
        DANGER: {
            type: "text-boxed",
            text: "DANGER",
            fontSize: 18,
            color: "#D84448",
            rotation: -12,
            letterSpacing: 2,
            border: true,
            borderWidth: 3,
            padding: { x: 8, y: 3 },
            positions: [{ x: 200, y: 80 }]
        },

        // 7. UNFIT TO DRIVE
        UNFIT_TO_DRIVE: {
            type: "text",
            text: "UNFIT TO\nDRIVE",
            fontSize: 11,
            color: "#4A6AA8",
            rotation: 10,
            letterSpacing: 1,
            border: false,
            shadow: false,
            positions: [{ x: 220, y: 100 }]
        },

        // 8. PERMANENTLY BANNED
        PERMANENTLY_BANNED: {
            type: "text-boxed",
            text: "PERMANENTLY\nBANNED",
            fontSize: 9,
            color: "#D84448",
            rotation: -5,
            letterSpacing: 0.5,
            border: true,
            borderWidth: 2,
            padding: { x: 4, y: 2 },
            positions: [{ x: 180, y: 130 }]
        },

        // 9. DENIED
        DENIED: {
            type: "text",
            text: "DENIED",
            fontSize: 24,
            color: "#B83838",
            rotation: 15,
            letterSpacing: 3,
            border: false,
            shadow: true,
            positions: [{ x: 160, y: 70 }]
        },

        // 10. SUSPENDED
        SUSPENDED: {
            type: "text-boxed",
            text: "SUSPENDED",
            fontSize: 16,
            color: "#7A4A8A",
            rotation: -10,
            letterSpacing: 1.5,
            border: true,
            borderWidth: 2,
            padding: { x: 6, y: 3 },
            positions: [{ x: 190, y: 95 }]
        },

        // 11. HIGH RISK
        HIGH_RISK: {
            type: "text",
            text: "HIGH\nRISK",
            fontSize: 14,
            color: "#D84448",
            rotation: 8,
            letterSpacing: 1,
            border: false,
            shadow: true,
            positions: [{ x: 240, y: 60 }]
        },

        // 12. CONFISCATED
        CONFISCATED: {
            type: "text-boxed",
            text: "CONFISCATED",
            fontSize: 12,
            color: "#4A6AA8",
            rotation: -7,
            letterSpacing: 1,
            border: true,
            borderWidth: 2,
            padding: { x: 5, y: 2 },
            positions: [{ x: 170, y: 120 }]
        },

        // 13. CAUTION
        CAUTION: {
            type: "text",
            text: "CAUTION",
            fontSize: 16,
            color: "#FFD670",
            rotation: 5,
            letterSpacing: 2,
            border: false,
            shadow: true,
            positions: [{ x: 210, y: 50 }]
        },

        // 14. OFFICIAL SEAL (circular stamp)
        OFFICIAL_SEAL: {
            type: "circular-seal",
            text: "DEPT OF\nMOTOR\nVEHICLES",
            fontSize: 6,
            color: "#4A6AA8",
            rotation: 0,
            radius: 20,
            borderWidth: 3,
            positions: [
                { x: 40, y: 150 },
                { x: 280, y: 30 }
            ]
        },

        // 15. INSPECTED (approval stamp - rare)
        INSPECTED: {
            type: "text",
            text: "INSPECTED",
            fontSize: 10,
            color: "#6ABF69",
            rotation: -3,
            letterSpacing: 1,
            border: false,
            shadow: false,
            positions: [{ x: 260, y: 140 }]
        }
    },

    /* ============================================
       STAT ICONS (12x12 PIXEL ART)
       Used in status bar at bottom of license
       ============================================ */

    statIcons: {
        // Money icon (dollar bill)
        money: {
            size: { width: 12, height: 12 },
            pixelData: [
                "  ██████████  ",
                " ████████████ ",
                "██░░██░░░░████",
                "██░░░░░░░░░░██",
                "██░░░███░░░░██",
                "██░░██░██░░░██",
                "██░░░███░░░░██",
                "██░░░░░░░░░░██",
                "████░░░░██░░██",
                " ████████████ ",
                "  ██████████  "
            ],
            colors: { "█": "#6ABF69", "░": "#2A2A2A" }
        },

        // Cigarette icon (currency in prison)
        cigarette: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                "            ",
                "  ░░░░░░░░  ",
                "  ████████░░",
                "  ██▓▓▓▓██░░",
                "  ██▓▓▓▓██  ",
                "  ████████  ",
                "    ████    ",
                "            ",
                "            "
            ],
            colors: { "█": "#F5E6D3", "▓": "#FFD670", "░": "#FF8C42" }
        },

        // Hunger icon (empty bowl)
        hunger: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                "            ",
                "   ██████   ",
                "  ██░░░░██  ",
                " ██░░░░░░██ ",
                " ██░░░░░░██ ",
                " ██░░░░░░██ ",
                "  ████████  ",
                "   ██████   ",
                "            "
            ],
            colors: { "█": "#5A5A5A", "░": "#2A2A2A" }
        },

        // Strength icon (flexed arm)
        strength: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                "   ████     ",
                "  ██░░██    ",
                " ██░░░░██   ",
                " ██░░░░████ ",
                "██░░░░░░░░██",
                "██░░░░░░░░██",
                " ██░░░░████ ",
                "  ██████    ",
                "            "
            ],
            colors: { "█": "#D4A88C", "░": "#B89268" }
        },

        // Intelligence icon (brain)
        intelligence: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                "   ██████   ",
                "  ██▓▓▓▓██  ",
                " ██▓▓░░▓▓██ ",
                "██▓▓░░░░▓▓██",
                "██▓▓░░░░▓▓██",
                " ██▓▓░░▓▓██ ",
                "  ██▓▓▓▓██  ",
                "   ██████   ",
                "            "
            ],
            colors: { "█": "#6AB5FF", "▓": "#4A95DF", "░": "#2A75BF" }
        },

        // Good behavior icon (star)
        behavior: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                "     ██     ",
                "    ████    ",
                "   ██░░██   ",
                "  ██░░░░██  ",
                " ████░░████ ",
                "██░░░░░░░░██",
                " ██░░░░░░██ ",
                "  ██░░░░██  ",
                "   ██████   "
            ],
            colors: { "█": "#9A6AAA", "░": "#7A4A8A" }
        },

        // Arrests icon (handcuffs)
        arrests: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                "  ████████  ",
                " ██░░░░░░██ ",
                " ██░░██░░██ ",
                " ██░░██░░██ ",
                " ██░░██░░██ ",
                " ██░░░░░░██ ",
                "  ████████  ",
                "            ",
                "            "
            ],
            colors: { "█": "#7A7A7A", "░": "#2A2A2A" }
        },

        // Prison days icon (calendar)
        days: {
            size: { width: 12, height: 12 },
            pixelData: [
                "            ",
                " ██████████ ",
                " ██████████ ",
                " ██░░░░░░██ ",
                " ██░██░██░██",
                " ██░██░██░██",
                " ██░░░░░░██ ",
                " ██░██░██░██",
                " ██████████ ",
                "            "
            ],
            colors: { "█": "#B85450", "░": "#2A2A2A" }
        }
    },

    /* ============================================
       COP INSPECTION SPRITES
       Hand with magnifying glass
       ============================================ */

    copHand: {
        // Cop's hand holding magnifying glass (64x64 sprite)
        size: { width: 64, height: 64 },
        pixelData: [
            "                                                                ",
            "                              ██████████                        ",
            "                          ████░░░░░░░░░░████                    ",
            "                        ██░░░░░░░░░░░░░░░░░░██                  ",
            "                      ██░░░░░░░░░░░░░░░░░░░░░░██                ",
            "                    ██░░░░░░░░░░░░░░░░░░░░░░░░░░██              ",
            "                    ██░░░░░░░░░░░░░░░░░░░░░░░░░░██              ",
            "                    ██░░░░░░░░░░░░░░░░░░░░░░░░░░██              ",
            "                      ██░░░░░░░░░░░░░░░░░░░░░░██                ",
            "                        ██░░░░░░░░░░░░░░░░░░██                  ",
            "                          ████░░░░░░░░░░████                    ",
            "                              ██████████                        ",
            "                                  ▓▓▓▓                          ",
            "                                  ▓▓▓▓                          ",
            "                                  ▓▓▓▓                          ",
            "                                  ▓▓▓▓                          ",
            "                            ██████████████                      ",
            "                          ██░░░░░░░░░░░░░░██                    ",
            "                        ██░░░░░░░░░░░░░░░░░░██                  ",
            "                      ██░░░░░░░░░░░░░░░░░░░░░░██                ",
            "                    ██░░░░░░░░░░░░░░░░░░░░░░░░░░██              ",
            "                    ██░░░░████░░░░░░░░████░░░░██                ",
            "                    ██░░██████░░░░░░░░██████░░██                ",
            "                    ██░░██████░░░░░░░░██████░░██                ",
            "                    ██░░░░████░░░░░░░░████░░░░██                ",
            "                    ██░░░░░░░░░░░░░░░░░░░░░░░░██                ",
            "                      ██░░░░░░░░░░░░░░░░░░░░██                  ",
            "                      ██░░░░░░░░░░░░░░░░░░░░██                  ",
            "                        ██░░░░░░░░░░░░░░░░██                    ",
            "                        ██░░░░░░░░░░░░░░░░██                    ",
            "                          ██░░░░░░░░░░░░██                      ",
            "                            ██████████████                      ",
            "                                ████                            "
        ],
        colors: {
            "█": "#3A3A3A",  // Magnifying glass frame (dark metal)
            "░": "#E8F4FF",  // Glass (transparent blue tint)
            "▓": "#5A4A3A",  // Handle (wood)
            "▒": "#D4A88C"   // Hand (skin tone)
        },
        animation: {
            frameCount: 1,
            duration: 2000,  // Static for 2 seconds during inspection
            slideIn: { from: { x: 0, y: 100 }, to: { x: 0, y: 0 }, duration: 800 }
        }
    },

    copFace: {
        // Suspicious cop face (48x48 sprite)
        size: { width: 48, height: 48 },
        pixelData: [
            "                  ████████████                  ",
            "              ████░░░░░░░░░░░░████              ",
            "            ██░░░░░░░░░░░░░░░░░░░░██            ",
            "          ██░░░░░░░░░░░░░░░░░░░░░░░░██          ",
            "        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░██        ",
            "        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░██        ",
            "      ██░░░░██████░░░░░░░░░░██████░░░░░░██      ",
            "      ██░░░░██▓▓██░░░░░░░░░░██▓▓██░░░░░░██      ",
            "      ██░░░░██▓▓██░░░░░░░░░░██▓▓██░░░░░░██      ",
            "      ██░░░░██████░░░░░░░░░░██████░░░░░░██      ",
            "      ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██      ",
            "      ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██      ",
            "        ██░░░░░░░░░░██████░░░░░░░░░░░░██        ",
            "        ██░░░░░░░░░░██████░░░░░░░░░░░░██        ",
            "        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░██        ",
            "          ██░░░░░░░░░░░░░░░░░░░░░░░░██          ",
            "          ██░░░░░░░░░░░░░░░░░░░░░░░░██          ",
            "            ██░░░░░░░░░░░░░░░░░░░░██            ",
            "            ██░░████████████████░░██            ",
            "              ██░░░░░░░░░░░░░░░░██              ",
            "                ████████████████                "
        ],
        colors: {
            "█": "#3A3A3A",  // Hair/uniform (dark)
            "░": "#D4A88C",  // Skin tone
            "▓": "#1A1A1A"   // Eyes (suspicious)
        },
        animation: {
            frameCount: 1,
            duration: 2000,
            slideIn: { from: { x: 100, y: 0 }, to: { x: 0, y: 0 }, duration: 500 }
        }
    },

    /* ============================================
       UTILITY FUNCTIONS FOR RENDERING
       ============================================ */

    /**
     * Render a stamp to canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} stampKey - Key from stamps object
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} opacity - Opacity (0-1)
     */
    renderStamp(ctx, stampKey, x, y, opacity = 0.85) {
        const stamp = this.stamps[stampKey];
        if (!stamp) return;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        ctx.rotate((stamp.rotation * Math.PI) / 180);

        ctx.font = `bold ${stamp.fontSize}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = `${stamp.letterSpacing}px`;

        // Draw border if needed
        if (stamp.border && stamp.type === "text-boxed") {
            const metrics = ctx.measureText(stamp.text);
            const width = metrics.width + stamp.padding.x * 2;
            const height = stamp.fontSize + stamp.padding.y * 2;

            ctx.strokeStyle = stamp.color;
            ctx.lineWidth = stamp.borderWidth;
            ctx.strokeRect(-width / 2, -height / 2, width, height);

            // Background tint
            ctx.fillStyle = stamp.color + "1A";  // 10% opacity
            ctx.fillRect(-width / 2, -height / 2, width, height);
        }

        // Draw shadow if needed
        if (stamp.shadow) {
            ctx.shadowColor = this.palette.red_stamp_dark;
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }

        // Draw text
        ctx.fillStyle = stamp.color;
        const lines = stamp.text.split('\n');
        const lineHeight = stamp.fontSize * 1.2;
        const startY = -(lines.length - 1) * lineHeight / 2;

        lines.forEach((line, index) => {
            ctx.fillText(line, 0, startY + index * lineHeight);
        });

        // Draw circular seal if needed
        if (stamp.type === "circular-seal") {
            ctx.beginPath();
            ctx.arc(0, 0, stamp.radius, 0, Math.PI * 2);
            ctx.strokeStyle = stamp.color;
            ctx.lineWidth = stamp.borderWidth;
            ctx.stroke();
        }

        ctx.restore();
    },

    /**
     * Render stat icon to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} iconKey - Key from statIcons object
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    renderIcon(ctx, iconKey, x, y) {
        const icon = this.statIcons[iconKey];
        if (!icon) return;

        ctx.save();
        const pixelSize = 1;  // 1:1 pixel rendering

        icon.pixelData.forEach((row, rowIndex) => {
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const char = row[colIndex];
                if (char === ' ') continue;

                const color = icon.colors[char];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x + colIndex * pixelSize,
                        y + rowIndex * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        });

        ctx.restore();
    },

    /**
     * Get random stamp based on arrest count
     * @param {number} arrestCount - Number of arrests
     * @returns {string} - Stamp key to apply
     */
    getStampForArrest(arrestCount) {
        const stampProgression = [
            { threshold: 1, stamps: ["CAUTION", "INSPECTED"] },
            { threshold: 2, stamps: ["HIGH_RISK", "SUSPENDED"] },
            { threshold: 3, stamps: ["REVOKED", "DANGER"] },
            { threshold: 4, stamps: ["DENIED", "UNFIT_TO_DRIVE"] },
            { threshold: 5, stamps: ["DO_NOT_OPERATE", "CONFISCATED"] },
            { threshold: 7, stamps: ["REPEAT_OFFENDER", "MENACE_TO_SOCIETY"] },
            { threshold: 10, stamps: ["PERMANENTLY_BANNED", "VOID"] }
        ];

        for (let i = stampProgression.length - 1; i >= 0; i--) {
            if (arrestCount >= stampProgression[i].threshold) {
                const stamps = stampProgression[i].stamps;
                return stamps[Math.floor(Math.random() * stamps.length)];
            }
        }

        return null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DriversLicenseAssets;
}
