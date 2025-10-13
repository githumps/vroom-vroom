"""
Unreal Engine Python Script - Create Courtroom Level
This script creates the courtroom scene for arrest paperwork.
"""

import unreal

editor_level_lib = unreal.EditorLevelLibrary()
editor_asset_lib = unreal.EditorAssetLibrary()

print("=" * 80)
print("CREATING COURTROOM LEVEL - VROOM VROOM")
print("=" * 80)

# Step 1: Create new level
print("\n[STEP 1] Creating Courtroom level...")
try:
    new_level = editor_level_lib.new_level("/Game/Maps/Courtroom")
    print("SUCCESS: Courtroom level created")
except Exception as e:
    print(f"INFO: {e}")

world = unreal.EditorLevelLibrary.get_editor_world()

# Step 2: Create Floor
print("\n[STEP 2] Creating courtroom floor...")
try:
    floor_location = unreal.Vector(0.0, 0.0, 0.0)
    floor_rotation = unreal.Rotator(0.0, 0.0, 0.0)
    floor_scale = unreal.Vector(20.0, 20.0, 0.5)  # Large floor

    floor_actor = editor_level_lib.spawn_actor_from_class(
        unreal.StaticMeshActor,
        floor_location,
        floor_rotation
    )

    if floor_actor:
        floor_actor.set_actor_label("Courtroom_Floor")
        floor_actor.set_actor_scale3d(floor_scale)
        # Set mesh to cube
        mesh_component = floor_actor.static_mesh_component
        if mesh_component:
            cube_mesh = unreal.load_asset("/Engine/BasicShapes/Cube")
            if cube_mesh:
                mesh_component.set_static_mesh(cube_mesh)
        print("SUCCESS: Floor created")
except Exception as e:
    print(f"WARNING: Floor creation: {e}")

# Step 3: Create Walls (4 walls around the room)
print("\n[STEP 3] Creating courtroom walls...")
wall_configs = [
    ("North_Wall", 0.0, 1000.0, 200.0, 20.0, 1.0, 4.0),
    ("South_Wall", 0.0, -1000.0, 200.0, 20.0, 1.0, 4.0),
    ("East_Wall", 1000.0, 0.0, 200.0, 1.0, 20.0, 4.0),
    ("West_Wall", -1000.0, 0.0, 200.0, 1.0, 20.0, 4.0),
]

for label, x, y, z, scale_x, scale_y, scale_z in wall_configs:
    try:
        wall_location = unreal.Vector(x, y, z)
        wall_rotation = unreal.Rotator(0.0, 0.0, 0.0)
        wall_scale = unreal.Vector(scale_x, scale_y, scale_z)

        wall_actor = editor_level_lib.spawn_actor_from_class(
            unreal.StaticMeshActor,
            wall_location,
            wall_rotation
        )

        if wall_actor:
            wall_actor.set_actor_label(f"Courtroom_{label}")
            wall_actor.set_actor_scale3d(wall_scale)
            mesh_component = wall_actor.static_mesh_component
            if mesh_component:
                cube_mesh = unreal.load_asset("/Engine/BasicShapes/Cube")
                if cube_mesh:
                    mesh_component.set_static_mesh(cube_mesh)
    except Exception as e:
        print(f"WARNING: {label} creation: {e}")

print("SUCCESS: Walls created")

# Step 4: Create Judge's Bench
print("\n[STEP 4] Creating judge's bench...")
try:
    bench_location = unreal.Vector(0.0, 800.0, 100.0)
    bench_rotation = unreal.Rotator(0.0, 0.0, 0.0)
    bench_scale = unreal.Vector(8.0, 2.0, 2.0)

    bench_actor = editor_level_lib.spawn_actor_from_class(
        unreal.StaticMeshActor,
        bench_location,
        bench_rotation
    )

    if bench_actor:
        bench_actor.set_actor_label("Judge_Bench")
        bench_actor.set_actor_scale3d(bench_scale)
        mesh_component = bench_actor.static_mesh_component
        if mesh_component:
            cube_mesh = unreal.load_asset("/Engine/BasicShapes/Cube")
            if cube_mesh:
                mesh_component.set_static_mesh(cube_mesh)
        print("SUCCESS: Judge's bench created")
except Exception as e:
    print(f"WARNING: Bench creation: {e}")

# Step 5: Add Lighting
print("\n[STEP 5] Adding courtroom lighting...")

# Directional Light
try:
    light_location = unreal.Vector(0.0, 0.0, 500.0)
    light_rotation = unreal.Rotator(-60.0, 0.0, 0.0)

    directional_light = editor_level_lib.spawn_actor_from_class(
        unreal.DirectionalLight,
        light_location,
        light_rotation
    )

    if directional_light:
        directional_light.set_actor_label("Courtroom_MainLight")
        light_component = directional_light.get_component_by_class(unreal.DirectionalLightComponent)
        if light_component:
            light_component.set_intensity(5.0)
        print("SUCCESS: Main light created")
except Exception as e:
    print(f"WARNING: Lighting: {e}")

# Add some point lights for atmosphere
point_light_positions = [
    ("Ceiling_Light_1", 400.0, 400.0, 400.0),
    ("Ceiling_Light_2", -400.0, 400.0, 400.0),
    ("Ceiling_Light_3", 400.0, -400.0, 400.0),
    ("Ceiling_Light_4", -400.0, -400.0, 400.0),
]

for label, x, y, z in point_light_positions:
    try:
        light_location = unreal.Vector(x, y, z)
        light_rotation = unreal.Rotator(0.0, 0.0, 0.0)

        point_light = editor_level_lib.spawn_actor_from_class(
            unreal.PointLight,
            light_location,
            light_rotation
        )

        if point_light:
            point_light.set_actor_label(label)
            light_component = point_light.get_component_by_class(unreal.PointLightComponent)
            if light_component:
                light_component.set_intensity(2000.0)
                light_component.set_attenuation_radius(1000.0)
    except Exception as e:
        pass

print("SUCCESS: Ambient lights added")

# Step 6: Add Player Start
print("\n[STEP 6] Adding PlayerStart...")
try:
    player_start_location = unreal.Vector(0.0, -600.0, 100.0)  # In front of judge
    player_start_rotation = unreal.Rotator(0.0, 90.0, 0.0)  # Facing judge

    player_start = editor_level_lib.spawn_actor_from_class(
        unreal.PlayerStart,
        player_start_location,
        player_start_rotation
    )

    if player_start:
        player_start.set_actor_label("Courtroom_PlayerStart")
        print("SUCCESS: PlayerStart created")
except Exception as e:
    print(f"WARNING: PlayerStart: {e}")

# Step 7: Save the level
print("\n[STEP 7] Saving Courtroom level...")
try:
    editor_asset_lib.save_asset("/Game/Maps/Courtroom")
    print("SUCCESS: Courtroom level saved")
except Exception as e:
    print(f"INFO: {e}")
    editor_level_lib.save_current_level()

# Final Report
print("\n" + "=" * 80)
print("COURTROOM LEVEL COMPLETE")
print("=" * 80)
print("Level: /Game/Maps/Courtroom.umap")
print("Features:")
print("  - Floor and 4 walls")
print("  - Judge's bench")
print("  - Dramatic lighting")
print("  - PlayerStart positioned facing the judge")
print("\nNext: Create BP_CourtroomManager to display paperwork widget")
print("=" * 80)
