# Design: Headless SIP.js Chrome Extension (MV3)

## Context

Chrome extensions using Manifest V3 have significant architectural constraints:

1. **No background pages** - Only Service Workers (no DOM, no persistent context)
2. **No audio in Service Workers** - Requires offscreen documents for `<audio>` elements
3. **No WebRTC in Service Workers** - RTCPeerConnection must run in offscreen context
4. **Limited lifecycle** - Service Workers can be terminated; need keep-alive strategies
5. **Strict CSP** - No eval, inline scripts require special handling

This extension must integrate SIP.js (designed for browser environments) while respecting these constraints. The design prioritizes:

- **Source integration**: Direct reference to `../src/` for live debugging
- **Headless operation**: No popup UI, all config via options page
- **BroadSoft support**: Auto-answer and remote control extensions
- **Developer experience**: Hot reload, clear error messaging, minimal setup

## Goals / Non-Goals

### Goals
1. Provide reference implementation for Chrome extension + SIP.js integration
2. Enable direct debugging of SIP.js source code changes
3. Demonstrate proper handling of BroadSoft Access-Side extensions
4. Support development workflow with hot reload
5. Maintain complete isolation from main SIP.js library

### Non-Goals
1. Production-ready extension for end users (reference implementation only)
2. Support for all SIP server types (focused on FreeSWITCH + BroadSoft)
3. Complex UI or call management features
4. Multi-platform support (Chrome/Edge only, no Firefox)
5. Automated testing infrastructure
6. Publishing to Chrome Web Store

## Decisions

### Decision 1: Offscreen Document Architecture

**Choice**: Use offscreen document to host SIP UA and WebRTC
**Rationale**:
- Service Workers cannot run WebRTC or `<audio>` elements
- Offscreen documents persist longer than popups
- Single offscreen document can handle all SIP operations
- Messaging between background and offscreen is straightforward

**Alternatives Considered**:
- **Content scripts**: Violates CSP on many sites, can't run on chrome:// pages
- **Popup-only**: Closes when user navigates away, poor UX
- **Tab-based**: Wastes resources, visible to user

### Decision 2: Direct Source Integration via Webpack Alias

**Choice**: Use `alias: { '@sip': path.resolve(__dirname, '../src') }` in Webpack
**Rationale**:
- Enables breakpoints in SIP.js source during extension debugging
- No build/publish cycle for SIP.js changes
- Reflects real-world development workflow
- Simplifies testing of BroadSoft features

**Alternatives Considered**:
- **npm link**: Fragile, requires global state
- **Copy source**: Stale copies, manual sync required
- **Use published package**: Defeats purpose of development environment

### Decision 3: Configuration via chrome.storage.sync

**Choice**: Store SIP credentials in `chrome.storage.sync`
**Rationale**:
- Native Chrome API, no additional dependencies
- Syncs across devices for same Google account
- Secure storage (encrypted at rest)
- Simple options page implementation

**Alternatives Considered**:
- **chrome.storage.local**: No sync, but otherwise equivalent
- **File-based config**: Requires additional permissions, poor UX
- **Hardcoded**: Unusable as reference implementation

### Decision 4: Webpack for Build System

**Choice**: Webpack with dev server writing to `dist/`
**Rationale**:
- Industry standard for Chrome extension development
- Built-in support for TypeScript transpilation
- Plugin ecosystem (copy-webpack-plugin for assets)
- Dev server can watch and rebuild on changes

**Alternatives Considered**:
- **Rollup**: Less mature Chrome extension support
- **esbuild**: Faster but less ecosystem support for extensions
- **Vite**: Excellent for web apps, but Chrome extensions need special handling

### Decision 5: Permissions Model

**Choice**: Essential permissions with wildcard WSS access
**Rationale**:
- Allows users to configure any FreeSWITCH server without rebuilding
- Simpler developer experience for reference implementation
- No visual UI means no notification permission needed

**Permissions**:
- `storage`: For SIP account configuration
- `alarms`: Keep Service Worker alive
- `offscreen`: Create offscreen document
- `host_permissions`: `["wss://*/*"]` - Allow any WSS server

**Rejected**:
- `notifications`: Not needed for pure headless operation
- `tabs`, `activeTab`: Not needed for headless operation
- `webRequest`: Too invasive, not required
- `<all_urls>`: Broader than needed (only WSS required)

### Decision 6: BroadSoft Extension Handling

**Choice**: Implement using existing `src/api/broadsoft` utilities
**Rationale**:
- Validates that existing library APIs work in extension context
- Demonstrates proper usage patterns
- Tests real-world BroadSoft scenarios (FreeSWITCH)

**Implementation**:
- Auto-answer: Check `Call-Info` header, call `BroadSoft.handleAutoAnswer()`
- Remote control: Register `SessionDelegate.onNotify`, call `BroadSoft.handleRemoteControlNotification()`
- All logic in offscreen document (has DOM access)

### Decision 7: Pure Headless Operation

**Choice**: No visual UI elements, console logs only
**Rationale**:
- Designed for automation and testing scenarios
- Simpler implementation without notification/badge management
- Developers can monitor state via DevTools console
- Fits reference implementation scope

**What This Means**:
- No browser notifications for incoming calls, hangup, etc.
- No badge icon updates on extension icon
- No popup windows or dialogs
- Calls without auto-answer will ring (audio) and wait for remote control only
- All state changes logged to console

**Rejected Alternatives**:
- **Notifications**: Adds complexity, not needed for target use case
- **Badge updates**: Requires tracking state and chrome.action API
- **Manual answer buttons**: Defeats headless purpose, adds UI code

### Decision 8: Configuration Reload Strategy

**Choice**: Require manual extension reload after config changes
**Rationale**:
- Simplest implementation - no runtime re-registration logic
- Avoids complexity of gracefully disconnecting active calls
- Clear mental model: change config → reload extension
- Acceptable for reference implementation and development workflow

**What This Means**:
- Options page saves to `chrome.storage.sync`
- User must click "Reload" in chrome://extensions for changes to take effect
- No messaging between options page and offscreen UA
- No automatic reconnection on config change

**Rejected Alternatives**:
- **Auto re-register**: Complex, must handle active calls gracefully
- **Apply on next UA lifecycle**: Unclear when changes take effect
- **Hot config reload**: Requires messaging and state synchronization

### Decision 9: Ringtone Implementation

**Choice**: Generate ringtone via Web Audio API (no audio file)
**Rationale**:
- No asset file needed, purely code-based
- Consistent cross-platform (no codec/format issues)
- Simple beep pattern distinguishes from call audio
- Fits reference implementation scope

**Implementation**:
```javascript
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
oscillator.frequency.value = 440; // A4 note
oscillator.connect(audioContext.destination);
oscillator.start();
setTimeout(() => oscillator.stop(), 200); // 200ms beep
```

**Rejected Alternatives**:
- **MP3 file**: Requires asset management, larger bundle
- **Looping audio**: Annoying in development/testing
- **No audio**: Less clear that call is incoming

### Decision 10: Reconnection Strategy

**Choice**: Exponential backoff with maximum delay
**Rationale**:
- Standard pattern for network retry logic
- Prevents server hammering after failures
- Balances responsiveness with resource usage
- Gives transient issues time to resolve

**Parameters**:
- Initial delay: 1 second
- Backoff factor: 2x
- Maximum delay: 60 seconds
- Maximum retries: Unlimited (until user intervenes)

**Algorithm**:
```
Attempt 1: immediate
Attempt 2: wait 1s
Attempt 3: wait 2s
Attempt 4: wait 4s
Attempt 5: wait 8s
...
Attempt N: wait min(60s, 2^(N-2))
```

**Rejected Alternatives**:
- **Fixed delay**: Hammers server on persistent failures
- **Limited retries**: Requires manual reload, poor UX
- **No retry**: Too fragile for reference implementation

### Decision 11: Source Maps in Production

**Choice**: Include source maps in both dev and production builds
**Rationale**:
- Reference implementation prioritizes debuggability
- Developers loading unpacked extensions need debugging tools
- Bundle size not critical for local development use
- Enables tracing issues in SIP.js source (`../src/`)

**Configuration**:
- Dev: `devtool: 'eval-source-map'` (fast rebuilds)
- Production: `devtool: 'source-map'` (external .map files)

**Rejected Alternatives**:
- **No production source maps**: Standard for web apps, but extensions are development tools
- **Inline source maps**: Bloats bundle unnecessarily

### Decision 12: FreeSWITCH Documentation Scope

**Choice**: Provide basic WSS URL examples with link to external docs
**Rationale**:
- Focus README on extension, not FreeSWITCH setup
- FreeSWITCH configuration varies by deployment
- External docs stay up-to-date, avoid maintenance burden
- Provide just enough to get started

**What to Include**:
- Example WSS URL format: `wss://127.0.0.1:5066` or `wss://sip.example.com:7443`
- Note on self-signed certificates (Chrome dev mode)
- Link to FreeSWITCH WebRTC documentation
- BroadSoft extension activation notes (brief)

**Rejected Alternatives**:
- **Detailed FS config**: Out of scope, outdates quickly
- **No guidance**: Too sparse for reference implementation
- **Only external link**: Insufficient context for new users

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Chrome Extension (chrome-extension/)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐          ┌─────────────────────────┐ │
│  │ background.js    │          │ offscreen.html          │ │
│  │ (Service Worker) │          │ offscreen-ua.js         │ │
│  │                  │          │                         │ │
│  │ - Keep alive     │          │ - SIP UA (@sip alias)  │ │
│  │ - Create offscr. │          │ - WebRTC/audio         │ │
│  │ - Console logs   │          │ - BroadSoft handling   │ │
│  └──────────────────┘          └─────────────────────────┘ │
│         │                                  │                │
│         │ chrome.storage                   │ WSS/WebRTC    │
│         ▼                                  ▼                │
│  ┌──────────────────┐          ┌─────────────────────────┐ │
│  │ options.html     │          │ FreeSWITCH Server       │ │
│  │ options.js       │          │ (BroadSoft extensions)  │ │
│  │                  │          │                         │ │
│  │ - Config UI      │          │ - Call-Info header     │ │
│  │ - Save to storage│          │ - NOTIFY talk events   │ │
│  └──────────────────┘          └─────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Webpack alias: @sip → ../src
                         ▼
              ┌─────────────────────┐
              │ SIP.js/src/         │
              │ (library source)    │
              └─────────────────────┘
```

## Risks / Trade-offs

### Risk 1: Service Worker Termination
**Issue**: Chrome terminates idle Service Workers after 30 seconds
**Mitigation**:
- Use `chrome.alarms` to create periodic wake events
- Offscreen document persists independently of background
- Accept occasional reconnection delays

### Risk 2: Offscreen Document Limits
**Issue**: Chrome may limit number of offscreen documents
**Mitigation**:
- Use single offscreen document for all SIP operations
- Lazy creation (only when needed)
- Proper cleanup on extension unload

### Risk 3: Breaking Changes in Chrome APIs
**Issue**: Manifest V3 APIs still evolving
**Mitigation**:
- Document Chrome version requirements (90+)
- Reference implementation only (not production)
- Regular testing on stable Chrome releases

### Risk 4: WebRTC Constraints in Offscreen
**Issue**: Offscreen documents have limited lifetime in future Chrome versions
**Mitigation**:
- Monitor Chrome extension API changes
- Consider migration to Persistent Service Workers when available
- Accept that this is a reference implementation with limitations

### Risk 5: Build Artifacts in Git
**Issue**: Accidentally committing `dist/` or `node_modules/`
**Mitigation**:
- Comprehensive `.gitignore` rules
- Document explicitly in README
- Consider pre-commit hooks (optional)

## Migration Plan

N/A - This is a new capability with no migration required.

## Open Questions

1. **Q**: Should we include example ringtone audio files?
   **A**: Yes, include a simple beep file for demonstration purposes.

2. **Q**: Should the extension support multiple simultaneous calls?
   **A**: No, single call only for simplicity (reference implementation).

3. **Q**: Should we include TypeScript for extension code?
   **A**: No, use plain JavaScript for lower barrier to entry. SIP.js source is already TypeScript.

4. **Q**: Should we demonstrate call recording or other advanced features?
   **A**: No, focus on core registration, auto-answer, and remote control only.

5. **Q**: Should configuration support multiple SIP accounts?
   **A**: No, single account only for simplicity.

## Implementation Notes

### File Organization
```
chrome-extension/
├── src/
│   ├── background.js         # ~100 lines (Service Worker)
│   ├── offscreen.html         # ~30 lines (minimal DOM)
│   ├── offscreen-ua.js        # ~300 lines (SIP logic)
│   ├── options.html           # ~80 lines (form)
│   ├── options.js             # ~100 lines (config handling)
│   ├── manifest.json          # ~50 lines (MV3 config)
│   └── assets/
│       ├── icon48.png
│       ├── icon128.png
│       └── ringtone.mp3
├── dist/                      # Build output (gitignored)
├── webpack.config.js          # ~150 lines
├── package.json               # ~50 lines
├── .gitignore
└── README.md
```

### Key Code Patterns

**Offscreen Creation**:
```javascript
// background.js
async function ensureOffscreenDocument() {
  const existing = await chrome.offscreen.hasDocument();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'SIP call audio'
    });
  }
}
```

**SIP UA Initialization**:
```javascript
// offscreen-ua.js
import { UserAgent, Web } from '@sip'; // Alias to ../src

const userAgent = new UserAgent({
  uri: UserAgent.makeURI(`sip:${username}@${domain}`),
  transportOptions: {
    server: wssUrl
  },
  delegate: {
    onInvite: handleInvite
  }
});
```

**BroadSoft Auto-Answer**:
```javascript
// offscreen-ua.js
import { BroadSoft } from '@sip';

function handleInvite(invitation) {
  if (BroadSoft.shouldAutoAnswer(invitation)) {
    BroadSoft.handleAutoAnswer(invitation, {
      enabled: true,
      onAfterAutoAnswer: () => console.log('Auto-answered')
    });
  }
}
```

### Development Workflow
1. Run `npm run dev` in `chrome-extension/`
2. Load `chrome-extension/dist/` in Chrome
3. Edit files in `chrome-extension/src/` or `SIP.js/src/`
4. Webpack rebuilds automatically
5. Click "Reload" in Chrome extensions page
6. Test with FreeSWITCH

### Testing Strategy
- Manual testing only (no automated tests)
- Test checklist in `tasks.md`
- Validation against FreeSWITCH + BroadSoft extensions
- Chrome DevTools for debugging
