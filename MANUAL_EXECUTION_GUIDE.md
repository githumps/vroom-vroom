# MANUAL EXECUTION GUIDE - MASTER_BUILD_SCRIPT.py

## STATUS: ASSETS ALREADY EXIST
All Blueprint and Map assets have been verified to exist in the project. This guide is provided as a backup for future reference.

---

## 5-STEP MANUAL EXECUTION GUIDE

### STEP 1: LAUNCH UNREAL EDITOR
1. Navigate to: `E:\Epic Games\UE_5.6\Engine\Binaries\Win64\`
2. Double-click `UnrealEditor.exe`
3. Open project: `C:\Users\evan\Documents\GitHub\vroom-vroom\VroomVroom.uproject`
4. Wait for editor to fully load

### STEP 2: ENABLE PYTHON PLUGIN (if not already enabled)
1. Edit > Plugins
2. Search for "Python Editor Script Plugin"
3. Check the "Enabled" box
4. Restart editor if prompted

### STEP 3: OPEN PYTHON SCRIPT EXECUTION WINDOW
1. In Unreal Editor menu bar: Tools > Execute Python Script
2. A small window will open with a text field

### STEP 4: EXECUTE THE MASTER BUILD SCRIPT
1. In the Execute Python Script window, click "Browse" button
2. Navigate to: `C:\Users\evan\Documents\GitHub\vroom-vroom\`
3. Select: `MASTER_BUILD_SCRIPT.py`
4. Click "Execute"
5. Watch the Output Log (Window > Developer Tools > Output Log) for progress

### STEP 5: VERIFY ASSETS CREATED
1. Open Content Browser (Ctrl+Space)
2. Navigate to Content/Blueprints/Core - verify 3 blueprints exist
3. Navigate to Content/Blueprints/Vehicles - verify 3 blueprints exist
4. Navigate to Content/Maps - verify 3 maps exist

---

## ALTERNATIVE METHOD: COMMAND LINE EXECUTION

```batch
"E:\Epic Games\UE_5.6\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "C:\Users\evan\Documents\GitHub\vroom-vroom\VroomVroom.uproject" ^
  -ExecutePythonScript="C:\Users\evan\Documents\GitHub\vroom-vroom\MASTER_BUILD_SCRIPT.py" ^
  -stdout -FullStdOutLogOutput
```

NOTE: Command line execution may fail with NullRHI errors. Use manual GUI method if this occurs.

---

## EXPECTED ASSETS

### Core Blueprints (Content/Blueprints/Core/)
- BP_VroomGameMode.uasset
- BP_VroomCharacter.uasset
- BP_VroomPlayerController.uasset

### Vehicle Blueprints (Content/Blueprints/Vehicles/)
- BP_VehicleBase.uasset
- BP_PoliceVehicle.uasset
- BP_VehicleSpawner.uasset

### UI Widgets (Content/Blueprints/UI/)
- WBP_MainMenu.uasset (existing)
- WBP_HUD.uasset (needs manual creation)
- WBP_PaperworkForm.uasset (needs manual creation)
- WBP_ArrestNotification.uasset (needs manual creation)

### Maps (Content/Maps/)
- OpenWorld.umap (8x8km with 25 police spawn points)
- Courtroom.umap
- MainMenu.umap

---

## TROUBLESHOOTING

### Problem: "Python Editor Script Plugin not found"
**Solution:**
1. Edit > Plugins
2. Enable "Python Editor Script Plugin"
3. Restart editor

### Problem: "Script executes but no assets created"
**Solution:**
1. Check Output Log for errors
2. Verify C++ classes are compiled (VroomVroomGameMode, VehicleBase, etc.)
3. Ensure project is built in Development Editor configuration

### Problem: "Cannot find parent class"
**Solution:**
1. Build the C++ project first in Visual Studio
2. Configuration: Development Editor
3. Platform: Win64
4. Then run the Python script

### Problem: Script hangs or crashes
**Solution:**
1. Close Unreal Editor
2. Delete: `C:\Users\evan\Documents\GitHub\vroom-vroom\Intermediate\`
3. Delete: `C:\Users\evan\Documents\GitHub\vroom-vroom\Saved\`
4. Reopen project (will regenerate intermediate files)
5. Try execution again

---

## VERIFICATION CHECKLIST

- [ ] Unreal Editor launches successfully
- [ ] Python plugin is enabled
- [ ] MASTER_BUILD_SCRIPT.py executes without errors
- [ ] 3 Core Blueprints exist in Content/Blueprints/Core/
- [ ] 3 Vehicle Blueprints exist in Content/Blueprints/Vehicles/
- [ ] 3 Maps exist in Content/Maps/
- [ ] Output Log shows "MASTER BUILD COMPLETE"

---

## NEXT STEPS AFTER SUCCESSFUL EXECUTION

1. Configure Blueprint internals (components, event graphs)
2. Create missing UI widgets (WBP_HUD, WBP_PaperworkForm, WBP_ArrestNotification)
3. Set up input mappings in Project Settings
4. Configure Project Settings (default maps, game mode)
5. Place BP_VehicleSpawner in OpenWorld map
6. Test driving mechanics in Play In Editor (PIE)

---

Generated: 2025-10-12
Project: Vroom Vroom
Unreal Engine: 5.6.1
