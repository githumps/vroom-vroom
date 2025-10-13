# VROOM VROOM - QUICK START GUIDE

**Goal: Get from ZERO to PLAYABLE in minimum time**

---

## STEP 1: OPEN THE PROJECT (5 minutes)

1. Double-click `VroomVroom.uproject`
2. If prompted "Missing Modules", click **"Yes"** to rebuild
3. Wait for compilation (5-10 minutes first time)
4. Unreal Engine 5.6.1 opens

**Checkpoint:** Unreal Editor is open, no error messages

---

## STEP 2: CREATE CORE BLUEPRINTS (15 minutes)

### A. Create Game Mode Blueprint
1. Content Browser → Navigate to `Content/Blueprints/Core/`
2. Right-click → **Blueprint Class**
3. Search for: `VroomVroomGameMode`
4. Name it: `BP_VroomGameMode`
5. **Don't open it yet**, just create it

### B. Create Character Blueprint
1. Same folder (`Core/`)
2. Right-click → **Blueprint Class**
3. Search for: `VroomVroomCharacter`
4. Name it: `BP_VroomCharacter`

### C. Create Player Controller Blueprint
1. Same folder
2. Right-click → **Blueprint Class**
3. Search for: `VroomVroomPlayerController`
4. Name it: `BP_VroomPlayerController`

**Checkpoint:** You have 3 blueprints in `Content/Blueprints/Core/`

---

## STEP 3: CREATE VEHICLE BLUEPRINTS (20 minutes)

### A. Create Base Vehicle
1. Navigate to `Content/Blueprints/Vehicles/`
2. Right-click → **Blueprint Class**
3. Search for: `VehicleBase`
4. Name it: `BP_VehicleBase`
5. **Open it** (double-click)

**INSIDE BP_VehicleBase:**

6. **Add Components:**
   - Click **"Add Component"** → Static Mesh
   - In Details panel: Static Mesh → Select `/Engine/BasicShapes/Cube`
   - Transform → Scale: X=4.0, Y=2.0, Z=1.0
   - Material: Any color (M_Basic_Floor works)

7. **Add Spring Arm:**
   - Add Component → Spring Arm
   - Details → Target Arm Length: 600
   - Location: Z=200

8. **Add Camera:**
   - Add Component → Camera (attach to Spring Arm)

9. **Collision Setup:**
   - Select Static Mesh (root)
   - Details → Collision Presets: **"PhysicsActor"** (or Vehicle if available)
   - Enable **"Simulate Physics"**

10. **Compile and Save**

### B. Create Police Vehicle
1. Back in Content Browser → `Vehicles/` folder
2. Right-click → **Blueprint Class**
3. Search for: `PoliceVehicle`
4. Name it: `BP_PoliceVehicle`
5. **Open it**

**INSIDE BP_PoliceVehicle:**

6. Add Static Mesh (same as above but use blue material)
7. Add Point Light:
   - Add Component → Point Light
   - Location: Z=100
   - Light Color: Red or Blue
   - Intensity: 5000

8. **Compile and Save**

### C. Create Vehicle Spawner
1. `Vehicles/` folder
2. Right-click → **Blueprint Class**
3. Search for: `VehicleSpawner`
4. Name it: `BP_VehicleSpawner`
5. **Open it**

**INSIDE BP_VehicleSpawner:**

6. Click **"Class Defaults"** (top toolbar)
7. In Details panel:
   - **Vehicle Class To Spawn**: Select `BP_PoliceVehicle`
   - **Initial Police Vehicles**: 25
   - **Max Police Vehicles**: 50
   - **Spawn Radius**: 10000.0

8. **Compile and Save**

**Checkpoint:** You have 3 vehicle blueprints

---

## STEP 4: CREATE THE MAP (20 minutes)

### A. Create Open World Map
1. File → **New Level** → **Open World**
2. File → **Save Current Level As...**
3. Save to: `Content/Maps/`
4. Name: `OpenWorld`

### B. Add Player Start
1. In **Place Actors** panel (left side), search: "Player Start"
2. Drag into the level
3. Move it above the ground (Z = 200)

### C. Add Vehicle Spawner
1. Content Browser → `Blueprints/Vehicles/BP_VehicleSpawner`
2. Drag into the level (near Player Start)

### D. Set Game Mode
1. Window → **World Settings**
2. **Game Mode Override**: Select `BP_VroomGameMode`

### E. Quick Test
1. Click **Play** (Alt+P)
2. You should spawn in the world
3. Press **Esc** to stop

**Checkpoint:** You can play in the level (even if you can't drive yet)

---

## STEP 5: ADD XBOX CONTROLLER INPUT (15 minutes)

### A. Configure Input Mappings
1. Edit → **Project Settings**
2. Left sidebar → **Input**
3. Scroll to **Axis Mappings**

**Add these if they don't exist:**

4. Click **+ Axis Mapping**:
   - Name: `MoveForward`
   - Add two bindings:
     - Key: **W**, Scale: **1.0**
     - Key: **S**, Scale: **-1.0**
     - Key: **Gamepad Left Thumbstick Up/Down**, Scale: **1.0**

5. Click **+ Axis Mapping**:
   - Name: `MoveRight`
   - Bindings:
     - Key: **A**, Scale: **-1.0**
     - Key: **D**, Scale: **1.0**
     - Key: **Gamepad Left Thumbstick Right/Left**, Scale: **1.0**

6. Click **+ Axis Mapping**:
   - Name: `Brake`
   - Bindings:
     - Key: **SpaceBar**, Scale: **1.0**
     - Key: **Gamepad Right Trigger**, Scale: **1.0**

7. **Close Project Settings**

### B. Add Input Handling to BP_VehicleBase

1. Open `BP_VehicleBase`
2. Go to **Event Graph**
3. Right-click → Add Event → **Event Tick**

**Create this logic (simplified for quick start):**

4. From **Event Tick**, drag out and add:
   - **Get Input Axis Value** → Axis Name: `MoveForward`
   - Connect to **Add Force** node
   - Direction: **Get Actor Forward Vector** (multiply by 1500)

5. From **Event Tick**, drag out and add:
   - **Get Input Axis Value** → Axis Name: `MoveRight`
   - Connect to **Add Torque** node
   - Direction: **Get Actor Up Vector** (multiply by 100)

*(This is a simplified physics-based driving system)*

6. **Compile and Save**

**Checkpoint:** Vehicle should respond to WASD and Xbox controller

---

## STEP 6: CREATE MAIN MENU (20 minutes)

### A. Create Main Menu Widget
1. Navigate to `Content/Blueprints/UI/`
2. Right-click → **User Interface** → **Widget Blueprint**
3. Search parent class: `VroomMainMenuWidget`
4. Name: `WBP_MainMenu`
5. **Open it**

**INSIDE WBP_MainMenu Designer:**

6. Drag **Canvas Panel** to viewport (should be default)
7. Drag **Vertical Box** into canvas, center it
8. Drag **Text Block** into Vertical Box:
   - Text: "VROOM VROOM"
   - Font Size: 72
9. Drag **Button** into Vertical Box:
   - Name: "NewGameButton"
   - Text: "NEW GAME"
10. Drag **Button** into Vertical Box:
    - Name: "QuitButton"
    - Text: "QUIT"

**INSIDE WBP_MainMenu Graph:**

11. Select "NewGameButton" in hierarchy
12. Details → **On Clicked** → Click the **+** button
13. In the Graph:
    - From the **On Clicked** event:
    - Add **Open Level** node
    - Level Name: `OpenWorld`

14. Select "QuitButton"
15. Details → **On Clicked** → Click **+**
16. In the Graph:
    - Add **Quit Game** node

17. **Compile and Save**

### B. Create Main Menu Level
1. File → **New Level** → **Empty Level**
2. Save as: `Content/Maps/MainMenu`
3. Add **Player Start**
4. Add **Directional Light**

### C. Create Menu Manager
1. In level viewport, click **+ Create** (Blueprint)
2. Name: `BP_MainMenuManager`
3. Open it

**INSIDE BP_MainMenuManager:**

4. Event Graph → **Event Begin Play**:
   - Add **Create Widget** node
   - Class: `WBP_MainMenu`
   - Connect to **Add to Viewport** node
   - Add **Set Input Mode UI Only** node
   - Add **Set Show Mouse Cursor** node (True)

5. Place `BP_MainMenuManager` in the MainMenu level

6. **Compile and Save**

### D. Set Default Maps
1. Edit → **Project Settings**
2. **Maps & Modes**
3. **Game Default Map**: Select `MainMenu`
4. **Editor Startup Map**: Select `OpenWorld` (for testing)

**Checkpoint:** Game starts at main menu, can click "NEW GAME" to load world

---

## STEP 7: ADD POLICE CHASE (15 minutes)

### A. Police Detection Logic

1. Open `BP_PoliceVehicle`
2. Event Graph → **Event Tick**:

**Simple chase logic:**

3. Add **Get Player Character** node
4. Add **AI Move To** node
   - Target: Player Character
   - Acceptance Radius: 200

*(This makes ALL police chase the player constantly)*

5. **Compile and Save**

### B. Spawn More Police

1. Open your `OpenWorld` map
2. Duplicate `BP_VehicleSpawner` (copy-paste) 5 times
3. Spread them around the map

**Checkpoint:** 25+ police vehicles spawn and chase player

---

## STEP 8: ADD ARREST MECHANIC (15 minutes)

### A. Arrest Trigger

1. Open `BP_PoliceVehicle`
2. Event Graph
3. Add **Event Actor Begin Overlap**

**Arrest logic:**

4. From overlap event:
   - **Cast To VroomVroomCharacter**
   - If success:
     - **Print String**: "YOU'RE UNDER ARREST FOR EXISTING!"
     - **Delay**: 2 seconds
     - **Open Level**: `Courtroom` (we'll create this next)

5. **Compile and Save**

### B. Create Courtroom

1. File → **New Level** → **Empty Level**
2. Save as: `Content/Maps/Courtroom`
3. Add **Player Start**
4. Add **Directional Light**
5. Add some cubes for walls/floor (make it look like a room)

**Checkpoint:** Getting caught by police shows message and loads courtroom

---

## STEP 9: CREATE PAPERWORK FORM (30 minutes)

### A. Create Form Widget

1. `Content/Blueprints/UI/`
2. Right-click → Widget Blueprint
3. Name: `WBP_PaperworkForm`
4. **Open it**

**Designer:**

5. Canvas Panel (root)
6. **Scroll Box** (fill screen)
7. Inside Scroll Box, add **Vertical Box**
8. Inside Vertical Box, add:
   - **Text Block**: "FORM 47-B: TRAFFIC VIOLATION ACKNOWLEDGMENT"
   - **Text Block**: "Full Legal Name:"
   - **Editable Text Box** (name: NameField)
   - **Text Block**: "Did you know you were existing? (Y/N)"
   - **Editable Text Box** (name: ExistingField)
   - **Text Block**: "Explain in 500 words why you thought driving was a good idea:"
   - **Editable Text Box Multiline** (name: EssayField)
   - **Check Box**: "I acknowledge I am guilty regardless of circumstances"
   - **Check Box**: "Check box 47B subsection 12 paragraph 7 line 4"
   - **Button**: "SUBMIT FORM" (name: SubmitButton)

**Graph:**

9. **SubmitButton → On Clicked**:
   - **Get Text** from all editable fields
   - **Branch**: If any text is empty:
     - **Print String**: "INCOMPLETE FORM! START OVER!"
     - **Clear** all text fields
   - Else:
     - **Print String**: "You are sentenced to 5 years in prison. For existing."
     - **Delay**: 3 seconds
     - **Open Level**: `OpenWorld` (back to driving)

10. **Compile and Save**

### B. Show Form in Courtroom

1. Create Blueprint Actor in Courtroom: `BP_CourtroomManager`
2. Event Graph → **Event Begin Play**:
   - **Create Widget**: `WBP_PaperworkForm`
   - **Add to Viewport**
   - **Set Input Mode UI Only**
   - **Show Mouse Cursor**: True

3. Place in Courtroom level

**Checkpoint:** In courtroom, form appears. Must fill all fields to submit.

---

## STEP 10: TEST THE COMPLETE LOOP (10 minutes)

### Final Test Sequence:

1. **Play in Editor** (or package and run)
2. Main menu appears → Click **"NEW GAME"**
3. Spawns in open world → 25+ police visible
4. Press **F** to enter nearest vehicle (if implemented) OR place player in vehicle at start
5. Drive with **Xbox controller** (left stick to move, right trigger to brake)
6. Police chase you IMMEDIATELY
7. Let police catch you → **"YOU'RE UNDER ARREST"** message
8. Courtroom loads
9. Fill out the absurd form
10. Submit → Back to driving

**SUCCESS CRITERIA:**
- ✅ Game launches
- ✅ Main menu works
- ✅ Can drive with Xbox controller
- ✅ Police chase player
- ✅ Arrest triggers
- ✅ Paperwork form is annoying and funny
- ✅ Game loop completes

---

## TROUBLESHOOTING QUICK FIXES

### "Can't find C++ classes in Blueprint"
→ Right-click `.uproject` → Generate VS project files → Rebuild in UE5

### "Xbox controller doesn't work"
→ Check Input Mappings have "Gamepad" bindings

### "Police don't spawn"
→ Check BP_VehicleSpawner is in the level and has BP_PoliceVehicle assigned

### "Can't enter vehicle"
→ For MVP, skip vehicle entry - just start player INSIDE a vehicle

### "Form validation doesn't work"
→ Add Print String nodes to debug which fields are empty

---

## PACKAGING THE GAME (15 minutes)

1. File → **Package Project** → **Windows** → **Windows (64-bit)**
2. Choose output folder: `Builds/Windows/`
3. Wait 10-30 minutes
4. Run `VroomVroom.exe` in the output folder
5. **TEST WITH XBOX CONTROLLER!**

---

## TOTAL TIME: ~3-4 HOURS

If you follow this guide step-by-step, you'll have a PLAYABLE, FUNNY game in under 4 hours.

**NOW GO BUILD VROOM VROOM!**
