// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "VroomPaperworkFormWidget.generated.h"

class UEditableTextBox;
class UCheckBox;
class UButton;
class UScrollBox;
class UTextBlock;
class UCanvasPanel;

/**
 * The Paperwork Form Widget - The Humor Centerpiece
 * A hilariously frustrating bureaucratic form that clears itself if incomplete
 * This is designed to be both funny and infuriating
 */
UCLASS()
class VROOMVROOM_API UVroomPaperworkFormWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	// ==================== Text Field Components (10 total) ====================

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* FullNameTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* SSNTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* ExistingWhileDrivingTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* Essay500WordsTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* VehicleColorTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* HeartbeatsTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* DidYouBreatheTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* MaidenNamesTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* OfficerFavoriteColorTextBox;

	UPROPERTY(meta = (BindWidget))
	UEditableTextBox* SignatureTextBox;

	// ==================== Checkbox Components (8 total) ====================

	UPROPERTY(meta = (BindWidget))
	UCheckBox* CheckBox47B;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* AcknowledgeGuiltyCheckBox;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* ConsentPaperworkCheckBox;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* Form30SecondsCheckBox;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* SurrenderSoulCheckBox;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* NotAgreeCheckBox;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* CertifyCheckedCheckBox;

	UPROPERTY(meta = (BindWidget))
	UCheckBox* AcknowledgeCheckingCheckBox;

	// ==================== Layout Components ====================

	UPROPERTY(meta = (BindWidget))
	UCanvasPanel* RootCanvas;

	UPROPERTY(meta = (BindWidget))
	UScrollBox* FormScrollBox;

	UPROPERTY(meta = (BindWidget))
	UButton* SubmitButton;

	UPROPERTY(meta = (BindWidget))
	UTextBlock* ErrorMessageText;

	UPROPERTY(meta = (BindWidget))
	UTextBlock* FormTitleText;

protected:
	virtual void NativeConstruct() override;
	virtual void NativeDestruct() override;

	// ==================== Validation Logic ====================

	/**
	 * The EVIL validation function
	 * If ANY field is empty or ANY checkbox is unchecked:
	 * - Clear ALL fields
	 * - Show "INCOMPLETE FORM! START OVER!" message
	 * - Delay 2 seconds for comedic effect
	 *
	 * If all fields filled and all boxes checked:
	 * - Show the sentence
	 * - Return to OpenWorld
	 */
	UFUNCTION()
	void OnSubmitButtonClicked();

	/**
	 * Validates all form fields
	 * Returns true only if ALL fields are filled and ALL checkboxes are checked
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	bool ValidateForm();

	/**
	 * Clears all text fields and unchecks all checkboxes
	 * The nuclear option for incomplete forms
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	void ClearAllFields();

	/**
	 * Shows the error message with comedic timing
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	void ShowErrorMessage();

	/**
	 * Hides the error message after delay
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	void HideErrorMessageAfterDelay();

	/**
	 * Processes successful form submission
	 * Shows sentence and returns to open world
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	void ProcessSuccessfulSubmission();

public:
	// ==================== Public Interface ====================

	/**
	 * Sets up the form widget (called when shown)
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	void Setup();

	/**
	 * Tears down the form widget (called when hidden)
	 */
	UFUNCTION(BlueprintCallable, Category = "Paperwork Form")
	void Teardown();

	/**
	 * Blueprint event for showing the sentence after successful submission
	 */
	UFUNCTION(BlueprintImplementableEvent, Category = "Paperwork Form")
	void ShowSentence();

	/**
	 * Blueprint event for returning to open world
	 */
	UFUNCTION(BlueprintImplementableEvent, Category = "Paperwork Form")
	void ReturnToOpenWorld();

	/**
	 * Blueprint event for playing error sound
	 */
	UFUNCTION(BlueprintImplementableEvent, Category = "Paperwork Form")
	void PlayErrorSound();

	/**
	 * Blueprint event for playing submit sound
	 */
	UFUNCTION(BlueprintImplementableEvent, Category = "Paperwork Form")
	void PlaySubmitSound();

private:
	// Timer handle for delayed error message hiding
	FTimerHandle ErrorMessageTimerHandle;

	// Checks if a text field is empty
	bool IsTextBoxEmpty(UEditableTextBox* TextBox);

	// Checks if a checkbox is unchecked
	bool IsCheckBoxUnchecked(UCheckBox* CheckBox);

	// Helper to get all text boxes in an array
	TArray<UEditableTextBox*> GetAllTextBoxes();

	// Helper to get all checkboxes in an array
	TArray<UCheckBox*> GetAllCheckBoxes();
};
