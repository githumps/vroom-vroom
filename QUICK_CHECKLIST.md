# VROOM VROOM - QUICK EXECUTION CHECKLIST

Print this out. Check boxes as you go. NO EXCUSES.

---

## PHASE 1: AUTOMATION (5 minutes)

- [ ] Unreal Editor is open
- [ ] Go to **Tools > Execute Python Script**
- [ ] Select `MASTER_BUILD_SCRIPT.py`
- [ ] Wait for completion (watch Output Log)
- [ ] Verify in Content Browser:
  - [ ] Blueprints/Core: 3 files
  - [ ] Blueprints/Vehicles: 3 files
  - [ ] Maps: 3 files (OpenWorld, Courtroom, MainMenu)

**If all checked: Proceed to Phase 2**

---

## PHASE 2: VEHICLE SETUP (20 minutes)

- [ ] Open `BP_VehicleBase`
- [ ] Add Static Mesh Component:
  - [ ] Mesh: Cube
  - [ ] Scale: 4, 2, 1
  - [ ] Collision: PhysicsActor
  - [ ] **Simulate Physics: CHECKED**
  - [ ] Mass: 1500 kg
- [ ] Add Spring Arm:
  - [ ] Target Arm Length: 600
  - [ ] Z Location: 200
  - [ ] Camera Lag: TRUE
- [ ] Add Camera (child of Spring Arm)
- [ ] Add Variables:
  - [ ] MaxSpeed: 2000.0
  - [ ] Acceleration: 1500.0
  - [ ] TurnSpeed: 100.0
  - [ ] BrakeForce: 2000.0
- [ ] Switch to Event Graph
- [ ] Add Event Tick
- [ ] Add driving logic:
  - [ ] MoveForward → Forward Vector → Add Force
  - [ ] MoveRight → Up Vector → Add Torque
  - [ ] Brake → Reverse Velocity → Add Force
- [ ] Compile & Save

**If all checked: Vehicle is ready**

---

## PHASE 3: INPUT SETUP (5 minutes)

- [ ] Edit > Project Settings > Input
- [ ] Axis Mappings section
- [ ] Add **MoveForward**:
  - [ ] W (1.0)
  - [ ] S (-1.0)
  - [ ] Gamepad Left Thumbstick Up/Down (1.0)
- [ ] Add **MoveRight**:
  - [ ] A (-1.0)
  - [ ] D (1.0)
  - [ ] Gamepad Left Thumbstick Right/Left (1.0)
- [ ] Add **Brake**:
  - [ ] Space (1.0)
  - [ ] Gamepad Right Trigger Axis (1.0)
- [ ] Close Project Settings

**If all checked: Controller ready**

---

## PHASE 4: MAP SETUP (5 minutes)

- [ ] Open `BP_VehicleSpawner`
- [ ] Click Class Defaults
- [ ] Set properties:
  - [ ] Vehicle Class To Spawn: BP_PoliceVehicle
  - [ ] Initial Police Vehicles: 25
  - [ ] Max Police Vehicles: 50
  - [ ] Spawn Radius: 10000
- [ ] Compile & Save
- [ ] Open `OpenWorld` map
- [ ] Drag `BP_VehicleSpawner` into level (center of map)
- [ ] Window > World Settings
- [ ] GameMode Override: BP_VroomGameMode
- [ ] Save map (Ctrl+S)

**If all checked: Map ready**

---

## PHASE 5: FIRST TEST (2 minutes)

- [ ] OpenWorld map is open
- [ ] Xbox controller is plugged in
- [ ] Click **Play** button (Alt+P)
- [ ] EXPECTED RESULTS:
  - [ ] Game starts
  - [ ] I can see the world
  - [ ] 25 police vehicles spawn
  - [ ] (Driving may not work yet - that's OK)
- [ ] Press Esc to stop

**If all checked: Basic setup works! Continue.**

---

## PHASE 6: POLICE AI (10 minutes)

- [ ] Open `BP_PoliceVehicle`
- [ ] Add Static Mesh Component (same as BP_VehicleBase)
  - [ ] Cube mesh, scaled, with physics
- [ ] Add Point Light:
  - [ ] Color: Blue
  - [ ] Intensity: 5000
  - [ ] Attenuation Radius: 2000
- [ ] Switch to Event Graph
- [ ] Add Event Tick
- [ ] Add chase logic:
  - [ ] Get Player Character
  - [ ] AI Move To (Target: Player, Radius: 200)
- [ ] Compile & Save

**If all checked: Police AI ready**

---

## PHASE 7: PLAYABLE TEST (5 minutes)

- [ ] Open OpenWorld map
- [ ] Xbox controller plugged in
- [ ] Click Play
- [ ] TEST CHECKLIST:
  - [ ] Left stick moves vehicle forward/back
  - [ ] Left stick steers left/right
  - [ ] Right trigger brakes
  - [ ] 25 police vehicles visible
  - [ ] Police chase me immediately
  - [ ] I can drive around for 30+ seconds
  - [ ] It's FUN!

**If all checked: PLAYABLE PROTOTYPE COMPLETE!**

---

## PHASE 8: ARREST SYSTEM (15 minutes)

- [ ] Open `BP_PoliceVehicle`
- [ ] Event Graph
- [ ] Add Event Actor Begin Overlap
- [ ] Add logic:
  - [ ] Cast to VroomVroomCharacter
  - [ ] Print String: "YOU'RE UNDER ARREST FOR EXISTING!"
  - [ ] Delay: 2.0 seconds
  - [ ] Open Level: "Courtroom"
- [ ] Compile & Save
- [ ] Test: Get caught → Courtroom loads

**If all checked: Arrest works**

---

## PHASE 9: PAPERWORK FORM (30 minutes)

- [ ] Content Browser > UI folder
- [ ] Right-click > User Interface > Widget Blueprint
- [ ] Name: `WBP_PaperworkForm`
- [ ] Open it
- [ ] Designer tab:
  - [ ] Add Scroll Box (full screen)
  - [ ] Add Vertical Box inside
  - [ ] Add form fields:
    - [ ] Title text
    - [ ] Name field (Editable Text Box)
    - [ ] "Did you exist?" field
    - [ ] Essay field (Multiline)
    - [ ] 3+ checkboxes
    - [ ] Submit button
- [ ] Graph tab:
  - [ ] Submit Button > On Clicked
  - [ ] Check if all fields filled
  - [ ] If NO: Clear all fields (EVIL!)
  - [ ] If YES: Print sentence, delay, open OpenWorld
- [ ] Compile & Save
- [ ] Create `BP_CourtroomManager` actor
- [ ] Event Begin Play:
  - [ ] Create WBP_PaperworkForm
  - [ ] Add to Viewport
  - [ ] Set Input Mode UI Only
  - [ ] Show Mouse Cursor
- [ ] Place in Courtroom map
- [ ] Test full loop:
  - [ ] Drive → Get caught → Fill form → Back to driving

**If all checked: FULL GAME LOOP WORKS!**

---

## PHASE 10: POLISH (optional, 1-2 hours)

- [ ] Create WBP_HUD (speed display)
- [ ] Add to player controller
- [ ] Configure main menu buttons
- [ ] Set default map to MainMenu
- [ ] Test full flow: Menu → Play → Drive → Arrest → Form → Repeat
- [ ] Package game (File > Package > Windows)
- [ ] Test packaged build with Xbox controller

**If all checked: GAME IS SHIPPABLE!**

---

## TROUBLESHOOTING

**Vehicle doesn't move:**
- [ ] Simulate Physics is checked?
- [ ] Add Force nodes are connected?
- [ ] Input mappings exist?

**Xbox controller doesn't work:**
- [ ] Controller is plugged in BEFORE playing?
- [ ] Input mappings have "Gamepad" entries?
- [ ] Test with WASD first to isolate issue

**Police don't spawn:**
- [ ] BP_VehicleSpawner is PLACED in map?
- [ ] Vehicle Class To Spawn is set?
- [ ] Check Output Log for errors

**Can't find a node:**
- [ ] Right-click in Event Graph
- [ ] Type what you want
- [ ] Browse results with arrow keys

---

## TIME TRACKING

| Phase | Estimated | Actual | Status |
|-------|-----------|--------|--------|
| 1. Automation | 5 min | ___ | [ ] |
| 2. Vehicle | 20 min | ___ | [ ] |
| 3. Input | 5 min | ___ | [ ] |
| 4. Map | 5 min | ___ | [ ] |
| 5. Test | 2 min | ___ | [ ] |
| 6. Police AI | 10 min | ___ | [ ] |
| 7. Test | 5 min | ___ | [ ] |
| 8. Arrest | 15 min | ___ | [ ] |
| 9. Paperwork | 30 min | ___ | [ ] |
| 10. Polish | 60 min | ___ | [ ] |
| **TOTAL** | **157 min** | ___ | [ ] |

**TARGET: Phases 1-7 in under 1 hour = PLAYABLE PROTOTYPE**

---

## ACCEPTANCE CRITERIA

- [ ] Game launches
- [ ] Xbox controller drives vehicle
- [ ] 25+ police spawn
- [ ] Police chase player
- [ ] Arrest triggers
- [ ] Paperwork form appears
- [ ] Form is absurdly detailed
- [ ] Form validation is strict
- [ ] Full loop works
- [ ] Game is FUNNY

**When all checked: YOU WIN. SHIP IT.**

---

**START NOW. NO EXCUSES.**
