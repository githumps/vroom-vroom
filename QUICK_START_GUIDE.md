# POLICE AI SYSTEM - QUICK START GUIDE
## Get Up and Running in Under 2 Hours

---

## MISSION BRIEF

Create an absurdly aggressive police AI that chases and arrests players for existing, then forces them to attend court for ridiculous charges.

**Time Estimate:** 90-120 minutes total

---

## PREREQUISITES

- Unreal Engine 5.6.1 project open: `C:\Users\evan\Documents\GitHub\vroom-vroom`
- Basic vehicle gameplay working (player can drive)
- Content folders: Blueprints/Vehicles, Blueprints/UI, Blueprints/Core, Maps

---

## IMPLEMENTATION ORDER

### Step 1: Create Widgets (20 minutes)

**1.1 - WBP_ArrestMessage (10 min)**

Location: `Content/Blueprints/UI/WBP_ArrestMessage`

Quick Setup:
1. New Widget Blueprint
2. Add Canvas Panel (root)
3. Add Overlay (fill screen)
4. Add Border (black, 80% opacity)
5. Add Vertical Box
6. Add 3 Text Blocks:
   - "YOU'RE UNDER ARREST!" (Red, size 72)
   - "CRIME: EXISTING" (White, size 48)
   - "REPORT TO COURT IMMEDIATELY" (Yellow, size 32)
7. Compile

**1.2 - WBP_PaperworkUI (10 min)**

Location: `Content/Blueprints/UI/WBP_PaperworkUI`

Quick Setup:
1. New Widget Blueprint
2. Add Canvas Panel → Vertical Box (centered)
3. Add text: "OFFICIAL COURT DOCUMENTS" (size 48)
4. Add Border (white background)
5. Add charges (6 text blocks):
   - "- Existing without permit"
   - "- Operating a vehicle while alive"
   - "- Suspicious behavior (moving)"
   - "- Resisting future arrest"
   - "- General vibe violations"
   - "- Failure to not be noticed"
6. Add text: "VERDICT: EXTREMELY GUILTY" (Red, size 36)
7. Add Button: "SIGN HERE (You Have No Choice)"
8. In Graph: Button OnClicked → Remove from Parent → Open Level ("MainMenu")
9. Compile

---

### Step 2: Create BP_PoliceVehicle (40 minutes)

**2.1 - Blueprint Setup (5 min)**

Location: `Content/Blueprints/Vehicles/BP_PoliceVehicle`

1. New Blueprint Class
2. Parent: WheeledVehiclePawn (or your vehicle base class)
3. Add Static Mesh component (vehicle mesh)

**2.2 - Add Components (5 min)**

1. Add Sphere Collision: "DetectionSphere"
   - Radius: 3000
   - Collision: OverlapAllDynamic
   - Generate Overlap Events: TRUE

2. Add Box Collision: "ArrestTrigger"
   - Extent: X=250, Y=200, Z=150
   - Position: Front of vehicle
   - Collision: OverlapAllDynamic
   - Generate Overlap Events: TRUE

**2.3 - Create Variables (5 min)**

1. PlayerReference (Actor Reference)
2. bIsChasing (Boolean) - Default: false
3. DetectionRange (Float) - Default: 3000.0
4. AggressionChance (Float) - Default: 0.95
5. CurrentState (Create Enum: Patrol, Chase, Arrest)

**2.4 - Event BeginPlay (5 min)**

Nodes:
1. Event BeginPlay
2. Set Timer by Function Name
   - Function Name: "DetectPlayer"
   - Time: 0.5
   - Looping: TRUE
3. Random Float (0-1) < 0.95 → Branch → Set State to Chase

**2.5 - DetectPlayer Function (10 min)**

Create New Function: DetectPlayer

Nodes:
1. Get All Actors of Class (BP_PlayerVehicle)
2. ForEach Loop
3. Get Distance Between (Self to Player)
4. Distance < 3000 → Branch
5. TRUE: Set Player Reference → Set State Chase → Call StartChase

**2.6 - StartChase Function (5 min)**

Create New Function: StartChase

Nodes:
1. Is Valid (Player Reference) → Branch
2. TRUE: AI Move To Actor (Player Reference, Acceptance Radius: 200)

**2.7 - Event Tick - Chase Logic (10 min)**

Nodes:
1. Event Tick
2. Current State == Chase AND Player Valid → Branch
3. TRUE:
   - Find Look at Rotation (Self to Player)
   - Get Actor Rotation → RInterp To (Target: Look at Rotation, Speed: 2.0)
   - Set Actor Rotation
   - Get Forward Vector → Add Movement Input (Scale: 1.0)

**2.8 - Arrest Trigger Event (5 min)**

1. ArrestTrigger → OnComponentBeginOverlap
2. Cast to BP_PlayerVehicle → SUCCESS:
3. Set State: Arrest
4. Create Widget (WBP_ArrestMessage) → Add to Viewport
5. Set Timer by Event (2.0 seconds) → TransitionToCourtroom
6. TransitionToCourtroom Event: Open Level ("Courtroom")

Compile!

---

### Step 3: Create Courtroom Level (30 minutes)

**3.1 - Create Level (5 min)**

1. File → New Level → Empty Level
2. Save as: `Content/Maps/Courtroom.umap`

**3.2 - Add Geometry (15 min)**

Quick geometry using cubes:

1. **Floor:** Cube, Scale (20, 20, 0.2), Position (0, 0, 0)
2. **Front Wall:** Cube, Scale (20, 0.4, 5), Position (0, 1000, 250)
3. **Back Wall:** Cube, Scale (20, 0.4, 5), Position (0, -1000, 250)
4. **Left Wall:** Cube, Scale (0.4, 20, 5), Position (-1000, 0, 250)
5. **Right Wall:** Cube, Scale (0.4, 20, 5), Position (1000, 0, 250)
6. **Judge's Desk:** Cube, Scale (4, 1.5, 1.5), Position (0, -600, 75)

Apply materials (M_Wood or M_Basic)

**3.3 - Add Lighting (10 min)**

1. **Directional Light:**
   - Rotation: Pitch -45
   - Intensity: 3.0

2. **Sky Light:**
   - Intensity: 1.0

3. **2x Spot Lights (above judge):**
   - Position: (-200, -600, 400) and (200, -600, 400)
   - Point at judge desk
   - Intensity: 5000

4. Build Lighting (Build → Build Lighting Only → Preview)

**3.4 - Add Player Start**

1. Add Player Start actor
2. Position: (0, 400, 100)
3. Rotation: Yaw 0 (facing judge)

---

### Step 4: Create BP_CourtroomManager (15 minutes)

**4.1 - Blueprint Setup (5 min)**

Location: `Content/Blueprints/Core/BP_CourtroomManager`

1. New Blueprint Class
2. Parent: Actor
3. No components needed

**4.2 - Create Variables (3 min)**

1. PaperworkWidgetClass (Widget Class Reference)
2. PaperworkWidgetInstance (User Widget Reference)
3. IntroDelay (Float) - Default: 0.5

**4.3 - Event BeginPlay (7 min)**

Nodes:
1. Event BeginPlay
2. Set Input Mode UI Only (Get Player Controller)
3. Set Show Mouse Cursor (TRUE)
4. Delay (0.5 seconds)
5. Create Widget (PaperworkWidgetClass)
6. Set PaperworkWidgetInstance variable
7. Add to Viewport (Z-Order: 10)

Compile!

**4.4 - Place in Level**

1. Open Courtroom.umap
2. Drag BP_CourtroomManager into level
3. Select manager in level
4. Details Panel: Set PaperworkWidgetClass = WBP_PaperworkUI

---

### Step 5: Test Everything (20 minutes)

**5.1 - Test Courtroom Directly (5 min)**

1. Open Courtroom.umap
2. PIE
3. Verify:
   - Level loads
   - Mouse cursor appears
   - Paperwork UI spawns
   - Button is clickable

**5.2 - Test Police Detection (5 min)**

1. Open main game level
2. Place BP_PoliceVehicle
3. Place player vehicle 2000 units away
4. PIE
5. Verify police chases player

**5.3 - Test Arrest (5 min)**

1. Let police catch player
2. Verify:
   - Arrest message appears
   - 2-second delay
   - Transitions to Courtroom

**5.4 - Full Cycle Test (5 min)**

1. Start in main level
2. Get chased → Get arrested → View paperwork → Exit
3. Verify entire flow works

---

## MINIMAL VIABLE PRODUCT (MVP)

If short on time, implement ONLY these:

**Must Have (60 minutes):**
1. WBP_ArrestMessage widget (basic version)
2. BP_PoliceVehicle (detection + chase only)
3. Arrest trigger → Open Level
4. Courtroom level (floor + walls + player start)
5. Manual restart (no paperwork UI)

**Can Add Later:**
- WBP_PaperworkUI (10 min)
- BP_CourtroomManager (15 min)
- Better lighting (10 min)
- Polish and humor (ongoing)

---

## TROUBLESHOOTING QUICK FIXES

**Police not chasing:**
- Check DetectionSphere radius = 3000
- Verify Set Timer in BeginPlay

**Arrest not working:**
- Check ArrestTrigger has "Generate Overlap Events" TRUE
- Verify Cast to Player Vehicle class name is correct

**Courtroom not loading:**
- Verify level name exactly: "Courtroom"
- Check level exists: Content/Maps/Courtroom.umap

**UI not appearing:**
- Check PaperworkWidgetClass assigned in Details
- Verify widget compiles without errors

---

## SUCCESS CRITERIA

System is complete when:

1. [ ] Police detects player within 3000 units
2. [ ] Police chases player continuously
3. [ ] Police arrests player on contact
4. [ ] "YOU'RE UNDER ARREST FOR: EXISTING" appears
5. [ ] Transitions to Courtroom after 2 seconds
6. [ ] Paperwork UI spawns with absurd charges
7. [ ] Button works and exits Courtroom
8. [ ] No crashes or errors
9. [ ] Frame rate above 60 FPS
10. [ ] It's funny

---

## IMPLEMENTATION CHECKLIST

**Phase 1: Widgets**
- [ ] WBP_ArrestMessage created and styled
- [ ] WBP_PaperworkUI created with all charges
- [ ] Button functionality working
- [ ] Both widgets compile successfully

**Phase 2: Police AI**
- [ ] BP_PoliceVehicle created
- [ ] DetectionSphere and ArrestTrigger added
- [ ] Variables created
- [ ] Event BeginPlay configured
- [ ] DetectPlayer function working
- [ ] StartChase function working
- [ ] Event Tick chase logic working
- [ ] Arrest trigger event working
- [ ] Blueprint compiles successfully

**Phase 3: Courtroom**
- [ ] Courtroom.umap created
- [ ] Floor, walls, furniture added
- [ ] Lighting added and built
- [ ] PlayerStart placed correctly
- [ ] Level saves without errors

**Phase 4: Courtroom Manager**
- [ ] BP_CourtroomManager created
- [ ] Variables created
- [ ] Event BeginPlay configured
- [ ] Placed in Courtroom level
- [ ] PaperworkWidgetClass assigned
- [ ] Blueprint compiles successfully

**Phase 5: Testing**
- [ ] Courtroom loads directly (PIE)
- [ ] Police detects and chases
- [ ] Arrest triggers correctly
- [ ] Level transition works
- [ ] Paperwork UI spawns
- [ ] Button exits courtroom
- [ ] Full cycle test passes
- [ ] No errors in output log

---

## TIME BREAKDOWN

**Optimistic (experienced):** 90 minutes
- Widgets: 20 min
- Police AI: 35 min
- Courtroom: 25 min
- Manager: 10 min
- Testing: 15 min

**Realistic (first time):** 120 minutes
- Widgets: 25 min
- Police AI: 45 min
- Courtroom: 35 min
- Manager: 15 min
- Testing: 20 min

**With Issues:** 180 minutes
- Add 60 minutes for troubleshooting and fixes

---

## NEXT STEPS AFTER BASIC IMPLEMENTATION

**Phase 6: Polish (Optional)**
- Add siren lights and sounds
- Add more aggressive messages
- Improve courtroom visuals
- Add animations to widgets
- Add camera shake on arrest
- Add multiple police vehicles
- Add escape mechanics (or not - no escape is funnier)

**Phase 7: Humor Enhancement**
- More absurd charges
- Random charge generation
- Judge voice lines
- Sarcastic paperwork notes
- "Plea bargain" button that does nothing

---

## QUICK REFERENCE - FILE LOCATIONS

**Blueprints:**
- `Content/Blueprints/Vehicles/BP_PoliceVehicle`
- `Content/Blueprints/Core/BP_CourtroomManager`
- `Content/Blueprints/UI/WBP_ArrestMessage`
- `Content/Blueprints/UI/WBP_PaperworkUI`

**Levels:**
- `Content/Maps/Courtroom.umap`

**Documentation:**
- `POLICE_AI_IMPLEMENTATION.md` - Full overview
- `POLICE_AI_BLUEPRINT_NODES.md` - Detailed node specs
- `WIDGET_SPECIFICATIONS.md` - Complete widget setup
- `COURTROOM_LEVEL_SETUP.md` - Level construction guide
- `BP_COURTROOMMANAGER_SPEC.md` - Manager blueprint details
- `TESTING_AND_TROUBLESHOOTING.md` - Testing procedures
- `QUICK_START_GUIDE.md` - This file

---

## SUPPORT DOCUMENTATION

Stuck? Check these files:

**For Police AI Issues:**
- Read: `POLICE_AI_BLUEPRINT_NODES.md`
- Section: Detailed node-by-node setup

**For Widget Issues:**
- Read: `WIDGET_SPECIFICATIONS.md`
- Section: Component details and styling

**For Courtroom Issues:**
- Read: `COURTROOM_LEVEL_SETUP.md`
- Section: Geometry and lighting setup

**For Testing:**
- Read: `TESTING_AND_TROUBLESHOOTING.md`
- Section: Common issues and solutions

---

## YOU'RE READY

All documentation is complete. All specifications are provided. Follow this guide and you'll have an EXCESSIVELY aggressive police system in under 2 hours.

THE LAW IS WAITING.
JUSTICE WILL NOT BE DELAYED.
BEGIN IMPLEMENTATION NOW.

**Good luck, and remember: You are guilty of existing.**
