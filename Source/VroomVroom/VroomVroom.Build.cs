using UnrealBuildTool;

public class VroomVroom : ModuleRules
{
	public VroomVroom(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		// Core dependencies for our game
		PublicDependencyModuleNames.AddRange(new string[] {
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"EnhancedInput",
			"HeadMountedDisplay",
			"NavigationSystem",
			"AIModule",
			"GameplayTasks",
			"GameplayTags",
			"UMG",
			"Slate",
			"SlateCore",
			"ChaosVehicles",
			"PhysicsCore"
		});

		// Private dependencies for internal use
		PrivateDependencyModuleNames.AddRange(new string[] {
			"OnlineSubsystem",
			"OnlineSubsystemNull",
			"Networking",
			"Sockets",
			"Json",
			"JsonUtilities",
			"HTTP",
			"MoviePlayer",
			"MovieSceneTracks",
			"LevelSequence"
		});

		// Include paths
		PublicIncludePaths.AddRange(new string[] {
			"VroomVroom/Public",
			"VroomVroom/Public/Core",
			"VroomVroom/Public/Gameplay",
			"VroomVroom/Public/UI",
			"VroomVroom/Public/Vehicles",
			"VroomVroom/Public/AI",
			"VroomVroom/Public/Prison"
		});

		PrivateIncludePaths.AddRange(new string[] {
			"VroomVroom/Private",
			"VroomVroom/Private/Core",
			"VroomVroom/Private/Gameplay",
			"VroomVroom/Private/UI",
			"VroomVroom/Private/Vehicles",
			"VroomVroom/Private/AI",
			"VroomVroom/Private/Prison"
		});
	}
}