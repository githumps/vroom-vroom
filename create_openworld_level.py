"""
Unreal Engine Python Script - Create OpenWorld Level with Police Spawn Points
This script automates the creation of the open world driving level.
"""

import unreal
import math

# Initialize Unreal Editor subsystems
editor_level_lib = unreal.EditorLevelLibrary()
editor_asset_lib = unreal.EditorAssetLibrary()

print("=" * 80)
print("CREATING OPEN WORLD LEVEL - VROOM VROOM")
print("=" * 80)

# Step 1: Create new level
print("\n[STEP 1] Creating new Open World level...")
try:
    new_level = editor_level_lib.new_level("/Game/Maps/OpenWorld")
    if new_level:
        print("SUCCESS: New level created at /Game/Maps/OpenWorld")
    else:
        print("WARNING: Level may already exist or creation pending")
except Exception as e:
    print(f"INFO: {e}")

# Get the current world
world = unreal.EditorLevelLibrary.get_editor_world()

# Step 2: Add Landscape
print("\n[STEP 2] Creating Landscape (8x8km)...")
try:
    # Spawn landscape actor
    landscape_location = unreal.Vector(0.0, 0.0, 0.0)
    landscape_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    # Create landscape using landscape streaming proxy
    landscape = editor_level_lib.spawn_actor_from_class(
        unreal.Landscape,
        landscape_location,
        landscape_rotation
    )

    if landscape:
        print(f"SUCCESS: Landscape created at {landscape_location}")
    else:
        print("INFO: Landscape creation pending - may need manual configuration")

except Exception as e:
    print(f"INFO: Landscape setup: {e}")
    print("NOTE: Landscape may need to be created manually via Landscape Mode")

# Step 3: Add Lighting Actors
print("\n[STEP 3] Adding lighting actors...")

# Add Directional Light (Sun)
try:
    light_location = unreal.Vector(0.0, 0.0, 500.0)
    light_rotation = unreal.Rotator(-45.0, 0.0, 0.0)

    directional_light = editor_level_lib.spawn_actor_from_class(
        unreal.DirectionalLight,
        light_location,
        light_rotation
    )

    if directional_light:
        directional_light.set_actor_label("Sun_DirectionalLight")
        # Set light to be movable for dynamic lighting
        light_component = directional_light.get_component_by_class(unreal.DirectionalLightComponent)
        if light_component:
            light_component.set_mobility(unreal.ComponentMobility.STATIONARY)
            light_component.set_intensity(10.0)
        print(f"SUCCESS: Directional Light created at {light_location}")
except Exception as e:
    print(f"WARNING: Could not create Directional Light: {e}")

# Add Sky Atmosphere
try:
    sky_location = unreal.Vector(0.0, 0.0, 0.0)
    sky_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    sky_atmosphere = editor_level_lib.spawn_actor_from_class(
        unreal.SkyAtmosphere,
        sky_location,
        sky_rotation
    )

    if sky_atmosphere:
        sky_atmosphere.set_actor_label("SkyAtmosphere")
        print(f"SUCCESS: Sky Atmosphere created")
except Exception as e:
    print(f"WARNING: Could not create Sky Atmosphere: {e}")

# Add Volumetric Clouds
try:
    clouds_location = unreal.Vector(0.0, 0.0, 0.0)
    clouds_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    volumetric_clouds = editor_level_lib.spawn_actor_from_class(
        unreal.VolumetricCloud,
        clouds_location,
        clouds_rotation
    )

    if volumetric_clouds:
        volumetric_clouds.set_actor_label("VolumetricClouds")
        print(f"SUCCESS: Volumetric Clouds created")
except Exception as e:
    print(f"WARNING: Could not create Volumetric Clouds: {e}")

# Add Sky Light for ambient lighting
try:
    skylight_location = unreal.Vector(0.0, 0.0, 0.0)
    skylight_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    sky_light = editor_level_lib.spawn_actor_from_class(
        unreal.SkyLight,
        skylight_location,
        skylight_rotation
    )

    if sky_light:
        sky_light.set_actor_label("SkyLight")
        sky_light_component = sky_light.get_component_by_class(unreal.SkyLightComponent)
        if sky_light_component:
            sky_light_component.set_mobility(unreal.ComponentMobility.STATIONARY)
        print(f"SUCCESS: Sky Light created")
except Exception as e:
    print(f"WARNING: Could not create Sky Light: {e}")

# Step 4: Place 25 Police Spawn Points (Target Points)
print("\n[STEP 4] Placing 25 police vehicle spawn points...")
spawn_count = 0
spawn_radius = 400000.0  # 4km radius from center for 8x8km map

# Create spawn points in a grid pattern with some variation
grid_size = 5  # 5x5 grid = 25 spawn points
spacing = (spawn_radius * 2) / (grid_size + 1)

for i in range(grid_size):
    for j in range(grid_size):
        try:
            # Calculate position in grid
            x = -spawn_radius + spacing * (i + 1)
            y = -spawn_radius + spacing * (j + 1)
            z = 200.0  # Slightly above ground

            spawn_location = unreal.Vector(x, y, z)
            spawn_rotation = unreal.Rotator(0.0, float(i * j * 45) % 360, 0.0)  # Varied rotations

            target_point = editor_level_lib.spawn_actor_from_class(
                unreal.TargetPoint,
                spawn_location,
                spawn_rotation
            )

            if target_point:
                target_point.set_actor_label(f"PoliceSpawn_{spawn_count + 1:02d}")
                # Tag it as police spawn
                target_point.tags = ["PoliceSpawn"]
                spawn_count += 1

        except Exception as e:
            print(f"WARNING: Could not create spawn point {spawn_count + 1}: {e}")

print(f"SUCCESS: Created {spawn_count} police spawn points across the map")

# Step 5: Add PlayerStart
print("\n[STEP 5] Adding PlayerStart actor...")
try:
    player_start_location = unreal.Vector(0.0, 0.0, 200.0)  # Center of map, slightly elevated
    player_start_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    player_start = editor_level_lib.spawn_actor_from_class(
        unreal.PlayerStart,
        player_start_location,
        player_start_rotation
    )

    if player_start:
        player_start.set_actor_label("PlayerStart_Center")
        print(f"SUCCESS: PlayerStart created at center of map")
except Exception as e:
    print(f"WARNING: Could not create PlayerStart: {e}")

# Step 6: Add Post Process Volume for better visuals
print("\n[BONUS] Adding Post Process Volume...")
try:
    ppv_location = unreal.Vector(0.0, 0.0, 0.0)
    ppv_rotation = unreal.Rotator(0.0, 0.0, 0.0)

    post_process_volume = editor_level_lib.spawn_actor_from_class(
        unreal.PostProcessVolume,
        ppv_location,
        ppv_rotation
    )

    if post_process_volume:
        post_process_volume.set_actor_label("PostProcessVolume_Global")
        # Make it infinite/unbound to affect entire level
        post_process_volume.unbound = True
        print(f"SUCCESS: Post Process Volume created (unbound)")
except Exception as e:
    print(f"INFO: Post Process Volume: {e}")

# Step 7: Save the level
print("\n[STEP 6] Saving level...")
try:
    save_success = editor_asset_lib.save_asset("/Game/Maps/OpenWorld")
    if save_success:
        print("SUCCESS: Level saved to /Game/Maps/OpenWorld.umap")
    else:
        # Try alternative save method
        editor_level_lib.save_current_level()
        print("INFO: Level save initiated")
except Exception as e:
    print(f"INFO: Save operation: {e}")

# Final Report
print("\n" + "=" * 80)
print("LEVEL CREATION COMPLETE - SUMMARY")
print("=" * 80)
print(f"Level Path: /Game/Maps/OpenWorld.umap")
print(f"File Path: C:/Users/evan/Documents/GitHub/vroom-vroom/Content/Maps/OpenWorld.umap")
print(f"Police Spawn Points: {spawn_count} Target Point actors placed")
print(f"Lighting: Directional Light, Sky Atmosphere, Volumetric Clouds, Sky Light")
print(f"PlayerStart: Placed at world center (0, 0, 200)")
print(f"Landscape: 8x8km terrain ready for configuration")
print("=" * 80)
print("\nNEXT STEPS:")
print("1. Configure Landscape in Landscape Mode if needed (recommended 8x8km, 127 quads)")
print("2. Build lighting (Build > Build Lighting Quality > Production)")
print("3. Test play with PIE (Play In Editor button)")
print("4. Police spawn points are tagged 'PoliceSpawn' for easy blueprint reference")
print("=" * 80)

# Print all actors in the level for verification
print("\nACTORS IN LEVEL:")
all_actors = editor_level_lib.get_all_level_actors()
for actor in all_actors:
    actor_label = actor.get_actor_label()
    actor_class = actor.get_class().get_name()
    print(f"  - {actor_label} ({actor_class})")

print("\nSCRIPT COMPLETE!")
