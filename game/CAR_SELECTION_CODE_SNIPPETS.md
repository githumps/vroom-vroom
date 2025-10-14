# CAR SELECTION SYSTEM - CODE SNIPPETS

## Quick Integration Reference
Copy-paste these exact code blocks into the specified files.

---

## 1. index.html - Add Script Tag (Line 1320)

**Location:** After Three.js, before game.js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="soundsystem.js"></script>
<script src="tattoo-system.js"></script>
<script src="car-selection.js"></script>  <!-- ADD THIS LINE -->
<script src="game.js"></script>
```

---

## 2. index.html - Insert Car Selection UI (After Line 535)

**Location:** In #characterCreation screen, after voice selection, before "BEGIN YOUR JOURNEY" button

Copy the ENTIRE contents of `car-selection-ui.html` here.

---

## 3. game.js - Update Player Object (Line 579)

**Location:** In Game class constructor, player initialization

**FIND:**
```javascript
        this.player = {
            name: '',
            skinTone: 2,
            height: 175,
            voice: 'deep',
            wantedLevel: 0,
```

**CHANGE TO:**
```javascript
        this.player = {
            name: '',
            skinTone: 2,
            height: 175,
            voice: 'deep',
            selectedCar: {
                model: 'beater',
                color: 0x8B7355  // rust brown default
            },
            wantedLevel: 0,
```

---

## 4. game.js - Add carPreview Property (Line 576)

**Location:** In Game class constructor

**FIND:**
```javascript
        this.renderer = null;
        this.car = null;
        this.policecar = null;
```

**CHANGE TO:**
```javascript
        this.renderer = null;
        this.car = null;
        this.policecar = null;
        this.carPreview = null;
```

---

## 5. game.js - Update startNewGame Method (Around Line 1175)

**FIND:**
```javascript
    startNewGame() {
        this.showScreen('characterCreation');
    }
```

**CHANGE TO:**
```javascript
    startNewGame() {
        this.showScreen('characterCreation');
        this.initializeCarPreview();
    }
```

---

## 6. game.js - Replace createCar Method (Line 817)

**FIND:** The entire `createCar()` method

**REPLACE WITH:**
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

---

## 7. game.js - Add New Methods (Insert After startNewGame, Around Line 1180)

**ADD THESE NEW METHODS:**

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

---

## 8. game.js - Update finishCharacterCreation (Around Line 1230)

**FIND:**
```javascript
    finishCharacterCreation() {
        this.player.name = document.getElementById('charName').value || 'Anonymous Criminal';
        this.player.skinTone = parseInt(document.getElementById('skinTone').value);
        this.player.height = parseInt(document.getElementById('height').value);
        this.player.voice = document.getElementById('voice').value;

        // Show cinematic and start driving
```

**ADD AFTER THE VOICE LINE:**
```javascript
    finishCharacterCreation() {
        this.player.name = document.getElementById('charName').value || 'Anonymous Criminal';
        this.player.skinTone = parseInt(document.getElementById('skinTone').value);
        this.player.height = parseInt(document.getElementById('height').value);
        this.player.voice = document.getElementById('voice').value;

        // Clean up car preview renderer
        if (this.carPreview) {
            this.carPreview.destroy();
            this.carPreview = null;
        }

        // Show cinematic and start driving
```

---

## Summary of Changes

### Files Modified:
1. `game/index.html` - Add script tag and UI elements
2. `game/game.js` - Add properties and methods

### Files Created:
1. `game/car-selection.js` - Car geometry and preview renderer
2. `game/car-selection-ui.html` - HTML markup (copy into index.html)

### New Methods in Game Class:
- `selectCarModel(modelName)`
- `selectCarColor(colorKey)`
- `updateCarPreview()`
- `initializeCarPreview()`
- `createCarFallback()` (renamed from original createCar)

### Modified Methods:
- `createCar()` - Now uses selected car
- `startNewGame()` - Initialize preview
- `finishCharacterCreation()` - Clean up preview

### New Player Properties:
```javascript
selectedCar: {
    model: 'beater',     // 'beater', 'box', 'clunker', 'rustbucket'
    color: 0x8B7355      // hex color value
}
```

---

## Testing Checklist

- [ ] Preview renders on character creation screen
- [ ] Car model buttons update preview
- [ ] Color swatches update preview
- [ ] Selected states highlight correctly
- [ ] Description updates with selection
- [ ] Car rotates slowly in preview
- [ ] Selected car appears in driving mode
- [ ] Preview cleans up after character creation
- [ ] Fallback works if CarGeometry fails
- [ ] No console errors
