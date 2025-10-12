using UnrealBuildTool;
using System.Collections.Generic;

public class VroomVroomTarget : TargetRules
{
	public VroomVroomTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Game;
		DefaultBuildSettings = BuildSettingsVersion.V4;
		IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

		ExtraModuleNames.Add("VroomVroom");

		// Windows-specific optimizations
		if (Target.Platform == UnrealTargetPlatform.Win64)
		{
			bUseStaticCRT = false;
			bDebugBuildsActuallyUseDebugCRT = false;
			bBuildWithEditorOnlyData = false;
			bCompileAgainstEngine = true;
			bCompileAgainstCoreUObject = true;
		}

		// Performance settings
		bUseIncrementalLinking = false;
		bUseFastPDBLinking = false;
		bForcePrecompiledHeaderForGameModules = true;
	}
}