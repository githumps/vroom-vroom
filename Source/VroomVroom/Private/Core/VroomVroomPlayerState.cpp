// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Core/VroomVroomPlayerState.h"
#include "Net/UnrealNetwork.h"
#include "Engine/World.h"

AVroomVroomPlayerState::AVroomVroomPlayerState()
{
	// Initialize stats
	TotalArrests = 0;
	CurrentWantedLevel = 0;
	TotalFinesOwed = 0.0f;

	// Prison stats
	CigarettesOwned = 0;
	PrisonReputation = 50.0f;
	CurrentGang = "None";

	// Driving stats
	TotalMilesDriven = 0.0f;
	TrafficViolations = 0;
	PoliceEvasions = 0;
	VehiclesCrashed = 0;
	TopSpeed = 0.0f;

	// Character stats
	MoneyInWallet = 100.0f;
	HealthStatus = 100;
	StaminaLevel = 50;
	StrengthLevel = 30;

	// Initialize gang relationships
	GangRelationships.Add("Aryan Brotherhood", 0.0f);
	GangRelationships.Add("Latin Kings", 0.0f);
	GangRelationships.Add("Crips", 0.0f);
	GangRelationships.Add("Bloods", 0.0f);
	GangRelationships.Add("Neutral", 50.0f);
}

void AVroomVroomPlayerState::BeginPlay()
{
	Super::BeginPlay();

	UE_LOG(LogTemp, Warning, TEXT("Player State Initialized - Criminal Record: %d arrests"), TotalArrests);
}

void AVroomVroomPlayerState::AddArrest(const FString& Offense, int32 SentenceDays)
{
	FCriminalRecord NewRecord;
	NewRecord.ArrestDate = FDateTime::Now();
	NewRecord.Offense = Offense;
	NewRecord.SentenceDays = SentenceDays;
	NewRecord.bServedFullSentence = false;

	CriminalHistory.Add(NewRecord);
	TotalArrests++;

	UE_LOG(LogTemp, Warning, TEXT("Added arrest #%d: %s - %d days"),
		TotalArrests, *Offense, SentenceDays);
}

void AVroomVroomPlayerState::UpdateWantedLevel(int32 Delta)
{
	CurrentWantedLevel = FMath::Clamp(CurrentWantedLevel + Delta, 0, 5);

	if (CurrentWantedLevel > 0)
	{
		UE_LOG(LogTemp, Warning, TEXT("Wanted Level: %d stars"), CurrentWantedLevel);
	}
}

void AVroomVroomPlayerState::AddPrisonTime(int32 Days)
{
	PrisonStatistics.TotalDaysServed += Days;

	UE_LOG(LogTemp, Warning, TEXT("Added %d days to prison record. Total: %d days"),
		Days, PrisonStatistics.TotalDaysServed);
}

void AVroomVroomPlayerState::ModifyReputation(float Amount)
{
	PrisonReputation = FMath::Clamp(PrisonReputation + Amount, 0.0f, 100.0f);

	if (Amount > 0)
	{
		UE_LOG(LogTemp, Warning, TEXT("Prison reputation increased to %.1f"), PrisonReputation);
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Prison reputation decreased to %.1f"), PrisonReputation);
	}
}

void AVroomVroomPlayerState::JoinGang(const FString& GangName)
{
	if (CurrentGang != "None")
	{
		// Leaving old gang reduces reputation with them
		if (GangRelationships.Contains(CurrentGang))
		{
			GangRelationships[CurrentGang] -= 50.0f;
		}
	}

	CurrentGang = GangName;

	// Joining new gang improves reputation with them
	if (GangRelationships.Contains(GangName))
	{
		GangRelationships[GangName] += 30.0f;
	}
	else
	{
		GangRelationships.Add(GangName, 30.0f);
	}

	UE_LOG(LogTemp, Warning, TEXT("Joined gang: %s"), *GangName);
}

void AVroomVroomPlayerState::RecordFight(bool bWon)
{
	if (bWon)
	{
		PrisonStatistics.FightsWon++;
		ModifyReputation(5.0f);
		UE_LOG(LogTemp, Warning, TEXT("Won a fight! Total wins: %d"), PrisonStatistics.FightsWon);
	}
	else
	{
		PrisonStatistics.FightsLost++;
		ModifyReputation(-3.0f);
		HealthStatus = FMath::Max(10, HealthStatus - 20);
		UE_LOG(LogTemp, Warning, TEXT("Lost a fight. Total losses: %d"), PrisonStatistics.FightsLost);
	}
}

void AVroomVroomPlayerState::RecordEscapeAttempt(bool bSuccessful)
{
	PrisonStatistics.EscapeAttempts++;

	if (bSuccessful)
	{
		PrisonStatistics.SuccessfulEscapes++;
		ModifyReputation(20.0f);
		UE_LOG(LogTemp, Warning, TEXT("ESCAPE SUCCESSFUL! Total escapes: %d"),
			PrisonStatistics.SuccessfulEscapes);
	}
	else
	{
		PrisonStatistics.SolitaryConfinementDays += 7;
		UE_LOG(LogTemp, Warning, TEXT("Escape failed! Solitary confinement: %d days"),
			PrisonStatistics.SolitaryConfinementDays);
	}
}

void AVroomVroomPlayerState::AddItem(const FString& ItemName, bool bIsContraband)
{
	if (bIsContraband)
	{
		ContrabandItems.Add(ItemName);
		UE_LOG(LogTemp, Warning, TEXT("Added contraband: %s (Don't get caught!)"), *ItemName);
	}
	else
	{
		Inventory.Add(ItemName);
		UE_LOG(LogTemp, Warning, TEXT("Added item: %s"), *ItemName);
	}
}

bool AVroomVroomPlayerState::RemoveItem(const FString& ItemName)
{
	if (Inventory.Remove(ItemName) > 0)
	{
		return true;
	}

	if (ContrabandItems.Remove(ItemName) > 0)
	{
		UE_LOG(LogTemp, Warning, TEXT("Removed contraband item: %s"), *ItemName);
		return true;
	}

	return false;
}

bool AVroomVroomPlayerState::HasItem(const FString& ItemName) const
{
	return Inventory.Contains(ItemName) || ContrabandItems.Contains(ItemName);
}

void AVroomVroomPlayerState::AddMoney(float Amount)
{
	MoneyInWallet += Amount;
	UE_LOG(LogTemp, Warning, TEXT("Added $%.2f. Total: $%.2f"), Amount, MoneyInWallet);
}

bool AVroomVroomPlayerState::SpendMoney(float Amount)
{
	if (MoneyInWallet >= Amount)
	{
		MoneyInWallet -= Amount;
		UE_LOG(LogTemp, Warning, TEXT("Spent $%.2f. Remaining: $%.2f"), Amount, MoneyInWallet);
		return true;
	}

	UE_LOG(LogTemp, Warning, TEXT("Not enough money! Need $%.2f, have $%.2f"),
		Amount, MoneyInWallet);
	return false;
}

void AVroomVroomPlayerState::AddTattoo(const FString& TattooDesign)
{
	PermanentTattoos.Add(TattooDesign);
	PrisonStatistics.TattoosReceived++;
	ModifyReputation(2.0f);

	UE_LOG(LogTemp, Warning, TEXT("Got new tattoo: %s (Total: %d)"),
		*TattooDesign, PermanentTattoos.Num());
}

void AVroomVroomPlayerState::ImproveStrength(int32 Amount)
{
	StrengthLevel = FMath::Min(100, StrengthLevel + Amount);
	UE_LOG(LogTemp, Warning, TEXT("Strength improved to %d"), StrengthLevel);
}

void AVroomVroomPlayerState::ImproveStamina(int32 Amount)
{
	StaminaLevel = FMath::Min(100, StaminaLevel + Amount);
	UE_LOG(LogTemp, Warning, TEXT("Stamina improved to %d"), StaminaLevel);
}

FString AVroomVroomPlayerState::GetStatsSummary() const
{
	return FString::Printf(
		TEXT("Criminal Record:\n")
		TEXT("- Total Arrests: %d\n")
		TEXT("- Wanted Level: %d\n")
		TEXT("- Fines Owed: $%.2f\n")
		TEXT("\nPrison Stats:\n")
		TEXT("- Days Served: %d\n")
		TEXT("- Fights Won/Lost: %d/%d\n")
		TEXT("- Books Read: %d\n")
		TEXT("- Escape Attempts: %d (Successful: %d)\n")
		TEXT("- Gang: %s\n")
		TEXT("- Reputation: %.1f\n")
		TEXT("\nDriving Stats:\n")
		TEXT("- Miles Driven: %.1f\n")
		TEXT("- Traffic Violations: %d\n")
		TEXT("- Police Evasions: %d\n")
		TEXT("- Top Speed: %.1f mph"),
		TotalArrests,
		CurrentWantedLevel,
		TotalFinesOwed,
		PrisonStatistics.TotalDaysServed,
		PrisonStatistics.FightsWon,
		PrisonStatistics.FightsLost,
		PrisonStatistics.BooksRead,
		PrisonStatistics.EscapeAttempts,
		PrisonStatistics.SuccessfulEscapes,
		*CurrentGang,
		PrisonReputation,
		TotalMilesDriven,
		TrafficViolations,
		PoliceEvasions,
		TopSpeed
	);
}

void AVroomVroomPlayerState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(AVroomVroomPlayerState, CriminalHistory);
	DOREPLIFETIME(AVroomVroomPlayerState, TotalArrests);
	DOREPLIFETIME(AVroomVroomPlayerState, CurrentWantedLevel);
	DOREPLIFETIME(AVroomVroomPlayerState, TotalFinesOwed);
	DOREPLIFETIME(AVroomVroomPlayerState, PrisonStatistics);
	DOREPLIFETIME(AVroomVroomPlayerState, CigarettesOwned);
	DOREPLIFETIME(AVroomVroomPlayerState, PrisonReputation);
	DOREPLIFETIME(AVroomVroomPlayerState, CurrentGang);
	DOREPLIFETIME(AVroomVroomPlayerState, GangRelationships);
	DOREPLIFETIME(AVroomVroomPlayerState, TotalMilesDriven);
	DOREPLIFETIME(AVroomVroomPlayerState, TrafficViolations);
	DOREPLIFETIME(AVroomVroomPlayerState, PoliceEvasions);
	DOREPLIFETIME(AVroomVroomPlayerState, VehiclesCrashed);
	DOREPLIFETIME(AVroomVroomPlayerState, TopSpeed);
	DOREPLIFETIME(AVroomVroomPlayerState, Inventory);
	DOREPLIFETIME(AVroomVroomPlayerState, ContrabandItems);
	DOREPLIFETIME(AVroomVroomPlayerState, MoneyInWallet);
	DOREPLIFETIME(AVroomVroomPlayerState, PermanentTattoos);
	DOREPLIFETIME(AVroomVroomPlayerState, HealthStatus);
	DOREPLIFETIME(AVroomVroomPlayerState, StaminaLevel);
	DOREPLIFETIME(AVroomVroomPlayerState, StrengthLevel);
}