# CAR SELECTION SYSTEM - INTEGRATION GUIDE

## Overview
This guide explains how to integrate the car selection and customization system into VROOM VROOM.

## Files Created
1. `car-selection.js` - Core car geometry and preview renderer
2. `car-selection-ui.html` - HTML markup for selection interface
3. This integration guide

## Integration Steps

### STEP 1: Add Script to index.html

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`, add the car-selection.js script BEFORE game.js:

```html
<!-- Line 1320, BEFORE game.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="soundsystem.js"></script>
<script src="tattoo-system.js"></script>
<script src="car-selection.js"></script>  <!-- ADD THIS LINE -->
<script src="game.js"></script>
```

### STEP 2: Add UI to Character Creation Screen

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`, insert the car selection UI into the character creation screen.

Find this section (around line 532):
```html
                <div class="form-field">
                    <label>Voice:</label>
                    <select id="voice">
                        <option value="deep">Deep and Resigned</option>
                        <option value="high">High and Anxious</option>
                        <option value="monotone">Monotone Bureaucrat</option>
                        <option value="enthusiastic">Disturbingly Enthusiastic</option>
                    </select>
                    <button id="previewVoiceBtn" onclick="game.previewVoice()" style="margin-top: 10px; font-size: 0.9em; padding: 10px 20px;">
                        PREVIEW VOICE
                    </button>
                </div>
                <button onclick="game.finishCharacterCreation()">BEGIN YOUR JOURNEY</button>
```

Insert the contents of `car-selection-ui.html` BETWEEN the voice field and the "BEGIN YOUR JOURNEY" button.

After integration, it should look like:
```html
                <div class="form-field">
                    <label>Voice:</label>
                    <!-- voice selection -->
                </div>

                <!-- CAR SELECTION UI STARTS HERE -->
                <div class="form-field">
                    <label>Select Your Ride:</label>
                    <!-- ... car selection UI ... -->
                </div>
                <!-- CAR SELECTION UI ENDS HERE -->

                <button onclick="game.finishCharacterCreation()">BEGIN YOUR JOURNEY</button>
```

### STEP 3: Update Player Object in game.js

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`, add car selection properties to the player object.

Find the player initialization (around line 579):
```javascript
        this.player = {
            name: '',
            skinTone: 2,
            height: 175,
            voice: 'deep',
            wantedLevel: 0,
            // ... existing properties ...
```

Add these properties:
```javascript
        this.player = {
            name: '',
            skinTone: 2,
            height: 175,
            voice: 'deep',
            selectedCar: {          // ADD THIS
                model: 'beater',    // ADD THIS
                color: 0x8B7355     // ADD THIS (rust brown default)
            },                      // ADD THIS
            wantedLevel: 0,
            // ... rest of properties ...
```

### STEP 4: Add Car Preview Renderer to Game Class

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`, add a carPreview property to store the preview renderer.

Find the Game class constructor (around line 575):
```javascript
        this.renderer = null;
        this.car = null;
        this.policecar = null;
```

Add:
```javascript
        this.renderer = null;
        this.car = null;
        this.policecar = null;
        this.carPreview = null;  // ADD THIS
```

### STEP 5: Add Car Selection Methods to Game Class

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`, add these methods to the Game class (add them after the `startNewGame` method, around line 1180):

```javascript
    // CAR SELECTION METHODS
    selectCarModel(modelName) {
        // Update player selection
        this.player.selectedCar.model = modelName;

        // Update UI - highlight selected button
        document.querySelectorAll('.car-model-btn').forEach(btn => {
            if (btn.dataset.model === modelName) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Update preview
        this.updateCarPreview();

        // Update description
        const models = CarGeometry.getCarModels();
        const model = models[modelName];
        const colors = ColorPalette.getColors();
        const colorKey = Object.keys(colors).find(k => colors[k].hex === this.player.selectedCar.color) || 'rustbrown';
        const colorInfo = colors[colorKey];

        document.getElementById('carDescription').innerHTML =
            `<strong>${model.name}</strong> - ${colorInfo.name}<br>${colorInfo.desc}`;
    }

    selectCarColor(colorKey) {
        // Update player selection
        this.player.selectedCar.color = ColorPalette.getColorHex(colorKey);

        // Update UI - highlight selected swatch
        document.querySelectorAll('.color-swatch').forEach(btn => {
            if (btn.dataset.color === colorKey) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Update preview
        this.updateCarPreview();

        // Update description
        const colors = ColorPalette.getColors();
        const colorInfo = colors[colorKey];
        const models = CarGeometry.getCarModels();
        const model = models[this.player.selectedCar.model];

        document.getElementById('carDescription').innerHTML =
            `<strong>${model.name}</strong> - ${colorInfo.name}<br>${colorInfo.desc}`;
    }

    updateCarPreview() {
        // Initialize preview renderer if not exists
        if (!this.carPreview) {
            this.carPreview = new CarPreviewRenderer('carPreviewCanvas');
        }

        // Update with selected car and color
        this.carPreview.updateCar(
            this.player.selectedCar.model,
            this.player.selectedCar.color
        );
    }

    initializeCarPreview() {
        // Called when character creation screen is shown
        // Set defaults and initialize preview
        this.player.selectedCar = {
            model: 'beater',
            color: 0x8B7355 // rust brown
        };

        // Highlight default selections in UI
        setTimeout(() => {
            document.querySelector('.car-model-btn[data-model="beater"]')?.classList.add('selected');
            document.querySelector('.color-swatch[data-color="rustbrown"]')?.classList.add('selected');
            this.updateCarPreview();

            const models = CarGeometry.getCarModels();
            const colors = ColorPalette.getColors();
            document.getElementById('carDescription').innerHTML =
                `<strong>${models.beater.name}</strong> - ${colors.rustbrown.name}<br>${colors.rustbrown.desc}`;
        }, 100);
    }
```

### STEP 6: Initialize Preview When Character Creation Opens

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`, find the `startNewGame` method (around line 1175) and update it:

```javascript
    startNewGame() {
        this.showScreen('characterCreation');
        this.initializeCarPreview();  // ADD THIS LINE
    }
```

### STEP 7: Update createCar Method to Use Selected Car

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`, find the `createCar` method (around line 817) and replace it with:

```javascript
    createCar() {
        // Use selected car from character creation
        const selectedModel = this.player.selectedCar?.model || 'beater';
        const selectedColor = this.player.selectedCar?.color || 0x8B7355;

        // Create car using CarGeometry system
        this.car = CarGeometry.createCarMesh(selectedModel, selectedColor);
        if (this.car) {
            this.car.position.set(0, 0.2, 0);
            this.scene.add(this.car);
        } else {
            // Fallback to default if something goes wrong
            console.warn('CarGeometry failed, using fallback');
            this.createCarFallback();
        }
    }

    createCarFallback() {
        // Original car creation code as fallback
        const carGroup = new THREE.Group();

        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x9B4A4A,
            roughness: 0.7,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        carGroup.add(body);

        const topGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B3A3A,
            roughness: 0.7,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 1.4;
        top.position.z = -0.3;
        carGroup.add(top);

        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const wheelPositions = [
            [-1, 0, 1.2],
            [1, 0, 1.2],
            [-1, 0, -1.2],
            [1, 0, -1.2]
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            carGroup.add(wheel);
        });

        carGroup.rotation.y = Math.PI;
        carGroup.position.set(0, 0.2, 0);
        this.car = carGroup;
        this.scene.add(carGroup);
    }
```

### STEP 8: Clean Up Preview When Leaving Character Creation

In `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`, find the `finishCharacterCreation` method (around line 1230) and add cleanup:

```javascript
    finishCharacterCreation() {
        // Existing code...
        this.player.name = document.getElementById('charName').value || 'Anonymous Criminal';
        this.player.skinTone = parseInt(document.getElementById('skinTone').value);
        this.player.height = parseInt(document.getElementById('height').value);
        this.player.voice = document.getElementById('voice').value;

        // Clean up car preview renderer
        if (this.carPreview) {
            this.carPreview.destroy();
            this.carPreview = null;
        }

        // Continue with existing code...
        this.showScreen('mainMenu');
        // ... rest of method
    }
```

## Testing

1. Start a new game
2. You should see car selection UI in character creation
3. Click different car models - preview should update
4. Click different colors - preview should update
5. Selected car rotates slowly in preview
6. When you finish character creation and enter driving mode, your selected car should appear

## Technical Notes

- Preview uses separate Three.js scene (doesn't interfere with main game)
- Preview auto-rotates at 0.005 rad/frame for cinematic effect
- Isometric camera angle matches game view
- All colors are from Disco Elysium-inspired muted palette
- Car geometry is simple boxes for performance
- Fallback system if CarGeometry fails

## Troubleshooting

**Preview not showing?**
- Check browser console for errors
- Verify Three.js is loaded before car-selection.js
- Check canvas element exists in DOM

**Cars not appearing in game?**
- Check player.selectedCar is set correctly
- Verify createCar is using selected model/color
- Check fallback is working if needed

**Selected state not updating?**
- Verify onclick handlers are calling game.selectCarModel() and game.selectCarColor()
- Check CSS classes are being applied (.selected)
- Inspect DOM to verify data attributes match

## File Paths Reference

All paths relative to project root:
- `C:\Users\evan\Documents\GitHub\vroom-vroom\game\car-selection.js`
- `C:\Users\evan\Documents\GitHub\vroom-vroom\game\car-selection-ui.html`
- `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html` (modify this)
- `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js` (modify this)
