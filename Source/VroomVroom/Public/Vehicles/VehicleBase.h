// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "VehicleBase.generated.h"

class UCameraComponent;
class USpringArmComponent;
class UBoxComponent;
class UAudioComponent;
class AVroomVroomCharacter;

UENUM(BlueprintType)
enum class EVehicleType : uint8
{
	Sedan			UMETA(DisplayName = "Sedan"),
	SUV				UMETA(DisplayName = "SUV"),
	SportsCar		UMETA(DisplayName = "Sports Car"),
	Truck			UMETA(DisplayName = "Truck"),
	PoliceSedan		UMETA(DisplayName = "Police Sedan"),
	PoliceSUV		UMETA(DisplayName = "Police SUV"),
	PoliceInterceptor UMETA(DisplayName = "Police Interceptor"),
	PrisonBus		UMETA(DisplayName = "Prison Transport Bus")
};

USTRUCT(BlueprintType)
struct FVehicleStats
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float MaxSpeed;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Acceleration;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float BrakeForce;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float TurnRate;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Health;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Fuel;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float FuelConsumptionRate;

	FVehicleStats()
	{
		MaxSpeed = 200.0f; // km/h
		Acceleration = 10.0f;
		BrakeForce = 20.0f;
		TurnRate = 45.0f;
		Health = 100.0f;
		Fuel = 100.0f;
		FuelConsumptionRate = 0.1f; // per second
	}
};

UCLASS()
class VROOMVROOM_API AVehicleBase : public APawn
{
	GENERATED_BODY()

public:
	AVehicleBase();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	// Components
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UBoxComponent* VehicleBody;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UBoxComponent* EntryTrigger;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	USpringArmComponent* SpringArm;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	UCameraComponent* FollowCamera;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	UCameraComponent* InteriorCamera;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Audio")
	UAudioComponent* EngineAudioComponent;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Audio")
	UAudioComponent* HornAudioComponent;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Audio")
	UAudioComponent* SirenAudioComponent;

	// Vehicle Properties
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Vehicle")
	EVehicleType VehicleType;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Vehicle")
	FVehicleStats VehicleStats;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	float CurrentSpeed;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bEngineRunning;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bLightsOn;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bSirenOn;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bIsLocked;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bIsPoliceVehicle;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bIsOccupied;

	// Driver
	UPROPERTY(BlueprintReadOnly, Category = "Driver")
	AVroomVroomCharacter* CurrentDriver;

	// Input
	UPROPERTY(BlueprintReadOnly, Category = "Input")
	float ThrottleInput;

	UPROPERTY(BlueprintReadOnly, Category = "Input")
	float SteeringInput;

	UPROPERTY(BlueprintReadOnly, Category = "Input")
	float BrakeInput;

	// Functions
	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void StartEngine();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void StopEngine();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual bool CanEnterVehicle(AVroomVroomCharacter* Character);

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual bool EnterVehicle(AVroomVroomCharacter* Character);

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual bool ExitVehicle();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void ToggleLights();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void ToggleSiren();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void HonkHorn();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void LockVehicle();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void UnlockVehicle();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	void ApplyVehicleDamage(float DamageAmount);

	// Override APawn's TakeDamage
	virtual float TakeDamage(float DamageAmount, struct FDamageEvent const& DamageEvent, AController* EventInstigator, AActor* DamageCauser) override;

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void Refuel(float FuelAmount);

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	virtual void Repair(float RepairAmount);

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	float GetSpeedKMH() const;

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	float GetSpeedMPH() const;

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	bool IsPoliceVehicle() const { return bIsPoliceVehicle; }

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	bool CanBeStolen() const;

	// Police Interaction
	UFUNCTION(BlueprintCallable, Category = "Police")
	void TriggerPoliceChase();

	UFUNCTION(BlueprintCallable, Category = "Police")
	int32 CalculateTrafficViolations();

	// Input handlers
	virtual void MoveForward(float Value);
	virtual void MoveRight(float Value);
	virtual void Brake(float Value);
	virtual void Handbrake();
	virtual void LookUp(float Value);
	virtual void Turn(float Value);
	void RequestExitVehicle(); // Void wrapper for input binding

	// Camera
	UFUNCTION(BlueprintCallable, Category = "Camera")
	void SwitchCamera();

	UFUNCTION(BlueprintCallable, Category = "Camera")
	void SetExteriorView();

	UFUNCTION(BlueprintCallable, Category = "Camera")
	void SetInteriorView();

protected:
	// Movement
	virtual void UpdateMovement(float DeltaTime);
	virtual void UpdatePhysics(float DeltaTime);
	virtual void ConsumeFuel(float DeltaTime);
	virtual void UpdateEngineSound();

	// Entry/Exit
	UFUNCTION()
	void OnEntryTriggerBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
		UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	UFUNCTION()
	void OnEntryTriggerEndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
		UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	// Camera state
	bool bUseInteriorCamera;

	// Characters near vehicle
	TArray<AVroomVroomCharacter*> NearbyCharacters;

	// Movement values
	FVector CurrentVelocity;
	FRotator CurrentRotation;
	float CurrentSteeringAngle;

	// Sound parameters
	float EngineRPM;
	float MinEngineRPM;
	float MaxEngineRPM;

private:
	void InitializeVehicle();
	void SetupPoliceVehicle();
};