// ==================== PAPERWORK UI PIXEL ART DATA ====================
// VROOM VROOM - Bureaucratic Form Interface Assets
// Disco Elysium inspired aged paper textures and bureaucratic UI elements

// UI PALETTE (extends courtroom palette)
const PAPERWORK_PALETTE = {
    // Paper textures (aged, coffee-stained bureaucracy)
    paper_white: '#f5efe0',
    paper_cream: '#ede5d0',
    paper_aged: '#e8dcc8',
    paper_stained: '#d4c4a8',
    paper_old: '#c0b098',

    // Coffee stains
    stain_light: '#d4b89a',
    stain_medium: '#a68860',
    stain_dark: '#7a5a3a',

    // Ink (typed and handwritten)
    ink_black: '#1a1612',
    ink_faded: '#4a403a',
    ink_blue: '#2a3a5a',
    ink_red: '#6a2020', // corrections/stamps

    // Form elements
    line_grey: '#8a8270',
    checkbox_empty: '#6a6050',
    checkbox_filled: '#1a1612',

    // Stamps (bureaucratic approval)
    stamp_red: '#aa2020',
    stamp_green: '#2a6a3a',
    stamp_blue: '#2a4a7a',

    // Signatures
    signature_blue: '#2a3a6a',
    signature_black: '#1a1612',

    // Highlighting (bureaucrat's marker)
    highlight_yellow: 'rgba(255, 240, 100, 0.4)',
    highlight_pink: 'rgba(255, 180, 200, 0.3)'
};

// FORM BACKGROUND TEXTURE (aged paper with subtle detail)
class PaperTexture {
    static generate(width, height) {
        const pixels = [];

        // Base paper color (gradient from cream to aged)
        for (let y = 0; y < height; y++) {
            const ageGradient = y / height;
            const color = this.lerpColor(
                PAPERWORK_PALETTE.paper_cream,
                PAPERWORK_PALETTE.paper_aged,
                ageGradient * 0.3
            );
            pixels.push([0, y, width, 1, color]);
        }

        // Paper fiber texture (tiny dots)
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 1;
            pixels.push([x, y, size, size, PAPERWORK_PALETTE.paper_stained]);
        }

        // Coffee stains (random organic shapes)
        const stainCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < stainCount; i++) {
            const centerX = Math.random() * width;
            const centerY = Math.random() * height;
            const radius = 20 + Math.random() * 40;

            // Organic stain shape (irregular circle)
            for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                const variance = 0.7 + Math.random() * 0.6;
                const r = radius * variance;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;

                // Gradient from center (darker) to edge (lighter)
                for (let layer = 0; layer < r; layer += 2) {
                    const lx = centerX + Math.cos(angle) * layer;
                    const ly = centerY + Math.sin(angle) * layer;
                    const intensity = 1 - (layer / r);

                    const color = intensity > 0.6 ? PAPERWORK_PALETTE.stain_dark :
                                  intensity > 0.3 ? PAPERWORK_PALETTE.stain_medium :
                                  PAPERWORK_PALETTE.stain_light;

                    pixels.push([lx, ly, 2, 2, color]);
                }
            }
        }

        // Crease lines (folded paper)
        const creaseY = height / 2;
        for (let x = 0; x < width; x += 2) {
            const offset = Math.sin(x * 0.1) * 2;
            pixels.push([x, creaseY + offset, 2, 1, PAPERWORK_PALETTE.line_grey]);
        }

        // Page edges (slightly darker)
        pixels.push([0, 0, width, 2, PAPERWORK_PALETTE.paper_old]); // top
        pixels.push([0, height - 2, width, 2, PAPERWORK_PALETTE.paper_old]); // bottom
        pixels.push([0, 0, 2, height, PAPERWORK_PALETTE.paper_old]); // left
        pixels.push([width - 2, 0, 2, height, PAPERWORK_PALETTE.paper_old]); // right

        return pixels;
    }

    static lerpColor(color1, color2, t) {
        // Simple lerp (assumes hex colors)
        return color1; // Simplified for this example
    }
}

// FORM HEADER (official government letterhead)
class FormHeader {
    static render(x, y, width, title) {
        const pixels = [];

        // Official seal (circular government emblem)
        const sealX = x + 20;
        const sealY = y + 20;
        const sealRadius = 24;

        // Seal circle (outer ring)
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const px = sealX + Math.cos(angle) * sealRadius;
            const py = sealY + Math.sin(angle) * sealRadius;
            pixels.push([px, py, 2, 2, PAPERWORK_PALETTE.ink_blue]);
        }

        // Inner circle
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const px = sealX + Math.cos(angle) * (sealRadius - 6);
            const py = sealY + Math.sin(angle) * (sealRadius - 6);
            pixels.push([px, py, 1, 1, PAPERWORK_PALETTE.ink_blue]);
        }

        // Seal text (simplified "OFFICIAL")
        pixels.push([sealX - 12, sealY - 3, 24, 2, PAPERWORK_PALETTE.ink_blue]);
        pixels.push([sealX - 12, sealY + 3, 24, 2, PAPERWORK_PALETTE.ink_blue]);

        // Form title (centered, bold typewriter font)
        const titleX = x + 80;
        const titleY = y + 15;

        // Title background (slightly darker)
        pixels.push([titleX, titleY, width - 100, 24, PAPERWORK_PALETTE.paper_aged]);

        // Title text (represented as bold rectangles)
        // "TRAFFIC VIOLATION REPORT"
        const letterWidth = 8;
        const letterSpacing = 2;
        const titleLength = title.length || 24;

        for (let i = 0; i < titleLength; i++) {
            const lx = titleX + 10 + i * (letterWidth + letterSpacing);
            pixels.push([lx, titleY + 6, letterWidth, 12, PAPERWORK_PALETTE.ink_black]);
            // Bold effect (double width)
            pixels.push([lx + 1, titleY + 6, letterWidth - 2, 12, PAPERWORK_PALETTE.ink_black]);
        }

        // Form number (top right)
        const formNumX = x + width - 80;
        pixels.push([formNumX, y + 5, 70, 2, PAPERWORK_PALETTE.ink_faded]);
        pixels.push([formNumX, y + 10, 70, 2, PAPERWORK_PALETTE.ink_faded]);

        // Horizontal line under header
        pixels.push([x, y + 50, width, 2, PAPERWORK_PALETTE.line_grey]);
        pixels.push([x, y + 53, width, 1, PAPERWORK_PALETTE.ink_black]);

        return pixels;
    }
}

// FORM FIELD (text input line with label)
class FormField {
    static render(x, y, width, label, value = '') {
        const pixels = [];

        // Label (typed, all caps)
        const labelWidth = label.length * 6;
        for (let i = 0; i < label.length; i++) {
            const lx = x + i * 6;
            pixels.push([lx, y, 5, 8, PAPERWORK_PALETTE.ink_black]);
        }

        // Input line (underscored)
        const lineY = y + 12;
        pixels.push([x + labelWidth + 10, lineY, width - labelWidth - 10, 1, PAPERWORK_PALETTE.line_grey]);

        // Value (handwritten style if filled)
        if (value) {
            const valueX = x + labelWidth + 15;
            for (let i = 0; i < value.length; i++) {
                const vx = valueX + i * 7;
                const vy = lineY - 8;
                // Slightly messy handwriting (offset varies)
                const yOffset = Math.floor(Math.random() * 3) - 1;
                pixels.push([vx, vy + yOffset, 6, 9, PAPERWORK_PALETTE.ink_blue]);
            }
        }

        return pixels;
    }
}

// CHECKBOX (square, empty or checked)
class Checkbox {
    static render(x, y, checked = false, label = '') {
        const pixels = [];

        // Box outline
        pixels.push([x, y, 12, 12, PAPERWORK_PALETTE.checkbox_empty]);
        pixels.push([x + 1, y + 1, 10, 10, PAPERWORK_PALETTE.paper_white]); // inner white

        // Check mark (if checked)
        if (checked) {
            // X mark (pixel art style)
            pixels.push([x + 3, y + 3, 2, 2, PAPERWORK_PALETTE.checkbox_filled]);
            pixels.push([x + 5, y + 5, 2, 2, PAPERWORK_PALETTE.checkbox_filled]);
            pixels.push([x + 7, y + 7, 2, 2, PAPERWORK_PALETTE.checkbox_filled]);

            pixels.push([x + 7, y + 3, 2, 2, PAPERWORK_PALETTE.checkbox_filled]);
            pixels.push([x + 5, y + 5, 2, 2, PAPERWORK_PALETTE.checkbox_filled]);
            pixels.push([x + 3, y + 7, 2, 2, PAPERWORK_PALETTE.checkbox_filled]);
        }

        // Label (next to box)
        if (label) {
            for (let i = 0; i < label.length; i++) {
                const lx = x + 18 + i * 6;
                pixels.push([lx, y + 2, 5, 8, PAPERWORK_PALETTE.ink_faded]);
            }
        }

        return pixels;
    }
}

// SIGNATURE FIELD (handwritten scrawl)
class Signature {
    static render(x, y, width, signed = false) {
        const pixels = [];

        // Signature line
        pixels.push([x, y + 20, width, 1, PAPERWORK_PALETTE.line_grey]);

        // "Signature:" label (typed)
        for (let i = 0; i < 10; i++) {
            const lx = x + i * 6;
            pixels.push([lx, y + 25, 5, 6, PAPERWORK_PALETTE.ink_faded]);
        }

        // Signature scrawl (if signed)
        if (signed) {
            // Organic flowing line (simulated cursive)
            const sigY = y + 10;
            for (let i = 0; i < width - 20; i += 2) {
                const wave = Math.sin(i * 0.1) * 4;
                const thick = i % 10 < 5 ? 2 : 1; // variable thickness
                pixels.push([x + 10 + i, sigY + wave, thick, thick, PAPERWORK_PALETTE.signature_blue]);
            }

            // Flourish at end (loop)
            for (let angle = 0; angle < Math.PI; angle += 0.2) {
                const fx = x + width - 30 + Math.cos(angle) * 15;
                const fy = sigY + Math.sin(angle) * 8;
                pixels.push([fx, fy, 2, 2, PAPERWORK_PALETTE.signature_blue]);
            }
        }

        return pixels;
    }
}

// STAMP (official approval/rejection stamp)
class OfficialStamp {
    static APPROVED(x, y) {
        const pixels = [];

        // Stamp circle (red ink, slightly faded/irregular)
        const radius = 36;
        const centerX = x + radius;
        const centerY = y + radius;

        for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
            const variance = 0.9 + Math.random() * 0.2; // irregular edge
            const r = radius * variance;
            const px = centerX + Math.cos(angle) * r;
            const py = centerY + Math.sin(angle) * r;
            pixels.push([px, py, 2, 2, PAPERWORK_PALETTE.stamp_red]);
        }

        // "APPROVED" text (bold, centered)
        const textPixels = [
            // A
            [centerX - 24, centerY - 8, 2, 16, PAPERWORK_PALETTE.stamp_red],
            [centerX - 22, centerY - 8, 6, 2, PAPERWORK_PALETTE.stamp_red],
            [centerX - 22, centerY, 6, 2, PAPERWORK_PALETTE.stamp_red],
            [centerX - 16, centerY - 8, 2, 16, PAPERWORK_PALETTE.stamp_red],

            // P
            [centerX - 10, centerY - 8, 2, 16, PAPERWORK_PALETTE.stamp_red],
            [centerX - 8, centerY - 8, 6, 2, PAPERWORK_PALETTE.stamp_red],
            [centerX - 2, centerY - 8, 2, 8, PAPERWORK_PALETTE.stamp_red],
            [centerX - 8, centerY, 6, 2, PAPERWORK_PALETTE.stamp_red],

            // More letters abbreviated for space...
        ];

        pixels.push(...textPixels);

        // Stamp ink irregularities (splotches)
        for (let i = 0; i < 15; i++) {
            const sx = centerX + (Math.random() - 0.5) * 50;
            const sy = centerY + (Math.random() - 0.5) * 50;
            const size = 1 + Math.floor(Math.random() * 2);
            pixels.push([sx, sy, size, size, PAPERWORK_PALETTE.stamp_red]);
        }

        return pixels;
    }

    static REJECTED(x, y) {
        const pixels = OfficialStamp.APPROVED(x, y);
        // Change color to red and text to "REJECTED"
        pixels.forEach(p => {
            if (p[4] === PAPERWORK_PALETTE.stamp_red) {
                p[4] = PAPERWORK_PALETTE.ink_red;
            }
        });
        return pixels;
    }

    static PROCESSING(x, y) {
        const pixels = OfficialStamp.APPROVED(x, y);
        // Yellow/gold stamp for "IN PROGRESS"
        pixels.forEach(p => {
            if (p[4] === PAPERWORK_PALETTE.stamp_red) {
                p[4] = '#8a7040';
            }
        });
        return pixels;
    }
}

// CORRECTION MARKS (bureaucrat's handwritten notes)
class Corrections {
    static strikethrough(x, y, width) {
        const pixels = [];
        // Red pen strikethrough
        pixels.push([x, y, width, 2, PAPERWORK_PALETTE.ink_red]);
        pixels.push([x + 1, y + 1, width - 2, 1, PAPERWORK_PALETTE.ink_red]);
        return pixels;
    }

    static underline(x, y, width) {
        const pixels = [];
        // Wavy underline (emphasis)
        for (let i = 0; i < width; i += 2) {
            const wave = Math.sin(i * 0.3) * 1;
            pixels.push([x + i, y + wave, 2, 1, PAPERWORK_PALETTE.ink_red]);
        }
        return pixels;
    }

    static circle(x, y, radius) {
        const pixels = [];
        // Red circle around important text
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            pixels.push([px, py, 2, 2, PAPERWORK_PALETTE.ink_red]);
        }
        return pixels;
    }

    static annotation(x, y, text) {
        const pixels = [];
        // Handwritten note in margin (messy)
        for (let i = 0; i < text.length; i++) {
            const lx = x + i * 5;
            const yOffset = Math.floor(Math.random() * 3) - 1;
            pixels.push([lx, y + yOffset, 4, 7, PAPERWORK_PALETTE.ink_blue]);
        }
        return pixels;
    }
}

// COMPLETE FORM RENDERER (combines all elements)
class PaperworkForm {
    constructor(width = 600, height = 800) {
        this.width = width;
        this.height = height;
        this.pixels = [];
    }

    // Render complete traffic violation form
    renderTrafficViolationForm(data = {}) {
        this.pixels = [];

        // Background texture
        this.pixels.push(...PaperTexture.generate(this.width, this.height));

        // Header
        this.pixels.push(...FormHeader.render(20, 20, this.width - 40, "TRAFFIC VIOLATION REPORT"));

        // Form fields
        let yPos = 90;
        const fieldSpacing = 30;

        this.pixels.push(...FormField.render(40, yPos, 500, "DEFENDANT NAME:", data.name || ''));
        yPos += fieldSpacing;

        this.pixels.push(...FormField.render(40, yPos, 500, "VEHICLE DESCRIPTION:", data.vehicle || ''));
        yPos += fieldSpacing;

        this.pixels.push(...FormField.render(40, yPos, 500, "DATE OF OFFENSE:", data.date || ''));
        yPos += fieldSpacing;

        this.pixels.push(...FormField.render(40, yPos, 500, "LOCATION:", data.location || ''));
        yPos += fieldSpacing * 2;

        // Violations checklist
        this.pixels.push(...Checkbox.render(40, yPos, data.violations?.speeding, "SPEEDING"));
        yPos += 25;
        this.pixels.push(...Checkbox.render(40, yPos, data.violations?.reckless, "RECKLESS DRIVING"));
        yPos += 25;
        this.pixels.push(...Checkbox.render(40, yPos, data.violations?.unlicensed, "OPERATING WITHOUT LICENSE"));
        yPos += 25;
        this.pixels.push(...Checkbox.render(40, yPos, data.violations?.evading, "EVADING POLICE"));
        yPos += fieldSpacing * 2;

        // Charges field
        this.pixels.push(...FormField.render(40, yPos, 500, "ADDITIONAL CHARGES:", data.charges || ''));
        yPos += fieldSpacing * 2;

        // Sentence field
        this.pixels.push(...FormField.render(40, yPos, 500, "SENTENCE (DAYS):", data.sentence || ''));
        yPos += fieldSpacing * 2;

        // Signature
        this.pixels.push(...Signature.render(40, yPos, 500, data.signed || false));
        yPos += 60;

        // Stamp (if processed)
        if (data.approved) {
            this.pixels.push(...OfficialStamp.APPROVED(this.width - 120, yPos - 100));
        } else if (data.rejected) {
            this.pixels.push(...OfficialStamp.REJECTED(this.width - 120, yPos - 100));
        }

        // Judge's annotations (if any)
        if (data.annotations) {
            this.pixels.push(...Corrections.annotation(this.width - 200, 200, "MAXIMUM PENALTY"));
            this.pixels.push(...Corrections.circle(this.width - 180, 220, 30));
        }

        return this.pixels;
    }

    // Render to canvas
    render(ctx) {
        this.pixels.forEach(pixel => {
            const [x, y, width, height, color] = pixel;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        });
    }
}

// EXPORT
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PAPERWORK_PALETTE,
        PaperTexture,
        FormHeader,
        FormField,
        Checkbox,
        Signature,
        OfficialStamp,
        Corrections,
        PaperworkForm
    };
}
