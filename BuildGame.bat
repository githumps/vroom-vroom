@echo off
REM Vroom Vroom - Windows Build Script
REM This script builds and packages the game for Windows

echo =========================================
echo    VROOM VROOM - BUILD SCRIPT
echo    "Definitely Just A Driving Simulator"
echo =========================================
echo.

REM Configuration - UPDATE THESE PATHS FOR YOUR SYSTEM
set UE_PATH=E:\Epic Games\UE_5.6
set PROJECT_PATH=%~dp0
set PROJECT_FILE=%PROJECT_PATH%VroomVroom.uproject
set OUTPUT_PATH=%PROJECT_PATH%Builds\Windows

REM Check if Unreal Engine path exists
if not exist "%UE_PATH%" (
    echo ERROR: Unreal Engine not found at %UE_PATH%
    echo Please update UE_PATH in this script to your Unreal Engine installation
    pause
    exit /b 1
)

REM Check if project file exists
if not exist "%PROJECT_FILE%" (
    echo ERROR: Project file not found at %PROJECT_FILE%
    pause
    exit /b 1
)

echo Unreal Engine Path: %UE_PATH%
echo Project Path: %PROJECT_PATH%
echo Output Path: %OUTPUT_PATH%
echo.

REM Clean previous builds
echo Cleaning previous builds...
if exist "%OUTPUT_PATH%" (
    rd /s /q "%OUTPUT_PATH%" 2>nul
)
mkdir "%OUTPUT_PATH%"

REM Build the project (UE5.6 doesn't require separate project file generation)
echo.
echo Step 1: Building C++ code...
"%UE_PATH%\Engine\Build\BatchFiles\Build.bat" VroomVroom Win64 Development "%PROJECT_FILE%" -WaitMutex

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build C++ code
    pause
    exit /b 1
)

REM Cook and package
echo.
echo Step 2: Cooking and packaging for Windows...
echo This may take 15-30 minutes depending on your hardware...
echo.

"%UE_PATH%\Engine\Build\BatchFiles\RunUAT.bat" BuildCookRun ^
-project="%PROJECT_FILE%" ^
-noP4 ^
-platform=Win64 ^
-clientconfig=Shipping ^
-serverconfig=Shipping ^
-cook ^
-allmaps ^
-build ^
-stage ^
-pak ^
-archive ^
-archivedirectory="%OUTPUT_PATH%" ^
-prereqs ^
-nodebuginfo ^
-targetplatform=Windows ^
-cookflavor=WindowsClient ^
-compressed ^
-CrashReporter

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Packaging completed with warnings
    echo Check the output folder for the build
) else (
    echo.
    echo =========================================
    echo    BUILD COMPLETED SUCCESSFULLY!
    echo =========================================
    echo.
    echo Your game has been packaged to:
    echo %OUTPUT_PATH%
    echo.
    echo To run the game:
    echo 1. Navigate to %OUTPUT_PATH%\WindowsClient
    echo 2. Run VroomVroom.exe
    echo.
    echo Remember: The excessive police presence is intentional!
)

echo.
pause