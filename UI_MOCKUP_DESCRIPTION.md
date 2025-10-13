# API Key System - UI Visual Description

## 1. Initial API Key Modal (First Load)

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║  ╔══════════════════════════════════════════════════════════════╗  ║
║  ║                                                              ║  ║
║  ║              Optional: Enhanced Experience                   ║  ║
║  ║              ════════════════════════════                    ║  ║
║  ║                                                              ║  ║
║  ║  Provide your free Gemini API key for AI-generated          ║  ║
║  ║  charges and judge commentary.                               ║  ║
║  ║                                                              ║  ║
║  ║  Get your free API key at:                                   ║  ║
║  ║  https://makersuite.google.com/app/apikey                   ║  ║
║  ║  (clickable link in green with underline)                    ║  ║
║  ║                                                              ║  ║
║  ║  ┌────────────────────────────────────────────────────────┐  ║  ║
║  ║  │ Privacy Notice:                                        │  ║  ║
║  ║  │ Your API key stays in your browser session only.       │  ║  ║
║  ║  │ It is never sent to any server except Google's         │  ║  ║
║  ║  │ Gemini API. The key is cleared when you close your     │  ║  ║
║  ║  │ browser.                                                │  ║  ║
║  ║  └────────────────────────────────────────────────────────┘  ║  ║
║  ║                                                              ║  ║
║  ║  ┌────────────────────────────────────────────────────────┐  ║  ║
║  ║  │ ••••••••••••••••••••••                                 │  ║  ║
║  ║  └────────────────────────────────────────────────────────┘  ║  ║
║  ║  (Password-masked input field)                               ║  ║
║  ║                                                              ║  ║
║  ║  [ ] Don't ask again                                         ║  ║
║  ║                                                              ║  ║
║  ║  ┌───────────────────┐    ┌────────────────────────┐        ║  ║
║  ║  │   Use API Key     │    │  Skip (Use Default)    │        ║  ║
║  ║  └───────────────────┘    └────────────────────────┘        ║  ║
║  ║                                                              ║  ║
║  ╚══════════════════════════════════════════════════════════════╝  ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

Colors:
- Background: Black with 98% opacity overlay
- Border: Bright green (#0f0) with glow effect
- Text: Bright green (#0f0)
- Link: Green with underline, turns white on hover
- Privacy box: Dark green background with green border
- Buttons: Black bg, green border, inverts on hover
```

## 2. Main Menu with Settings Button

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                                                                    ║
║                         VROOM VROOM                                ║
║                         ═══════════                                ║
║                    (glowing green title)                           ║
║                                                                    ║
║          A game about freedom, bureaucracy, and consequences       ║
║                                                                    ║
║                                                                    ║
║                     ┌─────────────────┐                            ║
║                     │   NEW GAME      │                            ║
║                     └─────────────────┘                            ║
║                                                                    ║
║                     ┌─────────────────┐                            ║
║                     │   LOAD GAME     │                            ║
║                     └─────────────────┘                            ║
║                                                                    ║
║                     ┌─────────────────┐                            ║
║                     │   SETTINGS      │  ← NEW BUTTON              ║
║                     └─────────────────┘                            ║
║                                                                    ║
║                     ┌─────────────────┐                            ║
║                     │   CREDITS       │                            ║
║                     └─────────────────┘                            ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

## 3. Settings Modal

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║  ╔══════════════════════════════════════════════════════════════╗  ║
║  ║                                                              ║  ║
║  ║                         Settings                             ║  ║
║  ║                         ════════                             ║  ║
║  ║                                                              ║  ║
║  ║  ┌────────────────────────────────────────────────────────┐  ║  ║
║  ║  │ Current Status: Using AI-Generated Charges             │  ║  ║
║  ║  │                 (cyan color)                            │  ║  ║
║  ║  │                 OR                                      │  ║  ║
║  ║  │ Current Status: Using Default Charges                  │  ║  ║
║  ║  │                 (yellow color)                          │  ║  ║
║  ║  └────────────────────────────────────────────────────────┘  ║  ║
║  ║                                                              ║  ║
║  ║  Gemini API Key                                              ║  ║
║  ║  Enable AI-generated charges and judge commentary by         ║  ║
║  ║  providing your free Gemini API key.                         ║  ║
║  ║                                                              ║  ║
║  ║  Get your free API key at:                                   ║  ║
║  ║  https://makersuite.google.com/app/apikey                   ║  ║
║  ║  (clickable green link)                                      ║  ║
║  ║                                                              ║  ║
║  ║  ┌────────────────────────────────────────────────────────┐  ║  ║
║  ║  │ ••••••••••••••••••••••                                 │  ║  ║
║  ║  └────────────────────────────────────────────────────────┘  ║  ║
║  ║                                                              ║  ║
║  ║  ┌────────────────────────────────────────────────────────┐  ║  ║
║  ║  │ Security:                                              │  ║  ║
║  ║  │ - Stored in sessionStorage only (cleared on close)     │  ║  ║
║  ║  │ - Never sent to any server except Google's API         │  ║  ║
║  ║  │ - No tracking or logging of your key                   │  ║  ║
║  ║  └────────────────────────────────────────────────────────┘  ║  ║
║  ║                                                              ║  ║
║  ║  (Test result appears here when testing)                     ║  ║
║  ║  ┌────────────────────────────────────────────────────────┐  ║  ║
║  ║  │ ✓ API key is valid and working!                        │  ║  ║
║  ║  └────────────────────────────────────────────────────────┘  ║  ║
║  ║                                                              ║  ║
║  ║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐  ║  ║
║  ║  │ Save Key   │ │  Test Key  │ │ Remove Key │ │  Close  │  ║  ║
║  ║  └────────────┘ └────────────┘ └────────────┘ └─────────┘  ║  ║
║  ║                                                              ║  ║
║  ╚══════════════════════════════════════════════════════════════╝  ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

## 4. AI Status Indicator (Top-Right HUD)

### When Using AI:
```
┌──────────────────────────────────────┐
│ AI-Generated Charges Active          │
│ (cyan border with glow, cyan text)   │
└──────────────────────────────────────┘
```

### When Using Defaults:
```
┌──────────────────────────────────────┐
│ Using Default Charges                │
│ (yellow border, yellow text)         │
└──────────────────────────────────────┘
```

**Position:** Fixed to top-right corner of screen during gameplay
**Visibility:** Always visible during driving and courtroom scenes
**Background:** Black with 90% opacity
**Size:** Compact, non-intrusive

## 5. Courtroom Scene with AI Message

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                    PAPERWORK SIMULATOR 3000                        ║
║                                                                    ║
║  You have been pulled over. Please complete ALL forms in           ║
║  triplicate.                                                       ║
║                                                                    ║
║  ┌────────────────────────────────────────────────────────────┐   ║
║  │                                                            │   ║
║  │              ⚖️  JUDGE HARDCASTLE  ⚖️                      │   ║
║  │                                                            │   ║
║  │  ┌──────────────────────────────────────────────────────┐ │   ║
║  │  │ CHARGES:                                             │ │   ║
║  │  │ • Operating a vehicle at 47 km/h                     │ │   ║
║  │  │ • Violation of Form TX-401: Unauthorized Momentum    │ │   ║
║  │  │ • Excessive joy during vehicular operation           │ │   ║
║  │  │ • Failure to submit pre-driving meditation report    │ │   ║
║  │  │ • Possession of car keys with felonious intent       │ │   ║
║  │  │ (AI-generated if key present, otherwise defaults)    │ │   ║
║  │  └──────────────────────────────────────────────────────┘ │   ║
║  │                                                            │   ║
║  │  "Do you know why you're here? You were DRIVING."         │   ║
║  │                                                            │   ║
║  │  Mood: IRRITATED | Patience: 85%                          │   ║
║  │                                                            │   ║
║  └────────────────────────────────────────────────────────────┘   ║
║                                                                    ║
║  [Form fields below...]                                            ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

## Color Palette
- **Primary:** #0f0 (Bright Green) - Used for borders, text, highlights
- **Cyan:** #0ff - Used for AI active status
- **Yellow:** #ff0 - Used for default status
- **Red:** #f00 - Used for judge dialogue and charges
- **Background:** #000 (Black)
- **Overlay:** rgba(0, 0, 0, 0.98) - Nearly opaque black
- **Glow:** text-shadow and box-shadow with green color

## Typography
- **Font:** 'Courier New', monospace
- **Sizes:**
  - Titles: 2em
  - Body text: 1.1em
  - Buttons: 1.2em
  - Privacy notices: 0.9em

## Interaction States
- **Buttons:**
  - Default: Black bg, green border
  - Hover: Green bg, black text, glow effect
  - Active: Same as hover with slight scale

- **Links:**
  - Default: Green with underline
  - Hover: White with green glow

- **Input Fields:**
  - Default: Black bg, green border
  - Focus: Green glow shadow
  - Text: Green color

## Animations
- Modal appearance: Fade in (0.3s)
- Button hover: All properties transition (0.2s)
- Message box: Slide up from bottom
- Status indicator: Fade in when active

## Responsive Behavior
- Modals: Max-width 600px, centered
- Buttons: Flex layout with wrap for mobile
- Text: Readable on all screen sizes
- Touch targets: Minimum 44x44px for mobile
