// Copyright Vroom Vroom Game. All Rights Reserved.

#include "Core/VroomVroomPlayerController.h"
#include "Core/VroomVroomGameInstance.h"
#include "Blueprint/UserWidget.h"
#include "Components/AudioComponent.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"

AVroomVroomPlayerController::AVroomVroomPlayerController()
{
	bShowMouseCursor = false;
	bIsInPoliceChase = false;
	CurrentWantedLevel = 0;
}

void AVroomVroomPlayerController::BeginPlay()
{
	Super::BeginPlay();

	GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance());

	// Initialize UI based on game state
	if (GameInstance)
	{
		EVroomGameState CurrentState = GameInstance->GetCurrentGameState();

		switch (CurrentState)
		{
			case EVroomGameState::MainMenu:
				ShowMainMenu();
				break;

			case EVroomGameState::Driving:
				ShowDrivingUI();
				SetInputModeGameOnly();
				break;

			case EVroomGameState::Prison:
				ShowPrisonUI();
				SetInputModeGameOnly();
				break;

			case EVroomGameState::Courtroom:
				ShowCourtUI();
				SetInputModeGameAndUI(nullptr);
				break;

			default:
				ShowHUD();
				break;
		}
	}
}

void AVroomVroomPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();

	// Bind pause action
	InputComponent->BindAction("Pause", IE_Pressed, this, &AVroomVroomPlayerController::OnPausePressed);
	InputComponent->BindAction("QuickSave", IE_Pressed, this, &AVroomVroomPlayerController::OnQuickSavePressed);
	InputComponent->BindAction("QuickLoad", IE_Pressed, this, &AVroomVroomPlayerController::OnQuickLoadPressed);
}

void AVroomVroomPlayerController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Check for police proximity (there's ALWAYS police nearby)
	if (GameInstance && GameInstance->GetCurrentGameState() == EVroomGameState::Driving)
	{
		if (!bIsInPoliceChase && FMath::RandRange(0, 10000) < 5) // 0.05% chance per tick
		{
			ShowNotification("A police car is watching you...", 2.0f);
		}
	}
}

void AVroomVroomPlayerController::ShowMainMenu()
{
	if (!MainMenuWidget && MainMenuClass)
	{
		MainMenuWidget = CreateWidget(MainMenuClass);
	}

	if (MainMenuWidget)
	{
		ShowWidget(MainMenuWidget);
		SetInputModeUIOnly(MainMenuWidget);
		bShowMouseCursor = true;
	}
}

void AVroomVroomPlayerController::HideMainMenu()
{
	if (MainMenuWidget)
	{
		HideWidget(MainMenuWidget);
		SetInputModeGameOnly();
		bShowMouseCursor = false;
	}
}

void AVroomVroomPlayerController::ShowPauseMenu()
{
	if (!PauseMenuWidget && PauseMenuClass)
	{
		PauseMenuWidget = CreateWidget(PauseMenuClass);
	}

	if (PauseMenuWidget)
	{
		ShowWidget(PauseMenuWidget);
		SetInputModeGameAndUI(PauseMenuWidget);
		bShowMouseCursor = true;
		SetPause(true);
	}
}

void AVroomVroomPlayerController::HidePauseMenu()
{
	if (PauseMenuWidget)
	{
		HideWidget(PauseMenuWidget);
		SetInputModeGameOnly();
		bShowMouseCursor = false;
		SetPause(false);
	}
}

void AVroomVroomPlayerController::ShowHUD()
{
	if (!HUDWidget && HUDClass)
	{
		HUDWidget = CreateWidget(HUDClass);
	}

	if (HUDWidget)
	{
		ShowWidget(HUDWidget);
	}
}

void AVroomVroomPlayerController::HideHUD()
{
	if (HUDWidget)
	{
		HideWidget(HUDWidget);
	}
}

void AVroomVroomPlayerController::ShowPrisonUI()
{
	if (!PrisonUIWidget && PrisonUIClass)
	{
		PrisonUIWidget = CreateWidget(PrisonUIClass);
	}

	if (PrisonUIWidget)
	{
		ShowWidget(PrisonUIWidget);
		ShowNotification("Welcome to prison. Follow the rules or face consequences.", 5.0f);
	}
}

void AVroomVroomPlayerController::ShowCourtUI()
{
	if (!CourtUIWidget && CourtUIClass)
	{
		CourtUIWidget = CreateWidget(CourtUIClass);
	}

	if (CourtUIWidget)
	{
		ShowWidget(CourtUIWidget);
		ShowNotification("Fill out ALL paperwork completely!", 5.0f);
		bShowMouseCursor = true;
	}
}

void AVroomVroomPlayerController::ShowDrivingUI()
{
	if (!DrivingUIWidget && DrivingUIClass)
	{
		DrivingUIWidget = CreateWidget(DrivingUIClass);
	}

	if (DrivingUIWidget)
	{
		ShowWidget(DrivingUIWidget);
		ShowNotification("Police are EVERYWHERE. Drive carefully!", 5.0f);
	}
}

void AVroomVroomPlayerController::SetInputModeGameOnly()
{
	FInputModeGameOnly InputMode;
	SetInputMode(InputMode);
	bShowMouseCursor = false;
}

void AVroomVroomPlayerController::SetInputModeUIOnly(UUserWidget* InWidgetToFocus)
{
	FInputModeUIOnly InputMode;
	if (InWidgetToFocus)
	{
		InputMode.SetWidgetToFocus(InWidgetToFocus->TakeWidget());
	}
	InputMode.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);
	SetInputMode(InputMode);
	bShowMouseCursor = true;
}

void AVroomVroomPlayerController::SetInputModeGameAndUI(UUserWidget* InWidgetToFocus)
{
	FInputModeGameAndUI InputMode;
	if (InWidgetToFocus)
	{
		InputMode.SetWidgetToFocus(InWidgetToFocus->TakeWidget());
	}
	InputMode.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);
	InputMode.SetHideCursorDuringCapture(false);
	SetInputMode(InputMode);
}

void AVroomVroomPlayerController::OnPoliceChaseStarted()
{
	bIsInPoliceChase = true;
	ShowNotification("POLICE CHASE! PULL OVER!", 3.0f);
	ShowArrestWarning();

	// Play siren sound
	if (PoliceSirenAudioComponent)
	{
		PoliceSirenAudioComponent->Play();
	}

	UE_LOG(LogTemp, Warning, TEXT("Police chase started! Good luck escaping (you won't)"));
}

void AVroomVroomPlayerController::OnPoliceChaseEnded()
{
	bIsInPoliceChase = false;

	if (PoliceSirenAudioComponent)
	{
		PoliceSirenAudioComponent->Stop();
	}

	// But more police will spawn soon...
	ShowNotification("You escaped... for now", 3.0f);
}

void AVroomVroomPlayerController::UpdateWantedLevel(int32 NewLevel)
{
	CurrentWantedLevel = FMath::Clamp(NewLevel, 0, 5);

	FString WantedMessage = FString::Printf(TEXT("Wanted Level: %d"), CurrentWantedLevel);
	ShowNotification(WantedMessage, 2.0f);

	if (CurrentWantedLevel >= 3)
	{
		ShowNotification("Multiple units in pursuit!", 2.0f);
	}
}

void AVroomVroomPlayerController::OpenBookReader(const FString& BookTitle, const FString& BookContent)
{
	if (!BookReaderWidget && BookReaderClass)
	{
		BookReaderWidget = CreateWidget(BookReaderClass);
	}

	if (BookReaderWidget)
	{
		ShowWidget(BookReaderWidget);
		SetInputModeUIOnly(BookReaderWidget);

		ShowNotification(FString::Printf(TEXT("Reading: %s"), *BookTitle), 3.0f);
		UE_LOG(LogTemp, Warning, TEXT("Opening book: %s (1,225 pages)"), *BookTitle);
	}
}

void AVroomVroomPlayerController::OpenLetterWriter()
{
	ShowNotification("Writing a letter... Choose your words carefully.", 3.0f);
	// Open letter writing UI
}

void AVroomVroomPlayerController::OpenWebBrowser()
{
	if (!WebBrowserWidget && WebBrowserClass)
	{
		WebBrowserWidget = CreateWidget(WebBrowserClass);
	}

	if (WebBrowserWidget)
	{
		ShowWidget(WebBrowserWidget);
		SetInputModeUIOnly(WebBrowserWidget);

		ShowNotification("Connecting at 56k... Please wait...", 5.0f);
		UE_LOG(LogTemp, Warning, TEXT("Opening dial-up browser (this will be slow)"));
	}
}

void AVroomVroomPlayerController::OpenTattooDesigner()
{
	if (!TattooDesignerWidget && TattooDesignerClass)
	{
		TattooDesignerWidget = CreateWidget(TattooDesignerClass);
	}

	if (TattooDesignerWidget)
	{
		ShowWidget(TattooDesignerWidget);
		SetInputModeUIOnly(TattooDesignerWidget);

		ShowNotification("Design your tattoo. Remember: it's permanent!", 5.0f);
	}
}

void AVroomVroomPlayerController::OpenCommissary()
{
	ShowNotification("Commissary: Trade cigarettes for items", 3.0f);
	// Open commissary UI
}

void AVroomVroomPlayerController::OpenPaperworkForm(const FString& FormType)
{
	ShowNotification(FString::Printf(TEXT("Fill out %s completely!"), *FormType), 5.0f);
	SetInputModeUIOnly(nullptr);
	bShowMouseCursor = true;
}

void AVroomVroomPlayerController::MakePhoneCall(const FString& ContactName)
{
	ShowNotification(FString::Printf(TEXT("Calling %s... (Your only call!)"), *ContactName), 5.0f);
}

void AVroomVroomPlayerController::OpenCharacterCustomization()
{
	if (!CharacterCustomizationWidget && CharacterCustomizationClass)
	{
		CharacterCustomizationWidget = CreateWidget(CharacterCustomizationClass);
	}

	if (CharacterCustomizationWidget)
	{
		ShowWidget(CharacterCustomizationWidget);
		SetInputModeUIOnly(CharacterCustomizationWidget);
		ShowNotification("Customize your character", 3.0f);
	}
}

void AVroomVroomPlayerController::SaveCharacterCustomization()
{
	if (GameInstance)
	{
		GameInstance->SavePlayerProfile();
		ShowNotification("Character saved", 2.0f);
	}
}

void AVroomVroomPlayerController::PauseGame()
{
	ShowPauseMenu();
}

void AVroomVroomPlayerController::UnpauseGame()
{
	HidePauseMenu();
}

void AVroomVroomPlayerController::SaveGame()
{
	if (GameInstance)
	{
		GameInstance->SavePlayerProfile();
		ShowNotification("Game Saved", 2.0f);
		UE_LOG(LogTemp, Warning, TEXT("Game saved"));
	}
}

void AVroomVroomPlayerController::LoadGame()
{
	if (GameInstance)
	{
		GameInstance->LoadPlayerProfile();
		ShowNotification("Game Loaded", 2.0f);
		UE_LOG(LogTemp, Warning, TEXT("Game loaded"));
	}
}

void AVroomVroomPlayerController::ReturnToMainMenu()
{
	if (GameInstance)
	{
		GameInstance->SetGameState(EVroomGameState::MainMenu);
	}
}

void AVroomVroomPlayerController::QuitGame()
{
	ConsoleCommand("quit");
}

void AVroomVroomPlayerController::ShowNotification(const FString& Message, float Duration)
{
	// This would show an on-screen notification
	UE_LOG(LogTemp, Warning, TEXT("Notification: %s"), *Message);

	// In a real implementation, this would create a notification widget
}

void AVroomVroomPlayerController::ShowArrestWarning()
{
	ShowNotification("WARNING: PULL OVER OR FACE ARREST!", 5.0f);

	// Flash screen red or show warning UI
}

void AVroomVroomPlayerController::ShowPrisonEvent(const FString& EventDescription)
{
	ShowNotification(EventDescription, 5.0f);

	UE_LOG(LogTemp, Warning, TEXT("Prison Event: %s"), *EventDescription);
}

void AVroomVroomPlayerController::OnPausePressed()
{
	if (IsPaused())
	{
		UnpauseGame();
	}
	else
	{
		PauseGame();
	}
}

void AVroomVroomPlayerController::OnQuickSavePressed()
{
	SaveGame();
}

void AVroomVroomPlayerController::OnQuickLoadPressed()
{
	LoadGame();
}

UUserWidget* AVroomVroomPlayerController::CreateWidget(TSubclassOf<UUserWidget> WidgetClass)
{
	if (!WidgetClass)
	{
		return nullptr;
	}

	return ::CreateWidget<UUserWidget>(this, WidgetClass);
}

void AVroomVroomPlayerController::ShowWidget(UUserWidget* Widget)
{
	if (Widget && !Widget->IsInViewport())
	{
		Widget->AddToViewport();
	}
}

void AVroomVroomPlayerController::HideWidget(UUserWidget* Widget)
{
	if (Widget && Widget->IsInViewport())
	{
		Widget->RemoveFromParent();
	}
}