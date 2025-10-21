// ==================== PIXEL ART INTERACTIVE FORMS ====================
// VROOM VROOM - Canvas-based form input system
// Replaces HTML forms with pixel art bureaucratic paperwork
// Full mouse/touch interaction with validation and Judge reactions

class PixelArtFormField {
    constructor(x, y, width, label, type = 'text') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = type === 'textarea' ? 80 : 40;
        this.label = label;
        this.type = type; // 'text', 'textarea', 'select', 'initial'
        this.value = '';
        this.focused = false;
        this.error = false;
        this.placeholder = '';
        this.maxLength = type === 'initial' ? 3 : 100;
        this.cursorVisible = true;
        this.cursorBlinkTime = 0;

        // For select fields
        this.options = [];
        this.selectedIndex = -1;
        this.dropdownOpen = false;
    }

    setPlaceholder(text) {
        this.placeholder = text;
        return this;
    }

    setOptions(options) {
        this.options = options; // Array of {label, value}
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }

    containsDropdownPoint(px, py) {
        if (!this.dropdownOpen || this.type !== 'select') return false;
        const dropdownHeight = this.options.length * 30;
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y + this.height && py <= this.y + this.height + dropdownHeight;
    }

    getDropdownIndex(px, py) {
        if (!this.dropdownOpen) return -1;
        const relativeY = py - (this.y + this.height);
        return Math.floor(relativeY / 30);
    }

    focus() {
        this.focused = true;
        this.error = false;
        if (this.type === 'select') {
            this.dropdownOpen = !this.dropdownOpen;
        }
    }

    blur() {
        this.focused = false;
        this.dropdownOpen = false;
    }

    handleInput(char) {
        if (this.type === 'select') return;

        if (char === 'Backspace') {
            this.value = this.value.slice(0, -1);
        } else if (char === 'Enter' && this.type === 'textarea') {
            this.value += '\n';
        } else if (char.length === 1 && this.value.length < this.maxLength) {
            this.value += char;
        }
    }

    selectOption(index) {
        if (index >= 0 && index < this.options.length) {
            this.selectedIndex = index;
            this.value = this.options[index].value;
            this.dropdownOpen = false;
        }
    }

    render(ctx, palette) {
        // Draw label
        this.renderText(ctx, this.label, this.x, this.y - 20, palette.ink_black, 6);

        // Draw field background (paper)
        ctx.fillStyle = palette.paper_white;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw field border
        const borderColor = this.error ? palette.ink_red :
                           this.focused ? palette.ink_blue : palette.line_grey;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw value or placeholder
        if (this.type === 'select') {
            this.renderSelect(ctx, palette);
        } else {
            this.renderTextInput(ctx, palette);
        }

        // Draw cursor if focused
        if (this.focused && this.cursorVisible && this.type !== 'select') {
            const cursorX = this.x + 8 + this.value.length * 7;
            ctx.fillStyle = palette.ink_blue;
            ctx.fillRect(cursorX, this.y + 8, 2, 20);
        }
    }

    renderTextInput(ctx, palette) {
        const text = this.value || this.placeholder;
        const color = this.value ? palette.ink_blue : palette.ink_faded;

        if (this.type === 'textarea') {
            // Multi-line rendering
            const lines = text.split('\n');
            lines.forEach((line, i) => {
                this.renderText(ctx, line.substring(0, 40), this.x + 8, this.y + 12 + i * 16, color, 7);
            });
        } else {
            // Single line
            this.renderText(ctx, text.substring(0, 50), this.x + 8, this.y + 12, color, 7);
        }
    }

    renderSelect(ctx, palette) {
        // Render selected value or placeholder
        const displayText = this.selectedIndex >= 0 ?
            this.options[this.selectedIndex].label :
            'Select your intent...';
        const color = this.selectedIndex >= 0 ? palette.ink_blue : palette.ink_faded;

        this.renderText(ctx, displayText.substring(0, 40), this.x + 8, this.y + 12, color, 7);

        // Render dropdown arrow
        ctx.fillStyle = palette.ink_black;
        const arrowX = this.x + this.width - 20;
        const arrowY = this.y + 15;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 8, arrowY);
        ctx.lineTo(arrowX + 4, arrowY + 6);
        ctx.closePath();
        ctx.fill();

        // Render dropdown if open
        if (this.dropdownOpen) {
            const dropdownHeight = this.options.length * 30;

            // Dropdown background
            ctx.fillStyle = palette.paper_white;
            ctx.fillRect(this.x, this.y + this.height, this.width, dropdownHeight);

            // Dropdown border
            ctx.strokeStyle = palette.ink_blue;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y + this.height, this.width, dropdownHeight);

            // Render options
            this.options.forEach((option, i) => {
                const optionY = this.y + this.height + i * 30;

                // Highlight hovered option
                if (this.hoveredOptionIndex === i) {
                    ctx.fillStyle = palette.highlight_yellow;
                    ctx.fillRect(this.x + 2, optionY + 2, this.width - 4, 26);
                }

                // Option text
                this.renderText(ctx, option.label, this.x + 8, optionY + 10, palette.ink_black, 7);
            });
        }
    }

    renderText(ctx, text, x, y, color, charWidth = 6) {
        ctx.fillStyle = color;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charX = x + i * charWidth;
            // Simple rectangle representation of text (pixel art style)
            if (char !== ' ') {
                ctx.fillRect(charX, y, charWidth - 2, 10);
            }
        }
    }

    updateCursor(deltaTime) {
        this.cursorBlinkTime += deltaTime;
        if (this.cursorBlinkTime > 500) {
            this.cursorVisible = !this.cursorVisible;
            this.cursorBlinkTime = 0;
        }
    }
}

// ==================== INTERACTIVE FORM MANAGER ====================

class InteractiveCourtForms {
    constructor(canvas, palette) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.palette = palette || PAPERWORK_PALETTE;

        // Set pixel art rendering
        this.ctx.imageSmoothingEnabled = false;

        // Form fields
        this.fields = [];
        this.focusedField = null;
        this.paperTexture = null;

        // Mouse/touch tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;

        // Callbacks
        this.onFieldChange = null;
        this.onSubmit = null;
        this.onValidationError = null;

        // Animation
        this.animationFrame = 0;
        this.isActive = false;

        this.initializeFields();
        this.initializeEventListeners();
        this.generatePaperTexture();
    }

    initializeFields() {
        const startY = 120;
        const fieldSpacing = 100;

        // Field 1: Reason for driving (textarea)
        this.fields.push(
            new PixelArtFormField(50, startY, 700, 'FORM 27-B: Reason for Driving', 'textarea')
                .setPlaceholder('Explain in detail why you were operating a motor vehicle...')
        );

        // Field 2: Vehicle description (text)
        this.fields.push(
            new PixelArtFormField(50, startY + fieldSpacing, 700, 'FORM 42-A: Description of Vehicle', 'text')
                .setPlaceholder('Color, make, model, year of manufacture...')
        );

        // Field 3: Statement of intent (select)
        const intentField = new PixelArtFormField(50, startY + fieldSpacing * 2, 700, 'FORM 99-Z: Statement of Intent', 'select');
        intentField.setOptions([
            { label: 'I was going to buy groceries', value: 'grocery' },
            { label: 'I was going to work', value: 'work' },
            { label: 'I was experiencing joy', value: 'joy' },
            { label: 'I was simply existing', value: 'exist' }
        ]);
        this.fields.push(intentField);

        // Field 4-6: Initials (small text)
        this.fields.push(
            new PixelArtFormField(50, startY + fieldSpacing * 3, 200, 'FORM 13-C: Initial here to acknowledge you were driving', 'initial')
                .setPlaceholder('Initials')
        );

        this.fields.push(
            new PixelArtFormField(300, startY + fieldSpacing * 3, 200, 'FORM 13-D: Initial here to acknowledge you KNOW you were driving', 'initial')
                .setPlaceholder('Initials')
        );

        this.fields.push(
            new PixelArtFormField(550, startY + fieldSpacing * 3, 200, 'FORM 13-E: Initial here to acknowledge that you acknowledged', 'initial')
                .setPlaceholder('Initials')
        );
    }

    initializeEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Keyboard events
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    generatePaperTexture() {
        // Create off-screen canvas for paper texture
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = this.canvas.width;
        textureCanvas.height = this.canvas.height;
        const ctx = textureCanvas.getContext('2d');

        // Generate texture using PaperTexture class
        const pixels = PaperTexture.generate(textureCanvas.width, textureCanvas.height);

        pixels.forEach(pixel => {
            const [x, y, width, height, color] = pixel;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        });

        this.paperTexture = textureCanvas;
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.mouseDown = true;

        this.handleClick(this.mouseX, this.mouseY);
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        // Update hovered dropdown option
        if (this.focusedField && this.focusedField.type === 'select' && this.focusedField.dropdownOpen) {
            const index = this.focusedField.getDropdownIndex(this.mouseX, this.mouseY);
            this.focusedField.hoveredOptionIndex = index;
        }
    }

    handleMouseUp(e) {
        this.mouseDown = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouseX = touch.clientX - rect.left;
        this.mouseY = touch.clientY - rect.top;

        this.handleClick(this.mouseX, this.mouseY);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouseX = touch.clientX - rect.left;
        this.mouseY = touch.clientY - rect.top;
    }

    handleTouchEnd(e) {
        e.preventDefault();
    }

    handleClick(x, y) {
        // Check if clicking on a dropdown option
        if (this.focusedField && this.focusedField.type === 'select' && this.focusedField.dropdownOpen) {
            if (this.focusedField.containsDropdownPoint(x, y)) {
                const index = this.focusedField.getDropdownIndex(x, y);
                this.focusedField.selectOption(index);

                // Trigger change callback
                if (this.onFieldChange) {
                    this.onFieldChange(this.focusedField);
                }
                return;
            }
        }

        // Check which field was clicked
        let clickedField = null;
        for (let field of this.fields) {
            if (field.containsPoint(x, y)) {
                clickedField = field;
                break;
            }
        }

        // Blur previous field
        if (this.focusedField && this.focusedField !== clickedField) {
            this.focusedField.blur();

            // Trigger change callback for blur
            if (this.onFieldChange) {
                this.onFieldChange(this.focusedField);
            }
        }

        // Focus new field
        if (clickedField) {
            this.focusedField = clickedField;
            clickedField.focus();
        }
    }

    handleKeyDown(e) {
        if (!this.focusedField || !this.isActive) return;
        if (this.focusedField.type === 'select') return;

        e.preventDefault();

        // Handle special keys
        if (e.key === 'Tab') {
            this.focusNextField();
        } else if (e.key === 'Enter' && this.focusedField.type !== 'textarea') {
            this.focusNextField();
        } else {
            this.focusedField.handleInput(e.key);
        }
    }

    focusNextField() {
        if (!this.focusedField) return;

        const currentIndex = this.fields.indexOf(this.focusedField);
        const nextIndex = (currentIndex + 1) % this.fields.length;

        this.focusedField.blur();
        this.focusedField = this.fields[nextIndex];
        this.focusedField.focus();
    }

    validateForm() {
        let isValid = true;
        const errors = [];

        this.fields.forEach((field, index) => {
            if (!field.value || field.value.trim() === '') {
                field.error = true;
                isValid = false;
                errors.push({
                    field: field,
                    message: `${field.label} is required`
                });
            } else {
                field.error = false;
            }
        });

        return { isValid, errors };
    }

    getFormData() {
        return {
            reason: this.fields[0].value,
            vehicle: this.fields[1].value,
            intent: this.fields[2].value,
            initial1: this.fields[3].value,
            initial2: this.fields[4].value,
            initial3: this.fields[5].value
        };
    }

    start() {
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    animate() {
        if (!this.isActive) return;

        this.animationFrame++;

        // Update cursor blink for focused field
        if (this.focusedField) {
            this.focusedField.updateCursor(16); // ~60fps
        }

        this.render();
        requestAnimationFrame(() => this.animate());
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw paper texture background
        if (this.paperTexture) {
            this.ctx.drawImage(this.paperTexture, 0, 0);
        }

        // Draw title
        this.ctx.fillStyle = this.palette.ink_black;
        this.ctx.font = 'bold 24px monospace';
        this.ctx.fillText('TRAFFIC VIOLATION REPORT', 150, 60);

        // Draw form header
        this.renderFormHeader();

        // Draw all fields
        this.fields.forEach(field => {
            field.render(this.ctx, this.palette);
        });

        // Draw submit button
        this.renderSubmitButton();
    }

    renderFormHeader() {
        // Official seal (simplified)
        const sealX = 50;
        const sealY = 20;

        this.ctx.strokeStyle = this.palette.ink_blue;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(sealX + 20, sealY + 20, 20, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.font = '10px monospace';
        this.ctx.fillStyle = this.palette.ink_blue;
        this.ctx.fillText('OFFICIAL', sealX + 5, sealY + 25);
    }

    renderSubmitButton() {
        const buttonX = 300;
        const buttonY = 540;
        const buttonWidth = 200;
        const buttonHeight = 40;

        // Button background
        this.ctx.fillStyle = this.palette.stamp_red;
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button border
        this.ctx.strokeStyle = this.palette.ink_black;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button text
        this.ctx.fillStyle = this.palette.paper_white;
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillText('SUBMIT FORMS', buttonX + 30, buttonY + 25);

        // Check if button is hovered
        if (this.mouseX >= buttonX && this.mouseX <= buttonX + buttonWidth &&
            this.mouseY >= buttonY && this.mouseY <= buttonY + buttonHeight) {

            // Highlight effect
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

            // Handle click
            if (this.mouseDown) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit() {
        const validation = this.validateForm();

        if (!validation.isValid) {
            // Trigger validation error callback
            if (this.onValidationError) {
                this.onValidationError(validation.errors);
            }
        } else {
            // Trigger submit callback
            if (this.onSubmit) {
                this.onSubmit(this.getFormData());
            }
        }
    }
}

// ==================== EXPORT ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PixelArtFormField,
        InteractiveCourtForms
    };
}
