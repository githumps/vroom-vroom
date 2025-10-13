using UnrealBuildTool;
using System.Collections.Generic;

public class VroomVroomTarget : TargetRules
{
	public VroomVroomTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Game;
		DefaultBuildSettings = BuildSettingsVersion.V5;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_6;

		ExtraModuleNames.Add("VroomVroom");
	}
}