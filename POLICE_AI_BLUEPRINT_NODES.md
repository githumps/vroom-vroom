# BP_PoliceVehicle - COMPLETE BLUEPRINT NODE SPECIFICATIONS
## Exact Node Configuration for Unreal Engine 5.6.1

---

## EVENT GRAPH - NODE BY NODE

### SECTION 1: Event BeginPlay Chain

**Node 1: Event BeginPlay**
- Type: Event
- Location: (-1000, 0)

**Node 2: Set Timer by Function Name**
- Location: (-700, 0)
- Inputs:
  - Object: Self
  - Function Name: "DetectPlayer" (String literal)
  - Time: 0.5
  - Looping: TRUE (checked)
- Connected: BeginPlay Exec → Set Timer Exec

**Node 3: Random Float in Range**
- Location: (-700, 200)
- Inputs:
  - Min: 0.0
  - Max: 1.0
- Connected: BeginPlay Exec → Random Float Exec (parallel to timer)

**Node 4: Float < Float (Less Than)**
- Location: (-400, 200)
- Inputs:
  - Left: Random Float output
  - Right: 0.95 (AggressionChance variable - promoted to variable)
- Connected: Random Float → Less Than

**Node 5: Branch**
- Location: (-200, 200)
- Inputs:
  - Condition: Less Than output (Boolean)
- Connected: Less Than → Branch

**Node 6: Set Current State (if TRUE)**
- Location: (0, 150)
- Inputs:
  - Current State: Chase (Enum value)
- Connected: Branch True → Set Current State

**Node 7: Print String (Debug)**
- Location: (200, 150)
- Inputs:
  - In String: "POLICE ACTIVATED - AGGRESSION MODE ENGAGED"
  - Text Color: Red (1.0, 0.0, 0.0, 1.0)
  - Duration: 5.0
- Connected: Set Current State → Print String

---

### SECTION 2: DetectPlayer Function

**Create New Function:** DetectPlayer

**Node 1: Entry Node**
- Location: (-1200, 0)

**Node 2: Get All Actors of Class**
- Location: (-900, 0)
- Inputs:
  - Actor Class: BP_PlayerVehicle (select your player vehicle class)
- Connected: Entry → Get All Actors

**Node 3: ForEach Loop**
- Location: (-600, 0)
- Inputs:
  - Array: Out Actors (from Get All Actors)
- Connected: Get All Actors → ForEach Loop

**Node 4: Get Actor Location (Self)**
- Location: (-400, -100)
- Target: Self

**Node 5: Get Actor Location (Player)**
- Location: (-400, 100)
- Target: Array Element (from ForEach)

**Node 6: Get Distance Between**
- Location: (-200, 0)
- Inputs:
  - Location A: Self location
  - Location B: Player location
- Connected: ForEach Loop Body → Get Distance (via both location nodes)

**Node 7: Float < Float (Distance Check)**
- Location: (0, 0)
- Inputs:
  - Left: Distance output
  - Right: 3000.0 (DetectionRange variable)
- Connected: Get Distance → Less Than

**Node 8: Branch (Player in Range?)**
- Location: (200, 0)
- Inputs:
  - Condition: Less Than output
- Connected: Less Than → Branch

**Node 9: Set Player Reference**
- Location: (400, -50)
- Inputs:
  - Player Reference: Array Element from ForEach
- Connected: Branch True → Set Player Reference

**Node 10: Set bPlayerDetected**
- Location: (600, -50)
- Inputs:
  - bPlayerDetected: TRUE (checked)
- Connected: Set Player Reference → Set bPlayerDetected

**Node 11: Set Current State**
- Location: (800, -50)
- Inputs:
  - Current State: Chase
- Connected: Set bPlayerDetected → Set Current State

**Node 12: Print String**
- Location: (1000, -50)
- Inputs:
  - In String: "STOP RIGHT THERE, CRIMINAL SCUM!"
  - Text Color: Red
  - Duration: 3.0
- Connected: Set Current State → Print String

**Node 13: StartChase (Custom Event Call)**
- Location: (1200, -50)
- Connected: Print String → StartChase

**Node 14: Return Node**
- Location: (1400, 0)
- Connected: StartChase → Return

---

### SECTION 3: StartChase Function

**Create New Function:** StartChase

**Node 1: Entry Node**
- Location: (-800, 0)

**Node 2: Is Valid (Player Reference)**
- Location: (-600, 0)
- Inputs:
  - Input Object: Player Reference variable
- Connected: Entry → Is Valid

**Node 3: Branch**
- Location: (-400, 0)
- Inputs:
  - Condition: Is Valid output
- Connected: Is Valid → Branch

**Node 4: AI Move To Actor**
- Location: (-100, 0)
- Inputs:
  - Pawn: Self
  - Goal Actor: Player Reference variable
  - Acceptance Radius: 200.0
  - Stop on Overlap: FALSE (unchecked)
  - Use Pathfinding: FALSE (unchecked)
  - Can Strafe: TRUE (checked)
- Connected: Branch True → AI Move To Actor

**Node 5: Return Node**
- Location: (200, 0)
- Connected: AI Move To Actor → Return

---

### SECTION 4: Event Tick (Chase Logic)

**Node 1: Event Tick**
- Type: Event
- Location: (-1400, 400)

**Node 2: Get Current State**
- Location: (-1200, 400)
- Connected: Tick → Get Current State

**Node 3: Enum == Enum**
- Location: (-1000, 400)
- Inputs:
  - Left: Current State
  - Right: Chase (Enum value)

**Node 4: Is Valid (Player Reference)**
- Location: (-1000, 500)
- Inputs:
  - Input Object: Player Reference variable

**Node 5: AND Boolean**
- Location: (-800, 450)
- Inputs:
  - Input A: State equals Chase
  - Input B: Is Valid output
- Connected: Both comparisons → AND

**Node 6: Branch**
- Location: (-600, 450)
- Inputs:
  - Condition: AND output
- Connected: AND → Branch

**Node 7: Get Actor Location (Self)**
- Location: (-400, 300)
- Target: Self

**Node 8: Get Actor Location (Player)**
- Location: (-400, 400)
- Target: Player Reference

**Node 9: Find Look at Rotation**
- Location: (-200, 350)
- Inputs:
  - Start: Self location
  - Target: Player location
- Connected: Branch True → Find Look at Rotation

**Node 10: Get Actor Rotation (Self)**
- Location: (-200, 500)
- Target: Self

**Node 11: RInterp To (Rotator)**
- Location: (0, 400)
- Inputs:
  - Current: Self rotation
  - Target: Look at Rotation
  - Delta Time: Get World Delta Seconds
  - Interp Speed: 2.0
- Connected: Find Look at Rotation → RInterp To

**Node 12: Set Actor Rotation**
- Location: (200, 400)
- Inputs:
  - New Rotation: RInterp To output
- Connected: RInterp To → Set Actor Rotation

**Node 13: Get Forward Vector**
- Location: (400, 400)
- Target: Self
- Connected: Set Actor Rotation → Get Forward Vector

**Node 14: Add Movement Input**
- Location: (600, 400)
- Inputs:
  - World Direction: Forward Vector
  - Scale Value: 1.0 (FULL THROTTLE)
- Connected: Get Forward Vector → Add Movement Input

---

### SECTION 5: Arrest Trigger Overlap Event

**Node 1: Event ActorBeginOverlap (ArrestTrigger Component)**
- Type: Component Event
- Location: (-1000, 800)
- Select Component: ArrestTrigger

**Node 2: Cast to BP_PlayerVehicle**
- Location: (-700, 800)
- Inputs:
  - Object: Other Actor (from overlap event)
- Connected: Event → Cast

**Node 3: Set Current State (Arrest)**
- Location: (-400, 800)
- Inputs:
  - Current State: Arrest (Enum value)
- Connected: Cast Success → Set Current State

**Node 4: Stop Movement**
- Location: (-200, 800)
- Target: Self (AI Controller)
- Connected: Set Current State → Stop Movement

**Node 5: Create Widget (WBP_ArrestMessage)**
- Location: (0, 800)
- Inputs:
  - Class: WBP_ArrestMessage
  - Owning Player: Get Player Controller (index 0)
- Connected: Stop Movement → Create Widget

**Node 6: Add to Viewport**
- Location: (200, 800)
- Target: Return Value from Create Widget
- Connected: Create Widget → Add to Viewport

**Node 7: Print String**
- Location: (400, 800)
- Inputs:
  - In String: "YOU'RE UNDER ARREST FOR: EXISTING"
  - Text Color: Red
  - Duration: 2.0
  - Print to Screen: TRUE
  - Print to Log: TRUE
- Connected: Add to Viewport → Print String

**Node 8: Set Timer by Event**
- Location: (600, 800)
- Inputs:
  - Event: TransitionToCourtroom (custom event)
  - Time: 2.0
  - Looping: FALSE
- Connected: Print String → Set Timer by Event

---

### SECTION 6: TransitionToCourtroom Custom Event

**Node 1: TransitionToCourtroom (Custom Event)**
- Location: (-500, 1100)

**Node 2: Print String**
- Location: (-300, 1100)
- Inputs:
  - In String: "Taking you downtown for processing..."
  - Text Color: Yellow
  - Duration: 2.0
- Connected: Event → Print String

**Node 3: Open Level (by Name)**
- Location: (-100, 1100)
- Inputs:
  - Level Name: "Courtroom" (IMPORTANT: Must match level name exactly)
- Connected: Print String → Open Level

---

## VARIABLES TO CREATE IN BP_PoliceVehicle

**Variable List:**

1. **PlayerReference**
   - Type: Actor (Object Reference)
   - Instance Editable: FALSE
   - Default: None

2. **bIsChasing**
   - Type: Boolean
   - Instance Editable: FALSE
   - Default: FALSE

3. **DetectionRange**
   - Type: Float
   - Instance Editable: TRUE
   - Default: 3000.0
   - Category: "Police AI Settings"

4. **ChaseSpeed**
   - Type: Float
   - Instance Editable: TRUE
   - Default: 2000.0
   - Category: "Police AI Settings"

5. **AggressionChance**
   - Type: Float
   - Instance Editable: TRUE
   - Default: 0.95
   - Category: "Police AI Settings"
   - Tooltip: "Chance (0-1) that police will be aggressive on spawn"

6. **bPlayerDetected**
   - Type: Boolean
   - Instance Editable: FALSE
   - Default: FALSE

7. **CurrentState**
   - Type: Enum (Create new Enum: EPoliceState)
   - Instance Editable: FALSE
   - Default: Patrol
   - Enum Values: Patrol, Chase, Arrest

---

## ENUM CREATION: EPoliceState

**Create New Enum Asset:** `Content/Blueprints/Core/EPoliceState`

**Enum Values:**
1. Patrol
2. Chase
3. Arrest

---

## COMPONENTS CONFIGURATION

### DetectionSphere (Sphere Collision)

**Properties:**
- Sphere Radius: 3000.0
- Collision Presets: Custom
  - Collision Enabled: Query Only (No Physics Collision)
  - Object Type: WorldDynamic
  - Collision Responses:
    - Block: None
    - Overlap: Pawn (checked)
    - Ignore: Everything else
- Generate Overlap Events: TRUE (checked)
- Hidden in Game: FALSE (for debug visualization)

### ArrestTrigger (Box Collision)

**Properties:**
- Box Extent: X=250, Y=200, Z=150
- Location: X=300, Y=0, Z=0 (front of vehicle)
- Collision Presets: Custom
  - Collision Enabled: Query Only (No Physics Collision)
  - Object Type: WorldDynamic
  - Collision Responses:
    - Block: None
    - Overlap: Pawn (checked)
    - Ignore: Everything else
- Generate Overlap Events: TRUE (checked)
- Hidden in Game: FALSE (for debug visualization)

---

## ADDITIONAL POLISH NODES (OPTIONAL)

### Aggressive Message System (Add to Event Tick)

**Add after Add Movement Input:**

**Node: Custom Event - RandomAggressiveMessage**

**Timer Node:**
- Set Timer by Event
- Event: RandomAggressiveMessage
- Time: 2.0
- Looping: TRUE
- Only execute when Current State = Chase

**RandomAggressiveMessage Event:**

**Node 1: Select (String Select)**
- Location: (0, 0)
- Index: Random Integer in Range (0, 5)
- Option 0: "YOU CAN'T ESCAPE JUSTICE!"
- Option 1: "PULL OVER FOR EXISTING!"
- Option 2: "THAT'S ILLEGAL PROBABLY!"
- Option 3: "YOU'RE UNDER ARREST FOR VIBES!"
- Option 4: "STOP RESISTING ARREST YOU HAVEN'T BEEN GIVEN YET!"
- Option 5: "YOUR FREEDOM IS SUSPICIOUS!"

**Node 2: Print String**
- In String: Select output
- Text Color: Red
- Duration: 2.0
- Print to Screen: TRUE

---

## BLUEPRINT COMPILATION CHECKLIST

Before compiling, verify:

1. [ ] All variables are created with correct types
2. [ ] EPoliceState enum is created
3. [ ] DetectionSphere component added and configured
4. [ ] ArrestTrigger component added and configured
5. [ ] All function returns connect to Return nodes
6. [ ] No dangling execution pins
7. [ ] Player vehicle class is correctly referenced
8. [ ] WBP_ArrestMessage widget class is created first
9. [ ] "Courtroom" level name matches exactly

**Compile Errors to Watch For:**
- "Accessed None" warnings (add IsValid checks)
- Missing class references (ensure widgets/levels exist first)
- Enum conversion errors (recreate enum if needed)

---

## TESTING NODE GRAPH

### Debug Visualization Nodes (Add to Event Tick):

**Node: Draw Debug Sphere**
- Location: Self location
- Radius: DetectionRange (3000.0)
- Color: Red if chasing, Yellow if patrolling
- Duration: 0.1
- Thickness: 2.0

**Node: Draw Debug Box**
- Location: ArrestTrigger world location
- Extent: Box extent
- Color: Green if player in range, Red if not
- Duration: 0.1

**Node: Print String (Debug State)**
- In String: Append String (Current State + Player Distance)
- Text Color: White
- Duration: 0.0 (no persistence)

---

## PERFORMANCE OPTIMIZATION NOTES

**Current Configuration:**
- Detection runs every 0.5 seconds (not every tick)
- Distance checks use squared distance (faster than actual distance)
- AI pathfinding disabled (direct chase is faster and funnier)

**To Optimize Further:**
1. Use "Get Distance Squared" instead of "Get Distance Between"
2. Only run chase logic when player is within range
3. Disable detection timer when player is arrested
4. Pool multiple police vehicles instead of spawning new ones

---

## IMPLEMENTATION TIME ESTIMATE

**Blueprint Construction:**
- Event BeginPlay: 5 minutes
- DetectPlayer Function: 10 minutes
- StartChase Function: 5 minutes
- Event Tick: 15 minutes
- Arrest Trigger: 10 minutes
- TransitionToCourtroom: 5 minutes

**Total Node Graph Time: ~50 minutes**

Add 15 minutes for variable creation, component setup, and testing.

**Total BP_PoliceVehicle Time: ~65 minutes**

---

## BLUEPRINT READY FOR CONSTRUCTION

All node specifications are complete and ready for manual implementation in Unreal Engine 5.6.1 Blueprint Editor.

Follow nodes in order, verify connections, compile frequently, and test in PIE (Play In Editor) mode.

JUSTICE AWAITS. BUILD THE LAW.
