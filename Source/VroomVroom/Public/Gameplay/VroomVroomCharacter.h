// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "InputActionValue.h"
#include "VroomVroomCharacter.generated.h"

class UInputComponent;
class UInputAction;
class UInputMappingContext;
class UCameraComponent;
class USkeletalMeshComponent;

UENUM(BlueprintType)
enum class ECharacterState : uint8
{
	OnFoot			UMETA(DisplayName = "On Foot"),
	Driving			UMETA(DisplayName = "Driving"),
	BeingArrested	UMETA(DisplayName = "Being Arrested"),
	InCourt			UMETA(DisplayName = "In Court"),
	InPrison		UMETA(DisplayName = "In Prison")
};

USTRUCT(BlueprintType)
struct FCharacterCustomization
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FLinearColor SkinTone;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FLinearColor HairColor;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 HairStyle;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 FaceType;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Height;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float Build;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	TArray<FString> Tattoos;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	TArray<FString> Scars;

	FCharacterCustomization()
	{
		SkinTone = FLinearColor(0.8f, 0.7f, 0.6f);
		HairColor = FLinearColor(0.2f, 0.15f, 0.1f);
		HairStyle = 0;
		FaceType = 0;
		Height = 1.0f;
		Build = 1.0f;
	}
};

UCLASS()
class VROOMVROOM_API AVroomVroomCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AVroomVroomCharacter();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;
	virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

	// Components
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera)
	UCameraComponent* FirstPersonCamera;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Mesh)
	USkeletalMeshComponent* FirstPersonMesh;

	// Enhanced Input
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputMappingContext* DefaultMappingContext;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputMappingContext* DrivingMappingContext;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputMappingContext* PrisonMappingContext;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputAction* MoveAction;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputAction* LookAction;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputAction* JumpAction;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputAction* InteractAction;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputAction* SprintAction;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input)
	UInputAction* EnterExitVehicleAction;

	// Character State
	UPROPERTY(BlueprintReadOnly, Category = "State")
	ECharacterState CurrentState;

	UPROPERTY(BlueprintReadWrite, Category = "State")
	bool bIsBeingChased;

	UPROPERTY(BlueprintReadWrite, Category = "State")
	int32 WantedLevel;

	// Customization
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Customization")
	FCharacterCustomization CharacterCustomization;

	// Prison Specific
	UPROPERTY(BlueprintReadWrite, Category = "Prison")
	int32 Cigarettes;

	UPROPERTY(BlueprintReadWrite, Category = "Prison")
	TArray<FString> ContrabandItems;

	UPROPERTY(BlueprintReadWrite, Category = "Prison")
	float PrisonReputation;

	UPROPERTY(BlueprintReadWrite, Category = "Prison")
	FString GangAffiliation;

	// Vehicle Interaction
	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	class AVehicleBase* CurrentVehicle;

	UPROPERTY(BlueprintReadOnly, Category = "Vehicle")
	bool bIsInVehicle;

	// Functions
	UFUNCTION(BlueprintCallable, Category = "Movement")
	void Move(const FInputActionValue& Value);

	UFUNCTION(BlueprintCallable, Category = "Movement")
	void Look(const FInputActionValue& Value);

	UFUNCTION(BlueprintCallable, Category = "Movement")
	void StartSprint();

	UFUNCTION(BlueprintCallable, Category = "Movement")
	void StopSprint();

	UFUNCTION(BlueprintCallable, Category = "Interaction")
	void Interact();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	void EnterExitVehicle();

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	bool EnterVehicle(class AVehicleBase* Vehicle);

	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	void ExitVehicle();

	UFUNCTION(BlueprintCallable, Category = "State")
	void SetCharacterState(ECharacterState NewState);

	UFUNCTION(BlueprintCallable, Category = "State")
	void GetArrested();

	// Prison Activities
	UFUNCTION(BlueprintCallable, Category = "Prison")
	void ReadBook(const FString& BookTitle);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void DoExercise(const FString& ExerciseType);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void EatMeal();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void WriteLetter(const FString& Recipient, const FString& Content);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void UsePrisonComputer();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void TradeCigarettes(int32 Amount, const FString& ForWhat);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void CreateTattoo(const FString& TattooDesign);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void InteractWithPrisoner(const FString& PrisonerName);

	// Court Activities
	UFUNCTION(BlueprintCallable, Category = "Court")
	void FillOutPaperwork(const FString& FormName, float Progress);

	UFUNCTION(BlueprintCallable, Category = "Court")
	void MakePhoneCall(const FString& ContactName);

	// Customization
	UFUNCTION(BlueprintCallable, Category = "Customization")
	void ApplyCustomization(const FCharacterCustomization& NewCustomization);

	UFUNCTION(BlueprintCallable, Category = "Customization")
	void AddTattoo(const FString& TattooName);

protected:
	// Movement
	float DefaultWalkSpeed;
	float SprintSpeed;
	bool bIsSprinting;

	// Interaction
	float InteractionRange;
	AActor* CurrentInteractable;

	void CheckForInteractables();
	void UpdateMovementSpeed();
	void SwitchInputContext(UInputMappingContext* NewContext);
};