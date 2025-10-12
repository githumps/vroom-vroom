// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Vehicles/PoliceVehicle.h"
#include "Gameplay/VroomVroomCharacter.h"
#include "Core/VroomVroomGameMode.h"
#include "Core/VroomVroomPlayerState.h"
#include "Components/SpotLightComponent.h"
#include "Kismet/GameplayStatics.h"
#include "DrawDebugHelpers.h"
#include "Engine/World.h"

APoliceVehicle::APoliceVehicle()
{
	// Set as police vehicle
	bIsPoliceVehicle = true;
	VehicleType = EVehicleType::PoliceSedan;

	// Create emergency lights
	LeftEmergencyLight = CreateDefaultSubobject<USpotLightComponent>(TEXT("LeftEmergencyLight"));
	LeftEmergencyLight->SetupAttachment(RootComponent);
	LeftEmergencyLight->SetRelativeLocation(FVector(100.0f, -50.0f, 100.0f));
	LeftEmergencyLight->SetLightColor(FLinearColor::Red);
	LeftEmergencyLight->SetIntensity(5000.0f);
	LeftEmergencyLight->SetOuterConeAngle(80.0f);
	LeftEmergencyLight->SetVisibility(false);

	RightEmergencyLight = CreateDefaultSubobject<USpotLightComponent>(TEXT("RightEmergencyLight"));
	RightEmergencyLight->SetupAttachment(RootComponent);
	RightEmergencyLight->SetRelativeLocation(FVector(100.0f, 50.0f, 100.0f));
	RightEmergencyLight->SetLightColor(FLinearColor::Blue);
	RightEmergencyLight->SetIntensity(5000.0f);
	RightEmergencyLight->SetOuterConeAngle(80.0f);
	RightEmergencyLight->SetVisibility(false);

	Searchlight = CreateDefaultSubobject<USpotLightComponent>(TEXT("Searchlight"));
	Searchlight->SetupAttachment(RootComponent);
	Searchlight->SetRelativeLocation(FVector(50.0f, -70.0f, 80.0f));
	Searchlight->SetLightColor(FLinearColor::White);
	Searchlight->SetIntensity(10000.0f);
	Searchlight->SetOuterConeAngle(30.0f);
	Searchlight->SetVisibility(false);

	// Police properties
	CurrentPoliceState = EPoliceState::Patrol;
	PursuitSpeed = 250.0f;
	DetectionRange = 2000.0f;
	ArrestRange = 200.0f;
	AggressionLevel = 10.0f; // MAX AGGRESSION
	bIsAggressive = true;
	BackupUnitsRequested = 0;

	// Timers
	TimeSincePursuitStart = 0.0f;
	LightFlashTimer = 0.0f;
	bLightsFlashState = false;
	CurrentPatrolPoint = 0;
}

void APoliceVehicle::BeginPlay()
{
	Super::BeginPlay();

	// Set up as aggressive police vehicle
	VehicleStats.MaxSpeed = 240.0f;
	VehicleStats.Acceleration = 15.0f;
	VehicleStats.BrakeForce = 30.0f;

	// Start with engine running
	StartEngine();

	// Generate patrol route
	for (int32 i = 0; i < 5; i++)
	{
		FVector PatrolPoint = GetActorLocation() + FVector(
			FMath::RandRange(-5000.0f, 5000.0f),
			FMath::RandRange(-5000.0f, 5000.0f),
			0.0f
		);
		PatrolPoints.Add(PatrolPoint);
	}

	UE_LOG(LogTemp, Warning, TEXT("Police unit %s activated - MAXIMUM AGGRESSION MODE"), *GetName());
}

void APoliceVehicle::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// AI behavior update
	if (!bIsOccupied) // AI controlled
	{
		UpdateAIBehavior(DeltaTime);
	}

	// Update emergency lights
	if (bSirenOn)
	{
		UpdateEmergencyLights(DeltaTime);
	}

	// Scan for violations
	ScanForSuspects(DeltaTime);

	// Update pursuit if active
	if (CurrentPoliceState == EPoliceState::Pursuit && PursuitTarget)
	{
		UpdatePursuit(DeltaTime);
	}
}

void APoliceVehicle::StartPursuit(AVroomVroomCharacter* Target)
{
	if (!Target)
	{
		return;
	}

	PursuitTarget = Target;
	CurrentPoliceState = EPoliceState::Pursuit;
	TimeSincePursuitStart = 0.0f;

	// Activate sirens and lights
	ActivateEmergencyLights(true);
	bSirenOn = true;

	// Request backup immediately (because there's NEVER enough cops)
	RequestBackup(FMath::RandRange(2, 5));

	// Notify game mode
	if (AVroomVroomGameMode* GameMode = Cast<AVroomVroomGameMode>(GetWorld()->GetAuthGameMode()))
	{
		GameMode->InitiatePoliceChase(Target);
	}

	BroadcastDispatch(FString::Printf(TEXT("Unit %s in pursuit of suspect!"), *GetName()));
	UE_LOG(LogTemp, Warning, TEXT("POLICE PURSUIT INITIATED! Target: %s"), *Target->GetName());
}

void APoliceVehicle::EndPursuit()
{
	PursuitTarget = nullptr;
	CurrentPoliceState = EPoliceState::Patrol;

	// Deactivate sirens after a delay
	FTimerHandle SirenTimer;
	GetWorld()->GetTimerManager().SetTimer(SirenTimer, [this]()
	{
		if (CurrentPoliceState != EPoliceState::Pursuit)
		{
			ActivateEmergencyLights(false);
			bSirenOn = false;
		}
	}, 5.0f, false);

	BroadcastDispatch(TEXT("Pursuit ended"));
	UE_LOG(LogTemp, Warning, TEXT("Pursuit ended"));
}

void APoliceVehicle::RequestBackup(int32 UnitsNeeded)
{
	BackupUnitsRequested = UnitsNeeded;

	BroadcastDispatch(FString::Printf(TEXT("Requesting %d units for backup!"), UnitsNeeded));

	// Spawn backup units (because there's ALWAYS more cops available)
	if (AVroomVroomGameMode* GameMode = Cast<AVroomVroomGameMode>(GetWorld()->GetAuthGameMode()))
	{
		for (int32 i = 0; i < UnitsNeeded; i++)
		{
			FVector SpawnLocation = GetActorLocation() + FVector(
				FMath::RandRange(-1000.0f, 1000.0f),
				FMath::RandRange(-1000.0f, 1000.0f),
				100.0f
			);
			GameMode->SpawnPoliceUnit(SpawnLocation);
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("BACKUP REQUESTED: %d units en route!"), UnitsNeeded);
}

void APoliceVehicle::PerformPITManeuver()
{
	if (!PursuitTarget || !PursuitTarget->CurrentVehicle)
	{
		return;
	}

	float Distance = FVector::Dist(GetActorLocation(), PursuitTarget->CurrentVehicle->GetActorLocation());
	if (Distance < 300.0f)
	{
		// Apply force to target vehicle to spin it out
		FVector ImpactForce = GetActorRightVector() * 5000.0f;
		PursuitTarget->CurrentVehicle->AddActorWorldOffset(ImpactForce);

		BroadcastDispatch(TEXT("PIT maneuver executed!"));
		UE_LOG(LogTemp, Warning, TEXT("PIT MANEUVER!"));
	}
}

void APoliceVehicle::DeploySpikesTrip()
{
	// Deploy spike strip ahead of target
	if (PursuitTarget && PursuitTarget->CurrentVehicle)
	{
		// Damage target vehicle tires
		PursuitTarget->CurrentVehicle->VehicleStats.MaxSpeed *= 0.3f;
		PursuitTarget->CurrentVehicle->VehicleStats.TurnRate *= 0.5f;

		BroadcastDispatch(TEXT("Spike strip deployed!"));
		UE_LOG(LogTemp, Warning, TEXT("SPIKE STRIP DEPLOYED!"));
	}
}

void APoliceVehicle::SetRoadblock()
{
	CurrentPoliceState = EPoliceState::Blocking;

	// Position vehicle perpendicular to road
	FRotator BlockRotation = GetActorRotation();
	BlockRotation.Yaw += 90.0f;
	SetActorRotation(BlockRotation);

	// Request more units for roadblock
	RequestBackup(3);

	BroadcastDispatch(TEXT("Roadblock established"));
	UE_LOG(LogTemp, Warning, TEXT("ROADBLOCK SET"));
}

bool APoliceVehicle::AttemptArrest(AVroomVroomCharacter* Suspect)
{
	if (!Suspect)
	{
		return false;
	}

	float Distance = FVector::Dist(GetActorLocation(), Suspect->GetActorLocation());
	if (Distance > ArrestRange)
	{
		return false;
	}

	CurrentPoliceState = EPoliceState::Arresting;

	// Force suspect to exit vehicle if in one
	if (Suspect->bIsInVehicle && Suspect->CurrentVehicle)
	{
		Suspect->CurrentVehicle->ExitVehicle();
	}

	// Arrest the suspect
	Suspect->GetArrested();

	// Transport to station
	TransportToStation(Suspect);

	BroadcastDispatch(FString::Printf(TEXT("Suspect arrested: %s"), *Suspect->GetName()));
	UE_LOG(LogTemp, Warning, TEXT("ARREST MADE!"));

	return true;
}

void APoliceVehicle::ScanForViolations()
{
	// Look for any violations in detection range
	TArray<AActor*> FoundActors;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AVehicleBase::StaticClass(), FoundActors);

	for (AActor* Actor : FoundActors)
	{
		AVehicleBase* Vehicle = Cast<AVehicleBase>(Actor);
		if (Vehicle && Vehicle != this && !Vehicle->IsPoliceVehicle())
		{
			if (DetectViolation(Vehicle))
			{
				// Start pursuit immediately
				if (Vehicle->CurrentDriver)
				{
					StartPursuit(Vehicle->CurrentDriver);
					break;
				}
			}
		}
	}
}

void APoliceVehicle::IssueTicket(AVroomVroomCharacter* Driver, const FString& Violation)
{
	if (!Driver)
	{
		return;
	}

	// Add to criminal record
	if (AVroomVroomPlayerState* PlayerState = Driver->GetPlayerState<AVroomVroomPlayerState>())
	{
		PlayerState->TrafficViolations++;
		PlayerState->TotalFinesOwed += FMath::RandRange(100.0f, 500.0f);

		UE_LOG(LogTemp, Warning, TEXT("TICKET ISSUED: %s - Fine: $%.2f"),
			*Violation, PlayerState->TotalFinesOwed);
	}
}

void APoliceVehicle::TransportToStation(AVroomVroomCharacter* Arrestee)
{
	if (!Arrestee)
	{
		return;
	}

	// Force arrestee into police vehicle
	Arrestee->EnterVehicle(this);
	Arrestee->SetCharacterState(ECharacterState::BeingArrested);

	// Lock the vehicle so they can't escape
	LockVehicle();

	// Head to station (trigger court scene)
	CurrentPoliceState = EPoliceState::Responding;

	UE_LOG(LogTemp, Warning, TEXT("Transporting arrestee to station"));
}

void APoliceVehicle::ActivateEmergencyLights(bool bActivate)
{
	if (LeftEmergencyLight)
	{
		LeftEmergencyLight->SetVisibility(bActivate);
	}

	if (RightEmergencyLight)
	{
		RightEmergencyLight->SetVisibility(bActivate);
	}

	bLightsOn = bActivate;

	if (bActivate && SirenAudioComponent && !SirenAudioComponent->IsPlaying())
	{
		SirenAudioComponent->Play();
	}
}

void APoliceVehicle::UseSearchlight(const FVector& TargetLocation)
{
	if (Searchlight)
	{
		Searchlight->SetVisibility(true);

		// Aim searchlight at target
		FVector Direction = (TargetLocation - Searchlight->GetComponentLocation()).GetSafeNormal();
		FRotator LightRotation = Direction.Rotation();
		Searchlight->SetWorldRotation(LightRotation);
	}
}

void APoliceVehicle::BroadcastDispatch(const FString& Message)
{
	FString DispatchMessage = FString::Printf(TEXT("[DISPATCH] Unit %s: %s"), *GetName(), *Message);
	UE_LOG(LogTemp, Warning, TEXT("%s"), *DispatchMessage);

	// In a real implementation, this would broadcast to all police units
}

void APoliceVehicle::ToggleSiren()
{
	Super::ToggleSiren();

	// Also toggle emergency lights with siren
	ActivateEmergencyLights(bSirenOn);
}

bool APoliceVehicle::EnterVehicle(AVroomVroomCharacter* Character)
{
	// Only allow entry if character is police or being arrested
	if (Character->CurrentState == ECharacterState::BeingArrested)
	{
		return Super::EnterVehicle(Character);
	}

	// Regular citizens can't enter police vehicles
	UE_LOG(LogTemp, Warning, TEXT("Cannot enter police vehicle!"));
	return false;
}

void APoliceVehicle::UpdateAIBehavior(float DeltaTime)
{
	switch (CurrentPoliceState)
	{
		case EPoliceState::Patrol:
			PatrolBehavior(DeltaTime);
			break;

		case EPoliceState::Pursuit:
			PursuitBehavior(DeltaTime);
			break;

		case EPoliceState::Responding:
			// Head to incident location
			break;

		case EPoliceState::Blocking:
			// Stay in position
			CurrentSpeed = 0.0f;
			break;

		case EPoliceState::Arresting:
			// Stop and arrest
			CurrentSpeed = 0.0f;
			break;

		case EPoliceState::Idle:
			// Do nothing
			break;
	}
}

void APoliceVehicle::PatrolBehavior(float DeltaTime)
{
	if (PatrolPoints.Num() == 0)
	{
		return;
	}

	// Move to current patrol point
	FVector TargetLocation = PatrolPoints[CurrentPatrolPoint];
	FVector Direction = (TargetLocation - GetActorLocation()).GetSafeNormal();

	// Simple movement toward patrol point
	ThrottleInput = 0.5f; // Cruising speed

	// Simple steering
	FVector Forward = GetActorForwardVector();
	float Dot = FVector::DotProduct(Forward, Direction);
	FVector Cross = FVector::CrossProduct(Forward, Direction);

	SteeringInput = FMath::Clamp(Cross.Z * 2.0f, -1.0f, 1.0f);

	// Check if reached patrol point
	float Distance = FVector::Dist2D(GetActorLocation(), TargetLocation);
	if (Distance < 500.0f)
	{
		CurrentPatrolPoint = (CurrentPatrolPoint + 1) % PatrolPoints.Num();
		UE_LOG(LogTemp, VeryVerbose, TEXT("Reached patrol point %d"), CurrentPatrolPoint);
	}

	// Always scanning for violations while patrolling
	ScanForViolations();
}

void APoliceVehicle::PursuitBehavior(float DeltaTime)
{
	if (!PursuitTarget || !PursuitTarget->CurrentVehicle)
	{
		EndPursuit();
		return;
	}

	TimeSincePursuitStart += DeltaTime;

	// Calculate path to target
	FVector TargetLocation = PursuitTarget->CurrentVehicle->GetActorLocation();
	FVector Direction = (TargetLocation - GetActorLocation()).GetSafeNormal();

	// Aggressive pursuit - full throttle
	ThrottleInput = 1.0f;

	// Calculate steering
	FVector Forward = GetActorForwardVector();
	FVector Cross = FVector::CrossProduct(Forward, Direction);
	SteeringInput = FMath::Clamp(Cross.Z * 3.0f, -1.0f, 1.0f);

	// Check distance for arrest attempt
	float Distance = FVector::Dist(GetActorLocation(), TargetLocation);
	if (Distance < ArrestRange)
	{
		AttemptArrest(PursuitTarget);
	}
	else if (Distance < 400.0f && TimeSincePursuitStart > 10.0f)
	{
		// Try PIT maneuver after 10 seconds
		PerformPITManeuver();
	}

	// Request more backup if pursuit is taking too long
	if (FMath::Fmod(TimeSincePursuitStart, 30.0f) < DeltaTime)
	{
		RequestBackup(2);
	}

	// Draw debug line to target
	DrawDebugLine(GetWorld(), GetActorLocation(), TargetLocation, FColor::Red, false, 0.1f, 0, 5.0f);
}

bool APoliceVehicle::ShouldPursue(AVroomVroomCharacter* Suspect)
{
	if (!Suspect)
	{
		return false;
	}

	// ALWAYS pursue if:
	// - Wanted level > 0
	// - Speeding
	// - Any violation detected
	// - Looks suspicious (always)

	if (Suspect->WantedLevel > 0)
	{
		return true;
	}

	if (Suspect->bIsInVehicle && Suspect->CurrentVehicle)
	{
		if (Suspect->CurrentVehicle->GetSpeedKMH() > 100.0f)
		{
			return true;
		}
	}

	// 50% chance to pursue for "looking suspicious"
	if (FMath::RandRange(0, 100) < 50)
	{
		UE_LOG(LogTemp, Warning, TEXT("Suspect looks suspicious!"));
		return true;
	}

	return false;
}

float APoliceVehicle::CalculateThreatLevel(AVroomVroomCharacter* Suspect)
{
	if (!Suspect)
	{
		return 0.0f;
	}

	float ThreatLevel = 0.0f;

	// Wanted level adds significant threat
	ThreatLevel += Suspect->WantedLevel * 20.0f;

	// Speeding adds threat
	if (Suspect->bIsInVehicle && Suspect->CurrentVehicle)
	{
		float Speed = Suspect->CurrentVehicle->GetSpeedKMH();
		if (Speed > 120.0f)
		{
			ThreatLevel += (Speed - 120.0f) * 0.5f;
		}
	}

	// Being in a vehicle adds threat (might flee)
	if (Suspect->bIsInVehicle)
	{
		ThreatLevel += 10.0f;
	}

	// Previous arrests add threat
	if (AVroomVroomPlayerState* PlayerState = Suspect->GetPlayerState<AVroomVroomPlayerState>())
	{
		ThreatLevel += PlayerState->TotalArrests * 5.0f;
	}

	return FMath::Min(ThreatLevel, 100.0f);
}

void APoliceVehicle::UpdateEmergencyLights(float DeltaTime)
{
	LightFlashTimer += DeltaTime;

	if (LightFlashTimer > 0.2f) // Flash every 0.2 seconds
	{
		LightFlashTimer = 0.0f;
		bLightsFlashState = !bLightsFlashState;
		FlashLights();
	}
}

void APoliceVehicle::FlashLights()
{
	if (LeftEmergencyLight && RightEmergencyLight)
	{
		if (bLightsFlashState)
		{
			LeftEmergencyLight->SetLightColor(FLinearColor::Red);
			RightEmergencyLight->SetLightColor(FLinearColor::Blue);
		}
		else
		{
			LeftEmergencyLight->SetLightColor(FLinearColor::Blue);
			RightEmergencyLight->SetLightColor(FLinearColor::Red);
		}
	}
}

void APoliceVehicle::UpdatePursuit(float DeltaTime)
{
	if (!PursuitTarget)
	{
		return;
	}

	// Update pursuit path
	CalculatePursuitPath();

	// Check if we lost sight
	if (!IsTargetInSight())
	{
		// But we never really lose them because there's cops everywhere
		UseSearchlight(PursuitTarget->GetActorLocation());
	}
}

void APoliceVehicle::CalculatePursuitPath()
{
	// In a real implementation, this would use pathfinding
	// For now, direct pursuit
}

bool APoliceVehicle::IsTargetInSight()
{
	if (!PursuitTarget)
	{
		return false;
	}

	FHitResult Hit;
	FVector Start = GetActorLocation();
	FVector End = PursuitTarget->GetActorLocation();

	if (GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility))
	{
		return Hit.GetActor() == PursuitTarget ||
			   (PursuitTarget->CurrentVehicle && Hit.GetActor() == PursuitTarget->CurrentVehicle);
	}

	return false;
}

void APoliceVehicle::ScanForSuspects(float DeltaTime)
{
	// Find all characters in detection range
	TArray<AActor*> FoundActors;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AVroomVroomCharacter::StaticClass(), FoundActors);

	for (AActor* Actor : FoundActors)
	{
		AVroomVroomCharacter* Character = Cast<AVroomVroomCharacter>(Actor);
		if (Character)
		{
			float Distance = FVector::Dist(GetActorLocation(), Character->GetActorLocation());

			if (Distance < DetectionRange)
			{
				if (ShouldPursue(Character))
				{
					StartPursuit(Character);
					break;
				}
			}
		}
	}
}

bool APoliceVehicle::DetectViolation(AVehicleBase* Vehicle)
{
	if (!Vehicle || Vehicle->IsPoliceVehicle())
	{
		return false;
	}

	// Check for violations
	int32 Violations = Vehicle->CalculateTrafficViolations();

	// Also check for stolen vehicle
	if (!Vehicle->bIsLocked && Vehicle->bIsOccupied)
	{
		Violations++; // Assume it's stolen because why not
	}

	// Any violation triggers pursuit
	if (Violations > 0)
	{
		UE_LOG(LogTemp, Warning, TEXT("VIOLATIONS DETECTED: %d"), Violations);
		return true;
	}

	// Even without violations, still suspicious
	if (FMath::RandRange(0, 100) < 20) // 20% chance
	{
		UE_LOG(LogTemp, Warning, TEXT("Vehicle looks suspicious!"));
		return true;
	}

	return false;
}