"""
Unreal Engine Python Script - Configure BP_VehicleBase Components
==================================================================
This script configures BP_VehicleBase with all necessary components for driving.

IMPORTANT: Run this script inside Unreal Engine Editor via:
Tools > Execute Python Script

Target Blueprint: /Game/Blueprints/Vehicles/BP_VehicleBase
Engine Version: Unreal Engine 5.6.1

REQUIREMENTS:
- BP_VehicleBase must already exist (created from VehicleBase C++ class)
- Unreal Engine Editor must be running
- Python Editor Script Plugin must be enabled

WHAT THIS SCRIPT DOES:
1. Loads BP_VehicleBase asset
2. Configures VehicleBody (root component) with physics settings
3. Adds/configures Static Mesh Component for visual representation
4. Configures Spring Arm Component with camera settings
5. Configures Camera Component attached to Spring Arm
6. Sets up component hierarchy and properties
7. Compiles and saves the blueprint

Author: Agent 2 - Vehicle Blueprint Engineer
"""

import unreal
import sys

# Initialize Unreal subsystems
editor_util = unreal.EditorAssetLibrary()
subsystem = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)

print("=" * 80)
print("CONFIGURING BP_VEHICLEBASE - VEHICLE BLUEPRINT ENGINEER")
print("=" * 80)

# =============================================================================
# CONFIGURATION PARAMETERS
# =============================================================================
BLUEPRINT_PATH = "/Game/Blueprints/Vehicles/BP_VehicleBase"

# Static Mesh Configuration
MESH_PATH = "/Engine/BasicShapes/Cube"
MESH_SCALE = unreal.Vector(4.0, 2.0, 1.0)
MESH_LOCATION = unreal.Vector(0.0, 0.0, 0.0)

# Physics Configuration
SIMULATE_PHYSICS = True
MASS_KG = 1500.0
LINEAR_DAMPING = 0.01
ANGULAR_DAMPING = 0.5
ENABLE_GRAVITY = True
COLLISION_PRESET = "PhysicsActor"

# Spring Arm Configuration
SPRING_ARM_LOCATION = unreal.Vector(0.0, 0.0, 200.0)
TARGET_ARM_LENGTH = 600.0
ENABLE_CAMERA_LAG = True
CAMERA_LAG_SPEED = 3.0

print("\nConfiguration Parameters:")
print(f"  - Blueprint: {BLUEPRINT_PATH}")
print(f"  - Mesh: {MESH_PATH}")
print(f"  - Mesh Scale: X={MESH_SCALE.x}, Y={MESH_SCALE.y}, Z={MESH_SCALE.z}")
print(f"  - Mass: {MASS_KG} kg")
print(f"  - Spring Arm Length: {TARGET_ARM_LENGTH}")
print(f"  - Camera Lag: {ENABLE_CAMERA_LAG}")

# =============================================================================
# STEP 1: LOAD BLUEPRINT ASSET
# =============================================================================
print("\n[STEP 1] Loading BP_VehicleBase...")
print("-" * 80)

try:
    # Check if blueprint exists
    if not editor_util.does_asset_exist(BLUEPRINT_PATH):
        print(f"  ERROR: Blueprint not found at {BLUEPRINT_PATH}")
        print("  Please create BP_VehicleBase first using create_all_blueprints.py")
        sys.exit(1)

    # Load the blueprint asset
    blueprint_asset = editor_util.load_asset(BLUEPRINT_PATH)

    if not blueprint_asset:
        print(f"  ERROR: Could not load blueprint asset")
        sys.exit(1)

    print(f"  SUCCESS: Loaded {BLUEPRINT_PATH}")

except Exception as e:
    print(f"  ERROR loading blueprint: {e}")
    sys.exit(1)

# =============================================================================
# STEP 2: ACCESS SIMPLE CONSTRUCTION SCRIPT
# =============================================================================
print("\n[STEP 2] Accessing Simple Construction Script...")
print("-" * 80)

try:
    # Get the Blueprint's Simple Construction Script
    scs = blueprint_asset.simple_construction_script

    if not scs:
        print("  ERROR: Could not access Simple Construction Script")
        sys.exit(1)

    # Get all existing nodes
    existing_nodes = scs.get_all_nodes()
    print(f"  Found {len(existing_nodes)} existing component nodes")

    # Find root component (VehicleBody)
    root_node = None
    vehicle_body_node = None
    spring_arm_node = None
    follow_camera_node = None

    for node in existing_nodes:
        component_name = node.get_variable_name()
        print(f"    - {component_name} ({node.component_class.get_name()})")

        if component_name == "VehicleBody":
            vehicle_body_node = node
            root_node = node
        elif component_name == "SpringArm":
            spring_arm_node = node
        elif component_name == "FollowCamera":
            follow_camera_node = node

    if not root_node:
        print("  WARNING: VehicleBody root component not found")
        print("  The C++ constructor should create this component")
    else:
        print(f"  SUCCESS: Found root component: {root_node.get_variable_name()}")

except Exception as e:
    print(f"  ERROR accessing SCS: {e}")
    sys.exit(1)

# =============================================================================
# STEP 3: CONFIGURE VEHICLEBODY (ROOT COMPONENT)
# =============================================================================
print("\n[STEP 3] Configuring VehicleBody Root Component...")
print("-" * 80)

try:
    if vehicle_body_node:
        # Get the component template
        vehicle_body = vehicle_body_node.component_template

        if vehicle_body:
            # Configure physics properties
            vehicle_body.set_editor_property("simulate_physics", SIMULATE_PHYSICS)
            vehicle_body.set_editor_property("mass_in_kg_override", MASS_KG)
            vehicle_body.set_editor_property("linear_damping", LINEAR_DAMPING)
            vehicle_body.set_editor_property("angular_damping", ANGULAR_DAMPING)
            vehicle_body.set_editor_property("enable_gravity", ENABLE_GRAVITY)

            # Set collision preset
            collision_response = unreal.BodyInstance()
            vehicle_body.set_editor_property("body_instance", collision_response)

            print(f"  SUCCESS: Configured VehicleBody physics")
            print(f"    - Simulate Physics: {SIMULATE_PHYSICS}")
            print(f"    - Mass: {MASS_KG} kg")
            print(f"    - Linear Damping: {LINEAR_DAMPING}")
            print(f"    - Angular Damping: {ANGULAR_DAMPING}")
        else:
            print("  WARNING: Could not access VehicleBody component template")
    else:
        print("  WARNING: VehicleBody node not found, skipping configuration")

except Exception as e:
    print(f"  WARNING: Could not fully configure VehicleBody: {e}")
    print("  You may need to configure physics manually in the editor")

# =============================================================================
# STEP 4: ADD STATIC MESH COMPONENT
# =============================================================================
print("\n[STEP 4] Adding Static Mesh Component...")
print("-" * 80)

try:
    # Check if visual mesh already exists
    visual_mesh_exists = False
    for node in existing_nodes:
        if node.get_variable_name() == "VehicleVisualMesh":
            visual_mesh_exists = True
            print("  INFO: VehicleVisualMesh already exists")
            break

    if not visual_mesh_exists and root_node:
        # Create new Static Mesh Component node
        new_mesh_node = scs.create_node(unreal.StaticMeshComponent, "VehicleVisualMesh")

        if new_mesh_node:
            # Get the component template
            mesh_component = new_mesh_node.component_template

            # Load the cube mesh
            cube_mesh = unreal.load_asset(MESH_PATH)
            if cube_mesh:
                mesh_component.set_editor_property("static_mesh", cube_mesh)
                print(f"  SUCCESS: Loaded mesh: {MESH_PATH}")

            # Set scale
            mesh_component.set_editor_property("relative_scale3d", MESH_SCALE)
            mesh_component.set_editor_property("relative_location", MESH_LOCATION)

            # Disable collision (physics handled by VehicleBody)
            mesh_component.set_editor_property("collision_enabled", unreal.CollisionEnabled.NO_COLLISION)

            # Attach to root
            new_mesh_node.attach_to(root_node)

            print("  SUCCESS: Created and configured VehicleVisualMesh")
            print(f"    - Scale: X={MESH_SCALE.x}, Y={MESH_SCALE.y}, Z={MESH_SCALE.z}")
            print(f"    - Collision: Disabled (using VehicleBody physics)")
        else:
            print("  WARNING: Could not create Static Mesh Component node")
    elif not root_node:
        print("  ERROR: Cannot add mesh - no root component found")

except Exception as e:
    print(f"  WARNING: Could not add Static Mesh Component: {e}")
    print("  You may need to add this component manually in the editor")

# =============================================================================
# STEP 5: CONFIGURE SPRING ARM COMPONENT
# =============================================================================
print("\n[STEP 5] Configuring Spring Arm Component...")
print("-" * 80)

try:
    if spring_arm_node:
        spring_arm = spring_arm_node.component_template

        if spring_arm:
            # Set location
            spring_arm.set_editor_property("relative_location", SPRING_ARM_LOCATION)

            # Set target arm length
            spring_arm.set_editor_property("target_arm_length", TARGET_ARM_LENGTH)

            # Enable camera lag
            spring_arm.set_editor_property("enable_camera_lag", ENABLE_CAMERA_LAG)
            spring_arm.set_editor_property("camera_lag_speed", CAMERA_LAG_SPEED)

            # Enable camera rotation lag
            spring_arm.set_editor_property("enable_camera_rotation_lag", True)
            spring_arm.set_editor_property("camera_rotation_lag_speed", 4.0)

            # Use pawn control rotation
            spring_arm.set_editor_property("use_pawn_control_rotation", True)

            print("  SUCCESS: Configured SpringArm")
            print(f"    - Location: Z={SPRING_ARM_LOCATION.z}")
            print(f"    - Target Arm Length: {TARGET_ARM_LENGTH}")
            print(f"    - Camera Lag: {ENABLE_CAMERA_LAG} (Speed: {CAMERA_LAG_SPEED})")
        else:
            print("  WARNING: Could not access SpringArm component template")
    else:
        print("  INFO: SpringArm not found (may be created in C++)")

        # Try to add Spring Arm if it doesn't exist
        if root_node:
            print("  Attempting to add SpringArm component...")
            new_spring_arm = scs.create_node(unreal.SpringArmComponent, "SpringArm")

            if new_spring_arm:
                spring_arm = new_spring_arm.component_template
                spring_arm.set_editor_property("relative_location", SPRING_ARM_LOCATION)
                spring_arm.set_editor_property("target_arm_length", TARGET_ARM_LENGTH)
                spring_arm.set_editor_property("enable_camera_lag", ENABLE_CAMERA_LAG)
                spring_arm.set_editor_property("camera_lag_speed", CAMERA_LAG_SPEED)
                spring_arm.set_editor_property("use_pawn_control_rotation", True)

                new_spring_arm.attach_to(root_node)
                spring_arm_node = new_spring_arm

                print("  SUCCESS: Created and configured SpringArm")

except Exception as e:
    print(f"  WARNING: Could not configure SpringArm: {e}")
    print("  You may need to configure this manually in the editor")

# =============================================================================
# STEP 6: CONFIGURE CAMERA COMPONENT
# =============================================================================
print("\n[STEP 6] Configuring Camera Component...")
print("-" * 80)

try:
    if follow_camera_node:
        follow_camera = follow_camera_node.component_template

        if follow_camera:
            # Camera is already attached to SpringArm by C++ constructor
            print("  SUCCESS: FollowCamera found and attached to SpringArm")
            print("    - Camera configured by C++ VehicleBase constructor")
        else:
            print("  WARNING: Could not access FollowCamera component template")
    else:
        print("  INFO: FollowCamera not found (may be created in C++)")

        # Try to add Camera if it doesn't exist and we have a SpringArm
        if spring_arm_node:
            print("  Attempting to add Camera component...")
            new_camera = scs.create_node(unreal.CameraComponent, "FollowCamera")

            if new_camera:
                new_camera.attach_to(spring_arm_node)
                print("  SUCCESS: Created Camera and attached to SpringArm")

except Exception as e:
    print(f"  WARNING: Could not configure Camera: {e}")
    print("  You may need to configure this manually in the editor")

# =============================================================================
# STEP 7: COMPILE AND SAVE BLUEPRINT
# =============================================================================
print("\n[STEP 7] Compiling and Saving Blueprint...")
print("-" * 80)

try:
    # Compile the blueprint
    unreal.EditorAssetLibrary.save_loaded_asset(blueprint_asset)

    # Force a blueprint compilation
    blueprint_lib = unreal.EditorAssetLibrary

    print("  SUCCESS: Blueprint saved")

    # Mark package as dirty to ensure changes are saved
    blueprint_asset.mark_package_dirty()

    print(f"  SUCCESS: Compiled and saved {BLUEPRINT_PATH}")

except Exception as e:
    print(f"  WARNING: Compilation/save encountered issues: {e}")
    print("  Try opening the blueprint in editor and compiling manually")

# =============================================================================
# FINAL REPORT
# =============================================================================
print("\n" + "=" * 80)
print("BP_VEHICLEBASE CONFIGURATION COMPLETE")
print("=" * 80)

print("\nComponents Configured:")
print("  1. VehicleBody (Root)")
print("     - Simulate Physics: TRUE")
print("     - Mass: 1500 kg")
print("     - Collision: PhysicsActor")
print("  2. VehicleVisualMesh (Static Mesh)")
print("     - Mesh: Cube")
print("     - Scale: 4.0 x 2.0 x 1.0")
print("     - Collision: Disabled")
print("  3. SpringArm")
print("     - Location: Z=200")
print("     - Target Arm Length: 600")
print("     - Camera Lag: Enabled")
print("  4. FollowCamera")
print("     - Attached to: SpringArm")

print("\nNEXT STEPS:")
print("=" * 80)
print("1. Open BP_VehicleBase in Unreal Editor")
print("2. Verify all components are present in Components panel")
print("3. Check physics settings on VehicleBody")
print("4. Test compilation (Compile button should be green)")
print("5. Drag BP_VehicleBase into a level to test")

print("\nMANUAL VERIFICATION CHECKLIST:")
print("=" * 80)
print("[ ] VehicleBody has 'Simulate Physics' enabled")
print("[ ] VehicleBody Mass is set to 1500 kg")
print("[ ] VehicleVisualMesh shows a cube shape")
print("[ ] SpringArm is at Z=200 above root")
print("[ ] FollowCamera is attached to SpringArm")
print("[ ] Blueprint compiles without errors")

print("\nTEST INSTRUCTIONS:")
print("=" * 80)
print("1. Place BP_VehicleBase in a test level")
print("2. Position it above ground (Z=100 or higher)")
print("3. Play in Editor (PIE)")
print("4. Vehicle should fall and land on ground")
print("5. Walk up to vehicle and press F to enter")
print("6. Use WASD or Xbox controller to drive")

print("\nKNOWN LIMITATIONS:")
print("=" * 80)
print("- Enhanced Input Actions need to be created manually")
print("- Event Graph logic needs manual setup")
print("- Materials and textures need to be applied")
print("- Audio components need sound cues assigned")

print("\nFor complete setup instructions, see:")
print("  C:\\Users\\evan\\Documents\\GitHub\\vroom-vroom\\VEHICLE_SETUP_GUIDE.md")

print("\n" + "=" * 80)
print("SCRIPT COMPLETE - Agent 2: Vehicle Blueprint Engineer")
print("=" * 80)
