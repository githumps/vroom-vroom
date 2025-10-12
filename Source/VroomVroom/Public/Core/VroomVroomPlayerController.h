// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "VroomVroomPlayerController.generated.h"

class UUserWidget;
class UInputMappingContext;

UCLASS()
class VROOMVROOM_API AVroomVroomPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	AVroomVroomPlayerController();

protected:
	virtual void BeginPlay() override;
	virtual void SetupInputComponent() override;
	virtual void Tick(float DeltaTime) override;

public:
	// UI Management
	UFUNCTION(BlueprintCallable, Category = "UI")
	void ShowMainMenu();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void HideMainMenu();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void ShowPauseMenu();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void HidePauseMenu();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void ShowHUD();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void HideHUD();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void ShowPrisonUI();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void ShowCourtUI();

	UFUNCTION(BlueprintCallable, Category = "UI")
	void ShowDrivingUI();

	// Input Management
	UFUNCTION(BlueprintCallable, Category = "Input")
	void SetInputModeGameOnly();

	UFUNCTION(BlueprintCallable, Category = "Input")
	void SetInputModeUIOnly(UUserWidget* InWidgetToFocus);

	UFUNCTION(BlueprintCallable, Category = "Input")
	void SetInputModeGameAndUI(UUserWidget* InWidgetToFocus);

	// Police System
	UFUNCTION(BlueprintCallable, Category = "Police")
	void OnPoliceChaseStarted();

	UFUNCTION(BlueprintCallable, Category = "Police")
	void OnPoliceChaseEnded();

	UFUNCTION(BlueprintCallable, Category = "Police")
	void UpdateWantedLevel(int32 NewLevel);

	// Prison Activities
	UFUNCTION(BlueprintCallable, Category = "Prison")
	void OpenBookReader(const FString& BookTitle, const FString& BookContent);

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void OpenLetterWriter();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void OpenWebBrowser();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void OpenTattooDesigner();

	UFUNCTION(BlueprintCallable, Category = "Prison")
	void OpenCommissary();

	// Court Activities
	UFUNCTION(BlueprintCallable, Category = "Court")
	void OpenPaperworkForm(const FString& FormType);

	UFUNCTION(BlueprintCallable, Category = "Court")
	void MakePhoneCall(const FString& ContactName);

	// Character Customization
	UFUNCTION(BlueprintCallable, Category = "Customization")
	void OpenCharacterCustomization();

	UFUNCTION(BlueprintCallable, Category = "Customization")
	void SaveCharacterCustomization();

	// Game Flow
	UFUNCTION(BlueprintCallable, Category = "Game")
	void PauseGame();

	UFUNCTION(BlueprintCallable, Category = "Game")
	void UnpauseGame();

	UFUNCTION(BlueprintCallable, Category = "Game")
	void SaveGame();

	UFUNCTION(BlueprintCallable, Category = "Game")
	void LoadGame();

	UFUNCTION(BlueprintCallable, Category = "Game")
	void ReturnToMainMenu();

	UFUNCTION(BlueprintCallable, Category = "Game")
	void QuitGame();

	// Notifications
	UFUNCTION(BlueprintCallable, Category = "Notification")
	void ShowNotification(const FString& Message, float Duration = 3.0f);

	UFUNCTION(BlueprintCallable, Category = "Notification")
	void ShowArrestWarning();

	UFUNCTION(BlueprintCallable, Category = "Notification")
	void ShowPrisonEvent(const FString& EventDescription);

protected:
	// UI Widget Classes
	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> MainMenuClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> PauseMenuClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> HUDClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> PrisonUIClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> CourtUIClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> DrivingUIClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> BookReaderClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> WebBrowserClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> TattooDesignerClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> CharacterCustomizationClass;

	// UI Widget Instances
	UPROPERTY()
	UUserWidget* MainMenuWidget;

	UPROPERTY()
	UUserWidget* PauseMenuWidget;

	UPROPERTY()
	UUserWidget* HUDWidget;

	UPROPERTY()
	UUserWidget* PrisonUIWidget;

	UPROPERTY()
	UUserWidget* CourtUIWidget;

	UPROPERTY()
	UUserWidget* DrivingUIWidget;

	UPROPERTY()
	UUserWidget* BookReaderWidget;

	UPROPERTY()
	UUserWidget* WebBrowserWidget;

	UPROPERTY()
	UUserWidget* TattooDesignerWidget;

	UPROPERTY()
	UUserWidget* CharacterCustomizationWidget;

	// Input Actions
	UFUNCTION()
	void OnPausePressed();

	UFUNCTION()
	void OnQuickSavePressed();

	UFUNCTION()
	void OnQuickLoadPressed();

	// Police Chase State
	bool bIsInPoliceChase;
	int32 CurrentWantedLevel;

	// UI Helper Functions
	UUserWidget* CreateWidget(TSubclassOf<UUserWidget> WidgetClass);
	void ShowWidget(UUserWidget* Widget);
	void HideWidget(UUserWidget* Widget);

	// Police siren audio component
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Audio")
	class UAudioComponent* PoliceSirenAudioComponent;

	// Current game state tracking
	class UVroomVroomGameInstance* GameInstance;
};