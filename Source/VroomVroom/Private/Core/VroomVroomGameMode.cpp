// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Core/VroomVroomGameMode.h"
#include "Core/VroomVroomGameInstance.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "TimerManager.h"

AVroomVroomGameMode::AVroomVroomGameMode()
{
	PrimaryActorTick.bCanEverTick = true;

	// Set default classes (will be set up properly later)
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/Blueprints/BP_VroomCharacter"));
	if (PlayerPawnBPClass.Class != NULL)
	{
		DefaultPawnClass = PlayerPawnBPClass.Class;
	}

	// Police settings - EXCESSIVE
	MaxPoliceUnits = 50;  // WAY too many cops
	PoliceSpawnRadius = 500.0f;  // They're EVERYWHERE
	PoliceResponseTime = 0.5f;  // Instant response basically

	// Time settings
	CurrentGameHour = 8.0f;  // Start at 8 AM
	TimeMultiplier = 1.0f;  // Real-time by default

	// Prison settings
	bPrisonRoutineActive = false;
	CurrentPrisonActivity = "Free Time";

	// Court settings
	CourtroomPaperworkProgress = 0.0f;
	JudgeIrritationLevel = 0;
}

void AVroomVroomGameMode::BeginPlay()
{
	Super::BeginPlay();

	// Get game instance
	GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance());

	if (GameInstance)
	{
		EVroomGameState CurrentState = GameInstance->GetCurrentGameState();

		// Initialize based on game state
		switch (CurrentState)
		{
			case EVroomGameState::Driving:
				// Spawn TONS of police
				for (int32 i = 0; i < 10; i++)
				{
					FVector RandomLocation = FVector(
						FMath::RandRange(-5000.0f, 5000.0f),
						FMath::RandRange(-5000.0f, 5000.0f),
						100.0f
					);
					SpawnPoliceUnit(RandomLocation);
				}
				break;

			case EVroomGameState::Prison:
				StartPrisonRoutine();
				break;

			case EVroomGameState::Courtroom:
				StartCourtProceedings();
				break;
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("Vroom Vroom Game Mode Started - SO MANY COPS"));
}

void AVroomVroomGameMode::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	// Update game time
	UpdateGameTime(DeltaSeconds);

	// Constantly check for "violations"
	if (GameInstance && GameInstance->GetCurrentGameState() == EVroomGameState::Driving)
	{
		CheckForTrafficViolations();
		ManagePolicePresence();
	}
}

void AVroomVroomGameMode::InitGame(const FString& MapName, const FString& Options, FString& ErrorMessage)
{
	Super::InitGame(MapName, Options, ErrorMessage);

	UE_LOG(LogTemp, Warning, TEXT("Initializing Vroom Vroom on map: %s"), *MapName);
}

void AVroomVroomGameMode::SpawnPoliceUnit(const FVector& Location)
{
	if (ActivePoliceUnits.Num() >= MaxPoliceUnits)
	{
		return;
	}

	// Spawn logic would go here
	UE_LOG(LogTemp, Warning, TEXT("Spawning Police Unit at %s"), *Location.ToString());

	// In a real implementation, we'd spawn the actual police vehicle actor
	/*
	if (PoliceVehicleClass)
	{
		FActorSpawnParameters SpawnParams;
		APoliceVehicle* NewPolice = GetWorld()->SpawnActor<APoliceVehicle>(
			PoliceVehicleClass,
			Location,
			FRotator::ZeroRotator,
			SpawnParams
		);

		if (NewPolice)
		{
			ActivePoliceUnits.Add(NewPolice);
		}
	}
	*/
}

void AVroomVroomGameMode::InitiatePoliceChase(AVroomVroomCharacter* Target)
{
	if (!Target || !GameInstance)
	{
		return;
	}

	GameInstance->ActivePoliceChases++;

	UE_LOG(LogTemp, Warning, TEXT("POLICE CHASE INITIATED! %d units in pursuit!"),
		FMath::Min(10, ActivePoliceUnits.Num()));

	// Alert ALL nearby police units (because there's always tons nearby)
	// In reality, this would set their AI to pursue mode
}

void AVroomVroomGameMode::ArrestPlayer(AVroomVroomCharacter* Player)
{
	if (!Player || !GameInstance)
	{
		return;
	}

	UE_LOG(LogTemp, Warning, TEXT("PLAYER ARRESTED! You're going to court!"));

	// Transition to courtroom
	GameInstance->TransitionToCourtroom();
}

void AVroomVroomGameMode::StartPrisonRoutine()
{
	bPrisonRoutineActive = true;

	UE_LOG(LogTemp, Warning, TEXT("Prison Routine Started - Welcome to your new home"));

	// Set up daily schedule
	FTimerHandle MorningTimer, LunchTimer, ExerciseTimer, DinnerTimer, LightsOutTimer;

	// 7 AM - Wake up
	GetWorld()->GetTimerManager().SetTimer(MorningTimer, [this]()
	{
		CurrentPrisonActivity = "Morning Routine";
		UE_LOG(LogTemp, Warning, TEXT("WAKE UP! Time for morning count!"));
	}, 1.0f, false);

	// 12 PM - Lunch
	GetWorld()->GetTimerManager().SetTimer(LunchTimer, [this]()
	{
		CurrentPrisonActivity = "Lunch";
		UE_LOG(LogTemp, Warning, TEXT("Lunch time - Mashed potatoes again..."));
	}, 20.0f, false);

	// 2 PM - Exercise yard
	GetWorld()->GetTimerManager().SetTimer(ExerciseTimer, [this]()
	{
		CurrentPrisonActivity = "Exercise Yard";
		UE_LOG(LogTemp, Warning, TEXT("Exercise yard is open"));
	}, 30.0f, false);

	// 6 PM - Dinner
	GetWorld()->GetTimerManager().SetTimer(DinnerTimer, [this]()
	{
		CurrentPrisonActivity = "Dinner";
		UE_LOG(LogTemp, Warning, TEXT("Dinner time"));
	}, 45.0f, false);

	// 10 PM - Lights out
	GetWorld()->GetTimerManager().SetTimer(LightsOutTimer, [this]()
	{
		CurrentPrisonActivity = "Lights Out";
		UE_LOG(LogTemp, Warning, TEXT("LIGHTS OUT!"));
	}, 60.0f, false);
}

void AVroomVroomGameMode::EndPrisonRoutine()
{
	bPrisonRoutineActive = false;
	CurrentPrisonActivity = "Released";

	UE_LOG(LogTemp, Warning, TEXT("You've been released. Try to stay out of trouble..."));
	UE_LOG(LogTemp, Warning, TEXT("(You won't. There's cops EVERYWHERE)"));
}

void AVroomVroomGameMode::ProcessPrisonActivity(const FString& ActivityName)
{
	UE_LOG(LogTemp, Warning, TEXT("Processing Prison Activity: %s"), *ActivityName);

	if (ActivityName == "ReadBook")
	{
		// Start book reading interface
		UE_LOG(LogTemp, Warning, TEXT("Opening book... Time to read War and Peace, page by page"));
	}
	else if (ActivityName == "WorkOut")
	{
		// Start workout mini-game
		UE_LOG(LogTemp, Warning, TEXT("Time to pump iron. Do your reps!"));
	}
	else if (ActivityName == "WriteLetter")
	{
		// Open letter writing interface
		UE_LOG(LogTemp, Warning, TEXT("Writing a letter home..."));
	}
	else if (ActivityName == "BrowseWeb")
	{
		// Open dial-up browser
		UE_LOG(LogTemp, Warning, TEXT("Connecting to internet at 56k... This will take a while"));
	}
}

void AVroomVroomGameMode::StartCourtProceedings()
{
	CourtroomPaperworkProgress = 0.0f;

	UE_LOG(LogTemp, Warning, TEXT("COURT IS NOW IN SESSION"));
	UE_LOG(LogTemp, Warning, TEXT("You need to fill out ALL the paperwork. Every. Single. Form."));

	// Check repeat offender status
	if (GameInstance)
	{
		JudgeIrritationLevel = GameInstance->GetPlayerProfile().TotalArrests;

		if (JudgeIrritationLevel > 3)
		{
			UE_LOG(LogTemp, Warning, TEXT("Judge: 'You again?! I'm getting tired of seeing you here!'"));
		}
	}
}

void AVroomVroomGameMode::ProcessCourtPaperwork(float CompletionPercentage)
{
	CourtroomPaperworkProgress = CompletionPercentage;

	if (CompletionPercentage >= 100.0f)
	{
		UE_LOG(LogTemp, Warning, TEXT("All paperwork complete. The judge will now decide your fate..."));

		// Determine sentence based on irritation level
		int32 SentenceDays = FMath::Max(1, JudgeIrritationLevel * 2);
		IssueVerdict(SentenceDays);
	}
}

void AVroomVroomGameMode::IssueVerdict(int32 SentenceDays)
{
	UE_LOG(LogTemp, Warning, TEXT("VERDICT: %d days in prison!"), SentenceDays);

	if (GameInstance)
	{
		GameInstance->TransitionToPrison(SentenceDays);
	}
}

void AVroomVroomGameMode::UpdateGameTime(float DeltaSeconds)
{
	// Update hour (24 hour cycle matched to real time)
	CurrentGameHour += (DeltaSeconds / 3600.0f) * TimeMultiplier;

	if (CurrentGameHour >= 24.0f)
	{
		CurrentGameHour -= 24.0f;
	}
}

void AVroomVroomGameMode::ManagePolicePresence()
{
	// Always spawn more police if we're below the EXCESSIVE maximum
	if (ActivePoliceUnits.Num() < MaxPoliceUnits / 2)
	{
		FVector PlayerLocation = FVector::ZeroVector;
		if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
		{
			if (APawn* PlayerPawn = PC->GetPawn())
			{
				PlayerLocation = PlayerPawn->GetActorLocation();
			}
		}

		// Spawn police nearby (they're ALWAYS nearby)
		FVector SpawnLocation = PlayerLocation + FVector(
			FMath::RandRange(-PoliceSpawnRadius, PoliceSpawnRadius),
			FMath::RandRange(-PoliceSpawnRadius, PoliceSpawnRadius),
			100.0f
		);

		SpawnPoliceUnit(SpawnLocation);
	}
}

void AVroomVroomGameMode::CheckForTrafficViolations()
{
	// Check if player is doing ANYTHING wrong
	// Even driving normally will trigger the cops sometimes
	// because there's just too many of them

	if (FMath::RandRange(0, 100) < 5) // 5% chance per tick
	{
		UE_LOG(LogTemp, VeryVerbose, TEXT("A cop is watching you suspiciously..."));
	}
}

float AVroomVroomGameMode::GetGameTimeHour() const
{
	return CurrentGameHour;
}

FString AVroomVroomGameMode::GetGameTimeString() const
{
	int32 Hour = FMath::FloorToInt(CurrentGameHour);
	int32 Minute = FMath::FloorToInt((CurrentGameHour - Hour) * 60.0f);

	return FString::Printf(TEXT("%02d:%02d"), Hour, Minute);
}

void AVroomVroomGameMode::SaveGame()
{
	if (GameInstance)
	{
		GameInstance->SavePlayerProfile();
	}
}

void AVroomVroomGameMode::LoadGame()
{
	if (GameInstance)
	{
		GameInstance->LoadPlayerProfile();
	}
}