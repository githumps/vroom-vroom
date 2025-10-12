// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "VehicleBase.h"
#include "VehicleSpawner.generated.h"

UCLASS()
class VROOMVROOM_API AVehicleSpawner : public AActor
{
	GENERATED_BODY()

public:
	AVehicleSpawner();

protected:
	virtual void BeginPlay() override;

public:
	// Vehicle classes to spawn
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	TSubclassOf<AVehicleBase> CivilianVehicleClass;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	TSubclassOf<AVehicleBase> PoliceVehicleClass;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	TSubclassOf<AVehicleBase> PrisonBusClass;

	// Spawn settings
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	int32 InitialCivilianVehicles;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	int32 InitialPoliceVehicles;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	float SpawnRadius;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Spawner")
	bool bSpawnOnRoads;

	// Functions
	UFUNCTION(BlueprintCallable, Category = "Spawner")
	AVehicleBase* SpawnVehicle(TSubclassOf<AVehicleBase> VehicleClass, const FVector& Location, const FRotator& Rotation);

	UFUNCTION(BlueprintCallable, Category = "Spawner")
	void SpawnPoliceWave(int32 NumUnits);

	UFUNCTION(BlueprintCallable, Category = "Spawner")
	void SpawnCivilianTraffic();

	UFUNCTION(BlueprintCallable, Category = "Spawner")
	void SpawnPrisonTransport();

	UFUNCTION(BlueprintCallable, Category = "Spawner")
	FVector GetRandomSpawnLocation();

private:
	TArray<AVehicleBase*> SpawnedVehicles;
	void CleanupDestroyedVehicles();
};