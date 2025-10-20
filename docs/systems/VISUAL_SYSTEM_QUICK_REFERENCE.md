# Visual System 2.0 - Quick Reference Card

**One-page cheat sheet for developers**

---

## Import

```html
<link rel="stylesheet" href="visual-system.css">
<link rel="stylesheet" href="icons.css">
```

---

## Colors

```css
/* Primary */
--color-primary-pink: #FF6B9D      /* Actions, player */
--color-primary-purple: #9D4EDD    /* Authority, danger */
--color-primary-teal: #06D6A0      /* Success, freedom */
--color-primary-cyan: #00B4D8      /* Info, neutral */

/* Semantic */
--color-success: #06D6A0
--color-warning: #FFA07A
--color-error: #FF5566
--color-info: #00B4D8

/* Backgrounds */
--color-bg-deepest: #0A0A0F
--color-bg-deep: #12121A
--color-bg-medium: #1A1A28

/* Text */
--color-text-primary: #F8F8F8
--color-text-secondary: #B8B8C8
--color-text-tertiary: #808090
```

---

## Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Authority</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-ghost">Cancel</button>
<button class="btn btn-small">Small</button>
<button class="btn btn-large">Large</button>
```

---

## Forms

```html
<input type="text" class="input" placeholder="Text">
<select class="select">...</select>
<textarea class="textarea"></textarea>

<!-- States -->
<input class="input input-success">
<input class="input input-error">
<input class="input input-warning">
```

---

## Cards

```html
<div class="card">
    <div class="card-header"><h3>Title</h3></div>
    <div class="card-body"><p>Content</p></div>
    <div class="card-footer">Buttons</div>
</div>

<div class="card card-interactive">Clickable</div>
```

---

## Modals

```html
<div class="modal-overlay">
    <div class="modal">
        <div class="modal-header">Title</div>
        <div class="modal-body">Content</div>
        <div class="modal-footer">Buttons</div>
    </div>
</div>
```

---

## Progress

```html
<div class="progress">
    <div class="progress-bar" style="width: 65%"></div>
</div>
```

---

## Tabs

```html
<div class="tabs">
    <button class="tab active">Tab 1</button>
    <button class="tab">Tab 2</button>
</div>
```

---

## Badges

```html
<span class="badge badge-pink">Pink</span>
<span class="badge badge-purple">Purple</span>
<span class="badge badge-teal">Teal</span>
<span class="badge badge-cyan">Cyan</span>
```

---

## Icons

```html
<span class="icon icon-drive"></span>
<span class="icon icon-money"></span>
<span class="icon icon-tattoo"></span>

<!-- In buttons -->
<button class="btn btn-primary">
    <span class="icon icon-drive"></span>
    Drive
</button>
```

---

## Spacing

```html
<div class="p-lg">Padding large</div>
<div class="m-xl">Margin XL</div>

<!-- Scale: xs, sm, md, lg, xl, 2xl, 3xl -->
```

---

## Layout

```html
<div class="container">Max 1200px</div>
<div class="container container-narrow">Max 800px</div>

<div class="grid grid-2">2 columns</div>
<div class="grid grid-3">3 columns</div>
<div class="grid grid-4">4 columns</div>

<div class="flex gap-md">Horizontal flex</div>
<div class="flex-col gap-lg">Vertical flex</div>
<div class="flex-center">Centered</div>
<div class="flex-between">Space between</div>
```

---

## Animations

```html
<div class="animate-fade-in">Fade in</div>
<div class="animate-scale-in">Scale in</div>
<div class="animate-slide-up">Slide up</div>
<div class="animate-float">Float</div>
<div class="animate-glow-pulse">Glow pulse</div>

<!-- Screen transitions -->
<div class="screen-transition-fade">Fade</div>
<div class="screen-transition-slide-left">Slide</div>
<div class="screen-transition-zoom">Zoom</div>
```

---

## Typography

```html
<h1>Pink glow heading</h1>
<h2>Purple glow heading</h2>
<h3>Cyan glow heading</h3>
<h4>Teal heading</h4>

<p class="text-body">Body text</p>
<p class="text-small">Small text</p>
<p class="text-tiny">Tiny text</p>

<span class="text-neon">Neon pulse</span>
<span class="text-glow">Glow effect</span>

<!-- Colors -->
<span class="text-pink">Pink</span>
<span class="text-purple">Purple</span>
<span class="text-teal">Teal</span>
<span class="text-cyan">Cyan</span>
```

---

## Effects

```html
<!-- Vignette -->
<div class="vignette"></div>

<!-- Scanlines -->
<div class="scanlines"></div>

<!-- Chromatic aberration -->
<h1 class="chromatic-aberration" data-text="TITLE">
    TITLE
</h1>
```

---

## Loading States

```html
<div class="loading-spinner"></div>

<div class="loading-dots">
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
</div>

<div class="loading-bar"></div>
```

---

## Utilities

```css
/* Display */
.hidden, .block, .inline, .inline-block

/* Position */
.relative, .absolute, .fixed, .sticky

/* Text align */
.text-left, .text-center, .text-right

/* Opacity */
.opacity-0, .opacity-50, .opacity-100

/* Border radius */
.rounded-none, .rounded-sm, .rounded-md, .rounded-lg, .rounded-xl, .rounded-full

/* Shadows */
.shadow-sm, .shadow-md, .shadow-lg
.shadow-glow-pink, .shadow-glow-purple, .shadow-glow-teal, .shadow-glow-cyan
```

---

## Responsive Breakpoints

```css
@media (max-width: 640px) { /* Mobile */ }
@media (min-width: 641px) and (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

---

## Color Mapping

**Component → Color:**
- Player actions → Pink
- Authority/Judge → Purple
- Success/Escape → Teal
- Info/Forms → Cyan
- Warnings → Orange
- Money → Yellow
- Romance → Rose
- Intelligence → Lavender

---

## Quick Start

1. Import CSS files
2. Replace `#0f0` green with color tokens
3. Add `.btn` classes to buttons
4. Update headings with color classes
5. Wrap content in `.card` containers
6. Add icons with `.icon` classes
7. Test on mobile

---

## Common Patterns

### Stat Display
```html
<div class="flex gap-sm">
    <span class="icon icon-money"></span>
    <span>$1,250</span>
</div>
```

### Action Button
```html
<button class="btn btn-primary" onclick="action()">
    <span class="icon icon-action"></span>
    Action Name
</button>
```

### Info Card
```html
<div class="card">
    <div class="card-header">
        <h3><span class="icon icon-info"></span> Title</h3>
    </div>
    <div class="card-body">
        <p>Content</p>
    </div>
</div>
```

---

**Full docs:** VISUAL_SYSTEM_GUIDE.md
**Icons:** ICON_SET_REFERENCE.md
**Integration:** VISUAL_SYSTEM_INTEGRATION.md
