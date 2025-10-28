# Proposal: Headless SIP.js Chrome Extension (MV3)

## Why

The SIP.js library currently provides core SIP functionality but requires significant integration effort to create production-ready applications. Developers need a reference implementation demonstrating:

1. How to integrate SIP.js with Chrome Extension APIs (Manifest V3)
2. Proper handling of BroadSoft Access-Side extensions (auto-answer, remote control)
3. Best practices for headless SIP clients without popup UI
4. WebRTC media handling in extension contexts (offscreen documents)
5. Development workflows with hot-reload for Chrome extensions

This proposal creates a complete, isolated Chrome extension sub-project that serves as both a reference implementation and a development environment for testing SIP.js source code changes.

## What Changes

- Add new `chrome-extension/` directory as an isolated sub-project within the SIP.js repository
- Implement Chrome Manifest V3 extension with:
  - Service Worker background script for lifecycle management
  - Offscreen document for WebRTC media (audio elements)
  - Options page for SIP account configuration
  - Full integration with SIP.js source via Webpack alias
- Support BroadSoft Access-Side extensions:
  - Auto-answer via `Call-Info; answer-after` header parsing
  - Remote control via `NOTIFY (Event: talk)` handling
- Provide Webpack-based build system with:
  - Development server with hot reload
  - Source alias `@sip` pointing to `../src/`
  - Distribution output to `chrome-extension/dist/`
- Add `.gitignore` rules to exclude build artifacts
- Include comprehensive documentation and example configurations

**Note**: This is a new capability with no breaking changes to existing SIP.js library code.

## Key Design Decisions

The following clarifications define the scope and behavior:

1. **Pure Headless Operation**: Calls without auto-answer header will ring (play audio) and wait for remote control (NOTIFY Event: talk). No manual answer buttons or popups. All feedback via console logs only.

2. **Permissive Host Access**: Use wildcard `wss://*/*` host permission for flexibility. Users can configure any FreeSWITCH server in options without rebuilding the extension.

3. **No Visual UI Elements**: No browser notifications, badge updates, or popups for call state. Pure headless operation for automation and testing scenarios. All state visible only in DevTools console.

4. **Simple Configuration Flow**: Changing SIP credentials in options page requires manual extension reload. No runtime re-registration to avoid complexity with active calls.

## Impact

### Affected Specs
- **NEW**: `chrome-extension` capability (developer tooling/reference implementation)

### Affected Code
- No changes to existing SIP.js library code (`src/`, `lib/`)
- New isolated directory: `chrome-extension/`
- New root-level `.gitignore` entries for Chrome extension build artifacts

### Developer Experience
- Provides reference implementation for Chrome extension developers
- Enables direct source-level debugging of SIP.js changes
- Demonstrates proper WebRTC media handling in extension contexts
- Shows integration patterns for BroadSoft extensions

### Testing
- Manual testing via Chrome extension developer mode
- Validation against FreeSWITCH with BroadSoft extensions
- No automated test suite required (reference implementation)
