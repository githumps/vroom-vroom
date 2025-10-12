// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "VroomVroomGameInstance.generated.h"

UENUM(BlueprintType)
enum class EVroomGameState : uint8
{
	MainMenu		UMETA(DisplayName = "Main Menu"),
	Driving			UMETA(DisplayName = "Driving"),
	BeingArrested	UMETA(DisplayName = "Being Arrested"),
	Courtroom		UMETA(DisplayName = "In Court"),
	Prison			UMETA(DisplayName = "In Prison"),
	Released		UMETA(DisplayName = "Released")
};

USTRUCT(BlueprintType)
struct FVroomPlayerProfile
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FString PlayerName;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 TotalArrests;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 CurrentPrisonSentenceDays;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FDateTime LastPlayTime;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FDateTime PrisonReleaseTime;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float MoneyInWallet;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 CigarettesOwned;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	TArray<FString> PrisonTattoos;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	TMap<FString, int32> GangReputation;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	bool bHasEscapedBefore;

	FVroomPlayerProfile()
	{
		PlayerName = "New Inmate";
		TotalArrests = 0;
		CurrentPrisonSentenceDays = 0;
		MoneyInWallet = 100.0f;
		CigarettesOwned = 0;
		bHasEscapedBefore = false;
	}
};

UCLASS()
class VROOMVROOM_API UVroomVroomGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	UVroomVroomGameInstance();

	virtual void Init() override;
	virtual void Shutdown() override;

	// Game State Management
	UFUNCTION(BlueprintCallable, Category = "Game State")
	void SetGameState(EVroomGameState NewState);

	UFUNCTION(BlueprintCallable, Category = "Game State")
	EVroomGameState GetCurrentGameState() const { return CurrentGameState; }

	UFUNCTION(BlueprintCallable, Category = "Game State")
	void TransitionToCourtroom();

	UFUNCTION(BlueprintCallable, Category = "Game State")
	void TransitionToPrison(int32 SentenceDays);

	UFUNCTION(BlueprintCallable, Category = "Game State")
	void ReleaseFromPrison();

	// Player Profile
	UFUNCTION(BlueprintCallable, Category = "Player")
	FVroomPlayerProfile& GetPlayerProfile() { return PlayerProfile; }

	UFUNCTION(BlueprintCallable, Category = "Player")
	void SavePlayerProfile();

	UFUNCTION(BlueprintCallable, Category = "Player")
	void LoadPlayerProfile();

	// Real-time Clock
	UFUNCTION(BlueprintCallable, Category = "Time")
	FDateTime GetRealWorldTime() const;

	UFUNCTION(BlueprintCallable, Category = "Time")
	int32 CalculateOfflinePrisonDays() const;

	UFUNCTION(BlueprintCallable, Category = "Time")
	void ProcessOfflineProgression();

	// Police System
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float PoliceAggressionLevel;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	int32 ActivePoliceChases;

	// Prison System
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Prison")
	TMap<FString, float> PrisonerRelationships;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Prison")
	FString CurrentCellmateName;

protected:
	UPROPERTY(BlueprintReadOnly, Category = "Game State")
	EVroomGameState CurrentGameState;

	UPROPERTY()
	FVroomPlayerProfile PlayerProfile;

	// Level transition management
	void LoadLevel(const FString& LevelName);

	// Save slot name
	const FString SaveSlotName = "VroomVroomSaveSlot";
};