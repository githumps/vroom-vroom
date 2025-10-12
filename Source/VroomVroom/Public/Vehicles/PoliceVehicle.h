// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Vehicles/VehicleBase.h"
#include "PoliceVehicle.generated.h"

class AVroomVroomCharacter;
class USpotLightComponent;

UENUM(BlueprintType)
enum class EPoliceState : uint8
{
	Patrol			UMETA(DisplayName = "Patrolling"),
	Pursuit			UMETA(DisplayName = "In Pursuit"),
	Responding		UMETA(DisplayName = "Responding to Call"),
	Blocking		UMETA(DisplayName = "Blocking Road"),
	Arresting		UMETA(DisplayName = "Making Arrest"),
	Idle			UMETA(DisplayName = "Idle")
};

UCLASS()
class VROOMVROOM_API APoliceVehicle : public AVehicleBase
{
	GENERATED_BODY()

public:
	APoliceVehicle();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;

	// Police Lights
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Police")
	USpotLightComponent* LeftEmergencyLight;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Police")
	USpotLightComponent* RightEmergencyLight;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Police")
	USpotLightComponent* Searchlight;

	// Police Properties
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	EPoliceState CurrentPoliceState;

	UPROPERTY(BlueprintReadOnly, Category = "Police")
	AVroomVroomCharacter* PursuitTarget;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float PursuitSpeed;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float DetectionRange;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float ArrestRange;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Police")
	float AggressionLevel;

	UPROPERTY(BlueprintReadOnly, Category = "Police")
	bool bIsAggressive;

	UPROPERTY(BlueprintReadOnly, Category = "Police")
	int32 BackupUnitsRequested;

	// Police Functions
	UFUNCTION(BlueprintCallable, Category = "Police")
	void StartPursuit(AVroomVroomCharacter* Target);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void EndPursuit();

	UFUNCTION(BlueprintCallable, Category = "Police")
	void RequestBackup(int32 UnitsNeeded);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void PerformPITManeuver();

	UFUNCTION(BlueprintCallable, Category = "Police")
	void DeploySpikeSt;

	UFUNCTION(BlueprintCallable, Category = "Police")
	void SetRoadblock();

	UFUNCTION(BlueprintCallable, Category = "Police")
	bool AttemptArrest(AVroomVroomCharacter* Suspect);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void ScanForViolations();

	UFUNCTION(BlueprintCallable, Category = "Police")
	void IssueTicket(AVroomVroomCharacter* Driver, const FString& Violation);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void TransportToStation(AVroomVroomCharacter* Arrestee);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void ActivateEmergencyLights(bool bActivate);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void UseSearchlight(const FVector& TargetLocation);

	UFUNCTION(BlueprintCallable, Category = "Police")
	void BroadcastDispatch(const FString& Message);

	// Override base functions
	virtual void ToggleSiren() override;
	virtual bool EnterVehicle(AVroomVroomCharacter* Character) override;

	// AI Behavior
	UFUNCTION(BlueprintCallable, Category = "AI")
	void UpdateAIBehavior(float DeltaTime);

	UFUNCTION(BlueprintCallable, Category = "AI")
	void PatrolBehavior(float DeltaTime);

	UFUNCTION(BlueprintCallable, Category = "AI")
	void PursuitBehavior(float DeltaTime);

	UFUNCTION(BlueprintCallable, Category = "AI")
	bool ShouldPursue(AVroomVroomCharacter* Suspect);

	UFUNCTION(BlueprintCallable, Category = "AI")
	float CalculateThreatLevel(AVroomVroomCharacter* Suspect);

protected:
	// Light control
	void UpdateEmergencyLights(float DeltaTime);
	void FlashLights();

	// Pursuit mechanics
	void UpdatePursuit(float DeltaTime);
	void CalculatePursuitPath();
	bool IsTargetInSight();

	// Detection
	void ScanForSuspects(float DeltaTime);
	bool DetectViolation(AVehicleBase* Vehicle);

	// Timers
	float TimeSincePursuitStart;
	float LightFlashTimer;
	bool bLightsFlashState;

	// Patrol route
	TArray<FVector> PatrolPoints;
	int32 CurrentPatrolPoint;

	// Detected violations
	TArray<AActor*> DetectedViolators;
};