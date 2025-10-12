// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Gameplay/VroomVroomCharacter.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "Kismet/GameplayStatics.h"
#include "Core/VroomVroomGameMode.h"
#include "Core/VroomVroomGameInstance.h"
#include "Vehicles/VehicleBase.h"
#include "DrawDebugHelpers.h"

AVroomVroomCharacter::AVroomVroomCharacter()
{
	PrimaryActorTick.bCanEverTick = true;

	// Set size for collision capsule
	GetCapsuleComponent()->InitCapsuleSize(42.f, 96.0f);

	// Create camera
	FirstPersonCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	FirstPersonCamera->SetupAttachment(GetCapsuleComponent());
	FirstPersonCamera->SetRelativeLocation(FVector(-39.56f, 1.75f, 64.f));
	FirstPersonCamera->bUsePawnControlRotation = true;

	// Create first person mesh (arms)
	FirstPersonMesh = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("FirstPersonMesh"));
	FirstPersonMesh->SetOnlyOwnerSee(true);
	FirstPersonMesh->SetupAttachment(FirstPersonCamera);
	FirstPersonMesh->bCastDynamicShadow = false;
	FirstPersonMesh->CastShadow = false;
	FirstPersonMesh->SetRelativeRotation(FRotator(1.9f, -19.19f, 5.2f));
	FirstPersonMesh->SetRelativeLocation(FVector(-0.5f, -4.4f, -155.7f));

	// Hide third person mesh from owner
	GetMesh()->SetOwnerNoSee(true);

	// Movement settings
	DefaultWalkSpeed = 600.f;
	SprintSpeed = 1000.f;
	bIsSprinting = false;
	GetCharacterMovement()->MaxWalkSpeed = DefaultWalkSpeed;
	GetCharacterMovement()->JumpZVelocity = 400.f;
	GetCharacterMovement()->AirControl = 0.2f;

	// State
	CurrentState = ECharacterState::OnFoot;
	bIsBeingChased = false;
	WantedLevel = 0;
	bIsInVehicle = false;

	// Prison stats
	Cigarettes = 0;
	PrisonReputation = 50.0f;
	GangAffiliation = "None";

	// Interaction
	InteractionRange = 200.0f;
	CurrentInteractable = nullptr;
}

void AVroomVroomCharacter::BeginPlay()
{
	Super::BeginPlay();

	// Add Input Mapping Context
	if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
		if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
		{
			if (DefaultMappingContext)
			{
				Subsystem->AddMappingContext(DefaultMappingContext, 0);
			}
		}
	}

	// Check game state and adjust accordingly
	if (UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance()))
	{
		EVroomGameState GameState = GameInstance->GetCurrentGameState();

		switch (GameState)
		{
			case EVroomGameState::Driving:
				SetCharacterState(ECharacterState::OnFoot);
				break;
			case EVroomGameState::Prison:
				SetCharacterState(ECharacterState::InPrison);
				Cigarettes = 5; // Start with a few cigarettes
				break;
			case EVroomGameState::Courtroom:
				SetCharacterState(ECharacterState::InCourt);
				break;
		}

		// Apply saved customization
		CharacterCustomization = GameInstance->GetPlayerProfile().PrisonTattoos.Num() > 0
			? CharacterCustomization
			: CharacterCustomization;
	}
}

void AVroomVroomCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Check for interactables
	CheckForInteractables();

	// Update movement speed based on sprinting
	UpdateMovementSpeed();

	// Check if being chased (there's ALWAYS cops around)
	if (CurrentState == ECharacterState::OnFoot || CurrentState == ECharacterState::Driving)
	{
		if (WantedLevel > 0)
		{
			UE_LOG(LogTemp, VeryVerbose, TEXT("Wanted Level: %d - Cops are after you!"), WantedLevel);
		}
	}
}

void AVroomVroomCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		// Movement
		if (MoveAction)
		{
			EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AVroomVroomCharacter::Move);
		}

		// Looking
		if (LookAction)
		{
			EnhancedInputComponent->BindAction(LookAction, ETriggerEvent::Triggered, this, &AVroomVroomCharacter::Look);
		}

		// Jumping
		if (JumpAction)
		{
			EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Triggered, this, &ACharacter::Jump);
			EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Completed, this, &ACharacter::StopJumping);
		}

		// Sprinting
		if (SprintAction)
		{
			EnhancedInputComponent->BindAction(SprintAction, ETriggerEvent::Started, this, &AVroomVroomCharacter::StartSprint);
			EnhancedInputComponent->BindAction(SprintAction, ETriggerEvent::Completed, this, &AVroomVroomCharacter::StopSprint);
		}

		// Interaction
		if (InteractAction)
		{
			EnhancedInputComponent->BindAction(InteractAction, ETriggerEvent::Triggered, this, &AVroomVroomCharacter::Interact);
		}

		// Vehicle
		if (EnterExitVehicleAction)
		{
			EnhancedInputComponent->BindAction(EnterExitVehicleAction, ETriggerEvent::Triggered, this, &AVroomVroomCharacter::EnterExitVehicle);
		}
	}
}

void AVroomVroomCharacter::Move(const FInputActionValue& Value)
{
	FVector2D MovementVector = Value.Get<FVector2D>();

	if (Controller != nullptr)
	{
		// Don't move if arrested or in certain states
		if (CurrentState == ECharacterState::BeingArrested)
		{
			return;
		}

		// Add movement
		AddMovementInput(GetActorForwardVector(), MovementVector.Y);
		AddMovementInput(GetActorRightVector(), MovementVector.X);

		// Any movement might attract police attention
		if (CurrentState == ECharacterState::OnFoot && FMath::RandRange(0, 1000) < 5)
		{
			UE_LOG(LogTemp, VeryVerbose, TEXT("A cop noticed you moving..."));
			// Could increase wanted level here
		}
	}
}

void AVroomVroomCharacter::Look(const FInputActionValue& Value)
{
	FVector2D LookAxisVector = Value.Get<FVector2D>();

	if (Controller != nullptr && CurrentState != ECharacterState::BeingArrested)
	{
		AddControllerYawInput(LookAxisVector.X);
		AddControllerPitchInput(LookAxisVector.Y);
	}
}

void AVroomVroomCharacter::StartSprint()
{
	bIsSprinting = true;

	// Sprinting definitely gets police attention
	if (CurrentState == ECharacterState::OnFoot)
	{
		UE_LOG(LogTemp, Warning, TEXT("Running? That's suspicious! Police alerted!"));
		WantedLevel = FMath::Min(WantedLevel + 1, 5);
	}
}

void AVroomVroomCharacter::StopSprint()
{
	bIsSprinting = false;
}

void AVroomVroomCharacter::Interact()
{
	if (CurrentInteractable)
	{
		UE_LOG(LogTemp, Warning, TEXT("Interacting with: %s"), *CurrentInteractable->GetName());

		// Different interactions based on state
		switch (CurrentState)
		{
			case ECharacterState::InPrison:
				// Prison interactions
				if (CurrentInteractable->ActorHasTag("Book"))
				{
					ReadBook("War and Peace");
				}
				else if (CurrentInteractable->ActorHasTag("Computer"))
				{
					UsePrisonComputer();
				}
				else if (CurrentInteractable->ActorHasTag("Prisoner"))
				{
					InteractWithPrisoner(CurrentInteractable->GetName());
				}
				break;

			case ECharacterState::InCourt:
				// Court interactions
				if (CurrentInteractable->ActorHasTag("Phone"))
				{
					MakePhoneCall("Lawyer");
				}
				else if (CurrentInteractable->ActorHasTag("Paperwork"))
				{
					FillOutPaperwork("Form A-1", 10.0f);
				}
				break;

			default:
				// General interactions
				break;
		}
	}
}

void AVroomVroomCharacter::EnterExitVehicle()
{
	if (bIsInVehicle)
	{
		ExitVehicle();
	}
	else
	{
		// Find nearby vehicle
		TArray<AActor*> OverlappingActors;
		GetOverlappingActors(OverlappingActors, AVehicleBase::StaticClass());

		float ClosestDistance = MAX_FLT;
		AVehicleBase* ClosestVehicle = nullptr;

		// Find the closest vehicle
		for (AActor* Actor : OverlappingActors)
		{
			AVehicleBase* Vehicle = Cast<AVehicleBase>(Actor);
			if (Vehicle && Vehicle->CanEnterVehicle(this))
			{
				float Distance = FVector::Dist(GetActorLocation(), Vehicle->GetActorLocation());
				if (Distance < ClosestDistance && Distance < 500.0f)
				{
					ClosestDistance = Distance;
					ClosestVehicle = Vehicle;
				}
			}
		}

		// Also check with a sphere trace for vehicles
		if (!ClosestVehicle)
		{
			FHitResult Hit;
			FVector Start = GetActorLocation();
			FVector End = Start + GetActorForwardVector() * 300.0f;
			FCollisionShape SphereShape = FCollisionShape::MakeSphere(200.0f);

			if (GetWorld()->SweepSingleByChannel(Hit, Start, End, FQuat::Identity,
				ECC_GameTraceChannel1, SphereShape)) // Vehicle channel
			{
				ClosestVehicle = Cast<AVehicleBase>(Hit.GetActor());
			}
		}

		if (ClosestVehicle)
		{
			EnterVehicle(ClosestVehicle);
		}
		else
		{
			UE_LOG(LogTemp, Warning, TEXT("No vehicle nearby to enter"));
		}
	}
}

bool AVroomVroomCharacter::EnterVehicle(AVehicleBase* Vehicle)
{
	if (!Vehicle)
	{
		return false;
	}

	CurrentVehicle = Vehicle;
	bIsInVehicle = true;
	SetCharacterState(ECharacterState::Driving);

	// Hide character mesh
	SetActorHiddenInGame(true);
	SetActorEnableCollision(false);

	UE_LOG(LogTemp, Warning, TEXT("Entered vehicle. Watch out for cops!"));

	return true;
}

void AVroomVroomCharacter::ExitVehicle()
{
	if (!CurrentVehicle)
	{
		return;
	}

	bIsInVehicle = false;
	SetCharacterState(ECharacterState::OnFoot);

	// Show character mesh
	SetActorHiddenInGame(false);
	SetActorEnableCollision(true);

	// Place character next to vehicle
	SetActorLocation(CurrentVehicle->GetActorLocation() + FVector(200.0f, 0, 100.0f));

	CurrentVehicle = nullptr;

	UE_LOG(LogTemp, Warning, TEXT("Exited vehicle"));
}

void AVroomVroomCharacter::SetCharacterState(ECharacterState NewState)
{
	ECharacterState OldState = CurrentState;
	CurrentState = NewState;

	// Switch input contexts based on state
	if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
		switch (NewState)
		{
			case ECharacterState::Driving:
				if (DrivingMappingContext)
				{
					SwitchInputContext(DrivingMappingContext);
				}
				break;

			case ECharacterState::InPrison:
				if (PrisonMappingContext)
				{
					SwitchInputContext(PrisonMappingContext);
				}
				break;

			default:
				if (DefaultMappingContext)
				{
					SwitchInputContext(DefaultMappingContext);
				}
				break;
		}
	}

	UE_LOG(LogTemp, Warning, TEXT("Character State Changed: %d -> %d"), (int32)OldState, (int32)NewState);
}

void AVroomVroomCharacter::GetArrested()
{
	SetCharacterState(ECharacterState::BeingArrested);

	// Disable movement
	GetCharacterMovement()->DisableMovement();

	UE_LOG(LogTemp, Warning, TEXT("YOU'RE UNDER ARREST!"));

	// Trigger arrest sequence
	if (AVroomVroomGameMode* GameMode = Cast<AVroomVroomGameMode>(GetWorld()->GetAuthGameMode()))
	{
		GameMode->ArrestPlayer(this);
	}
}

void AVroomVroomCharacter::ReadBook(const FString& BookTitle)
{
	UE_LOG(LogTemp, Warning, TEXT("Reading %s... Page 1 of 1,225"), *BookTitle);
	// This would open the book reading interface
}

void AVroomVroomCharacter::DoExercise(const FString& ExerciseType)
{
	UE_LOG(LogTemp, Warning, TEXT("Doing %s - Rep 1 of 50"), *ExerciseType);
	// Start exercise minigame
}

void AVroomVroomCharacter::EatMeal()
{
	UE_LOG(LogTemp, Warning, TEXT("Eating mashed potatoes... one spoonful at a time"));
	// Eating animation/minigame
}

void AVroomVroomCharacter::WriteLetter(const FString& Recipient, const FString& Content)
{
	UE_LOG(LogTemp, Warning, TEXT("Writing letter to %s: %s"), *Recipient, *Content);
	// Open letter writing UI
}

void AVroomVroomCharacter::UsePrisonComputer()
{
	UE_LOG(LogTemp, Warning, TEXT("Connecting to internet at 56k..."));
	UE_LOG(LogTemp, Warning, TEXT("Loading... (Est. time: 47 minutes)"));
	// Open dial-up browser
}

void AVroomVroomCharacter::TradeCigarettes(int32 Amount, const FString& ForWhat)
{
	if (Cigarettes >= Amount)
	{
		Cigarettes -= Amount;
		UE_LOG(LogTemp, Warning, TEXT("Traded %d cigarettes for %s"), Amount, *ForWhat);

		if (ForWhat.Contains("Protection"))
		{
			PrisonReputation += 5.0f;
		}
	}
	else
	{
		UE_LOG(LogTemp, Warning, TEXT("Not enough cigarettes!"));
	}
}

void AVroomVroomCharacter::CreateTattoo(const FString& TattooDesign)
{
	UE_LOG(LogTemp, Warning, TEXT("Creating tattoo: %s (This is permanent!)"), *TattooDesign);
	CharacterCustomization.Tattoos.Add(TattooDesign);
	AddTattoo(TattooDesign);
}

void AVroomVroomCharacter::InteractWithPrisoner(const FString& PrisonerName)
{
	UE_LOG(LogTemp, Warning, TEXT("Talking to %s"), *PrisonerName);

	// Random responses
	int32 Response = FMath::RandRange(0, 3);
	switch (Response)
	{
		case 0:
			UE_LOG(LogTemp, Warning, TEXT("%s: 'What are you looking at?'"), *PrisonerName);
			break;
		case 1:
			UE_LOG(LogTemp, Warning, TEXT("%s: 'Got any cigarettes?'"), *PrisonerName);
			break;
		case 2:
			UE_LOG(LogTemp, Warning, TEXT("%s: 'Stay out of my way'"), *PrisonerName);
			PrisonReputation -= 2.0f;
			break;
		case 3:
			UE_LOG(LogTemp, Warning, TEXT("%s: 'Want to join our crew?'"), *PrisonerName);
			break;
	}
}

void AVroomVroomCharacter::FillOutPaperwork(const FString& FormName, float Progress)
{
	UE_LOG(LogTemp, Warning, TEXT("Filling out %s... %f%% complete"), *FormName, Progress);

	if (AVroomVroomGameMode* GameMode = Cast<AVroomVroomGameMode>(GetWorld()->GetAuthGameMode()))
	{
		GameMode->ProcessCourtPaperwork(Progress);
	}
}

void AVroomVroomCharacter::MakePhoneCall(const FString& ContactName)
{
	UE_LOG(LogTemp, Warning, TEXT("Calling %s... (You only get one call!)"), *ContactName);
}

void AVroomVroomCharacter::ApplyCustomization(const FCharacterCustomization& NewCustomization)
{
	CharacterCustomization = NewCustomization;

	// Apply visual changes to mesh
	// This would update materials, morph targets, etc.
	UE_LOG(LogTemp, Warning, TEXT("Character customization applied"));
}

void AVroomVroomCharacter::AddTattoo(const FString& TattooName)
{
	CharacterCustomization.Tattoos.Add(TattooName);

	// Save to profile
	if (UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance()))
	{
		GameInstance->GetPlayerProfile().PrisonTattoos.Add(TattooName);
		GameInstance->SavePlayerProfile();
	}
}

void AVroomVroomCharacter::CheckForInteractables()
{
	FHitResult HitResult;
	FVector Start = FirstPersonCamera->GetComponentLocation();
	FVector End = Start + (FirstPersonCamera->GetForwardVector() * InteractionRange);

	FCollisionQueryParams QueryParams;
	QueryParams.AddIgnoredActor(this);

	if (GetWorld()->LineTraceSingleByChannel(HitResult, Start, End, ECC_Visibility, QueryParams))
	{
		AActor* HitActor = HitResult.GetActor();

		if (HitActor && HitActor != CurrentInteractable)
		{
			CurrentInteractable = HitActor;
			UE_LOG(LogTemp, VeryVerbose, TEXT("Can interact with: %s"), *HitActor->GetName());
		}
	}
	else
	{
		CurrentInteractable = nullptr;
	}

	// Debug visualization
	DrawDebugLine(GetWorld(), Start, End,
		CurrentInteractable ? FColor::Green : FColor::Red, false, 0.1f);
}

void AVroomVroomCharacter::UpdateMovementSpeed()
{
	float TargetSpeed = bIsSprinting ? SprintSpeed : DefaultWalkSpeed;

	// Adjust speed based on state
	if (CurrentState == ECharacterState::InPrison)
	{
		TargetSpeed *= 0.8f; // Slower in prison
	}

	GetCharacterMovement()->MaxWalkSpeed = TargetSpeed;
}

void AVroomVroomCharacter::SwitchInputContext(UInputMappingContext* NewContext)
{
	if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
		if (UEnhancedInputLocalPlayerSubsystem* Subsystem =
			ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
		{
			Subsystem->ClearAllMappings();
			Subsystem->AddMappingContext(NewContext, 0);
		}
	}
}