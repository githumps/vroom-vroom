// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Core/VroomVroomSaveGame.h"
#include "Core/VroomVroomGameInstance.h"
#include "Core/VroomVroomGameMode.h"
#include "Core/VroomVroomPlayerState.h"
#include "Core/VroomVroomPlayerController.h"
#include "Gameplay/VroomVroomCharacter.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "HAL/FileManager.h"

UVroomVroomSaveGame::UVroomVroomSaveGame()
{
	SaveSlotName = "VroomVroomSave";
	UserIndex = 0;
	SaveVersion = CURRENT_SAVE_VERSION;
	SaveTimestamp = FDateTime::Now();
	SaveDescription = "Vroom Vroom Save Game";

	// Initialize defaults
	CurrentGameState = EVroomGameState::MainMenu;
	LastPlayedRealTime = FDateTime::Now();
	TotalPlayTime = 0.0f;

	CurrentHealth = 100;
	CurrentStamina = 50;
	CurrentStrength = 30;

	CurrentWantedLevel = 0;
	TotalFinesOwed = 0.0f;

	CigarettesOwned = 0;
	PrisonReputation = 50.0f;
	CurrentGang = "None";

	TotalMilesDriven = 0.0f;
	TrafficViolations = 0;
	PoliceEvasions = 0;
	VehiclesCrashed = 0;
	TopSpeed = 0.0f;

	MoneyInWallet = 100.0f;
	CurrentMapName = "OpenWorld";
}

void UVroomVroomSaveGame::UpdateFromGameState(UObject* WorldContextObject)
{
	if (!WorldContextObject)
	{
		return;
	}

	UWorld* World = GEngine->GetWorldFromContextObject(WorldContextObject, EGetWorldErrorMode::LogAndReturnNull);
	if (!World)
	{
		return;
	}

	// Update timestamp
	SaveTimestamp = FDateTime::Now();

	// Get Game Instance
	if (UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(UGameplayStatics::GetGameInstance(World)))
	{
		// Save player profile
		PlayerProfile = GameInstance->GetPlayerProfile();
		CurrentGameState = GameInstance->GetCurrentGameState();

		// Calculate offline time
		FTimespan TimeSinceLast = SaveTimestamp - LastPlayedRealTime;
		TotalPlayTime += TimeSinceLast.GetTotalSeconds();
	}

	// Get Player Controller
	if (AVroomVroomPlayerController* PlayerController = Cast<AVroomVroomPlayerController>(World->GetFirstPlayerController()))
	{
		// Save UI state, settings, etc.
	}

	// Get Player Character
	if (AVroomVroomCharacter* PlayerCharacter = Cast<AVroomVroomCharacter>(UGameplayStatics::GetPlayerCharacter(World, 0)))
	{
		// Save character data
		CharacterCustomization = PlayerCharacter->CharacterCustomization;
		LastPlayerLocation = PlayerCharacter->GetActorLocation();
		LastPlayerRotation = PlayerCharacter->GetActorRotation();

		// Note: Health, Stamina, Strength, Inventory are saved from PlayerState below
	}

	// Get Player State
	if (AVroomVroomPlayerState* PlayerState = Cast<AVroomVroomPlayerState>(
		World->GetFirstPlayerController()->GetPlayerState<AVroomVroomPlayerState>()))
	{
		// Save criminal record
		CriminalHistory = PlayerState->CriminalHistory;
		CurrentWantedLevel = PlayerState->CurrentWantedLevel;
		TotalFinesOwed = PlayerState->TotalFinesOwed;

		// Save prison statistics
		PrisonStatistics = PlayerState->PrisonStatistics;
		GangRelationships = PlayerState->GangRelationships;

		// Save driving stats
		TotalMilesDriven = PlayerState->TotalMilesDriven;
		TrafficViolations = PlayerState->TrafficViolations;
		PoliceEvasions = PlayerState->PoliceEvasions;
		VehiclesCrashed = PlayerState->VehiclesCrashed;
		TopSpeed = PlayerState->TopSpeed;

		// Save character stats
		CurrentHealth = PlayerState->HealthStatus;
		CurrentStamina = PlayerState->StaminaLevel;
		CurrentStrength = PlayerState->StrengthLevel;

		// Save inventory
		Inventory = PlayerState->Inventory;
		ContrabandItems = PlayerState->ContrabandItems;
		MoneyInWallet = PlayerState->MoneyInWallet;
		CigarettesOwned = PlayerState->CigarettesOwned;
		PrisonReputation = PlayerState->PrisonReputation;
		CurrentGang = PlayerState->CurrentGang;
	}

	// Save current map name
	CurrentMapName = World->GetMapName();

	// Update last played time
	LastPlayedRealTime = FDateTime::Now();

	UE_LOG(LogTemp, Warning, TEXT("Save game updated from current game state"));
}

void UVroomVroomSaveGame::ApplyToGameState(UObject* WorldContextObject)
{
	if (!WorldContextObject)
	{
		return;
	}

	UWorld* World = GEngine->GetWorldFromContextObject(WorldContextObject, EGetWorldErrorMode::LogAndReturnNull);
	if (!World)
	{
		return;
	}

	// Apply to Game Instance
	if (UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(UGameplayStatics::GetGameInstance(World)))
	{
		GameInstance->GetPlayerProfile() = PlayerProfile;
		GameInstance->SetGameState(CurrentGameState);

		// Process offline progression
		GameInstance->ProcessOfflineProgression();
	}

	// Apply to Player Character
	if (AVroomVroomCharacter* PlayerCharacter = Cast<AVroomVroomCharacter>(UGameplayStatics::GetPlayerCharacter(World, 0)))
	{
		// Restore character data
		PlayerCharacter->CharacterCustomization = CharacterCustomization;
		PlayerCharacter->SetActorLocation(LastPlayerLocation);
		PlayerCharacter->SetActorRotation(LastPlayerRotation);

		// Apply customization visually
		PlayerCharacter->ApplyCustomization(CharacterCustomization);

		// Note: Health, Stamina, Strength, Inventory are restored to PlayerState below
	}

	// Apply to Player State
	if (AVroomVroomPlayerState* PlayerState = Cast<AVroomVroomPlayerState>(
		World->GetFirstPlayerController()->GetPlayerState<AVroomVroomPlayerState>()))
	{
		// Restore criminal record
		PlayerState->CriminalHistory = CriminalHistory;
		PlayerState->CurrentWantedLevel = CurrentWantedLevel;
		PlayerState->TotalFinesOwed = TotalFinesOwed;

		// Restore prison statistics
		PlayerState->PrisonStatistics = PrisonStatistics;
		PlayerState->GangRelationships = GangRelationships;

		// Restore driving stats
		PlayerState->TotalMilesDriven = TotalMilesDriven;
		PlayerState->TrafficViolations = TrafficViolations;
		PlayerState->PoliceEvasions = PoliceEvasions;
		PlayerState->VehiclesCrashed = VehiclesCrashed;
		PlayerState->TopSpeed = TopSpeed;

		// Restore character stats
		PlayerState->HealthStatus = CurrentHealth;
		PlayerState->StaminaLevel = CurrentStamina;
		PlayerState->StrengthLevel = CurrentStrength;

		// Restore inventory
		PlayerState->Inventory = Inventory;
		PlayerState->ContrabandItems = ContrabandItems;
		PlayerState->MoneyInWallet = MoneyInWallet;
		PlayerState->CigarettesOwned = CigarettesOwned;
		PlayerState->PrisonReputation = PrisonReputation;
		PlayerState->CurrentGang = CurrentGang;
	}

	// Calculate time passed since last save
	FTimespan OfflineTime = FDateTime::Now() - LastPlayedRealTime;
	int32 DaysPassed = OfflineTime.GetDays();

	if (DaysPassed > 0 && CurrentGameState == EVroomGameState::Prison)
	{
		UE_LOG(LogTemp, Warning, TEXT("You were offline for %d days while in prison!"), DaysPassed);

		// Process what happened while player was away
		if (FMath::RandRange(0, 100) < 30 * DaysPassed)
		{
			UE_LOG(LogTemp, Warning, TEXT("You got in %d fights while you were away!"),
				FMath::RandRange(1, DaysPassed));
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("Save game applied to current game state"));
}

FString UVroomVroomSaveGame::GetSaveGameInfo() const
{
	return FString::Printf(
		TEXT("Save: %s\n")
		TEXT("Version: %d\n")
		TEXT("Date: %s\n")
		TEXT("Play Time: %.1f hours\n")
		TEXT("Game State: %d\n")
		TEXT("Total Arrests: %d\n")
		TEXT("Prison Days Served: %d\n")
		TEXT("Money: $%.2f\n")
		TEXT("Cigarettes: %d\n")
		TEXT("Gang: %s"),
		*SaveSlotName,
		SaveVersion,
		*SaveTimestamp.ToString(),
		TotalPlayTime / 3600.0f,
		(int32)CurrentGameState,
		PlayerProfile.TotalArrests,
		PrisonStatistics.TotalDaysServed,
		MoneyInWallet,
		CigarettesOwned,
		*CurrentGang
	);
}

bool UVroomVroomSaveGame::IsCompatibleVersion() const
{
	return SaveVersion == CURRENT_SAVE_VERSION;
}

bool UVroomVroomSaveGame::SaveGameToSlot(UObject* WorldContextObject, const FString& SlotName, int32 UserIndex)
{
	// Create save game object
	UVroomVroomSaveGame* SaveGameInstance = Cast<UVroomVroomSaveGame>(
		UGameplayStatics::CreateSaveGameObject(UVroomVroomSaveGame::StaticClass())
	);

	if (!SaveGameInstance)
	{
		UE_LOG(LogTemp, Error, TEXT("Failed to create save game object"));
		return false;
	}

	// Update save data from current game state
	SaveGameInstance->SaveSlotName = SlotName;
	SaveGameInstance->UserIndex = UserIndex;
	SaveGameInstance->UpdateFromGameState(WorldContextObject);

	// Save to disk
	bool bSuccess = UGameplayStatics::SaveGameToSlot(SaveGameInstance, SlotName, UserIndex);

	if (bSuccess)
	{
		UE_LOG(LogTemp, Warning, TEXT("Game saved successfully to slot: %s"), *SlotName);

		// Show notification
		if (UWorld* World = GEngine->GetWorldFromContextObject(WorldContextObject, EGetWorldErrorMode::LogAndReturnNull))
		{
			if (AVroomVroomPlayerController* PC = Cast<AVroomVroomPlayerController>(World->GetFirstPlayerController()))
			{
				PC->ShowNotification("Game Saved!", 2.0f);
			}
		}
	}
	else
	{
		UE_LOG(LogTemp, Error, TEXT("Failed to save game to slot: %s"), *SlotName);
	}

	return bSuccess;
}

UVroomVroomSaveGame* UVroomVroomSaveGame::LoadGameFromSlot(UObject* WorldContextObject, const FString& SlotName, int32 UserIndex)
{
	// Check if save exists
	if (!UGameplayStatics::DoesSaveGameExist(SlotName, UserIndex))
	{
		UE_LOG(LogTemp, Warning, TEXT("Save game does not exist: %s"), *SlotName);
		return nullptr;
	}

	// Load save game
	UVroomVroomSaveGame* LoadedGame = Cast<UVroomVroomSaveGame>(
		UGameplayStatics::LoadGameFromSlot(SlotName, UserIndex)
	);

	if (!LoadedGame)
	{
		UE_LOG(LogTemp, Error, TEXT("Failed to load save game from slot: %s"), *SlotName);
		return nullptr;
	}

	// Check version compatibility
	if (!LoadedGame->IsCompatibleVersion())
	{
		UE_LOG(LogTemp, Warning, TEXT("Save game version mismatch. Current: %d, Loaded: %d"),
			CURRENT_SAVE_VERSION, LoadedGame->SaveVersion);
	}

	// Apply loaded data to game state
	LoadedGame->ApplyToGameState(WorldContextObject);

	UE_LOG(LogTemp, Warning, TEXT("Game loaded successfully from slot: %s"), *SlotName);

	// Show notification
	if (UWorld* World = GEngine->GetWorldFromContextObject(WorldContextObject, EGetWorldErrorMode::LogAndReturnNull))
	{
		if (AVroomVroomPlayerController* PC = Cast<AVroomVroomPlayerController>(World->GetFirstPlayerController()))
		{
			PC->ShowNotification("Game Loaded!", 2.0f);

			// Show time passed
			FTimespan OfflineTime = FDateTime::Now() - LoadedGame->LastPlayedRealTime;
			if (OfflineTime.GetDays() > 0)
			{
				FString TimeMessage = FString::Printf(TEXT("You were gone for %d days!"),
					OfflineTime.GetDays());
				PC->ShowNotification(TimeMessage, 5.0f);
			}
		}
	}

	return LoadedGame;
}

bool UVroomVroomSaveGame::DoesSaveGameExist(const FString& SlotName, int32 UserIndex)
{
	return UGameplayStatics::DoesSaveGameExist(SlotName, UserIndex);
}

bool UVroomVroomSaveGame::DeleteSaveGame(const FString& SlotName, int32 UserIndex)
{
	bool bSuccess = UGameplayStatics::DeleteGameInSlot(SlotName, UserIndex);

	if (bSuccess)
	{
		UE_LOG(LogTemp, Warning, TEXT("Save game deleted: %s"), *SlotName);
	}
	else
	{
		UE_LOG(LogTemp, Error, TEXT("Failed to delete save game: %s"), *SlotName);
	}

	return bSuccess;
}

TArray<FString> UVroomVroomSaveGame::GetAllSaveGameSlots()
{
	TArray<FString> SaveSlots;

	// Check for multiple save slots
	for (int32 i = 0; i < 10; i++)
	{
		FString SlotName = FString::Printf(TEXT("VroomVroomSave_%d"), i);
		if (DoesSaveGameExist(SlotName, 0))
		{
			SaveSlots.Add(SlotName);
		}
	}

	// Also check the default slot
	if (DoesSaveGameExist("VroomVroomSave", 0))
	{
		SaveSlots.Add("VroomVroomSave");
	}

	UE_LOG(LogTemp, Warning, TEXT("Found %d save game slots"), SaveSlots.Num());

	return SaveSlots;
}