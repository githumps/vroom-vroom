// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "VroomVroomGameInstance.h"
#include "VroomVroomGameMode.generated.h"

class APoliceVehicle;
class AVroomVroomCharacter;

UCLASS()
class VROOMVROOM_API AVroomVroomGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AVroomVroomGameMode();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaSeconds) override;
	virtual void InitGame(const FString& MapName, const FString& Options, FString& ErrorMessage) override;

	// Police System
	UFUNCTION(BlueprintCallable, Category = "Police")
	void SpawnPoliceUnit(const FVector& Location);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void InitiatePoliceChase(AVroomVroomCharacter* Target);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void ArrestPlayer(AVroomVroomCharacter* Player);

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Police")
	TSubclassOf<APoliceVehicle> PoliceVehicleClass;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	int32 MaxPoliceUnits;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float PoliceSpawnRadius;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float PoliceResponseTime;

	// Prison System
	UFUNCTION(BlueprintCallable, Category = "Prison")
	void StartPrisonRoutine();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void EndPrisonRoutine();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void ProcessPrisonActivity(const FString& ActivityName);

	// Courtroom System
	UFUNCTION(BlueprintCallable, Category = "Court")
	void StartCourtProceedings();

	UFUNCTION(BlueprintCallable, Category = "Court")
	void ProcessCourtPaperwork(float CompletionPercentage);

	UFUNCTION(BlueprintCallable, Category = "Court")
	void IssueVerdict(int32 SentenceDays);

	// Time Management
	UFUNCTION(BlueprintCallable, Category = "Time")
	float GetGameTimeHour() const;

	UFUNCTION(BlueprintCallable, Category = "Time")
	FString GetGameTimeString() const;

	// Save/Load
	UFUNCTION(BlueprintCallable, Category = "Save")
	void SaveGame();

	UFUNCTION(BlueprintCallable, Category = "Save")
	void LoadGame();

protected:
	UPROPERTY()
	UVroomVroomGameInstance* GameInstance;

	UPROPERTY()
	TArray<APoliceVehicle*> ActivePoliceUnits;

	// Time tracking
	float CurrentGameHour;
	float TimeMultiplier;

	// Prison routine tracking
	bool bPrisonRoutineActive;
	FString CurrentPrisonActivity;

	// Courtroom tracking
	float CourtroomPaperworkProgress;
	int32 JudgeIrritationLevel;

private:
	void UpdateGameTime(float DeltaSeconds);
	void ManagePolicePresence();
	void CheckForTrafficViolations();
};