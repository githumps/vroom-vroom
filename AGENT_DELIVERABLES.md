# VROOM VROOM - Agent Deliverables and Setup Instructions

**PROJECT GOAL**: Create a PLAYABLE, FUNNY, LAUNCHABLE game in Unreal Engine 5.6 with Xbox controller support.

**DEADLINE**: ASAP - NO EXCUSES

---

## AGENT 1: LEVEL CREATION + LIGHTING + WORLD SETUP

### Objective
Create an open world driving map with proper lighting and police spawn zones.

### Deliverables

#### 1. Create OpenWorld.umap
**Steps in Unreal Editor:**
1. Open Unreal Editor → File → New Level → Open World
2. Save as `Content/Maps/OpenWorld`

#### 2. Add Terrain
1. Landscape Mode (Shift+2)
2. Create New Landscape:
   - Section Size: 63x63
   - Sections Per Component: 1x1
   - Number of Components: 8x8
   - Overall Resolution: 505x505
3. Material: Use default landscape material (we'll add roads later)
4. Click "Create"

#### 3. Add Basic Roads
1. Use Landscape Spline Tool
2. Create main roads in cross pattern (minimum 4 roads, each 1000 units long)
3. Make roads WIDE (at least 1000 units) - we need space for EXCESSIVE police
4. Optional: Add Landscape Spline Meshes for road surface

#### 4. Lighting Setup
1. Keep the default Directional Light (sun)
2. Set intensity to 3.0 for visibility
3. Add Sky Atmosphere (for sky)
4. Add Volumetric Cloud component
5. Add Post Process Volume:
   - Set to "Infinite Extent (Unbound)"
   - Enable Auto Exposure
   - Set Exposure Compensation to 1.0

#### 5. Police Spawn Zones
1. Place 20+ empty Actors around the map
2. Name them "PoliceSpawnPoint_01" through "PoliceSpawnPoint_20"
3. Distribute them across the entire map
4. Tag each with "PoliceSpawn" (in Actor settings → Tags)

#### 6. Player Start
1. Add Player Start actor at center of map
2. Set location Z to 200 (above terrain)

#### 7. VehicleSpawner Setup
1. Place BP_VehicleSpawner actor in level (once created by Agent 2)
2. Position at center of map
3. In Details panel:
   - Set Initial Police Vehicles = 25 (EXCESSIVE!)
   - Set Max Police Vehicles = 50 (MORE EXCESSIVE!)
   - Set Spawn Radius = 10000

#### 8. World Settings
1. Open World Settings (Window → World Settings)
2. Set Game Mode Override to BP_VroomGameMode (once created)
3. Save and test

### ACCEPTANCE CRITERIA:
- [ ] Map loads without errors
- [ ] Terrain is drivable (flat enough for vehicles)
- [ ] At least 20 police spawn points exist
- [ ] Lighting is visible (not too dark)
- [ ] Player spawns above ground

---

## AGENT 2: VEHICLE BLUEPRINTS + XBOX CONTROLLER + PHYSICS

### Objective
Create fully functional vehicle blueprints with Xbox controller support and good driving feel.

### Deliverables

#### 1. Create BP_VehicleBase
**Steps in Unreal Editor:**

1. **Create Blueprint:**
   - Content Browser → Blueprints/Vehicles
   - Right-click → Blueprint Class
   - Search for "VehicleBase" (C++ parent class)
   - Name it "BP_VehicleBase"

2. **Visual Components (Placeholder):**
   - Open BP_VehicleBase
   - Add Static Mesh Component (body):
     - Use Engine Content → Shapes → Cube
     - Scale: X=4.0, Y=2.0, Z=1.0 (car-sized)
     - Material: M_Basic_Floor or any color
   - Add 4 Sphere components (wheels):
     - Name: WheelFrontLeft, WheelFrontRight, WheelBackLeft, WheelBackRight
     - Radius: 50
     - Positions: Front(200,-100,-50), Front(200,100,-50), Back(-200,-100,-50), Back(-200,100,-50)

3. **Collision Setup:**
   - Select root Static Mesh
   - Details → Collision → Collision Presets: "Vehicle"
   - Simulation Generates Hit Events: Checked

4. **Physics Setup:**
   - Enable "Simulate Physics" on root
   - Mass: 1500 kg
   - Linear Damping: 0.1
   - Angular Damping: 0.5

5. **Variables to Expose (Blueprint variables):**
   - MaxSpeed (Float): 2000.0
   - Acceleration (Float): 1500.0
   - TurnSpeed (Float): 100.0
   - BrakeForce (Float): 2000.0

6. **Xbox Controller Input (Event Graph):**

   **Add Input Action Mappings in Project Settings FIRST:**
   - Edit → Project Settings → Input
   - Action Mappings:
     - "EnterVehicle": F key, Gamepad Face Button Bottom (A)
   - Axis Mappings:
     - "MoveForward": W(1.0), S(-1.0), Gamepad Left Thumbstick Up/Down
     - "MoveRight": D(1.0), A(-1.0), Gamepad Left Thumbstick Right/Left
     - "Brake": Space(1.0), Gamepad Right Trigger

   **In BP_VehicleBase Event Graph:**

   ```
   Event Tick:
   ├─> Get Input Axis Value "MoveForward" → ForwardInput
   ├─> Get Input Axis Value "MoveRight" → RightInput
   ├─> Get Input Axis Value "Brake" → BrakeInput
   │
   ├─> ForwardInput > 0.01?
   │   ├─> YES: Add Force (Forward Vector * Acceleration * ForwardInput * DeltaTime)
   │   └─> NO: Check if ForwardInput < -0.01 (reverse)
   │
   ├─> RightInput != 0?
   │   └─> Add Torque (Up Vector * TurnSpeed * RightInput * DeltaTime)
   │
   └─> BrakeInput > 0.01?
       └─> Get Velocity → Multiply by -1 → Multiply by BrakeForce → Add Force
   ```

7. **Camera Setup:**
   - Add Spring Arm Component
     - Target Arm Length: 600
     - Location: (0, 0, 200)
     - Enable Camera Lag
   - Add Camera Component (child of Spring Arm)
     - Leave at origin of Spring Arm

8. **Compile and Save**

#### 2. Create BP_PoliceVehicle
**Steps:**

1. **Create Blueprint:**
   - Right-click → Blueprint Class
   - Search "PoliceVehicle" (C++ parent)
   - Name: BP_PoliceVehicle

2. **Visual Differences:**
   - Same setup as BP_VehicleBase but:
   - Body color: Blue/White material
   - Add Point Light component (red/blue siren)
     - Intensity: 5000
     - Attenuation Radius: 2000
   - Add Spotlight component (headlights)

3. **AI Behavior (inherited from C++):**
   - No additional blueprint work needed
   - C++ handles chase logic
   - Just ensure collision is set correctly

4. **Compile and Save**

#### 3. Create BP_VehicleSpawner
**Steps:**

1. **Create Blueprint:**
   - Blueprint Class → Search "VehicleSpawner"
   - Name: BP_VehicleSpawner

2. **Configure Variables:**
   - In Details panel (Class Defaults):
     - Vehicle Class To Spawn: Select BP_PoliceVehicle
     - Initial Police Vehicles: 25
     - Max Police Vehicles: 50
     - Spawn Radius: 10000.0

3. **Place in Level** (see Agent 1 instructions)

4. **Compile and Save**

### ACCEPTANCE CRITERIA:
- [ ] BP_VehicleBase drives with WASD or Xbox controller
- [ ] Xbox left stick controls steering and acceleration
- [ ] Xbox right trigger brakes
- [ ] Vehicle has physics and collides properly
- [ ] BP_PoliceVehicle is distinct (different color/lights)
- [ ] BP_VehicleSpawner spawns 25+ police at game start

---

## AGENT 3: POLICE AI + CHASE LOGIC + ARREST SYSTEM

### Objective
Make police EXCESSIVELY aggressive, implement chase mechanics, and create arrest→courtroom flow.

### Deliverables

#### 1. Police AI Configuration (in BP_PoliceVehicle)

**Event Graph additions:**

1. **Detection System:**
   ```
   Event Tick:
   ├─> Get Player Character
   ├─> Get Distance To Player
   ├─> Distance < 3000? (detection range)
   │   ├─> YES: Set "IsChasing" = True
   │   └─> Cast to VroomVroomCharacter → Get Velocity → Length > 100?
   │       └─> YES: Player is moving! Set "IsChasing" = True
   └─> IsChasing = True?
       └─> Move Toward Player (use AI Move To)
   ```

2. **Arrest Trigger:**
   ```
   On Component Begin Overlap:
   ├─> Other Actor = Player Character?
   │   ├─> Get Player Velocity → Length < 50? (player nearly stopped)
   │   └─> YES: Call "ArrestPlayer" function
   │       ├─> Play Siren Sound
   │       ├─> Spawn Arrest Text ("YOU'RE UNDER ARREST FOR: EXISTING")
   │       ├─> Wait 2 seconds
   │       └─> Call GameMode → TransitionToCourtroom()
   ```

3. **Aggressive Behavior Tweaks:**
   - Detection Distance: 3000 (very far!)
   - Chase Speed Multiplier: 1.5x player speed
   - Add random chance to detect even when player is stationary:
     ```
     Random Float in Range (0, 1) < 0.01 per second?
     └─> YES: Start chasing (they spotted you for no reason!)
     ```

#### 2. Create Courtroom Scene

**New Map: Courtroom.umap**

1. **Create Level:**
   - File → New Level → Empty Level
   - Save as Content/Maps/Courtroom

2. **Basic Courtroom Setup:**
   - Add floor (scaled cube: X=20, Y=20, Z=0.5)
   - Add walls (4 cubes around perimeter)
   - Add "Judge's Bench" (large cube at one end)
   - Add Player Start (in front of bench)
   - Add Directional Light (indoor lighting)

3. **Courtroom Logic Blueprint:**
   - Create Actor Blueprint: BP_CourtroomManager
   - Place in level
   - Event Begin Play:
     ```
     ├─> Wait 1 second (let player load)
     ├─> Create Widget: WBP_PaperworkForm (from Agent 4)
     ├─> Add to Viewport
     ├─> Set Input Mode UI Only
     └─> Show Mouse Cursor
     ```

#### 3. Arrest Mechanic Integration

**In BP_VroomGameMode:**

1. **Add Function: TransitionToCourtroom**
   ```
   ├─> Save Player State (position, violations)
   ├─> Show "BUSTED" screen (Widget)
   ├─> Wait 3 seconds
   ├─> Open Level: Courtroom
   └─> Play Dramatic Music (optional)
   ```

2. **Configure in World Settings:**
   - Ensure GameMode is set to BP_VroomGameMode in OpenWorld.umap

### ACCEPTANCE CRITERIA:
- [ ] Police detect player within 3000 units
- [ ] Police chase player aggressively
- [ ] Collision with police triggers arrest
- [ ] "YOU'RE UNDER ARREST FOR: EXISTING" message shows
- [ ] Game transitions to Courtroom scene after 2 seconds
- [ ] Courtroom scene loads and shows paperwork UI

---

## AGENT 4: UI/UX (MAIN MENU, HUD, COURTROOM FORMS)

### Objective
Create all UI widgets with HUMOR ELEMENTS. Must be functional and FUNNY.

### Deliverables

#### 1. Create WBP_MainMenu (Main Menu)

**Steps:**

1. **Create Widget:**
   - Content/Blueprints/UI → Right-click
   - User Interface → Widget Blueprint
   - Parent Class: VroomMainMenuWidget (C++ class)
   - Name: WBP_MainMenu

2. **Design Layout:**
   - Canvas Panel (root)
   - Vertical Box (centered):
     - Text Block: "VROOM VROOM" (size 72, bold)
     - Text Block: "A Definitely Normal Driving Simulator™" (size 24, italic)
     - Button: "NEW GAME" → On Clicked: Start Game
     - Button: "LOAD GAME" → On Clicked: Load Game
     - Button: "CREDITS" → On Clicked: Show Credits
     - Button: "QUIT" → On Clicked: Quit Game

3. **Button Functionality (Graph):**
   ```
   "NEW GAME" Button → On Clicked:
   ├─> Open Level: OpenWorld
   └─> Set Input Mode Game Only

   "LOAD GAME" Button → On Clicked:
   ├─> Call C++ Load Game function
   └─> Open Level: OpenWorld

   "CREDITS" Button → On Clicked:
   ├─> Create Widget: WBP_Credits
   └─> Add to Viewport

   "QUIT" Button → On Clicked:
   └─> Quit Game
   ```

4. **Style:**
   - Background: Dark with police lights flashing (optional)
   - Button colors: Red (danger theme)
   - Font: Bold, readable

5. **Create MainMenu.umap:**
   - File → New Level → Empty Level
   - Save as Content/Maps/MainMenu
   - Add Player Start
   - Add Directional Light
   - Place BP_MainMenuManager actor (create this):
     - Event Begin Play → Create WBP_MainMenu → Add to Viewport

6. **Set as Default Map:**
   - Project Settings → Maps & Modes
   - Game Default Map: MainMenu
   - Editor Startup Map: OpenWorld

#### 2. Create WBP_HUD (Heads-Up Display)

**Steps:**

1. **Create Widget:**
   - Widget Blueprint → Name: WBP_HUD

2. **Design Layout:**
   - Canvas Panel (root)
   - Top-Left Corner:
     - Text Block: "Speed: 0 MPH" (bind to player speed)
   - Top-Right Corner:
     - Horizontal Box:
       - Text Block: "Wanted Level: "
       - Image: Star icon (repeat 5 times for 5-star wanted level)
   - Bottom-Center:
     - Text Block: "Police nearby: EVERYWHERE" (always visible)
   - Center (Notification Area):
     - Text Block: (for arrest messages)

3. **Bindings (Graph):**
   ```
   Speed Text → Get Text:
   ├─> Get Player Character
   ├─> Get Velocity → Length
   ├─> Divide by 100 (convert to MPH approximation)
   └─> Format as "Speed: {0} MPH"

   Wanted Stars → Get Brush:
   ├─> Get Player State → Get Wanted Level
   └─> Show filled stars based on level (1-5)
   ```

4. **Add to Player Controller:**
   - In BP_VroomPlayerController:
   - Event Begin Play → Create WBP_HUD → Add to Viewport

#### 3. Create WBP_PaperworkForm (Courtroom Paperwork)

**This is the HUMOR centerpiece!**

**Steps:**

1. **Create Widget:**
   - Widget Blueprint → Name: WBP_PaperworkForm

2. **Design Layout (MAKE IT ABSURD):**
   - Canvas Panel (root)
   - Scroll Box (main content area):
     - Text Block: "FORM 47-B: TRAFFIC VIOLATION ACKNOWLEDGMENT"
     - Text Block: "Section 1: Personal Information"
     - Editable Text Box: "Full Legal Name (include middle names, maiden names, nicknames)"
     - Editable Text Box: "Social Security Number (all digits, no dashes)"
     - Editable Text Box: "Mother's maiden name"
     - Editable Text Box: "Father's mother's maiden name"
     - Editable Text Box: "First pet's name"
     - Text Block: "Section 2: Violation Details"
     - Editable Text Box: "What were you doing when arrested?"
     - Editable Text Box: "Did you know you were existing? (Y/N)"
     - Editable Text Box: "In 500 words or less, explain why you thought driving was a good idea"
     - Text Block: "Section 3: Legal Acknowledgments"
     - Check Box: "I acknowledge that I have read the 47-page Terms and Conditions"
     - Check Box: "I agree that I am guilty regardless of circumstances"
     - Check Box: "I waive my right to exist peacefully"
     - Text Block: "Section 4: Signature"
     - Editable Text Box: "Print Name"
     - Editable Text Box: "Sign Name (must be different from printed name)"
     - Editable Text Box: "Today's Date"
     - Editable Text Box: "Tomorrow's Date (in case you fill this out too slowly)"
     - Text Block: "Section 5: Confirmation"
     - Check Box: "Check box 47B subsection 12 paragraph 7 line 4 word 9"
     - Check Box: "I understand this form serves no purpose"
   - Button: "SUBMIT FORM" (bottom-right)

3. **Validation Logic (Graph):**
   ```
   "SUBMIT" Button → On Clicked:
   ├─> Check if ALL fields are filled?
   │   ├─> NO: Show error message: "INCOMPLETE FORM! START OVER!"
   │   │   └─> Clear all fields (evil!)
   │   └─> YES: Proceed to sentencing
   │       ├─> Close Widget
   │       ├─> Show sentence: "You are sentenced to 5 years in prison. For existing."
   │       ├─> Wait 3 seconds
   │       └─> Transition to Prison (or back to OpenWorld for MVP)
   ```

4. **HUMOR ELEMENTS:**
   - Add random validation errors:
     - "Signature looks suspicious. Redo page 1."
     - "You checked box 47B but not box 47A. Restart."
   - Make some fields mandatory but hidden (scroll to find them)
   - Add a timer that makes you panic

#### 4. Create WBP_ArrestNotification (Popup)

**Simple popup for arrest:**

1. **Create Widget:**
   - Widget Blueprint → Name: WBP_ArrestNotification

2. **Design:**
   - Border (red, thick)
   - Vertical Box:
     - Text Block: "YOU'RE UNDER ARREST!" (huge, red)
     - Text Block: "CHARGE: EXISTING IN A SUSPICIOUS MANNER" (size 36)
     - Text Block: "Additional charges pending..." (size 18)

3. **Auto-Close:**
   - Event Construct → Delay 3 seconds → Remove from Parent

### ACCEPTANCE CRITERIA:
- [ ] WBP_MainMenu shows and buttons work
- [ ] "NEW GAME" starts the game (loads OpenWorld)
- [ ] WBP_HUD displays during gameplay
- [ ] Speed and wanted level update in real-time
- [ ] WBP_PaperworkForm appears in courtroom
- [ ] Paperwork form is ABSURDLY detailed and frustrating
- [ ] Form validation is strict (must fill EVERYTHING)
- [ ] WBP_ArrestNotification shows funny arrest message
- [ ] All text is HUMOROUS and over-the-top

---

## INTEGRATION CHECKLIST

Once all 4 agents complete their work:

### 1. Verify Blueprint Connections
- [ ] BP_VroomGameMode set in Project Settings
- [ ] BP_VroomGameMode set in OpenWorld map
- [ ] BP_VehicleSpawner references BP_PoliceVehicle
- [ ] BP_PoliceVehicle can detect and chase player
- [ ] BP_VroomPlayerController creates HUD on begin play

### 2. Verify Map Flow
- [ ] MainMenu.umap loads first (Project Settings)
- [ ] "NEW GAME" button loads OpenWorld.umap
- [ ] Arrest transitions to Courtroom.umap
- [ ] (Optional) Courtroom transitions back to OpenWorld after sentencing

### 3. Verify Input
- [ ] Xbox controller works in vehicle (test on actual Xbox controller)
- [ ] Left stick: steering + acceleration
- [ ] Right trigger: brake
- [ ] A button: enter/exit vehicle (if implemented)

### 4. Test Gameplay Loop
1. Launch game → Main menu appears
2. Click "NEW GAME" → OpenWorld loads
3. Player spawns with 25+ police vehicles visible
4. Enter a vehicle (F key or A button)
5. Drive with Xbox controller
6. Police chase immediately
7. Get caught → "YOU'RE UNDER ARREST" message
8. Courtroom scene loads
9. Paperwork form appears
10. Fill out absurd form (test validation)
11. Submit → Sentenced

### 5. Polish (if time permits)
- [ ] Add siren sounds to police
- [ ] Add engine sounds to vehicles
- [ ] Add background music
- [ ] Improve lighting in courtroom
- [ ] Add more humor text

---

## TROUBLESHOOTING

### Common Issues:

**"Blueprints show errors"**
- Right-click .uproject → Generate Visual Studio project files
- Open in UE5.6.1 → Let it compile C++
- Refresh blueprints

**"Police don't chase"**
- Check BP_PoliceVehicle has AI enabled
- Verify detection range (3000 units)
- Ensure Player Character is valid reference

**"Xbox controller doesn't work"**
- Verify Input Mappings in Project Settings
- Check "Gamepad" is enabled in Input settings
- Test with actual Xbox controller (not keyboard emulation)

**"Arrest doesn't trigger"**
- Check collision on BP_PoliceVehicle (must have overlap events enabled)
- Verify OnComponentBeginOverlap is implemented
- Check player velocity detection

**"Paperwork form doesn't submit"**
- Verify ALL fields are filled
- Check validation logic in Graph
- Add print strings for debugging

---

## FINAL DELIVERABLE

**A playable game where:**
1. User launches game → Sees main menu
2. Clicks "NEW GAME" → Spawns in open world with Xbox controller support
3. Drives around → Immediately chased by 25+ police vehicles
4. Gets arrested → Sees funny arrest message
5. Courtroom scene → Fills out ONE absurdly detailed form
6. Laughs at the absurdity → MISSION ACCOMPLISHED

**Priority: PLAYABLE over PRETTY. Functionality over polish. HUMOR over realism.**

---

## TIME ESTIMATE

- Agent 1 (Level): 2-3 hours
- Agent 2 (Vehicles): 3-4 hours
- Agent 3 (Police AI): 2-3 hours
- Agent 4 (UI): 3-4 hours
- Integration: 1-2 hours
- Testing: 1 hour

**TOTAL: 12-17 hours of focused work**

**LET'S GET VROOM VROOM MOVING!**
