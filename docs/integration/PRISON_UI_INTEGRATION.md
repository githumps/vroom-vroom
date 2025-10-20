# PRISON UI SYSTEM - INTEGRATION GUIDE

**Version:** 1.5.0
**Created:** 2025-10-19
**Agent:** isometric-pixel-artist
**Status:** ✅ READY FOR INTEGRATION

---

## 📋 OVERVIEW

This document provides complete integration instructions for the **Cozy Dystopian Pixel Art UI System** designed for VROOM VROOM's prison interface.

### Design Philosophy

- **Warm colors despite bleak setting** - Orange, amber, warm greys
- **Pixel art aesthetic** with modern UX principles
- **Excellent readability** - High contrast, clear typography
- **Professional polish** - Smooth animations, consistent spacing
- **Fully responsive** - Desktop and mobile optimized

### What's Included

1. **Prison cell background** with atmospheric lighting
2. **Activity card system** with hover effects
3. **Pixel art button system** with multiple variants
4. **Stat display components** (bars, counters, animations)
5. **Modal/dialog system** with pixel art frames
6. **Time/date display** with digital clock styling
7. **Toast notification system**
8. **Prisoner info card** with badge styling

---

## 🚀 QUICK START

### Step 1: Add CSS to HTML

Add this line to `game/index.html` in the `<head>` section:

```html
<link rel="stylesheet" href="assets/ui/prison-ui.css">
```

**Location:** After line 8 (after the `<title>` tag), before the existing `<style>` block.

### Step 2: Update Prison Menu Screen

Replace the current prison menu HTML with the new pixel art structure.

**Location:** `game/index.html`, lines 1239-1320 (the `#prisonMenu` section)

---

## 📐 COMPONENT USAGE

### 1. PRISON CELL BACKGROUND

Wrap the entire prison menu in the background container:

```html
<div id="prisonMenu" class="screen">
    <div class="prison-cell-bg">
        <!-- All prison content goes here -->
    </div>
</div>
```

**Features:**
- Gradient concrete wall texture
- Scanline effect for atmosphere
- Animated window light beam
- Auto-scrolling for overflow content

---

### 2. ACTIVITY CARDS

Replace current `.prison-activity` divs with new card structure:

**BEFORE:**
```html
<div class="prison-activity" onclick="game.prisonActivity('weights')">
    <h3>LIFT WEIGHTS</h3>
    <p>Build strength in the prison yard.</p>
</div>
```

**AFTER:**
```html
<div class="prison-activity-card" onclick="game.prisonActivity('weights')">
    <div class="activity-header">
        <div class="activity-icon activity-icon-weights"></div>
        <h3 class="activity-title">Lift Weights</h3>
    </div>
    <p class="activity-description">
        Build strength in the prison yard. Might help in a fight.
    </p>
    <div class="activity-cost">Cost: FREE • Gain: +1 STRENGTH</div>
</div>
```

**Available Icons:**
- `activity-icon-weights` - 💪
- `activity-icon-eat` - 🍽️
- `activity-icon-read` - 📚
- `activity-icon-letter` - ✉️
- `activity-icon-cellmate` - 💬
- `activity-icon-tattoo` - 🎨
- `activity-icon-commissary` - 🛒
- `activity-icon-gang` - 👥
- `activity-icon-manicure` - 💅
- `activity-icon-escape` - 🚪
- `activity-icon-clinic` - 🏥
- `activity-icon-conjugal` - 💑

---

### 3. PIXEL ART BUTTONS

Replace current buttons with pixel button system:

**BEFORE:**
```html
<button onclick="game.showScreen('prisonMenu')">RETURN TO CELL</button>
```

**AFTER:**
```html
<button class="pixel-button" onclick="game.showScreen('prisonMenu')">
    Return to Cell
</button>
```

**Button Variants:**

```html
<!-- Primary action (orange background) -->
<button class="pixel-button primary" onclick="game.doSomething()">
    Confirm Action
</button>

<!-- Danger action (red border) -->
<button class="pixel-button danger" onclick="game.dangerousAction()">
    Dangerous Action
</button>

<!-- Success action (green border) -->
<button class="pixel-button success" onclick="game.goodAction()">
    Success Action
</button>

<!-- Disabled state -->
<button class="pixel-button" disabled>
    Cannot Click
</button>
```

---

### 4. STATS PANEL

Add a fixed stats panel to show player info:

```html
<div class="stats-panel">
    <!-- Prisoner Info -->
    <div class="prisoner-name" id="statsName">PRISONER #1337</div>

    <!-- Currency Display -->
    <div class="currency-row">
        <span class="currency-icon">💰</span>
        <span class="currency-amount" id="statsCredits">0</span>
        <span class="stat-label">Credits</span>
    </div>

    <div class="currency-row">
        <span class="currency-icon">🚬</span>
        <span class="currency-amount" id="statsCigs">0</span>
        <span class="stat-label">Cigarettes</span>
    </div>

    <!-- Stat Bars -->
    <div class="stat-row">
        <span class="stat-label">Hunger</span>
        <div class="stat-bar-container">
            <div class="stat-bar-fill hunger" id="hungerBar" style="width: 100%"></div>
        </div>
        <span class="stat-value" id="hungerValue">100</span>
    </div>

    <div class="stat-row">
        <span class="stat-label">Strength</span>
        <div class="stat-bar-container">
            <div class="stat-bar-fill strength" id="strengthBar" style="width: 50%"></div>
        </div>
        <span class="stat-value" id="strengthValue">50</span>
    </div>

    <div class="stat-row">
        <span class="stat-label">Intelligence</span>
        <div class="stat-bar-container">
            <div class="stat-bar-fill intelligence" id="intelligenceBar" style="width: 75%"></div>
        </div>
        <span class="stat-value" id="intelligenceValue">75</span>
    </div>
</div>
```

**JavaScript to update stats:**

```javascript
// Update stat bar and value
function updateStat(statName, value, maxValue = 100) {
    const percentage = (value / maxValue) * 100;
    const bar = document.getElementById(`${statName}Bar`);
    const valueDisplay = document.getElementById(`${statName}Value`);

    // Update bar width
    bar.style.width = `${percentage}%`;

    // Update text value
    valueDisplay.textContent = value;

    // Show change indicator (optional)
    showStatChange(statName, value);
}

// Example usage
updateStat('hunger', 85);
updateStat('strength', 60);
updateStat('intelligence', 90);

// Update currency
document.getElementById('statsCredits').textContent = player.money;
document.getElementById('statsCigs').textContent = player.cigarettes;
```

---

### 5. TIME/DATE DISPLAY

Replace current time display with pixel art version:

```html
<div class="time-display">
    <div class="time-segment">
        <div class="time-label">Day</div>
        <div class="time-value" id="prisonDay">1</div>
    </div>

    <div class="time-segment">
        <div class="time-label">Time</div>
        <div class="time-value digital" id="prisonTime">12:00</div>
    </div>

    <div class="time-segment">
        <div class="time-label">Sentence</div>
        <div class="time-value" id="remainingSentence">30d</div>
    </div>
</div>
```

---

### 6. MODAL/DIALOG SYSTEM

Create modals with pixel art styling:

```html
<!-- Modal overlay (darken background) -->
<div class="modal-overlay" id="myModalOverlay" onclick="closeModal()"></div>

<!-- Modal content -->
<div class="pixel-modal" id="myModal">
    <div class="modal-header">
        <h2 class="modal-title">Modal Title</h2>
    </div>

    <div class="modal-body">
        <p>This is the modal content. It can contain any HTML.</p>
        <p>Multiple paragraphs, forms, lists, etc.</p>
    </div>

    <div class="modal-footer">
        <button class="pixel-button" onclick="closeModal()">Cancel</button>
        <button class="pixel-button primary" onclick="confirmAction()">Confirm</button>
    </div>
</div>
```

**JavaScript helper functions:**

```javascript
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.getElementById(modalId + 'Overlay').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById(modalId + 'Overlay').style.display = 'none';
}
```

---

### 7. PRISONER INFO CARD

Display player character information:

```html
<div class="prisoner-card">
    <div class="prisoner-name" id="cardName">UNKNOWN DRIVER</div>

    <div class="prisoner-details">
        <div class="detail-item">
            <div class="detail-label">Prisoner #</div>
            <div class="detail-value" id="cardNumber">1337</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Arrests</div>
            <div class="detail-value" id="cardArrests">0</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Current Gang</div>
            <div class="detail-value" id="cardGang">None</div>
        </div>

        <div class="detail-item">
            <div class="detail-label">Behavior</div>
            <div class="detail-value" id="cardBehavior">Good</div>
        </div>
    </div>
</div>
```

---

### 8. TOAST NOTIFICATIONS

Show temporary notifications:

```html
<!-- Add to HTML (will be hidden by default) -->
<div class="pixel-toast" id="gameToast" style="display: none;">
    <div class="toast-message" id="toastMessage"></div>
</div>
```

**JavaScript function:**

```javascript
function showToast(message, type = 'default') {
    const toast = document.getElementById('gameToast');
    const messageEl = document.getElementById('toastMessage');

    // Set message
    messageEl.textContent = message;

    // Set type class
    toast.className = `pixel-toast ${type}`;

    // Show toast
    toast.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Usage examples
showToast('Strength increased!', 'success');
showToast('You are hungry', 'warning');
showToast('Invalid action', 'error');
showToast('Day completed');
```

---

## 🎨 COLOR PALETTE REFERENCE

The CSS uses CSS custom properties (variables) for easy theming:

```css
/* Primary Colors */
--prison-orange: #FF8C42        /* Main accent color */
--prison-orange-dark: #D97028    /* Hover/active states */
--prison-orange-light: #FFB380   /* Highlights */

/* Backgrounds */
--concrete-dark: #3E3E42         /* Dark walls */
--concrete-mid: #5A5A60          /* Mid walls */
--ui-bg-dark: #2A2A2E            /* Modal backgrounds */
--ui-bg-mid: #3A3A3E             /* Card backgrounds */

/* Accent Colors */
--warm-yellow: #FFD670           /* Light, warnings */
--warm-amber: #FFA940            /* Lamp glow */
--rust-red: #B85450              /* Danger, errors */
--warm-white: #F5E6D3            /* Primary text */

/* Text Colors */
--text-primary: #F5E6D3          /* Main text */
--text-secondary: #C5B6A3        /* Secondary text */
--text-disabled: #7A7A80         /* Disabled state */
```

---

## 📱 RESPONSIVE DESIGN

The UI automatically adapts to mobile devices:

**Tablet (< 768px):**
- Stats panel becomes full-width
- Activity cards stack vertically
- Buttons expand to full width
- Reduced padding for efficiency

**Phone (< 480px):**
- Activity headers stack vertically
- Time display wraps to multiple lines
- Modals take 95% screen width
- Toast notifications expand full width

**No code changes needed** - CSS handles all responsive behavior.

---

## 🔧 INTEGRATION STEPS

### 1. Add CSS File

```bash
# File already created at:
/Users/ccqw/Developer/vroom-vroom/game/assets/ui/prison-ui.css
```

Link in `game/index.html`:

```html
<head>
    <!-- Existing head content -->
    <link rel="stylesheet" href="assets/ui/prison-ui.css">
</head>
```

### 2. Update Prison Menu HTML

**File:** `game/index.html`
**Location:** Lines 1239-1320

Replace the entire `#prisonMenu` section with:

```html
<div id="prisonMenu" class="screen">
    <div class="prison-cell-bg">

        <!-- Stats Panel (Fixed Position) -->
        <div class="stats-panel">
            <div class="prisoner-name" id="prisonPlayerName">PRISONER</div>

            <div class="currency-row">
                <span class="currency-icon">💰</span>
                <span class="currency-amount" id="prisonMoney">0</span>
                <span class="stat-label">Credits</span>
            </div>

            <div class="currency-row">
                <span class="currency-icon">🚬</span>
                <span class="currency-amount" id="prisonCigs">0</span>
                <span class="stat-label">Cigarettes</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">Hunger</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill hunger" id="prisonHungerBar" style="width: 100%"></div>
                </div>
                <span class="stat-value" id="prisonHungerValue">100</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">Strength</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill strength" id="prisonStrengthBar" style="width: 0%"></div>
                </div>
                <span class="stat-value" id="prisonStrengthValue">0</span>
            </div>

            <div class="stat-row">
                <span class="stat-label">Intelligence</span>
                <div class="stat-bar-container">
                    <div class="stat-bar-fill intelligence" id="prisonIntelligenceBar" style="width: 0%"></div>
                </div>
                <span class="stat-value" id="prisonIntelligenceValue">0</span>
            </div>
        </div>

        <!-- Main Content Area -->
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; margin-left: 320px;">

            <h1 style="text-align: center; color: var(--prison-orange); margin-bottom: 20px;">
                YOUR CELL
            </h1>

            <!-- Time Display -->
            <div class="time-display">
                <div class="time-segment">
                    <div class="time-label">Day</div>
                    <div class="time-value" id="prisonDayDisplay">1</div>
                </div>

                <div class="time-segment">
                    <div class="time-label">Sentence</div>
                    <div class="time-value" id="prisonSentenceDisplay">30d</div>
                </div>
            </div>

            <!-- Activity Cards -->
            <div class="prison-activity-card" onclick="game.prisonActivity('weights')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-weights"></div>
                    <h3 class="activity-title">Lift Weights</h3>
                </div>
                <p class="activity-description">
                    Build strength in the prison yard. Might help in a fight.
                </p>
                <div class="activity-cost">Cost: FREE • Gain: +1 STRENGTH</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('eat')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-eat"></div>
                    <h3 class="activity-title">Eat in Cafeteria</h3>
                </div>
                <p class="activity-description">
                    Consume questionable food. Reduces hunger, sometimes.
                </p>
                <div class="activity-cost">Cost: FREE • Gain: +20 HUNGER</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('read')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-read"></div>
                    <h3 class="activity-title">Visit Library</h3>
                </div>
                <p class="activity-description">
                    Read books. Expand your mind, if that's still possible.
                </p>
                <div class="activity-cost">Cost: FREE • Gain: +1 INTELLIGENCE</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('letter')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-letter"></div>
                    <h3 class="activity-title">Write Letter</h3>
                </div>
                <p class="activity-description">
                    Send mail to someone who might care. They won't respond.
                </p>
                <div class="activity-cost">Cost: 1 CREDIT</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('cellmate')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-cellmate"></div>
                    <h3 class="activity-title">Talk to Cellmate</h3>
                </div>
                <p class="activity-description">
                    Engage in conversation. Might get useful intel. Or nonsense.
                </p>
                <div class="activity-cost">Cost: FREE</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('tattoo')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-tattoo"></div>
                    <h3 class="activity-title">Get Prison Tattoo</h3>
                </div>
                <p class="activity-description">
                    Design and receive permanent ink. 25% infection risk.
                </p>
                <div class="activity-cost">Cost: 10 CREDITS</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('commissary')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-commissary"></div>
                    <h3 class="activity-title">Visit Commissary</h3>
                </div>
                <p class="activity-description">
                    Spend credits on overpriced goods. Welcome to capitalism.
                </p>
                <div class="activity-cost">Various Prices</div>
            </div>

            <div class="prison-activity-card" onclick="game.prisonActivity('gang')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-gang"></div>
                    <h3 class="activity-title">Gang Activities</h3>
                </div>
                <p class="activity-description">
                    Join a prison gang. Gain protection, lose freedom of choice.
                </p>
                <div class="activity-cost">Reputation Required</div>
            </div>

            <div class="prison-activity-card" onclick="game.showScreen('nailArtGuardSelection')">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-manicure"></div>
                    <h3 class="activity-title">Guard Manicure Service</h3>
                </div>
                <p class="activity-description">
                    Give guards manicures for favor tokens. Very normal prison activity.
                </p>
                <div class="activity-cost">Earn Favor Tokens</div>
            </div>

            <div class="prison-activity-card" onclick="game.showEscapeMenu()">
                <div class="activity-header">
                    <div class="activity-icon activity-icon-escape"></div>
                    <h3 class="activity-title">Plan Escape</h3>
                </div>
                <p class="activity-description">
                    Work on escape routes. Freedom awaits... maybe.
                </p>
                <div class="activity-cost">Various Requirements</div>
            </div>

            <!-- Serve Time Button -->
            <div class="text-center mt-3">
                <button class="pixel-button primary" onclick="game.endPrison()">
                    Serve Time (Skip Ahead)
                </button>
            </div>

        </div>
    </div>
</div>
```

### 3. Update game.js Stats Display

Add this function to `game.js` to sync stats with UI:

```javascript
updatePrisonUI() {
    // Update player name
    const nameEl = document.getElementById('prisonPlayerName');
    if (nameEl) nameEl.textContent = this.player.name || 'PRISONER';

    // Update currency
    const moneyEl = document.getElementById('prisonMoney');
    if (moneyEl) moneyEl.textContent = this.player.money || 0;

    const cigsEl = document.getElementById('prisonCigs');
    if (cigsEl) cigsEl.textContent = this.player.cigarettes || 0;

    // Update stat bars
    this.updateStatBar('prisonHunger', this.player.hunger, 100);
    this.updateStatBar('prisonStrength', this.player.strength, 100);
    this.updateStatBar('prisonIntelligence', this.player.intelligence, 100);

    // Update time display
    const dayEl = document.getElementById('prisonDayDisplay');
    if (dayEl) dayEl.textContent = this.player.prisonDays || 0;

    const sentenceEl = document.getElementById('prisonSentenceDisplay');
    if (sentenceEl) {
        const remaining = this.player.sentence - this.player.prisonDays;
        sentenceEl.textContent = `${remaining}d`;
    }
}

updateStatBar(statName, value, maxValue = 100) {
    const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

    const bar = document.getElementById(`${statName}Bar`);
    if (bar) bar.style.width = `${percentage}%`;

    const valueDisplay = document.getElementById(`${statName}Value`);
    if (valueDisplay) valueDisplay.textContent = Math.floor(value);
}
```

Call `this.updatePrisonUI()` whenever entering prison or after any stat change.

### 4. Test Integration

1. Load game in browser
2. Navigate to prison menu
3. Verify:
   - ✅ Background has atmospheric lighting
   - ✅ Activity cards have hover effects
   - ✅ Buttons have pixel art styling
   - ✅ Stats panel displays correctly
   - ✅ Time display shows current values
   - ✅ Mobile responsive (test at 768px and 480px widths)

---

## 🎨 CUSTOMIZATION OPTIONS

### Changing Color Scheme

Edit CSS variables in `prison-ui.css`:

```css
:root {
    --prison-orange: #YOUR_COLOR;
    /* etc... */
}
```

### Adding New Icons

Add to the icon system in CSS:

```css
.activity-icon-youricon::before {
    content: '🎯'; /* Your emoji */
}
```

Then use in HTML:

```html
<div class="activity-icon activity-icon-youricon"></div>
```

### Custom Stat Colors

Define new stat bar colors:

```css
.stat-bar-fill.custom {
    background-color: #FF00FF;
    box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.3);
}
```

---

## 📊 PERFORMANCE NOTES

- **CSS file size:** ~18KB (minified: ~14KB)
- **No external dependencies** - pure CSS
- **No JavaScript required** for visual effects
- **Hardware-accelerated animations** - uses transform/opacity
- **Minimal repaints** - efficient DOM updates

---

## ♿ ACCESSIBILITY FEATURES

✅ **Keyboard Navigation** - All interactive elements focusable
✅ **Focus Indicators** - High-contrast yellow outline
✅ **Reduced Motion** - Respects `prefers-reduced-motion`
✅ **High Contrast** - Respects `prefers-contrast: high`
✅ **Readable Text** - 14px minimum, high contrast ratios
✅ **Touch Targets** - 48px minimum for mobile

---

## 🐛 TROUBLESHOOTING

### Stats panel overlaps content on mobile

**Solution:** The CSS automatically makes it static on mobile. Ensure viewport meta tag is correct:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Buttons look wrong

**Solution:** Make sure you're using the `.pixel-button` class, not the old `button` styling.

### Icons not showing

**Solution:** Icons use emoji. Ensure device supports emoji rendering.

### Background effects not visible

**Solution:** Check that `.prison-cell-bg` wraps all content in the prison menu.

---

## 📝 CHANGELOG

**v1.5.0** (2025-10-19)
- Initial release
- Complete pixel art UI system
- Responsive mobile design
- Accessibility features
- Toast notification system

---

## 🎯 NEXT STEPS

After integration:

1. ✅ Test on desktop (Chrome, Firefox, Safari)
2. ✅ Test on mobile (iOS Safari, Chrome Android)
3. ✅ Verify all activity cards clickable
4. ✅ Test stat bar updates
5. ✅ Test modal system
6. ✅ Verify keyboard navigation
7. ✅ Test with screen reader (optional but recommended)

---

## 📞 SUPPORT

**Integration Issues?**
- Check browser console for CSS loading errors
- Verify file path: `assets/ui/prison-ui.css`
- Ensure all HTML IDs match JavaScript references

**Visual Bugs?**
- Test in different browsers
- Check viewport meta tag
- Verify no conflicting CSS from existing styles

---

**Created with care by isometric-pixel-artist agent**
**For VROOM VROOM v1.5.0**
