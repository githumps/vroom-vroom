# VROOM VROOM - Visual System Implementation Guide

**Version:** 2.0.0
**Status:** Complete Design System
**Created:** 2025-10-19

---

## Overview

This is the complete visual language for VROOM VROOM, transforming the dystopian driving game into a **cozy cyberpunk experience**. The system balances oppressive themes with warm, inviting aesthetics through:

- Vibey color palette (warm pinks, purples, teals, cyans)
- Pixel-perfect UI components
- Atmospheric effects and transitions
- Comprehensive icon library
- Responsive layout system

---

## Quick Start

### 1. Import Visual System

Add to your HTML `<head>`:

```html
<!-- Visual System CSS -->
<link rel="stylesheet" href="visual-system.css">
```

### 2. Apply Base Styles

The system automatically styles the `<body>` element with the base design. All components inherit from this foundation.

### 3. Use Design Tokens

All colors, spacing, and typography are available as CSS custom properties:

```css
/* Use tokens in your custom styles */
.my-element {
    background: var(--color-bg-medium);
    color: var(--color-primary-pink);
    padding: var(--space-lg);
    border-radius: var(--radius-md);
}
```

---

## Color Palette

### Primary Colors

**Pink (#FF6B9D)** - Primary actions, highlights, playful elements
- Use for: Main CTAs, selected states, positive feedback
- Glow effect: Creates warm, inviting atmosphere

**Purple (#9D4EDD)** - Authority, danger, oppression
- Use for: Judge Hardcastle, police, warnings, system messages
- Glow effect: Ominous authority presence

**Teal (#06D6A0)** - Success, freedom, hope
- Use for: Successful actions, escape progress, achievements
- Glow effect: Liberating, refreshing

**Cyan (#00B4D8)** - Information, neutral actions
- Use for: Forms, inputs, informational UI, secondary actions
- Glow effect: Clean, technical

### Secondary Colors

**Orange (#FFA07A)** - Warnings, temporary states
**Yellow (#FFE66D)** - Money, rewards, achievements
**Rose (#F4ACB7)** - Romance, relationships (conjugal visits)
**Lavender (#B8A1E3)** - Calm, intelligence, reflection (library)

### Usage Examples

```html
<!-- Primary pink button -->
<button class="btn btn-primary">Drive Now</button>

<!-- Purple authority button -->
<button class="btn btn-secondary">Judge's Verdict</button>

<!-- Teal success button -->
<button class="btn btn-success">Escape Plan</button>

<!-- Text with color -->
<h2 class="text-pink">Welcome to Prison</h2>
<p class="text-teal">Escape Progress: 45%</p>
```

---

## Typography System

### Font Stack

**Primary:** `'Press Start 2P', 'Courier New', monospace` (pixel art)
**Fallback:** `'Courier New', 'Courier', monospace` (monospace)

### Heading Hierarchy

```html
<h1>Game Title</h1>          <!-- 48px, pink glow -->
<h2>Section Title</h2>        <!-- 32px, purple glow -->
<h3>Subsection</h3>           <!-- 24px, cyan glow -->
<h4>Card Title</h4>           <!-- 20px, teal -->
```

### Body Text

```html
<p class="text-body">Default body text (14px)</p>
<p class="text-small">Small text (12px)</p>
<p class="text-tiny">Tiny text (10px)</p>
```

### Special Effects

```html
<span class="text-neon">Neon pulsing text</span>
<span class="text-glow">Glowing text</span>
<span class="text-pixel">Pixel font</span>
```

---

## UI Components

### Buttons

```html
<!-- Primary action -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary action -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Success -->
<button class="btn btn-success">Confirm</button>

<!-- Danger -->
<button class="btn btn-danger">Delete</button>

<!-- Ghost (transparent) -->
<button class="btn btn-ghost">Cancel</button>

<!-- Sizes -->
<button class="btn btn-small">Small</button>
<button class="btn btn-large">Large</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Disabled</button>
```

**Button Features:**
- Ripple effect on click
- Hover glow animation
- Touch-friendly (48px minimum height)
- Accessible (keyboard navigation)

### Inputs

```html
<!-- Text input -->
<input type="text" class="input" placeholder="Enter text...">

<!-- With states -->
<input type="text" class="input input-success" value="Valid">
<input type="text" class="input input-error" value="Invalid">
<input type="text" class="input input-warning" value="Warning">

<!-- Select -->
<select class="select">
    <option>Option 1</option>
    <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea class="textarea" placeholder="Enter description..."></textarea>
```

**Input Features:**
- Cyan glow on focus
- Smooth transitions
- Consistent padding
- Mobile-optimized

### Modals

```html
<div class="modal-overlay">
    <div class="modal">
        <div class="modal-header">
            <h2>Modal Title</h2>
        </div>
        <div class="modal-body">
            <p>Modal content goes here</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-ghost">Cancel</button>
            <button class="btn btn-primary">Confirm</button>
        </div>
    </div>
</div>
```

**Modal Features:**
- Backdrop blur effect
- Scale-in animation
- Purple border glow
- Auto-scrolling content
- 90vw max width (mobile-friendly)

### Progress Bars

```html
<div class="progress">
    <div class="progress-bar" style="width: 65%"></div>
</div>
```

**Progress Features:**
- Gradient fill (pink → purple → cyan)
- Animated shine effect
- Smooth width transitions

### Tabs

```html
<div class="tabs">
    <button class="tab active">Tab 1</button>
    <button class="tab">Tab 2</button>
    <button class="tab">Tab 3</button>
</div>
```

### Cards

```html
<div class="card">
    <div class="card-header">
        <h3>Card Title</h3>
    </div>
    <div class="card-body">
        <p>Card content</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">Action</button>
    </div>
</div>

<!-- Interactive card -->
<div class="card card-interactive">
    <h3>Click me!</h3>
</div>
```

**Card Features:**
- Hover lift effect
- Cyan glow on hover
- Pink glow on interactive cards
- Responsive padding

### Badges

```html
<span class="badge">Default</span>
<span class="badge badge-pink">Pink</span>
<span class="badge badge-purple">Purple</span>
<span class="badge badge-teal">Teal</span>
<span class="badge badge-cyan">Cyan</span>
```

### Tooltips

```html
<span class="tooltip">
    Hover me
    <span class="tooltip-content">Tooltip text</span>
</span>
```

---

## Animation System

### Built-in Animations

```html
<!-- Fade in -->
<div class="animate-fade-in">Content</div>

<!-- Scale in (modal-style) -->
<div class="animate-scale-in">Content</div>

<!-- Slide up -->
<div class="animate-slide-up">Content</div>

<!-- Slide down -->
<div class="animate-slide-down">Content</div>

<!-- Float -->
<div class="animate-float">Content</div>

<!-- Glow pulse -->
<div class="animate-glow-pulse">Content</div>
```

### Animation Timing

Use CSS variables for consistent timing:

```css
transition: all var(--duration-normal) var(--ease-out);
animation: my-animation var(--duration-slow) var(--ease-bounce);
```

**Durations:**
- `--duration-instant`: 0ms
- `--duration-fast`: 100ms
- `--duration-normal`: 200ms
- `--duration-slow`: 300ms
- `--duration-slower`: 500ms

**Easing:**
- `--ease-in`: Accelerate
- `--ease-out`: Decelerate
- `--ease-in-out`: Smooth
- `--ease-bounce`: Playful bounce

### Screen Transitions

```html
<div class="screen-transition-fade">...</div>
<div class="screen-transition-slide-left">...</div>
<div class="screen-transition-zoom">...</div>
```

---

## Layout System

### Container

```html
<div class="container">
    <!-- Max width 1200px, centered -->
</div>

<div class="container container-narrow">
    <!-- Max width 800px -->
</div>

<div class="container container-wide">
    <!-- Max width 1600px -->
</div>
```

### Grid System

```html
<!-- 2 columns -->
<div class="grid grid-2">
    <div>Column 1</div>
    <div>Column 2</div>
</div>

<!-- 3 columns -->
<div class="grid grid-3">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
</div>

<!-- 4 columns -->
<div class="grid grid-4">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
    <div>Column 4</div>
</div>
```

**Responsive Behavior:**
- Mobile (<640px): All grids become 1 column
- Tablet (641-1024px): 3/4-column grids become 2 columns
- Desktop (>1025px): All grids work as defined

### Flexbox Utilities

```html
<div class="flex gap-md">Horizontal flex with gap</div>
<div class="flex-col gap-lg">Vertical flex with gap</div>
<div class="flex-center">Centered content</div>
<div class="flex-between">Space between items</div>
```

### Spacing Utilities

```html
<div class="p-lg">Padding large</div>
<div class="m-xl">Margin extra large</div>
```

**Spacing Scale:**
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

---

## Atmospheric Effects

### Vignette

```html
<div class="vignette"></div>
```

Adds a subtle darkening around screen edges.

### Scanlines

```html
<div class="scanlines"></div>
```

CRT monitor effect (optional retro aesthetic).

### Chromatic Aberration

```html
<h1 class="chromatic-aberration" data-text="VROOM VROOM">
    VROOM VROOM
</h1>
```

RGB split effect for cyberpunk titles.

---

## Particle Effects

### Sparkles

JavaScript to create sparkle particles on click:

```javascript
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
}

// Use on button clicks
button.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});
```

### Dust Particles

```javascript
function createDust() {
    const dust = document.createElement('div');
    dust.className = 'dust-particle';
    dust.style.left = Math.random() * window.innerWidth + 'px';
    dust.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(dust);

    setTimeout(() => dust.remove(), 3000);
}

// Create ambient dust
setInterval(createDust, 200);
```

---

## Loading States

### Spinner

```html
<div class="loading-spinner"></div>
```

### Dots

```html
<div class="loading-dots">
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
</div>
```

### Bar

```html
<div class="loading-bar"></div>
```

---

## Icon System (120+ Icons)

### Icon Categories

**Actions (43 icons):**
drive, accelerate, turn-left, turn-right, brake, surrender, arrest, handcuffs, paperwork, stamp, signature, form, checkbox, prison-door, prison-bars, exercise, library, cafeteria, shower, yard, tattoo-gun, stencil, ink, placement, care, clinic, medical-cross, bandage, simon-says, conjugal-visit, conversation, contraband, search, manicure, nail-file, polish, favor-token, escape-tunnel, bribe, transfer, riot, gang-patch, reputation, good-behavior

**Stats (14 icons):**
money, cigarettes, hunger, strength, intelligence, sentence, days-served, behavior-points, health, infection, gang-rep, escape-progress, time-day, time-night

**Items (18 icons):**
car-beater, car-box, car-clunker, car-rust-bucket, tattoo, infected-tattoo, cigarette-pack, credits, escape-tools, weapon, drugs, letter, book, photo, food-tray, soap, blanket, pillow

**Navigation (16 icons):**
menu, close, back, next, settings, save, load, export, import, info, help, volume-on, volume-off, fullscreen, minimize, refresh

**UI (35 icons):**
checkmark, x-mark, warning, error, success, info, question, lock, unlock, star, heart, skull, clock, calendar, location, person, group, speech-bubble, thought-bubble, arrow-up, arrow-down, arrow-left, arrow-right, chevron-up, chevron-down, chevron-left, chevron-right, plus, minus, search, filter, sort

**Mood (10 icons):**
happy, sad, angry, surprised, scared, neutral, confused, suspicious, smug, defeated

### Icon Implementation

Icons should be created as pixel art sprites in a **sprite sheet**:

- Size: 16x16px per icon (4x4 pixel grid)
- Style: Isometric where applicable, flat otherwise
- Colors: Use palette tokens
- Export: PNG with transparency

**Sprite Sheet Layout:**
- 120 icons at 16x16px
- Arranged in 12 rows × 10 columns grid
- Total size: 160px × 192px
- Use CSS background positioning

**Example CSS:**

```css
.icon {
    width: 16px;
    height: 16px;
    background-image: url('icons-spritesheet.png');
    background-repeat: no-repeat;
    image-rendering: pixelated;
}

.icon-drive {
    background-position: 0 0; /* First icon */
}

.icon-arrest {
    background-position: -16px 0; /* Second icon */
}

/* ...continue for all icons */
```

**Usage in HTML:**

```html
<span class="icon icon-drive"></span>
<span class="icon icon-money"></span>
<span class="icon icon-tattoo"></span>
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile: < 640px */
@media (max-width: 640px) {
    /* Single column layouts */
}

/* Tablet: 641px - 1024px */
@media (min-width: 641px) and (max-width: 1024px) {
    /* 2-column layouts */
}

/* Desktop: > 1025px */
@media (min-width: 1025px) {
    /* Full layouts */
}
```

### Mobile Optimizations

- Touch targets: 48px minimum (52px on mobile)
- Font sizes scale down on small screens
- Modals: 95vw on mobile, 90vw on desktop
- Grids collapse to single column
- Increased spacing for readability

---

## Utility Classes

### Display

```html
<div class="hidden">Hidden</div>
<div class="block">Block</div>
<div class="inline">Inline</div>
<div class="inline-block">Inline block</div>
```

### Position

```html
<div class="relative">Relative</div>
<div class="absolute">Absolute</div>
<div class="fixed">Fixed</div>
<div class="sticky">Sticky</div>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
```

### Opacity

```html
<div class="opacity-0">Invisible</div>
<div class="opacity-50">Half opacity</div>
<div class="opacity-100">Full opacity</div>
```

### Border Radius

```html
<div class="rounded-none">No radius</div>
<div class="rounded-sm">Small radius</div>
<div class="rounded-md">Medium radius</div>
<div class="rounded-lg">Large radius</div>
<div class="rounded-xl">Extra large radius</div>
<div class="rounded-full">Pill shape</div>
```

### Shadows

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-glow-pink">Pink glow</div>
<div class="shadow-glow-purple">Purple glow</div>
<div class="shadow-glow-teal">Teal glow</div>
<div class="shadow-glow-cyan">Cyan glow</div>
```

---

## Integration Checklist

### Phase 1: Base Setup
- [ ] Add `visual-system.css` to project
- [ ] Import in `index.html` before existing styles
- [ ] Test base typography and colors
- [ ] Verify responsive breakpoints

### Phase 2: Component Migration
- [ ] Replace button styles with `.btn` classes
- [ ] Update input/select/textarea with new classes
- [ ] Migrate modals to new structure
- [ ] Update progress bars
- [ ] Apply card styles to prison activities

### Phase 3: Color Palette
- [ ] Replace green (#0f0) with pink/cyan/purple
- [ ] Update menu screen colors
- [ ] Update driving HUD
- [ ] Update courtroom forms
- [ ] Update prison screens
- [ ] Update character creation

### Phase 4: Animations
- [ ] Add screen transitions
- [ ] Apply button ripple effects
- [ ] Add hover animations
- [ ] Implement sparkle particles
- [ ] Add loading states

### Phase 5: Atmospheric Effects
- [ ] Add vignette overlay
- [ ] Optional: Add scanlines
- [ ] Test chromatic aberration on titles
- [ ] Verify glow effects

### Phase 6: Icons
- [ ] Design 120+ icon sprite sheet
- [ ] Export at 16x16px per icon
- [ ] Create CSS classes for each icon
- [ ] Replace text labels with icons where appropriate
- [ ] Add icon + text combinations

### Phase 7: Polish
- [ ] Test all screens on mobile
- [ ] Verify touch targets (48px+)
- [ ] Check color contrast (accessibility)
- [ ] Optimize animations (60fps)
- [ ] Test on different browsers

---

## Performance Considerations

### CSS Optimizations

- Use CSS custom properties (variables) for dynamic values
- Minimize animation repaints (use `transform` and `opacity`)
- Use `will-change` sparingly for complex animations
- Leverage hardware acceleration with `transform: translateZ(0)`

### Image Optimizations

- Use sprite sheets for icons (reduces HTTP requests)
- Enable `image-rendering: pixelated` for crisp pixel art
- Optimize PNG files (lossless compression)
- Consider WebP format for better compression

### Accessibility

- Maintain color contrast ratios (WCAG AA minimum)
- Provide focus states for keyboard navigation
- Use semantic HTML where possible
- Add ARIA labels for icon-only buttons
- Test with screen readers

---

## Design Philosophy

### Cozy Cyberpunk Dystopia

The visual system creates **warmth in oppression** through:

1. **Warm Color Palette**: Pink, purple, teal create inviting atmosphere
2. **Soft Glows**: Neon effects feel comforting, not harsh
3. **Smooth Animations**: Playful bounces and transitions
4. **Atmospheric Depth**: Vignettes, shadows, layering
5. **Pixel Art Charm**: Nostalgic, handcrafted aesthetic

### Contrast and Hierarchy

- **Pink**: User actions, choice, agency
- **Purple**: Authority, system, oppression
- **Teal**: Success, hope, escape
- **Cyan**: Information, neutrality

This creates visual storytelling:
- Player = Pink (warmth, humanity)
- System = Purple (cold authority)
- Freedom = Teal (hope)

### Playful Subversion

Use cozy aesthetics to make dystopian themes approachable:
- Beautiful paperwork forms
- Inviting prison screens
- Friendly judge dialogue
- Warm arrest sequences

---

## Customization

### Creating Custom Colors

```css
:root {
    --color-custom-green: #00FF88;
    --color-custom-green-glow: rgba(0, 255, 136, 0.4);
}

.btn-custom {
    color: var(--color-custom-green);
    border-color: var(--color-custom-green);
    box-shadow: 0 0 10px var(--color-custom-green-glow);
}
```

### Custom Animations

```css
@keyframes custom-wobble {
    0%, 100% {
        transform: rotate(-3deg);
    }
    50% {
        transform: rotate(3deg);
    }
}

.wobble {
    animation: custom-wobble 0.5s var(--ease-in-out);
}
```

### Theme Variants

Consider creating alternate themes:

```css
/* Dark mode (default) */
body {
    --color-bg-deepest: #0A0A0F;
}

/* Light mode (optional) */
body.light-mode {
    --color-bg-deepest: #F8F8F8;
    --color-text-primary: #0A0A0F;
    /* ...invert other colors */
}
```

---

## Support

For questions or issues with the visual system:

1. Check `design-tokens.json` for all available values
2. Review component examples in this guide
3. Inspect `visual-system.css` for implementation details
4. Test changes in browser DevTools first

---

## Version History

**v2.0.0** (2025-10-19)
- Complete visual system overhaul
- Cozy cyberpunk color palette
- 120+ icon library
- Comprehensive component set
- Responsive grid system
- Animation framework
- Design tokens JSON

---

**Created by:** isometric-pixel-artist agent
**For:** VROOM VROOM v1.5.0+ visual overhaul
**License:** MIT
