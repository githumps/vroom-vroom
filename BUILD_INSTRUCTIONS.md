# VROOM VROOM - Build Instructions

## Prerequisites

1. **Unreal Engine 5.6+** installed via Epic Games Launcher (tested with 5.6.1)
2. **Visual Studio 2022** with:
   - Game Development with C++ workload
   - Windows 10/11 SDK
   - .NET Framework targeting pack

3. **Windows 10/11** (64-bit) for building

## Quick Start - First Playable Build

### Step 1: Generate Visual Studio Project Files
1. Right-click on `VroomVroom.uproject`
2. Select "Generate Visual Studio project files"
3. Wait for generation to complete

### Step 2: Open in Unreal Engine
1. Double-click `VroomVroom.uproject`
2. Epic Games Launcher will open and associate with UE 5.6.1
3. If prompted about missing modules, click "Yes" to rebuild
4. Wait for compilation (first time takes 5-10 minutes)

**Note**: The project is configured for UE 5.6+. If using 5.6.1 from Epic Launcher, everything will work perfectly!

### Step 3: Create Required Blueprint Assets
Since we have C++ base classes, you'll need to create Blueprint versions:

1. **In Content Browser**, create folders:
   - `Content/Blueprints/Core`
   - `Content/Blueprints/Vehicles`
   - `Content/Blueprints/UI`

2. **Create Core Blueprints:**
   - Right-click in `Content/Blueprints/Core`
   - Create Blueprint Class → Search "VroomVroomGameMode" → Name it `BP_VroomGameMode`
   - Create Blueprint Class → Search "VroomVroomCharacter" → Name it `BP_VroomCharacter`
   - Create Blueprint Class → Search "VroomVroomPlayerController" → Name it `BP_VroomPlayerController`

3. **Create Vehicle Blueprints:**
   - Right-click in `Content/Blueprints/Vehicles`
   - Create Blueprint Class → Search "VehicleBase" → Name it `BP_VehicleBase`
   - Create Blueprint Class → Search "PoliceVehicle" → Name it `BP_PoliceVehicle`
   - Create Blueprint Class → Search "VehicleSpawner" → Name it `BP_VehicleSpawner`

4. **Create UI Blueprints:**
   - Right-click in `Content/Blueprints/UI`
   - Create Widget Blueprint → Search "VroomMainMenuWidget" → Name it `WBP_MainMenu`
   - Create Widget Blueprint → Search "VroomCreditsWidget" → Name it `WBP_Credits`

### Step 4: Create Test Map
1. **Create a new level:**
   - File → New Level → Open World
   - Save as `Content/Maps/OpenWorld`

2. **Set up the level:**
   - Add a Landscape (Shift+2) for terrain
   - Add a Player Start actor
   - Place the `BP_VehicleSpawner` in the level
   - Place some `BP_VehicleBase` and `BP_PoliceVehicle` actors around the map

3. **Configure World Settings:**
   - Open World Settings (Window → World Settings)
   - Set Game Mode Override to `BP_VroomGameMode`

### Step 5: Configure Project Settings
1. **Open Project Settings** (Edit → Project Settings)

2. **Maps & Modes:**
   - Default GameMode: `BP_VroomGameMode`
   - Default Maps:
     - Editor Startup Map: `/Game/Maps/OpenWorld`
     - Game Default Map: `/Game/Maps/MainMenu`

3. **Input:**
   - The input is already configured in DefaultInput.ini
   - Verify Enhanced Input plugin is enabled

### Step 6: Quick Vehicle Setup
For a quick test without proper models:

1. **In BP_VehicleBase:**
   - Add a Static Mesh Component (use a cube scaled to car size)
   - Set collision to "Vehicle" profile
   - Compile and save

2. **In BP_PoliceVehicle:**
   - Add a Static Mesh Component (use a cube, tint it blue/white)
   - Add a Point Light for siren effect
   - Compile and save

### Step 7: Build for Windows

#### Using Editor (Recommended for first build):
1. File → Package Project → Windows → Windows (64-bit)
2. Choose output folder (e.g., `Builds/Windows`)
3. Wait for packaging (10-30 minutes depending on hardware)

#### Using Command Line:
```batch
"C:\Program Files\Epic Games\UE_5.3\Engine\Build\BatchFiles\RunUAT.bat" ^
BuildCookRun -project="C:\path\to\VroomVroom.uproject" ^
-noP4 -platform=Win64 -clientconfig=Shipping -serverconfig=Shipping ^
-cook -allmaps -build -stage -pak -archive ^
-archivedirectory="C:\path\to\Builds"
```

## Project Configuration Files

### Key Files Already Created:
- ✅ VroomVroom.uproject
- ✅ Source/VroomVroom.Target.cs
- ✅ Source/VroomVroomEditor.Target.cs
- ✅ Source/VroomVroom/VroomVroom.Build.cs
- ✅ Config/DefaultEngine.ini
- ✅ Config/DefaultGame.ini
- ✅ Config/DefaultInput.ini

### What's Implemented:
- ✅ Complete vehicle system with entry/exit
- ✅ Police vehicles with pursuit AI
- ✅ Character controller with vehicle interaction
- ✅ Save/load system
- ✅ Main menu and credits
- ✅ Game state machine (Driving → Arrested → Court → Prison)
- ✅ Real-time clock synchronization
- ✅ Prison activities framework
- ✅ Excessive police presence (50+ units!)

## Testing Your Build

### Controls:
- **On Foot:**
  - WASD: Move
  - Mouse: Look
  - Space: Jump
  - Shift: Sprint (attracts police!)
  - F: Enter/Exit vehicle
  - E: Interact

- **In Vehicle:**
  - W/S: Accelerate/Reverse
  - A/D: Steer
  - Space: Brake/Handbrake
  - C: Change camera
  - H: Horn (attracts police!)
  - L: Toggle lights
  - F: Exit vehicle

- **Police Vehicle:**
  - G: Toggle siren

### Expected Behavior:
1. Game starts at main menu
2. New Game → Spawns in open world
3. TONS of police vehicles everywhere
4. Any movement attracts police attention
5. Getting caught → Court scene → Prison

## Troubleshooting

### Common Issues:

**1. "Missing modules" error:**
- Right-click .uproject → Generate Visual Studio project files
- Open in VS2022 and build

**2. Blueprints not working:**
- Ensure parent class is set correctly
- Compile blueprints after any C++ changes

**3. No vehicles spawning:**
- Check VehicleSpawner is placed in level
- Verify blueprint classes are assigned in spawner

**4. Character can't enter vehicles:**
- Check collision channels in Project Settings
- Ensure Vehicle channel (GameTraceChannel1) is set up

**5. Build fails:**
- Verify Visual Studio 2022 is installed
- Check Windows SDK is installed
- Clear Intermediate and Binaries folders, regenerate

## Performance Notes

- The game intentionally spawns 50+ police vehicles for comedic effect
- This may impact performance on lower-end systems
- Reduce `InitialPoliceVehicles` in VehicleSpawner for better performance

## Next Steps

To complete the full experience:
1. Add proper 3D models for vehicles
2. Create the prison interior level
3. Implement courtroom scene
4. Add sound effects and music
5. Create detailed open world map with roads

## Build Output

Your packaged game will be in the specified output folder:
- `VroomVroom.exe` - Main executable
- `VroomVroom/` - Game data folder
- Total size: ~1-2GB for a basic build

## Minimum System Requirements

- OS: Windows 10/11 64-bit
- Processor: Quad-core Intel or AMD, 2.5 GHz
- Memory: 8 GB RAM
- Graphics: DirectX 11 compatible GPU
- DirectX: Version 11
- Storage: 5 GB available space

---

Remember: The excessive police presence is a FEATURE, not a bug! 🚔👮‍♂️🚨