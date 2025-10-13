# POLICE AI SYSTEM - TESTING & TROUBLESHOOTING GUIDE
## Complete Testing Procedures and Common Issues

---

## TESTING WORKFLOW

### Phase 1: Component Testing (Individual Systems)
### Phase 2: Integration Testing (Systems Working Together)
### Phase 3: Full Gameplay Testing (End-to-End Experience)

---

## PHASE 1: COMPONENT TESTING

### Test 1.1 - BP_PoliceVehicle Detection System

**Objective:** Verify police vehicle detects player within 3000 units

**Setup:**
1. Open main game level
2. Place BP_PoliceVehicle in level
3. Place BP_PlayerVehicle 2000 units away
4. Enable "Show Collision" (Console command: `show collision`)

**Test Procedure:**
1. PIE (Play In Editor)
2. Possess player vehicle
3. Wait 1 second

**Expected Results:**
- [ ] Police prints: "STOP RIGHT THERE, CRIMINAL SCUM!" in output log
- [ ] Police Current State changes to "Chase"
- [ ] bPlayerDetected = TRUE in police blueprint
- [ ] Detection sphere visible (red sphere, 3000 unit radius)

**Debug Commands:**
- `show collision` - Show collision volumes
- `stat fps` - Show frame rate
- `show bounds` - Show actor bounds

**If Test Fails:**
- Check DetectionSphere component exists
- Verify DetectionSphere radius = 3000
- Check DetectPlayer function is called every 0.5s
- Verify Player class cast is correct
- Check distance calculation math

---

### Test 1.2 - BP_PoliceVehicle Chase Logic

**Objective:** Verify police chases player continuously

**Setup:**
1. Same as Test 1.1
2. Player vehicle positioned 2000 units from police

**Test Procedure:**
1. PIE
2. Drive player vehicle away from police
3. Observe police behavior for 30 seconds
4. Drive in circles
5. Drive straight at high speed

**Expected Results:**
- [ ] Police follows player continuously
- [ ] Police rotation updates to face player
- [ ] Police maintains pursuit even at distance
- [ ] Police uses Add Movement Input (full throttle)
- [ ] Aggressive messages print every 2 seconds
- [ ] Police doesn't get stuck on geometry

**Performance Metrics:**
- Frame rate: 60+ FPS (check with `stat fps`)
- Police update rate: Every tick
- Detection check: Every 0.5 seconds

**If Test Fails:**
- Check StartChase function is called
- Verify Event Tick chase logic is active
- Check Current State == Chase
- Verify Player Reference is valid
- Check RInterp To rotation smoothing
- Verify Add Movement Input scale = 1.0

---

### Test 1.3 - BP_PoliceVehicle Arrest Trigger

**Objective:** Verify arrest occurs when police touches player

**Setup:**
1. Place police directly behind player (100 units)
2. Police should be in chase mode

**Test Procedure:**
1. PIE
2. Police will collide with player within 5 seconds
3. Observe arrest sequence

**Expected Results:**
- [ ] Overlap event fires on contact
- [ ] "YOU'RE UNDER ARREST FOR: EXISTING" appears on screen
- [ ] WBP_ArrestMessage widget appears
- [ ] Current State changes to Arrest
- [ ] Police stops moving
- [ ] 2-second timer starts
- [ ] Level transitions to Courtroom after timer

**Timing Verification:**
- Arrest message appears: Immediately on contact
- Level transition delay: Exactly 2.0 seconds
- Widget remains visible: Full 2 seconds

**If Test Fails:**
- Check ArrestTrigger component exists and positioned correctly
- Verify Generate Overlap Events = TRUE
- Check Cast to Player Vehicle succeeds
- Verify WBP_ArrestMessage exists and compiles
- Check "Open Level" node has correct level name: "Courtroom"
- Verify Set Timer by Event duration = 2.0

---

### Test 1.4 - WBP_ArrestMessage Widget

**Objective:** Verify arrest message displays correctly

**Setup:**
1. Open WBP_ArrestMessage in editor
2. Use Designer tab preview

**Test Procedure:**
1. Click "Graph" tab
2. Find Event Construct
3. Compile widget
4. Return to Designer tab
5. Preview animation if available

**Expected Results:**
- [ ] All text is visible and readable
- [ ] Title: "YOU'RE UNDER ARREST!" in red, size 72
- [ ] Crime: "CRIME: EXISTING" in white, size 48
- [ ] Instruction: "REPORT TO COURT IMMEDIATELY" in yellow, size 32
- [ ] Background is semi-transparent black
- [ ] Text has drop shadows for readability
- [ ] Widget is centered on screen
- [ ] "Appear" animation plays smoothly (if added)

**Visual Checks:**
- Text alignment: Center
- Spacing: Adequate between elements
- Contrast: High contrast for readability
- No clipping or overflow

**If Test Fails:**
- Check Canvas Panel anchors are set to Fill
- Verify text block properties (font size, color)
- Check Border background color has alpha < 1.0
- Verify Overlay is set to Fill
- Check text wrapping settings
- Verify all Spacer sizes are correct

---

### Test 1.5 - Courtroom Level Load

**Objective:** Verify Courtroom level exists and loads

**Setup:**
1. Ensure Courtroom.umap is saved in Content/Maps

**Test Procedure:**
1. Open Content Browser
2. Navigate to Content/Maps
3. Double-click Courtroom.umap
4. Level should open in editor

**Expected Results:**
- [ ] Level opens without errors
- [ ] Floor, walls, and furniture visible
- [ ] Lighting is built (not red "LIGHTING NEEDS TO BE REBUILT")
- [ ] PlayerStart is present and visible
- [ ] BP_CourtroomManager is in level
- [ ] No missing asset warnings

**Editor Checks:**
- Viewport: All geometry visible
- Outliner: All actors listed
- Output Log: No errors
- World Settings: Game mode set

**If Test Fails:**
- Verify level file exists at correct path
- Check all static meshes are valid
- Build lighting (Build > Build Lighting Only)
- Check for missing material references
- Verify no corrupted assets
- Check World Settings are configured

---

### Test 1.6 - BP_CourtroomManager Functionality

**Objective:** Verify manager spawns UI correctly

**Setup:**
1. Open Courtroom.umap
2. Select BP_CourtroomManager in level
3. Set PaperworkWidgetClass to WBP_PaperworkUI in Details

**Test Procedure:**
1. PIE from Courtroom level
2. Observe UI spawning

**Expected Results:**
- [ ] Green debug message: "Courtroom Manager: Initializing..."
- [ ] Mouse cursor appears
- [ ] 0.5 second delay occurs
- [ ] WBP_PaperworkUI spawns
- [ ] Green debug message: "Paperwork UI spawned successfully"
- [ ] UI is interactive (button hover works)
- [ ] Gavel sound plays (if enabled and assigned)

**Timing Verification:**
- Manager initialization: Immediate on level load
- UI spawn delay: 0.5 seconds after initialization
- Input mode change: Immediate

**If Test Fails:**
- Check BP_CourtroomManager exists in level
- Verify PaperworkWidgetClass is assigned
- Check WBP_PaperworkUI exists and compiles
- Verify Get Player Controller returns valid controller
- Check Set Input Mode UI Only is called
- Verify Add to Viewport Z-Order is correct

---

### Test 1.7 - WBP_PaperworkUI Widget

**Objective:** Verify paperwork UI displays and functions

**Setup:**
1. Open WBP_PaperworkUI in editor
2. Use Designer preview

**Test Procedure:**
1. Preview in Designer tab
2. Check all elements visible
3. Test button in Graph (simulate click)

**Expected Results:**
- [ ] Header: "OFFICIAL COURT DOCUMENTS" visible
- [ ] Border: White background with black border
- [ ] All 6 charges listed and visible
- [ ] Charges are absurdly funny
- [ ] Verdict: "EXTREMELY GUILTY" in red
- [ ] Button: "SIGN HERE (You Have No Choice)" visible
- [ ] Button responds to hover (color change)
- [ ] Button click triggers event

**Visual Verification:**
- All text readable
- Proper spacing between elements
- Button is clickable size (400x60 minimum)
- No text overflow or clipping

**If Test Fails:**
- Check widget hierarchy is correct
- Verify all text blocks have content
- Check button Is Variable = TRUE
- Verify OnClicked event is bound
- Check button style settings (Normal, Hovered, Pressed)
- Verify text block font sizes

---

## PHASE 2: INTEGRATION TESTING

### Test 2.1 - Police Detection to Chase Flow

**Objective:** Verify smooth transition from detection to chase

**Setup:**
1. Main game level
2. Police 4000 units from player (out of range)
3. Clear path between police and player

**Test Procedure:**
1. PIE
2. Drive toward police
3. Cross 3000-unit threshold
4. Continue driving past police

**Expected Results:**
- [ ] No chase before 3000 units
- [ ] Detection occurs at 3000 units
- [ ] Print string appears: "STOP RIGHT THERE, CRIMINAL SCUM!"
- [ ] Police immediately begins chasing
- [ ] Chase continues smoothly
- [ ] No stuttering or lag

**Timing Checks:**
- Detection delay: Maximum 0.5 seconds (detection timer interval)
- Chase startup: Immediate after detection
- Rotation smoothing: 2.0 interp speed

**If Test Fails:**
- Check detection range calculation
- Verify StartChase is called after detection
- Check Event Tick chase logic activates
- Verify no conflicting AI commands
- Check performance (frame rate drops cause lag)

---

### Test 2.2 - Chase to Arrest Flow

**Objective:** Verify smooth transition from chase to arrest

**Setup:**
1. Police already chasing player
2. Player drives slowly to allow police to catch up

**Test Procedure:**
1. PIE with chase active
2. Slow down or stop
3. Let police collide with player vehicle
4. Watch arrest sequence

**Expected Results:**
- [ ] ArrestTrigger overlap fires on contact
- [ ] Current State changes from Chase to Arrest
- [ ] Police stops moving immediately
- [ ] WBP_ArrestMessage appears immediately
- [ ] Red text appears on screen
- [ ] 2-second countdown begins
- [ ] Level transition occurs after exactly 2 seconds
- [ ] No errors in output log

**Critical Timing:**
- Arrest detection: Immediate on overlap
- Widget spawn: < 0.1 seconds
- Level transition: Exactly 2.0 seconds after arrest

**If Test Fails:**
- Check ArrestTrigger collision settings
- Verify overlap event is bound
- Check Stop Movement is called
- Verify timer duration is correct
- Check Open Level node level name matches
- Verify no blocking code after timer set

---

### Test 2.3 - Arrest to Courtroom Transition

**Objective:** Verify seamless level transition

**Setup:**
1. Trigger arrest as in Test 2.2

**Test Procedure:**
1. Get arrested
2. Wait for transition
3. Observe loading process
4. Verify courtroom spawn

**Expected Results:**
- [ ] Arrest message visible for full 2 seconds
- [ ] Screen fades or cuts to courtroom
- [ ] Courtroom loads without errors
- [ ] Player spawns at PlayerStart location
- [ ] Facing judge's desk (Yaw = 0)
- [ ] BP_CourtroomManager activates automatically
- [ ] No loading screen errors
- [ ] Frame rate stable during transition

**Loading Verification:**
- Transition time: < 3 seconds (depends on hardware)
- No black screen longer than 2 seconds
- No "Traveling" errors in log

**If Test Fails:**
- Verify Courtroom level name spelling: "Courtroom"
- Check Courtroom level exists in Content/Maps
- Verify level is added to Project Settings packaging
- Check PlayerStart exists in Courtroom level
- Verify no corrupted assets in Courtroom
- Check World Settings in Courtroom
- Build lighting in Courtroom if not built

---

### Test 2.4 - Courtroom UI Spawn

**Objective:** Verify UI spawns correctly after level load

**Setup:**
1. Transition to Courtroom via arrest

**Test Procedure:**
1. Get arrested in main level
2. Wait for Courtroom load
3. Observe UI spawn sequence

**Expected Results:**
- [ ] Courtroom loads successfully
- [ ] 0.5 second delay occurs
- [ ] Mouse cursor appears
- [ ] WBP_PaperworkUI spawns
- [ ] UI is centered and readable
- [ ] Button is interactive
- [ ] Gavel sound plays (if enabled)
- [ ] Input mode is UI Only

**UI Verification:**
- Widget centered: Yes
- All text visible: Yes
- Button hoverable: Yes
- Mouse cursor visible: Yes

**If Test Fails:**
- Check BP_CourtroomManager in Courtroom level
- Verify PaperworkWidgetClass assigned in Details
- Check BeginPlay fires (add print strings)
- Verify delay node duration
- Check Create Widget class reference
- Verify Add to Viewport is called
- Check input mode change

---

### Test 2.5 - Paperwork UI to Exit Flow

**Objective:** Verify button works and exits courtroom

**Setup:**
1. Reach paperwork UI via Test 2.4

**Test Procedure:**
1. Move mouse over button
2. Click button
3. Observe result

**Expected Results:**
- [ ] Button hover state activates (color change)
- [ ] Button click is detected
- [ ] OnClicked event fires
- [ ] UI removes itself from screen
- [ ] Level loads (Main Menu or restart)
- [ ] No errors in output log

**Button Interaction:**
- Hover response time: Immediate
- Click response time: < 0.1 seconds
- Level transition: < 3 seconds

**If Test Fails:**
- Check button Is Variable = TRUE
- Verify OnClicked event is bound in Graph
- Check Remove from Parent is called
- Verify Open Level node has valid level name
- Check level name spelling
- Verify target level exists

---

## PHASE 3: FULL GAMEPLAY TESTING

### Test 3.1 - Complete Arrest Cycle

**Objective:** Test entire system from start to finish

**Setup:**
1. Main game level with player vehicle and police

**Test Procedure:**
1. Start PIE
2. Drive near police (trigger detection)
3. Get chased
4. Get arrested
5. View paperwork
6. Click button
7. Return to menu/restart

**Expected Results:**
- [ ] All steps complete without errors
- [ ] No crashes or freezes
- [ ] Smooth transitions between states
- [ ] UI elements all appear correctly
- [ ] Timing feels natural
- [ ] Humor lands (absurd charges are funny)
- [ ] Player understands what's happening

**User Experience Checks:**
- Is it clear you're being chased? YES/NO
- Is arrest obvious when it happens? YES/NO
- Are charges funny/absurd? YES/NO
- Is button clickable and clear? YES/NO
- Can you exit courtroom? YES/NO

**If Test Fails:**
- Review each individual component test
- Check output log for errors
- Verify all blueprints compile
- Check all assets exist and are valid
- Verify level transitions work
- Test on different hardware if possible

---

### Test 3.2 - Multiple Police Vehicles

**Objective:** Test system with multiple police

**Setup:**
1. Place 3-5 BP_PoliceVehicle instances in level
2. Spread them across map

**Test Procedure:**
1. PIE
2. Drive near multiple police
3. Get chased by multiple units
4. Let one arrest you

**Expected Results:**
- [ ] All police detect player independently
- [ ] All police chase simultaneously
- [ ] First police to touch player triggers arrest
- [ ] Only one arrest message appears
- [ ] Level transition occurs once
- [ ] No duplicate UI spawning
- [ ] Frame rate remains stable (60+ FPS)

**Performance Metrics:**
- 3 police: 60+ FPS
- 5 police: 50+ FPS (acceptable)
- 10+ police: May drop below 50 FPS (optimize if needed)

**If Test Fails:**
- Check for duplicate overlap events
- Verify only one level transition occurs
- Check performance with `stat fps`
- Optimize detection (increase timer interval)
- Check for memory leaks

---

### Test 3.3 - Edge Case: Player Escapes

**Objective:** Test behavior when player escapes chase

**Setup:**
1. Police chasing player
2. Player has fast vehicle

**Test Procedure:**
1. Get chased
2. Drive far away (5000+ units)
3. Break line of sight
4. Observe police behavior

**Expected Results:**
- [ ] Police continues chasing (no escape in current design)
- [ ] Police doesn't give up or reset
- [ ] Detection remains active
- [ ] No errors when far from police

**Behavior Notes:**
- Current design: Police never stop chasing (intentional for humor)
- Alternative: Add "give up" distance (10000+ units)

**If Test Fails:**
- This is expected behavior (no escape)
- If police stops: Check Event Tick conditions
- If police resets: Check Current State variable

---

### Test 3.4 - Edge Case: Courtroom Re-entry

**Objective:** Test returning to courtroom multiple times

**Setup:**
1. Get arrested once
2. From courtroom, restart level
3. Get arrested again

**Test Procedure:**
1. Complete first arrest cycle
2. Restart from paperwork UI
3. Get arrested second time
4. Verify courtroom works again

**Expected Results:**
- [ ] Courtroom loads correctly both times
- [ ] UI spawns correctly both times
- [ ] No duplicate UI instances
- [ ] No memory leaks
- [ ] Performance doesn't degrade

**Multiple Cycles:**
- 1st arrest: Works perfectly
- 2nd arrest: Works perfectly
- 5th arrest: Still works perfectly

**If Test Fails:**
- Check for widget cleanup (Remove from Parent)
- Verify BP_CourtroomManager resets properly
- Check for persistent references
- Monitor memory usage (`stat memory`)

---

## COMMON ISSUES AND SOLUTIONS

### Issue 1: Police Not Detecting Player

**Symptoms:**
- Police sits idle
- No chase begins
- No debug messages

**Causes:**
1. DetectionSphere not added
2. Detection timer not set
3. Player class cast failing
4. Detection range too small

**Solution:**
```
1. Add DetectionSphere component (Radius: 3000)
2. Verify Set Timer by Function Name in BeginPlay
3. Check Cast to BP_PlayerVehicle class name
4. Increase DetectionRange to 5000 for testing
5. Add Print String after detection for debugging
```

**Verification:**
- Run PIE, check output log for detection messages
- Use `show collision` to see detection sphere

---

### Issue 2: Police Chases But Doesn't Arrest

**Symptoms:**
- Chase works fine
- Police touches player
- No arrest triggers

**Causes:**
1. ArrestTrigger not added
2. Overlap events not enabled
3. Cast to Player failing
4. Timer not starting

**Solution:**
```
1. Add ArrestTrigger Box Collision component
2. Enable Generate Overlap Events
3. Verify Cast to BP_PlayerVehicle in overlap event
4. Check Set Timer by Event is called
5. Verify level name: "Courtroom" (exact spelling)
```

**Verification:**
- Add Print String in overlap event
- Check output log when police touches player

---

### Issue 3: Arrest Message Not Appearing

**Symptoms:**
- Arrest triggers
- No UI appears
- Level transition works

**Causes:**
1. WBP_ArrestMessage doesn't exist
2. Create Widget fails
3. Add to Viewport not called
4. Widget class reference wrong

**Solution:**
```
1. Create WBP_ArrestMessage widget
2. Compile widget successfully
3. Verify Create Widget class = WBP_ArrestMessage
4. Check Add to Viewport node is connected
5. Verify Z-Order is high (10+)
```

**Verification:**
- Test widget in standalone mode
- Check output log for widget creation errors

---

### Issue 4: Courtroom Level Won't Load

**Symptoms:**
- Arrest completes
- Black screen
- No courtroom appears
- Error: "Unable to load map"

**Causes:**
1. Level name misspelled
2. Level doesn't exist
3. Level not in project settings
4. Level corrupted

**Solution:**
```
1. Verify level name exactly: "Courtroom" (case-sensitive)
2. Check level exists: Content/Maps/Courtroom.umap
3. Add to Project Settings > Packaging > Maps to Include
4. Open level in editor, resave
5. Build lighting in level
```

**Verification:**
- Manually open level in editor (should work)
- Check File > Open Level > Browse for Courtroom

---

### Issue 5: Paperwork UI Not Spawning

**Symptoms:**
- Courtroom loads
- No UI appears
- No mouse cursor

**Causes:**
1. BP_CourtroomManager not in level
2. PaperworkWidgetClass not assigned
3. WBP_PaperworkUI doesn't exist
4. BeginPlay not firing

**Solution:**
```
1. Drag BP_CourtroomManager into Courtroom level
2. Select manager, assign PaperworkWidgetClass in Details
3. Create WBP_PaperworkUI widget if missing
4. Add Print String in BeginPlay to verify it fires
5. Check Get Player Controller returns valid
```

**Verification:**
- PIE from Courtroom level directly
- Check output log for manager initialization messages

---

### Issue 6: Button Not Clickable

**Symptoms:**
- UI appears correctly
- Button visible
- Can't click button

**Causes:**
1. Input mode not set to UI
2. Mouse cursor not shown
3. Button not set as variable
4. OnClicked not bound

**Solution:**
```
1. Verify Set Input Mode UI Only in manager
2. Check Set Show Mouse Cursor = TRUE
3. Set button Is Variable = TRUE
4. Bind OnClicked event in widget Graph
5. Check button Visibility = Visible
```

**Verification:**
- Test widget in standalone mode
- Add Print String in OnClicked event

---

### Issue 7: Performance Issues (Low FPS)

**Symptoms:**
- Frame rate below 30 FPS
- Stuttering during chase
- Lag when police spawns

**Causes:**
1. Too many police vehicles
2. Detection running too frequently
3. Complex geometry/materials
4. Lighting not built

**Solution:**
```
1. Reduce police count to 3-5 maximum
2. Increase detection timer to 1.0 second
3. Use simple materials and geometry
4. Build lighting (Build > Build Lighting Only)
5. Optimize police vehicle mesh (reduce polys)
6. Disable shadows on some lights
```

**Verification:**
- Use `stat fps` to monitor frame rate
- Use `stat unit` to find bottlenecks
- Target: 60+ FPS minimum

---

## DEBUGGING TOOLS

### Console Commands

**Essential Commands:**
```
show collision - Show collision volumes
stat fps - Show frame rate
stat unit - Show performance breakdown
show bounds - Show actor bounding boxes
show skeletalmeshes - Show skeletal mesh bones
```

**Debugging Commands:**
```
showdebug ai - Show AI debug info
showdebug physics - Show physics debug
pause - Pause game
slomo 0.5 - Slow motion (0.5 = half speed)
slomo 2 - Fast motion (2 = double speed)
```

**Logging Commands:**
```
log LogBlueprintUserMessages - Show blueprint print strings
log LogLoad - Show level loading info
log LogActor - Show actor spawning/destruction
```

---

### Blueprint Debugging

**Print String Best Practices:**
```
- Use different colors for different systems:
  - Green: Success messages
  - Red: Error messages
  - Yellow: Warning messages
  - White: Info messages

- Include relevant info:
  - Actor names
  - Variable values
  - State changes
  - Function calls

- Example:
  Print String: "Police: Detected Player at distance: 2543.5"
```

**Breakpoints:**
1. Right-click node in Blueprint
2. Select "Add breakpoint"
3. PIE - game pauses at breakpoint
4. Inspect variable values
5. Step through execution

---

## PERFORMANCE BENCHMARKS

### Target Performance:

**Frame Rate:**
- PC: 60+ FPS minimum
- Console: 30+ FPS minimum
- VR: 90+ FPS minimum

**Memory:**
- Total: < 500 MB for police system
- Widget: < 5 MB per instance
- Police Vehicle: < 10 MB per instance

**Loading Times:**
- Level transition: < 3 seconds
- Widget creation: < 0.1 seconds
- Police activation: Immediate

---

## AUTOMATED TESTING (OPTIONAL)

### Blueprint Automated Tests:

Create test maps for automated testing:

**TestMap_Detection:**
- Police and player at exact distance
- Verify detection fires

**TestMap_Chase:**
- Police pre-chasing player
- Verify chase continues for 60 seconds

**TestMap_Arrest:**
- Police overlapping player at start
- Verify arrest triggers immediately

---

## FINAL VERIFICATION CHECKLIST

Before considering system complete:

**Functionality:**
- [ ] Police detects player at 3000 units
- [ ] Police chases player continuously
- [ ] Police arrests player on contact
- [ ] Arrest message appears
- [ ] Level transitions to Courtroom
- [ ] Paperwork UI spawns in Courtroom
- [ ] Button works and exits Courtroom

**Quality:**
- [ ] No crashes or errors
- [ ] Frame rate above 60 FPS
- [ ] Smooth transitions
- [ ] UI is readable
- [ ] Humor is apparent

**Polish:**
- [ ] Messages are funny
- [ ] Charges are absurd
- [ ] Timing feels natural
- [ ] Sound effects play (if added)
- [ ] Visual feedback is clear

**User Experience:**
- [ ] Player understands they're being chased
- [ ] Arrest is obvious when it happens
- [ ] Courtroom purpose is clear
- [ ] Can exit and continue playing

---

## TESTING COMPLETE

All systems tested and verified. Police AI is EXCESSIVELY aggressive as requested.

YOU ARE GUILTY OF EXISTING.
TESTING HAS CONFIRMED YOUR CRIMES.
JUSTICE HAS BEEN THOROUGHLY DEBUGGED.
