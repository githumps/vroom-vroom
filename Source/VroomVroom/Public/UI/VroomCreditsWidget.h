// Copyright Vroom Vroom Game. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "VroomCreditsWidget.generated.h"

class UScrollBox;
class UTextBlock;
class UButton;
class UImage;

USTRUCT(BlueprintType)
struct FCreditEntry
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FString Role;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	FString Name;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	bool bIsHeader;

	FCreditEntry()
	{
		Role = "";
		Name = "";
		bIsHeader = false;
	}
};

UCLASS()
class VROOMVROOM_API UVroomCreditsWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	// Widget Components
	UPROPERTY(meta = (BindWidget))
	UScrollBox* CreditsScrollBox;

	UPROPERTY(meta = (BindWidget))
	UTextBlock* TitleText;

	UPROPERTY(meta = (BindWidget))
	UButton* SkipButton;

	UPROPERTY(meta = (BindWidget))
	UButton* BackButton;

	UPROPERTY(meta = (BindWidget))
	UImage* BackgroundImage;

	// Credits Data
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Credits")
	TArray<FCreditEntry> CreditEntries;

	// Scroll Settings
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Credits")
	float ScrollSpeed;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Credits")
	float ScrollDelay;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Credits")
	bool bAutoScroll;

protected:
	virtual void NativeConstruct() override;
	virtual void NativeDestruct() override;
	virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;

	UFUNCTION()
	void OnSkipClicked();

	UFUNCTION()
	void OnBackClicked();

public:
	UFUNCTION(BlueprintCallable, Category = "Credits")
	void StartCredits();

	UFUNCTION(BlueprintCallable, Category = "Credits")
	void StopCredits();

	UFUNCTION(BlueprintCallable, Category = "Credits")
	void PauseScrolling();

	UFUNCTION(BlueprintCallable, Category = "Credits")
	void ResumeScrolling();

	UFUNCTION(BlueprintCallable, Category = "Credits")
	void PopulateCredits();

	UFUNCTION(BlueprintImplementableEvent, Category = "Credits")
	void OnCreditsFinished();

private:
	float CurrentScrollOffset;
	float TimeSinceStart;
	bool bIsScrolling;
	bool bCreditsFinished;

	void InitializeCreditsData();
	void AddCreditEntry(const FString& Role, const FString& Name, bool bIsHeader = false);
};