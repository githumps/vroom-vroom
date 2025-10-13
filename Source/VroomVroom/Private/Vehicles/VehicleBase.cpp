// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Vehicles/VehicleBase.h"
#include "Gameplay/VroomVroomCharacter.h"
#include "Core/VroomVroomGameMode.h"
#include "Core/VroomVroomPlayerController.h"
#include "Components/BoxComponent.h"
#include "Components/AudioComponent.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "Engine/World.h"
#include "Kismet/GameplayStatics.h"
#include "DrawDebugHelpers.h"

AVehicleBase::AVehicleBase()
{
	PrimaryActorTick.bCanEverTick = true;

	// Create vehicle body
	VehicleBody = CreateDefaultSubobject<UBoxComponent>(TEXT("VehicleBody"));
	RootComponent = VehicleBody;
	VehicleBody->SetBoxExtent(FVector(200.0f, 90.0f, 50.0f));
	VehicleBody->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
	VehicleBody->SetCollisionResponseToAllChannels(ECR_Block);

	// Create entry trigger
	EntryTrigger = CreateDefaultSubobject<UBoxComponent>(TEXT("EntryTrigger"));
	EntryTrigger->SetupAttachment(RootComponent);
	EntryTrigger->SetBoxExtent(FVector(250.0f, 150.0f, 100.0f));
	EntryTrigger->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
	EntryTrigger->SetCollisionResponseToAllChannels(ECR_Ignore);
	EntryTrigger->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);

	// Create spring arm for exterior camera
	SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
	SpringArm->SetupAttachment(RootComponent);
	SpringArm->TargetArmLength = 600.0f;
	SpringArm->SetRelativeRotation(FRotator(-15.0f, 0.0f, 0.0f));
	SpringArm->bUsePawnControlRotation = true;

	// Create exterior follow camera
	FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
	FollowCamera->SetupAttachment(SpringArm);

	// Create interior camera
	InteriorCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("InteriorCamera"));
	InteriorCamera->SetupAttachment(RootComponent);
	InteriorCamera->SetRelativeLocation(FVector(-50.0f, 0.0f, 80.0f));

	// Create audio components
	EngineAudioComponent = CreateDefaultSubobject<UAudioComponent>(TEXT("EngineAudio"));
	EngineAudioComponent->SetupAttachment(RootComponent);
	EngineAudioComponent->bAutoActivate = false;

	HornAudioComponent = CreateDefaultSubobject<UAudioComponent>(TEXT("HornAudio"));
	HornAudioComponent->SetupAttachment(RootComponent);
	HornAudioComponent->bAutoActivate = false;

	SirenAudioComponent = CreateDefaultSubobject<UAudioComponent>(TEXT("SirenAudio"));
	SirenAudioComponent->SetupAttachment(RootComponent);
	SirenAudioComponent->bAutoActivate = false;

	// Initialize vehicle properties
	VehicleType = EVehicleType::Sedan;
	CurrentSpeed = 0.0f;
	bEngineRunning = false;
	bLightsOn = false;
	bSirenOn = false;
	bIsLocked = false;
	bIsPoliceVehicle = false;
	bIsOccupied = false;
	bUseInteriorCamera = false;

	// Initialize input
	ThrottleInput = 0.0f;
	SteeringInput = 0.0f;
	BrakeInput = 0.0f;

	// Engine parameters
	MinEngineRPM = 1000.0f;
	MaxEngineRPM = 6000.0f;
	EngineRPM = MinEngineRPM;

	// Movement
	CurrentSteeringAngle = 0.0f;
}

void AVehicleBase::BeginPlay()
{
	Super::BeginPlay();

	InitializeVehicle();

	// Bind overlap events
	if (EntryTrigger)
	{
		EntryTrigger->OnComponentBeginOverlap.AddDynamic(this, &AVehicleBase::OnEntryTriggerBeginOverlap);
		EntryTrigger->OnComponentEndOverlap.AddDynamic(this, &AVehicleBase::OnEntryTriggerEndOverlap);
	}

	// Check if this is a police vehicle
	if (VehicleType == EVehicleType::PoliceSedan ||
		VehicleType == EVehicleType::PoliceSUV ||
		VehicleType == EVehicleType::PoliceInterceptor)
	{
		SetupPoliceVehicle();
	}

	UE_LOG(LogTemp, Warning, TEXT("Vehicle spawned: %s"), *GetName());
}

void AVehicleBase::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (bEngineRunning && bIsOccupied)
	{
		UpdateMovement(DeltaTime);
		UpdatePhysics(DeltaTime);
		ConsumeFuel(DeltaTime);
		UpdateEngineSound();

		// Check for violations if police are nearby
		if (CurrentSpeed > 120.0f) // Speed limit
		{
			if (FMath::RandRange(0, 100) < 5) // 5% chance per tick
			{
				TriggerPoliceChase();
			}
		}
	}

	// Debug display
	DrawDebugString(GetWorld(), GetActorLocation() + FVector(0, 0, 200),
		FString::Printf(TEXT("Speed: %.1f km/h\nFuel: %.1f%%"),
			GetSpeedKMH(), VehicleStats.Fuel), nullptr, FColor::White, DeltaTime);
}

void AVehicleBase::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	// Driving inputs
	PlayerInputComponent->BindAxis("MoveForward", this, &AVehicleBase::MoveForward);
	PlayerInputComponent->BindAxis("MoveRight", this, &AVehicleBase::MoveRight);
	PlayerInputComponent->BindAxis("Brake", this, &AVehicleBase::Brake);
	PlayerInputComponent->BindAction("Handbrake", IE_Pressed, this, &AVehicleBase::Handbrake);

	// Camera controls
	PlayerInputComponent->BindAxis("Turn", this, &AVehicleBase::Turn);
	PlayerInputComponent->BindAxis("LookUp", this, &AVehicleBase::LookUp);
	PlayerInputComponent->BindAction("SwitchCamera", IE_Pressed, this, &AVehicleBase::SwitchCamera);

	// Vehicle controls
	PlayerInputComponent->BindAction("Horn", IE_Pressed, this, &AVehicleBase::HonkHorn);
	PlayerInputComponent->BindAction("ToggleLights", IE_Pressed, this, &AVehicleBase::ToggleLights);
	PlayerInputComponent->BindAction("ExitVehicle", IE_Pressed, this, &AVehicleBase::RequestExitVehicle);

	// Police vehicle controls
	if (bIsPoliceVehicle)
	{
		PlayerInputComponent->BindAction("ToggleSiren", IE_Pressed, this, &AVehicleBase::ToggleSiren);
	}
}

void AVehicleBase::StartEngine()
{
	if (VehicleStats.Fuel <= 0.0f)
	{
		UE_LOG(LogTemp, Warning, TEXT("No fuel! Can't start engine"));
		return;
	}

	bEngineRunning = true;
	if (EngineAudioComponent && !EngineAudioComponent->IsPlaying())
	{
		EngineAudioComponent->Play();
	}

	UE_LOG(LogTemp, Warning, TEXT("Engine started"));
}

void AVehicleBase::StopEngine()
{
	bEngineRunning = false;
	if (EngineAudioComponent && EngineAudioComponent->IsPlaying())
	{
		EngineAudioComponent->Stop();
	}

	UE_LOG(LogTemp, Warning, TEXT("Engine stopped"));
}

bool AVehicleBase::CanEnterVehicle(AVroomVroomCharacter* Character)
{
	if (!Character)
	{
		return false;
	}

	// Can't enter if occupied
	if (bIsOccupied)
	{
		return false;
	}

	// Can't enter if locked (unless it's a police vehicle and player is being arrested)
	if (bIsLocked)
	{
		if (!bIsPoliceVehicle || Character->CurrentState != ECharacterState::BeingArrested)
		{
			return false;
		}
	}

	// Must be close enough
	float Distance = FVector::Dist(Character->GetActorLocation(), GetActorLocation());
	if (Distance > 300.0f)
	{
		return false;
	}

	return true;
}

bool AVehicleBase::EnterVehicle(AVroomVroomCharacter* Character)
{
	if (!CanEnterVehicle(Character))
	{
		return false;
	}

	CurrentDriver = Character;
	bIsOccupied = true;

	// Hide character and disable collision
	Character->SetActorHiddenInGame(true);
	Character->SetActorEnableCollision(false);

	// Possess this vehicle pawn
	if (APlayerController* PC = Cast<APlayerController>(Character->GetController()))
	{
		PC->Possess(this);
		PC->SetViewTarget(this);
	}

	// Start engine automatically
	StartEngine();

	// Switch to appropriate camera
	SetExteriorView();

	// Update character state
	Character->bIsInVehicle = true;
	Character->CurrentVehicle = this;
	Character->SetCharacterState(ECharacterState::Driving);

	// If stealing a non-police vehicle, increase wanted level
	if (!bIsPoliceVehicle && !bIsLocked)
	{
		Character->WantedLevel++;
		UE_LOG(LogTemp, Warning, TEXT("Vehicle theft! Wanted level: %d"), Character->WantedLevel);

		// High chance of triggering police
		if (FMath::RandRange(0, 100) < 80)
		{
			TriggerPoliceChase();
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("Character entered vehicle"));

	return true;
}

bool AVehicleBase::ExitVehicle()
{
	if (!bIsOccupied || !CurrentDriver)
	{
		return false;
	}

	// Stop the vehicle first
	if (CurrentSpeed > 10.0f)
	{
		UE_LOG(LogTemp, Warning, TEXT("Vehicle moving too fast to exit!"));
		return false;
	}

	// Find safe exit position
	FVector ExitLocation = GetActorLocation() + (GetActorRightVector() * 200.0f);
	ExitLocation.Z += 100.0f;

	// Show character and re-enable collision
	CurrentDriver->SetActorHiddenInGame(false);
	CurrentDriver->SetActorEnableCollision(true);
	CurrentDriver->SetActorLocation(ExitLocation);

	// Return control to character
	if (APlayerController* PC = Cast<APlayerController>(GetController()))
	{
		PC->Possess(CurrentDriver);
		PC->SetViewTarget(CurrentDriver);
	}

	// Update character state
	CurrentDriver->bIsInVehicle = false;
	CurrentDriver->CurrentVehicle = nullptr;
	CurrentDriver->SetCharacterState(ECharacterState::OnFoot);

	// Clear driver reference
	AVroomVroomCharacter* ExitingDriver = CurrentDriver;
	CurrentDriver = nullptr;
	bIsOccupied = false;

	// Stop engine
	StopEngine();

	UE_LOG(LogTemp, Warning, TEXT("Character exited vehicle"));

	return true;
}

void AVehicleBase::ToggleLights()
{
	bLightsOn = !bLightsOn;
	UE_LOG(LogTemp, Warning, TEXT("Lights %s"), bLightsOn ? TEXT("ON") : TEXT("OFF"));
}

void AVehicleBase::ToggleSiren()
{
	if (!bIsPoliceVehicle)
	{
		return;
	}

	bSirenOn = !bSirenOn;

	if (SirenAudioComponent)
	{
		if (bSirenOn)
		{
			SirenAudioComponent->Play();
			UE_LOG(LogTemp, Warning, TEXT("SIREN ON - PULL OVER!"));
		}
		else
		{
			SirenAudioComponent->Stop();
		}
	}
}

void AVehicleBase::HonkHorn()
{
	if (HornAudioComponent)
	{
		HornAudioComponent->Play();
	}

	UE_LOG(LogTemp, Warning, TEXT("HONK!"));

	// Honking attracts police attention
	if (FMath::RandRange(0, 100) < 10)
	{
		UE_LOG(LogTemp, Warning, TEXT("Excessive honking detected by police"));
	}
}

void AVehicleBase::LockVehicle()
{
	bIsLocked = true;
	UE_LOG(LogTemp, Warning, TEXT("Vehicle locked"));
}

void AVehicleBase::UnlockVehicle()
{
	bIsLocked = false;
	UE_LOG(LogTemp, Warning, TEXT("Vehicle unlocked"));
}

// Override APawn's TakeDamage to handle vehicle damage
float AVehicleBase::TakeDamage(float DamageAmount, struct FDamageEvent const& DamageEvent, AController* EventInstigator, AActor* DamageCauser)
{
	const float ActualDamage = Super::TakeDamage(DamageAmount, DamageEvent, EventInstigator, DamageCauser);
	ApplyVehicleDamage(ActualDamage);
	return ActualDamage;
}

void AVehicleBase::ApplyVehicleDamage(float DamageAmount)
{
	VehicleStats.Health = FMath::Max(0.0f, VehicleStats.Health - DamageAmount);

	if (VehicleStats.Health <= 0.0f)
	{
		// Vehicle destroyed
		StopEngine();
		bEngineRunning = false;

		if (bIsOccupied)
		{
			ExitVehicle();
		}

		UE_LOG(LogTemp, Warning, TEXT("Vehicle destroyed!"));
	}
}

void AVehicleBase::Refuel(float FuelAmount)
{
	VehicleStats.Fuel = FMath::Min(100.0f, VehicleStats.Fuel + FuelAmount);
	UE_LOG(LogTemp, Warning, TEXT("Refueled to %.1f%%"), VehicleStats.Fuel);
}

void AVehicleBase::Repair(float RepairAmount)
{
	VehicleStats.Health = FMath::Min(100.0f, VehicleStats.Health + RepairAmount);
	UE_LOG(LogTemp, Warning, TEXT("Repaired to %.1f%% health"), VehicleStats.Health);
}

float AVehicleBase::GetSpeedKMH() const
{
	return CurrentSpeed;
}

float AVehicleBase::GetSpeedMPH() const
{
	return CurrentSpeed * 0.621371f;
}

bool AVehicleBase::CanBeStolen() const
{
	return !bIsLocked && !bIsPoliceVehicle && !bIsOccupied;
}

void AVehicleBase::TriggerPoliceChase()
{
	if (AVroomVroomGameMode* GameMode = Cast<AVroomVroomGameMode>(GetWorld()->GetAuthGameMode()))
	{
		if (CurrentDriver)
		{
			GameMode->InitiatePoliceChase(CurrentDriver);
			CurrentDriver->bIsBeingChased = true;
			CurrentDriver->WantedLevel = FMath::Min(5, CurrentDriver->WantedLevel + 1);
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("POLICE CHASE TRIGGERED!"));
}

int32 AVehicleBase::CalculateTrafficViolations()
{
	int32 Violations = 0;

	// Speeding
	if (CurrentSpeed > 120.0f)
	{
		Violations++;
	}

	// Extreme speeding
	if (CurrentSpeed > 180.0f)
	{
		Violations += 2;
	}

	// No lights at night
	if (!bLightsOn && GetWorld()->GetTimeSeconds() > 20.0f)
	{
		Violations++;
	}

	// Reckless driving (high speed + turning)
	if (CurrentSpeed > 100.0f && FMath::Abs(SteeringInput) > 0.5f)
	{
		Violations++;
	}

	return Violations;
}

void AVehicleBase::MoveForward(float Value)
{
	ThrottleInput = FMath::Clamp(Value, -1.0f, 1.0f);
}

void AVehicleBase::MoveRight(float Value)
{
	SteeringInput = FMath::Clamp(Value, -1.0f, 1.0f);
}

void AVehicleBase::Brake(float Value)
{
	BrakeInput = FMath::Clamp(Value, 0.0f, 1.0f);
}

void AVehicleBase::Handbrake()
{
	// Apply handbrake
	BrakeInput = 1.0f;
	UE_LOG(LogTemp, VeryVerbose, TEXT("Handbrake applied"));
}

void AVehicleBase::LookUp(float Value)
{
	if (APlayerController* PC = Cast<APlayerController>(Controller))
	{
		PC->AddPitchInput(Value);
	}
}

void AVehicleBase::Turn(float Value)
{
	if (APlayerController* PC = Cast<APlayerController>(Controller))
	{
		PC->AddYawInput(Value);
	}
}

void AVehicleBase::RequestExitVehicle()
{
	ExitVehicle();
}

void AVehicleBase::SwitchCamera()
{
	bUseInteriorCamera = !bUseInteriorCamera;

	if (bUseInteriorCamera)
	{
		SetInteriorView();
	}
	else
	{
		SetExteriorView();
	}
}

void AVehicleBase::SetExteriorView()
{
	if (FollowCamera && InteriorCamera)
	{
		FollowCamera->SetActive(true);
		InteriorCamera->SetActive(false);
		bUseInteriorCamera = false;
	}
}

void AVehicleBase::SetInteriorView()
{
	if (FollowCamera && InteriorCamera)
	{
		FollowCamera->SetActive(false);
		InteriorCamera->SetActive(true);
		bUseInteriorCamera = true;
	}
}

void AVehicleBase::UpdateMovement(float DeltaTime)
{
	if (!bEngineRunning)
	{
		return;
	}

	// Calculate acceleration
	float TargetSpeed = ThrottleInput * VehicleStats.MaxSpeed;

	// Apply brakes
	if (BrakeInput > 0.0f)
	{
		TargetSpeed = 0.0f;
		CurrentSpeed = FMath::FInterpTo(CurrentSpeed, TargetSpeed,
			DeltaTime, VehicleStats.BrakeForce);
	}
	else
	{
		// Accelerate/Decelerate
		CurrentSpeed = FMath::FInterpTo(CurrentSpeed, TargetSpeed,
			DeltaTime, VehicleStats.Acceleration);
	}

	// Apply steering
	if (FMath::Abs(CurrentSpeed) > 0.1f)
	{
		float SteerAmount = SteeringInput * VehicleStats.TurnRate;
		// Reduce steering at high speed
		SteerAmount *= FMath::Clamp(1.0f - (CurrentSpeed / VehicleStats.MaxSpeed) * 0.5f, 0.3f, 1.0f);

		CurrentSteeringAngle = FMath::FInterpTo(CurrentSteeringAngle, SteerAmount, DeltaTime, 5.0f);

		FRotator NewRotation = GetActorRotation();
		NewRotation.Yaw += CurrentSteeringAngle * DeltaTime;
		SetActorRotation(NewRotation);
	}

	// Move the vehicle
	FVector ForwardVector = GetActorForwardVector();
	FVector Movement = ForwardVector * CurrentSpeed * DeltaTime * 100.0f; // Convert to cm

	AddActorWorldOffset(Movement, true);

	// Update velocity for physics
	CurrentVelocity = Movement / DeltaTime;
}

void AVehicleBase::UpdatePhysics(float DeltaTime)
{
	// Simple friction when not accelerating
	if (FMath::Abs(ThrottleInput) < 0.1f && BrakeInput < 0.1f)
	{
		CurrentSpeed *= 0.98f;
	}

	// Gravity (simplified)
	FVector GravityForce = FVector(0, 0, -980.0f) * DeltaTime;
	AddActorWorldOffset(GravityForce, true);
}

void AVehicleBase::ConsumeFuel(float DeltaTime)
{
	if (!bEngineRunning)
	{
		return;
	}

	// Consume more fuel at higher speeds
	float ConsumptionRate = VehicleStats.FuelConsumptionRate;
	ConsumptionRate *= (1.0f + (CurrentSpeed / VehicleStats.MaxSpeed));

	VehicleStats.Fuel = FMath::Max(0.0f, VehicleStats.Fuel - ConsumptionRate * DeltaTime);

	if (VehicleStats.Fuel <= 0.0f)
	{
		StopEngine();
		UE_LOG(LogTemp, Warning, TEXT("Out of fuel!"));
	}
}

void AVehicleBase::UpdateEngineSound()
{
	if (!EngineAudioComponent || !bEngineRunning)
	{
		return;
	}

	// Calculate RPM based on speed
	float SpeedPercent = FMath::Abs(CurrentSpeed) / VehicleStats.MaxSpeed;
	EngineRPM = FMath::Lerp(MinEngineRPM, MaxEngineRPM, SpeedPercent);

	// Update audio pitch based on RPM
	float Pitch = 0.5f + (EngineRPM / MaxEngineRPM) * 1.5f;
	EngineAudioComponent->SetPitchMultiplier(Pitch);

	// Update volume based on throttle
	float Volume = 0.3f + FMath::Abs(ThrottleInput) * 0.7f;
	EngineAudioComponent->SetVolumeMultiplier(Volume);
}

void AVehicleBase::OnEntryTriggerBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	AVroomVroomCharacter* Character = Cast<AVroomVroomCharacter>(OtherActor);
	if (Character && !Character->bIsInVehicle)
	{
		NearbyCharacters.AddUnique(Character);

		// Show interaction prompt
		UE_LOG(LogTemp, Warning, TEXT("Press F to enter %s"),
			bIsLocked ? TEXT("(LOCKED)") : TEXT("vehicle"));
	}
}

void AVehicleBase::OnEntryTriggerEndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
	AVroomVroomCharacter* Character = Cast<AVroomVroomCharacter>(OtherActor);
	if (Character)
	{
		NearbyCharacters.Remove(Character);
	}
}

void AVehicleBase::InitializeVehicle()
{
	// Set stats based on vehicle type
	switch (VehicleType)
	{
		case EVehicleType::Sedan:
			VehicleStats.MaxSpeed = 180.0f;
			VehicleStats.Acceleration = 8.0f;
			break;

		case EVehicleType::SUV:
			VehicleStats.MaxSpeed = 160.0f;
			VehicleStats.Acceleration = 6.0f;
			VehicleStats.Health = 120.0f;
			break;

		case EVehicleType::SportsCar:
			VehicleStats.MaxSpeed = 280.0f;
			VehicleStats.Acceleration = 15.0f;
			VehicleStats.TurnRate = 60.0f;
			break;

		case EVehicleType::Truck:
			VehicleStats.MaxSpeed = 140.0f;
			VehicleStats.Acceleration = 4.0f;
			VehicleStats.Health = 150.0f;
			break;

		case EVehicleType::PoliceSedan:
			VehicleStats.MaxSpeed = 220.0f;
			VehicleStats.Acceleration = 12.0f;
			VehicleStats.BrakeForce = 25.0f;
			break;

		case EVehicleType::PoliceInterceptor:
			VehicleStats.MaxSpeed = 260.0f;
			VehicleStats.Acceleration = 18.0f;
			VehicleStats.BrakeForce = 30.0f;
			VehicleStats.TurnRate = 55.0f;
			break;

		case EVehicleType::PrisonBus:
			VehicleStats.MaxSpeed = 100.0f;
			VehicleStats.Acceleration = 3.0f;
			VehicleStats.Health = 200.0f;
			break;
	}
}

void AVehicleBase::SetupPoliceVehicle()
{
	bIsPoliceVehicle = true;
	bIsLocked = false; // Police vehicles aren't locked
	bLightsOn = true;

	// Police vehicles have more fuel capacity
	VehicleStats.Fuel = 150.0f;

	UE_LOG(LogTemp, Warning, TEXT("Police vehicle initialized: %s"), *GetName());
}