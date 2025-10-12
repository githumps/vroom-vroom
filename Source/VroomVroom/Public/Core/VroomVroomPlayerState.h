// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerState.h"
#include "VroomVroomPlayerState.generated.h"

USTRUCT(BlueprintType)
struct FCriminalRecord
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite)
	FDateTime ArrestDate;

	UPROPERTY(BlueprintReadWrite)
	FString Offense;

	UPROPERTY(BlueprintReadWrite)
	int32 SentenceDays;

	UPROPERTY(BlueprintReadWrite)
	bool bServedFullSentence;

	FCriminalRecord()
	{
		ArrestDate = FDateTime::Now();
		Offense = "Reckless Driving";
		SentenceDays = 1;
		bServedFullSentence = false;
	}
};

USTRUCT(BlueprintType)
struct FPrisonStats
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite)
	int32 TotalDaysServed;

	UPROPERTY(BlueprintReadWrite)
	int32 FightsWon;

	UPROPERTY(BlueprintReadWrite)
	int32 FightsLost;

	UPROPERTY(BlueprintReadWrite)
	int32 BooksRead;

	UPROPERTY(BlueprintReadWrite)
	int32 LettersSent;

	UPROPERTY(BlueprintReadWrite)
	int32 LettersReceived;

	UPROPERTY(BlueprintReadWrite)
	int32 TattoosReceived;

	UPROPERTY(BlueprintReadWrite)
	int32 EscapeAttempts;

	UPROPERTY(BlueprintReadWrite)
	int32 SuccessfulEscapes;

	UPROPERTY(BlueprintReadWrite)
	int32 SolitaryConfinementDays;

	FPrisonStats()
	{
		TotalDaysServed = 0;
		FightsWon = 0;
		FightsLost = 0;
		BooksRead = 0;
		LettersSent = 0;
		LettersReceived = 0;
		TattoosReceived = 0;
		EscapeAttempts = 0;
		SuccessfulEscapes = 0;
		SolitaryConfinementDays = 0;
	}
};

UCLASS()
class VROOMVROOM_API AVroomVroomPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	AVroomVroomPlayerState();

	// Criminal Record
	UPROPERTY(BlueprintReadWrite, Replicated)
	TArray<FCriminalRecord> CriminalHistory;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 TotalArrests;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 CurrentWantedLevel;

	UPROPERTY(BlueprintReadWrite, Replicated)
	float TotalFinesOwed;

	// Prison Stats
	UPROPERTY(BlueprintReadWrite, Replicated)
	FPrisonStats PrisonStatistics;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 CigarettesOwned;

	UPROPERTY(BlueprintReadWrite, Replicated)
	float PrisonReputation;

	UPROPERTY(BlueprintReadWrite, Replicated)
	FString CurrentGang;

	UPROPERTY(BlueprintReadWrite, Replicated)
	TMap<FString, float> GangRelationships;

	// Driving Stats
	UPROPERTY(BlueprintReadWrite, Replicated)
	float TotalMilesDriven;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 TrafficViolations;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 PoliceEvasions;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 VehiclesCrashed;

	UPROPERTY(BlueprintReadWrite, Replicated)
	float TopSpeed;

	// Player Inventory
	UPROPERTY(BlueprintReadWrite, Replicated)
	TArray<FString> Inventory;

	UPROPERTY(BlueprintReadWrite, Replicated)
	TArray<FString> ContrabandItems;

	UPROPERTY(BlueprintReadWrite, Replicated)
	float MoneyInWallet;

	// Character Info
	UPROPERTY(BlueprintReadWrite, Replicated)
	TArray<FString> PermanentTattoos;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 HealthStatus;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 StaminaLevel;

	UPROPERTY(BlueprintReadWrite, Replicated)
	int32 StrengthLevel;

	// Functions
	UFUNCTION(BlueprintCallable, Category = "Criminal Record")
	void AddArrest(const FString& Offense, int32 SentenceDays);

	UFUNCTION(BlueprintCallable, Category = "Criminal Record")
	void UpdateWantedLevel(int32 Delta);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void AddPrisonTime(int32 Days);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void ModifyReputation(float Amount);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void JoinGang(const FString& GangName);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void RecordFight(bool bWon);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void RecordEscapeAttempt(bool bSuccessful);

	UFUNCTION(BlueprintCallable, Category = "Inventory")
	void AddItem(const FString& ItemName, bool bIsContraband = false);

	UFUNCTION(BlueprintCallable, Category = "Inventory")
	bool RemoveItem(const FString& ItemName);

	UFUNCTION(BlueprintCallable, Category = "Inventory")
	bool HasItem(const FString& ItemName) const;

	UFUNCTION(BlueprintCallable, Category = "Money")
	void AddMoney(float Amount);

	UFUNCTION(BlueprintCallable, Category = "Money")
	bool SpendMoney(float Amount);

	UFUNCTION(BlueprintCallable, Category = "Character")
	void AddTattoo(const FString& TattooDesign);

	UFUNCTION(BlueprintCallable, Category = "Character")
	void ImproveStrength(int32 Amount);

	UFUNCTION(BlueprintCallable, Category = "Character")
	void ImproveStamina(int32 Amount);

	UFUNCTION(BlueprintCallable, Category = "Stats")
	FString GetStatsSummary() const;

	// Replication
	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

protected:
	virtual void BeginPlay() override;
};