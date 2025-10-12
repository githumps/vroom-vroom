// Copyright Vroom Vroom Game. All Rights Reserved.

#include "UI/VroomMainMenuWidget.h"
#include "Components/Button.h"
#include "Components/TextBlock.h"
#include "Components/VerticalBox.h"
#include "Components/Image.h"
#include "Animation/WidgetAnimation.h"
#include "Core/VroomVroomGameInstance.h"
#include "Core/VroomVroomSaveGame.h"
#include "Kismet/GameplayStatics.h"
#include "Kismet/KismetSystemLibrary.h"

void UVroomMainMenuWidget::NativeOnInitialized()
{
	Super::NativeOnInitialized();

	SetupButtonStyles();
}

void UVroomMainMenuWidget::NativeConstruct()
{
	Super::NativeConstruct();

	// Bind button clicks
	if (NewGameButton)
	{
		NewGameButton->OnClicked.AddDynamic(this, &UVroomMainMenuWidget::OnNewGameClicked);
	}

	if (ContinueButton)
	{
		ContinueButton->OnClicked.AddDynamic(this, &UVroomMainMenuWidget::OnContinueClicked);
	}

	if (LoadGameButton)
	{
		LoadGameButton->OnClicked.AddDynamic(this, &UVroomMainMenuWidget::OnLoadGameClicked);
	}

	if (OptionsButton)
	{
		OptionsButton->OnClicked.AddDynamic(this, &UVroomMainMenuWidget::OnOptionsClicked);
	}

	if (CreditsButton)
	{
		CreditsButton->OnClicked.AddDynamic(this, &UVroomMainMenuWidget::OnCreditsClicked);
	}

	if (QuitButton)
	{
		QuitButton->OnClicked.AddDynamic(this, &UVroomMainMenuWidget::OnQuitClicked);
	}

	// Set title text
	if (TitleText)
	{
		TitleText->SetText(FText::FromString("VROOM VROOM"));
	}

	if (SubtitleText)
	{
		SubtitleText->SetText(FText::FromString("A Definitely Normal Driving Simulator"));
	}

	if (WarningText)
	{
		WarningText->SetText(FText::FromString("Warning: Contains excessive police presence"));
	}

	if (VersionText)
	{
		VersionText->SetText(FText::FromString("v1.0.0"));
	}

	// Check for existing saves
	CheckForExistingSaves();

	// Play fade-in animation
	if (FadeInAnimation)
	{
		PlayAnimation(FadeInAnimation);
	}

	UE_LOG(LogTemp, Warning, TEXT("Main Menu Initialized"));
}

void UVroomMainMenuWidget::NativeDestruct()
{
	// Clean up bindings
	if (NewGameButton)
	{
		NewGameButton->OnClicked.RemoveAll(this);
	}

	if (ContinueButton)
	{
		ContinueButton->OnClicked.RemoveAll(this);
	}

	if (LoadGameButton)
	{
		LoadGameButton->OnClicked.RemoveAll(this);
	}

	if (OptionsButton)
	{
		OptionsButton->OnClicked.RemoveAll(this);
	}

	if (CreditsButton)
	{
		CreditsButton->OnClicked.RemoveAll(this);
	}

	if (QuitButton)
	{
		QuitButton->OnClicked.RemoveAll(this);
	}

	Super::NativeDestruct();
}

void UVroomMainMenuWidget::Setup()
{
	this->AddToViewport();

	UWorld* World = GetWorld();
	if (!World)
	{
		return;
	}

	APlayerController* PlayerController = World->GetFirstPlayerController();
	if (!PlayerController)
	{
		return;
	}

	// Set input mode to UI
	FInputModeUIOnly InputModeData;
	InputModeData.SetWidgetToFocus(this->TakeWidget());
	InputModeData.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);

	PlayerController->SetInputMode(InputModeData);
	PlayerController->bShowMouseCursor = true;
}

void UVroomMainMenuWidget::Teardown()
{
	this->RemoveFromViewport();

	UWorld* World = GetWorld();
	if (!World)
	{
		return;
	}

	APlayerController* PlayerController = World->GetFirstPlayerController();
	if (!PlayerController)
	{
		return;
	}

	// Set input mode back to game
	FInputModeGameOnly InputModeData;
	PlayerController->SetInputMode(InputModeData);
	PlayerController->bShowMouseCursor = false;
}

void UVroomMainMenuWidget::OnNewGameClicked()
{
	PlayButtonSound();

	UE_LOG(LogTemp, Warning, TEXT("New Game Selected"));

	// Show warning about police
	FString Message = "WARNING: This world contains an excessive police presence. "
					 "You WILL be arrested. Repeatedly. Good luck!";

	// Start new game
	StartNewGame();
}

void UVroomMainMenuWidget::OnContinueClicked()
{
	if (!bHasSaveGame)
	{
		return;
	}

	PlayButtonSound();

	UE_LOG(LogTemp, Warning, TEXT("Continue Game Selected"));

	ContinueGame();
}

void UVroomMainMenuWidget::OnLoadGameClicked()
{
	PlayButtonSound();

	UE_LOG(LogTemp, Warning, TEXT("Load Game Selected"));

	ShowLoadGameDialog();
}

void UVroomMainMenuWidget::OnOptionsClicked()
{
	PlayButtonSound();

	UE_LOG(LogTemp, Warning, TEXT("Options Selected"));

	ShowOptionsMenu();
}

void UVroomMainMenuWidget::OnCreditsClicked()
{
	PlayButtonSound();

	UE_LOG(LogTemp, Warning, TEXT("Credits Selected"));

	ShowCredits();
}

void UVroomMainMenuWidget::OnQuitClicked()
{
	PlayButtonSound();

	UE_LOG(LogTemp, Warning, TEXT("Quit Selected"));

	// Quit the game
	UWorld* World = GetWorld();
	if (World)
	{
		APlayerController* PlayerController = World->GetFirstPlayerController();
		if (PlayerController)
		{
			UKismetSystemLibrary::QuitGame(World, PlayerController, EQuitPreference::Quit, true);
		}
	}
}

void UVroomMainMenuWidget::OnButtonHovered(UButton* HoveredButton)
{
	PlayHoverSound();
	AnimateButtonHover(HoveredButton, true);
}

void UVroomMainMenuWidget::OnButtonUnhovered(UButton* UnhoveredButton)
{
	AnimateButtonHover(UnhoveredButton, false);
}

void UVroomMainMenuWidget::UpdateContinueButtonState()
{
	CheckForExistingSaves();

	if (ContinueButton)
	{
		SetButtonEnabled(ContinueButton, bHasSaveGame);

		if (!bHasSaveGame)
		{
			ContinueButton->SetToolTipText(FText::FromString("No save game found"));
		}
	}
}

void UVroomMainMenuWidget::ShowLoadGameDialog()
{
	// Get all save slots
	TArray<FString> SaveSlots = UVroomVroomSaveGame::GetAllSaveGameSlots();

	if (SaveSlots.Num() == 0)
	{
		UE_LOG(LogTemp, Warning, TEXT("No save games found"));
		return;
	}

	// In a real implementation, this would show a dialog with save slots
	// For now, load the first available slot
	if (SaveSlots.Num() > 0)
	{
		LoadSaveGame(SaveSlots[0]);
	}
}

void UVroomMainMenuWidget::ShowOptionsMenu()
{
	// This would open the options menu widget
	UE_LOG(LogTemp, Warning, TEXT("Options menu would open here"));
}

void UVroomMainMenuWidget::ShowCredits()
{
	// This would show the credits
	UE_LOG(LogTemp, Warning, TEXT("=== VROOM VROOM CREDITS ==="));
	UE_LOG(LogTemp, Warning, TEXT("A game about driving (and so much more)"));
	UE_LOG(LogTemp, Warning, TEXT("Created by: Excessive Police Studios"));
	UE_LOG(LogTemp, Warning, TEXT("Warning: Contains unrealistic police density"));
	UE_LOG(LogTemp, Warning, TEXT("Special Thanks: Every cop car ever"));
}

void UVroomMainMenuWidget::StartNewGame()
{
	// Create new save
	UVroomVroomSaveGame::SaveGameToSlot(this, "VroomVroomSave", 0);

	// Get game instance
	UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance());
	if (GameInstance)
	{
		// Reset player profile
		GameInstance->GetPlayerProfile() = FVroomPlayerProfile();
		GameInstance->SavePlayerProfile();

		// Start in driving mode
		GameInstance->SetGameState(EVroomGameState::Driving);
	}

	// Teardown menu
	Teardown();

	// Load the open world map
	UGameplayStatics::OpenLevel(this, FName("OpenWorld"));
}

void UVroomMainMenuWidget::ContinueGame()
{
	if (!bHasSaveGame)
	{
		return;
	}

	// Load the last save
	LoadSaveGame(LastSaveSlot);
}

void UVroomMainMenuWidget::LoadSaveGame(const FString& SaveSlotName)
{
	// Load the save game
	UVroomVroomSaveGame* LoadedGame = UVroomVroomSaveGame::LoadGameFromSlot(this, SaveSlotName, 0);

	if (!LoadedGame)
	{
		UE_LOG(LogTemp, Error, TEXT("Failed to load save game: %s"), *SaveSlotName);
		return;
	}

	// Get game instance
	UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance());
	if (GameInstance)
	{
		// The save game has already applied its data in LoadGameFromSlot
		// Now transition to the appropriate level
		EVroomGameState LoadedState = LoadedGame->CurrentGameState;

		// Teardown menu first
		Teardown();

		// Load appropriate level based on game state
		FString LevelName;
		switch (LoadedState)
		{
			case EVroomGameState::Driving:
			case EVroomGameState::Released:
				LevelName = "OpenWorld";
				break;
			case EVroomGameState::Prison:
				LevelName = "Prison";
				break;
			case EVroomGameState::Courtroom:
				LevelName = "Courtroom";
				break;
			default:
				LevelName = "OpenWorld";
				break;
		}

		UGameplayStatics::OpenLevel(this, FName(*LevelName));
	}
}

void UVroomMainMenuWidget::SetupButtonStyles()
{
	// This would set up button visual styles
	// In a real implementation, this would be done in Blueprint
}

void UVroomMainMenuWidget::CheckForExistingSaves()
{
	// Check for default save slot
	bHasSaveGame = UVroomVroomSaveGame::DoesSaveGameExist("VroomVroomSave", 0);

	if (bHasSaveGame)
	{
		LastSaveSlot = "VroomVroomSave";
	}
	else
	{
		// Check for numbered save slots
		for (int32 i = 0; i < 10; i++)
		{
			FString SlotName = FString::Printf(TEXT("VroomVroomSave_%d"), i);
			if (UVroomVroomSaveGame::DoesSaveGameExist(SlotName, 0))
			{
				bHasSaveGame = true;
				LastSaveSlot = SlotName;
				break;
			}
		}
	}

	// Update continue button state
	if (ContinueButton)
	{
		SetButtonEnabled(ContinueButton, bHasSaveGame);
	}
}

void UVroomMainMenuWidget::SetButtonEnabled(UButton* Button, bool bEnabled)
{
	if (!Button)
	{
		return;
	}

	Button->SetIsEnabled(bEnabled);

	// Visual feedback for disabled state
	if (!bEnabled)
	{
		Button->SetColorAndOpacity(FLinearColor(0.5f, 0.5f, 0.5f, 0.5f));
	}
	else
	{
		Button->SetColorAndOpacity(FLinearColor(1.0f, 1.0f, 1.0f, 1.0f));
	}
}

void UVroomMainMenuWidget::AnimateButtonHover(UButton* Button, bool bIsHovering)
{
	if (!Button)
	{
		return;
	}

	// Simple hover effect
	if (bIsHovering)
	{
		Button->SetRenderScale(FVector2D(1.05f, 1.05f));
	}
	else
	{
		Button->SetRenderScale(FVector2D(1.0f, 1.0f));
	}
}