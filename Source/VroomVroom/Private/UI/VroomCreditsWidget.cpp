// Copyright Vroom Vroom Game. All Rights Reserved.

#include "UI/VroomCreditsWidget.h"
#include "Components/ScrollBox.h"
#include "Components/TextBlock.h"
#include "Components/Button.h"
#include "Components/Image.h"
#include "Components/ScrollBoxSlot.h"
#include "Core/VroomVroomGameInstance.h"
#include "Kismet/GameplayStatics.h"

void UVroomCreditsWidget::NativeConstruct()
{
	Super::NativeConstruct();

	// Initialize settings
	ScrollSpeed = 50.0f; // Pixels per second
	ScrollDelay = 2.0f; // Delay before scrolling starts
	bAutoScroll = true;
	CurrentScrollOffset = 0.0f;
	TimeSinceStart = 0.0f;
	bIsScrolling = false;
	bCreditsFinished = false;

	// Bind buttons
	if (SkipButton)
	{
		SkipButton->OnClicked.AddDynamic(this, &UVroomCreditsWidget::OnSkipClicked);
	}

	if (BackButton)
	{
		BackButton->OnClicked.AddDynamic(this, &UVroomCreditsWidget::OnBackClicked);
		BackButton->SetVisibility(ESlateVisibility::Hidden); // Hidden until credits finish
	}

	// Set title
	if (TitleText)
	{
		TitleText->SetText(FText::FromString("VROOM VROOM"));
	}

	// Initialize and populate credits
	InitializeCreditsData();
	PopulateCredits();

	UE_LOG(LogTemp, Warning, TEXT("Credits Widget Initialized"));
}

void UVroomCreditsWidget::NativeDestruct()
{
	if (SkipButton)
	{
		SkipButton->OnClicked.RemoveAll(this);
	}

	if (BackButton)
	{
		BackButton->OnClicked.RemoveAll(this);
	}

	Super::NativeDestruct();
}

void UVroomCreditsWidget::NativeTick(const FGeometry& MyGeometry, float InDeltaTime)
{
	Super::NativeTick(MyGeometry, InDeltaTime);

	if (!bAutoScroll || bCreditsFinished)
	{
		return;
	}

	TimeSinceStart += InDeltaTime;

	// Wait for delay before starting
	if (TimeSinceStart < ScrollDelay)
	{
		return;
	}

	if (!bIsScrolling)
	{
		bIsScrolling = true;
	}

	// Auto-scroll the credits
	if (CreditsScrollBox && bIsScrolling)
	{
		CurrentScrollOffset += ScrollSpeed * InDeltaTime;
		CreditsScrollBox->SetScrollOffset(CurrentScrollOffset);

		// Check if we've reached the end
		float MaxScroll = CreditsScrollBox->GetScrollOffsetOfEnd();
		if (CurrentScrollOffset >= MaxScroll)
		{
			bCreditsFinished = true;
			bIsScrolling = false;
			OnCreditsFinished();

			// Show back button
			if (BackButton)
			{
				BackButton->SetVisibility(ESlateVisibility::Visible);
			}

			UE_LOG(LogTemp, Warning, TEXT("Credits finished rolling"));
		}
	}
}

void UVroomCreditsWidget::OnSkipClicked()
{
	UE_LOG(LogTemp, Warning, TEXT("Credits skipped"));

	StopCredits();

	// Return to main menu
	OnBackClicked();
}

void UVroomCreditsWidget::OnBackClicked()
{
	// Return to main menu
	if (UVroomVroomGameInstance* GameInstance = Cast<UVroomVroomGameInstance>(GetGameInstance()))
	{
		GameInstance->SetGameState(EVroomGameState::MainMenu);
	}

	this->RemoveFromViewport();
}

void UVroomCreditsWidget::StartCredits()
{
	CurrentScrollOffset = 0.0f;
	TimeSinceStart = 0.0f;
	bIsScrolling = false;
	bCreditsFinished = false;

	if (CreditsScrollBox)
	{
		CreditsScrollBox->SetScrollOffset(0.0f);
	}

	if (BackButton)
	{
		BackButton->SetVisibility(ESlateVisibility::Hidden);
	}

	bAutoScroll = true;

	UE_LOG(LogTemp, Warning, TEXT("Credits started"));
}

void UVroomCreditsWidget::StopCredits()
{
	bAutoScroll = false;
	bIsScrolling = false;

	if (BackButton)
	{
		BackButton->SetVisibility(ESlateVisibility::Visible);
	}
}

void UVroomCreditsWidget::PauseScrolling()
{
	bIsScrolling = false;
}

void UVroomCreditsWidget::ResumeScrolling()
{
	if (bAutoScroll && !bCreditsFinished)
	{
		bIsScrolling = true;
	}
}

void UVroomCreditsWidget::PopulateCredits()
{
	if (!CreditsScrollBox)
	{
		return;
	}

	// Clear existing content
	CreditsScrollBox->ClearChildren();

	// Add credit entries
	for (const FCreditEntry& Entry : CreditEntries)
	{
		UTextBlock* CreditText = NewObject<UTextBlock>(this);

		if (Entry.bIsHeader)
		{
			// Header style
			CreditText->SetText(FText::FromString(Entry.Role));
			FSlateFontInfo HeaderFont = CreditText->GetFont();
			HeaderFont.Size = 32;
			CreditText->SetFont(HeaderFont);
			CreditText->SetColorAndOpacity(FSlateColor(FLinearColor(1.0f, 0.8f, 0.0f)));
		}
		else
		{
			// Normal credit entry
			FString CreditLine = Entry.Role.IsEmpty() ? Entry.Name :
				FString::Printf(TEXT("%s - %s"), *Entry.Role, *Entry.Name);
			CreditText->SetText(FText::FromString(CreditLine));
			FSlateFontInfo NormalFont = CreditText->GetFont();
			NormalFont.Size = 20;
			CreditText->SetFont(NormalFont);
			CreditText->SetColorAndOpacity(FSlateColor(FLinearColor::White));
		}

		CreditText->SetJustification(ETextJustify::Center);

		UScrollBoxSlot* ScrollSlot = Cast<UScrollBoxSlot>(CreditsScrollBox->AddChild(CreditText));
		if (ScrollSlot)
		{
			ScrollSlot->SetPadding(FMargin(0, Entry.bIsHeader ? 20.0f : 5.0f));
			ScrollSlot->SetHorizontalAlignment(HAlign_Center);
		}
	}

	// Add some spacing at the end
	UTextBlock* SpacerText = NewObject<UTextBlock>(this);
	SpacerText->SetText(FText::FromString(" "));
	UScrollBoxSlot* SpacerSlot = Cast<UScrollBoxSlot>(CreditsScrollBox->AddChild(SpacerText));
	if (SpacerSlot)
	{
		SpacerSlot->SetPadding(FMargin(0, 200.0f));
	}
}

void UVroomCreditsWidget::InitializeCreditsData()
{
	CreditEntries.Empty();

	// Game Title
	AddCreditEntry("VROOM VROOM", "", true);
	AddCreditEntry("A Driving Simulator... And So Much More", "", false);
	AddCreditEntry("", "", false); // Spacer

	// Development Team
	AddCreditEntry("DEVELOPMENT TEAM", "", true);
	AddCreditEntry("Game Designer", "The One Who Thought This Was A Good Idea");
	AddCreditEntry("Lead Programmer", "Ctrl+C Ctrl+V Master");
	AddCreditEntry("Prison Consultant", "Big Mike (Currently Serving 25 to Life)");
	AddCreditEntry("Police Density Specialist", "Officer Everywhere");
	AddCreditEntry("", "", false);

	// Art & Design
	AddCreditEntry("ART & DESIGN", "", true);
	AddCreditEntry("Prison Tattoo Artist", "Shaky Hands McGee");
	AddCreditEntry("Courtroom Paperwork Designer", "Bureaucracy Enthusiast");
	AddCreditEntry("Police Siren Composer", "WEEE-WOOO Productions");
	AddCreditEntry("", "", false);

	// Quality Assurance
	AddCreditEntry("QUALITY ASSURANCE", "", true);
	AddCreditEntry("Lead Arrest Tester", "Got Arrested 5,000 Times");
	AddCreditEntry("Prison Food Taster", "Still Recovering");
	AddCreditEntry("Cigarette Economy Balancer", "Marlboro Mike");
	AddCreditEntry("Escape Route Tester", "Still At Large");
	AddCreditEntry("", "", false);

	// Special Thanks
	AddCreditEntry("SPECIAL THANKS", "", true);
	AddCreditEntry("", "Every Police Officer Who Made This Game Possible");
	AddCreditEntry("", "The Judge Who Keeps Seeing You In Court");
	AddCreditEntry("", "Your Cellmate (Sorry About The Snoring)");
	AddCreditEntry("", "The Prison Library Computer (56k Forever)");
	AddCreditEntry("", "Public Domain Book Authors");
	AddCreditEntry("", "The Guy Who Keeps Dropping The Soap");
	AddCreditEntry("", "", false);

	// Statistics
	AddCreditEntry("GAME STATISTICS", "", true);
	AddCreditEntry("Police Units Per Square Mile", "147");
	AddCreditEntry("Average Time Before Arrest", "3.7 minutes");
	AddCreditEntry("Total Paperwork Forms", "∞");
	AddCreditEntry("Mashed Potato Servings", "Every. Single. Day.");
	AddCreditEntry("Successful Prison Escapes", "0 (They always catch you)");
	AddCreditEntry("", "", false);

	// Legal
	AddCreditEntry("LEGAL DISCLAIMER", "", true);
	AddCreditEntry("", "This game does not accurately represent");
	AddCreditEntry("", "actual police density in any real location.");
	AddCreditEntry("", "Any resemblance to actual police presence");
	AddCreditEntry("", "is purely coincidental and probably impossible.");
	AddCreditEntry("", "", false);
	AddCreditEntry("", "Please don't actually try to escape from prison.");
	AddCreditEntry("", "It won't end well.");
	AddCreditEntry("", "", false);

	// Final Message
	AddCreditEntry("THANK YOU FOR PLAYING", "", true);
	AddCreditEntry("", "Now get back out there...");
	AddCreditEntry("", "The cops are waiting.");
	AddCreditEntry("", "", false);
	AddCreditEntry("", "", false);
	AddCreditEntry("Copyright 2024 Excessive Police Studios", "", false);
	AddCreditEntry("All Rights Reserved", "", false);
	AddCreditEntry("", "", false);
	AddCreditEntry("No cops were harmed in the making of this game.", "", false);
	AddCreditEntry("(They were too busy arresting you)", "", false);
}

void UVroomCreditsWidget::AddCreditEntry(const FString& Role, const FString& Name, bool bIsHeader)
{
	FCreditEntry NewEntry;
	NewEntry.Role = Role;
	NewEntry.Name = Name;
	NewEntry.bIsHeader = bIsHeader;

	CreditEntries.Add(NewEntry);
}