# Chrome Extension Capability Specification

## ADDED Requirements

### Requirement: Project Structure
The Chrome extension SHALL be organized as an isolated sub-project within the SIP.js repository with complete separation from the core library.

#### Scenario: Directory isolation
- **WHEN** examining the repository structure
- **THEN** a `chrome-extension/` directory exists at the root level
- **AND** it contains its own `package.json`, `webpack.config.js`, and `.gitignore`
- **AND** it does not modify or depend on root-level build scripts

#### Scenario: Source code aliasing
- **WHEN** building the extension with Webpack
- **THEN** the alias `@sip` resolves to `../src/` (SIP.js source)
- **AND** changes to SIP.js source are immediately available to the extension
- **AND** TypeScript compilation for the extension uses the aliased source

#### Scenario: Build artifact exclusion
- **WHEN** running git status after building the extension
- **THEN** the `chrome-extension/dist/` directory is ignored
- **AND** the `chrome-extension/node_modules/` directory is ignored
- **AND** no build artifacts appear in git status

### Requirement: Manifest V3 Compliance
The extension SHALL use Chrome Manifest V3 with minimal required permissions for headless operation.

#### Scenario: Required permissions
- **WHEN** examining the manifest.json
- **THEN** it requests only: `storage`, `alarms`, `offscreen`
- **AND** `host_permissions` includes `["wss://*/*"]` for any WSS server
- **AND** no broad permissions like `<all_urls>`, `tabs`, or `notifications` are requested

#### Scenario: Service Worker background
- **WHEN** the extension is loaded
- **THEN** the background script runs as a Service Worker
- **AND** it has no DOM access
- **AND** it can create offscreen documents

### Requirement: Background Script Lifecycle
The Service Worker SHALL manage extension lifecycle, keep-alive mechanisms, and offscreen document creation.

#### Scenario: Extension installation
- **WHEN** the extension is first installed
- **THEN** the options page opens automatically
- **AND** no errors appear in the console

#### Scenario: Service Worker keep-alive
- **WHEN** the Service Worker is running
- **THEN** it creates a periodic alarm (e.g., every 20 seconds)
- **AND** the alarm handler executes to prevent termination
- **AND** the Service Worker remains responsive for offscreen messaging

#### Scenario: Offscreen document creation
- **WHEN** the extension needs to initialize the SIP UA
- **THEN** the background script creates an offscreen document
- **AND** the offscreen document loads `offscreen.html`
- **AND** the reason is `AUDIO_PLAYBACK`
- **AND** creation succeeds only if no offscreen document exists

### Requirement: Offscreen Document SIP Integration
The offscreen document SHALL host the SIP UserAgent, handle WebRTC media, and process BroadSoft extensions.

#### Scenario: SIP UA initialization
- **WHEN** the offscreen document loads
- **THEN** it imports SIP.js using the `@sip` alias
- **AND** it reads configuration from `chrome.storage.sync`
- **AND** it creates a UserAgent with WSS transport
- **AND** it registers to the SIP server

#### Scenario: Audio element binding
- **WHEN** an incoming or outgoing call is established
- **THEN** the offscreen document binds remote media to an `<audio>` element
- **AND** the audio element is present in `offscreen.html`
- **AND** audio plays through the system audio output

#### Scenario: Registration success
- **WHEN** the UserAgent successfully registers
- **THEN** a console log confirms registration
- **AND** the extension is ready to receive calls

#### Scenario: Registration failure
- **WHEN** registration fails (network, credentials, etc.)
- **THEN** an error is logged to the console
- **AND** the UA attempts to reconnect automatically

### Requirement: BroadSoft Auto-Answer Support
The extension SHALL detect and handle `Call-Info; answer-after` headers for automatic call answering.

#### Scenario: Auto-answer with delay
- **WHEN** an INVITE with `Call-Info: <sip:...>; answer-after=1` is received
- **THEN** the extension waits 1 second
- **AND** automatically accepts the invitation
- **AND** logs "Auto-answering" before acceptance

#### Scenario: Immediate auto-answer
- **WHEN** an INVITE with `Call-Info: <sip:...>; answer-after=0` is received
- **THEN** the extension immediately accepts the invitation
- **AND** no delay occurs

#### Scenario: No auto-answer header
- **WHEN** an INVITE without `Call-Info; answer-after` is received
- **THEN** the extension does not auto-answer
- **AND** it rings (plays ringtone audio)
- **AND** waits for remote control via NOTIFY (Event: talk) to answer
- **AND** no manual answer button or UI is provided

### Requirement: BroadSoft Remote Control Support
The extension SHALL handle `NOTIFY (Event: talk)` messages to remotely control call state.

#### Scenario: Remote answer (talk event)
- **WHEN** a NOTIFY with `Event: talk` and empty body is received
- **AND** the session is in `Initial` state (ringing)
- **THEN** the extension accepts the invitation
- **AND** the call is answered

#### Scenario: Remote resume from hold
- **WHEN** a NOTIFY with `Event: talk` is received
- **AND** the session is in `Established` state
- **THEN** the extension sends a re-INVITE with `a=sendrecv`
- **AND** the call resumes from hold

#### Scenario: Non-BroadSoft NOTIFY
- **WHEN** a NOTIFY without `Event: talk` is received
- **THEN** the extension does not apply BroadSoft handling
- **AND** it delegates to default NOTIFY handling

### Requirement: Configuration Management
The extension SHALL provide an options page for SIP account configuration using `chrome.storage.sync` with manual reload required for changes to take effect.

#### Scenario: Options page UI
- **WHEN** the user opens the options page
- **THEN** a form displays fields for: username, password, domain, wssUrl
- **AND** existing values are loaded from `chrome.storage.sync`
- **AND** all fields are editable

#### Scenario: Save configuration
- **WHEN** the user fills the form and clicks "Save"
- **THEN** the values are written to `chrome.storage.sync`
- **AND** a success message appears instructing to reload the extension
- **AND** the configuration does not take effect until extension is manually reloaded

#### Scenario: Invalid configuration
- **WHEN** the user submits invalid data (e.g., empty username)
- **THEN** an error message appears
- **AND** the configuration is not saved
- **AND** the form remains editable

### Requirement: Build System
The extension SHALL use Webpack for building, bundling, and development workflow.

#### Scenario: Development build
- **WHEN** running `npm run dev` in `chrome-extension/`
- **THEN** Webpack starts in watch mode
- **AND** builds output to `chrome-extension/dist/`
- **AND** the dev server writes files to disk (not memory)
- **AND** changes trigger automatic rebuild

#### Scenario: Production build
- **WHEN** running `npm run build` in `chrome-extension/`
- **THEN** Webpack creates optimized bundles in `dist/`
- **AND** manifest.json and assets are copied to `dist/`
- **AND** the output is ready to load in Chrome

#### Scenario: Asset copying
- **WHEN** the build runs
- **THEN** `manifest.json` is copied to `dist/`
- **AND** `offscreen.html` and `options.html` are copied to `dist/`
- **AND** all files in `src/assets/` are copied to `dist/assets/`

### Requirement: Development Workflow
The extension SHALL support hot reload for rapid development and debugging.

#### Scenario: Load unpacked extension
- **WHEN** loading `chrome-extension/dist/` in Chrome developer mode
- **THEN** the extension installs without errors
- **AND** background script, offscreen, and options pages are accessible
- **AND** the extension appears in chrome://extensions

#### Scenario: Code change reload
- **WHEN** editing a file in `chrome-extension/src/`
- **AND** Webpack rebuilds
- **THEN** clicking "Reload" in Chrome extensions page applies changes
- **AND** the new code executes
- **AND** no manual file copying is required

#### Scenario: SIP.js source debugging
- **WHEN** setting a breakpoint in `SIP.js/src/` files
- **AND** triggering related code in the extension
- **THEN** the debugger pauses at the breakpoint
- **AND** source maps correctly map to the original TypeScript file
- **AND** variables can be inspected

### Requirement: FreeSWITCH Compatibility
The extension SHALL successfully register and operate with FreeSWITCH servers using WSS transport.

#### Scenario: WSS connection
- **WHEN** the extension connects to a FreeSWITCH WSS endpoint
- **THEN** the WebSocket handshake succeeds
- **AND** SIP REGISTER is sent over WSS
- **AND** authentication completes successfully

#### Scenario: Incoming call handling
- **WHEN** FreeSWITCH sends an INVITE to the extension
- **THEN** the extension receives the INVITE
- **AND** auto-answer is applied if `Call-Info; answer-after` is present
- **AND** media flows bidirectionally after acceptance

#### Scenario: BroadSoft extension validation
- **WHEN** FreeSWITCH sends `Call-Info; answer-after=0`
- **THEN** the call is answered immediately
- **WHEN** FreeSWITCH sends `NOTIFY (Event: talk)`
- **THEN** the extension applies the talk action (answer or resume)

### Requirement: Pure Headless Operation
The extension SHALL operate without any visual UI elements, providing state feedback only through console logs.

#### Scenario: No visual notifications
- **WHEN** the extension receives an incoming call
- **THEN** no browser notification is displayed
- **AND** no badge update appears on the extension icon
- **AND** state changes are logged to console only

#### Scenario: Console logging
- **WHEN** SIP events occur (registration, incoming call, answer, hangup)
- **THEN** descriptive messages are logged to the console
- **AND** logs include event type and relevant details
- **AND** logs are accessible via Chrome DevTools

#### Scenario: No manual UI controls
- **WHEN** a call is ringing without auto-answer
- **THEN** no popup or dialog appears
- **AND** no manual answer/reject buttons are provided
- **AND** only remote control (NOTIFY) or timeout can resolve the call

### Requirement: Documentation
The extension SHALL include comprehensive documentation for setup, usage, and development.

#### Scenario: README existence
- **WHEN** examining `chrome-extension/README.md`
- **THEN** it contains installation instructions
- **AND** configuration examples
- **AND** development workflow steps
- **AND** troubleshooting guidance
- **AND** explicit notes about headless operation and console logging

#### Scenario: Code comments
- **WHEN** reading source files
- **THEN** key functions have JSDoc comments
- **AND** BroadSoft extension handling is documented
- **AND** Chrome API usage is explained

#### Scenario: Example configuration
- **WHEN** the README provides example configuration
- **THEN** it includes sample WSS URL format (matching wss://*/* permission)
- **AND** placeholder credentials
- **AND** FreeSWITCH-specific notes
- **AND** instructions to reload extension after config changes
