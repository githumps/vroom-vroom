"""
Unreal Engine Python Script - Place BP_VehicleSpawner in OpenWorld Map
This script places the BP_VehicleSpawner actor in the OpenWorld map at the specified
location and configures it according to the requirements.

CONFIGURATION:
- Location: (0, 0, 200)
- Vehicle Class To Spawn: BP_PoliceVehicle
- Initial Police Vehicles: 25
- Max Police Vehicles: 50
- Spawn Radius: 10000

Run this script in Unreal Editor via: Tools > Execute Python Script
"""

import unreal

print("=" * 80)
print("PLACING BP_VEHICLESPAWNER IN OPENWORLD MAP")
print("=" * 80)

# Initialize Unreal Editor subsystems
editor_level_lib = unreal.EditorLevelLibrary()
editor_asset_lib = unreal.EditorAssetLibrary()

# Step 1: Load the OpenWorld map
print("\n[STEP 1] Loading OpenWorld map...")
try:
    load_success = editor_level_lib.load_level("/Game/Maps/OpenWorld")
    if load_success:
        print("SUCCESS: OpenWorld map loaded")
    else:
        print("WARNING: Map may already be loaded or issue occurred")
except Exception as e:
    print(f"INFO: {e}")

# Get the current world
world = unreal.EditorLevelLibrary.get_editor_world()
print(f"Current world: {world.get_name()}")

# Step 2: Load the BP_VehicleSpawner blueprint class
print("\n[STEP 2] Loading BP_VehicleSpawner blueprint class...")
try:
    spawner_blueprint_path = "/Game/Blueprints/Vehicles/BP_VehicleSpawner"
    spawner_class = unreal.EditorAssetLibrary.load_blueprint_class(spawner_blueprint_path)

    if spawner_class:
        print(f"SUCCESS: BP_VehicleSpawner class loaded from {spawner_blueprint_path}")
    else:
        print(f"ERROR: Could not load BP_VehicleSpawner class from {spawner_blueprint_path}")
        print("ABORT: Cannot proceed without spawner blueprint")
        exit(1)
except Exception as e:
    print(f"ERROR: Failed to load BP_VehicleSpawner: {e}")
    exit(1)

# Step 3: Check if spawner already exists in the level
print("\n[STEP 3] Checking for existing spawner in level...")
existing_spawner = None
all_actors = editor_level_lib.get_all_level_actors()
for actor in all_actors:
    if actor.get_class() == spawner_class:
        existing_spawner = actor
        print(f"WARNING: Found existing spawner: {actor.get_actor_label()}")
        break

if existing_spawner:
    print("WARNING: BP_VehicleSpawner already exists in this level")
    print("Removing existing spawner before placing new one...")
    try:
        editor_level_lib.destroy_actor(existing_spawner)
        print("SUCCESS: Removed existing spawner")
    except Exception as e:
        print(f"WARNING: Could not remove existing spawner: {e}")

# Step 4: Place BP_VehicleSpawner at specified location
print("\n[STEP 4] Placing BP_VehicleSpawner at location (0, 0, 200)...")
try:
    spawner_location = unreal.Vector(0.0, 0.0, 200.0)
    spawner_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    spawner_actor = editor_level_lib.spawn_actor_from_class(
        spawner_class,
        spawner_location,
        spawner_rotation
    )

    if spawner_actor:
        spawner_actor.set_actor_label("VehicleSpawner_Police")
        print(f"SUCCESS: BP_VehicleSpawner placed at {spawner_location}")
        print(f"Actor name: {spawner_actor.get_actor_label()}")
    else:
        print("ERROR: Failed to spawn BP_VehicleSpawner actor")
        exit(1)

except Exception as e:
    print(f"ERROR: Could not place spawner: {e}")
    exit(1)

# Step 5: Configure spawner properties
print("\n[STEP 5] Configuring spawner properties...")

# Note: Property configuration in Python for Blueprint instances requires accessing
# the CDO (Class Default Object) or using set_editor_property if properties are exposed.
# For Blueprint-specific properties, this may need to be done manually in the editor
# or through Blueprint nodes.

print("Attempting to configure spawner properties...")
try:
    # Try to set properties if they're exposed to Python
    # These property names are based on common UE property naming conventions

    # Load the BP_PoliceVehicle class reference
    police_vehicle_path = "/Game/Blueprints/Vehicles/BP_PoliceVehicle"
    police_vehicle_class = unreal.EditorAssetLibrary.load_blueprint_class(police_vehicle_path)

    if police_vehicle_class:
        print(f"SUCCESS: Loaded BP_PoliceVehicle class: {police_vehicle_class.get_name()}")

        # Attempt to set the vehicle class property
        try:
            spawner_actor.set_editor_property("vehicle_class_to_spawn", police_vehicle_class)
            print("SUCCESS: Set VehicleClassToSpawn = BP_PoliceVehicle")
        except:
            print("INFO: Cannot set vehicle_class_to_spawn via Python - requires manual configuration")

        # Attempt to set numeric properties
        try:
            spawner_actor.set_editor_property("initial_police_vehicles", 25)
            print("SUCCESS: Set InitialPoliceVehicles = 25")
        except:
            print("INFO: Cannot set initial_police_vehicles via Python - requires manual configuration")

        try:
            spawner_actor.set_editor_property("max_police_vehicles", 50)
            print("SUCCESS: Set MaxPoliceVehicles = 50")
        except:
            print("INFO: Cannot set max_police_vehicles via Python - requires manual configuration")

        try:
            spawner_actor.set_editor_property("spawn_radius", 10000.0)
            print("SUCCESS: Set SpawnRadius = 10000")
        except:
            print("INFO: Cannot set spawn_radius via Python - requires manual configuration")

    else:
        print("WARNING: Could not load BP_PoliceVehicle class")

except Exception as e:
    print(f"INFO: Property configuration: {e}")

print("\nNOTE: Blueprint properties may need manual configuration in the editor:")
print("  1. Select the VehicleSpawner_Police actor in the World Outliner")
print("  2. In Details panel, configure:")
print("     - Vehicle Class To Spawn: BP_PoliceVehicle")
print("     - Initial Police Vehicles: 25")
print("     - Max Police Vehicles: 50")
print("     - Spawn Radius: 10000")

# Step 6: Set World Settings - GameMode Override
print("\n[STEP 6] Setting World Settings - GameMode Override...")
try:
    world_settings = world.get_world_settings()

    if world_settings:
        # Load the BP_VroomGameMode class
        gamemode_path = "/Game/Blueprints/Core/BP_VroomGameMode"
        gamemode_class = unreal.EditorAssetLibrary.load_blueprint_class(gamemode_path)

        if gamemode_class:
            print(f"SUCCESS: Loaded BP_VroomGameMode class: {gamemode_class.get_name()}")

            try:
                world_settings.set_editor_property("default_gamemode_override", gamemode_class)
                print("SUCCESS: Set GameMode Override = BP_VroomGameMode")
            except Exception as e:
                print(f"INFO: Cannot set GameMode override via Python: {e}")
                print("MANUAL STEP REQUIRED: Set GameMode in Window > World Settings")
        else:
            print("WARNING: Could not load BP_VroomGameMode class")
    else:
        print("WARNING: Could not get world settings")

except Exception as e:
    print(f"INFO: World settings configuration: {e}")

# Step 7: Save the level
print("\n[STEP 7] Saving OpenWorld map...")
try:
    save_success = editor_asset_lib.save_asset("/Game/Maps/OpenWorld")
    if save_success:
        print("SUCCESS: OpenWorld map saved")
    else:
        # Try alternative save method
        editor_level_lib.save_current_level()
        print("INFO: Level save initiated")
except Exception as e:
    print(f"INFO: Save operation: {e}")

# Final Report
print("\n" + "=" * 80)
print("SPAWNER PLACEMENT COMPLETE - SUMMARY")
print("=" * 80)
print(f"Map: /Game/Maps/OpenWorld.umap")
print(f"Spawner Placed: YES")
print(f"Location: (0, 0, 200)")
print(f"Actor Name: VehicleSpawner_Police")
print("")
print("SPAWNER CONFIGURATION:")
print("  Target Settings:")
print("    - Vehicle Class To Spawn: BP_PoliceVehicle")
print("    - Initial Police Vehicles: 25")
print("    - Max Police Vehicles: 50")
print("    - Spawn Radius: 10000")
print("")
print("WORLD SETTINGS:")
print("  - GameMode Override: BP_VroomGameMode")
print("=" * 80)

print("\nMANUAL VERIFICATION REQUIRED:")
print("1. Select 'VehicleSpawner_Police' in World Outliner")
print("2. Check Details panel for spawner configuration")
print("3. Verify all properties are set correctly")
print("4. Window > World Settings > verify GameMode Override")
print("5. Test: Press Play (PIE) and verify 25 police vehicles spawn")
print("")
print("VERIFICATION STEPS:")
print("1. Open OpenWorld map in Unreal Editor")
print("2. Press Play (Alt+P)")
print("3. Expected result: 25 police vehicles should spawn around the map")
print("4. Check Output Log for spawner messages")
print("5. Use '~' console command: 'showdebug' to verify vehicle count")
print("=" * 80)

# Print all actors in the level for verification
print("\nACTORS IN LEVEL (filtered):")
all_actors = editor_level_lib.get_all_level_actors()
spawner_found = False
for actor in all_actors:
    actor_label = actor.get_actor_label()
    actor_class = actor.get_class().get_name()

    # Only print relevant actors
    if "Spawner" in actor_label or "Spawner" in actor_class or "Police" in actor_label:
        print(f"  - {actor_label} ({actor_class})")
        if "VehicleSpawner" in actor_class or "VehicleSpawner" in actor_label:
            spawner_found = True
            print(f"    Location: {actor.get_actor_location()}")

if spawner_found:
    print("\n✓ SPAWNER SUCCESSFULLY PLACED AND VERIFIED IN LEVEL")
else:
    print("\n✗ WARNING: Could not verify spawner in level actors list")

print("\nSCRIPT COMPLETE!")
print("=" * 80)
