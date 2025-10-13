// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Core/VroomVroomGameState.h"
#include "Core/VroomVroomGameInstance.h"
#include "Net/UnrealNetwork.h"
#include "Engine/World.h"
#include "Kismet/GameplayStatics.h"

AVroomVroomGameState::AVroomVroomGameState()
{
	PrimaryActorTick.bCanEverTick = true;

	// Initialize game phase
	CurrentGamePhase = EVroomGameState::MainMenu;

	// Initialize time
	GameWorldTime = FDateTime::Now();
	DayNightCycle = 0.5f; // Start at noon

	// Initialize police state (EXCESSIVE)
	PoliceStatus.TotalUnitsActive = 50;
	PoliceStatus.UnitsInPursuit = 0;
	PoliceStatus.AverageProximityToPlayer = 100.0f;
	PoliceStatus.PoliceAggressionLevel = 10.0f;

	// Initialize prison state
	PrisonStatus.CurrentActivity = "Free Time";
	PrisonStatus.TimeUntilNextActivity = 60.0f;
	PrisonStatus.TotalInmates = 500;
	PrisonStatus.GuardsOnDuty = 100;
	PrisonStatus.bLockdownActive = false;

	// Initialize gang populations
	// Note: GangMemberCounts moved to separate replicated property due to TMap replication limitations
	// TODO: Implement gang tracking in a replicated-friendly way

	// Initialize court state
	CourtStatus.JudgeName = "Judge Hardcastle";
	CourtStatus.JudgeMood = 30;
	CourtStatus.PaperworkCompletionPercent = 0.0f;
	CourtStatus.FormsRemaining = 47;
	CourtStatus.bLawyerPresent = false;
	CourtStatus.ProsecutorName = "District Attorney Conviction";

	// Global statistics
	TotalPlayersArrested = 0;
	TotalPlayersInPrison = 0;
	TotalEscapes = 0;
	AverageSentenceLength = 5.0f;

	// Timing
	TimeSinceLastPoliceSpawn = 0.0f;
	TimeSinceLastPrisonEvent = 0.0f;
	bIsNightTime = false;
}

void AVroomVroomGameState::BeginPlay()
{
	Super::BeginPlay();

	// Sync to real world time
	SyncToRealWorldTime();

	// Start with excessive police presence
	SpawnPoliceWave(10);

	UE_LOG(LogTemp, Warning, TEXT("Game State Initialized - Police Units: %d"),
		PoliceStatus.TotalUnitsActive);
}

void AVroomVroomGameState::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	// Update time
	UpdateDayNightCycle(DeltaSeconds);

	// Manage systems based on game phase
	switch (CurrentGamePhase)
	{
		case EVroomGameState::Driving:
			ManagePoliceDeployment();
			TimeSinceLastPoliceSpawn += DeltaSeconds;

			// Spawn more police constantly
			if (TimeSinceLastPoliceSpawn > 10.0f)
			{
				SpawnPoliceWave(FMath::RandRange(2, 5));
				TimeSinceLastPoliceSpawn = 0.0f;
			}
			break;

		case EVroomGameState::Prison:
			ProcessPrisonSchedule();
			TimeSinceLastPrisonEvent += DeltaSeconds;

			// Random prison events
			if (TimeSinceLastPrisonEvent > 120.0f)
			{
				CheckForRandomEvents();
				TimeSinceLastPrisonEvent = 0.0f;
			}
			break;

		case EVroomGameState::Courtroom:
			// Judge gets more irritated over time
			if (FMath::RandRange(0, 100) < 5)
			{
				UpdateJudgeMood(-1);
			}
			break;
	}
}

void AVroomVroomGameState::UpdateGamePhase(EVroomGameState NewPhase)
{
	EVroomGameState OldPhase = CurrentGamePhase;
	CurrentGamePhase = NewPhase;

	UE_LOG(LogTemp, Warning, TEXT("Game Phase Changed: %d -> %d"),
		(int32)OldPhase, (int32)NewPhase);

	// Reset relevant systems
	switch (NewPhase)
	{
		case EVroomGameState::Driving:
			PoliceStatus.UnitsInPursuit = 0;
			SpawnPoliceWave(10); // Immediately spawn police
			break;

		case EVroomGameState::Prison:
			PrisonStatus.CurrentActivity = "Intake";
			TotalPlayersInPrison++;
			break;

		case EVroomGameState::Courtroom:
			CourtStatus.PaperworkCompletionPercent = 0.0f;
			CourtStatus.FormsRemaining = FMath::RandRange(30, 60); // Random amount of paperwork
			break;
	}
}

void AVroomVroomGameState::SpawnPoliceWave(int32 NumUnits)
{
	PoliceStatus.TotalUnitsActive += NumUnits;

	// Generate random positions around the map
	for (int32 i = 0; i < NumUnits; i++)
	{
		FVector RandomLocation(
			FMath::RandRange(-10000.0f, 10000.0f),
			FMath::RandRange(-10000.0f, 10000.0f),
			100.0f
		);
		PoliceUnitLocations.Add(RandomLocation);
	}

	UE_LOG(LogTemp, Warning, TEXT("Spawned %d more police units! Total: %d"),
		NumUnits, PoliceStatus.TotalUnitsActive);

	// Alert about mass deployment
	if (PoliceStatus.TotalUnitsActive > 75)
	{
		OnMassPoliceDeployment();
	}
}

void AVroomVroomGameState::IncreasePoliceAggression(float Amount)
{
	PoliceStatus.PoliceAggressionLevel = FMath::Min(20.0f,
		PoliceStatus.PoliceAggressionLevel + Amount);

	UE_LOG(LogTemp, Warning, TEXT("Police aggression increased to %.1f"),
		PoliceStatus.PoliceAggressionLevel);
}

void AVroomVroomGameState::RecordArrest()
{
	TotalPlayersArrested++;
	TotalArrestsMade++;

	UE_LOG(LogTemp, Warning, TEXT("Arrest recorded. Total arrests: %d"), TotalArrestsMade);
}

void AVroomVroomGameState::StartPrisonActivity(const FString& ActivityName)
{
	PrisonStatus.CurrentActivity = ActivityName;

	if (ActivityName == "Meal Time")
	{
		PrisonStatus.TimeUntilNextActivity = 30.0f;
		UE_LOG(LogTemp, Warning, TEXT("MEAL TIME: Report to cafeteria"));
	}
	else if (ActivityName == "Exercise Yard")
	{
		PrisonStatus.TimeUntilNextActivity = 60.0f;
		UE_LOG(LogTemp, Warning, TEXT("YARD TIME: Exercise yard is open"));
	}
	else if (ActivityName == "Work Detail")
	{
		PrisonStatus.TimeUntilNextActivity = 120.0f;
		UE_LOG(LogTemp, Warning, TEXT("WORK DETAIL: Report to assignment"));
	}
	else if (ActivityName == "Lights Out")
	{
		PrisonStatus.TimeUntilNextActivity = 480.0f; // 8 hours
		UE_LOG(LogTemp, Warning, TEXT("LIGHTS OUT: Return to cells"));
	}
}

void AVroomVroomGameState::TriggerPrisonEvent(const FString& EventType)
{
	UE_LOG(LogTemp, Warning, TEXT("PRISON EVENT: %s"), *EventType);

	if (EventType == "Riot")
	{
		PrisonStatus.bLockdownActive = true;
		OnPrisonRiot();
	}
	else if (EventType == "Lockdown")
	{
		PrisonStatus.bLockdownActive = true;
		OnPrisonLockdown();
	}
	else if (EventType == "Inspection")
	{
		UE_LOG(LogTemp, Warning, TEXT("Cell inspection! Hide contraband!"));
	}
	else if (EventType == "Fight")
	{
		UE_LOG(LogTemp, Warning, TEXT("Fight in the yard!"));
	}
}

void AVroomVroomGameState::UpdateGangPower(const FString& GangName, int32 MemberDelta)
{
	// Note: GangMemberCounts removed due to TMap replication limitations
	// TODO: Implement gang tracking using replicated arrays or separate tracking system
	UE_LOG(LogTemp, Warning, TEXT("Gang %s power changed by %d (not tracked yet)"),
		*GangName, MemberDelta);
}

void AVroomVroomGameState::UpdateJudgeMood(int32 MoodDelta)
{
	CourtStatus.JudgeMood = FMath::Clamp(CourtStatus.JudgeMood + MoodDelta, 0, 100);

	if (CourtStatus.JudgeMood < 20)
	{
		UE_LOG(LogTemp, Warning, TEXT("Judge is VERY angry! Expect harsh sentence!"));
		AverageSentenceLength = 10.0f; // Double the sentence
	}
	else if (CourtStatus.JudgeMood < 40)
	{
		UE_LOG(LogTemp, Warning, TEXT("Judge is irritated"));
		AverageSentenceLength = 7.0f;
	}
	else
	{
		AverageSentenceLength = 5.0f;
	}
}

void AVroomVroomGameState::CompleteForm(const FString& FormName)
{
	if (CourtStatus.FormsRemaining > 0)
	{
		CourtStatus.FormsRemaining--;
		CourtStatus.PaperworkCompletionPercent =
			((47.0f - CourtStatus.FormsRemaining) / 47.0f) * 100.0f;

		UE_LOG(LogTemp, Warning, TEXT("Form '%s' completed. %d forms remaining"),
			*FormName, CourtStatus.FormsRemaining);

		if (CourtStatus.FormsRemaining == 0)
		{
			UE_LOG(LogTemp, Warning, TEXT("ALL PAPERWORK COMPLETE! Awaiting verdict..."));
		}
	}
}

void AVroomVroomGameState::SyncToRealWorldTime()
{
	GameWorldTime = FDateTime::Now();

	// Convert to 0-1 day cycle
	int32 Hour = GameWorldTime.GetHour();
	int32 Minute = GameWorldTime.GetMinute();
	DayNightCycle = (Hour + Minute / 60.0f) / 24.0f;

	bIsNightTime = (Hour >= 20 || Hour <= 6);

	UE_LOG(LogTemp, Warning, TEXT("Time synced to %s"),
		*GameWorldTime.ToString());
}

FString AVroomVroomGameState::GetFormattedGameTime() const
{
	return GameWorldTime.ToString(TEXT("%A, %B %d, %Y - %I:%M %p"));
}

FString AVroomVroomGameState::GetWorldStatistics() const
{
	return FString::Printf(
		TEXT("=== VROOM VROOM WORLD STATISTICS ===\n")
		TEXT("Police Units Active: %d\n")
		TEXT("Police Aggression: %.1f/20\n")
		TEXT("Total Arrests Made: %d\n")
		TEXT("Players in Prison: %d\n")
		TEXT("Total Escapes: %d\n")
		TEXT("Average Sentence: %.1f days\n")
		TEXT("Prison Population: %d\n")
		TEXT("Guards on Duty: %d\n")
		TEXT("Judge Mood: %d/100\n")
		TEXT("Current Time: %s"),
		PoliceStatus.TotalUnitsActive,
		PoliceStatus.PoliceAggressionLevel,
		TotalArrestsMade,
		TotalPlayersInPrison,
		TotalEscapes,
		AverageSentenceLength,
		PrisonStatus.TotalInmates,
		PrisonStatus.GuardsOnDuty,
		CourtStatus.JudgeMood,
		*GetFormattedGameTime()
	);
}

void AVroomVroomGameState::UpdateDayNightCycle(float DeltaSeconds)
{
	// Update based on real time
	SyncToRealWorldTime();

	// Police are more aggressive at night
	if (bIsNightTime)
	{
		PoliceStatus.PoliceAggressionLevel = FMath::Min(20.0f,
			PoliceStatus.PoliceAggressionLevel + 0.01f);
	}
}

void AVroomVroomGameState::ManagePoliceDeployment()
{
	// Calculate average proximity to player
	if (APawn* PlayerPawn = UGameplayStatics::GetPlayerPawn(GetWorld(), 0))
	{
		FVector PlayerLocation = PlayerPawn->GetActorLocation();
		float TotalDistance = 0.0f;

		for (const FVector& PoliceLocation : PoliceUnitLocations)
		{
			TotalDistance += FVector::Dist(PlayerLocation, PoliceLocation);
		}

		if (PoliceUnitLocations.Num() > 0)
		{
			PoliceStatus.AverageProximityToPlayer =
				TotalDistance / PoliceUnitLocations.Num();
		}

		// Spawn more police if they're too far away (they should ALWAYS be close)
		if (PoliceStatus.AverageProximityToPlayer > 1000.0f)
		{
			SpawnPoliceWave(3);
		}
	}
}

void AVroomVroomGameState::ProcessPrisonSchedule()
{
	PrisonStatus.TimeUntilNextActivity -= GetWorld()->GetDeltaSeconds();

	if (PrisonStatus.TimeUntilNextActivity <= 0.0f)
	{
		// Rotate through activities
		if (PrisonStatus.CurrentActivity == "Free Time")
		{
			StartPrisonActivity("Meal Time");
		}
		else if (PrisonStatus.CurrentActivity == "Meal Time")
		{
			StartPrisonActivity("Exercise Yard");
		}
		else if (PrisonStatus.CurrentActivity == "Exercise Yard")
		{
			StartPrisonActivity("Work Detail");
		}
		else if (PrisonStatus.CurrentActivity == "Work Detail")
		{
			StartPrisonActivity("Free Time");
		}
		else
		{
			StartPrisonActivity("Lights Out");
		}
	}
}

void AVroomVroomGameState::CheckForRandomEvents()
{
	int32 EventChance = FMath::RandRange(0, 100);

	if (EventChance < 5) // 5% chance of riot
	{
		TriggerPrisonEvent("Riot");
	}
	else if (EventChance < 15) // 10% chance of lockdown
	{
		TriggerPrisonEvent("Lockdown");
	}
	else if (EventChance < 30) // 15% chance of inspection
	{
		TriggerPrisonEvent("Inspection");
	}
	else if (EventChance < 50) // 20% chance of fight
	{
		TriggerPrisonEvent("Fight");
	}
}

void AVroomVroomGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(AVroomVroomGameState, CurrentGamePhase);
	DOREPLIFETIME(AVroomVroomGameState, GameWorldTime);
	DOREPLIFETIME(AVroomVroomGameState, DayNightCycle);
	DOREPLIFETIME(AVroomVroomGameState, PoliceStatus);
	DOREPLIFETIME(AVroomVroomGameState, PoliceUnitLocations);
	DOREPLIFETIME(AVroomVroomGameState, TotalArrestsMade);
	DOREPLIFETIME(AVroomVroomGameState, PrisonStatus);
	DOREPLIFETIME(AVroomVroomGameState, InmateRelationships);
	DOREPLIFETIME(AVroomVroomGameState, CourtStatus);
	DOREPLIFETIME(AVroomVroomGameState, TotalPlayersArrested);
	DOREPLIFETIME(AVroomVroomGameState, TotalPlayersInPrison);
	DOREPLIFETIME(AVroomVroomGameState, TotalEscapes);
	DOREPLIFETIME(AVroomVroomGameState, AverageSentenceLength);
}