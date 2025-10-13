# QUICK START: ARREST SYSTEM SETUP
## 45-Minute Implementation Guide

---

## OVERVIEW

This guide gets the arrest system working in 45 minutes. You can test the complete arrest → courtroom loop, then add the detailed paperwork form later.

**What You'll Build:**
1. Police collision triggers arrest
2. Arrest message displays
3. Level transitions to Courtroom
4. Mouse cursor appears
5. Paperwork UI spawns (placeholder or full version)

**Time:** 45 minutes
**Difficulty:** Intermediate (Blueprint knowledge helpful)

---

## STEP 1: CREATE ARREST MESSAGE WIDGET (5 minutes)

### A. Create Widget Blueprint

1. **Content Browser** → Navigate to `Blueprints/UI` folder
2. **Right-click** in empty space
3. **User Interface** → **Widget Blueprint**
4. **Name:** `WBP_ArrestNotification`
5. **Double-click** to open

### B. Design Widget

**Canvas Panel** (should already be Root)

**Add Text Block:**
1. Drag **Text Block** from Palette → Canvas Panel
2. **Rename** to "ArrestMessageText"
3. **Details Panel → Content:**
   - Text: `YOU'RE UNDER ARREST FOR: EXISTING`
4. **Details Panel → Appearance:**
   - Font Size: **48**
   - Color: **Red** (R: 1.0, G: 0.0, B: 0.0, A: 1.0)
   - Font: **Bold** (if available)
5. **Details Panel → Slot (Canvas Panel Slot):**
   - Anchors: **Center** (click center dot in anchor selector)
   - Alignment: X: **0.5**, Y: **0.5**
   - Size to Content: **TRUE**

### C. Compile and Save

1. Click **Compile** button (top toolbar)
2. Click **Save** button
3. **Close** widget editor

**✅ Checkpoint:** WBP_ArrestNotification exists in Content Browser

---

## STEP 2: ADD ARREST COLLISION TO BP_POLICEVEHICLE (15 minutes)

### A. Open Blueprint

1. **Content Browser** → `Blueprints/Vehicles`
2. **Double-click** `BP_PoliceVehicle`
3. Blueprint Editor opens

### B. Add Collision Event

1. **Components Panel** (top-left)
2. **Click** collision component (might be "CollisionComponent", "Mesh", or root component)
3. **Details Panel** (right side)
4. **Scroll down** to **Events** section
5. Click **[+]** next to **On Component Begin Overlap**
6. This creates **Event ActorBeginOverlap** node in Event Graph

### C. Build Event Graph

Now you're in the **Event Graph**. Build this node chain:

**Node 1: Event ActorBeginOverlap**
- Already created (red event node)

**Node 2: Cast to BP_VroomCharacter**
- **Right-click** → Search: "Cast to BP_VroomCharacter"
- **Connect:** Event's "Other Actor" pin → Cast's "Object" pin
- **Connect:** Event's execution pin → Cast's execution pin

**Node 3: Branch**
- **Right-click** → Search: "Branch"
- **Connect:** Cast's "Cast Success" pin → Branch's "Condition" pin
- **Connect:** Cast's execution pin → Branch's execution pin

**From Branch TRUE pin:**

**Node 4: Get Player Controller**
- **Right-click** → Search: "Get Player Controller"
- **In Details:** Player Index: **0**

**Node 5: Create Widget**
- **Right-click** → Search: "Create Widget"
- **Connect:** Branch TRUE → Create Widget execution
- **In Details:** Class: Select **WBP_ArrestNotification**
- **Connect:** Get Player Controller → "Owning Player" pin

**Node 6: Add to Viewport**
- **Right-click** → Search: "Add to Viewport"
- **Connect:** Create Widget execution → Add to Viewport execution
- **Connect:** Create Widget "Return Value" → Add to Viewport "Target"
- **In Details:** Z Order: **100**

**Node 7: Delay**
- **Right-click** → Search: "Delay"
- **Connect:** Add to Viewport execution → Delay execution
- **In Details:** Duration: **2.0**

**Node 8: Remove from Parent**
- **Right-click** → Search: "Remove from Parent"
- **Connect:** Delay "Completed" → Remove from Parent execution
- **Connect:** Create Widget "Return Value" → Remove from Parent "Target"
  (You'll need to drag from Create Widget output again or use a variable)

**Node 9: Open Level (by Name)**
- **Right-click** → Search: "Open Level"
- **Connect:** Remove from Parent execution → Open Level execution
- **In Details:** Level Name: `Courtroom` (EXACTLY this spelling)

### D. Compile and Save

1. **Compile** button (should be green checkmark)
2. If errors, check connections
3. **Save** button
4. **Close** blueprint

**✅ Checkpoint:** BP_PoliceVehicle has arrest collision logic

---

## STEP 3: CREATE BP_COURTROOMMANAGER (20 minutes)

### A. Create Blueprint (if doesn't exist)

1. **Content Browser** → `Blueprints/Core`
2. **Right-click** → **Blueprint Class**
3. **Parent Class:** **Actor**
4. **Name:** `BP_CourtroomManager`
5. **Double-click** to open

### B. Add Variables

1. **Variables Panel** (left side, below Components)
2. Click **[+]** to add variable

**Variable 1: PaperworkWidgetClass**
- **Name:** `PaperworkWidgetClass`
- **Variable Type:** Click type dropdown → Search "Widget" → **User Widget (Class Reference)**
- **Instance Editable:** Check the **eye icon** (makes it public)
- **Category:** Type "Courtroom Settings"
- **Tooltip:** "The paperwork UI widget to spawn"
- Click **Compile** to save

**Variable 2: PaperworkWidgetInstance**
- **Name:** `PaperworkWidgetInstance`
- **Variable Type:** **User Widget (Object Reference)**
- **Instance Editable:** UNCHECKED (private)
- **Category:** "Courtroom Settings"
- Click **Compile** to save

### C. Build Event BeginPlay

1. **Event Graph** tab
2. Find or create **Event BeginPlay** node

**Node 1: Print String (Debug)**
- **Right-click** → Search: "Print String"
- **Connect:** BeginPlay → Print String execution
- **In Details:**
  - In String: `Courtroom Manager: Initializing...`
  - Text Color: **Green** (R: 0, G: 1, B: 0)
  - Duration: **3.0**
  - Print to Screen: **TRUE**
  - Print to Log: **TRUE**

**Node 2: Get Player Controller**
- **Right-click** → Search: "Get Player Controller"
- Player Index: **0**

**Node 3: Set Input Mode UI Only**
- **Right-click** → Search: "Set Input Mode UI Only"
- **Connect:** Print String → Set Input Mode execution
- **Connect:** Get Player Controller → "Player Controller" pin
- **In Details:** Widget to Focus: **None** (leave empty)

**Node 4: Set Show Mouse Cursor**
- **Right-click** → Search: "Set Show Mouse Cursor"
- **Connect:** Set Input Mode → Set Show Mouse Cursor execution
- **Connect:** Get Player Controller → "Target" pin
- **In Details:** Show Mouse Cursor: **TRUE** (checked)

**Node 5: Delay**
- **Right-click** → Search: "Delay"
- **Connect:** Set Show Mouse Cursor → Delay execution
- **In Details:** Duration: **0.5**

**Node 6: Get PaperworkWidgetClass**
- **Variables Panel** → Drag "PaperworkWidgetClass" to Event Graph
- Choose **Get**

**Node 7: Is Valid**
- **Right-click** → Search: "Is Valid"
- **Connect:** Delay "Completed" → Is Valid execution
- **Connect:** PaperworkWidgetClass → "Input Object" pin

**Node 8: Branch**
- **Right-click** → Search: "Branch"
- **Connect:** Is Valid execution → Branch execution
- **Connect:** Is Valid "Is Valid" pin → Branch "Condition" pin

**From Branch TRUE pin:**

**Node 9: Create Widget**
- **Right-click** → Search: "Create Widget"
- **Connect:** Branch TRUE → Create Widget execution
- **Connect:** PaperworkWidgetClass variable → "Class" pin
- **Connect:** Get Player Controller (from earlier) → "Owning Player" pin

**Node 10: Set PaperworkWidgetInstance**
- **Variables Panel** → Drag "PaperworkWidgetInstance" to Event Graph
- Choose **Set**
- **Connect:** Create Widget execution → Set execution
- **Connect:** Create Widget "Return Value" → Set's value pin

**Node 11: Add to Viewport**
- **Right-click** → Search: "Add to Viewport"
- **Connect:** Set execution → Add to Viewport execution
- **Connect:** PaperworkWidgetInstance → "Target" pin
- **In Details:** Z Order: **10**

**Node 12: Print String (Success)**
- **Right-click** → Search: "Print String"
- **Connect:** Add to Viewport → Print String execution
- **In Details:**
  - In String: `Paperwork UI spawned successfully`
  - Text Color: **Green**
  - Duration: **3.0**

**From Branch FALSE pin:**

**Node 13: Print String (Error)**
- **Right-click** → Search: "Print String"
- **Connect:** Branch FALSE → Print String execution
- **In Details:**
  - In String: `ERROR: Paperwork Widget Class not set!`
  - Text Color: **Red** (R: 1, G: 0, B: 0)
  - Duration: **5.0**

### D. Compile and Save

1. **Compile** button
2. Fix any errors (check connections)
3. **Save** button
4. **Close** blueprint

**✅ Checkpoint:** BP_CourtroomManager exists with Event BeginPlay logic

---

## STEP 4: PLACE BP_COURTROOMMANAGER IN LEVEL (5 minutes)

### A. Open Courtroom Level

1. **Content Browser** → **Maps** folder
2. **Double-click** `Courtroom.umap`
3. Level opens in viewport

### B. Place Manager in Level

1. **Content Browser** → `Blueprints/Core`
2. Find **BP_CourtroomManager**
3. **Drag** it into the viewport
4. **Position:** Doesn't matter (X: 0, Y: 0, Z: 100 is fine)
5. It will appear in **Outliner** panel (right side)

### C. Configure Manager

1. **Outliner** → Click **BP_CourtroomManager**
2. **Details Panel** (right side)
3. Find **Courtroom Settings** category
4. Find **Paperwork Widget Class**
5. **Click dropdown** → Select `WBP_PaperworkForm`
   - If WBP_PaperworkForm doesn't exist yet, select **None** for now
   - You can create a placeholder or use WBP_MainMenu temporarily

### D. Save Level

1. **File** → **Save Current Level** (or Ctrl+S)
2. Level saved

**✅ Checkpoint:** BP_CourtroomManager placed and configured in Courtroom

---

## STEP 5: QUICK TEST (5 minutes)

### A. Test Arrest Message

1. **Open** OpenWorld.umap
2. **Click Play** button (or Alt+P)
3. **Drive** vehicle toward police
4. **Collide** with police car
5. **Observe:**
   - Arrest message appears?
   - Message displays for 2 seconds?
   - Level transitions to Courtroom?

**Expected:** Arrest message → 2 second delay → Courtroom loads

**If fails:** Check BP_PoliceVehicle Event Graph connections

### B. Test Courtroom Entry

1. Should be in Courtroom now
2. **Observe:**
   - Mouse cursor visible?
   - After 0.5 seconds, widget appears?
   - Can move cursor?

**Expected:** Cursor appears → Paperwork widget spawns (or error if not set)

**If fails:** Check BP_CourtroomManager Event BeginPlay, check Output Log

### C. Check Output Log

1. **Window** → **Developer Tools** → **Output Log**
2. Look for:
   - Green: "Courtroom Manager: Initializing..."
   - Green: "Paperwork UI spawned successfully" (if widget set)
   - OR Red: "ERROR: Paperwork Widget Class not set!" (if not set)

---

## WHAT YOU HAVE NOW

After completing these 5 steps:

**✅ Working:**
- Police collision triggers arrest
- Arrest message displays correctly
- Level transitions from OpenWorld to Courtroom
- Courtroom spawns player correctly
- Mouse cursor appears
- Input mode changes to UI
- Widget spawn system functional

**⚠️ Still Needs Work:**
- WBP_PaperworkForm (the detailed form with 10 fields)
- Form validation logic
- Evil form clearing mechanism
- Sentence display widget
- Return to OpenWorld logic

---

## NEXT STEPS

### Option A: Test with Placeholder

Create a simple placeholder widget:

1. Create `WBP_PaperworkForm_Placeholder`
2. Add a Button labeled "Return to Game"
3. Button OnClicked: `Open Level` "OpenWorld"
4. Set this as Paperwork Widget Class in manager
5. Test complete loop

**Time:** 10 minutes
**Result:** Can test full arrest → courtroom → return loop

---

### Option B: Create Full Paperwork Form

Follow detailed instructions:

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\PAPERWORK_FORM_BLUEPRINT_LOGIC.txt`

**Time:** 90 minutes
**Result:** Complete comedy experience with evil validation

---

### Option C: Iterate Gradually

1. Create basic form with 3 fields (20 min)
2. Add validation logic (15 min)
3. Add evil clearing (10 min)
4. Expand to all 10 fields (30 min)
5. Polish and test (15 min)

**Total Time:** 90 minutes
**Result:** Incremental progress, testable at each stage

---

## TROUBLESHOOTING

### Issue: Arrest message doesn't appear

**Check:**
- WBP_ArrestNotification exists
- BP_PoliceVehicle collision event is set up
- Cast to BP_VroomCharacter succeeds
- Create Widget node has correct class
- Output Log for errors

**Fix:**
- Add Print String nodes to debug
- Check collision channels
- Verify event is triggering

---

### Issue: Courtroom doesn't load

**Check:**
- Level name spelling: "Courtroom" (exact)
- Courtroom.umap exists in Content/Maps
- Open Level node is connected
- Delay completes before Open Level

**Fix:**
- Try Open Level (by Object Reference) instead
- Check Output Log for load errors
- Verify level is in project settings

---

### Issue: Mouse cursor doesn't appear

**Check:**
- Set Input Mode UI Only is called
- Set Show Mouse Cursor is TRUE
- Get Player Controller returns valid controller
- BP_CourtroomManager is in level

**Fix:**
- Add Print String to verify BeginPlay fires
- Try adding small delay before input mode change
- Check player controller is valid

---

### Issue: Widget doesn't spawn

**Check:**
- BP_CourtroomManager placed in level
- Paperwork Widget Class is set in Details panel
- Widget class exists and compiles
- Is Valid check passes

**Fix:**
- Check Output Log for errors
- Verify widget class reference
- Test with different widget (WBP_MainMenu)
- Add Print String debugging

---

## SUCCESS CRITERIA

**Minimum Viable Arrest System:**
- [ ] Police collision triggers event
- [ ] Arrest message appears on screen
- [ ] Message displays for 2 seconds
- [ ] Level transitions to Courtroom
- [ ] Player spawns in courtroom
- [ ] Mouse cursor is visible
- [ ] Input mode is UI Only
- [ ] Widget spawn system works (even if empty widget)

**If all checked:** ✅ SUCCESS! Core system functional!

---

## TIME BREAKDOWN

- Step 1 (Arrest Widget): 5 minutes
- Step 2 (Collision Event): 15 minutes
- Step 3 (Courtroom Manager): 20 minutes
- Step 4 (Place in Level): 5 minutes
- Step 5 (Testing): 5 minutes

**Total: 50 minutes** (5 minute buffer included)

---

## FINAL NOTES

This gets the core arrest system working. The paperwork form is separate and can be built incrementally. The most important integration points are:

1. **Collision → Message → Level Transition** (Step 2)
2. **Courtroom → UI Spawn** (Step 3-4)

Once these work, everything else is polish and content creation.

Good luck! 🚔📋

---

**Files Referenced:**
- `implement_arrest_system.py` - Full automated script
- `PAPERWORK_FORM_BLUEPRINT_LOGIC.txt` - Complete form specs
- `USER_TEST_STEPS.md` - 10-step testing guide
- `COMPREHENSIVE_TEST_PLAN.md` - Full test scenarios

**Quick Help:**
- Output Log: Window → Developer Tools → Output Log
- Blueprint Compiler: Green checkmark = success, yellow/red = errors
- Asset verification: Content Browser search
