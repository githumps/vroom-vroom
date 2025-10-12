// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "VroomMainMenuWidget.generated.h"

class UButton;
class UTextBlock;
class UVerticalBox;
class UImage;
class UWidgetAnimation;

UCLASS()
class VROOMVROOM_API UVroomMainMenuWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	// Widget Components (must match Blueprint widget names exactly)
	UPROPERTY(meta = (BindWidget))
	UTextBlock* TitleText;

	UPROPERTY(meta = (BindWidget))
	UTextBlock* SubtitleText;

	UPROPERTY(meta = (BindWidget))
	UButton* NewGameButton;

	UPROPERTY(meta = (BindWidget))
	UButton* ContinueButton;

	UPROPERTY(meta = (BindWidget))
	UButton* LoadGameButton;

	UPROPERTY(meta = (BindWidget))
	UButton* OptionsButton;

	UPROPERTY(meta = (BindWidget))
	UButton* CreditsButton;

	UPROPERTY(meta = (BindWidget))
	UButton* QuitButton;

	UPROPERTY(meta = (BindWidget))
	UVerticalBox* ButtonContainer;

	UPROPERTY(meta = (BindWidget))
	UImage* BackgroundImage;

	UPROPERTY(meta = (BindWidget))
	UTextBlock* VersionText;

	UPROPERTY(meta = (BindWidget))
	UTextBlock* WarningText;

	// Animations
	UPROPERTY(Transient, meta = (BindWidgetAnim))
	UWidgetAnimation* FadeInAnimation;

	UPROPERTY(Transient, meta = (BindWidgetAnim))
	UWidgetAnimation* ButtonHoverAnimation;

protected:
	virtual void NativeConstruct() override;
	virtual void NativeDestruct() override;
	virtual void NativeOnInitialized() override;

	// Button Callbacks
	UFUNCTION()
	void OnNewGameClicked();

	UFUNCTION()
	void OnContinueClicked();

	UFUNCTION()
	void OnLoadGameClicked();

	UFUNCTION()
	void OnOptionsClicked();

	UFUNCTION()
	void OnCreditsClicked();

	UFUNCTION()
	void OnQuitClicked();

	// Button Hover Events
	UFUNCTION()
	void OnButtonHovered(UButton* HoveredButton);

	UFUNCTION()
	void OnButtonUnhovered(UButton* UnhoveredButton);

public:
	// Public Interface
	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void Setup();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void Teardown();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void UpdateContinueButtonState();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void ShowLoadGameDialog();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void ShowOptionsMenu();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void ShowCredits();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void StartNewGame();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void ContinueGame();

	UFUNCTION(BlueprintCallable, Category = "Main Menu")
	void LoadSaveGame(const FString& SaveSlotName);

	UFUNCTION(BlueprintImplementableEvent, Category = "Main Menu")
	void PlayButtonSound();

	UFUNCTION(BlueprintImplementableEvent, Category = "Main Menu")
	void PlayHoverSound();

private:
	bool bHasSaveGame;
	FString LastSaveSlot;

	void SetupButtonStyles();
	void CheckForExistingSaves();
	void SetButtonEnabled(UButton* Button, bool bEnabled);
	void AnimateButtonHover(UButton* Button, bool bIsHovering);
};