using UnrealBuildTool;
using System.Collections.Generic;

public class VroomVroomEditorTarget : TargetRules
{
	public VroomVroomEditorTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Editor;
		DefaultBuildSettings = BuildSettingsVersion.V4;
		IncludeOrderVersion = EngineIncludeOrderVersion.Latest;

		ExtraModuleNames.Add("VroomVroom");

		// Editor-specific settings
		bBuildWithEditorOnlyData = true;
		bCompileAgainstEngine = true;
		bCompileAgainstCoreUObject = true;
		bCompileWithStatsWithoutEngine = false;
		bCompileWithPluginSupport = true;
	}
}