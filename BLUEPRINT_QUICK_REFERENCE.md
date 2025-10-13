# BLUEPRINT QUICK REFERENCE - CRITICAL NODES

This is a SIMPLE reference for the most critical Blueprint logic you need to implement.

---

## BP_VEHICLEBASE - EVENT GRAPH (DRIVING LOGIC)

### Minimum Viable Driving (Simple Physics-Based)

```
EVENT TICK
│
├─── GET INPUT AXIS VALUE
│    ├─ Axis Name: "MoveForward"
│    └─> [float output] ──────┐
│                              │
├─── GET ACTOR FORWARD VECTOR  │
│    └─> [vector output] ──┐   │
│                          │   │
├─── [FLOAT × FLOAT] ←──────┤ (1500.0)
│    └─> [result] ────────┐
│                         │
├─── [VECTOR × VECTOR] ←──┴─────┐
│    └─> [result] ──────────────┤
│                                │
└─── ADD FORCE                   │
     ├─ Force ←──────────────────┘
     └─ [✓] Vel Change: TRUE


SAME PATTERN FOR TURNING:

EVENT TICK
│
├─── GET INPUT AXIS VALUE
│    ├─ Axis Name: "MoveRight"
│    └─> [float output] ──────┐
│                              │
├─── GET ACTOR UP VECTOR       │
│    └─> [vector output] ──┐   │
│                          │   │
├─── [FLOAT × FLOAT] ←──────┤ (100.0)
│    └─> [result] ────────┐
│                         │
├─── [VECTOR × VECTOR] ←──┴─────┐
│    └─> [result] ──────────────┤
│                                │
└─── ADD TORQUE                  │
     ├─ Torque ←─────────────────┘
     └─ [✓] Vel Change: TRUE


BRAKING:

EVENT TICK
│
├─── GET INPUT AXIS VALUE
│    ├─ Axis Name: "Brake"
│    └─> [float output] ──> BRANCH (> 0.01?)
│                              │
│                              └─ TRUE ─────┐
│                                            │
├─── GET VELOCITY                            │
│    └─> [vector] ──────────────────────────┤
│                                            │
├─── [VECTOR × FLOAT] ←─────────────────┤ (-1.0)
│    └─> [result] ───────────────────┐
│                                    │
├─── [VECTOR × FLOAT] ←──────────────┴─ (2000.0)
│    └─> [result] ──────────────────┐
│                                    │
└─── ADD FORCE                        │
     ├─ Force ←───────────────────────┘
     └─ [✓] Vel Change: TRUE
```

### Node Names to Search:
- `Get Input Axis Value` - reads controller input
- `Get Actor Forward Vector` - vehicle's forward direction
- `Get Actor Up Vector` - vehicle's up direction (for rotation)
- `Multiply (float × float)` - scale values
- `Multiply (vector × vector)` - combine directions
- `Add Force` - apply physics force (movement)
- `Add Torque` - apply rotational force (turning)
- `Get Velocity` - current speed
- `Branch` - if/then logic

---

## BP_POLICEVEHICLE - EVENT GRAPH (SIMPLE CHASE AI)

```
EVENT TICK
│
├─── GET PLAYER CHARACTER
│    └─> [Character reference] ────────┐
│                                       │
└─── AI MOVE TO                         │
     ├─ Target ←────────────────────────┘
     ├─ Acceptance Radius: 200.0
     └─ [Execute]
```

**That's it! Simplest chase AI possible.**

### For Arrest (Add this later):

```
EVENT ACTOR BEGIN OVERLAP
│
├─── OTHER ACTOR ──> CAST TO VroomVroomCharacter
│                    │
│                    └─ SUCCESS ────┐
│                                   │
├─── PRINT STRING ←─────────────────┤
│    ├─ Text: "YOU'RE UNDER ARREST!"
│    └─ Duration: 3.0               │
│                                   │
├─── DELAY ←───────────────────────┤
│    └─ Duration: 2.0               │
│                                   │
└─── OPEN LEVEL ←──────────────────┘
     └─ Level Name: "Courtroom"
```

---

## BP_VEHICLESPAWNER - CLASS DEFAULTS

**No Event Graph needed!** Just set these properties:

- **Vehicle Class To Spawn**: `BP_PoliceVehicle` (use dropdown)
- **Initial Police Vehicles**: `25`
- **Max Police Vehicles**: `50`
- **Spawn Radius**: `10000.0`

The C++ code handles everything else automatically.

---

## WBP_HUD - WIDGET BLUEPRINT (Create later)

### Designer Layout:

```
Canvas Panel (root)
│
├─── Text Block (Top-Left)
│    ├─ Text: "Speed: 0 MPH"
│    └─ [Bind] to function GetSpeedText
│
├─── Horizontal Box (Top-Right)
│    ├─ Text Block: "Wanted Level: "
│    └─ Image (Star icon) × 5
│
└─── Text Block (Center)
     └─ Text: (for notifications)
```

### Graph - Speed Binding:

```
FUNCTION: GetSpeedText (Returns: Text)
│
├─── GET PLAYER CHARACTER
│    └─> CAST TO VroomVroomCharacter
│         └─> GET VELOCITY
│              └─> VECTOR LENGTH
│                   └─> [DIVIDE] (/100.0)
│                        └─> FORMAT TEXT
│                             ├─ Format: "Speed: {0} MPH"
│                             └─> RETURN TEXT
```

---

## WBP_PAPERWORKFORM - WIDGET BLUEPRINT (The Humor!)

### Designer Layout (Simplified):

```
Canvas Panel
│
└─── Scroll Box (full screen)
     │
     └─── Vertical Box
          │
          ├─ Text: "FORM 47-B: TRAFFIC VIOLATION"
          ├─ Text: "Full Legal Name:"
          ├─ Editable Text Box (name: NameField)
          ├─ Text: "Did you know you were existing? (Y/N)"
          ├─ Editable Text Box (name: ExistingField)
          ├─ Text: "Explain in 500 words why..."
          ├─ Editable Text Box Multiline (name: EssayField)
          ├─ Check Box: "I acknowledge guilt"
          ├─ Check Box: "I understand this serves no purpose"
          └─ Button: "SUBMIT" (name: SubmitButton)
```

### Graph - Submit Logic:

```
EVENT: On Clicked (SubmitButton)
│
├─── GET TEXT (NameField)
│    └─> [string output] ──────┐
│                               │
├─── GET TEXT (ExistingField)  │
│    └─> [string output] ──────┤
│                               │
├─── GET TEXT (EssayField)     │
│    └─> [string output] ──────┤
│                               │
└─── BRANCH                     │
     ├─ Condition: All Strings NOT EMPTY?
     │
     ├─ TRUE ──> PRINT STRING: "Sentenced to 5 years"
     │           └─> DELAY (3.0s)
     │                └─> OPEN LEVEL ("OpenWorld")
     │
     └─ FALSE ──> PRINT STRING: "INCOMPLETE! START OVER!"
                  └─> SET TEXT (Clear all fields) ← EVIL!
```

---

## INPUT MAPPINGS (Project Settings)

**Path: Edit > Project Settings > Input > Axis Mappings**

```
MoveForward
├─ W          Scale: 1.0
├─ S          Scale: -1.0
└─ Gamepad Left Thumbstick Up/Down  Scale: 1.0

MoveRight
├─ A          Scale: -1.0
├─ D          Scale: 1.0
└─ Gamepad Left Thumbstick Right/Left  Scale: 1.0

Brake
├─ Space Bar  Scale: 1.0
└─ Gamepad Right Trigger Axis  Scale: 1.0
```

---

## COMMON NODE SHORTCUTS

| Want to...                  | Node Name                     |
|-----------------------------|-------------------------------|
| Read controller input       | `Get Input Axis Value`        |
| Move actor                  | `Add Force`, `Set Location`   |
| Rotate actor                | `Add Torque`, `Set Rotation`  |
| Get player                  | `Get Player Character`        |
| Check collision             | `Event Actor Begin Overlap`   |
| Wait before doing something | `Delay`                       |
| Load new level              | `Open Level`                  |
| Show UI                     | `Create Widget`, `Add to Viewport` |
| Print debug text            | `Print String`                |
| Math operations             | `+`, `-`, `×`, `/`  (search: "multiply", "add", etc.) |
| If/then logic               | `Branch`, `Select`            |

---

## BLUEPRINT TIPS

1. **Can't find a node?**
   - Right-click in Event Graph
   - Type what you want (e.g., "player", "input", "move")
   - Use arrow keys to browse results

2. **Red error lines?**
   - Click "Compile" button (top toolbar)
   - Read error messages in bottom panel
   - Usually means: wrong variable type or missing connection

3. **Nothing happens in game?**
   - Add "Print String" nodes to debug
   - Check Output Log (Window > Developer Tools > Output Log)

4. **Physics feels wrong?**
   - Adjust Mass, Linear Damping, Angular Damping on root component
   - Increase Acceleration/TurnSpeed variables
   - Lower values = slower, higher = faster

5. **Copy-paste is your friend:**
   - Select nodes > Ctrl+C
   - Paste into other blueprints
   - Saves time!

---

## VALIDATION CHECKLIST

Before saying "it's done", verify:

- [ ] Vehicle has Static Mesh with "Simulate Physics" checked
- [ ] Spring Arm and Camera are attached and positioned
- [ ] Input Mappings include "Gamepad" entries
- [ ] Event Graph has Event Tick connected to driving logic
- [ ] BP_VehicleSpawner is PLACED in the level (not just created)
- [ ] BP_VehicleSpawner references BP_PoliceVehicle
- [ ] World Settings has GameMode set to BP_VroomGameMode
- [ ] Xbox controller is plugged in before testing

---

## FASTEST PATH TO PLAYABLE

1. Create Blueprints (run Python script) - 5 min
2. Configure BP_VehicleBase (add components) - 10 min
3. Add driving logic (Event Graph) - 10 min
4. Add Input Mappings - 5 min
5. Place BP_VehicleSpawner in map - 2 min
6. Test play - 1 min

**TOTAL: 33 minutes to drivable prototype**

Then add:
7. Police chase AI - 10 min
8. Test again - PLAYABLE!

---

**USE THIS AS YOUR CHEAT SHEET WHILE BUILDING.**

**PIN THIS DOCUMENT. REFERENCE IT CONSTANTLY.**
