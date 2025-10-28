# Implementation Tasks: Chrome Extension

## 1. Project Scaffolding
- [ ] 1.1 Create `chrome-extension/` directory structure
- [ ] 1.2 Initialize `chrome-extension/package.json` with dev dependencies (webpack, ts-loader, copy-webpack-plugin)
- [ ] 1.3 Create `chrome-extension/.gitignore` (ignore `dist/`, `node_modules/`)
- [ ] 1.4 Update root `.gitignore` to exclude `/chrome-extension/dist/` and `/chrome-extension/node_modules/`
- [ ] 1.5 Create `chrome-extension/src/assets/` directory with placeholder icons (48x48, 128x128 PNG)

## 2. Webpack Build Configuration
- [ ] 2.1 Create `chrome-extension/webpack.config.js` with entry points for background, offscreen, options
- [ ] 2.2 Configure Webpack alias: `@sip` → `path.resolve(__dirname, '../src')`
- [ ] 2.3 Add TypeScript loader (ts-loader) for transpiling SIP.js source
- [ ] 2.4 Configure CopyWebpackPlugin to copy manifest.json, HTML files, and assets to `dist/`
- [ ] 2.5 Set Webpack output directory to `chrome-extension/dist/`
- [ ] 2.6 Configure devServer to write files to disk (not memory-only)
- [ ] 2.7 Configure source maps: `devtool: 'eval-source-map'` for dev, `'source-map'` for production
- [ ] 2.8 Add npm scripts: `"dev": "webpack --watch --mode development"`, `"build": "webpack --mode production"`

## 3. Manifest V3 Configuration
- [ ] 3.1 Create `chrome-extension/src/manifest.json` with Manifest V3 structure
- [ ] 3.2 Define `background.service_worker` pointing to `background.js`
- [ ] 3.3 Specify permissions: `["storage", "alarms", "offscreen"]` (no notifications for headless)
- [ ] 3.4 Add `host_permissions`: `["wss://*/*"]` (wildcard for any FreeSWITCH server)
- [ ] 3.5 Define `options_page` pointing to `options.html`
- [ ] 3.6 Add icons: `{ "48": "assets/icon48.png", "128": "assets/icon128.png" }`
- [ ] 3.7 Set `manifest_version: 3`, name, version, description

## 4. Background Script (Service Worker)
- [ ] 4.1 Create `chrome-extension/src/background.js`
- [ ] 4.2 Implement `chrome.runtime.onInstalled` listener to open options page on install
- [ ] 4.3 Create periodic alarm using `chrome.alarms.create()` (every 20 seconds) for keep-alive
- [ ] 4.4 Implement `chrome.alarms.onAlarm` listener with console.log (prevents termination)
- [ ] 4.5 Implement `ensureOffscreenDocument()` function to create offscreen if not exists
- [ ] 4.6 Add `chrome.offscreen.createDocument()` call with reason `AUDIO_PLAYBACK`
- [ ] 4.7 Add console logging for lifecycle events (installed, alarm fired, offscreen created)
- [ ] 4.8 Test: Load extension and verify Service Worker stays alive

## 5. Offscreen HTML Document
- [ ] 5.1 Create `chrome-extension/src/offscreen.html` with minimal HTML structure
- [ ] 5.2 Add `<audio id="remoteAudio" autoplay></audio>` element
- [ ] 5.3 Include `<script src="offscreen-ua.js"></script>` at end of body
- [ ] 5.4 Add basic styling (optional, minimal)

## 6. Offscreen SIP UA Implementation
- [ ] 6.1 Create `chrome-extension/src/offscreen-ua.js`
- [ ] 6.2 Import SIP.js using `import { UserAgent, Web, BroadSoft } from '@sip';`
- [ ] 6.3 Implement `loadConfig()` function to read from `chrome.storage.sync`
- [ ] 6.4 Implement `initUserAgent()` to create UserAgent with WSS transport
- [ ] 6.5 Configure UserAgent delegate with `onInvite`, `onConnect`, `onDisconnect` handlers (all with console logging)
- [ ] 6.6 Implement `playRingtone()` using Web Audio API:
  - [ ] 6.6.1 Create AudioContext and OscillatorNode
  - [ ] 6.6.2 Set frequency to 440Hz (A4 note), play 200ms beep
  - [ ] 6.6.3 No audio file needed, purely code-based
- [ ] 6.7 Implement `handleInvite(invitation)` function:
  - [ ] 6.7.1 Log incoming call details to console
  - [ ] 6.7.2 Check for auto-answer using `BroadSoft.shouldAutoAnswer(invitation)`
  - [ ] 6.7.3 If auto-answer, call `BroadSoft.handleAutoAnswer(invitation, options)` and log
  - [ ] 6.7.4 If not auto-answer, play Web Audio beep, log "waiting for remote control", no manual UI
- [ ] 6.8 Implement SessionDelegate with `onNotify` handler:
  - [ ] 6.8.1 Check `BroadSoft.isBroadSoftNotification(notification)` and log result
  - [ ] 6.8.2 Call `BroadSoft.handleRemoteControlNotification(session, notification, options)` and log action
  - [ ] 6.8.3 Accept notification with `notification.accept()`
- [ ] 6.9 Implement media binding: `session.sessionDescriptionHandler.remoteMediaStream` → `<audio>` element with console log
- [ ] 6.10 Add comprehensive console logging for all SIP events (register, invite, answer, hangup, error)
- [ ] 6.11 Implement exponential backoff reconnection on disconnect:
  - [ ] 6.11.1 Track retry attempt counter
  - [ ] 6.11.2 Calculate delay: `min(60000, 1000 * Math.pow(2, attempt - 1))` milliseconds
  - [ ] 6.11.3 Log each retry attempt with delay time
  - [ ] 6.11.4 Reset counter on successful connection

## 7. Options Page UI
- [ ] 7.1 Create `chrome-extension/src/options.html` with form UI
- [ ] 7.2 Add input fields: username, password, domain, wssUrl
- [ ] 7.3 Add "Save" button and status message area
- [ ] 7.4 Include `<script src="options.js"></script>`
- [ ] 7.5 Add basic CSS for form layout

## 8. Options Page Logic
- [ ] 8.1 Create `chrome-extension/src/options.js`
- [ ] 8.2 Implement `loadOptions()` to read from `chrome.storage.sync` and populate form
- [ ] 8.3 Implement `saveOptions()` to write form values to `chrome.storage.sync`
- [ ] 8.4 Add form validation (check for empty username, valid WSS URL format starting with wss://)
- [ ] 8.5 Display success message after save: "Configuration saved. Please reload the extension."
- [ ] 8.6 Display error messages for validation failures
- [ ] 8.7 Attach event listeners to Save button and form submit
- [ ] 8.8 No runtime messaging to UA (manual reload required per design decision)

## 9. Testing & Validation
- [ ] 9.1 Run `npm install` in `chrome-extension/`
- [ ] 9.2 Run `npm run dev` and verify `dist/` is created with source maps
- [ ] 9.3 Load `chrome-extension/dist/` in Chrome (chrome://extensions, Developer mode, Load unpacked)
- [ ] 9.4 Verify extension loads without errors in console
- [ ] 9.5 Configure SIP account in options page with wss:// URL (e.g., wss://127.0.0.1:5066)
- [ ] 9.6 Verify configuration saves and shows reload instruction
- [ ] 9.7 Reload extension, check offscreen console for UA registration success log
- [ ] 9.8 Test incoming call without `Call-Info` header:
  - [ ] 9.8.1 Verify Web Audio API beep plays (440Hz, 200ms)
  - [ ] 9.8.2 Console logs "waiting for remote control"
- [ ] 9.9 Verify no browser notifications or badge updates appear (pure headless)
- [ ] 9.10 Test incoming call with `Call-Info; answer-after=0` (should auto-answer immediately, console log)
- [ ] 9.11 Test incoming call with `Call-Info; answer-after=1` (should auto-answer after 1 second, console log)
- [ ] 9.12 Test `NOTIFY (Event: talk)` during ringing (should answer, console log action)
- [ ] 9.13 Test `NOTIFY (Event: talk)` during established call (should resume from hold, console log)
- [ ] 9.14 Verify audio plays through `<audio>` element (check offscreen document)
- [ ] 9.15 Test reconnection after network interruption:
  - [ ] 9.15.1 Simulate network failure (stop FreeSWITCH or disconnect)
  - [ ] 9.15.2 Verify exponential backoff logs (1s, 2s, 4s, 8s... up to 60s)
  - [ ] 9.15.3 Restore network and verify successful reconnection
- [ ] 9.16 Verify Service Worker keep-alive (extension stays responsive after 30+ seconds idle)
- [ ] 9.17 Verify all state changes visible only in DevTools console (no visual UI)
- [ ] 9.18 Test source maps: set breakpoint in SIP.js source (`../src/`), verify it works in DevTools

## 10. Documentation
- [ ] 10.1 Create `chrome-extension/README.md` with:
  - [ ] 10.1.1 Overview and features (emphasize headless operation and console logging)
  - [ ] 10.1.2 Installation instructions (npm install, npm run dev, load in Chrome)
  - [ ] 10.1.3 Configuration examples:
    - [ ] WSS URL format: `wss://127.0.0.1:5066` or `wss://sip.example.com:7443`
    - [ ] Note on self-signed certificates in Chrome dev mode
  - [ ] 10.1.4 Development workflow (edit, rebuild, reload extension manually)
  - [ ] 10.1.5 Explicit note: "This is a pure headless extension - no notifications, badges, or popups"
  - [ ] 10.1.6 Console monitoring guide (how to access offscreen document console in DevTools)
  - [ ] 10.1.7 Testing checklist (auto-answer, remote control scenarios, all verified via console)
  - [ ] 10.1.8 Troubleshooting (common errors, Chrome DevTools usage, permission issues)
  - [ ] 10.1.9 Chrome version requirements (90+)
  - [ ] 10.1.10 FreeSWITCH configuration notes:
    - [ ] Brief WSS setup overview
    - [ ] Link to FreeSWITCH WebRTC documentation
    - [ ] BroadSoft extension activation notes (brief)
  - [ ] 10.1.11 Clarification: Config changes require manual extension reload
  - [ ] 10.1.12 Note on reconnection behavior (exponential backoff, max 60s delay)
- [ ] 10.2 Add JSDoc comments to key functions in `background.js`, `offscreen-ua.js`, `options.js`
- [ ] 10.3 Document BroadSoft extension handling in code comments
- [ ] 10.4 Add comments explaining pure headless design decisions
- [ ] 10.5 Document Web Audio API ringtone implementation in code comments

## 11. Final Verification
- [ ] 11.1 Run `openspec validate add-chrome-extension --strict` and resolve any issues
- [ ] 11.2 Verify all build artifacts are gitignored
- [ ] 11.3 Test full workflow end-to-end with FreeSWITCH
- [ ] 11.4 Confirm hot reload works (make code change, reload extension, see change)
- [ ] 11.5 Test breakpoints in SIP.js source (`../src/`) via Chrome DevTools
- [ ] 11.6 Verify no changes to SIP.js library code (`src/`, `lib/`)
- [ ] 11.7 Confirm extension works on fresh Chrome profile (no cached state)
