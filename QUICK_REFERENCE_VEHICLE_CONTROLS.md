# VROOM VROOM - VEHICLE CONTROLS QUICK REFERENCE

## XBOX CONTROLLER LAYOUT

### Driving Controls
| Input | Function | Notes |
|-------|----------|-------|
| Left Stick UP | Accelerate Forward | Analog - smooth speed control |
| Left Stick DOWN | Reverse | Analog - smooth speed control |
| Left Stick LEFT | Steer Left | Analog - smooth steering |
| Left Stick RIGHT | Steer Right | Analog - smooth steering |
| Right Trigger (RT) | Brake | Progressive - more pressure = harder brake |
| Right Stick CLICK | Switch Camera | Toggle exterior/interior view |

### Action Controls
| Input | Function | Notes |
|-------|----------|-------|
| A Button | Exit Vehicle | Only works when stopped or slow |
| X Button | Horn | Honk the horn |
| DPad UP | Toggle Lights | Headlights on/off |
| DPad RIGHT | Toggle Siren | Police vehicles only |

---

## KEYBOARD LAYOUT

### Driving Controls
| Input | Function | Notes |
|-------|----------|-------|
| W | Accelerate Forward | Digital input |
| S | Reverse | Digital input |
| A | Steer Left | Digital input |
| D | Steer Right | Digital input |
| SPACE | Brake | Full brake |
| C | Switch Camera | Toggle exterior/interior view |

### Action Controls
| Input | Function | Notes |
|-------|----------|-------|
| F | Exit Vehicle | Only works when stopped or slow |
| H | Horn | Honk the horn |
| L | Toggle Lights | Headlights on/off |
| T | Toggle Siren | Police vehicles only |

---

## VEHICLE ENTRY

### Approach Vehicle
1. Walk up to any vehicle
2. Get within 3 meters of vehicle body
3. Look for "Press F to enter" message

### Enter Vehicle
- **Keyboard:** Press F
- **Controller:** Press A Button

### What Happens
- Player character hidden
- Camera switches to vehicle follow camera
- Player possesses vehicle pawn
- Engine starts automatically
- Controls switch to vehicle controls

---

## VEHICLE EXIT

### Requirements
- Vehicle speed must be < 10 km/h (almost stopped)
- Must be on safe ground (not mid-air)

### Exit Vehicle
- **Keyboard:** Press F
- **Controller:** Press A Button

### What Happens
- Vehicle stops engine
- Player character reappears beside vehicle
- Camera switches back to character
- Player possesses character pawn
- Controls switch back to character controls

---

## HUD INFORMATION

### On-Screen Display (Above Vehicle)
```
Speed: XXX.X km/h
Fuel: XX.X%
```

### Speed Indicators
- 0-60 km/h: City speed
- 60-120 km/h: Highway speed
- 120+ km/h: HIGH SPEED (will attract police)
- 180+ km/h: EXTREME SPEED (police pursuit guaranteed)

### Fuel Warnings
- 100-50%: Green (good)
- 50-25%: Yellow (caution)
- 25-0%: Red (critical)
- 0%: Engine stops (out of fuel)

---

## CAMERA MODES

### Exterior Camera (Default)
- Third-person view behind vehicle
- Distance: 6 meters behind vehicle
- Angle: Slightly above and looking down
- Best for: General driving, navigation

### Interior Camera
- First-person view from driver seat
- Forward-facing dashboard view
- Best for: Immersive experience, tight spaces

### Switch Cameras
- **Keyboard:** Press C
- **Controller:** Click Right Stick

---

## POLICE VEHICLE SPECIFIC

### Additional Controls
| Input | Function |
|-------|----------|
| T (Keyboard) | Toggle Siren |
| DPad RIGHT (Controller) | Toggle Siren |

### Siren Effects
- Activates red/blue flashing lights
- Plays siren sound
- Lights flash alternating red/blue every 0.2 seconds
- Audio plays continuously until toggled off

### Restrictions
- Civilians cannot enter police vehicles
- Only works for player if they are police officer
- AI police automatically use siren during pursuits

---

## VEHICLE TYPES & STATS

### Sedan (BP_VehicleBase)
- Max Speed: 180 km/h
- Acceleration: Medium
- Handling: Balanced
- Use: General purpose driving

### Police Sedan (BP_PoliceVehicle)
- Max Speed: 240 km/h
- Acceleration: High
- Handling: Enhanced
- Special: Emergency lights, siren
- Use: Police pursuits

---

## DRIVING TIPS

### Steering
- Steering is speed-dependent
- At low speed: Sharp turns possible
- At high speed: Wider turns (realistic)
- Maintain smooth inputs for best control

### Braking
- Use Right Trigger for progressive braking
- Space bar / RT fully pressed = maximum brake
- Brake distance increases with speed
- Cannot exit vehicle while moving fast

### Fuel Management
- Fuel consumption increases with speed
- Higher throttle = more fuel consumption
- Engine idle = minimal fuel consumption
- Find gas stations to refuel (future feature)

### Avoiding Police
- Stay under 120 km/h
- Don't steal vehicles (increases wanted level)
- Don't honk excessively
- Turn on lights at night
- Avoid reckless driving

### Pursuit Driving (Police)
- Use siren to warn traffic
- Request backup during long chases
- PIT maneuver available after 10 seconds
- Arrest when within 2 meters of suspect

---

## TROUBLESHOOTING

### Controller Not Working
1. Check controller is connected (USB or Bluetooth)
2. Test controller in Windows Game Controller settings
3. Verify controller works in other games
4. Restart Unreal Editor if needed

### Vehicle Won't Move
1. Check you're in the vehicle (press F to enter)
2. Verify you're using correct controls
3. Check fuel level (must be > 0%)
4. Look for error messages in logs

### Camera Issues
1. Press C / Right Stick Click to switch views
2. Exit and re-enter vehicle to reset camera
3. Check camera isn't clipping through walls

### Can't Exit Vehicle
1. Slow down to near stop (< 10 km/h)
2. Make sure you're on safe ground
3. Don't exit while in mid-air
4. Press correct key: F (keyboard) or A (controller)

---

## ADVANCED TECHNIQUES

### Drift Turn
1. Approach turn at high speed
2. Release throttle slightly
3. Turn sharply
4. Vehicle will slide through turn
5. Counter-steer to maintain control

### Quick Stop
1. Release throttle completely
2. Press brake (Space / RT)
3. Vehicle will decelerate quickly
4. Full stop in ~2-3 seconds from 100 km/h

### Reverse Maneuvers
1. Pull Left Stick DOWN or press S
2. Vehicle reverses
3. Steering inverted while reversing
4. Use for parking or tight spaces

### Chase Evasion
1. Maintain high speed (but not too high)
2. Take sharp corners
3. Use alleys and tight spaces
4. Break line of sight
5. Hide until wanted level decreases

---

## INPUT MAPPING CONTEXT PRIORITY

When driving vehicle:
1. IMC_Vehicle (Priority 1) - ACTIVE
2. IMC_Default (Priority 0) - Disabled
3. Character controls suspended during driving

When on foot:
1. IMC_Default (Priority 0) - ACTIVE
2. IMC_Vehicle - Not loaded
3. Vehicle controls not available

---

## CONFIGURATION REFERENCE

### Default Input Settings
- Left Stick Dead Zone: 0.25 (reduces drift)
- Right Stick Dead Zone: 0.25 (reduces drift)
- Trigger Dead Zone: 0.0 (full range)
- Sensitivity: 1.0 (standard)

### Physics Settings
- Vehicle Mass: 1500 kg
- Linear Damping: 0.01 (minimal drag)
- Angular Damping: 0.5 (moderate rotation damping)
- Gravity: Enabled
- Collision: PhysicsActor

### Camera Settings
- Spring Arm Length: 600 units (6 meters)
- Spring Arm Angle: -15 degrees (looking down)
- Camera Lag: Enabled
- Lag Speed: 3.0 (moderate lag)

---

## FILES REFERENCE

### Setup Guide
`VEHICLE_SETUP_GUIDE.md` - Complete blueprint creation instructions

### Implementation Report
`VEHICLE_IMPLEMENTATION_REPORT.md` - Technical documentation

### Configuration
`Config/DefaultInput.ini` - Input system configuration

### C++ Source
- `Source/VroomVroom/Public/Vehicles/VehicleBase.h`
- `Source/VroomVroom/Private/Vehicles/VehicleBase.cpp`
- `Source/VroomVroom/Public/Vehicles/PoliceVehicle.h`
- `Source/VroomVroom/Private/Vehicles/PoliceVehicle.cpp`

---

**Quick Ref Version:** 1.0
**Last Updated:** 2025-10-12
**For:** Unreal Engine 5.6.1
**Project:** Vroom Vroom

END OF QUICK REFERENCE
