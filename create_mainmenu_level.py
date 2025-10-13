"""
Unreal Engine Python Script - Create Main Menu Level
This script creates the main menu scene.
"""

import unreal

editor_level_lib = unreal.EditorLevelLibrary()
editor_asset_lib = unreal.EditorAssetLibrary()

print("=" * 80)
print("CREATING MAIN MENU LEVEL - VROOM VROOM")
print("=" * 80)

# Step 1: Create new level
print("\n[STEP 1] Creating MainMenu level...")
try:
    new_level = editor_level_lib.new_level("/Game/Maps/MainMenu")
    print("SUCCESS: MainMenu level created")
except Exception as e:
    print(f"INFO: {e}")

world = unreal.EditorLevelLibrary.get_editor_world()

# Step 2: Add Basic Lighting
print("\n[STEP 2] Adding lighting...")
try:
    light_location = unreal.Vector(0.0, 0.0, 500.0)
    light_rotation = unreal.Rotator(-45.0, 0.0, 0.0)

    directional_light = editor_level_lib.spawn_actor_from_class(
        unreal.DirectionalLight,
        light_location,
        light_rotation
    )

    if directional_light:
        directional_light.set_actor_label("MainMenu_Light")
        print("SUCCESS: Directional light created")
except Exception as e:
    print(f"WARNING: Lighting: {e}")

# Step 3: Add Sky Light for ambient
try:
    skylight_location = unreal.Vector(0.0, 0.0, 0.0)
    skylight_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    sky_light = editor_level_lib.spawn_actor_from_class(
        unreal.SkyLight,
        skylight_location,
        skylight_rotation
    )

    if sky_light:
        sky_light.set_actor_label("MainMenu_SkyLight")
        print("SUCCESS: Sky light created")
except Exception as e:
    print(f"WARNING: Sky light: {e}")

# Step 4: Add Player Start
print("\n[STEP 3] Adding PlayerStart...")
try:
    player_start_location = unreal.Vector(0.0, 0.0, 100.0)
    player_start_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    player_start = editor_level_lib.spawn_actor_from_class(
        unreal.PlayerStart,
        player_start_location,
        player_start_rotation
    )

    if player_start:
        player_start.set_actor_label("MainMenu_PlayerStart")
        print("SUCCESS: PlayerStart created")
except Exception as e:
    print(f"WARNING: PlayerStart: {e}")

# Step 5: Add a simple background (optional decorative floor)
print("\n[STEP 4] Adding decorative background...")
try:
    floor_location = unreal.Vector(0.0, 0.0, 0.0)
    floor_rotation = unreal.Rotator(0.0, 0.0, 0.0)
    floor_scale = unreal.Vector(10.0, 10.0, 0.1)

    floor_actor = editor_level_lib.spawn_actor_from_class(
        unreal.StaticMeshActor,
        floor_location,
        floor_rotation
    )

    if floor_actor:
        floor_actor.set_actor_label("MainMenu_Background")
        floor_actor.set_actor_scale3d(floor_scale)
        mesh_component = floor_actor.static_mesh_component
        if mesh_component:
            cube_mesh = unreal.load_asset("/Engine/BasicShapes/Cube")
            if cube_mesh:
                mesh_component.set_static_mesh(cube_mesh)
        print("SUCCESS: Background created")
except Exception as e:
    print(f"INFO: Background: {e}")

# Step 6: Save the level
print("\n[STEP 5] Saving MainMenu level...")
try:
    editor_asset_lib.save_asset("/Game/Maps/MainMenu")
    print("SUCCESS: MainMenu level saved")
except Exception as e:
    print(f"INFO: {e}")
    editor_level_lib.save_current_level()

# Final Report
print("\n" + "=" * 80)
print("MAIN MENU LEVEL COMPLETE")
print("=" * 80)
print("Level: /Game/Maps/MainMenu.umap")
print("Features:")
print("  - Basic lighting")
print("  - PlayerStart")
print("  - Simple background")
print("\nNext Steps:")
print("  1. Create BP_MainMenuManager blueprint")
print("  2. Place it in this level")
print("  3. Configure it to show WBP_MainMenu widget")
print("  4. Set this as Game Default Map in Project Settings")
print("=" * 80)
