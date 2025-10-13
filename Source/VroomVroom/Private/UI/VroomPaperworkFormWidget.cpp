// Copyright Vroom Vroom Game. All Rights Reserved.

#include "UI/VroomPaperworkFormWidget.h"
#include "Components/EditableTextBox.h"
#include "Components/CheckBox.h"
#include "Components/Button.h"
#include "Components/ScrollBox.h"
#include "Components/TextBlock.h"
#include "Components/CanvasPanel.h"
#include "TimerManager.h"

void UVroomPaperworkFormWidget::NativeConstruct()
{
	Super::NativeConstruct();

	// Bind the submit button click event
	if (SubmitButton)
	{
		SubmitButton->OnClicked.AddDynamic(this, &UVroomPaperworkFormWidget::OnSubmitButtonClicked);
	}

	// Hide error message initially
	if (ErrorMessageText)
	{
		ErrorMessageText->SetVisibility(ESlateVisibility::Hidden);
	}

	// Set up the form
	Setup();
}

void UVroomPaperworkFormWidget::NativeDestruct()
{
	// Clean up timer if active
	if (GetWorld())
	{
		GetWorld()->GetTimerManager().ClearTimer(ErrorMessageTimerHandle);
	}

	// Unbind button events
	if (SubmitButton)
	{
		SubmitButton->OnClicked.RemoveDynamic(this, &UVroomPaperworkFormWidget::OnSubmitButtonClicked);
	}

	Super::NativeDestruct();
}

void UVroomPaperworkFormWidget::Setup()
{
	// Clear all fields on setup to ensure clean state
	ClearAllFields();

	// Set form title if available
	if (FormTitleText)
	{
		FormTitleText->SetText(FText::FromString("OFFICIAL TRAFFIC VIOLATION BUREAUCRACY FORM 47B-R2-D2"));
	}
}

void UVroomPaperworkFormWidget::Teardown()
{
	// Clean up and remove from viewport
	ClearAllFields();
	RemoveFromParent();
}

void UVroomPaperworkFormWidget::OnSubmitButtonClicked()
{
	// The EVIL validation logic begins...
	bool bIsFormValid = ValidateForm();

	if (bIsFormValid)
	{
		// SUCCESS! Process the submission
		PlaySubmitSound();
		ProcessSuccessfulSubmission();
	}
	else
	{
		// FAILURE! Clear everything and show error message
		PlayErrorSound();
		ShowErrorMessage();

		// Wait 2 seconds for comedic effect before clearing
		if (GetWorld())
		{
			FTimerHandle ClearTimerHandle;
			GetWorld()->GetTimerManager().SetTimer(ClearTimerHandle, [this]()
			{
				ClearAllFields();
				HideErrorMessageAfterDelay();
			}, 2.0f, false);
		}
	}
}

bool UVroomPaperworkFormWidget::ValidateForm()
{
	// Check all text boxes
	TArray<UEditableTextBox*> TextBoxes = GetAllTextBoxes();
	for (UEditableTextBox* TextBox : TextBoxes)
	{
		if (IsTextBoxEmpty(TextBox))
		{
			return false;
		}
	}

	// Check all checkboxes
	TArray<UCheckBox*> CheckBoxes = GetAllCheckBoxes();
	for (UCheckBox* CheckBox : CheckBoxes)
	{
		if (IsCheckBoxUnchecked(CheckBox))
		{
			return false;
		}
	}

	// All fields filled and all boxes checked!
	return true;
}

void UVroomPaperworkFormWidget::ClearAllFields()
{
	// Clear all text boxes
	TArray<UEditableTextBox*> TextBoxes = GetAllTextBoxes();
	for (UEditableTextBox* TextBox : TextBoxes)
	{
		if (TextBox)
		{
			TextBox->SetText(FText::GetEmpty());
		}
	}

	// Uncheck all checkboxes
	TArray<UCheckBox*> CheckBoxes = GetAllCheckBoxes();
	for (UCheckBox* CheckBox : CheckBoxes)
	{
		if (CheckBox)
		{
			CheckBox->SetIsChecked(false);
		}
	}
}

void UVroomPaperworkFormWidget::ShowErrorMessage()
{
	if (ErrorMessageText)
	{
		ErrorMessageText->SetText(FText::FromString("INCOMPLETE FORM! START OVER!"));
		ErrorMessageText->SetVisibility(ESlateVisibility::Visible);
	}
}

void UVroomPaperworkFormWidget::HideErrorMessageAfterDelay()
{
	if (ErrorMessageText)
	{
		ErrorMessageText->SetVisibility(ESlateVisibility::Hidden);
	}
}

void UVroomPaperworkFormWidget::ProcessSuccessfulSubmission()
{
	// Show the sentence via Blueprint event
	ShowSentence();

	// Small delay before returning to open world for dramatic effect
	if (GetWorld())
	{
		FTimerHandle ReturnTimerHandle;
		GetWorld()->GetTimerManager().SetTimer(ReturnTimerHandle, [this]()
		{
			ReturnToOpenWorld();
			Teardown();
		}, 3.0f, false);
	}
}

bool UVroomPaperworkFormWidget::IsTextBoxEmpty(UEditableTextBox* TextBox)
{
	if (!TextBox)
	{
		return true;
	}

	FText CurrentText = TextBox->GetText();
	return CurrentText.IsEmpty() || CurrentText.ToString().TrimStartAndEnd().IsEmpty();
}

bool UVroomPaperworkFormWidget::IsCheckBoxUnchecked(UCheckBox* CheckBox)
{
	if (!CheckBox)
	{
		return true;
	}

	return !CheckBox->IsChecked();
}

TArray<UEditableTextBox*> UVroomPaperworkFormWidget::GetAllTextBoxes()
{
	TArray<UEditableTextBox*> TextBoxes;
	TextBoxes.Add(FullNameTextBox);
	TextBoxes.Add(SSNTextBox);
	TextBoxes.Add(ExistingWhileDrivingTextBox);
	TextBoxes.Add(Essay500WordsTextBox);
	TextBoxes.Add(VehicleColorTextBox);
	TextBoxes.Add(HeartbeatsTextBox);
	TextBoxes.Add(DidYouBreatheTextBox);
	TextBoxes.Add(MaidenNamesTextBox);
	TextBoxes.Add(OfficerFavoriteColorTextBox);
	TextBoxes.Add(SignatureTextBox);
	return TextBoxes;
}

TArray<UCheckBox*> UVroomPaperworkFormWidget::GetAllCheckBoxes()
{
	TArray<UCheckBox*> CheckBoxes;
	CheckBoxes.Add(CheckBox47B);
	CheckBoxes.Add(AcknowledgeGuiltyCheckBox);
	CheckBoxes.Add(ConsentPaperworkCheckBox);
	CheckBoxes.Add(Form30SecondsCheckBox);
	CheckBoxes.Add(SurrenderSoulCheckBox);
	CheckBoxes.Add(NotAgreeCheckBox);
	CheckBoxes.Add(CertifyCheckedCheckBox);
	CheckBoxes.Add(AcknowledgeCheckingCheckBox);
	return CheckBoxes;
}
