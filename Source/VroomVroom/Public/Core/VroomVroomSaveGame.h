// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/SaveGame.h"
#include "VroomVroomGameInstance.h"
#include "VroomVroomPlayerState.h"
#include "VroomVroomCharacter.h"
#include "VroomVroomSaveGame.generated.h"

USTRUCT(BlueprintType)
struct FSavedVehicle
{
	GENERATED_BODY()

	UPROPERTY()
	FString VehicleType;

	UPROPERTY()
	FVector Location;

	UPROPERTY()
	FRotator Rotation;

	UPROPERTY()
	float Fuel;

	UPROPERTY()
	float Damage;

	UPROPERTY()
	bool bIsPlayerVehicle;

	FSavedVehicle()
	{
		VehicleType = "Sedan";
		Location = FVector::ZeroVector;
		Rotation = FRotator::ZeroRotator;
		Fuel = 100.0f;
		Damage = 0.0f;
		bIsPlayerVehicle = false;
	}
};

USTRUCT(BlueprintType)
struct FSavedPrisonData
{
	GENERATED_BODY()

	UPROPERTY()
	FString CellNumber;

	UPROPERTY()
	FString CellmateName;

	UPROPERTY()
	TMap<FString, float> InmateRelationships;

	UPROPERTY()
	TArray<FString> CompletedBooks;

	UPROPERTY()
	TArray<FString> ReceivedLetters;

	UPROPERTY()
	TArray<FString> SentLetters;

	UPROPERTY()
	int32 CurrentBookPage;

	UPROPERTY()
	FString CurrentBookTitle;

	UPROPERTY()
	bool bHasHackedFirewall;

	UPROPERTY()
	TArray<FString> DiscoveredWebsites;

	FSavedPrisonData()
	{
		CellNumber = "Block A, Cell 42";
		CellmateName = "Big Mike";
		CurrentBookPage = 0;
		CurrentBookTitle = "";
		bHasHackedFirewall = false;
	}
};

USTRUCT(BlueprintType)
struct FSavedCourtData
{
	GENERATED_BODY()

	UPROPERTY()
	TArray<FString> CompletedForms;

	UPROPERTY()
	FString LawyerContactName;

	UPROPERTY()
	bool bMadePhoneCall;

	UPROPERTY()
	int32 JudgeIrritationLevel;

	UPROPERTY()
	int32 CurrentSentence;

	FSavedCourtData()
	{
		LawyerContactName = "";
		bMadePhoneCall = false;
		JudgeIrritationLevel = 0;
		CurrentSentence = 0;
	}
};

UCLASS()
class VROOMVROOM_API UVroomVroomSaveGame : public USaveGame
{
	GENERATED_BODY()

public:
	UVroomVroomSaveGame();

	// Save Info
	UPROPERTY(VisibleAnywhere, Category = "Save Info")
	FString SaveSlotName;

	UPROPERTY(VisibleAnywhere, Category = "Save Info")
	uint32 UserIndex;

	UPROPERTY(VisibleAnywhere, Category = "Save Info")
	FDateTime SaveTimestamp;

	UPROPERTY(VisibleAnywhere, Category = "Save Info")
	int32 SaveVersion;

	UPROPERTY(VisibleAnywhere, Category = "Save Info")
	FString SaveDescription;

	// Player Profile Data
	UPROPERTY(VisibleAnywhere, Category = "Player")
	FVroomPlayerProfile PlayerProfile;

	// Character Data
	UPROPERTY(VisibleAnywhere, Category = "Character")
	FCharacterCustomization CharacterCustomization;

	UPROPERTY(VisibleAnywhere, Category = "Character")
	FVector LastPlayerLocation;

	UPROPERTY(VisibleAnywhere, Category = "Character")
	FRotator LastPlayerRotation;

	UPROPERTY(VisibleAnywhere, Category = "Character")
	int32 CurrentHealth;

	UPROPERTY(VisibleAnywhere, Category = "Character")
	int32 CurrentStamina;

	UPROPERTY(VisibleAnywhere, Category = "Character")
	int32 CurrentStrength;

	// Game State Data
	UPROPERTY(VisibleAnywhere, Category = "Game State")
	EVroomGameState CurrentGameState;

	UPROPERTY(VisibleAnywhere, Category = "Game State")
	FDateTime LastPlayedRealTime;

	UPROPERTY(VisibleAnywhere, Category = "Game State")
	float TotalPlayTime;

	// Criminal Record
	UPROPERTY(VisibleAnywhere, Category = "Criminal")
	TArray<FCriminalRecord> CriminalHistory;

	UPROPERTY(VisibleAnywhere, Category = "Criminal")
	int32 CurrentWantedLevel;

	UPROPERTY(VisibleAnywhere, Category = "Criminal")
	float TotalFinesOwed;

	// Prison Data
	UPROPERTY(VisibleAnywhere, Category = "Prison")
	FPrisonStats PrisonStatistics;

	UPROPERTY(VisibleAnywhere, Category = "Prison")
	FSavedPrisonData PrisonData;

	UPROPERTY(VisibleAnywhere, Category = "Prison")
	int32 CigarettesOwned;

	UPROPERTY(VisibleAnywhere, Category = "Prison")
	float PrisonReputation;

	UPROPERTY(VisibleAnywhere, Category = "Prison")
	FString CurrentGang;

	UPROPERTY(VisibleAnywhere, Category = "Prison")
	TMap<FString, float> GangRelationships;

	// Court Data
	UPROPERTY(VisibleAnywhere, Category = "Court")
	FSavedCourtData CourtData;

	// Driving Stats
	UPROPERTY(VisibleAnywhere, Category = "Driving")
	float TotalMilesDriven;

	UPROPERTY(VisibleAnywhere, Category = "Driving")
	int32 TrafficViolations;

	UPROPERTY(VisibleAnywhere, Category = "Driving")
	int32 PoliceEvasions;

	UPROPERTY(VisibleAnywhere, Category = "Driving")
	int32 VehiclesCrashed;

	UPROPERTY(VisibleAnywhere, Category = "Driving")
	float TopSpeed;

	// World Data
	UPROPERTY(VisibleAnywhere, Category = "World")
	TArray<FSavedVehicle> SavedVehicles;

	UPROPERTY(VisibleAnywhere, Category = "World")
	FString CurrentMapName;

	// Inventory
	UPROPERTY(VisibleAnywhere, Category = "Inventory")
	TArray<FString> Inventory;

	UPROPERTY(VisibleAnywhere, Category = "Inventory")
	TArray<FString> ContrabandItems;

	UPROPERTY(VisibleAnywhere, Category = "Inventory")
	float MoneyInWallet;

	// Achievements/Progress
	UPROPERTY(VisibleAnywhere, Category = "Progress")
	TArray<FString> UnlockedAchievements;

	UPROPERTY(VisibleAnywhere, Category = "Progress")
	TMap<FString, int32> StatisticsTracking;

	// Functions
	UFUNCTION(BlueprintCallable, Category = "Save Game")
	void UpdateFromGameState(UObject* WorldContextObject);

	UFUNCTION(BlueprintCallable, Category = "Save Game")
	void ApplyToGameState(UObject* WorldContextObject);

	UFUNCTION(BlueprintCallable, Category = "Save Game")
	FString GetSaveGameInfo() const;

	UFUNCTION(BlueprintCallable, Category = "Save Game")
	bool IsCompatibleVersion() const;

	// Static save/load helpers
	UFUNCTION(BlueprintCallable, Category = "Save Game", meta = (WorldContext = "WorldContextObject"))
	static bool SaveGameToSlot(UObject* WorldContextObject, const FString& SlotName, int32 InUserIndex);

	UFUNCTION(BlueprintCallable, Category = "Save Game", meta = (WorldContext = "WorldContextObject"))
	static UVroomVroomSaveGame* LoadGameFromSlot(UObject* WorldContextObject, const FString& SlotName, int32 InUserIndex);

	UFUNCTION(BlueprintCallable, Category = "Save Game")
	static bool DoesSaveGameExist(const FString& SlotName, int32 InUserIndex);

	UFUNCTION(BlueprintCallable, Category = "Save Game")
	static bool DeleteSaveGame(const FString& SlotName, int32 InUserIndex);

	UFUNCTION(BlueprintCallable, Category = "Save Game")
	static TArray<FString> GetAllSaveGameSlots();

private:
	static constexpr int32 CURRENT_SAVE_VERSION = 1;
};