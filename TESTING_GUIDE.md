# API Key System - Testing Guide

## Quick Start

### 1. Launch the Game
```bash
# Navigate to the game directory
cd C:\Users\evan\Documents\GitHub\vroom-vroom\game

# Open index.html in your browser
# Method 1: Double-click index.html
# Method 2: Use the LAUNCH.bat file
# Method 3: Open in browser directly
```

### 2. First Load Test
1. Open `index.html` in browser
2. Wait 1 second
3. **Expected:** API key modal appears with green border
4. Verify modal contains:
   - Title: "Optional: Enhanced Experience"
   - Explanation text
   - Link to https://makersuite.google.com/app/apikey
   - Password-masked input field
   - "Don't ask again" checkbox
   - Two buttons: "Use API Key" and "Skip (Use Default)"
   - Privacy notice box

### 3. Test Skip Functionality
1. Click "Skip (Use Default)" button
2. **Expected:** Modal closes, main menu appears
3. **Expected:** Top-right indicator shows "Using Default Charges" (yellow border)
4. Reload page (F5)
5. **Expected:** Modal appears again (if not checked "Don't ask again")

### 4. Test "Don't Ask Again"
1. Reload page (F5)
2. Check "Don't ask again" checkbox
3. Click "Skip (Use Default)"
4. Reload page (F5)
5. **Expected:** Modal does NOT appear
6. **Expected:** Can still access via Settings

### 5. Test Settings Menu
1. From main menu, click "SETTINGS" button
2. **Expected:** Settings modal opens
3. Verify contents:
   - Title: "Settings"
   - Current status display
   - API key input field (password masked)
   - Security notice
   - Four buttons: Save, Test, Remove, Close
4. Click "Close" button
5. **Expected:** Modal closes, back to main menu

### 6. Test API Key Input (Without Actual Key)
1. Open Settings
2. Type "test123" in API key field
3. Click "Save API Key"
4. **Expected:** Success message appears
5. **Expected:** Status changes to "Using AI-Generated Charges" (cyan)
6. **Expected:** Top-right indicator updates to "AI-Generated Charges Active" (cyan)

### 7. Test API Key Removal
1. In Settings, click "Remove Key"
2. **Expected:** Success message "API key removed"
3. **Expected:** Status changes back to "Using Default Charges" (yellow)
4. **Expected:** Top-right indicator updates

### 8. Test API Key Validation (Optional - Requires Real Key)
**Note:** Skip this if you don't have a Gemini API key

1. Get free API key from https://makersuite.google.com/app/apikey
2. Open Settings
3. Paste API key in field
4. Click "Test API Key"
5. **Expected:** "Testing API key..." message
6. **Expected:** After 1-2 seconds, success or error message
7. If valid: Green box "API key is valid and working!"
8. If invalid: Red box with error message

### 9. Test AI Charge Generation (Requires Valid API Key)
**Note:** Only works with valid Gemini API key

1. Ensure valid API key is saved
2. Start New Game
3. Create character
4. Drive car (WASD keys)
5. Wait for police to spawn
6. Press SPACE to pull over
7. **Expected:** Message "Judge Hardcastle is consulting the AI legal database..."
8. **Expected:** After 2-3 seconds, courtroom appears
9. **Expected:** Charges list shows AI-generated charges
10. Verify charges are creative and contextual

### 10. Test Fallback to Defaults
1. Remove API key in Settings
2. Start New Game or continue existing
3. Get arrested (drive and press SPACE)
4. **Expected:** No AI database message
5. **Expected:** Default scripted charges appear
6. **Expected:** Game continues normally

### 11. Test SessionStorage Persistence
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Find sessionStorage
4. **Expected:** See `gemini_api_key` entry (if key saved)
5. Close browser tab
6. Reopen game
7. **Expected:** API key is gone (must re-enter)

### 12. Test LocalStorage Usage
1. Open DevTools (F12)
2. Go to Application/Storage → localStorage
3. Check "Don't ask again" and skip modal
4. **Expected:** See `skip_api_prompt: "true"` in localStorage
5. **Expected:** NO API key in localStorage
6. Close and reopen browser
7. **Expected:** Modal doesn't appear (preference persisted)

## Visual Verification

### AI Indicator States
**Test:** Verify indicator appears in top-right corner

**With API Key:**
```
┌──────────────────────────────────────┐
│ AI-Generated Charges Active          │
│ (cyan border, cyan text)             │
└──────────────────────────────────────┘
```

**Without API Key:**
```
┌──────────────────────────────────────┐
│ Using Default Charges                │
│ (yellow border, yellow text)         │
└──────────────────────────────────────┘
```

## Security Verification

### 1. Password Masking
- Enter text in API key fields
- Verify characters show as dots (•••)
- Verify not visible in plaintext

### 2. SessionStorage Only
1. Open DevTools → Application → Storage
2. Save API key
3. **Verify:** Key in sessionStorage
4. **Verify:** Key NOT in localStorage
5. Close tab/browser
6. Reopen and check storage
7. **Verify:** Key is gone

### 3. Network Inspection
1. Open DevTools → Network tab
2. Save valid API key
3. Get arrested to trigger AI generation
4. Filter for "googleapis.com"
5. **Verify:** Only requests to generativelanguage.googleapis.com
6. **Verify:** No requests to other domains with key
7. Click request to inspect
8. **Verify:** Request uses HTTPS
9. **Verify:** Response doesn't contain key

### 4. Privacy Notice Visibility
- Initial modal shows privacy notice
- Settings modal shows security information
- Both clearly state sessionStorage usage
- Both clearly state Google-only transmission

## Error Handling Tests

### 1. Empty Key Submission
1. Leave API key field empty
2. Click "Use API Key" or "Save API Key"
3. **Expected:** Error message "Please enter an API key"

### 2. Invalid Key Testing
1. Enter invalid key "abc123"
2. Click "Test API Key"
3. **Expected:** Red error box with message
4. Game continues to function

### 3. Network Failure Simulation
1. Disconnect internet
2. Try to test API key
3. **Expected:** Network error message
4. Reconnect internet
5. Start new game with saved key
6. Get arrested
7. **Expected:** Falls back to default charges silently

### 4. AI Generation Timeout
- Difficult to test without slow network
- Game should fall back to defaults after timeout

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

Verify:
- Modal displays correctly
- Password masking works
- sessionStorage functions
- Buttons respond to clicks
- AI indicator visible

## Mobile Compatibility

If testing on mobile:
- [ ] Modal fits on small screen
- [ ] Buttons are tap-friendly
- [ ] Input fields zoom properly
- [ ] Link opens in new tab
- [ ] Checkbox is tappable

## Performance Tests

### 1. Game Loading
- [ ] Modal doesn't block game initialization
- [ ] 3D scene loads behind modal
- [ ] 1-second delay before modal appears

### 2. AI Generation Performance
- [ ] AI request doesn't freeze game
- [ ] Message appears immediately
- [ ] Fallback works if timeout
- [ ] Courtroom displays without delay

### 3. Settings Responsiveness
- [ ] Settings modal opens instantly
- [ ] Test button shows immediate feedback
- [ ] Status updates in real-time

## Regression Tests

Verify existing features still work:
- [ ] Main menu buttons
- [ ] Character creation
- [ ] Driving mechanics
- [ ] Police chase
- [ ] Courtroom forms
- [ ] Prison activities
- [ ] Credits screen
- [ ] Save/load game

## Known Limitations

1. **Browser extensions:** Can read sessionStorage
2. **Network tab:** Key visible in DevTools Network tab (HTTPS encrypted)
3. **No key rotation:** User must manually update key
4. **No quota monitoring:** User must check Google Console
5. **Tab-specific:** Key doesn't sync across tabs

## Common Issues

### Modal Doesn't Appear
- Check console for JavaScript errors
- Verify 1-second delay has passed
- Check if "don't ask again" was set (clear localStorage)

### API Key Doesn't Save
- Check console for errors
- Verify sessionStorage is enabled in browser
- Try different browser

### Test Key Fails
- Verify key is from https://makersuite.google.com/app/apikey
- Check key has no extra spaces
- Verify internet connection
- Check Google Console for API status

### AI Charges Don't Generate
- Verify key is saved (check sessionStorage)
- Check Network tab for API calls
- Verify no CORS errors in console
- Test key using "Test API Key" button

### Indicator Doesn't Update
- Refresh page
- Check console for errors
- Verify updateAIStatus() is called

## Success Criteria

All tests pass if:
- [x] Modal appears on first load
- [x] Skip button works
- [x] "Don't ask again" persists
- [x] Settings accessible from menu
- [x] API key saves to sessionStorage
- [x] API key cleared on browser close
- [x] Password masking active
- [x] Test button validates key
- [x] Remove button clears key
- [x] AI indicator updates correctly
- [x] AI charges generate (with valid key)
- [x] Fallback to defaults works
- [x] No localStorage key storage
- [x] Privacy notices visible
- [x] No console errors
- [x] Existing features work
- [x] Game never breaks

## Debugging

### Enable Console Logging (Temporary)
If you need to debug, add temporary logs:

```javascript
// In game.js, add to ApiKeyManager methods:
console.log('API Key present:', this.hasApiKey());
console.log('Should skip prompt:', this.shouldSkipPrompt());
```

**Remember to remove before production!**

### Check Storage Directly
In browser console:
```javascript
// Check sessionStorage
console.log(sessionStorage.getItem('gemini_api_key'));

// Check localStorage
console.log(localStorage.getItem('skip_api_prompt'));

// Clear storage
sessionStorage.clear();
localStorage.clear();
```

## Report Issues

If you find bugs:
1. Note browser and version
2. Describe steps to reproduce
3. Check console for errors
4. Screenshot if visual issue
5. Note any error messages
