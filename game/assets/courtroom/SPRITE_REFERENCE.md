# JUDGE HARDCASTLE SPRITE REFERENCE

**Visual reference for pixel art sprite construction**
**Scale:** 128x128 pixels (shown at reduced ASCII scale)

---

## JUDGE HARDCASTLE - NEUTRAL STATE

```
                    ████████████████████████████
                ████░░░░░░░░░░░░░░░░░░░░░░░░░░████
              ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░░░░░░░██░░░░░░░░░░░░░░██░░░░░░░░░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██████████████████████████████████████████████  ← Judicial Wig (white)
          ██                                            ██
          ██      ╔════════════════════════╗            ██
          ██      ║      HEAD AREA         ║            ██
          ██      ║   ████      ████       ║            ██  ← Eyes (black rectangles)
          ██      ║   █▓▓█      █▓▓█       ║            ██     w/ white highlights
          ██      ║                        ║            ██
          ██      ║   ────────────────     ║            ██  ← Eyebrows (neutral, straight)
          ██      ║                        ║            ██
          ██      ║         ││             ║            ██  ← Nose (simple line)
          ██      ║                        ║            ██
          ██      ║    ████░░░░░░████      ║            ██  ← Mustache (grey)
          ██      ║    ─────────────────   ║            ██  ← Mouth (neutral line)
          ██      ╚════════════════════════╝            ██
          ██                                            ██
          ██                                            ██
            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██     ← Wig curls (sides)
              ██                                    ██
                ██████████████████████████████████
                        ████████████████           ← Neck (skin tone)
                        ████████████████
                    ████░░░░░░░░░░░░░░████         ← White collar (clerical bands)
                ████████████████████████████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████       ← Black robe
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
```

**Key:**
- `█` = Solid pixels (wig white, eye black, robe black)
- `░` = Lighter shade (collar white, wig highlight)
- `▓` = Dark shade (robe shadow)
- `─` = Lines (eyebrows, mouth)
- `│` = Vertical lines (nose)

**Palette:**
- Wig: #e8e8e8
- Skin: #c5a789
- Eyes: #000000 / #ffffff
- Robe: #0a0a0a
- Collar: #f5f5f5

---

## JUDGE HARDCASTLE - ANGRY STATE (Patience 50)

```
                    ████████████████████████████
                ████░░░░░░░░░░░░░░░░░░░░░░░░░░████
              ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░░░░░░░██░░░░░░░░░░░░░░██░░░░░░░░░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██████████████████████████████████████████████
          ██         ▄▄         ▄▄                   ██  ← Veins (pulsing, red)
          ██        ████       ████                  ██
          ██      ╔════════════════════════╗         ██
          ██      ║   ╱╲ HEAD ╱╲          ║         ██  ← Skin flushed (#cc8870)
          ██      ║  ╱──╲    ╱──╲         ║         ██  ← Eyebrows ANGLED (4px droop)
          ██      ║   ████      ████       ║         ██
          ██      ║   █▓▓█      █▓▓█       ║         ██  ← Eyes (glaring)
          ██      ║                        ║         ██
          ██      ║         ││             ║         ██
          ██      ║                        ║         ██
          ██      ║    ████░░░░░░████      ║         ██  ← Mustache
          ██      ║    ─────────────────   ║         ██
          ██      ║    │               │   ║         ██  ← Mouth FROWNING (6px droop)
          ██      ║    │               │   ║         ██
          ██      ╚════════════════════════╝         ██
          ██                                         ██
            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
              ██                                  ██
                ██████████████████████████████████
                        ████████████████
                    ████░░░░░░░░░░░░░░████
                ████████████████████████████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
```

**Changes from Neutral:**
- Skin color: #c5a789 → #cc8870 (pink/red anger)
- Eyebrows: Angled inward (4px vertical offset)
- Mouth: Frown deepens (6px droop on corners)
- Veins: 3 veins visible on forehead (red #8b0000)

---

## JUDGE HARDCASTLE - VOLCANIC STATE (Patience 100)

```
                    ████████████████████████████
                ████░░░░░░░░░░░░░░░░░░░░░░░░░░████
              ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░░░▀▀░░░░░░░░░░░░░░░░░░▀▀░░░░░░░░░░░░██
          ██▀▀░░░▀▀░░░░░░░░░░░░░░░░░░▀▀░░░░░░░░░░░░░██
          ██▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀██
          ██   ▀▀  ▀▀  ▀▀  ▀▀  ▀▀  ▀▀  ▀▀  ▀▀  ▀▀   ██  ← 9 VEINS (maximum fury)
          ██  ████ ████ ████ ████ ████ ████ ████   ██
          ██      ╔════════════════════════╗        ██
          ██      ║  ╱╲╱╲ HEAD ╱╲╱╲       ║        ██  ← Skin DARK RED (#aa2244)
          ██      ║ ╱────╲  ╱────╲        ║        ██  ← Eyebrows MAX ANGLE (10px)
          ██      ║   ████      ████       ║        ██
          ██      ║   █▓▓█      █▓▓█       ║        ██  ← Eyes wide with rage
          ██      ║   █▓▓█      █▓▓█       ║        ██
          ██      ║                        ║        ██
          ██      ║         ││             ║        ██
          ██      ║                        ║        ██
          ██      ║    ████░░░░░░████      ║        ██
          ██      ║    ─────────────────   ║        ██
          ██      ║    │               │   ║        ██  ← Mouth EXTREME FROWN (18px)
          ██      ║    │               │   ║        ██
          ██      ║    │               │   ║        ██
          ██      ║    └───────────────┘   ║        ██
          ██      ╚════════════════════════╝        ██
            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
              ██                                ██
                ██████████████████████████████
```

**Maximum Anger Changes:**
- Skin color: #aa2244 (dark crimson)
- Eyebrows: 10px inward angle (maximum fury)
- Mouth: 18px frown depth (extreme displeasure)
- Veins: 9 veins across entire forehead
- Screen shake: 8px offset (not shown in static view)
- Red overlay: 30% opacity crimson tint

---

## GAVEL SPRITES (32x64)

### Gavel at Rest
```
          ││││
          ││││
          ││││  ← Handle (wood #4a3520)
          ││││
          ││││
          ││││
          ││││
          ││││
          ││││
          ││││
    ████████████████
    ████████████████  ← Head (wood #5a4530)
    ████████████████
```

### Gavel Raised (Trembling)
```
    ████████████████  ← Head at top
    ████████████████
    ████████████████
          ││││
          ││││  ← Handle (vertical)
          ││││
          ││││
          ││││
          ││││
          ││││
          ░░░░  ← Motion blur (faded)
          ░░░░
          ░░░░
```

### Gavel Strike (Impact)
```
          ││││
          ││││
          ││││
          ││││
          ││││  ← Handle
          ││││
          ││││
          ││││
    ████████████████  ← Head hitting surface
    ████████████████
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ░░░░░░░░░░░░░░░░  ← Impact flash (white)
    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
  ░ ░░░░░░░░░░░░░░ ░  ← Dust particles
```

---

## BACKGROUND ELEMENTS

### Judge's Bench (Front View)
```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║    [LAMP]          [PAPERWORK STACKS]              [LAW BOOKS]            ║
║      🏮                ▓▓▓ ▓▓▓ ▓▓▓                    ║█║ ║█║             ║
║     /│\               ▓▓▓ ▓▓▓ ▓▓▓                    ║█║ ║█║             ║
║    ──┴──              ▓▓▓ ▓▓▓ ▓▓▓                    ║█║ ║█║             ║
║     ▓▓▓                                                                    ║
╠════════════════════════════════════════════════════════════════════════════╣  ← Bench top (mahogany)
║░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░║  ← Decorative molding
║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
║▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒║  ← Front panel (wood grain)
║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Desk Lamp (Green Banker's Lamp)
```
      ╔══════════════════╗
     ╔╝  Green Shade    ╚╗  ← Glass shade (#2a5a3a)
    ╔╝                   ╚╗    with glow (#4a8a5a)
    ╚═════════════════════╝
            │││││
            │││││  ← Brass stem (#8a7040)
            │││││
          ▓▓▓▓▓▓▓  ← Brass base
         ▓▓▓▓▓▓▓▓▓
        ▓▓▓▓▓▓▓▓▓▓▓
```

### Paperwork Stack
```
    ┌─────────────┐
    │ ─────────── │  ← Text lines (faded)
    │ ─────────── │
    │ ─────────── │
    ├─────────────┤  ← Layer separation
    │ ─────────── │
    │ ─────────── │
    ├─────────────┤
    │ ─────────── │
    └─────────────┘
    ▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Shadow
```

---

## PAPERWORK UI ELEMENTS

### Form Header
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   ╔═══╗     TRAFFIC VIOLATION REPORT               Form #4821  ║
║   ║ O ║     ═══════════════════════════             ─────────  ║
║   ║ F ║     OFFICIAL DOCUMENT                       Date:___   ║
║   ╚═══╝     State of Absurdia                                  ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
```

### Form Fields
```
DEFENDANT NAME: ______________________________________ [handwritten]

VEHICLE DESCRIPTION: _________________________________ [handwritten]

DATE OF OFFENSE: _____________________________________ [handwritten]
```

### Checkboxes
```
☐ SPEEDING
☐ RECKLESS DRIVING
☑ OPERATING WITHOUT LICENSE  ← Checked (X mark)
☐ EVADING POLICE
```

### Official Stamp (Approved)
```
            ╔═══════════════╗
          ╔═╝               ╚═╗
        ╔═╝                   ╚═╗
       ╔╝     APPROVED          ╚╗  ← Red circular stamp
      ╔╝    ───────────          ╚╗    (#aa2020)
      ║     ███  ███  ███          ║
      ║                            ║
      ╚╗                          ╔╝
       ╚╗                        ╔╝
        ╚═╗                   ╔═╝
          ╚═╗               ╔═╝
            ╚═══════════════╝
```

### Signature Field
```
Signature: ─────────────────────────────────────────────

           [Judge's scrawl - flowing cursive]
           ╱╲╱╲╱─────╲╱─╲─╱╲╱╲╱──────  ⟲  ← Flourish loop
```

---

## ATMOSPHERIC EFFECTS

### Dust Particles (Floating)
```
Screen space, randomly distributed:

   •         •              •
        •          •
                        •       •
  •          •
         •        •          •
                    •
```

### Light Rays (God Rays)
```
  │ │     │ │       │ │
  │ │     │ │       │ │
  │ │     │ │       │ │
  │ │     │ │       │ │  ← Vertical rays from implied windows
  │ │     │ │       │ │     Gradient opacity 0.08 → 0.00
  │ │     │ │       │ │
  │ │     │ │       │ │
  ╲ ╱     ╲ ╱       ╲ ╱  ← Widen as they descend
   ╲╱       ╲╱         ╲╱
```

### Film Grain (Random Static)
```
░▒▓█░▓▒░█▒▓░▒█▓░▒▓█░▒█▓░▓▒░█▒▓░▒▓█░▒█
▓░▒█▓░▒▓█░▓▒░█▒▓░▒▓█░▒█▓░▓▒░█▒▓░▒█▓░
█▒▓░▒█▓░▓▒░█▒▓░▒▓█░▓▒░█▒▓░▒█▓░▓▒░█▒
  (regenerated every frame, opacity 0.12)
```

---

## ANIMATION PREVIEWS

### Blinking Sequence (3 frames, 200ms total)
```
Frame 1: NEUTRAL (eyes open)
    ████      ████
    █▓▓█      █▓▓█

    ▼ 100ms ▼

Frame 2: BLINK (eyes closed)
    ────      ────

    ▼ 100ms ▼

Frame 3: NEUTRAL (eyes open)
    ████      ████
    █▓▓█      █▓▓█
```

### Gavel Strike Sequence (3 frames, 200ms total)
```
Frame 1: RAISED         Frame 2: STRIKE         Frame 3: RAISED
(100ms)                 (50ms)                  (50ms)

████████████            ││││                    ████████████
    ││││                ││││                        ││││
    ││││                ████████████                ││││
    ││││                ░░░░░░░░░░░░  ← Flash       ││││
    ││││                 ▒▒▒▒▒▒▒▒▒▒   ← Dust        ││││
```

---

**Notes:**
- ASCII art is approximate representation
- Actual sprites should be painted at native 128x128 resolution
- Colors indicated by symbols:
  - `█` = Solid black/dark
  - `▓` = Medium grey/shadow
  - `▒` = Light grey
  - `░` = Very light/white
  - `─│` = Lines (features)

**For Pixel Artists:**
Use this reference as layout guide, then paint actual sprites in Aseprite/pixel editor using exact palette colors from PIXEL_ART_GUIDE.md

---

**Last Updated:** 2025-10-19
**Status:** Reference Complete
