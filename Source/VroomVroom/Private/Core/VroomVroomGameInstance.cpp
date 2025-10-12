// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Core/VroomVroomGameInstance.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "GameFramework/SaveGame.h"

UVroomVroomGameInstance::UVroomVroomGameInstance()
{
	CurrentGameState = EVroomGameState::MainMenu;
	PoliceAggressionLevel = 10.0f; // VERY HIGH by default
	ActivePoliceChases = 0;
}

void UVroomVroomGameInstance::Init()
{
	Super::Init();

	UE_LOG(LogTemp, Warning, TEXT("Vroom Vroom Game Instance Initialized"));

	// Load player profile on game start
	LoadPlayerProfile();

	// Process any offline progression
	ProcessOfflineProgression();
}

void UVroomVroomGameInstance::Shutdown()
{
	// Save player profile before shutdown
	SavePlayerProfile();

	Super::Shutdown();
}

void UVroomVroomGameInstance::SetGameState(EVroomGameState NewState)
{
	EVroomGameState OldState = CurrentGameState;
	CurrentGameState = NewState;

	UE_LOG(LogTemp, Warning, TEXT("Game State Changed from %d to %d"),
		(int32)OldState, (int32)NewState);

	// Handle state transitions
	switch (NewState)
	{
		case EVroomGameState::Driving:
			LoadLevel("OpenWorld");
			break;
		case EVroomGameState::Courtroom:
			LoadLevel("Courtroom");
			break;
		case EVroomGameState::Prison:
			LoadLevel("Prison");
			break;
		case EVroomGameState::MainMenu:
			LoadLevel("MainMenu");
			break;
	}
}

void UVroomVroomGameInstance::TransitionToCourtroom()
{
	PlayerProfile.TotalArrests++;
	SetGameState(EVroomGameState::Courtroom);
}

void UVroomVroomGameInstance::TransitionToPrison(int32 SentenceDays)
{
	PlayerProfile.CurrentPrisonSentenceDays = SentenceDays;

	// Calculate release time based on real-world time
	FDateTime Now = GetRealWorldTime();
	PlayerProfile.PrisonReleaseTime = Now + FTimespan::FromDays(SentenceDays);

	SetGameState(EVroomGameState::Prison);
	SavePlayerProfile();
}

void UVroomVroomGameInstance::ReleaseFromPrison()
{
	PlayerProfile.CurrentPrisonSentenceDays = 0;
	PlayerProfile.PrisonReleaseTime = FDateTime::MinValue();

	SetGameState(EVroomGameState::Released);

	// Automatically transition back to driving after a moment
	FTimerHandle ReleaseTimer;
	GetWorld()->GetTimerManager().SetTimer(ReleaseTimer, [this]()
	{
		SetGameState(EVroomGameState::Driving);
	}, 3.0f, false);
}

void UVroomVroomGameInstance::SavePlayerProfile()
{
	// This would typically save to a USaveGame object
	// For now, we'll log the action
	UE_LOG(LogTemp, Warning, TEXT("Saving Player Profile - Arrests: %d, Prison Days: %d"),
		PlayerProfile.TotalArrests, PlayerProfile.CurrentPrisonSentenceDays);
}

void UVroomVroomGameInstance::LoadPlayerProfile()
{
	// This would typically load from a USaveGame object
	// For now, we'll initialize with defaults
	UE_LOG(LogTemp, Warning, TEXT("Loading Player Profile"));
}

FDateTime UVroomVroomGameInstance::GetRealWorldTime() const
{
	return FDateTime::Now();
}

int32 UVroomVroomGameInstance::CalculateOfflinePrisonDays() const
{
	if (PlayerProfile.CurrentPrisonSentenceDays <= 0)
	{
		return 0;
	}

	FDateTime Now = GetRealWorldTime();
	FTimespan TimeSinceLastPlay = Now - PlayerProfile.LastPlayTime;

	return FMath::Min(TimeSinceLastPlay.GetDays(), PlayerProfile.CurrentPrisonSentenceDays);
}

void UVroomVroomGameInstance::ProcessOfflineProgression()
{
	if (CurrentGameState == EVroomGameState::Prison)
	{
		int32 DaysServed = CalculateOfflinePrisonDays();

		if (DaysServed > 0)
		{
			PlayerProfile.CurrentPrisonSentenceDays -= DaysServed;

			// Random events that happened while away
			if (FMath::RandRange(0, 100) < 30)
			{
				UE_LOG(LogTemp, Warning, TEXT("You got in a fight while you were away!"));
				// Could affect gang reputation, health, etc.
			}

			if (PlayerProfile.CurrentPrisonSentenceDays <= 0)
			{
				ReleaseFromPrison();
			}
		}
	}

	PlayerProfile.LastPlayTime = GetRealWorldTime();
}

void UVroomVroomGameInstance::LoadLevel(const FString& LevelName)
{
	UGameplayStatics::OpenLevel(this, *FString::Printf(TEXT("/Game/Maps/%s"), *LevelName));
}