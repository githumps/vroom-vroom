# BP_CourtroomManager - COMPLETE BLUEPRINT SPECIFICATION
## Courtroom Management System

---

## OVERVIEW

BP_CourtroomManager is a simple Actor blueprint that handles courtroom-specific logic, primarily spawning and managing the paperwork UI when the player enters the courtroom after arrest.

**Location:** `Content/Blueprints/Core/BP_CourtroomManager`

**Parent Class:** Actor

**Purpose:**
- Spawn paperwork UI on level load
- Manage player input mode (enable mouse cursor)
- Handle courtroom-specific events
- Optional: Play intro sounds/effects

---

## BLUEPRINT SETUP

### Create New Blueprint

1. **Content Browser → Right Click → Blueprint Class**
2. **Parent Class:** Actor
3. **Name:** BP_CourtroomManager
4. **Location:** Content/Blueprints/Core/

---

## COMPONENTS

**Default Scene Root Only**

No additional components needed. This is a logic-only actor.

**Transform:**
- Location: 0, 0, 0
- Rotation: 0, 0, 0
- Scale: 1, 1, 1

---

## VARIABLES

### Variable 1: PaperworkWidgetClass

**Properties:**
- Variable Name: PaperworkWidgetClass
- Variable Type: Widget Class Reference (User Widget → Class Reference)
- Instance Editable: TRUE (checked)
- Category: "Courtroom Settings"
- Default Value: WBP_PaperworkUI (set after widget is created)
- Tooltip: "The paperwork UI widget to spawn in courtroom"

---

### Variable 2: PaperworkWidgetInstance

**Properties:**
- Variable Name: PaperworkWidgetInstance
- Variable Type: User Widget (Object Reference)
- Instance Editable: FALSE
- Category: "Courtroom Settings"
- Default Value: None
- Tooltip: "Runtime reference to spawned paperwork widget"

---

### Variable 3: IntroDelay

**Properties:**
- Variable Name: IntroDelay
- Variable Type: Float
- Instance Editable: TRUE
- Category: "Courtroom Settings"
- Default Value: 0.5
- Tooltip: "Delay before showing paperwork (seconds)"

---

### Variable 4: bPlayGavelSound

**Properties:**
- Variable Name: bPlayGavelSound
- Variable Type: Boolean
- Instance Editable: TRUE
- Category: "Courtroom Settings"
- Default Value: TRUE
- Tooltip: "Play gavel sound on courtroom entry"

---

### Variable 5: GavelSound

**Properties:**
- Variable Name: GavelSound
- Variable Type: Sound Base (Object Reference)
- Instance Editable: TRUE
- Category: "Courtroom Settings"
- Default Value: None (optional)
- Tooltip: "Gavel bang sound effect"

---

## EVENT GRAPH - NODE BY NODE

### SECTION 1: Event BeginPlay Chain

**Node 1: Event BeginPlay**
- Type: Event
- Location: (-1200, 0)

---

**Node 2: Print String (Debug)**
- Location: (-1000, 0)
- Inputs:
  - In String: "Courtroom Manager: Initializing..."
  - Text Color: Green (R:0, G:1, B:0, A:1)
  - Duration: 3.0
  - Print to Screen: TRUE
  - Print to Log: TRUE
- Connected: BeginPlay Exec → Print String

---

**Node 3: Set Input Mode UI Only**
- Location: (-800, 0)
- Target: Get Player Controller (index 0)
- Inputs:
  - Widget to Focus: None (leave empty)
- Connected: Print String → Set Input Mode UI Only

---

**Node 4: Set Show Mouse Cursor**
- Location: (-600, 0)
- Target: Get Player Controller (index 0)
- Inputs:
  - Show Mouse Cursor: TRUE (checked)
- Connected: Set Input Mode → Set Show Mouse Cursor

---

**Node 5: Branch (Check Play Gavel Sound)**
- Location: (-400, 0)
- Inputs:
  - Condition: bPlayGavelSound variable
- Connected: Set Show Mouse Cursor → Branch

---

**Node 6: Is Valid (Gavel Sound)**
- Location: (-200, -100)
- Inputs:
  - Input Object: GavelSound variable
- Connected: Branch True → Is Valid

---

**Node 7: Play Sound 2D**
- Location: (0, -100)
- Inputs:
  - Sound: GavelSound variable
  - Volume Multiplier: 1.0
  - Pitch Multiplier: 1.0
  - Start Time: 0.0
- Connected: Is Valid True → Play Sound 2D

---

**Node 8: Sequence (Branch execution)**
- Location: (-200, 100)
- Inputs:
  - Input: Branch False OR Play Sound 2D completion
- Connected: Joins both paths

---

**Node 9: Delay**
- Location: (0, 100)
- Inputs:
  - Duration: IntroDelay variable (0.5)
- Connected: Sequence Then 0 → Delay

---

**Node 10: SpawnPaperworkUI (Custom Function Call)**
- Location: (200, 100)
- Connected: Delay Completed → SpawnPaperworkUI

---

### SECTION 2: SpawnPaperworkUI Function

**Create New Function:** SpawnPaperworkUI

---

**Node 1: Entry Node**
- Location: (-1000, 400)

---

**Node 2: Is Valid (PaperworkWidgetClass)**
- Location: (-800, 400)
- Inputs:
  - Input Object: PaperworkWidgetClass variable
- Connected: Entry → Is Valid

---

**Node 3: Branch**
- Location: (-600, 400)
- Inputs:
  - Condition: Is Valid output
- Connected: Is Valid → Branch

---

**Node 4: Create Widget**
- Location: (-400, 400)
- Inputs:
  - Class: PaperworkWidgetClass variable
  - Owning Player: Get Player Controller (index 0)
- Connected: Branch True → Create Widget

---

**Node 5: Set PaperworkWidgetInstance**
- Location: (-200, 400)
- Inputs:
  - Paperwork Widget Instance: Return Value (from Create Widget)
- Connected: Create Widget → Set Variable

---

**Node 6: Add to Viewport**
- Location: (0, 400)
- Target: PaperworkWidgetInstance variable
- Inputs:
  - Z Order: 10 (high priority, front of screen)
- Connected: Set Variable → Add to Viewport

---

**Node 7: Print String (Success)**
- Location: (200, 400)
- Inputs:
  - In String: "Paperwork UI spawned successfully"
  - Text Color: Green
  - Duration: 3.0
- Connected: Add to Viewport → Print String

---

**Node 8: Return Node**
- Location: (400, 400)
- Connected: Print String → Return

---

**Node 9: Print String (Error - Branch False)**
- Location: (-400, 500)
- Inputs:
  - In String: "ERROR: Paperwork Widget Class is not set!"
  - Text Color: Red
  - Duration: 5.0
  - Print to Log: TRUE
- Connected: Branch False → Print String

---

**Node 10: Return Node (Error Path)**
- Location: (-200, 500)
- Connected: Print String → Return

---

### SECTION 3: CleanupCourtroom Function (Optional)

**Create New Function:** CleanupCourtroom

**Purpose:** Called when leaving courtroom or resetting

---

**Node 1: Entry Node**
- Location: (-800, 700)

---

**Node 2: Is Valid (PaperworkWidgetInstance)**
- Location: (-600, 700)
- Inputs:
  - Input Object: PaperworkWidgetInstance variable
- Connected: Entry → Is Valid

---

**Node 3: Branch**
- Location: (-400, 700)
- Inputs:
  - Condition: Is Valid output
- Connected: Is Valid → Branch

---

**Node 4: Remove from Parent**
- Location: (-200, 700)
- Target: PaperworkWidgetInstance variable
- Connected: Branch True → Remove from Parent

---

**Node 5: Set PaperworkWidgetInstance (Clear)**
- Location: (0, 700)
- Inputs:
  - Paperwork Widget Instance: None (null reference)
- Connected: Remove from Parent → Set Variable

---

**Node 6: Set Input Mode Game Only**
- Location: (200, 700)
- Target: Get Player Controller (index 0)
- Connected: Set Variable → Set Input Mode

---

**Node 7: Set Show Mouse Cursor (Hide)**
- Location: (400, 700)
- Target: Get Player Controller (index 0)
- Inputs:
  - Show Mouse Cursor: FALSE
- Connected: Set Input Mode → Set Show Mouse Cursor

---

**Node 8: Return Node**
- Location: (600, 700)
- Connected: Set Show Mouse Cursor → Return

---

### SECTION 4: Event EndPlay (Cleanup)

**Node 1: Event EndPlay**
- Type: Event
- Location: (-500, 900)

---

**Node 2: CleanupCourtroom (Function Call)**
- Location: (-300, 900)
- Connected: EndPlay → CleanupCourtroom

---

## ADDITIONAL OPTIONAL FUNCTIONS

### Function: ShowVerdictMessage (Custom Event)

**Purpose:** Show custom message after paperwork is read

---

**Custom Event: ShowVerdictMessage**
- Parameters:
  - MessageText (String)
  - DisplayDuration (Float)

---

**Node 1: Create Widget**
- Class: WBP_SimpleMessage (create separate simple message widget)
- Owning Player: Get Player Controller

---

**Node 2: Set Text**
- Target: Created Widget
- Text: MessageText parameter

---

**Node 3: Add to Viewport**
- Z Order: 15 (above paperwork)

---

**Node 4: Set Timer by Event**
- Event: Remove Message
- Time: DisplayDuration
- Looping: FALSE

---

### Function: PlayGavelBang (Custom Event)

**Purpose:** Play gavel sound with optional camera shake

---

**Node 1: Play Sound 2D**
- Sound: GavelSound variable
- Volume: 1.0

---

**Node 2: Client Play Camera Shake (Optional)**
- Camera Shake: Light_Camera_Shake (if available)
- Scale: 0.5
- Target: Get Player Controller

---

## BLUEPRINT CLASS DEFAULTS

**Actor Settings:**
- Auto Receive Input: Disabled
- Enable Auto LOD Generation: FALSE
- Can Be Damaged: FALSE
- Hidden in Game: TRUE
- Replicates: FALSE (single player)

**Tags:**
- Actor Tag 0: "CourtroomManager"

**Tick Settings:**
- Primary Actor Tick:
  - Start with Tick Enabled: FALSE (no tick needed)
  - Tick Interval: 0.0

---

## USAGE IN LEVEL

### Placing in Courtroom.umap

1. **Drag BP_CourtroomManager into level**
2. **Position:** X=0, Y=0, Z=100 (exact location doesn't matter)
3. **Set Properties in Details Panel:**
   - Paperwork Widget Class: WBP_PaperworkUI
   - Intro Delay: 0.5
   - bPlay Gavel Sound: TRUE
   - Gavel Sound: (assign sound asset if available)

---

## TESTING PROCEDURE

### Test 1: Widget Spawning

1. **PIE (Play In Editor) from Courtroom level**
2. **Expected Results:**
   - Mouse cursor appears
   - Paperwork UI spawns after 0.5 second delay
   - UI is centered and readable
   - Green debug message: "Paperwork UI spawned successfully"

### Test 2: Input Mode

1. **Verify mouse is visible and functional**
2. **Try to click button in paperwork UI**
3. **Expected:** Button responds to hover and click

### Test 3: Sound (if enabled)

1. **Enable bPlay Gavel Sound**
2. **Assign gavel sound asset**
3. **Play from Courtroom level**
4. **Expected:** Gavel sound plays once on level load

### Test 4: Level Transition

1. **Get arrested in main game level**
2. **Wait for courtroom transition**
3. **Expected:** Courtroom loads, manager spawns UI correctly

---

## ERROR HANDLING

### Common Issues and Solutions

**Issue: Widget Not Appearing**

**Debug Steps:**
1. Check PaperworkWidgetClass is assigned
2. Verify WBP_PaperworkUI exists and compiles
3. Check print strings in output log
4. Verify Add to Viewport is called

**Fix:**
- Add print strings at each step
- Check widget class reference in Details panel
- Ensure Get Player Controller returns valid controller

---

**Issue: Mouse Cursor Not Appearing**

**Debug Steps:**
1. Check Set Show Mouse Cursor is called
2. Verify input mode is set to UI Only
3. Check player controller is valid

**Fix:**
- Add delay before setting input mode (0.1 seconds)
- Use "Get Player Controller" not "Get Owning Player"
- Check widget is set to focusable

---

**Issue: Gavel Sound Not Playing**

**Debug Steps:**
1. Check bPlay Gavel Sound is TRUE
2. Verify GavelSound variable is assigned
3. Check Is Valid returns true
4. Test sound asset in content browser

**Fix:**
- Import sound asset if missing
- Check sound asset format (WAV recommended)
- Verify sound asset is not muted in details
- Check audio device is working

---

## PERFORMANCE CONSIDERATIONS

**Optimization:**
- No Tick function (event-driven only)
- Widget created once on BeginPlay
- Minimal CPU overhead
- No physics or collision

**Memory:**
- Single widget instance in memory
- Cleaned up on EndPlay
- No persistent references

---

## EXTENSIBILITY

### Future Enhancements:

1. **Verdict Animation System:**
   - Add timer to show verdict after delay
   - Animate verdict text appearance
   - Play additional sound effects

2. **Judge NPC:**
   - Spawn judge character
   - Play judge dialogue
   - Animate judge gestures

3. **Paperwork Randomization:**
   - Random charges from list
   - Random verdict severity
   - Dynamic fine amounts

4. **Courtroom Events:**
   - Random gavel bangs during paperwork reading
   - Audience reactions (if crowd added)
   - Dramatic lighting changes

5. **Multiple Outcomes:**
   - Different endings based on player's "crimes"
   - Jail time vs community service
   - Ability to appeal (leads to second court visit)

---

## BLUEPRINT COMPILATION CHECKLIST

Before compiling:

1. [ ] All variables created with correct types
2. [ ] Function returns connect to Return nodes
3. [ ] No dangling execution pins
4. [ ] Get Player Controller nodes present
5. [ ] Widget class reference will be set in Details panel
6. [ ] Print strings added for debugging
7. [ ] Delay node has valid duration

**Compile Warnings to Ignore:**
- "PaperworkWidgetClass is not assigned" (will be set in level)
- "GavelSound is None" (optional sound)

**Compile Errors to Fix:**
- Missing return nodes in functions
- Invalid widget class references
- Mismatched variable types

---

## IMPLEMENTATION TIME ESTIMATE

**Blueprint Construction:**
- Create blueprint and variables: 5 minutes
- Event BeginPlay chain: 10 minutes
- SpawnPaperworkUI function: 8 minutes
- CleanupCourtroom function: 5 minutes
- Event EndPlay: 2 minutes

**Total Time: ~30 minutes**

---

## INTEGRATION WITH OTHER SYSTEMS

### Connects to:

1. **BP_PoliceVehicle:**
   - Receives player via "Open Level" node
   - No direct reference needed

2. **WBP_PaperworkUI:**
   - Spawns and manages widget
   - Widget handles its own button logic

3. **Courtroom Level:**
   - Placed as actor in level
   - Auto-activates on level load

4. **Player Controller:**
   - Sets input mode to UI
   - Shows mouse cursor
   - Handles input routing

---

## BLUEPRINT READY FOR CONSTRUCTION

All specifications complete. Build in order:

1. Create blueprint with Actor parent class
2. Add all variables with correct types
3. Build Event BeginPlay chain
4. Create SpawnPaperworkUI function
5. Create CleanupCourtroom function
6. Add Event EndPlay cleanup
7. Compile and test

Place in Courtroom level and assign PaperworkWidgetClass in Details panel.

COURTROOM MANAGEMENT SYSTEM READY.
PAPERWORK WILL BE SERVED.
JUSTICE IS AUTOMATIC.
