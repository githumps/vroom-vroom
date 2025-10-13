# VROOM VROOM - 45 MINUTE QUICK REFERENCE
**PRINT THIS AND KEEP IT NEXT TO YOUR KEYBOARD**

---

## PHASE 1: VEHICLE (20 MIN)

### BP_VehicleBase Components
```
Add Component → Static Mesh
├─ Mesh: /Engine/BasicShapes/Cube
├─ Scale: X=4, Y=2, Z=1
├─ Collision: PhysicsActor
├─ ✓ Simulate Physics
└─ Mass: 1500

Add Component → Spring Arm (child of Static Mesh)
├─ Location Z: 200
├─ Arm Length: 600
└─ ✓ Camera Lag

Add Component → Camera (child of Spring Arm)

Variables:
├─ MaxSpeed (Float): 2000
├─ Acceleration (Float): 1500
├─ TurnSpeed (Float): 100
└─ BrakeForce (Float): 2000
```

### BP_VehicleBase Event Graph
```
EVENT TICK
├─ Get Input Axis (MoveForward)
│  └─ * 1500 → Get Forward Vector → * result → Add Force ✓Velocity
├─ Get Input Axis (MoveRight)
│  └─ * 100 → Get Up Vector → * result → Add Torque ✓Velocity
└─ Get Input Axis (Brake)
   └─ Branch (> 0.01)
      └─ Get Velocity → * -2000 → Add Force ✓Velocity
```

---

## PHASE 2: INPUT (5 MIN)

### Edit → Project Settings → Input → Axis Mappings

**MoveForward:**
- W: 1.0
- S: -1.0
- Gamepad Left Thumbstick Up/Down: 1.0

**MoveRight:**
- A: -1.0
- D: 1.0
- Gamepad Left Thumbstick Right/Left: 1.0

**Brake:**
- Space: 1.0
- Gamepad Right Trigger: 1.0

---

## PHASE 3: POLICE AI (10 MIN)

### BP_PoliceVehicle Event Graph
```
EVENT TICK
└─ Get Player Character
   └─ Get Actor Location
      └─ Get Actor Location (Self)
         └─ Find Look at Rotation
            └─ Set Actor Rotation
               └─ Get Forward Vector → * 1200 → Add Force ✓Velocity
```

**OR SIMPLE VERSION:**
```
EVENT TICK
└─ Get Player Character
   └─ AI Move To (Acceptance: 200)
```

---

## PHASE 4: LEVEL (5 MIN)

### OpenWorld.umap
1. Drag **BP_VehicleSpawner** into level
2. Details:
   - Vehicle Class: **BP_PoliceVehicle**
   - Initial: **25**
   - Max: **50**
   - Radius: **10000**
3. Window → World Settings:
   - GameMode Override: **BP_VroomGameMode**
4. Save (Ctrl+S)

---

## PHASE 5: TEST (5 MIN)

### Play (Alt+P)
**Expected:**
- ✓ WASD moves vehicle
- ✓ Xbox left stick moves
- ✓ Space/trigger brakes
- ✓ 25 police spawn
- ✓ Police chase player
- ✓ Camera follows smoothly

**If broken:**
- Check "Simulate Physics" is ON
- Check Input Mappings exist
- Check Spawner is PLACED in level
- Check GameMode is set

---

## COMMON MISTAKES

1. Forgot to CHECK "Simulate Physics"
2. Forgot to make Spring Arm CHILD of Static Mesh
3. Forgot to make Camera CHILD of Spring Arm
4. Forgot to set GameMode Override in World Settings
5. Forgot to PLACE spawner in level (just creating it isn't enough)
6. Forgot Gamepad bindings in input (only added WASD)

---

## TROUBLESHOOTING ONE-LINERS

| Problem | Solution |
|---------|----------|
| Vehicle doesn't move | Check "Simulate Physics" |
| No controller input | Add Gamepad to Input Mappings |
| Police don't spawn | PLACE spawner in level |
| Police don't chase | Add AI logic to Event Graph |
| Camera is weird | Make Spring Arm child of mesh |
| Game won't start | Set GameMode in World Settings |

---

## FILE LOCATIONS

```
Content/
├─ Blueprints/
│  ├─ Core/
│  │  ├─ BP_VroomGameMode ← Set in World Settings
│  │  ├─ BP_VroomCharacter
│  │  └─ BP_VroomPlayerController
│  ├─ Vehicles/
│  │  ├─ BP_VehicleBase ← CONFIGURE THIS
│  │  ├─ BP_PoliceVehicle ← ADD AI HERE
│  │  └─ BP_VehicleSpawner ← PLACE IN LEVEL
│  └─ UI/
│     └─ WBP_MainMenu
└─ Maps/
   ├─ OpenWorld.umap ← WORK HERE
   ├─ Courtroom.umap
   └─ MainMenu.umap
```

---

## BLUEPRINT NODE QUICK FIND

Type these in Blueprint node search:

- `Get Input Axis Value`
- `Add Force` (check "Velocity Change")
- `Add Torque` (check "Velocity Change")
- `Get Actor Forward Vector`
- `Get Actor Up Vector`
- `Get Velocity`
- `Get Player Character`
- `AI Move To`
- `Find Look at Rotation`
- `Set Actor Rotation`

---

## TIME BUDGET

- 10 min: BP_VehicleBase components
- 10 min: BP_VehicleBase Event Graph
- 5 min: Input Mappings
- 10 min: BP_PoliceVehicle AI
- 5 min: OpenWorld level setup
- 5 min: Playtest

**Total: 45 minutes**

**If you're over time:** You're being too careful. Use engine cubes, basic logic, test frequently.

**If you're under time:** Good! Add polish or take a break.

---

## SUCCESS = THIS WORKING

1. Launch game (Play button)
2. Push left stick forward
3. Vehicle moves
4. Police chase you
5. You drive around laughing

**If all 5 happen: SUCCESS!**

---

**For full details, see:** BATTLE_PLAN_IMMEDIATE_EXECUTION.md

**For troubleshooting, see:** VROOM_ENFORCER_FINAL_REPORT.md

**NOW GO BUILD THE GAME.**
