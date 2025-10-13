@echo off
REM ============================================================================
REM VROOM VROOM - OPEN WORLD LEVEL CREATION LAUNCHER
REM Agent 1: Level Designer
REM ============================================================================

echo.
echo ================================================================================
echo VROOM VROOM - LEVEL CREATION LAUNCHER
echo ================================================================================
echo.
echo This script will help you create the OpenWorld level.
echo.
echo WHAT THIS SCRIPT DOES:
echo 1. Verifies project structure
echo 2. Opens Unreal Editor with VroomVroom project
echo 3. Provides instructions for level creation
echo.
echo ================================================================================
echo.

REM Check if project file exists
if not exist "VroomVroom.uproject" (
    echo [ERROR] VroomVroom.uproject not found in current directory!
    echo Please run this script from the project root directory.
    echo.
    pause
    exit /b 1
)

echo [OK] Project file found: VroomVroom.uproject
echo.

REM Create Maps directory if it doesn't exist
if not exist "Content\Maps" (
    echo [INFO] Creating Content\Maps directory...
    mkdir "Content\Maps"
    echo [OK] Maps directory created
) else (
    echo [OK] Maps directory exists
)
echo.

REM Check for common Unreal Engine installation paths
set UE_PATH=""

if exist "C:\Program Files\Epic Games\UE_5.6\Engine\Binaries\Win64\UnrealEditor.exe" (
    set UE_PATH="C:\Program Files\Epic Games\UE_5.6\Engine\Binaries\Win64\UnrealEditor.exe"
    echo [OK] Found Unreal Engine 5.6 at: %UE_PATH%
) else if exist "C:\Program Files\Epic Games\UE_5.5\Engine\Binaries\Win64\UnrealEditor.exe" (
    set UE_PATH="C:\Program Files\Epic Games\UE_5.5\Engine\Binaries\Win64\UnrealEditor.exe"
    echo [OK] Found Unreal Engine 5.5 at: %UE_PATH%
) else (
    echo [WARNING] Could not find Unreal Engine in default installation path
    echo.
    echo Please open VroomVroom.uproject manually from:
    echo %CD%\VroomVroom.uproject
    echo.
)

echo.
echo ================================================================================
echo LEVEL CREATION STEPS
echo ================================================================================
echo.
echo OPTION 1: AUTOMATED (Recommended)
echo   1. Editor will open
echo   2. Go to: Tools -^> Plugins -^> Python -^> Show Python Console
echo   3. Run this command in Python console:
echo      exec(open(r'%CD%\create_openworld_level.py').read())
echo.
echo OPTION 2: MANUAL
echo   1. Editor will open
echo   2. Follow steps in: LEVEL_CREATION_MANUAL_STEPS.md
echo   3. Create level, add terrain, lighting, and spawn points
echo.
echo ================================================================================
echo.

REM Open documentation
echo [INFO] Opening documentation files...
if exist "LEVEL_CREATION_MANUAL_STEPS.md" (
    start "" "LEVEL_CREATION_MANUAL_STEPS.md"
)

echo.
echo Press any key to open Unreal Editor...
pause >nul

REM Try to open Unreal Editor
if not %UE_PATH%=="" (
    echo [INFO] Launching Unreal Editor...
    start "" %UE_PATH% "%CD%\VroomVroom.uproject"
    echo.
    echo [OK] Unreal Editor is launching...
    echo.
) else (
    echo [INFO] Please open VroomVroom.uproject manually
    start "" "%CD%"
    echo.
)

echo ================================================================================
echo AFTER EDITOR OPENS:
echo ================================================================================
echo.
echo QUICK START:
echo   1. Open Python Console (Tools -^> Python -^> Show Python Console)
echo   2. Paste: exec(open(r'%CD%\create_openworld_level.py').read())
echo   3. Press Enter
echo   4. Wait for "SCRIPT COMPLETE!" message
echo   5. Save level (Ctrl+S)
echo   6. Test with Play button
echo.
echo OR follow manual steps in LEVEL_CREATION_MANUAL_STEPS.md
echo.
echo ================================================================================
echo.
echo FILES CREATED:
echo   - create_openworld_level.py (automated script)
echo   - LEVEL_CREATION_MANUAL_STEPS.md (manual instructions)
echo   - OpenWorld_Level_Specification.json (level spec)
echo.
echo TARGET OUTPUT:
echo   - Content\Maps\OpenWorld.umap (the level file)
echo.
echo ================================================================================
echo.

pause
