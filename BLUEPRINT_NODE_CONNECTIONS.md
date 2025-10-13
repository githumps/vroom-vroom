# VROOM VROOM - EXACT BLUEPRINT NODE CONNECTIONS
## Complete Node-by-Node Implementation Guide

---

## WBP_MainMenu - Event Graph

### Event Construct
```
[Event Construct]
    ├─→ [Get Player Controller]
    │   └─ Player Index: 0
    │       ├─→ [Set Input Mode UI Only]
    │       │   └─ In Widget to Focus: Self
    │       │
    │       └─→ [Set Show Mouse Cursor]
    │           └─ bShow Mouse Cursor: TRUE (checked)
```

### NewGameButton OnClicked
```
[NewGameButton] → [On Clicked]
    └─→ [Open Level (by Name)]
        └─ Level Name: "OpenWorld"
```

### QuitButton OnClicked
```
[QuitButton] → [On Clicked]
    └─→ [Quit Game]
        └─ Specific Player: [Get Player Controller] (Player Index: 0)
```

---

## BP_MainMenuManager - Event Graph

### Event BeginPlay
```
[Event BeginPlay]
    ├─→ [Create Widget]
    │   ├─ Class: WBP_MainMenu (select from dropdown)
    │   └─ Owning Player: [Get Player Controller] (Player Index: 0)
    │
    └─→ [Add to Viewport]
        └─ Target: [Return Value from Create Widget]
        └─ Z Order: 0
```

---

## WBP_PaperworkForm - Event Graph

### Event Construct
```
[Event Construct]
    ├─→ [Get Player Controller]
    │   └─ Player Index: 0
    │       ├─→ [Set Input Mode UI Only]
    │       │   └─ In Widget to Focus: Self
    │       │
    │       └─→ [Set Show Mouse Cursor]
    │           └─ bShow Mouse Cursor: TRUE (checked)
```

### Function: ValidateForm (Custom Function)

**Function Settings:**
- Return Type: Boolean
- Name: ValidateForm
- Category: Validation

**Function Graph:**
```
[Entry]
    │
    ├─→ [AND Boolean] ← Create chain of AND gates
    │   │
    │   ├─ Input A: [NOT Boolean] ← [Text Is Empty]
    │   │               └─ In Text: [Get Text] ← [NameField]
    │   │
    │   ├─ Input B: [NOT Boolean] ← [Text Is Empty]
    │   │               └─ In Text: [Get Text] ← [MotherMaidenField]
    │   │
    │   ├─ Continue this pattern for ALL 10 text fields...
    │   │
    │   └─ Final Input: [Essay Word Count Check]
    │                     │
    │                     └─→ [Get Text] ← [EssayField]
    │                         └─→ [ToString]
    │                             └─→ [ParseIntoArray]
    │                                 ├─ Delimiter: " " (space)
    │                                 └─→ [Length]
    │                                     └─→ [==] (Equal)
    │                                         ├─ A: [Length result]
    │                                         └─ B: 500
    │
    ├─→ [AND Boolean] ← Checkbox validation
    │   │
    │   ├─ At least one relationship checkbox:
    │   │   [OR Boolean]
    │   │   ├─ [Is Checked] ← [RelationshipOwner]
    │   │   ├─ [Is Checked] ← [RelationshipBorrower]
    │   │   ├─ [Is Checked] ← [RelationshipThief]
    │   │   └─ [Is Checked] ← [RelationshipSpiritual]
    │   │
    │   ├─ All legal checkboxes must be checked:
    │   │   [AND Boolean]
    │   │   ├─ [Is Checked] ← [Checkbox47B]
    │   │   ├─ [Is Checked] ← [CheckboxGuilty]
    │   │   ├─ [Is Checked] ← [CheckboxWaiver]
    │   │   └─ [Is Checked] ← [CheckboxSoul]
    │
    └─→ [Return Node]
        └─ Return Value: [Result of all AND operations]
```

**SIMPLIFIED VERSION (Easier to Build):**
```
Create multiple local variables to track validation:
- bAllTextFieldsFilled (Boolean)
- bWordCountCorrect (Boolean)
- bRelationshipSelected (Boolean)
- bAllLegalChecked (Boolean)

Then combine them:
[Entry]
    ├─→ [Set bAllTextFieldsFilled]
    │   └─ Value: [Check all text fields are not empty]
    │
    ├─→ [Set bWordCountCorrect]
    │   └─ Value: [Check essay word count == 500]
    │
    ├─→ [Set bRelationshipSelected]
    │   └─ Value: [Check at least one relationship checkbox]
    │
    ├─→ [Set bAllLegalChecked]
    │   └─ Value: [Check all 4 legal checkboxes]
    │
    └─→ [Return Node]
        └─ Return Value: [AND Boolean]
            ├─ bAllTextFieldsFilled
            ├─ bWordCountCorrect
            ├─ bRelationshipSelected
            └─ bAllLegalChecked
```

### Function: ClearAllFields (Custom Function)

**Function Settings:**
- Return Type: None (Void)
- Name: ClearAllFields
- Category: Utility

**Function Graph:**
```
[Entry]
    │
    ├─→ [Set Text (Text)]
    │   ├─ Target: NameField
    │   └─ In Text: "" (empty)
    │
    ├─→ [Set Text (Text)]
    │   ├─ Target: MotherMaidenField
    │   └─ In Text: ""
    │
    ├─→ [Continue for ALL 10 text fields...]
    │
    ├─→ [Set Checked State]
    │   ├─ Target: RelationshipOwner
    │   └─ In Checked State: Unchecked
    │
    ├─→ [Set Checked State]
    │   ├─ Target: RelationshipBorrower
    │   └─ In Checked State: Unchecked
    │
    ├─→ [Continue for ALL 8 checkboxes...]
    │
    └─→ [Return Node]

NOTE: These Set Text and Set Checked State nodes should be connected
in sequence (one after another) for clean execution flow.
```

### SubmitButton OnClicked (THE CRITICAL ONE!)

```
[SubmitButton] → [On Clicked]
    │
    └─→ [ValidateForm] (call your custom function)
        │
        └─→ [Branch]
            ├─ Condition: [Return Value from ValidateForm]
            │
            ├─ TRUE (Form is valid) ✅
            │   │
            │   ├─→ [Create Widget]
            │   │   ├─ Class: WBP_SentenceDisplay
            │   │   └─ Owning Player: [Get Player Controller] (Index 0)
            │   │
            │   ├─→ [Add to Viewport]
            │   │   └─ Target: [Widget from Create Widget]
            │   │
            │   ├─→ [Remove from Parent]
            │   │   └─ Target: Self
            │   │
            │   └─→ [Delay]
            │       ├─ Duration: 5.0
            │       │
            │       └─→ [Open Level (by Name)]
            │           └─ Level Name: "OpenWorld"
            │
            └─ FALSE (Form is invalid) ❌ THE EVIL PATH!
                │
                ├─→ [Set Text (Text)]
                │   ├─ Target: ErrorText
                │   ├─ In Text: "⚠️ INCOMPLETE FORM! ALL FIELDS ARE MANDATORY! STARTING OVER..."
                │   └─ (Set color to Red in designer)
                │
                ├─→ [Delay]
                │   ├─ Duration: 2.0
                │   │
                │   ├─→ [ClearAllFields] ← CALL THE EVIL FUNCTION!
                │   │
                │   └─→ [Set Text (Text)]
                │       ├─ Target: ErrorText
                │       └─ In Text: "" (clear error message)
```

### CancelButton OnClicked

```
[CancelButton] → [On Clicked]
    ├─→ [Remove from Parent]
    │   └─ Target: Self
    │
    └─→ [Open Level (by Name)]
        └─ Level Name: "OpenWorld"
```

---

## WBP_SentenceDisplay - Event Graph

### No Event Graph Needed!
This widget is purely visual. All logic is handled by WBP_PaperworkForm.
The delay and level transition happen in the paperwork form's SubmitButton logic.

---

## WBP_HUD - Event Graph

### Variables to Create:
- **VehicleReference** (Actor Object Reference)
  - Instance Editable: TRUE
  - Expose on Spawn: TRUE

### Function: UpdateSpeed (Custom Function)

**Function Settings:**
- Return Type: None (Void)
- Name: UpdateSpeed
- Category: Display
- Inputs:
  - Speed (Float)

**Function Graph:**
```
[Entry]
    └─→ [Set Text (Text)]
        ├─ Target: SpeedValue
        └─ In Text: [Format Text]
            └─ Format: "{Speed} mph"
                └─ Speed: [Round]
                    └─ A: [Speed input parameter]
```

### Event Tick

```
[Event Tick]
    └─→ [Branch]
        ├─ Condition: [IsValid]
        │   └─ Object: VehicleReference
        │
        └─ TRUE
            │
            ├─→ [Get Velocity]
            │   └─ Target: VehicleReference
            │
            ├─→ [VectorLength]
            │   └─ A: [Velocity from Get Velocity]
            │
            ├─→ [Float / Float]
            │   ├─ A: [Result from VectorLength]
            │   └─ B: 100.0 (conversion factor)
            │
            └─→ [UpdateSpeed]
                └─ Speed: [Result from division]
```

---

## Vehicle Blueprint Integration (BP_VehicleBase)

### Event BeginPlay (Add to existing)

```
[Event BeginPlay]
    └─→ [Sequence] (if you have existing BeginPlay logic)
        └─ Then 0 (or next available):
            │
            ├─→ [Create Widget]
            │   ├─ Class: WBP_HUD
            │   └─ Owning Player: [Get Player Controller] (Index 0)
            │
            ├─→ [Add to Viewport]
            │   └─ Target: [Return Value from Create Widget]
            │
            └─→ [Set VehicleReference]
                ├─ Target: [Return Value from Create Widget]
                └─ Vehicle Reference: Self
```

**Alternative (if you store the HUD widget):**
```
Create a variable: HUDWidget (WBP_HUD Object Reference)

[Event BeginPlay]
    ├─→ [Create Widget]
    │   ├─ Class: WBP_HUD
    │   └─ Owning Player: [Get Player Controller] (Index 0)
    │
    ├─→ [Set HUDWidget]
    │   └─ HUD Widget: [Return Value from Create Widget]
    │
    ├─→ [Add to Viewport]
    │   └─ Target: HUDWidget
    │
    └─→ [Set VehicleReference]
        ├─ Target: HUDWidget
        └─ Vehicle Reference: Self
```

---

## Common Node Names and Where to Find Them

### Text Operations:
- **Get Text (Text)** - Found when dragging off Editable Text Box variable
- **Set Text (Text)** - Found when dragging off Text Block variable
- **Text Is Empty** - Right-click → Search "Text Is Empty"
- **ToString** - Right-click → Search "ToString"
- **ParseIntoArray** - Right-click → Search "ParseIntoArray"

### Array Operations:
- **Length** - Drag off array → "Length"
- **Get** - Drag off array → "Get" (for accessing elements)

### Checkbox Operations:
- **Is Checked** - Drag off Check Box variable → "Is Checked"
- **Set Checked State** - Drag off Check Box variable → "Set Checked State"

### Logic Operations:
- **Branch** - Right-click → "Branch" (IF statement)
- **AND Boolean** - Right-click → "AND"
- **OR Boolean** - Right-click → "OR"
- **NOT Boolean** - Right-click → "NOT"
- **== (Equal)** - Right-click → "Equal"

### Widget Operations:
- **Create Widget** - Right-click → "Create Widget"
- **Add to Viewport** - Drag off widget → "Add to Viewport"
- **Remove from Parent** - Drag off widget → "Remove from Parent"

### Player/Game Operations:
- **Get Player Controller** - Right-click → "Get Player Controller"
- **Set Input Mode UI Only** - Right-click → "Set Input Mode UI Only"
- **Set Show Mouse Cursor** - Drag off Player Controller → "Set Show Mouse Cursor"
- **Quit Game** - Right-click → "Quit Game"
- **Open Level (by Name)** - Right-click → "Open Level"

### Time Operations:
- **Delay** - Right-click → "Delay"
- **Event Tick** - Right-click → "Event Tick"

### Math Operations:
- **VectorLength** - Drag off Vector → "Vector Length"
- **/ (Divide)** - Right-click → "Divide" or just type "/"
- **Round** - Right-click → "Round"

### String Operations:
- **Format Text** - Right-click → "Format Text"

---

## Variable Binding Checklist

### WBP_PaperworkForm - Make sure these are bound:

**Text Fields (10 total):**
1. NameField → Editable Text Box in Designer
2. MotherMaidenField → Editable Text Box in Designer
3. GrandmotherMaidenField → Editable Text Box in Designer
4. SSNField → Editable Text Box in Designer
5. BloodTypeField → Editable Text Box in Designer
6. ExistingField → Editable Text Box in Designer
7. VehicleHistoryField → Editable Text Box in Designer
8. EssayField → Editable Text Box in Designer
9. ReferencesField → Editable Text Box in Designer
10. EmergencyContactField → Editable Text Box in Designer

**Checkboxes (8 total):**
11. RelationshipOwner → Check Box in Designer
12. RelationshipBorrower → Check Box in Designer
13. RelationshipThief → Check Box in Designer
14. RelationshipSpiritual → Check Box in Designer
15. Checkbox47B → Check Box in Designer
16. CheckboxGuilty → Check Box in Designer
17. CheckboxWaiver → Check Box in Designer
18. CheckboxSoul → Check Box in Designer

**Buttons (2 total):**
19. SubmitButton → Button in Designer
20. CancelButton → Button in Designer

**Display:**
21. ErrorText → Text Block in Designer

### How to Bind Variables:
1. Create widget component in Designer (e.g., Editable Text Box)
2. Select it in hierarchy
3. In Details panel, check "Is Variable"
4. Name it (e.g., "NameField")
5. Compile
6. Now you can use it in Graph!

---

## Testing Node Connections

### Test 1: Main Menu
1. PIE (Play In Editor) from MainMenu level
2. Check console for errors
3. Click NEW GAME → Should transition to OpenWorld
4. Click QUIT → Should close game

### Test 2: Paperwork Form
1. Create test level or add paperwork trigger to OpenWorld
2. Open form
3. Click SUBMIT with empty fields
4. Should see: Error → Wait 2 sec → Fields clear
5. Fill all fields EXCEPT essay word count (type 50 words)
6. Click SUBMIT
7. Should see: Error → Wait 2 sec → ALL FIELDS CLEAR (evil!)
8. Fill all fields correctly (exactly 500 words in essay!)
9. Click SUBMIT
10. Should see: Sentence screen → Wait 5 sec → Return to game

### Test 3: HUD
1. PIE from OpenWorld
2. HUD should appear bottom-left
3. Drive vehicle
4. Speed should update in real-time

---

## Debugging Tips

### If form validation isn't working:
1. Add "Print String" nodes after each validation check
2. Print the boolean result to see which check is failing
3. Common issues:
   - Forgot to bind a variable
   - Wrong comparison operator
   - Essay word count parsing delimiter is wrong (should be space " ")

### If form doesn't clear:
1. Check that ClearAllFields function is called
2. Verify all variables are bound correctly
3. Add Print String "Clearing fields!" to confirm function runs

### If widgets don't appear:
1. Check Z-Order (should be 0 or higher)
2. Verify Add to Viewport is called
3. Check anchors and position in Designer

### If level transitions don't work:
1. Verify level name is EXACT (case-sensitive)
2. Check that level is in Content/Maps
3. Ensure level is added to build settings

---

## Final Checklist Before Testing

- [ ] All 4 widgets created in Content/Blueprints/UI
- [ ] BP_MainMenuManager created in Content/Blueprints/Core
- [ ] MainMenu.umap created in Content/Maps
- [ ] All variables bound in WBP_PaperworkForm
- [ ] ValidateForm function created and complete
- [ ] ClearAllFields function created and complete
- [ ] All button OnClicked events connected
- [ ] Project Settings → Default Maps set to MainMenu
- [ ] Vehicle BeginPlay creates HUD widget
- [ ] No compile errors (check Compiler Results)

---

## SUCCESS CRITERIA

When everything works, this is what should happen:

1. **Game Start** → Main Menu appears
2. **Click NEW GAME** → OpenWorld loads, HUD shows speed
3. **Trigger Paperwork** → Form appears with all fields
4. **Submit incomplete** → Error shows, wait 2 seconds, ALL FIELDS CLEAR
5. **Submit complete** → Sentence appears, wait 5 seconds, return to game
6. **Click Cancel** → Return to game immediately
7. **Drive vehicle** → Speed updates in HUD

If all these work: **YOU'RE DONE!** 🎉

---

The humor of this system comes from the EVIL clearing mechanism. Players will:
1. Spend 10+ minutes filling the ridiculous form
2. Make ONE tiny mistake
3. Watch in horror as EVERYTHING disappears
4. Laugh (or cry) at the absurdity
5. Fill it out again (because they're committed now)
6. Finally succeed and see they're sentenced to more paperwork anyway

That's comedy gold in game form! 🚗💨📋
