# 🚗 VROOM VROOM 🚔

*A Definitely Normal Driving Simulator™*

## About

Welcome to Vroom Vroom, a driving simulator where the police presence is so absurdly high that getting arrested is not just likely—it's inevitable. What starts as a simple drive quickly escalates into arrests, courtroom paperwork, and an incredibly detailed prison simulation.

### Key Features

- 🚔 **EXCESSIVE POLICE PRESENCE**: 50+ police units active at all times
- 🚗 **Open World Driving**: Drive freely... for about 3 minutes
- 👮 **Instant Police Response**: They're EVERYWHERE
- ⚖️ **Detailed Courtroom System**: Fill out ALL the paperwork
- 🔒 **Prison Simulator**:
  - Read books page by page
  - Exercise with actual reps
  - Eat meals one spoonful at a time
  - Prison tattoo designer
  - Cigarette economy
  - Gang relationships
- 🕐 **Real-Time Clock**: Sentences count down in real-world days
- 💾 **Offline Progression**: Things happen while you're away

## Current Implementation Status

### ✅ Completed
- Complete UE5 C++ project structure
- Vehicle system with entry/exit mechanics
- Police vehicles with pursuit AI
- Character controller with full state machine
- Save/load system with profile persistence
- Main menu and credits UI
- Game state transitions (Driving → Arrested → Court → Prison → Released)
- Real-time clock synchronization
- Prison activity framework
- Vehicle spawning system

### 🚧 Requires Blueprint/Asset Setup
- 3D models for vehicles
- Level design (roads, buildings)
- UI widget layouts
- Sound effects and music
- Prison interior environment
- Courtroom environment

## Quick Start

### Prerequisites
- Windows 10/11 (64-bit)
- Unreal Engine 5.3+
- Visual Studio 2022 with C++ Game Development
- 10GB free disk space

### Building the Game

#### Option 1: Using Unreal Editor (Recommended)
1. Open `VroomVroom.uproject` in Unreal Engine 5.3+
2. When prompted about missing modules, click "Yes" to rebuild
3. Follow the Blueprint setup in `BUILD_INSTRUCTIONS.md`
4. File → Package Project → Windows → Windows (64-bit)

#### Option 2: Using Build Script
1. Edit `BuildGame.bat` to set your Unreal Engine path
2. Run `BuildGame.bat`
3. Find your build in `Builds/Windows/`

### First-Time Setup
See `BUILD_INSTRUCTIONS.md` for detailed step-by-step instructions on:
- Creating required Blueprint classes
- Setting up a test level
- Configuring project settings

## Controls

### On Foot
- **WASD** - Move
- **Mouse** - Look around
- **Space** - Jump
- **Shift** - Sprint (WARNING: Attracts police!)
- **F** - Enter/Exit vehicle
- **E** - Interact

### Driving
- **W/S** - Accelerate/Reverse
- **A/D** - Steer
- **Space** - Brake
- **C** - Change camera view
- **H** - Horn (WARNING: Attracts police!)
- **L** - Toggle lights
- **F** - Exit vehicle

### Police Vehicle
- **G** - Toggle siren

## Game Flow

1. **Start** → Main Menu
2. **New Game** → Spawn in open world with 50+ police units
3. **Drive** → Get spotted immediately
4. **Chase** → Multiple units join pursuit
5. **Arrest** → Caught within minutes
6. **Court** → Fill out excessive paperwork
7. **Prison** → Serve real-time sentence
8. **Release** → Back to driving (and immediate re-arrest)

## Project Structure

```
vroom-vroom/
├── Source/               # C++ source code
│   └── VroomVroom/
│       ├── Public/      # Header files
│       └── Private/     # Implementation files
├── Config/              # Game configuration
├── Content/             # Game assets (create in editor)
│   ├── Blueprints/     # Blueprint classes
│   ├── Maps/           # Levels
│   └── UI/             # UI widgets
└── Builds/             # Packaged builds
```

## Code Architecture

- **GameInstance**: Manages persistent game state and profile
- **GameMode**: Controls game rules and police spawning
- **Character**: First-person controller with vehicle interaction
- **VehicleBase**: Base vehicle implementation
- **PoliceVehicle**: AI-controlled pursuit vehicles
- **SaveGame**: Profile persistence and offline progression

## Performance Notes

The game intentionally spawns an excessive number of police vehicles. This is a feature, not a bug. If you experience performance issues:
- Reduce `InitialPoliceVehicles` in the VehicleSpawner
- Lower graphics settings
- Remember: The lag adds to the oppressive atmosphere!

## Known "Features"

- Police spawn constantly, even when arrested
- Judge gets more irritated with each arrest
- Prison sentences are served in real-time
- You can't escape (they always catch you)
- Honking attracts police attention
- Standing still is suspicious
- Breathing is a traffic violation

## Development

This project is built with:
- Unreal Engine 5.3
- C++ for core gameplay
- Blueprints for visual scripting
- Real-time clock synchronization
- Persistent save system

## License

This game is a work of satire. Any resemblance to actual police density in any real location is purely coincidental and probably impossible.

## Credits

Created by someone who thought "What if GTA, but you can't win?"

Special thanks to:
- Every police officer (all 50+ per square mile)
- The judge who keeps seeing you
- Your cellmate (sorry about the snoring)
- Public domain book authors

---

**Remember**: The excessive police presence is intentional. This is not a bug. This is the entire point. You WILL be arrested. Repeatedly. Forever. Enjoy! 🚔👮‍♂️🚨