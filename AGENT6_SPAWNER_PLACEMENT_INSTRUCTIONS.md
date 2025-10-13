# Agent 6: Vehicle Spawner Placement - Complete Instructions

## Overview
This document provides complete instructions for placing and configuring the BP_VehicleSpawner in the OpenWorld map.

**Status:** Python script created + Manual fallback instructions provided
**Target:** 25 police vehicles spawning at game start
**Time Required:** 5-10 minutes (manual) or 2 minutes (Python script)

---

## Method 1: Automated Python Script (RECOMMENDED)

### Prerequisites
- Unreal Engine 5.6.1 Editor must be open
- OpenWorld.umap should be accessible
- BP_VehicleSpawner and BP_PoliceVehicle blueprints must exist

### Execution Steps

1. **Open Unreal Editor**
   - Launch Unreal Engine 5.6.1
   - Open the Vroom Vroom project

2. **Execute Python Script**
   - In Unreal Editor menu: `Tools > Execute Python Script`
   - Navigate to: `C:\Users\evan\Documents\GitHub\vroom-vroom\place_vehicle_spawner.py`
   - Click `Execute`

3. **Monitor Output Log**
   - Open `Window > Developer Tools > Output Log`
   - Watch for success messages
   - Look for: "SPAWNER SUCCESSFULLY PLACED AND VERIFIED IN LEVEL"

4. **Verify Placement**
   - Open `Window > World Outliner`
   - Find actor: `VehicleSpawner_Police`
   - Verify location: X=0, Y=0, Z=200

5. **Configure Properties (if needed)**
   - Select `VehicleSpawner_Police` in World Outliner
   - In Details panel, verify/set:
     - **Vehicle Class To Spawn:** BP_PoliceVehicle
     - **Initial Police Vehicles:** 25
     - **Max Police Vehicles:** 50
     - **Spawn Radius:** 10000

6. **Set GameMode Override**
   - Menu: `Window > World Settings`
   - Under `Game Mode`:
     - **GameMode Override:** BP_VroomGameMode

7. **Save**
   - `File > Save Current Level` or `Ctrl+S`

---

## Method 2: Manual Placement (FALLBACK)

Use this method if the Python script fails or is unavailable.

### Step 1: Open OpenWorld Map

1. In Content Browser, navigate to: `Content/Maps/`
2. Double-click `OpenWorld.umap` to open
3. Wait for map to fully load

### Step 2: Place BP_VehicleSpawner Actor

1. In Content Browser, navigate to: `Content/Blueprints/Vehicles/`
2. Find `BP_VehicleSpawner` blueprint
3. **Drag and drop** BP_VehicleSpawner into the viewport
4. Place it anywhere initially (we'll set exact location next)

### Step 3: Set Exact Location

1. Select the placed spawner in World Outliner or viewport
2. Press `F` to focus camera on it
3. In **Details Panel**, find **Transform > Location**
4. Set values:
   - **X:** 0.0
   - **Y:** 0.0
   - **Z:** 200.0

### Step 4: Rename Actor

1. With spawner selected, right-click in World Outliner
2. Choose `Rename`
3. Set name to: `VehicleSpawner_Police`

### Step 5: Configure Spawner Properties

In the **Details Panel** for the spawner actor:

1. **Vehicle Class To Spawn**
   - Click dropdown
   - Select: `BP_PoliceVehicle`
   - *This determines what type of vehicle spawns*

2. **Initial Police Vehicles**
   - Set to: `25`
   - *This spawns 25 police vehicles at BeginPlay*

3. **Max Police Vehicles**
   - Set to: `50`
   - *Maximum vehicles that can exist simultaneously*

4. **Spawn Radius**
   - Set to: `10000.0`
   - *Vehicles spawn within 10km radius of spawner*

### Step 6: Set World Settings

1. Open `Window > World Settings`
2. Under **Game Mode** section:
   - **GameMode Override:** Select `BP_VroomGameMode`
   - *This ensures the correct game mode runs in this level*

### Step 7: Save Map

1. `File > Save Current Level` or press `Ctrl+S`
2. Confirm save when prompted

---

## Verification Steps

### Quick Test (2 minutes)

1. **Press Play**
   - Click Play button or press `Alt+P`
   - Game should start at PlayerStart location (center of map)

2. **Look Around**
   - Use mouse to look around
   - You should see police vehicles spawned in the distance

3. **Check Console**
   - Press `~` (tilde key) to open console
   - Type: `showdebug`
   - Look for vehicle count indicators

4. **Stop Play**
   - Press `Escape` to exit PIE (Play In Editor)

### Detailed Verification (5 minutes)

1. **Count Spawn Points**
   - In World Outliner, search: "PoliceSpawn"
   - Should find 25 TargetPoint actors
   - These were created by the OpenWorld level script

2. **Verify Spawner Configuration**
   - Select `VehicleSpawner_Police`
   - Details panel should show:
     - Vehicle Class To Spawn: `BP_PoliceVehicle`
     - Initial Police Vehicles: `25`
     - Max Police Vehicles: `50`
     - Spawn Radius: `10000.0`

3. **Test Spawn Behavior**
   - Press Play
   - Open Output Log: `Window > Developer Tools > Output Log`
   - Look for messages like:
     - "VehicleSpawner: Spawning 25 initial police vehicles"
     - "Spawned police vehicle #1" (repeated 25 times)

4. **Verify GameMode**
   - Open World Settings
   - GameMode Override should be: `BP_VroomGameMode`

---

## Troubleshooting

### Problem: Spawner not visible in viewport

**Solution:**
- Open World Outliner (`Window > Outliner`)
- Search for "VehicleSpawner" or "Spawner"
- Right-click spawner > `Focus Selected` or press `F`

### Problem: No police vehicles spawn when pressing Play

**Possible Causes & Fixes:**

1. **Vehicle Class Not Set**
   - Select spawner
   - Set "Vehicle Class To Spawn" to BP_PoliceVehicle

2. **Initial Vehicles = 0**
   - Check "Initial Police Vehicles" property
   - Must be set to 25

3. **Blueprint Not Compiled**
   - Open BP_VehicleSpawner
   - Click "Compile" button
   - Save and close

4. **GameMode Not Set**
   - Open World Settings
   - Set GameMode Override to BP_VroomGameMode

### Problem: Python script fails

**Error: "Cannot load BP_VehicleSpawner"**
- Verify blueprint exists at: `Content/Blueprints/Vehicles/BP_VehicleSpawner.uasset`
- Try opening blueprint manually in editor first

**Error: "Cannot set property"**
- Python may not have access to Blueprint-specific properties
- Use Manual Method instead

### Problem: Spawner exists but properties won't save

**Solution:**
- Close and reopen Unreal Editor
- Check if BP_VehicleSpawner is checked out (if using source control)
- Verify file permissions on project folder

---

## Technical Details

### BP_VehicleSpawner Properties

| Property Name | Type | Default | Required Value | Purpose |
|--------------|------|---------|----------------|---------|
| Vehicle Class To Spawn | Class Reference | None | BP_PoliceVehicle | The vehicle blueprint to spawn |
| Initial Police Vehicles | Integer | 0 | 25 | Number of vehicles to spawn at BeginPlay |
| Max Police Vehicles | Integer | 10 | 50 | Maximum concurrent vehicles |
| Spawn Radius | Float | 5000.0 | 10000.0 | Spawn distribution radius (cm) |

### Spawn Logic

The BP_VehicleSpawner implements the following behavior:

1. **BeginPlay Event**
   - Spawner initializes when level starts
   - Reads "Initial Police Vehicles" count

2. **Find Spawn Points**
   - Searches level for actors tagged "PoliceSpawn"
   - Uses TargetPoint actors as spawn locations
   - Should find 25 spawn points in OpenWorld map

3. **Spawn Vehicles**
   - For each initial vehicle count:
     - Pick random spawn point within Spawn Radius
     - Spawn instance of Vehicle Class To Spawn
     - Initialize vehicle AI behavior

4. **Runtime Management**
   - Monitors active vehicle count
   - Respawns vehicles if count drops below Initial count
   - Never exceeds Max Police Vehicles limit

### World Settings - GameMode

The GameMode Override ensures:
- BP_VroomGameMode controls game rules
- Player spawns at correct PlayerStart
- Police AI initializes properly
- Game state management functions correctly

---

## File Locations

- **Python Script:** `C:\Users\evan\Documents\GitHub\vroom-vroom\place_vehicle_spawner.py`
- **OpenWorld Map:** `C:\Users\evan\Documents\GitHub\vroom-vroom\Content\Maps\OpenWorld.umap`
- **Spawner Blueprint:** `C:\Users\evan\Documents\GitHub\vroom-vroom\Content\Blueprints\Vehicles\BP_VehicleSpawner.uasset`
- **Police Vehicle:** `C:\Users\evan\Documents\GitHub\vroom-vroom\Content\Blueprints\Vehicles\BP_PoliceVehicle.uasset`
- **GameMode:** `C:\Users\evan\Documents\GitHub\vroom-vroom\Content\Blueprints\Core\BP_VroomGameMode.uasset`

---

## Expected Result

After completing these steps:

1. **Spawner Placed:** BP_VehicleSpawner at (0, 0, 200) in OpenWorld map
2. **Configuration:** Set to spawn 25 BP_PoliceVehicle instances
3. **GameMode:** BP_VroomGameMode set as override
4. **Test Result:** Pressing Play spawns 25 police vehicles across the map
5. **Visual:** Police vehicles visible in distance when game starts

---

## Success Criteria

- [ ] BP_VehicleSpawner placed at exact location (0, 0, 200)
- [ ] Vehicle Class To Spawn = BP_PoliceVehicle
- [ ] Initial Police Vehicles = 25
- [ ] Max Police Vehicles = 50
- [ ] Spawn Radius = 10000
- [ ] GameMode Override = BP_VroomGameMode
- [ ] Map saved successfully
- [ ] Test: 25 police spawn when pressing Play

---

## Time Estimate

- **Python Script Method:** 2-3 minutes
- **Manual Method:** 5-10 minutes
- **Verification:** 2-5 minutes
- **Total:** 7-18 minutes

---

## Next Steps

After spawner placement is verified:

1. Test police AI chase behavior
2. Verify vehicle physics and controls
3. Test arrest mechanic
4. Validate paperwork minigame integration

---

**Document Version:** 1.0
**Date:** 2025-10-12
**Agent:** Agent 6 - Level Integration Specialist
**Status:** READY FOR EXECUTION
