"""
Unreal Engine Python Script - Create ALL Game Blueprints for Vroom Vroom
This script automates the creation of ALL required blueprints for the game.
Run this in Unreal Engine Editor via: Tools > Execute Python Script
"""

import unreal
import sys

# Initialize Unreal Editor subsystems
editor_util = unreal.EditorAssetLibrary()
blueprint_lib = unreal.EditorAssetLibrary()

print("=" * 80)
print("CREATING ALL VROOM VROOM BLUEPRINTS")
print("=" * 80)

# Helper function to create a Blueprint from C++ parent class
def create_blueprint(asset_path, parent_class_name, friendly_name):
    """
    Creates a Blueprint asset from a C++ parent class.

    Args:
        asset_path: Full asset path like "/Game/Blueprints/Core/BP_VroomGameMode"
        parent_class_name: C++ class name like "VroomVroomGameMode"
        friendly_name: Display name for logging

    Returns:
        True if successful, False otherwise
    """
    try:
        # Check if asset already exists
        if editor_util.does_asset_exist(asset_path):
            print(f"  EXISTS: {friendly_name} already exists at {asset_path}")
            return True

        # Find the parent C++ class
        parent_class = unreal.load_class(None, f"/Script/VroomVroom.{parent_class_name}")

        if not parent_class:
            print(f"  ERROR: Could not find C++ parent class: {parent_class_name}")
            return False

        # Create Blueprint asset factory
        factory = unreal.BlueprintFactory()
        factory.set_editor_property("ParentClass", parent_class)

        # Create the asset
        asset = editor_util.duplicate_asset(asset_path, asset_path)

        if not asset:
            # Try alternative method: create new asset
            asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
            asset = asset_tools.create_asset(
                asset_name=asset_path.split('/')[-1],
                package_path='/'.join(asset_path.split('/')[:-1]),
                asset_class=unreal.Blueprint,
                factory=factory
            )

        if asset:
            print(f"  SUCCESS: Created {friendly_name} at {asset_path}")
            editor_util.save_asset(asset_path)
            return True
        else:
            print(f"  WARNING: Could not create {friendly_name}")
            return False

    except Exception as e:
        print(f"  ERROR creating {friendly_name}: {e}")
        return False

# =============================================================================
# STEP 1: CREATE CORE BLUEPRINTS
# =============================================================================
print("\n[STEP 1] Creating Core Blueprints...")
print("-" * 80)

core_blueprints = [
    ("/Game/Blueprints/Core/BP_VroomGameMode", "VroomVroomGameMode", "Game Mode"),
    ("/Game/Blueprints/Core/BP_VroomCharacter", "VroomVroomCharacter", "Character"),
    ("/Game/Blueprints/Core/BP_VroomPlayerController", "VroomVroomPlayerController", "Player Controller"),
]

core_success = 0
for asset_path, class_name, friendly_name in core_blueprints:
    if create_blueprint(asset_path, class_name, friendly_name):
        core_success += 1

print(f"\nCore Blueprints: {core_success}/{len(core_blueprints)} created")

# =============================================================================
# STEP 2: CREATE VEHICLE BLUEPRINTS
# =============================================================================
print("\n[STEP 2] Creating Vehicle Blueprints...")
print("-" * 80)

vehicle_blueprints = [
    ("/Game/Blueprints/Vehicles/BP_VehicleBase", "VehicleBase", "Base Vehicle"),
    ("/Game/Blueprints/Vehicles/BP_PoliceVehicle", "PoliceVehicle", "Police Vehicle"),
    ("/Game/Blueprints/Vehicles/BP_VehicleSpawner", "VehicleSpawner", "Vehicle Spawner"),
]

vehicle_success = 0
for asset_path, class_name, friendly_name in vehicle_blueprints:
    if create_blueprint(asset_path, class_name, friendly_name):
        vehicle_success += 1

print(f"\nVehicle Blueprints: {vehicle_success}/{len(vehicle_blueprints)} created")

# =============================================================================
# STEP 3: CREATE UI WIDGETS (if not exist)
# =============================================================================
print("\n[STEP 3] Checking UI Widgets...")
print("-" * 80)

# Widget creation requires different approach - check if they exist
ui_widgets = [
    "/Game/Blueprints/UI/WBP_MainMenu",
    "/Game/Blueprints/UI/WBP_HUD",
    "/Game/Blueprints/UI/WBP_PaperworkForm",
    "/Game/Blueprints/UI/WBP_ArrestNotification",
]

widget_count = 0
for widget_path in ui_widgets:
    if editor_util.does_asset_exist(widget_path):
        print(f"  EXISTS: {widget_path.split('/')[-1]}")
        widget_count += 1
    else:
        print(f"  MISSING: {widget_path.split('/')[-1]} (needs manual creation in UMG)")

print(f"\nUI Widgets: {widget_count}/{len(ui_widgets)} exist")

# =============================================================================
# STEP 4: CONFIGURE BLUEPRINT DEFAULTS
# =============================================================================
print("\n[STEP 4] Configuring Blueprint Default Values...")
print("-" * 80)

try:
    # Configure BP_VehicleSpawner defaults
    spawner_path = "/Game/Blueprints/Vehicles/BP_VehicleSpawner"
    if editor_util.does_asset_exist(spawner_path):
        spawner_asset = editor_util.load_asset(spawner_path)
        if spawner_asset:
            # Get the Blueprint's default object
            bp_gen_class = spawner_asset.generated_class()
            if bp_gen_class:
                cdo = unreal.get_default_object(bp_gen_class)
                if cdo:
                    # Try to set properties
                    try:
                        cdo.set_editor_property("InitialPoliceVehicles", 25)
                        cdo.set_editor_property("MaxPoliceVehicles", 50)
                        cdo.set_editor_property("SpawnRadius", 10000.0)
                        print("  SUCCESS: Configured BP_VehicleSpawner defaults")
                    except:
                        print("  INFO: Could not set spawner properties (may need manual setup)")
except Exception as e:
    print(f"  INFO: Blueprint configuration: {e}")

# =============================================================================
# FINAL REPORT
# =============================================================================
print("\n" + "=" * 80)
print("BLUEPRINT CREATION COMPLETE - SUMMARY")
print("=" * 80)

total_created = core_success + vehicle_success
total_expected = len(core_blueprints) + len(vehicle_blueprints)

print(f"\nBlueprints Created: {total_created}/{total_expected}")
print(f"  - Core Blueprints: {core_success}/{len(core_blueprints)}")
print(f"  - Vehicle Blueprints: {vehicle_success}/{len(vehicle_blueprints)}")
print(f"  - UI Widgets: {widget_count}/{len(ui_widgets)} (exist)")

print("\n" + "=" * 80)
print("NEXT STEPS:")
print("=" * 80)
print("1. Open each Blueprint and add visual components (meshes, cameras)")
print("2. Configure vehicle physics and input in BP_VehicleBase")
print("3. Set up police AI logic in BP_PoliceVehicle")
print("4. Create missing UI widgets (WBP_HUD, WBP_PaperworkForm, etc.)")
print("5. Run 'create_openworld_level.py' to create the game map")
print("6. Configure Project Settings > Input (Xbox controller mappings)")
print("7. Test in PIE (Play In Editor)")
print("=" * 80)

# List all created blueprints for verification
print("\nCREATED BLUEPRINT ASSETS:")
all_blueprints = [
    *[bp[0] for bp in core_blueprints],
    *[bp[0] for bp in vehicle_blueprints],
]

for bp_path in all_blueprints:
    if editor_util.does_asset_exist(bp_path):
        asset = editor_util.load_asset(bp_path)
        if asset:
            print(f"  ✓ {bp_path}")
        else:
            print(f"  ? {bp_path} (exists but could not load)")
    else:
        print(f"  ✗ {bp_path} (NOT FOUND)")

print("\nSCRIPT COMPLETE!")
print("You can now open these Blueprints in the Content Browser and configure them.")
print("=" * 80)
