# API Key System - Security Documentation

## Security Overview
This document details all security measures implemented for the Gemini API key input system in VROOM VROOM.

## Storage Security

### sessionStorage (API Key Storage)
- **What:** The actual API key is stored in browser sessionStorage
- **Why:** sessionStorage is automatically cleared when the browser tab/window closes
- **Lifetime:** Only exists during the current browser session
- **Scope:** Isolated to the current tab (not shared across tabs)
- **Accessibility:** JavaScript only (not accessible via server-side code)
- **Persistence:** Does NOT survive browser restarts or tab closures

### localStorage (Preferences Only)
- **What:** Only the "don't ask again" preference is stored in localStorage
- **Why:** This preference should persist across sessions
- **Contains:** Boolean flag only (`skip_api_prompt: "true"` or removed)
- **Does NOT contain:** API keys, tokens, or sensitive data
- **Purpose:** User experience preference, not security-critical

## Data Transmission Security

### API Key Usage
- **Destination:** Only sent to `generativelanguage.googleapis.com`
- **Protocol:** HTTPS only (enforced by Gemini API endpoint)
- **Method:** POST with JSON body
- **Frequency:** Only when generating charges (during arrest)
- **Visibility:** Never logged, never sent to game servers
- **Third parties:** No other services receive the key

### Network Requests
```javascript
// Example of secure API call
fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* prompt data */ })
    }
);
```

**Security notes:**
- Key transmitted in HTTPS URL parameter (encrypted in transit)
- No sensitive player data sent (only game context: speed, time, arrest count)
- API response does not expose key
- Failed requests don't retry with key logging

## Input Security

### Password Masking
```html
<input type="password" id="apiKeyInput" class="modal-input"
       placeholder="Enter your Gemini API key (optional)">
```

**Benefits:**
- Visual privacy (characters replaced with dots)
- Prevents shoulder surfing
- Standard browser security for password fields
- Screen capture protection on some browsers

### Input Validation
- Trim whitespace from both ends
- Check for empty strings
- No injection prevention needed (key only sent to Google, not executed)
- No XSS risk (key not rendered in HTML)

## Code Security

### No Logging
```javascript
// SECURE - No console.log of API key
const key = this.getApiKey();
if (key) {
    // Use key directly, never log it
    await fetch(apiUrl + key, ...);
}

// NEVER do this:
// console.log('API Key:', key); ❌
```

### No Storage in Variables
- Key retrieved from sessionStorage when needed
- Not stored in class properties
- Not passed around unnecessarily
- Minimal time in memory

### Secure Fallback
```javascript
// If AI generation fails, fall back to defaults
if (!charges) {
    charges = this.judge.generateCharges({...});
}
```

**Benefits:**
- Game never breaks if API key is invalid
- No error messages that expose key validation
- Silent fallback maintains game flow
- User doesn't need to fix key immediately

## User Privacy

### What We Collect
- **Nothing:** We don't collect any data server-side
- **No analytics:** No tracking of API key usage
- **No telemetry:** No reporting of API success/failure
- **No accounts:** No user registration or profiles

### What Google Collects
- **API usage:** Google logs API calls for their billing/quota
- **Request content:** Google sees the prompts we send (game context)
- **Response content:** Google generates and logs responses
- **User responsibility:** Users should read Google's privacy policy

### Privacy Notices
Two clear notices are shown to users:

**Initial Modal:**
> "Your API key stays in your browser session only. It is never sent to any server except Google's Gemini API. The key is cleared when you close your browser."

**Settings Modal:**
> "Security:
> - Stored in sessionStorage only (cleared on browser close)
> - Never sent to any server except Google's Gemini API
> - No tracking or logging of your key"

## Attack Vector Analysis

### XSS (Cross-Site Scripting)
- **Risk:** Low - Key not rendered in HTML
- **Mitigation:** Input not used in innerHTML, only in API calls
- **Status:** Protected

### CSRF (Cross-Site Request Forgery)
- **Risk:** Not applicable - No server-side operations
- **Mitigation:** All operations client-side only
- **Status:** Not applicable

### Man-in-the-Middle
- **Risk:** Mitigated by HTTPS
- **Mitigation:** Google's API requires HTTPS
- **Status:** Protected by TLS

### Local Storage Theft
- **Risk:** Low - Key in sessionStorage (cleared on close)
- **Mitigation:** sessionStorage isolated per-tab
- **Status:** Limited exposure window

### Browser Extension Access
- **Risk:** Medium - Extensions can read sessionStorage
- **Mitigation:** User responsibility to trust extensions
- **Status:** Standard web app limitation

### Physical Access
- **Risk:** Low - Key masked, session-only
- **Mitigation:** Password field, auto-clear on tab close
- **Status:** Reasonable protection

## Compliance Considerations

### GDPR (General Data Protection Regulation)
- **Personal data:** API key is user-controlled, not collected
- **Right to erasure:** Automatic (cleared on browser close)
- **Data portability:** Not applicable (no server storage)
- **Consent:** Clear opt-in with skip option
- **Status:** Compliant (no data controller role)

### CCPA (California Consumer Privacy Act)
- **Sale of data:** No data sold (no data collected)
- **Do Not Track:** No tracking implemented
- **Status:** Compliant (no data collected)

## Best Practices Implemented

1. **Principle of Least Privilege**
   - Key only used where needed
   - No global variables
   - No unnecessary sharing

2. **Defense in Depth**
   - Multiple security layers
   - Fallback mechanisms
   - Error handling

3. **Secure by Default**
   - Optional feature (defaults to secure mode)
   - Clear opt-in required
   - No pre-filled keys

4. **Transparency**
   - Clear privacy notices
   - Honest about data flow
   - Link to API key management

5. **User Control**
   - Easy to add/remove key
   - Test before saving
   - "Don't ask again" option

## Testing Security

### Manual Security Tests
1. **Storage test:** Verify key in sessionStorage, not localStorage
2. **Clear test:** Close browser, verify key cleared
3. **Tab test:** Verify key not shared across tabs
4. **Network test:** Inspect DevTools, verify only Google API calls
5. **Mask test:** Verify password masking in input fields
6. **Fallback test:** Remove key mid-game, verify graceful fallback

### Automated Security Checks
```javascript
// Verify sessionStorage usage
console.assert(sessionStorage.getItem('gemini_api_key') !== null,
    'Key should be in sessionStorage');
console.assert(localStorage.getItem('gemini_api_key') === null,
    'Key should NOT be in localStorage');
```

## Security Warnings to Users

### When to Display Warnings
- Never share API key with others
- Use API keys only from trusted sources (Google)
- Be aware of browser extensions reading sessionStorage
- Check Google Cloud Console for unexpected usage
- Regenerate key if compromised

### Not Implemented (User Responsibility)
- Key rotation schedules
- Usage monitoring
- Quota alerts
- Cost tracking

These are Google Cloud Console features, not game features.

## Incident Response Plan

### If Key is Compromised
1. User should immediately:
   - Go to https://makersuite.google.com/app/apikey
   - Delete compromised key
   - Generate new key
   - Update game settings with new key

2. Game should:
   - Continue to function with defaults
   - Not expose key in error messages
   - Not log key in console

### If API is Unavailable
1. Game behavior:
   - Silent fallback to defaults
   - No error alerts to user
   - Continue gameplay seamlessly

2. User experience:
   - Doesn't notice outage
   - Can test key in settings to diagnose
   - Can remove/re-add key to retry

## Security Audit Checklist

- [x] API key stored in sessionStorage only
- [x] No localStorage storage of key
- [x] Input fields use type="password"
- [x] No console.log of API key
- [x] No server-side transmission (except to Google)
- [x] HTTPS enforced by API endpoint
- [x] Clear privacy notices shown
- [x] User consent required (opt-in)
- [x] Easy key removal
- [x] Graceful fallback on failure
- [x] No XSS vulnerabilities
- [x] No CSRF vulnerabilities
- [x] No key in HTML/DOM
- [x] No key in URL (except HTTPS API calls)
- [x] No key in error messages
- [x] Test function validates key
- [x] Clear documentation provided
- [x] User control over data
- [x] Transparent data handling
- [x] Minimal data retention

## Conclusion

The API key system implements industry-standard security practices for client-side API key management:

**Strengths:**
- Short-lived storage (session only)
- User control
- Clear privacy notices
- No unnecessary data collection
- Graceful fallbacks
- Transparent implementation

**Limitations:**
- Browser extensions can access sessionStorage
- Key visible in Network tab during API calls (HTTPS protected)
- No server-side validation/rotation
- User responsible for key management

**Overall Assessment:**
Appropriate security for an optional, client-side enhancement feature. Users maintain full control over their API keys with minimal exposure risk.
