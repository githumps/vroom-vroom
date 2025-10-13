# WIDGET SPECIFICATIONS - COMPLETE SETUP GUIDE
## WBP_ArrestMessage & WBP_PaperworkUI

---

## WBP_ArrestMessage WIDGET

**Location:** `Content/Blueprints/UI/WBP_ArrestMessage`

**Widget Type:** User Widget
**Parent Class:** UserWidget

---

### DESIGNER TAB - WIDGET HIERARCHY

```
[Root] Canvas Panel
└─ Overlay_Main
   └─ Border_Background
      └─ VerticalBox_Content
         ├─ TextBlock_Title
         ├─ Spacer_1
         ├─ TextBlock_Crime
         ├─ Spacer_2
         ├─ TextBlock_Instruction
         └─ Spacer_3
```

---

### WIDGET COMPONENT DETAILS

#### Canvas Panel (Root)
**Properties:**
- Name: CanvasPanel_Root
- Is Variable: FALSE
- Anchors: Fill Screen (0,0 to 1,1)

---

#### Overlay_Main
**Properties:**
- Name: Overlay_Main
- Is Variable: FALSE
- Slot (Canvas Panel Slot):
  - Anchors: Fill Screen (0,0 to 1,1)
  - Offsets: 0, 0, 0, 0
  - Alignment: 0.5, 0.5

---

#### Border_Background
**Properties:**
- Name: Border_Background
- Is Variable: FALSE
- Appearance:
  - Brush Color: Black (R:0, G:0, B:0, A:0.8)
  - Brush Image: None (solid color)
- Slot (Overlay Slot):
  - Horizontal Alignment: Fill
  - Vertical Alignment: Fill
- Padding: 50, 50, 50, 50

---

#### VerticalBox_Content
**Properties:**
- Name: VerticalBox_Content
- Is Variable: FALSE
- Slot (Border Slot):
  - Horizontal Alignment: Center
  - Vertical Alignment: Center
  - Padding: 20, 20, 20, 20

---

#### TextBlock_Title
**Properties:**
- Name: TextBlock_Title
- Is Variable: FALSE
- Content:
  - Text: "YOU'RE UNDER ARREST!"
- Appearance:
  - Font:
    - Family: Roboto (or default bold font)
    - Typeface: Bold
    - Size: 72
  - Color and Opacity: Red (R:1.0, G:0.0, B:0.0, A:1.0)
  - Shadow Offset: 2, 2
  - Shadow Color: Black (R:0, G:0, B:0, A:0.8)
- Justification: Center
- Auto Wrap Text: FALSE
- Slot (Vertical Box Slot):
  - Horizontal Alignment: Center
  - Vertical Alignment: Top
  - Padding: 0, 20, 0, 10

---

#### Spacer_1
**Properties:**
- Name: Spacer_1
- Is Variable: FALSE
- Size:
  - Size Rule: Fixed
  - Value: 20.0
- Slot (Vertical Box Slot):
  - Size: Fill

---

#### TextBlock_Crime
**Properties:**
- Name: TextBlock_Crime
- Is Variable: FALSE
- Content:
  - Text: "CRIME: EXISTING"
- Appearance:
  - Font:
    - Family: Roboto
    - Typeface: Bold
    - Size: 48
  - Color and Opacity: White (R:1.0, G:1.0, B:1.0, A:1.0)
  - Shadow Offset: 2, 2
  - Shadow Color: Black (R:0, G:0, B:0, A:1.0)
- Justification: Center
- Auto Wrap Text: FALSE
- Slot (Vertical Box Slot):
  - Horizontal Alignment: Center
  - Vertical Alignment: Center
  - Padding: 0, 10, 0, 10

---

#### Spacer_2
**Properties:**
- Name: Spacer_2
- Is Variable: FALSE
- Size:
  - Size Rule: Fixed
  - Value: 20.0

---

#### TextBlock_Instruction
**Properties:**
- Name: TextBlock_Instruction
- Is Variable: FALSE
- Content:
  - Text: "REPORT TO COURT IMMEDIATELY"
- Appearance:
  - Font:
    - Family: Roboto
    - Typeface: Regular
    - Size: 32
  - Color and Opacity: Yellow (R:1.0, G:1.0, B:0.0, A:1.0)
  - Shadow Offset: 2, 2
  - Shadow Color: Black (R:0, G:0, B:0, A:0.8)
- Justification: Center
- Auto Wrap Text: TRUE
- Slot (Vertical Box Slot):
  - Horizontal Alignment: Center
  - Vertical Alignment: Center
  - Padding: 0, 10, 0, 20

---

#### Spacer_3
**Properties:**
- Name: Spacer_3
- Is Variable: FALSE
- Size:
  - Size Rule: Fixed
  - Value: 20.0

---

### GRAPH TAB - BLUEPRINT LOGIC

#### Event Construct

**Node 1: Event Construct**
- Location: (-500, 0)

**Node 2: Play Animation**
- Location: (-300, 0)
- Inputs:
  - Animation: Appear (create this animation - see below)
  - Play Mode: Forward
  - Playback Speed: 1.0
  - Num Loops to Play: 1
  - Start at Time: 0.0
- Connected: Event Construct → Play Animation

**Node 3: Set Game Paused (OPTIONAL - if you want to pause game)**
- Location: (-100, 0)
- Inputs:
  - Paused: TRUE
- Connected: Play Animation → Set Game Paused

---

### ANIMATIONS TAB

#### Animation: Appear

**Create New Animation:**
1. Click "+ Animation" button
2. Name: "Appear"
3. Duration: 0.3 seconds

**Track 1: Render Opacity**
- Target: Border_Background
- Track: Render Opacity
- Keyframes:
  - 0.0s: Value = 0.0
  - 0.3s: Value = 1.0
- Interpolation: Ease In

**Track 2: Render Scale**
- Target: VerticalBox_Content
- Track: Render Transform → Scale
- Keyframes:
  - 0.0s: Scale = (0.8, 0.8)
  - 0.3s: Scale = (1.0, 1.0)
- Interpolation: Ease Out (Cubic)

---

## WBP_PaperworkUI WIDGET

**Location:** `Content/Blueprints/UI/WBP_PaperworkUI`

**Widget Type:** User Widget
**Parent Class:** UserWidget

---

### DESIGNER TAB - WIDGET HIERARCHY

```
[Root] Canvas Panel
└─ VerticalBox_Main
   ├─ Spacer_Top
   ├─ TextBlock_Header
   ├─ Spacer_1
   ├─ Border_Document
   │  └─ VerticalBox_Charges
   │     ├─ TextBlock_ChargesHeader
   │     ├─ TextBlock_Charge1
   │     ├─ TextBlock_Charge2
   │     ├─ TextBlock_Charge3
   │     ├─ TextBlock_Charge4
   │     ├─ TextBlock_Charge5
   │     └─ TextBlock_Charge6
   ├─ Spacer_2
   ├─ TextBlock_Verdict
   ├─ Spacer_3
   └─ Button_Accept
      └─ TextBlock_ButtonText
```

---

### WIDGET COMPONENT DETAILS

#### Canvas Panel (Root)
**Properties:**
- Name: CanvasPanel_Root
- Is Variable: FALSE

---

#### VerticalBox_Main
**Properties:**
- Name: VerticalBox_Main
- Is Variable: FALSE
- Slot (Canvas Panel Slot):
  - Anchors: Center (0.5, 0.5 to 0.5, 0.5)
  - Alignment: 0.5, 0.5
  - Size to Content: TRUE

---

#### Spacer_Top
**Properties:**
- Size: 50.0 (Fixed)

---

#### TextBlock_Header
**Properties:**
- Name: TextBlock_Header
- Text: "OFFICIAL COURT DOCUMENTS"
- Font:
  - Size: 48
  - Typeface: Bold
- Color: Black (R:0, G:0, B:0, A:1.0)
- Justification: Center
- Shadow Offset: 1, 1
- Shadow Color: Gray (R:0.5, G:0.5, B:0.5, A:0.5)

---

#### Spacer_1
**Properties:**
- Size: 30.0 (Fixed)

---

#### Border_Document
**Properties:**
- Name: Border_Document
- Is Variable: FALSE
- Appearance:
  - Brush Color: White (R:1.0, G:1.0, B:1.0, A:1.0)
  - Brush Image: None
  - Border Color: Black (R:0, G:0, B:0, A:1.0)
  - Border Thickness: 3.0
- Padding: 30, 30, 30, 30
- Slot (Vertical Box):
  - Horizontal Alignment: Center
  - Size: Fixed (800 x auto)

---

#### VerticalBox_Charges
**Properties:**
- Name: VerticalBox_Charges
- Padding: 10, 10, 10, 10

---

#### TextBlock_ChargesHeader
**Properties:**
- Text: "CHARGES:"
- Font Size: 32
- Typeface: Bold
- Color: Black
- Slot Padding: 0, 0, 0, 10

---

#### TextBlock_Charge1
**Properties:**
- Text: "- Existing without a permit"
- Font Size: 24
- Color: Dark Gray (R:0.2, G:0.2, B:0.2, A:1.0)
- Slot Padding: 10, 5, 0, 5

---

#### TextBlock_Charge2
**Properties:**
- Text: "- Operating a vehicle while alive"
- Font Size: 24
- Color: Dark Gray
- Slot Padding: 10, 5, 0, 5

---

#### TextBlock_Charge3
**Properties:**
- Text: "- Suspicious behavior (moving)"
- Font Size: 24
- Color: Dark Gray
- Slot Padding: 10, 5, 0, 5

---

#### TextBlock_Charge4
**Properties:**
- Text: "- Resisting future arrest"
- Font Size: 24
- Color: Dark Gray
- Slot Padding: 10, 5, 0, 5

---

#### TextBlock_Charge5
**Properties:**
- Text: "- General vibe violations"
- Font Size: 24
- Color: Dark Gray
- Slot Padding: 10, 5, 0, 5

---

#### TextBlock_Charge6
**Properties:**
- Text: "- Failure to not be noticed"
- Font Size: 24
- Color: Dark Gray
- Slot Padding: 10, 5, 0, 5

---

#### Spacer_2
**Properties:**
- Size: 30.0 (Fixed)

---

#### TextBlock_Verdict
**Properties:**
- Name: TextBlock_Verdict
- Text: "VERDICT: EXTREMELY GUILTY"
- Font:
  - Size: 36
  - Typeface: Bold
- Color: Red (R:1.0, G:0.0, B:0.0, A:1.0)
- Justification: Center
- Shadow Offset: 2, 2
- Shadow Color: Black (R:0, G:0, B:0, A:0.5)

---

#### Spacer_3
**Properties:**
- Size: 20.0 (Fixed)

---

#### Button_Accept
**Properties:**
- Name: Button_Accept
- Is Variable: TRUE (checked - need to bind click event)
- Style:
  - Normal:
    - Tint: Dark Red (R:0.6, G:0.0, B:0.0, A:1.0)
  - Hovered:
    - Tint: Red (R:0.8, G:0.0, B:0.0, A:1.0)
  - Pressed:
    - Tint: Dark Red (R:0.4, G:0.0, B:0.0, A:1.0)
- Slot:
  - Horizontal Alignment: Center
  - Size: Fixed (400 x 60)
  - Padding: 0, 10, 0, 10

---

#### TextBlock_ButtonText
**Properties:**
- Name: TextBlock_ButtonText
- Text: "SIGN HERE (You Have No Choice)"
- Font Size: 24
- Color: White
- Justification: Center
- Slot (Button Slot):
  - Horizontal Alignment: Center
  - Vertical Alignment: Center

---

### GRAPH TAB - BLUEPRINT LOGIC

#### Variables

**Variable 1: bCanClose**
- Type: Boolean
- Default: FALSE
- Instance Editable: FALSE

---

#### Event Construct

**Node 1: Event Construct**
- Location: (-500, 0)

**Node 2: Set Input Mode UI Only**
- Location: (-300, 0)
- Target: Get Player Controller (index 0)
- Inputs:
  - Widget to Focus: Self
- Connected: Event Construct → Set Input Mode

**Node 3: Set Show Mouse Cursor**
- Location: (-100, 0)
- Target: Get Player Controller
- Inputs:
  - Show Mouse Cursor: TRUE
- Connected: Set Input Mode → Set Show Mouse Cursor

---

#### Button_Accept - OnClicked Event

**Node 1: OnClicked (Button_Accept)**
- Location: (-500, 200)

**Node 2: Play Sound 2D (OPTIONAL)**
- Location: (-300, 200)
- Inputs:
  - Sound: Paper_Rustle_Sound (if available)
  - Volume Multiplier: 1.0
- Connected: OnClicked → Play Sound

**Node 3: Remove from Parent**
- Location: (-100, 200)
- Target: Self
- Connected: Play Sound → Remove from Parent

**Node 4: Open Level**
- Location: (100, 200)
- Inputs:
  - Level Name: "MainMenu" (or restart current level with "Get Current Level Name")
- Connected: Remove from Parent → Open Level

---

### ALTERNATIVE: Restart Level Instead

**Node 4 Alternative: Get Current Level Name**
- Location: (100, 200)

**Node 5: Open Level**
- Location: (300, 200)
- Inputs:
  - Level Name: Current Level Name output
- Connected: Get Current Level Name → Open Level

---

## WIDGET STYLE GUIDE

### Color Palette

**Arrest Message:**
- Background: Black with 80% opacity
- Title Text: Pure Red (#FF0000)
- Body Text: White (#FFFFFF)
- Accent Text: Yellow (#FFFF00)
- Shadows: Black with 80% opacity

**Paperwork UI:**
- Background: White (#FFFFFF)
- Document Border: Black (#000000)
- Header Text: Black (#000000)
- Body Text: Dark Gray (#333333)
- Verdict Text: Red (#FF0000)
- Button Normal: Dark Red (#990000)
- Button Hover: Red (#CC0000)
- Button Text: White (#FFFFFF)

### Font Recommendations

**Primary Fonts:**
1. Roboto (Default UE5 font)
2. Arial Bold
3. Impact (for dramatic effect)

**Size Scale:**
- Extra Large: 72pt (Main titles)
- Large: 48pt (Headers)
- Medium: 32pt (Subheaders)
- Regular: 24pt (Body text)

---

## RESPONSIVE DESIGN NOTES

### Screen Safe Zones

**Canvas Panel Anchors:**
- Use "Fill Screen" for full-screen overlays
- Use "Center" for centered content
- Add safe zone padding: 50px minimum on all sides

### DPI Scaling

**For Multiple Screen Resolutions:**
1. Enable "Apply DPI Scale" in widget settings
2. Use "Screen Size" scaling mode
3. Test on 1920x1080, 2560x1440, and 3840x2160

---

## TESTING CHECKLIST

### WBP_ArrestMessage Testing:

1. [ ] Widget appears centered on screen
2. [ ] Background is semi-transparent black
3. [ ] All text is readable and properly sized
4. [ ] "Appear" animation plays smoothly
5. [ ] Widget automatically transitions after 2 seconds
6. [ ] No z-fighting or rendering issues

### WBP_PaperworkUI Testing:

1. [ ] Widget appears on Courtroom level load
2. [ ] All charges are visible and absurd
3. [ ] Button is clickable and responds to hover
4. [ ] Mouse cursor appears and is functional
5. [ ] Clicking button returns to main menu/restarts
6. [ ] Widget is properly centered on all resolutions

---

## WIDGET CREATION WORKFLOW

### Step-by-Step Process:

**WBP_ArrestMessage (10 minutes):**
1. Create new Widget Blueprint (2 min)
2. Add Canvas Panel and hierarchy (3 min)
3. Configure text blocks with content and styling (3 min)
4. Create "Appear" animation (2 min)
5. Test in standalone preview (1 min)

**WBP_PaperworkUI (15 minutes):**
1. Create new Widget Blueprint (2 min)
2. Build widget hierarchy (4 min)
3. Add and style all text blocks (5 min)
4. Configure button with styling (2 min)
5. Add Event Graph logic (2 min)
6. Test button functionality (1 min)

**Total Widget Time: ~25 minutes**

---

## COMMON WIDGET ISSUES AND FIXES

### Issue: Widget Not Appearing

**Fix:**
- Verify "Add to Viewport" is called
- Check Z-Order (higher number = front)
- Ensure widget class reference is valid
- Check visibility settings (all set to Visible)

### Issue: Text Not Readable

**Fix:**
- Increase font size
- Add shadow or outline
- Increase contrast with background
- Check text color alpha channel

### Issue: Button Not Clickable

**Fix:**
- Verify "Is Variable" is checked
- Check button visibility setting
- Ensure OnClicked event is bound
- Verify input mode is set to UI Only

### Issue: Animation Not Playing

**Fix:**
- Check animation track targets are valid
- Verify Play Animation node is connected
- Ensure animation duration > 0
- Check keyframe interpolation settings

---

## WIDGET ACCESSIBILITY NOTES

### For Better UX:

1. **Font Size:** Keep minimum 24pt for body text
2. **Contrast Ratio:** 4.5:1 minimum for readability
3. **Button Size:** Minimum 100x40px for clickability
4. **Spacing:** 10px minimum between interactive elements
5. **Feedback:** Visual changes on button hover/press

---

## WIDGETS READY FOR CONSTRUCTION

All specifications complete. Follow hierarchy and properties exactly for consistent results.

Build widgets in Designer tab, then add logic in Graph tab.

Test frequently in standalone preview mode before integrating into gameplay.

YOUR UI IS THE LAW. MAKE IT CLEAR AND UNMISTAKABLE.
