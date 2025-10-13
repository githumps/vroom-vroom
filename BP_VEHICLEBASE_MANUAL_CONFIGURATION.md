# BP_VEHICLEBASE MANUAL CONFIGURATION GUIDE

**Agent 2: Vehicle Blueprint Engineer - Deliverable**

## Project Information
- **Target Blueprint:** `Content/Blueprints/Vehicles/BP_VehicleBase.uasset`
- **Engine Version:** Unreal Engine 5.6.1
- **Parent Class:** VehicleBase (C++ class)
- **Purpose:** Drivable vehicle with physics-based movement

---

## PREREQUISITES

Before starting, ensure:
1. Unreal Engine 5.6.1 is running
2. Vroom Vroom project is open
3. BP_VehicleBase exists at `/Game/Blueprints/Vehicles/BP_VehicleBase`
4. C++ VehicleBase class is compiled

---

## CONFIGURATION PROCEDURE

### STEP 1: OPEN BLUEPRINT

1. Open Content Browser
2. Navigate to: `Content/Blueprints/Vehicles/`
3. Double-click `BP_VehicleBase` to open Blueprint Editor

**Expected Result:** Blueprint editor opens with Components panel on left

---

### STEP 2: VERIFY EXISTING COMPONENTS

The C++ VehicleBase constructor creates these components automatically:

**Existing Components (from C++):**
- **VehicleBody** (UBoxComponent) - Root component
- **EntryTrigger** (UBoxComponent)
- **SpringArm** (USpringArmComponent)
- **FollowCamera** (UCameraComponent)
- **InteriorCamera** (UCameraComponent)
- **EngineAudioComponent** (UAudioComponent)
- **HornAudioComponent** (UAudioComponent)
- **SirenAudioComponent** (UAudioComponent)

**Verify in Components Panel:**
```
▼ VehicleBody (BoxComponent)
  ├─ EntryTrigger (BoxComponent)
  ├─ EngineAudioComponent (AudioComponent)
  ├─ HornAudioComponent (AudioComponent)
  ├─ SirenAudioComponent (AudioComponent)
  ├─ SpringArm (SpringArmComponent)
  │   └─ FollowCamera (CameraComponent)
  └─ InteriorCamera (CameraComponent)
```

**If components are missing:** The C++ class may not be properly compiled. Run C++ project compilation first.

---

### STEP 3: CONFIGURE VEHICLEBODY (ROOT COMPONENT)

**Component:** VehicleBody (BoxComponent)

1. **Select VehicleBody** in Components panel

2. **In Details Panel > Transform:**
   - Location: (0, 0, 0)
   - Rotation: (0, 0, 0)
   - Scale: (1, 1, 1)

3. **In Details Panel > Physics:**
   - ✓ Simulate Physics: **TRUE**
   - Mass Scale: **1.0**
   - Mass in Kg: **1500.0**
   - Linear Damping: **0.01**
   - Angular Damping: **0.5**
   - ✓ Enable Gravity: **TRUE**

4. **In Details Panel > Collision:**
   - Collision Presets: **PhysicsActor**
   - Can Character Step Up On: **ECB_Yes**
   - Collision Enabled: **Query and Physics**

5. **In Details Panel > Collision Responses:**
   - Block: WorldStatic, WorldDynamic, Pawn, PhysicsBody, Vehicle
   - Overlap: Trigger, Camera

**Expected Result:** VehicleBody is now a physics-enabled root component with car-like mass

---

### STEP 4: ADD STATIC MESH COMPONENT (VISUAL REPRESENTATION)

**Purpose:** Provides visible geometry for the vehicle

1. **Add Component:**
   - Click **"+ Add"** button in Components panel
   - Search for: **"Static Mesh"**
   - Click to add

2. **Rename Component:**
   - Select new component
   - Press F2 or right-click > Rename
   - Name: **"VehicleVisualMesh"**

3. **Set Parent:**
   - Drag **VehicleVisualMesh** onto **VehicleBody**
   - It should be indented under VehicleBody

4. **Configure Static Mesh:**
   - In Details Panel > Static Mesh:
   - Static Mesh: **`/Engine/BasicShapes/Cube`**

5. **Configure Transform:**
   - Location: **(0, 0, 0)** (relative to VehicleBody)
   - Rotation: **(0, 0, 0)**
   - Scale: **(4.0, 2.0, 1.0)** ← Makes a car-shaped box

6. **Configure Collision:**
   - Collision Presets: **NoCollision**
   - (VehicleBody handles all physics collision)

7. **Configure Rendering:**
   - ✓ Visible: **TRUE**
   - Cast Shadow: **TRUE**
   - Receives Decals: **TRUE**

**Expected Result:** A blue rectangular box representing the vehicle body

**Visual Appearance:**
- Width (X): 400 cm (4 meters) - Front to back
- Depth (Y): 200 cm (2 meters) - Side to side
- Height (Z): 100 cm (1 meter) - Ground to roof

---

### STEP 5: CONFIGURE SPRING ARM COMPONENT

**Component:** SpringArm (SpringArmComponent)

1. **Select SpringArm** in Components panel

2. **Verify Hierarchy:**
   - SpringArm should be child of **VehicleBody**
   - If not, drag it onto VehicleBody

3. **In Details Panel > Transform:**
   - Location: **(0, 0, 200)** ← 200 cm above vehicle
   - Rotation: (0, 0, 0)
   - Scale: (1, 1, 1)

4. **In Details Panel > Camera:**
   - Target Arm Length: **600.0** ← Distance camera follows behind
   - Socket Offset: **(0, 0, 50)**
   - Target Offset: **(0, 0, 0)**

5. **In Details Panel > Camera Lag:**
   - ✓ Enable Camera Lag: **TRUE**
   - Camera Lag Speed: **3.0**
   - Camera Lag Max Distance: **200.0**

6. **In Details Panel > Camera Rotation:**
   - ✓ Enable Camera Rotation Lag: **TRUE**
   - Camera Rotation Lag Speed: **4.0**

7. **In Details Panel > Camera Settings:**
   - ✓ Use Pawn Control Rotation: **TRUE**
   - ✓ Inherit Pitch: **TRUE**
   - ✓ Inherit Yaw: **TRUE**
   - ✓ Inherit Roll: **TRUE**

**Expected Result:** Spring Arm positioned 200cm above vehicle center, ready to hold camera 600cm behind vehicle

---

### STEP 6: CONFIGURE FOLLOW CAMERA COMPONENT

**Component:** FollowCamera (CameraComponent)

1. **Select FollowCamera** in Components panel

2. **Verify Hierarchy:**
   - FollowCamera should be child of **SpringArm**
   - If not, drag it onto SpringArm

3. **In Details Panel > Transform:**
   - Location: **(0, 0, 0)** (relative to SpringArm socket)
   - Rotation: (0, 0, 0)
   - Scale: (1, 1, 1)

4. **In Details Panel > Camera Settings:**
   - Field of View: **90.0**
   - Aspect Ratio: **1.777778** (16:9)
   - ✓ Constrain Aspect Ratio: **FALSE**

5. **In Details Panel > Camera Options:**
   - ✓ Use Pawn Control Rotation: **FALSE** (SpringArm handles rotation)

**Expected Result:** Camera attached to SpringArm, providing third-person view of vehicle

---

### STEP 7: VERIFY COMPONENT HIERARCHY

**Final Component Tree should look like:**

```
▼ BP_VehicleBase (VehicleBase)
  ▼ VehicleBody (BoxComponent) [ROOT] ⚡ Physics Enabled
    ├─ VehicleVisualMesh (StaticMeshComponent) [Cube 4x2x1]
    ├─ EntryTrigger (BoxComponent)
    ├─ SpringArm (SpringArmComponent) [Z=200, ArmLength=600]
    │   └─ FollowCamera (CameraComponent) [Active]
    ├─ InteriorCamera (CameraComponent) [Inactive]
    ├─ EngineAudioComponent (AudioComponent)
    ├─ HornAudioComponent (AudioComponent)
    └─ SirenAudioComponent (AudioComponent)
```

**Hierarchy Rules:**
- VehicleBody must be ROOT
- VehicleVisualMesh must be child of VehicleBody
- SpringArm must be child of VehicleBody
- FollowCamera must be child of SpringArm

---

### STEP 8: CONFIGURE CLASS DEFAULTS

1. **Click "Class Defaults"** button in toolbar (or open Class Settings)

2. **In Details Panel > Vehicle Settings:**
   - Vehicle Type: **Sedan**
   - Is Police Vehicle: **FALSE**

3. **In Details Panel > Vehicle Stats:**
   - Max Speed: **180.0**
   - Acceleration: **8.0**
   - Brake Force: **20.0**
   - Turn Rate: **45.0**
   - Health: **100.0**
   - Fuel: **100.0**
   - Fuel Consumption Rate: **0.1**

4. **In Details Panel > Physics Settings:**
   - Engine Power: **500.0**
   - Wheel Friction: **3.0**

---

### STEP 9: COMPILE BLUEPRINT

1. **Click "Compile"** button in toolbar
   - Button should turn **GREEN** if successful
   - If **RED**, check Output Log for errors

2. **Common Compilation Errors:**
   - **"Missing parent class"** → C++ VehicleBase not compiled
   - **"Component not found"** → Check component names match C++ exactly
   - **"Cyclic dependency"** → Check no circular component attachments

3. **Save Blueprint:**
   - Click **"Save"** button in toolbar
   - Or press **Ctrl+S**

**Expected Result:** Blueprint compiles successfully with green checkmark

---

### STEP 10: TEST IN EDITOR

**Quick Test:**

1. **Open Test Level:**
   - Open any level (or create new empty level)

2. **Place Vehicle:**
   - Drag **BP_VehicleBase** from Content Browser into viewport
   - Position at coordinates: **(0, 0, 100)** (100cm above ground)
   - This ensures vehicle starts above ground and falls naturally

3. **Play in Editor (PIE):**
   - Click **Play** button (or press Alt+P)

4. **Expected Behavior:**
   - Vehicle should **fall** and **land** on ground
   - Vehicle should **settle** with physics simulation
   - Camera should be behind vehicle
   - Vehicle should have visible cube mesh

5. **Test Vehicle Entry (Optional):**
   - Walk character to vehicle
   - Press **F** key
   - Character should enter vehicle and control switches to vehicle

**If vehicle doesn't fall:**
- Check VehicleBody "Simulate Physics" is TRUE
- Check "Enable Gravity" is TRUE
- Check Mass is set to 1500 kg

**If vehicle falls through floor:**
- Check Collision Preset is PhysicsActor
- Ensure floor has collision enabled

---

## CONFIGURATION SUMMARY

### Components Added/Configured:

| Component | Type | Parent | Key Settings |
|-----------|------|--------|--------------|
| VehicleBody | BoxComponent | ROOT | Physics: ON, Mass: 1500kg |
| VehicleVisualMesh | StaticMeshComponent | VehicleBody | Cube mesh, Scale: 4x2x1, No collision |
| SpringArm | SpringArmComponent | VehicleBody | Z=200, Length=600, Camera lag |
| FollowCamera | CameraComponent | SpringArm | FOV=90, Third-person view |

### Physics Configuration:
- ✓ Simulate Physics: TRUE
- ✓ Mass: 1500 kg
- ✓ Collision: PhysicsActor
- ✓ Gravity: Enabled

### Camera Configuration:
- ✓ Spring Arm at Z=200
- ✓ Target Arm Length: 600
- ✓ Camera Lag: Enabled (Speed: 3.0)
- ✓ Third-person follow camera

---

## TROUBLESHOOTING

### Problem: Blueprint won't compile

**Solution:**
1. Check Output Log for specific errors
2. Verify C++ VehicleBase class is compiled
3. Check all component names match C++ constructor
4. Ensure no duplicate component names
5. Verify parent class is set to VehicleBase

### Problem: Vehicle has no physics

**Solution:**
1. Select VehicleBody component
2. Enable "Simulate Physics" in Details panel
3. Set Mass to 1500 kg
4. Enable "Enable Gravity"
5. Set Collision Preset to PhysicsActor

### Problem: Vehicle falls through floor

**Solution:**
1. Check Collision Preset is PhysicsActor (not NoCollision)
2. Verify floor/ground has collision enabled
3. Check Collision Enabled is "Query and Physics"

### Problem: Camera not following vehicle

**Solution:**
1. Verify FollowCamera is child of SpringArm
2. Check SpringArm is child of VehicleBody
3. Enable "Use Pawn Control Rotation" on SpringArm
4. Set Target Arm Length to 600

### Problem: Vehicle looks invisible

**Solution:**
1. Add VehicleVisualMesh Static Mesh Component
2. Set Static Mesh to /Engine/BasicShapes/Cube
3. Set Scale to (4.0, 2.0, 1.0)
4. Ensure component is Visible

### Problem: Components missing from C++

**Solution:**
1. Open Visual Studio
2. Rebuild VroomVroom project (Ctrl+Shift+B)
3. Close Unreal Editor
4. Open project again
5. Reopen BP_VehicleBase

---

## VALIDATION CHECKLIST

Use this checklist to verify configuration:

### Component Hierarchy:
- [ ] VehicleBody is root component
- [ ] VehicleVisualMesh is child of VehicleBody
- [ ] SpringArm is child of VehicleBody
- [ ] FollowCamera is child of SpringArm
- [ ] All C++ components are present

### VehicleBody Configuration:
- [ ] Simulate Physics: TRUE
- [ ] Mass: 1500 kg
- [ ] Collision Preset: PhysicsActor
- [ ] Enable Gravity: TRUE

### VehicleVisualMesh Configuration:
- [ ] Static Mesh: Cube
- [ ] Scale: X=4.0, Y=2.0, Z=1.0
- [ ] Collision: NoCollision
- [ ] Visible: TRUE

### SpringArm Configuration:
- [ ] Location Z: 200
- [ ] Target Arm Length: 600
- [ ] Enable Camera Lag: TRUE
- [ ] Use Pawn Control Rotation: TRUE

### FollowCamera Configuration:
- [ ] Parent: SpringArm
- [ ] FOV: 90
- [ ] Location: (0, 0, 0) relative to SpringArm

### Blueprint Status:
- [ ] Compiles without errors (green checkmark)
- [ ] Saved successfully
- [ ] Can be placed in level
- [ ] Falls with physics when placed above ground

---

## NEXT STEPS

After completing this configuration:

1. **Create Enhanced Input Actions:**
   - See: `VEHICLE_SETUP_GUIDE.md` Part 1
   - Create Input Actions for Throttle, Steering, Brake, Horn, etc.

2. **Setup Event Graph:**
   - Add Enhanced Input mappings in BeginPlay
   - Bind Input Actions to vehicle functions

3. **Add Materials:**
   - Create vehicle material (blue/red color)
   - Apply to VehicleVisualMesh

4. **Configure Audio:**
   - Assign sound cues to EngineAudioComponent
   - Assign horn sound to HornAudioComponent

5. **Test Gameplay:**
   - Place vehicle in OpenWorld map
   - Test with Xbox controller
   - Verify driving physics

---

## FILES AND RESOURCES

### Configuration Script:
- **Python Script:** `C:\Users\evan\Documents\GitHub\vroom-vroom\configure_bp_vehiclebase.py`
- **Run in UE:** Tools > Execute Python Script

### Documentation:
- **Complete Setup:** `VEHICLE_SETUP_GUIDE.md`
- **Input Configuration:** `VEHICLE_SETUP_GUIDE.md` Part 1
- **Testing Guide:** `TESTING_AND_TROUBLESHOOTING.md`

### C++ Source:
- **Header:** `Source/VroomVroom/Public/Vehicles/VehicleBase.h`
- **Implementation:** `Source/VroomVroom/Private/Vehicles/VehicleBase.cpp`

---

## ESTIMATED TIME

- **Manual Configuration:** 15-20 minutes
- **Python Script Method:** 2-3 minutes (automated)
- **Testing and Verification:** 5 minutes

**Total Time:** 20-30 minutes

---

## CONCLUSION

This guide provides complete step-by-step instructions for configuring BP_VehicleBase with all necessary components for a drivable vehicle with physics and camera system.

**Configuration Status:** COMPLETE
**Method:** Manual configuration with detailed instructions
**Backup Method:** Python automation script provided

**Deliverable by:** Agent 2 - Vehicle Blueprint Engineer
**Date:** 2025-10-12
**Engine Version:** Unreal Engine 5.6.1

---

END OF MANUAL CONFIGURATION GUIDE
