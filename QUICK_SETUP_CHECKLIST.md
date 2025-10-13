# VROOM VROOM - QUICK UI SETUP CHECKLIST

## STEP-BY-STEP CREATION ORDER (Open Unreal Editor First!)

### 1️⃣ CREATE WBP_MAINMENU
- [ ] Content/Blueprints/UI → Right-click → User Interface → Widget Blueprint
- [ ] Name: **WBP_MainMenu**
- [ ] Design:
  - Canvas Panel
  - Vertical Box (centered)
  - Text: "VROOM VROOM" (size 120, yellow)
  - Text: "A Definitely Normal Driving Simulator™" (size 36, gray)
  - Button: "NEW GAME" (400x80)
  - Button: "QUIT" (400x80)
- [ ] Graph:
  - Event Construct → Set Input Mode UI Only + Show Mouse Cursor
  - NewGameButton.OnClicked → Open Level "OpenWorld"
  - QuitButton.OnClicked → Quit Game

---

### 2️⃣ CREATE BP_MAINMENUMANAGER
- [ ] Content/Blueprints/Core → Blueprint Class → Actor
- [ ] Name: **BP_MainMenuManager**
- [ ] Graph:
  - Event BeginPlay → Create Widget (WBP_MainMenu) → Add to Viewport

---

### 3️⃣ CREATE MAINMENU LEVEL
- [ ] File → New Level → Empty Level
- [ ] Save as: **Content/Maps/MainMenu**
- [ ] Drag BP_MainMenuManager into level
- [ ] Save

---

### 4️⃣ CREATE WBP_PAPERWORKFORM (THE FUNNY ONE!)
- [ ] Content/Blueprints/UI → Widget Blueprint
- [ ] Name: **WBP_PaperworkForm**
- [ ] Design with Scroll Box containing:

**TEXT FIELDS (Editable Text Box):**
1. Full Legal Name (include middle names, maiden names, nicknames, aliases, and preferred titles)
2. Mother's Maiden Name
3. Father's Mother's Maiden Name (Paternal Grandmother)
4. Social Security Number (or equivalent national ID)
5. Blood Type (include Rh factor)
6. Did you know you were existing? (Y/N)
7. List all vehicles you have operated in the past 15 years (make, model, year, VIN) - MULTILINE
8. Explain in exactly 500 words why operating a vehicle was a good idea (word count will be verified) - MULTILINE
9. List three references who can attest to your vehicular competence - MULTILINE
10. Emergency Contact (Name, Relationship, Phone, Blood Type)

**CHECKBOXES:**
- [ ] Owner / [ ] Borrower / [ ] Unlawful Acquirer / [ ] Spiritual Connection
- [ ] I have read and agree to Form 47-B Subsection 12, Paragraph 7, Line 4, Word 9 ('the')
- [ ] I acknowledge that I am guilty of vehicular misconduct regardless of circumstances
- [ ] I waive all rights to legal representation, fair trial, and human dignity
- [ ] I hereby surrender my soul to the Department of Motor Vehicles

**BUTTONS:**
- SUBMIT FORM
- CANCEL

- [ ] Create Variables for ALL fields (bind them)
- [ ] Create Function: **ValidateForm** (checks all fields, returns bool)
- [ ] Create Function: **ClearAllFields** (clears everything - EVIL!)
- [ ] Graph:
  - SubmitButton.OnClicked:
    - If ValidateForm = FALSE:
      - Show error "⚠️ INCOMPLETE FORM! ALL FIELDS ARE MANDATORY! STARTING OVER..."
      - Delay 2 seconds
      - ClearAllFields (EVIL!)
    - If ValidateForm = TRUE:
      - Create WBP_SentenceDisplay → Add to Viewport
      - Remove this widget
      - Delay 5 seconds → Open Level "OpenWorld"

---

### 5️⃣ CREATE WBP_SENTENCEDISPLAY
- [ ] Content/Blueprints/UI → Widget Blueprint
- [ ] Name: **WBP_SentenceDisplay**
- [ ] Design:
  - Border (centered, 800x400, dark red)
  - Text: "JUDGMENT RENDERED" (size 48, red)
  - Text: "You are hereby sentenced to 15 years of bureaucratic paperwork.\n\nYour driving privileges have been revoked indefinitely.\n\nThank you for your compliance." (size 24, white)

---

### 6️⃣ CREATE WBP_HUD
- [ ] Content/Blueprints/UI → Widget Blueprint
- [ ] Name: **WBP_HUD**
- [ ] Design:
  - Horizontal Box (bottom-left corner)
  - Text: "SPEED: " (size 36, white)
  - Text: "0" (size 36, yellow) ← bind to speed
- [ ] Graph:
  - Variable: VehicleReference (Actor)
  - Event Tick: Get VehicleReference velocity → Calculate speed → Update text

---

### 7️⃣ INTEGRATE HUD WITH VEHICLE
- [ ] Open your player vehicle Blueprint (BP_VehicleBase or similar)
- [ ] Event BeginPlay (add):
  - Create Widget (WBP_HUD) → Add to Viewport
  - Set VehicleReference to Self

---

### 8️⃣ SET STARTUP LEVEL
- [ ] Edit → Project Settings → Maps & Modes
- [ ] Game Default Map: **MainMenu**
- [ ] Editor Startup Map: **MainMenu**

---

## 🎮 TESTING

1. **Play from Main Menu:**
   - [ ] Title displays correctly
   - [ ] NEW GAME opens OpenWorld level
   - [ ] QUIT closes game

2. **Test Paperwork Form (in-game):**
   - [ ] Submit empty form → Error message → ALL FIELDS CLEAR (evil!)
   - [ ] Fill all fields except one → Error → CLEAR AGAIN (double evil!)
   - [ ] Fill all fields correctly → Sentence displays → Return to game

3. **Test HUD:**
   - [ ] Speed displays when driving
   - [ ] Updates in real-time

---

## 🎨 HUMOR CHECKLIST

- [ ] Title includes trademark symbol (™)
- [ ] Form asks for paternal grandmother's maiden name
- [ ] Form has "Unlawful Acquirer" as vehicle relationship option
- [ ] Checkbox admits guilt "regardless of circumstances"
- [ ] Checkbox surrenders soul to DMV
- [ ] Essay must be EXACTLY 500 words
- [ ] ALL fields clear on ANY error (maximum frustration!)
- [ ] Sentence mentions "bureaucratic paperwork"

---

## 📁 FILES CREATED

**Widgets:**
- `Content/Blueprints/UI/WBP_MainMenu.uasset`
- `Content/Blueprints/UI/WBP_PaperworkForm.uasset`
- `Content/Blueprints/UI/WBP_SentenceDisplay.uasset`
- `Content/Blueprints/UI/WBP_HUD.uasset`

**Blueprints:**
- `Content/Blueprints/Core/BP_MainMenuManager.uasset`

**Levels:**
- `Content/Maps/MainMenu.umap`

---

## 🚨 CRITICAL VALIDATION LOGIC FOR PAPERWORK FORM

```
ValidateForm Function:
1. Check all 10 text fields are NOT empty
2. Check essay word count = EXACTLY 500 words
3. Check at least ONE relationship checkbox is checked
4. Check ALL 4 legal checkboxes are checked
5. Return TRUE only if ALL conditions met

If FALSE → Show error → Delay → ClearAllFields!
```

---

## ✅ YOU'RE DONE WHEN:

- Main menu works
- Paperwork form is hilariously evil
- Form validation clears everything on error
- HUD displays speed
- Game flows: Main Menu → Game → Paperwork → Sentence → Game

**NOW GO CREATE IT IN THE EDITOR!** 🚗💨
