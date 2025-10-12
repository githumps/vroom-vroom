// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Vehicles/VehicleSpawner.h"
#include "Vehicles/PoliceVehicle.h"
#include "Engine/World.h"
#include "Kismet/GameplayStatics.h"

AVehicleSpawner::AVehicleSpawner()
{
	PrimaryActorTick.bCanEverTick = false;

	// Default settings
	InitialCivilianVehicles = 10;
	InitialPoliceVehicles = 20; // WAY TOO MANY
	SpawnRadius = 5000.0f;
	bSpawnOnRoads = true;
}

void AVehicleSpawner::BeginPlay()
{
	Super::BeginPlay();

	// Spawn initial vehicles
	SpawnCivilianTraffic();

	// Spawn EXCESSIVE police presence
	SpawnPoliceWave(InitialPoliceVehicles);

	UE_LOG(LogTemp, Warning, TEXT("Vehicle Spawner: Spawned %d civilian vehicles and %d police units"),
		InitialCivilianVehicles, InitialPoliceVehicles);
}

AVehicleBase* AVehicleSpawner::SpawnVehicle(TSubclassOf<AVehicleBase> VehicleClass, const FVector& Location, const FRotator& Rotation)
{
	if (!VehicleClass)
	{
		UE_LOG(LogTemp, Error, TEXT("No vehicle class specified for spawning"));
		return nullptr;
	}

	FActorSpawnParameters SpawnParams;
	SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn;

	AVehicleBase* NewVehicle = GetWorld()->SpawnActor<AVehicleBase>(VehicleClass, Location, Rotation, SpawnParams);

	if (NewVehicle)
	{
		SpawnedVehicles.Add(NewVehicle);
		UE_LOG(LogTemp, Warning, TEXT("Spawned vehicle at %s"), *Location.ToString());
	}

	return NewVehicle;
}

void AVehicleSpawner::SpawnPoliceWave(int32 NumUnits)
{
	if (!PoliceVehicleClass)
	{
		// Create default police vehicle class
		PoliceVehicleClass = APoliceVehicle::StaticClass();
	}

	for (int32 i = 0; i < NumUnits; i++)
	{
		FVector SpawnLocation = GetRandomSpawnLocation();
		FRotator SpawnRotation = FRotator(0, FMath::RandRange(0.0f, 360.0f), 0);

		AVehicleBase* PoliceUnit = SpawnVehicle(PoliceVehicleClass, SpawnLocation, SpawnRotation);

		if (PoliceUnit)
		{
			// Set as police vehicle
			PoliceUnit->bIsPoliceVehicle = true;
			PoliceUnit->VehicleType = EVehicleType::PoliceSedan;

			// Start with sirens on for some units
			if (FMath::RandBool())
			{
				PoliceUnit->ToggleSiren();
			}
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("POLICE WAVE SPAWNED: %d units!"), NumUnits);
}

void AVehicleSpawner::SpawnCivilianTraffic()
{
	if (!CivilianVehicleClass)
	{
		// Use base vehicle class if no specific civilian class
		CivilianVehicleClass = AVehicleBase::StaticClass();
	}

	for (int32 i = 0; i < InitialCivilianVehicles; i++)
	{
		FVector SpawnLocation = GetRandomSpawnLocation();
		FRotator SpawnRotation = FRotator(0, FMath::RandRange(0.0f, 360.0f), 0);

		AVehicleBase* CivilianVehicle = SpawnVehicle(CivilianVehicleClass, SpawnLocation, SpawnRotation);

		if (CivilianVehicle)
		{
			// Randomize vehicle type
			int32 TypeIndex = FMath::RandRange(0, 3);
			switch (TypeIndex)
			{
				case 0:
					CivilianVehicle->VehicleType = EVehicleType::Sedan;
					break;
				case 1:
					CivilianVehicle->VehicleType = EVehicleType::SUV;
					break;
				case 2:
					CivilianVehicle->VehicleType = EVehicleType::SportsCar;
					break;
				case 3:
					CivilianVehicle->VehicleType = EVehicleType::Truck;
					break;
			}

			// Some vehicles are locked
			if (FMath::RandRange(0, 100) < 30)
			{
				CivilianVehicle->LockVehicle();
			}
		}
	}
}

void AVehicleSpawner::SpawnPrisonTransport()
{
	if (!PrisonBusClass)
	{
		PrisonBusClass = AVehicleBase::StaticClass();
	}

	FVector SpawnLocation = GetRandomSpawnLocation();
	FRotator SpawnRotation = FRotator::ZeroRotator;

	AVehicleBase* PrisonBus = SpawnVehicle(PrisonBusClass, SpawnLocation, SpawnRotation);

	if (PrisonBus)
	{
		PrisonBus->VehicleType = EVehicleType::PrisonBus;
		PrisonBus->bIsPoliceVehicle = true; // Treated as police vehicle
		PrisonBus->LockVehicle();

		UE_LOG(LogTemp, Warning, TEXT("Prison transport spawned"));
	}
}

FVector AVehicleSpawner::GetRandomSpawnLocation()
{
	// Get player location as reference
	FVector PlayerLocation = FVector::ZeroVector;
	if (APlayerController* PC = UGameplayStatics::GetPlayerController(GetWorld(), 0))
	{
		if (APawn* PlayerPawn = PC->GetPawn())
		{
			PlayerLocation = PlayerPawn->GetActorLocation();
		}
	}

	// Spawn within radius of player but not too close
	float MinDistance = 500.0f;
	float MaxDistance = SpawnRadius;

	float Distance = FMath::RandRange(MinDistance, MaxDistance);
	float Angle = FMath::RandRange(0.0f, 360.0f);

	FVector SpawnLocation = PlayerLocation;
	SpawnLocation.X += Distance * FMath::Cos(FMath::DegreesToRadians(Angle));
	SpawnLocation.Y += Distance * FMath::Sin(FMath::DegreesToRadians(Angle));
	SpawnLocation.Z += 100.0f; // Spawn above ground

	// Trace down to find ground
	FHitResult Hit;
	FVector TraceStart = SpawnLocation;
	FVector TraceEnd = SpawnLocation - FVector(0, 0, 1000.0f);

	if (GetWorld()->LineTraceSingleByChannel(Hit, TraceStart, TraceEnd, ECC_WorldStatic))
	{
		SpawnLocation = Hit.Location + FVector(0, 0, 100.0f);
	}

	return SpawnLocation;
}

void AVehicleSpawner::CleanupDestroyedVehicles()
{
	SpawnedVehicles.RemoveAll([](AVehicleBase* Vehicle)
	{
		return !IsValid(Vehicle);
	});
}