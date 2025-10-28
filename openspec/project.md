# Project Context

## Purpose

SIP.js is a JavaScript library that implements the Session Initiation Protocol (SIP) for WebRTC communications in browsers and JavaScript environments. The project provides:

- **Core SIP Protocol**: Full SIP RFC compliance for registration, call setup, and session management
- **WebRTC Integration**: Seamless integration with browser WebRTC APIs for real-time audio/video
- **Extensibility**: Support for vendor-specific extensions (e.g., BroadSoft Access-Side extensions)
- **Developer Tools**: Reference implementations and examples for common use cases

**Goals**:
- Provide a robust, standards-compliant SIP library for JavaScript
- Enable developers to build WebRTC-based communication applications
- Maintain compatibility with major SIP servers (FreeSWITCH, Asterisk, BroadWorks, etc.)
- Serve as reference implementation for SIP+WebRTC integration patterns

## Tech Stack

### Core Library
- **TypeScript 4.8+**: Primary language for library source
- **ES Modules**: Modern module system for tree-shaking support
- **Webpack 5**: Bundling for browser distributions
- **PEG.js**: Parser generator for SIP grammar

### Development & Testing
- **Karma + Jasmine**: Browser-based unit testing
- **ESLint + Prettier**: Code linting and formatting
- **API Extractor + API Documenter**: TypeScript documentation generation
- **Mock Socket**: WebSocket mocking for tests

### Build Targets
- **Library (`lib/`)**: TypeScript compiled to ES modules for npm distribution
- **Bundles (`dist/`)**: Webpack-bundled browser builds (regular + minified)
- **Demos (`demo/`)**: Example applications demonstrating library usage

## Project Conventions

### Code Style
- **ESLint Configuration**: `.eslintrc.json` enforces TypeScript best practices
- **Prettier**: `.prettierrc.json` enforces consistent formatting (2 spaces, semicolons, double quotes)
- **Naming Conventions**:
  - Classes: PascalCase (e.g., `UserAgent`, `Session`)
  - Interfaces: PascalCase (e.g., `InvitationOptions`)
  - Files: kebab-case matching class names (e.g., `user-agent.ts`)
  - Functions/methods: camelCase (e.g., `sendInvite`, `handleNotify`)

### Architecture Patterns

- **Layered Architecture**:
  - `src/core/`: Low-level SIP protocol (messages, transactions, transport)
  - `src/api/`: High-level developer-facing API (UserAgent, Session, Invitation)
  - `src/platform/web/`: Browser-specific implementations (WebRTC, WebSocket transport)
  - `src/grammar/`: PEG-generated SIP parsers

- **Delegate Pattern**: Extensibility via delegate objects (e.g., `UserAgentDelegate`, `SessionDelegate`)

- **Promise-based API**: Async operations return Promises for modern JavaScript ergonomics

- **State Machines**: Session and transaction state management follows SIP RFC state diagrams

### Testing Strategy

- **Unit Tests**: Jasmine tests in `test/` directory, run via Karma in headless Chrome
- **Integration Tests**: Manual testing against live SIP servers (FreeSWITCH, Asterisk)
- **Demo Applications**: `demo/` directory contains working examples for manual validation
- **No Coverage Requirements**: Reference implementation focus, tests validate critical paths only

### Git Workflow

- **Main Branch**: `main` branch is the primary development branch
- **Commit Messages**: Descriptive messages, no strict format enforced
- **Pull Requests**: Required for contributions, reviewed by maintainers
- **Release Process**: Semantic versioning, releases tagged in git
- **Build Artifacts**: `lib/`, `dist/` directories are gitignored (generated on release)

## Domain Context

### SIP Protocol Knowledge

- **RFC 3261**: Core SIP specification for session initiation and management
- **RFC 3264**: Offer/Answer model with SDP for media negotiation
- **RFC 3515**: SIP REFER method for call transfer
- **RFC 6665**: SIP-Specific Event Notification (NOTIFY/SUBSCRIBE)

### WebRTC Integration

- **RTCPeerConnection**: Used for media channel establishment
- **getUserMedia**: Media capture for outgoing calls
- **SDP Manipulation**: Custom modifiers for hold, mute, codec selection
- **ICE/STUN/TURN**: NAT traversal for peer-to-peer media

### BroadSoft Access-Side Extensions

SIP.js includes support for BroadSoft (Cisco BroadWorks) proprietary extensions:

1. **Auto-Answer** (`Call-Info; answer-after`):
   - Incoming INVITE includes `Call-Info: <uri>; answer-after=N` header
   - Client automatically accepts call after N seconds
   - Implementation: `src/api/broadsoft/auto-answer.ts`

2. **Remote Control** (`NOTIFY Event: talk`):
   - FreeSWITCH sends `NOTIFY` with `Event: talk` to remotely answer/resume calls
   - Empty body means "unmute" or "talk" (resume from hold or answer ringing call)
   - Implementation: `src/api/broadsoft/remote-control.ts`

### FreeSWITCH Specifics

- **WSS Transport**: FreeSWITCH supports SIP over secure WebSocket (wss://)
- **uuid_phone_event**: FreeSWITCH command to trigger remote control via NOTIFY
- **Tested Compatibility**: SIP.js regularly validated against FreeSWITCH deployments

## Important Constraints

### Browser Limitations

- **Service Workers**: No WebRTC or `<audio>` elements (requires offscreen documents in MV3 extensions)
- **Autoplay Policies**: Browsers block audio playback without user interaction
- **Permissions**: `getUserMedia` requires HTTPS and user permission prompts
- **CSP Restrictions**: Content Security Policy prevents eval() in strict environments

### SIP Protocol Constraints

- **Transport Reliability**: SIP over UDP requires retransmission; WSS is TCP-based (reliable)
- **Session Timers**: Sessions must be refreshed periodically to prevent timeout
- **DTMF Handling**: Can be sent as SIP INFO or RTP (RFC 4733)

### Library Design Constraints

- **No Dependencies**: Zero runtime dependencies for minimal bundle size
- **Browser-First**: Primary target is modern browsers, Node.js support limited
- **Backward Compatibility**: Public API stability prioritized, breaking changes avoided

## External Dependencies

### Development Dependencies

- **TypeScript Compiler**: Language transpilation
- **Webpack + Loaders**: Bundling and asset processing
- **ESLint + Plugins**: Linting toolchain
- **Karma + Jasmine**: Test framework

### Optional Runtime Dependencies

- **None**: Library has zero runtime dependencies
- SIP servers (FreeSWITCH, Asterisk, BroadWorks) are external systems, not dependencies

### Recommended SIP Servers

- **FreeSWITCH**: Open-source, excellent WebRTC support, recommended for development
- **Asterisk**: Open-source, widely deployed, requires WebRTC configuration
- **Cisco BroadWorks**: Commercial, BroadSoft extensions fully supported

## Active Changes

Current proposals under development:

- **add-chrome-extension**: Chrome Manifest V3 extension reference implementation with BroadSoft support (headless operation, direct source integration)
