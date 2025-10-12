// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "VroomVroomGameInstance.h"
#include "VroomVroomGameState.generated.h"

class APoliceVehicle;
class APrisoner;

USTRUCT(BlueprintType)
struct FPolicePresence
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite)
	int32 TotalUnitsActive;

	UPROPERTY(BlueprintReadWrite)
	int32 UnitsInPursuit;

	UPROPERTY(BlueprintReadWrite)
	float AverageProximityToPlayer;

	UPROPERTY(BlueprintReadWrite)
	float PoliceAggressionLevel;

	FPolicePresence()
	{
		TotalUnitsActive = 50; // WAY too many
		UnitsInPursuit = 0;
		AverageProximityToPlayer = 100.0f; // They're always nearby
		PoliceAggressionLevel = 10.0f; // Maximum aggression
	}
};

USTRUCT(BlueprintType)
struct FPrisonState
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite)
	FString CurrentActivity;

	UPROPERTY(BlueprintReadWrite)
	float TimeUntilNextActivity;

	UPROPERTY(BlueprintReadWrite)
	int32 TotalInmates;

	UPROPERTY(BlueprintReadWrite)
	int32 GuardsOnDuty;

	UPROPERTY(BlueprintReadWrite)
	bool bLockdownActive;

	UPROPERTY(BlueprintReadWrite)
	TMap<FString, int32> GangMemberCounts;

	FPrisonState()
	{
		CurrentActivity = "Free Time";
		TimeUntilNextActivity = 60.0f;
		TotalInmates = 500;
		GuardsOnDuty = 100;
		bLockdownActive = false;
	}
};

USTRUCT(BlueprintType)
struct FCourtState
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite)
	FString JudgeName;

	UPROPERTY(BlueprintReadWrite)
	int32 JudgeMood; // 0-100, lower is angrier

	UPROPERTY(BlueprintReadWrite)
	float PaperworkCompletionPercent;

	UPROPERTY(BlueprintReadWrite)
	int32 FormsRemaining;

	UPROPERTY(BlueprintReadWrite)
	bool bLawyerPresent;

	UPROPERTY(BlueprintReadWrite)
	FString ProsecutorName;

	FCourtState()
	{
		JudgeName = "Judge Hardcastle";
		JudgeMood = 30; // Usually irritated
		PaperworkCompletionPercent = 0.0f;
		FormsRemaining = 47; // SO MUCH PAPERWORK
		bLawyerPresent = false;
		ProsecutorName = "District Attorney Conviction";
	}
};

UCLASS()
class VROOMVROOM_API AVroomVroomGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	AVroomVroomGameState();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaSeconds) override;

	// Game State
	UPROPERTY(BlueprintReadOnly, Replicated)
	EVroomGameState CurrentGamePhase;

	// World Time (synced to real time)
	UPROPERTY(BlueprintReadOnly, Replicated)
	FDateTime GameWorldTime;

	UPROPERTY(BlueprintReadOnly, Replicated)
	float DayNightCycle; // 0.0 = midnight, 0.5 = noon, 1.0 = midnight

	// Police State
	UPROPERTY(BlueprintReadOnly, Replicated)
	FPolicePresence PoliceStatus;

	UPROPERTY(BlueprintReadOnly, Replicated)
	TArray<FVector> PoliceUnitLocations;

	UPROPERTY(BlueprintReadOnly, Replicated)
	int32 TotalArrestsMade;

	// Prison State
	UPROPERTY(BlueprintReadOnly, Replicated)
	FPrisonState PrisonStatus;

	UPROPERTY(BlueprintReadOnly, Replicated)
	TMap<FString, float> InmateRelationships;

	// Court State
	UPROPERTY(BlueprintReadOnly, Replicated)
	FCourtState CourtStatus;

	// Global Statistics
	UPROPERTY(BlueprintReadOnly, Replicated)
	int32 TotalPlayersArrested;

	UPROPERTY(BlueprintReadOnly, Replicated)
	int32 TotalPlayersInPrison;

	UPROPERTY(BlueprintReadOnly, Replicated)
	int32 TotalEscapes;

	UPROPERTY(BlueprintReadOnly, Replicated)
	float AverageSentenceLength;

	// Functions
	UFUNCTION(BlueprintCallable, Category = "Game State")
	void UpdateGamePhase(EVroomGameState NewPhase);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void SpawnPoliceWave(int32 NumUnits);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void IncreasePoliceAggression(float Amount);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void RecordArrest();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void StartPrisonActivity(const FString& ActivityName);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void TriggerPrisonEvent(const FString& EventType);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void UpdateGangPower(const FString& GangName, int32 MemberDelta);

	UFUNCTION(BlueprintCallable, Category = "Court")
	void UpdateJudgeMood(int32 MoodDelta);

	UFUNCTION(BlueprintCallable, Category = "Court")
	void CompleteForm(const FString& FormName);

	UFUNCTION(BlueprintCallable, Category = "Time")
	void SyncToRealWorldTime();

	UFUNCTION(BlueprintCallable, Category = "Time")
	FString GetFormattedGameTime() const;

	UFUNCTION(BlueprintCallable, Category = "Statistics")
	FString GetWorldStatistics() const;

	// Events
	UFUNCTION(BlueprintImplementableEvent, Category = "Events")
	void OnPrisonRiot();

	UFUNCTION(BlueprintImplementableEvent, Category = "Events")
	void OnPrisonLockdown();

	UFUNCTION(BlueprintImplementableEvent, Category = "Events")
	void OnMassPoliceDeployment();

	// Replication
	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

protected:
	void UpdateDayNightCycle(float DeltaSeconds);
	void ManagePoliceDeployment();
	void ProcessPrisonSchedule();
	void CheckForRandomEvents();

private:
	float TimeSinceLastPoliceSpawn;
	float TimeSinceLastPrisonEvent;
	bool bIsNightTime;
};